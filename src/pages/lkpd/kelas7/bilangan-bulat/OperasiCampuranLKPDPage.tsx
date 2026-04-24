import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Urutan operasi yang benar (KuKaKaTaTa) adalah ...",
    kind: "choice",
    options: [
      "Kurung → Kali/Bagi → Tambah/Kurang",
      "Kurung → Tambah/Kurang → Kali/Bagi",
      "Tambah → Kurang → Kali → Bagi",
      "Dari kiri ke kanan saja",
    ],
    correctIndex: 0,
    discussion: [
      "Selesaikan dahulu yang ada di dalam kurung.",
      "Lalu kerjakan kali/bagi sebelum tambah/kurang.",
      "Operasi setingkat dikerjakan dari kiri ke kanan.",
    ],
  },
  {
    id: "g2",
    label: "Hitung: 12 + 3 × 4 = ...",
    kind: "fill",
    answers: ["24"],
    discussion: ["3 × 4 = 12 (kali dulu).", "12 + 12 = 24."],
  },
  {
    id: "g3",
    label: "Benar atau salah: \"Operasi kali dan bagi setingkat, dikerjakan dari kiri ke kanan.\"",
    kind: "truefalse",
    correct: true,
    discussion: ["Kali dan bagi setingkat → dikerjakan urut dari kiri ke kanan."],
  },
  {
    id: "g4",
    label: "Jodohkan ekspresi dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "(8 + 2) × 3", right: "30" },
      { left: "8 + 2 × 3", right: "14" },
      { left: "20 ÷ 4 + 1", right: "6" },
      { left: "20 ÷ (4 + 1)", right: "4" },
    ],
    discussion: [
      "Kurung mengubah urutan perhitungan.",
      "(8+2)×3 = 30 vs 8+2×3 = 14.",
      "20÷4+1 = 6 vs 20÷(4+1) = 4.",
    ],
  },
  {
    id: "g5",
    label: "Urutkan langkah untuk menghitung 24 − 6 ÷ 2 + 5 × 3:",
    kind: "sort",
    items: [
      "Hasil = 36",
      "Hitung 6 ÷ 2 = 3",
      "Hitung 5 × 3 = 15",
      "Hitung 24 − 3 + 15 dari kiri ke kanan",
    ],
    correctOrder: [
      "Hitung 6 ÷ 2 = 3",
      "Hitung 5 × 3 = 15",
      "Hitung 24 − 3 + 15 dari kiri ke kanan",
      "Hasil = 36",
    ],
    discussion: [
      "Selesaikan dulu kali dan bagi.",
      "Lalu jumlah/kurang dari kiri ke kanan.",
      "24 − 3 + 15 = 21 + 15 = 36.",
    ],
  },
  {
    id: "g6",
    label: "Hitung: -6 + 4 × (-3) = ...",
    kind: "fill",
    answers: ["-18"],
    discussion: ["4 × (-3) = -12.", "-6 + (-12) = -18."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung: 36 ÷ (-4) + 5 × 2",
    kind: "fill",
    answers: ["1"],
    hint: "Bagi dahulu: 36 ÷ (-4) = -9. Kalikan: 5 × 2 = 10.",
    discussion: ["36 ÷ (-4) = -9.", "5 × 2 = 10.", "-9 + 10 = 1."],
  },
  {
    id: "p2",
    question: "Pilih hasil yang benar untuk -3 × (4 − 9) + 2:",
    kind: "choice",
    options: ["17", "-13", "13", "-17"],
    correctIndex: 0,
    hint: "Hitung dalam kurung dahulu: 4 − 9 = -5.",
    discussion: ["4 − 9 = -5.", "-3 × (-5) = 15.", "15 + 2 = 17."],
  },
  {
    id: "p3",
    question: "Benar atau salah: \"Hasil dari 8 − 3 × 2² adalah -4.\"",
    kind: "truefalse",
    correct: true,
    hint: "Pangkat dulu, lalu kali, lalu kurang.",
    discussion: ["2² = 4.", "3 × 4 = 12.", "8 − 12 = -4. Benar."],
  },
  {
    id: "p4",
    question: "Jodohkan ekspresi dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "100 − 4 × 15", right: "40" },
      { left: "(100 − 4) × 15", right: "1440" },
      { left: "-12 + 5 × (-3)", right: "-27" },
      { left: "(-12 + 5) × (-3)", right: "21" },
    ],
    hint: "Perhatikan posisi tanda kurung.",
    discussion: [
      "100 − 4 × 15 = 100 − 60 = 40.",
      "(100 − 4) × 15 = 96 × 15 = 1.440.",
      "-12 + 5 × (-3) = -12 + (-15) = -27.",
      "(-12 + 5) × (-3) = -7 × (-3) = 21.",
    ],
  },
  {
    id: "p5",
    question: "Suhu mula-mula -5°C. Naik 3°C setiap jam selama 4 jam, lalu turun 2°C. Suhu akhir = ...°C",
    kind: "fill",
    answers: ["5"],
    hint: "Suhu = -5 + 3 × 4 − 2.",
    discussion: ["3 × 4 = 12.", "-5 + 12 − 2 = 5.", "Jadi, suhu akhir 5°C."],
  },
  {
    id: "p6",
    question: "Hitung: 60 ÷ (-3 + 5) × 4",
    kind: "fill",
    answers: ["120"],
    hint: "Kurung dulu: -3 + 5 = 2. Kemudian dari kiri.",
    discussion: ["-3 + 5 = 2.", "60 ÷ 2 = 30.", "30 × 4 = 120."],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Urutan Operasi",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">Kurung → Kali/Bagi → Tambah/Kurang</p>
        <p className="text-sm text-white/65">Setingkat? Kerjakan dari kiri ke kanan.</p>
      </div>
    ),
    text: "Tanpa urutan operasi yang benar, hasil bisa keliru meskipun perhitungannya benar.",
  },
  {
    title: "Situasi: Pengaruh Tanda Kurung",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">8 + 2 × 3 = 14</p>
        <p className="text-lg font-bold text-white">(8 + 2) × 3 = 30</p>
      </div>
    ),
    text: "Tanda kurung mengubah urutan dan mengubah hasil.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Urutan", text: "Kurung dahulu, lalu pangkat/akar, lalu kali/bagi, terakhir tambah/kurang.", tone: "cyan" },
  { title: "Setingkat", text: "Kali dan bagi setingkat, tambah dan kurang setingkat: kerjakan dari kiri ke kanan.", tone: "yellow" },
  { title: "Tanda", text: "Tetap pakai aturan tanda perkalian/pembagian setiap kali bertemu negatif.", tone: "emerald" },
];

const OperasiCampuranLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Operasi Hitung Campuran Bilangan Bulat"
    intro="LKPD ini melatih Sobat Numatik menerapkan urutan operasi pada soal yang melibatkan tambah, kurang, kali, bagi, dan tanda kurung."
    situations={situations}
    guidedIntro="Kerjakan setiap soal untuk menemukan urutan operasi yang benar."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Tandai dahulu langkah mana yang harus dikerjakan lebih dulu, baru hitung."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-bulat"
    backLabel="Kembali ke LKPD Bilangan Bulat"
  />
);

export default OperasiCampuranLKPDPage;
