import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Sebuah pizza dipotong menjadi 8 bagian sama besar. Sobat Numatik mengambil 3 potong. Bagian pizza yang diambil dinyatakan sebagai pecahan ...",
    kind: "choice",
    options: ["3/8", "8/3", "3/5", "5/8"],
    correctIndex: 0,
    discussion: [
      "Pembilang = banyak bagian yang diambil = 3.",
      "Penyebut = banyak bagian sama besar seluruhnya = 8.",
      "Jadi pecahannya 3/8.",
    ],
  },
  {
    id: "g2",
    label: "Pada pecahan 5/9, angka 5 disebut … dan angka 9 disebut …",
    kind: "match",
    pairs: [
      { left: "Angka 5 (di atas garis)", right: "Pembilang" },
      { left: "Angka 9 (di bawah garis)", right: "Penyebut" },
      { left: "Garis pecahan", right: "Tanda bagi (÷)" },
      { left: "Arti pecahan 5/9", right: "Bagian dari keseluruhan" },
    ],
    discussion: [
      "Pembilang = bagian yang diambil/diwakili.",
      "Penyebut = banyak bagian sama besar pada keseluruhan.",
      "Garis pecahan setara dengan tanda bagi (÷).",
      "Pecahan menyatakan bagian dari satu keseluruhan.",
    ],
  },
  {
    id: "g3",
    label: "Pecahan 2/3 senilai dengan 4/6. Cara mendapatkannya: kalikan pembilang dan penyebut dengan ...",
    kind: "fill",
    answers: ["2"],
    discussion: [
      "2/3 × 2/2 = 4/6.",
      "Mengalikan pembilang & penyebut dengan bilangan yang sama menghasilkan pecahan senilai.",
    ],
  },
  {
    id: "g4",
    label: "Benar atau salah: 6/9 senilai dengan 2/3.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "6 ÷ 3 = 2 dan 9 ÷ 3 = 3.",
      "Jadi 6/9 = 2/3 (pecahan senilai). Pernyataan BENAR.",
    ],
  },
  {
    id: "g5",
    label: "Untuk membandingkan 3/4 dan 5/6, samakan penyebut menjadi ...",
    kind: "choice",
    options: ["10", "12", "24", "20"],
    correctIndex: 1,
    discussion: [
      "KPK dari 4 dan 6 = 12.",
      "3/4 = 9/12 dan 5/6 = 10/12.",
      "Karena 9/12 < 10/12, maka 3/4 < 5/6.",
    ],
  },
  {
    id: "g6",
    label: "Urutkan pecahan berikut dari yang TERKECIL ke TERBESAR: 1/2, 3/4, 2/3, 5/8.",
    kind: "sort",
    items: ["1/2", "3/4", "2/3", "5/8"],
    correctOrder: ["1/2", "5/8", "2/3", "3/4"],
    discussion: [
      "Samakan penyebut ke 24: 1/2=12/24, 5/8=15/24, 2/3=16/24, 3/4=18/24.",
      "Urutan pembilang: 12 < 15 < 16 < 18.",
      "Jadi: 1/2 < 5/8 < 2/3 < 3/4.",
    ],
  },
  {
    id: "g7",
    label: "Pecahan paling sederhana dari 18/24 adalah ...",
    kind: "fill",
    answers: ["3/4"],
    discussion: [
      "FPB(18, 24) = 6.",
      "18 ÷ 6 = 3 dan 24 ÷ 6 = 4.",
      "Jadi bentuk paling sederhananya 3/4.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Sebuah cokelat batang dibagi menjadi 12 kotak sama besar. Adi memakan 5 kotak. Berapa pecahan cokelat yang dimakan Adi?",
    kind: "fill",
    answers: ["5/12"],
    hint: "Pembilang = bagian yang dimakan, Penyebut = jumlah seluruh kotak.",
    discussion: ["5/12 cokelat dimakan Adi."],
  },
  {
    id: "p2",
    question: "Pecahan berikut yang SENILAI dengan 4/6 adalah ...",
    kind: "choice",
    options: ["6/9", "3/5", "8/10", "5/8"],
    correctIndex: 0,
    hint: "Bagi/kalikan pembilang & penyebut dengan bilangan yang sama.",
    discussion: ["4/6 = 2/3. 6/9 = 2/3. Jadi 6/9 senilai dengan 4/6."],
  },
  {
    id: "p3",
    question: "Benar atau salah: \"3/5 lebih besar daripada 7/10\".",
    kind: "truefalse",
    correct: false,
    hint: "Samakan penyebutnya menjadi 10.",
    discussion: ["3/5 = 6/10. 6/10 < 7/10, jadi 3/5 < 7/10. Pernyataan SALAH."],
  },
  {
    id: "p4",
    question: "Jodohkan pecahan dengan bentuk paling sederhananya:",
    kind: "match",
    pairs: [
      { left: "10/15", right: "2/3" },
      { left: "9/12", right: "3/4" },
      { left: "8/20", right: "2/5" },
      { left: "12/18", right: "2/3 (sama dengan 10/15)" },
    ],
    hint: "Bagi pembilang & penyebut dengan FPB-nya.",
    discussion: [
      "10/15 ÷ 5 = 2/3.",
      "9/12 ÷ 3 = 3/4.",
      "8/20 ÷ 4 = 2/5.",
      "12/18 ÷ 6 = 2/3.",
    ],
  },
  {
    id: "p5",
    question: "Urutkan pecahan berikut dari TERBESAR ke TERKECIL: 2/3, 3/4, 5/12, 1/2.",
    kind: "sort",
    items: ["2/3", "3/4", "5/12", "1/2"],
    correctOrder: ["3/4", "2/3", "1/2", "5/12"],
    hint: "Samakan penyebut ke 12.",
    discussion: [
      "2/3=8/12, 3/4=9/12, 5/12=5/12, 1/2=6/12.",
      "Urut menurun: 9, 8, 6, 5 → 3/4, 2/3, 1/2, 5/12.",
    ],
  },
  {
    id: "p6",
    question: "Bentuk paling sederhana dari 24/36 adalah ...",
    kind: "fill",
    answers: ["2/3"],
    hint: "FPB(24, 36) = 12.",
    discussion: ["24 ÷ 12 = 2 dan 36 ÷ 12 = 3. Jadi 24/36 = 2/3."],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Pizza Sobat Numatik",
    visual: (
      <div className="text-center space-y-2">
        <p className="text-5xl">🍕</p>
        <div className="flex justify-center gap-1 text-2xl">
          <span>🟧</span><span>🟧</span><span>🟧</span><span>⬜</span><span>⬜</span><span>⬜</span><span>⬜</span><span>⬜</span>
        </div>
        <p className="text-sm text-white/70">3 dari 8 potong diambil → <span className="font-bold text-orange-300">3/8</span></p>
      </div>
    ),
    text: "Pecahan menggambarkan banyak BAGIAN yang diambil dibanding TOTAL bagian sama besar dari satu kesatuan.",
  },
  {
    title: "Situasi: Cokelat Senilai",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🍫🍫</p>
        <p className="text-base font-bold text-white">1/2 = 2/4 = 4/8</p>
        <p className="text-xs text-white/65">Bentuknya beda, nilainya sama!</p>
      </div>
    ),
    text: "Pecahan senilai diperoleh dengan mengalikan/membagi pembilang & penyebut dengan bilangan yang sama.",
  },
  {
    title: "Situasi: Membandingkan Kue",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🍰 vs 🎂</p>
        <p className="text-sm text-white/80">2/3 ⟷ 3/4 → samakan penyebut</p>
        <p className="text-xs text-white/65">8/12 &lt; 9/12 → 2/3 &lt; 3/4</p>
      </div>
    ),
    text: "Bandingkan pecahan dengan menyamakan penyebut menggunakan KPK, lalu bandingkan pembilangnya.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Bagian dari Keseluruhan", text: "Pecahan a/b: a = pembilang (bagian yang diambil), b = penyebut (jumlah bagian sama besar).", tone: "cyan" },
  { title: "Pecahan Senilai", text: "Kalikan/bagi pembilang dan penyebut dengan bilangan yang sama (≠ 0).", tone: "yellow" },
  { title: "Bentuk Sederhana", text: "Bagi pembilang & penyebut dengan FPB hingga tidak bisa dibagi lagi.", tone: "emerald" },
  { title: "Membandingkan", text: "Samakan penyebut dengan KPK, lalu bandingkan pembilangnya.", tone: "violet" },
];

const ArtiPecahanLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Pecahan • Kelas 7"
    title="🍕 Arti Pecahan & Pecahan Senilai"
    intro="LKPD ceria ini mengajak Sobat Numatik memahami arti pecahan, pecahan senilai, bentuk paling sederhana, dan membandingkan pecahan lewat permainan pizza, cokelat, dan kue."
    situations={situations}
    guidedIntro="Selesaikan aktivitas terbimbing berikut untuk menemukan konsep pecahan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Latih pemahamanmu dengan soal-soal berikut. Semangat!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-rasional"
    backLabel="Kembali ke LKPD Pecahan"
  />
);

export default ArtiPecahanLKPDPage;
