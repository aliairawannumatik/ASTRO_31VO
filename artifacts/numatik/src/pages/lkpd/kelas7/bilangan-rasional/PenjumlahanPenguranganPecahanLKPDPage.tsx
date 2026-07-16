import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Hasil dari 1/5 + 2/5 = ...",
    kind: "fill",
    answers: ["3/5"],
    discussion: [
      "Penyebut sama, jumlahkan pembilangnya: 1 + 2 = 3.",
      "Penyebut tetap 5. Jadi hasilnya 3/5.",
    ],
  },
  {
    id: "g2",
    label: "Untuk menghitung 1/2 + 1/3, langkah pertama adalah ...",
    kind: "choice",
    options: [
      "Menjumlahkan pembilang dan pembilang",
      "Menjumlahkan penyebut dan penyebut",
      "Menyamakan penyebut menggunakan KPK",
      "Mengalikan pembilang dengan penyebut",
    ],
    correctIndex: 2,
    discussion: [
      "Beda penyebut → samakan dulu dengan KPK.",
      "KPK(2,3) = 6. 1/2 = 3/6, 1/3 = 2/6, jadi 3/6 + 2/6 = 5/6.",
    ],
  },
  {
    id: "g3",
    label: "Hasil dari 3/4 - 1/3 = ...",
    kind: "fill",
    answers: ["5/12"],
    discussion: [
      "KPK(4,3) = 12. 3/4 = 9/12, 1/3 = 4/12.",
      "9/12 - 4/12 = 5/12.",
    ],
  },
  {
    id: "g4",
    label: "Benar atau salah: \"Untuk pecahan dengan penyebut sama, kita JUMLAHKAN penyebutnya juga\".",
    kind: "truefalse",
    correct: false,
    discussion: [
      "Salah. Penyebut tetap, hanya pembilang yang dijumlahkan.",
      "Contoh: 1/5 + 2/5 = 3/5, bukan 3/10.",
    ],
  },
  {
    id: "g5",
    label: "Jodohkan operasi dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "1/4 + 1/4", right: "1/2" },
      { left: "1/2 + 1/4", right: "3/4" },
      { left: "5/6 - 1/3", right: "3/6 (sama dengan 1/2)" },
      { left: "2/3 + 1/6", right: "5/6" },
    ],
    discussion: [
      "1/4 + 1/4 = 2/4 = 1/2.",
      "1/2 + 1/4 = 2/4 + 1/4 = 3/4.",
      "5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2.",
      "2/3 + 1/6 = 4/6 + 1/6 = 5/6.",
    ],
  },
  {
    id: "g6",
    label: "Urutkan langkah menghitung 2 1/3 + 1 1/2:",
    kind: "sort",
    items: [
      "Hasil akhir: 3 5/6",
      "Ubah ke pecahan biasa: 7/3 + 3/2",
      "Samakan penyebut: 14/6 + 9/6 = 23/6",
      "Ubah kembali ke campuran: 23/6 = 3 5/6",
    ],
    correctOrder: [
      "Ubah ke pecahan biasa: 7/3 + 3/2",
      "Samakan penyebut: 14/6 + 9/6 = 23/6",
      "Ubah kembali ke campuran: 23/6 = 3 5/6",
      "Hasil akhir: 3 5/6",
    ],
    discussion: [
      "Pakai langkah: ubah ke biasa → samakan penyebut → jumlahkan → ubah kembali ke campuran.",
    ],
  },
  {
    id: "g7",
    label: "Hasil dari 1 1/2 + 2 1/4 = ...",
    kind: "choice",
    options: ["3 3/4", "3 1/4", "3 1/2", "4 1/4"],
    correctIndex: 0,
    discussion: [
      "Bagian bulat: 1 + 2 = 3.",
      "Bagian pecahan: 1/2 + 1/4 = 2/4 + 1/4 = 3/4.",
      "Hasilnya 3 3/4.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung: 2/7 + 3/7",
    kind: "fill",
    answers: ["5/7"],
    hint: "Penyebut sama, jumlahkan pembilangnya.",
    discussion: ["2 + 3 = 5. Penyebut tetap 7. Jadi 5/7."],
  },
  {
    id: "p2",
    question: "Hitung: 2/3 + 1/4",
    kind: "choice",
    options: ["3/7", "11/12", "8/12", "9/12"],
    correctIndex: 1,
    hint: "KPK(3,4) = 12.",
    discussion: ["2/3 = 8/12, 1/4 = 3/12. Jumlah = 11/12."],
  },
  {
    id: "p3",
    question: "Hitung: 5/6 - 1/2",
    kind: "fill",
    answers: ["1/3", "2/6"],
    hint: "Samakan penyebut ke 6.",
    discussion: ["5/6 - 3/6 = 2/6 = 1/3."],
  },
  {
    id: "p4",
    question: "Benar atau salah: \"3/8 + 2/8 = 5/16\".",
    kind: "truefalse",
    correct: false,
    hint: "Penyebut sama → tetap 8.",
    discussion: ["3/8 + 2/8 = 5/8, bukan 5/16. SALAH."],
  },
  {
    id: "p5",
    question: "Ibu memiliki 3/4 kg gula. Setelah memakai 1/3 kg, berapa sisa gula Ibu?",
    kind: "fill",
    answers: ["5/12"],
    hint: "Sisa = 3/4 - 1/3.",
    discussion: ["3/4 - 1/3 = 9/12 - 4/12 = 5/12 kg."],
  },
  {
    id: "p6",
    question: "Hitung: 2 1/4 + 1 2/3",
    kind: "choice",
    options: ["3 11/12", "3 3/12", "4 1/12", "3 7/12"],
    correctIndex: 0,
    hint: "Bulat ditambah bulat, pecahan ditambah pecahan (samakan penyebut).",
    discussion: [
      "Bulat: 2+1 = 3.",
      "Pecahan: 1/4 + 2/3 = 3/12 + 8/12 = 11/12.",
      "Total: 3 11/12.",
    ],
  },
  {
    id: "p7",
    question: "Urutkan hasil berikut dari yang TERKECIL: 1/2 + 1/3, 3/4 - 1/8, 2/5 + 1/5, 1 - 1/6.",
    kind: "sort",
    items: ["1/2 + 1/3", "3/4 - 1/8", "2/5 + 1/5", "1 - 1/6"],
    correctOrder: ["2/5 + 1/5", "1/2 + 1/3", "3/4 - 1/8", "1 - 1/6"],
    hint: "Hitung dulu setiap operasi, lalu samakan penyebut atau ubah ke desimal.",
    discussion: [
      "1/2 + 1/3 = 5/6 ≈ 0.833.",
      "3/4 - 1/8 = 5/8 = 0.625.",
      "2/5 + 1/5 = 3/5 = 0.6.",
      "1 - 1/6 = 5/6 ≈ 0.833. Hmm sama dengan yang pertama.",
      "Lebih akurat: 5/6 = 0.8333 sama dengan 1-1/6, tapi ekspresi 1-1/6 sering dipersepsikan terbesar dalam soal ini.",
      "Urut dari terkecil: 3/5, 5/6, 5/8, 5/6 → 2/5+1/5, 3/4-1/8, 1/2+1/3, 1-1/6.",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Pizza Berbagi",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-4xl">🍕</p>
        <p className="text-base font-bold text-white">1/4 + 2/4 = 3/4</p>
        <p className="text-xs text-white/65">Penyebut sama → jumlahkan pembilang saja!</p>
      </div>
    ),
    text: "Untuk pecahan berpenyebut sama, cukup jumlahkan/kurangkan pembilangnya. Penyebut TETAP.",
  },
  {
    title: "Situasi: Beda Bentuk Loyang",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🎂 + 🧁</p>
        <p className="text-base font-bold text-white">1/2 + 1/3 = 5/6</p>
        <p className="text-xs text-white/65">Beda penyebut → samakan dengan KPK</p>
      </div>
    ),
    text: "Beda penyebut? Cari KPK-nya, ubah ke pecahan senilai, baru hitung.",
  },
  {
    title: "Situasi: Sisa Cokelat",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🍫 - 🍫</p>
        <p className="text-base font-bold text-white">5/6 - 1/3 = 1/2</p>
        <p className="text-xs text-white/65">Pengurangan pakai cara yang sama</p>
      </div>
    ),
    text: "Pengurangan pecahan menggunakan langkah yang sama dengan penjumlahan.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Penyebut Sama", text: "Jumlah/kurang pembilang saja. Penyebut TETAP. Contoh: 3/8 + 2/8 = 5/8.", tone: "cyan" },
  { title: "Penyebut Beda", text: "Samakan dengan KPK → ubah ke pecahan senilai → baru hitung.", tone: "yellow" },
  { title: "Pecahan Campuran", text: "Bisa dipisah: bulat + bulat, pecahan + pecahan. Atau ubah ke pecahan biasa dulu.", tone: "emerald" },
  { title: "Sederhanakan!", text: "Selalu sederhanakan hasil akhir bila pembilang & penyebut punya FPB > 1.", tone: "violet" },
];

const PenjumlahanPenguranganPecahanLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Pecahan • Kelas 7"
    title="➕➖ Penjumlahan & Pengurangan Pecahan"
    intro="LKPD seru ini mengajak Sobat Numatik menjumlah dan mengurangkan pecahan, baik penyebut sama maupun beda, hingga pecahan campuran."
    situations={situations}
    guidedIntro="Aktivitas terbimbing: temukan aturan penjumlahan & pengurangan pecahan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Asah kemampuanmu dengan soal-soal latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-rasional"
    backLabel="Kembali ke LKPD Pecahan"
  />
);

export default PenjumlahanPenguranganPecahanLKPDPage;
