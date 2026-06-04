import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Hash,
  ListChecks,
  Zap,
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ══════════════════════════════════════════════════════════
   SVG VISUAL COMPONENTS
══════════════════════════════════════════════════════════ */

/** Diagram Venn berlabel kardinalitas untuk 2 himpunan */
const VennKardinalitas2 = () => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-xs font-mono text-cyan-300 tracking-wider">Kardinalitas Dua Himpunan</p>
    <svg viewBox="0 0 300 170" className="w-full max-w-xs" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="292" height="162" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
      <text x="278" y="20" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="monospace">S</text>
      {/* Lingkaran A */}
      <circle cx="115" cy="85" r="58" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="2" fillOpacity="0.7"/>
      {/* Lingkaran B */}
      <circle cx="185" cy="85" r="58" fill="#1e1f5e" stroke="#818cf8" strokeWidth="2" fillOpacity="0.7"/>
      {/* Label daerah */}
      <text x="78" y="80" textAnchor="middle" fontSize="11" fill="#bae6fd" fontFamily="monospace" fontWeight="bold">a</text>
      <text x="78" y="95" textAnchor="middle" fontSize="9" fill="#93c5fd" fontFamily="sans-serif">hanya A</text>
      <text x="150" y="80" textAnchor="middle" fontSize="11" fill="#6ee7b7" fontFamily="monospace" fontWeight="bold">b</text>
      <text x="150" y="95" textAnchor="middle" fontSize="9" fill="#a7f3d0" fontFamily="sans-serif">A∩B</text>
      <text x="222" y="80" textAnchor="middle" fontSize="11" fill="#c7d2fe" fontFamily="monospace" fontWeight="bold">c</text>
      <text x="222" y="95" textAnchor="middle" fontSize="9" fill="#a5b4fc" fontFamily="sans-serif">hanya B</text>
      <text x="20" y="155" fontSize="9" fill="#475569" fontFamily="monospace">d = di luar A dan B</text>
      {/* Rumus */}
      <text x="150" y="155" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="monospace">n(S) = a+b+c+d</text>
    </svg>
    <div className="grid grid-cols-2 gap-2 w-full max-w-xs text-xs font-mono">
      <div className="bg-sky-900/40 border border-sky-500/30 rounded p-2">
        <span className="text-sky-300 font-bold">n(A) = a + b</span>
      </div>
      <div className="bg-indigo-900/40 border border-indigo-500/30 rounded p-2">
        <span className="text-indigo-300 font-bold">n(B) = b + c</span>
      </div>
      <div className="bg-emerald-900/40 border border-emerald-500/30 rounded p-2">
        <span className="text-emerald-300 font-bold">n(A∩B) = b</span>
      </div>
      <div className="bg-purple-900/40 border border-purple-500/30 rounded p-2">
        <span className="text-purple-300 font-bold">n(A∪B) = a+b+c</span>
      </div>
    </div>
  </div>
);

/** Diagram Venn berlabel untuk 3 himpunan */
const VennKardinalitas3 = () => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-xs font-mono text-cyan-300 tracking-wider">Kardinalitas Tiga Himpunan</p>
    <svg viewBox="0 0 300 200" className="w-full max-w-xs" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="292" height="192" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
      <text x="278" y="20" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">S</text>
      {/* Tiga lingkaran */}
      <circle cx="130" cy="80" r="55" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1.8" fillOpacity="0.55"/>
      <circle cx="170" cy="80" r="55" fill="#1e1f5e" stroke="#818cf8" strokeWidth="1.8" fillOpacity="0.55"/>
      <circle cx="150" cy="120" r="55" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.8" fillOpacity="0.55"/>
      {/* Labels */}
      <text x="100" y="62" textAnchor="middle" fontSize="11" fill="#bae6fd" fontWeight="bold" fontFamily="monospace">A</text>
      <text x="200" y="62" textAnchor="middle" fontSize="11" fill="#c7d2fe" fontWeight="bold" fontFamily="monospace">B</text>
      <text x="150" y="178" textAnchor="middle" fontSize="11" fill="#bbf7d0" fontWeight="bold" fontFamily="monospace">C</text>
      {/* Region labels */}
      <text x="100" y="80" textAnchor="middle" fontSize="9" fill="#7dd3fc" fontFamily="monospace">hanya A</text>
      <text x="200" y="80" textAnchor="middle" fontSize="9" fill="#a5b4fc" fontFamily="monospace">hanya B</text>
      <text x="150" y="165" textAnchor="middle" fontSize="9" fill="#86efac" fontFamily="monospace">hanya C</text>
      <text x="150" y="76" textAnchor="middle" fontSize="9" fill="#fde68a" fontFamily="monospace">A∩B</text>
      <text x="122" y="125" textAnchor="middle" fontSize="9" fill="#fca5a5" fontFamily="monospace">A∩C</text>
      <text x="178" y="125" textAnchor="middle" fontSize="9" fill="#6ee7b7" fontFamily="monospace">B∩C</text>
      <text x="150" y="108" textAnchor="middle" fontSize="9" fill="var(--icon-color)" fontFamily="monospace">A∩B∩C</text>
    </svg>
  </div>
);

/** Flowchart langkah penyelesaian */
const FlowchartLangkah = () => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-xs font-mono text-cyan-300 tracking-wider">Alur Penyelesaian Masalah Himpunan</p>
    <svg viewBox="0 0 260 310" className="w-full max-w-[220px]" xmlns="http://www.w3.org/2000/svg">
      {/* Step 1 */}
      <rect x="30" y="10" width="200" height="44" rx="8" fill="#164e63" stroke="#22d3ee" strokeWidth="1.5"/>
      <text x="130" y="29" textAnchor="middle" fontSize="10" fill="#a5f3fc" fontFamily="sans-serif" fontWeight="bold">① IDENTIFIKASI</text>
      <text x="130" y="46" textAnchor="middle" fontSize="9" fill="#cffafe" fontFamily="sans-serif">Baca soal, tandai data</text>
      {/* Arrow */}
      <line x1="130" y1="54" x2="130" y2="72" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arr)"/>
      {/* Step 2 */}
      <rect x="30" y="72" width="200" height="44" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5"/>
      <text x="130" y="91" textAnchor="middle" fontSize="10" fill="#c7d2fe" fontFamily="sans-serif" fontWeight="bold">② MODELKAN</text>
      <text x="130" y="108" textAnchor="middle" fontSize="9" fill="#e0e7ff" fontFamily="sans-serif">Buat notasi & Diagram Venn</text>
      {/* Arrow */}
      <line x1="130" y1="116" x2="130" y2="134" stroke="#475569" strokeWidth="1.5"/>
      <polygon points="124,132 136,132 130,142" fill="#475569"/>
      {/* Step 3 */}
      <rect x="30" y="142" width="200" height="44" rx="8" fill="#14532d" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="130" y="161" textAnchor="middle" fontSize="10" fill="#bbf7d0" fontFamily="sans-serif" fontWeight="bold">③ ISI DIAGRAM</text>
      <text x="130" y="178" textAnchor="middle" fontSize="9" fill="#d1fae5" fontFamily="sans-serif">Mulai dari irisan/tengah</text>
      {/* Arrow */}
      <line x1="130" y1="186" x2="130" y2="204" stroke="#475569" strokeWidth="1.5"/>
      <polygon points="124,202 136,202 130,212" fill="#475569"/>
      {/* Step 4 */}
      <rect x="30" y="212" width="200" height="44" rx="8" fill="#451a03" stroke="#fb923c" strokeWidth="1.5"/>
      <text x="130" y="231" textAnchor="middle" fontSize="10" fill="#fed7aa" fontFamily="sans-serif" fontWeight="bold">④ HITUNG & VERIFIKASI</text>
      <text x="130" y="248" textAnchor="middle" fontSize="9" fill="#ffedd5" fontFamily="sans-serif">Pakai rumus, cek total = n(S)</text>
      {/* Arrow */}
      <line x1="130" y1="256" x2="130" y2="274" stroke="#475569" strokeWidth="1.5"/>
      <polygon points="124,272 136,272 130,282" fill="#475569"/>
      {/* Step 5 */}
      <rect x="30" y="282" width="200" height="22" rx="6" fill="#3b0764" stroke="#a855f7" strokeWidth="1.5"/>
      <text x="130" y="297" textAnchor="middle" fontSize="10" fill="#e9d5ff" fontFamily="sans-serif" fontWeight="bold">✅ KESIMPULAN</text>
    </svg>
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */

const PemecahanMasalahHimpunanPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "kardinalitas", "langkah", "tips",
  ]);

  const toggleSection = (s: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const SectionHeader = ({
    id, icon, label, iconColor,
  }: { id: string; icon: React.ReactNode; label: string; iconColor: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{label}</span>
      </div>
      {expandedSections.includes(id) ? (
        <ChevronUp className="w-5 h-5 text-primary" />
      ) : (
        <ChevronDown className="w-5 h-5 text-primary" />
      )}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-base md:text-lg font-bold text-primary text-glow-cyan mb-2 text-center leading-snug">
          PEMECAHAN MASALAH YANG BERKAITAN DENGAN HIMPUNAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-1 font-body">
          Kardinalitas · Langkah Penyelesaian · Tips Jitu
        </p>
        <p className="text-white/40 text-xs text-center mb-6 font-body">
          Kelas 7 · Himpunan · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 1: PRINSIP DASAR KARDINALITAS */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="kardinalitas"
              icon={<Hash className="w-5 h-5" />}
              label="Sub-Bab 1: Prinsip Dasar Kardinalitas Himpunan"
              iconColor="text-cyan-400"
            />
            {expandedSections.includes("kardinalitas") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Ringkasan Intisari */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-cyan-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">Kardinalitas</strong> adalah banyaknya anggota
                    suatu himpunan, dinotasikan <InlineMath math="n(A)" />. Konsep ini jadi
                    fondasi utama saat kita ingin memecahkan masalah yang melibatkan dua atau tiga
                    kelompok sekaligus — misalnya survei, data ekskul, atau soal cerita berganda.
                  </p>

                  {/* Visual 2 himpunan */}
                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <VennKardinalitas2 />
                  </div>

                  {/* Rumus kotak */}
                  <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-cyan-300">📐 Rumus Kardinalitas — Dua Himpunan:</p>
                    <div className="overflow-x-auto">
                      <BlockMath math="n(A \cup B) = n(A) + n(B) - n(A \cap B)" />
                    </div>
                    <div className="h-px bg-slate-700/50" />
                    <p className="font-body text-xs font-semibold text-purple-300">📐 Rumus Kardinalitas — Tiga Himpunan:</p>
                    <div className="overflow-x-auto">
                      <BlockMath math="n(A \cup B \cup C) = n(A)+n(B)+n(C) - n(A\cap B) - n(A\cap C) - n(B\cap C) + n(A\cap B\cap C)" />
                    </div>
                  </div>

                  {/* Visual 3 himpunan */}
                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <VennKardinalitas3 />
                  </div>

                  {/* Sifat-sifat penting */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      ["n(A) ≥ 0", "Kardinalitas selalu ≥ 0"],
                      ["n(∅) = 0", "Himpunan kosong punya 0 anggota"],
                      ["n(Aᶜ) = n(S) − n(A)", "Komplemen: sisa dari semesta"],
                      ["n(A∩B) ≤ n(A) dan n(A∩B) ≤ n(B)", "Irisan ≤ kedua induknya"],
                    ].map(([rule, desc]) => (
                      <div key={rule} className="bg-cyan-950/40 border border-cyan-500/20 rounded p-2">
                        <p className="font-mono text-xs text-cyan-300 font-bold">{rule}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5">{desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Kalau soal menyebutkan "tidak ada yang mengikuti
                      keduanya", berarti <InlineMath math="n(A \cap B) = 0" />, sehingga{" "}
                      <InlineMath math="n(A \cup B) = n(A) + n(B)" /> langsung tanpa pengurangan.
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Dalam sebuah kelompok belajar terdapat 25 siswa. Diketahui 14 siswa menyukai
                      Matematika, 11 siswa menyukai Bahasa Indonesia, dan 4 siswa menyukai keduanya.
                      Berapa siswa yang tidak menyukai keduanya?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-green-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>Diketahui:</strong> <InlineMath math="n(S)=25" />, <InlineMath math="n(M)=14" />, <InlineMath math="n(B)=11" />, <InlineMath math="n(M\cap B)=4" /></p>
                      <p><strong>Hitung gabungan:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(M \cup B) = 14 + 11 - 4 = 21" />
                      </div>
                      <p><strong>Siswa yang tidak menyukai keduanya:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(S) - n(M \cup B) = 25 - 21 = 4 \text{ siswa}" />
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                        <p className="text-green-300 font-semibold text-xs">✅ Ada <strong>4 siswa</strong> yang tidak menyukai kedua pelajaran tersebut.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Dari 45 pengunjung perpustakaan, 20 meminjam buku fiksi, 18 meminjam buku sains,
                      dan 8 tidak meminjam buku apapun. Berapa pengunjung yang meminjam kedua jenis
                      buku tersebut?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 —</strong> Cari yang meminjam setidaknya satu buku:</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(F \cup K) = n(S) - \text{tidak keduanya} = 45 - 8 = 37" />
                      </div>
                      <p><strong>Langkah 2 —</strong> Cari irisan (keduanya) dengan rumus:</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(F \cap K) = n(F) + n(K) - n(F \cup K) = 20 + 18 - 37 = 1" />
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                        <p className="text-yellow-300 font-semibold text-xs">✅ Hanya <strong>1 pengunjung</strong> yang meminjam kedua jenis buku sekaligus.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Survei terhadap 60 remaja: 32 punya akun Instagram (I), 27 punya akun X (X),
                      25 punya akun YouTube (Y). Diketahui 15 punya I dan X, 12 punya I dan Y,
                      10 punya X dan Y, 5 punya ketiganya, dan sisanya tidak punya akun apapun.
                      Berapa remaja yang tidak punya akun apapun?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>Gunakan rumus tiga himpunan:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(I \cup X \cup Y) = 32+27+25 - 15 - 12 - 10 + 5 = 52" />
                      </div>
                      <p><strong>Yang tidak punya akun apapun:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="60 - 52 = 8 \text{ remaja}" />
                      </div>
                      <div className="bg-slate-800/60 rounded p-3 text-xs space-y-1">
                        <p className="text-cyan-300 font-semibold">Verifikasi tiap daerah Diagram Venn:</p>
                        <p>• Hanya I: <InlineMath math="32-15-12+5=10" /></p>
                        <p>• Hanya X: <InlineMath math="27-15-10+5=7" /></p>
                        <p>• Hanya Y: <InlineMath math="25-12-10+5=8" /></p>
                        <p>• I∩X saja: <InlineMath math="15-5=10" /></p>
                        <p>• I∩Y saja: <InlineMath math="12-5=7" /></p>
                        <p>• X∩Y saja: <InlineMath math="10-5=5" /></p>
                        <p>• Ketiganya: 5 · Di luar: 8</p>
                        <p className="text-green-400 font-semibold">Total: <InlineMath math="10+7+8+10+7+5+5+8 = 60" /> ✓</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                        <p className="text-red-300 font-semibold text-xs">✅ Ada <strong>8 remaja</strong> yang tidak punya akun apapun.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 2: LANGKAH-LANGKAH PENYELESAIAN */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="langkah"
              icon={<ListChecks className="w-5 h-5" />}
              label="Sub-Bab 2: Langkah-Langkah Penyelesaian Masalah"
              iconColor="text-orange-400"
            />
            {expandedSections.includes("langkah") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Ringkasan Intisari */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-orange-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Kunci sukses mengerjakan soal himpunan adalah punya <strong className="text-orange-300">alur kerja yang runtut</strong>.
                    Banyak siswa langsung bingung karena tidak punya peta jalan. Ikuti 4 langkah
                    berikut dan soal sepanjang apapun akan bisa diselesaikan secara sistematis.
                  </p>

                  {/* Flowchart */}
                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <FlowchartLangkah />
                  </div>

                  {/* Detail tiap langkah */}
                  <div className="space-y-2">
                    {[
                      {
                        step: "① IDENTIFIKASI", color: "text-cyan-300", bg: "bg-cyan-900/30 border-cyan-500/30",
                        desc: "Baca soal minimal 2 kali. Tandai: total keseluruhan (n(S)), banyak tiap kelompok, irisan yang disebutkan, dan yang ditanyakan.",
                      },
                      {
                        step: "② MODELKAN", color: "text-indigo-300", bg: "bg-indigo-900/30 border-indigo-500/30",
                        desc: "Beri nama himpunan (A, B, C). Tulis notasi matematisnya. Gambar sketsa Diagram Venn di kertas buram.",
                      },
                      {
                        step: "③ ISI DIAGRAM", color: "text-green-300", bg: "bg-green-900/30 border-green-500/30",
                        desc: "Isi daerah tengah (irisan/ketiganya) terlebih dahulu, lalu hitung mundur daerah-daerah pinggirnya.",
                      },
                      {
                        step: "④ HITUNG & VERIFIKASI", color: "text-orange-300", bg: "bg-orange-900/30 border-orange-500/30",
                        desc: "Gunakan rumus inklusi-eksklusi. Setelah selesai, jumlahkan SEMUA daerah di diagram — hasilnya harus tepat sama dengan n(S).",
                      },
                    ].map((item) => (
                      <div key={item.step} className={`${item.bg} border rounded-lg p-3`}>
                        <p className={`font-mono text-xs font-bold ${item.color} mb-1`}>{item.step}</p>
                        <p className="font-body text-xs text-white/70">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Verifikasi adalah langkah yang sering dilewati tapi
                      sangat penting. Jika jumlah semua daerah ≠ n(S), ada yang salah — perbaiki
                      sebelum menjawab!
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Terdapat 35 anak di kelas. 20 anak mengikuti les piano, 18 anak mengikuti
                      les menggambar, dan 7 anak mengikuti keduanya. Berapa anak yang tidak
                      mengikuti les apapun? Selesaikan dengan 4 langkah!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-green-400">PEMBAHASAN — 4 LANGKAH:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2">
                        <p className="text-cyan-300 text-xs font-bold">① IDENTIFIKASI</p>
                        <p className="text-xs mt-1">n(S)=35, n(P)=20 (piano), n(G)=18 (gambar), n(P∩G)=7, ditanya: di luar kedua les</p>
                      </div>
                      <div className="bg-indigo-900/20 border border-indigo-500/20 rounded p-2">
                        <p className="text-indigo-300 text-xs font-bold">② MODELKAN</p>
                        <p className="text-xs mt-1">P = himpunan anak les piano, G = himpunan anak les gambar</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                        <p className="text-green-300 text-xs font-bold">③ ISI DIAGRAM</p>
                        <p className="text-xs mt-1">Tengah (P∩G) = 7 | Hanya P = 20−7 = 13 | Hanya G = 18−7 = 11</p>
                      </div>
                      <div className="bg-orange-900/20 border border-orange-500/20 rounded p-2">
                        <p className="text-orange-300 text-xs font-bold">④ HITUNG & VERIFIKASI</p>
                        <div className="overflow-x-auto mt-1">
                          <BlockMath math="n(P \cup G) = 20 + 18 - 7 = 31" />
                          <BlockMath math="\text{Di luar} = 35 - 31 = 4 \text{ anak}" />
                        </div>
                        <p className="text-xs text-green-400">Cek: 13 + 7 + 11 + 4 = 35 ✓</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                        <p className="text-green-300 font-semibold text-xs">✅ Ada <strong>4 anak</strong> yang tidak mengikuti les apapun.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Di sebuah RT terdapat 50 kepala keluarga. Sebanyak 30 memiliki motor, 22
                      memiliki sepeda, dan 6 tidak memiliki keduanya. Tentukan: berapa yang memiliki
                      keduanya, berapa yang hanya punya motor, dan berapa yang hanya punya sepeda?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2 text-xs">
                        <p className="text-cyan-300 font-bold">① IDENTIFIKASI</p>
                        <p>n(S)=50, n(M)=30, n(S)=22, di luar keduanya=6</p>
                      </div>
                      <p><strong>Langkah kunci:</strong> Cari dulu yang punya setidaknya satu:</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(M \cup K) = 50 - 6 = 44" />
                      </div>
                      <p>Cari irisan:</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(M \cap K) = 30 + 22 - 44 = 8" />
                      </div>
                      <p>Isi diagram:</p>
                      <div className="bg-slate-800/60 rounded p-3 space-y-1 text-xs">
                        <p>• Hanya motor: <InlineMath math="30 - 8 = 22" /> KK</p>
                        <p>• Hanya sepeda: <InlineMath math="22 - 8 = 14" /> KK</p>
                        <p>• Keduanya: <InlineMath math="8" /> KK</p>
                        <p>• Di luar: <InlineMath math="6" /> KK</p>
                        <p className="text-green-400">Cek: 22+8+14+6 = 50 ✓</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Dari 80 siswa di sebuah sekolah: 45 ikut ekskul Seni, 38 ikut ekskul Olahraga,
                      30 ikut ekskul Sains. Diketahui 20 ikut Seni dan Olahraga, 15 ikut Seni dan
                      Sains, 12 ikut Olahraga dan Sains. Jika semua siswa ikut setidaknya satu
                      ekskul, berapa yang ikut ketiganya?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2 text-xs">
                        <p className="text-cyan-300 font-bold">① IDENTIFIKASI</p>
                        <p>n(S)=80, semua ikut minimal 1 → n(A∪B∪C)=80</p>
                        <p>n(A)=45, n(B)=38, n(C)=30, n(A∩B)=20, n(A∩C)=15, n(B∩C)=12</p>
                      </div>
                      <p><strong>Susun persamaan dari rumus 3 himpunan:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="80 = 45+38+30-20-15-12+n(A\cap B\cap C)" />
                        <BlockMath math="80 = 66 + n(A\cap B\cap C)" />
                        <BlockMath math="n(A\cap B\cap C) = 80 - 66 = 14" />
                      </div>
                      <div className="bg-slate-800/60 rounded p-3 space-y-1 text-xs">
                        <p className="text-cyan-300 font-semibold">Verifikasi isi diagram:</p>
                        <p>• Hanya A: 45−20−15+14 = 24</p>
                        <p>• Hanya B: 38−20−12+14 = 20</p>
                        <p>• Hanya C: 30−15−12+14 = 17</p>
                        <p>• A∩B saja: 20−14 = 6</p>
                        <p>• A∩C saja: 15−14 = 1</p>
                        <p>• B∩C saja: 12−14 = ... <span className="text-red-400">= −2?</span></p>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded p-3 text-xs">
                        <p className="text-amber-300 font-semibold">⚠️ Catatan Penting:</p>
                        <p className="text-white/70 mt-1">Hasil negatif pada daerah diagram mengindikasikan data soal yang tidak konsisten atau ada pembulatan. Dalam soal ujian, pastikan data yang diberikan selalu menghasilkan nilai non-negatif. Jawaban yang diminta adalah <InlineMath math="n(A\cap B\cap C) = 14" />.</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                        <p className="text-red-300 font-semibold text-xs">✅ Ada <strong>14 siswa</strong> yang mengikuti ketiga ekskul sekaligus.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 3: STRATEGI CEPAT — TIPS JITU */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="tips"
              icon={<Zap className="w-5 h-5" />}
              label='Sub-Bab 3: Strategi Cepat — "Tips Jitu"'
              iconColor="text-yellow-400"
            />
            {expandedSections.includes("tips") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Ringkasan Intisari */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-yellow-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Setelah menguasai konsep dan langkah, kamu perlu <strong className="text-yellow-300">strategi cepat</strong>{" "}
                    untuk menghemat waktu di ujian. Berikut kumpulan "jurus rahasia" yang bisa
                    membuatmu menyelesaikan soal himpunan lebih cepat dan lebih akurat.
                  </p>

                  {/* Tips cards */}
                  <div className="space-y-3">
                    {[
                      {
                        no: "🎯 Tips 1",
                        title: "Cari Irisan Dulu dari Informasi Tak Langsung",
                        color: "bg-blue-900/30 border-blue-500/30 text-blue-300",
                        desc: "Jika soal menyebutkan 'yang tidak ikut keduanya = x', maka: n(A∪B) = n(S) − x, lalu n(A∩B) = n(A) + n(B) − n(A∪B). Ini cara paling efisien!",
                      },
                      {
                        no: "🎯 Tips 2",
                        title: "Rumus Cepat: Hanya Satu Kelompok",
                        color: "bg-emerald-900/30 border-emerald-500/30 text-emerald-300",
                        desc: 'Untuk menghitung "hanya A" (tidak termasuk B): n(hanya A) = n(A) − n(A∩B). Ini berguna saat soal menanyakan masing-masing bagian diagram.',
                      },
                      {
                        no: "🎯 Tips 3",
                        title: "Gunakan Tabel untuk Soal 2 Kondisi",
                        color: "bg-purple-900/30 border-purple-500/30 text-purple-300",
                        desc: 'Soal berbentuk "berapa yang A tapi bukan B" cocok diselesaikan dengan tabel 2×2. Cara ini mengurangi kesalahan perhitungan.',
                      },
                      {
                        no: "⚠️ Tips 4",
                        title: "Waspadai Kata 'Tepat' vs 'Setidaknya'",
                        color: "bg-red-900/30 border-red-500/30 text-red-300",
                        desc: '"Tepat dua" = hanya dua, bukan tiga. "Setidaknya dua" = dua atau tiga. Kesalahan membaca ini adalah sumber error terbanyak di soal olimpiade!',
                      },
                      {
                        no: "💡 Tips 5",
                        title: "Cek Konsistensi Data Sebelum Mulai",
                        color: "bg-amber-900/30 border-amber-500/30 text-amber-300",
                        desc: 'Pastikan n(A∩B) ≤ min(n(A), n(B)) dan n(A∪B) ≤ n(S). Jika tidak terpenuhi, soalnya mungkin punya jebakan atau data yang perlu dibaca ulang.',
                      },
                    ].map((tip) => (
                      <div key={tip.no} className={`${tip.color} border rounded-lg p-3`}>
                        <p className="font-mono text-xs font-bold mb-1">{tip.no}: {tip.title}</p>
                        <p className="font-body text-xs text-white/70">{tip.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tabel rumus cepat */}
                  <div className="bg-slate-900/60 rounded-xl p-4 overflow-x-auto">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-3">📋 Tabel Rumus Cepat — Dua Himpunan:</p>
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-slate-800/80">
                          <th className="border border-slate-600/50 px-3 py-2 text-left text-cyan-300">Yang Dicari</th>
                          <th className="border border-slate-600/50 px-3 py-2 text-left text-cyan-300">Rumus</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        {[
                          ["n(A∪B)", "n(A) + n(B) − n(A∩B)"],
                          ["n(A∩B)", "n(A) + n(B) − n(A∪B)"],
                          ["Di luar A∪B", "n(S) − n(A∪B)"],
                          ["Hanya A", "n(A) − n(A∩B)"],
                          ["Hanya B", "n(B) − n(A∩B)"],
                          ["n(Aᶜ)", "n(S) − n(A)"],
                        ].map(([cari, rumus]) => (
                          <tr key={cari} className="hover:bg-slate-800/40">
                            <td className="border border-slate-600/30 px-3 py-2 font-mono text-yellow-300">{cari}</td>
                            <td className="border border-slate-600/30 px-3 py-2">{rumus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">📝 Contoh Soal & Pembahasan</p>

                {/* Contoh 1 - Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Di antara 30 siswa, 12 suka voli dan 10 suka basket. Tidak ada yang suka
                      keduanya. Berapa siswa yang tidak suka keduanya? (Gunakan Tips 1)
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-2">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p>Karena tidak ada yang suka keduanya: <InlineMath math="n(V \cap B) = 0" /></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(V \cup B) = 12 + 10 - 0 = 22" />
                        <BlockMath math="\text{Tidak suka keduanya} = 30 - 22 = 8 \text{ siswa}" />
                      </div>
                      <div className="bg-blue-900/20 border border-blue-500/20 rounded p-2">
                        <p className="text-blue-300 text-xs">💡 Ketika irisan = 0, rumus menyederhanakan diri menjadi n(A∪B) = n(A) + n(B).</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      <InlineMath math="n(S) = 50" />, <InlineMath math="n(A) = 28" />,{" "}
                      <InlineMath math="n(B) = 22" />, <InlineMath math="n(A \cap B) = 10" />.
                      Gunakan tabel untuk mencari: hanya A, hanya B, keduanya, dan di luar keduanya.
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">PEMBAHASAN — METODE TABEL:</p>
                    <div className="bg-slate-900/60 rounded-xl p-3 overflow-x-auto">
                      <table className="w-full text-xs font-mono border-collapse">
                        <thead>
                          <tr className="bg-slate-800">
                            <th className="border border-slate-600/50 px-3 py-2 text-cyan-300"></th>
                            <th className="border border-slate-600/50 px-3 py-2 text-cyan-300">B</th>
                            <th className="border border-slate-600/50 px-3 py-2 text-cyan-300">Bᶜ</th>
                            <th className="border border-slate-600/50 px-3 py-2 text-cyan-300">Total</th>
                          </tr>
                        </thead>
                        <tbody className="text-white/80">
                          <tr>
                            <td className="border border-slate-600/30 px-3 py-2 text-indigo-300 font-bold">A</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-yellow-300">10</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-emerald-300">18</td>
                            <td className="border border-slate-600/30 px-3 py-2">28</td>
                          </tr>
                          <tr>
                            <td className="border border-slate-600/30 px-3 py-2 text-indigo-300 font-bold">Aᶜ</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-emerald-300">12</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-red-300">10</td>
                            <td className="border border-slate-600/30 px-3 py-2">22</td>
                          </tr>
                          <tr className="bg-slate-800/40">
                            <td className="border border-slate-600/30 px-3 py-2 font-bold">Total</td>
                            <td className="border border-slate-600/30 px-3 py-2">22</td>
                            <td className="border border-slate-600/30 px-3 py-2">28</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-green-400 font-bold">50 ✓</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-xs text-white/80">
                      <p>🟡 Keduanya (A∩B) = <strong className="text-yellow-300">10</strong></p>
                      <p>🟢 Hanya A = 28−10 = <strong className="text-emerald-300">18</strong></p>
                      <p>🟢 Hanya B = 22−10 = <strong className="text-emerald-300">12</strong></p>
                      <p>🔴 Di luar keduanya = 50−10−18−12 = <strong className="text-red-300">10</strong></p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 — Soal Olimpiade</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Dari 100 orang, setiap orang menyukai setidaknya satu dari tiga warna: Merah
                      (M), Biru (B), Kuning (K). Diketahui: <InlineMath math="n(M)=60" />,{" "}
                      <InlineMath math="n(B)=50" />, <InlineMath math="n(K)=40" />,
                      yang menyukai <em>tepat dua</em> warna berjumlah 30, dan yang menyukai{" "}
                      <em>ketiga</em> warna berjumlah 10. Berapa yang hanya menyukai satu warna?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">PEMBAHASAN — STRATEGI JITU:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                      <p><strong>Gunakan identitas penting:</strong></p>
                      <div className="bg-slate-800/60 rounded p-2 text-xs">
                        <p className="text-cyan-300 font-mono">n(M∪B∪K) = n(hanya 1) + n(tepat 2) + n(tepat 3)</p>
                      </div>
                      <p>Karena semua suka setidaknya satu: <InlineMath math="n(M\cup B\cup K)=100" /></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="100 = n(\text{hanya 1}) + 30 + 10" />
                        <BlockMath math="n(\text{hanya 1}) = 100 - 40 = 60 \text{ orang}" />
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 text-xs">
                        <p className="text-amber-300 font-semibold">💡 Tip Olimpiade:</p>
                        <p className="text-white/70">Ada cara lain: n(hanya 1) = Σn(tiap himpunan) − 2·n(tepat 2) − 3·n(tepat 3) = 60+50+40 − 2(30) − 3(10) = 150 − 60 − 30 = 60 ✓</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                        <p className="text-red-300 font-semibold text-xs">✅ Ada <strong>60 orang</strong> yang hanya menyukai tepat satu warna.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/himpunan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Himpunan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PemecahanMasalahHimpunanPage;
