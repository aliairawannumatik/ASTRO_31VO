import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Sliders, TrendingUp, PlayCircle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import GradienInvariantAnimation from "@/components/GradienInvariantAnimation";
import GradienDuaTitikInteraktif from "@/components/GradienDuaTitikInteraktif";
import GradienPersamaanInteraktif from "@/components/GradienPersamaanInteraktif";

const W = 180, H = 150, MX = 90, MY = 75, SC = 14;
const toX = (x: number) => MX + x * SC;
const toY = (y: number) => MY - y * SC;

const CoordSys = ({ children, label = "", w = W, h = H }: { children?: React.ReactNode; label?: string; w?: number; h?: number }) => {
  const mx = w / 2, my = h / 2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full rounded-xl" style={{ maxHeight: 170, background: "rgba(15,23,42,0.7)" }}>
      {[-4,-3,-2,-1,1,2,3,4].map(v => (
        <g key={v}>
          <line x1={mx+v*(w/10)} y1={4} x2={mx+v*(w/10)} y2={h-4} stroke="#1e293b" strokeWidth="0.8" />
          <line x1={4} y1={my-v*(h/10)} x2={w-4} y2={my-v*(h/10)} stroke="#1e293b" strokeWidth="0.8" />
        </g>
      ))}
      <line x1={4} y1={my} x2={w-4} y2={my} stroke="#475569" strokeWidth="1.5" />
      <line x1={mx} y1={h-4} x2={mx} y2={4} stroke="#475569" strokeWidth="1.5" />
      <text x={w-9} y={my+11} fill="#64748b" fontSize="8">x</text>
      <text x={mx+3} y={11} fill="#64748b" fontSize="8">y</text>
      <text x={mx+2} y={my+10} fill="#475569" fontSize="7">O</text>
      {label && <text x={5} y={13} fill="#94a3b8" fontSize="8">{label}</text>}
      {children}
    </svg>
  );
};

const GradienPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "definisi", "tabelgradien", "animasi", "duatitik", "persamaan", "jenis", "contoh1", "contoh2", "contoh3", "rangkuman",
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

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <Sliders className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">GRADIEN (KEMIRINGAN GARIS)</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">Seberapa Curam Sebuah Garis?</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Persamaan Garis Lurus · Materi Matematika</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Gradien — Ukuran Kemiringan Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Tanjakan jalan yang curam vs landai, lereng gunung yang terjal vs miring perlahan — semua punya tingkat kemiringan yang berbeda. Dalam matematika, tingkat kemiringan ini disebut <strong className="text-cyan-300">gradien</strong> (atau slope).
                </p>
                {/* Foto ilustrasi jalan tanjakan */}
                <figure className="rounded-xl overflow-hidden border border-white/10">
                  <img
                    src="/jalan-tanjakan.png"
                    alt="Perbandingan jalan tanjakan terjal dan landai"
                    className="w-full object-cover"
                  />
                  <figcaption className="text-center text-[10px] text-white/40 font-body py-1.5 bg-slate-900/60">
                    bing.com/images/create
                  </figcaption>
                </figure>
                {/* Analogi kemiringan */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-cyan-300 uppercase mb-3">⛰️ Analogi Kemiringan dalam Kehidupan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                    {[
                      { icon: "🏔️", label: "Lereng Terjal", m: "m = 5", ket: "Naik 5 unit per 1 unit ke kanan", color: "bg-red-900/40 border-red-500/30" },
                      { icon: "🏕️", label: "Lereng Landai", m: "m = 0.5", ket: "Naik 0.5 unit per 1 unit ke kanan", color: "bg-yellow-900/40 border-yellow-500/30" },
                      { icon: "🏖️", label: "Jalan Datar", m: "m = 0", ket: "Tidak naik maupun turun", color: "bg-green-900/40 border-green-500/30" },
                    ].map(({ icon, label, m, ket, color }) => (
                      <div key={label} className={`border ${color} rounded-xl p-3 text-center`}>
                        <div className="text-2xl mb-1">{icon}</div>
                        <p className="font-bold text-white">{label}</p>
                        <p className="text-cyan-300 font-mono font-bold mt-1">{m}</p>
                        <p className="text-white/40 text-xs mt-0.5">{ket}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DEFINISI & RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="definisi" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Definisi dan Rumus Gradien" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-violet-300 mb-2 font-body">🎯 Ringkasan Intisari</p>
                  <p className="text-sm text-white/80 font-body leading-relaxed">
                    <strong className="text-cyan-300">Gradien (m)</strong> adalah perbandingan antara panjang{" "}
                    <strong className="text-pink-300">sisi tegak</strong> (jarak naik/turun) dan panjang{" "}
                    <strong className="text-green-300">sisi datar</strong> (jarak ke kanan) dari segitiga siku-siku yang terbentuk di bawah garis.
                  </p>
                  <div className="bg-violet-900/40 border border-violet-400/30 rounded-xl p-4 mt-3 text-center">
                    <BlockMath math="m = \frac{\text{panjang sisi tegak}}{\text{panjang sisi datar}}" />
                  </div>
                </div>

                {/* Positif vs Negatif — SVG illustrations */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Gradien Positif */}
                  <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-3 flex flex-col items-center gap-2">
                    <svg viewBox="0 0 150 100" className="w-full max-w-[160px]" style={{ background: "rgba(15,23,42,0.7)", borderRadius: 8 }}>
                      {[20,40,60,80].map(v => (
                        <line key={`gh${v}`} x1="10" y1={v} x2="120" y2={v} stroke="#1e293b" strokeWidth="1" />
                      ))}
                      {[30,50,70,90,110].map(v => (
                        <line key={`gv${v}`} x1={v} y1="10" x2={v} y2="90" stroke="#1e293b" strokeWidth="1" />
                      ))}
                      <line x1="20" y1="80" x2="110" y2="20" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
                      <line x1="20" y1="80" x2="110" y2="80" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7" />
                      <line x1="110" y1="80" x2="110" y2="20" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7" />
                      <text x="55" y="93" fill="#4ade80" fontSize="8.5" fontWeight="bold" textAnchor="middle">datar</text>
                      <text x="123" y="53" fill="#f472b6" fontSize="8.5" fontWeight="bold" textAnchor="start" transform="rotate(-90,123,53)">tegak</text>
                    </svg>
                    <p className="text-xs font-bold text-green-300 font-body text-center">Gradien <span className="text-green-400">POSITIF (+)</span></p>
                    <p className="text-[10px] text-white/50 font-body text-center">Garis naik ke kanan</p>
                  </div>

                  {/* Gradien Negatif */}
                  <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-3 flex flex-col items-center gap-2">
                    <svg viewBox="0 0 150 100" className="w-full max-w-[160px]" style={{ background: "rgba(15,23,42,0.7)", borderRadius: 8 }}>
                      {[20,40,60,80].map(v => (
                        <line key={`rh${v}`} x1="10" y1={v} x2="120" y2={v} stroke="#1e293b" strokeWidth="1" />
                      ))}
                      {[30,50,70,90,110].map(v => (
                        <line key={`rv${v}`} x1={v} y1="10" x2={v} y2="90" stroke="#1e293b" strokeWidth="1" />
                      ))}
                      <line x1="20" y1="20" x2="110" y2="80" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
                      <line x1="20" y1="20" x2="110" y2="20" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7" />
                      <line x1="110" y1="20" x2="110" y2="80" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7" />
                      <text x="55" y="14" fill="#4ade80" fontSize="8.5" fontWeight="bold" textAnchor="middle">datar</text>
                      <text x="123" y="53" fill="#f472b6" fontSize="8.5" fontWeight="bold" textAnchor="start" transform="rotate(-90,123,53)">tegak</text>
                    </svg>
                    <p className="text-xs font-bold text-red-300 font-body text-center">Gradien <span className="text-red-400">NEGATIF (−)</span></p>
                    <p className="text-[10px] text-white/50 font-body text-center">Garis turun ke kanan</p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* TABEL RINGKASAN NILAI GRADIEN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="tabelgradien" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-amber-400" title="📊 Tabel Ringkasan Nilai Gradien" />
            {expandedSections.includes("tabelgradien") && (
              <div className="px-5 pb-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-cyan-900/40">
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">Nilai m</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">Arah Garis</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200">Semakin besar |m|</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["m > 0", "↗ Naik dari kiri ke kanan", "Semakin curam ke kanan"],
                        ["m < 0", "↘ Turun dari kiri ke kanan", "Semakin curam ke kiri"],
                        ["m = 0", "→ Horizontal (mendatar)", "Tidak berubah"],
                        ["m tidak ada", "↕ Vertikal (x = konstanta)", "Tidak terdefinisi"],
                      ].map(([v, a, s], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-mono font-bold text-center">{v}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70 text-center">{a}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60 text-center">{s}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* JENIS GARIS KHUSUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="jenis" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-cyan-400" title="⚡ Garis Horizontal, Vertikal & Melalui Titik Asal" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      judul: "Garis Horizontal", eq: "y = c", m: "m = 0",
                      color: "#4ade80", ket: "Gradien 0, sejajar sumbu-x",
                      pts: [[-4,2],[0,2],[4,2]],
                    },
                    {
                      judul: "Garis Vertikal", eq: "x = c", m: "m = ∞ (tdk ada)",
                      color: "#f472b6", ket: "Gradien tidak terdefinisi, sejajar sumbu-y",
                      pts: [[2,-3],[2,0],[2,3]],
                    },
                    {
                      judul: "Melalui Titik Asal", eq: "y = mx", m: "c = 0",
                      color: "#a78bfa", ket: "Melewati titik (0,0), c=0",
                      pts: [[-3,-3],[0,0],[3,3]],
                    },
                  ].map(({ judul, eq, m, color, ket, pts }) => (
                    <div key={judul} className="bg-slate-900/60 border border-white/10 rounded-xl p-3">
                      <p className="text-xs font-bold mb-1" style={{ color }}>{judul}</p>
                      <CoordSys w={130} h={100} label={eq}>
                        {pts[0][0] === pts[1][0] ? (
                          /* vertical line */
                          <line x1={65+pts[0][0]*13} y1={10} x2={65+pts[0][0]*13} y2={90} stroke={color} strokeWidth="2.5" />
                        ) : (
                          <polyline points={pts.map(([x,y])=>`${65+x*13},${50-y*13}`).join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                        )}
                        <circle cx={65+pts[1][0]*13} cy={50-pts[1][1]*13} r="3.5" fill={color} />
                      </CoordSys>
                      <p className="text-xs font-mono mt-1" style={{ color }}>{m}</p>
                      <p className="text-xs text-white/40 mt-0.5">{ket}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ANIMASI INVARIANSI GRADIEN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="animasi" icon={<PlayCircle className="w-5 h-5" />} iconColor="text-cyan-400" title="🎬 Animasi: Gradien Tidak Bergantung Panjang Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  Seret kedua titik ke posisi mana pun di grid — gradien selalu bisa dihitung dari <strong className="text-green-300">sisi datar</strong> dan <strong className="text-pink-300">sisi tegak</strong> di antara keduanya.
                </p>
                <GradienInvariantAnimation />
              </div>
            )}
          </div>

          {/* GRADIEN MELALUI DUA TITIK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="duatitik" icon={<Target className="w-5 h-5" />} iconColor="text-violet-400" title="📍 Gradien Melalui Dua Titik" />
            {expandedSections.includes("duatitik") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  Jika diketahui dua titik <InlineMath math="P_1(x_1,\, y_1)" /> dan <InlineMath math="P_2(x_2,\, y_2)" />,
                  gradien garis yang melalui keduanya dihitung dengan rumus:
                </p>
                <div className="bg-violet-900/30 border border-violet-400/30 rounded-xl p-4 text-center">
                  <BlockMath math="m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{\Delta y}{\Delta x}" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-body">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2.5 text-center">
                    <p className="text-green-300 font-bold mb-1">Δy = sisi tegak</p>
                    <InlineMath math="\Delta y = y_2 - y_1" />
                    <p className="text-white/40 mt-1">selisih vertikal</p>
                  </div>
                  <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-2.5 text-center">
                    <p className="text-pink-300 font-bold mb-1">Δx = sisi datar</p>
                    <InlineMath math="\Delta x = x_2 - x_1" />
                    <p className="text-white/40 mt-1">selisih horizontal</p>
                  </div>
                </div>
                <p className="font-body text-xs text-white/50 leading-relaxed">
                  Seret titik <span className="text-cyan-300 font-bold">P₁</span> dan <span className="text-yellow-300 font-bold">P₂</span> ke sembarang posisi — rumus akan terisi otomatis langkah demi langkah.
                </p>
                <GradienDuaTitikInteraktif />
              </div>
            )}
          </div>

          {/* GRADIEN DARI PERSAMAAN GARIS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="persamaan" icon={<Sliders className="w-5 h-5" />} iconColor="text-cyan-400" title="📐 Gradien dari Persamaan Garis" />
            {expandedSections.includes("persamaan") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  Ada dua bentuk persamaan garis yang sering muncul. Masing-masing punya cara berbeda untuk membaca gradiennya — dan ada alasan matematisnya.
                </p>
                <GradienPersamaanInteraktif />
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
                  <p className="text-sm text-white/85 font-body">Tentukan gradien dari persamaan berikut: a) <InlineMath math="y = -4x + 7" />, b) <InlineMath math="6x - 3y + 9 = 0" />, c) <InlineMath math="y = 5" /></p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  {[
                    { bag: "a) y = −4x + 7", ket: "Koefisien x adalah −4", hasil: "m = −4", color: "text-cyan-300" },
                    { bag: "b) 6x − 3y + 9 = 0", ket: "Ubah: −3y = −6x − 9 → y = 2x + 3", hasil: "m = 2", color: "text-violet-300" },
                    { bag: "c) y = 5", ket: "Garis horizontal → gradien = 0", hasil: "m = 0", color: "text-green-300" },
                  ].map(({ bag, ket, hasil, color }) => (
                    <div key={bag} className="bg-slate-800/50 rounded-lg p-3">
                      <p className={`${color} font-semibold text-xs mb-1`}>{bag}</p>
                      <p className="text-white/60 text-xs">{ket}</p>
                      <p className="text-green-300 font-bold text-sm mt-1">→ {hasil}</p>
                    </div>
                  ))}
                  <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-300">✅ a) m = −4, b) m = 2, c) m = 0</p>
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
                  <p className="text-sm text-white/85 font-body">Tentukan gradien garis yang melalui titik <InlineMath math="A(3, -2)" /> dan <InlineMath math="B(-1, 6)" />. Gambarkan segitiga gradiennya!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">Gunakan rumus gradien 2 titik:</p>
                    <BlockMath math="m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{6 - (-2)}{-1 - 3} = \frac{8}{-4} = -2" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-orange-300 font-semibold mb-2 text-xs">Visualisasi segitiga gradien:</p>
                    <CoordSys w={W} h={H} label="A(3,−2) ke B(−1,6)">
                      {/* line through A(3,-2) and B(-1,6) */}
                      <polyline points={[[-3,10],[-1,6],[1,2],[3,-2],[4,-4]].map(([x,y])=>`${MX+x*SC},${MY-y*SC}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
                      {/* A and B */}
                      <circle cx={toX(3)} cy={toY(-2)} r="5" fill="#22d3ee" stroke="#67e8f9" strokeWidth="1.5" />
                      <circle cx={toX(-1)} cy={toY(6)} r="5" fill="#22d3ee" stroke="#67e8f9" strokeWidth="1.5" />
                      <text x={toX(3)+5} y={toY(-2)+4} fill="#22d3ee" fontSize="8">A(3,−2)</text>
                      <text x={toX(-1)+5} y={toY(6)-4} fill="#22d3ee" fontSize="8">B(−1,6)</text>
                      {/* triangle */}
                      <line x1={toX(3)} y1={toY(-2)} x2={toX(-1)} y2={toY(-2)} stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,2" />
                      <line x1={toX(-1)} y1={toY(-2)} x2={toX(-1)} y2={toY(6)} stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,2" />
                      <text x={toX(0.8)} y={toY(-2)+13} fill="#4ade80" fontSize="8">Δx=−4</text>
                      <text x={toX(-1)+5} y={toY(1)} fill="#f472b6" fontSize="8">Δy=8</text>
                    </CoordSys>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-yellow-300">✅ Gradien = −2 (garis turun curam dari kiri ke kanan)</p>
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

                {/* Soal */}
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body leading-relaxed">
                    Titik <InlineMath math="P(k,\, 0)" />, <InlineMath math="Q(0,\, 2)" />, dan <InlineMath math="R(2,\, 4)" /> terletak pada satu garis lurus yang sama (segaris/kolinear). Tentukan nilai <InlineMath math="k" />!
                  </p>
                </div>

                {/* Pembahasan */}
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">

                  {/* Langkah 1 */}
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                    <p className="text-cyan-300 font-semibold text-xs mb-2">Langkah 1 — Hitung gradien QR (titik yang sudah diketahui nilai pastinya):</p>
                    <BlockMath math="m_{QR} = \frac{y_R - y_Q}{x_R - x_Q} = \frac{4 - 2}{2 - 0} = \frac{2}{2} = 1" />
                  </div>

                  {/* Langkah 2 */}
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                    <p className="text-violet-300 font-semibold text-xs mb-2">Langkah 2 — Karena P, Q, R segaris, gradien PQ = gradien QR:</p>
                    <BlockMath math="m_{PQ} = \frac{y_Q - y_P}{x_Q - x_P} = \frac{2 - 0}{0 - k} = \frac{2}{-k}" />
                    <BlockMath math="\frac{2}{-k} = 1" />
                  </div>

                  {/* Langkah 3 */}
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                    <p className="text-orange-300 font-semibold text-xs mb-2">Langkah 3 — Selesaikan persamaan untuk k:</p>
                    <BlockMath math="2 = 1 \times (-k)" />
                    <BlockMath math="-k = 2 \implies k = -2" />
                  </div>

                  {/* Grafik */}
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-emerald-300 font-semibold text-xs mb-2">Verifikasi — Ketiga titik P(−2, 0), Q(0, 2), R(2, 4) pada garis y = x + 2:</p>
                    <CoordSys w={W} h={H} label="P(−2,0)  Q(0,2)  R(2,4)">
                      {/* Garis y = x+2 */}
                      <polyline
                        points={[[-4,-2],[-2,0],[0,2],[2,4]].map(([x,y])=>`${MX+x*SC},${MY-y*SC}`).join(' ')}
                        fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round"
                      />
                      {/* Titik P, Q, R */}
                      {([[-2,0,"P(−2, 0)","#f472b6"],[0,2,"Q(0, 2)","#facc15"],[2,4,"R(2, 4)","#4ade80"]] as [number,number,string,string][]).map(([x,y,lbl,clr]) => (
                        <g key={lbl}>
                          <circle cx={toX(x)} cy={toY(y)} r="5" fill={clr} stroke="white" strokeWidth="1" />
                          <text
                            x={toX(x) + (x === -2 ? -4 : 6)}
                            y={toY(y) + (y === 4 ? 12 : -6)}
                            fill={clr} fontSize="8"
                            textAnchor={x === -2 ? "end" : "start"}
                          >{lbl}</text>
                        </g>
                      ))}
                    </CoordSys>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-red-300">✅ k = −2, sehingga P(−2, 0). Ketiga titik terletak pada garis <InlineMath math="y = x + 2" /> dengan gradien m = 1.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh4" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="✏️ Contoh 4 — Membaca Gradien dari Grafik Grid" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="GRAFIK" color="bg-purple-700/60 text-purple-200" />

                {/* Soal */}
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-purple-300 mb-1 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">
                    Perhatikan dua grafik garis berikut. Tentukan gradien masing-masing garis dengan membaca koordinat dua titik pada grafik!
                  </p>
                </div>

                {/* Grafik soal — 2 kolom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* a) garis melalui A(-3,1) dan B(1,-1), m = -1/2 */}
                  <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-cyan-300 mb-2 font-body">a) Tentukan gradien garis di bawah ini:</p>
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ background: "rgba(6,12,30,0.95)" }}>
                      {/* Grid */}
                      {[-4,-3,-2,-1,1,2,3,4].map(v => (
                        <g key={`a-grid-${v}`}>
                          <line x1={MX+v*SC} y1={6} x2={MX+v*SC} y2={H-6} stroke="#0f172a" strokeWidth="1" />
                          <line x1={6} y1={MY-v*SC} x2={W-6} y2={MY-v*SC} stroke="#0f172a" strokeWidth="1" />
                        </g>
                      ))}
                      {/* Axes */}
                      <line x1={6} y1={MY} x2={W-6} y2={MY} stroke="#334155" strokeWidth="1.5" />
                      <line x1={MX} y1={H-6} x2={MX} y2={6} stroke="#334155" strokeWidth="1.5" />
                      <polygon points={`${W-6},${MY} ${W-12},${MY-3} ${W-12},${MY+3}`} fill="#334155" />
                      <polygon points={`${MX},6 ${MX-3},12 ${MX+3},12`} fill="#334155" />
                      <text x={W-10} y={MY+10} fill="#475569" fontSize="8">x</text>
                      <text x={MX+4} y={13} fill="#475569" fontSize="8">y</text>
                      <text x={MX+3} y={MY+10} fill="#334155" fontSize="7">O</text>
                      {/* Tick numbers */}
                      {[-4,-2,2,4].map(v=>(
                        <g key={`a-tick-${v}`}>
                          <text x={MX+v*SC-(v<0?5:3)} y={MY+10} fill="#374151" fontSize="7">{v}</text>
                          <text x={MX-12} y={MY-v*SC+3} fill="#374151" fontSize="7">{v}</text>
                        </g>
                      ))}
                      {/* Garis melalui A(-3,1) dan B(1,-1), diperpanjang */}
                      <polyline
                        points={[[-4,2],[-3,1],[-1,0],[1,-1],[2,-2]].map(([x,y])=>`${MX+x*SC},${MY-y*SC}`).join(' ')}
                        fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"
                      />
                      {/* Titik A dan B */}
                      <circle cx={MX+(-3)*SC} cy={MY-1*SC} r="5" fill="#22d3ee" stroke="#67e8f9" strokeWidth="1.5" />
                      <circle cx={MX+1*SC}   cy={MY-(-1)*SC} r="5" fill="#22d3ee" stroke="#67e8f9" strokeWidth="1.5" />
                      <text x={MX+(-3)*SC-5} y={MY-1*SC-8}  fill="#67e8f9" fontSize="8" textAnchor="middle">A(−3, 1)</text>
                      <text x={MX+1*SC+4}   y={MY-(-1)*SC+14} fill="#67e8f9" fontSize="8">B(1, −1)</text>
                    </svg>
                  </div>

                  {/* b) garis melalui P(-2,-2) dan Q(1,4), m = 2 */}
                  <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-amber-300 mb-2 font-body">b) Tentukan gradien garis di bawah ini:</p>
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ background: "rgba(6,12,30,0.95)" }}>
                      {/* Grid */}
                      {[-4,-3,-2,-1,1,2,3,4].map(v => (
                        <g key={`b-grid-${v}`}>
                          <line x1={MX+v*SC} y1={6} x2={MX+v*SC} y2={H-6} stroke="#0f172a" strokeWidth="1" />
                          <line x1={6} y1={MY-v*SC} x2={W-6} y2={MY-v*SC} stroke="#0f172a" strokeWidth="1" />
                        </g>
                      ))}
                      {/* Axes */}
                      <line x1={6} y1={MY} x2={W-6} y2={MY} stroke="#334155" strokeWidth="1.5" />
                      <line x1={MX} y1={H-6} x2={MX} y2={6} stroke="#334155" strokeWidth="1.5" />
                      <polygon points={`${W-6},${MY} ${W-12},${MY-3} ${W-12},${MY+3}`} fill="#334155" />
                      <polygon points={`${MX},6 ${MX-3},12 ${MX+3},12`} fill="#334155" />
                      <text x={W-10} y={MY+10} fill="#475569" fontSize="8">x</text>
                      <text x={MX+4} y={13} fill="#475569" fontSize="8">y</text>
                      <text x={MX+3} y={MY+10} fill="#334155" fontSize="7">O</text>
                      {/* Tick numbers */}
                      {[-4,-2,2,4].map(v=>(
                        <g key={`b-tick-${v}`}>
                          <text x={MX+v*SC-(v<0?5:3)} y={MY+10} fill="#374151" fontSize="7">{v}</text>
                          <text x={MX-12} y={MY-v*SC+3} fill="#374151" fontSize="7">{v}</text>
                        </g>
                      ))}
                      {/* Garis melalui P(-2,-2) dan Q(1,4), y=2x+2, diperpanjang */}
                      <polyline
                        points={[[-2.5,-3],[-2,-2],[-1,0],[0,2],[1,4],[1.2,4.4]].map(([x,y])=>`${MX+x*SC},${MY-y*SC}`).join(' ')}
                        fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"
                      />
                      {/* Titik P dan Q */}
                      <circle cx={MX+(-2)*SC} cy={MY-(-2)*SC} r="5" fill="#fbbf24" stroke="#fde68a" strokeWidth="1.5" />
                      <circle cx={MX+1*SC}    cy={MY-4*SC}    r="5" fill="#fbbf24" stroke="#fde68a" strokeWidth="1.5" />
                      <text x={MX+(-2)*SC-4} y={MY-(-2)*SC+14} fill="#fde68a" fontSize="8" textAnchor="middle">P(−2, −2)</text>
                      <text x={MX+1*SC+4}    y={MY-4*SC+4}    fill="#fde68a" fontSize="8">Q(1, 4)</text>
                    </svg>
                  </div>
                </div>

                {/* Pembahasan */}
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-5 font-body">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-wider">💡 Pembahasan</p>

                  {/* Solusi a */}
                  <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                    <p className="text-cyan-300 font-semibold text-sm">a) Garis melalui A(−3, 1) dan B(1, −1)</p>
                    <p className="text-white/60 text-xs">Baca dua titik dari grafik: A(−3, 1) dan B(1, −1), lalu substitusi ke rumus gradien:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="m = \frac{y_B - y_A}{x_B - x_A} = \frac{-1 - 1}{1 - (-3)} = \frac{-2}{4} = -\frac{1}{2}" />
                    </div>
                    {/* Grid dengan segitiga gradien */}
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ background: "rgba(6,12,30,0.95)" }}>
                      {[-4,-3,-2,-1,1,2,3,4].map(v => (
                        <g key={`sa-${v}`}>
                          <line x1={MX+v*SC} y1={6} x2={MX+v*SC} y2={H-6} stroke="#0f172a" strokeWidth="1" />
                          <line x1={6} y1={MY-v*SC} x2={W-6} y2={MY-v*SC} stroke="#0f172a" strokeWidth="1" />
                        </g>
                      ))}
                      <line x1={6} y1={MY} x2={W-6} y2={MY} stroke="#334155" strokeWidth="1.5" />
                      <line x1={MX} y1={H-6} x2={MX} y2={6} stroke="#334155" strokeWidth="1.5" />
                      <text x={W-10} y={MY+10} fill="#475569" fontSize="8">x</text>
                      <text x={MX+4} y={13} fill="#475569" fontSize="8">y</text>
                      <text x={MX+3} y={MY+10} fill="#334155" fontSize="7">O</text>
                      {/* Garis */}
                      <polyline points={[[-4,2],[-3,1],[1,-1],[2,-2]].map(([x,y])=>`${MX+x*SC},${MY-y*SC}`).join(' ')}
                        fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Segitiga gradien: horizontal A→(1,1), vertikal (1,1)→B */}
                      <line x1={MX+(-3)*SC} y1={MY-1*SC} x2={MX+1*SC} y2={MY-1*SC}
                        stroke="#4ade80" strokeWidth="1.8" strokeDasharray="5,3" />
                      <line x1={MX+1*SC} y1={MY-1*SC} x2={MX+1*SC} y2={MY-(-1)*SC}
                        stroke="#f472b6" strokeWidth="1.8" strokeDasharray="5,3" />
                      {/* Label Δx Δy */}
                      <text x={MX+(-1)*SC} y={MY-1*SC-5} fill="#4ade80" fontSize="9" textAnchor="middle" fontWeight="bold">Δx = 4</text>
                      <text x={MX+1*SC+25} y={MY} fill="#f472b6" fontSize="9" textAnchor="middle" fontWeight="bold">Δy = −2</text>
                      {/* Siku-siku */}
                      <rect x={MX+1*SC-6} y={MY-1*SC} width="6" height="6" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
                      {/* Titik */}
                      <circle cx={MX+(-3)*SC} cy={MY-1*SC} r="5" fill="#22d3ee" />
                      <circle cx={MX+1*SC}    cy={MY-(-1)*SC} r="5" fill="#22d3ee" />
                      <text x={MX+(-3)*SC-2} y={MY-1*SC-9} fill="#67e8f9" fontSize="8" textAnchor="middle">A</text>
                      <text x={MX+1*SC+8}    y={MY-(-1)*SC+4} fill="#67e8f9" fontSize="8">B</text>
                    </svg>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-sm font-bold text-cyan-300">✅ Gradien = −½  (garis turun landai ke kanan)</p>
                    </div>
                  </div>

                  {/* Solusi b */}
                  <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                    <p className="text-amber-300 font-semibold text-sm">b) Garis melalui P(−2, −2) dan Q(1, 4)</p>
                    <p className="text-white/60 text-xs">Baca dua titik dari grafik: P(−2, −2) dan Q(1, 4), lalu substitusi ke rumus gradien:</p>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <BlockMath math="m = \frac{y_Q - y_P}{x_Q - x_P} = \frac{4 - (-2)}{1 - (-2)} = \frac{6}{3} = 2" />
                    </div>
                    {/* Grid dengan segitiga gradien */}
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ background: "rgba(6,12,30,0.95)" }}>
                      {[-4,-3,-2,-1,1,2,3,4].map(v => (
                        <g key={`sb-${v}`}>
                          <line x1={MX+v*SC} y1={6} x2={MX+v*SC} y2={H-6} stroke="#0f172a" strokeWidth="1" />
                          <line x1={6} y1={MY-v*SC} x2={W-6} y2={MY-v*SC} stroke="#0f172a" strokeWidth="1" />
                        </g>
                      ))}
                      <line x1={6} y1={MY} x2={W-6} y2={MY} stroke="#334155" strokeWidth="1.5" />
                      <line x1={MX} y1={H-6} x2={MX} y2={6} stroke="#334155" strokeWidth="1.5" />
                      <text x={W-10} y={MY+10} fill="#475569" fontSize="8">x</text>
                      <text x={MX+4} y={13} fill="#475569" fontSize="8">y</text>
                      <text x={MX+3} y={MY+10} fill="#334155" fontSize="7">O</text>
                      {/* Garis */}
                      <polyline points={[[-2.5,-3],[-2,-2],[-1,0],[0,2],[1,4],[1.2,4.4]].map(([x,y])=>`${MX+x*SC},${MY-y*SC}`).join(' ')}
                        fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Segitiga gradien: horizontal P→(1,-2), vertikal (1,-2)→Q */}
                      <line x1={MX+(-2)*SC} y1={MY-(-2)*SC} x2={MX+1*SC} y2={MY-(-2)*SC}
                        stroke="#4ade80" strokeWidth="1.8" strokeDasharray="5,3" />
                      <line x1={MX+1*SC} y1={MY-(-2)*SC} x2={MX+1*SC} y2={MY-4*SC}
                        stroke="#f472b6" strokeWidth="1.8" strokeDasharray="5,3" />
                      {/* Label Δx Δy */}
                      <text x={MX+(-0.5)*SC} y={MY-(-2)*SC+12} fill="#4ade80" fontSize="9" textAnchor="middle" fontWeight="bold">Δx = 3</text>
                      <text x={MX+1*SC+25} y={MY-1*SC} fill="#f472b6" fontSize="9" textAnchor="middle" fontWeight="bold">Δy = 6</text>
                      {/* Siku-siku */}
                      <rect x={MX+1*SC-6} y={MY-(-2)*SC-6} width="6" height="6" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
                      {/* Titik */}
                      <circle cx={MX+(-2)*SC} cy={MY-(-2)*SC} r="5" fill="#fbbf24" />
                      <circle cx={MX+1*SC}    cy={MY-4*SC}    r="5" fill="#fbbf24" />
                      <text x={MX+(-2)*SC-8} y={MY-(-2)*SC+4} fill="#fde68a" fontSize="8" textAnchor="end">P</text>
                      <text x={MX+1*SC+8}    y={MY-4*SC+4} fill="#fde68a" fontSize="8">Q</text>
                    </svg>
                    <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg p-3">
                      <p className="text-sm font-bold text-amber-300">✅ Gradien = 2  (garis naik curam ke kanan)</p>
                    </div>
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
                    ["Gradien (m)", "Ukuran kemiringan garis = Δy/Δx"],
                    ["Dari y=mx+c", "m adalah koefisien x langsung"],
                    ["Dari ax+by+c=0", "Ubah ke y=mx+c dulu, m = −a/b"],
                    ["Dari 2 titik", "m = (y₂−y₁)/(x₂−x₁)"],
                    ["m > 0", "Garis naik; m < 0 = Garis turun; m = 0 = Horizontal"],
                  ].map(([t,d]) => (
                    <div key={t} className="flex gap-2"><span className="text-cyan-400 shrink-0">▸</span><p className="text-white/80"><strong className="text-cyan-300">{t}:</strong> {d}</p></div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body"><strong>💡 Trik cepat ax+by+c=0:</strong> gradien = <InlineMath math="m = -\frac{a}{b}" />. Contoh: 3x − 2y + 1 = 0 → m = −(3)/(−2) = 3/2</p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Persamaan Garis Lurus
          </button>
        </div>
      </div>
    </div>
  );
};
export default GradienPage;
