import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: '"5 + 3 = 8" termasuk kalimat ...',
    kind: "choice",
    options: ["Terbuka", "Tertutup benar", "Tertutup salah", "Bukan kalimat matematika"],
    correctIndex: 1,
    discussion: ["Sudah ada hasil pasti dan benar → kalimat tertutup yang BERNILAI BENAR."],
  },
  {
    id: "g2",
    label: '"7 − 2 = 9" termasuk kalimat ...',
    kind: "choice",
    options: ["Terbuka", "Tertutup benar", "Tertutup salah", "Tidak bisa ditentukan"],
    correctIndex: 2,
    discussion: ["Hasilnya pasti, tapi salah (7 − 2 = 5, bukan 9) → kalimat tertutup yang BERNILAI SALAH."],
  },
  {
    id: "g3",
    label: '"x + 3 = 10" termasuk kalimat ...',
    kind: "choice",
    options: ["Tertutup", "Terbuka", "Tidak bermakna", "Pertanyaan"],
    correctIndex: 1,
    discussion: ["Karena ada variabel x yang nilainya belum diketahui, belum bisa dibilang benar/salah → kalimat TERBUKA."],
  },
  {
    id: "g4",
    label: 'Kalimat terbuka "x + 3 = 10" menjadi BENAR jika x diganti dengan ...',
    kind: "fill",
    answers: ["7"],
    discussion: ["x + 3 = 10 → x = 10 − 3 = 7. Nilai 7 disebut PENYELESAIAN."],
  },
  {
    id: "g5",
    label: "Benar atau salah: kalimat terbuka pasti memuat variabel.",
    kind: "truefalse",
    correct: true,
    discussion: ["Tanpa variabel, semua bagian sudah pasti, sehingga benar/salahnya bisa langsung dinilai (kalimat tertutup)."],
  },
  {
    id: "g6",
    label: "Pasangkan kalimat dengan jenisnya:",
    kind: "match",
    pairs: [
      { left: "Ibukota Indonesia adalah Jakarta", right: "Tertutup BENAR" },
      { left: "2 × 5 = 11", right: "Tertutup SALAH" },
      { left: "x − 4 = 1", right: "Terbuka" },
      { left: "y + 2 < 5", right: "Pertidaksamaan terbuka" },
    ],
    discussion: ["Tertutup = sudah pasti benar/salah. Terbuka = mengandung variabel yang belum diketahui."],
  },
  {
    id: "g7",
    label: "Urutkan langkah memeriksa apakah x = 4 penyelesaian dari x + 3 = 7:",
    kind: "sort",
    items: [
      "Hasilnya benar, jadi x = 4 adalah PENYELESAIAN.",
      "Hitung 4 + 3 = 7.",
      "Substitusi x = 4 ke dalam kalimat terbuka.",
      "Bandingkan hasil dengan ruas kanan (7 = 7?).",
    ],
    correctOrder: [
      "Substitusi x = 4 ke dalam kalimat terbuka.",
      "Hitung 4 + 3 = 7.",
      "Bandingkan hasil dengan ruas kanan (7 = 7?).",
      "Hasilnya benar, jadi x = 4 adalah PENYELESAIAN.",
    ],
    discussion: ["Selalu: substitusi → hitung → bandingkan → simpulkan."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: 'Tentukan jenis kalimat: "9 + 4 = 13".',
    kind: "choice",
    options: ["Terbuka", "Tertutup benar", "Tertutup salah", "Bukan pernyataan"],
    correctIndex: 1,
    hint: "Tidak ada variabel + hasil cocok.",
    discussion: ["9 + 4 = 13 betul, tidak ada variabel → tertutup BENAR."],
  },
  {
    id: "p2",
    question: 'Kalimat "2x − 1 = 9" akan benar jika x = ...',
    kind: "fill",
    answers: ["5"],
    hint: "Tambahkan 1, lalu bagi 2.",
    discussion: ["2x − 1 = 9 → 2x = 10 → x = 5."],
  },
  {
    id: "p3",
    question: 'Manakah yang termasuk kalimat terbuka?',
    kind: "choice",
    options: ["6 + 1 = 7", "y + 4 = 12", "10 < 20", "3 × 3 = 10"],
    correctIndex: 1,
    hint: "Cari yang punya variabel.",
    discussion: ["Hanya y + 4 = 12 yang mengandung variabel."],
  },
  {
    id: "p4",
    question: 'Benar atau salah: x = 2 adalah penyelesaian dari 3x + 1 = 8.',
    kind: "truefalse",
    correct: false,
    hint: "Substitusi x = 2 dulu.",
    discussion: ["3(2) + 1 = 7, bukan 8. Jadi x = 2 BUKAN penyelesaian."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-kalimat",
    title: "🎯 Game 1: Drop Kalimat ke Kotak yang Tepat",
    description: "Tarik setiap kalimat ke kategori jenisnya.",
    buckets: [
      { id: "b1", label: "Tertutup BENAR", emoji: "✅", color: "emerald" },
      { id: "b2", label: "Tertutup SALAH", emoji: "❌", color: "rose" },
      { id: "b3", label: "Kalimat TERBUKA", emoji: "❓", color: "violet" },
    ],
    items: [
      { id: "i1", label: "12 ÷ 4 = 3", bucketId: "b1" },
      { id: "i2", label: "5 + 2 = 8", bucketId: "b2" },
      { id: "i3", label: "x + 1 = 6", bucketId: "b3" },
      { id: "i4", label: "7 × 0 = 7", bucketId: "b2" },
      { id: "i5", label: "y − 3 = 4", bucketId: "b3" },
      { id: "i6", label: "6² = 36", bucketId: "b1" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-penyelesaian",
    title: "🎮 Game 2: Cocokkan Penyelesaian",
    description: "Tekan ◀ ▶ untuk memilih nilai x yang membuat kalimat menjadi benar.",
    rightOptions: ["3", "4", "5", "6", "7"],
    pairs: [
      { id: "r1", left: "x + 2 = 5", correctRight: "3", emoji: "➕" },
      { id: "r2", left: "2x = 10", correctRight: "5", emoji: "✖️" },
      { id: "r3", left: "x − 1 = 6", correctRight: "7", emoji: "➖" },
      { id: "r4", left: "3x = 12", correctRight: "4", emoji: "🎯" },
      { id: "r5", left: "x + 4 = 10", correctRight: "6", emoji: "🧮" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Papan Tulis Bu Guru",
    visual: (
      <div className="text-center space-y-2">
        <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/15 p-3 text-emerald-100 font-display">
          ✅ "8 − 3 = 5" → BENAR
        </div>
        <div className="rounded-xl border border-rose-300/40 bg-rose-500/15 p-3 text-rose-100 font-display">
          ❌ "8 − 3 = 6" → SALAH
        </div>
        <div className="rounded-xl border border-violet-300/40 bg-violet-500/15 p-3 text-violet-100 font-display">
          ❓ "x − 3 = 5" → BELUM TAHU
        </div>
      </div>
    ),
    text: "Kalimat tertutup sudah pasti benar/salah. Kalimat terbuka masih punya variabel sehingga belum bisa ditentukan.",
  },
  {
    title: "Situasi: Mencari Nilai x",
    visual: (
      <div className="text-center">
        <div className="text-4xl mb-2">🔓 x + 4 = 9</div>
        <p className="text-sm text-white/70">Coba x = 5 → 5 + 4 = 9 ✅</p>
        <p className="font-display text-2xl font-bold text-yellow-300 mt-2">x = 5 disebut PENYELESAIAN</p>
      </div>
    ),
    text: "Penyelesaian (akar) = nilai pengganti variabel yang membuat kalimat terbuka menjadi BENAR.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Kalimat Tertutup", text: "Sudah pasti nilai benar/salahnya, tidak memuat variabel.", tone: "emerald" },
  { title: "Kalimat Terbuka", text: "Memuat variabel, belum bisa ditentukan benar/salahnya.", tone: "violet" },
  { title: "Penyelesaian", text: "Nilai pengganti variabel yang membuat kalimat terbuka jadi BENAR.", tone: "yellow" },
];

const KalimatTerbukaTertutupLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif PLSV • Kelas 7"
    title="💬 Kalimat Terbuka & Tertutup"
    intro="Temukan perbedaan kalimat tertutup yang sudah pasti benar/salah dengan kalimat terbuka yang masih menunggu nilai variabel — lengkap dengan dua mini-game seru!"
    situations={situations}
    guidedIntro="Selesaikan langkah demi langkah untuk menemukan sendiri konsep kalimat terbuka, kalimat tertutup, dan penyelesaian."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Uji pemahamanmu dengan soal-soal latihan."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke menu LKPD PLSV & PtLSV"
  />
);

export default KalimatTerbukaTertutupLKPDPage;
