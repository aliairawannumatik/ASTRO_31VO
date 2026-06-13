import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, GitBranch } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PengertianRelasiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "penyajian", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
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
        <GitBranch className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENGERTIAN RELASI DAN PENYAJIANNYA
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Hubungkan Dua Himpunan dengan Aturan yang Tepat!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Relasi dan Fungsi · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Relasi — Menghubungkan Dua Dunia" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu punya daftar nama siswa dan daftar mata pelajaran favorit mereka. Hubungan "siapa suka apa" itulah yang disebut <strong className="text-cyan-300">relasi</strong>! Dalam matematika, relasi adalah <strong className="text-cyan-300">aturan yang menghubungkan anggota satu himpunan ke anggota himpunan lain</strong>.
                </p>
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔍 Contoh Relasi dalam Kehidupan Sehari-hari</p>
                  <div className="grid grid-cols-1 gap-2 text-xs font-body">
                    {[
                      { rel: "Siswa → Mata Pelajaran Favorit", ket: "Dinda suka Matematika, Rafi suka IPA", color: "bg-cyan-900/40 border-cyan-500/30 text-cyan-200" },
                      { rel: "Buah → Warnanya", ket: "Apel merah, Pisang kuning, Anggur ungu", color: "bg-violet-900/40 border-violet-500/30 text-violet-200" },
                      { rel: "Bilangan → Kuadratnya", ket: "2 → 4, 3 → 9, 4 → 16", color: "bg-green-900/40 border-green-500/30 text-green-200" },
                    ].map(({ rel, ket, color }) => (
                      <div key={rel} className={`border ${color} rounded-lg px-3 py-2`}>
                        <p className="font-bold">{rel}</p>
                        <p className="text-white/60 text-xs mt-0.5">Contoh: {ket}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Mengapa perlu belajar relasi?</strong> Relasi adalah fondasi dari konsep fungsi — salah satu topik paling fundamental dalam matematika dan pemrograman komputer!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP DASAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Konsep Dasar Relasi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Diberikan dua himpunan <InlineMath math="A" /> dan <InlineMath math="B" />, <strong className="text-cyan-300">relasi dari A ke B</strong> adalah aturan yang memasangkan <strong className="text-green-300">sebagian atau seluruh</strong> anggota himpunan <InlineMath math="A" /> dengan anggota himpunan <InlineMath math="B" />. Anggota himpunan <InlineMath math="A" /> disebut <strong className="text-yellow-300">domain (daerah asal)</strong> dan anggota himpunan <InlineMath math="B" /> disebut <strong className="text-orange-300">kodomain (daerah kawan)</strong>.
                  </p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-orange-200">
                    <strong>⚠️ Ingat:</strong> Range <InlineMath math="\subseteq" /> Kodomain, artinya range adalah bagian dari kodomain. Tidak semua anggota kodomain harus dipasangkan!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DATA KONTEKS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="data" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📋 Data: Siswa dan Ekstrakulikuler" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  Perhatikan data berikut. Di sebuah sekolah, terdapat daftar siswa dan ekstrakulikuler yang mereka ikuti. Data ini akan kita gunakan untuk memahami cara-cara menyajikan relasi.
                </p>

                {/* Dua Himpunan */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-cyan-300 mb-2 text-center">🎓 Himpunan A — Siswa</p>
                    <div className="space-y-1.5">
                      {["Enzo", "Justin", "Arham", "Faiz"].map(n => (
                        <div key={n} className="text-center font-body text-sm font-semibold text-cyan-100">{n}</div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-violet-300 mb-2 text-center">🏅 Himpunan B — Ekskul</p>
                    <div className="space-y-1.5">
                      {["Badminton", "Basket", "Futsal", "Renang", "Voly"].map(n => (
                        <div key={n} className="text-center font-body text-xs font-semibold text-violet-100">{n}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Relasi "mengikuti" */}
                <div className="bg-slate-800/60 border border-yellow-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-yellow-300 mb-3">🔗 Relasi: "mengikuti ekstrakulikuler"</p>
                  <div className="space-y-2">
                    {[
                      { siswa: "Enzo",   ekskul: ["Badminton", "Basket", "Futsal"], color: "text-cyan-300" },
                      { siswa: "Justin", ekskul: ["Basket", "Renang"],              color: "text-green-300" },
                      { siswa: "Arham",  ekskul: ["Voly", "Futsal"],                color: "text-orange-300" },
                      { siswa: "Faiz",   ekskul: [],                                color: "text-red-300" },
                    ].map(({ siswa, ekskul, color }) => (
                      <div key={siswa} className="flex items-start gap-3 text-xs font-body">
                        <span className={`font-bold min-w-[48px] ${color}`}>{siswa}</span>
                        <span className="text-yellow-400 font-bold">→</span>
                        <span className="text-white/70">
                          {ekskul.length > 0
                            ? ekskul.join(", ")
                            : <span className="text-white/30 italic">tidak mengikuti ekstrakulikuler apapun</span>
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Identifikasi Domain, Kodomain, Range */}
                <div className="grid grid-cols-1 gap-2 text-xs font-body">
                  <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg px-3 py-2">
                    <span className="text-cyan-400 font-bold">Domain (A) = </span>
                    <span className="text-white/80">{"{"}Enzo, Justin, Arham, Faiz{"}"}</span>
                  </div>
                  <div className="bg-violet-900/20 border border-violet-500/20 rounded-lg px-3 py-2">
                    <span className="text-violet-400 font-bold">Kodomain (B) = </span>
                    <span className="text-white/80">{"{"}Badminton, Basket, Futsal, Renang, Voly{"}"}</span>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg px-3 py-2">
                    <span className="text-green-400 font-bold">Range = </span>
                    <span className="text-white/80">{"{"}Badminton, Basket, Futsal, Renang, Voly{"}"}</span>
                    <span className="text-white/40 ml-1 italic">(semua ekskul ada yang mengikuti)</span>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-orange-200">
                    <strong>📌 Catatan:</strong> Faiz tidak mengikuti ekstrakulikuler apapun, sehingga ia tidak memiliki pasangan di himpunan B. Namun Faiz tetap termasuk anggota domain karena ia adalah anggota himpunan A.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CARA PENYAJIAN RELASI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="penyajian" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="🗂️ Cara Menyajikan Relasi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">Relasi dapat disajikan dengan <strong className="text-white">4 cara</strong>:</p>

                {/* Diagram Panah */}
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-cyan-300">1️⃣ Diagram Panah</p>
                  <p className="font-body text-xs text-white/60 mb-2">Dua oval mewakili himpunan A (siswa) dan B (ekskul), dihubungkan dengan anak panah relasi "mengikuti".</p>
                  <div className="flex justify-center">
                    <svg viewBox="0 0 340 260" className="w-full max-w-sm" aria-label="Diagram panah relasi mengikuti ekstrakulikuler">
                      <defs>
                        <marker id="arCyan"   markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#22d3ee"/></marker>
                        <marker id="arGreen"  markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#4ade80"/></marker>
                        <marker id="arOrange" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill="#fb923c"/></marker>
                      </defs>
                      {/* Oval A */}
                      <ellipse cx="85" cy="133" rx="72" ry="108" fill="rgba(8,145,178,0.10)" stroke="#22d3ee" strokeWidth="1.8"/>
                      {/* Oval B */}
                      <ellipse cx="265" cy="133" rx="72" ry="108" fill="rgba(124,58,237,0.10)" stroke="#a78bfa" strokeWidth="1.8"/>
                      {/* Oval labels */}
                      <text x="85"  y="18" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="bold">A (Siswa)</text>
                      <text x="265" y="18" textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="bold">B (Ekskul)</text>
                      {/* Domain items */}
                      <text x="85" y="76"  textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="bold">Enzo</text>
                      <text x="85" y="111" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="bold">Justin</text>
                      <text x="85" y="146" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="bold">Arham</text>
                      <text x="85" y="181" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Faiz</text>
                      {/* Kodomain items */}
                      <text x="265" y="64"  textAnchor="middle" fill="#c4b5fd" fontSize="10" fontWeight="bold">Badminton</text>
                      <text x="265" y="97"  textAnchor="middle" fill="#c4b5fd" fontSize="10" fontWeight="bold">Basket</text>
                      <text x="265" y="130" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontWeight="bold">Futsal</text>
                      <text x="265" y="163" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontWeight="bold">Renang</text>
                      <text x="265" y="196" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontWeight="bold">Voly</text>
                      {/* Enzo (right edge of "Enzo" text ≈ x=99, y center=72) → Badminton left≈238, Basket left≈247, Futsal left≈247 */}
                      <line x1="99" y1="72"  x2="237" y2="60"  stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arCyan)"/>
                      <line x1="99" y1="72"  x2="246" y2="93"  stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arCyan)"/>
                      <line x1="99" y1="72"  x2="246" y2="126" stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arCyan)"/>
                      {/* Justin (right edge of "Justin" text ≈ x=106, y center=107) → Basket left≈247, Renang left≈247 */}
                      <line x1="106" y1="107" x2="246" y2="93"  stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#arGreen)"/>
                      <line x1="106" y1="107" x2="246" y2="159" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#arGreen)"/>
                      {/* Arham (right edge of "Arham" text ≈ x=103, y center=142) → Voly left≈253, Futsal left≈247 */}
                      <line x1="103" y1="142" x2="252" y2="192" stroke="#fb923c" strokeWidth="1.5" markerEnd="url(#arOrange)"/>
                      <line x1="103" y1="142" x2="246" y2="126" stroke="#fb923c" strokeWidth="1.5" markerEnd="url(#arOrange)"/>
                      {/* Faiz — tidak ada panah */}
                      <text x="85" y="248" textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="8">Faiz tidak memiliki pasangan</text>
                    </svg>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 justify-center mt-1">
                    {[
                      { color: "bg-cyan-400",   label: "Enzo" },
                      { color: "bg-green-400",  label: "Justin" },
                      { color: "bg-orange-400", label: "Arham" },
                      { color: "bg-slate-500",  label: "Faiz (∅)" },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-1.5 text-xs font-body text-white/60">
                        <span className={`w-3 h-0.5 ${color} inline-block`} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Himpunan Pasangan Berurutan */}
                <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-green-300">2️⃣ Himpunan Pasangan Berurutan</p>
                  <p className="font-body text-xs text-white/60 mb-2">Ditulis sebagai kumpulan pasangan <InlineMath math="(a, b)" /> di mana <InlineMath math="a \in A" /> dan <InlineMath math="b \in B" />.</p>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 font-body text-xs leading-relaxed text-white/80">
                    <span className="text-green-300 font-bold text-sm">{"{"}</span>
                    {" "}
                    <span className="text-cyan-300">(Enzo, Badminton)</span>,{" "}
                    <span className="text-cyan-300">(Enzo, Basket)</span>,{" "}
                    <span className="text-cyan-300">(Enzo, Futsal)</span>,{" "}
                    <span className="text-green-200">(Justin, Basket)</span>,{" "}
                    <span className="text-green-200">(Justin, Renang)</span>,{" "}
                    <span className="text-orange-300">(Arham, Voly)</span>,{" "}
                    <span className="text-orange-300">(Arham, Futsal)</span>
                    {" "}
                    <span className="text-green-300 font-bold text-sm">{"}"}</span>
                  </div>
                  <p className="font-body text-xs text-white/40 text-center">Total: 7 pasangan berurutan · Faiz tidak memiliki pasangan</p>
                </div>

                {/* Grafik/Koordinat */}
                <div className="bg-slate-800/50 border border-violet-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-violet-300">3️⃣ Diagram Kartesius</p>
                  <p className="font-body text-xs text-white/60">Setiap pasangan digambar sebagai titik. Sumbu-x untuk siswa (domain), sumbu-y untuk ekskul (range).</p>
                  <div className="bg-slate-900/60 border border-violet-500/20 rounded-xl p-4 flex justify-center">
                    <svg viewBox="0 0 290 240" className="w-full max-w-xs" aria-label="Diagram kartesius relasi mengikuti">
                      {/* Grid — vertical per siswa */}
                      {[125,165,205,245].map(gx => (
                        <line key={gx} x1={gx} y1={20} x2={gx} y2={200} stroke="rgba(148,163,184,0.15)" strokeWidth="1" strokeDasharray="3,3"/>
                      ))}
                      {/* Grid — horizontal per ekskul */}
                      {[48,83,118,153,188].map(gy => (
                        <line key={gy} x1={85} y1={gy} x2={260} y2={gy} stroke="rgba(148,163,184,0.15)" strokeWidth="1" strokeDasharray="3,3"/>
                      ))}
                      {/* Axes */}
                      <line x1="85" y1="200" x2="263" y2="200" stroke="#94a3b8" strokeWidth="1.8"/>
                      <line x1="85" y1="200" x2="85"  y2="12"  stroke="#94a3b8" strokeWidth="1.8"/>
                      {/* Arrow tips */}
                      <polygon points="260,197 267,200 260,203" fill="#94a3b8"/>
                      <polygon points="82,12 85,5 88,12"         fill="#94a3b8"/>
                      {/* Y-axis labels (ekskul) — font-size 8.5 */}
                      <text x="81" y="51"  textAnchor="end" fill="#a78bfa" fontSize="8.5" fontWeight="bold">Voly</text>
                      <text x="81" y="86"  textAnchor="end" fill="#a78bfa" fontSize="8.5" fontWeight="bold">Renang</text>
                      <text x="81" y="121" textAnchor="end" fill="#a78bfa" fontSize="8.5" fontWeight="bold">Futsal</text>
                      <text x="81" y="156" textAnchor="end" fill="#a78bfa" fontSize="8.5" fontWeight="bold">Basket</text>
                      <text x="81" y="191" textAnchor="end" fill="#a78bfa" fontSize="8.5" fontWeight="bold">Badminton</text>
                      {/* Y-axis ticks */}
                      {[48,83,118,153,188].map(gy => (
                        <line key={gy} x1="81" y1={gy} x2="85" y2={gy} stroke="#94a3b8" strokeWidth="1.2"/>
                      ))}
                      {/* X-axis labels (siswa) */}
                      <text x="125" y="214" textAnchor="middle" fill="#22d3ee" fontSize="8.5" fontWeight="bold">Enzo</text>
                      <text x="165" y="214" textAnchor="middle" fill="#4ade80" fontSize="8.5" fontWeight="bold">Justin</text>
                      <text x="205" y="214" textAnchor="middle" fill="#fb923c" fontSize="8.5" fontWeight="bold">Arham</text>
                      <text x="245" y="214" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontWeight="bold">Faiz</text>
                      {/* X-axis ticks */}
                      {[125,165,205,245].map(gx => (
                        <line key={gx} x1={gx} y1="200" x2={gx} y2="204" stroke="#94a3b8" strokeWidth="1.2"/>
                      ))}
                      {/* Axis titles */}
                      <text x="175" y="228" textAnchor="middle" fill="#64748b" fontSize="7">Siswa (Domain)</text>
                      <text x="14"  y="110" textAnchor="middle" fill="#64748b" fontSize="7" transform="rotate(-90 14 110)">Ekskul (Range)</text>
                      {/* Data points
                          x: Enzo=125, Justin=165, Arham=205, Faiz=245
                          y: Voly=48, Renang=83, Futsal=118, Basket=153, Badminton=188
                      */}
                      {[
                        {cx:125, cy:188, c:"#22d3ee", label:"(Enzo,Bdm)"},
                        {cx:125, cy:153, c:"#22d3ee", label:"(Enzo,Bsk)"},
                        {cx:125, cy:118, c:"#22d3ee", label:"(Enzo,Ftsl)"},
                        {cx:165, cy:153, c:"#4ade80", label:"(Justin,Bsk)"},
                        {cx:165, cy:83,  c:"#4ade80", label:"(Justin,Rng)"},
                        {cx:205, cy:48,  c:"#fb923c", label:"(Arham,Vly)"},
                        {cx:205, cy:118, c:"#fb923c", label:"(Arham,Ftsl)"},
                      ].map(({cx,cy,c,label}) => (
                        <g key={label}>
                          <circle cx={cx} cy={cy} r="5" fill={c} stroke="white" strokeWidth="1.2"/>
                        </g>
                      ))}
                    </svg>
                  </div>
                  {/* Dot legend */}
                  <div className="flex flex-wrap gap-3 justify-center mt-1">
                    {[
                      {color:"bg-cyan-400",   label:"Enzo"},
                      {color:"bg-green-400",  label:"Justin"},
                      {color:"bg-orange-400", label:"Arham"},
                    ].map(({color,label}) => (
                      <div key={label} className="flex items-center gap-1.5 text-xs font-body text-white/60">
                        <span className={`w-2.5 h-2.5 rounded-full ${color} inline-block`}/>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Tips:</strong> Diagram panah paling mudah untuk memahami konsep, sedangkan grafik Kartesius berguna untuk visualisasi pola relasi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui <InlineMath math="A = \{1, 2, 3, 4\}" /> dan <InlineMath math="B = \{2, 4, 6, 8, 10\}" />. Tentukan relasi "dua kali dari" dari himpunan A ke B, lalu nyatakan dalam bentuk himpunan pasangan berurutan!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Tentukan setiap pasangan:</p>
                      <p className="text-white/70 mb-2">Aturan: <InlineMath math="b = 2 \times a" /></p>
                      <div className="space-y-1 text-xs">
                        {[
                          ["1", "2 × 1 = 2", "2 ∈ B ✓"],
                          ["2", "2 × 2 = 4", "4 ∈ B ✓"],
                          ["3", "2 × 3 = 6", "6 ∈ B ✓"],
                          ["4", "2 × 4 = 8", "8 ∈ B ✓"],
                        ].map(([a, hitung, cek]) => (
                          <div key={a} className="flex gap-3 items-center text-white/70">
                            <span className="bg-cyan-800/50 border border-cyan-500/30 rounded px-2 py-0.5 text-cyan-200 font-bold min-w-[24px] text-center">{a}</span>
                            <span>→</span>
                            <span className="text-white">{hitung}</span>
                            <span className="text-green-400">{cek}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Tulis himpunan pasangan berurutan:</p>
                      <BlockMath math="\{(1,2),\ (2,4),\ (3,6),\ (4,8)\}" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">Langkah 3 — Tentukan Range:</p>
                      <p className="text-white/70 text-xs">Range = anggota B yang benar-benar dipasangkan</p>
                      <BlockMath math="\text{Range} = \{2, 4, 6, 8\}" />
                      <p className="text-white/50 text-xs">Catatan: 10 ∈ B tapi tidak dipasangkan, sehingga bukan bagian dari range.</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-green-300">✅ Jawaban: <InlineMath math="\{(1,2),\ (2,4),\ (3,6),\ (4,8)\}" /></p>
                      <p className="text-white/60 text-xs mt-1">Range = <InlineMath math="\{2, 4, 6, 8\}" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Dari himpunan pasangan berurutan berikut: <InlineMath math="\{(2,5),\ (3,7),\ (4,9),\ (5,11)\}" />, tentukan:
                    <br />a) Domain, Kodomain, dan Range
                    <br />b) Aturan relasinya
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) Domain, Kodomain, dan Range:</p>
                      <div className="space-y-1 text-xs text-white/70">
                        <p>• <strong className="text-cyan-300">Domain</strong> = himpunan nilai pertama = <InlineMath math="\{2, 3, 4, 5\}" /></p>
                        <p>• <strong className="text-orange-300">Kodomain</strong> = himpunan nilai kedua = <InlineMath math="\{5, 7, 9, 11\}" /></p>
                        <p>• <strong className="text-green-300">Range</strong> = nilai yang benar-benar muncul = <InlineMath math="\{5, 7, 9, 11\}" /></p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">b) Aturan Relasi:</p>
                      <p className="text-white/70 text-xs mb-2">Cari hubungan antara nilai pertama (x) dan nilai kedua (y):</p>
                      <div className="space-y-1 text-xs text-white/60">
                        <p>x=2: y=5 → 5 = 2×2+1 ✓</p>
                        <p>x=3: y=7 → 7 = 2×3+1 ✓</p>
                        <p>x=4: y=9 → 9 = 2×4+1 ✓</p>
                        <p>x=5: y=11 → 11 = 2×5+1 ✓</p>
                      </div>
                      <BlockMath math="y = 2x + 1" />
                      <p className="text-white/60 text-xs">Aturan: "dua kali lebih satu dari"</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300">✅ Aturan relasi: <InlineMath math="y = 2x + 1" /> ("dua kali lebih satu dari")</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui <InlineMath math="P = \{1, 2, 3, 4, 5\}" /> dan <InlineMath math="Q = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}" />. Relasi dari P ke Q didefinisikan sebagai "faktor dari". Tentukan:
                    <br />a) Himpunan pasangan berurutan dari relasi ini
                    <br />b) Range dari relasi tersebut
                    <br />c) Apakah setiap anggota P pasti memiliki pasangan di Q?
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Tentukan aturan "faktor dari":</p>
                      <p className="text-white/60 text-xs mb-2">a adalah faktor dari b jika b habis dibagi a (b ÷ a tidak bersisa).</p>
                      <div className="space-y-1 text-xs text-white/70">
                        <p><strong className="text-cyan-200">1</strong> adalah faktor dari: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10</p>
                        <p><strong className="text-cyan-200">2</strong> adalah faktor dari: 2, 4, 6, 8, 10</p>
                        <p><strong className="text-cyan-200">3</strong> adalah faktor dari: 3, 6, 9</p>
                        <p><strong className="text-cyan-200">4</strong> adalah faktor dari: 4, 8</p>
                        <p><strong className="text-cyan-200">5</strong> adalah faktor dari: 5, 10</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">a) Himpunan Pasangan Berurutan:</p>
                      <div className="text-xs text-white/70 leading-relaxed">
                        <BlockMath math="\{(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10)," />
                        <BlockMath math="(2,2),(2,4),(2,6),(2,8),(2,10),(3,3),(3,6),(3,9)," />
                        <BlockMath math="(4,4),(4,8),(5,5),(5,10)\}" />
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">b) Range:</p>
                      <p className="text-white/60 text-xs mb-1">Anggota Q yang benar-benar dipasangkan:</p>
                      <BlockMath math="\text{Range} = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\} = Q" />
                      <p className="text-white/50 text-xs">Seluruh anggota Q menjadi range karena 1 adalah faktor dari semua bilangan!</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">c) Apakah setiap anggota P memiliki pasangan di Q?</p>
                      <p className="text-white/70 text-xs">Ya! Setiap bilangan <InlineMath math="a \in P" /> minimal merupakan faktor dari dirinya sendiri (karena <InlineMath math="a \in Q" /> untuk semua <InlineMath math="a \in P" />). Jadi setiap anggota P pasti punya pasangan di Q.</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-red-300">✅ Total pasangan: 22 pasangan berurutan. Range = Q (seluruh kodomain).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {[
                    ["Relasi", "Aturan yang menghubungkan sebagian/seluruh anggota himpunan A ke B"],
                    ["Domain", "Himpunan asal (himpunan A)"],
                    ["Kodomain", "Himpunan kawan (himpunan B)"],
                    ["Range", "Bagian dari kodomain yang benar-benar dipasangkan"],
                    ["4 Cara Penyajian", "Diagram panah, pasangan berurutan, tabel, grafik Kartesius"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Kunci:</strong> Range ⊆ Kodomain — range selalu merupakan bagian dari kodomain, tidak harus sama!
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianRelasiPage;
