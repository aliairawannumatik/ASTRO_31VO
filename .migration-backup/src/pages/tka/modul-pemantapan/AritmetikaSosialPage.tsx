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
  { no: 1, soal: "Seorang pedagang membeli 60 kg mangga, kemudian dijual seharga Rp. 15.000,00 per kg. Jika pedagang tersebut mendapat keuntungan 20%, maka harga beli mangga tersebut adalah ...", options: ["A. Rp600.000,00", "B. Rp720.000,00", "C. Rp750.000,00", "D. Rp800.000,00"] , jawaban: "C", pembahasan: "Penjualan total = $60 \\times 15.000 = 900.000$. Untung 20\\% ⇒ HJ = 1.2 × HB.\n$\\text{HB} = \\dfrac{900.000}{1.2} = 750.000$. Jawaban C." },
  { no: 2, soal: "Seorang pedagang membeli sepeda bekas. Setelah diperbaiki kembali dengan biaya Rp200.000,00, sepeda tersebut dijual dengan harga Rp1.040.000,00 sehingga mendapat untung 30%. Harga beli sepeda semula adalah ...", options: ["A. Rp500.000,00", "B. Rp600.000,00", "C. Rp700.000,00", "D. Rp800.000,00"] , jawaban: "B", pembahasan: "HB total (sepeda + perbaikan) = $\\dfrac{1.040.000}{1.3} = 800.000$.\nHB sepeda awal = $800.000 - 200.000 = 600.000$. Jawaban B." },
  { no: 3, soal: "Pak Setya membeli sekarung beras seharga Rp.475.000,00. Beras itu akan dijual lagi dengan mengharapkan keuntungan sebesar 20%. Jika isi beras dalam karung adalah 50 kg, maka harga jual per kg dari beras adalah ...", options: ["A. Rp12.400,00", "B. Rp12.000,00", "C. Rp11.400,00", "D. Rp11.000,00"] , jawaban: "C", pembahasan: "HJ total = $475.000 \\times 1.2 = 570.000$. Per kg = $\\dfrac{570.000}{50} = 11.400$. Jawaban C." },
  { no: 4, soal: "Bima menyimpan uang sebesar Rp. 1.200.000,00 di sebuah bank dengan bunga tunggal 15% setahun. Setelah beberapa bulan ia mengambil seluruh tabungan beserta bunganya menjadi Rp.1.260.000,00. Lama Bima menabung adalah ...", options: ["A. 3 bulan", "B. 4 bulan", "C. 5 bulan", "D. 6 bulan"] , jawaban: "B", pembahasan: "Bunga = $1.260.000 - 1.200.000 = 60.000$.\n$B = M \\cdot W \\cdot P$: $60.000 = 1.200.000 \\cdot W \\cdot 0.15 \\Rightarrow W = \\dfrac{1}{3}$ tahun = 4 bulan. Jawaban B." },
  { no: 5, soal: "Doni menyimpan uang di bank sebesar Rp. 800.000,00 dengan bunga tunggal 12% pertahun. Agar jumlah tabungannya menjadi Rp. 872.000,00, Doni harus menabung selama ...", options: ["A. 9 bulan", "B. 7 bulan", "C. 6 bulan", "D. 4 bulan"] , jawaban: "A", pembahasan: "Bunga = $872.000 - 800.000 = 72.000$.\n$72.000 = 800.000 \\cdot W \\cdot 0.12 \\Rightarrow W = 0.75$ tahun = 9 bulan. Jawaban A." },
  { no: 6, soal: "Egi menabung Rp. 600.000,00 pada sebuah bank. Setelah 10 bulan tabungan Egi menjadi Rp. 640.000,00. Persentase bunga per tahun pada bank tersebut adalah ...", options: ["A. 6%", "B. 6,7%", "C. 8%", "D. 8,5%"] , jawaban: "C", pembahasan: "Bunga = $640.000 - 600.000 = 40.000$.\n$40.000 = 600.000 \\cdot \\dfrac{10}{12} \\cdot P \\Rightarrow P = 0.08 = 8\\%$. Jawaban C." },
  { no: 7, soal: "Nina menabung pada sebuah bank dengan bunga tunggal 16% setahun. Setelah 9 bulan uangnya menjadi Rp. 2.240.000,00. Tabungan awal Nina adalah ...", options: ["A. Rp. 1.800.000,00", "B. Rp. 1.900.000,00", "C. Rp. 2.000.000,00", "D. Rp. 2.100.000,00"] , jawaban: "C", pembahasan: "$M_1 = M(1 + W \\cdot P) = M\\left(1 + \\dfrac{9}{12} \\cdot 0.16\\right) = 1.12 M = 2.240.000$.\n$M = 2.000.000$. Jawaban C." },
  { no: 8, soal: "Pak Budi meminjam uang di koperasi sebesar Rp. 4.800.000,00. Ia dikenakan bunga 24% setahun. Ia berencana mengembalikan dalam 2 tahun. Besar cicilan yang harus dibayar tiap bulan adalah ...", options: ["A. Rp296.000,00", "B. Rp269.000,00", "C. Rp260.000,00", "D. Rp209.000,00"] , jawaban: "A", pembahasan: "Total bunga 2 tahun = $4.800.000 \\times 0.24 \\times 2 = 2.304.000$.\nTotal pengembalian = $7.104.000$. Cicilan/bulan = $\\dfrac{7.104.000}{24} = 296.000$. Jawaban A." },
  { no: 9, soal: "Data harga dan diskon sepatu dan kaos dari ke-empat toko sebagai berikut. Jika Febian akan membeli sepatu dan kaos, maka toko yang dipilihnya adalah ...", options: ["A. Toko Damai", "B. Toko Tentram", "C. Toko Rukun", "D. Toko Sentosa"], svgQuestion: (
    <svg viewBox="0 0 400 86" width="100%" style={{maxWidth:"400px"}} className="my-2 block mx-auto">
      {/* Border colors */}
      {/* Outer rect */}
      <rect x="0.5" y="0.5" width="399" height="85" fill="none" stroke="#67e8f9" strokeWidth="1"/>
      {/* Row dividers */}
      <line x1="0" y1="20" x2="400" y2="20" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="0" y1="42" x2="400" y2="42" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="0" y1="64" x2="400" y2="64" stroke="#67e8f9" strokeWidth="1"/>
      {/* Col dividers */}
      <line x1="65" y1="0" x2="65" y2="86" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="145" y1="0" x2="145" y2="86" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="210" y1="20" x2="210" y2="86" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="275" y1="20" x2="275" y2="86" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="335" y1="20" x2="335" y2="86" stroke="#67e8f9" strokeWidth="1"/>
      {/* Header backgrounds */}
      <rect x="1" y="1" width="64" height="41" fill="rgba(103,232,249,0.12)"/>
      <rect x="66" y="1" width="79" height="41" fill="rgba(103,232,249,0.12)"/>
      <rect x="146" y="1" width="253" height="19" fill="rgba(103,232,249,0.18)"/>
      <rect x="146" y="21" width="253" height="21" fill="rgba(103,232,249,0.10)"/>
      {/* "Diskon Toko" spanning header */}
      <text x="272" y="14" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">Diskon Toko</text>
      {/* Column headers row 2 */}
      <text x="32" y="34" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Barang</text>
      <text x="105" y="28" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Harga</text>
      <text x="105" y="39" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">(Rp)</text>
      <text x="177" y="34" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Damai</text>
      <text x="242" y="34" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Tentram</text>
      <text x="305" y="34" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Rukun</text>
      <text x="367" y="34" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Sentosa</text>
      {/* Row: Sepatu */}
      <text x="32" y="57" fill="#facc15" fontSize="9" textAnchor="middle">Sepatu</text>
      <text x="105" y="57" fill="#ffffff" fontSize="9" textAnchor="middle">140.000</text>
      <text x="177" y="57" fill="#ffffff" fontSize="9" textAnchor="middle">20%</text>
      <text x="242" y="57" fill="#ffffff" fontSize="9" textAnchor="middle">25%</text>
      <text x="305" y="57" fill="#ffffff" fontSize="9" textAnchor="middle">15%</text>
      <text x="367" y="57" fill="#ffffff" fontSize="9" textAnchor="middle">30%</text>
      {/* Row: Kaos */}
      <text x="32" y="79" fill="#facc15" fontSize="9" textAnchor="middle">Kaos</text>
      <text x="105" y="79" fill="#ffffff" fontSize="9" textAnchor="middle">100.000</text>
      <text x="177" y="79" fill="#ffffff" fontSize="9" textAnchor="middle">25%</text>
      <text x="242" y="79" fill="#ffffff" fontSize="9" textAnchor="middle">20%</text>
      <text x="305" y="79" fill="#ffffff" fontSize="9" textAnchor="middle">30%</text>
      <text x="367" y="79" fill="#ffffff" fontSize="9" textAnchor="middle">15%</text>
    </svg>
  ) , jawaban: "D", pembahasan: "Total bayar per toko (sepatu 140.000, kaos 100.000):\nDamai (20\\%, 25\\%): $112.000 + 75.000 = 187.000$\nTentram (25\\%, 20\\%): $105.000 + 80.000 = 185.000$\nRukun (15\\%, 30\\%): $119.000 + 70.000 = 189.000$\nSentosa (30\\%, 15\\%): $98.000 + 85.000 = 183.000$\nTermurah: Sentosa. Jawaban D." },
  { no: 10, soal: "Perhatikan tabel berikut! Jika Rani akan membeli 3 tas, 2 sendal dan 1 sepatu, maka uang yang harus dibayarkan adalah ...", options: ["A. Rp.360.000,00", "B. Rp.365.000,00", "C. Rp.370.000,00", "D. Rp.375.000,00"], svgQuestion: (
    <svg viewBox="0 0 300 86" width="100%" style={{maxWidth:"300px"}} className="my-2 block mx-auto">
      <rect x="0.5" y="0.5" width="299" height="85" fill="none" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="0" y1="22" x2="300" y2="22" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="0" y1="44" x2="300" y2="44" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="0" y1="65" x2="300" y2="65" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="75" y1="0" x2="75" y2="86" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="210" y1="0" x2="210" y2="86" stroke="#67e8f9" strokeWidth="1"/>
      <rect x="1" y="1" width="299" height="21" fill="rgba(103,232,249,0.18)"/>
      <text x="37" y="15" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">Jenis</text>
      <text x="142" y="15" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">Harga</text>
      <text x="254" y="15" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">Disc</text>
      <text x="37" y="37" fill="#facc15" fontSize="9" textAnchor="middle">Tas</text>
      <text x="142" y="37" fill="#ffffff" fontSize="9" textAnchor="middle">Rp. 80.000,00</text>
      <text x="254" y="37" fill="#ffffff" fontSize="9" textAnchor="middle">15%</text>
      <text x="37" y="58" fill="#facc15" fontSize="9" textAnchor="middle">Sendal</text>
      <text x="142" y="58" fill="#ffffff" fontSize="9" textAnchor="middle">Rp 50.000,00</text>
      <text x="254" y="58" fill="#ffffff" fontSize="9" textAnchor="middle">25%</text>
      <text x="37" y="79" fill="#facc15" fontSize="9" textAnchor="middle">Sepatu</text>
      <text x="142" y="79" fill="#ffffff" fontSize="9" textAnchor="middle">Rp 120.000,00</text>
      <text x="254" y="79" fill="#ffffff" fontSize="9" textAnchor="middle">20%</text>
    </svg>
  ) , jawaban: "D", pembahasan: "Tas: $80.000 \\times 0.85 = 68.000$, 3 tas = $204.000$.\nSendal: $50.000 \\times 0.75 = 37.500$, 2 sendal = $75.000$.\nSepatu: $120.000 \\times 0.8 = 96.000$.\nTotal = $204.000 + 75.000 + 96.000 = 375.000$. Jawaban D." },
  { no: 11, soal: "Seorang pedagang membeli satu karung beras dengan Bruto 50 kg dan Tara 2%. Harga pembelian karung beras tersebut adalah Rp5.000,00. Pedagang itu kemudian menjual beras tersebut secara eceran dengan harga Rp12.000,00 per kg (netto).\nBerapakah total uang yang diperoleh pedagang tersebut dari penjualan satu karung beras?", options: ["A. Rp600.000,00", "B. Rp588.000,00", "C. Rp583.000,00", "D. Rp88.000,00"] , jawaban: "B", pembahasan: "Tara = $2\\% \\times 50 = 1$ kg. Netto = $50 - 1 = 49$ kg.\nPenjualan = $49 \\times 12.000 = 588.000$. Jawaban B." },
  { no: 12, soal: "Seorang pembeli ingin mendapatkan harga beras (netto) yang paling murah. Ia membandingkan dua penawaran:\n• Toko A: Menjual 1 karung dengan Bruto 100 kg, Tara 2%, seharga Rp1.000.000,00.\n• Toko B: Menjual 1 karung dengan Bruto 100 kg, Tara 3%, seharga Rp990.000,00.\nDi toko manakah pembeli tersebut seharusnya berbelanja untuk mendapatkan harga per kg netto termurah?", options: ["A. Toko A, karena harga per kg netto sekitar Rp10.204", "B. Toko B, karena harga per kg netto sekitar Rp10.206", "C. Toko B, karena harga karungnya lebih murah (Rp990.000)", "D. Sama saja, karena brutonya sama-sama 100 kg"] , jawaban: "A", pembahasan: "Toko A: Netto = 98 kg, harga/kg = $\\dfrac{1.000.000}{98} \\approx 10.204$.\nToko B: Netto = 97 kg, harga/kg = $\\dfrac{990.000}{97} \\approx 10.206$.\nToko A lebih murah per kg netto. Jawaban A." },
  { no: 13, soal: "Seorang penjual mendapat keuntungan total Rp100.000,00 setelah berhasil menjual habis satu peti buah. Ia menjual buah tersebut dengan harga Rp15.000,00 per kg (netto). Peti buah yang ia beli memiliki Bruto 60 kg dan Tara (berat peti) 2 kg.\nBerapakah harga beli (modal) peti buah tersebut pada awalnya?", options: ["A. Rp900.000,00", "B. Rp870.000,00", "C. Rp800.000,00", "D. Rp770.000,00"] , jawaban: "D", pembahasan: "Netto = $60 - 2 = 58$ kg. HJ total = $58 \\times 15.000 = 870.000$.\nHB = HJ - Untung = $870.000 - 100.000 = 770.000$. Jawaban D." },
  { no: 14, soal: "Sebuah kargo berisi 20 kaleng biskuit identik ditimbang dan berat kotor (Bruto) totalnya adalah 25 kg. Diketahui berat kardus kargo (Tara kargo) adalah 1 kg. Jika berat netto (biskuit) di setiap kaleng adalah 900 gram, berapakah berat tara (kemasan kaleng) dari satu kaleng biskuit?", options: ["A. 300 gram", "B. 500 gram", "C. 1.200 gram", "D. 1.150 gram"] , jawaban: "A", pembahasan: "Berat 20 kaleng = $25 - 1 = 24$ kg = $24.000$ g. Per kaleng (kotor) = $1.200$ g.\nTara per kaleng = $1.200 - 900 = 300$ g. Jawaban A." },
  { no: 15, soal: "Sebuah toko membeli satu drum minyak goreng dengan diskon tara (potongan berat) 3%. Setelah ditimbang, berat bersih (Netto) minyak yang diterima toko adalah 97 kg. Berapakah Bruto drum minyak tersebut sebelum dihitung diskon taranya?", options: ["A. 99,91 kg", "B. 94,09 kg", "C. 100 kg", "D. 103 kg"] , jawaban: "C", pembahasan: "Netto = $97\\% \\times \\text{Bruto} \\Rightarrow \\text{Bruto} = \\dfrac{97}{0.97} = 100$ kg. Jawaban C." },
  { no: 16, soal: "Aris membeli sebuah lemari dengan harga Rp5.000.000,00. Jika Pajak Pertambahan Nilai (PPN) yang dikenakan adalah 11%, berapa total uang yang harus dibayar Budi?", options: ["A. Rp6.100.000,00", "B. Rp5.500.000,00", "C. Rp5.055.000,00", "D. Rp5.550.000,00"] , jawaban: "D", pembahasan: "Total = $5.000.000 \\times 1.11 = 5.550.000$. Jawaban D." },
  { no: 17, soal: "Sebuah restoran mencantumkan harga makanan di menu sebesar Rp50.000,00. Di bagian bawah menu tertulis \"Harga belum termasuk PPN 11%\". Berapa yang harus dibayar pelanggan?", options: ["A. Rp50.000,00", "B. Rp55.500,00", "C. Rp44.500,00", "D. Rp55.000,00"] , jawaban: "B", pembahasan: "Total bayar = $50.000 \\times 1.11 = 55.500$. Jawaban B." },
  { no: 18, soal: "Seseorang membayar Rp2.220.000,00 untuk sebuah barang yang harganya sudah termasuk PPN 11%. Berapa harga barang tersebut sebelum dikenakan PPN?", options: ["A. Rp2.000.000,00", "B. Rp2.464.200,00", "C. Rp1.980.000,00", "D. Rp2.100.000,00"] , jawaban: "A", pembahasan: "Harga sebelum PPN = $\\dfrac{2.220.000}{1.11} = 2.000.000$. Jawaban A." },
  { no: 19, soal: "Seorang karyawan memiliki penghasilan (gaji) sebesar Rp6.000.000,00 per bulan. Batas Penghasilan Tidak Kena Pajak (PTKP) ditetapkan sebesar Rp4.500.000,00 per bulan. Berapakah besar Penghasilan Kena Pajak (PKP) karyawan tersebut?", options: ["A. Rp10.500.000,00", "B. Rp1.500.000,00", "C. Rp6.000.000,00", "D. Rp4.500.000,00"] , jawaban: "B", pembahasan: "PKP = Penghasilan - PTKP = $6.000.000 - 4.500.000 = 1.500.000$. Jawaban B." },
  { no: 20, soal: "Pak Doni mendapat gaji Rp8.000.000,00 sebulan dengan Penghasilan Tidak Kena Pajak (PTKP) Rp5.000.000,00. Jika tarif Pajak Penghasilan (PPh) adalah 5% dari PKP, berapakah besar PPh yang harus dibayar Pak Doni?", options: ["A. Rp250.000,00", "B. Rp400.000,00", "C. Rp650.000,00", "D. Rp150.000,00"] , jawaban: "D", pembahasan: "PKP = $8.000.000 - 5.000.000 = 3.000.000$. PPh = $5\\% \\times 3.000.000 = 150.000$. Jawaban D." },
  { no: 21, soal: "Seorang pekerja lepas mendapat upah Rp10.000.000,00. PTKP untuknya adalah Rp6.000.000,00. Tarif PPh ditetapkan 10% dari PKP. Berapa penghasilan bersih (take-home pay) yang ia terima?", options: ["A. Rp9.600.000,00", "B. Rp9.400.000,00", "C. Rp9.000.000,00", "D. Rp5.400.000,00"] , jawaban: "A", pembahasan: "PKP = Upah - PTKP = $10.000.000 - 6.000.000 = 4.000.000$.\nPPh = $10\\% \\times 4.000.000 = 400.000$.\nTake-home = $10.000.000 - 400.000 = 9.600.000$. Jawaban A." },
];

const AritmetikaSosialPage = () => (
  <TKAPemantapanLayout
    title="ARITMETIKA SOSIAL"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default AritmetikaSosialPage;
