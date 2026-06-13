import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, TrendingUp } from "lucide-react";
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

  const SectionHeader = ({ icon, iconColor, title }: {
    icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
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
          BARISAN DAN DERET ARITMETIKA
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Barisan dengan Selisih Tetap — Paling Sering Muncul di Ujian!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Pola Bilangan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══ BAGIAN 1: SUKU KE-N ══ */}
          <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-cyan-300 text-center">📐 BAGIAN 1 — SUKU KE-N BARISAN ARITMETIKA</p>
          </div>

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Apa Itu Barisan Aritmetika?" />
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pernahkah kamu memperhatikan susunan kursi di bioskop atau teater? Baris pertama mungkin berisi <strong className="text-cyan-300">10 kursi</strong>, baris kedua <strong className="text-cyan-300">13 kursi</strong>, baris ketiga <strong className="text-cyan-300">16 kursi</strong>, dan seterusnya. Setiap baris bertambah <strong className="text-yellow-300">3 kursi</strong> secara konsisten! Inilah contoh nyata dari <strong className="text-cyan-300">barisan aritmetika</strong> — barisan bilangan dengan <strong className="text-cyan-300">beda (selisih) yang sama</strong> antar suku berurutan. Dengan rumus barisan aritmetika, pengelola gedung bisa langsung menghitung jumlah kursi di baris manapun tanpa menghitung satu per satu.
                </p>

                <figure className="flex flex-col items-center gap-2">
                  <img
                    src="/bioskop-aritmetika.png"
                    alt="Kursi bioskop/teater membentuk barisan aritmetika"
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
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<TrendingUp className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Rumus Suku Ke-n" />
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Barisan aritmetika memiliki <strong className="text-cyan-300">beda (b) yang tetap</strong> antara suku-suku berurutan. Rumus suku ke-n memungkinkan kita langsung menemukan nilai suku manapun tanpa harus menghitung satu per satu.
                  </p>
                </div>

                {/* ── Contoh animasi busur ── */}
                <div className="space-y-3">
                  <p className="font-body text-xs font-bold text-white/70 uppercase tracking-widest">✨ Contoh Barisan Aritmetika</p>
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

                  {/* Deskripsi penggunaan rumus */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-bold text-yellow-300">📌 Cara Menggunakan Rumus Ini</p>
                    <p className="font-body text-xs text-white/75 leading-relaxed">
                      Rumus <InlineMath math="U_n = a + (n-1) \cdot b" /> dapat digunakan untuk <strong className="text-yellow-200">menentukan nilai suku manapun</strong> dalam suatu barisan aritmetika — suku ke-5, ke-20, bahkan ke-100 — tanpa perlu menghitung satu per satu, <strong className="text-cyan-300">asalkan</strong> dua hal berikut diketahui:
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-cyan-900/40 border border-cyan-500/30 rounded-lg px-3 py-2 text-center">
                        <p className="font-mono font-bold text-cyan-300 text-sm">a</p>
                        <p className="text-white/60 text-xs mt-0.5">Suku pertama barisan</p>
                      </div>
                      <div className="bg-green-900/40 border border-green-500/30 rounded-lg px-3 py-2 text-center">
                        <p className="font-mono font-bold text-green-300 text-sm">b</p>
                        <p className="text-white/60 text-xs mt-0.5">Beda (selisih tetap) antar suku</p>
                      </div>
                    </div>
                    <p className="font-body text-xs text-white/55 leading-relaxed pt-1">
                      Jika <InlineMath math="a" /> dan <InlineMath math="b" /> sudah diketahui, cukup substitusikan nilai <InlineMath math="n" /> (nomor suku yang dicari) ke dalam rumus, dan kamu langsung mendapatkan jawabannya! ✨
                    </p>
                  </div>
                </div>
              </div>
          </div>

          {/* CONTOH 1A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mudah (Suku ke-n)" />
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
          </div>

          {/* CONTOH 2A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sedang (Suku ke-n)" />
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
          </div>

          {/* CONTOH 3A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Sulit (Suku ke-n)" />
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Sebuah bioskop memiliki susunan kursi seperti barisan aritmetika. Diketahui baris ke-10 berisi <strong className="text-yellow-300">36 kursi</strong>, dan setiap baris bertambah <strong className="text-cyan-300">2 kursi</strong> dari baris sebelumnya.<br /><br />
                    a) Berapa banyak kursi di baris pertama?<br />
                    b) Berapa banyak kursi di baris ke-25?
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Identifikasi — apa yang diketahui:</p>
                      <p className="text-white/70">Beda setiap baris: <InlineMath math="b = 2" /></p>
                      <p className="text-white/70">Baris ke-10 berisi 36 kursi: <InlineMath math="U_{10} = 36" /></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">a) Cari suku pertama <InlineMath math="a" />:</p>
                      <BlockMath math="U_{10} = a + (10-1) \times b" />
                      <BlockMath math="36 = a + 9 \times 2" />
                      <BlockMath math="36 = a + 18 \Rightarrow a = 18" />
                      <p className="text-white/70 text-xs mt-1">Jadi baris pertama berisi <strong className="text-yellow-300">18 kursi</strong>.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">b) Hitung baris ke-25 <InlineMath math="U_{25}" />:</p>
                      <BlockMath math="U_{25} = 18 + (25-1) \times 2" />
                      <BlockMath math="U_{25} = 18 + 24 \times 2 = 18 + 48 = 66" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Baris pertama: <strong>18 kursi</strong>. Baris ke-25: <strong>66 kursi</strong></p>
                      <p className="text-white/60 text-xs mt-1">Cek: <InlineMath math="U_{10} = 18 + 9 \times 2 = 36" /> ✓</p>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* ══ BAGIAN 2: JUMLAH KE-N ══ */}
          <div className="bg-green-500/10 border border-green-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-green-300 text-center">∑ BAGIAN 2 — DERET ARITMETIKA</p>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<TrendingUp className="w-5 h-5" />} iconColor="text-green-400" title="📘 Rumus Jumlah Suku" />
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Jumlah <InlineMath math="n" /> suku pertama barisan aritmetika (dilambangkan <InlineMath math="S_n" />) dapat dihitung menggunakan dua rumus yang ekuivalen — pilih yang paling efisien sesuai informasi yang diketahui.
                  </p>
                </div>
                {/* ── Penurunan Rumus Sn ── */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-4 text-sm font-body">
                  <p className="text-white/80 font-semibold">💡 Dari mana rumus <InlineMath math="S_n" /> berasal?</p>

                  {/* Langkah 1 */}
                  <div className="bg-slate-800/60 border border-green-500/20 rounded-lg p-3 space-y-2">
                    <p className="text-green-300 font-semibold text-xs uppercase tracking-wide">Langkah 1 — Tulis barisan maju dan mundur</p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Misalkan <InlineMath math="S_n" /> adalah jumlah <InlineMath math="n" /> suku pertama. Kita tulis dua kali — maju dan mundur:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse mt-1">
                        <tbody>
                          <tr className="bg-cyan-900/30">
                            <td className="border border-white/10 px-2 py-1.5 text-cyan-300 font-bold text-center whitespace-nowrap"><InlineMath math="S_n" /> (maju)</td>
                            <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="= a" /></td>
                            <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ (a+b)" /></td>
                            <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ \cdots" /></td>
                            <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ U_n" /></td>
                          </tr>
                          <tr className="bg-orange-900/30">
                            <td className="border border-white/10 px-2 py-1.5 text-orange-300 font-bold text-center whitespace-nowrap"><InlineMath math="S_n" /> (mundur)</td>
                            <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="= U_n" /></td>
                            <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ (U_n - b)" /></td>
                            <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ \cdots" /></td>
                            <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ a" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Langkah 2 */}
                  <div className="bg-slate-800/60 border border-violet-500/20 rounded-lg p-3 space-y-2">
                    <p className="text-violet-300 font-semibold text-xs uppercase tracking-wide">Langkah 2 — Jumlahkan baris maju + mundur</p>
                    <p className="text-white/70 text-xs">Setiap kolom berpasangan menghasilkan nilai yang sama: <InlineMath math="a + U_n" /></p>
                    <div className="bg-violet-900/30 border border-violet-500/30 rounded-lg p-2 text-center">
                      <BlockMath math="2S_n = \underbrace{(a + U_n) + (a + U_n) + \cdots + (a + U_n)}_{n \text{ pasang}}" />
                      <BlockMath math="2S_n = n \times (a + U_n)" />
                    </div>
                  </div>

                  {/* Langkah 3 */}
                  <div className="bg-slate-800/60 border border-yellow-500/20 rounded-lg p-3 space-y-2">
                    <p className="text-yellow-300 font-semibold text-xs uppercase tracking-wide">Langkah 3 — Bagi kedua ruas dengan 2</p>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-2 text-center">
                      <BlockMath math="\boxed{S_n = \frac{n}{2}(a + U_n)}" />
                    </div>
                    <p className="text-white/60 text-xs">Karena <InlineMath math="U_n = a + (n-1)b" />, kita substitusikan:</p>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-2 text-center">
                      <BlockMath math="\boxed{S_n = \frac{n}{2}\left[2a + (n-1)b\right]}" />
                    </div>
                  </div>

                  {/* Visual: Pasangan Gauss */}
                  <div className="bg-slate-800/40 border border-white/10 rounded-lg p-3 space-y-2">
                    <p className="text-yellow-300 font-semibold text-xs">🧠 Ide Gauss — Lihat pasangannya!</p>
                    <p className="text-white/60 text-xs">Contoh: jumlah 1 + 2 + 3 + 4 + 5 (a=1, b=1, n=5, Uₙ=5)</p>
                    <div className="flex items-center justify-center gap-1 flex-wrap mt-1">
                      {[1,2,3,4,5].map((v, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <span className="text-xs text-white/40">{i < 2 ? "↕" : i === 2 ? "" : "↕"}</span>
                          <span className={`font-mono font-bold text-sm px-2 py-1 rounded ${i === 0 || i === 4 ? "bg-cyan-700/60 text-cyan-200" : i === 1 || i === 3 ? "bg-violet-700/60 text-violet-200" : "bg-slate-700/60 text-white/70"}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-white/50 text-xs text-center mt-1">
                      1+5 = <strong className="text-cyan-300">6</strong>, &nbsp; 2+4 = <strong className="text-violet-300">6</strong>, &nbsp; 3 di tengah → <InlineMath math="2S_5 = 5 \times 6 = 30 \Rightarrow S_5 = 15" />
                    </p>
                  </div>
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
          </div>

          {/* CONTOH 1B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mudah (Jumlah Suku)" />
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
          </div>

          {/* CONTOH 2B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sedang (Jumlah Suku)" />
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
          </div>

          {/* CONTOH 3B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Sulit (Jumlah Suku)" />
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Pada tumpukan batu bata, banyak batu bata paling atas ada 8 buah, tepat di bawahnya ada 10 buah, dan seterusnya setiap tumpukan di bawahnya selalu lebih banyak 2 buah dari tumpukan di atasnya. Jika ada 15 tumpukan batu bata (dari atas sampai bawah), berapa banyak batu bata seluruhnya?</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70 mb-2">Identifikasi barisan: <InlineMath math="8, 10, 12, \ldots" /></p>
                      <p className="text-white/70"><InlineMath math="a = 8" /> (batu bata tumpukan pertama/paling atas), <InlineMath math="b = 2" /> (beda), <InlineMath math="n = 15" /></p>
                      <p className="text-cyan-300 font-semibold mt-2">Gunakan rumus jumlah <InlineMath math="n" /> suku pertama:</p>
                      <BlockMath math="S_n = \frac{n}{2}[2a + (n-1)b]" />
                      <BlockMath math="S_{15} = \frac{15}{2}[2(8) + (15-1)(2)]" />
                      <BlockMath math="S_{15} = \frac{15}{2}[16 + 28] = \frac{15}{2} \times 44 = 15 \times 22 = 330" />
                    </div>
                    <div className="bg-slate-800/40 border border-white/10 rounded-lg p-2 text-xs font-body">
                      <p className="text-white/60">Cek: suku ke-15 = <InlineMath math="U_{15} = 8 + 14 \times 2 = 36" />. Cara cepat: <InlineMath math="S_{15} = \frac{15}{2}(8 + 36) = \frac{15}{2}(44) = 330" /> ✓</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ Total batu bata seluruhnya = <strong>330 buah</strong></p>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* CONTOH 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="✏️ Contoh 4 — Sulit (Jumlah Suku)" />
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-purple-700/60 text-purple-200" />
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Jumlah bilangan kelipatan 4 yang terletak di antara 200 dan 400 adalah…</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70 mb-2">Kelipatan 4 di antara 200 dan 400 (tidak termasuk 200 dan 400):</p>
                      <p className="text-white/70 mb-2"><InlineMath math="204, 208, 212, \ldots, 396" /></p>
                      <p className="text-white/70">Maka: <InlineMath math="a = 204" />, <InlineMath math="b = 4" />, <InlineMath math="U_n = 396" /></p>
                      <p className="text-cyan-300 font-semibold mt-2">Langkah 1 — Cari banyaknya suku (<InlineMath math="n" />):</p>
                      <BlockMath math="U_n = a + (n-1)b" />
                      <BlockMath math="396 = 204 + (n-1) \times 4" />
                      <BlockMath math="192 = (n-1) \times 4 \implies n - 1 = 48 \implies n = 49" />
                      <p className="text-cyan-300 font-semibold mt-2">Langkah 2 — Hitung jumlah 49 suku:</p>
                      <BlockMath math="S_{49} = \frac{n}{2}(a + U_n) = \frac{49}{2}(204 + 396)" />
                      <BlockMath math="S_{49} = \frac{49}{2} \times 600 = 49 \times 300 = 14.700" />
                    </div>
                    <div className="bg-slate-800/40 border border-white/10 rounded-lg p-2 text-xs font-body">
                      <p className="text-white/60">Catatan: ada 49 bilangan kelipatan 4 di antara 200 dan 400, dari 204 hingga 396.</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-purple-300">✅ Jumlah kelipatan 4 antara 200 dan 400 = <strong>14.700</strong></p>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-600 via-green-500 to-teal-500 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">📐 RANGKUMAN LENGKAP</p>
              <p className="font-body text-xs text-white/80 mt-0.5">Barisan dan Deret Aritmetika — Kelas 8</p>
            </div>

            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              {/* Rumus Utama */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-500 flex items-center justify-center text-[10px]">1</span>
                  Rumus-Rumus Utama
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-gradient-to-r from-cyan-900/70 to-cyan-800/30 border border-cyan-500/50 rounded-xl p-3 text-center">
                    <p className="font-body text-xs text-cyan-300 font-bold mb-1">🔢 Suku ke-n Barisan Aritmetika</p>
                    <BlockMath math="U_n = a + (n-1) \cdot b" />
                    <div className="flex justify-center gap-3 text-xs font-body flex-wrap mt-1">
                      <span className="text-cyan-300">a = suku pertama</span>
                      <span className="text-green-300">b = beda (selisih tetap)</span>
                      <span className="text-violet-300">n = nomor suku</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-900/70 to-green-800/30 border border-green-500/50 rounded-xl p-3 text-center">
                    <p className="font-body text-xs text-green-300 font-bold mb-1">∑ Jumlah n Suku Pertama (Deret Aritmetika)</p>
                    <BlockMath math="S_n = \frac{n}{2}[2a + (n-1)b] = \frac{n}{2}(a + U_n)" />
                    <p className="font-body text-xs text-white/50">Gunakan rumus kiri jika Uₙ belum diketahui, gunakan rumus kanan jika Uₙ sudah diketahui</p>
                  </div>
                  <div className="bg-gradient-to-r from-violet-900/70 to-violet-800/30 border border-violet-500/50 rounded-xl p-3 text-center">
                    <p className="font-body text-xs text-violet-300 font-bold mb-1">🔗 Hubungan Uₙ dan Sₙ</p>
                    <BlockMath math="U_n = S_n - S_{n-1} \quad (n \geq 2)" />
                    <p className="font-body text-xs text-white/50">Berguna saat hanya Sₙ yang diketahui, bukan Uₙ-nya</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-900/70 to-orange-800/30 border border-orange-500/50 rounded-xl p-3 text-center">
                    <p className="font-body text-xs text-orange-300 font-bold mb-1">📏 Cara Mencari Beda (b)</p>
                    <BlockMath math="b = U_2 - U_1 = U_3 - U_2 = U_n - U_{n-1}" />
                  </div>
                </div>
              </div>

              {/* Tips & Trik */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">2</span>
                  Tips &amp; Trik Jitu Aritmetika
                </p>
                <div className="space-y-2">
                  {[
                    { icon: "⚡", tip: "Langsung identifikasi a dan b dari soal", detail: "Tuliskan suku pertama (a) dan hitung selisih dua suku berurutan (b = U₂ − U₁) sebelum menggunakan rumus apapun.", color: "bg-yellow-900/30 border-yellow-500/30" },
                    { icon: "🔄", tip: "Sistem persamaan untuk dua kondisi", detail: "Jika diketahui Uₘ dan Uₙ, buat dua persamaan: Uₘ = a + (m−1)b dan Uₙ = a + (n−1)b, lalu eliminasi.", color: "bg-cyan-900/30 border-cyan-500/30" },
                    { icon: "📊", tip: "Pilih rumus Sₙ yang tepat", detail: "Jika Uₙ diketahui → pakai Sₙ = n/2 (a + Uₙ). Jika hanya a dan b → pakai Sₙ = n/2 [2a + (n−1)b].", color: "bg-green-900/30 border-green-500/30" },
                    { icon: "🧮", tip: "Cari banyak suku (n) dari soal cerita", detail: "Konversi satuan dulu (jam → menit, km → m, dll), lalu tentukan n dari barisan yang terbentuk.", color: "bg-violet-900/30 border-violet-500/30" },
                    { icon: "🎯", tip: "Trik suku tengah barisan aritmetika", detail: "Suku tengah barisan aritmetika = (a + Uₙ) / 2. Jika n gasal, suku tengah tepat di posisi (n+1)/2.", color: "bg-pink-900/30 border-pink-500/30" },
                  ].map(({ icon, tip, detail, color }) => (
                    <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{tip}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kesimpulan */}
              <div className="bg-gradient-to-br from-cyan-500/20 via-green-500/15 to-teal-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🏆</div>
                <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Barisan aritmetika adalah barisan dengan{" "}
                  <strong className="text-cyan-300">beda tetap (b)</strong>. Dengan rumus{" "}
                  <strong className="text-yellow-300">Uₙ = a + (n−1)b</strong> kamu bisa menemukan suku manapun secara instan, dan dengan{" "}
                  <strong className="text-green-300">Sₙ = n/2(a + Uₙ)</strong> kamu bisa menjumlahkan ribuan suku hanya dalam hitungan detik — seperti trik jenius Gauss!
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {["Beda Tetap (b)", "Uₙ = a+(n−1)b", "Sₙ = n/2[2a+(n−1)b]", "Sistem Persamaan", "Ide Gauss"].map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">
                  🚀 Lanjutkan ke Barisan Geometri untuk mempelajari pertumbuhan eksponensial!
                </p>
              </div>

            </div>
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
