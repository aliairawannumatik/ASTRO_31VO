import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { FileText } from "lucide-react";

const accentColor = "#facc15";
const accentDim = "rgba(250,204,21,0.10)";
const borderColor = "rgba(250,204,21,0.25)";

type Part = { label: string; math?: string; text?: string };
type Badge = "UN" | "ANBK" | "TKA" | "AKM";
type Q = { n: number; title: string; content?: string; math?: string; blockMath?: string; parts?: Part[]; badge?: Badge; type: "essay" | "mixed"; };
const badgeStyle: Record<Badge, string> = {
  UN: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
  ANBK: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  TKA: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  AKM: "bg-green-500/20 text-green-300 border-green-400/40",
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qf(1, "Membuat Model dari Belanja", {
    badge: "UN", type: "mixed",
    content: "Ibu membeli 3 kg beras dan 2 kg gula seharga Rp 47.000. Ayah membeli 5 kg beras dan 1 kg gula seharga Rp 61.000.",
    parts: [
      { label: "a.", text: "Tentukan variabel yang tepat (misalnya beras = x, gula = y)." },
      { label: "b.", text: "Tuliskan dua persamaan linearnya." },
      { label: "c.", text: "Tuliskan dalam bentuk SPLDV." },
    ],
  }),
  Qf(2, "Model dari Umur", {
    badge: "UN", type: "mixed",
    content: "Umur Bapak 3 kali umur Anak. Lima tahun lagi, umur Bapak 2 kali umur Anak.",
    parts: [
      { label: "a.", text: "Misal umur Bapak sekarang = x dan umur Anak = y. Tuliskan persamaan pertama." },
      { label: "b.", text: "Lima tahun lagi: umur Bapak = x + 5, umur Anak = y + 5. Tuliskan persamaan kedua." },
      { label: "c.", text: "Gabungkan menjadi SPLDV." },
    ],
  }),
  Qf(3, "Model dari Keliling", {
    badge: "ANBK", type: "mixed",
    content: "Sebuah persegi panjang memiliki keliling 60 cm. Panjangnya 6 cm lebih dari lebarnya.",
    parts: [
      { label: "a.", text: "Misal panjang = p dan lebar = l. Tuliskan persamaan dari keliling." },
      { label: "b.", text: "Tuliskan persamaan dari hubungan panjang dan lebar." },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(4, "Model dari Koin", {
    badge: "TKA", type: "mixed",
    content: "Dompet Rani berisi 25 keping uang logam Rp 500 dan Rp 1.000. Total nilai = Rp 16.000.",
    parts: [
      { label: "a.", text: "Misal banyak koin Rp 500 = x dan Rp 1.000 = y." },
      { label: "b.", text: "Tuliskan persamaan jumlah koin dan persamaan nilai total." },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(5, "Model dari Tiket", {
    badge: "UN", type: "mixed",
    content: "Harga tiket bioskop dewasa Rp 50.000 dan anak-anak Rp 30.000. Sebanyak 200 tiket terjual dengan total pemasukan Rp 8.400.000.",
    parts: [
      { label: "a.", text: "Misal tiket dewasa = x dan anak = y. Tuliskan dua persamaan." },
      { label: "b.", text: "Tuliskan sebagai SPLDV." },
    ],
  }),
  Qf(6, "Model dari Kecepatan", {
    badge: "AKM", type: "mixed",
    content: "Dua mobil melaju dari kota A ke kota B (240 km). Mobil pertama (kecepatan x km/jam) tiba 1 jam lebih cepat dari mobil kedua (kecepatan y km/jam). Kecepatan mobil kedua 20 km/jam lebih lambat.",
    parts: [
      { label: "a.", text: "Tuliskan persamaan dari selisih kecepatan." },
      { label: "b.", math: "\\text{Waktu = } \\frac{\\text{jarak}}{\\text{kecepatan}}. \\text{ Tuliskan persamaan dari selisih waktu.}" },
      { label: "c.", text: "Susun SPLDV." },
    ],
  }),
  Qf(7, "Model dari Investasi", {
    badge: "TKA", type: "mixed",
    content: "Seorang investor menempatkan Rp 10.000.000 di dua rekening. Rekening A memberikan bunga 5%/tahun dan rekening B memberikan bunga 8%/tahun. Total bunga setahun = Rp 680.000.",
    parts: [
      { label: "a.", text: "Misal dana di rekening A = x dan B = y." },
      { label: "b.", text: "Tuliskan persamaan total investasi dan total bunga." },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(8, "Model dari Penjualan", {
    badge: "UN", type: "mixed",
    content: "Toko menjual dua jenis barang. Harga barang A = Rp 12.000 dan barang B = Rp 8.000. Dalam satu hari terjual 150 barang dengan pendapatan Rp 1.560.000.",
    parts: [
      { label: "a.", text: "Misal barang A = x dan barang B = y. Tuliskan SPLDV." },
      { label: "b.", text: "Tuliskan setiap persamaan secara jelas." },
    ],
  }),
  Qf(9, "Model Bilangan Dua Angka", {
    badge: "UN", type: "mixed",
    content: "Suatu bilangan dua angka. Jumlah digitnya = 11. Jika digit-digitnya dipertukarkan, bilangan baru lebih besar 27 dari bilangan semula.",
    parts: [
      { label: "a.", text: "Misal angka puluhan = x dan satuan = y." },
      { label: "b.", text: "Bilangan semula = 10x + y. Bilangan baru = 10y + x. Tuliskan dua persamaan." },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(10, "Model dari Campuran Larutan", {
    badge: "TKA", type: "mixed",
    content: "Larutan A mengandung 20% garam dan larutan B mengandung 50% garam. Dicampurkan x liter A dan y liter B untuk menghasilkan 30 liter larutan 35% garam.",
    parts: [
      { label: "a.", text: "Tuliskan persamaan total volume." },
      { label: "b.", text: "Tuliskan persamaan kandungan garam." },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(11, "Model Sederhana — Buah", {
    badge: "ANBK", type: "mixed",
    content: "2 pepaya + 3 melon = Rp 60.000. 4 pepaya + 1 melon = Rp 72.000.",
    parts: [
      { label: "a.", text: "Tentukan variabel yang digunakan." },
      { label: "b.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(12, "Model Perjalanan", {
    badge: "AKM", type: "mixed",
    content: "Andi dan Budi berjalan kaki dari tempat yang sama tapi ke arah berlawanan. Kecepatan Andi x km/jam dan Budi y km/jam. Setelah 2 jam, jarak mereka 20 km. Kecepatan Andi = 2 kali kecepatan Budi.",
    parts: [
      { label: "a.", text: "Tuliskan persamaan dari total jarak setelah 2 jam." },
      { label: "b.", text: "Tuliskan persamaan dari perbandingan kecepatan." },
      { label: "c.", text: "Susun SPLDV." },
    ],
  }),
  Qf(13, "Model Persegi Panjang", {
    badge: "UN", type: "mixed",
    content: "Perimeter (keliling) suatu persegi panjang 52 cm. Panjang 2 cm kurang dari tiga kali lebarnya.",
    parts: [
      { label: "a.", text: "Misal panjang = p, lebar = l." },
      { label: "b.", math: "\\text{Keliling} = 2(p+l) = 52" },
      { label: "c.", text: "Hubungan panjang dan lebar: p = 3l − 2. Susun SPLDV." },
    ],
  }),
  Qf(14, "Model Campuran Makanan", {
    badge: "AKM", type: "mixed",
    content: "Makanan A mengandung 100 kkal dan makanan B mengandung 150 kkal per porsi. Seseorang makan x porsi A dan y porsi B. Total porsi = 5 dan total kalori = 650 kkal.",
    parts: [
      { label: "a.", text: "Tuliskan persamaan total porsi." },
      { label: "b.", text: "Tuliskan persamaan total kalori." },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(15, "Model dari Pekerjaan", {
    badge: "TKA", type: "mixed",
    content: "Tukang A dapat menyelesaikan pekerjaan dalam x hari. Tukang B dalam y hari. Bersama dapat selesai dalam 4 hari. Tukang A bekerja 6 hari lebih cepat dari Tukang B.",
    parts: [
      { label: "a.", math: "\\text{Kecepatan bersama: } \\frac{1}{x} + \\frac{1}{y} = \\frac{1}{4}" },
      { label: "b.", text: "Tuliskan persamaan kedua dari selisih waktu." },
      { label: "c.", text: "Tuliskan SPLDV (dalam bentuk x dan y)." },
    ],
  }),
  Qf(16, "Model Jual Beli", {
    badge: "UN", type: "mixed",
    content: "Penjual menjual 6 kg mangga dan 4 kg apel seharga Rp 88.000. Jika dia menjual 3 kg mangga dan 7 kg apel, harganya Rp 91.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV (mangga = m, apel = a)." },
      { label: "b.", text: "Tentukan harga per kg masing-masing buah." },
    ],
  }),
  Qf(17, "Model Geometri — Sudut", {
    badge: "ANBK", type: "mixed",
    content: "Dua sudut saling berpelurus (jumlah = 180°). Sudut pertama = 3 kali sudut kedua dikurangi 20°.",
    parts: [
      { label: "a.", text: "Misal sudut pertama = x° dan sudut kedua = y°. Tuliskan dua persamaan." },
      { label: "b.", text: "Susun SPLDV." },
    ],
  }),
  Qf(18, "Model Kecepatan Sungai", {
    badge: "TKA", type: "mixed",
    content: "Sebuah perahu bergerak di sungai. Kecepatan perahu di air tenang = x km/jam. Kecepatan arus = y km/jam. Ke hulu: 24 km dalam 3 jam. Ke hilir: 24 km dalam 2 jam.",
    parts: [
      { label: "a.", math: "\\text{Ke hulu: } x - y = \\frac{24}{3} = 8" },
      { label: "b.", math: "\\text{Ke hilir: } x + y = \\frac{24}{2} = 12" },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(19, "Model Tenaga Kerja", {
    badge: "AKM", type: "mixed",
    content: "Pabrik mempekerjakan pekerja laki-laki (gaji Rp 80.000/hari) dan perempuan (gaji Rp 60.000/hari). Total pekerja 40 orang dan total gaji Rp 2.800.000/hari.",
    parts: [
      { label: "a.", text: "Misal pekerja laki-laki = x dan perempuan = y. Susun SPLDV." },
      { label: "b.", text: "Verifikasi apakah (25, 15) adalah solusinya." },
    ],
  }),
  Qf(20, "Model Jarak-Waktu", {
    badge: "UN", type: "mixed",
    content: "Dua kota A dan B berjarak 200 km. Mobil dari A dan motor dari B berangkat bersamaan menuju satu sama lain dan bertemu setelah 2 jam. Kecepatan mobil 30 km/jam lebih dari kecepatan motor.",
    parts: [
      { label: "a.", text: "Misal kecepatan mobil = x dan motor = y." },
      { label: "b.", math: "\\text{Dalam 2 jam bertemu: } 2x + 2y = 200" },
      { label: "c.", text: "Tuliskan persamaan kedua dan susun SPLDV." },
    ],
  }),
  Qf(21, "Model Populasi", {
    badge: "ANBK", type: "mixed",
    content: "Jumlah siswa laki-laki (x) dan perempuan (y) di sekolah adalah 480. Banyak siswa perempuan 60 lebih dari siswa laki-laki.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Tentukan nilai x dan y." },
    ],
  }),
  Qf(22, "Model Campuran Logam", {
    badge: "TKA", type: "mixed",
    content: "Campuran emas dan perak seberat 100 gram mengandung 30 gram emas. Perbandingan emas terhadap perak = 3 : 7.",
    parts: [
      { label: "a.", text: "Misal berat emas = x dan perak = y. Tuliskan persamaan total berat." },
      { label: "b.", text: "Tuliskan persamaan dari perbandingan x : y = 3 : 7." },
      { label: "c.", text: "Susun SPLDV." },
    ],
  }),
  Qf(23, "Model Jumlah dan Hasil Kali", {
    badge: "UN", type: "mixed",
    content: "Jumlah dua bilangan = 20 dan selisihnya = 6.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Jika bilangan pertama = x dan kedua = y, tentukan nilai x dan y." },
      { label: "c.", math: "\\text{Hitung } x \\cdot y." },
    ],
  }),
  Qf(24, "Model Soal Cerita Panjang", {
    badge: "AKM", type: "mixed",
    content: "Di sebuah kandang terdapat ayam dan kelinci. Jumlah kepalanya 50 dan jumlah kakinya 140.",
    parts: [
      { label: "a.", text: "Misal ayam = x dan kelinci = y. Tuliskan persamaan dari kepala." },
      { label: "b.", text: "Tuliskan persamaan dari kaki (ayam punya 2 kaki, kelinci 4 kaki)." },
      { label: "c.", text: "Susun SPLDV." },
    ],
  }),
  Qf(25, "Model Sewa Kendaraan", {
    badge: "TKA", type: "mixed",
    content: "Biaya sewa motor = Rp x/jam dan mobil = Rp y/jam. 2 jam motor + 3 jam mobil = Rp 70.000. 3 jam motor + 2 jam mobil = Rp 65.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Tentukan biaya sewa per jam motor dan mobil." },
    ],
  }),
  Qf(26, "Model Tanaman", {
    badge: "ANBK", type: "mixed",
    content: "Kebun menghasilkan mangga dan rambutan. Harga mangga Rp 5.000/kg dan rambutan Rp 3.000/kg. Total panen 100 kg dengan nilai Rp 400.000.",
    parts: [
      { label: "a.", text: "Misal mangga = m kg dan rambutan = r kg. Tuliskan SPLDV." },
      { label: "b.", text: "Tentukan berapa kg mangga dan rambutan yang dipanen." },
    ],
  }),
  Qf(27, "Model Sudut Segitiga", {
    badge: "UN", type: "mixed",
    content: "Dalam suatu segitiga, sudut pertama (x°) + sudut kedua (y°) = 90°. Sudut pertama dua kali sudut kedua dikurangi 15°.",
    parts: [
      { label: "a.", text: "Tuliskan dua persamaan." },
      { label: "b.", text: "Susun SPLDV." },
      { label: "c.", text: "Tentukan besar kedua sudut tersebut." },
    ],
  }),
  Qf(28, "Model Laba Rugi", {
    badge: "AKM", type: "mixed",
    content: "Harga beli barang A = Rp x dan barang B = Rp y. Seorang pedagang membeli 5 barang A dan 3 barang B seharga Rp 95.000. Jika ia menjual dengan harga 20% lebih mahal, ia mendapat keuntungan Rp 19.000.",
    parts: [
      { label: "a.", text: "Tuliskan persamaan harga beli." },
      { label: "b.", text: "Tuliskan persamaan keuntungan." },
      { label: "c.", text: "Susun SPLDV." },
    ],
  }),
  Qf(29, "Model dari Data Tabel", {
    badge: "AKM", type: "mixed",
    content: "Sebuah toko mencatat penjualan:",
    parts: [
      { label: "Hari 1:", text: "3 roti coklat + 2 roti keju = Rp 32.000" },
      { label: "Hari 2:", text: "1 roti coklat + 4 roti keju = Rp 36.000" },
      { label: "a.", text: "Tuliskan SPLDV (coklat = c, keju = k)." },
      { label: "b.", text: "Selesaikan untuk menentukan harga masing-masing roti." },
    ],
  }),
  Qf(30, "Model Pertumbuhan", {
    badge: "TKA", type: "mixed",
    content: "Populasi kota A = x jiwa dan kota B = y jiwa. Jumlah total = 150.000 jiwa. Kota A memiliki 20.000 jiwa lebih dari kota B.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Tentukan populasi masing-masing kota." },
    ],
  }),
  Qf(31, "Model dari Kalimat Verbal Kompleks", {
    badge: "TKA", type: "mixed",
    content: "Lima kali bilangan pertama dikurangi dua kali bilangan kedua = 16. Tiga kali bilangan pertama ditambah bilangan kedua = 17.",
    parts: [
      { label: "a.", text: "Misal bilangan pertama = x dan kedua = y." },
      { label: "b.", text: "Tuliskan kedua persamaan." },
      { label: "c.", text: "Susun dan selesaikan SPLDV." },
    ],
  }),
  Qf(32, "Model Kecepatan Dua Arah", {
    badge: "AKM", type: "mixed",
    content: "Pesawat terbang ke arah timur dengan kecepatan x km/jam (searah angin, kecepatan angin = y km/jam). Ke arah barat butuh 5 jam untuk 2.000 km. Ke timur hanya butuh 4 jam.",
    parts: [
      { label: "a.", math: "\\text{Ke barat (melawan angin): } \\frac{2000}{x - y} = 5" },
      { label: "b.", math: "\\text{Ke timur (searah angin): } \\frac{2000}{x + y} = 4" },
      { label: "c.", text: "Sederhanakan dan susun SPLDV." },
    ],
  }),
  Qf(33, "Model Campuran Larutan Kimia", {
    badge: "TKA", type: "mixed",
    content: "x liter larutan 30% dan y liter larutan 60% dicampur menjadi 10 liter larutan 45%.",
    parts: [
      { label: "a.", text: "Tuliskan persamaan dari total volume." },
      { label: "b.", math: "\\text{Konsentrasi: } 0.3x + 0.6y = 0.45 \\times 10" },
      { label: "c.", text: "Susun SPLDV." },
    ],
  }),
  Qf(34, "Model Usia dengan Masa Lalu", {
    badge: "UN", type: "mixed",
    content: "Empat tahun yang lalu, jumlah umur Ibu dan Anak = 42 tahun. Sekarang, umur Ibu = 3 kali umur Anak.",
    parts: [
      { label: "a.", text: "Misal umur Ibu sekarang = x dan Anak = y." },
      { label: "b.", text: "Tuliskan persamaan dari kondisi 4 tahun lalu." },
      { label: "c.", text: "Tuliskan persamaan dari kondisi sekarang. Susun SPLDV." },
    ],
  }),
  Qf(35, "Model Bilangan Rasional", {
    badge: "TKA", type: "mixed",
    content: "Pembilang suatu pecahan = x dan penyebut = y.",
    blockMath: "\\frac{x}{y} = \\frac{2}{3} \\quad \\text{dan} \\quad x + y = 20",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV dari kedua kondisi." },
      { label: "b.", text: "Tentukan nilai x dan y." },
      { label: "c.", text: "Tentukan nilai pecahan tersebut." },
    ],
  }),
  Qf(36, "Model dari Konteks Digital", {
    badge: "AKM", type: "mixed",
    content: "Sebuah platform streaming memiliki pelanggan premium (Rp 50.000/bulan = x) dan reguler (Rp 20.000/bulan = y). Total 500 pelanggan, total pendapatan Rp 16.000.000/bulan.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Tentukan banyaknya pelanggan premium dan reguler." },
    ],
  }),
  Qf(37, "Model Soal UN Klasik", {
    badge: "UN", type: "mixed",
    content: "Harga 4 buku dan 2 pensil = Rp 28.000. Harga 2 buku dan 4 pensil = Rp 20.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV (buku = b, pensil = p)." },
      { label: "b.", text: "Tentukan harga 1 buku dan 1 pensil." },
      { label: "c.", text: "Berapa harga 3 buku dan 3 pensil?" },
    ],
  }),
  Qf(38, "Model Perjalanan — Kereta", {
    badge: "TKA", type: "mixed",
    content: "Kereta A berkecepatan x km/jam berangkat dari kota P. Kereta B berkecepatan y km/jam berangkat dari kota Q (berlawanan arah). Jarak PQ = 480 km. Mereka bertemu setelah 3 jam. Kecepatan A = kecepatan B + 20 km/jam.",
    parts: [
      { label: "a.", text: "Tuliskan persamaan dari pertemuan." },
      { label: "b.", text: "Tuliskan persamaan dari selisih kecepatan." },
      { label: "c.", text: "Susun SPLDV." },
    ],
  }),
  Qf(39, "Model dari Soal ANBK", {
    badge: "ANBK", type: "mixed",
    content: "Tentukan BENAR (B) atau SALAH (S) dari pernyataan dalam pemodelan SPLDV berikut:",
    parts: [
      { label: "(1)", text: "Langkah pertama membuat model adalah menentukan variabel yang mewakili besaran yang tidak diketahui." },
      { label: "(2)", text: "Setiap masalah dengan dua hal yang tidak diketahui pasti bisa dimodelkan sebagai SPLDV." },
      { label: "(3)", text: "SPLDV membutuhkan tepat dua persamaan linear untuk membentuk sistem." },
      { label: "(4)", text: "Setelah menemukan solusi, hasilnya perlu diverifikasi terhadap kondisi asli masalah." },
    ],
  }),
  Qf(40, "Model SPLDV Lengkap — AKM", {
    badge: "AKM", type: "mixed",
    content: "Dua perusahaan A dan B memproduksi sepatu. Perusahaan A menghasilkan x pasang/hari dengan biaya Rp 80.000/pasang. Perusahaan B menghasilkan y pasang/hari dengan biaya Rp 60.000/pasang. Total produksi = 200 pasang/hari dan total biaya = Rp 14.000.000/hari.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Tentukan produksi masing-masing perusahaan." },
      { label: "c.", text: "Berapa total biaya perusahaan A dan B masing-masing?" },
    ],
  }),
];

const ModelSPLDVPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <FileText className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            MEMBUAT MODEL SPLDV
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · Latihan Mandiri · 40 Soal</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {(["UN","ANBK","TKA","AKM"] as Badge[]).map(b => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b]}`}>{b}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl overflow-hidden border" style={{ background: accentDim, borderColor }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor, background: "rgba(250,204,21,0.08)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: accentColor + "30", color: accentColor }}>{q.n}</div>
                <span className="font-display text-sm font-bold" style={{ color: accentColor }}>{q.title}</span>
                {q.badge && <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle[q.badge]}`}>{q.badge}</span>}
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.content && <p className="font-body text-sm text-white/85 leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-white/90 text-sm"><InlineMath math={q.math} /></div>}
                {q.blockMath && (
                  <div className="rounded-xl px-4 py-3 text-white/90 overflow-x-auto"
                    style={{ background: "rgba(250,204,21,0.08)", border: `1px solid ${borderColor}` }}>
                    <BlockMath math={q.blockMath} />
                  </div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1">
                    {q.parts.map((p, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <span className="font-bold text-xs shrink-0 mt-0.5" style={{ color: accentColor }}>{p.label}</span>
                        <span className="font-body text-sm text-white/80 leading-relaxed">
                          {p.text && p.text}{p.math && <InlineMath math={p.math} />}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/spldv"); }}
            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer font-body">
            ← Kembali ke Menu SPLDV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelSPLDVPage;
