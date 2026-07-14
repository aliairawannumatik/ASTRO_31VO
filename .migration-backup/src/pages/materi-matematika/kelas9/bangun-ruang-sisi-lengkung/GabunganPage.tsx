import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Layers, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────────────────────────
   ANIMATED SVGs — COMPOSITE SHAPES
───────────────────────────────────────────────────────────── */

const TabungKerucutSVG = ({ showSurface }: { showSurface: boolean }) => (
  <svg viewBox="0 0 200 220" className="w-full max-w-xs mx-auto my-2" aria-label="Tabung + Kerucut">
    <defs>
      <style>{`
        @keyframes surfGlow{0%,100%{opacity:1;}50%{opacity:0.3;}}
        .surf-a{animation:surfGlow 2s ease-in-out infinite;}
      `}</style>
      <radialGradient id="capGrad" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.7"/>
      </radialGradient>
    </defs>

    {/* Tabung — bagian bawah */}
    <ellipse cx="100" cy="190" rx="60" ry="16"
      fill={showSurface ? "rgba(14,116,144,0.4)" : "rgba(14,116,144,0.2)"}
      stroke="#0891b2" strokeWidth="2"
      className={showSurface ? "surf-a" : ""}/>
    <rect x="40" y="110" width="120" height="80" fill="rgba(8,145,178,0.15)" stroke="none"/>
    <line x1="40" y1="110" x2="40" y2="190" stroke="#0891b2" strokeWidth="2"/>
    <line x1="160" y1="110" x2="160" y2="190" stroke="#0891b2" strokeWidth="2"/>
    <ellipse cx="100" cy="110" rx="60" ry="16" fill="rgba(14,116,144,0.25)" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="4,2"/>

    {/* Selimut tabung */}
    {showSurface && (
      <rect x="40" y="110" width="120" height="80"
        fill="rgba(8,145,178,0.35)" stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="none"
        className="surf-a"/>
    )}

    {/* Kerucut — bagian atas */}
    <polygon points="100,20 40,110 160,110"
      fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth="2"/>
    {showSurface && (
      <polygon points="100,20 40,110 160,110"
        fill="rgba(168,85,247,0.45)" stroke="#d8b4fe" strokeWidth="2"
        className="surf-a"/>
    )}

    {/* Labels */}
    <text x="178" y="150" fill="#67e8f9" fontSize="9" fontFamily="monospace">r</text>
    <line x1="160" y1="150" x2="175" y2="150" stroke="#67e8f9" strokeWidth="1" strokeDasharray="2,1"/>
    <text x="178" y="155" fill="#4ade80" fontSize="9" fontFamily="monospace">t</text>
    <line x1="160" y1="110" x2="175" y2="110" stroke="#4ade80" strokeWidth="1" strokeDasharray="2,1"/>
    <line x1="160" y1="190" x2="175" y2="190" stroke="#67e8f9" strokeWidth="1" strokeDasharray="2,1"/>

    <text x="25" y="68" fill="#a855f7" fontSize="9" fontFamily="monospace">s</text>
    <line x1="100" y1="20" x2="40" y2="110" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,2"/>

    <text x="100" y="215" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="700">Tabung + Kerucut</text>
  </svg>
);

const TabungBolaSVG = ({ showSurface }: { showSurface: boolean }) => (
  <svg viewBox="0 0 200 230" className="w-full max-w-xs mx-auto my-2" aria-label="Tabung + Setengah Bola">
    <defs>
      <radialGradient id="halfSphere" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.7"/>
      </radialGradient>
      <style>{`
        @keyframes surfGlow2{0%,100%{opacity:1;}50%{opacity:0.3;}}
        .surf-b{animation:surfGlow2 2s ease-in-out infinite;}
      `}</style>
    </defs>

    {/* Tabung */}
    <ellipse cx="100" cy="200" rx="60" ry="16"
      fill={showSurface ? "rgba(14,116,144,0.4)" : "rgba(14,116,144,0.2)"}
      stroke="#0891b2" strokeWidth="2"
      className={showSurface ? "surf-b" : ""}/>
    <rect x="40" y="120" width="120" height="80" fill="rgba(8,145,178,0.15)" stroke="none"/>
    <line x1="40" y1="120" x2="40" y2="200" stroke="#0891b2" strokeWidth="2"/>
    <line x1="160" y1="120" x2="160" y2="200" stroke="#0891b2" strokeWidth="2"/>

    {showSurface && (
      <rect x="40" y="120" width="120" height="80"
        fill="rgba(8,145,178,0.35)" stroke="#67e8f9" strokeWidth="1.5"
        className="surf-b"/>
    )}

    {/* Setengah Bola */}
    <path d="M40,120 A60,60 0 0 1 160,120" fill="url(#halfSphere)"
      stroke="#a855f7" strokeWidth="2"
      className={showSurface ? "surf-b" : ""}/>

    {/* Sambungan */}
    <ellipse cx="100" cy="120" rx="60" ry="16" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,2"/>

    {/* Labels */}
    <text x="172" y="162" fill="#67e8f9" fontSize="9" fontFamily="monospace">t</text>
    <text x="172" y="122" fill="#a855f7" fontSize="9" fontFamily="monospace">r</text>
    <line x1="160" y1="120" x2="170" y2="120" stroke="#a855f7" strokeWidth="1" strokeDasharray="2,1"/>
    <line x1="160" y1="120" x2="170" y2="120" stroke="#4ade80" strokeWidth="1"/>
    <line x1="160" y1="200" x2="170" y2="200" stroke="#67e8f9" strokeWidth="1" strokeDasharray="2,1"/>

    <text x="100" y="222" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="700">Tabung + ½ Bola</text>
  </svg>
);

const KerucutBolaSVG = () => (
  <svg viewBox="0 0 200 210" className="w-full max-w-xs mx-auto my-2" aria-label="Kerucut + Setengah Bola">
    <defs>
      <radialGradient id="halfSphere2" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#065f46" stopOpacity="0.7"/>
      </radialGradient>
    </defs>
    {/* Kerucut */}
    <polygon points="100,20 40,130 160,130"
      fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth="2"/>
    <ellipse cx="100" cy="130" rx="60" ry="16" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,2"/>

    {/* Setengah Bola di bawah */}
    <path d="M40,130 A60,60 0 0 0 160,130" fill="url(#halfSphere2)" stroke="#34d399" strokeWidth="2"/>

    {/* Labels */}
    <text x="100" y="202" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="700">Kerucut + ½ Bola</text>
    <text x="25" y="80" fill="#a855f7" fontSize="9" fontFamily="monospace">s</text>
    <line x1="100" y1="20" x2="40" y2="130" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,2"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE SHAPE EXPLORER
───────────────────────────────────────────────────────────── */
const compositeViewerTrans = {
  id: {
    label: "🔍 Eksplorasi Bangun Gabungan",
    tabungKerucut: "Tabung + Kerucut",
    tabungBola: "Tabung + ½ Bola",
    hideSurface: "🎨 Sembunyikan Luas",
    showSurface: "🎨 Sorot Luas Permukaan",
  },
  en: {
    label: "🔍 Explore Composite Shapes",
    tabungKerucut: "Cylinder + Cone",
    tabungBola: "Cylinder + ½ Sphere",
    hideSurface: "🎨 Hide Surface",
    showSurface: "🎨 Highlight Surface Area",
  },
  ja: {
    label: "🔍 複合図形を探る",
    tabungKerucut: "円柱 + 円錐",
    tabungBola: "円柱 + 半球",
    hideSurface: "🎨 表面を隠す",
    showSurface: "🎨 表面積をハイライト",
  },
} as const;

const CompositeShapeViewer = ({ language }: { language: Language }) => {
  const t = compositeViewerTrans[language];
  const [config, setConfig] = useState<"tabung-kerucut" | "tabung-bola">("tabung-kerucut");
  const [showSurface, setShowSurface] = useState(false);

  return (
    <div className="bg-slate-800/70 border border-slate-600/40 rounded-xl p-4 space-y-4 font-body">
      <p className="text-cyan-300 font-bold text-sm">{t.label}</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { playPopSound(); setConfig("tabung-kerucut"); }}
          className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors cursor-pointer ${config === "tabung-kerucut" ? "bg-cyan-800/80 border-cyan-500 text-cyan-200" : "bg-slate-900/60 border-slate-600 text-slate-300"}`}>
          {t.tabungKerucut}
        </button>
        <button onClick={() => { playPopSound(); setConfig("tabung-bola"); }}
          className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors cursor-pointer ${config === "tabung-bola" ? "bg-purple-800/80 border-purple-500 text-purple-200" : "bg-slate-900/60 border-slate-600 text-slate-300"}`}>
          {t.tabungBola}
        </button>
        <button onClick={() => { playPopSound(); setShowSurface(v => !v); }}
          className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors cursor-pointer ${showSurface ? "bg-orange-800/80 border-orange-500 text-orange-200" : "bg-slate-900/60 border-slate-600 text-slate-300"}`}>
          {showSurface ? t.hideSurface : t.showSurface}
        </button>
      </div>
      {config === "tabung-kerucut" ? <TabungKerucutSVG showSurface={showSurface}/> : <TabungBolaSVG showSurface={showSurface}/>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTIONS DATA
───────────────────────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

function getSections(language: Language): Sec[] {
  const tt = tipsTrans[language];
  return [
  {
    title: "Konsep Bangun Gabungan",
    icon: "🧩",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm leading-relaxed">
          Bangun ruang gabungan adalah bangun yang terbentuk dari <strong className="text-cyan-300">dua atau lebih bangun ruang</strong>{" "}
          yang digabungkan menjadi satu bentuk. Contoh nyata: es krim cone (bola + kerucut), peluru (tabung + setengah bola), roket (tabung + kerucut).
        </p>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-4 text-sm text-cyan-100 space-y-2">
          <p className="font-semibold text-cyan-300">📌 Dua Jenis Pertanyaan Utama:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="bg-orange-950/50 border border-orange-700/40 rounded-lg p-3 text-xs">
              <p className="text-orange-300 font-bold mb-1">🎨 Luas Permukaan Gabungan</p>
              <p className="text-white/70">Total luas <strong>permukaan luar</strong> yang terlihat. Bagian yang "menempel" (tersambung) tidak dihitung!</p>
            </div>
            <div className="bg-blue-950/50 border border-blue-700/40 rounded-lg p-3 text-xs">
              <p className="text-blue-300 font-bold mb-1">📦 Volume Gabungan</p>
              <p className="text-white/70">Total isi = penjumlahan volume masing-masing bangun. Volume <strong>selalu dijumlahkan</strong>!</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-center text-xs">
            <TabungKerucutSVG showSurface={false}/>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-center text-xs">
            <TabungBolaSVG showSurface={false}/>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-center text-xs">
            <KerucutBolaSVG/>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Cara Menghitung Luas Permukaan Gabungan",
    icon: "🎨",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm">
          Kunci luas permukaan gabungan: <strong className="text-red-400">kurangi bagian yang tersembunyi</strong>{" "}
          (bagian yang saling menempel di antara dua bangun).
        </p>
        <div className="bg-orange-950/40 border border-orange-700/40 rounded-xl p-4 space-y-3">
          <p className="text-orange-300 font-bold text-sm">📏 Langkah-langkah Menghitung Luas Permukaan:</p>
          <ol className="space-y-2 text-sm text-white/80">
            <li className="flex gap-2"><span className="text-orange-400 font-bold shrink-0">1.</span><span>Identifikasi semua bagian bangun penyusun</span></li>
            <li className="flex gap-2"><span className="text-orange-400 font-bold shrink-0">2.</span><span>Hitung luas permukaan <strong>masing-masing</strong> bangun secara lengkap</span></li>
            <li className="flex gap-2"><span className="text-orange-400 font-bold shrink-0">3.</span><span>Kurangi bagian yang <strong>tersembunyi/menempel</strong> (biasanya lingkaran alas)</span></li>
            <li className="flex gap-2"><span className="text-orange-400 font-bold shrink-0">4.</span><span>Jumlahkan semua bagian yang masih terlihat</span></li>
          </ol>
        </div>
        <CompositeShapeViewer language={language} />
        <div className="space-y-3">
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-4 space-y-2">
            <p className="text-cyan-300 font-bold text-sm">🔵 Tabung + Kerucut (alas di bawah)</p>
            <p className="text-white/70 text-xs mb-2">Kerucut diletakkan di atas tabung, dengan alas kerucut = tutup tabung (jari-jari sama = r)</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <p className="text-white/60">Bagian tabung yang terlihat: alas bawah + selimut tabung (tutup atas tertutup kerucut)</p>
              <p className="text-white/60">Bagian kerucut yang terlihat: selimut kerucut (alas kerucut tertutup oleh tabung)</p>
              <BlockMath math="L = \underbrace{\pi r^2}_{\text{alas tabung}} + \underbrace{2\pi r t_{\text{tab}}}_{\text{selimut tabung}} + \underbrace{\pi r s}_{\text{selimut kerucut}}" />
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-4 space-y-2">
            <p className="text-purple-300 font-bold text-sm">🔵 Tabung + Setengah Bola (di atas)</p>
            <p className="text-white/70 text-xs mb-2">Setengah bola diletakkan di atas tabung, jari-jari sama = r</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <p className="text-white/60">Bagian tabung: alas bawah + selimut tabung (tutup atas = setengah lingkaran, tersembunyi)</p>
              <p className="text-white/60">Bagian setengah bola: luas setengah bola = 2πr²</p>
              <BlockMath math="L = \underbrace{\pi r^2}_{\text{alas tabung}} + \underbrace{2\pi r t}_{\text{selimut tabung}} + \underbrace{2\pi r^2}_{\text{setengah bola}}" />
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-4 space-y-2">
            <p className="text-green-300 font-bold text-sm">⚽ Kerucut + Setengah Bola (di bawah)</p>
            <p className="text-white/70 text-xs mb-2">Kerucut di atas, setengah bola di bawah, jari-jari sama = r</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <p className="text-white/60">Bagian kerucut: selimut kerucut = πrs (alas tersembunyi)</p>
              <p className="text-white/60">Bagian setengah bola: 2πr² (bagian datar tersembunyi)</p>
              <BlockMath math="L = \underbrace{\pi r s}_{\text{selimut kerucut}} + \underbrace{2\pi r^2}_{\text{setengah bola}}" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Cara Menghitung Volume Gabungan",
    icon: "📦",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm">
          Volume gabungan jauh lebih mudah daripada luas permukaan — cukup <strong className="text-green-300">jumlahkan volume</strong>{" "}
          masing-masing bangun penyusun. Tidak ada pengurangan!
        </p>
        <div className="bg-blue-950/50 border border-blue-700/40 rounded-lg p-4 text-sm space-y-2">
          <p className="text-blue-300 font-bold">💡 Prinsip Dasar:</p>
          <BlockMath math="V_{\text{gabungan}} = V_1 + V_2 + V_3 + \ldots" />
          <p className="text-white/70 text-xs">Volume selalu dijumlahkan karena setiap bagian menempati ruang yang berbeda</p>
        </div>
        <div className="space-y-3">
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-4 space-y-2">
            <p className="text-cyan-300 font-bold text-sm">🔵 Tabung + Kerucut</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <BlockMath math="V = \underbrace{\pi r^2 t_{\text{tab}}}_{\text{V tabung}} + \underbrace{\frac{1}{3}\pi r^2 t_{\text{ker}}}_{\text{V kerucut}}" />
              <BlockMath math="V = \pi r^2 \left( t_{\text{tab}} + \frac{t_{\text{ker}}}{3} \right)" />
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-4 space-y-2">
            <p className="text-purple-300 font-bold text-sm">🔵 Tabung + Setengah Bola</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <BlockMath math="V = \underbrace{\pi r^2 t}_{\text{V tabung}} + \underbrace{\frac{2}{3}\pi r^3}_{\text{V ½ bola}}" />
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-4 space-y-2">
            <p className="text-green-300 font-bold text-sm">⚽ Kerucut + Setengah Bola</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <BlockMath math="V = \underbrace{\frac{1}{3}\pi r^2 t}_{\text{V kerucut}} + \underbrace{\frac{2}{3}\pi r^3}_{\text{V ½ bola}}" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Konfigurasi</th>
              <th className="px-3 py-2 text-orange-300 border-r border-slate-700">Luas Permukaan</th>
              <th className="px-3 py-2 text-blue-300">Volume</th>
            </tr></thead>
            <tbody>
              {[
                ["Tabung + Kerucut","πr² + 2πrt + πrs","πr²t + ⅓πr²t_ker"],
                ["Tabung + ½ Bola","πr² + 2πrt + 2πr²","πr²t + ⅔πr³"],
                ["Kerucut + ½ Bola","πrs + 2πr²","⅓πr²t + ⅔πr³"],
                ["Tabung + Tabung","Alas bawah + Selimut1 + Selimut2 + Tutup atas","πr₁²t₁ + πr₂²t₂"],
              ].map(([b, l, v], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{b}</td>
                  <td className="px-3 py-2 text-orange-300 font-mono border-r border-slate-700 text-left">{l}</td>
                  <td className="px-3 py-2 text-blue-300 font-mono text-left">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    title: tt.title,
    icon: "💡",
    content: (
      <div className="space-y-4 font-body">
        <div className="space-y-3">
          <div className="bg-green-950/40 border border-green-700/40 rounded-xl p-4 space-y-2">
            <p className="text-green-300 font-bold text-sm">{tt.luasHeading}</p>
            <ol className="space-y-2 text-sm text-white/80 text-xs">
              {tt.luasSteps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
          <div className="bg-blue-950/40 border border-blue-700/40 rounded-xl p-4 space-y-2">
            <p className="text-blue-300 font-bold text-sm">{tt.volumeHeading}</p>
            <ol className="space-y-2 text-sm text-white/80 text-xs">
              {tt.volumeSteps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
          <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-4 space-y-2">
            <p className="text-amber-300 font-bold text-sm">{tt.mistakesHeading}</p>
            <ul className="space-y-1 text-xs text-white/80">
              {tt.mistakes.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
          <p>🚀 <strong>{tt.keyHeading}</strong></p>
          <p>{tt.keyLuas}</p>
          <p>{tt.keyVolume}</p>
        </div>
      </div>
    ),
  },
  ];
}

/* ─────────────────────────────────────────────────────────────
   EXAMPLE PROBLEMS
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const luasSlideTrans = {
  id: { title: "Contoh Soal — Luas Permukaan Gabungan", subtitle: "Latihan bertingkat dari mudah hingga sulit" },
  en: { title: "Examples — Composite Surface Area", subtitle: "Graded practice from easy to hard" },
  ja: { title: "例題 — 複合図形の表面積", subtitle: "易しい問題から難しい問題までの段階的練習" },
} as const;

function getLuasExamples(language: Language): Ex[] {
  return [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        {language === "id" ? (
          <>
            <p>Sebuah topi ulang tahun berbentuk <strong>kerucut</strong> dengan jari-jari alas <InlineMath math="7 \text{ cm}" /> dan garis pelukis <InlineMath math="25 \text{ cm}" /> diletakkan di atas <strong>kepala boneka berbentuk setengah bola</strong> dengan jari-jari yang sama.</p>
            <p>Hitung luas permukaan total bentuk gabungan tersebut! (π = 22/7)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A birthday party hat shaped like a <strong>cone</strong> has a base radius of <InlineMath math="7 \text{ cm}" /> and a slant height of <InlineMath math="25 \text{ cm}" />, placed on top of <strong>a doll's head shaped like a half-sphere</strong> with the same radius.</p>
            <p>Calculate the total surface area of this composite shape! (π = 22/7)</p>
          </>
        ) : (
          <>
            <p>底面の半径が<InlineMath math="7 \text{ cm}" />、母線が<InlineMath math="25 \text{ cm}" />の<strong>円錐</strong>形の誕生日帽子が、同じ半径の<strong>半球形の人形の頭</strong>の上に乗っています。</p>
            <p>この複合図形の表面積の合計を求めなさい！（π = 22/7）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        {language === "id" ? (
          <>
            <p className="text-green-400 font-semibold">Diketahui: r = 7 cm, s = 25 cm</p>
            <p className="text-white/70 text-xs">Kerucut + ½ bola: alas kerucut = lingkaran datar setengah bola → keduanya tersembunyi!</p>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
              <p className="text-white/60">Luas = Selimut kerucut + Luas setengah bola</p>
              <BlockMath math="L_{s_k} = \pi r s = \frac{22}{7} \times 7 \times 25 = 550 \text{ cm}^2" />
              <BlockMath math="L_{\text{½b}} = 2\pi r^2 = 2 \times \frac{22}{7} \times 7^2 = 2 \times \frac{22}{7} \times 49 = 308 \text{ cm}^2" />
              <BlockMath math="L_{\text{tot}} = 550 + 308 = 858 \text{ cm}^2" />
            </div>
            <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
              <p className="text-green-300 font-semibold">✅ Luas permukaan gabungan = <strong>858 cm²</strong></p>
            </div>
          </>
        ) : language === "en" ? (
          <>
            <p className="text-green-400 font-semibold">Given: r = 7 cm, s = 25 cm</p>
            <p className="text-white/70 text-xs">Cone + ½ sphere: the cone's base circle coincides with the half-sphere's flat circle → both are hidden!</p>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
              <p className="text-white/60">Surface area = Cone's lateral surface + Half-sphere's surface</p>
              <BlockMath math="L_{s_k} = \pi r s = \frac{22}{7} \times 7 \times 25 = 550 \text{ cm}^2" />
              <BlockMath math="L_{\text{½b}} = 2\pi r^2 = 2 \times \frac{22}{7} \times 7^2 = 2 \times \frac{22}{7} \times 49 = 308 \text{ cm}^2" />
              <BlockMath math="L_{\text{tot}} = 550 + 308 = 858 \text{ cm}^2" />
            </div>
            <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
              <p className="text-green-300 font-semibold">✅ Combined surface area = <strong>858 cm²</strong></p>
            </div>
          </>
        ) : (
          <>
            <p className="text-green-400 font-semibold">分かっていること：r = 7 cm, s = 25 cm</p>
            <p className="text-white/70 text-xs">円錐 + 半球：円錐の底面と半球の平らな面が重なる → どちらも隠れる！</p>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
              <p className="text-white/60">表面積 = 円錐の側面積 + 半球の表面積</p>
              <BlockMath math="L_{s_k} = \pi r s = \frac{22}{7} \times 7 \times 25 = 550 \text{ cm}^2" />
              <BlockMath math="L_{\text{½b}} = 2\pi r^2 = 2 \times \frac{22}{7} \times 7^2 = 2 \times \frac{22}{7} \times 49 = 308 \text{ cm}^2" />
              <BlockMath math="L_{\text{tot}} = 550 + 308 = 858 \text{ cm}^2" />
            </div>
            <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
              <p className="text-green-300 font-semibold">✅ 複合図形の表面積の合計 = <strong>858 cm²</strong></p>
            </div>
          </>
        )}
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        {language === "id" ? (
          <>
            <p>Sebuah silo (tempat penyimpanan biji-bijian) berbentuk <strong>tabung dengan tutup atas berbentuk kerucut</strong>.</p>
            <p>Jari-jari = <InlineMath math="3 \text{ m}" />, tinggi tabung = <InlineMath math="8 \text{ m}" />, tinggi kerucut = <InlineMath math="4 \text{ m}" />.</p>
            <p>Hitung: (a) luas permukaan luar silo, (b) volume silo. (π = 3,14)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A silo (grain storage container) is shaped like <strong>a cylinder with a cone-shaped cap on top</strong>.</p>
            <p>Radius = <InlineMath math="3 \text{ m}" />, cylinder height = <InlineMath math="8 \text{ m}" />, cone height = <InlineMath math="4 \text{ m}" />.</p>
            <p>Calculate: (a) the silo's outer surface area, (b) the silo's volume. (π = 3.14)</p>
          </>
        ) : (
          <>
            <p>サイロ（穀物貯蔵タンク）は、<strong>上部が円錐形のふたになっている円柱</strong>の形をしています。</p>
            <p>半径 = <InlineMath math="3 \text{ m}" />、円柱の高さ = <InlineMath math="8 \text{ m}" />、円錐の高さ = <InlineMath math="4 \text{ m}" />。</p>
            <p>次を求めなさい：（a）サイロの外側の表面積、（b）サイロの体積。（π = 3.14）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        {language === "id" ? (
          <>
            <p className="text-yellow-400 font-semibold">Diketahui: <InlineMath math="r = 3 \text{ m}, t_t = 8 \text{ m}, t_k = 4 \text{ m}" /></p>
            <p className="text-white/70 text-xs">Garis pelukis kerucut: <InlineMath math="s = \sqrt{r^2 + t_k^2} = \sqrt{9 + 16} = \sqrt{25} = 5 \text{ m}" /></p>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
              <p className="text-orange-300 font-semibold">(a) Luas Permukaan:</p>
              <p className="text-white/60">= Alas tabung + Selimut tabung + Selimut kerucut (tutup tabung tertutup kerucut)</p>
              <BlockMath math="L = \pi r^2 + 2\pi r t_t + \pi r s" />
              <BlockMath math="L = 3{,}14 \times 9 + 2 \times 3{,}14 \times 3 \times 8 + 3{,}14 \times 3 \times 5" />
              <BlockMath math="L = 28{,}26 + 150{,}72 + 47{,}1 = 226{,}08 \text{ m}^2" />
              <p className="text-blue-300 font-semibold mt-2">(b) Volume:</p>
              <BlockMath math="V = \pi r^2 t_t + \frac{1}{3}\pi r^2 t_k" />
              <BlockMath math="V = 3{,}14 \times 9 \times 8 + \frac{1}{3} \times 3{,}14 \times 9 \times 4" />
              <BlockMath math="V = 226{,}08 + 37{,}68 = 263{,}76 \text{ m}^3" />
            </div>
            <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs space-y-1">
              <p className="text-yellow-300 font-semibold">✅ Jawaban:</p>
              <p className="text-white/80">• Luas permukaan = <strong className="text-orange-300">226,08 m²</strong></p>
              <p className="text-white/80">• Volume = <strong className="text-blue-300">263,76 m³</strong></p>
            </div>
          </>
        ) : language === "en" ? (
          <>
            <p className="text-yellow-400 font-semibold">Given: <InlineMath math="r = 3 \text{ m}, t_t = 8 \text{ m}, t_k = 4 \text{ m}" /></p>
            <p className="text-white/70 text-xs">Cone's slant height: <InlineMath math="s = \sqrt{r^2 + t_k^2} = \sqrt{9 + 16} = \sqrt{25} = 5 \text{ m}" /></p>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
              <p className="text-orange-300 font-semibold">(a) Surface Area:</p>
              <p className="text-white/60">= Cylinder's base + Cylinder's lateral surface + Cone's lateral surface (the cylinder's top is covered by the cone)</p>
              <BlockMath math="L = \pi r^2 + 2\pi r t_t + \pi r s" />
              <BlockMath math="L = 3.14 \times 9 + 2 \times 3.14 \times 3 \times 8 + 3.14 \times 3 \times 5" />
              <BlockMath math="L = 28.26 + 150.72 + 47.1 = 226.08 \text{ m}^2" />
              <p className="text-blue-300 font-semibold mt-2">(b) Volume:</p>
              <BlockMath math="V = \pi r^2 t_t + \frac{1}{3}\pi r^2 t_k" />
              <BlockMath math="V = 3.14 \times 9 \times 8 + \frac{1}{3} \times 3.14 \times 9 \times 4" />
              <BlockMath math="V = 226.08 + 37.68 = 263.76 \text{ m}^3" />
            </div>
            <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs space-y-1">
              <p className="text-yellow-300 font-semibold">✅ Answer:</p>
              <p className="text-white/80">• Surface area = <strong className="text-orange-300">226.08 m²</strong></p>
              <p className="text-white/80">• Volume = <strong className="text-blue-300">263.76 m³</strong></p>
            </div>
          </>
        ) : (
          <>
            <p className="text-yellow-400 font-semibold">分かっていること：<InlineMath math="r = 3 \text{ m}, t_t = 8 \text{ m}, t_k = 4 \text{ m}" /></p>
            <p className="text-white/70 text-xs">円錐の母線：<InlineMath math="s = \sqrt{r^2 + t_k^2} = \sqrt{9 + 16} = \sqrt{25} = 5 \text{ m}" /></p>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
              <p className="text-orange-300 font-semibold">（a）表面積：</p>
              <p className="text-white/60">= 円柱の底面 + 円柱の側面 + 円錐の側面（円柱の上部は円錐で覆われている）</p>
              <BlockMath math="L = \pi r^2 + 2\pi r t_t + \pi r s" />
              <BlockMath math="L = 3.14 \times 9 + 2 \times 3.14 \times 3 \times 8 + 3.14 \times 3 \times 5" />
              <BlockMath math="L = 28.26 + 150.72 + 47.1 = 226.08 \text{ m}^2" />
              <p className="text-blue-300 font-semibold mt-2">（b）体積：</p>
              <BlockMath math="V = \pi r^2 t_t + \frac{1}{3}\pi r^2 t_k" />
              <BlockMath math="V = 3.14 \times 9 \times 8 + \frac{1}{3} \times 3.14 \times 9 \times 4" />
              <BlockMath math="V = 226.08 + 37.68 = 263.76 \text{ m}^3" />
            </div>
            <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs space-y-1">
              <p className="text-yellow-300 font-semibold">✅ 答え：</p>
              <p className="text-white/80">• 表面積 = <strong className="text-orange-300">226.08 m²</strong></p>
              <p className="text-white/80">• 体積 = <strong className="text-blue-300">263.76 m³</strong></p>
            </div>
          </>
        )}
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        {language === "id" ? (
          <>
            <p>Sebuah kapsul obat berbentuk <strong>tabung dengan dua ujung setengah bola</strong> (tabung di tengah, setengah bola di kiri dan kanan).</p>
            <p>Panjang total kapsul = <InlineMath math="14 \text{ mm}" />, jari-jari = <InlineMath math="2 \text{ mm}" />.</p>
            <p>Hitung: (a) luas permukaan kapsul, (b) volume kapsul. (π = 22/7)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A medicine capsule is shaped like <strong>a cylinder with a half-sphere at each end</strong> (cylinder in the middle, half-spheres on the left and right).</p>
            <p>Total capsule length = <InlineMath math="14 \text{ mm}" />, radius = <InlineMath math="2 \text{ mm}" />.</p>
            <p>Calculate: (a) the capsule's surface area, (b) the capsule's volume. (π = 22/7)</p>
          </>
        ) : (
          <>
            <p>カプセル薬は、<strong>中央が円柱で両端が半球</strong>になっている形をしています（中央に円柱、左右に半球）。</p>
            <p>カプセルの全長 = <InlineMath math="14 \text{ mm}" />、半径 = <InlineMath math="2 \text{ mm}" />。</p>
            <p>次を求めなさい：（a）カプセルの表面積、（b）カプセルの体積。（π = 22/7）</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        {language === "id" ? (
          <>
            <p className="text-red-400 font-semibold">Analisis bentuk kapsul:</p>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
              <p className="text-white/70">Kapsul = Tabung + 2 × setengah bola = Tabung + 1 Bola Penuh</p>
              <p className="text-white/70">Tinggi tabung: panjang total - 2r = 14 - 2(2) = 14 - 4 = 10 mm</p>
              <p className="text-white/70"><InlineMath math="r = 2 \text{ mm}, t_t = 10 \text{ mm}" /></p>
            </div>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
              <p className="text-orange-300 font-semibold">(a) Luas Permukaan:</p>
              <p className="text-white/60">= Selimut tabung + Luas 1 bola penuh (dua ujung setengah bola = 1 bola)</p>
              <p className="text-white/60">Catatan: kedua lingkaran "sambungan" tersembunyi di dalam</p>
              <BlockMath math="L = 2\pi r t_t + 4\pi r^2" />
              <BlockMath math="L = 2 \times \frac{22}{7} \times 2 \times 10 + 4 \times \frac{22}{7} \times 4" />
              <BlockMath math="L = \frac{880}{7} + \frac{352}{7} = \frac{1232}{7} = 176 \text{ mm}^2" />
              <p className="text-blue-300 font-semibold mt-2">(b) Volume:</p>
              <BlockMath math="V = \pi r^2 t_t + \frac{4}{3}\pi r^3" />
              <BlockMath math="V = \frac{22}{7} \times 4 \times 10 + \frac{4}{3} \times \frac{22}{7} \times 8" />
              <BlockMath math="V = \frac{880}{7} + \frac{704}{21} = \frac{2640}{21} + \frac{704}{21} = \frac{3344}{21} \approx 159{,}24 \text{ mm}^3" />
            </div>
            <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-1">
              <p className="text-red-300 font-semibold">✅ Jawaban:</p>
              <p className="text-white/80">• Luas permukaan kapsul = <strong className="text-orange-300">176 mm²</strong></p>
              <p className="text-white/80">• Volume kapsul ≈ <strong className="text-blue-300">159,24 mm³</strong></p>
              <p className="text-cyan-300 mt-1">💡 Trik: 2 × setengah bola = 1 bola penuh → gunakan rumus bola 4πr²</p>
            </div>
          </>
        ) : language === "en" ? (
          <>
            <p className="text-red-400 font-semibold">Analyzing the capsule's shape:</p>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
              <p className="text-white/70">Capsule = Cylinder + 2 × half-sphere = Cylinder + 1 full sphere</p>
              <p className="text-white/70">Cylinder height: total length - 2r = 14 - 2(2) = 14 - 4 = 10 mm</p>
              <p className="text-white/70"><InlineMath math="r = 2 \text{ mm}, t_t = 10 \text{ mm}" /></p>
            </div>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
              <p className="text-orange-300 font-semibold">(a) Surface Area:</p>
              <p className="text-white/60">= Cylinder's lateral surface + 1 full sphere's surface (the two half-sphere ends form 1 sphere)</p>
              <p className="text-white/60">Note: both "joint" circles are hidden inside</p>
              <BlockMath math="L = 2\pi r t_t + 4\pi r^2" />
              <BlockMath math="L = 2 \times \frac{22}{7} \times 2 \times 10 + 4 \times \frac{22}{7} \times 4" />
              <BlockMath math="L = \frac{880}{7} + \frac{352}{7} = \frac{1232}{7} = 176 \text{ mm}^2" />
              <p className="text-blue-300 font-semibold mt-2">(b) Volume:</p>
              <BlockMath math="V = \pi r^2 t_t + \frac{4}{3}\pi r^3" />
              <BlockMath math="V = \frac{22}{7} \times 4 \times 10 + \frac{4}{3} \times \frac{22}{7} \times 8" />
              <BlockMath math="V = \frac{880}{7} + \frac{704}{21} = \frac{2640}{21} + \frac{704}{21} = \frac{3344}{21} \approx 159.24 \text{ mm}^3" />
            </div>
            <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-1">
              <p className="text-red-300 font-semibold">✅ Answer:</p>
              <p className="text-white/80">• Capsule surface area = <strong className="text-orange-300">176 mm²</strong></p>
              <p className="text-white/80">• Capsule volume ≈ <strong className="text-blue-300">159.24 mm³</strong></p>
              <p className="text-cyan-300 mt-1">💡 Trick: 2 × half-sphere = 1 full sphere → use the sphere formula 4πr²</p>
            </div>
          </>
        ) : (
          <>
            <p className="text-red-400 font-semibold">カプセルの形を分析する：</p>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
              <p className="text-white/70">カプセル = 円柱 + 半球 × 2 = 円柱 + 完全な球1個</p>
              <p className="text-white/70">円柱の高さ：全長 - 2r = 14 - 2(2) = 14 - 4 = 10 mm</p>
              <p className="text-white/70"><InlineMath math="r = 2 \text{ mm}, t_t = 10 \text{ mm}" /></p>
            </div>
            <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
              <p className="text-orange-300 font-semibold">（a）表面積：</p>
              <p className="text-white/60">= 円柱の側面 + 完全な球1個の表面積（両端の半球2つ = 球1個）</p>
              <p className="text-white/60">注：2つの「接合部」の円は内部に隠れている</p>
              <BlockMath math="L = 2\pi r t_t + 4\pi r^2" />
              <BlockMath math="L = 2 \times \frac{22}{7} \times 2 \times 10 + 4 \times \frac{22}{7} \times 4" />
              <BlockMath math="L = \frac{880}{7} + \frac{352}{7} = \frac{1232}{7} = 176 \text{ mm}^2" />
              <p className="text-blue-300 font-semibold mt-2">（b）体積：</p>
              <BlockMath math="V = \pi r^2 t_t + \frac{4}{3}\pi r^3" />
              <BlockMath math="V = \frac{22}{7} \times 4 \times 10 + \frac{4}{3} \times \frac{22}{7} \times 8" />
              <BlockMath math="V = \frac{880}{7} + \frac{704}{21} = \frac{2640}{21} + \frac{704}{21} = \frac{3344}{21} \approx 159.24 \text{ mm}^3" />
            </div>
            <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-1">
              <p className="text-red-300 font-semibold">✅ 答え：</p>
              <p className="text-white/80">• カプセルの表面積 = <strong className="text-orange-300">176 mm²</strong></p>
              <p className="text-white/80">• カプセルの体積 ≈ <strong className="text-blue-300">159.24 mm³</strong></p>
              <p className="text-cyan-300 mt-1">💡 コツ：半球2個 = 球1個 → 球の公式 4πr² を使う</p>
            </div>
          </>
        )}
      </div>
    ),
  },
  ];
}

const volExamples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah ember berbentuk tabung memiliki jari-jari <InlineMath math="14 \text{ cm}" /> dan tinggi <InlineMath math="20 \text{ cm}" />.</p>
        <p>Di atas ember, diletakkan sebuah bola plastik (padat) dengan jari-jari <InlineMath math="7 \text{ cm}" /> yang sedikit tenggelam ke dalam ember.</p>
        <p>Hitung volume total bola + ember. (π = 22/7)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <p className="text-white/70">V tabung = πr²t = (22/7) × 14² × 20</p>
          <BlockMath math="V_{\text{tabung}} = \frac{22}{7} \times 196 \times 20 = 12.320 \text{ cm}^3" />
          <p className="text-white/70">V bola = (4/3)πr³ = (4/3) × (22/7) × 7³</p>
          <BlockMath math="V_{\text{bola}} = \frac{4}{3} \times \frac{22}{7} \times 343 = \frac{4}{3} \times 22 \times 49 = \frac{4312}{3} \approx 1.437{,}3 \text{ cm}^3" />
          <BlockMath math="V_{\text{total}} = 12.320 + 1.437{,}3 = 13.757{,}3 \text{ cm}^3" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-2">
          <p className="text-green-300 font-semibold text-xs">✅ Volume total ≈ <strong>13.757,3 cm³</strong></p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah tangki air berbentuk <strong>tabung dengan tutup atas berupa setengah bola</strong> (seperti tanki roket).</p>
        <p>Jari-jari = <InlineMath math="0{,}5 \text{ m}" />, tinggi bagian tabung = <InlineMath math="1{,}5 \text{ m}" />.</p>
        <p>Jika tangki terisi penuh, berapa liter air yang tersimpan? (π = 3,14 ; 1 m³ = 1000 liter)</p>
      </div>
    ),
    answer: (
      <div className="space-y-2 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
          <p className="text-white/70">V tabung = πr²t = 3,14 × 0,25 × 1,5</p>
          <BlockMath math="V_{\text{tabung}} = 3{,}14 \times 0{,}25 \times 1{,}5 = 1{,}1775 \text{ m}^3" />
          <p className="text-white/70">V ½ bola = (2/3)πr³ = (2/3) × 3,14 × 0,125</p>
          <BlockMath math="V_{\frac{1}{2}\text{bola}} = \frac{2}{3} \times 3{,}14 \times 0{,}125 = \frac{0{,}785}{3} \approx 0{,}2617 \text{ m}^3" />
          <BlockMath math="V_{\text{total}} = 1{,}1775 + 0{,}2617 = 1{,}4392 \text{ m}^3 \approx 1.439{,}2 \text{ liter}" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-2">
          <p className="text-yellow-300 font-semibold text-xs">✅ Tangki menampung ≈ <strong>1.439 liter</strong> air</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD COMPONENT
───────────────────────────────────────────────────────────── */

const ExampleCard = ({ ex, idx, prefix }: { ex: Ex; idx: number; prefix: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            {prefix} {idx + 1} — {ex.level}
          </span>
        </div>
        {ex.question}
      </div>
      <button onClick={() => { playPopSound(); setShow(v => !v); }}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-800/60 hover:bg-slate-800/90 transition-colors cursor-pointer border-t border-slate-700/50">
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{show ? "Sembunyikan" : "Lihat Pembahasan"}</span>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground"/> : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
      </button>
      {show && <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">{ex.answer}</div>}
    </div>
  );
};

const pageTrans = {
  id: { title: "BANGUN RUANG SISI LENGKUNG GABUNGAN", subtitle: "Kelas 9 · Bangun Ruang Sisi Lengkung" },
  en: { title: "COMPOSITE CURVED-SURFACE SOLIDS", subtitle: "Grade 9 · Curved-Surface Solids" },
  ja: { title: "複合曲面図形", subtitle: "中学3年・曲面図形" },
} as const;

const tipsTrans = {
  id: {
    title: "Tips & Strategi Mengerjakan Soal",
    luasHeading: "✅ Strategi Luas Permukaan:",
    luasSteps: [
      <>1. <strong className="text-white">Gambar sketsanya!</strong> Visualisasi sangat membantu.</>,
      <>2. Identifikasi semua bagian permukaan yang <strong>terlihat dari luar</strong>.</>,
      <>3. Permukaan yang <strong>"tertutup" oleh bangun lain</strong> → dikurangi (tidak dihitung).</>,
      <>4. Hitung setiap komponen permukaan secara terpisah, lalu jumlahkan.</>,
    ],
    volumeHeading: "✅ Strategi Volume:",
    volumeSteps: [
      <>1. <strong>Selalu jumlahkan</strong> volume setiap bangun penyusun.</>,
      <>2. Pastikan satuan semua dimensi <strong>sama</strong> sebelum menghitung.</>,
      <>3. Perhatikan apakah bangun "berlubang" (misalnya pipa) — kalau ada lubang, volume berkurang.</>,
    ],
    mistakesHeading: "⚠️ Kesalahan Umum:",
    mistakes: [
      "❌ Lupa mengurangi bidang persekutuan pada luas permukaan",
      "❌ Mengurangi volume (volume tidak pernah dikurangi kecuali ada rongga)",
      "❌ Menggunakan jari-jari yang berbeda untuk dua bangun yang terhubung",
      "❌ Lupa bahwa luas setengah bola = 2πr² (bukan 2πr²/2)",
    ],
    keyHeading: "🚀 Kunci sukses:",
    keyLuas: "• Luas: Gambar → Identifikasi sisi luar → Kurangi sisi tersembunyi → Jumlahkan",
    keyVolume: "• Volume: Jumlahkan langsung semua V penyusun",
  },
  en: {
    title: "Tips & Problem-Solving Strategies",
    luasHeading: "✅ Surface Area Strategy:",
    luasSteps: [
      <>1. <strong className="text-white">Draw a sketch!</strong> Visualization helps a lot.</>,
      <>2. Identify every surface part <strong>visible from the outside</strong>.</>,
      <>3. Surfaces <strong>"covered" by another shape</strong> → subtract them (don't count them).</>,
      <>4. Calculate each surface component separately, then add them up.</>,
    ],
    volumeHeading: "✅ Volume Strategy:",
    volumeSteps: [
      <>1. <strong>Always add up</strong> the volume of every component shape.</>,
      <>2. Make sure all dimension units are <strong>the same</strong> before calculating.</>,
      <>3. Check whether the shape is "hollow" (e.g. a pipe) — if there's a cavity, the volume decreases.</>,
    ],
    mistakesHeading: "⚠️ Common Mistakes:",
    mistakes: [
      "❌ Forgetting to subtract the shared (touching) surface area",
      "❌ Subtracting volume (volume is never subtracted unless there's a cavity)",
      "❌ Using different radii for two connected shapes",
      "❌ Forgetting that a half-sphere's surface area = 2πr² (not 2πr²/2)",
    ],
    keyHeading: "🚀 Key to success:",
    keyLuas: "• Surface area: Sketch → Identify outer surfaces → Subtract hidden surfaces → Add up",
    keyVolume: "• Volume: Directly add up all the component volumes",
  },
  ja: {
    title: "問題を解くヒントと戦略",
    luasHeading: "✅ 表面積の戦略：",
    luasSteps: [
      <>1. <strong className="text-white">スケッチを描こう！</strong>可視化はとても役立ちます。</>,
      <>2. 外から<strong>見える表面部分</strong>をすべて特定する。</>,
      <>3. 他の図形に<strong>「隠れている」表面</strong> → 引く（計算しない）。</>,
      <>4. 各表面部分を個別に計算し、最後に合計する。</>,
    ],
    volumeHeading: "✅ 体積の戦略：",
    volumeSteps: [
      <>1. 各構成図形の体積を<strong>常に足し合わせる</strong>。</>,
      <>2. 計算前にすべての寸法の単位を<strong>揃える</strong>。</>,
      <>3. 図形が「空洞」になっていないか確認する（例：パイプ）。空洞があれば体積は減る。</>,
    ],
    mistakesHeading: "⚠️ よくある間違い：",
    mistakes: [
      "❌ 表面積で共通部分（接触面）を引き忘れる",
      "❌ 体積を引いてしまう（空洞がない限り体積は引かない）",
      "❌ 接続された2つの図形で異なる半径を使う",
      "❌ 半球の表面積 = 2πr² であることを忘れる（2πr²/2ではない）",
    ],
    keyHeading: "🚀 成功の鍵：",
    keyLuas: "• 表面積：スケッチ → 外側の面を特定 → 隠れた面を引く → 合計する",
    keyVolume: "• 体積：構成する体積をそのまま合計する",
  },
} as const;

const slide1Trans = {
  id: {
    title: "Pengantar: Bangun Gabungan",
    intro: (
      <>
        Silo penyimpanan padi, kapsul roket, atau es krim cone — semua adalah contoh{" "}
        <strong className="text-cyan-300">bangun gabungan</strong> dalam kehidupan nyata! Di sini kamu akan belajar
        cara menghitung <strong className="text-orange-300">luas permukaan</strong> dan{" "}
        <strong className="text-blue-300">volume</strong> ketika dua atau lebih bangun sisi lengkung digabungkan menjadi satu.
      </>
    ),
  },
  en: {
    title: "Introduction: Composite Shapes",
    intro: (
      <>
        A grain silo, a medicine capsule, or an ice-cream cone — these are all real-life examples of{" "}
        <strong className="text-cyan-300">composite shapes</strong>! Here you'll learn
        how to calculate the <strong className="text-orange-300">surface area</strong> and{" "}
        <strong className="text-blue-300">volume</strong> when two or more curved-surface solids are combined into one shape.
      </>
    ),
  },
  ja: {
    title: "はじめに：複合図形",
    intro: (
      <>
        穀物サイロ、カプセル薬、アイスクリームコーン — これらはすべて{" "}
        <strong className="text-cyan-300">複合図形</strong>の身近な例です！ここでは、2つ以上の曲面図形を組み合わせたときの{" "}
        <strong className="text-orange-300">表面積</strong>と<strong className="text-blue-300">体積</strong>の求め方を学びます。
      </>
    ),
  },
} as const;

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const GabunganPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const pt = pageTrans[language];
  const s1 = slide1Trans[language];
  const sections = getSections(language);
  const lst = luasSlideTrans[language];
  const luasExamples = getLuasExamples(language);

  const slides = [
    {
      title: s1.title,
      icon: "🧩",
      content: (
        <div className="space-y-4 font-body">
          <p className="text-white/80 text-sm leading-relaxed">
            {s1.intro}
          </p>
          <CompositeShapeViewer language={language} />
        </div>
      ),
    },
    ...sections.map(sec => ({ title: sec.title, icon: sec.icon, content: sec.content })),
    {
      title: lst.title,
      icon: "🎨",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">{lst.subtitle}</p>
          <div className="flex flex-col gap-4">
            {luasExamples.map((ex, i) => <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix="LUAS"/>)}
          </div>
        </div>
      ),
    },
    {
      title: "Contoh Soal — Volume Gabungan",
      icon: "📦",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          <div className="flex flex-col gap-4">
            {volExamples.map((ex, i) => <ExampleCard key={`v${i}`} ex={ex} idx={i} prefix="VOL"/>)}
          </div>
        </div>
      ),
    },
  ];

  const total = slides.length;
  const slide = slides[currentSlide];

  const goPrev = () => { playPopSound(); setCurrentSlide(i => Math.max(0, i - 1)); };
  const goNext = () => { playPopSound(); setCurrentSlide(i => Math.min(total - 1, i + 1)); };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Layers className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          {pt.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{pt.subtitle}</p>

        <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { playPopSound(); setCurrentSlide(i); }}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === currentSlide ? "bg-primary scale-125" : "bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
            <span className="text-2xl">{slide.icon}</span>
            <h2 className="font-display text-sm font-semibold text-white">{slide.title}</h2>
            <span className="ml-auto text-xs text-white/30 font-body">{currentSlide + 1}/{total}</span>
          </div>
          <div className="px-5 py-5">{slide.content}</div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-body border border-border rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-default"
          >
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === total - 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-body border border-border rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-default"
          >
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Bangun Ruang Sisi Lengkung
          </button>
        </div>
      </div>
    </div>
  );
};

export default GabunganPage;
