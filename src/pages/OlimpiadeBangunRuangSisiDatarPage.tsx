import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { pembahasanDasar, pembahasanOlimpiade } from "@/data/bangunRuangSisiDatarPembahasan";
import olimpiadeImg12 from "@assets/12_1777272725475.png";
import olimpiadeImg14 from "@assets/14_1777272725476.png";
import olimpiadeImg16 from "@assets/16_1777272725476.png";
import olimpiadeImg20 from "@assets/20_1777272725477.png";
import olimpiadeImg21 from "@assets/21_1777272725477.png";
import olimpiadeImg22 from "@assets/22_1777272725478.png";

const M = ({ math }: { math: string }) => <InlineMath math={math} />;

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return <span key={index}>{part}</span>;
  });
};

/* ─────────────────────────────────────────────────────────
   CSS KEYFRAMES (injected via style tag)
───────────────────────────────────────────────────────── */
const ShapeStyles = () => (
  <style>{`
    @keyframes rotateCube {
      0%   { transform: rotateX(-18deg) rotateY(0deg); }
      100% { transform: rotateX(-18deg) rotateY(360deg); }
    }
    @keyframes rotateBalok {
      0%   { transform: rotateX(-18deg) rotateY(0deg); }
      100% { transform: rotateX(-18deg) rotateY(360deg); }
    }
    @keyframes rotateSVG {
      0%   { transform: rotateY(-25deg); }
      50%  { transform: rotateY(25deg); }
      100% { transform: rotateY(-25deg); }
    }
    .shape-rotate-cube { animation: rotateCube 9s linear infinite; transform-style: preserve-3d; }
    .shape-rotate-balok { animation: rotateBalok 10s linear infinite; transform-style: preserve-3d; }
    .shape-rotate-svg { animation: rotateSVG 6s ease-in-out infinite; }
    .face-3d { position: absolute; }
  `}</style>
);

/* ─────────────────────────────────────────────────────────
   3D ANIMATED SHAPE COMPONENTS
───────────────────────────────────────────────────────── */

const KubusShape3D = () => {
  const s = 90;
  const faceBase: React.CSSProperties = { position: 'absolute', width: s, height: s, border: '2px solid rgba(165,180,252,0.7)' };
  return (
    <div style={{ perspective: 380, width: 160, height: 160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="shape-rotate-cube" style={{ width: s, height: s, position: 'relative' }}>
        <div style={{ ...faceBase, background: 'rgba(99,102,241,0.55)', transform: `translateZ(${s / 2}px)` }} />
        <div style={{ ...faceBase, background: 'rgba(79,70,229,0.35)', transform: `rotateY(180deg) translateZ(${s / 2}px)` }} />
        <div style={{ ...faceBase, background: 'rgba(139,92,246,0.55)', transform: `rotateX(90deg) translateZ(${s / 2}px)` }} />
        <div style={{ ...faceBase, background: 'rgba(109,40,217,0.35)', transform: `rotateX(-90deg) translateZ(${s / 2}px)` }} />
        <div style={{ ...faceBase, background: 'rgba(67,56,202,0.55)', transform: `rotateY(90deg) translateZ(${s / 2}px)` }} />
        <div style={{ ...faceBase, background: 'rgba(67,56,202,0.35)', transform: `rotateY(-90deg) translateZ(${s / 2}px)` }} />
      </div>
    </div>
  );
};

const BalokShape3D = () => {
  const p = 110, t = 70, l = 80;
  const frontBack: React.CSSProperties = { position: 'absolute', width: p, height: t, border: '2px solid rgba(52,211,153,0.7)' };
  const leftRight: React.CSSProperties = { position: 'absolute', width: l, height: t, border: '2px solid rgba(52,211,153,0.7)' };
  const topBot: React.CSSProperties = { position: 'absolute', width: p, height: l, border: '2px solid rgba(52,211,153,0.7)' };
  return (
    <div style={{ perspective: 420, width: 180, height: 150, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="shape-rotate-balok" style={{ width: p, height: t, position: 'relative', marginTop: 20 }}>
        <div style={{ ...frontBack, background: 'rgba(16,185,129,0.50)', transform: `translateZ(${l / 2}px)` }} />
        <div style={{ ...frontBack, background: 'rgba(5,150,105,0.30)', transform: `rotateY(180deg) translateZ(${l / 2}px)` }} />
        <div style={{ ...topBot, background: 'rgba(52,211,153,0.50)', transform: `rotateX(90deg) translateZ(${t / 2}px)` }} />
        <div style={{ ...topBot, background: 'rgba(6,95,70,0.30)', transform: `rotateX(-90deg) translateZ(${t / 2}px)` }} />
        <div style={{ ...leftRight, background: 'rgba(4,120,87,0.50)', left: p, transform: `translateX(-${l}px) rotateY(90deg) translateZ(${l / 2}px)` }} />
        <div style={{ ...leftRight, background: 'rgba(4,120,87,0.30)', transform: `rotateY(-90deg) translateZ(${l / 2}px)` }} />
      </div>
    </div>
  );
};

const PrismaShape3D = () => (
  <div className="shape-rotate-svg" style={{ width: 160, margin: '0 auto' }}>
    <svg viewBox="0 0 200 200" className="w-full max-w-[160px] mx-auto drop-shadow-lg">
      <defs>
        <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="pg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="pg3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Front triangle face */}
      <polygon points="100,20 170,150 30,150" fill="url(#pg1)" stroke="#fbbf24" strokeWidth="2" />
      {/* Back triangle face (top/behind) */}
      <polygon points="130,40 195,160 65,160" fill="url(#pg3)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,2" />
      {/* Left rectangular side */}
      <polygon points="30,150 100,20 130,40 65,160" fill="url(#pg2)" stroke="#fbbf24" strokeWidth="1.5" />
      {/* Right rectangular side */}
      <polygon points="170,150 100,20 130,40 195,160" fill="url(#pg3)" stroke="#fbbf24" strokeWidth="1.5" />
      {/* Bottom rectangular face */}
      <polygon points="30,150 170,150 195,160 65,160" fill="rgba(251,191,36,0.25)" stroke="#f59e0b" strokeWidth="1.5" />
      {/* Edges highlight */}
      <line x1="100" y1="20" x2="130" y2="40" stroke="#fde68a" strokeWidth="1.5" strokeDasharray="4,2" />
      {/* Labels */}
      <text x="82" y="110" fill="#fde68a" fontSize="11" fontWeight="bold" fontFamily="sans-serif">sisi</text>
      <text x="82" y="125" fill="#fde68a" fontSize="11" fontFamily="sans-serif">tegak</text>
      <text x="85" y="170" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="sans-serif">alas △</text>
    </svg>
  </div>
);

const LimasShape3D = () => (
  <div className="shape-rotate-svg" style={{ width: 160, margin: '0 auto' }}>
    <svg viewBox="0 0 200 210" className="w-full max-w-[160px] mx-auto drop-shadow-lg">
      <defs>
        <linearGradient id="lp1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.70" />
          <stop offset="100%" stopColor="#be185d" stopOpacity="0.40" />
        </linearGradient>
        <linearGradient id="lp2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.60" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="lp3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0.30" />
        </linearGradient>
        <linearGradient id="lp4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {/* Apex */}
      {/* Base square (isometric) */}
      <polygon points="50,145 150,145 175,165 30,165" fill="rgba(236,72,153,0.20)" stroke="#f472b6" strokeWidth="1.5" />
      {/* Front-left triangular face */}
      <polygon points="100,25 50,145 150,145" fill="url(#lp1)" stroke="#ec4899" strokeWidth="2" />
      {/* Front-right triangular face */}
      <polygon points="100,25 150,145 175,165" fill="url(#lp2)" stroke="#f472b6" strokeWidth="1.5" />
      {/* Back-left triangular face */}
      <polygon points="100,25 50,145 30,165" fill="url(#lp3)" stroke="#f472b6" strokeWidth="1.5" />
      {/* Back-right triangular face (dashed, barely visible) */}
      <polygon points="100,25 175,165 30,165" fill="url(#lp4)" stroke="#f9a8d4" strokeWidth="1.2" strokeDasharray="4,3" />
      {/* Apex dot */}
      <circle cx="100" cy="25" r="4" fill="#fbcfe8" />
      {/* Height line */}
      <line x1="100" y1="25" x2="100" y2="155" stroke="#fce7f3" strokeWidth="1.2" strokeDasharray="5,3" />
      {/* Labels */}
      <text x="104" y="90" fill="#fbcfe8" fontSize="10" fontFamily="sans-serif">t</text>
      <text x="72" y="140" fill="#fbcfe8" fontSize="10" fontFamily="sans-serif">sisi tegak</text>
      <text x="75" y="175" fill="#f9a8d4" fontSize="10" fontWeight="bold" fontFamily="sans-serif">alas □</text>
      <text x="93" y="18" fill="#fce7f3" fontSize="10" fontWeight="bold" fontFamily="sans-serif">T</text>
    </svg>
  </div>
);

/* ─────────────────────────────────────────────────────────
   REUSABLE CONTENT BLOCKS
───────────────────────────────────────────────────────── */

const DefBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-xl px-4 py-3 mb-4 font-body text-sm text-white/90 leading-relaxed">
    <span className="text-indigo-300 font-bold text-xs uppercase tracking-wider block mb-1">📌 Definisi</span>
    {children}
  </div>
);

const UnsurGrid = ({ items }: { items: { label: string; value: React.ReactNode; color?: string }[] }) => (
  <div className="mb-4">
    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 font-body">🔹 Unsur-Unsur</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {items.map((item, i) => (
        <div key={i} className={`rounded-lg px-3 py-2 border ${item.color ?? 'bg-white/5 border-white/10'}`}>
          <span className="text-xs font-bold text-white/70 font-body">{item.label}: </span>
          <span className="text-xs text-white/80 font-body">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const FormulaCards = ({ items }: { items: { label: string; formula: React.ReactNode; color: string }[] }) => (
  <div className="mb-4">
    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 font-body">📐 Rumus</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {items.map((item, i) => (
        <div key={i} className={`rounded-xl px-4 py-3 border text-center ${item.color}`}>
          <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1 font-body">{item.label}</p>
          <div className="text-sm font-bold text-white font-body">{item.formula}</div>
        </div>
      ))}
    </div>
  </div>
);

const Rangkuman = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/20 border border-yellow-500/30 rounded-xl px-4 py-3 font-body text-xs text-yellow-100/80 leading-relaxed">
    <span className="text-yellow-300 font-bold text-xs uppercase tracking-wider block mb-2">⭐ Rangkuman</span>
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────
   MATERI SECTIONS
───────────────────────────────────────────────────────── */

type MateriSection = { heading: string; shape: React.ReactNode; content: React.ReactNode; color: string; border: string };

const materiSections: MateriSection[] = [
  {
    heading: "A. Kubus",
    color: "from-indigo-900/40 to-violet-900/30",
    border: "border-indigo-500/30",
    shape: <KubusShape3D />,
    content: (
      <div className="space-y-3">
        <DefBox>
          <b>Kubus</b> adalah bangun ruang tiga dimensi yang dibentuk oleh <b>6 buah sisi berbentuk persegi yang kongruen</b> dengan semua rusuknya sama panjang. Kubus disebut juga <em>heksahedron beraturan</em>.
        </DefBox>

        <UnsurGrid items={[
          { label: "Sisi / Bidang", value: "6 buah (semua berbentuk persegi)", color: "bg-indigo-500/10 border-indigo-400/20" },
          { label: "Rusuk", value: "12 buah (semua sama panjang = r)", color: "bg-violet-500/10 border-violet-400/20" },
          { label: "Titik Sudut", value: "8 buah", color: "bg-purple-500/10 border-purple-400/20" },
          { label: "Diagonal Bidang", value: <span>12 buah, panjang = <M math="r\sqrt{2}" /></span>, color: "bg-fuchsia-500/10 border-fuchsia-400/20" },
          { label: "Diagonal Ruang", value: <span>4 buah, panjang = <M math="r\sqrt{3}" /></span>, color: "bg-pink-500/10 border-pink-400/20" },
          { label: "Bidang Diagonal", value: <span>6 buah, luas = <M math="r^2\sqrt{2}" /></span>, color: "bg-rose-500/10 border-rose-400/20" },
        ]} />

        <FormulaCards items={[
          { label: "Luas Permukaan", formula: <M math="L = 6r^2" />, color: "bg-indigo-900/40 border-indigo-400/30" },
          { label: "Volume", formula: <M math="V = r^3" />, color: "bg-violet-900/40 border-violet-400/30" },
          { label: "Diagonal Bidang", formula: <M math="d_b = r\sqrt{2}" />, color: "bg-purple-900/40 border-purple-400/30" },
          { label: "Diagonal Ruang", formula: <M math="d_r = r\sqrt{3}" />, color: "bg-fuchsia-900/40 border-fuchsia-400/30" },
        ]} />

        <Rangkuman>
          <ul className="space-y-1 list-none">
            <li>✦ Kubus = balok istimewa dengan p = l = t = r (semua rusuk sama)</li>
            <li>✦ Jumlah panjang semua rusuk = 12r</li>
            <li>✦ Jaring-jaring kubus: ada <b>11 jenis</b> jaring-jaring berbeda yang bisa membentuk kubus</li>
            <li>✦ Simetri: kubus memiliki 48 simetri rotasi dan 3 sumbu simetri utama</li>
          </ul>
        </Rangkuman>
      </div>
    ),
  },
  {
    heading: "B. Balok",
    color: "from-emerald-900/40 to-teal-900/30",
    border: "border-emerald-500/30",
    shape: <BalokShape3D />,
    content: (
      <div className="space-y-3">
        <DefBox>
          <b>Balok</b> adalah bangun ruang tiga dimensi yang dibentuk oleh <b>3 pasang persegi panjang yang saling berhadapan dan kongruen</b>, dengan panjang (p), lebar (l), dan tinggi (t).
        </DefBox>

        <UnsurGrid items={[
          { label: "Sisi", value: "6 buah (3 pasang persegi panjang berbeda)", color: "bg-emerald-500/10 border-emerald-400/20" },
          { label: "Rusuk", value: "12 buah (4p + 4l + 4t)", color: "bg-teal-500/10 border-teal-400/20" },
          { label: "Titik Sudut", value: "8 buah", color: "bg-green-500/10 border-green-400/20" },
          { label: "Diagonal Bidang ABCD/EFGH", value: <M math="\sqrt{p^2+l^2}" />, color: "bg-cyan-500/10 border-cyan-400/20" },
          { label: "Diagonal Bidang BCGF/ADHE", value: <M math="\sqrt{l^2+t^2}" />, color: "bg-cyan-500/10 border-cyan-400/20" },
          { label: "Diagonal Bidang ABFE/DCGH", value: <M math="\sqrt{p^2+t^2}" />, color: "bg-cyan-500/10 border-cyan-400/20" },
          { label: "Diagonal Ruang", value: <M math="\sqrt{p^2+l^2+t^2}" />, color: "bg-teal-500/10 border-teal-400/20" },
          { label: "Bidang Diagonal", value: "6 buah berbentuk persegi panjang", color: "bg-emerald-500/10 border-emerald-400/20" },
        ]} />

        <FormulaCards items={[
          { label: "Luas Permukaan", formula: <span>L = 2(<M math="pl + lt + pt" />)</span>, color: "bg-emerald-900/40 border-emerald-400/30" },
          { label: "Volume", formula: <M math="V = p \times l \times t" />, color: "bg-teal-900/40 border-teal-400/30" },
          { label: "Diagonal Ruang", formula: <M math="d = \sqrt{p^2+l^2+t^2}" />, color: "bg-green-900/40 border-green-400/30" },
          { label: "Jml Panjang Rusuk", formula: <M math="4(p+l+t)" />, color: "bg-cyan-900/40 border-cyan-400/30" },
        ]} />

        <div className="mb-3">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 font-body">🧊 Kubus-Kubus Satuan (Balok p×l×t)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: "Cat 3 sisi (sudut)", formula: "8 buah" },
              { label: "Cat 2 sisi (rusuk)", formula: "4[(p–2)+(l–2)+(t–2)]" },
              { label: "Cat 1 sisi (bidang)", formula: "2[(p–2)(l–2)+(p–2)(t–2)+(l–2)(t–2)]" },
              { label: "Tidak terkena cat", formula: "(p–2)(l–2)(t–2)" },
            ].map((item, i) => (
              <div key={i} className="bg-teal-500/10 border border-teal-400/20 rounded-lg px-3 py-2">
                <p className="text-[10px] text-teal-300 font-bold font-body">{item.label}</p>
                <p className="text-xs text-white/80 font-body font-mono">{item.formula}</p>
              </div>
            ))}
          </div>
        </div>

        <Rangkuman>
          <ul className="space-y-1">
            <li>✦ Balok adalah generalisasi kubus: jika p = l = t maka menjadi kubus</li>
            <li>✦ Jumlah panjang semua rusuk = 4(p + l + t)</li>
            <li>✦ Balok memiliki 4 diagonal ruang dengan panjang sama</li>
            <li>✦ Setiap bidang diagonal balok berbentuk persegi panjang</li>
          </ul>
        </Rangkuman>
      </div>
    ),
  },
  {
    heading: "C. Prisma",
    color: "from-amber-900/40 to-orange-900/30",
    border: "border-amber-500/30",
    shape: <PrismaShape3D />,
    content: (
      <div className="space-y-3">
        <DefBox>
          <b>Prisma</b> adalah bangun ruang yang memiliki <b>dua bidang alas yang sejajar, kongruen, dan berbentuk segi-n</b>. Sisi-sisi tegaknya berbentuk persegi panjang dan tegak lurus terhadap alas. Prisma dinamai berdasarkan bentuk alasnya.
        </DefBox>

        <UnsurGrid items={[
          { label: "Sisi / Bidang", value: "n + 2 buah", color: "bg-amber-500/10 border-amber-400/20" },
          { label: "Rusuk", value: "3n buah", color: "bg-orange-500/10 border-orange-400/20" },
          { label: "Titik Sudut", value: "2n buah", color: "bg-yellow-500/10 border-yellow-400/20" },
          { label: "Diagonal Bidang", value: "n(n–1) buah", color: "bg-amber-500/10 border-amber-400/20" },
          { label: "Diagonal Ruang", value: "n(n–3) buah", color: "bg-orange-500/10 border-orange-400/20" },
          { label: "Bidang Diagonal", value: <M math="\frac{n}{2}(n-1)" />, color: "bg-yellow-500/10 border-yellow-400/20" },
        ]} />

        <FormulaCards items={[
          { label: "Luas Permukaan", formula: <span><M math="L = 2L_a + K_a \times t" /></span>, color: "bg-amber-900/40 border-amber-400/30" },
          { label: "Volume", formula: <M math="V = L_a \times t" />, color: "bg-orange-900/40 border-orange-400/30" },
        ]} />

        <div className="bg-orange-500/10 border border-orange-400/20 rounded-xl px-4 py-3 mb-3 font-body text-xs text-white/80">
          <p className="font-bold text-orange-300 mb-2">Keterangan:</p>
          <ul className="space-y-1">
            <li><M math="L_a" /> = luas alas prisma (bergantung bentuk segi-n)</li>
            <li><M math="K_a" /> = keliling alas prisma</li>
            <li>t = tinggi prisma (jarak antar bidang alas)</li>
          </ul>
        </div>

        <div className="mb-3">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 font-body">📊 Tabel Unsur Prisma Segi-n</p>
          <div className="overflow-x-auto rounded-xl border border-amber-400/20">
            <table className="w-full text-xs font-body text-white/80 text-center">
              <thead className="bg-amber-900/40 text-amber-300">
                <tr>
                  <th className="px-3 py-2 text-left">Prisma</th>
                  <th className="px-3 py-2">Sisi</th>
                  <th className="px-3 py-2">Rusuk</th>
                  <th className="px-3 py-2">Titik Sudut</th>
                </tr>
              </thead>
              <tbody>
                {[["Segitiga (n=3)", 5, 9, 6], ["Segiempat (n=4)", 6, 12, 8], ["Segilima (n=5)", 7, 15, 10], ["Segienam (n=6)", 8, 18, 12]].map(([name, s, r, ts], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-amber-900/10" : "bg-amber-900/20"}>
                    <td className="px-3 py-2 text-left text-amber-200">{name}</td>
                    <td className="px-3 py-2">{s}</td>
                    <td className="px-3 py-2">{r}</td>
                    <td className="px-3 py-2">{ts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Rangkuman>
          <ul className="space-y-1">
            <li>✦ Prisma segi-n memiliki n sisi tegak berbentuk persegi panjang</li>
            <li>✦ Volume prisma = volume alas × tinggi (sama untuk semua bentuk alas)</li>
            <li>✦ Balok adalah prisma segiempat khusus</li>
            <li>✦ Luas permukaan = 2 × luas alas + keliling alas × tinggi</li>
          </ul>
        </Rangkuman>
      </div>
    ),
  },
  {
    heading: "D. Limas",
    color: "from-pink-900/40 to-rose-900/30",
    border: "border-pink-500/30",
    shape: <LimasShape3D />,
    content: (
      <div className="space-y-3">
        <DefBox>
          <b>Limas</b> adalah bangun ruang yang memiliki <b>satu bidang alas berbentuk segi-n</b> dan <b>sisi-sisi tegak berbentuk segitiga</b> yang bertemu di satu titik puncak (apex). Limas dinamai berdasarkan bentuk alasnya.
        </DefBox>

        <UnsurGrid items={[
          { label: "Sisi / Bidang", value: "n + 1 buah", color: "bg-pink-500/10 border-pink-400/20" },
          { label: "Rusuk", value: "2n buah", color: "bg-rose-500/10 border-rose-400/20" },
          { label: "Titik Sudut", value: "n + 1 buah", color: "bg-fuchsia-500/10 border-fuchsia-400/20" },
          { label: "Tinggi Limas (t)", value: "Jarak tegak dari puncak ke bidang alas", color: "bg-pink-500/10 border-pink-400/20" },
          { label: "Tinggi Sisi Tegak (ts)", value: "Tinggi segitiga pada sisi tegak (apotema)", color: "bg-rose-500/10 border-rose-400/20" },
          { label: "Apotema Alas (a)", value: "Jarak pusat alas ke tengah sisi alas", color: "bg-fuchsia-500/10 border-fuchsia-400/20" },
        ]} />

        <FormulaCards items={[
          { label: "Luas Permukaan", formula: <span>L = <M math="L_a" /> + ΣLuas sisi tegak</span>, color: "bg-pink-900/40 border-pink-400/30" },
          { label: "Volume", formula: <M math="V = \frac{1}{3} \times L_a \times t" />, color: "bg-rose-900/40 border-rose-400/30" },
        ]} />

        <div className="mb-3">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 font-body">📊 Tabel Unsur Limas Segi-n</p>
          <div className="overflow-x-auto rounded-xl border border-pink-400/20">
            <table className="w-full text-xs font-body text-white/80 text-center">
              <thead className="bg-pink-900/40 text-pink-300">
                <tr>
                  <th className="px-3 py-2 text-left">Limas</th>
                  <th className="px-3 py-2">Sisi</th>
                  <th className="px-3 py-2">Rusuk</th>
                  <th className="px-3 py-2">Titik Sudut</th>
                </tr>
              </thead>
              <tbody>
                {[["Segitiga (n=3)", 4, 6, 4], ["Segiempat (n=4)", 5, 8, 5], ["Segilima (n=5)", 6, 10, 6], ["Segienam (n=6)", 7, 12, 7]].map(([name, s, r, ts], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-pink-900/10" : "bg-pink-900/20"}>
                    <td className="px-3 py-2 text-left text-pink-200">{name}</td>
                    <td className="px-3 py-2">{s}</td>
                    <td className="px-3 py-2">{r}</td>
                    <td className="px-3 py-2">{ts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-rose-500/10 border border-rose-400/20 rounded-xl px-4 py-3 mb-3 font-body text-xs text-white/80">
          <p className="font-bold text-rose-300 mb-2">🔑 Rumus Limas Segiempat Beraturan (sisi alas = a, tinggi = t)</p>
          <ul className="space-y-1">
            <li>• Tinggi sisi tegak: <M math="t_s = \sqrt{t^2 + \left(\frac{a}{2}\right)^2}" /></li>
            <li>• Luas sisi tegak: <M math="\frac{1}{2} \times a \times t_s" /> (tiap segitiga)</li>
            <li>• Luas permukaan: <M math="a^2 + 4 \times \frac{1}{2} \times a \times t_s" /></li>
            <li>• Volume: <M math="\frac{1}{3} \times a^2 \times t" /></li>
          </ul>
        </div>

        <Rangkuman>
          <ul className="space-y-1">
            <li>✦ Limas = bangun yang menyempit dari alas ke satu titik puncak</li>
            <li>✦ Volume limas = ⅓ × volume prisma dengan alas dan tinggi sama</li>
            <li>✦ Limas segiempat beraturan: semua rusuk tegak sama panjang</li>
            <li>✦ Piramida Mesir adalah contoh limas segiempat di dunia nyata</li>
            <li>✦ Hubungan: V_limas = ⅓ × V_prisma (alas & tinggi sama)</li>
          </ul>
        </Rangkuman>
      </div>
    ),
  },
  {
    heading: "E. Rangkuman Perbandingan",
    color: "from-sky-900/40 to-blue-900/30",
    border: "border-sky-500/30",
    shape: null,
    content: (
      <div className="space-y-3">
        <div className="overflow-x-auto rounded-xl border border-sky-400/20">
          <table className="w-full text-xs font-body text-white/80 text-center">
            <thead className="bg-sky-900/40 text-sky-300">
              <tr>
                <th className="px-3 py-2 text-left">Bangun</th>
                <th className="px-3 py-2">Sisi</th>
                <th className="px-3 py-2">Rusuk</th>
                <th className="px-3 py-2">Titik Sudut</th>
                <th className="px-3 py-2">Rumus V</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Kubus", "6", "12", "8", "r³"],
                ["Balok", "6", "12", "8", "p·l·t"],
                ["Prisma-n", "n+2", "3n", "2n", "Lₐ·t"],
                ["Limas-n", "n+1", "2n", "n+1", "⅓·Lₐ·t"],
              ].map(([name, s, r, ts, v], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-sky-900/10" : "bg-sky-900/20"}>
                  <td className="px-3 py-2 text-left text-sky-200 font-bold">{name}</td>
                  <td className="px-3 py-2">{s}</td>
                  <td className="px-3 py-2">{r}</td>
                  <td className="px-3 py-2">{ts}</td>
                  <td className="px-3 py-2 text-sky-300 font-mono">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-blue-900/30 border border-blue-400/25 rounded-xl px-4 py-3 font-body text-xs text-white/80">
            <p className="text-blue-300 font-bold mb-2">💡 Rumus Euler</p>
            <p className="mb-1">Untuk semua bangun ruang sisi datar:</p>
            <div className="text-center text-sm font-bold text-blue-200 py-1">
              <M math="S - R + V = 2" />
            </div>
            <p className="text-white/50 text-[10px] mt-1">S = banyak sisi, R = banyak rusuk, V = banyak titik sudut</p>
          </div>
          <div className="bg-indigo-900/30 border border-indigo-400/25 rounded-xl px-4 py-3 font-body text-xs text-white/80">
            <p className="text-indigo-300 font-bold mb-2">🎯 Tips Olimpiade</p>
            <ul className="space-y-1">
              <li>• Diagonal ruang kubus: <M math="r\sqrt{3}" /></li>
              <li>• Jarak titik ke bidang: pakai proyeksi + Pythagoras</li>
              <li>• V limas = ⅓ V prisma (alas & tinggi sama)</li>
              <li>• Hubungan rusuk-sisi: rumus Euler S – R + V = 2</li>
            </ul>
          </div>
        </div>

        <Rangkuman>
          <ul className="space-y-1">
            <li>✦ Bangun ruang sisi datar = bangun ruang yang dibatasi bidang-bidang datar (polygon)</li>
            <li>✦ Semua memenuhi rumus Euler: S – R + V = 2</li>
            <li>✦ Limas terpancung (frustum): V = ⅓ × h × (A₁ + A₂ + √(A₁·A₂))</li>
            <li>✦ Jaring-jaring kubus: 11 jenis berbeda; balok: 54 jenis berbeda</li>
          </ul>
        </Rangkuman>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────
   LATIHAN DASAR IMAGES
───────────────────────────────────────────────────────── */

const dasarImages: Record<number, string> = {
  2:  "/brsd-dasar-2.png",
  3:  "/brsd-dasar-3.png",
  9:  "/brsd-dasar-9.png",
  10: "/brsd-dasar-10.jpg",
  11: "/brsd-dasar-11.png",
  17: "/brsd-dasar-17.png",
  25: "/brsd-dasar-25.png",
  26: "/brsd-dasar-26.png",
  30: "/brsd-dasar-30.png",
  36: "/brsd-dasar-36.png",
  39: "/brsd-dasar-39.png",
  43: "/brsd-dasar-43.png",
};

const dasarOptionImages: Record<number, Record<string, string>> = {
  1: {
    A: "/brsd-dasar-1-A.png",
    B: "/brsd-dasar-1-B.png",
    C: "/brsd-dasar-1-C.png",
    D: "/brsd-dasar-1-D.png",
  },
};

const olimpiadeImages: Record<number, string> = {
  12: olimpiadeImg12,
  14: olimpiadeImg14,
  16: olimpiadeImg16,
  20: olimpiadeImg20,
  21: olimpiadeImg21,
  22: olimpiadeImg22,
};

/* ─────────────────────────────────────────────────────────
   LATIHAN DATA
───────────────────────────────────────────────────────── */

const latihanDasar = [
  { no: 1, soal: "Pada rangkaian persegi berikut yang merupakan jaring-jaring kubus adalah ...", options: ["A. Gambar A", "B. Gambar B", "C. Gambar C", "D. Gambar D"] },
  { no: 2, soal: "Perhatikan gambar!\nAgar dapat membentuk balok, persegipanjang yang harus dihilangkan bernomor ....", options: ["A. 5 dan 6", "B. 5 dan 7", "C. 1 dan 7", "D. 1 dan 8"] },
  { no: 3, soal: "Daerah yang diarsir pada gambar disebut ....", options: ["A. Diagonal bidang", "B. Bidang diagonal", "C. Diagonal ruang", "D. Diagonal sisi"] },
  { no: 4, soal: "Banyaknya diagonal ruang dan bidang diagonal balok adalah ...", options: ["A. 4 dan 6", "B. 4 dan 12", "C. 6 dan 4", "D. 12 dan 4"] },
  { no: 5, soal: "Nama bangun yang mempunyai rusuk sebanyak 54 dan sisi sebanyak 28 adalah ....", options: ["A. Prisma segi-18", "B. Prisma segi-24", "C. Limas segi-18", "D. Limas segi-27"] },
  { no: 6, soal: "Banyak rusuk, titik sudut dan sisi pada prisma segi-9 berturut-turut adalah p, q, r. Maka nilai p + q + r adalah...", options: ["A. 38", "B. 46", "C. 56", "D. 62"] },
  { no: 7, soal: "Banyak sisi dan rusuk pada prisma segi-10 adalah...", options: ["A. 10 dan 20", "B. 10 dan 30", "C. 12 dan 20", "D. 12 dan 30"] },
  { no: 8, soal: "Diketahui a, b, c adalah rusuk, sisi dan titik sudut pada limas segi-12. Maka nilai a + b - c adalah...", options: ["A. 24", "B. 36", "C. 40", "D. 46"] },
  { no: 9, soal: "Perhatikan gambar berikut\nSebuah balok dibentuk dari kubus-kubus kecil seperti tampak pada gambar di atas. Jika seluruh permukaan balok di cat, maka banyaknya kubus yang tidak terkena cat adalah ...", options: ["A. 8 buah", "B. 24 buah", "C. 32 buah", "D. 44 buah"] },
  { no: 10, soal: "Perhatikan gambar berikut!\nSebuah balok yang disusun dari kubus satuan. Jika bagian luar seluruh permukaan balok di cat, maka banyak kubus satuan yang terkena cat pada satu permukaan adalah ....", options: ["A. 26 buah", "B. 42 buah", "C. 52 buah", "D. 102 buah"] },
  { no: 11, soal: "Gambar berikut adalah mainan anak-anak yang berbentuk balok, tersusun dari kubus-kubus satuan yang kongruen. Jika seluruh permukaan balok tersebut dicat, banyaknya kubus satuan yang terkena cat pada dua sisinya saja adalah ....", options: ["A. 16", "B. 18", "C. 24", "D. 28"] },
  { no: 12, soal: "Via akan membuat kerangka balok dari kawat. Jika kerangka balok yang akan dibuat berukuran 10 cm x 6 cm x 4 cm dan panjang kawat yang tersedia 7,2 m, maka banyak kerangka balok yang dapat dibuat oleh Via adalah ....", options: ["A. 6 buah", "B. 8 buah", "C. 9 buah", "D. 12 buah"] },
  { no: 13, soal: "Pak Dani membuat kerangka berbentuk balok yang terbuat dari alumunium dengan ukuran 60 cm x 50 cm x 80 cm. jika harga alumunium Rp40.000,00 tiap meter maka biaya yang diperlukan untuk membeli alumunium adalah...", options: ["A. Rp72.000,00", "B. Rp96.000,00", "C. Rp288.000,00", "D. Rp960.000,00"] },
  { no: 14, soal: "Sebuah kerangka aquarium berbentuk prisma segitiga dengan tinggi 60 cm dibuat dari alumunium. Panjang sisi-sisi segitiga itu 30 cm, 40 cm, dan 50 cm. Jika harga 1m alumunium adalah Rp30.000,00, harga alumunium untuk membuat kerangka tersebut adalah ....", options: ["A. Rp120.000,00", "B. Rp126.000,00", "C. Rp140.000,00", "D. Rp160.000,00"] },
  { no: 15, soal: "Rosa akan membuat model kerangka limas dan prisma masing-masing satu buah. Model kerangka limas alasnya berbentuk persegi panjang dengan ukuran 8 cm x 6 cm dengan tinggi limas 12 cm. Sedangkan kerangka prisma alasnya berbentuk segi enam beraturan dengan panjang sisi 12 cm dan tinggi prisma 20 cm. Jika Rosa memiliki persediaan kawat 4 m, maka sisa kawat yang tidak terpakai adalah...", options: ["A. 50 cm", "B. 54 cm", "C. 58 cm", "D. 60 cm"] },
  { no: 16, soal: "Ardian akan membuat sebuah model kerangka limas yang alasnya berbentuk persegi, dengan panjang sisi 8 cm, jika panjang rusuk tegak limas 10 cm, maka panjang kawat yang diperlukan adalah ....", options: ["A. 36 cm", "B. 40 cm", "C. 72 cm", "D. 80 cm"] },
  { no: 17, soal: "Apri mendapat tugas untuk membuat kerangka lampu hias yang berbentuk kerangka limas seperti pada gambar. Jika kerangka limas tersebut dibuat dari rotan dan harga 1 m rotan adalah Rp20.000,00, maka biaya yang dibutuhkan seluruhnya adalah ...", options: ["A. Rp64.000,00", "B. Rp52.000,00", "C. Rp44.000,00", "D. Rp22.000,00"] },
  { no: 18, soal: "Panjang diagonal sisi sebuah kubus adalah $2\\sqrt{2}$ cm, maka luas permukaan kubus tersebut adalah ...", options: ["A. 96 $cm^2$", "B. 64 $cm^2$", "C. 24 $cm^2$", "D. 8 $cm^2$"] },
  { no: 19, soal: "Luas permukaan sebuah kotak peralatan yang berbentuk balok dengan ukuran 2 dm x 3 dm x 5 dm adalah ...", options: ["A. 180 $dm^2$", "B. 62 $dm^2$", "C. 45 $dm^2$", "D. 30 $dm^2$"] },
  { no: 20, soal: "Luas permukaan sebuah balok 148 $cm^2$, jika panjang 6 cm, dan lebar 5 cm, maka tingginya adalah ....", options: ["A. 4 cm", "B. 6 cm", "C. 8 cm", "D. 10 cm"] },
  { no: 21, soal: "Sebuah prisma tegak alasnya berbentuk segitiga siku-siku, panjang sisi siku-sikunya 5 cm dan 12 cm. Jika tinggi prisma 20 cm, maka luas prisma tersebut adalah ...", options: ["A. 660 $cm^2$", "B. 630 $cm^2$", "C. 600 $cm^2$", "D. 400 $cm^2$"] },
  { no: 22, soal: "Alas sebuah prisma berbentuk belah ketupat dengan panjang diagonalnya 10 cm dan 24 cm. Jika tinggi prisma 15 cm, luas permukaannya adalah....", options: ["A. 435 $cm^2$", "B. 780 $cm^2$", "C. 900 $cm^2$", "D. 1.020 $cm^2$"] },
  { no: 23, soal: "Alas limas berbentuk persegi dengan panjang sisi 14 cm, jika tinggi limas tersebut 24 cm, maka luas permukaannya adalah ....", options: ["A. 1568 $cm^2$", "B. 896 $cm^2$", "C. 869 $cm^2$", "D. 700 $cm^2$"] },
  { no: 24, soal: "Alas limas berbentuk persegi dengan panjang sisi 10 cm. Jika tinggi limas 12 cm, maka luas permukaan limas adalah ...", options: ["A. 340 $cm^2$", "B. 360 $cm^2$", "C. 620 $cm^2$", "D. 680 $cm^2$"] },
  { no: 25, soal: "Perhatikan gambar kubus ABCD. EFGH berikut.\nJika panjang AB = 24 cm, BC = 10 cm dan 20 cm. Maka luas bidang diagonal ACEG adalah ....", options: ["A. 240 $cm^2$", "B. 480 $cm^2$", "C. 500 $cm^2$", "D. 520 $cm^2$"] },
  { no: 26, soal: "Perhatikan gambar balok ABCD.EFGH berikut!\nJika panjang AB = 15 cm, BC = 8 cm, dan CG = 12 cm, maka luas bidang diagonal ACGE adalah ....", options: ["A. 180 $cm^2$", "B. 136 $cm^2$", "C. 126 $cm^2$", "D. 120 $cm^2$"] },
  { no: 27, soal: "Nada akan membuat aquarium besar berbentuk balok tanpa tutup berukuran 2 m x 1 m x 0,5 m yang terbuat dari kaca. Jika harga kaca Rp80.000,00 / $m^2$, maka biaya pembelian kaca adalah...", options: ["A. Rp 400.000,00", "B. Rp 460.000,00", "C. Rp 500.000,00", "D. Rp 600.000,00"] },
  { no: 28, soal: "Sebuah prisma tegak alasnya berbentuk belah ketupat dengan panjang diagonal 24 cm dan 10 cm. Jika tinggi prisma 20 cm, maka luas seluruh permukaan prisma adalah ....", options: ["A. 1280 $cm^2$", "B. 1160 $cm^2$", "C. 1040 $cm^2$", "D. 480 $cm^2$"] },
  { no: 29, soal: "Atap sebuah gedung berbentuk limas yang alasnya persegi. Panjang sisi alas limas 16 m dan tinggi limas 6 m. Jika atap akan dicat dengan biaya Rp10.000,00 per meter persegi, maka biaya keseluruhan yang diperlukan adalah ....", options: ["A. Rp3.200.000,00", "B. Rp2.400.000,00", "C. Rp1.600.000,00", "D. Rp1.200.000,00"] },
  { no: 30, soal: "Perhatikan gambar berikut.\nLuas seluruh bangun tersebut adalah ....", options: ["A. 760 $cm^2$", "B. 720 $cm^2$", "C. 660 $cm^2$", "D. 640 $cm^2$"] },
  { no: 31, soal: "Sebuah kubus mempunyai panjang diagonal ruang adalah $5\\sqrt{3}$ cm. maka volumenya adalah", options: ["A. 150 $cm^3$", "B. 125 $cm^3$", "C. 75 $cm^3$", "D. 45 $cm^3$"] },
  { no: 32, soal: "Luas salah satu sisi pada kubus adalah 25 $cm^2$. Maka volume kubus tersebut adalah ...", options: ["A. 625 $cm^3$", "B. 150 $cm^3$", "C. 125 $cm^3$", "D. 50 $cm^3$"] },
  { no: 33, soal: "Perbandingan panjang rusuk-rusuk sebuah balok 2 : 3 : 4, jika luas permukaan balok tersebut 248 $cm^2$, maka volumenya adalah ....", options: ["A. 24 $cm^3$", "B. 32 $cm^3$", "C. 180 $cm^3$", "D. 192 $cm^3$"] },
  { no: 34, soal: "Sebuah kaleng roti berbentuk prisma tegak yang alasnya persegipanjang dengan panjang 12 cm, dan lebar 8 cm, jika tinggi prisma 10 cm. maka volume kaleng roti tersebut adalah ....", options: ["A. 320 $cm^3$", "B. 480 $cm^3$", "C. 960 $cm^3$", "D. 1440 $cm^3$"] },
  { no: 35, soal: "Pada sebuah prisma yang alasnya belahketupat, diketahui panjang sisinya 13 cm, panjang salah satu diagonalnya 10 cm, dan tinggi prisma 15 cm, volume prisma adalah ...", options: ["A. 1.800 $cm^3$", "B. 1.200 $cm^3$", "C. 650 $cm^3$", "D. 600 $cm^3$"] },
  { no: 36, soal: "Perhatikan gambar prisma berikut!\nVolumenya adalah ....", options: ["A. 800 $cm^3$", "B. 1.600 $cm^3$", "C. 2.400 $cm^3$", "D. 3.200 $cm^3$"] },
  { no: 37, soal: "Sebuah prisma alasnya berbentuk jajar genjang dengan panjang alas 15 cm dan tinggi 8 cm. Jika tinggi prisma 20 cm, volume prisma tersebut adalah ....", options: ["A. 2.400 $cm^3$", "B. 2.100 $cm^3$", "C. 1.800 $cm^3$", "D. 800 $cm^3$"] },
  { no: 38, soal: "Sebuah prisma alasnya berbentuk segitiga siku-siku, panjang sisi siku-sikunya 8 cm dan 15 cm, jika volume prisma itu 1200 $cm^3$.\nHitunglah:\na. Tinggi prisma\nb. Luas seluruh permukaan prisma", options: [] },
  { no: 39, soal: "Perhatikan gambar limas T.ABCD di samping!\nPanjang AB = BC = CD = AD = 30 cm. Jika volume limas 6000 $cm^3$, maka panjang garis TE adalah ....", options: ["A. 20 cm", "B. 25 cm", "C. 35 cm", "D. 40 cm"] },
  { no: 40, soal: "Alas sebuah limas berbentuk belah ketupat dengan keliling 52 cm dan panjang salah satu diagonalnya 10 cm serta tinggi limas 12 cm. Volume limas tersebut adalah....", options: ["A. 720 $cm^3$", "B. 1.296 $cm^3$", "C. 1.728 $cm^3$", "D. 2.880 $cm^3$"] },
  { no: 41, soal: "Alas sebuah limas berbentuk belah ketupat dengan keliling 60 cm dan panjang salah satu diagonalnya 18 cm, jika tinggi limas 20 cm, maka volume limas tersebut adalah....", options: ["A. 1440 $cm^3$", "B. 1800 $cm^3$", "C. 2160 $cm^3$", "D. 2880 $cm^3$"] },
  { no: 42, soal: "Sebuah limas mempunyai alas berbentuk jajargenjang yang panjang salah satu sisinya 12 cm dan jarak antara sisi itu dengan sisi sejajarnya adalah 15 cm. Jika volumnya 600 $cm^3$, maka tinggi limas tersebut adalah ....", options: ["A. 30 cm", "B. 10 cm", "C. 6,6 cm", "D. 3,3 cm"] },
  { no: 43, soal: "Perhatikan gambar berikut!\nVolume bangun di atas adalah....", options: ["A. 144 $cm^3$", "B. 576 $cm^3$", "C. 644 $cm^3$", "D. 720 $cm^3$"] },
  { no: 44, soal: "Sebuah kubus besar yang volumenya 27 $m^3$ dapat disusun dari kubus-kubus kecil dengan panjang rusuk 0,75 m sebanyak ....", options: ["A. 64 buah", "B. 48 buah", "C. 42 buah", "D. 32 buah"] },
  { no: 45, soal: "Sebuah bak air berbentuk balok dengan panjang 1,2 m, lebar 0,8 m dan tinggi 0,5 m berisi air $\\frac{3}{4}$ bagian. Air tersebut akan dituangkan ke dalam wadah berbentuk kubus dengan panjang rusuk 20 cm. Maka banyak kubus yang diperlukan untuk menampung air adalah.....", options: ["A. 20 buah", "B. 25 buah", "C. 40 buah", "D. 45 buah"] },
  { no: 46, soal: "Sebuah bak mandi berukuran panjang = 80 cm, lebar = 40 cm, tinggi 60 cm, berisi air setinggi 40 cm, jika 3 buah kubus yang panjang rusuknya 20 cm, dimasukkan ke dalam bak tersebut sehingga tenggelam, tentukan tinggi air sekarang!", options: [] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nDiketahui sebuah bak berbentuk balok yang terisi penuh dengan air. Bak tersebut akan dikosongkan dengan menggunakan pompa yang mampu menyedot air 0,7 liter per detik. Dalam waktu 30 menit bak dapat dikosongkan tanpa sisa. Jika luas alas bak adalah 10500 $cm^3$, maka tinggi bak tersebut adalah ...", options: [] },
  { no: 2, soal: "OSN Matematika 2005 Tingkat Kota\nSebuah balok memiliki sisi-sisi yang luasnya 24 $cm^2$, 32 $cm^2$ dan 48 $cm^2$. Berapakah jumlah panjang semua rusuk balok tersebut.", options: [] },
  { no: 3, soal: "OSN Matematika 2005 Tingkat Kota\nPompa air merk Tangguh sanggup memompa sebanyak 25 liter setiap menit. Pompa merek perkasa sanggup memompa air 400 cc setiap detik, sedangkan merek Tahan Banting sanggup memompa 1,6 $m^3$ setiap jam. Pompa manakah yang paling cepat mengisi sebuah tangka air berkapasitas 500 liter.", options: [] },
  { no: 4, soal: "OSN Matematika 2008 Tingkat Kota\nAnto memiliki sejumlah kubus kecil berwarna putih yang disusun menjadi sebuah kubus lebih besar. Sedikitnya satu sisi kubus besar dicat dengan warna hijau, tetapi masih ada setidaknya satu sisi berwarna putih. Kubus besar tersebut kemudian dibongkar kembali dan ditemukan bahwa ada 1.000 buah kubus kecil yang tetap berwarna putih di semua sisinya. Banyaknya sisi kubus besar yang telah diwarnai hijau adalah", options: [] },
  { no: 5, soal: "OSN Matematika 2010 Tingkat Kota\nSebuah prisma segi empat berukuran 15 cm x 15 cm x 10 cm, terbuat dari baja. Prisma tersebut setiap rusuknya diberi kerangka terbuat dari kawat dan setiap sisi di cat. Harga baja setiap 1 $cm^2$ adalah Rp800,00; setiap 4cm kawat harganya Rp1300,00 dan setiap 10 $cm^2$ membutuhkan cat dengan harga Rp1600,00. hitunglah biaya untuk membuat prisma segiempat tersebut adalah ...", options: ["A. Rp2.020.000,00", "B. Rp1.160.000,00", "C. Rp1.060.000,00", "D. Rp1.050.000,00", "E. Rp1.030.000,00"] },
  { no: 6, soal: "OSN Matematika 2010 Tingkat Kota\nEmpat kubus identik dengan panjang rusuk 5 cm disusun menjadi suatu bangun ruang dengan cara menempelkan sisi-sisinya. Banyak bangun ruang berbeda yang terbentuk adalah ...", options: ["A. 10", "B. 8", "C. 6", "D. 5", "E. 3"] },
  { no: 7, soal: "OSN Matematika 2011 Tingkat Kota\nDiketahui limas T.ABCD panjang rusuk AB 2 cm dan TA 4 cm, jarak titik M dan rusuk TD adalah ...", options: ["A. $\\sqrt{5}$", "B. $\\sqrt{6}$", "C. $\\sqrt{7}$", "D. $\\sqrt{25}$", "E. $\\sqrt{26}$"] },
  { no: 8, soal: "OSN Matematika 2012 Tingkat Kota\nSuatu balok dengan volume 240 satuan mempunyai panjang a, lebar b dan tinggi c (a, b dan c adalah bilangan asli). Jika a + b + c = 19 dan a > b > c > 3, maka luas permukaan balok yang sisinya mempunyai rusuk b dan c adalah ...", options: ["A. 64", "B. 60", "C. 48", "D. 40", "E. 30"] },
  { no: 9, soal: "OSN Matematika 2012 Tingkat Kota\nKubus ABCD.EFGH mempunyai panjang rusuk 2 cm. jika titik T adalah titik potong diagonal bidang BCGF, titik P adalah titik Tengah rusuk AB, dan titik Q adalah titik Tengah rusuk DC, maka jarak antara titik T dengan bidang PQHE adalah ... cm", options: [] },
  { no: 10, soal: "OSN Matematika 2013 Tingkat Kota\nJika diketahui panjang rusuk kubus ABCD.EFGH adalah 1 satuan, maka jarak titik E ke bidang datar AFH adalah ... satuan", options: ["A. $\\frac{1}{2}$", "B. $\\frac{\\sqrt{2}}{2}$", "C. $\\frac{1}{\\sqrt{3}}$", "D. $\\frac{\\sqrt{3}}{3}$", "E. $\\frac{3}{4}$"] },
  { no: 11, soal: "OSN Matematika 2014 Tingkat Kota\nKubus ABCD.EFGH mempunyai panjang rusuk 2 satuan. Titik O adalah titik potong dua diagonal pada bidang BCFG. Jarak titik O ke bidang BCEH adalah ... satuan", options: ["A. $\\frac{\\sqrt{2}}{5}$", "B. $\\frac{\\sqrt{2}}{4}$", "C. $\\frac{\\sqrt{2}}{3}$", "D. $\\frac{\\sqrt{2}}{2}$"] },
  { no: 12, soal: "OSN Matematika 2015 Tingkat Kota\nSuatu kardus polos dari kertas berbentuk kubus. Volume kardus adalah 64.000 $cm^3$. Fitri memotong tepat pada rusuk kubus dan mengambil dua sisi bagian samping kardus tersebut. Fitri membuat garis pada satu potong sisi kardus dan diperoleh satu segitiga siku-siku yang perbandingan dua sisi siku-siku adalah 1 : 2. Pada satu potongan sisi kardus yang lain dilukis satu segitiga sama kaki. Jika ternyata dua segitiga ini sama luasnya, maka panjang sisi yang sama pada segitiga sama kaki adalah ... cm", options: ["A. 10", "B. $10\\sqrt{2}$", "C. 20", "D. $20\\sqrt{2}$"] },
  { no: 13, soal: "OSN Matematika 2015 Tingkat Kota\nDua botol yang berukuran sama berisi penuh dengan larutan gula. Rasio kandungan gula dan air pada botol pertama adalah 2 : 11 dan pada botol kedua 3 : 5. Jika isi botol tersebut dicampurkan, maka rasio kandungan gula dan air hasil campurannya adalah ...", options: [] },
  { no: 14, soal: "OSN Matematika 2015 Tingkat Kota\nDiketahui sebuah prisma yang dibentuk oleh bidang-bidang sisi berupa dua trapesium yang kongruen ABFE dan DCGH. Jika AB sejajar EF, panjang AE = panjang BF, panjang AB = 2 kali panjang EF, panjang AP = panjang PB = panjang DQ = panjang QC, AD tegak lurus AB dan EH tegak lurus EF, maka perbandingan volume prisma APE.DQH dan prisma PBFE.QCGH adalah ...", options: [] },
  { no: 15, soal: "OSN Matematika 2016 Tingkat Kota\nKetika suatu segitiga siku-siku diputar pada salah satu sisi siku-sikunya, maka diperoleh kerucut dengan volume $392\\pi$ $cm^3$. Bila diputar pada sisi siku-siku lainnya akan diperoleh kerucut dengan volume $1344\\pi$ $cm^3$. Panjang sisi miring segitiga siku-siku tersebut adalah ... cm", options: [] },
  { no: 16, soal: "OSN Matematika 2016 Tingkat Kota\nSuatu balok tersusun atas kubus satuan seperti pada gambar di samping. Balok tersebut dipancung sepanjang permukaan bangun datar yang dicetak tebal. Luas permukaan balok terpancung adalah ... satuan luas.", options: [] },
  { no: 17, soal: "OSN Matematika 2018 Tingkat Kota\nKubus ABCD.PQRS memiliki sisi-sisi yang panjangnya 4 cm. jika titik E titik Tengah PQ dan F adalah titik Tengah QR, maka luas ACFE adalah ... $cm^2$", options: ["A. 16", "B. 18", "C. 32", "D. 64"] },
  { no: 18, soal: "OSN Matematika 2019 Tingkat Kota\nDua akuarium A dan B diisi air sehingga volumnya sama yaitu 64.000 $cm^3$. Anto memiliki 30 kelereng kecil dan 20 kelereng besar yang akan dimasukkan ke dalam akuarium tersebut. Ke dalam akuarium A dimasukkan 7 kelereng kecil dan 7 kelereng besar sehingga volum akuarium yang terisi menjadi $64821\\frac{1}{3}$ $cm^3$. Sedangkan, kedalam akuarium B dimasukkan 21 kelereng kecil dan 7 kelereng besar sehingga volum akuarium yang terisi menjadi 64880 $cm^3$. Volum seluruh kelereng Anto yang tidak dimasukkan ke akuarium adalah ... $cm^3$", options: ["A. $113\\frac{3}{21}$", "B. $226\\frac{6}{21}$", "C. $251\\frac{9}{21}$", "D. $687\\frac{5}{21}$"] },
  { no: 19, soal: "OSN Matematika 2019 Tingkat Kota\nABCD adalah jajargenjang. E adalah titik Tengah AB. Ruas garis DE memotong AC di titik P. perbandingan luas jajargenjang ABCD dengan luas segitiga AEP adalah ...", options: ["A. 12 : 1", "B. 8 : 1", "C. 6 : 1", "D. 4 : 1"] },
  { no: 20, soal: "OSN Matematika 2023 Tingkat Provinsi\nSuatu penampung air berbentuk gabungan balok dan limas terpancung dengan ukuran dalam (m) seperti pada gambar berikut.\nPenampung tersebut yang semula kosong diisi air dengan debit 1000 $m^3$/jam. Waktu yang dibutuhkan agar air dalam penampungan setinggi $20 - 5\\sqrt{2}$ m adalah ... jam", options: [] },
  { no: 21, soal: "OSN Matematika 2025 Tingkat Kota\nSuatu bidang empat T.ABC memiliki bidang sisi segitiga TBC, TBA dan ABC yang masing-masing saling tegak lurus seperti pada gambar berikut.\nLuas TBC : Luas TBA : Luas ABC = 1 : 2 : 3 dan panjang AC = 10 cm, maka volume bidang empat T.ABC sama dengan ... $cm^2$", options: ["A. $\\frac{10\\sqrt{5}}{9}$", "B. $\\frac{80\\sqrt{5}}{3}$", "C. $80\\sqrt{5}$", "D. $320\\sqrt{5}$"] },
  { no: 22, soal: "OSN Matematika 2025 Tingkat Kota\nOktahendron adalah bilangan bangun ruang tiga dimensi dengan delapan bidang sisi datar. Berikut ini adalah jaring-jaring suatu octahedron beraturan yang memiliki delapan bidang sisi segitiga sama sisi yang kongruen.\nJika jaring-jaring tersebut dibentuk menjadi octahedron, maka angka pada setiap bidang sisi sama dengan penjumlahan semua bidang sisi yang berbagi rusuk dengan bidang sisi tersebut. (contoh : b = a + c + d). jika a = -4, c = 0 dan g = -10, maka nilai b adalah ...", options: ["A. -10", "B. -8", "C. 8", "D. 10"] },
];

/* ─────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────── */

const OlimpiadeBangunRuangSisiDatarPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [expandedDasarPembahasan, setExpandedDasarPembahasan] = useState<number[]>([]);
  const [expandedOlimpiadePembahasan, setExpandedOlimpiadePembahasan] = useState<number[]>([]);

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleDasarPembahasan = (no: number) => {
    playPopSound();
    setExpandedDasarPembahasan(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  const toggleOlimpiadePembahasan = (no: number) => {
    playPopSound();
    setExpandedOlimpiadePembahasan(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <ShapeStyles />
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* Header */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-400/30 flex items-center justify-center mb-4 shadow-lg">
            <Trophy className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1"
            style={{ textShadow: '0 0 32px rgba(167,139,250,0.5)' }}>
            OLIMPIADE — BANGUN RUANG SISI DATAR
          </h1>
          <p className="text-white/40 text-xs text-center font-body">Irawan Sutiawan, M.Pd</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-400 font-body">4 Bangun Ruang</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">68 Soal</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "📘 Materi" },
            { key: "dasar" as const, label: "✏️ Latihan Dasar" },
            { key: "olimpiade" as const, label: "🏆 Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-xl border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-violet-500/20 text-violet-300 border-violet-400/50 shadow-[0_0_12px_rgba(167,139,250,0.15)]"
                  : "bg-card/80 text-white/60 border-border hover:border-violet-400/30 hover:text-white/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MATERI TAB */}
        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSections.map((section, idx) => (
              <div key={idx}
                className={`relative rounded-2xl overflow-hidden border ${section.border}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} backdrop-blur`} />
                <button
                  onClick={() => toggleSection(idx)}
                  className="relative w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
                >
                  <span className="font-display text-sm text-white font-bold">{section.heading}</span>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-white/60 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="relative px-5 pb-5">
                    {section.shape && (
                      <div className="py-4">
                        {section.shape}
                      </div>
                    )}
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* LATIHAN DASAR TAB */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => {
              const soalImg = dasarImages[soal.no];
              const optImgs = dasarOptionImages[soal.no];
              return (
                <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="text-accent font-bold">{soal.no}.</span>{" "}
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {soalImg && (
                    <div className="flex justify-center mb-3">
                      <img
                        src={soalImg}
                        alt={`Gambar soal ${soal.no}`}
                        className="max-w-[280px] w-full rounded-lg border border-white/10 bg-white/5 p-2"
                      />
                    </div>
                  )}
                  {soal.options.length > 0 && (
                    <div className={`grid gap-2 mb-3 ${optImgs ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
                      {soal.options.map((opt, j) => {
                        const letter = opt.charAt(0);
                        const optImg = optImgs?.[letter];
                        return (
                          <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                            {optImg ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-accent font-bold self-start">{letter}.</span>
                                <img
                                  src={optImg}
                                  alt={`Opsi ${letter} soal ${soal.no}`}
                                  className="max-w-full rounded border border-white/10 bg-white/90 p-1"
                                />
                              </div>
                            ) : renderWithLatex(opt)}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {pembahasanDasar[soal.no] && (
                    <div>
                      <button
                        onClick={() => toggleDasarPembahasan(soal.no)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          expandedDasarPembahasan.includes(soal.no)
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                            : "bg-muted/30 border-border text-white/60 hover:border-emerald-500/40 hover:text-emerald-400"
                        }`}
                      >
                        <BookOpen className="w-3 h-3" />
                        {expandedDasarPembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                        {expandedDasarPembahasan.includes(soal.no)
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />}
                      </button>
                      {expandedDasarPembahasan.includes(soal.no) && (
                        <div className="mt-3 bg-muted/20 border border-border/60 rounded-xl px-4 py-3 space-y-1">
                          {pembahasanDasar[soal.no]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* LATIHAN OLIMPIADE TAB */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => {
              const olimImg = olimpiadeImages[soal.no];
              return (
              <div key={soal.no}
                className="relative rounded-2xl overflow-hidden border border-amber-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-slate-900/60 backdrop-blur" />
                <div className="relative px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap leading-relaxed">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/30 text-amber-300 text-xs font-bold mr-2 shrink-0">{soal.no}</span>
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN')
                          ? <span className="text-yellow-400 font-semibold">{line}</span>
                          : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {olimImg && (
                    <div className="flex justify-center mb-3">
                      <img
                        src={olimImg}
                        alt={`Gambar soal olimpiade ${soal.no}`}
                        className="max-w-[320px] w-full rounded-lg border border-white/10 bg-white/90 p-2"
                      />
                    </div>
                  )}
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/70 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  {pembahasanOlimpiade[soal.no] && (
                    <div>
                      <button
                        onClick={() => toggleOlimpiadePembahasan(soal.no)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          expandedOlimpiadePembahasan.includes(soal.no)
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                            : "bg-white/5 border-white/10 text-white/60 hover:border-emerald-500/40 hover:text-emerald-400"
                        }`}
                      >
                        <BookOpen className="w-3 h-3" />
                        {expandedOlimpiadePembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                        {expandedOlimpiadePembahasan.includes(soal.no)
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />}
                      </button>
                      {expandedOlimpiadePembahasan.includes(soal.no) && (
                        <div className="mt-3 bg-muted/20 border border-border/60 rounded-xl px-4 py-3 space-y-1">
                          {pembahasanOlimpiade[soal.no]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-white/30 hover:text-violet-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeBangunRuangSisiDatarPage;
