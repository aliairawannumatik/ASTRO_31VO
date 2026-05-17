import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Harga Beli (Modal)", content: `Harga beli atau modal adalah harga barang saat dibeli dari produsen, distributor, atau toko lain.\n\nContoh: Seorang pedagang membeli 1 lusin buku dengan harga Rp 50.000. Maka, harga beli 1 lusin buku tersebut adalah Rp 50.000.` },
  { heading: "B. Untung dan Rugi", content: `Untung: $\\text{Untung} = \\text{Harga Jual} - \\text{Harga Beli}$ (HJ > HB)\nRugi: $\\text{Rugi} = \\text{Harga Beli} - \\text{Harga Jual}$ (HJ < HB)\nImpas: Harga Jual = Harga Beli` },
  { heading: "C. Persentase Untung/Rugi", content: `$\\%U = \\dfrac{\\text{Untung}}{\\text{Harga Beli}} \\times 100\\%$\n\n$\\%R = \\dfrac{\\text{Rugi}}{\\text{Harga Beli}} \\times 100\\%$` },
  { heading: "D. Mencari Harga Jual", content: `Jika untung:\n$\\text{HJ} = \\dfrac{(100 + \\%U)}{100} \\times \\text{HB}$\n\nJika rugi:\n$\\text{HJ} = \\dfrac{(100 - \\%R)}{100} \\times \\text{HB}$\n\nMencari HB dari HJ dan persentase:\nJika untung: $\\text{HB} = \\dfrac{100}{100 + \\%U} \\times \\text{HJ}$\nJika rugi: $\\text{HB} = \\dfrac{100}{100 - \\%R} \\times \\text{HJ}$` },
  { heading: "E. Bunga Tunggal", content: `$B = M \\times W \\times P$\n\n- B = Besar bunga\n- M = Modal/pokok pinjaman\n- W = Waktu (dalam satuan yang sama dengan P)\n- P = Tingkat suku bunga per periode\n\nModal akhir: $M_1 = M(1 + WP)$` },
  { heading: "F. Diskon (Potongan Harga)", content: `- Besar Diskon = Persentase Diskon × Harga Awal\n- Harga Bayar = Harga Awal × (100% - Persentase Diskon)\n\nDiskon Ganda: Diskon 20% + 10% ≠ diskon 30%.\nHitung diskon pertama dulu, kemudian diskon kedua dari harga hasil diskon pertama.` },
  { heading: "G. Pajak (PPN & PPh)", content: `PPN:\n- Total Bayar = Harga × (100% + %PPN)\n\nPPh:\n- PKP = Penghasilan Bruto − PTKP\n- PPh = %PPh × PKP\n- Penghasilan Bersih = Penghasilan Bruto − PPh` },
  { heading: "H. Bruto, Netto, Tara", content: `- Bruto = Berat kotor (barang + kemasan)\n- Netto = Berat bersih (tanpa kemasan)\n- Tara = Berat kemasan\n- Bruto = Netto + Tara\n- Tara% = $\\dfrac{\\text{Tara}}{\\text{Bruto}} \\times 100\\%$` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Seorang pedagang membeli 60 kg mangga, kemudian dijual seharga Rp15.000,00 per kg. Jika pedagang mendapat keuntungan 20%, maka harga beli mangga tersebut adalah ...", options: ["A. Rp600.000,00", "B. Rp720.000,00", "C. Rp750.000,00", "D. Rp800.000,00"], jawaban: "C", pembahasan: "HJ = 60 × 15.000 = 900.000\n$\\text{HB} = \\frac{900.000}{1,2} = 750.000$ → Jawaban C" },
  { no: 2, soal: "Seorang pedagang membeli sepeda bekas. Setelah diperbaiki dengan biaya Rp200.000,00, sepeda dijual Rp1.040.000,00 sehingga untung 30%. Harga beli sepeda semula adalah ...", options: ["A. Rp500.000,00", "B. Rp600.000,00", "C. Rp700.000,00", "D. Rp800.000,00"], jawaban: "B", pembahasan: "HB total = $\\frac{1.040.000}{1,3} = 800.000$\nHB sepeda = 800.000 - 200.000 = 600.000 → Jawaban B" },
  { no: 3, soal: "Pak Setya membeli sekarung beras seharga Rp475.000,00. Isi beras 50 kg, ingin untung 20%. Harga jual per kg adalah ...", options: ["A. Rp12.400,00", "B. Rp12.000,00", "C. Rp11.400,00", "D. Rp11.000,00"], jawaban: "C", pembahasan: "HJ total = 475.000 × 1,2 = 570.000\nPer kg = 570.000 / 50 = 11.400 → Jawaban C" },
  { no: 4, soal: "Bima menyimpan uang Rp1.200.000,00 di bank bunga tunggal 15%/tahun. Setelah beberapa bulan jadi Rp1.260.000,00. Lama Bima menabung adalah ...", options: ["A. 3 bulan", "B. 4 bulan", "C. 5 bulan", "D. 6 bulan"], jawaban: "B", pembahasan: "Bunga = 60.000\n$W = \\frac{60.000}{1.200.000 \\times 0,15} = \\frac{1}{3}$ tahun = 4 bulan → Jawaban B" },
  { no: 5, soal: "Doni menyimpan Rp800.000,00 bunga tunggal 12%/tahun. Agar menjadi Rp872.000,00, Doni harus menabung selama ...", options: ["A. 9 bulan", "B. 7 bulan", "C. 6 bulan", "D. 4 bulan"], jawaban: "A", pembahasan: "Bunga = 72.000\n$W = \\frac{72.000}{800.000 \\times 0,12} = 0,75$ tahun = 9 bulan → Jawaban A" },
  { no: 6, soal: "Egi menabung Rp600.000,00. Setelah 10 bulan menjadi Rp640.000,00. Persentase bunga per tahun adalah ...", options: ["A. 6%", "B. 6,7%", "C. 8%", "D. 8,5%"], jawaban: "C", pembahasan: "Bunga = 40.000\n$P = \\frac{40.000}{600.000 \\times \\frac{10}{12}} = 0,08 = 8\\%$ → Jawaban C" },
  { no: 7, soal: "Nina menabung bunga tunggal 16%/tahun. Setelah 9 bulan uangnya Rp2.240.000,00. Tabungan awal Nina adalah ...", options: ["A. Rp1.800.000,00", "B. Rp1.900.000,00", "C. Rp2.000.000,00", "D. Rp2.100.000,00"], jawaban: "C", pembahasan: "$M \\times (1 + \\frac{9}{12} \\times 0,16) = 1,12M = 2.240.000$\n$M = 2.000.000$ → Jawaban C" },
  { no: 8, soal: "Pak Budi meminjam Rp4.800.000,00 bunga 24%/tahun, cicilan 2 tahun. Besar cicilan per bulan adalah ...", options: ["A. Rp296.000,00", "B. Rp269.000,00", "C. Rp260.000,00", "D. Rp209.000,00"], jawaban: "A", pembahasan: "Total bunga = 4.800.000 × 0,24 × 2 = 2.304.000\nTotal = 7.104.000, cicilan/bulan = 7.104.000/24 = 296.000 → Jawaban A" },
  { no: 11, soal: "Seorang pedagang membeli 1 karung beras Bruto 50 kg, Tara 2%, harga Rp5.000/kg. Dijual Rp12.000/kg netto. Total uang yang diperoleh dari penjualan adalah ...", options: ["A. Rp600.000,00", "B. Rp588.000,00", "C. Rp583.000,00", "D. Rp88.000,00"], jawaban: "B", pembahasan: "Tara = 2% × 50 = 1 kg, Netto = 49 kg\nPenjualan = 49 × 12.000 = 588.000 → Jawaban B" },
  { no: 13, soal: "Penjual untung Rp100.000,00 dari penjualan peti buah. HJ Rp15.000/kg netto. Bruto peti 60 kg, Tara 2 kg. Harga beli peti buah adalah ...", options: ["A. Rp900.000,00", "B. Rp870.000,00", "C. Rp800.000,00", "D. Rp770.000,00"], jawaban: "D", pembahasan: "Netto = 60 - 2 = 58 kg\nHJ = 58 × 15.000 = 870.000\nHB = 870.000 - 100.000 = 770.000 → Jawaban D" },
  { no: 14, soal: "Kargo berisi 20 kaleng biskuit, Bruto total 25 kg, Tara kargo 1 kg, Netto per kaleng 900 g. Berat tara satu kaleng biskuit adalah ...", options: ["A. 300 gram", "B. 500 gram", "C. 1.200 gram", "D. 1.150 gram"], jawaban: "A", pembahasan: "Berat 20 kaleng = 25-1 = 24 kg = 24.000 g\nPer kaleng = 1.200 g, Tara = 1.200-900 = 300 g → Jawaban A" },
  { no: 16, soal: "Aris membeli lemari Rp5.000.000,00. PPN 11%. Total bayar adalah ...", options: ["A. Rp6.100.000,00", "B. Rp5.500.000,00", "C. Rp5.055.000,00", "D. Rp5.550.000,00"], jawaban: "D", pembahasan: "Total = 5.000.000 × 1,11 = 5.550.000 → Jawaban D" },
  { no: 17, soal: "Restoran mencantumkan harga Rp50.000,00 (belum termasuk PPN 11%). Pelanggan membayar ...", options: ["A. Rp50.000,00", "B. Rp55.500,00", "C. Rp44.500,00", "D. Rp55.000,00"], jawaban: "B", pembahasan: "50.000 × 1,11 = 55.500 → Jawaban B" },
  { no: 18, soal: "Seseorang membayar Rp2.220.000,00 untuk barang yang harganya sudah termasuk PPN 11%. Harga sebelum PPN adalah ...", options: ["A. Rp2.000.000,00", "B. Rp2.464.200,00", "C. Rp1.980.000,00", "D. Rp2.100.000,00"], jawaban: "A", pembahasan: "Harga = 2.220.000 / 1,11 = 2.000.000 → Jawaban A" },
  { no: 19, soal: "Karyawan penghasilan Rp6.000.000/bulan, PTKP Rp4.500.000/bulan. Besar PKP adalah ...", options: ["A. Rp10.500.000,00", "B. Rp1.500.000,00", "C. Rp6.000.000,00", "D. Rp4.500.000,00"], jawaban: "B", pembahasan: "PKP = 6.000.000 - 4.500.000 = 1.500.000 → Jawaban B" },
  { no: 20, soal: "Pak Doni gaji Rp8.000.000/bulan, PTKP Rp5.000.000/bulan, PPh 5%. Besar PPh yang harus dibayar adalah ...", options: ["A. Rp250.000,00", "B. Rp400.000,00", "C. Rp650.000,00", "D. Rp150.000,00"], jawaban: "D", pembahasan: "PKP = 8.000.000 - 5.000.000 = 3.000.000\nPPh = 5% × 3.000.000 = 150.000 → Jawaban D" },
  { no: 21, soal: "Pekerja lepas upah Rp10.000.000, PTKP Rp6.000.000, PPh 10%. Penghasilan bersih yang ia terima adalah ...", options: ["A. Rp9.600.000,00", "B. Rp9.400.000,00", "C. Rp9.000.000,00", "D. Rp5.400.000,00"], jawaban: "A", pembahasan: "PKP = 4.000.000, PPh = 400.000\nTake-home = 10.000.000 - 400.000 = 9.600.000 → Jawaban A" },
];

const AritmetikaSosialPage = () => (
  <TKAPemantapanLayout
    title="ARITMETIKA SOSIAL"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default AritmetikaSosialPage;
