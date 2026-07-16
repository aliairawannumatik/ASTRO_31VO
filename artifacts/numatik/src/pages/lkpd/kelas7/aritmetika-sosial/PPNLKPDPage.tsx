import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "PPN (Pajak Pertambahan Nilai) adalah pajak yang DITAMBAHKAN pada harga jual barang/jasa. Jika harga laptop Rp 5.000.000 dan PPN 11%, maka besar PPN = 11% × 5.000.000 = Rp …",
    kind: "fill",
    answers: ["550000", "550.000", "Rp 550.000"],
    discussion: [
      "PPN = persen PPN × harga sebelum pajak.",
      "= 11% × 5.000.000 = 0,11 × 5.000.000 = Rp 550.000.",
    ],
  },
  {
    id: "g2",
    label: "Harga yang harus dibayar pembeli = harga + PPN = 5.000.000 + 550.000 = Rp …",
    kind: "fill",
    answers: ["5550000", "5.550.000", "Rp 5.550.000"],
    discussion: [
      "Harga bayar = harga awal + PPN.",
      "= 5.000.000 + 550.000 = Rp 5.550.000.",
    ],
  },
  {
    id: "g3",
    label: "PPN MENAMBAH harga jual, sedangkan DISKON …",
    kind: "choice",
    options: ["Juga menambah harga", "Mengurangi harga", "Tidak berpengaruh", "Hanya untuk barang mahal"],
    correctIndex: 1,
    discussion: [
      "PPN → menambah pembayaran. Diskon → mengurangi pembayaran.",
      "Itulah perbedaan utama PPN dan diskon.",
    ],
  },
  {
    id: "g4",
    label: "Cara cepat: harga termasuk PPN = (100% + %PPN) × harga awal. Dengan PPN 11%, faktornya adalah …",
    kind: "choice",
    options: ["0,11", "0,89", "1,11", "1,89"],
    correctIndex: 2,
    discussion: [
      "100% + 11% = 111% = 1,11.",
      "Jadi harga termasuk PPN = 1,11 × harga awal.",
    ],
  },
  {
    id: "g5",
    label: "Pasangkan setiap istilah dengan rumusnya.",
    kind: "match",
    pairs: [
      { left: "Besar PPN", right: "% PPN × harga awal" },
      { left: "Harga termasuk PPN", right: "harga awal + PPN" },
      { left: "Cara cepat", right: "(100% + %PPN) × harga awal" },
      { left: "Harga awal (jika diketahui harga + PPN)", right: "harga akhir / (100% + %PPN)" },
    ],
    discussion: [
      "PPN selalu DITAMBAHKAN ke harga awal.",
      "Cara cepat memakai faktor (100% + %PPN).",
    ],
  },
  {
    id: "g6",
    label: "Sebuah HP berharga Rp 3.000.000, dikenakan PPN 11%. Cara cepat: harga bayar = 1,11 × 3.000.000 = Rp …",
    kind: "fill",
    answers: ["3330000", "3.330.000", "Rp 3.330.000"],
    discussion: ["1,11 × 3.000.000 = Rp 3.330.000."],
  },
  {
    id: "g7",
    label: "Benar atau salah: Diskon 11% LALU PPN 11% sama saja dengan harga awal.",
    kind: "truefalse",
    correct: false,
    hint: "Hitung berurutan: 0,89 × 1,11 = 0,9879 ≠ 1.",
    discussion: [
      "Diskon 11% → 89%. Lalu × (100% + 11%) = 89% × 111% = 98,79%.",
      "Hasilnya bukan 100%, jadi pernyataan SALAH.",
    ],
  },
  {
    id: "g8",
    label: "Urutkan langkah baku menyelesaikan soal PPN:",
    kind: "sort",
    items: [
      "Tulis total yang harus dibayar.",
      "Tentukan harga awal dan persen PPN.",
      "Hitung besar PPN = % PPN × harga awal.",
      "Hitung harga bayar = harga awal + PPN.",
    ],
    correctOrder: [
      "Tentukan harga awal dan persen PPN.",
      "Hitung besar PPN = % PPN × harga awal.",
      "Hitung harga bayar = harga awal + PPN.",
      "Tulis total yang harus dibayar.",
    ],
    discussion: [
      "Langkah baku: catat data → hitung PPN → tambahkan ke harga awal → tulis kesimpulan.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Sebuah TV seharga Rp 4.000.000 dikenakan PPN 11%. Berapa rupiah PPN-nya?",
    kind: "fill",
    answers: ["440000", "440.000", "Rp 440.000"],
    hint: "PPN = 11% × 4.000.000.",
    discussion: ["PPN = 0,11 × 4.000.000 = Rp 440.000."],
  },
  {
    id: "p2",
    question: "Sebuah laptop seharga Rp 6.000.000 dikenakan PPN 11%. Berapa total yang harus dibayar?",
    kind: "choice",
    options: ["Rp 5.340.000", "Rp 6.110.000", "Rp 6.660.000", "Rp 6.700.000"],
    correctIndex: 2,
    hint: "Total = (100% + 11%) × 6.000.000 = 1,11 × 6.000.000.",
    discussion: ["1,11 × 6.000.000 = Rp 6.660.000."],
  },
  {
    id: "p3",
    question: "Sebuah barang dijual termasuk PPN 11% seharga Rp 1.110.000. Berapa harga sebelum PPN?",
    kind: "fill",
    answers: ["1000000", "1.000.000", "Rp 1.000.000"],
    hint: "Harga awal = harga akhir / 1,11.",
    discussion: ["1.110.000 / 1,11 = 1.000.000. Jadi harga awal = Rp 1.000.000."],
  },
  {
    id: "p4",
    question: "Benar atau salah: Jika harga awal Rp X dan PPN 10%, total bayar = 1,1 × X.",
    kind: "truefalse",
    correct: true,
    hint: "100% + 10% = 110% = 1,1.",
    discussion: ["Total = (100% + %PPN) × harga awal = 1,1 × X. Pernyataan BENAR."],
  },
  {
    id: "p5",
    question: "Sebuah kulkas seharga Rp 5.000.000 mendapat diskon 10% LALU dikenakan PPN 11%. Berapa total yang dibayar?",
    kind: "fill",
    answers: ["4995000", "4.995.000", "Rp 4.995.000"],
    hint: "Hitung dulu setelah diskon, baru kalikan 1,11.",
    discussion: [
      "Setelah diskon = 0,9 × 5.000.000 = 4.500.000.",
      "Total dengan PPN = 1,11 × 4.500.000 = Rp 4.995.000.",
    ],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-ppn-vs-diskon",
    title: "🧾 Game 1: PPN atau Diskon?",
    description: "Tarik setiap kartu skenario ke kotak yang tepat: MENAMBAH harga (PPN) atau MENGURANGI harga (Diskon).",
    buckets: [
      { id: "ppn", label: "PPN (Menambah Harga)", emoji: "➕", color: "rose" },
      { id: "diskon", label: "DISKON (Mengurangi Harga)", emoji: "➖", color: "emerald" },
    ],
    items: [
      { id: "i1", label: "Pajak 11% di restoran", bucketId: "ppn" },
      { id: "i2", label: "Potongan akhir tahun 30%", bucketId: "diskon" },
      { id: "i3", label: "Pajak penjualan 10%", bucketId: "ppn" },
      { id: "i4", label: "Promo cuci gudang 50%", bucketId: "diskon" },
      { id: "i5", label: "Tambahan PPN 11%", bucketId: "ppn" },
      { id: "i6", label: "Cashback 20% dari harga", bucketId: "diskon" },
      { id: "i7", label: "Member discount 15%", bucketId: "diskon" },
      { id: "i8", label: "PPN Barang Mewah 11%", bucketId: "ppn" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-total-ppn",
    title: "🎮 Game 2: Berapa Total Bayar Termasuk PPN 11%?",
    description: "Tekan ◀ ▶ pilih total bayar yang benar setelah ditambahkan PPN 11%.",
    rightOptions: ["Rp 111.000", "Rp 222.000", "Rp 555.000", "Rp 1.110.000", "Rp 2.220.000", "Rp 5.550.000"],
    pairs: [
      { id: "r1", left: "Rp 100.000 + PPN 11%", correctRight: "Rp 111.000", emoji: "🛒" },
      { id: "r2", left: "Rp 200.000 + PPN 11%", correctRight: "Rp 222.000", emoji: "👕" },
      { id: "r3", left: "Rp 500.000 + PPN 11%", correctRight: "Rp 555.000", emoji: "👟" },
      { id: "r4", left: "Rp 1.000.000 + PPN 11%", correctRight: "Rp 1.110.000", emoji: "📺" },
      { id: "r5", left: "Rp 5.000.000 + PPN 11%", correctRight: "Rp 5.550.000", emoji: "💻" },
    ],
  },
  {
    kind: "page-link",
    id: "game-arena-ppn",
    title: "🚀 Game 3: Math Game Arena – PPN",
    description: "Tantang dirimu dalam permainan PPN layar penuh di Math Game Arena!",
    path: "/math-game-arena/kelas-7/aritmetika-sosial/ppn",
    buttonLabel: "MAINKAN DI MATH GAME ARENA",
    emoji: "🧾",
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi 1: Beli Laptop di Toko 💻",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">💻</p>
        <p className="text-lg font-bold text-white">Harga: Rp 5.000.000</p>
        <p className="text-lg font-bold text-rose-300">PPN 11% = Rp 550.000</p>
        <p className="text-lg font-bold text-yellow-300">Total bayar = Rp 5.550.000</p>
      </div>
    ),
    text: "PPN selalu DITAMBAHKAN pada harga awal. Total bayar = harga + PPN.",
  },
  {
    title: "Situasi 2: Cara Cepat dengan Faktor 1,11 ⚡",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">⚡</p>
        <p className="text-lg font-bold text-white">Harga: Rp 2.000.000</p>
        <p className="text-lg font-bold text-yellow-300">× 1,11 (100% + 11%)</p>
        <p className="text-lg font-bold text-emerald-300">= Rp 2.220.000</p>
      </div>
    ),
    text: "Cara cepat: total = (100% + %PPN) × harga awal. Untuk PPN 11% kalikan 1,11.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Besar PPN", text: "PPN = % PPN × harga awal.", tone: "rose" },
  { title: "Harga Bayar", text: "Total = harga awal + PPN = (100% + %PPN) × harga awal.", tone: "yellow" },
  { title: "PPN vs Diskon", text: "PPN MENAMBAH harga, Diskon MENGURANGI harga.", tone: "violet" },
];

const PPNLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aritmetika Sosial • Kelas 7"
    title="🧾 Pajak Pertambahan Nilai (PPN)"
    intro="Bersama Sobat Numatik, kita akan menemukan rumus PPN dan membedakannya dengan diskon, lalu memantapkan pemahaman lewat permainan kasir!"
    situations={situations}
    guidedIntro="Lengkapi pertanyaan berikut agar kamu menemukan sendiri rumus dan cara cepat menghitung PPN."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Selesaikan soal-soal berikut menggunakan rumus PPN yang sudah kamu temukan."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke menu LKPD Aritmetika Sosial"
  />
);

export default PPNLKPDPage;
