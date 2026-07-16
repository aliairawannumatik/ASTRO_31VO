import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Pada perbandingan SENILAI, jika nilai satu besaran bertambah maka besaran yang lain akan",
    answers: ["bertambah", "naik"],
    discussion: [
      "Perbandingan senilai berarti dua besaran berubah ke arah yang sama.",
      "Contoh: makin banyak buku, makin mahal harganya.",
      "Jadi, jika satu bertambah, yang lain juga bertambah.",
    ],
  },
  {
    id: "g2",
    label: "Pada perbandingan BERBALIK NILAI, jika nilai satu besaran bertambah maka besaran yang lain akan",
    answers: ["berkurang", "turun"],
    discussion: [
      "Perbandingan berbalik nilai berarti dua besaran berubah ke arah berlawanan.",
      "Contoh: makin banyak pekerja, makin sedikit waktu yang dibutuhkan.",
      "Jadi, jika satu bertambah, yang lain berkurang.",
    ],
  },
  {
    id: "g3",
    label: "Diketahui 4 buku harganya Rp 20.000. Harga 1 buku adalah Rp",
    answers: ["5000"],
    discussion: [
      "Bagi total harga dengan jumlah buku.",
      "20.000 ÷ 4 = 5.000.",
      "Jadi, harga 1 buku Rp 5.000.",
    ],
  },
  {
    id: "g4",
    label: "Maka harga 7 buku adalah Rp",
    answers: ["35000"],
    discussion: [
      "Kalikan harga 1 buku dengan banyak buku.",
      "5.000 × 7 = 35.000.",
      "Jadi, harga 7 buku Rp 35.000.",
    ],
  },
  {
    id: "g5",
    label: "Pekerjaan selesai dalam 12 hari oleh 5 pekerja. Total hari-orang adalah",
    answers: ["60"],
    discussion: [
      "Pada perbandingan berbalik nilai, hasil kali kedua besaran tetap.",
      "12 × 5 = 60.",
      "Jadi, total hari-orang = 60.",
    ],
  },
  {
    id: "g6",
    label: "Jika pekerja menjadi 6 orang, lama hari yang dibutuhkan adalah",
    answers: ["10"],
    discussion: [
      "Total hari-orang tetap 60.",
      "60 ÷ 6 pekerja = 10 hari.",
      "Jadi, dibutuhkan 10 hari.",
    ],
  },
  {
    id: "g7",
    label: "Rumus baku perbandingan SENILAI: a/b sama dengan c/d, atau a × d sama dengan",
    answers: ["b×c", "bc", "b*c"],
    discussion: [
      "Perbandingan senilai dapat ditulis a/b = c/d.",
      "Perkalian silang menghasilkan a × d = b × c.",
      "Jadi, hasil kali silangnya sama.",
    ],
  },
  {
    id: "g8",
    label: "Rumus baku perbandingan BERBALIK NILAI: a × b sama dengan c × d, atau a/c sama dengan",
    answers: ["d/b"],
    discussion: [
      "Berbalik nilai berarti hasil kali kedua besaran tetap.",
      "Dari a × b = c × d, jika dibagi b dan c, diperoleh a/c = d/b.",
      "Jadi, perbandingannya terbalik.",
    ],
  },
  {
    id: "g9",
    label: "Untuk membedakan jenis perbandingan, gunakan pertanyaan: jika satu naik, yang lain ikut naik atau",
    answers: ["turun"],
    discussion: [
      "Perbandingan senilai = sama-sama naik atau sama-sama turun.",
      "Perbandingan berbalik nilai = satu naik, yang lain turun.",
      "Jadi, kuncinya adalah arah perubahan.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Harga 6 pensil adalah Rp 9.000. Berapa harga 10 pensil yang sama?",
    answers: ["15000"],
    hint: "Harga 1 pensil = 9.000 ÷ 6.",
    discussion: [
      "Harga 1 pensil = 9.000 ÷ 6 = 1.500.",
      "Harga 10 pensil = 10 × 1.500 = 15.000.",
      "Jadi, harga 10 pensil Rp 15.000.",
    ],
  },
  {
    id: "p2",
    question: "Sebuah mobil menempuh 180 km dengan 12 liter bensin. Berapa liter bensin yang diperlukan untuk menempuh 240 km?",
    answers: ["16"],
    hint: "1 liter dapat menempuh 180 ÷ 12 = 15 km.",
    discussion: [
      "Konsumsi: 1 liter = 15 km.",
      "Untuk 240 km diperlukan 240 ÷ 15 = 16 liter.",
      "Jadi, dibutuhkan 16 liter.",
    ],
  },
  {
    id: "p3",
    question: "Sebuah pekerjaan dapat diselesaikan oleh 8 pekerja dalam 15 hari. Berapa hari yang dibutuhkan jika dikerjakan oleh 12 pekerja?",
    answers: ["10"],
    hint: "Total hari-orang = 8 × 15 = 120 (tetap).",
    discussion: [
      "Total hari-orang = 8 × 15 = 120.",
      "Dengan 12 pekerja: 120 ÷ 12 = 10 hari.",
      "Jadi, dibutuhkan 10 hari.",
    ],
  },
  {
    id: "p4",
    question: "Persediaan makanan ternak cukup untuk 30 ekor sapi selama 24 hari. Jika sapi bertambah menjadi 40 ekor, berapa hari makanan akan habis?",
    answers: ["18"],
    hint: "Total ternak-hari tetap = 30 × 24 = 720.",
    discussion: [
      "Total ternak-hari = 30 × 24 = 720.",
      "Untuk 40 ekor: 720 ÷ 40 = 18 hari.",
      "Jadi, makanan habis dalam 18 hari.",
    ],
  },
  {
    id: "p5",
    question: "Sebuah peta menggunakan skala tetap. Jarak 5 cm di peta mewakili 20 km. Berapa km jarak sebenarnya jika di peta 8 cm?",
    answers: ["32"],
    hint: "1 cm di peta = 20 ÷ 5 = 4 km.",
    discussion: [
      "1 cm di peta = 4 km sebenarnya.",
      "8 cm = 8 × 4 = 32 km.",
      "Jadi, jaraknya 32 km.",
    ],
  },
  {
    id: "p6",
    question: "Sebuah mobil melaju dengan kecepatan 60 km/jam menempuh suatu jarak dalam 5 jam. Jika kecepatannya menjadi 75 km/jam, berapa jam waktu yang ditempuh?",
    answers: ["4"],
    hint: "Jarak tetap = 60 × 5 = 300 km.",
    discussion: [
      "Jarak = 60 × 5 = 300 km.",
      "Waktu = 300 ÷ 75 = 4 jam.",
      "Jadi, waktunya 4 jam.",
    ],
  },
  {
    id: "p7",
    question: "Untuk membuat 12 potong kue diperlukan 600 gram tepung. Berapa gram tepung yang diperlukan untuk 20 potong kue?",
    answers: ["1000"],
    hint: "1 potong = 600 ÷ 12 = 50 gram tepung.",
    discussion: [
      "1 potong = 50 gram tepung.",
      "20 potong = 20 × 50 = 1.000 gram.",
      "Jadi, dibutuhkan 1.000 gram.",
    ],
  },
  {
    id: "p8",
    question: "Sebuah proyek diperkirakan selesai dalam 20 hari oleh 9 pekerja. Setelah 8 hari, ditambah 3 pekerja. Berapa hari sisa pekerjaan diselesaikan?",
    answers: ["9"],
    hint: "Sisa pekerjaan = (20 - 8) × 9 = 108 hari-orang. Pekerja jadi 12.",
    discussion: [
      "Setelah 8 hari, sisa pekerjaan = 12 hari × 9 pekerja = 108 hari-orang.",
      "Pekerja sekarang 9 + 3 = 12 orang.",
      "Sisa hari = 108 ÷ 12 = 9 hari.",
      "Jadi, sisa pekerjaan selesai dalam 9 hari.",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Senilai (Sama Arah)",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">📚 4 buku → Rp 20.000</p>
        <p className="text-lg font-bold text-white">📚 7 buku → ?</p>
        <p className="text-sm text-white/65">Buku bertambah, harga ikut bertambah.</p>
      </div>
    ),
    text: "Perbandingan senilai: kedua besaran berubah ke arah yang sama.",
  },
  {
    title: "Situasi: Berbalik Nilai (Beda Arah)",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">👷 5 pekerja → 12 hari</p>
        <p className="text-lg font-bold text-white">👷 6 pekerja → ?</p>
        <p className="text-sm text-white/65">Pekerja bertambah, hari berkurang.</p>
      </div>
    ),
    text: "Perbandingan berbalik nilai: satu besaran naik, besaran lainnya turun.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Senilai", text: "a/b = c/d. Hasil kali silangnya sama: a × d = b × c.", tone: "cyan" },
  { title: "Berbalik Nilai", text: "a × b = c × d. Perbandingannya terbalik: a/c = d/b.", tone: "rose" },
  {
    title: "Cara Membedakan",
    text: "Tanya: jika satu naik, yang lain ikut naik (senilai) atau justru turun (berbalik nilai)?",
    tone: "emerald",
  },
];

const SenilaiLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Perbandingan Senilai dan Berbalik Nilai"
    intro="LKPD ini melatih Sobat Numatik membedakan kedua jenis perbandingan dan menerapkannya dalam soal kontekstual."
    situations={situations}
    guidedIntro="Isilah pertanyaan berikut untuk menemukan ciri serta rumus baku kedua jenis perbandingan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Tentukan dulu jenis perbandingannya, lalu gunakan rumus yang sesuai."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/perbandingan"
    backLabel="Kembali ke LKPD Perbandingan"
  />
);

export default SenilaiLKPDPage;
