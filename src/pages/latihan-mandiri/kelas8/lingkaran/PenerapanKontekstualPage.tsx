import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Circle } from "lucide-react";
import CircleDiagram, { CircleDiagramProps } from "./CircleDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[]; diagram?: CircleDiagramProps;
  type: "essay" | "mixed";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Roda Sepeda", {
    type: "mixed",
    diagram: {
      size: 220, r: 0.62,
      pts: [
        { angle: 90, label: "", color: "#94a3b8" },
        { angle: 210, label: "", color: "#94a3b8" },
        { angle: 330, label: "", color: "#94a3b8" },
        { angle: 30, label: "", color: "#94a3b8" },
        { angle: 150, label: "", color: "#94a3b8" },
        { angle: 270, label: "", color: "#94a3b8" },
      ],
      radii: [
        { angle: 90, color: "rgba(148,163,184,0.4)" },
        { angle: 210, color: "rgba(148,163,184,0.4)" },
        { angle: 330, color: "rgba(148,163,184,0.4)" },
        { angle: 30, color: "rgba(148,163,184,0.4)" },
        { angle: 150, color: "rgba(148,163,184,0.4)" },
        { angle: 270, color: "rgba(148,163,184,0.4)" },
      ],
      extraTexts: [{ x: 110, y: 200, text: "r = 35 cm", color: "#60a5fa", size: 10, bold: true }],
    },
    content: "Roda sepeda berjari-jari 35 cm berputar di jalan.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling roda. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Jika roda berputar 100 kali, berapa meter jarak yang ditempuh?" },
      { label: "c.", text: "Berapa banyak putaran roda untuk menempuh jarak 1,1 km?" },
    ],
  }),

  Q(2, "Kolam Renang Melingkar", {
    type: "essay",
    content: "Sebuah kolam renang berbentuk lingkaran berdiameter 28 m. Di sekeliling kolam dibuat jalan setapak lebar 3,5 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas kolam renang. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Hitung luas jalan setapak (cincin di luar kolam)." },
      { label: "c.", text: "Jika paving jalan seharga Rp 80.000/m², berapa total biaya pembuatan jalan?" },
    ],
  }),

  Q(3, "Jam Dinding", {
    type: "mixed",
    diagram: {
      size: 220, r: 0.62,
      pts: [
        { angle: 90, label: "12", color: "#facc15", labelOffset: 20 },
        { angle: 0, label: "3", color: "#facc15", labelOffset: 20 },
        { angle: 270, label: "6", color: "#facc15", labelOffset: 20 },
        { angle: 180, label: "9", color: "#facc15", labelOffset: 20 },
      ],
      radii: [
        { angle: 90, color: "#60a5fa", label: "jarum menit" },
        { angle: 30, color: "#f472b6", label: "jarum jam" },
      ],
    },
    content: "Jam dinding berbentuk lingkaran. Jarum menit panjang 21 cm, jarum jam panjang 14 cm.",
    parts: [
      { label: "a.", text: "Berapa jarak yang ditempuh ujung jarum menit dalam 1 jam?" },
      { label: "b.", text: "Berapa jarak yang ditempuh ujung jarum jam dalam 12 jam?" },
      { label: "c.", text: "Perbandingan kecepatan ujung jarum menit : ujung jarum jam = ?" },
    ],
  }),

  Q(4, "Pizza Melingkar", {
    type: "mixed",
    diagram: {
      size: 220, r: 0.62,
      sectors: [
        { startAngle: 0, endAngle: 60, fillColor: "rgba(248,113,163,0.3)", strokeColor: "#f472b6" },
        { startAngle: 60, endAngle: 120, fillColor: "rgba(250,204,21,0.2)", strokeColor: "#facc15" },
        { startAngle: 120, endAngle: 180, fillColor: "rgba(52,211,153,0.2)", strokeColor: "#34d399" },
        { startAngle: 180, endAngle: 240, fillColor: "rgba(96,165,250,0.2)", strokeColor: "#60a5fa" },
        { startAngle: 240, endAngle: 300, fillColor: "rgba(167,139,250,0.2)", strokeColor: "#a78bfa" },
        { startAngle: 300, endAngle: 360, fillColor: "rgba(251,146,60,0.2)", strokeColor: "#fb923c" },
      ],
    },
    content: "Pizza berbentuk lingkaran berjari-jari 21 cm dibagi menjadi 6 bagian sama besar untuk 6 orang.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas seluruh pizza. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Hitung luas setiap potongan pizza." },
      { label: "c.", text: "Jika harga pizza Rp 126.000, berapa harga per potongan?" },
    ],
  }),

  Q(5, "Taman Kota Melingkar", {
    type: "essay",
    content: "Taman kota berbentuk lingkaran berjari-jari 70 m. Sekeliling taman akan dipasangi pagar dengan harga Rp 250.000 per meter.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling taman. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Hitung biaya total pemasangan pagar." },
      { label: "c.", text: "Jika taman akan ditanami rumput seharga Rp 50.000/m², berapa total biayanya?" },
    ],
  }),

  Q(6, "Lapangan Lari Melingkar", {
    type: "essay",
    content: "Lintasan lari berbentuk lingkaran berjari-jari 63 m. Seorang atlet berlari 5 kali putaran setiap hari selama 7 hari.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling lintasan. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Berapa meter total lintasan yang ditempuh atlet dalam sehari?" },
      { label: "c.", text: "Berapa km total lintasan selama 7 hari?" },
    ],
  }),

  Q(7, "Kue Ulang Tahun Melingkar", {
    type: "essay",
    content: "Kue ulang tahun berbentuk silinder (tabung) dengan diameter 28 cm dan tinggi 8 cm. Permukaannya akan dihias krim.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas kue (lingkaran). (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", math: "\\text{Hitung luas samping kue (keliling × tinggi).}" },
      { label: "c.", text: "Hitung luas total permukaan kue yang perlu dihias krim (atas + samping)." },
    ],
  }),

  Q(12, "Cat Dinding Melingkar", {
    type: "essay",
    content: "Dinding lingkaran gedung berjari-jari 7 m akan dicat. Satu kaleng cat cukup untuk 10 m². Harga 1 kaleng cat Rp 85.000.",
    parts: [
      { label: "a.", text: "Hitung luas lantai lingkaran." },
      { label: "b.", text: "Berapa kaleng cat yang diperlukan?" },
      { label: "c.", text: "Berapa total biaya pengecatan?" },
    ],
  }),

  Q(12, "Cat Dinding Melingkar", {
    type: "essay",
    content: "Proyek pembangunan taman:\n• Taman berbentuk lingkaran r = 21 m\n• Jalan setapak lebar 3,5 m di sekeliling taman\n• Biaya jalan: Rp 150.000/m²\n• Biaya tanaman taman: Rp 30.000/m²",
    parts: [
      { label: "a.", text: "Hitung luas taman (tanpa jalan)." },
      { label: "b.", text: "Hitung luas jalan setapak." },
      { label: "c.", text: "Hitung total anggaran proyek (taman + jalan)." },
    ],
  }),

  Q(13, "Soal ANBK — Proyek Taman", {
    type: "essay",
    content: "Baling-baling kincir angin membentuk 3 juring sama besar dengan panjang baling-baling 7 m.",
    parts: [
      { label: "a.", text: "Berapakah sudut setiap juring baling-baling?" },
      { label: "b.", math: "\\text{Hitung luas satu baling-baling. (} \\pi = \\tfrac{22}{7})" },
      { label: "c.", text: "Jika kincir berputar 20 kali/menit, berapa meter ujung baling-baling bergerak per menit?" },
    ],
  }),

  Q(14, "Kincir Angin (Windmill)", {
    type: "essay",
    content: "Sistem irigasi menggunakan pompa yang berputar melingkar dengan jangkauan 56 m. Pompa berputar 4 jam untuk mengairi seluruh area.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas area yang diairi. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Jika pompa berputar pada kecepatan sudut 90°/jam, berapa jam untuk satu putaran penuh?" },
      { label: "c.", text: "Berapa luas yang diairi dalam 1 jam pertama?" },
    ],
  }),

  Q(15, "Soal TKA — Pompa Air Melingkar", {
    type: "essay",
    content: "Sebuah ruangan berbentuk persegi panjang 7 m × 5 m. Di tengahnya diletakkan karpet melingkar berjari-jari 2 m.",
    parts: [
      { label: "a.", text: "Hitung luas ruangan." },
      { label: "b.", text: "Hitung luas karpet." },
      { label: "c.", text: "Berapa persen luas ruangan yang tertutup karpet?" },
    ],
  }),

  Q(16, "Karpet Melingkar", {
    type: "essay",
    content: "Sebuah drum minyak berbentuk silinder memiliki diameter 56 cm. Dinding samping drum akan diberi stiker melingkar setinggi 30 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling alas drum. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Hitung luas stiker (keliling × tinggi stiker)." },
      { label: "c.", text: "Jika harga stiker Rp 500/cm², berapa biaya stiker satu drum?" },
    ],
  }),

  Q(17, "Soal UN — Drum Silinder", {
    type: "essay",
    content: "Jaring ikan berbentuk lingkaran. Jika diameter jaring 14 m, dan nelayan melempar jaring setiap 10 menit.",
    parts: [
      { label: "a.", text: "Berapa luas area yang tertutup jaring setiap kali dilempar?" },
      { label: "b.", text: "Dalam 1 jam, berapa kali jaring dilempar?" },
      { label: "c.", text: "Jika setiap 10 m² menghasilkan 2 kg ikan rata-rata, berapa kg ikan dalam 1 jam?" },
    ],
  }),

  Q(18, "Soal ANBK — Penangkap Ikan Jaring Melingkar", {
    type: "essay",
    content: "Meja makan berbentuk lingkaran dengan diameter 1,4 m akan dilapisi taplak meja. Taplak menjuntai 20 cm di setiap sisi.",
    parts: [
      { label: "a.", text: "Tentukan diameter taplak meja." },
      { label: "b.", text: "Hitung luas taplak meja." },
      { label: "c.", text: "Hitung luas meja asli. Berapa persen taplak lebih luas dari meja?" },
    ],
  }),

  Q(19, "Meja Makan Melingkar", {
    type: "essay",
    content: "Satelit mengorbit bumi pada ketinggian 7.000 km. Jari-jari bumi ≈ 6.400 km. Orbit dianggap melingkar.",
    parts: [
      { label: "a.", text: "Tentukan jari-jari orbit satelit dari pusat bumi." },
      { label: "b.", math: "\\text{Hitung keliling orbit satelit. (} \\pi = 3{,}14)" },
      { label: "c.", text: "Jika satelit mengorbit dengan kecepatan 7 km/s, berapa detik untuk satu putaran penuh?" },
    ],
  }),

  Q(20, "Soal TKA — Satelit Mengorbit Bumi", {
    type: "essay",
    content: "Sebuah ember berbentuk silinder (bagian atas saja) dengan diameter 28 cm. Akan dipasang cincin kawat di bibir ember.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling bibir ember. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Berapa meter kawat yang dibutuhkan?" },
      { label: "c.", text: "Jika harga kawat Rp 3.000/meter, berapa biaya kawat untuk 10 ember?" },
    ],
  }),

  Q(22, "Ban Mobil", {
    type: "essay",
    content: "Ban mobil memiliki jari-jari luar 35 cm. Mobil bergerak sejauh 440 m.",
    parts: [
      { label: "a.", text: "Hitung keliling ban." },
      { label: "b.", text: "Berapa kali ban berputar selama 440 m?" },
      { label: "c.", text: "Jika ban berputar 400 rpm (rotasi per menit), berapa kecepatan mobil dalam km/jam?" },
    ],
  }),

  Q(21, "Soal UN — Ember Bundar", {
    type: "essay",
    content: "Lapangan basket memiliki lingkaran tengah berjari-jari 1,8 m dan dua lingkaran luar berjari-jari 6,5 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas lingkaran tengah. (} \\pi = 3{,}14)" },
      { label: "b.", text: "Hitung luas satu lingkaran luar." },
      { label: "c.", text: "Hitung total luas ketiga lingkaran di lapangan basket." },
    ],
  }),

  Q(22, "Ban Mobil", {
    type: "essay",
    content: "Sebuah kaleng berbentuk tabung dengan diameter 14 cm. Label kertas akan ditempel mengelilingi kaleng setinggi 10 cm.",
    parts: [
      { label: "a.", text: "Hitung keliling alas kaleng." },
      { label: "b.", text: "Hitung luas label kertas yang diperlukan." },
      { label: "c.", text: "Jika kertas dijual per lembar 30 cm × 50 cm, berapa lembar yang diperlukan untuk 20 kaleng?" },
    ],
  }),

  Q(23, "Soal ANBK — Lapangan Basket", {
    type: "essay",
    content: "Generator listrik memiliki roda dengan jari-jari 0,5 m yang berputar 60 kali per menit.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling roda. (} \\pi = 3{,}14)" },
      { label: "b.", text: "Berapa meter jarak yang ditempuh tepi roda per menit?" },
      { label: "c.", text: "Berapa km jarak yang ditempuh tepi roda dalam 1 jam?" },
    ],
  }),

  Q(24, "Tabung Kaleng", {
    type: "essay",
    content: "Sebuah ruangan berbentuk lingkaran berjari-jari 7 m. Lantainya akan dicat dengan harga Rp 45.000/m².",
    parts: [
      { label: "a.", text: "Hitung luas lantai." },
      { label: "b.", text: "Hitung biaya pengecatan lantai." },
      { label: "c.", text: "Jika ada 5% bahan yang terbuang, berapa total cat yang dibeli (dalam m²)?" },
    ],
  }),

  Q(27, "Soal UN — Kolam Ikan", {
    type: "essay",
    content: "Kolam ikan berbentuk lingkaran dengan diameter 14 m. Pemilik ingin memberi pakan ikan yang disebar merata.",
    parts: [
      { label: "a.", text: "Hitung luas permukaan kolam." },
      { label: "b.", text: "Jika 1 kg pakan untuk 10 m², berapa kg pakan yang diperlukan?" },
      { label: "c.", text: "Jika harga pakan Rp 25.000/kg, berapa biaya pakan sekali memberi makan?" },
    ],
  }),

  Q(25, "Soal TKA — Menghitung Laju Putaran", {
    type: "essay",
    content: "Menara air berbentuk tabung dengan diameter 7 m dan tinggi 10 m. Dinding luar akan dicat.",
    parts: [
      { label: "a.", text: "Hitung luas dinding samping (keliling × tinggi)." },
      { label: "b.", text: "Hitung luas satu tutup atas (lingkaran)." },
      { label: "c.", text: "Hitung total luas yang dicat (dinding + tutup atas)." },
    ],
  }),

  Q(26, "Harga Cat Ruangan Melingkar", {
    type: "essay",
    content: "Pipa air berbentuk silinder memiliki diameter dalam 14 cm. Air mengalir memenuhi seluruh luas penampang pipa.",
    parts: [
      { label: "a.", text: "Hitung luas penampang pipa." },
      { label: "b.", text: "Jika kecepatan aliran air 2 m/s, berapa liter air mengalir per detik? (1 m³ = 1000 liter)" },
      { label: "c.", text: "Berapa liter air yang mengalir dalam 1 jam?" },
    ],
  }),

  Q(27, "Soal UN — Kolam Ikan", {
    type: "essay",
    content: "Bulan mengelilingi bumi dengan orbit hampir melingkar berjari-jari ≈ 384.000 km. Satu putaran = 27 hari.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling orbit bulan. (} \\pi \\approx 3{,}14)" },
      { label: "b.", text: "Hitung kecepatan bulan dalam km/hari." },
      { label: "c.", text: "Hitung kecepatan bulan dalam km/jam." },
    ],
  }),

  Q(28, "Menara Air (Water Tower)", {
    type: "essay",
    content: "Sebuah stadion membutuhkan lapangan sepak bola yang dikelilingi lintasan lari melingkar. Diameter total (lapangan + lintasan) = 224 m. Lintasan lebar 14 m.",
    parts: [
      { label: "a.", text: "Tentukan diameter lapangan sepak bola berbentuk lingkaran." },
      { label: "b.", text: "Hitung luas lapangan sepak bola." },
      { label: "c.", text: "Hitung luas lintasan lari." },
    ],
  }),

  Q(29, "Soal ANBK — Drainase Pipa", {
    type: "essay",
    content: "Kompas menunjukkan arah dalam lingkaran penuh (360°). Kapal bergerak dari Utara (90°) searah jarum jam ke arah Timur Laut (45°).",
    parts: [
      { label: "a.", text: "Berapa derajat kapal berputar?" },
      { label: "b.", text: "Jika jangkauan radar kapal 14 km, berapa km² area yang dimonitor dalam sektor 45° tersebut?" },
      { label: "c.", text: "Berapa persen dari seluruh area lingkaran radar?" },
    ],
  }),

  Q(30, "Soal TKA — Bumi dan Bulan", {
    type: "essay",
    content: "Atlet lempar cakram melempar dari lingkaran berdiameter 2,5 m. Cakram mendarat 45 m dari pusat lingkaran.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling lingkaran lempar cakram. (} \\pi = 3{,}14)" },
      { label: "b.", text: "Luas daerah yang mungkin ditempuh cakram (dari pusat dengan jari-jari 45 m) adalah berapa m²?" },
      { label: "c.", text: "Jika daerah aman = luas seluruh sektor 60° dengan r = 45 m, berapa luasnya?" },
    ],
  }),

  Q(31, "Soal UN — Persyaratan Lahan", {
    type: "essay",
    content: "Kincir ria memiliki diameter 42 m. Pusat kincir berada 21 m di atas tanah. Kincir berputar 1 kali setiap 3 menit.",
    parts: [
      { label: "a.", text: "Hitung keliling kincir ria." },
      { label: "b.", text: "Berapa kecepatan tepi kincir (m/menit)?" },
      { label: "c.", text: "Pada posisi tertinggi, berapa meter posisi penumpang dari tanah?" },
    ],
  }),

  Q(32, "Kompas dan Arah", {
    type: "essay",
    content: "Drone terbang melingkar dengan jari-jari 100 m dari menara pusat. Kamera mengambil gambar area di bawahnya.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas area yang bisa dipotret (lingkaran). (} \\pi = 3{,}14)" },
      { label: "b.", text: "Jika drone hanya terbang setengah lingkaran, berapa luas area foto?" },
      { label: "c.", text: "Berapa km² total area jika jari-jari ditingkatkan menjadi 200 m?" },
    ],
  }),

  Q(33, "Soal ANBK — Lempar Cakram", {
    type: "essay",
    content: "Di toko terdapat dua jenis kue melingkar:\nKue A: diameter 28 cm, harga Rp 84.000\nKue B: diameter 14 cm, harga Rp 24.000",
    parts: [
      { label: "a.", text: "Hitung luas kue A dan kue B." },
      { label: "b.", text: "Hitung harga per cm² kue A dan kue B." },
      { label: "c.", text: "Kue mana yang lebih hemat? Jelaskan!" },
    ],
  }),

  Q(34, "Kincir Ria (Ferris Wheel)", {
    type: "essay",
    content: "Sebuah kebun berbentuk lingkaran berjari-jari 28 m akan diwariskan kepada 4 orang anak secara sama rata.",
    parts: [
      { label: "a.", text: "Hitung luas kebun seluruhnya." },
      { label: "b.", text: "Hitung luas bagian yang diterima setiap anak." },
      { label: "c.", text: "Jika harga tanah Rp 500.000/m², berapa nilai kebun setiap anak?" },
    ],
  }),

  Q(35, "Soal TKA — Pengambilan Gambar Drone", {
    type: "essay",
    content: "Pipa berbentuk cincin dengan diameter luar 42 cm dan diameter dalam 28 cm akan digunakan sebagai saluran air.",
    parts: [
      { label: "a.", text: "Hitung luas penampang pipa (cincin/annulus)." },
      { label: "b.", text: "Jika air mengalir dengan kecepatan 5 m/s, berapa liter per detik debit airnya?" },
      { label: "c.", text: "Berapa liter yang mengalir dalam 10 menit?" },
    ],
  }),

  Q(36, "Soal UN — Memilih Produk", {
    type: "essay",
    content: "Dua reaktor kimia berbentuk lingkaran: Reaktor P (r = 14 m) dan Reaktor Q (r = 7 m).",
    parts: [
      { label: "a.", text: "Berapa perbandingan luas Reaktor P : Reaktor Q?" },
      { label: "b.", text: "Jika biaya operasi sebanding luas, dan biaya reaktor Q = Rp 100 juta, berapa biaya reaktor P?" },
      { label: "c.", text: "Apakah lebih efisien menggunakan 1 reaktor P atau 4 reaktor Q? (Bandingkan luas total!)" },
    ],
  }),

  Q(37, "Soal ANBK — Pembagian Warisan", {
    type: "essay",
    content: "Sebuah lahan berbentuk lingkaran dengan jari-jari 21 m akan dibagi menjadi 3 bagian sama besar.",
    parts: [
      { label: "a.", text: "Hitung luas total lahan. (π = 22/7)" },
      { label: "b.", text: "Berapa luas masing-masing bagian?" },
      { label: "c.", text: "Jika harga tanah Rp 500.000/m², berapa nilai setiap bagian?" },
    ],
  }),

  Q(38, "Soal TKA — Jalur Pipa Melingkar", {
    type: "essay",
    content: "Sebuah jalur pipa melingkar memiliki diameter luar 56 cm dan diameter dalam 42 cm.",
    parts: [
      { label: "a.", text: "Hitung luas penampang pipa. (π = 22/7)" },
      { label: "b.", text: "Jika pipa sepanjang 10 m, berapa volume bahan pipa tersebut?" },
      { label: "c.", text: "Jika berat jenis bahan = 2 kg/cm³, berapa berat total pipa?" },
    ],
  }),

  Q(39, "Soal UN — Perbandingan Efisiensi", {
    type: "essay",
    content: "Dua kipas angin berbentuk lingkaran: Kipas A berjari-jari 28 cm dan Kipas B berjari-jari 14 cm.",
    parts: [
      { label: "a.", text: "Berapa perbandingan luas Kipas A : Kipas B?" },
      { label: "b.", text: "Jika 4 kipas B digunakan, apakah luasnya sama dengan 1 kipas A?" },
      { label: "c.", text: "Manakah yang lebih efisien dari segi biaya jika harga sebanding luas?" },
    ],
  }),

  Q(40, "Soal ANBK Gabungan — Desain Taman Terpadu", {
    type: "mixed",
    diagram: {
      size: 220,
      extraCircles: [
        { cx: 110, cy: 110, r: 90, color: "#34d399", fill: "rgba(52,211,153,0.07)" },
        { cx: 110, cy: 110, r: 55, color: "#60a5fa", fill: "rgba(56,189,248,0.1)" },
        { cx: 110, cy: 110, r: 25, color: "#f472b6", fill: "rgba(248,113,163,0.2)" },
      ],
      extraTexts: [
        { x: 110, y: 113, text: "Kolam", color: "#f472b6", size: 8, bold: true },
        { x: 155, y: 95, text: "Taman", color: "#60a5fa", size: 8 },
        { x: 182, y: 75, text: "Jogging", color: "#34d399", size: 8 },
      ],
      showCenter: false,
    },
    content: "Taman terpadu 3 zona:\n• Kolam: r = 3,5 m\n• Taman Bunga: r = 7,7 m (annulus)\n• Lintasan Jogging: r = 12,6 m (annulus)\n(π = 22/7)",
    parts: [
      { label: "a.", text: "Hitung luas Kolam." },
      { label: "b.", text: "Hitung luas Taman Bunga (antara kolam dan r = 7,7 m)." },
      { label: "c.", text: "Hitung luas Lintasan Jogging (antara r = 7,7 m dan r = 12,6 m)." },
      { label: "d.", text: "Jika biaya per m²: kolam Rp 500rb, taman Rp 200rb, jogging Rp 150rb — berapa total anggaran?" },
    ],
  }),
];

const PenerapanKontekstualPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            PENERAPAN KONSEP LINGKARAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">🌍 Rumus untuk Penerapan Kontekstual</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { n: "Keliling", d: "K = 2πr = πd", c: "text-cyan-400" },
              { n: "Luas", d: "L = πr²", c: "text-emerald-400" },
              { n: "Panjang Busur", d: "(α/360°) × 2πr", c: "text-yellow-400" },
              { n: "Luas Juring", d: "(α/360°) × πr²", c: "text-violet-400" },
              { n: "Luas Annulus", d: "π(R² − r²)", c: "text-orange-400" },
              { n: "π ≈ 22/7", d: "jika r atau d kelipatan 7", c: "text-pink-400" },
            ].map(r => (
              <div key={r.n} className="bg-white/5 rounded-lg px-3 py-2">
                <span className={`font-bold ${r.c}`}>{r.n}: </span>
                <span className="text-white/60">{r.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CircleDiagram {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenerapanKontekstualPage;
