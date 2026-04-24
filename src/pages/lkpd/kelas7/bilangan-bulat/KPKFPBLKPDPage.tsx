import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "FPB (Faktor Persekutuan Terbesar) adalah ...",
    kind: "choice",
    options: [
      "Faktor terbesar yang membagi semua bilangan",
      "Faktor terkecil yang membagi semua bilangan",
      "Bilangan terbesar yang dapat dibagi semua bilangan",
      "Hasil perkalian semua faktor",
    ],
    correctIndex: 0,
    discussion: [
      "FPB = Faktor Persekutuan Terbesar.",
      "Faktor: bilangan yang habis membagi.",
    ],
  },
  {
    id: "g2",
    label: "Faktorisasi prima dari 12 adalah ...",
    kind: "choice",
    options: ["2² × 3", "2 × 3²", "2 × 6", "3 × 4"],
    correctIndex: 0,
    discussion: ["12 = 2 × 2 × 3 = 2² × 3."],
  },
  {
    id: "g3",
    label: "FPB dari 12 dan 18 adalah ...",
    kind: "fill",
    answers: ["6"],
    discussion: [
      "12 = 2² × 3, 18 = 2 × 3².",
      "FPB = ambil yang sama dengan pangkat TERKECIL: 2¹ × 3¹ = 6.",
    ],
  },
  {
    id: "g4",
    label: "KPK dari 12 dan 18 adalah ...",
    kind: "fill",
    answers: ["36"],
    discussion: [
      "12 = 2² × 3, 18 = 2 × 3².",
      "KPK = ambil semua faktor dengan pangkat TERBESAR: 2² × 3² = 36.",
    ],
  },
  {
    id: "g5",
    label: "Benar atau salah: \"KPK dua bilangan selalu lebih besar atau sama dengan kedua bilangan tersebut.\"",
    kind: "truefalse",
    correct: true,
    discussion: [
      "KPK adalah kelipatan persekutuan terkecil yang TIDAK kurang dari kedua bilangan.",
      "Misal KPK 4 dan 6 = 12 (≥ 4 dan ≥ 6). Benar.",
    ],
  },
  {
    id: "g6",
    label: "Jodohkan pasangan bilangan dengan FPB-nya:",
    kind: "match",
    pairs: [
      { left: "8 dan 12", right: "4" },
      { left: "15 dan 25", right: "5" },
      { left: "16 dan 24", right: "8" },
      { left: "9 dan 14", right: "1" },
    ],
    discussion: [
      "FPB(8,12) = 4.",
      "FPB(15,25) = 5.",
      "FPB(16,24) = 8.",
      "FPB(9,14) = 1 (relatif prima).",
    ],
  },
  {
    id: "g7",
    label: "Urutkan langkah mencari KPK dari 24 dan 36 dengan faktorisasi prima:",
    kind: "sort",
    items: [
      "KPK = 2³ × 3² = 72",
      "Faktorisasi 24 = 2³ × 3",
      "Faktorisasi 36 = 2² × 3²",
      "Ambil semua faktor dengan pangkat TERBESAR",
    ],
    correctOrder: [
      "Faktorisasi 24 = 2³ × 3",
      "Faktorisasi 36 = 2² × 3²",
      "Ambil semua faktor dengan pangkat TERBESAR",
      "KPK = 2³ × 3² = 72",
    ],
    discussion: [
      "Faktorkan kedua bilangan ke prima.",
      "KPK ambil semua faktor dengan pangkat terbesar.",
      "2³ × 3² = 8 × 9 = 72.",
    ],
  },
  {
    id: "g8",
    label: "Pilih ringkasan rumus yang BENAR:",
    kind: "choice",
    options: [
      "FPB × KPK = a × b",
      "FPB + KPK = a + b",
      "FPB − KPK = a − b",
      "FPB ÷ KPK = a ÷ b",
    ],
    correctIndex: 0,
    discussion: [
      "Rumus penting: FPB(a,b) × KPK(a,b) = a × b.",
      "Berguna untuk mencari salah satu jika yang lain diketahui.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung FPB dari 36 dan 48.",
    kind: "fill",
    answers: ["12"],
    hint: "36 = 2² × 3², 48 = 2⁴ × 3. FPB = pangkat terkecil.",
    discussion: ["FPB = 2² × 3 = 12."],
  },
  {
    id: "p2",
    question: "Hitung KPK dari 36 dan 48.",
    kind: "fill",
    answers: ["144"],
    hint: "Pangkat terbesar: 2⁴ × 3².",
    discussion: ["KPK = 2⁴ × 3² = 16 × 9 = 144."],
  },
  {
    id: "p3",
    question: "Pilih KPK dari 6, 8, dan 12:",
    kind: "choice",
    options: ["24", "12", "48", "72"],
    correctIndex: 0,
    hint: "6 = 2 × 3, 8 = 2³, 12 = 2² × 3.",
    discussion: ["KPK = 2³ × 3 = 24."],
  },
  {
    id: "p4",
    question: "Benar atau salah: \"FPB(7, 11) = 1 karena 7 dan 11 adalah bilangan prima yang berbeda.\"",
    kind: "truefalse",
    correct: true,
    hint: "Dua prima berbeda hanya punya faktor 1 sebagai pembagi bersama.",
    discussion: ["7 dan 11 prima berbeda, FPB = 1. Benar."],
  },
  {
    id: "p5",
    question: "Jodohkan pasangan bilangan dengan KPK-nya:",
    kind: "match",
    pairs: [
      { left: "4 dan 6", right: "12" },
      { left: "5 dan 8", right: "40" },
      { left: "9 dan 15", right: "45" },
      { left: "10 dan 20", right: "20" },
    ],
    hint: "Cari kelipatan persekutuan terkecil.",
    discussion: ["KPK(4,6)=12.", "KPK(5,8)=40.", "KPK(9,15)=45.", "KPK(10,20)=20."],
  },
  {
    id: "p6",
    question: "Tiga lampu menyala bergantian setiap 6, 9, dan 12 detik. Setelah berapa detik ketiganya menyala bersama lagi?",
    kind: "fill",
    answers: ["36"],
    hint: "Cari KPK dari 6, 9, 12.",
    discussion: ["6 = 2 × 3, 9 = 3², 12 = 2² × 3.", "KPK = 2² × 3² = 36 detik."],
  },
  {
    id: "p7",
    question: "60 buah apel dan 84 buah jeruk dibagi rata ke beberapa anak. Berapa anak terbanyak yang dapat menerima bagian sama?",
    kind: "fill",
    answers: ["12"],
    hint: "Cari FPB dari 60 dan 84.",
    discussion: ["60 = 2² × 3 × 5, 84 = 2² × 3 × 7.", "FPB = 2² × 3 = 12 anak."],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Faktorisasi Prima",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">12 = 2 × 2 × 3 = 2² × 3</p>
        <p className="text-lg font-bold text-white">18 = 2 × 3 × 3 = 2 × 3²</p>
      </div>
    ),
    text: "Faktorisasi prima memudahkan menentukan FPB dan KPK secara sistematis.",
  },
  {
    title: "Situasi: Aturan Pengambilan",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-cyan-100">FPB → pangkat TERKECIL (faktor sama)</p>
        <p className="text-lg font-bold text-yellow-100">KPK → pangkat TERBESAR (semua faktor)</p>
      </div>
    ),
    text: "Ingat aturan ini: FPB ambil yang TERKECIL & sama, KPK ambil semua dengan TERBESAR.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "FPB", text: "Faktor sama dengan pangkat TERKECIL. Untuk membagi rata barang ke beberapa kelompok.", tone: "cyan" },
  { title: "KPK", text: "Semua faktor dengan pangkat TERBESAR. Untuk waktu kejadian berulang bersama.", tone: "yellow" },
  { title: "Hubungan", text: "FPB(a,b) × KPK(a,b) = a × b.", tone: "emerald" },
];

const KPKFPBLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="KPK dan FPB"
    intro="LKPD ini melatih Sobat Numatik mencari KPK dan FPB dengan metode faktorisasi prima dan menerapkannya pada soal cerita."
    situations={situations}
    guidedIntro="Kerjakan beragam soal berikut untuk menemukan langkah mencari FPB dan KPK."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Tentukan apakah soal meminta FPB (membagi rata) atau KPK (waktu bersama)."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-bulat"
    backLabel="Kembali ke LKPD Bilangan Bulat"
  />
);

export default KPKFPBLKPDPage;
