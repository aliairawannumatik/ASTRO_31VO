import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  Microscope,
  Palette,
  Dices,
  FlaskConical,
  BookOpenCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Wrench,
  Target,
  ListChecks,
  Printer,
  FileDown,
} from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

type JenisAktivitas = "Proyek" | "Olimpiade" | "Eksplorasi" | "Investigasi" | "Permainan";

type AktivitasKokulikuler = {
  id: string;
  judul: string;
  materi: string;
  semester: 1 | 2;
  jenis: JenisAktivitas;
  waktu: string;
  deskripsi: string;
  tujuan: string[];
  langkah: string[];
  alat: string[];
  indikator: string;
};

const JENIS_STYLE: Record<JenisAktivitas, { bg: string; text: string; icon: React.ElementType }> = {
  Proyek:      { bg: "bg-blue-500/15 border-blue-400/40",    text: "text-blue-300",    icon: Palette },
  Olimpiade:   { bg: "bg-amber-500/15 border-amber-400/40",  text: "text-amber-300",   icon: Trophy },
  Eksplorasi:  { bg: "bg-violet-500/15 border-violet-400/40",text: "text-violet-300",  icon: Microscope },
  Investigasi: { bg: "bg-teal-500/15 border-teal-400/40",   text: "text-teal-300",    icon: FlaskConical },
  Permainan:   { bg: "bg-pink-500/15 border-pink-400/40",    text: "text-pink-300",    icon: Dices },
};

const AKTIVITAS_KELAS7: AktivitasKokulikuler[] = [
  {
    id: "7-1",
    judul: "Suhu Kota: Menjelajahi Bilangan Negatif",
    materi: "Bilangan Bulat",
    semester: 1,
    jenis: "Proyek",
    waktu: "2–3 pertemuan",
    deskripsi: "Peserta didik mengumpulkan data suhu berbagai kota di dunia (termasuk kota-kota di belahan bumi selatan yang dingin), kemudian membuat peta suhu dan membandingkan perbedaannya menggunakan operasi bilangan bulat.",
    tujuan: [
      "Menerapkan konsep bilangan bulat dalam konteks suhu nyata",
      "Melatih operasi penjumlahan dan pengurangan bilangan bulat",
      "Mengembangkan kemampuan literasi data",
    ],
    langkah: [
      "Kumpulkan data suhu harian 10 kota di dunia dari internet/koran",
      "Buat tabel perbandingan suhu tertinggi dan terendah",
      "Hitung selisih suhu menggunakan operasi bilangan bulat",
      "Buat peta dunia sederhana dengan kode warna berdasarkan suhu",
      "Presentasikan temuan kepada teman-teman",
    ],
    alat: ["Akses internet / koran / majalah", "Peta dunia kosong", "Pensil warna", "Tabel data kosong"],
    indikator: "Peserta didik mampu membuat laporan perbandingan suhu kota yang akurat dan mempresentasikannya dengan percaya diri.",
  },
  {
    id: "7-2",
    judul: "Warung Pecahan: Jual-Beli dengan Bilangan Rasional",
    materi: "Pecahan & Aritmetika Sosial",
    semester: 1,
    jenis: "Permainan",
    waktu: "1–2 pertemuan",
    deskripsi: "Simulasi jual-beli di 'warung' menggunakan kartu produk yang harganya berupa pecahan. Peserta didik belajar menghitung total belanja, kembalian, diskon, dan keuntungan dalam format permainan yang menyenangkan.",
    tujuan: [
      "Menerapkan operasi pecahan dalam konteks aritmetika sosial",
      "Melatih perhitungan untung-rugi, diskon, dan kembalian",
      "Membangun kerja sama tim",
    ],
    langkah: [
      "Buat kartu produk dengan harga pecahan (½ × harga, ¾ dari harga, dll.)",
      "Bagi kelas menjadi kelompok 'penjual' dan 'pembeli'",
      "Pembeli berbelanja dengan anggaran terbatas dan harus menghitung total sendiri",
      "Penjual menghitung kembalian dan keuntungan",
      "Rotasi peran dan diskusi tentang strategi terbaik",
    ],
    alat: ["Kartu produk buatan sendiri", "Uang mainan", "Kalkulator (cek jawaban)", "Papan skor"],
    indikator: "Peserta didik dapat melakukan transaksi jual-beli dengan perhitungan pecahan yang benar dan menjelaskan strategi penggunaan uang.",
  },
  {
    id: "7-3",
    judul: "Kode Aljabar: Cipher Matematika",
    materi: "Bentuk Aljabar",
    semester: 1,
    jenis: "Eksplorasi",
    waktu: "1–2 pertemuan",
    deskripsi: "Membuat dan memecahkan kode rahasia menggunakan ekspresi aljabar. Setiap huruf dikodekan sebagai bentuk aljabar, dan pesan dapat dibaca jika nilai variabel diketahui.",
    tujuan: [
      "Memahami konsep variabel dan substitusi nilai",
      "Menyederhanakan bentuk aljabar dalam konteks kreatif",
      "Mengembangkan berpikir logis dan kritis",
    ],
    langkah: [
      "Buat tabel kode: setiap huruf = ekspresi aljabar (mis. A=2x+1, B=3y-2, dst.)",
      "Tulis pesan rahasia dalam bentuk ekspresi aljabar",
      "Tentukan nilai x dan y, lalu hitung setiap ekspresi",
      "Tukar pesan dengan kelompok lain dan pecahkan kodenya",
      "Buat kode yang lebih kompleks sebagai tantangan",
    ],
    alat: ["Kartu huruf-aljabar", "Kertas dan pensil", "Tabel kode"],
    indikator: "Peserta didik dapat membuat dan memecahkan pesan kode aljabar dengan substitusi variabel yang tepat.",
  },
  {
    id: "7-4",
    judul: "Timbangan Ajaib: Visualisasi Persamaan Linear",
    materi: "PLSV",
    semester: 1,
    jenis: "Investigasi",
    waktu: "1 pertemuan",
    deskripsi: "Menggunakan timbangan (atau gambar timbangan) untuk memvisualisasikan keseimbangan persamaan linear. Peserta didik menemukan nilai variabel dengan menjaga keseimbangan timbangan.",
    tujuan: [
      "Memahami konsep keseimbangan dalam persamaan",
      "Menyelesaikan PLSV melalui pendekatan visual",
      "Mengembangkan intuisi aljabar",
    ],
    langkah: [
      "Gambar timbangan dengan benda-benda berlabel x dan angka",
      "Investigasi: benda apa yang harus ditambah/dikurangi agar seimbang?",
      "Terjemahkan timbangan menjadi persamaan matematika",
      "Selesaikan persamaan dan verifikasi dengan timbangan",
      "Buat soal timbangan sendiri dan tukar dengan teman",
    ],
    alat: ["Gambar timbangan / timbangan sederhana", "Benda pemberat kecil", "Kartu label x/angka"],
    indikator: "Peserta didik dapat menerjemahkan situasi keseimbangan menjadi persamaan linear dan menyelesaikannya.",
  },
  {
    id: "7-5",
    judul: "Miniatur Kota: Proyek Skala dan Perbandingan",
    materi: "Perbandingan",
    semester: 2,
    jenis: "Proyek",
    waktu: "3–4 pertemuan",
    deskripsi: "Peserta didik merancang dan membuat miniatur denah kota/sekolah menggunakan skala tertentu. Mereka harus menghitung jarak dan luas sebenarnya dari ukuran miniatur.",
    tujuan: [
      "Menerapkan konsep skala dan perbandingan dalam konteks nyata",
      "Mengembangkan keterampilan menggambar teknik sederhana",
      "Melatih kerja sama dan kreativitas",
    ],
    langkah: [
      "Pilih objek nyata: denah kelas, sekolah, atau lingkungan rumah",
      "Tentukan skala yang sesuai (mis. 1:100)",
      "Ukur dimensi objek nyata",
      "Hitung ukuran pada miniatur menggunakan perbandingan",
      "Gambar/buat miniatur dan labelkan ukurannya",
      "Presentasikan miniatur dan jelaskan perhitungannya",
    ],
    alat: ["Kertas millimeter / karton", "Penggaris dan jangka", "Pensil warna", "Meteran / penggaris panjang"],
    indikator: "Peserta didik menghasilkan miniatur dengan skala yang benar dan dapat menjelaskan hubungan antara ukuran miniatur dan aslinya.",
  },
  {
    id: "7-6",
    judul: "Origami Geometri: Seni Melipat & Matematika",
    materi: "Garis, Sudut & Segitiga",
    semester: 2,
    jenis: "Eksplorasi",
    waktu: "2 pertemuan",
    deskripsi: "Membuat bentuk-bentuk origami dan mengidentifikasi sifat geometri yang muncul: hubungan sudut, segitiga, segiempat, simetri, dan transformasi.",
    tujuan: [
      "Menemukan sifat sudut dan bangun datar melalui origami",
      "Mengidentifikasi hubungan antar sudut pada bangun yang dilipat",
      "Mengembangkan kecerdasan spasial",
    ],
    langkah: [
      "Mulai dengan lipatan dasar: bagi kertas menjadi 2, 4, 8 bagian",
      "Identifikasi sudut yang terbentuk di setiap lipatan",
      "Buat bentuk origami: perahu, kucing, bunga",
      "Identifikasi: berapa segitiga? segiempat? sudut siku-siku?",
      "Dokumentasikan temuan dalam lembar observasi",
    ],
    alat: ["Kertas origami berbagai warna", "Lembar observasi geometri", "Busur derajat"],
    indikator: "Peserta didik dapat mengidentifikasi minimal 5 sifat geometri dari karya origami yang dibuat.",
  },
  {
    id: "7-7",
    judul: "Venn Olympics: Kompetisi Diagram Himpunan",
    materi: "Himpunan",
    semester: 2,
    jenis: "Permainan",
    waktu: "1 pertemuan",
    deskripsi: "Kompetisi tim menggunakan diagram Venn raksasa di lantai. Peserta didik berlomba mengkategorikan kartu anggota himpunan dengan benar dan tercepat.",
    tujuan: [
      "Mengidentifikasi irisan, gabungan, selisih, dan komplemen himpunan",
      "Melatih keputusan cepat dan akurat",
      "Membangun semangat kompetisi sehat",
    ],
    langkah: [
      "Buat diagram Venn besar di lantai/papan menggunakan tali/kapur",
      "Siapkan kartu anggota himpunan (bilangan, nama, gambar, dll.)",
      "Tim A dan B berlomba menempatkan kartu di posisi yang benar",
      "Hitung skor berdasarkan kebenaran dan kecepatan",
      "Diskusi: ada berapa anggota irisan? gabungan? komplemen?",
    ],
    alat: ["Tali / kapur / lakban warna", "Kartu anggota himpunan", "Papan skor", "Stopwatch"],
    indikator: "Tim dapat menempatkan seluruh anggota himpunan dengan benar dan menjelaskan operasi himpunan yang terlibat.",
  },
  {
    id: "7-8",
    judul: "Olimpiade Mini: Soal Cerita Bilangan & Aljabar",
    materi: "Bilangan & Aljabar",
    semester: 1,
    jenis: "Olimpiade",
    waktu: "1 pertemuan",
    deskripsi: "Kompetisi soal olimpiade tingkat sekolah menggunakan soal-soal non-rutin bertema bilangan bulat, pecahan, dan aljabar. Melatih kemampuan bernalar dan pemecahan masalah tingkat lanjut.",
    tujuan: [
      "Melatih kemampuan bernalar dan berpikir tingkat tinggi (HOTS)",
      "Memperkenalkan soal-soal tipe olimpiade",
      "Membangun rasa percaya diri menghadapi kompetisi",
    ],
    langkah: [
      "Ronde 1: 10 soal pilihan ganda (20 menit)",
      "Ronde 2: 5 soal uraian singkat (30 menit)",
      "Ronde 3: 2 soal tantangan dengan presentasi solusi (20 menit)",
      "Diskusi pembahasan bersama setelah kompetisi",
      "Penghargaan untuk 3 peserta terbaik",
    ],
    alat: ["Soal olimpiade yang telah disiapkan", "Lembar jawaban", "Stopwatch", "Hadiah sederhana"],
    indikator: "Peserta didik dapat menyelesaikan minimal 60% soal olimpiade dan menjelaskan satu solusi soal tantangan.",
  },
];

const AKTIVITAS_KELAS8: AktivitasKokulikuler[] = [
  {
    id: "8-1",
    judul: "Grafik Kehidupan: Fungsi di Sekitar Kita",
    materi: "Relasi & Fungsi",
    semester: 1,
    jenis: "Investigasi",
    waktu: "2 pertemuan",
    deskripsi: "Peserta didik mengumpulkan data dari kehidupan nyata (tinggi badan vs berat, jam belajar vs nilai, dll.) dan menyelidiki apakah hubungan tersebut merupakan fungsi, serta menyajikannya dalam grafik.",
    tujuan: [
      "Mengidentifikasi relasi dan fungsi dalam data nyata",
      "Menyajikan fungsi dalam berbagai representasi",
      "Mengembangkan keterampilan analisis data",
    ],
    langkah: [
      "Survei data 20 teman: tinggi badan, berat, jam tidur, nilai ujian",
      "Buat pasangan berurutan dari dua variabel yang dipilih",
      "Periksa: apakah ini merupakan fungsi? Mengapa?",
      "Buat grafik pada koordinat Kartesius",
      "Interpretasikan: apakah ada pola? Fungsi linear atau tidak?",
      "Presentasikan temuan dengan poster",
    ],
    alat: ["Lembar survei", "Kertas grafik / millimeter", "Penggaris", "Pensil warna", "Kalkulator"],
    indikator: "Peserta didik menghasilkan laporan yang memuat data nyata, grafik, dan interpretasi tentang jenis relasi/fungsinya.",
  },
  {
    id: "8-2",
    judul: "Ramp Challenge: Gradien dan Kemiringan Nyata",
    materi: "Persamaan Garis Lurus",
    semester: 1,
    jenis: "Eksplorasi",
    waktu: "2 pertemuan",
    deskripsi: "Mengukur gradien berbagai ramp/landai di sekitar sekolah (ramp difabel, tangga, atap), lalu menghubungkan dengan konsep persamaan garis lurus dan standar keamanan ramp.",
    tujuan: [
      "Menghubungkan gradien dengan kemiringan benda nyata",
      "Menentukan persamaan garis dari dua titik yang diukur",
      "Mengembangkan kesadaran tentang aksesibilitas",
    ],
    langkah: [
      "Identifikasi 5–8 permukaan miring di sekitar sekolah",
      "Ukur tinggi (rise) dan jarak horizontal (run) setiap ramp",
      "Hitung gradien: m = rise/run",
      "Tulis persamaan garis untuk setiap ramp (pakai titik yang diukur)",
      "Bandingkan dengan standar ramp difabel (m ≤ 1/12)",
      "Buat laporan: mana yang sudah sesuai standar?",
    ],
    alat: ["Meteran / penggaris panjang", "Waterpass / benang lurus", "Lembar pengukuran", "Kalkulator"],
    indikator: "Peserta didik dapat mengukur gradien 5 permukaan, menuliskan persamaan garisnya, dan mengevaluasinya terhadap standar.",
  },
  {
    id: "8-3",
    judul: "Warung Matematika: SPLDV dalam Bisnis Kecil",
    materi: "SPLDV",
    semester: 2,
    jenis: "Proyek",
    waktu: "3 pertemuan",
    deskripsi: "Simulasi bisnis kecil di mana peserta didik harus menentukan harga dua produk menggunakan SPLDV berdasarkan informasi biaya dan keuntungan yang diberikan.",
    tujuan: [
      "Menerapkan SPLDV dalam konteks bisnis nyata",
      "Melatih kemampuan modeling matematis",
      "Mengembangkan jiwa kewirausahaan",
    ],
    langkah: [
      "Skenario: warung menjual dua produk dengan informasi penjualan dua hari",
      "Buat model matematika dalam bentuk SPLDV",
      "Selesaikan SPLDV dengan metode pilihan",
      "Verifikasi solusi dengan skenario asli",
      "Analisis: berapa keuntungan maksimum?",
      "Presentasikan 'laporan bisnis' kepada kelas",
    ],
    alat: ["Lembar skenario bisnis", "Kertas kerja SPLDV", "Kalkulator"],
    indikator: "Peserta didik dapat membuat model SPLDV dari skenario bisnis dan menyelesaikannya dengan benar.",
  },
  {
    id: "8-4",
    judul: "Pi Day Celebration: Eksplorasi Luas Lingkaran",
    materi: "Lingkaran",
    semester: 2,
    jenis: "Eksplorasi",
    waktu: "2 pertemuan",
    deskripsi: "Merayakan Hari Pi (14 Maret) dengan rangkaian aktivitas: mengukur keliling dan diameter benda bundar, menemukan nilai π secara eksperimental, dan membuat karya seni lingkaran.",
    tujuan: [
      "Menemukan nilai π melalui pengukuran langsung",
      "Memahami hubungan keliling, diameter, dan luas lingkaran",
      "Mengapresiasi keindahan matematika dalam kehidupan",
    ],
    langkah: [
      "Kumpulkan 10 benda berbentuk lingkaran/silinder",
      "Ukur keliling (dengan benang) dan diameter setiap benda",
      "Hitung rasio keliling/diameter → temukan π secara eksperimental",
      "Bandingkan dengan nilai π = 3,14159...",
      "Buat karya seni 'Spiral Pi': gambar lingkaran dengan jari-jari sesuai digit π",
      "Pameran karya kelas",
    ],
    alat: ["Benda-benda bundar (tutup botol, piring, gelas)", "Benang/tali", "Penggaris", "Kertas gambar", "Pensil warna"],
    indikator: "Peserta didik mendapatkan nilai π eksperimental antara 3,0–3,3 dan dapat menjelaskan hubungan π dengan rumus lingkaran.",
  },
  {
    id: "8-5",
    judul: "Desain Kemasan: Luas Permukaan & Volume",
    materi: "Bangun Ruang Sisi Datar",
    semester: 2,
    jenis: "Proyek",
    waktu: "3–4 pertemuan",
    deskripsi: "Peserta didik merancang kemasan produk (kotak makanan, kotak hadiah) dengan dimensi tertentu, menghitung luas permukaan (bahan yang dibutuhkan) dan volume (kapasitas), kemudian membuat prototipe dari karton.",
    tujuan: [
      "Menghitung luas permukaan dan volume bangun ruang sisi datar",
      "Menghubungkan jaring-jaring dengan bangun ruangnya",
      "Mengembangkan kreativitas dan keterampilan teknik",
    ],
    langkah: [
      "Tentukan produk yang akan dikemas dan dimensi yang diinginkan",
      "Hitung volume yang diperlukan",
      "Tentukan bentuk kemasan (kubus, balok, prisma)",
      "Hitung luas permukaan = luas bahan yang diperlukan",
      "Gambar jaring-jaring kemasan dengan ukuran tepat",
      "Potong karton, lipat, dan buat prototipe kemasan",
      "Hiasi dan presentasikan produk",
    ],
    alat: ["Karton / kardus bekas", "Penggaris", "Gunting dan cutter", "Lem", "Cat/stiker dekorasi"],
    indikator: "Peserta didik menghasilkan kemasan dengan dimensi tepat, jaring-jaring yang benar, dan menghitung luas permukaan serta volume dengan akurat.",
  },
  {
    id: "8-6",
    judul: "Pythagoras Hunter: Menemukan Segitiga Siku-siku di Sekolah",
    materi: "Teorema Pythagoras",
    semester: 2,
    jenis: "Investigasi",
    waktu: "2 pertemuan",
    deskripsi: "Berburu segitiga siku-siku tersembunyi di lingkungan sekolah, mengukur dimensinya, dan memverifikasi teorema Pythagoras secara langsung.",
    tujuan: [
      "Memverifikasi teorema Pythagoras secara eksperimental",
      "Mengidentifikasi segitiga siku-siku dalam konteks nyata",
      "Melatih pengukuran dan perhitungan akurat",
    ],
    langkah: [
      "Berkeliling sekolah dan identifikasi 8–10 segitiga siku-siku tersembunyi",
      "Contoh: diagonal ubin, sudut tembok, diagonal pintu, lereng atap",
      "Ukur dua sisi yang diketahui",
      "Hitung sisi ketiga menggunakan teorema Pythagoras",
      "Ukur langsung sisi ketiga dan bandingkan",
      "Catat persentase error pengukuran",
    ],
    alat: ["Meteran", "Lembar rekaman data", "Kalkulator", "Kamera HP (untuk dokumentasi)"],
    indikator: "Peserta didik memverifikasi teorema Pythagoras pada minimal 5 segitiga nyata dengan error pengukuran < 5%.",
  },
  {
    id: "8-7",
    judul: "Olimpiade Aljabar & Geometri Analitik",
    materi: "Koordinat, Fungsi, SPLDV",
    semester: 1,
    jenis: "Olimpiade",
    waktu: "1–2 pertemuan",
    deskripsi: "Kompetisi soal olimpiade bertema aljabar dan geometri analitik dengan soal-soal non-rutin yang melatih berpikir tingkat tinggi untuk persiapan OSN matematika.",
    tujuan: [
      "Mempersiapkan peserta didik menghadapi olimpiade matematika",
      "Mengembangkan strategi penyelesaian soal non-rutin",
      "Melatih kerja di bawah tekanan waktu",
    ],
    langkah: [
      "Sesi 1: Soal pemanasan — 15 soal dalam 30 menit",
      "Sesi 2: Soal utama — 8 soal uraian dalam 60 menit",
      "Sesi 3: Soal tantangan — 2 soal investigasi",
      "Pembahasan bersama dengan penjelasan strategi",
      "Diskusi: strategi mana yang paling efektif?",
    ],
    alat: ["Bank soal olimpiade", "Lembar jawaban", "Kalkulator scientific", "Papan tulis untuk pembahasan"],
    indikator: "Peserta didik dapat menyelesaikan minimal 50% soal olimpiade dan menjelaskan strategi untuk satu soal sulit.",
  },
  {
    id: "8-8",
    judul: "Pola Fibonacci: Eksplorasi Barisan Ajaib",
    materi: "Pola Bilangan",
    semester: 1,
    jenis: "Eksplorasi",
    waktu: "2 pertemuan",
    deskripsi: "Menyelidiki barisan Fibonacci yang muncul di alam (bunga matahari, siput, kelopak bunga, spiral galaksi) dan menghubungkannya dengan konsep pola bilangan dan rasio emas (golden ratio).",
    tujuan: [
      "Mengenal dan menggeneralisasi pola barisan Fibonacci",
      "Menemukan pola Fibonacci di alam sekitar",
      "Mengenal konsep rasio emas secara intuitif",
    ],
    langkah: [
      "Temukan barisan Fibonacci: 1, 1, 2, 3, 5, 8, 13, ...",
      "Investigasi: apa rumus suku ke-n?",
      "Hitung rasio suku berurutan: 2/1, 3/2, 5/3, 8/5, ... → mendekati apa?",
      "Identifikasi Fibonacci di alam: hitung kelopak bunga, spiral bunga matahari",
      "Buat spiral Fibonacci menggunakan kotak persegi",
      "Investigasi: apakah barisan geometri punya sifat serupa?",
    ],
    alat: ["Kertas kotak-kotak", "Pensil warna", "Bunga/daun dari kebun", "Kalkulator"],
    indikator: "Peserta didik dapat mengidentifikasi pola Fibonacci, menghitung rasio emas, dan menemukan contohnya di alam.",
  },
];

const AKTIVITAS_KELAS9: AktivitasKokulikuler[] = [
  {
    id: "9-1",
    judul: "Pertumbuhan Virus: Bilangan Berpangkat di Dunia Nyata",
    materi: "Bilangan Berpangkat",
    semester: 1,
    jenis: "Investigasi",
    waktu: "2 pertemuan",
    deskripsi: "Memodelkan pertumbuhan eksponensial menggunakan konteks nyata (pertumbuhan bakteri, bunga majemuk, penyebaran informasi di media sosial) dan menghitung proyeksinya menggunakan bilangan berpangkat.",
    tujuan: [
      "Menerapkan bilangan berpangkat dalam model pertumbuhan eksponensial",
      "Menginterpretasikan hasil perhitungan dalam konteks nyata",
      "Mengembangkan literasi sains dan digital",
    ],
    langkah: [
      "Mulai dengan pertanyaan: jika satu bakteri membelah setiap 20 menit, berapa setelah 3 jam?",
      "Buat tabel: waktu vs jumlah bakteri",
      "Tulis pola: 2⁰, 2¹, 2², ..., 2ⁿ",
      "Simulasi: lipat kertas sebanyak mungkin (maks 8 kali) dan hitung ketebalan",
      "Studi kasus: bunga majemuk bank — investasi Rp1.000.000 dengan bunga 10% per tahun, 20 tahun",
      "Diskusi: mengapa pertumbuhan eksponensial sangat dramatis?",
    ],
    alat: ["Kertas HVS (simulasi lipatan)", "Kalkulator scientific", "Tabel data", "Grafik kertas"],
    indikator: "Peserta didik dapat memodelkan pertumbuhan eksponensial, menghitung nilai suku tertentu, dan menginterpretasikan grafiknya.",
  },
  {
    id: "9-2",
    judul: "Roket Parabola: Fungsi Kuadrat dalam Fisika",
    materi: "Fungsi Kuadrat",
    semester: 1,
    jenis: "Proyek",
    waktu: "3 pertemuan",
    deskripsi: "Merancang dan meluncurkan roket air sederhana, kemudian menganalisis lintasan parabolanya menggunakan fungsi kuadrat. Menghubungkan matematika dengan fisika dalam proyek interdisipliner.",
    tujuan: [
      "Memahami fungsi kuadrat melalui konteks lintasan parabola",
      "Menentukan titik puncak (ketinggian maksimum) dan titik potong (jarak mendarat)",
      "Mengembangkan kemampuan kolaborasi lintas ilmu",
    ],
    langkah: [
      "Pelajari model lintasan parabola: h(t) = -½gt² + v₀t + h₀",
      "Sederhanakan: y = ax² + bx + c dalam konteks ketinggian",
      "Rancang dan buat roket kertas/air sederhana",
      "Luncurkan dan dokumentasikan lintasan (rekam video)",
      "Analisis frame video: titik-titik koordinat lintasan",
      "Fitting ke fungsi kuadrat dan tentukan titik puncak",
    ],
    alat: ["Botol plastik / kertas karton (roket)", "Meteran", "Kamera HP", "Aplikasi koordinat/graphing"],
    indikator: "Peserta didik dapat menentukan persamaan fungsi kuadrat dari lintasan roket dan menginterpretasikan titik puncak dan akar-akarnya.",
  },
  {
    id: "9-3",
    judul: "Seni Transformasi: Matematika dalam Desain",
    materi: "Transformasi Geometri",
    semester: 1,
    jenis: "Proyek",
    waktu: "2–3 pertemuan",
    deskripsi: "Membuat karya seni menggunakan konsep transformasi geometri (refleksi, rotasi, translasi, dilatasi). Peserta didik merancang motif batik, tesselasi, atau mandala menggunakan transformasi.",
    tujuan: [
      "Menerapkan transformasi geometri dalam konteks seni",
      "Mengidentifikasi dan melakukan transformasi pada bidang koordinat",
      "Mengapresiasi hubungan matematika dengan seni dan budaya",
    ],
    langkah: [
      "Pelajari contoh motif batik/tesselasi yang menggunakan transformasi",
      "Rancang motif dasar (satu bangun geometri sederhana)",
      "Terapkan refleksi (cermin), rotasi (putar 90°/180°), dan translasi",
      "Buat karya utuh dengan motif yang berulang menggunakan transformasi",
      "Warnai dan bingkai karya",
      "Jelaskan transformasi apa saja yang digunakan dalam karya",
    ],
    alat: ["Kertas berpetak", "Penggaris dan jangka", "Pensil warna / cat air", "Busur derajat"],
    indikator: "Peserta didik menghasilkan karya seni yang menggunakan minimal 3 jenis transformasi geometri dan dapat menjelaskannya secara matematis.",
  },
  {
    id: "9-4",
    judul: "Pengukuran Tak Langsung: Tinggi Pohon & Gedung",
    materi: "Kesebangunan & Teorema Pythagoras",
    semester: 2,
    jenis: "Investigasi",
    waktu: "2 pertemuan",
    deskripsi: "Mengukur tinggi benda-benda tinggi di lingkungan sekolah (pohon, tiang bendera, gedung) tanpa memanjatnya, menggunakan prinsip kesebangunan segitiga dan bayangan.",
    tujuan: [
      "Menerapkan konsep kesebangunan dalam pengukuran tak langsung",
      "Mengembangkan keterampilan observasi dan pengukuran",
      "Menghubungkan matematika dengan survei dan teknik sipil",
    ],
    langkah: [
      "Pilih 5 objek tinggi di sekitar sekolah",
      "Metode 1 (Bayangan): ukur bayangan objek dan bayangan tongkat dengan tinggi diketahui",
      "Hitung tinggi objek menggunakan perbandingan kesebangunan",
      "Metode 2 (Cermin): letakkan cermin di tanah, ukur jarak dan gunakan prinsip sudut pantul",
      "Bandingkan hasil dua metode",
      "Dokumentasikan proses dengan foto dan buat laporan",
    ],
    alat: ["Meteran", "Tongkat 1 meter", "Cermin kecil", "Lembar pengukuran", "Kamera HP"],
    indikator: "Peserta didik dapat mengukur tinggi minimal 3 objek dengan dua metode berbeda dan menjelaskan prinsip kesebangunan yang digunakan.",
  },
  {
    id: "9-5",
    judul: "Penelitian Mini: Statistika Kehidupan Sekolah",
    materi: "Statistika",
    semester: 2,
    jenis: "Proyek",
    waktu: "4–5 pertemuan",
    deskripsi: "Peserta didik melakukan penelitian statistika lengkap mulai dari merumuskan pertanyaan, mengumpulkan data survei, menyajikan dalam berbagai grafik, menganalisis ukuran pemusatan, hingga menarik kesimpulan.",
    tujuan: [
      "Melakukan siklus lengkap penelitian statistika",
      "Menghitung dan menginterpretasikan mean, median, modus, dan jangkauan",
      "Mengembangkan kemampuan komunikasi data",
    ],
    langkah: [
      "Pilih topik: pola belajar siswa, kebiasaan olahraga, preferensi makanan, dll.",
      "Rumuskan pertanyaan penelitian yang spesifik",
      "Rancang instrumen survei (5–10 pertanyaan)",
      "Survei 30 responden",
      "Tabulasi data dan buat tabel frekuensi",
      "Buat 3 jenis grafik: batang, lingkaran, dan garis",
      "Hitung mean, median, modus, dan jangkauan",
      "Tulis laporan penelitian dengan kesimpulan dan rekomendasi",
    ],
    alat: ["Form survei cetak/digital", "Kalkulator", "Kertas grafik", "Software presentasi (opsional)"],
    indikator: "Peserta didik menghasilkan laporan penelitian lengkap dengan minimal 3 grafik, analisis statistik, dan kesimpulan yang valid.",
  },
  {
    id: "9-6",
    judul: "Eksperimen Peluang: Koin, Dadu, dan Hukum Bilangan Besar",
    materi: "Peluang",
    semester: 2,
    jenis: "Eksplorasi",
    waktu: "2 pertemuan",
    deskripsi: "Menyelidiki hubungan antara peluang teoritis dan peluang empiris melalui eksperimen berulang. Menemukan Hukum Bilangan Besar secara eksperimental.",
    tujuan: [
      "Memahami perbedaan peluang teoritis dan empiris",
      "Menemukan Hukum Bilangan Besar melalui eksperimen",
      "Mengembangkan kemampuan berpikir probabilistik",
    ],
    langkah: [
      "Prediksi: berapa kali muncul angka jika koin dilempar 100 kali?",
      "Eksperimen: lempar koin 10x, 20x, 50x, 100x → catat hasil",
      "Hitung peluang empiris di setiap tahap",
      "Buat grafik: jumlah lemparan vs peluang empiris",
      "Ulangi dengan dadu: peluang muncul angka 6",
      "Diskusi: mengapa peluang empiris mendekati teoritis saat n besar?",
    ],
    alat: ["Koin", "Dadu (beberapa buah)", "Tabel rekaman data", "Kertas grafik", "Kalkulator"],
    indikator: "Peserta didik membuktikan secara eksperimental bahwa peluang empiris mendekati peluang teoritis seiring bertambahnya percobaan.",
  },
  {
    id: "9-7",
    judul: "Kemasan Kreatif: Volume & Luas Permukaan Sisi Lengkung",
    materi: "Bangun Ruang Sisi Lengkung",
    semester: 2,
    jenis: "Proyek",
    waktu: "3 pertemuan",
    deskripsi: "Merancang kemasan produk berbentuk tabung, kerucut, atau kombinasi keduanya untuk produk tertentu. Mengoptimalkan desain agar menggunakan bahan seminimal mungkin untuk volume tertentu.",
    tujuan: [
      "Menghitung luas permukaan dan volume bangun ruang sisi lengkung",
      "Mengenal konsep optimasi sederhana dalam desain",
      "Mengembangkan kreativitas dalam pemecahan masalah nyata",
    ],
    langkah: [
      "Pilih produk: minuman, snack, lilin, dll.",
      "Tentukan volume yang diperlukan",
      "Coba berbagai dimensi tabung/kerucut yang memenuhi volume tersebut",
      "Hitung luas permukaan untuk setiap pilihan dimensi",
      "Pilih dimensi yang menghasilkan luas permukaan terkecil (paling hemat bahan)",
      "Buat jaring-jaring dan prototipe kemasan",
      "Beri label dengan perhitungan lengkap",
    ],
    alat: ["Karton / kertas manila", "Penggaris, jangka, gunting", "Lem", "Kalkulator", "Tabel perbandingan dimensi"],
    indikator: "Peserta didik menghasilkan prototipe kemasan dengan perhitungan volume dan luas permukaan yang benar, serta dapat menjelaskan pilihan dimensi.",
  },
  {
    id: "9-8",
    judul: "Olimpiade Persiapan OSN: Soal HOTS Kelas 9",
    materi: "Semua Materi",
    semester: 2,
    jenis: "Olimpiade",
    waktu: "2 pertemuan",
    deskripsi: "Seri latihan soal olimpiade bertingkat untuk mempersiapkan peserta didik menghadapi Olimpiade Sains Nasional (OSN) tingkat kabupaten/kota, mencakup seluruh materi matematika SMP.",
    tujuan: [
      "Mempersiapkan peserta didik untuk OSN/KSN matematika",
      "Mengembangkan strategi penyelesaian masalah tingkat lanjut",
      "Membangun stamina dan ketahanan mental dalam kompetisi",
    ],
    langkah: [
      "Tryout 1: 30 soal pilihan ganda (60 menit) — materi kelas 7, 8, 9",
      "Pembahasan soal dengan strategi penyelesaian",
      "Tryout 2: 10 soal uraian (90 menit) — soal tingkat kabupaten",
      "Diskusi kelompok: berbagi strategi penyelesaian terbaik",
      "Pembuatan 'Buku Strategi' — kumpulan trik dan pola soal olimpiade",
    ],
    alat: ["Bank soal OSN matematika SMP", "Lembar jawaban khusus olimpiade", "Kalkulator scientific"],
    indikator: "Peserta didik dapat menyelesaikan minimal 40% soal level OSN kabupaten dan mengidentifikasi tipe soal beserta strategi penyelesaiannya.",
  },
];

const SEMUA_AKTIVITAS = {
  "kelas7": AKTIVITAS_KELAS7,
  "kelas8": AKTIVITAS_KELAS8,
  "kelas9": AKTIVITAS_KELAS9,
};
type KelasKey = keyof typeof SEMUA_AKTIVITAS;

const KokulikulerPage = () => {
  const navigate = useNavigate();
  const [kelas, setKelas] = useState<KelasKey>("kelas7");
  const [filterJenis, setFilterJenis] = useState<JenisAktivitas | "Semua">("Semua");
  const [filterSem, setFilterSem] = useState<"Semua" | "1" | "2">("Semua");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const data = SEMUA_AKTIVITAS[kelas];
  const filtered = data.filter(a => {
    const jenisOk = filterJenis === "Semua" || a.jenis === filterJenis;
    const semOk = filterSem === "Semua" || a.semester === parseInt(filterSem);
    return jenisOk && semOk;
  });

  const toggle = (id: string) => {
    playPopSound();
    setExpanded(p => ({ ...p, [id]: !p[id] }));
  };

  const kelasNum = kelas.replace("kelas", "");

  const jenisAll: (JenisAktivitas | "Semua")[] = ["Semua", "Proyek", "Olimpiade", "Eksplorasi", "Investigasi", "Permainan"];

  const countByJenis = (j: JenisAktivitas) => data.filter(a => a.jenis === j).length;

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-14">

        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-100 mb-4">
            <Trophy className="w-4 h-4" />
            Ruang Untuk Guru · Kurikulum Merdeka
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-primary text-glow-cyan leading-tight">
            KOKULIKULER MATEMATIKA
          </h1>
          <p className="mt-3 text-sm text-white/60 font-body max-w-3xl mx-auto">
            Kegiatan kokulikuler adalah aktivitas di luar jam pelajaran reguler yang memperkaya dan memperdalam pembelajaran Matematika. Dirancang sesuai Kurikulum Merdeka untuk mengembangkan kompetensi, kreativitas, dan karakter peserta didik.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-4 mb-6 animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["Proyek", "Olimpiade", "Eksplorasi", "Investigasi"] as JenisAktivitas[]).map(j => {
              const s = JENIS_STYLE[j];
              const Icon = s.icon;
              const total = AKTIVITAS_KELAS7.filter(a => a.jenis === j).length +
                            AKTIVITAS_KELAS8.filter(a => a.jenis === j).length +
                            AKTIVITAS_KELAS9.filter(a => a.jenis === j).length;
              return (
                <div key={j} className={`rounded-xl border p-3 text-center ${s.bg}`}>
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${s.text}`} />
                  <p className={`font-bold text-sm ${s.text}`}>{j}</p>
                  <p className="text-white/40 text-[10px]">{total} aktivitas</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kelas Tabs */}
        <div className="flex justify-center gap-2 mb-4 animate-slide-up">
          {(["kelas7", "kelas8", "kelas9"] as KelasKey[]).map(k => (
            <button key={k} onClick={() => { playPopSound(); setKelas(k); setExpanded({}); setFilterJenis("Semua"); setFilterSem("Semua"); }}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                kelas === k ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}>
              Kelas {k.replace("kelas", "")}
            </button>
          ))}
        </div>

        {/* Jenis Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 animate-slide-up">
          {jenisAll.map(j => {
            const count = j === "Semua" ? data.length : countByJenis(j as JenisAktivitas);
            const s = j !== "Semua" ? JENIS_STYLE[j as JenisAktivitas] : null;
            return (
              <button key={j} onClick={() => { playPopSound(); setFilterJenis(j); }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  filterJenis === j
                    ? s ? `${s.bg} ${s.text} ring-1 ring-current` : "bg-white/15 border-white/40 text-white"
                    : "bg-white/5 border-white/10 text-white/50 hover:text-white/80"
                }`}>
                {j !== "Semua" && (() => { const Icon = JENIS_STYLE[j as JenisAktivitas].icon; return <Icon className="w-3 h-3" />; })()}
                {j}
                <span className="bg-white/10 rounded-full px-1.5 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Semester Filter */}
        <div className="flex justify-center gap-2 mb-5 animate-slide-up">
          {([["Semua", "Semua Semester"], ["1", "Semester Ganjil"], ["2", "Semester Genap"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => { playPopSound(); setFilterSem(v); }}
              className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                filterSem === v ? "bg-teal-600 text-white" : "bg-white/5 border border-white/10 text-white/50 hover:text-white"
              }`}>
              {l}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between mb-4 animate-slide-up">
          <p className="text-white/50 text-xs">
            Kelas {kelasNum} · <span className="text-amber-300 font-bold">{filtered.length}</span> aktivitas ditampilkan
          </p>
          <button onClick={() => setExpanded(filtered.reduce((a, act) => ({ ...a, [act.id]: true }), {}))}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors">
            Buka Semua
          </button>
        </div>

        {/* Aktivitas Cards */}
        <div className="space-y-4 mb-10">
          {filtered.map((akt, idx) => {
            const s = JENIS_STYLE[akt.jenis];
            const Icon = s.icon;
            const isOpen = expanded[akt.id] ?? false;
            return (
              <div key={akt.id}
                className="bg-card/70 backdrop-blur border border-white/10 rounded-2xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}>

                {/* Card Header */}
                <button className="w-full text-left px-5 py-4 hover:bg-white/3 transition-colors group"
                  onClick={() => toggle(akt.id)}>
                  <div className="flex items-start gap-4">
                    <div className={`rounded-xl p-2.5 border shrink-0 ${s.bg}`}>
                      <Icon className={`w-5 h-5 ${s.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="font-display font-bold text-white text-base leading-tight">{akt.judul}</h2>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.bg} ${s.text}`}>
                          {akt.jenis}
                        </span>
                        <span className="text-[10px] text-white/40 font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                          {akt.materi}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${akt.semester === 1 ? "bg-cyan-500/15 text-cyan-400" : "bg-violet-500/15 text-violet-400"}`}>
                          Sem. {akt.semester === 1 ? "Ganjil" : "Genap"}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-white/40">
                          <Clock className="w-3 h-3" />{akt.waktu}
                        </span>
                      </div>
                      <p className="text-xs text-white/55 mt-2 font-body leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                        {akt.deskripsi}
                      </p>
                    </div>
                    <div className={`shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-4 h-4 text-white/30" />
                    </div>
                  </div>
                </button>

                {/* Expanded Detail */}
                {isOpen && (
                  <div className="border-t border-white/10 px-5 py-5 space-y-5">
                    {/* Tujuan */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-teal-400" />
                        <p className="text-teal-300 font-bold text-xs uppercase tracking-wider">Tujuan Aktivitas</p>
                      </div>
                      <ul className="space-y-1">
                        {akt.tujuan.map((t, i) => (
                          <li key={i} className="flex gap-2 text-xs text-white/70 font-body">
                            <span className="text-teal-400 font-bold shrink-0">{i + 1}.</span>{t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Langkah */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ListChecks className="w-4 h-4 text-amber-400" />
                        <p className="text-amber-300 font-bold text-xs uppercase tracking-wider">Langkah-langkah</p>
                      </div>
                      <ol className="space-y-2">
                        {akt.langkah.map((l, i) => (
                          <li key={i} className="flex gap-3 text-xs text-white/70 font-body">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] shrink-0 mt-0.5">{i + 1}</span>
                            <span className="leading-relaxed">{l}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Alat & Indikator */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/3 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="w-4 h-4 text-blue-400" />
                          <p className="text-blue-300 font-bold text-xs uppercase tracking-wider">Alat & Bahan</p>
                        </div>
                        <ul className="space-y-1">
                          {akt.alat.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-white/65 font-body">
                              <span className="text-blue-400 shrink-0 mt-0.5">•</span>{a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-teal-900/20 border border-teal-500/25 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpenCheck className="w-4 h-4 text-teal-400" />
                          <p className="text-teal-300 font-bold text-xs uppercase tracking-wider">Indikator Keberhasilan</p>
                        </div>
                        <p className="text-xs text-white/70 font-body leading-relaxed">{akt.indikator}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30 text-sm">
              Tidak ada aktivitas yang cocok dengan filter ini.
            </div>
          )}
        </div>

        {/* Catatan */}
        <div className="bg-white/3 border border-white/10 rounded-xl p-5 mb-8 text-xs text-white/50 font-body space-y-1.5 animate-slide-up">
          <p className="text-white/70 font-bold text-[11px] uppercase mb-2">📌 Panduan Pelaksanaan Kokulikuler</p>
          <p>• Kokulikuler bersifat <strong className="text-white/70">pengayaan</strong> dan dapat dilaksanakan di luar jam pelajaran reguler (sepulang sekolah, hari Sabtu, atau kegiatan khusus).</p>
          <p>• Guru dapat memilih aktivitas yang paling relevan dengan materi yang sedang atau baru saja dipelajari.</p>
          <p>• Aktivitas bisa dimodifikasi sesuai kondisi sekolah, jumlah siswa, dan ketersediaan alat.</p>
          <p>• Hasil kokulikuler dapat dijadikan <strong className="text-white/70">portofolio</strong> peserta didik dalam asesmen Kurikulum Merdeka.</p>
          <p>• Jenis Olimpiade direkomendasikan untuk peserta didik yang berminat mengikuti OSN/KSN Matematika.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={() => { playPopSound(); window.print(); }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500/90 border border-cyan-400/40 text-white text-sm font-semibold font-body transition-all"
          >
            <Printer className="w-4 h-4" />
            Simpan sebagai PDF
          </button>
          <button
            onClick={() => {
              playPopSound();
              const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;font-size:11pt;margin:2cm}h1{text-align:center;font-size:14pt;font-weight:bold;margin:0 0 6pt 0}h2{font-size:12pt;font-weight:bold;margin:14pt 0 4pt 0}p{font-size:10pt;margin:3pt 0;text-align:justify}</style></head><body><h1>KOKULIKULER MATEMATIKA</h1><p style="text-align:center;font-size:10pt;margin:2pt 0 14pt 0">Kegiatan Kokulikuler Mata Pelajaran Matematika SMP — Fase D</p><p>Dokumen ini dicetak dari Aplikasi NUMATIK. Kokulikuler matematika mencakup berbagai kegiatan pengayaan seperti olimpiade, eksplorasi ilmiah, karya seni matematika, dan proyek berbasis masalah yang mendukung capaian pembelajaran Fase D.</p></body></html>`;
              const blob = new Blob(["\ufeff", html], { type: "application/msword" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "Kokulikuler_Matematika.doc";
              document.body.appendChild(a); a.click();
              document.body.removeChild(a); URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-500/90 border border-violet-400/40 text-white text-sm font-semibold font-body transition-all"
          >
            <FileDown className="w-4 h-4" />
            Simpan sebagai Word
          </button>
        </div>

        <div className="text-center">
          <button onClick={() => { playPopSound(); navigate("/ruang-untuk-guru"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Ruang Untuk Guru
          </button>
        </div>
      </div>
    </div>
  );
};

export default KokulikulerPage;
