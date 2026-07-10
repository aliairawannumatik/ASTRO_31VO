import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Perbandingan tiga besaran a, b, dan c ditulis dengan bentuk",
    answers: ["a:b:c"],
    discussion: [
      "Perbandingan bertingkat menggabungkan tiga atau lebih besaran dalam satu rasio.",
      "Tanda titik dua memisahkan setiap besaran sesuai urutannya.",
      "Jadi, bentuk umumnya adalah a : b : c.",
    ],
  },
  {
    id: "g2",
    label: "Diketahui A : B = 2 : 3 dan B : C = 6 : 5. Untuk menggabungkannya, B harus disamakan dahulu menjadi",
    answers: ["6"],
    discussion: [
      "Cari KPK dari nilai B di kedua perbandingan.",
      "Nilai B pada A : B = 3 dan pada B : C = 6, KPK-nya 6.",
      "Jadi, B harus disamakan menjadi 6.",
    ],
  },
  {
    id: "g3",
    label: "Setelah B disamakan, perbandingan A : B menjadi",
    answers: ["4:6"],
    discussion: [
      "Kalikan A : B = 2 : 3 dengan 2 supaya B menjadi 6.",
      "Hasilnya 4 : 6.",
      "Jadi, A : B = 4 : 6.",
    ],
  },
  {
    id: "g4",
    label: "Perbandingan akhir A : B : C adalah",
    answers: ["4:6:5"],
    discussion: [
      "Gabungkan A : B = 4 : 6 dengan B : C = 6 : 5.",
      "Karena B sama-sama 6, perbandingan bisa langsung digabung.",
      "Jadi, A : B : C = 4 : 6 : 5.",
    ],
  },
  {
    id: "g5",
    label: "Jumlah seluruh bagian dari perbandingan 4 : 6 : 5 adalah",
    answers: ["15"],
    discussion: [
      "Jumlah bagian = 4 + 6 + 5.",
      "Hasilnya 15.",
      "Jadi, total bagian = 15.",
    ],
  },
  {
    id: "g6",
    label: "Jika total uang Rp 750.000 dibagi dengan perbandingan 4 : 6 : 5, nilai 1 bagian sama dengan Rp",
    answers: ["50000"],
    discussion: [
      "Nilai 1 bagian = total ÷ jumlah bagian.",
      "750.000 ÷ 15 = 50.000.",
      "Jadi, 1 bagian = Rp 50.000.",
    ],
  },
  {
    id: "g7",
    label: "Bagian B (6 bagian) sama dengan Rp",
    answers: ["300000"],
    discussion: [
      "Bagian B = 6 × nilai 1 bagian.",
      "6 × 50.000 = 300.000.",
      "Jadi, B menerima Rp 300.000.",
    ],
  },
  {
    id: "g8",
    label: "Selisih bagian C dan A (5 bagian - 4 bagian = 1 bagian) sama dengan Rp",
    answers: ["50000"],
    discussion: [
      "Selisih bagian = 5 - 4 = 1 bagian.",
      "1 bagian = Rp 50.000.",
      "Jadi, selisih C dan A = Rp 50.000.",
    ],
  },
  {
    id: "g9",
    label: "Rumus baku: Nilai tiap bagian = total dibagi",
    answers: ["jumlahbagian", "jumlahseluruhbagian", "totalbagian"],
    discussion: [
      "Untuk membagi sebuah total sesuai rasio, hitung dulu jumlah seluruh bagian.",
      "Lalu bagikan total dengan jumlah bagian tersebut.",
      "Jadi, nilai 1 bagian = total ÷ jumlah seluruh bagian.",
    ],
  },
  {
    id: "g10",
    label: "Rumus baku: Untuk menggabungkan a : b dan b : c, b harus dibuat",
    answers: ["sama"],
    discussion: [
      "Penggabungan dua perbandingan menggunakan besaran yang sama (b).",
      "b di kedua perbandingan harus diubah menjadi nilai yang sama (KPK).",
      "Jadi, b harus dibuat sama.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Diketahui A : B = 3 : 4 dan B : C = 8 : 5. Tentukan A : B : C dalam bentuk paling sederhana!",
    answers: ["6:8:5"],
    hint: "Samakan B menggunakan KPK dari 4 dan 8.",
    discussion: [
      "KPK dari 4 dan 8 adalah 8.",
      "A : B = 3 : 4 dikali 2 menjadi 6 : 8.",
      "B : C = 8 : 5 (sudah 8).",
      "Jadi, A : B : C = 6 : 8 : 5.",
    ],
  },
  {
    id: "p2",
    question: "Uang sebesar Rp 1.200.000 dibagi tiga anak dengan perbandingan 2 : 3 : 5. Berapa rupiah bagian anak ketiga?",
    answers: ["600000"],
    hint: "Jumlah bagian = 2 + 3 + 5 = 10.",
    discussion: [
      "Jumlah bagian = 2 + 3 + 5 = 10.",
      "Nilai 1 bagian = 1.200.000 ÷ 10 = 120.000.",
      "Bagian anak ketiga = 5 × 120.000 = 600.000.",
      "Jadi, anak ketiga menerima Rp 600.000.",
    ],
  },
  {
    id: "p3",
    question: "Perbandingan banyak kelereng Andi, Budi, dan Cici adalah 4 : 5 : 6. Jika kelereng Cici 18 buah, berapa total seluruh kelereng?",
    answers: ["45"],
    hint: "Cici = 6 bagian, jadi 1 bagian = 18 ÷ 6.",
    discussion: [
      "6 bagian = 18, maka 1 bagian = 3.",
      "Jumlah bagian = 4 + 5 + 6 = 15.",
      "Total kelereng = 15 × 3 = 45.",
      "Jadi, total kelereng = 45 buah.",
    ],
  },
  {
    id: "p4",
    question: "Diketahui A : B = 5 : 6 dan B : C = 9 : 10. Tentukan perbandingan A : B : C!",
    answers: ["15:18:20"],
    hint: "KPK dari 6 dan 9 adalah 18.",
    discussion: [
      "KPK dari 6 dan 9 adalah 18.",
      "A : B = 5 : 6 dikali 3 menjadi 15 : 18.",
      "B : C = 9 : 10 dikali 2 menjadi 18 : 20.",
      "Jadi, A : B : C = 15 : 18 : 20.",
    ],
  },
  {
    id: "p5",
    question: "Tiga koperasi membagi keuntungan dengan perbandingan 7 : 8 : 10. Jika selisih keuntungan koperasi terbesar dan terkecil Rp 600.000, berapa total keuntungan ketiga koperasi?",
    answers: ["5000000"],
    hint: "Selisih bagian = 10 - 7 = 3.",
    discussion: [
      "Selisih bagian = 10 - 7 = 3 bagian.",
      "3 bagian = 600.000, maka 1 bagian = 200.000.",
      "Jumlah bagian = 7 + 8 + 10 = 25.",
      "Total keuntungan = 25 × 200.000 = 5.000.000.",
    ],
  },
  {
    id: "p6",
    question: "Sebuah resep menggunakan tepung, gula, dan mentega dengan perbandingan 9 : 4 : 3. Jika dipakai 360 gram tepung, berapa gram mentega yang dibutuhkan?",
    answers: ["120"],
    hint: "Tepung = 9 bagian, jadi 1 bagian = 360 ÷ 9 = 40.",
    discussion: [
      "1 bagian = 360 ÷ 9 = 40 gram.",
      "Mentega = 3 bagian = 3 × 40 = 120 gram.",
      "Jadi, mentega yang dibutuhkan = 120 gram.",
    ],
  },
  {
    id: "p7",
    question: "Umur Ayah, Ibu, dan Adik berbanding 8 : 7 : 2. Jika jumlah umur ketiganya 51 tahun, berapa umur Ibu?",
    answers: ["21"],
    hint: "Total bagian = 8 + 7 + 2 = 17.",
    discussion: [
      "Jumlah bagian = 8 + 7 + 2 = 17.",
      "1 bagian = 51 ÷ 17 = 3 tahun.",
      "Umur Ibu = 7 × 3 = 21 tahun.",
    ],
  },
  {
    id: "p8",
    question: "Diketahui A : B = 2 : 3, B : C = 4 : 5, dan C : D = 6 : 7. Tentukan perbandingan A : D dalam bentuk paling sederhana!",
    answers: ["16:35"],
    hint: "Gabungkan langkah demi langkah lalu sederhanakan.",
    discussion: [
      "A : B = 2 : 3, samakan B dengan B : C = 4 : 5. KPK 3 dan 4 = 12.",
      "A : B menjadi 8 : 12, B : C menjadi 12 : 15. Jadi A : B : C = 8 : 12 : 15.",
      "Sekarang samakan C dengan C : D = 6 : 7. KPK 15 dan 6 = 30.",
      "A : B : C = 16 : 24 : 30 dan C : D = 30 : 35. Jadi A : D = 16 : 35.",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Membagi Hadiah Tiga Anak",
    visual: (
      <div className="flex items-center justify-center gap-3 text-center">
        <div>
          <div className="text-3xl mb-1">🧒</div>
          <p className="text-sm text-white/70">Anak A · 2</p>
        </div>
        <div className="text-2xl text-white/40">:</div>
        <div>
          <div className="text-3xl mb-1">🧒</div>
          <p className="text-sm text-white/70">Anak B · 3</p>
        </div>
        <div className="text-2xl text-white/40">:</div>
        <div>
          <div className="text-3xl mb-1">🧒</div>
          <p className="text-sm text-white/70">Anak C · 5</p>
        </div>
      </div>
    ),
    text: "Perbandingan bertingkat menjelaskan pembagian satu jumlah ke tiga atau lebih bagian sekaligus.",
  },
  {
    title: "Situasi: Menggabungkan Dua Perbandingan",
    visual: (
      <div className="text-center space-y-2">
        <p className="text-lg font-bold text-white">A : B = 2 : 3</p>
        <p className="text-lg font-bold text-white">B : C = 6 : 5</p>
        <p className="text-sm text-white/65">B muncul di keduanya, samakan dahulu.</p>
      </div>
    ),
    text: "Untuk menggabungkan dua perbandingan, samakan besaran yang muncul di keduanya menggunakan KPK.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Bentuk Umum", text: "Perbandingan bertingkat ditulis a : b : c sesuai urutan besaran.", tone: "cyan" },
  {
    title: "Menggabungkan",
    text: "Samakan besaran yang sama (misal B) menggunakan KPK, lalu gabung menjadi satu perbandingan.",
    tone: "yellow",
  },
  {
    title: "Membagi Total",
    text: "Nilai 1 bagian = total ÷ (jumlah seluruh bagian). Nilai tiap orang = bagian × nilai 1 bagian.",
    tone: "emerald",
  },
];

const BertingkatLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Perbandingan Bertingkat"
    intro="LKPD ini membantu Sobat Numatik memahami cara menulis perbandingan tiga besaran, menggabungkan dua perbandingan, dan membagi total sesuai rasio."
    situations={situations}
    guidedIntro="Lengkapi isian untuk menemukan cara menggabungkan dan membagi perbandingan bertingkat."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Kerjakan soal dengan langkah: samakan besaran yang sama, hitung total bagian, lalu cari nilai 1 bagian."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/perbandingan"
    backLabel="Kembali ke LKPD Perbandingan"
  />
);

export default BertingkatLKPDPage;
