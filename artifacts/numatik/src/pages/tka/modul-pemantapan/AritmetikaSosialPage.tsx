import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Harga Beli (Modal)", content: `Harga beli atau modal adalah harga barang saat dibeli dari produsen, distributor, atau toko lain.\n\nContoh: Seorang pedagang membeli 1 lusin buku dengan harga Rp50.000. Harga beli 1 lusin buku tersebut adalah Rp50.000.` },
  { heading: "B. Untung dan Rugi", content: `Untung: $\\text{Untung} = \\text{Harga Jual} - \\text{Harga Beli}$ (HJ > HB)\nRugi: $\\text{Rugi} = \\text{Harga Beli} - \\text{Harga Jual}$ (HJ < HB)\nImpas: Harga Jual = Harga Beli` },
  { heading: "C. Persentase Untung/Rugi", content: `$\\%U = \\dfrac{\\text{Untung}}{\\text{Harga Beli}} \\times 100\\%$\n\n$\\%R = \\dfrac{\\text{Rugi}}{\\text{Harga Beli}} \\times 100\\%$` },
  { heading: "D. Mencari Harga Jual", content: `Jika untung: $\\text{HJ} = \\dfrac{(100 + \\%U)}{100} \\times \\text{HB}$\n\nJika rugi: $\\text{HJ} = \\dfrac{(100 - \\%R)}{100} \\times \\text{HB}$\n\nJika untung: $\\text{HB} = \\dfrac{100}{100 + \\%U} \\times \\text{HJ}$` },
  { heading: "E. Bunga Tunggal", content: `$B = M \\times W \\times P$\n\nB = besar bunga, M = modal, W = waktu, dan P = suku bunga per periode.\n\nModal akhir: $M_1 = M(1 + WP)$` },
  { heading: "F. Diskon (Potongan Harga)", content: `Besar diskon = Persentase diskon × Harga awal\n\nHarga bayar = Harga awal × (100% − Persentase diskon)\n\nDiskon ganda 20% + 10% tidak sama dengan diskon 30%.` },
  { heading: "G. Pajak (PPN & PPh)", content: `PPN: Total bayar = Harga × (100% + %PPN)\n\nPPh: PKP = Penghasilan bruto − PTKP\nPPh = %PPh × PKP\nPenghasilan bersih = Penghasilan bruto − PPh` },
  { heading: "H. Bruto, Netto, Tara", content: `Bruto = berat kotor (barang + kemasan)\nNetto = berat bersih (tanpa kemasan)\nTara = berat kemasan\n\nBruto = Netto + Tara` },
];

// 21 soal dibagi merata: 7 PG biasa, 7 PG kompleks (4 pernyataan), dan 7 PG benar-salah (3 pernyataan).
// Pola nomor: PG (1,4,7,10,13,16,19) · PGK (2,5,8,11,14,17,20) · PGKBS (3,6,9,12,15,18,21).
const latihanDasar: LatihanSoal[] = [
  {
    no: 1, type: "pg",
    soal: "Seorang pedagang membeli 60 kg mangga dan menjualnya Rp15.000,00 per kg. Jika untung 20%, harga beli seluruh mangga adalah ...",
    options: ["A. Rp600.000,00", "B. Rp720.000,00", "C. Rp750.000,00", "D. Rp800.000,00"], jawaban: "C",
    pembahasan: "Harga jual total $=60\\times15.000=900.000$. Karena HJ $=120\\%$ HB, maka HB $=900.000/1,2=750.000$. Jawaban C.",
  },
  {
    no: 2, type: "pgk",
    soal: "Sepeda bekas dijual Rp1.040.000,00 setelah diperbaiki dengan biaya Rp200.000,00 dan menghasilkan untung 30%. Pernyataan yang benar adalah ...",
    pernyataan: ["Modal total sepeda dan perbaikan adalah Rp800.000,00.", "Harga beli sepeda sebelum diperbaiki adalah Rp600.000,00.", "Keuntungan pedagang adalah Rp240.000,00.", "Harga beli sepeda semula adalah Rp800.000,00."],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua benar"], jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "Modal total $=1.040.000/1,3=800.000$. Harga beli sepeda $=800.000-200.000=600.000$. Keuntungan $=1.040.000-800.000=240.000$. Jadi (1), (2), dan (3) benar.",
  },
  {
    no: 3, type: "pgkbs",
    soal: "Beras seharga Rp475.000,00 dijual dengan untung 20% dalam karung berisi 50 kg. Tentukan Benar atau Salah!",
    pernyataan: ["Harga jual seluruh beras adalah Rp570.000,00.", "Harga jual beras per kg adalah Rp11.400,00.", "Harga beli beras per kg adalah Rp9.500,00."],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Harga jual total $=475.000\\times1,2=570.000$. Harga jual per kg $=570.000/50=11.400$ dan harga beli per kg $=475.000/50=9.500$.",
  },
  {
    no: 4, type: "pg",
    soal: "Bima menabung Rp1.200.000,00 dengan bunga tunggal 15% setahun. Tabungannya menjadi Rp1.260.000,00. Lama Bima menabung adalah ...",
    options: ["A. 3 bulan", "B. 4 bulan", "C. 5 bulan", "D. 6 bulan"], jawaban: "B",
    pembahasan: "Bunga $=60.000$. Dari $60.000=1.200.000\\times W\\times0,15$, diperoleh $W=1/3$ tahun = 4 bulan. Jawaban B.",
  },
  {
    no: 5, type: "pgk",
    soal: "Doni menabung Rp800.000,00 dengan bunga tunggal 12% per tahun hingga menjadi Rp872.000,00. Pernyataan yang benar adalah ...",
    pernyataan: ["Bunga yang diperoleh Doni Rp72.000,00.", "Lama menabung adalah 0,75 tahun.", "Lama menabung sama dengan 9 bulan.", "Doni menabung selama 6 bulan."],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua benar"], jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "Bunga $=72.000$. Dari $72.000=800.000\\times W\\times12\\%$, diperoleh $W=0,75$ tahun atau 9 bulan. Jadi (1), (2), dan (3) benar.",
  },
  {
    no: 6, type: "pgkbs",
    soal: "Egi menabung Rp600.000,00. Setelah 10 bulan tabungannya menjadi Rp640.000,00. Tentukan Benar atau Salah!",
    pernyataan: ["Bunga yang diperoleh Egi Rp40.000,00.", "Waktu menabung adalah $\\frac{10}{12}$ tahun.", "Persentase bunga tunggal per tahun adalah 8%."],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Bunga $=40.000$. Dengan $40.000=600.000\\times\\frac{10}{12}\\times P$, diperoleh $P=8\\%$.",
  },
  {
    no: 7, type: "pg",
    soal: "Nina menabung dengan bunga tunggal 16% setahun. Setelah 9 bulan uangnya menjadi Rp2.240.000,00. Tabungan awal Nina adalah ...",
    options: ["A. Rp1.800.000,00", "B. Rp1.900.000,00", "C. Rp2.000.000,00", "D. Rp2.100.000,00"], jawaban: "C",
    pembahasan: "$M_1=M(1+\\frac{9}{12}\\times0,16)=1,12M=2.240.000$, sehingga $M=2.000.000$. Jawaban C.",
  },
  {
    no: 8, type: "pgk",
    soal: "Pak Budi meminjam Rp4.800.000,00 dengan bunga 24% per tahun selama 2 tahun. Pernyataan yang benar adalah ...",
    pernyataan: ["Total bunga adalah Rp2.304.000,00.", "Total pengembalian adalah Rp7.104.000,00.", "Cicilan setiap bulan adalah Rp296.000,00.", "Cicilan setiap bulan adalah Rp260.000,00."],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua benar"], jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "Bunga $=4.800.000\\times24\\%\\times2=2.304.000$. Total $=7.104.000$ dan cicilan $=7.104.000/24=296.000$. Jadi (1), (2), dan (3) benar.",
  },
  {
    no: 9, type: "pgkbs",
    soal: "Harga sepatu Rp140.000,00 dan kaos Rp100.000,00. Diskon di Toko Damai 20% dan 25%, Tentram 25% dan 20%, Rukun 15% dan 30%, Sentosa 30% dan 15%. Tentukan Benar atau Salah!",
    pernyataan: ["Total pembayaran di Toko Damai Rp187.000,00.", "Total pembayaran di Toko Tentram Rp185.000,00.", "Toko Sentosa memberikan total termurah, yaitu Rp183.000,00."],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Damai $=112.000+75.000=187.000$, Tentram $=105.000+80.000=185.000$, dan Sentosa $=98.000+85.000=183.000$.",
  },
  {
    no: 10, type: "pg",
    soal: "Harga tas Rp80.000,00 diskon 15%, sandal Rp50.000,00 diskon 25%, dan sepatu Rp120.000,00 diskon 20%. Uang untuk membeli 3 tas, 2 sandal, dan 1 sepatu adalah ...",
    options: ["A. Rp360.000,00", "B. Rp365.000,00", "C. Rp370.000,00", "D. Rp375.000,00"], jawaban: "D",
    pembahasan: "Tas $=3(80.000\\times0,85)=204.000$, sandal $=2(50.000\\times0,75)=75.000$, sepatu $=96.000$. Total $=375.000$. Jawaban D.",
  },
  {
    no: 11, type: "pgk",
    soal: "Karung beras memiliki bruto 50 kg, tara 2%, dan harga jual Rp12.000,00 per kg netto. Pernyataan yang benar adalah ...",
    pernyataan: ["Tara karung adalah 1 kg.", "Netto beras adalah 49 kg.", "Total uang hasil penjualan Rp588.000,00.", "Total uang hasil penjualan Rp600.000,00."],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua benar"], jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "Tara $=2\\%\\times50=1$ kg, netto $=49$ kg, dan penjualan $=49\\times12.000=588.000$. Jadi (1), (2), dan (3) benar.",
  },
  {
    no: 12, type: "pgkbs",
    soal: "Toko A menjual bruto 100 kg dengan tara 2% seharga Rp1.000.000,00. Toko B menjual bruto 100 kg dengan tara 3% seharga Rp990.000,00. Tentukan Benar atau Salah!",
    pernyataan: ["Netto Toko A adalah 98 kg.", "Harga per kg netto Toko B sekitar Rp10.206.", "Toko A lebih murah per kg netto daripada Toko B."],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Harga/kg A $=1.000.000/98\\approx10.204$, sedangkan B $=990.000/97\\approx10.206$. Jadi A lebih murah.",
  },
  {
    no: 13, type: "pg",
    soal: "Seorang penjual mendapat untung Rp100.000,00. Ia menjual buah Rp15.000,00 per kg netto dari peti bruto 60 kg dengan tara 2 kg. Harga beli peti buah adalah ...",
    options: ["A. Rp900.000,00", "B. Rp870.000,00", "C. Rp800.000,00", "D. Rp770.000,00"], jawaban: "D",
    pembahasan: "Netto $=60-2=58$ kg. HJ $=58\\times15.000=870.000$. HB $=870.000-100.000=770.000$. Jawaban D.",
  },
  {
    no: 14, type: "pgk",
    soal: "Kargo berisi 20 kaleng memiliki bruto total 25 kg, tara kardus 1 kg, dan netto tiap kaleng 900 gram. Pernyataan yang benar adalah ...",
    pernyataan: ["Berat 20 kaleng tanpa kardus adalah 24 kg.", "Bruto satu kaleng adalah 1.200 gram.", "Tara satu kaleng adalah 300 gram.", "Netto satu kaleng adalah 1.200 gram."],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua benar"], jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "Berat kaleng $=25-1=24$ kg. Per kaleng $=24.000/20=1.200$ gram. Tara $=1.200-900=300$ gram. Jadi (1), (2), dan (3) benar.",
  },
  {
    no: 15, type: "pgkbs",
    soal: "Sebuah drum memiliki diskon tara 3% dan netto 97 kg. Tentukan Benar atau Salah!",
    pernyataan: ["Netto merupakan 97% dari bruto.", "Bruto drum adalah 100 kg.", "Tara drum adalah 3 kg."],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Bruto $=97/0,97=100$ kg dan tara $=3\\%\\times100=3$ kg.",
  },
  {
    no: 16, type: "pg",
    soal: "Aris membeli lemari Rp5.000.000,00 dan dikenai PPN 11%. Total uang yang harus dibayar adalah ...",
    options: ["A. Rp6.100.000,00", "B. Rp5.500.000,00", "C. Rp5.055.000,00", "D. Rp5.550.000,00"], jawaban: "D",
    pembahasan: "PPN $=11\\%\\times5.000.000=550.000$. Total $=5.550.000$. Jawaban D.",
  },
  {
    no: 17, type: "pgk",
    soal: "Harga makanan Rp50.000,00 belum termasuk PPN 11%. Pernyataan yang benar adalah ...",
    pernyataan: ["PPN yang ditambahkan Rp5.500,00.", "Total bayar Rp55.500,00.", "Total bayar dapat dihitung dengan $50.000\\times1,11$.", "Total bayar Rp55.000,00."],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua benar"], jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "PPN $=5.500$ dan total $=55.500$. Jadi (1), (2), dan (3) benar.",
  },
  {
    no: 18, type: "pgkbs",
    soal: "Seseorang membayar Rp2.220.000,00 untuk barang yang sudah termasuk PPN 11%. Tentukan Benar atau Salah!",
    pernyataan: ["Harga sebelum PPN adalah Rp2.000.000,00.", "PPN yang termasuk di dalam harga adalah Rp220.000,00.", "Harga sebelum PPN dapat dihitung dengan $2.220.000/1,11$."],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Harga awal $=2.220.000/1,11=2.000.000$, sehingga PPN $=220.000$.",
  },
  {
    no: 19, type: "pg",
    soal: "Gaji karyawan Rp6.000.000,00 per bulan dan PTKP Rp4.500.000,00 per bulan. PKP karyawan tersebut adalah ...",
    options: ["A. Rp10.500.000,00", "B. Rp1.500.000,00", "C. Rp6.000.000,00", "D. Rp4.500.000,00"], jawaban: "B",
    pembahasan: "PKP $=6.000.000-4.500.000=1.500.000$. Jawaban B.",
  },
  {
    no: 20, type: "pgk",
    soal: "Pak Doni mendapat gaji Rp8.000.000,00 dengan PTKP Rp5.000.000,00. Tarif PPh 5% dari PKP. Pernyataan yang benar adalah ...",
    pernyataan: ["PKP Pak Doni Rp3.000.000,00.", "PPh yang harus dibayar Rp150.000,00.", "Penghasilan bersihnya Rp7.850.000,00.", "PPh yang harus dibayar Rp400.000,00."],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. Semua benar"], jawaban: "B", jawabanPGK: [0, 1, 2],
    pembahasan: "PKP $=3.000.000$, PPh $=5\\%\\times3.000.000=150.000$, dan penghasilan bersih $=7.850.000$. Jadi (1), (2), dan (3) benar.",
  },
  {
    no: 21, type: "pgkbs",
    soal: "Pekerja lepas mendapat upah Rp10.000.000,00, PTKP Rp6.000.000,00, dan tarif PPh 10% dari PKP. Tentukan Benar atau Salah!",
    pernyataan: ["PKP pekerja tersebut Rp4.000.000,00.", "PPh yang harus dibayar Rp400.000,00.", "Penghasilan bersihnya Rp9.600.000,00."],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "PKP $=10.000.000-6.000.000=4.000.000$. PPh $=400.000$. Penghasilan bersih $=10.000.000-400.000=9.600.000$.",
  },
];

const AritmetikaSosialPage = () => (
  <TKAPemantapanLayout
    title="ARITMETIKA SOSIAL"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default AritmetikaSosialPage;