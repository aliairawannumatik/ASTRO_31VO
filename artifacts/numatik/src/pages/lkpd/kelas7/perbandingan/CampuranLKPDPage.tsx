import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Soal perbandingan campuran biasanya menggabungkan dua jenis perbandingan: senilai dan",
    answers: ["berbaliknilai", "berbalik"],
    discussion: [
      "Perbandingan campuran sering muncul saat suatu pekerjaan melibatkan banyak besaran sekaligus.",
      "Salah satu besaran berperilaku senilai, yang lain berbalik nilai.",
      "Jadi, dua jenis itu digabungkan dalam satu soal.",
    ],
  },
  {
    id: "g2",
    label: "Diketahui 6 pekerja menyelesaikan 240 m² lantai dalam 5 hari. Banyak m² per pekerja-hari adalah",
    answers: ["8"],
    discussion: [
      "Total pekerja-hari = 6 × 5 = 30.",
      "Per pekerja-hari = 240 ÷ 30 = 8 m².",
      "Jadi, 1 pekerja-hari = 8 m².",
    ],
  },
  {
    id: "g3",
    label: "Berapa m² yang diselesaikan 9 pekerja dalam 4 hari?",
    answers: ["288"],
    discussion: [
      "Pekerja-hari baru = 9 × 4 = 36.",
      "Hasil = 36 × 8 = 288 m².",
      "Jadi, 9 pekerja dalam 4 hari menyelesaikan 288 m².",
    ],
  },
  {
    id: "g4",
    label: "Saat banyak pekerja bertambah, waktu pengerjaan untuk luas tetap akan",
    answers: ["berkurang"],
    discussion: [
      "Banyak pekerja vs lama waktu = berbalik nilai (untuk pekerjaan tetap).",
      "Pekerja bertambah → waktu berkurang.",
      "Jadi, jawabannya berkurang.",
    ],
  },
  {
    id: "g5",
    label: "Saat luas pekerjaan bertambah dengan jumlah pekerja tetap, waktu yang dibutuhkan akan",
    answers: ["bertambah"],
    discussion: [
      "Banyak luas vs lama waktu = senilai (jumlah pekerja tetap).",
      "Luas bertambah → waktu bertambah.",
      "Jadi, jawabannya bertambah.",
    ],
  },
  {
    id: "g6",
    label: "Rumus baku perbandingan campuran sering menggunakan persamaan (besaran1 × besaran2) per (waktu) sama dengan",
    answers: ["konstan", "tetap"],
    discussion: [
      "Untuk pekerjaan tetap berlaku: pekerja × waktu / luas = tetap.",
      "Bisa juga ditulis: pekerja × waktu = luas × konstanta.",
      "Jadi, hasilnya konstan/tetap.",
    ],
  },
  {
    id: "g7",
    label: "Perbandingan 8 pekerja membangun 200 m tembok dalam 10 hari. Untuk 12 pekerja membangun 300 m tembok, lama hari yang dibutuhkan",
    suffix: "hari",
    answers: ["10"],
    discussion: [
      "Per pekerja-hari = 200 ÷ (8 × 10) = 2,5 m.",
      "Pekerja-hari yang dibutuhkan = 300 ÷ 2,5 = 120.",
      "Hari = 120 ÷ 12 pekerja = 10 hari.",
      "Jadi, dibutuhkan 10 hari.",
    ],
  },
  {
    id: "g8",
    label: "Strategi paling aman menyelesaikan soal campuran adalah menghitung dahulu",
    answers: ["1bagian", "satubagian", "perbagian", "perpekerjahari", "1pekerjahari"],
    discussion: [
      "Cari nilai untuk 1 satuan terlebih dahulu (misalnya per pekerja-hari).",
      "Setelah itu, kalikan kembali sesuai kondisi baru.",
      "Jadi, hitung dahulu nilai per 1 bagian.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Sebuah pekerjaan dapat diselesaikan oleh 8 pekerja dalam 12 hari. Jika ditambah 4 pekerja, berapa hari pekerjaan tersebut akan selesai?",
    answers: ["8"],
    hint: "Total pekerja-hari = 8 × 12 = 96. Pekerja jadi 12.",
    discussion: [
      "Total pekerja-hari = 8 × 12 = 96.",
      "Pekerja sekarang 12, hari = 96 ÷ 12 = 8 hari.",
      "Jadi, pekerjaan selesai dalam 8 hari.",
    ],
  },
  {
    id: "p2",
    question: "Untuk membuat 60 lembar kue diperlukan 5 kg tepung selama 3 hari kerja. Berapa kg tepung yang diperlukan untuk membuat 100 lembar kue?",
    answers: ["8.333", "8,333", "25/3"],
    hint: "Hari kerja tidak mempengaruhi banyak tepung — hanya jumlah kue.",
    discussion: [
      "Banyak tepung berbanding lurus dengan jumlah kue.",
      "1 kue = 5/60 = 1/12 kg.",
      "100 kue = 100 × 1/12 = 25/3 ≈ 8,333 kg.",
    ],
  },
  {
    id: "p3",
    question: "Sebuah peternakan memiliki persediaan makanan untuk 60 ekor ayam selama 24 hari. Setelah 9 hari, sebagian ayam dipindahkan sehingga sisa 45 ekor. Berapa hari sisa makanan akan habis untuk ayam yang tersisa?",
    answers: ["20"],
    hint: "Sisa makanan untuk 60 ekor = 15 hari. Hitung total ekor-hari.",
    discussion: [
      "Setelah 9 hari, sisa makanan untuk 60 ekor = 15 hari = 60 × 15 = 900 ekor-hari.",
      "Ayam tersisa 45 ekor, hari = 900 ÷ 45 = 20 hari.",
      "Jadi, sisa makanan habis dalam 20 hari.",
    ],
  },
  {
    id: "p4",
    question: "10 orang penjahit dapat menyelesaikan 200 baju dalam 8 hari. Berapa baju yang dapat diselesaikan 15 penjahit dalam 6 hari?",
    answers: ["225"],
    hint: "1 penjahit-hari = 200 ÷ (10 × 8) = 2,5 baju.",
    discussion: [
      "1 penjahit-hari = 200 ÷ 80 = 2,5 baju.",
      "Penjahit-hari baru = 15 × 6 = 90.",
      "Hasil = 90 × 2,5 = 225 baju.",
    ],
  },
  {
    id: "p5",
    question: "Sebuah proyek dibangun oleh 24 pekerja selama 30 hari. Setelah 10 hari, 4 pekerja berhenti. Berapa hari sisa proyek akan selesai?",
    answers: ["24"],
    hint: "Sisa pekerjaan = (30 - 10) × 24 = 480 pekerja-hari. Pekerja jadi 20.",
    discussion: [
      "Sisa pekerjaan = 20 × 24 = 480 pekerja-hari.",
      "Pekerja sekarang = 24 - 4 = 20 orang.",
      "Hari = 480 ÷ 20 = 24 hari.",
      "Jadi, dibutuhkan 24 hari lagi.",
    ],
  },
  {
    id: "p6",
    question: "Untuk membangun jembatan sepanjang 150 m diperlukan 30 pekerja selama 20 hari. Berapa pekerja diperlukan untuk membangun 225 m jembatan dalam 25 hari?",
    answers: ["36"],
    hint: "1 pekerja-hari = 150 ÷ (30 × 20) = 0,25 m.",
    discussion: [
      "1 pekerja-hari = 0,25 m.",
      "Pekerja-hari yang dibutuhkan = 225 ÷ 0,25 = 900.",
      "Pekerja = 900 ÷ 25 = 36 orang.",
    ],
  },
  {
    id: "p7",
    question: "Empat puluh pekerja dapat menyelesaikan suatu pekerjaan dalam 18 hari dengan bekerja 8 jam sehari. Berapa hari pekerjaan akan selesai jika dikerjakan 30 pekerja dengan 6 jam sehari?",
    answers: ["32"],
    hint: "Total pekerja-jam = 40 × 18 × 8.",
    discussion: [
      "Total pekerja-jam = 40 × 18 × 8 = 5.760.",
      "Pekerja-jam baru per hari = 30 × 6 = 180.",
      "Hari = 5.760 ÷ 180 = 32 hari.",
    ],
  },
  {
    id: "p8",
    question: "Persediaan beras cukup untuk 24 orang selama 30 hari. Jika 6 orang lagi bergabung, berapa hari persediaan beras akan habis?",
    answers: ["24"],
    hint: "Total orang-hari = 24 × 30 = 720. Orang jadi 30.",
    discussion: [
      "Total orang-hari = 720.",
      "Orang sekarang = 30.",
      "Hari = 720 ÷ 30 = 24 hari.",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Pekerja, Hari, dan Hasil",
    visual: (
      <div className="text-center space-y-2">
        <p className="text-lg font-bold text-white">👷 6 pekerja × 5 hari → 240 m²</p>
        <p className="text-sm text-white/65">Hitung dulu hasil per 1 pekerja-hari.</p>
      </div>
    ),
    text: "Pada masalah campuran, biasakan hitung dulu nilai untuk 1 satuan kombinasi (per pekerja-hari, per orang-hari).",
  },
  {
    title: "Situasi: Persediaan dan Konsumen",
    visual: (
      <div className="text-center space-y-2">
        <p className="text-lg font-bold text-white">🍚 60 ekor × 24 hari = 1.440 ekor-hari</p>
        <p className="text-sm text-white/65">Total konsumsi tetap walaupun jumlah konsumen berubah.</p>
      </div>
    ),
    text: "Ekor-hari atau orang-hari membantu menyelesaikan masalah persediaan saat jumlah konsumen berubah.",
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Strategi Per-Satuan",
    text: "Cari hasil untuk 1 pekerja-hari atau 1 orang-hari, lalu kalikan dengan kondisi baru.",
    tone: "cyan",
  },
  { title: "Pekerjaan Tetap", text: "Pekerja × waktu = tetap. Pekerja naik → waktu turun.", tone: "yellow" },
  {
    title: "Pekerjaan Berubah",
    text: "Pekerja × waktu / hasil = tetap. Sesuaikan dua sisi sebelum menghitung.",
    tone: "emerald",
  },
];

const CampuranLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Perbandingan Campuran"
    intro="LKPD ini melatih Sobat Numatik menyelesaikan soal yang menggabungkan dua jenis perbandingan sekaligus."
    situations={situations}
    guidedIntro="Isilah pertanyaan berikut untuk menemukan strategi per pekerja-hari dan persamaan baku."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Identifikasi besaran apa yang berbalik dan apa yang senilai, lalu gunakan strategi per-satuan."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/perbandingan"
    backLabel="Kembali ke LKPD Perbandingan"
  />
);

export default CampuranLKPDPage;
