import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Rocket } from "lucide-react";

const accentColor = "#a78bfa";
const accentDim = "rgba(167,139,250,0.12)";
const borderColor = "rgba(167,139,250,0.25)";

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
  Qf(1, "Soal Harga — UN Klasik", {
    badge: "UN", type: "mixed",
    content: "Harga 5 jeruk dan 3 apel = Rp 31.000. Harga 3 jeruk dan 7 apel = Rp 29.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Tentukan harga 1 jeruk dan 1 apel." },
      { label: "c.", text: "Berapa harga 4 jeruk dan 4 apel?" },
    ],
  }),
  Qf(2, "Soal Usia", {
    badge: "UN", type: "mixed",
    content: "Jumlah umur Ayah dan Anak sekarang adalah 50 tahun. Lima tahun yang lalu, umur Ayah empat kali umur Anak.",
    parts: [
      { label: "a.", text: "Misal umur Ayah = x dan umur Anak = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan SPLDV tersebut." },
      { label: "c.", text: "Tentukan umur Ayah dan Anak sekarang." },
    ],
  }),
  Qf(3, "Soal Perjalanan — Bertemu", {
    badge: "TKA", type: "mixed",
    content: "Dua kota A dan B berjarak 300 km. Mobil dari A berkecepatan x km/jam dan dari B berkecepatan y km/jam berangkat bersamaan menuju satu sama lain. Mereka bertemu setelah 2,5 jam. Kecepatan mobil dari A = kecepatan dari B + 20 km/jam.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan SPLDV." },
      { label: "c.", text: "Tentukan kecepatan masing-masing mobil." },
    ],
  }),
  Qf(4, "Soal Bilangan Dua Angka", {
    badge: "UN", type: "mixed",
    content: "Suatu bilangan dua angka. Jumlah digitnya = 9. Bilangan tersebut adalah 45 lebih dari bilangan yang digitnya dibalik.",
    parts: [
      { label: "a.", text: "Misal digit puluhan = x dan satuan = y. Tuliskan bilangan asli dan bilangan hasil pembalikan." },
      { label: "b.", text: "Susun SPLDV." },
      { label: "c.", text: "Tentukan bilangan tersebut." },
    ],
  }),
  Qf(5, "Soal Keliling dan Luas", {
    badge: "ANBK", type: "mixed",
    content: "Keliling sebuah persegi panjang = 70 m. Panjangnya 5 m lebih dari lebarnya.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Tentukan panjang dan lebar." },
      { label: "c.", math: "\\text{Hitung luas persegi panjang tersebut.}" },
    ],
  }),
  Qf(6, "Soal Ayam dan Kelinci", {
    badge: "UN", type: "mixed",
    content: "Dalam sebuah kandang terdapat ayam dan kelinci. Jumlah kepala = 50 dan jumlah kaki = 160.",
    parts: [
      { label: "a.", text: "Misal ayam = x dan kelinci = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan SPLDV." },
      { label: "c.", text: "Berapa ekor ayam dan kelinci?" },
    ],
  }),
  Qf(7, "Soal Investasi", {
    badge: "TKA", type: "mixed",
    content: "Modal Rp 12.000.000 dibagi ke dua usaha. Usaha A memberikan keuntungan 10%/tahun dan usaha B memberikan 8%/tahun. Total keuntungan Rp 1.080.000.",
    parts: [
      { label: "a.", text: "Misal modal usaha A = x dan B = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa modal yang diinvestasikan ke masing-masing usaha?" },
    ],
  }),
  Qf(8, "Soal Kecepatan Sungai", {
    badge: "UN", type: "mixed",
    content: "Perahu bergerak di sungai. Kecepatan perahu di air tenang = x km/jam dan arus sungai = y km/jam. Jarak ke hulu = 24 km ditempuh dalam 3 jam. Jarak ke hilir yang sama ditempuh dalam 2 jam.",
    parts: [
      { label: "a.", text: "Ke hulu: kecepatan efektif = x − y. Ke hilir: kecepatan efektif = x + y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan untuk x dan y." },
      { label: "c.", text: "Berapa kecepatan perahu dan arus sungai?" },
    ],
  }),
  Qf(9, "Soal Penjualan Buku", {
    badge: "ANBK", type: "mixed",
    content: "Sebuah toko buku menjual buku pelajaran (Rp 45.000) dan novel (Rp 30.000). Dalam sehari terjual 80 buku dengan total Rp 2.850.000.",
    parts: [
      { label: "a.", text: "Misal buku pelajaran = x dan novel = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa buku pelajaran dan novel yang terjual?" },
    ],
  }),
  Qf(10, "Soal Tabungan", {
    badge: "AKM", type: "mixed",
    content: "Tabungan Andi dan Budi berjumlah Rp 2.400.000. Jika Andi memberi Rp 200.000 kepada Budi, tabungan Budi menjadi dua kali tabungan Andi.",
    parts: [
      { label: "a.", text: "Misal tabungan Andi = x dan Budi = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan tabungan masing-masing." },
    ],
  }),
  Qf(11, "Soal Campuran Larutan", {
    badge: "TKA", type: "mixed",
    content: "x liter larutan 40% asam dicampur dengan y liter larutan 10% asam untuk mendapatkan 15 liter larutan 30% asam.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa liter masing-masing larutan digunakan?" },
    ],
  }),
  Qf(12, "Soal Konferensi", {
    badge: "ANBK", type: "mixed",
    content: "Peserta konferensi terdiri dari pria dan wanita. Jumlah total = 120 orang. Banyak pria = 3 kali banyak wanita dikurangi 12.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan banyak pria dan wanita." },
    ],
  }),
  Qf(13, "Soal Lahan Pertanian", {
    badge: "AKM", type: "mixed",
    content: "Lahan seluas 200 m² ditanami jagung dan kedelai. Keuntungan jagung Rp 30.000/m² dan kedelai Rp 20.000/m². Total keuntungan Rp 5.000.000.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan luas tanaman jagung dan kedelai." },
    ],
  }),
  Qf(14, "Soal Pipa Air", {
    badge: "TKA", type: "mixed",
    content: "Pipa A dapat mengisi tangki dalam x jam dan pipa B dalam y jam. Bersama-sama mengisi dalam 4 jam. Pipa B membutuhkan waktu 6 jam lebih lama dari pipa A.",
    parts: [
      { label: "a.", math: "\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{4} \\quad \\text{dan} \\quad y = x + 6" },
      { label: "b.", text: "Selesaikan sistem tersebut." },
      { label: "c.", text: "Berapa jam pipa A dan B masing-masing mengisi tangki?" },
    ],
  }),
  Qf(15, "Soal Gaji Pekerja", {
    badge: "ANBK", type: "mixed",
    content: "Gaji x pekerja tetap dan y pekerja kontrak berjumlah Rp 45.000.000/bulan. Setiap pekerja tetap mendapat Rp 3.000.000 dan kontrak Rp 1.500.000. Total pekerja = 20 orang.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa pekerja tetap dan kontrak?" },
    ],
  }),
  Qf(16, "Soal Diskon", {
    badge: "UN", type: "mixed",
    content: "Harga kemeja setelah diskon 20% = Rp 80.000. Harga celana setelah diskon 25% = Rp 150.000. Sebelum diskon, total harga kemeja dan celana = ...",
    parts: [
      { label: "a.", text: "Tentukan harga asli kemeja (sebelum diskon)." },
      { label: "b.", text: "Tentukan harga asli celana (sebelum diskon)." },
      { label: "c.", text: "Berapa total harga asli kemeja dan celana?" },
    ],
  }),
  Qf(17, "Soal Sudut Segitiga", {
    badge: "UN", type: "mixed",
    content: "Dalam segitiga, sudut A dan sudut B saling berpelengkap (jumlah = 90°). Sudut A = 3 kali sudut B dikurangi 10°.",
    parts: [
      { label: "a.", text: "Misal sudut A = x° dan B = y°. Susun SPLDV." },
      { label: "b.", text: "Selesaikan dan tentukan besar kedua sudut." },
      { label: "c.", text: "Jika sudut C = 180° − sudut A − sudut B, tentukan sudut C." },
    ],
  }),
  Qf(18, "Soal Lomba Lari", {
    badge: "AKM", type: "mixed",
    content: "Dalam lomba lari, pelari A dan B berangkat dari titik yang sama. A berlari dengan kecepatan x m/menit dan B dengan y m/menit. Setelah 10 menit, A unggul 50 m. Jika B berlari 2 menit lebih lama, total jarak keduanya sama.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan kecepatan masing-masing pelari." },
    ],
  }),
  Qf(19, "Soal Produksi Pabrik", {
    badge: "TKA", type: "mixed",
    content: "Pabrik A memproduksi x unit/hari dan pabrik B y unit/hari. Dalam 5 hari pabrik A dan 3 hari pabrik B menghasilkan 1.100 unit. Dalam 2 hari A dan 4 hari B menghasilkan 880 unit.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa produksi per hari masing-masing pabrik?" },
    ],
  }),
  Qf(20, "Soal Nilai Rata-rata", {
    badge: "ANBK", type: "mixed",
    content: "Rata-rata nilai ujian dua mata pelajaran = 82. Nilai matematika dikurangi nilai bahasa = 8.",
    parts: [
      { label: "a.", text: "Misal nilai matematika = x dan bahasa = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan nilai matematika dan bahasa." },
    ],
  }),
  Qf(21, "Soal Uang — UN", {
    badge: "UN", type: "mixed",
    content: "Rudi memiliki lembaran uang Rp 50.000 dan Rp 100.000 sebanyak 30 lembar dengan nilai total Rp 2.100.000.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa lembar uang Rp 50.000 dan Rp 100.000?" },
    ],
  }),
  Qf(22, "Soal Pembuatan Kue", {
    badge: "AKM", type: "mixed",
    content: "Membuat kue A membutuhkan 2 cangkir tepung dan 1 cangkir gula. Membuat kue B membutuhkan 3 cangkir tepung dan 2 cangkir gula. Tersedia 18 cangkir tepung dan 12 cangkir gula.",
    parts: [
      { label: "a.", text: "Misal kue A = x dan kue B = y. Susun SPLDV dari tepung dan gula." },
      { label: "b.", text: "Selesaikan SPLDV." },
      { label: "c.", text: "Berapa kue A dan B yang bisa dibuat?" },
    ],
  }),
  Qf(23, "Soal Pecahan Bilangan", {
    badge: "UN", type: "mixed",
    content: "Suatu pecahan senilai 3/4. Jika pembilang ditambah 5 dan penyebut dikurangi 2, pecahan baru = 5/5.",
    parts: [
      { label: "a.", text: "Misal pembilang = x dan penyebut = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan pecahan awal." },
    ],
  }),
  Qf(24, "Soal Sewa Gudang", {
    badge: "TKA", type: "mixed",
    content: "Gudang A disewa selama x minggu dan gudang B selama y minggu. Biaya sewa A = Rp 500.000/minggu dan B = Rp 800.000/minggu. Total waktu sewa 12 minggu dengan biaya total Rp 7.500.000.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa minggu masing-masing gudang disewa?" },
    ],
  }),
  Qf(25, "Soal Dua Arah — Kereta", {
    badge: "TKA", type: "mixed",
    content: "Kereta A berkecepatan x km/jam dan kereta B berkecepatan y km/jam berjalan berlawanan arah dari dua kota berjarak 540 km. Mereka bertemu setelah 3 jam. Kereta A 30 km/jam lebih cepat dari B.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan kecepatan masing-masing kereta." },
    ],
  }),
  Qf(26, "Soal Populasi Bertumbuh", {
    badge: "AKM", type: "mixed",
    content: "Tahun lalu, jumlah siswa di dua sekolah = 1.200. Sekolah A bertambah 10% dan sekolah B bertambah 5% sehingga tahun ini jumlah total = 1.300 siswa.",
    parts: [
      { label: "a.", text: "Misal siswa sekolah A tahun lalu = x dan B = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa siswa di setiap sekolah tahun lalu?" },
    ],
  }),
  Qf(27, "Soal Nilai Ujian Berbobot", {
    badge: "ANBK", type: "mixed",
    content: "Nilai ujian Rina: teori = x dan praktik = y. Nilai akhir = 40% teori + 60% praktik = 82. Nilai teori = nilai praktik + 8.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan nilai teori dan praktik Rina." },
    ],
  }),
  Qf(28, "Soal Penerbangan", {
    badge: "TKA", type: "mixed",
    content: "Pesawat terbang ke arah timur (searah angin) menempuh 1.500 km dalam 3 jam. Ke arah barat (melawan angin) menempuh 1.500 km dalam 5 jam. Kecepatan pesawat di udara tenang = x km/jam, kecepatan angin = y km/jam.",
    parts: [
      { label: "a.", text: "Susun SPLDV dari perjalanan timur dan barat." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa kecepatan pesawat dan angin?" },
    ],
  }),
  Qf(29, "Soal Peternakan", {
    badge: "AKM", type: "mixed",
    content: "Sebuah peternakan menjual telur dan daging. Telur seharga Rp x/kg dan daging Rp y/kg. Penjualan: 10 kg telur + 5 kg daging = Rp 375.000. 4 kg telur + 8 kg daging = Rp 360.000.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa harga telur dan daging per kg?" },
    ],
  }),
  Qf(30, "Soal Bonus Karyawan", {
    badge: "AKM", type: "mixed",
    content: "Karyawan level A mendapat bonus Rp 1.500.000 dan level B mendapat Rp 900.000. Total karyawan = 30 orang dan total bonus = Rp 36.000.000.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa karyawan level A dan B?" },
    ],
  }),
  Qf(31, "Soal Olimpiade — Bilangan", {
    badge: "TKA", type: "mixed",
    content: "Selisih dua bilangan = 15. Dua kali bilangan besar dikurangi tiga kali bilangan kecil = 0.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan kedua bilangan." },
    ],
  }),
  Qf(32, "Soal Ujian Sekolah", {
    badge: "ANBK", type: "mixed",
    content: "Skor benar = 5 dan skor salah = −2. Dino mengerjakan 50 soal. Skor total Dino = 162.",
    parts: [
      { label: "a.", text: "Misal soal benar = x dan salah = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa soal yang dijawab benar dan salah?" },
    ],
  }),
  Qf(33, "Soal Pariwisata — ANBK", {
    badge: "ANBK", type: "mixed",
    content: "Tiket masuk museum: dewasa Rp 25.000 dan pelajar Rp 15.000. Pada Sabtu terjual 250 tiket dengan total Rp 5.250.000.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa tiket dewasa dan pelajar yang terjual?" },
    ],
  }),
  Qf(34, "Soal Rekening Bank", {
    badge: "AKM", type: "mixed",
    content: "Saldo rekening A = x rupiah dan B = y rupiah. Saldo A + saldo B = Rp 8.000.000. Jika Rp 500.000 dipindah dari A ke B, saldo B menjadi dua kali saldo A.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Tentukan saldo awal masing-masing rekening." },
    ],
  }),
  Qf(35, "Soal Populasi Dua Kelas", {
    badge: "UN", type: "mixed",
    content: "Kelas A memiliki x siswa dan kelas B memiliki y siswa. Total = 68. Rata-rata kelas A = 80 dan kelas B = 75. Rata-rata gabungan = 78.",
    parts: [
      { label: "a.", text: "Susun SPLDV dari jumlah siswa dan rata-rata gabungan." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa siswa di kelas A dan B?" },
    ],
  }),
  Qf(36, "Soal Warisan", {
    badge: "TKA", type: "mixed",
    content: "Harta warisan dibagi antara dua ahli waris. Total = Rp 120.000.000. Ahli waris pertama mendapat Rp 20.000.000 lebih dari yang kedua.",
    parts: [
      { label: "a.", text: "Susun SPLDV." },
      { label: "b.", text: "Selesaikan." },
      { label: "c.", text: "Berapa yang diterima masing-masing ahli waris?" },
    ],
  }),
  Qf(37, "Soal AKM — Berpikir Kritis", {
    badge: "AKM", type: "mixed",
    content: "Sebuah kolam renang diisi oleh dua pompa. Pompa A mengisi 1/x bagian per jam dan pompa B mengisi 1/y bagian per jam. Bersama mengisi penuh dalam 3 jam. Pompa A saja membutuhkan 5 jam.",
    parts: [
      { label: "a.", math: "\\text{Susun SPLDV: } \\frac{1}{x} + \\frac{1}{y} = \\frac{1}{3} \\text{ dan } x = 5" },
      { label: "b.", text: "Tentukan nilai y." },
      { label: "c.", text: "Berapa jam pompa B saja mengisi kolam?" },
    ],
  }),
  Qf(38, "Soal Olimpiade — Dua Bilangan", {
    badge: "TKA", type: "mixed",
    content: "Jumlah dua bilangan adalah 100. Jika bilangan pertama dibagi bilangan kedua hasilnya 3 sisa 4.",
    parts: [
      { label: "a.", text: "Misal bilangan pertama = x dan kedua = y. Susun SPLDV." },
      { label: "b.", math: "\\text{Hubungan pembagian: } x = 3y + 4" },
      { label: "c.", text: "Selesaikan dan tentukan kedua bilangan." },
    ],
  }),
  Qf(39, "Soal SPLDV — Variasi UN/TKA", {
    badge: "TKA", type: "mixed",
    content: "Nilai x dan y memenuhi:",
    blockMath: "\\begin{cases} 3x + 4y = 26 \\\\ 5x - 2y = 4 \\end{cases}",
    parts: [
      { label: "a.", text: "Selesaikan SPLDV tersebut." },
      { label: "b.", math: "\\text{Tentukan nilai } x^2 + y^2." },
      { label: "c.", math: "\\text{Tentukan nilai } \\frac{x}{y}." },
    ],
  }),
  Qf(40, "Soal AKM — Rekap Langkah", {
    badge: "AKM", type: "mixed",
    content: "Warung Bu Ani menjual nasi (Rp 8.000) dan mie goreng (Rp 6.000). Hari Senin terjual 80 porsi dengan total Rp 560.000. Hari Selasa terjual 100 porsi dengan total Rp 740.000.",
    parts: [
      { label: "a.", text: "Apakah data Senin dan Selasa konsisten? Susun SPLDV dari masing-masing hari." },
      { label: "b.", text: "Selesaikan SPLDV hari Senin untuk menentukan berapa nasi dan mie yang terjual." },
      { label: "c.", text: "Verifikasi dengan data hari Selasa." },
      { label: "d.", text: "Berapa total pendapatan Bu Ani selama dua hari?" },
    ],
  }),
];

const PenyelesaianMasalahPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <Rocket className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            PENYELESAIAN MASALAH SPLDV
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
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor, background: "rgba(167,139,250,0.08)" }}>
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
                    style={{ background: "rgba(167,139,250,0.08)", border: `1px solid ${borderColor}` }}>
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

export default PenyelesaianMasalahPage;
