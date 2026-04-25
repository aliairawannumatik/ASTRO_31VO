import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import type { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Pada garis bilangan, gerakan ke KANAN melambangkan bilangan bertanda",
    kind: "choice",
    options: ["positif (+)", "negatif (−)", "nol", "tergantung soal"],
    correctIndex: 0,
    discussion: [
      "Pada garis bilangan, ke kanan = bertambah/positif, ke kiri = berkurang/negatif.",
      "Jadi, gerakan ke kanan melambangkan bilangan positif.",
    ],
  },
  {
    id: "g2",
    label: "Hasil dari 5 + (-3) = ...",
    kind: "fill",
    answers: ["2"],
    discussion: [
      "Mulai dari 5, lalu mundur 3 langkah karena ditambah negatif.",
      "5 - 3 = 2.",
    ],
  },
  {
    id: "g3",
    label: "Tentukan benar atau salah: \"Hasil penjumlahan dua bilangan negatif selalu negatif.\"",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Contoh: -3 + (-4) = -7, -5 + (-2) = -7.",
      "Penjumlahan dua bilangan negatif menambah tanda negatifnya.",
      "Pernyataan benar.",
    ],
  },
  {
    id: "g4",
    label: "Jodohkan operasi penjumlahan dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "-7 + 4", right: "-3" },
      { left: "8 + (-3)", right: "5" },
      { left: "-6 + (-2)", right: "-8" },
      { left: "10 + (-10)", right: "0" },
    ],
    discussion: [
      "-7 + 4 = -3 (negatif lebih besar nilai mutlak).",
      "8 + (-3) = 5 (positif lebih besar nilai mutlak).",
      "-6 + (-2) = -8 (sama-sama negatif, jumlahkan).",
      "10 + (-10) = 0 (lawan menghilangkan).",
    ],
  },
  {
    id: "g5",
    label: "Urutkan langkah berikut untuk menghitung -8 + 12:",
    kind: "sort",
    items: [
      "Hasilnya 4",
      "Tentukan tanda hasil mengikuti yang nilai mutlaknya lebih besar (12, positif)",
      "Hitung selisih nilai mutlak: 12 - 8 = 4",
      "Bandingkan nilai mutlak |-8| = 8 dan |12| = 12",
    ],
    correctOrder: [
      "Bandingkan nilai mutlak |-8| = 8 dan |12| = 12",
      "Hitung selisih nilai mutlak: 12 - 8 = 4",
      "Tentukan tanda hasil mengikuti yang nilai mutlaknya lebih besar (12, positif)",
      "Hasilnya 4",
    ],
    discussion: [
      "Saat tanda berbeda: bandingkan nilai mutlak.",
      "Hitung selisihnya, lalu tanda mengikuti yang lebih besar.",
      "-8 + 12 = +4.",
    ],
  },
  {
    id: "g6",
    label: "Suhu udara mula-mula -3°C kemudian naik 7°C. Suhu akhir = ...°C",
    kind: "fill",
    answers: ["4"],
    discussion: [
      "-3 + 7 = 4.",
      "Jadi, suhu akhir 4°C.",
    ],
  },
  {
    id: "g7",
    label: "Sifat mana yang BENAR tentang penjumlahan bilangan bulat?",
    kind: "choice",
    options: [
      "a + b = b + a (komutatif)",
      "a + b selalu negatif",
      "a + 0 = -a",
      "a + b > a + c jika b < c",
    ],
    correctIndex: 0,
    discussion: [
      "Penjumlahan bilangan bulat bersifat komutatif: a + b = b + a.",
      "Contoh: 4 + (-7) = -7 + 4 = -3.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung: -15 + 24",
    kind: "fill",
    answers: ["9"],
    hint: "Tanda berbeda: cari selisih nilai mutlak, ikuti tanda yang lebih besar.",
    discussion: ["|24| > |-15|, jadi tandanya positif.", "24 - 15 = 9.", "Jadi, hasilnya 9."],
  },
  {
    id: "p2",
    question: "Pilih hasil yang benar untuk -28 + (-17):",
    kind: "choice",
    options: ["-45", "45", "-11", "11"],
    correctIndex: 0,
    hint: "Sama-sama negatif, jumlahkan nilai mutlaknya, hasil negatif.",
    discussion: ["-28 + (-17) = -(28 + 17) = -45."],
  },
  {
    id: "p3",
    question: "Benar atau salah: \"Hasil dari (-12) + 12 sama dengan 24\".",
    kind: "truefalse",
    correct: false,
    hint: "Bilangan dengan lawannya menghasilkan nol.",
    discussion: ["-12 + 12 = 0, bukan 24.", "Jadi, pernyataan SALAH."],
  },
  {
    id: "p4",
    question: "Jodohkan operasi dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "-25 + 40", right: "15" },
      { left: "-18 + (-22)", right: "-40" },
      { left: "35 + (-50)", right: "-15" },
      { left: "0 + (-7)", right: "-7" },
    ],
    hint: "Kerjakan satu per satu: jika tanda sama, jumlahkan; jika beda, kurangi.",
    discussion: [
      "-25 + 40 = 15.",
      "-18 + (-22) = -40.",
      "35 + (-50) = -15.",
      "0 + (-7) = -7.",
    ],
  },
  {
    id: "p5",
    question: "Sebuah submarin berada di kedalaman -120 m, lalu naik 75 m, lalu turun 30 m. Berapa posisi akhirnya (dalam meter)?",
    kind: "fill",
    answers: ["-75"],
    hint: "Hitung -120 + 75 - 30.",
    discussion: ["-120 + 75 = -45.", "-45 - 30 = -75.", "Jadi, posisi akhir -75 m."],
  },
  {
    id: "p6",
    question: "Urutkan dari yang terkecil ke terbesar:",
    kind: "sort",
    items: ["3", "-12", "0", "-5", "8"],
    correctOrder: ["-12", "-5", "0", "3", "8"],
    hint: "Bilangan negatif yang nilai mutlaknya besar justru paling kecil.",
    discussion: [
      "Pada garis bilangan, semakin ke kiri semakin kecil.",
      "Urutan: -12, -5, 0, 3, 8.",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Suhu Naik Turun",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🌡️</p>
        <p className="text-lg font-bold text-white">-3°C → naik 7°C</p>
        <p className="text-sm text-white/65">Suhu akhir? Gunakan -3 + 7.</p>
      </div>
    ),
    text: "Penjumlahan bilangan bulat sering muncul pada perubahan suhu, ketinggian, dan saldo uang.",
  },
  {
    title: "Situasi: Garis Bilangan",
    visual: (
      <div className="text-center">
        <div className="font-mono text-white/70 text-sm">… -3 -2 -1 0 1 2 3 …</div>
        <p className="text-sm text-white/65 mt-2">Ke kanan = positif, ke kiri = negatif.</p>
      </div>
    ),
    text: "Pakai garis bilangan untuk membayangkan arah gerakan tiap operasi penjumlahan.",
  },
];

const games: LKPDGame[] = [
  {
    kind: "page-link",
    id: "pesawat-tembak-meteor-penjumlahan",
    title: "🚀 Pesawat Tembak Meteor — Penjumlahan",
    description:
      "Tembak meteor berisi jawaban yang TEPAT untuk soal penjumlahan bilangan bulat. Setiap jawaban benar mendapat 20 poin!",
    path: "/lkpd/kelas-7/bilangan-bulat/penjumlahan/pesawat-tembak-meteor",
    buttonLabel: "MULAI MAIN",
    emoji: "🚀",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Tanda Sama", text: "Jumlahkan nilai mutlak, tanda mengikuti tanda asli.", tone: "cyan" },
  { title: "Tanda Beda", text: "Kurangi nilai mutlak besar dengan kecil, tanda ikut yang besar.", tone: "yellow" },
  { title: "Sifat", text: "Komutatif (a+b=b+a) & asosiatif. Penjumlahan dengan 0 = bilangan itu sendiri.", tone: "emerald" },
];

const PenjumlahanLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Penjumlahan Bilangan Bulat"
    intro="LKPD ini melatih Sobat Numatik menjumlahkan bilangan bulat lewat isian, pilihan ganda, jodoh, urut, dan benar/salah."
    situations={situations}
    guidedIntro="Selesaikan beragam jenis soal berikut untuk menemukan aturan penjumlahan bilangan bulat."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Terapkan aturan tanda dan strategi garis bilangan pada soal-soal di bawah ini."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/bilangan-bulat"
    backLabel="Kembali ke LKPD Bilangan Bulat"
  />
);

export default PenjumlahanLKPDPage;
