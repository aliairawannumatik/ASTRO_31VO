import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const materiSection = {
  title: "MATERI - ARITMETIKA SOSIAL",
  sections: [
    {
      heading: "A. Harga Beli (Modal)",
      content: `Harga beli atau modal adalah harga barang saat dibeli dari produsen, distributor, atau toko lain. Ini adalah uang yang dikeluarkan oleh seorang pedagang untuk mendapatkan suatu barang sebelum dijual kembali. Harga beli seringkali termasuk biaya tambahan seperti ongkos kirim atau biaya operasional lainnya.

Contoh: Seorang pedagang membeli 1 lusin buku dengan harga Rp 50.000. Maka, harga beli 1 lusin buku tersebut adalah Rp 50.000.`
    },
    {
      heading: "B. Harga Jual",
      content: `Harga jual adalah harga barang saat dijual kepada konsumen. Ini adalah uang yang diterima oleh seorang pedagang setelah menjual barangnya.

Contoh: Pedagang buku tersebut menjual 1 lusin bukunya dengan harga Rp 75.000. Maka, harga jual 1 lusin buku tersebut adalah Rp 75.000.`
    },
    {
      heading: "C. Untung (Laba)",
      content: `Untung atau laba terjadi ketika harga jual lebih besar daripada harga beli. Ini berarti pedagang mendapatkan keuntungan dari transaksi jual beli.

Rumus Untung:
$\\text{Untung} = \\text{Harga Jual} - \\text{Harga Beli}$

Contoh: Harga Beli buku = Rp 50.000, Harga Jual buku = Rp 75.000
Untung = Rp 75.000 - Rp 50.000 = Rp 25.000`
    },
    {
      heading: "D. Rugi",
      content: `Rugi terjadi ketika harga jual lebih kecil daripada harga beli. Ini berarti pedagang mengalami kerugian dari transaksi jual beli.

Rumus Rugi:
$\\text{Rugi} = \\text{Harga Beli} - \\text{Harga Jual}$

Contoh: Jika pedagang buku tersebut hanya berhasil menjual buku dengan harga Rp 40.000 (karena rusak atau lainnya).
Rugi = Rp 50.000 - Rp 40.000 = Rp 10.000`
    },
    {
      heading: "E. Impas (Titik Balik Modal)",
      content: `Impas atau balik modal terjadi ketika harga jual sama dengan harga beli. Pada kondisi ini, pedagang tidak mendapatkan untung maupun mengalami rugi.

Rumus Impas:
$\\text{Harga Jual} = \\text{Harga Beli}$`
    },
    {
      heading: "F. Persentase Untung",
      content: `Persentase untung adalah perbandingan antara besar untung dengan harga beli, dinyatakan dalam bentuk persentase.

Rumus Persentase Untung:
$\\%U = \\frac{\\text{Untung}}{\\text{Harga Beli}} \\times 100\\%$

Contoh: Untung = Rp 25.000, Harga Beli = Rp 50.000 maka:
$\\%U = \\frac{25.000}{50.000} \\times 100\\% = 50\\%$`
    },
    {
      heading: "G. Persentase Rugi",
      content: `Persentase rugi adalah perbandingan antara besar rugi dengan harga beli, dinyatakan dalam bentuk persentase.

Rumus Persentase Rugi:
$\\%R = \\frac{\\text{Rugi}}{\\text{Harga Beli}} \\times 100\\%$

Contoh: Rugi = Rp 10.000, Harga Beli = Rp 50.000, maka:
$\\%R = \\frac{10.000}{50.000} \\times 100\\% = 20\\%$`
    },
    {
      heading: "H. Mencari Harga Jual",
      content: `1. Mencari Harga Jual Jika Untung
$\\text{Harga Jual} = \\frac{(100 + \\%U)}{100} \\times \\text{Harga Beli}$

2. Mencari Harga Jual Jika Rugi
$\\text{Harga Jual} = \\frac{(100 - \\%R)}{100} \\times \\text{Harga Beli}$

3. Mencari Harga Beli Jika Diketahui Harga Jual dan Persentase Untung/Rugi
Jika Untung:
$\\text{Harga Beli} = \\frac{100}{(100 + \\%U)} \\times \\text{Harga Jual}$

Jika Rugi:
$\\text{Harga Beli} = \\frac{100}{(100 - \\%R)} \\times \\text{Harga Jual}$`
    },
    {
      heading: "I. Bunga Tunggal",
      content: `1. Pengertian Bunga Tunggal
Bunga tunggal adalah bunga yang dihitung hanya berdasarkan modal awal (pokok pinjaman atau pokok simpanan) untuk setiap periode.

2. Rumus Bunga Tunggal
$B = M \\times W \\times P$

Dimana:
- B = Besar bunga yang diperoleh/dibayar
- M = Pokok pinjaman/modal awal (Prinsip)
- W = Waktu atau jangka waktu (dalam periode yang sama dengan suku bunga)
- P = Tingkat suku bunga per periode (dalam bentuk desimal)

Modal akhir setelah dikenakan bunga tunggal:
$M_1 = M + B = M(1 + WP)$`
    },
    {
      heading: "J. Diskon (Potongan Harga)",
      content: `1. Pengertian Diskon
Diskon adalah potongan harga yang diberikan oleh penjual kepada pembeli. Diskon biasanya dinyatakan dalam persentase (%).

2. Rumus dan Perhitungan Diskon
- Besar Diskon = Persentase Diskon × Harga Awal
- Harga Bayar = Harga Awal - Besar Diskon
- Atau: Harga Bayar = Harga Awal × (100% - Persentase Diskon)

3. Diskon Ganda (Double Discount)
Diskon 20% + 10% TIDAK berarti diskon total 30%. Diskon kedua diberikan setelah diskon pertama diterapkan.

Contoh: Baju seharga Rp100.000 diskon 20% + 10%
- Harga Setelah Diskon 1 = Rp100.000 × 80% = Rp80.000
- Harga Setelah Diskon 2 = Rp80.000 × 90% = Rp72.000`
    },
    {
      heading: "K. Pajak Pertambahan Nilai (PPN)",
      content: `1. Pengertian PPN
Pajak Pertambahan Nilai (PPN) adalah pajak yang dikenakan atas konsumsi barang dan jasa di dalam daerah pabean (wilayah Indonesia). Besarnya PPN di Indonesia saat ini adalah 11% (per 2024).

2. Rumus dan Perhitungan PPN
- Besar PPN = Persentase PPN × Harga Barang/Jasa (sebelum PPN)
- Total Harga Bayar = Harga Barang/Jasa × (100% + Persentase PPN)

Contoh: Makanan di restoran seharga Rp50.000 (belum termasuk PPN 11%).
- Besar PPN = 11% × Rp50.000 = Rp5.500
- Total Harga Bayar = Rp50.000 + Rp5.500 = Rp55.500`
    },
    {
      heading: "L. Pajak Penghasilan (PPh)",
      content: `1. Pengertian PPh
Pajak Penghasilan (PPh) adalah pajak yang dikenakan atas penghasilan yang diterima atau diperoleh seseorang (pribadi) atau badan usaha dalam satu tahun pajak.

2. Rumus dan Perhitungan PPh
- Penghasilan Kena Pajak (PKP) = Penghasilan Bruto - Penghasilan Tidak Kena Pajak (PTKP)
- Besar PPh = Persentase PPh × PKP
- Penghasilan Bersih = Penghasilan Bruto - Besar PPh

Contoh: Pekerja dengan penghasilan bruto Rp5.000.000/bulan, PTKP Rp3.000.000/bulan, PPh 5%.
- PKP = Rp5.000.000 - Rp3.000.000 = Rp2.000.000
- Besar PPh = 5% × Rp2.000.000 = Rp100.000
- Penghasilan Bersih = Rp5.000.000 - Rp100.000 = Rp4.900.000`
    },
  ]
};

const latihanDasar = [
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

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nHarga sepotong kue turun dari Rp250 menjadi Rp200. Dengan uang Rp4.000, berapa potong kue lebih banyak yang dapat dibeli.", options: ["A. 4", "B. 8", "C. 20", "D. 2", "E. 6"] , jawaban: "A", pembahasan: "Sebelum: $\\dfrac{4.000}{250} = 16$ potong. Sesudah: $\\dfrac{4.000}{200} = 20$ potong.\nSelisih = 4 potong. Jawaban A." },
  { no: 2, soal: "OSN Matematika 2003 Tingkat Kota\nGabah hasil panen sawah mempunyai kadar air 25%. Setelah dijemur kadar airnya menyusut sebanyak 80%. Kadar gabah tersebut saat ini adalah ...", options: ["A. 2,5%", "B. 5%", "C. 10%", "D. 15%", "E. 2%"] , jawaban: "B", pembahasan: "Kadar air berkurang 80\\% berarti tersisa 20\\% dari kadar awal.\nKadar air baru = $25\\% \\times 20\\% = 5\\%$. Jawaban B." },
  { no: 3, soal: "OSN Matematika 2004 Tingkat Kota\n3% dari 81 sama dengan 9% dari ...", options: ["A. 27", "B. 54", "C. 72", "D. 90", "E. 243"] , jawaban: "A", pembahasan: "$3\\% \\times 81 = 2.43$. $9\\% \\times n = 2.43 \\Rightarrow n = 27$. Jawaban A." },
  { no: 4, soal: "OSN Matematika 2005 Tingkat Kota\nDalam satu tahun harga suatu mobil berkurang 10% dari harga tahun sebelumnya. Paling sedikit berapa tahun sehingga harga mobil itu kurang dari setengah harga semula", options: [] , jawaban: "7 tahun", pembahasan: "Setelah $n$ tahun, harga = harga awal $\\times 0.9^n$.\nCari $n$ terkecil dengan $0.9^n < 0.5$:\n$0.9^6 \\approx 0.531$ (belum)\n$0.9^7 \\approx 0.478 < 0.5$ ✓\nJadi paling sedikit 7 tahun." },
  { no: 5, soal: "OSN Matematika 2007 Tingkat Kota\nSeorang pedagang membeli 25 kg beras jenis A seharga Rp6.000 setiap kg dan 15 kg beras jenis B seharga Rp4.000 setiap kg. Kedua jenis beras tersebut dicampur. Agar mendapat untung 4% setiap beras tersebut dijual seharga Rp .../kg", options: ["A. 5.200", "B. 5.460", "C. 5.520", "D. 5.580", "E. 6.240"] , jawaban: "B", pembahasan: "Total HB = $25 \\times 6.000 + 15 \\times 4.000 = 210.000$ untuk 40 kg.\nUntung 4\\%: HJ total = $210.000 \\times 1.04 = 218.400$.\nPer kg = $\\dfrac{218.400}{40} = 5.460$. Jawaban B." },
  { no: 6, soal: "OSN Matematika 2008 Tingkat Kota\nPada bulan Januari harga tas di toko Rima adalah Rp150.000. Pada bulan Februari harga tas naik 10%, tetapi bila yang membeli pelajar memperoleh potongan 10%. Pada bulan Maret potongan bagi pelajar tidak berlaku lagi, tetapi harga tas turun menjadi Rp135.000 dan pembeli dikenakan pajak pembelian 10%. Dua orang pelajar, Andi dan Anton membeli tas tersebut. Andi membeli pada bulan Februari, sedangkan Anton membeli pada bulan Maret. Pernyataan berikut yang benar adalah ...", options: ["A. Anton membayar sebesar Rp150.000 untuk tas yang dibelinya", "B. Andi membayar sebesar Rp150.000 untuk tas yang dibelinya", "C. Jumlah uang yang dibayarkan Andi sama dengan jumlah uang yang dibayarkan Anton", "D. Di antara tiga bulan yang disebut di atas, bulan Januari adalah bulan yang paling menguntungkan bagi pelajar untuk membeli tas"] , jawaban: "C", pembahasan: "Februari pelajar (Andi): $150.000 \\times 1.10 \\times 0.90 = 148.500$.\nMaret pelajar (Anton): $135.000 \\times 1.10 = 148.500$.\nKeduanya membayar sama. Jawaban C." },
  { no: 7, soal: "OSN Matematika 2009 Tingkat Kota\nPada bulan Januari harga tas di Toko Asia adalah Rp 150.000. Pada bulan Februari harga tas naik 10%, tetapi bila yang membeli pelajar memperoleh potongan 10%. Pada bulan Maret harga tas tersebut menjadi Rp135.000 tetapi pembeli dibebani pajak pembelian sebesar 10% dan diskon bagi pelajar tidak berlaku lagi. Dua orang pelajar, Andi dan Anton membeli tas tersebut. Andi membeli pada bulan Februari, sedangkan Anton membeli pada bulan Maret. Pertanyaan berikut yang benar adalah ...", options: ["A. Jumlah uang yang dibayarkan Andi sama dengan jumlah uang yang dibayarkan Anton", "B. Anton membayar sebesar Rp150.000 untuk tas yang dibelinya", "C. Di antara tiga bulan yang disebut di atas, bulan Januari adalah bulan yang paling menguntungkan bagi pelajar untuk membeli tas", "D. Jumlah uang yang dibayarkan Andi lebih besar dari jumlah uang yang dibayarkan Anton"] , jawaban: "A", pembahasan: "Februari pelajar (Andi): $150.000 \\times 1.10 \\times 0.90 = 148.500$.\nMaret pelajar (Anton): $135.000 \\times 1.10 = 148.500$.\nAndi = Anton. Jawaban A." },
  { no: 8, soal: "OSN Matematika 2017 Tingkat Kota\nPenyedia jasa pengasuh bayi usia di bawah 3 tahun memberlakukan tarif upah pengasuh bayi sebagai berikut. Upah setiap jam sebesar Rp 40.000 untuk 3 jam pertama. Selanjutnya, diberlakukan aturan sebagai berikut. Untuk setiap 1 jam berikutnya di siang hari (mulai pukul 06.00 sampai dengan pukul 18.00), dikenakan upah sebesar 20% lebih banyak daripada upah 1 jam sebelumnya. Adapun upah untuk malam hari di atas 3 jam pertama dikenakan tetap sebesar Rp 30.000 setiap jam. Jika keluarga Adang menitipkan bayinya pada pukul 16.00 sampai pukul 09.00 hari berikutnya, maka keluarga Adang harus membayar biaya penitipan bayi tersebut sebesar Rp ...", options: ["A. 571.000", "B. 581.000", "C. 585.000", "D. 595.000"] , jawaban: "B", pembahasan: "Penitipan dari 16:00 sampai 09:00 esok = 17 jam.\n3 jam pertama (16:00-19:00): $3 \\times 40.000 = 120.000$.\nMalam (19:00-06:00, 11 jam): $11 \\times 30.000 = 330.000$.\nSiang setelah 06:00, naik 20\\%/jam dari upah jam sebelumnya (30.000):\n• 06-07: $30.000 \\times 1.2 = 36.000$\n• 07-08: $36.000 \\times 1.2 = 43.200$\n• 08-09: $43.200 \\times 1.2 = 51.840$\nTotal siang: $131.040$. Grand total: $120.000 + 330.000 + 131.040 = 581.040 \\approx 581.000$. Jawaban B." },
  { no: 9, soal: "OSN Matematika 2018 Tingkat Kota\nMenjelang tahun baru, harga sebuah kacamata dipotong (didiskon) dua kali seperti dinyatakan pada tanda berikut. Seorang pembeli membayar Rp168.750 untuk kacamata tersebut. Berapa harga kacamata tersebut sebelum dipotong harganya?", options: ["A. Rp262.500", "B. Rp281.250", "C. Rp375.000", "D. Rp421.675"], svgQuestion: (
    <svg viewBox="0 0 110 52" width="110" height="52" className="my-2 block mx-auto">
      <rect x="0.5" y="0.5" width="109" height="51" fill="rgba(255,255,255,0.08)" stroke="#d1d5db" strokeWidth="1" rx="2"/>
      <line x1="1" y1="20" x2="109" y2="20" stroke="#d1d5db" strokeWidth="0.8"/>
      <text x="55" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Diskon</text>
      <text x="55" y="38" fill="#facc15" fontSize="16" fontWeight="bold" textAnchor="middle">50% + 10%</text>
    </svg>
  ) , jawaban: "C", pembahasan: "Faktor pengurang harga setelah dua diskon: $0.5 \\times 0.9 = 0.45$.\nHarga awal = $\\dfrac{168.750}{0.45} = 375.000$. Jawaban C." },
  { no: 10, soal: "OSN Matematika 2021 Tingkat Kota\nSuatu keluarga memiliki lima anak dengan anak sulung bernama Andy. Ayah memberi uang saku bulanan kepada kelima anaknya tersebut dengan ketentuan berikut. Uang saku Andy adalah dua kali lipat uang saku anak kedua, tiga kali lipat uang saku anak ketiga, empat kali lipat uang saku anak keempat, serta lima kali lipat uang saku anak kelima. Besaran uang saku anak-anak tersebut adalah bilangan bulat kelipatan ribuan rupiah. Bendy dan Cindy adalah adik dari Andy. Bendy mengeluh bahwa uang saku yang diterima adalah Rp20.000 lebih sedikit dibanding Cindy. Besaran terkecil uang saku Andy yang mungkin adalah ...", options: ["A. Rp60.000", "B. Rp80.000", "C. Rp120.000", "D. Rp240.000"] , jawaban: "C", pembahasan: "Misal uang Andy = $A$. Anak ke-2 = $A/2$, ke-3 = $A/3$, ke-4 = $A/4$, ke-5 = $A/5$.\nAgar semua kelipatan ribuan, $A$ harus kelipatan KPK$(2,3,4,5) \\times 1.000 = 60.000$.\n$A = 60.000$: selisih maksimum $A/2 - A/3 = 10.000$ (belum 20.000).\n$A = 120.000$: $A/2 - A/3 = 60.000 - 40.000 = 20.000$ ✓\nNilai terkecil: Rp120.000. Jawaban C." },
  { no: 11, soal: "OSN Matematika 2021 Tingkat Kota\nBerikut adalah data penjualan lima perusahaan A, B, C, D, E dalam lima tahun (2010 hingga 2014). Data diberikan dalam persentase terhadap total penjualan A, B, C, D dan E serta hanya tiga perusahaan teratas yang disebutkan untuk setiap tahun yang ditentukan.", soalAfter: "Diketahui bahwa tidak ada perusahaan yang memiliki persentase yang sama dalam satu tahun dan setidaknya persentase masing-masing perusahaan 1% dari total penjualan kelima perusahaan di tahun tersebut. Jika total penjualan kelima perusahaan adalah sama setiap tahunnya, banyaknya perusahaan yang penjualannya pasti lebih besar dari perusahaan E selama lima tahun adalah ...", options: ["A. 1", "B. 2", "C. 3", "D. 4"], svgQuestion: (
    <svg viewBox="0 0 400 90" width="100%" style={{maxWidth:"400px"}} className="my-2 block mx-auto">
      <rect x="0.5" y="0.5" width="399" height="89" fill="none" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="0" y1="24" x2="400" y2="24" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="0" y1="46" x2="400" y2="46" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="0" y1="68" x2="400" y2="68" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="80"  y1="0" x2="80"  y2="90" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="160" y1="0" x2="160" y2="90" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="240" y1="0" x2="240" y2="90" stroke="#67e8f9" strokeWidth="1"/>
      <line x1="320" y1="0" x2="320" y2="90" stroke="#67e8f9" strokeWidth="1"/>
      <rect x="1" y="1" width="399" height="23" fill="rgba(103,232,249,0.18)"/>
      <text x="40"  y="16" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">2010</text>
      <text x="120" y="16" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">2011</text>
      <text x="200" y="16" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">2012</text>
      <text x="280" y="16" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">2013</text>
      <text x="360" y="16" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">2014</text>
      <text x="40"  y="39" fill="#facc15" fontSize="9" textAnchor="middle">B (35%)</text>
      <text x="120" y="39" fill="#facc15" fontSize="9" textAnchor="middle">A (30%)</text>
      <text x="200" y="39" fill="#facc15" fontSize="9" textAnchor="middle">D (40%)</text>
      <text x="280" y="39" fill="#facc15" fontSize="9" textAnchor="middle">A (38%)</text>
      <text x="360" y="39" fill="#facc15" fontSize="9" textAnchor="middle">A (42%)</text>
      <text x="40"  y="61" fill="#ffffff" fontSize="9" textAnchor="middle">E (25%)</text>
      <text x="120" y="61" fill="#ffffff" fontSize="9" textAnchor="middle">C (28%)</text>
      <text x="200" y="61" fill="#ffffff" fontSize="9" textAnchor="middle">C (25%)</text>
      <text x="280" y="61" fill="#ffffff" fontSize="9" textAnchor="middle">B (22%)</text>
      <text x="360" y="61" fill="#ffffff" fontSize="9" textAnchor="middle">D (18%)</text>
      <text x="40"  y="82" fill="#ffffff" fontSize="9" textAnchor="middle">D (18%)</text>
      <text x="120" y="82" fill="#ffffff" fontSize="9" textAnchor="middle">B (18%)</text>
      <text x="200" y="82" fill="#ffffff" fontSize="9" textAnchor="middle">E (15%)</text>
      <text x="280" y="82" fill="#ffffff" fontSize="9" textAnchor="middle">C (21%)</text>
      <text x="360" y="82" fill="#ffffff" fontSize="9" textAnchor="middle">E (15%)</text>
    </svg>
  ) , jawaban: "C", pembahasan: "Analisis tabel top-3 setiap tahun (asumsi semua perusahaan $\\geq 1\\%$, total = 100\\% per tahun):\n• 2010: B(35), E(25), D(18) ⇒ A,C masing-masing $\\leq 17\\%$, jadi E $>$ A, C, D.\n• 2011: A(30), C(28), B(18) ⇒ D, E $\\leq 17\\%$.\n• 2012: D(40), C(25), E(15) ⇒ A, B $< 15\\%$, jadi E $>$ A, B.\n• 2013: A(38), B(22), C(21) ⇒ D, E $\\leq 19\\%$.\n• 2014: A(42), D(18), E(15) ⇒ B, C $< 15\\%$, jadi E $>$ B, C.\nMembandingkan total 5 tahun, hanya A, B, C yang totalnya pasti lebih besar dari E.\nJawaban C = 3 perusahaan." },
];

const OlimpiadeAritmetikaSosialPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
  const [showPembahasan, setShowPembahasan] = useState<Set<string>>(new Set());

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasan = (key: string) => {
    playPopSound();
    setShowPembahasan(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderPembahasan = (key: string, jawaban?: string, pembahasan?: string) => {
    if (!jawaban || !pembahasan) return null;
    const isOpen = showPembahasan.has(key);
    return (
      <div className="mt-3">
        <button
          onClick={() => togglePembahasan(key)}
          className="flex items-center gap-2 text-xs font-display font-bold text-primary hover:text-cyan-300 transition-colors cursor-pointer px-3 py-2 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20"
        >
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
        </button>
        {isOpen && (
          <div className="mt-3 animate-slide-up space-y-2">
            <div className="px-4 py-3 rounded-lg border border-emerald-400/50 bg-emerald-950/30">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Jawaban</span>
              <div className="font-body text-sm text-emerald-100 font-bold">{renderWithLatex(jawaban)}</div>
            </div>
            <div
              className="px-4 py-3 rounded-lg border border-primary/40"
              style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(168,85,247,0.08) 100%)" }}
            >
              <span className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Pembahasan</span>
              <div className="font-body text-xs text-white/85 leading-relaxed space-y-1">
                {pembahasan.split('\n').map((line, i) => (
                  <div key={i}>{renderWithLatex(line)}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - ARITMETIKA SOSIAL
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div
                key={idx}
                className="backdrop-blur border rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
                  borderColor: expandedSections.includes(idx) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: expandedSections.includes(idx)
                    ? "0 0 24px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)" }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm text-accent font-bold group-hover:text-yellow-300 transition-colors">
                      {section.heading}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        if (/^\d+\. [A-Z]/.test(trimmed)) {
                          return <div key={i} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">{trimmed}</div>;
                        }
                        if (/^Rumus/.test(trimmed)) {
                          return <div key={i} className="mt-3 mb-1 font-semibold text-yellow-300 text-xs uppercase tracking-wide">{renderWithLatex(trimmed)}</div>;
                        }
                        if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
                          return (
                            <div key={i} className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                              <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        if (trimmed === '') return <div key={i} className="h-2" />;
                        return <div key={i} className="mb-1">{renderWithLatex(line)}</div>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {renderWithLatex(soal.soal)}
                </div>
                {'svgQuestion' in soal && soal.svgQuestion && (
                  <div className="mb-3">{soal.svgQuestion}</div>
                )}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {renderPembahasan(`dasar-${soal.no}`, (soal as any).jawaban, (soal as any).pembahasan)}
              </div>
            ))}
          </div>
        )}

        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {'svgQuestion' in soal && soal.svgQuestion && (
                  <div className="mb-3">{soal.svgQuestion}</div>
                )}
                {'soalAfter' in soal && soal.soalAfter && (
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    {renderWithLatex(soal.soalAfter as string)}
                  </div>
                )}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {renderPembahasan(`olim-${soal.no}`, (soal as any).jawaban, (soal as any).pembahasan)}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeAritmetikaSosialPage;
