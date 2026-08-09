import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Statistika", content: `Statistika adalah ilmu yang mempelajari cara pengumpulan, pengolahan, penyajian, dan analisis data.\n\nJenis data:\n- Data kualitatif: bukan berupa angka (warna, jenis kelamin)\n- Data kuantitatif: berupa angka (berat, tinggi, nilai)\n  - Data diskrit: hasil hitungan (jumlah siswa)\n  - Data kontinu: hasil pengukuran (tinggi badan)` },
  { heading: "B. Ukuran Pemusatan Data", content: `1. Mean (Rata-rata):\n$\\bar{x} = \\dfrac{\\sum x_i}{n}$\n\n2. Median (Nilai Tengah):\n- Data ganjil: nilai tengah setelah diurutkan\n- Data genap: rata-rata dua nilai tengah\n\n3. Modus: nilai yang paling sering muncul` },
  { heading: "C. Ukuran Penyebaran Data", content: `1. Jangkauan (Range): nilai max − nilai min\n\n2. Kuartil:\n- Q1 = kuartil bawah (25%)\n- Q2 = median (50%)\n- Q3 = kuartil atas (75%)\n- Jangkauan interkuartil (IQR) = Q3 − Q1\n\n3. Simpangan baku (standar deviasi):\n$SD = \\sqrt{\\dfrac{\\sum(x_i - \\bar{x})^2}{n}}$` },
  { heading: "D. Penyajian Data", content: `1. Tabel frekuensi\n2. Diagram batang\n3. Diagram garis\n4. Diagram lingkaran (pie chart)\n5. Histogram\n6. Ogive (poligon frekuensi kumulatif)\n\nFrekuensi relatif = $\\dfrac{f_i}{n} \\times 100\\%$` },
];

// ─── Contoh Soal — TES KEMAMPUAN AKADEMIK · MODUL PEMANTAPAN 2026–2027 ───
const contohSoal: LatihanSoal[] = [
  {
    no: 1, type: "pg",
    soal: "Rata-rata dari data: $6, 7, 8, 9, 10$ adalah ...",
    options: ["A. $7$", "B. $7{,}5$", "C. $8$", "D. $8{,}5$"],
    jawaban: "C",
    pembahasan: "Trik dan Tips:\nRata-rata $=$ jumlah semua data $\\div$ banyak data.\n\nStep by Step Penyelesaian:\n$$\\bar{x}=\\frac{6+7+8+9+10}{5}=\\frac{40}{5}=8$$\n\nJawaban: C",
  },
  {
    no: 2, type: "pgk",
    soal: "Diberikan data: $4, 6, 6, 8, 10, 10, 10, 12$. Perhatikan pernyataan berikut!",
    pernyataan: [
      "Modus data tersebut adalah $10$.",
      "Median data tersebut adalah $9$.",
      "Mean data tersebut adalah $8{,}25$.",
      "Jangkauan (range) data tersebut adalah $6$.",
    ],
    jawabanPGK: [0, 1, 2],
    pembahasan: "Trik dan Tips:\nModus $=$ data yang paling sering muncul. Median (n genap) $=$ rata-rata dua data tengah. Jangkauan $=$ data terbesar $-$ data terkecil.\n\nStep by Step Penyelesaian:\n(1) BENAR: $10$ muncul $3$ kali (terbanyak).\n\n(2) BENAR: data ke-4 dan ke-5 adalah $8$ dan $10$, rata-ratanya $9$.\n\n(3) BENAR: jumlah $=66$, $66/8=8{,}25$.\n\n(4) SALAH: jangkauan $=12-4=8$, bukan $6$.\n\nJawaban: (1), (2), dan (3) BENAR",
  },
  {
    no: 3, type: "pgkbs",
    soal: "Nilai ulangan $10$ siswa terdiri dari: $5$ siswa mendapat nilai $80$, $3$ siswa mendapat nilai $90$, dan $2$ siswa mendapat nilai $70$. Tentukan kebenaran pernyataan berikut!",
    pernyataan: [
      "Rata-rata nilai kelas adalah $81$.",
      "Modus nilai kelas tersebut adalah $80$.",
      "Jika $1$ siswa bernilai $70$ diganti menjadi $100$, rata-rata baru menjadi $85$.",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Trik dan Tips:\nUntuk data berkelompok, rata-rata $=\\frac{\\sum(\\text{nilai}\\times\\text{frekuensi})}{\\text{total frekuensi}}$.\n\nStep by Step Penyelesaian:\nRata-rata $=\\frac{5(80)+3(90)+2(70)}{10}=\\frac{810}{10}=81$ (BENAR).\n\nModus $=80$ (muncul $5$ kali, terbanyak) (BENAR).\n\nJumlah baru $=810-70+100=840$, rata-rata baru $=840/10=84$, bukan $85$ (SALAH).",
  },
  {
    no: 4, type: "pg",
    soal: "Median dari data: $12, 15, 11, 18, 14, 17, 13$ adalah ...",
    options: ["A. $13$", "B. $14$", "C. $15$", "D. $17$"],
    jawaban: "B",
    pembahasan: "Trik dan Tips:\nUrutkan data terlebih dahulu, lalu ambil nilai tengah (untuk $n$ ganjil).\n\nStep by Step Penyelesaian:\nUrutan: $11, 12, 13, 14, 15, 17, 18$ ($n=7$).\n\nMedian $=$ data ke-$4=14$.\n\nJawaban: B",
  },
  {
    no: 5, type: "pg",
    soal: "Jangkauan (range) dari data: $23, 45, 12, 67, 34, 19$ adalah ...",
    options: ["A. $45$", "B. $50$", "C. $55$", "D. $60$"],
    jawaban: "C",
    pembahasan: "Trik dan Tips:\nJangkauan $=$ data terbesar $-$ data terkecil.\n\nStep by Step Penyelesaian:\n$$67-12=55$$\n\nJawaban: C",
  },
  {
    no: 6, type: "pgk",
    soal: "Nilai ujian $5$ siswa adalah: $70, 75, 80, 85, 90$. Perhatikan pernyataan berikut!",
    pernyataan: [
      "Rata-rata data tersebut adalah $80$.",
      "Median data tersebut adalah $80$.",
      "Simpangan rata-rata (mean deviation) data tersebut adalah $6$.",
      "Semua data berada di atas rata-rata.",
    ],
    jawabanPGK: [0, 1, 2],
    pembahasan: "Trik dan Tips:\nSimpangan rata-rata $=\\frac{\\sum|x_i-\\bar{x}|}{n}$.\n\nStep by Step Penyelesaian:\n(1) BENAR: $\\frac{70+75+80+85+90}{5}=80$.\n\n(2) BENAR: data sudah terurut, nilai tengah $=80$.\n\n(3) BENAR: $|{-10}|+|{-5}|+0+5+10=30$, $30/5=6$.\n\n(4) SALAH: $70$ dan $75$ berada di bawah rata-rata $80$.\n\nJawaban: (1), (2), dan (3) BENAR",
  },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Diketahui data berikut: 85, 90, 70, 80, 70, 65, 80, 85, 70, 80, 95, 70. Modus dan median data tersebut berturut-turut adalah ...", options: ["A. 65 dan 80", "B. 70 dan 80", "C. 75 dan 70", "D. 80 dan 75"] },
  { no: 2, soal: "Median dan mean dari data: 5, 5, 7, 3, 2, 5, 6, 9, 7, 10, 7, 7 berturut-turut adalah ...", options: ["A. 5,5 dan 6,1", "B. 5,5 dan 7,0", "C. 6,5 dan 6,1", "D. 6,5 dan 7,0"] },
  { no: 3, soal: "Nilai matematika siswa disajikan dalam tabel berikut:\nNilai: 4, 5, 6, 7, 8, 9, 10\nBanyak siswa: 2, 4, 5, 5, 9, 3, 4\nMedian dari data di atas adalah ...", options: ["A. 6,5", "B. 7,0", "C. 7,5", "D. 8,0"] },
  { no: 4, soal: "Perhatikan tabel berikut!\nNilai: 3, 4, 5, 6, 7, 8, 9, 10\nFrekuensi: 2, 5, 5, 3, 4, 4, 4, 3\nPernyataan yang benar dari tabel di atas adalah ...", options: ["A. Modus dari data 5", "B. Median data 6,5", "C. Rata-rata data 6,6", "D. Jangkauan data 6"] },
  { no: 5, soal: "Diagram batang menunjukan nilai ulangan matematika diperoleh dari 20 anak pada suatu kelas. Tinggi batang untuk nilai 6 = 2, nilai 7 = 4, nilai 8 = 6, nilai 9 = 5, nilai 10 = 3. Rataan (Mean) dari data tersebut adalah ...", options: ["A. 7", "B. 7,5", "C. 8", "D. 8,5"] },
  { no: 6, soal: "Dalam sebuah kelas, nilai rata-rata siswa putra adalah 7,2, sedangkan rata-rata kelompok putri adalah 8,1. Jika nilai rata-rata kelas adalah 7,5, maka perbandingan banyak putra dan siswa putri adalah ...", options: ["A. 2 : 1", "B. 1 : 2", "C. 1 : 3", "D. 2 : 3"] },
  { no: 7, soal: "Nilai rata-rata ulangan matematika siswa perempuan 75 dan siswa laki-laki adalah 66 dan rata-rata nilai keseluruhan siswa kelas tersebut adalah 72. Jika dalam kelas tersebut terdapat 36 siswa, banyak siswa laki-laki adalah ...", options: ["A. 12 orang", "B. 16 orang", "C. 18 orang", "D. 24 orang"] },
  { no: 8, soal: "Rata-rata nilai remedial 20 siswa adalah 7, rata-rata nilai siswa laki-laki adalah 6 dan rata-rata nilai siswa perempuan adalah 8,5. Selisih banyak siswa laki-laki dan perempuan adalah ...", options: ["A. 8", "B. 6", "C. 4", "D. 3"] },
  { no: 9, soal: "Diagram lingkaran menunjukan tentang kegemaran siswa terhadap mata pelajaran. Persentase: Matematika 30°, IPA 54°, IPS 48°, Bahasa 72°, Penjas X°. Jika jumlah siswa seluruhnya 240 orang, jumlah siswa yang gemar penjas adalah ...", options: ["A. 76 orang", "B. 90 orang", "C. 104 orang", "D. 156 orang"] },
  { no: 10, soal: "Data koleksi jenis buku di sebuah perpustakaan tersaji dalam diagram lingkaran. Persentase: Kesenian 20%, Kesehatan 18%, Pertanian 25%, Teknologi 22%, Lainnya 15%. Jika banyak buku kesenian 200 eksemplar, banyak buku kesehatan .... eksemplar", options: ["A. 180", "B. 200", "C. 210", "D. 220"] },
  { no: 11, soal: "Diagram garis menunjukan penyusutan harga mobil setelah dipakai dalam kurun waktu 5 tahun. Harga 2015: Rp 110.000.000, harga 2016: Rp 102.500.000. Besarnya penyusutan antara tahun 2015 dan 2016 adalah ...", options: ["A. Rp 2.500.000,00", "B. Rp 5.000.000,00", "C. Rp 5.500.000,00", "D. Rp 7.500.000,00"] },
  { no: 12, soal: "Perhatikan tabel perolehan nilai berikut.\nNilai: 3, 4, 5, 6, 7, 8, 9\nFrekuensi: 2, 3, 4, 5, 3, 2, 1\nBanyaknya siswa yang memperoleh nilai lebih dari nilai rata-rata adalah ...", options: ["A. 6 orang", "B. 9 orang", "C. 11 orang", "D. 15 orang"] },
  { no: 13, soal: "Suatu hari Ani menemukan sobekan kertas koran yang memuat data pengunjung perpustakaan berupa gambar diagram batang. Rata-rata pengunjung 41 orang selama lima hari. Data tersedia: Senin = 30, Selasa = 45, Rabu = ?, Kamis = 50, Jumat = 25. Tolong bantu Ani mencari banyak pengunjung pada hari Rabu ...", options: ["A. 55 orang", "B. 60 orang", "C. 65 orang", "D. 70 orang"] },
  { no: 14, soal: "Ada 25 murid perempuan dalam sebuah kelas. Rata-rata tinggi mereka adalah 130 cm. Pernyataan yang benar adalah ...", options: ["A. Jika ada seorang murid perempuan dengan tinggi 132 cm, maka pasti ada seorang murid perempuan dengan tinggi 128 cm.", "B. Jika 23 orang dari murid perempuan tersebut tingginya masing-masing 130 cm dan satu orang tingginya 133 cm, maka satu lagi tingginya 127 cm.", "C. Jika anda mengurutkan semua perempuan tersebut dari yang terpendek sampai yang tertinggi, maka yang di tengah pasti mempunyai tinggi 130 cm.", "D. Setengah dari perempuan di kelas pasti di bawah 130 cm dan setengahnya lagi pasti di atas 130 cm."] },
  { no: 15, soal: "Disajikan data sebagai berikut: 4, 7, 4, 6, 10, 5, 6, 3, 8, 5, 8, 9. Kuartil atas ($Q_3$) dari data tersebut adalah ...", options: ["A. 6", "B. 7", "C. 7,5", "D. 8"] },
];

const StatistikaPage = () => (
  <TKAPemantapanLayout
    title="STATISTIKA"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
    contohSoal={contohSoal}
  />
);

export default StatistikaPage;
