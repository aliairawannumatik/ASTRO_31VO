import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Pengurangan a − b sama dengan menjumlahkan a dengan ...",
    kind: "choice",
    options: ["lawan dari b", "kebalikan dari b", "akar dari b", "negatif dari a"],
    correctIndex: 0,
    discussion: [
      "Aturan dasar: a − b = a + (−b).",
      "−b adalah lawan dari b (mengubah tanda).",
    ],
  },
  {
    id: "g2",
    label: "8 − (-5) = ...",
    kind: "fill",
    answers: ["13"],
    discussion: [
      "8 − (-5) = 8 + 5 = 13.",
      "Tanda minus bertemu minus menjadi plus.",
    ],
  },
  {
    id: "g3",
    label: "Benar atau salah: \"Pengurangan bilangan bulat bersifat komutatif (a − b = b − a).\"",
    kind: "truefalse",
    correct: false,
    discussion: [
      "Contoh: 5 − 3 = 2, sedangkan 3 − 5 = -2. Berbeda.",
      "Pengurangan TIDAK komutatif.",
    ],
  },
  {
    id: "g4",
    label: "Jodohkan ekspresi pengurangan dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "12 − 5", right: "7" },
      { left: "5 − 12", right: "-7" },
      { left: "-9 − 4", right: "-13" },
      { left: "-9 − (-4)", right: "-5" },
    ],
    discussion: [
      "12 − 5 = 7.",
      "5 − 12 = -7.",
      "-9 − 4 = -13.",
      "-9 − (-4) = -9 + 4 = -5.",
    ],
  },
  {
    id: "g5",
    label: "Urutkan langkah menghitung -7 − (-3):",
    kind: "sort",
    items: [
      "Hasil = -4",
      "Tulis ulang sebagai penjumlahan: -7 + 3",
      "Hitung -7 + 3",
      "Lawan dari -3 adalah 3",
    ],
    correctOrder: [
      "Lawan dari -3 adalah 3",
      "Tulis ulang sebagai penjumlahan: -7 + 3",
      "Hitung -7 + 3",
      "Hasil = -4",
    ],
    discussion: [
      "Cari lawan bilangan pengurang, ubah operasi menjadi penjumlahan.",
      "-7 + 3 = -4.",
    ],
  },
  {
    id: "g6",
    label: "Suhu kota A 5°C, kota B -8°C. Selisih suhu A dengan B = ...°C",
    kind: "fill",
    answers: ["13"],
    discussion: [
      "Selisih = 5 − (-8) = 5 + 8 = 13.",
      "Jadi, selisihnya 13°C.",
    ],
  },
  {
    id: "g7",
    label: "Pilih pernyataan yang BENAR:",
    kind: "choice",
    options: [
      "a − 0 = a",
      "0 − a = a",
      "a − a = 1",
      "a − b > a untuk semua b > 0",
    ],
    correctIndex: 0,
    discussion: [
      "Mengurangi 0 tidak mengubah bilangan: a − 0 = a.",
      "Sebaliknya, 0 − a = -a, dan a − a = 0.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung: 17 − (-23)",
    kind: "fill",
    answers: ["40"],
    hint: "Minus bertemu minus menjadi plus.",
    discussion: ["17 − (-23) = 17 + 23 = 40."],
  },
  {
    id: "p2",
    question: "Pilih hasil yang benar untuk -12 − 8:",
    kind: "choice",
    options: ["-20", "20", "-4", "4"],
    correctIndex: 0,
    hint: "-12 − 8 = -12 + (-8).",
    discussion: ["-12 − 8 = -12 + (-8) = -20."],
  },
  {
    id: "p3",
    question: "Benar atau salah: \"Hasil dari 0 − (-15) adalah 15.\"",
    kind: "truefalse",
    correct: true,
    hint: "0 + 15 = 15.",
    discussion: ["0 − (-15) = 0 + 15 = 15. Benar."],
  },
  {
    id: "p4",
    question: "Jodohkan operasi dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "25 − 40", right: "-15" },
      { left: "-18 − (-22)", right: "4" },
      { left: "-30 − 12", right: "-42" },
      { left: "50 − (-50)", right: "100" },
    ],
    hint: "Ubah pengurangan menjadi penjumlahan dengan lawan.",
    discussion: [
      "25 − 40 = -15.",
      "-18 − (-22) = -18 + 22 = 4.",
      "-30 − 12 = -42.",
      "50 − (-50) = 50 + 50 = 100.",
    ],
  },
  {
    id: "p5",
    question: "Selisih ketinggian puncak gunung 1.250 m dengan dasar lembah -45 m adalah ... m",
    kind: "fill",
    answers: ["1295"],
    hint: "Hitung 1.250 − (-45).",
    discussion: ["1.250 − (-45) = 1.250 + 45 = 1.295 m."],
  },
  {
    id: "p6",
    question: "Saldo Andi Rp 250.000. Ia menarik Rp 320.000 sehingga saldo menjadi minus. Berapa saldo akhirnya (rupiah)?",
    kind: "fill",
    answers: ["-70000"],
    hint: "250.000 − 320.000.",
    discussion: ["250.000 − 320.000 = -70.000.", "Saldo akhir Rp -70.000 (kurang Rp 70.000)."],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Selisih Suhu",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">Kota A: 5°C · Kota B: -8°C</p>
        <p className="text-sm text-white/65">Selisih = 5 − (-8)</p>
      </div>
    ),
    text: "Pengurangan bilangan bulat dipakai untuk mencari selisih suhu, ketinggian, atau saldo.",
  },
  {
    title: "Situasi: Aturan Tanda",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">a − b = a + (−b)</p>
        <p className="text-sm text-white/65">Pengurangan diubah menjadi penjumlahan dengan lawan.</p>
      </div>
    ),
    text: "Aturan kunci: ubah pengurangan menjadi penjumlahan dengan lawan agar mudah dikerjakan.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Aturan Utama", text: "a − b = a + (−b). Tanda minus bertemu minus jadi plus.", tone: "cyan" },
  { title: "Bukan Komutatif", text: "a − b ≠ b − a, kecuali jika a = b (hasil 0).", tone: "yellow" },
  { title: "Selisih", text: "Selisih dua bilangan = pengurangan dari yang lebih besar dengan yang lebih kecil.", tone: "emerald" },
];

const PenguranganLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Pengurangan Bilangan Bulat"
    intro="LKPD ini melatih Sobat Numatik mengurangkan bilangan bulat dengan beragam tipe soal interaktif."
    situations={situations}
    guidedIntro="Kerjakan setiap pertanyaan untuk menemukan aturan pengurangan bilangan bulat."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Selalu ubah pengurangan menjadi penjumlahan dengan lawan, lalu terapkan aturan tanda."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-bulat"
    backLabel="Kembali ke LKPD Bilangan Bulat"
  />
);

export default PenguranganLKPDPage;
