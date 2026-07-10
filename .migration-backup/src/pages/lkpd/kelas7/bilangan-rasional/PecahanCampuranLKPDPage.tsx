import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Pecahan campuran terdiri dari bagian … dan bagian …",
    kind: "choice",
    options: ["bilangan bulat & pecahan biasa", "pembilang & penyebut", "desimal & persen", "akar & pangkat"],
    correctIndex: 0,
    discussion: [
      "Pecahan campuran = bilangan bulat + pecahan biasa.",
      "Contoh: 2 ¾ artinya 2 + 3/4.",
    ],
  },
  {
    id: "g2",
    label: "Ubah 7/3 menjadi pecahan campuran.",
    kind: "fill",
    answers: ["2 1/3", "21/3", "2 1\\3"],
    discussion: [
      "7 ÷ 3 = 2 sisa 1.",
      "Hasil bagi = bagian bulat (2), sisa = pembilang baru (1), penyebut tetap (3).",
      "Jadi 7/3 = 2 1/3.",
    ],
  },
  {
    id: "g3",
    label: "Ubah pecahan campuran 3 2/5 menjadi pecahan biasa.",
    kind: "choice",
    options: ["13/5", "17/5", "11/5", "15/5"],
    correctIndex: 1,
    discussion: [
      "(3 × 5) + 2 = 17.",
      "Penyebut tetap 5.",
      "Jadi 3 2/5 = 17/5.",
    ],
  },
  {
    id: "g4",
    label: "Benar atau salah: 4 1/2 sama nilainya dengan 9/2.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "4 × 2 + 1 = 9. Penyebut tetap 2. Jadi 4 1/2 = 9/2. BENAR.",
    ],
  },
  {
    id: "g5",
    label: "Jodohkan pecahan biasa dengan bentuk campurannya:",
    kind: "match",
    pairs: [
      { left: "11/4", right: "2 3/4" },
      { left: "13/5", right: "2 3/5" },
      { left: "9/2", right: "4 1/2" },
      { left: "17/6", right: "2 5/6" },
    ],
    discussion: [
      "11 ÷ 4 = 2 sisa 3 → 2 3/4.",
      "13 ÷ 5 = 2 sisa 3 → 2 3/5.",
      "9 ÷ 2 = 4 sisa 1 → 4 1/2.",
      "17 ÷ 6 = 2 sisa 5 → 2 5/6.",
    ],
  },
  {
    id: "g6",
    label: "Urutkan langkah mengubah 23/4 ke pecahan campuran:",
    kind: "sort",
    items: [
      "Tulis hasil: 5 3/4",
      "Bagi 23 dengan 4: hasilnya 5 sisa 3",
      "Hasil bagi (5) jadi bagian bulat",
      "Sisa (3) jadi pembilang baru, penyebut tetap 4",
    ],
    correctOrder: [
      "Bagi 23 dengan 4: hasilnya 5 sisa 3",
      "Hasil bagi (5) jadi bagian bulat",
      "Sisa (3) jadi pembilang baru, penyebut tetap 4",
      "Tulis hasil: 5 3/4",
    ],
    discussion: ["23 ÷ 4 = 5 sisa 3 → 5 3/4."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Ubah 19/6 menjadi pecahan campuran.",
    kind: "fill",
    answers: ["3 1/6", "31/6"],
    hint: "Bagi pembilang dengan penyebut.",
    discussion: ["19 ÷ 6 = 3 sisa 1 → 3 1/6."],
  },
  {
    id: "p2",
    question: "Bentuk pecahan biasa dari 5 3/8 adalah ...",
    kind: "choice",
    options: ["43/8", "15/8", "23/8", "53/8"],
    correctIndex: 0,
    hint: "(bilangan bulat × penyebut) + pembilang.",
    discussion: ["(5 × 8) + 3 = 43. Jadi 5 3/8 = 43/8."],
  },
  {
    id: "p3",
    question: "Benar atau salah: \"7 2/3 = 21/3\".",
    kind: "truefalse",
    correct: false,
    hint: "Cek: (7 × 3) + 2 = berapa?",
    discussion: ["(7 × 3) + 2 = 23. Jadi 7 2/3 = 23/3, bukan 21/3. SALAH."],
  },
  {
    id: "p4",
    question: "Jodohkan bentuk campuran dengan pecahan biasanya:",
    kind: "match",
    pairs: [
      { left: "1 5/8", right: "13/8" },
      { left: "3 4/7", right: "25/7" },
      { left: "6 1/4", right: "25/4" },
      { left: "2 7/9", right: "25/9" },
    ],
    hint: "Pakai rumus (bulat × penyebut + pembilang) / penyebut.",
    discussion: [
      "1 5/8 → 8+5=13 → 13/8.",
      "3 4/7 → 21+4=25 → 25/7.",
      "6 1/4 → 24+1=25 → 25/4.",
      "2 7/9 → 18+7=25 → 25/9.",
    ],
  },
  {
    id: "p5",
    question: "Bu Rina membuat 25/4 loyang kue. Berapa banyak loyang dalam bentuk campuran?",
    kind: "fill",
    answers: ["6 1/4", "61/4"],
    hint: "25 ÷ 4 = ? sisa ?",
    discussion: ["25 ÷ 4 = 6 sisa 1 → 6 1/4 loyang."],
  },
  {
    id: "p6",
    question: "Urutkan dari TERKECIL ke TERBESAR: 1 1/2, 5/3, 2 1/4, 3/2.",
    kind: "sort",
    items: ["1 1/2", "5/3", "2 1/4", "3/2"],
    correctOrder: ["3/2", "1 1/2", "5/3", "2 1/4"],
    hint: "Ubah semua ke desimal: 1.5, 1.667, 2.25, 1.5.",
    discussion: [
      "1 1/2 = 1.5; 5/3 ≈ 1.667; 2 1/4 = 2.25; 3/2 = 1.5.",
      "3/2 dan 1 1/2 sama (1.5). Urutkan: 3/2, 1 1/2, 5/3, 2 1/4.",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Kue Ulang Tahun",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-4xl">🎂🎂 + 🍰</p>
        <p className="text-base font-bold text-white">2 + 1/2 = 2 1/2</p>
        <p className="text-xs text-white/65">2 kue utuh + setengah kue lagi</p>
      </div>
    ),
    text: "Pecahan campuran muncul saat ada bagian utuh + sisa pecahan, seperti 2 ½ kue.",
  },
  {
    title: "Situasi: Pizza Bagi Sama",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-4xl">🍕🍕🍕🍕🍕🍕🍕</p>
        <p className="text-base font-bold text-white">7/3 = 2 1/3</p>
        <p className="text-xs text-white/65">7 potong dibagi 3 = 2 utuh sisa 1/3</p>
      </div>
    ),
    text: "Mengubah pecahan biasa ke campuran = membagi pembilang dengan penyebut.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Pecahan Biasa → Campuran", text: "Bagi pembilang dengan penyebut. Hasil bagi = bilangan bulat, sisa = pembilang baru.", tone: "cyan" },
  { title: "Campuran → Pecahan Biasa", text: "Pembilang baru = (bulat × penyebut) + pembilang lama. Penyebut tetap.", tone: "yellow" },
  { title: "Bandingkan Mudah", text: "Ubah ke pecahan biasa atau desimal agar mudah dibandingkan & diurutkan.", tone: "emerald" },
];

const PecahanCampuranLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Pecahan • Kelas 7"
    title="🍰 Pecahan Campuran"
    intro="LKPD ini melatih Sobat Numatik mengubah pecahan biasa menjadi campuran dan sebaliknya, sambil membandingkan keduanya dengan ceria!"
    situations={situations}
    guidedIntro="Ikuti aktivitas terbimbing untuk memahami konsep pecahan campuran."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Sekarang giliranmu! Selesaikan soal-soal berikut."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-rasional"
    backLabel="Kembali ke LKPD Pecahan"
  />
);

export default PecahanCampuranLKPDPage;
