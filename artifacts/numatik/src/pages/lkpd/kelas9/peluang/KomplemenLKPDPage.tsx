import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Dadu: Mata 6 vs Bukan Mata 6",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#fda4af" textAnchor="middle">A = mata 6, Aᶜ = BUKAN mata 6</text>
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <g key={n}>
              <rect x={20 + i * 42} y={50} width={36} height={36} rx={6}
                fill={n === 6 ? "#34d399" : "#ef4444"}
                fillOpacity="0.45" stroke={n === 6 ? "#6ee7b7" : "#fca5a5"} strokeWidth="1.5" />
              <text x={38 + i * 42} y={75} fontSize="16" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{n}</text>
            </g>
          ))}
          <text x="140" y="105" fontSize="11" fill="#a7f3d0" textAnchor="middle">A = {"{6}"} → P(A) = 1/6</text>
          <text x="140" y="125" fontSize="11" fill="#fca5a5" textAnchor="middle">Aᶜ = {"{1,2,3,4,5}"} → P(Aᶜ) = 5/6</text>
          <rect x="50" y="145" width="180" height="40" rx="8" fill="#fbbf24" fillOpacity="0.45" stroke="#fde68a" strokeWidth="1.5" />
          <text x="140" y="170" fontSize="13" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">P(A) + P(Aᶜ) = 1/6 + 5/6 = 1</text>
        </svg>
      </div>
    ),
    text:
      "Pada dadu, A = 'mata 6' memiliki P(A) = 1/6. KOMPLEMEN-nya, Aᶜ = 'BUKAN mata 6' = {1,2,3,4,5} memiliki P(Aᶜ) = 5/6. Kedua peluang ini selalu BERJUMLAH 1!",
  },
  {
    title: "Situasi 2 — Konsep Komplemen secara Visual",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 180" className="w-full">
          <rect width="280" height="180" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#67e8f9" textAnchor="middle">Diagram Venn — Ruang Sampel S</text>
          <rect x="40" y="40" width="200" height="100" rx="8" fill="#1e293b" stroke="#67e8f9" strokeWidth="2" />
          <text x="50" y="55" fontSize="10" fill="#67e8f9">S</text>
          <circle cx="115" cy="90" r="38" fill="#22d3ee" fillOpacity="0.45" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="115" y="95" fontSize="13" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">A</text>
          <text x="115" y="118" fontSize="9" fill="#fde68a" textAnchor="middle">P(A)</text>
          <text x="200" y="80" fontSize="11" fontWeight="bold" fill="#ef4444" textAnchor="middle">Aᶜ</text>
          <text x="200" y="100" fontSize="9" fill="#fda4af" textAnchor="middle">SISA</text>
          <text x="200" y="115" fontSize="9" fill="#fda4af" textAnchor="middle">P(Aᶜ)=1−P(A)</text>
          <rect x="40" y="155" width="200" height="22" rx="6" fill="#34d399" fillOpacity="0.4" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="171" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">P(Aᶜ) = 1 − P(A)</text>
        </svg>
      </div>
    ),
    text:
      "Bayangkan kotak BESAR adalah ruang sampel S. A adalah lingkaran biru, dan Aᶜ adalah SISA-nya (semua selain A). Karena S = A ∪ Aᶜ dan keduanya saling lepas, maka P(S) = 1 → P(A) + P(Aᶜ) = 1.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Komplemen kejadian A (ditulis Aᶜ atau A') artinya …",
    kind: "choice",
    options: [
      "kejadian sama dengan A",
      "kejadian BUKAN A (semua hasil di S yang tidak termasuk A)",
      "dua kali kejadian A",
      "kejadian saling bebas dengan A",
    ],
    correctIndex: 1,
    discussion: ["Aᶜ = SEMUA titik sampel di S yang TIDAK termasuk A."],
  },
  {
    id: "g2",
    label: "Hubungan dasar peluang A dan komplemennya: P(A) + P(Aᶜ) = …",
    kind: "fill",
    answers: ["1"],
    discussion: ["P(S) = 1 dan A ∪ Aᶜ = S, jadi P(A) + P(Aᶜ) = 1."],
  },
  {
    id: "g3",
    label: "Rumus peluang komplemen: P(Aᶜ) = …",
    kind: "choice",
    options: ["P(A)", "1 + P(A)", "1 − P(A)", "P(A) − 1"],
    correctIndex: 2,
    discussion: ["P(Aᶜ) = 1 − P(A)."],
  },
  {
    id: "g4",
    label: "Lempar dadu, A = 'mata 1'. P(Aᶜ) = …",
    kind: "fill",
    answers: ["5/6"],
    discussion: ["P(A) = 1/6, P(Aᶜ) = 1 − 1/6 = 5/6."],
  },
  {
    id: "g5",
    label: "Jika P(A) = 0,3 maka P(Aᶜ) = …",
    kind: "fill",
    answers: ["0,7", "0.7", "7/10"],
    discussion: ["1 − 0,3 = 0,7."],
  },
  {
    id: "g6",
    label:
      "Lempar dadu. Komplemen 'mata genap' adalah …",
    kind: "choice",
    options: [
      "{2, 4, 6}",
      "{1, 3, 5}",
      "{2, 4}",
      "{1, 2, 3}",
    ],
    correctIndex: 1,
    discussion: ["Genap = {2,4,6}, jadi komplemennya = {1,3,5} = ganjil."],
  },
  {
    id: "g7",
    label:
      "Lempar 2 dadu. P(jumlah mata = 7) = 6/36. P(jumlah mata ≠ 7) = …",
    kind: "fill",
    answers: ["30/36", "5/6"],
    discussion: ["1 − 6/36 = 30/36 = 5/6."],
  },
  {
    id: "g8",
    label:
      "Peluang seorang siswa LULUS ujian = 0,85. Peluang TIDAK LULUS = …",
    kind: "fill",
    answers: ["0,15", "0.15", "3/20"],
    discussion: ["1 − 0,85 = 0,15."],
  },
  {
    id: "g9",
    label:
      "Pernyataan: P(A) + P(Aᶜ) bisa lebih dari 1.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Selalu = 1 karena A dan Aᶜ adalah pembagian sempurna dari S.",
    ],
  },
  {
    id: "g10",
    label:
      "Pernyataan: Komplemen dari A adalah kejadian yang BENAR-BENAR berlawanan, sehingga A dan Aᶜ TIDAK bisa terjadi bersamaan.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. A dan Aᶜ saling LEPAS (irisan kosong).",
    ],
  },
  {
    id: "g11",
    label: "Pasangkan KEJADIAN dengan KOMPLEMEN-nya:",
    kind: "match",
    pairs: [
      { left: "Mata genap (dadu)", right: "Mata ganjil" },
      { left: "Hujan", right: "Tidak hujan" },
      { left: "Lulus", right: "Tidak lulus" },
      { left: "Mata > 4 (dadu)", right: "Mata ≤ 4" },
    ],
    discussion: ["Komplemen = LAWAN/SISA dari kejadian asli."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Definisi Komplemen",
    text: "KOMPLEMEN kejadian A (ditulis Aᶜ atau A') adalah HIMPUNAN SEMUA titik sampel di S yang TIDAK termasuk A.",
    tone: "rose",
  },
  {
    title: "Rumus Peluang Komplemen",
    text: "P(Aᶜ) = 1 − P(A). Karena A ∪ Aᶜ = S dan A ∩ Aᶜ = ∅, maka P(A) + P(Aᶜ) = 1.",
    tone: "cyan",
  },
  {
    title: "Tips Pemakaian",
    text: "Gunakan KOMPLEMEN saat menghitung 'paling sedikit', 'minimal', atau 'BUKAN' lebih MUDAH lewat 1 − P(A).",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "kompl-game-pasangan",
    title: "🎯 Game 1 — Cari Pasangan Komplemen",
    description: "Seret tiap kejadian ke KOMPLEMEN-nya yang tepat!",
    buckets: [
      { id: "ganjil", label: "Mata Ganjil", emoji: "🎲", color: "violet" },
      { id: "tidakhujan", label: "Tidak Hujan", emoji: "☀️", color: "amber" },
      { id: "tidaklulus", label: "Tidak Lulus", emoji: "📕", color: "rose" },
      { id: "kurangdari5", label: "Mata < 5 (dadu)", emoji: "🎲", color: "cyan" },
    ],
    items: [
      { id: "p1", label: "Mata genap (dadu)", bucketId: "ganjil", emoji: "🎲" },
      { id: "p2", label: "Hujan", bucketId: "tidakhujan", emoji: "🌧️" },
      { id: "p3", label: "Lulus", bucketId: "tidaklulus", emoji: "📗" },
      { id: "p4", label: "Mata ≥ 5 (dadu)", bucketId: "kurangdari5", emoji: "🎲" },
      { id: "p5", label: "Mata 2,4,6 (dadu)", bucketId: "ganjil", emoji: "🎲" },
      { id: "p6", label: "Cuaca basah", bucketId: "tidakhujan", emoji: "🌧️" },
      { id: "p7", label: "Nilai ≥ 75", bucketId: "tidaklulus", emoji: "📕" },
      { id: "p8", label: "Mata = 5 atau 6", bucketId: "kurangdari5", emoji: "🎲" },
    ],
  },
  {
    kind: "arrow-match",
    id: "kompl-game-hitung",
    title: "🎯 Game 2 — Hitung P(Aᶜ) Cepat!",
    description: "Pasangkan tiap P(A) dengan P(Aᶜ)-nya. Tekan ◀ ▶.",
    rightOptions: ["0,1", "0,25", "0,4", "0,5", "0,7", "0,85", "5/6"],
    pairs: [
      { id: "h1", left: "P(A) = 1/6", correctRight: "5/6", emoji: "🎲" },
      { id: "h2", left: "P(A) = 0,5", correctRight: "0,5", emoji: "⚖️" },
      { id: "h3", left: "P(A) = 0,9", correctRight: "0,1", emoji: "📈" },
      { id: "h4", left: "P(A) = 0,3", correctRight: "0,7", emoji: "📊" },
      { id: "h5", left: "P(A) = 0,75", correctRight: "0,25", emoji: "📈" },
      { id: "h6", left: "P(A) = 0,6", correctRight: "0,4", emoji: "📊" },
      { id: "h7", left: "P(A) = 0,15", correctRight: "0,85", emoji: "📊" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Lempar dadu, A = 'mata 4'. P(Aᶜ) = …",
    kind: "fill",
    answers: ["5/6"],
    hint: "1 − 1/6.",
    discussion: ["P(A) = 1/6, P(Aᶜ) = 1 − 1/6 = 5/6."],
  },
  {
    id: "pp2",
    question: "Jika P(A) = 0,42, maka P(Aᶜ) = …",
    kind: "fill",
    answers: ["0,58", "0.58"],
    hint: "1 − 0,42.",
    discussion: ["1 − 0,42 = 0,58."],
  },
  {
    id: "pp3",
    question:
      "Peluang sebuah lampu tahan ≥ 1000 jam = 0,92. Peluang lampu rusak < 1000 jam = …",
    kind: "fill",
    answers: ["0,08", "0.08", "2/25"],
    hint: "Komplemen tahan ≥ 1000 jam.",
    discussion: ["1 − 0,92 = 0,08."],
  },
  {
    id: "pp4",
    question:
      "Lempar 2 dadu. P(jumlah mata = 12) = 1/36. P(jumlah ≠ 12) = …",
    kind: "fill",
    answers: ["35/36"],
    hint: "1 − 1/36.",
    discussion: ["1 − 1/36 = 35/36."],
  },
  {
    id: "pp5",
    question:
      "Pernyataan: Jika P(A) = 0, maka P(Aᶜ) = 1.",
    kind: "truefalse",
    correct: true,
    hint: "Substitusi ke rumus.",
    discussion: ["BENAR. 1 − 0 = 1 (kejadian Aᶜ pasti terjadi)."],
  },
  {
    id: "pp6",
    question:
      "Dari 1 set kartu remi (52). P(BUKAN As) = …",
    kind: "fill",
    answers: ["12/13", "48/52"],
    hint: "P(As) = 4/52, lalu 1 − P(As).",
    discussion: ["1 − 4/52 = 48/52 = 12/13."],
  },
  {
    id: "pp7",
    question:
      "Sebuah kotak berisi 12 kelereng (5 merah, 4 biru, 3 hijau). P(BUKAN merah) = …",
    kind: "fill",
    answers: ["7/12"],
    hint: "1 − 5/12.",
    discussion: ["1 − 5/12 = 7/12."],
  },
  {
    id: "pp8",
    question:
      "Lempar 3 koin. P(SEMUA Angka) = 1/8. P(MINIMAL satu Gambar) = …",
    kind: "fill",
    answers: ["7/8"],
    hint: "Komplemen 'semua Angka'.",
    discussion: ["1 − 1/8 = 7/8."],
  },
];

const KomplemenLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Peluang"
    title="Komplemen Suatu Kejadian — Penemuan Terbimbing"
    intro="Sobat Numatik 🔄! Yuk kenalan dengan KOMPLEMEN. Jika A = 'mata 6', maka Aᶜ = 'BUKAN mata 6'. Kamu akan menemukan rumus ajaib P(Aᶜ) = 1 − P(A) yang sering memudahkan perhitungan peluang yang rumit!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan rumus komplemen."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/peluang"
    backLabel="Kembali ke Menu Peluang"
    scoreMessages={{
      perfect: "🌟 Mantap! Konsep komplemen sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ingat: P(Aᶜ) = 1 − P(A).",
      low: "💪 Tetap semangat! Mulai dari kasus dadu.",
    }}
  />
);

export default KomplemenLKPDPage;
