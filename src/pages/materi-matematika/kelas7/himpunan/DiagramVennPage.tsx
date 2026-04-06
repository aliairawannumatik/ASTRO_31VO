import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Calculator,
  CircleDot,
  GitMerge,
  Minus,
  FlipHorizontal,
  Users,
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ══════════════════════════════════════════════════════════
   SVG VENN DIAGRAM COMPONENTS
══════════════════════════════════════════════════════════ */

const VennBase = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <div className="flex flex-col items-center gap-2">
    {title && <p className="text-xs font-mono text-cyan-300 tracking-wider">{title}</p>}
    <svg viewBox="0 0 280 160" className="w-full max-w-xs" xmlns="http://www.w3.org/2000/svg">
      {/* Universe rectangle */}
      <rect x="4" y="4" width="272" height="152" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      <text x="255" y="20" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="monospace">S</text>
      {children}
    </svg>
  </div>
);

const VennDefault = () => (
  <VennBase title="Diagram Venn Dasar: A dan B">
    <circle cx="105" cy="80" r="52" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" fillOpacity="0.7" />
    <circle cx="175" cy="80" r="52" fill="#1e3a5f" stroke="#8b5cf6" strokeWidth="2" fillOpacity="0.7" />
    <text x="80" y="78" textAnchor="middle" fontSize="13" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="200" y="78" textAnchor="middle" fontSize="13" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="140" y="78" textAnchor="middle" fontSize="11" fill="#e2e8f0" fontFamily="sans-serif">A∩B</text>
    <text x="80" y="94" textAnchor="middle" fontSize="10" fill="#93c5fd" fontFamily="sans-serif">only A</text>
    <text x="200" y="94" textAnchor="middle" fontSize="10" fill="#c4b5fd" fontFamily="sans-serif">only B</text>
  </VennBase>
);

const VennUnion = () => (
  <VennBase title="Gabungan: A ∪ B (semua diarsir)">
    <circle cx="105" cy="80" r="52" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="2" fillOpacity="0.85" />
    <circle cx="175" cy="80" r="52" fill="#7c3aed" stroke="#a78bfa" strokeWidth="2" fillOpacity="0.85" />
    <text x="80" y="82" textAnchor="middle" fontSize="13" fill="#bfdbfe" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="200" y="82" textAnchor="middle" fontSize="13" fill="#ddd6fe" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="140" y="82" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="sans-serif">∪</text>
    <text x="230" y="148" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="monospace">A ∪ B</text>
  </VennBase>
);

const VennIntersection = () => (
  <VennBase title="Irisan: A ∩ B (tengah diarsir)">
    <circle cx="105" cy="80" r="52" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" fillOpacity="0.9" />
    <circle cx="175" cy="80" r="52" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" fillOpacity="0.9" />
    <clipPath id="clipA">
      <circle cx="105" cy="80" r="52" />
    </clipPath>
    <circle cx="175" cy="80" r="52" fill="#10b981" stroke="none" fillOpacity="0.85" clipPath="url(#clipA)" />
    <text x="80" y="82" textAnchor="middle" fontSize="13" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="200" y="82" textAnchor="middle" fontSize="13" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="140" y="82" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="sans-serif">∩</text>
    <text x="230" y="148" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="monospace">A ∩ B</text>
  </VennBase>
);

const VennDifferenceAB = () => (
  <VennBase title="Selisih: A − B (kiri saja diarsir)">
    <clipPath id="outsideB">
      <rect x="0" y="0" width="280" height="160" />
    </clipPath>
    <circle cx="105" cy="80" r="52" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" fillOpacity="0.85" />
    <circle cx="175" cy="80" r="52" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" fillOpacity="0.95" />
    <text x="80" y="82" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="200" y="82" textAnchor="middle" fontSize="13" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="230" y="148" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="monospace">A − B</text>
  </VennBase>
);

const VennDifferenceBA = () => (
  <VennBase title="Selisih: B − A (kanan saja diarsir)">
    <circle cx="105" cy="80" r="52" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" fillOpacity="0.95" />
    <circle cx="175" cy="80" r="52" fill="#f43f5e" stroke="#fb7185" strokeWidth="2" fillOpacity="0.85" />
    <text x="80" y="82" textAnchor="middle" fontSize="13" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="200" y="82" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="230" y="148" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="monospace">B − A</text>
  </VennBase>
);

const VennComplement = () => (
  <VennBase title="Komplemen: Aᶜ (di luar A diarsir)">
    <rect x="4" y="4" width="272" height="152" rx="10" fill="#0ea5e9" fillOpacity="0.25" />
    <rect x="4" y="4" width="272" height="152" rx="10" fill="none" stroke="#334155" strokeWidth="1.5" />
    <circle cx="140" cy="80" r="52" fill="#0f172a" stroke="#3b82f6" strokeWidth="2.5" fillOpacity="0.95" />
    <text x="140" y="84" textAnchor="middle" fontSize="14" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="240" y="30" textAnchor="middle" fontSize="11" fill="#7dd3fc" fontFamily="sans-serif" fontStyle="italic">Aᶜ</text>
    <text x="25" y="148" fontSize="10" fill="#475569" fontFamily="monospace">Aᶜ = S − A</text>
  </VennBase>
);

const VennContextual = () => (
  <VennBase title="Contoh Kontekstual: Siswa Ekskul">
    <circle cx="105" cy="82" r="52" fill="#1e3a5f" stroke="#22d3ee" strokeWidth="2" fillOpacity="0.75" />
    <circle cx="175" cy="82" r="52" fill="#1e1f5e" stroke="#f472b6" strokeWidth="2" fillOpacity="0.75" />
    <clipPath id="clipFutsal">
      <circle cx="105" cy="82" r="52" />
    </clipPath>
    <circle cx="175" cy="82" r="52" fill="#15803d" fillOpacity="0.6" clipPath="url(#clipFutsal)" />
    <text x="78" y="76" textAnchor="middle" fontSize="9" fill="#a5f3fc" fontFamily="sans-serif" fontWeight="bold">Futsal</text>
    <text x="78" y="88" textAnchor="middle" fontSize="9" fill="#cffafe" fontFamily="sans-serif">8 siswa</text>
    <text x="200" y="76" textAnchor="middle" fontSize="9" fill="#fbcfe8" fontFamily="sans-serif" fontWeight="bold">Basket</text>
    <text x="200" y="88" textAnchor="middle" fontSize="9" fill="#fce7f3" fontFamily="sans-serif">7 siswa</text>
    <text x="140" y="76" textAnchor="middle" fontSize="9" fill="#bbf7d0" fontFamily="sans-serif" fontWeight="bold">Keduanya</text>
    <text x="140" y="88" textAnchor="middle" fontSize="9" fill="#d1fae5" fontFamily="sans-serif">5 siswa</text>
    <text x="30" y="30" fontSize="9" fill="#64748b" fontFamily="sans-serif">30 siswa total</text>
  </VennBase>
);

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */

const DiagramVennPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "kontekstual", "biner", "uner",
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
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          DIAGRAM VENN
        </h1>
        <p className="text-white/50 text-xs text-center mb-1 font-body">
          Masalah Kontekstual · Operasi Biner · Operasi Uner
        </p>
        <p className="text-white/40 text-xs text-center mb-6 font-body">
          Kelas 7 · Himpunan · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 1: MASALAH KONTEKSTUAL */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="kontekstual"
              icon={<Users className="w-5 h-5" />}
              label="Sub-Bab 1: Masalah Kontekstual Banyak Anggota Himpunan"
              iconColor="text-cyan-400"
            />
            {expandedSections.includes("kontekstual") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Ringkasan Intisari */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-cyan-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">Diagram Venn</strong> adalah cara visual untuk
                    menggambarkan hubungan antar himpunan menggunakan lingkaran di dalam persegi panjang.
                    Persegi panjang mewakili <strong className="text-white">himpunan semesta</strong>{" "}
                    <InlineMath math="S" />, sedangkan tiap lingkaran mewakili satu himpunan.
                  </p>

                  {/* Diagram */}
                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <VennDefault />
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">Rumus Penting — Prinsip Inklusi-Eksklusi:</p>
                    <div className="overflow-x-auto">
                      <BlockMath math="n(A \cup B) = n(A) + n(B) - n(A \cap B)" />
                    </div>
                    <p className="font-body text-xs text-white/60">
                      Rumus ini dipakai untuk mencari banyak anggota gabungan dua himpunan tanpa menghitung dua kali.
                    </p>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Selalu mulai dari daerah <em>tengah</em> (irisan) saat
                      mengisi Diagram Venn dari soal cerita. Isi daerah tumpang tindih dulu, baru isi
                      daerah yang hanya satu kelompok.
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
                      Di kelas 7A terdapat 30 siswa. Sebanyak 18 siswa menyukai pelajaran Matematika,
                      15 siswa menyukai IPA, dan 7 siswa menyukai keduanya. Gambarlah Diagram Venn-nya
                      dan tentukan berapa siswa yang tidak menyukai keduanya!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-green-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <VennContextual />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>Misal:</strong></p>
                      <p>• <InlineMath math="M" /> = siswa suka Matematika, <InlineMath math="n(M) = 18" /></p>
                      <p>• <InlineMath math="P" /> = siswa suka IPA, <InlineMath math="n(P) = 15" /></p>
                      <p>• <InlineMath math="n(M \cap P) = 7" /></p>
                      <p><strong>Langkah 1 — Gunakan rumus inklusi-eksklusi:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(M \cup P) = n(M) + n(P) - n(M \cap P) = 18 + 15 - 7 = 26" />
                      </div>
                      <p><strong>Langkah 2 — Siswa yang tidak suka keduanya:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(S) - n(M \cup P) = 30 - 26 = 4 \text{ siswa}" />
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2 mt-1">
                        <p className="text-green-300 font-semibold">✅ Kesimpulan: Ada <strong>4 siswa</strong> yang tidak menyukai keduanya.</p>
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
                      Dari 40 murid, diketahui 22 anak mengikuti ekskul Pramuka, 18 anak mengikuti
                      PMR, dan 5 anak tidak mengikuti keduanya. Berapa banyak anak yang mengikuti
                      kedua ekskul tersebut? Gambarkan dalam Diagram Venn!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Cari banyak siswa yang ikut setidaknya satu ekskul:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(P \cup Q) = n(S) - \text{tidak keduanya} = 40 - 5 = 35" />
                      </div>
                      <p><strong>Langkah 2 — Gunakan rumus inklusi-eksklusi untuk mencari irisan:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(P \cap Q) = n(P) + n(Q) - n(P \cup Q) = 22 + 18 - 35 = 5" />
                      </div>
                      <p><strong>Langkah 3 — Isi diagram:</strong></p>
                      <div className="bg-slate-800/60 rounded p-3 space-y-1">
                        <p>• Hanya Pramuka: <InlineMath math="22 - 5 = 17" /> anak</p>
                        <p>• Hanya PMR: <InlineMath math="18 - 5 = 13" /> anak</p>
                        <p>• Keduanya: <InlineMath math="5" /> anak</p>
                        <p>• Di luar: <InlineMath math="5" /> anak</p>
                        <p>• Total: <InlineMath math="17 + 13 + 5 + 5 = 40" /> ✓</p>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 mt-1">
                        <p className="text-yellow-300 font-semibold">✅ Ada <strong>5 anak</strong> yang mengikuti kedua ekskul.</p>
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
                      Dari survei terhadap 50 siswa SMP tentang aplikasi yang mereka gunakan: 28 siswa
                      menggunakan YouTube, 24 siswa menggunakan TikTok, 10 siswa menggunakan Instagram
                      saja, 6 siswa menggunakan ketiganya, 12 siswa menggunakan YouTube dan TikTok,
                      8 siswa menggunakan YouTube dan Instagram, 9 siswa menggunakan TikTok dan
                      Instagram. Berapa siswa yang tidak menggunakan aplikasi apapun?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                      <p><strong>Misal:</strong> Y = YouTube, T = TikTok, I = Instagram</p>
                      <p>Gunakan rumus tiga himpunan:</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(Y \cup T \cup I) = n(Y)+n(T)+n(I) - n(Y\cap T) - n(Y\cap I) - n(T\cap I) + n(Y\cap T\cap I)" />
                      </div>
                      <p><strong>Langkah 1 — Cari n(I):</strong></p>
                      <div className="bg-slate-800/60 rounded p-2">
                        <p>Hanya Instagram = 10. Perlu tahu total Instagram dulu.</p>
                        <p><InlineMath math="n(I) = 10_{\text{saja}} + (n(Y\cap I)-6) + (n(T\cap I)-6) + 6" /></p>
                        <p><InlineMath math="= 10 + (8-6) + (9-6) + 6 = 10 + 2 + 3 + 6 = 21" /></p>
                      </div>
                      <p><strong>Langkah 2 — Substitusi:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(Y \cup T \cup I) = 28 + 24 + 21 - 12 - 8 - 9 + 6 = 50" />
                      </div>
                      <p><strong>Langkah 3 — Siswa tanpa aplikasi:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="50 - 50 = 0 \text{ siswa}" />
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2 mt-1">
                        <p className="text-red-300 font-semibold">✅ Semua 50 siswa menggunakan setidaknya satu aplikasi. Tidak ada yang tidak menggunakan apapun.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 2: OPERASI BINER */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="biner"
              icon={<GitMerge className="w-5 h-5" />}
              label="Sub-Bab 2: Operasi Biner pada Himpunan"
              iconColor="text-purple-400"
            />
            {expandedSections.includes("biner") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Ringkasan Intisari */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-purple-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-purple-300">Operasi biner</strong> adalah operasi yang
                    melibatkan <em>dua</em> himpunan sekaligus untuk menghasilkan himpunan baru.
                    Ada empat operasi biner utama yang perlu kamu kuasai:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="font-body text-xs font-bold text-blue-300 mb-1">① Gabungan (Union)</p>
                      <div className="overflow-x-auto"><BlockMath math="A \cup B = \{x \mid x \in A \text{ atau } x \in B\}" /></div>
                      <p className="font-body text-xs text-white/60 mt-1">Semua anggota A dan B digabung, tanpa duplikasi.</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                      <p className="font-body text-xs font-bold text-emerald-300 mb-1">② Irisan (Intersection)</p>
                      <div className="overflow-x-auto"><BlockMath math="A \cap B = \{x \mid x \in A \text{ dan } x \in B\}" /></div>
                      <p className="font-body text-xs text-white/60 mt-1">Hanya anggota yang ada di A sekaligus di B.</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <p className="font-body text-xs font-bold text-amber-300 mb-1">③ Selisih A−B</p>
                      <div className="overflow-x-auto"><BlockMath math="A - B = \{x \mid x \in A \text{ dan } x \notin B\}" /></div>
                      <p className="font-body text-xs text-white/60 mt-1">Anggota A yang tidak ada di B.</p>
                    </div>
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                      <p className="font-body text-xs font-bold text-rose-300 mb-1">④ Selisih B−A</p>
                      <div className="overflow-x-auto"><BlockMath math="B - A = \{x \mid x \in B \text{ dan } x \notin A\}" /></div>
                      <p className="font-body text-xs text-white/60 mt-1">Anggota B yang tidak ada di A.</p>
                    </div>
                  </div>

                  {/* Visual diagrams row */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-900/60 rounded-xl p-4">
                    <VennUnion />
                    <VennIntersection />
                    <VennDifferenceAB />
                    <VennDifferenceBA />
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips:</strong> Selisih <em>tidak komutatif</em>!{" "}
                      <InlineMath math="A - B \neq B - A" /> kecuali jika <InlineMath math="A = B" />.
                      Berbeda dengan gabungan dan irisan yang bersifat komutatif.
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
                    <p className="font-body text-sm text-white">
                      Diketahui <InlineMath math="A = \{1, 2, 3, 4, 5\}" /> dan{" "}
                      <InlineMath math="B = \{3, 4, 5, 6, 7\}" />.
                      Tentukan: a. <InlineMath math="A \cup B" />, b. <InlineMath math="A \cap B" />,
                      c. <InlineMath math="A - B" />, d. <InlineMath math="B - A" />
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>a. Gabungan</strong> — semua anggota, tanpa duplikasi:</p>
                      <p className="text-blue-300"><InlineMath math="A \cup B = \{1,2,3,4,5,6,7\}" /></p>
                      <p><strong>b. Irisan</strong> — yang ada di kedua himpunan (3, 4, 5 ada di A dan B):</p>
                      <p className="text-emerald-300"><InlineMath math="A \cap B = \{3,4,5\}" /></p>
                      <p><strong>c. Selisih A−B</strong> — di A tapi tidak di B:</p>
                      <p className="text-amber-300"><InlineMath math="A - B = \{1,2\}" /></p>
                      <p><strong>d. Selisih B−A</strong> — di B tapi tidak di A:</p>
                      <p className="text-rose-300"><InlineMath math="B - A = \{6,7\}" /></p>
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
                      Diketahui himpunan semesta <InlineMath math="S = \{1,2,3,...,10\}" />,{" "}
                      <InlineMath math="P = \{\text{bilangan prima} \leq 10\}" />, dan{" "}
                      <InlineMath math="Q = \{\text{bilangan ganjil} \leq 10\}" />.
                      Tentukan <InlineMath math="P \cup Q" /> dan <InlineMath math="P \cap Q" />,
                      lalu gambarkan Diagram Venn-nya!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                      <p><strong>Tentukan anggota:</strong></p>
                      <p>• <InlineMath math="P = \{2, 3, 5, 7\}" /> (bilangan prima ≤ 10)</p>
                      <p>• <InlineMath math="Q = \{1, 3, 5, 7, 9\}" /> (bilangan ganjil ≤ 10)</p>
                      <p><strong>Hitung operasi:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="P \cup Q = \{1, 2, 3, 5, 7, 9\}" />
                        <BlockMath math="P \cap Q = \{3, 5, 7\}" />
                      </div>
                      <div className="bg-slate-800/60 rounded p-3 space-y-1 text-xs">
                        <p className="text-cyan-300 font-semibold">Isi Diagram Venn:</p>
                        <p>• Hanya di P (bukan Q): <InlineMath math="\{2\}" /></p>
                        <p>• Di P dan Q (irisan): <InlineMath math="\{3, 5, 7\}" /></p>
                        <p>• Hanya di Q (bukan P): <InlineMath math="\{1, 9\}" /></p>
                        <p>• Di S, di luar P dan Q: <InlineMath math="\{4, 6, 8, 10\}" /></p>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                        <p className="text-yellow-300 text-xs">💡 Angka 2 menarik: ia prima (masuk P) tapi genap (tidak masuk Q)!</p>
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
                    <p className="font-body text-sm text-white">
                      Diketahui <InlineMath math="S = \{x \mid 1 \leq x \leq 15, x \in \mathbb{N}\}" />,{" "}
                      <InlineMath math="A = \{\text{kelipatan 2}\}" />, dan <InlineMath math="B = \{\text{kelipatan 3}\}" />.
                      Tentukan: <InlineMath math="n(A \cup B)" />, <InlineMath math="n(A \cap B)" />,
                      <InlineMath math="n(A - B)" />, dan <InlineMath math="n(B - A)" />.
                      Verifikasi bahwa <InlineMath math="n(A) + n(B) - n(A \cap B) = n(A \cup B)" />.
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                      <p><strong>Tentukan anggota dari S = {"{1,2,...,15}"}:</strong></p>
                      <div className="bg-slate-800/60 rounded p-3 space-y-1">
                        <p>• <InlineMath math="A = \{2,4,6,8,10,12,14\}" />, <InlineMath math="n(A) = 7" /></p>
                        <p>• <InlineMath math="B = \{3,6,9,12,15\}" />, <InlineMath math="n(B) = 5" /></p>
                        <p>• <InlineMath math="A \cap B" /> = kelipatan 6 ≤ 15 = <InlineMath math="\{6,12\}" />, <InlineMath math="n(A\cap B)=2" /></p>
                      </div>
                      <p><strong>Hitung operasi:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="A \cup B = \{2,3,4,6,8,9,10,12,14,15\},\ n(A\cup B) = 10" />
                        <BlockMath math="A - B = \{2,4,8,10,14\},\ n(A-B) = 5" />
                        <BlockMath math="B - A = \{3,9,15\},\ n(B-A) = 3" />
                      </div>
                      <p><strong>Verifikasi rumus:</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(A) + n(B) - n(A\cap B) = 7 + 5 - 2 = 10 = n(A \cup B) \ \checkmark" />
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                        <p className="text-red-300 font-semibold text-xs">✅ Rumus inklusi-eksklusi terbukti valid!</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════ */}
          {/* SUB-BAB 3: OPERASI UNER */}
          {/* ══════════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="uner"
              icon={<FlipHorizontal className="w-5 h-5" />}
              label="Sub-Bab 3: Operasi Uner pada Himpunan (Komplemen)"
              iconColor="text-sky-400"
            />
            {expandedSections.includes("uner") && (
              <div className="px-5 pb-5 space-y-5">

                {/* Ringkasan Intisari */}
                <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-sky-300">📌 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-sky-300">Operasi uner</strong> hanya melibatkan{" "}
                    <em>satu</em> himpunan. Operasi uner paling penting adalah{" "}
                    <strong className="text-white">komplemen</strong>.
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-sky-300">Komplemen himpunan A</strong> (ditulis{" "}
                    <InlineMath math="A^c" /> atau <InlineMath math="A'" />) adalah himpunan semua
                    anggota semesta <InlineMath math="S" /> yang <em>tidak termasuk</em> anggota A.
                  </p>

                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <VennComplement />
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-sky-300">Rumus & Sifat Komplemen:</p>
                    <div className="overflow-x-auto space-y-1">
                      <BlockMath math="A^c = S - A = \{x \mid x \in S,\ x \notin A\}" />
                      <BlockMath math="n(A^c) = n(S) - n(A)" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {[
                        ["A ∪ Aᶜ = S", "Gabungan A dan komplementnya = semesta"],
                        ["A ∩ Aᶜ = ∅", "Irisan A dan komplementnya = kosong"],
                        ["(Aᶜ)ᶜ = A", "Komplemen dari komplemen = A sendiri"],
                        ["Sᶜ = ∅, ∅ᶜ = S", "Komplemen semesta = kosong, dan sebaliknya"],
                      ].map(([rule, desc]) => (
                        <div key={rule} className="bg-sky-900/30 border border-sky-500/20 rounded p-2">
                          <p className="font-mono text-xs text-sky-300 font-bold">{rule}</p>
                          <p className="font-body text-xs text-white/60 mt-0.5">{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      💡 <strong>Tips Hukum De Morgan:</strong> Dua hukum penting yang sering muncul di soal:
                    </p>
                    <div className="mt-2 overflow-x-auto">
                      <BlockMath math="(A \cup B)^c = A^c \cap B^c" />
                      <BlockMath math="(A \cap B)^c = A^c \cup B^c" />
                    </div>
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
                      Diketahui <InlineMath math="S = \{1,2,3,4,5,6,7,8,9,10\}" /> dan{" "}
                      <InlineMath math="A = \{2,4,6,8,10\}" />. Tentukan <InlineMath math="A^c" /> dan{" "}
                      <InlineMath math="n(A^c)" />!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><InlineMath math="A^c" /> = anggota S yang tidak ada di A:</p>
                      <p className="text-sky-300"><InlineMath math="A^c = \{1, 3, 5, 7, 9\}" /></p>
                      <p className="text-sky-300"><InlineMath math="n(A^c) = 5" /></p>
                      <p><strong>Verifikasi:</strong> <InlineMath math="n(A) + n(A^c) = 5 + 5 = 10 = n(S)" /> ✓</p>
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
                      Semesta <InlineMath math="S = \{a,b,c,d,e,f,g,h\}" />,{" "}
                      <InlineMath math="P = \{a,c,e,g\}" />, dan <InlineMath math="Q = \{b,c,d,e\}" />.
                      Tentukan <InlineMath math="(P \cup Q)^c" /> dan verifikasi Hukum De Morgan:{" "}
                      <InlineMath math="(P \cup Q)^c = P^c \cap Q^c" />.
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1 — Hitung <InlineMath math="P \cup Q" />:</strong></p>
                      <p className="text-purple-300"><InlineMath math="P \cup Q = \{a,b,c,d,e,g\}" /></p>
                      <p><strong>Langkah 2 — Hitung <InlineMath math="(P \cup Q)^c" />:</strong></p>
                      <p className="text-sky-300"><InlineMath math="(P \cup Q)^c = S - (P \cup Q) = \{f, h\}" /></p>
                      <p><strong>Langkah 3 — Verifikasi De Morgan:</strong></p>
                      <div className="bg-slate-800/60 rounded p-3 space-y-1">
                        <p><InlineMath math="P^c = S - P = \{b,d,f,h\}" /></p>
                        <p><InlineMath math="Q^c = S - Q = \{a,f,g,h\}" /></p>
                        <p><InlineMath math="P^c \cap Q^c = \{f, h\}" /></p>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                        <p className="text-yellow-300 font-semibold text-xs">
                          ✅ <InlineMath math="(P \cup Q)^c = \{f,h\} = P^c \cap Q^c" /> — Hukum De Morgan terbukti!
                        </p>
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
                      Diketahui <InlineMath math="n(S) = 60" />, <InlineMath math="n(A) = 35" />,{" "}
                      <InlineMath math="n(B) = 28" />, dan <InlineMath math="n((A \cup B)^c) = 10" />.
                      Tentukan: a. <InlineMath math="n(A \cup B)" />, b. <InlineMath math="n(A \cap B)" />,
                      c. <InlineMath math="n(A^c)" />, d. <InlineMath math="n(B^c)" />,
                      e. <InlineMath math="n(A^c \cap B^c)" />.
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">PEMBAHASAN:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                      <p><strong>a.</strong> Dari komplemen gabungan:</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(A \cup B) = n(S) - n((A \cup B)^c) = 60 - 10 = 50" />
                      </div>
                      <p><strong>b.</strong> Dari rumus inklusi-eksklusi:</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(A \cap B) = n(A) + n(B) - n(A \cup B) = 35 + 28 - 50 = 13" />
                      </div>
                      <p><strong>c.</strong> Komplemen A:</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(A^c) = n(S) - n(A) = 60 - 35 = 25" />
                      </div>
                      <p><strong>d.</strong> Komplemen B:</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(B^c) = n(S) - n(B) = 60 - 28 = 32" />
                      </div>
                      <p><strong>e.</strong> Dari Hukum De Morgan, <InlineMath math="A^c \cap B^c = (A \cup B)^c" />:</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(A^c \cap B^c) = n((A \cup B)^c) = 10" />
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mt-2">
                        <p className="text-red-300 font-semibold text-xs mb-1">✅ Rangkuman Jawaban:</p>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <p>a. <InlineMath math="n(A\cup B) = 50" /></p>
                          <p>b. <InlineMath math="n(A\cap B) = 13" /></p>
                          <p>c. <InlineMath math="n(A^c) = 25" /></p>
                          <p>d. <InlineMath math="n(B^c) = 32" /></p>
                          <p className="col-span-2">e. <InlineMath math="n(A^c \cap B^c) = 10" /></p>
                        </div>
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

export default DiagramVennPage;
