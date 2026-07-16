import { Circle, ArrowRight, ArrowLeftRight } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menerapkan konsep garis singgung lingkaran untuk menyelesaikan masalah geometri yang berkaitan dengan dua lingkaran.";

export const garisSinggungLingkaran: MateriCatalogEntry = {
  slug: "garis-singgung-lingkaran",
  title: "Garis Singgung Lingkaran",
  shortTitle: "GSL",
  icon: Circle,
  intro: "Pilih sub-topik garis singgung lingkaran untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.teal,
  subMateri: [
    {
      slug: "konsep-garis-singgung",
      title: "Konsep Garis Singgung Lingkaran",
      desc: "RPP pengenalan konsep dan sifat garis singgung lingkaran serta menentukan panjangnya.",
      icon: Circle,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("garis singgung lingkaran"), DIMENSI.mandiri, DIMENSI.kreatif("strategi geometri")],
      relevansi:
        "Garis singgung lingkaran tampak pada rel kereta yang melengkung, bantalan rem cakram, dan rancangan jalan tikungan.",
      strukturMateri:
        "Bertahap dari konsep garis singgung, sifat garis singgung tegak lurus jari-jari, hingga menentukan panjang garis singgung dari titik di luar lingkaran.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menjelaskan konsep dan sifat garis singgung lingkaran serta menentukan panjangnya.",
      topikPembelajaran: "Konsep Garis Singgung, Sifat Tegak Lurus terhadap Jari-jari, dan Panjang Garis Singgung.",
      kemitraan: [
        { title: "IPA", desc: "Konsep garis singgung pada gerak melingkar dan kontak permukaan." },
        { title: "PKWU", desc: "Aplikasi garis singgung pada kerajinan dengan unsur lingkaran." },
      ],
      apersepsi:
        "Guru menampilkan rel kereta api dengan dua lingkaran roda yang menyentuh rel, lalu menanyakan posisi pertemuan rel dan roda.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa contoh garis singgung pada lingkaran.",
          "Murid mencatat pertanyaan tentang sifatnya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana posisi garis singgung terhadap jari-jari?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mengukur sudut antara garis singgung dan jari-jari pada beberapa lingkaran.",
          "Murid mencatat hasil dan pola.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan sifat garis singgung tegak lurus jari-jari di titik singgung.",
        ] },
        { items: [
          "Murid memverifikasi sifat pada lingkaran baru dan menentukan panjang garis singgung.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan konsep dan sifat garis singgung lingkaran.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "garis-singgung-persekutuan-dalam",
      title: "Garis Singgung Persekutuan Dalam",
      desc: "RPP menentukan panjang garis singgung persekutuan dalam dua lingkaran.",
      icon: ArrowRight,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("GSPD"), DIMENSI.bernalarKritis("GSPD"), DIMENSI.komunikatif],
      relevansi:
        "Garis singgung persekutuan dalam dipakai dalam mendesain sabuk silang antara dua katrol yang berputar berlawanan arah.",
      strukturMateri:
        "Bertahap dari konsep GSPD, ke rumus panjang GSPD = √(d² - (R+r)²), hingga aplikasinya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan panjang garis singgung persekutuan dalam dua lingkaran.",
      topikPembelajaran: "Konsep GSPD dan Rumus Panjang GSPD.",
      kemitraan: [
        { title: "IPA", desc: "Aplikasi GSPD pada sistem katrol dan transmisi mekanik." },
        { title: "PKWU", desc: "Aplikasi GSPD pada perancangan rangka berbentuk silang." },
      ],
      apersepsi:
        "Guru menampilkan dua katrol dengan sabuk silang dan menanyakan: \"Bagaimana menentukan panjang sabuk yang dibutuhkan?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang dua katrol dengan sabuk silang.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi penemuan rumus dengan teorema Pythagoras.",
          "Guru memberi pertanyaan pemandu menuju rumus GSPD.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi penemuan dan rumusnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus panjang GSPD.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "garis-singgung-persekutuan-luar",
      title: "Garis Singgung Persekutuan Luar",
      desc: "RPP menentukan panjang garis singgung persekutuan luar dua lingkaran.",
      icon: ArrowLeftRight,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("GSPL"), DIMENSI.mandiri, DIMENSI.kreatif("strategi rumus")],
      relevansi:
        "Garis singgung persekutuan luar dipakai pada sabuk dua katrol yang berputar searah, kabel pada dua tiang berbeda tinggi, dan rancangan rangka.",
      strukturMateri:
        "Bertahap dari konsep GSPL, ke rumus panjang GSPL = √(d² - (R-r)²), hingga aplikasinya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan panjang garis singgung persekutuan luar dua lingkaran.",
      topikPembelajaran: "Konsep GSPL dan Rumus Panjang GSPL.",
      kemitraan: [
        { title: "IPA", desc: "Aplikasi GSPL pada sistem katrol searah." },
        { title: "PKWU", desc: "Aplikasi GSPL pada rancangan rangka kerajinan." },
      ],
      apersepsi:
        "Guru menampilkan dua katrol berbeda ukuran dengan sabuk searah dan menanyakan strategi menentukan panjang sabuknya.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa konfigurasi dua lingkaran dengan garis singgung luar.",
          "Murid mencatat pertanyaan tentang panjangnya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana rumus panjang GSPL dengan teorema Pythagoras?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba menggambar segitiga siku-siku dari konfigurasi dua lingkaran.",
          "Murid mencatat strategi.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan rumus GSPL = √(d² - (R-r)²).",
        ] },
        { items: [
          "Murid memverifikasi rumus pada konfigurasi baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan rumus panjang GSPL.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
  ],
};
