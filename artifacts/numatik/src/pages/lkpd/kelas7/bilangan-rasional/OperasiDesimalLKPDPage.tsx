import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Hasil dari 0,3 + 0,45 = ...",
    kind: "fill",
    answers: ["0.75", "0,75"],
    discussion: [
      "Sejajarkan tanda koma:",
      "0,30 + 0,45 = 0,75.",
    ],
  },
  {
    id: "g2",
    label: "Hasil dari 1,25 - 0,4 = ...",
    kind: "choice",
    options: ["0,85", "0,79", "1,21", "0,21"],
    correctIndex: 0,
    discussion: [
      "Sejajarkan koma: 1,25 - 0,40 = 0,85.",
    ],
  },
  {
    id: "g3",
    label: "Aturan menjumlah/mengurangkan desimal: ... tanda koma.",
    kind: "choice",
    options: ["Geser ke kanan", "Hapus dulu", "Sejajarkan", "Tukar dengan titik"],
    correctIndex: 2,
    discussion: [
      "Aturan: SEJAJARKAN tanda koma sebelum menjumlah/mengurang.",
    ],
  },
  {
    id: "g4",
    label: "Hasil dari 0,2 × 0,3 = ...",
    kind: "fill",
    answers: ["0.06", "0,06"],
    discussion: [
      "Abaikan koma: 2 × 3 = 6.",
      "Jumlah angka di belakang koma kedua bilangan = 1 + 1 = 2.",
      "Jadi hasilnya 0,06.",
    ],
  },
  {
    id: "g5",
    label: "Aturan perkalian desimal: jumlah angka di belakang koma pada hasil = ...",
    kind: "choice",
    options: [
      "selisih angka di belakang koma kedua bilangan",
      "JUMLAH angka di belakang koma kedua bilangan",
      "selalu 2",
      "sama dengan bilangan terbesar",
    ],
    correctIndex: 1,
    discussion: [
      "Jumlah desimal hasil = jumlah desimal kedua faktor.",
      "Contoh: 0,2 (1 desimal) × 0,03 (2 desimal) = 0,006 (3 desimal).",
    ],
  },
  {
    id: "g6",
    label: "Hasil dari 0,8 ÷ 0,2 = ...",
    kind: "fill",
    answers: ["4"],
    discussion: [
      "Geser kedua koma ke kanan supaya pembagi jadi bilangan bulat:",
      "0,8 ÷ 0,2 = 8 ÷ 2 = 4.",
    ],
  },
  {
    id: "g7",
    label: "Jodohkan operasi dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "0,5 + 0,25", right: "0,75" },
      { left: "1 - 0,4", right: "0,6" },
      { left: "0,4 × 0,5", right: "0,2" },
      { left: "1,2 ÷ 0,3", right: "4" },
    ],
    discussion: [
      "0,5 + 0,25 = 0,75.",
      "1 - 0,4 = 0,6.",
      "0,4 × 0,5 = 0,20 = 0,2.",
      "1,2 ÷ 0,3 = 12 ÷ 3 = 4.",
    ],
  },
  {
    id: "g8",
    label: "Bulatkan 3,478 ke satu tempat desimal:",
    kind: "choice",
    options: ["3,4", "3,5", "3,47", "3,48"],
    correctIndex: 1,
    discussion: [
      "Lihat angka kedua di belakang koma (7).",
      "7 ≥ 5 → bulatkan ke atas.",
      "Jadi 3,478 ≈ 3,5.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung: 2,75 + 1,3",
    kind: "fill",
    answers: ["4.05", "4,05"],
    hint: "Sejajarkan koma: 2,75 + 1,30.",
    discussion: ["2,75 + 1,30 = 4,05."],
  },
  {
    id: "p2",
    question: "Hitung: 5,2 - 1,75",
    kind: "fill",
    answers: ["3.45", "3,45"],
    hint: "5,20 - 1,75.",
    discussion: ["5,20 - 1,75 = 3,45."],
  },
  {
    id: "p3",
    question: "Hitung: 0,6 × 0,4",
    kind: "choice",
    options: ["0,24", "2,4", "0,1", "0,024"],
    correctIndex: 0,
    hint: "6 × 4 = 24, lalu hitung total angka di belakang koma.",
    discussion: ["6 × 4 = 24. Total 2 angka belakang koma → 0,24."],
  },
  {
    id: "p4",
    question: "Hitung: 1,5 ÷ 0,5",
    kind: "fill",
    answers: ["3"],
    hint: "Geser koma kanan: 15 ÷ 5.",
    discussion: ["1,5 ÷ 0,5 = 15 ÷ 5 = 3."],
  },
  {
    id: "p5",
    question: "Benar atau salah: \"0,3 × 10 = 0,30\".",
    kind: "truefalse",
    correct: false,
    hint: "Mengalikan dengan 10 = geser koma 1 langkah ke kanan.",
    discussion: ["0,3 × 10 = 3, bukan 0,30. SALAH."],
  },
  {
    id: "p6",
    question: "Bulatkan 12,367 ke dua tempat desimal:",
    kind: "choice",
    options: ["12,36", "12,37", "12,40", "12,30"],
    correctIndex: 1,
    hint: "Lihat angka ketiga di belakang koma.",
    discussion: ["Angka ke-3 = 7 ≥ 5 → bulatkan ke atas: 12,37."],
  },
  {
    id: "p7",
    question: "Andi membeli 3 buku seharga Rp 12.500,75 per buku. Total bayar yang DIBULATKAN ke ratusan terdekat (rupiah)?",
    kind: "choice",
    options: ["Rp 37.500", "Rp 37.502", "Rp 37.503", "Rp 37.501"],
    correctIndex: 0,
    hint: "Hitung 3 × 12.500,75 dulu, lalu bulatkan.",
    discussion: [
      "3 × 12.500,75 = 37.502,25.",
      "Bulatkan ke ratusan terdekat: 37.502,25 ≈ 37.500.",
    ],
  },
  {
    id: "p8",
    question: "Jodohkan operasi desimal berikut dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "2,5 + 0,75", right: "3,25" },
      { left: "4 - 1,6", right: "2,4" },
      { left: "0,5 × 0,2", right: "0,1" },
      { left: "2,4 ÷ 0,6", right: "4" },
    ],
    hint: "Selesaikan satu per satu memakai aturan masing-masing operasi.",
    discussion: [
      "2,5 + 0,75 = 3,25.",
      "4 - 1,6 = 2,4.",
      "0,5 × 0,2 = 0,10 = 0,1.",
      "2,4 ÷ 0,6 = 24 ÷ 6 = 4.",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Belanjaan Sobat",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-4xl">🛒💵</p>
        <p className="text-base font-bold text-white">12,5 + 7,75 = 20,25</p>
        <p className="text-xs text-white/65">Sejajarkan tanda koma!</p>
      </div>
    ),
    text: "Penjumlahan & pengurangan desimal: SEJAJARKAN tanda koma, lalu hitung seperti bilangan bulat.",
  },
  {
    title: "Situasi: Hitung Cepat × ÷",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">⚡✖️➗</p>
        <p className="text-base font-bold text-white">0,2 × 0,3 = 0,06</p>
        <p className="text-xs text-white/65">Jumlah angka koma = total angka koma faktor</p>
      </div>
    ),
    text: "Perkalian: kalikan tanpa koma, lalu pasang koma sesuai jumlah desimal kedua faktor. Pembagian: geser koma keduanya hingga pembagi jadi bulat.",
  },
  {
    title: "Situasi: Pembulatan",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🎯</p>
        <p className="text-base font-bold text-white">3,478 ≈ 3,5</p>
        <p className="text-xs text-white/65">Aturan: ≥ 5 → bulatkan naik</p>
      </div>
    ),
    text: "Pembulatan: lihat angka SETELAH posisi yang dituju. Jika ≥ 5, bulatkan naik. Jika &lt; 5, dibulatkan turun.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Tambah/Kurang", text: "Sejajarkan tanda koma. Tambahkan nol di belakang jika perlu.", tone: "cyan" },
  { title: "Perkalian", text: "Kalikan tanpa koma. Jumlah angka di belakang koma hasil = jumlah angka di belakang koma kedua faktor.", tone: "yellow" },
  { title: "Pembagian", text: "Geser koma kedua bilangan hingga pembagi jadi bulat, lalu bagi seperti biasa.", tone: "emerald" },
  { title: "Pembulatan", text: "Angka berikutnya ≥ 5 → naik. < 5 → tetap. Mengali/membagi dengan 10, 100, 1000 = geser koma.", tone: "violet" },
];

const OperasiDesimalLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Pecahan • Kelas 7"
    title="🧮 Operasi Bentuk Desimal"
    intro="LKPD seru ini melatih Sobat Numatik menjumlah, mengurang, mengali, membagi, hingga membulatkan bilangan desimal!"
    situations={situations}
    guidedIntro="Aktivitas terbimbing: kuasai aturan operasi pada bilangan desimal."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Saatnya latihan! Selesaikan soal-soal berikut dengan teliti."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-rasional"
    backLabel="Kembali ke LKPD Pecahan"
  />
);

export default OperasiDesimalLKPDPage;
