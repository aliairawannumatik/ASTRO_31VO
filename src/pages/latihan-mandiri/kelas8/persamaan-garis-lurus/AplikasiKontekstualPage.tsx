import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import CoordPlane from "../koordinat-cartesius/CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Tarif Taksi Online", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: 0, y1: 1, x2: 5, y2: 6, color: "#60a5fa", label: "Tarif" }],
      pts: [
        { x: 0, y: 1, label: "(0,10rb)", color: "#60a5fa", labelPos: "tr" },
        { x: 5, y: 6, label: "(5km,60rb)", color: "#60a5fa", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 1, y: 5, text: "sumbu-x: jarak (km)", color: "rgba(255,255,255,0.4)", size: 8 },
        { x: -2, y: 3, text: "sumbu-y: tarif (×10rb)", color: "rgba(255,255,255,0.4)", size: 8 },
      ],
    },
    content: "Tarif taksi online: Rp10.000 biaya awal ditambah Rp10.000 per km.",
    parts: [
      { label: "a.", math: "\\text{Tuliskan persamaan tarif: } T = f(x)" },
      { label: "b.", math: "\\text{Berapa tarif untuk perjalanan 8 km?}" },
      { label: "c.", math: "\\text{Berapa km jika tarif Rp65.000?}" },
    ],
  }),

  Q(2, "Harga Paket Data", {
    type: "mixed",
    content: "Harga paket data: Rp5.000 per GB ditambah biaya admin Rp3.000.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan harga } H \\text{ untuk } g \\text{ GB.}" },
      { label: "b.", math: "\\text{Berapa harga untuk 10 GB?}" },
      { label: "c.", math: "\\text{Berapa GB yang didapat dengan Rp28.000?}" },
      { label: "d.", text: "Gambarkan grafik hubungan jumlah GB dan harga." },
    ],
  }),

  Q(3, "Konversi Suhu Celsius — Fahrenheit", {
    type: "mixed",
    content: "Konversi suhu: 0°C = 32°F dan 100°C = 212°F.",
    parts: [
      { label: "a.", math: "\\text{Tentukan gradien hubungan }\\!\\!\\!\\! F \\text{ dan } C." },
      { label: "b.", math: "\\text{Tuliskan persamaan } F = f(C)." },
      { label: "c.", math: "\\text{Berapa }{}^\\circ\\!F \\text{ untuk } 37^\\circ C \\text{ (suhu tubuh)?}" },
      { label: "d.", math: "\\text{Berapa }{}^\\circ C \\text{ untuk } 98{,}6^\\circ F?" },
    ],
  }),

  Q(4, "Pertumbuhan Tanaman", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: 0, y1: 2, x2: 5, y2: 7, color: "#34d399", label: "Tinggi" }],
      pts: [
        { x: 0, y: 2, label: "(0, 2cm)", color: "#34d399", labelPos: "tr" },
        { x: 4, y: 6, label: "(4, 6cm)", color: "#34d399", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 2, y: 5.5, text: "minggu ke-", color: "rgba(255,255,255,0.4)", size: 8 },
      ],
    },
    content: "Tanaman mula-mula tingginya 2 cm. Tumbuh 1 cm per minggu secara linier.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan tinggi } T \\text{ setelah } w \\text{ minggu.}" },
      { label: "b.", math: "\\text{Berapa tinggi setelah 10 minggu?}" },
      { label: "c.", math: "\\text{Kapan tanaman mencapai tinggi 30 cm?}" },
    ],
  }),

  Q(5, "Kecepatan Konstan — Jarak dan Waktu", {
    type: "mixed",
    content: "Sepeda motor melaju dengan kecepatan tetap 60 km/jam dari kota A.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan jarak } d \\text{ setelah } t \\text{ jam.}" },
      { label: "b.", math: "\\text{Berapa jarak setelah 2{,}5 jam?}" },
      { label: "c.", math: "\\text{Kapan mencapai jarak 210 km?}" },
      { label: "d.", text: "Gambarkan grafik jarak vs waktu." },
    ],
  }),

  Q(6, "UN 2019 — Biaya Produksi", {
    type: "mixed",
    content: "Biaya produksi x barang adalah B(x) = 5000x + 200.000 (dalam rupiah).",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan 5000x dalam konteks ini?" },
      { label: "b.", text: "Apa yang dimaksud dengan 200.000 dalam konteks ini?" },
      { label: "c.", math: "\\text{Berapa biaya produksi 100 barang?}" },
      { label: "d.", math: "\\text{Berapa barang yang bisa diproduksi dengan anggaran Rp950.000?}" },
    ],
  }),

  Q(7, "Tabungan Bertambah Rutin", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: 0, y1: 1, x2: 5, y2: 6, color: "#facc15", label: "Tabungan" }],
      pts: [
        { x: 0, y: 1, label: "(0, 50rb)", color: "#facc15", labelPos: "tr" },
        { x: 4, y: 5, label: "(4bln, 250rb)", color: "#facc15", labelPos: "tr" },
      ],
    },
    content: "Riko menabung Rp50.000/bulan. Tabungan awal Rp50.000.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan tabungan } T \\text{ setelah } n \\text{ bulan.}" },
      { label: "b.", math: "\\text{Berapa tabungan setelah 1 tahun?}" },
      { label: "c.", math: "\\text{Kapan tabungan mencapai Rp500.000?}" },
    ],
  }),

  Q(8, "Penurunan Nilai Barang", {
    type: "mixed",
    content: "Nilai sebuah laptop mula-mula Rp8.000.000. Nilainya turun Rp1.000.000 per tahun.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan nilai } V \\text{ setelah } t \\text{ tahun.}" },
      { label: "b.", math: "\\text{Berapa nilai laptop setelah 3 tahun?}" },
      { label: "c.", math: "\\text{Kapan nilai laptop menjadi Rp2.000.000?}" },
      { label: "d.", text: "Apakah nilai laptop bisa menjadi negatif? Jelaskan batasan modelnya!" },
    ],
  }),

  Q(9, "Isi Bahan Bakar", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: 0, y1: 6, x2: 6, y2: 0, color: "#f472b6", label: "BBM" }],
      pts: [
        { x: 0, y: 6, label: "(0, 60L)", color: "#f472b6", labelPos: "tr" },
        { x: 6, y: 0, label: "(600km, 0)", color: "#f472b6", labelPos: "top" },
      ],
    },
    content: "Tangki sepeda motor berisi 60 liter. Konsumsi BBM 10 km per liter.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan sisa BBM } S \\text{ setelah menempuh } d \\text{ km.}" },
      { label: "b.", math: "\\text{Berapa sisa BBM setelah 250 km?}" },
      { label: "c.", math: "\\text{Kapan tangki habis (S = 0)?}" },
    ],
  }),

  Q(10, "Grafik Populasi Linier", {
    type: "mixed",
    content: "Populasi desa pada tahun 2020 adalah 5.000 jiwa. Bertambah 200 jiwa per tahun.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan populasi } P \\text{ pada tahun ke-} t \\text{ sejak 2020.}" },
      { label: "b.", math: "\\text{Berapa populasi pada tahun 2030?}" },
      { label: "c.", math: "\\text{Kapan populasi mencapai 8.000 jiwa?}" },
    ],
  }),

  Q(11, "Titik Impas (Break Even)", {
    type: "mixed",
    content: "Biaya produksi: B(x) = 3.000x + 150.000. Pendapatan: R(x) = 5.000x.",
    parts: [
      { label: "a.", text: "Kapan pendapatan sama dengan biaya produksi (titik impas)?" },
      { label: "b.", math: "\\text{Berapa keuntungan saat } x = 100 \\text{ barang?}" },
      { label: "c.", text: "Gambarkan grafik biaya dan pendapatan dalam satu bidang koordinat." },
    ],
  }),

  Q(12, "Konversi Mata Uang", {
    type: "mixed",
    content: "Kurs: 1 USD = Rp15.000 (diasumsikan tetap).",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan } R \\text{ rupiah untuk } D \\text{ dollar.}" },
      { label: "b.", math: "\\text{Berapa rupiah untuk 25 dollar?}" },
      { label: "c.", math: "\\text{Berapa dollar untuk Rp450.000?}" },
      { label: "d.", text: "Apakah hubungan ini linier? Mengapa?" },
    ],
  }),

  Q(13, "Waktu dan Perjalanan Dua Arah", {
    type: "mixed",
    content: "Mobil A melaju dari kota P ke Q dengan kecepatan 80 km/jam. Mobil B melaju dari Q ke P dengan kecepatan 60 km/jam. Jarak P ke Q adalah 280 km.",
    parts: [
      { label: "a.", math: "\\text{Tulis posisi mobil A: } d_A = 80t." },
      { label: "b.", math: "\\text{Tulis posisi mobil B dari P: } d_B = 280 - 60t." },
      { label: "c.", text: "Kapan dan di mana kedua mobil berpapasan?" },
    ],
  }),

  Q(14, "ANBK — Grafik Kontekstual", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: 0, y1: 0, x2: 5, y2: 5, color: "#fb923c", label: "Upah" }],
      pts: [
        { x: 0, y: 0, label: "(0,0)", color: "#fb923c", labelPos: "br" },
        { x: 3, y: 3, label: "(3jam, 45rb)", color: "#fb923c", labelPos: "tl" },
      ],
      extraTexts: [
        { x: 1.5, y: 5, text: "sumbu-x: waktu (jam)", color: "rgba(255,255,255,0.4)", size: 8 },
      ],
    },
    parts: [
      { label: "a.", text: "Apa yang ditunjukkan grafik di atas?" },
      { label: "b.", math: "\\text{Tentukan upah per jam dari grafik.}" },
      { label: "c.", math: "\\text{Tuliskan persamaan upah } U = f(t)." },
      { label: "d.", math: "\\text{Berapa upah untuk 8 jam kerja?}" },
    ],
  }),

  Q(15, "Harga Tiket Masuk", {
    type: "mixed",
    content: "Harga tiket masuk taman: Rp5.000 per orang + biaya parkir Rp10.000.",
    parts: [
      { label: "a.", math: "\\text{Tulis total biaya } C \\text{ untuk } n \\text{ orang.}" },
      { label: "b.", math: "\\text{Berapa total biaya untuk keluarga 5 orang?}" },
      { label: "c.", text: "Jika anggaran keluarga Rp60.000, berapa banyak orang yang bisa masuk?" },
    ],
  }),

  Q(16, "UN 2021 — Kemiringan Jalan", {
    type: "mixed",
    content: "Sebuah jalan menanjak sejauh 200 m secara horizontal dengan kenaikan 15 m secara vertikal.",
    parts: [
      { label: "a.", math: "\\text{Hitung gradien (kemiringan) jalan tersebut.}" },
      { label: "b.", text: "Jika kemiringan dinyatakan sebagai persentase (gradien × 100%), berapa persen kemiringan jalan?" },
      { label: "c.", text: "Tuliskan persamaan garis jalan jika titik terbawah di koordinat (0, 0)." },
    ],
  }),

  Q(17, "Debit Air — Volume dan Waktu", {
    type: "mixed",
    content: "Bak air berisi 500 liter. Air keluar dengan kecepatan konstan 25 liter/menit.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan volume } V \\text{ setelah } t \\text{ menit.}" },
      { label: "b.", math: "\\text{Berapa volume setelah 10 menit?}" },
      { label: "c.", math: "\\text{Kapan bak kosong?}" },
      { label: "d.", text: "Gambarkan grafik volume vs waktu. Apa jenis gradiennya?" },
    ],
  }),

  Q(18, "Sewa Kendaraan", {
    type: "mixed",
    content: "Sewa motor: Rp50.000/hari + uang jaminan Rp200.000.",
    parts: [
      { label: "a.", math: "\\text{Tulis total biaya sewa } B \\text{ untuk } d \\text{ hari.}" },
      { label: "b.", math: "\\text{Berapa biaya untuk 7 hari?}" },
      { label: "c.", text: "Dua teman menyewa motor yang sama dengan tarif berbeda. Motor A: Rp60.000/hari + Rp150.000 jaminan. Motor B seperti di atas. Setelah berapa hari biaya total menjadi sama?" },
    ],
  }),

  Q(19, "Grafik Dua Tarif — Titik Kesamaan", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: 0, y1: 2, x2: 5, y2: 7, color: "#f472b6", label: "Tarif A" },
        { x1: 0, y1: 4, x2: 5, y2: 5.5, color: "#60a5fa", label: "Tarif B" },
      ],
      pts: [{ x: 4, y: 6, label: "Titik sama", color: "#facc15", labelPos: "tl" }],
    },
    content: "Tarif A: Rp20.000 awal + Rp10.000/km. Tarif B: Rp40.000 awal + Rp5.000/km.",
    parts: [
      { label: "a.", text: "Tulis persamaan tarif A dan tarif B." },
      { label: "b.", text: "Pada jarak berapa km kedua tarif sama?" },
      { label: "c.", text: "Untuk jarak lebih dari titik kesamaan, tarif mana yang lebih murah?" },
    ],
  }),

  Q(20, "TKA — Gaji dan Bonus", {
    type: "mixed",
    content: "Gaji seorang karyawan: Rp2.000.000 per bulan + bonus Rp50.000 per unit terjual.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan total penghasilan } G \\text{ untuk } u \\text{ unit.}" },
      { label: "b.", math: "\\text{Berapa penghasilan jika menjual 30 unit?}" },
      { label: "c.", math: "\\text{Berapa unit harus dijual agar penghasilan Rp4.500.000?}" },
    ],
  }),

  Q(21, "Membandingkan Dua Paket Listrik", {
    type: "mixed",
    content: "Paket A: tarif tetap Rp50.000 + Rp300/kWh. Paket B: tarif tetap Rp20.000 + Rp500/kWh.",
    parts: [
      { label: "a.", text: "Tulis persamaan tagihan untuk masing-masing paket." },
      { label: "b.", text: "Pada penggunaan berapa kWh tagihan keduanya sama?" },
      { label: "c.", text: "Jika penggunaan rata-rata 200 kWh/bulan, paket mana yang lebih hemat?" },
    ],
  }),

  Q(22, "UN 2022 — Soal Cerita Pertambahan Linier", {
    type: "mixed",
    content: "Sebuah kolam renang memiliki volume awal 2.000 liter. Dipompa air dengan debit 500 liter/jam.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan volume } V \\text{ setelah } t \\text{ jam.}" },
      { label: "b.", math: "\\text{Berapa volume setelah 4 jam?}" },
      { label: "c.", math: "\\text{Kapan volume mencapai 7.000 liter?}" },
    ],
  }),

  Q(23, "Ketinggian Benda Dijatuhkan (Penyederhanaan)", {
    type: "mixed",
    content: "Benda dijatuhkan dari ketinggian 100 m. Diasumsikan secara linier turun 10 m/detik.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan ketinggian } h \\text{ setelah } t \\text{ detik.}" },
      { label: "b.", math: "\\text{Berapa ketinggian setelah 7 detik?}" },
      { label: "c.", math: "\\text{Kapan benda menyentuh tanah (h = 0)?}" },
    ],
  }),

  Q(24, "Soal Cerita — Dua Orang Berjalan", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: 0, y1: 0, x2: 5, y2: 4, color: "#f472b6", label: "Andi" },
        { x1: 0, y1: 1, x2: 5, y2: 3, color: "#60a5fa", label: "Budi" },
      ],
      extraTexts: [{ x: 2, y: 5.5, text: "sumbu-x: waktu (jam)", color: "rgba(255,255,255,0.4)", size: 8 }],
    },
    content: "Andi berjalan 4 km/jam dari titik A. Budi berjalan 2 km/jam dari titik A dengan kepala awal 1 km.",
    parts: [
      { label: "a.", text: "Tulis persamaan jarak Andi dan Budi sebagai fungsi waktu." },
      { label: "b.", text: "Kapan Andi menyusul Budi?" },
      { label: "c.", text: "Berapa jarak dari titik A saat Andi menyusul Budi?" },
    ],
  }),

  Q(25, "Grafik Biaya — Interpretasi", {
    type: "mixed",
    content: "Grafik biaya vs jumlah barang menunjukkan persamaan y = 8.000x + 100.000.",
    parts: [
      { label: "a.", text: "Apa arti koefisien 8.000 dalam konteks ini?" },
      { label: "b.", text: "Apa arti 100.000 dalam konteks ini?" },
      { label: "c.", math: "\\text{Berapa biaya untuk 50 barang?}" },
      { label: "d.", math: "\\text{Jika anggaran Rp500.000, berapa barang yang bisa diproduksi?}" },
    ],
  }),

  Q(26, "ANBK — Soal Kontekstual Pilih Garis", {
    type: "mixed",
    content: "Dinas pertanian mencatat luas panen jagung (hektar) setiap tahun: 2019: 400, 2020: 450, 2021: 500, 2022: 550.",
    parts: [
      { label: "a.", text: "Apakah data ini membentuk pola linier? Jelaskan!" },
      { label: "b.", math: "\\text{Tuliskan persamaan garis (tahun sebagai } x, \\text{ luas sebagai } y\\text{).}" },
      { label: "c.", math: "\\text{Prediksi luas panen tahun 2025.}" },
    ],
  }),

  Q(27, "Perbandingan Bahan Campuran", {
    type: "mixed",
    content: "Campuran bensin dan oli: untuk setiap liter oli, dibutuhkan 25 liter bensin.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan jumlah bensin } B \\text{ untuk } o \\text{ liter oli.}" },
      { label: "b.", math: "\\text{Berapa bensin untuk 4 liter oli?}" },
      { label: "c.", text: "Jika total campuran 130 liter, berapa masing-masing bensin dan oli?" },
    ],
  }),

  Q(28, "UN 2023 — Kontekstual Dua Persamaan", {
    type: "mixed",
    content: "Harga 3 buku + 2 pensil = Rp30.000. Harga 1 buku + 4 pensil = Rp20.000.",
    parts: [
      { label: "a.", text: "Misalkan harga buku = b dan harga pensil = p. Tulis dua persamaan!" },
      { label: "b.", text: "Selesaikan sistem persamaan untuk menemukan harga buku dan pensil." },
      { label: "c.", math: "\\text{Berapa harga 5 buku dan 3 pensil?}" },
    ],
  }),

  Q(29, "Kontekstual — Nilai Ujian", {
    type: "mixed",
    content: "Nilai ujian Siti bergantung pada jumlah soal benar (b): N = 4b − 5.",
    parts: [
      { label: "a.", math: "\\text{Berapa nilai Siti jika benar 20 soal?}" },
      { label: "b.", math: "\\text{Berapa soal benar agar nilainya tepat 75?}" },
      { label: "c.", text: "Berapa soal minimum agar nilai Siti tidak di bawah 60?" },
    ],
  }),

  Q(30, "Grafik Kontekstual — Air Hujan", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: 0, y1: 0, x2: 5, y2: 5, color: "#60a5fa", label: "Curah Hujan" }],
      pts: [
        { x: 0, y: 0, label: "Jan", color: "#60a5fa", labelPos: "tr" },
        { x: 5, y: 5, label: "Jun", color: "#60a5fa", labelPos: "tr" },
      ],
    },
    content: "Curah hujan di suatu daerah naik secara linier dari Januari ke Juni.",
    parts: [
      { label: "a.", text: "Jika pada Januari curah hujan 50 mm dan Juni 300 mm, tentukan persamaan garisnya." },
      { label: "b.", math: "\\text{Prediksi curah hujan bulan April (bulan ke-4).}" },
      { label: "c.", text: "Kapan curah hujan mencapai 200 mm?" },
    ],
  }),

  Q(31, "Tarif Telepon", {
    type: "mixed",
    content: "Tarif telepon: Rp500/menit untuk 10 menit pertama, kemudian Rp300/menit.",
    parts: [
      { label: "a.", text: "Berapa biaya untuk percakapan 10 menit?" },
      { label: "b.", math: "\\text{Tulis persamaan biaya } B \\text{ untuk } t > 10 \\text{ menit.}" },
      { label: "c.", math: "\\text{Berapa biaya untuk percakapan 25 menit?}" },
    ],
  }),

  Q(32, "Soal Rute dan Perjalanan", {
    type: "mixed",
    content: "Kereta berangkat dari stasiun A pukul 08.00 dengan kecepatan 90 km/jam. Stasiun B berjarak 270 km dari A.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan jarak tempuh } d \\text{ setelah } t \\text{ jam.}" },
      { label: "b.", text: "Pukul berapa kereta sampai di B?" },
      { label: "c.", math: "\\text{Kereta lain berangkat dari B ke A pukul 09.00 dengan kecepatan 60 km/jam. Kapan kedua kereta berpapasan?}" },
    ],
  }),

  Q(33, "TKA — Membaca Grafik Kontekstual", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: 0, y1: 5, x2: 5, y2: 0, color: "#f472b6", label: "Stok" },
      ],
      pts: [
        { x: 0, y: 5, label: "(0, 500kg)", color: "#f472b6", labelPos: "tr" },
        { x: 5, y: 0, label: "(50hr, 0)", color: "#f472b6", labelPos: "top" },
      ],
    },
    content: "Grafik menunjukkan stok beras di gudang berkurang secara linier selama 50 hari.",
    parts: [
      { label: "a.", text: "Berapa stok awal beras?" },
      { label: "b.", text: "Berapa kg beras yang digunakan setiap hari?" },
      { label: "c.", math: "\\text{Tulis persamaan stok } S \\text{ setelah } d \\text{ hari.}" },
      { label: "d.", math: "\\text{Berapa stok setelah 35 hari?}" },
    ],
  }),

  Q(34, "Soal Olimpiade — Persimpangan Grafis", {
    type: "mixed",
    content: "Perusahaan A: Keuntungan K_A = 3.000.000t − 500.000. Perusahaan B: K_B = 2.000.000t + 1.500.000. (t = tahun ke-)",
    parts: [
      { label: "a.", text: "Pada tahun ke berapa keuntungan kedua perusahaan sama?" },
      { label: "b.", text: "Perusahaan mana yang lebih menguntungkan pada tahun ke-3?" },
      { label: "c.", text: "Gambarkan grafik kedua persamaan dalam satu bidang." },
    ],
  }),

  Q(35, "Kontekstual — Sewa Alat", {
    type: "mixed",
    content: "Sewa generator: Perusahaan X mengenakan Rp200.000/hari + deposit Rp500.000. Perusahaan Y mengenakan Rp250.000/hari + deposit Rp300.000.",
    parts: [
      { label: "a.", text: "Tulis total biaya sewa X dan Y sebagai fungsi jumlah hari." },
      { label: "b.", text: "Setelah berapa hari total biaya keduanya sama?" },
      { label: "c.", text: "Untuk sewa kurang dari titik kesamaan, perusahaan mana lebih murah?" },
    ],
  }),

  Q(36, "ANBK — Interpretasi Gradien Kontekstual", {
    type: "mixed",
    content: "Grafik menunjukkan tinggi air sungai (cm) vs waktu (jam). Persamaan: h = −5t + 80.",
    parts: [
      { label: "a.", text: "Apa arti gradien −5 dalam konteks ini?" },
      { label: "b.", text: "Apa arti intercept-y 80 dalam konteks ini?" },
      { label: "c.", math: "\\text{Kapan tinggi air menjadi 30 cm?}" },
      { label: "d.", math: "\\text{Kapan sungai mengering (h = 0)?}" },
    ],
  }),

  Q(37, "Tarif Listrik Pascabayar", {
    type: "mixed",
    content: "Tagihan listrik: Rp1.500/kWh + biaya admin Rp30.000.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan tagihan } T \\text{ untuk pemakaian } k \\text{ kWh.}" },
      { label: "b.", math: "\\text{Berapa tagihan untuk pemakaian 150 kWh?}" },
      { label: "c.", math: "\\text{Berapa kWh jika tagihan Rp225.000?}" },
    ],
  }),

  Q(38, "Soal Cerita — Dua Orang Bekerja", {
    type: "mixed",
    content: "Pak Andi mengerjakan 10 unit/jam. Pak Budi mengerjakan 15 unit/jam. Pak Budi mulai 2 jam kemudian.",
    parts: [
      { label: "a.", math: "\\text{Tulis total unit oleh Pak Andi setelah } t \\text{ jam.}" },
      { label: "b.", math: "\\text{Tulis total unit oleh Pak Budi setelah } t \\text{ jam (t > 2).}" },
      { label: "c.", text: "Kapan Pak Budi menyusul total produksi Pak Andi?" },
    ],
  }),

  Q(39, "Perbandingan Dua Penawaran Kredit", {
    type: "mixed",
    content: "Bank A: cicilan Rp500.000/bulan, biaya awal Rp2.000.000. Bank B: cicilan Rp600.000/bulan, biaya awal Rp1.200.000.",
    parts: [
      { label: "a.", text: "Tulis total biaya kredit di Bank A dan Bank B sebagai fungsi bulan." },
      { label: "b.", text: "Pada bulan ke berapa total biaya keduanya sama?" },
      { label: "c.", text: "Untuk kredit lebih dari titik kesamaan, bank mana yang lebih menguntungkan?" },
    ],
  }),

  Q(40, "Tantangan — Model Matematika Dunia Nyata", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [
        { x1: 0, y1: 2, x2: 4, y2: 6, color: "#34d399", label: "Toko A" },
        { x1: 0, y1: 5, x2: 4, y2: 5, color: "#f472b6", label: "Toko B" },
      ],
      pts: [
        { x: 3, y: 5, label: "Sama", color: "#facc15", labelPos: "tl" },
      ],
    },
    content: "Toko A menjual buah: Rp20.000/kg + Rp20.000 ongkos kirim. Toko B: Rp50.000 flat untuk berapapun kg.",
    parts: [
      { label: "a.", text: "Tulis persamaan biaya Toko A dan Toko B." },
      { label: "b.", text: "Pada berapa kg pembelian biaya kedua toko sama?" },
      { label: "c.", text: "Jika membeli 2 kg, mana yang lebih murah? Dan jika 4 kg?" },
      { label: "d.", text: "Gambarkan grafik kedua toko dan beri kesimpulan strategi pembelian." },
    ],
  }),
];

const AplikasiKontekstualPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-purple-400 text-xs font-body">40 Soal Latihan</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            APLIKASI PERSAMAAN GARIS PADA SOAL KONTEKSTUAL
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Persamaan Garis Lurus · UN / TKA / ANBK</p>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-slate-900/40 to-violet-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className="text-purple-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
                  {q.content && (
                    <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                  )}
                  {q.math && (
                    <div className="text-white/90 text-sm mt-1"><InlineMath math={q.math} /></div>
                  )}
                </div>
              </div>

              {q.diagram && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-lg">
                    <CoordPlane {...q.diagram} />
                  </div>
                </div>
              )}

              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((p, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className="text-purple-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{p.label}</span>
                      <div className="text-white/75 text-sm font-body leading-relaxed">
                        {p.math ? <InlineMath math={p.math} /> : <span>{p.text}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Persamaan Garis Lurus
          </button>
        </div>
      </div>
    </div>
  );
};

export default AplikasiKontekstualPage;
