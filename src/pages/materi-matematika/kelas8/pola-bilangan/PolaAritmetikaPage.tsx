import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── Animated Arc Panel for a single arithmetic sequence ── */
function ArithmeticArcPanel({
  label, terms, a, b, arcColor, labelColor, bgClass, textClass,
}: {
  label: string; terms: number[]; a: number; b: number;
  arcColor: string; labelColor: string; bgClass: string; textClass: string;
}) {
  const [visibleArcs, setVisibleArcs] = useState(0);
  const count = terms.length;
  const boxW = 44; const gap = 26;
  const totalW = count * boxW + (count - 1) * gap;
  const svgW = totalW + 20; const svgH = 90;
  const boxY = svgH - 36;
  const centers = terms.map((_, i) => 10 + i * (boxW + gap) + boxW / 2);
  const diffs = terms.slice(1).map((v, i) => v - terms[i]);
  const arcs = diffs.map((d, i) => {
    const x1 = centers[i]; const x2 = centers[i + 1];
    const cx = (x1 + x2) / 2; const arcH = 26;
    return { x1, x2, cx, cy: boxY - arcH, label: d >= 0 ? `+${d}` : `${d}` };
  });

  useEffect(() => {
    setVisibleArcs(0);
    let i = 0;
    const timer = setInterval(() => { i++; setVisibleArcs(i); if (i >= arcs.length) clearInterval(timer); }, 350);
    return () => clearInterval(timer);
  }, [arcs.length]);

  return (
    <div className={`rounded-xl border p-4 ${bgClass}`}>
      <p className={`font-body text-xs font-bold uppercase tracking-wider mb-1 ${textClass}`}>{label}</p>
      <p className="font-body text-xs text-white/60 mb-3">
        <span className={`font-mono font-bold ${textClass}`}>a = {a}</span>
        <span className="mx-2 text-white/30">|</span>
        <span className={`font-mono font-bold ${textClass}`}>b = {b}</span>
      </p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ maxWidth: svgW, display: "block", margin: "0 auto" }}>
          <style>{`@keyframes arcGlow{from{stroke-dashoffset:300;stroke-dasharray:300;opacity:0}to{stroke-dashoffset:0;stroke-dasharray:300;opacity:1}}`}</style>
          {arcs.slice(0, visibleArcs).map((arc, i) => (
            <g key={i}>
              <path
                d={`M ${arc.x1} ${boxY} Q ${arc.cx} ${arc.cy} ${arc.x2} ${boxY}`}
                fill="none" stroke={arcColor} strokeWidth="2.2"
                style={{ filter: `drop-shadow(0 0 5px ${arcColor}aa)`, animation: "arcGlow 0.4s ease-out" }}
              />
              <text x={arc.cx} y={arc.cy - 5} textAnchor="middle" fontSize="11" fontWeight="bold"
                fill={labelColor} style={{ filter: `drop-shadow(0 0 4px ${arcColor})` }}>
                {arc.label}
              </text>
            </g>
          ))}
          {terms.map((val, i) => (
            <g key={i}>
              <rect x={centers[i] - boxW / 2} y={boxY} width={boxW} height={30} rx={6}
                fill={arcColor + "22"} stroke={arcColor + "99"} strokeWidth="1.5" />
              <text x={centers[i]} y={boxY + 20} textAnchor="middle" fontSize="13" fontWeight="bold" fill={labelColor}>
                {val}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className={`text-center text-xs font-bold font-body mt-2`} style={{ color: labelColor }}>
        Beda tetap = {b > 0 ? `+${b}` : b} (setiap suku {b > 0 ? "bertambah" : "berkurang"} {Math.abs(b)})
      </p>
    </div>
  );
}

const PolaAritmetikaPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "rumus", "contoh1a", "contoh2a", "contoh3a",
    "jumlah", "contoh1b", "contoh2b", "contoh3b",
    "aplikasi", "contoh1c", "rangkuman",
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
      {expandedSections.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
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
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          POLA ARITMETIKA
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Barisan dengan Selisih Tetap — Paling Sering Muncul di Ujian!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Pola Bilangan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══ BAGIAN 1: SUKU KE-N ══ */}
          <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-cyan-300 text-center">📐 BAGIAN 1 — SUKU KE-N POLA ARITMETIKA</p>
          </div>

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Pola Aritmetika?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernahkah kamu memperhatikan susunan kursi di bioskop atau teater? Baris pertama mungkin berisi <strong className="text-cyan-300">10 kursi</strong>, baris kedua <strong className="text-cyan-300">13 kursi</strong>, baris ketiga <strong className="text-cyan-300">16 kursi</strong>, dan seterusnya. Setiap baris bertambah <strong className="text-yellow-300">3 kursi</strong> secara konsisten! Inilah contoh nyata dari <strong className="text-cyan-300">pola aritmetika</strong> — barisan bilangan dengan <strong className="text-cyan-300">beda (selisih) yang sama</strong> antar suku berurutan. Dengan rumus pola aritmetika, pengelola gedung bisa langsung menghitung jumlah kursi di baris manapun tanpa menghitung satu per satu.
                </p>

                <figure className="flex flex-col items-center gap-2">
                  <img
                    src="/bioskop-aritmetika.png"
                    alt="Kursi bioskop/teater membentuk pola aritmetika"
                    className="w-full max-w-sm rounded-xl border border-cyan-500/30 shadow-lg object-cover"
                  />
                  <figcaption className="font-body text-xs text-white/50 italic text-center">
                    🎬 Susunan kursi bioskop — setiap baris bertambah sejumlah kursi yang sama, membentuk barisan aritmetika!
                  </figcaption>
                </figure>

                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔑 Komponen Utama Barisan Aritmetika</p>
                  <div className="grid grid-cols-1 gap-2 text-xs font-body">
                    {[
                      { simbol: "a atau U₁", nama: "Suku pertama", desc: "Bilangan awal dalam barisan", color: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
                      { simbol: "b atau d", nama: "Beda (selisih)", desc: "Selisih tetap antar suku: b = Uₙ − Uₙ₋₁", color: "bg-green-900/50 border-green-500/40 text-green-200" },
                      { simbol: "n", nama: "Nomor suku", desc: "Urutan suku (suku ke-1, ke-2, ke-n ...)", color: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
                      { simbol: "Uₙ", nama: "Suku ke-n", desc: "Nilai suku pada posisi ke-n", color: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
                    ].map(({ simbol, nama, desc, color }) => (
                      <div key={simbol} className={`border ${color} rounded-lg px-3 py-2 flex justify-between items-center`}>
                        <div>
                          <p className="font-bold font-mono">{simbol}</p>
                          <p className="text-white/60">{nama}</p>
                        </div>
                        <p className="text-white/50 text-right max-w-[50%]">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Rumus Suku Ke-n" />
            {expandedSections.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Pola aritmetika memiliki <strong className="text-cyan-300">beda (b) yang tetap</strong> antara suku-suku berurutan. Rumus suku ke-n memungkinkan kita langsung menemukan nilai suku manapun tanpa harus menghitung satu per satu.
                  </p>
                </div>

                {/* ── Contoh animasi busur ── */}
                <div className="space-y-3">
                  <p className="font-body text-xs font-bold text-white/70 uppercase tracking-widest">✨ Contoh Pola Aritmetika</p>
                  <ArithmeticArcPanel
                    label="Barisan Naik: 1, 3, 5, 7, 9, ..."
                    terms={[1, 3, 5, 7, 9]}
                    a={1} b={2}
                    arcColor="#22d3ee"
                    labelColor="#a5f3fc"
                    bgClass="bg-cyan-900/40 border-cyan-500/50"
                    textClass="text-cyan-300"
                  />
                  <ArithmeticArcPanel
                    label="Barisan Turun: 8, 6, 4, 2, 0, ..."
                    terms={[8, 6, 4, 2, 0]}
                    a={8} b={-2}
                    arcColor="#f97316"
                    labelColor="#fed7aa"
                    bgClass="bg-orange-900/40 border-orange-500/50"
                    textClass="text-orange-300"
                  />
                </div>

                <div className="bg-slate-800/50 border border-cyan-500/30 rounded-xl p-4 text-center">
                  <p className="font-body text-xs text-white/60 mb-2">Rumus Suku ke-n Barisan Aritmetika:</p>
                  <BlockMath math="\boxed{U_n = a + (n-1) \cdot b}" />
                  <div className="flex justify-center gap-4 mt-2 text-xs font-body flex-wrap">
                    <span className="text-cyan-300"><InlineMath math="a" /> = suku pertama</span>
                    <span className="text-green-300"><InlineMath math="b" /> = beda</span>
                    <span className="text-violet-300"><InlineMath math="n" /> = nomor suku</span>
                  </div>
                </div>

                {/* Penurunan rumus visual */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-4 text-sm font-body">
                  <p className="text-white/80 font-semibold">💡 Dari mana rumus <InlineMath math="U_n = a + (n-1)b" /> berasal?</p>

                  {/* Tabel pola */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-violet-500/30 bg-violet-900/50 px-3 py-2 text-violet-200 text-center font-bold">Suku ke-</th>
                          <th className="border border-cyan-500/30 bg-cyan-900/50 px-3 py-2 text-cyan-200 text-center font-bold">Nilai Suku</th>
                          <th className="border border-green-500/30 bg-green-900/50 px-3 py-2 text-green-200 text-center font-bold">Berapa kali tambah <InlineMath math="b" />?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { n: "1", val: "a",          latex: "a",              kali: "0 kali", hi: false },
                          { n: "2", val: "a + b",      latex: "a + b",          kali: "1 kali", hi: false },
                          { n: "3", val: "a + 2b",     latex: "a + 2b",         kali: "2 kali", hi: false },
                          { n: "4", val: "a + 3b",     latex: "a + 3b",         kali: "3 kali", hi: false },
                          { n: "⋮",  val: "⋮",          latex: null,             kali: "⋮",      hi: false },
                          { n: "n", val: "a + (n−1)b", latex: "a + (n-1)b",    kali: "(n−1) kali", hi: true },
                        ].map(({ n, val, latex, kali, hi }, i) => (
                          <tr key={i} className={hi ? "bg-cyan-900/40" : i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                            <td className={`border border-white/10 px-3 py-2 text-center font-bold font-mono ${hi ? "text-cyan-300" : "text-violet-300"}`}>{n}</td>
                            <td className={`border border-white/10 px-3 py-2 text-center font-mono ${hi ? "text-yellow-300 font-bold" : "text-white/80"}`}>
                              {latex ? <InlineMath math={latex} /> : val}
                            </td>
                            <td className={`border border-white/10 px-3 py-2 text-center ${hi ? "text-green-300 font-bold" : "text-white/50"}`}>{kali}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Penjelasan pola */}
                  <div className="bg-slate-800/60 border border-cyan-500/20 rounded-lg p-3 space-y-2">
                    <p className="text-white/70 text-xs font-semibold">🔍 Perhatikan polanya:</p>
                    <div className="space-y-1 text-xs text-white/60 leading-relaxed">
                      <p>• Suku ke-<strong className="text-violet-300">1</strong> &nbsp;= <InlineMath math="a" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ tambah <InlineMath math="b" /> sebanyak <strong className="text-green-300">0</strong> kali</p>
                      <p>• Suku ke-<strong className="text-violet-300">2</strong> &nbsp;= <InlineMath math="a + b" /> &nbsp;&nbsp;→ tambah <InlineMath math="b" /> sebanyak <strong className="text-green-300">1</strong> kali</p>
                      <p>• Suku ke-<strong className="text-violet-300">3</strong> &nbsp;= <InlineMath math="a + 2b" /> → tambah <InlineMath math="b" /> sebanyak <strong className="text-green-300">2</strong> kali</p>
                      <p>• Suku ke-<strong className="text-violet-300">4</strong> &nbsp;= <InlineMath math="a + 3b" /> → tambah <InlineMath math="b" /> sebanyak <strong className="text-green-300">3</strong> kali</p>
                      <p className="text-cyan-300 font-semibold pt-1">
                        • Suku ke-<strong className="text-violet-300">n</strong> = <InlineMath math="a + (n-1)b" /> → tambah <InlineMath math="b" /> sebanyak <strong className="text-green-300">(n−1)</strong> kali
                      </p>
                    </div>
                  </div>

                  {/* Kesimpulan rumus */}
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3 text-center">
                    <p className="text-xs text-white/60 mb-1">Kesimpulan — Rumus Umum Suku ke-n:</p>
                    <BlockMath math="\boxed{U_n = a + (n - 1) \cdot b}" />
                    <p className="text-xs text-cyan-300 mt-1">karena setiap suku ke-<InlineMath math="n" /> menambahkan <InlineMath math="b" /> sebanyak <InlineMath math="(n-1)" /> kali dari suku pertama <InlineMath math="a" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1a" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mudah (Suku ke-n)" />
            {expandedSections.includes("contoh1a") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Barisan aritmetika: 4, 7, 10, 13, ...<br />Tentukan suku ke-20!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                      <p className="text-white/70">Identifikasi: <InlineMath math="a = 4" />, <InlineMath math="b = 7 - 4 = 3" />, <InlineMath math="n = 20" /></p>
                      <BlockMath math="U_{20} = 4 + (20 - 1) \times 3 = 4 + 19 \times 3 = 4 + 57 = 61" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Suku ke-20 = <strong>61</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2a" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sedang (Suku ke-n)" />
            {expandedSections.includes("contoh2a") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Suku ke-5 suatu barisan aritmetika adalah 23 dan suku ke-9 adalah 39. Tentukan suku pertama dan bedanya, lalu hitung suku ke-15!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Buat sistem persamaan:</p>
                      <BlockMath math="U_5 = a + 4b = 23 \quad \cdots (I)" />
                      <BlockMath math="U_9 = a + 8b = 39 \quad \cdots (II)" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Eliminasi (II) - (I):</p>
                      <BlockMath math="4b = 16 \Rightarrow b = 4" />
                      <p className="text-white/70">Substitusi ke (I): <InlineMath math="a + 4(4) = 23 \Rightarrow a = 7" /></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Langkah 3 — Hitung <InlineMath math="U_{15}" />:</p>
                      <BlockMath math="U_{15} = 7 + (15-1) \times 4 = 7 + 56 = 63" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ <InlineMath math="a = 7" />, <InlineMath math="b = 4" />, <InlineMath math="U_{15} = 63" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3a" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Sulit (Suku ke-n)" />
            {expandedSections.includes("contoh3a") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Tiga bilangan membentuk barisan aritmetika. Jumlah ketiganya adalah 33 dan hasil kali ketiganya adalah 935. Tentukan ketiga bilangan tersebut!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Misalkan tiga suku aritmetika:</p>
                      <p className="text-white/70">Trick: tulis sebagai <InlineMath math="(a-b),\ a,\ (a+b)" /> agar penjumlahannya elegan.</p>
                      <BlockMath math="(a-b) + a + (a+b) = 33 \Rightarrow 3a = 33 \Rightarrow a = 11" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Gunakan hasil kali:</p>
                      <BlockMath math="(a-b) \cdot a \cdot (a+b) = 935" />
                      <BlockMath math="(11-b) \cdot 11 \cdot (11+b) = 935" />
                      <BlockMath math="11(121 - b^2) = 935" />
                      <BlockMath math="121 - b^2 = 85 \Rightarrow b^2 = 36 \Rightarrow b = 6" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Langkah 3 — Ketiga bilangan:</p>
                      <BlockMath math="(11-6),\ 11,\ (11+6) \Rightarrow 5,\ 11,\ 17" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Tiga bilangan: <strong>5, 11, 17</strong></p>
                      <p className="text-white/60 text-xs mt-1">Cek: 5+11+17 = 33 ✓, 5×11×17 = 935 ✓</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══ BAGIAN 2: JUMLAH KE-N ══ */}
          <div className="bg-green-500/10 border border-green-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-green-300 text-center">∑ BAGIAN 2 — JUMLAH HINGGA SUKU KE-N POLA ARITMETIKA</p>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="jumlah" icon={<TrendingUp className="w-5 h-5" />} iconColor="text-green-400" title="📘 Rumus Jumlah Suku" />
            {expandedSections.includes("jumlah") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Jumlah <InlineMath math="n" /> suku pertama barisan aritmetika (dilambangkan <InlineMath math="S_n" />) dapat dihitung menggunakan dua rumus yang ekuivalen — pilih yang paling efisien sesuai informasi yang diketahui.
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-green-500/30 rounded-xl p-4 space-y-3 text-center">
                  <p className="font-body text-xs text-white/60">Rumus 1 (jika diketahui a, b, n):</p>
                  <BlockMath math="\boxed{S_n = \frac{n}{2}\left[2a + (n-1)b\right]}" />
                  <p className="font-body text-xs text-white/60 mt-2">Rumus 2 (jika diketahui suku pertama dan suku terakhir):</p>
                  <BlockMath math="\boxed{S_n = \frac{n}{2}(a + U_n)}" />
                </div>
                <div className="bg-slate-800/40 border border-white/10 rounded-lg p-3 text-sm font-body">
                  <p className="text-yellow-300 font-semibold mb-1">🧠 Kisah di balik rumus:</p>
                  <p className="text-white/70 text-xs">Carl Friedrich Gauss (umur 9 tahun) diminta guru menjumlahkan 1 sampai 100. Ia cepat menjawab 5.050! Rahasianya: pasangkan suku pertama (1) dengan terakhir (100) = 101, ada 50 pasang, jadi 50 × 101 = 5.050. Inilah ide di balik rumus <InlineMath math="S_n" />!</p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1b" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mudah (Jumlah Suku)" />
            {expandedSections.includes("contoh1b") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Barisan aritmetika: 3, 7, 11, 15, ...<br />Hitung jumlah 15 suku pertama!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70"><InlineMath math="a = 3" />, <InlineMath math="b = 4" />, <InlineMath math="n = 15" /></p>
                      <BlockMath math="S_{15} = \frac{15}{2}\left[2(3) + (15-1)(4)\right]" />
                      <BlockMath math="= \frac{15}{2}\left[6 + 56\right] = \frac{15}{2} \times 62 = 15 \times 31 = 465" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ <InlineMath math="S_{15} = 465" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2b" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sedang (Jumlah Suku)" />
            {expandedSections.includes("contoh2b") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Jumlah 10 suku pertama suatu barisan aritmetika adalah 155 dan suku pertamanya adalah 5. Tentukan beda dan suku ke-10!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70">Diketahui: <InlineMath math="S_{10} = 155" />, <InlineMath math="a = 5" />, <InlineMath math="n = 10" /></p>
                      <BlockMath math="155 = \frac{10}{2}\left[2(5) + 9b\right]" />
                      <BlockMath math="155 = 5(10 + 9b)" />
                      <BlockMath math="31 = 10 + 9b \Rightarrow 9b = 21 \Rightarrow b = \frac{7}{3}" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Suku ke-10:</p>
                      <BlockMath math="U_{10} = 5 + 9 \times \frac{7}{3} = 5 + 21 = 26" />
                    </div>
                    <div className="bg-slate-800/40 border border-yellow-500/20 rounded-lg p-2">
                      <p className="text-yellow-200 text-xs">Alternatif lebih cepat: <InlineMath math="S_{10} = \frac{10}{2}(a + U_{10}) \Rightarrow 155 = 5(5 + U_{10}) \Rightarrow U_{10} = 26" /></p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ <InlineMath math="b = \frac{7}{3}" />, <InlineMath math="U_{10} = 26" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3b" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Sulit (Jumlah Suku)" />
            {expandedSections.includes("contoh3b") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Jumlah suku ke-3 hingga ke-7 dari barisan aritmetika 2, 5, 8, 11, ... adalah berapa?</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70"><InlineMath math="a = 2" />, <InlineMath math="b = 3" /></p>
                      <p className="text-cyan-300 font-semibold mt-2">Strategi: Jumlah suku ke-3 s.d. ke-7 = <InlineMath math="S_7 - S_2" /></p>
                      <BlockMath math="S_7 = \frac{7}{2}[2(2) + 6(3)] = \frac{7}{2}[4 + 18] = \frac{7}{2}(22) = 77" />
                      <BlockMath math="S_2 = \frac{2}{2}[2(2) + 1(3)] = 1 \times 7 = 7" />
                      <BlockMath math="\text{Jumlah} = S_7 - S_2 = 77 - 7 = 70" />
                    </div>
                    <div className="bg-slate-800/40 border border-white/10 rounded-lg p-2 text-xs font-body">
                      <p className="text-white/60">Verifikasi: <InlineMath math="U_3 + U_4 + U_5 + U_6 + U_7 = 8 + 11 + 14 + 17 + 20 = 70" /> ✓</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Jumlah suku ke-3 hingga ke-7 = <strong>70</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══ BAGIAN 3: APLIKASI ══ */}
          <div className="bg-orange-500/10 border border-orange-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-orange-300 text-center">🌍 BAGIAN 3 — APLIKASI POLA ARITMETIKA KONTEKSTUAL</p>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="aplikasi" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-orange-400" title="🌍 Pola Aritmetika dalam Kehidupan Nyata" />
            {expandedSections.includes("aplikasi") && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80">Pola aritmetika bukan hanya soal ujian — ia hadir di sekitar kita setiap hari!</p>
                <div className="grid grid-cols-1 gap-2 text-xs font-body">
                  {[
                    { icon: "🪑", contoh: "Kursi di gedung bioskop: baris 1 ada 15 kursi, baris 2 ada 17, baris 3 ada 19..." },
                    { icon: "💰", contoh: "Tabungan: menabung Rp10.000 di bulan 1, Rp12.000 di bulan 2, Rp14.000 di bulan 3..." },
                    { icon: "🏗️", contoh: "Tumpukan batu bata: baris bawah 30 batu, tiap baris berkurang 3 batu ke atas" },
                    { icon: "⏰", contoh: "Jadwal bus setiap 15 menit, denda yang bertambah tetap tiap hari, dll." },
                  ].map(({ icon, contoh }) => (
                    <div key={icon} className="bg-orange-900/20 border border-orange-500/20 rounded-lg p-2 flex gap-2">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/70">{contoh}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1C */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1c" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="✏️ Soal Aplikasi — Gedung Bioskop" />
            {expandedSections.includes("contoh1c") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="KONTEKSTUAL" color="bg-orange-700/60 text-orange-200" />
                <div className="bg-slate-800/60 border border-orange-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Sebuah gedung bioskop memiliki 12 baris kursi. Baris pertama berisi 20 kursi. Setiap baris berikutnya bertambah 4 kursi dari baris sebelumnya.<br />
                    a) Berapa banyak kursi di baris ke-12?<br />
                    b) Berapa total kursi di seluruh gedung?
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70 mb-1">Barisan aritmetika: <InlineMath math="a = 20" />, <InlineMath math="b = 4" />, <InlineMath math="n = 12" /></p>
                      <p className="text-cyan-300 font-semibold">a) Kursi baris ke-12:</p>
                      <BlockMath math="U_{12} = 20 + (12-1) \times 4 = 20 + 44 = 64 \text{ kursi}" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">b) Total kursi:</p>
                      <BlockMath math="S_{12} = \frac{12}{2}(20 + 64) = 6 \times 84 = 504 \text{ kursi}" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Baris ke-12: <strong>64 kursi</strong>. Total: <strong>504 kursi</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman Pola Aritmetika" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-white/60 mb-1">Suku ke-n</p>
                      <BlockMath math="U_n = a + (n-1)b" />
                    </div>
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-white/60 mb-1">Jumlah n suku pertama</p>
                      <BlockMath math="S_n = \frac{n}{2}[2a + (n-1)b] = \frac{n}{2}(a + U_n)" />
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-white/60 mb-1">Hubungan Uₙ dan Sₙ</p>
                      <BlockMath math="U_n = S_n - S_{n-1}" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/pola-bilangan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolaAritmetikaPage;
