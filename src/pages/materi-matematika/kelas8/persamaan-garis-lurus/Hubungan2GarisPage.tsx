import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, Layers, GitBranch } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const W = 180, H = 150, MX = 90, MY = 75, SC = 14;
const toX = (x: number) => MX + x * SC;
const toY = (y: number) => MY - y * SC;

const CoordSys = ({ children, label = "" }: { children?: React.ReactNode; label?: string }) => (
  <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ maxHeight: 170, background: "rgba(15,23,42,0.7)" }}>
    {[-5,-4,-3,-2,-1,1,2,3,4,5].map(v => (
      <g key={v}>
        <line x1={MX+v*SC*0.7} y1={4} x2={MX+v*SC*0.7} y2={H-4} stroke="#1e293b" strokeWidth="0.7" />
        <line x1={4} y1={MY-v*SC*0.7} x2={W-4} y2={MY-v*SC*0.7} stroke="#1e293b" strokeWidth="0.7" />
      </g>
    ))}
    <line x1={4} y1={MY} x2={W-4} y2={MY} stroke="#475569" strokeWidth="1.5" />
    <line x1={MX} y1={H-4} x2={MX} y2={4} stroke="#475569" strokeWidth="1.5" />
    <text x={W-10} y={MY+11} fill="#64748b" fontSize="8">x</text>
    <text x={MX+3} y={11} fill="#64748b" fontSize="8">y</text>
    <text x={MX+2} y={MY+10} fill="#475569" fontSize="7">O</text>
    {label && <text x={5} y={13} fill="#94a3b8" fontSize="8">{label}</text>}
    {children}
  </svg>
);

const gPts = (m: number, c: number) =>
  [-7, -4, -1, 2, 5, 7].map(x => `${toX(x)},${toY(m * x + c)}`).join(' ');

const perpMark = (ix: number, iy: number, m1: number, m2: number, d = 0.48) => {
  const n1 = Math.sqrt(1 + m1 * m1), n2 = Math.sqrt(1 + m2 * m2);
  const u1x = d / n1, u1y = d * m1 / n1;
  const u2x = d / n2, u2y = d * m2 / n2;
  return [
    [toX(ix),           toY(iy)],
    [toX(ix + u1x),     toY(iy + u1y)],
    [toX(ix+u1x+u2x),  toY(iy+u1y+u2y)],
    [toX(ix + u2x),     toY(iy + u2y)],
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
};

const lineIntersect = (m1: number, c1: number, m2: number, c2: number): [number,number]|null => {
  if (Math.abs(m1 - m2) < 1e-9) return null;
  const x = (c2 - c1) / (m1 - m2);
  return [x, m1 * x + c1];
};

const gcd = (a: number, b: number): number => { a=Math.abs(a); b=Math.abs(b); while(b){const t=b;b=a%b;a=t;} return a||1; };
const mTeX = (m: number): string => {
  const r = Math.round(m * 1000) / 1000;
  if (Number.isInteger(r)) return String(r);
  for (let d = 2; d <= 9; d++) {
    const n = Math.round(m * d);
    if (Math.abs(n / d - m) < 0.001) {
      const g = gcd(Math.abs(n), d);
      const sn = n / g, sd = d / g;
      if (sd === 1) return String(sn);
      return sn < 0 ? `-\\frac{${-sn}}{${sd}}` : `\\frac{${sn}}{${sd}}`;
    }
  }
  return String(r);
};
const mDisp = (m: number): string => {
  const r = Math.round(m * 1000) / 1000;
  if (Number.isInteger(r)) return String(r);
  for (let d = 2; d <= 9; d++) {
    const n = Math.round(m * d);
    if (Math.abs(n / d - m) < 0.001) {
      const g = gcd(Math.abs(n), d);
      const sn = n / g, sd = d / g;
      if (sd === 1) return String(sn);
      return sn < 0 ? `−${-sn}/${sd}` : `${sn}/${sd}`;
    }
  }
  return String(r);
};

const SEJ_OPTS = [-2, -1, -0.5, 0.5, 1, 2, 3];
const TEK_OPTS = [-3, -2, -1, 1, 2, 3];
const BER_OPTS = [-2, -1, 1, 2, 3];

const T_HUBUNGAN = {
  id: {
    title: "HUBUNGAN DUA GARIS",
    subtitle: "Sejajar, Tegak Lurus, atau Berpotongan?",
    breadcrumb: "Kelas 8 · Persamaan Garis Lurus · Materi Matematika",
    sh_intro: "🌟 Tiga Kemungkinan Hubungan Dua Garis",
    sh_sejajar: "∥ Garis Sejajar",
    sh_tegaklurus: "⊥ Garis Tegak Lurus (Saling Berpotongan 90°)",
    sh_berpotongan: "✕ Garis Berpotongan (Tidak Sejajar, Tidak Tegak Lurus)",
    sh_visual: "🎨 Galeri Visual: Perbandingan Tiga Hubungan Garis",
    sh_contoh1: "✏️ Contoh 1 — Tingkat Mudah",
    sh_contoh2: "✏️ Contoh 2 — Tingkat Sedang",
    sh_contoh3: "✏️ Contoh 3 — Tingkat Sulit",
    sh_rangkuman: "📌 Rangkuman",
    back: "← Kembali ke Persamaan Garis Lurus",
    mudah: "MUDAH", sedang: "SEDANG", sulit: "SULIT",
  },
  en: {
    title: "RELATIONSHIP BETWEEN TWO LINES",
    subtitle: "Parallel, Perpendicular, or Intersecting?",
    breadcrumb: "Grade 8 · Equation of a Line · Mathematics",
    sh_intro: "🌟 Three Possible Relationships Between Two Lines",
    sh_sejajar: "∥ Parallel Lines",
    sh_tegaklurus: "⊥ Perpendicular Lines (Intersect at 90°)",
    sh_berpotongan: "✕ Intersecting Lines (Not Parallel, Not Perpendicular)",
    sh_visual: "🎨 Visual Gallery: Comparing Three Line Relationships",
    sh_contoh1: "✏️ Example 1 — Easy Level",
    sh_contoh2: "✏️ Example 2 — Medium Level",
    sh_contoh3: "✏️ Example 3 — Hard Level",
    sh_rangkuman: "📌 Summary",
    back: "← Back to Equation of a Line",
    mudah: "EASY", sedang: "MEDIUM", sulit: "HARD",
  },
  ja: {
    title: "2直線の関係",
    subtitle: "平行・垂直・交差のどれ？",
    breadcrumb: "中学2年 · 直線の方程式 · 数学",
    sh_intro: "🌟 2直線の3つの関係",
    sh_sejajar: "∥ 平行な直線",
    sh_tegaklurus: "⊥ 垂直な直線（90°で交わる）",
    sh_berpotongan: "✕ 交差する直線（平行でも垂直でもない）",
    sh_visual: "🎨 ビジュアルギャラリー：3つの関係を比較",
    sh_contoh1: "✏️ 例題1 — 基本レベル",
    sh_contoh2: "✏️ 例題2 — 標準レベル",
    sh_contoh3: "✏️ 例題3 — 発展レベル",
    sh_rangkuman: "📌 まとめ",
    back: "← 直線の方程式に戻る",
    mudah: "基本", sedang: "標準", sulit: "発展",
  },
};

const Hubungan2GarisPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = T_HUBUNGAN[language];
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "sejajar", "tegaklurus", "berpotongan", "visual-trio", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);
  const toggle = (s: string) => { playPopSound(); setExpandedSections(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); };
  const SH = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span className={iconColor}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );
  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const [sejM, setSejM] = useState(2);
  const [tekM1, setTekM1] = useState(2);
  const tekM2 = -1 / tekM1;
  const [berM1, setBerM1] = useState(2);
  const [berM2, setBerM2] = useState(-1);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <GitBranch className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.title}</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.subtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sh_intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">Ketika dua garis lurus ada di bidang yang sama, hanya ada tiga kemungkinan hubungan di antara mereka. Hubungan ini ditentukan oleh nilai gradien masing-masing garis.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "SEJAJAR", icon: "∥", color: "#22d3ee", bg: "border-cyan-500/40 bg-cyan-900/20", ket: "Tidak pernah bertemu" },
                    { label: "TEGAK LURUS", icon: "⊥", color: "#a78bfa", bg: "border-violet-500/40 bg-violet-900/20", ket: "Berpotongan 90°" },
                    { label: "BERPOTONGAN", icon: "✕", color: "#4ade80", bg: "border-green-500/40 bg-green-900/20", ket: "Bertemu di satu titik" },
                  ].map(({ label, icon, color, bg, ket }) => (
                    <div key={label} className={`border ${bg} rounded-xl p-3 text-center`}>
                      <div className="text-3xl mb-1" style={{ color }}>{icon}</div>
                      <p className="text-xs font-bold text-white">{label}</p>
                      <p className="text-xs text-white/40 mt-1">{ket}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SEJAJAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="sejajar" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sh_sejajar} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-900/20 border border-cyan-500/40 rounded-xl p-4">
                  <p className="text-sm font-semibold text-cyan-300 mb-2 font-body">🎯 Syarat Garis Sejajar</p>
                  <div className="text-center">
                    <BlockMath math="m_1 = m_2 \quad \wedge \quad c_1 \neq c_2" />
                  </div>
                  <p className="text-xs text-white/60 text-center mt-1">Gradien sama, titik potong sb-y berbeda</p>
                </div>

                {/* Penjelasan MENGAPA */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-cyan-300 uppercase tracking-wide">💡 Mengapa harus m₁ = m₂?</p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    Gradien (m) menunjukkan <strong className="text-cyan-300">kecuraman atau laju kenaikan</strong> sebuah garis — setiap bergerak 1 satuan ke kanan, garis naik sebesar m. Jika dua garis punya gradien sama, keduanya <em>naik dan turun dengan laju yang identik</em>.
                  </p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    Bayangkan dua mobil yang melaju dengan kecepatan yang sama: mobil A selalu 5 km di depan mobil B. Mobil B tidak akan pernah menyalip A karena lajunya sama persis. Begitu juga dua garis sejajar — jarak vertikal antara keduanya selalu konstan sebesar <InlineMath math="|c_1 - c_2|" />, sehingga tidak pernah bertemu.
                  </p>
                  <div className="bg-cyan-900/30 rounded-lg p-2 text-xs font-body">
                    <p className="text-cyan-200">📌 Jika c₁ = c₂ juga: kedua garis <strong>berimpit</strong> (sama persis, bukan sejajar).</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-cyan-300 mb-2">Visual: Dua garis sejajar</p>
                    <CoordSys label="ℓ₁ ∥ ℓ₂">
                      <polyline points={[[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3],[2,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-1,-5],[0,-3],[1,-1],[2,1],[3,3],[4,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3" />
                      <text x={toX(-2.5)} y={toY(4)} fill="#22d3ee" fontSize="8">ℓ₁: y=2x+1</text>
                      <text x={toX(0)} y={toY(-4)} fill="#67e8f9" fontSize="8">ℓ₂: y=2x−3</text>
                    </CoordSys>
                    <p className="text-xs text-white/40 text-center mt-1">Keduanya m=2, tidak berpotongan</p>
                  </div>
                  <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-cyan-300 mb-2">Contoh pasangan sejajar:</p>
                    <div className="space-y-1.5 text-xs font-body">
                      {[
                        ["y = 3x + 1", "y = 3x − 4", "m = 3"],
                        ["y = −2x + 5", "y = −2x + 1", "m = −2"],
                        ["2x + y = 3", "2x + y = 7", "m = −2"],
                      ].map(([l1, l2, m]) => (
                        <div key={l1} className="bg-cyan-900/30 rounded-lg p-2">
                          <p className="text-cyan-300">{l1} ∥ {l2}</p>
                          <p className="text-white/40">{m} (sama)</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ANIMASI INTERAKTIF SEJAJAR */}
                <div className="bg-cyan-900/10 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">🎮 Animasi Interaktif — Garis Sejajar</p>
                  <p className="text-xs text-white/60 font-body">Ubah nilai gradien m. Amati: kedua garis selalu tetap sejajar karena gradiennya sama!</p>
                  <div className="flex flex-wrap gap-2">
                    {SEJ_OPTS.map(v => (
                      <button key={v} onClick={() => { playPopSound(); setSejM(v); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${sejM === v ? "bg-cyan-500 text-white" : "bg-slate-700/60 text-white/60 hover:bg-slate-600"}`}>
                        m = {mDisp(v)}
                      </button>
                    ))}
                  </div>
                  <CoordSys label={`ℓ₁ ∥ ℓ₂ (m=${mDisp(sejM)})`}>
                    <polyline points={gPts(sejM, 2)} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                    <polyline points={gPts(sejM, -2)} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6,3" />
                    <text x={5} y={H-20} fill="#22d3ee" fontSize="7">ℓ₁: y={mDisp(sejM)}x+2</text>
                    <text x={5} y={H-11} fill="#67e8f9" fontSize="7">ℓ₂: y={mDisp(sejM)}x−2</text>
                  </CoordSys>
                  <div className="bg-cyan-900/30 rounded-lg p-3 text-xs font-body space-y-1">
                    <p className="text-cyan-300 font-semibold">Observasi:</p>
                    <p className="text-white/70">ℓ₁: y = <InlineMath math={`${mTeX(sejM)}x + 2`} />, ℓ₂: y = <InlineMath math={`${mTeX(sejM)}x - 2`} /></p>
                    <p className="text-white/70">Gradien: m₁ = m₂ = <strong className="text-cyan-300">{mDisp(sejM)}</strong> → kedua garis <strong className="text-cyan-300">sejajar</strong></p>
                    <p className="text-white/50">Jarak vertikal antar garis selalu = |2 − (−2)| = 4 (konstan)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TEGAK LURUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="tegaklurus" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={t.sh_tegaklurus} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-900/20 border border-violet-500/40 rounded-xl p-4">
                  <p className="text-sm font-semibold text-violet-300 mb-2 font-body">🎯 Syarat Garis Tegak Lurus</p>
                  <div className="text-center">
                    <BlockMath math="m_1 \times m_2 = -1" />
                    <p className="text-xs text-white/60 mt-1">Perkalian kedua gradien sama dengan −1</p>
                  </div>
                  <div className="bg-violet-900/30 rounded-lg p-3 mt-2">
                    <p className="text-xs text-violet-300 font-semibold mb-1">Artinya jika m₁ diketahui:</p>
                    <BlockMath math="m_2 = -\frac{1}{m_1}" />
                    <p className="text-xs text-white/50">m₂ adalah negatif kebalikan dari m₁</p>
                  </div>
                </div>

                {/* Penjelasan MENGAPA */}
                <div className="bg-slate-800/50 border border-violet-500/20 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-violet-300 uppercase tracking-wide">💡 Mengapa harus m₁ × m₂ = −1?</p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    Bayangkan garis ℓ₁ memiliki gradien m₁, artinya <strong className="text-violet-300">arahnya adalah "bergerak 1 ke kanan, naik m₁"</strong> — vektor arahnya adalah (1, m₁).
                  </p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    Untuk mendapat garis yang tegak lurus, kita perlu memutar vektor ini <strong className="text-violet-300">90°</strong>. Rotasi 90° dari (1, m₁) menghasilkan (−m₁, 1) atau (m₁, −1). Gradien dari arah (−m₁, 1) adalah:
                  </p>
                  <div className="text-center">
                    <BlockMath math="m_2 = \frac{1}{-m_1} = -\frac{1}{m_1}" />
                  </div>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    Maka verifikasi: <InlineMath math="m_1 \times m_2 = m_1 \times \left(-\frac{1}{m_1}\right) = -1" /> ✓
                  </p>
                  <div className="bg-violet-900/30 rounded-lg p-2 text-xs font-body">
                    <p className="text-violet-200">📌 Cara mudah: balik pembilang dan penyebut, lalu ubah tanda. Contoh: m₁ = 3 → m₂ = −⅓. m₁ = −⅔ → m₂ = 3/2.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-300 mb-2">Visual: Dua garis tegak lurus</p>
                    <CoordSys label="ℓ₁ ⊥ ℓ₂">
                      <polyline points={[[-3,-6],[-2,-4],[-1,-2],[0,0],[1,2],[2,4],[3,6]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-4,4],[-2,3],[0,2],[2,1],[4,0],[6,-1]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                      {/* ℓ₁: y=2x, ℓ₂: y=-0.5x+2 → intersect at (0.8,1.6) */}
                      <polygon points={perpMark(0.8, 1.6, 2, -0.5)} fill="none" stroke="#facc15" strokeWidth="1.5" />
                      <text x={toX(-2)} y={toY(5)} fill="#a78bfa" fontSize="8">ℓ₁: y=2x</text>
                      <text x={toX(1)} y={toY(-2)} fill="#f472b6" fontSize="8">ℓ₂: y=−½x+2</text>
                    </CoordSys>
                    <p className="text-xs text-white/40 text-center mt-1">m₁×m₂ = 2×(−½) = −1 ✓</p>
                  </div>
                  <div className="bg-violet-900/10 border border-violet-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-300 mb-2">Contoh pasangan tegak lurus:</p>
                    <div className="space-y-1.5 text-xs font-body">
                      {[
                        { l1: "y = 3x + 1", l2: "y = −⅓x + 2", ket: "3 × (−⅓) = −1 ✓" },
                        { l1: "y = −4x", l2: "y = ¼x + 3", ket: "(−4) × ¼ = −1 ✓" },
                        { l1: "y = ½x − 1", l2: "y = −2x + 5", ket: "½ × (−2) = −1 ✓" },
                      ].map(({ l1, l2, ket }) => (
                        <div key={l1} className="bg-violet-900/30 rounded-lg p-2">
                          <p className="text-violet-300">{l1} ⊥ {l2}</p>
                          <p className="text-white/40">{ket}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ANIMASI INTERAKTIF TEGAK LURUS */}
                <div className="bg-violet-900/10 border border-violet-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">🎮 Animasi Interaktif — Garis Tegak Lurus</p>
                  <p className="text-xs text-white/60 font-body">Pilih gradien m₁. Gradien m₂ otomatis dihitung sebagai <InlineMath math="m_2 = -\frac{1}{m_1}" />. Perhatikan sudut 90° yang terbentuk!</p>
                  <div className="flex flex-wrap gap-2">
                    {TEK_OPTS.map(v => (
                      <button key={v} onClick={() => { playPopSound(); setTekM1(v); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${tekM1 === v ? "bg-violet-500 text-white" : "bg-slate-700/60 text-white/60 hover:bg-slate-600"}`}>
                        m₁ = {mDisp(v)}
                      </button>
                    ))}
                  </div>
                  <CoordSys label={`m₁·m₂=−1`}>
                    <polyline points={gPts(tekM1, 0)} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                    <polyline points={gPts(tekM2, 0)} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Both lines pass through origin (0,0) */}
                    <polygon points={perpMark(0, 0, tekM1, tekM2, 0.5)} fill="none" stroke="#facc15" strokeWidth="1.8" />
                    <text x={5} y={H-20} fill="#a78bfa" fontSize="7">ℓ₁: y={mDisp(tekM1)}x</text>
                    <text x={5} y={H-11} fill="#f472b6" fontSize="7">ℓ₂: y={mDisp(tekM2)}x</text>
                  </CoordSys>
                  <div className="bg-violet-900/30 rounded-lg p-3 text-xs font-body space-y-1">
                    <p className="text-violet-300 font-semibold">Observasi:</p>
                    <p className="text-white/70">m₁ = <strong className="text-violet-300">{mDisp(tekM1)}</strong>, maka m₂ = −1/m₁ = <strong className="text-pink-300">{mDisp(tekM2)}</strong></p>
                    <p className="text-white/70">Verifikasi: <InlineMath math={`m_1 \\times m_2 = ${mTeX(tekM1)} \\times ${mTeX(tekM2)} = -1`} /> ✓</p>
                    <p className="text-white/50">Kotak kuning kecil = tanda sudut 90° di titik potong</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BERPOTONGAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="berpotongan" icon={<Layers className="w-5 h-5" />} iconColor="text-green-400" title={t.sh_berpotongan} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-300 mb-2 font-body">🎯 Syarat Garis Berpotongan</p>
                  <BlockMath math="m_1 \neq m_2" />
                  <p className="text-xs text-white/60 mt-1">Gradien berbeda → pasti berpotongan di suatu titik</p>
                  <p className="text-xs text-white/50 mt-1">Jika <InlineMath math="m_1 \times m_2 \neq -1" /> → berpotongan biasa (bukan 90°)</p>
                </div>

                {/* Penjelasan MENGAPA */}
                <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-green-300 uppercase tracking-wide">💡 Mengapa garis dengan m₁ ≠ m₂ pasti berpotongan?</p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    Jika dua garis punya gradien berbeda, maka <strong className="text-green-300">laju kenaikannya berbeda</strong>. Misalnya garis ℓ₁ naik lebih cepat dari ℓ₂: dari suatu titik di kiri, ℓ₁ berada di bawah ℓ₂, tapi karena ℓ₁ naik lebih cepat, <em>pasti ada satu titik di mana ℓ₁ menyalib ℓ₂</em>.
                  </p>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    Secara aljabar: dua persamaan <InlineMath math="y = m_1 x + c_1" /> dan <InlineMath math="y = m_2 x + c_2" /> dengan <InlineMath math="m_1 \neq m_2" /> selalu memiliki tepat <strong className="text-green-300">satu solusi</strong>:
                  </p>
                  <div className="text-center">
                    <BlockMath math="x = \frac{c_2 - c_1}{m_1 - m_2}" />
                  </div>
                  <div className="bg-green-900/30 rounded-lg p-2 text-xs font-body">
                    <p className="text-green-200">📌 Titik potong dihitung dengan <strong>SPLDV</strong> (substitusi atau eliminasi). Jika m₁×m₂ = −1, potongannya membentuk sudut 90° (tegak lurus).</p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-green-500/20 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-300 mb-2">Cara menentukan titik potong:</p>
                  <p className="text-xs text-white/60 mb-2">Selesaikan sistem persamaan kedua garis (SPLDV)</p>
                  <div className="space-y-1 text-xs font-body text-white/70">
                    <p>ℓ₁: y = 2x + 1 dan ℓ₂: y = −x + 4</p>
                    <p>→ 2x + 1 = −x + 4</p>
                    <p>→ 3x = 3 → x = 1</p>
                    <p>→ y = 2(1) + 1 = 3</p>
                  </div>
                  <p className="text-green-300 font-bold text-xs mt-1">Titik potong: (1, 3)</p>
                </div>

                {/* ANIMASI INTERAKTIF BERPOTONGAN */}
                <div className="bg-green-900/10 border border-green-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-green-300 uppercase tracking-wider">🎮 Animasi Interaktif — Garis Berpotongan</p>
                  <p className="text-xs text-white/60 font-body">Pilih m₁ dan m₂. Selama m₁ ≠ m₂, kedua garis pasti berpotongan!</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-cyan-300 font-semibold mb-2">m₁ (ℓ₁ — biru):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {BER_OPTS.map(v => (
                          <button key={v} onClick={() => { playPopSound(); setBerM1(v); }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${berM1 === v ? "bg-cyan-500 text-white" : "bg-slate-700/60 text-white/60 hover:bg-slate-600"}`}>
                            {mDisp(v)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-yellow-300 font-semibold mb-2">m₂ (ℓ₂ — kuning):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {BER_OPTS.map(v => (
                          <button key={v} onClick={() => { playPopSound(); setBerM2(v); }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-display ${berM2 === v ? "bg-yellow-500 text-slate-900" : "bg-slate-700/60 text-white/60 hover:bg-slate-600"}`}>
                            {mDisp(v)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {(() => {
                    const pt = lineIntersect(berM1, 1, berM2, -1);
                    const isParallel = berM1 === berM2;
                    const isPerp = Math.abs(berM1 * berM2 + 1) < 0.001;
                    return (
                      <>
                        <CoordSys label={isParallel ? "Sejajar!" : `Titik potong ${pt ? `(${Math.round(pt[0]*10)/10}, ${Math.round(pt[1]*10)/10})` : ""}`}>
                          <polyline points={gPts(berM1, 1)} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                          <polyline points={gPts(berM2, -1)} fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
                          {pt && !isParallel && (
                            <>
                              {isPerp && <polygon points={perpMark(pt[0], pt[1], berM1, berM2, 0.45)} fill="none" stroke="#f87171" strokeWidth="1.5" />}
                              <circle cx={toX(pt[0])} cy={toY(pt[1])} r="5" fill={isPerp ? "#f87171" : "#4ade80"} stroke={isPerp ? "#fca5a5" : "#86efac"} strokeWidth="1.5" />
                              <text x={toX(pt[0])+6} y={toY(pt[1])-4} fill={isPerp ? "#f87171" : "#4ade80"} fontSize="8">({Math.round(pt[0]*10)/10},{Math.round(pt[1]*10)/10})</text>
                            </>
                          )}
                          <text x={5} y={H-20} fill="#22d3ee" fontSize="7">ℓ₁: y={mDisp(berM1)}x+1</text>
                          <text x={5} y={H-11} fill="#facc15" fontSize="7">ℓ₂: y={mDisp(berM2)}x−1</text>
                        </CoordSys>
                        <div className={`rounded-lg p-3 text-xs font-body space-y-1 border ${isParallel ? "bg-cyan-900/30 border-cyan-500/30" : isPerp ? "bg-red-900/30 border-red-500/30" : "bg-green-900/30 border-green-500/30"}`}>
                          <p className={`font-semibold ${isParallel ? "text-cyan-300" : isPerp ? "text-red-300" : "text-green-300"}`}>
                            {isParallel ? "⚠️ SEJAJAR" : isPerp ? "⊥ TEGAK LURUS (90°)" : "✕ BERPOTONGAN BIASA"}
                          </p>
                          <p className="text-white/70">m₁ = <strong>{mDisp(berM1)}</strong>, m₂ = <strong>{mDisp(berM2)}</strong></p>
                          {isParallel && <p className="text-white/60">m₁ = m₂ → garis sejajar, tidak berpotongan!</p>}
                          {isPerp && pt && <p className="text-white/60">m₁ × m₂ = {mDisp(berM1)} × {mDisp(berM2)} = −1 → sudut 90° di ({Math.round(pt[0]*10)/10}, {Math.round(pt[1]*10)/10})</p>}
                          {!isParallel && !isPerp && pt && <p className="text-white/60">m₁ ≠ m₂, m₁×m₂ = {Math.round(berM1*berM2*100)/100} ≠ −1 → titik potong ({Math.round(pt[0]*10)/10}, {Math.round(pt[1]*10)/10})</p>}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* GALERI VISUAL TIGA JENIS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="visual-trio" icon={<GitBranch className="w-5 h-5" />} iconColor="text-yellow-400" title="🎨 Galeri Visual: Perbandingan Tiga Hubungan Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Sejajar */}
                  <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-cyan-300 mb-2 text-center">∥ SEJAJAR</p>
                    <CoordSys label="m₁=m₂=2">
                      <polyline points={[[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-1,-5],[0,-3],[1,-1],[2,1],[3,3]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3" />
                    </CoordSys>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-cyan-300 font-mono">ℓ₁: y = 2x + 1</p>
                      <p className="text-cyan-200/60 font-mono">ℓ₂: y = 2x − 3</p>
                      <p className="text-white/40">m₁ = m₂ = 2</p>
                    </div>
                  </div>
                  {/* Tegak lurus — fixed right-angle marker */}
                  <div className="bg-slate-900/60 border border-violet-500/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-300 mb-2 text-center">⊥ TEGAK LURUS</p>
                    <CoordSys label="m₁·m₂=−1">
                      {/* ℓ₁: y=2x, ℓ₂: y=-0.5x → intersect at origin (0,0) */}
                      <polyline points={[[-3,-6],[-2,-4],[-1,-2],[0,0],[1,2],[2,4]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-4,2],[-2,1],[0,0],[2,-1],[4,-2]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                      <polygon points={perpMark(0, 0, 2, -0.5)} fill="none" stroke="#facc15" strokeWidth="1.5" />
                    </CoordSys>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-violet-300 font-mono">ℓ₁: y = 2x</p>
                      <p className="text-pink-400 font-mono">ℓ₂: y = −½x</p>
                      <p className="text-white/40">2 × (−½) = −1 ✓</p>
                    </div>
                  </div>
                  {/* Berpotongan */}
                  <div className="bg-slate-900/60 border border-green-500/30 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-300 mb-2 text-center">✕ BERPOTONGAN</p>
                    <CoordSys label="m₁≠m₂">
                      <polyline points={[[-3,-5],[-2,-3],[-1,-1],[0,1],[1,3],[2,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-3,6],[-2,5],[0,3],[1,2],[2,1],[3,0]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx={toX(-1)} cy={toY(-1)} r="5" fill="#f87171" stroke="#fca5a5" strokeWidth="1.5" />
                    </CoordSys>
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-green-300 font-mono">ℓ₁: y = 2x + 1</p>
                      <p className="text-yellow-300 font-mono">ℓ₂: y = −x + 2</p>
                      <p className="text-white/40">m₁=2 ≠ m₂=−1</p>
                    </div>
                  </div>
                </div>

                {/* Summary table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead><tr className="bg-slate-700/60">
                      <th className="border border-white/10 px-3 py-2 text-white">Hubungan</th>
                      <th className="border border-white/10 px-3 py-2 text-white">Syarat Gradien</th>
                      <th className="border border-white/10 px-3 py-2 text-white">Titik Potong</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ["Sejajar (∥)", "m₁ = m₂, c₁ ≠ c₂", "Tidak ada (tidak berpotongan)"],
                        ["Berimpit", "m₁ = m₂, c₁ = c₂", "Tak terhingga (garis sama)"],
                        ["Tegak Lurus (⊥)", "m₁ × m₂ = −1", "Satu titik (sudut 90°)"],
                        ["Berpotongan", "m₁ ≠ m₂", "Satu titik (sudut ≠ 90°)"],
                      ].map(([h,s,t],i) => (
                        <tr key={i} className={i%2===0?"bg-slate-800/30":"bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{h}</td>
                          <td className="border border-white/10 px-3 py-2 text-yellow-300 font-mono">{s}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60">{t}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Tentukan hubungan antara garis <InlineMath math="\ell_1: y = 3x - 5" /> dan <InlineMath math="\ell_2: y = 3x + 2" />!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Identifikasi gradien:</p>
                    <p className="text-white/70 text-xs">ℓ₁: y = 3x − 5 → m₁ = 3</p>
                    <p className="text-white/70 text-xs">ℓ₂: y = 3x + 2 → m₂ = 3</p>
                    <p className="text-white/70 text-xs mt-1">m₁ = m₂ = 3, tetapi c₁ = −5 ≠ c₂ = 2</p>
                  </div>
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-3">
                    <CoordSys label="ℓ₁ ∥ ℓ₂">
                      <polyline points={[[-1,-8],[0,-5],[1,-2],[2,1],[3,4]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      <polyline points={[[-1,-1],[0,2],[1,5],[2,8]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3" />
                      <text x={toX(1)} y={toY(3)} fill="#22d3ee" fontSize="8">ℓ₁</text>
                      <text x={toX(-0.5)} y={toY(4)} fill="#67e8f9" fontSize="8">ℓ₂</text>
                    </CoordSys>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-300">✅ ℓ₁ ∥ ℓ₂ (SEJAJAR) karena m₁ = m₂ = 3 dan c berbeda</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-yellow-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Tentukan persamaan garis yang melalui titik <InlineMath math="(2, 5)" /> dan tegak lurus dengan garis <InlineMath math="y = 4x - 3" />!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Langkah 1 — Cari gradien tegak lurus:</p>
                    <p className="text-white/70 text-xs">m₁ = 4 (dari y = 4x − 3)</p>
                    <BlockMath math="m_2 = -\frac{1}{m_1} = -\frac{1}{4}" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Tentukan persamaan:</p>
                    <BlockMath math="y - 5 = -\frac{1}{4}(x - 2)" />
                    <BlockMath math="y = -\frac{1}{4}x + \frac{1}{2} + 5 = -\frac{1}{4}x + \frac{11}{2}" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-orange-300 font-semibold mb-2 text-xs">Grafik kedua garis:</p>
                    <CoordSys label="⊥ di (2,5)">
                      {/* ℓ₁: y=4x-3, ℓ₂: y=-¼x+5.5, intersect at (2,5) */}
                      <polyline points={[[-1,-7],[0,-3],[1,1],[2,5],[3,9]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
                      <polyline points={[[-4,6.5],[-2,6],[0,5.5],[2,5],[4,4.5],[6,4]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                      <polygon points={perpMark(2, 5, 4, -0.25, 0.3)} fill="none" stroke="#f87171" strokeWidth="1.2" />
                      <circle cx={toX(2)} cy={toY(5)} r="5" fill="#f87171" stroke="#fca5a5" strokeWidth="1.5" />
                      <text x={toX(2)+5} y={toY(5)-5} fill="#f87171" fontSize="8">(2,5)</text>
                    </CoordSys>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-yellow-300">✅ Persamaan: <InlineMath math="y = -\frac{1}{4}x + \frac{11}{2}" /> atau <InlineMath math="x + 4y - 22 = 0" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Diketahui tiga garis: <InlineMath math="\ell_1: 2x - y + 4 = 0" />, <InlineMath math="\ell_2: x + 2y - 6 = 0" />, <InlineMath math="\ell_3: 4x - 2y + 1 = 0" />. Tentukan hubungan antara: a) ℓ₁ dan ℓ₂, b) ℓ₁ dan ℓ₃, c) ℓ₂ dan ℓ₃!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">Cari gradien masing-masing (ubah ke y = mx + c):</p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-cyan-900/20 rounded-lg p-2">
                        <p className="text-cyan-300 font-semibold">ℓ₁: 2x − y + 4 = 0</p>
                        <p className="text-white/70">y = 2x + 4 → <strong className="text-yellow-300">m₁ = 2</strong></p>
                      </div>
                      <div className="bg-violet-900/20 rounded-lg p-2">
                        <p className="text-violet-300 font-semibold">ℓ₂: x + 2y − 6 = 0</p>
                        <p className="text-white/70">2y = −x + 6 → y = −½x + 3 → <strong className="text-yellow-300">m₂ = −½</strong></p>
                      </div>
                      <div className="bg-orange-900/20 rounded-lg p-2">
                        <p className="text-orange-300 font-semibold">ℓ₃: 4x − 2y + 1 = 0</p>
                        <p className="text-white/70">2y = 4x + 1 → y = 2x + ½ → <strong className="text-yellow-300">m₃ = 2</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-2">Analisis hubungan:</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="bg-green-900/20 rounded-lg p-2">
                        <p className="text-green-300 font-bold">a) ℓ₁ ⊥ ℓ₂:</p>
                        <p className="text-white/60">m₁ × m₂ = 2 × (−½) = −1 ✓ → <strong className="text-green-300">TEGAK LURUS</strong></p>
                      </div>
                      <div className="bg-cyan-900/20 rounded-lg p-2">
                        <p className="text-cyan-300 font-bold">b) ℓ₁ ∥ ℓ₃:</p>
                        <p className="text-white/60">m₁ = m₃ = 2, c₁ = 4 ≠ c₃ = ½ → <strong className="text-cyan-300">SEJAJAR</strong></p>
                      </div>
                      <div className="bg-orange-900/20 rounded-lg p-2">
                        <p className="text-orange-300 font-bold">c) ℓ₂ dan ℓ₃:</p>
                        <p className="text-white/60">m₂ = −½ ≠ m₃ = 2, m₂×m₃ = −1 → <strong className="text-orange-300">TEGAK LURUS</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-red-300">✅ ℓ₁⊥ℓ₂, ℓ₁∥ℓ₃, ℓ₂⊥ℓ₃. Tiga garis dengan relasi saling tegak lurus dan sejajar!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {[
                    ["Sejajar (∥)", "m₁ = m₂ dan c₁ ≠ c₂"],
                    ["Tegak Lurus (⊥)", "m₁ × m₂ = −1 (atau m₂ = −1/m₁)"],
                    ["Berpotongan", "m₁ ≠ m₂ (dan m₁ × m₂ ≠ −1)"],
                    ["Berimpit", "m₁ = m₂ dan c₁ = c₂ (garis sama persis)"],
                  ].map(([t,d]) => (
                    <div key={t} className="flex gap-2"><span className="text-cyan-400 shrink-0">▸</span><p className="text-white/80"><strong className="text-cyan-300">{t}:</strong> {d}</p></div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body"><strong>💡 Ingat!</strong> Gradien tegak lurus adalah negatif kebalikan. m₁ = 3 → m₂ = −1/3. m₁ = −2/5 → m₂ = 5/2. Cukup balik pecahannya dan ubah tandanya!</p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Hubungan2GarisPage;
