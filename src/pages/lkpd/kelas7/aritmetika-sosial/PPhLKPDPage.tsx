import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "PPh (Pajak Penghasilan) adalah pajak yang DIPOTONG dari penghasilan seseorang. Jika gaji Pak Andi Rp 5.000.000 dan PPh 5%, maka besar PPh = 5% × 5.000.000 = Rp …",
    kind: "fill",
    answers: ["250000", "250.000", "Rp 250.000"],
    discussion: [
      "PPh = persen pajak × penghasilan kotor.",
      "= 5% × 5.000.000 = 0,05 × 5.000.000 = Rp 250.000.",
    ],
  },
  {
    id: "g2",
    label: "Maka gaji yang DITERIMA Pak Andi = 5.000.000 − 250.000 = Rp …",
    kind: "fill",
    answers: ["4750000", "4.750.000", "Rp 4.750.000"],
    discussion: [
      "Penghasilan bersih = penghasilan kotor − PPh.",
      "= 5.000.000 − 250.000 = Rp 4.750.000.",
    ],
  },
  {
    id: "g3",
    label: "PPh MENGURANGI penghasilan, sedangkan PPN …",
    kind: "choice",
    options: ["Mengurangi penghasilan", "Menambah harga jual", "Sama saja", "Tidak ada hubungannya"],
    correctIndex: 1,
    discussion: [
      "PPh: mengurangi penghasilan kita.",
      "PPN: menambah harga yang harus dibayar saat membeli.",
    ],
  },
  {
    id: "g4",
    label: "Cara cepat: penghasilan bersih = (100% − % PPh) × penghasilan kotor. Dengan PPh 5%, faktor pengalinya adalah …",
    kind: "choice",
    options: ["0,05", "0,5", "0,95", "1,05"],
    correctIndex: 2,
    discussion: [
      "100% − 5% = 95% = 0,95.",
      "Jadi penghasilan bersih = 0,95 × penghasilan kotor.",
    ],
  },
  {
    id: "g5",
    label: "Pasangkan istilah dengan rumus / artinya.",
    kind: "match",
    pairs: [
      { left: "Penghasilan kotor", right: "Gaji sebelum dipotong pajak" },
      { left: "Penghasilan bersih", right: "Gaji yang diterima setelah dipotong pajak" },
      { left: "Besar PPh", right: "% PPh × penghasilan kotor" },
      { left: "Cara cepat netto", right: "(100% − % PPh) × penghasilan kotor" },
    ],
    discussion: [
      "PPh dihitung dari penghasilan kotor.",
      "Penghasilan bersih = penghasilan kotor − PPh.",
    ],
  },
  {
    id: "g6",
    label: "Gaji Bu Sari Rp 8.000.000, PPh 10%. Penghasilan bersihnya = (100% − 10%) × 8.000.000 = Rp …",
    kind: "fill",
    answers: ["7200000", "7.200.000", "Rp 7.200.000"],
    discussion: ["0,9 × 8.000.000 = Rp 7.200.000."],
  },
  {
    id: "g7",
    label: "Benar atau salah: PPh 0% berarti penghasilan bersih = penghasilan kotor.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Jika PPh 0%, tidak ada potongan, jadi yang diterima = yang dihasilkan.",
      "Pernyataan BENAR.",
    ],
  },
  {
    id: "g8",
    label: "Urutkan langkah baku menyelesaikan soal PPh:",
    kind: "sort",
    items: [
      "Tulis berapa rupiah penghasilan bersih.",
      "Tentukan penghasilan kotor dan persen PPh.",
      "Hitung penghasilan bersih = penghasilan kotor − PPh.",
      "Hitung besar PPh = % PPh × penghasilan kotor.",
    ],
    correctOrder: [
      "Tentukan penghasilan kotor dan persen PPh.",
      "Hitung besar PPh = % PPh × penghasilan kotor.",
      "Hitung penghasilan bersih = penghasilan kotor − PPh.",
      "Tulis berapa rupiah penghasilan bersih.",
    ],
    discussion: [
      "Langkah baku: catat data → hitung PPh → kurangkan dari kotor → tulis kesimpulan.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Pak Hadi bergaji Rp 6.000.000/bulan. Dipotong PPh 5%. Berapa besar PPh-nya?",
    kind: "fill",
    answers: ["300000", "300.000", "Rp 300.000"],
    hint: "PPh = 5% × 6.000.000.",
    discussion: ["PPh = 0,05 × 6.000.000 = Rp 300.000."],
  },
  {
    id: "p2",
    question: "Bu Lina bergaji Rp 10.000.000 dan dipotong PPh 15%. Berapa gaji bersih yang diterima?",
    kind: "choice",
    options: ["Rp 1.500.000", "Rp 8.000.000", "Rp 8.500.000", "Rp 9.500.000"],
    correctIndex: 2,
    hint: "Bersih = (100% − 15%) × 10.000.000.",
    discussion: ["0,85 × 10.000.000 = Rp 8.500.000."],
  },
  {
    id: "p3",
    question: "Setelah dipotong PPh 5%, gaji yang diterima Pak Toni Rp 4.750.000. Berapa gaji kotornya?",
    kind: "fill",
    answers: ["5000000", "5.000.000", "Rp 5.000.000"],
    hint: "Bersih = 95% × kotor → kotor = bersih / 0,95.",
    discussion: ["Kotor = 4.750.000 / 0,95 = Rp 5.000.000."],
  },
  {
    id: "p4",
    question: "Benar atau salah: Jika PPh 10%, untuk mendapat gaji bersih Rp 9.000.000 dibutuhkan gaji kotor Rp 10.000.000.",
    kind: "truefalse",
    correct: true,
    hint: "Bersih = 0,9 × kotor → 9.000.000 = 0,9 × kotor.",
    discussion: ["0,9 × 10.000.000 = 9.000.000. Pernyataan BENAR."],
  },
  {
    id: "p5",
    question: "Penghasilan Pak Doni Rp 8.000.000/bulan. Setelah dipotong PPh, ia menerima Rp 7.600.000. Berapa persen PPh yang dikenakan?",
    kind: "fill",
    answers: ["5", "5%"],
    hint: "PPh = 8.000.000 − 7.600.000 = 400.000. % PPh = (400.000 / 8.000.000) × 100%.",
    discussion: [
      "PPh = 8.000.000 − 7.600.000 = 400.000.",
      "% PPh = (400.000 / 8.000.000) × 100% = 5%.",
    ],
  },
  {
    id: "p6",
    question: "Penghasilan Rp 12.000.000/bulan, PPh 15%. Total PPh dalam 1 tahun (12 bulan) adalah …",
    kind: "fill",
    answers: ["21600000", "21.600.000", "Rp 21.600.000"],
    hint: "PPh per bulan dulu, lalu kalikan 12.",
    discussion: [
      "PPh/bulan = 0,15 × 12.000.000 = 1.800.000.",
      "PPh setahun = 12 × 1.800.000 = Rp 21.600.000.",
    ],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-ppn-vs-pph",
    title: "💼 Game 1: PPN atau PPh?",
    description: "Tarik setiap kartu kejadian ke kategori yang tepat: PPN (menambah harga beli) atau PPh (memotong gaji).",
    buckets: [
      { id: "ppn", label: "PPN (Menambah Harga)", emoji: "🧾", color: "amber" },
      { id: "pph", label: "PPh (Memotong Gaji)", emoji: "💼", color: "violet" },
    ],
    items: [
      { id: "i1", label: "Beli HP, harga ditambah pajak 11%", bucketId: "ppn" },
      { id: "i2", label: "Gaji bulanan dipotong 5%", bucketId: "pph" },
      { id: "i3", label: "Honor ngajar dipotong 2%", bucketId: "pph" },
      { id: "i4", label: "Beli laptop, harga + 11%", bucketId: "ppn" },
      { id: "i5", label: "Beli baju, struk: PPN 11%", bucketId: "ppn" },
      { id: "i6", label: "Slip gaji: potongan pajak 10%", bucketId: "pph" },
      { id: "i7", label: "Bonus tahunan dipotong 5%", bucketId: "pph" },
      { id: "i8", label: "Tagihan restoran + pajak 10%", bucketId: "ppn" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-pph-bersih",
    title: "🎮 Game 2: Hitung Gaji Bersih (Setelah PPh)",
    description: "Tekan ◀ ▶ pilih GAJI BERSIH yang benar setelah dipotong PPh.",
    rightOptions: ["Rp 950.000", "Rp 1.900.000", "Rp 2.850.000", "Rp 4.750.000", "Rp 7.600.000", "Rp 9.000.000"],
    pairs: [
      { id: "r1", left: "Gaji 1jt, PPh 5%", correctRight: "Rp 950.000", emoji: "💵" },
      { id: "r2", left: "Gaji 2jt, PPh 5%", correctRight: "Rp 1.900.000", emoji: "💸" },
      { id: "r3", left: "Gaji 5jt, PPh 5%", correctRight: "Rp 4.750.000", emoji: "🏦" },
      { id: "r4", left: "Gaji 8jt, PPh 5%", correctRight: "Rp 7.600.000", emoji: "📃" },
      { id: "r5", left: "Gaji 10jt, PPh 10%", correctRight: "Rp 9.000.000", emoji: "💼" },
    ],
  },
  {
    kind: "page-link",
    id: "game-arena-pph",
    title: "🚀 Game 3: Math Game Arena – PPh",
    description: "Lanjutkan permainan PPh dengan tantangan layar penuh di Math Game Arena!",
    path: "/math-game-arena/kelas-7/aritmetika-sosial/pph",
    buttonLabel: "MAINKAN DI MATH GAME ARENA",
    emoji: "💼",
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi 1: Slip Gaji Pak Andi 💼",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">💼</p>
        <p className="text-lg font-bold text-white">Gaji kotor: Rp 5.000.000</p>
        <p className="text-lg font-bold text-rose-300">PPh 5% = Rp 250.000</p>
        <p className="text-lg font-bold text-emerald-300">Diterima: Rp 4.750.000</p>
      </div>
    ),
    text: "PPh DIPOTONG dari gaji. Penghasilan bersih = gaji − PPh.",
  },
  {
    title: "Situasi 2: Bedakan PPN vs PPh ⚖️",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🧾 vs 💼</p>
        <p className="text-base font-bold text-yellow-300">PPN: dibayar saat MEMBELI</p>
        <p className="text-base font-bold text-violet-300">PPh: dipotong saat MENERIMA gaji</p>
        <p className="text-sm text-white/80 mt-2">PPN menambah, PPh mengurangi.</p>
      </div>
    ),
    text: "Pahami perbedaannya: PPN menambah harga beli, PPh memotong penghasilan.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Besar PPh", text: "PPh = % PPh × penghasilan kotor.", tone: "violet" },
  { title: "Penghasilan Bersih", text: "Bersih = Kotor − PPh = (100% − % PPh) × Kotor.", tone: "emerald" },
  { title: "PPN vs PPh", text: "PPN menambah pembayaran. PPh mengurangi penghasilan.", tone: "yellow" },
];

const PPhLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aritmetika Sosial • Kelas 7"
    title="💼 Pajak Penghasilan (PPh)"
    intro="Yuk temukan rumus PPh dan belajar membedakannya dengan PPN melalui aktivitas terbimbing dan tiga mini-game keuangan!"
    situations={situations}
    guidedIntro="Selesaikan pertanyaan berikut untuk menemukan rumus PPh dan cara cepatnya."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Saatnya berlatih dengan berbagai jenis soal PPh di kehidupan nyata."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke menu LKPD Aritmetika Sosial"
  />
);

export default PPhLKPDPage;
