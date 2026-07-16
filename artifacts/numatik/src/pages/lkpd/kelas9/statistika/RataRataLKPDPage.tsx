import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Nilai Ulangan",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">5 nilai ulangan: 7, 8, 6, 9, 10</text>
          {[7, 8, 6, 9, 10].map((n, i) => (
            <g key={i}>
              <rect x={30 + i * 50} y={50} width={40} height={40} rx={6} fill="#22d3ee" fillOpacity="0.4" stroke="#67e8f9" strokeWidth="1.5" />
              <text x={50 + i * 50} y={75} fontSize="14" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{n}</text>
            </g>
          ))}
          <text x="140" y="120" fontSize="11" fill="#fde68a" textAnchor="middle">Jumlah = 7+8+6+9+10 = 40</text>
          <text x="140" y="140" fontSize="11" fill="#fde68a" textAnchor="middle">Banyak data = 5</text>
          <rect x="60" y="155" width="160" height="32" rx="6" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="178" fontSize="13" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Rata-rata = 40 ÷ 5 = 8</text>
        </svg>
      </div>
    ),
    text:
      "Lima nilai ulangan: 7, 8, 6, 9, 10. RATA-RATA (mean) = jumlah semua data ÷ banyak data = 40 ÷ 5 = 8. Inilah ukuran PUSAT yang paling umum.",
  },
  {
    title: "Situasi 2 — Rata-rata Gabungan 2 Kelas",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <rect x="20" y="40" width="110" height="60" rx="8" fill="#f472b6" fillOpacity="0.35" stroke="#f9a8d4" strokeWidth="1.5" />
          <text x="75" y="60" fontSize="10" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Kelas A</text>
          <text x="75" y="78" fontSize="9" fill="var(--icon-color)" textAnchor="middle">n₁ = 20</text>
          <text x="75" y="92" fontSize="9" fill="var(--icon-color)" textAnchor="middle">x̄₁ = 80</text>
          <rect x="150" y="40" width="110" height="60" rx="8" fill="#fbbf24" fillOpacity="0.35" stroke="#fde68a" strokeWidth="1.5" />
          <text x="205" y="60" fontSize="10" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Kelas B</text>
          <text x="205" y="78" fontSize="9" fill="var(--icon-color)" textAnchor="middle">n₂ = 30</text>
          <text x="205" y="92" fontSize="9" fill="var(--icon-color)" textAnchor="middle">x̄₂ = 70</text>
          <text x="140" y="125" fontSize="11" fill="#a7f3d0" textAnchor="middle">x̄_gab = (n₁·x̄₁ + n₂·x̄₂) / (n₁ + n₂)</text>
          <text x="140" y="145" fontSize="11" fill="#fde68a" textAnchor="middle">= (20·80 + 30·70) / (20 + 30)</text>
          <text x="140" y="165" fontSize="11" fill="#fde68a" textAnchor="middle">= (1600 + 2100) / 50 = 3700/50</text>
          <text x="140" y="185" fontSize="13" fontWeight="bold" fill="#34d399" textAnchor="middle">x̄_gab = 74</text>
        </svg>
      </div>
    ),
    text:
      "Saat menggabungkan 2 kelompok dengan jumlah data BERBEDA, kita gunakan rumus rata-rata GABUNGAN: x̄_gab = (n₁x̄₁ + n₂x̄₂) / (n₁ + n₂). Bukan sekadar rata-rata dari rata-rata!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Rata-rata (mean) suatu data didapat dengan cara …",
    kind: "choice",
    options: [
      "menjumlahkan semua data lalu dibagi banyak data",
      "memilih data yang paling sering muncul",
      "memilih data yang berada di tengah",
      "menjumlahkan data terbesar dan terkecil",
    ],
    correctIndex: 0,
    discussion: ["Rata-rata = JUMLAH ÷ BANYAK data."],
  },
  {
    id: "g2",
    label:
      "Lambang rata-rata adalah …",
    kind: "choice",
    options: ["x̄ (x bar)", "Σx", "n", "f"],
    correctIndex: 0,
    discussion: ["x̄ dibaca 'x bar' = rata-rata."],
  },
  {
    id: "g3",
    label:
      "Rata-rata data 4, 5, 6, 7, 8 = …",
    kind: "fill",
    answers: ["6"],
    discussion: ["(4+5+6+7+8)/5 = 30/5 = 6."],
  },
  {
    id: "g4",
    label:
      "Rata-rata data 10, 20, 30, 40 = …",
    kind: "fill",
    answers: ["25"],
    discussion: ["(10+20+30+40)/4 = 100/4 = 25."],
  },
  {
    id: "g5",
    label:
      "Untuk data berbobot/frekuensi, rumus rata-rata = (Σf·x) / …",
    kind: "fill",
    answers: ["Σf", "n", "jumlah f", "total f"],
    discussion: [
      "x̄ = (Σ f·x) / Σf = jumlah (frekuensi × nilai) ÷ total frekuensi.",
    ],
  },
  {
    id: "g6",
    label:
      "Tabel: nilai 6 (f=2), 7 (f=3), 8 (f=5). Hitung rata-rata = …",
    kind: "fill",
    answers: ["7,3", "7.3"],
    discussion: [
      "Σf·x = 6·2 + 7·3 + 8·5 = 12 + 21 + 40 = 73.",
      "Σf = 2+3+5 = 10.",
      "x̄ = 73/10 = 7,3.",
    ],
  },
  {
    id: "g7",
    label:
      "Rumus rata-rata GABUNGAN dua kelompok: x̄_gab = (n₁·x̄₁ + n₂·x̄₂) / …",
    kind: "fill",
    answers: ["n₁ + n₂", "n1+n2", "(n₁+n₂)", "(n1+n2)"],
    discussion: ["x̄_gab = (n₁·x̄₁ + n₂·x̄₂) / (n₁ + n₂)."],
  },
  {
    id: "g8",
    label:
      "Kelas A (20 siswa, x̄=80) dan Kelas B (30 siswa, x̄=70). Rata-rata gabungan = …",
    kind: "fill",
    answers: ["74"],
    discussion: ["(20·80 + 30·70)/50 = (1600+2100)/50 = 3700/50 = 74."],
  },
  {
    id: "g9",
    label:
      "Rata-rata 5 bilangan 8. Jika ditambah 1 data bernilai 14, rata-rata baru = …",
    kind: "fill",
    answers: ["9"],
    discussion: [
      "Jumlah lama = 5×8 = 40.",
      "Jumlah baru = 40 + 14 = 54.",
      "Banyak data baru = 6. x̄ = 54/6 = 9.",
    ],
  },
  {
    id: "g10",
    label:
      "Pernyataan: Rata-rata DUA kelompok yang nilai rata-ratanya sama, akan menghasilkan rata-rata gabungan yang sama dengan rata-rata salah satunya, tanpa peduli ukuran sampel.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Jika x̄₁ = x̄₂ = 75 (apa pun n), x̄_gab = 75.",
    ],
  },
  {
    id: "g11",
    label:
      "Rata-rata 4 siswa = 80. Jika satu siswa baru bergabung dan rata-rata menjadi 78, nilai siswa baru = …",
    kind: "fill",
    answers: ["70"],
    discussion: [
      "Jumlah lama = 4×80 = 320.",
      "Jumlah baru = 5×78 = 390.",
      "Selisih = 390 − 320 = 70.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan KASUS dengan RUMUS yang tepat:",
    kind: "match",
    pairs: [
      { left: "Data tunggal", right: "x̄ = (Σx) / n" },
      { left: "Data dengan frekuensi", right: "x̄ = (Σf·x) / Σf" },
      { left: "Gabungan 2 kelompok", right: "x̄ = (n₁x̄₁+n₂x̄₂)/(n₁+n₂)" },
      { left: "Lambang rata-rata", right: "x̄ (x bar)" },
    ],
    discussion: ["Hafal 3 bentuk rumus rata-rata utama."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Rata-rata Tunggal",
    text: "x̄ = (Σx) / n. Jumlahkan SEMUA data, lalu bagi BANYAK data. Lambangnya x̄ (x bar).",
    tone: "cyan",
  },
  {
    title: "Rata-rata Berbobot",
    text: "Untuk data berbobot/frekuensi: x̄ = (Σ f·x) / Σf. Kalikan setiap nilai dengan frekuensinya, jumlahkan, lalu bagi total frekuensi.",
    tone: "violet",
  },
  {
    title: "Rata-rata Gabungan",
    text: "x̄_gab = (n₁·x̄₁ + n₂·x̄₂) / (n₁ + n₂). PERHATIKAN: bukan rata-rata sederhana dari dua rata-rata, melainkan rata-rata BERTIMBANG sesuai ukuran sampel.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "ratarata-game-jenis",
    title: "🎯 Game 1 — Pilih Rumus (Seret!)",
    description: "Seret setiap kasus ke RUMUS yang tepat untuk menghitung rata-ratanya.",
    buckets: [
      { id: "tunggal", label: "Σx / n", emoji: "🔢", color: "cyan" },
      { id: "fx", label: "(Σf·x) / Σf", emoji: "📊", color: "violet" },
      { id: "gab", label: "Gabungan", emoji: "🧮", color: "amber" },
    ],
    items: [
      { id: "r1", label: "5 nilai: 6, 7, 8, 9, 10", bucketId: "tunggal", emoji: "🔢" },
      { id: "r2", label: "Tabel: nilai & frekuensi", bucketId: "fx", emoji: "📊" },
      { id: "r3", label: "Kelas A (n=20) & B (n=30)", bucketId: "gab", emoji: "🧮" },
      { id: "r4", label: "10 data tunggal", bucketId: "tunggal", emoji: "🔢" },
      { id: "r5", label: "Distribusi nilai siswa", bucketId: "fx", emoji: "📊" },
      { id: "r6", label: "Gabungan 3 kelompok", bucketId: "gab", emoji: "🧮" },
      { id: "r7", label: "Tinggi 7 siswa", bucketId: "tunggal", emoji: "🔢" },
      { id: "r8", label: "Diagram batang frekuensi", bucketId: "fx", emoji: "📊" },
    ],
  },
  {
    kind: "arrow-match",
    id: "ratarata-game-hitung",
    title: "🎯 Game 2 — Hitung Cepat",
    description: "Pasangkan tiap soal dengan RATA-RATA-nya. Tekan ◀ ▶.",
    rightOptions: ["6", "7", "7,3", "8", "9", "25", "74"],
    pairs: [
      { id: "h1", left: "4,5,6,7,8", correctRight: "6", emoji: "🔢" },
      { id: "h2", left: "5,6,7,8,9", correctRight: "7", emoji: "🔢" },
      { id: "h3", left: "10,20,30,40", correctRight: "25", emoji: "🔢" },
      { id: "h4", left: "5 data: x̄=8, +14 → x̄ baru?", correctRight: "9", emoji: "🔢" },
      { id: "h5", left: "Tabel 6(f=2),7(f=3),8(f=5)", correctRight: "7,3", emoji: "📊" },
      { id: "h6", left: "Gabungan A(20,80) & B(30,70)", correctRight: "74", emoji: "🧮" },
      { id: "h7", left: "Rata-rata 7,8,9", correctRight: "8", emoji: "🔢" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Rata-rata data 5, 6, 7, 8, 9, 10 = …",
    kind: "fill",
    answers: ["7,5", "7.5"],
    hint: "Σx/n.",
    discussion: ["45/6 = 7,5."],
  },
  {
    id: "pp2",
    question: "Tabel: 6(f=4), 7(f=5), 8(f=6), 9(f=3), 10(f=2). Rata-rata = …",
    kind: "fill",
    answers: ["7,7", "7.7"],
    hint: "(Σf·x) / Σf.",
    discussion: [
      "Σf·x = 24+35+48+27+20 = 154.",
      "Σf = 20.",
      "x̄ = 154/20 = 7,7.",
    ],
  },
  {
    id: "pp3",
    question:
      "Kelas A (15 siswa, x̄=80), Kelas B (25 siswa, x̄=72). Rata-rata gabungan = …",
    kind: "fill",
    answers: ["75"],
    hint: "(15·80 + 25·72) / 40.",
    discussion: ["(1200 + 1800)/40 = 3000/40 = 75."],
  },
  {
    id: "pp4",
    question:
      "Rata-rata 6 siswa adalah 75. Jika siswa baru masuk dan rata-rata menjadi 76, nilai siswa baru = …",
    kind: "fill",
    answers: ["82"],
    hint: "Selisih total baru − total lama.",
    discussion: ["7×76 − 6×75 = 532 − 450 = 82."],
  },
  {
    id: "pp5",
    question:
      "Rata-rata 8 siswa = 70. Jika ada siswa dengan nilai 90 dikeluarkan, rata-rata 7 siswa sisanya = …",
    kind: "fill",
    answers: ["67,14", "67.14"],
    hint: "Total lama − 90, lalu /7.",
    discussion: [
      "Total lama = 8×70 = 560.",
      "Sisa = 560 − 90 = 470.",
      "Rata-rata sisa = 470/7 ≈ 67,14.",
    ],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Rata-rata gabungan dua kelas = (x̄₁ + x̄₂) ÷ 2.",
    kind: "truefalse",
    correct: false,
    hint: "Hanya benar jika n₁ = n₂.",
    discussion: [
      "SALAH. Hanya berlaku jika n₁ = n₂. Jika berbeda, gunakan rumus berbobot.",
    ],
  },
  {
    id: "pp7",
    question:
      "Tinggi 5 siswa: 145, 150, 155, 160, 165 cm. Rata-rata tinggi = … cm.",
    kind: "fill",
    answers: ["155"],
    hint: "Σx/n.",
    discussion: ["775/5 = 155 cm."],
  },
  {
    id: "pp8",
    question:
      "Rata-rata kelas (40 siswa) = 70. Jika 5 siswa nilainya 90 dipisahkan, rata-rata 35 sisanya = …",
    kind: "fill",
    answers: ["67,14", "67.14"],
    hint: "Total kelas − total 5 siswa, lalu /35.",
    discussion: [
      "Total kelas = 40×70 = 2.800.",
      "Total 5 siswa = 5×90 = 450.",
      "Sisa = 2.800 − 450 = 2.350. Rata-rata = 2.350/35 ≈ 67,14.",
    ],
  },
];

const RataRataLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Statistika"
    title="Rata-rata & Rata-rata Gabungan — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami RATA-RATA ➕! Kamu akan menemukan rumus mean tunggal x̄ = Σx/n, mean berbobot (Σfx/Σf), dan rumus GABUNGAN (n₁x̄₁ + n₂x̄₂)/(n₁+n₂) — sambil bermain seret kartu memilih rumus yang tepat!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan ketiga bentuk rumus rata-rata."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/statistika"
    backLabel="Kembali ke Menu Statistika"
    scoreMessages={{
      perfect: "🌟 Mantap! Rumus rata-rata sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang rumus berbobot & gabungan.",
      low: "💪 Tetap semangat! Mulai dari x̄ = Σx/n.",
    }}
  />
);

export default RataRataLKPDPage;
