import { Triangle, Square, Diamond, Hexagon } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menggunakan sifat-sifat bangun datar (segitiga dan segiempat) serta menghitung keliling dan luasnya untuk menyelesaikan masalah kontekstual.";

export const segitigaSegiempat: MateriCatalogEntry = {
  slug: "segitiga-segiempat",
  title: "Segitiga dan Segiempat",
  shortTitle: "Segitiga & Segiempat",
  icon: Triangle,
  intro: "Pilih sub-topik segitiga dan segiempat untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.emerald,
  subMateri: [
    {
      slug: "sifat-segitiga",
      title: "Sifat dan Jenis Segitiga",
      desc: "RPP klasifikasi segitiga berdasarkan sisi dan sudut serta jumlah sudut dalamnya.",
      icon: Triangle,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("sifat segitiga"), DIMENSI.bernalarKritis("sifat segitiga"), DIMENSI.komunikatif],
      relevansi:
        "Sifat segitiga digunakan dalam rangka jembatan, atap rumah, dan rancangan rangka kuda-kuda.",
      strukturMateri:
        "Bertahap dari klasifikasi segitiga berdasarkan sisi (sama sisi, sama kaki, sembarang), berdasarkan sudut (lancip, siku-siku, tumpul), hingga jumlah sudut dalam segitiga.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengelompokkan segitiga berdasarkan sisi dan sudut serta menggunakan sifat jumlah sudut dalam segitiga.",
      topikPembelajaran: "Klasifikasi Segitiga, Sifat-sifat Segitiga, Jumlah Sudut dalam Segitiga.",
      kemitraan: [
        { title: "PKWU", desc: "Penggunaan segitiga pada rancangan rangka kerajinan." },
        { title: "Seni Budaya", desc: "Segitiga pada motif tradisional nusantara." },
      ],
      apersepsi:
        "Guru menampilkan foto rangka jembatan dan rangka atap rumah, lalu bertanya tentang jenis segitiga yang digunakan.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang rangka jembatan dan atap rumah.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengelompokkan berbagai segitiga berdasarkan sisi dan sudut.",
          "Guru memberi pertanyaan pemandu menuju jumlah sudut dalam segitiga.",
        ] },
        { items: [
          "Setiap kelompok menyajikan klasifikasi dan menemukan jumlah sudut 180°.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan sifat dan klasifikasi segitiga.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "keliling-luas-segitiga",
      title: "Keliling dan Luas Segitiga",
      desc: "RPP rumus keliling dan luas segitiga serta penerapannya pada masalah kontekstual.",
      icon: Triangle,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("luas dan keliling segitiga"), DIMENSI.mandiri, DIMENSI.kreatif("perancangan bangun")],
      relevansi:
        "Keliling dan luas segitiga digunakan dalam menentukan kebutuhan bahan untuk membuat bingkai segitiga atau menutupi area berbentuk segitiga.",
      strukturMateri:
        "Bertahap dari konsep keliling, penemuan rumus luas dengan model luas persegi panjang, hingga aplikasi pada masalah kontekstual.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan keliling dan luas segitiga serta menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Keliling Segitiga, Luas Segitiga, dan Aplikasi Keliling-Luas Segitiga.",
      kemitraan: [
        { title: "PKWU", desc: "Menentukan kebutuhan bahan kerajinan berbentuk segitiga." },
        { title: "IPA", desc: "Konsep luas pada konteks ekosistem berbentuk segitiga." },
      ],
      apersepsi:
        "Guru menyajikan: \"Sebuah taman berbentuk segitiga akan dipasang pagar di sekelilingnya. Bagaimana menentukan panjang pagar yang diperlukan?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa segitiga dengan ukuran berbeda.",
          "Murid mencatat pertanyaan tentang cara menghitung keliling dan luasnya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana rumus luas segitiga? Mengapa setengah?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba memotong segitiga menjadi setengah persegi panjang dan mencatat hubungan.",
          "Murid menghitung keliling dan luas berbagai segitiga.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan rumus keliling dan luas segitiga.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada masalah kontekstual baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan rumus keliling dan luas segitiga.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "sifat-segiempat",
      title: "Sifat dan Jenis Segiempat",
      desc: "RPP klasifikasi segiempat: persegi, persegi panjang, jajar genjang, belah ketupat, layang-layang, dan trapesium.",
      icon: Square,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("sifat segiempat"), DIMENSI.bernalarKritis("sifat segiempat"), DIMENSI.komunikatif],
      relevansi:
        "Sifat segiempat digunakan dalam mendesain ruangan, ubin, layang-layang, dan rancangan kerajinan.",
      strukturMateri:
        "Bertahap dari mengenal sifat persegi & persegi panjang, jajar genjang, belah ketupat, layang-layang, hingga trapesium.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengelompokkan segiempat berdasarkan sifat-sifat sisi dan sudutnya.",
      topikPembelajaran: "Persegi, Persegi Panjang, Jajar Genjang, Belah Ketupat, Layang-Layang, dan Trapesium.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Bentuk segiempat pada motif kain tradisional." },
        { title: "PKWU", desc: "Aplikasi segiempat pada perancangan kerajinan." },
      ],
      apersepsi:
        "Guru menampilkan beberapa benda berbentuk segiempat (ubin, layang-layang, papan tulis) dan menanyakan perbedaan sifatnya.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang berbagai bentuk segiempat dalam kehidupan sehari-hari.",
          "Murid mencatat informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi sifat-sifat sisi dan sudut tiap segiempat.",
          "Guru memberi pertanyaan pemandu menuju klasifikasi.",
        ] },
        { items: [
          "Setiap kelompok menyajikan tabel sifat dan klasifikasi segiempat.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan sifat dan klasifikasi segiempat.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "keliling-luas-segiempat",
      title: "Keliling dan Luas Segiempat",
      desc: "RPP rumus keliling dan luas berbagai jenis segiempat dan penerapannya.",
      icon: Diamond,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("keliling dan luas segiempat"), DIMENSI.mandiri, DIMENSI.kreatif("perancangan bidang")],
      relevansi:
        "Keliling dan luas segiempat dipakai dalam menentukan kebutuhan ubin lantai, kebutuhan kain, dan menentukan luas tanah.",
      strukturMateri:
        "Bertahap dari rumus keliling segiempat, ke rumus luas masing-masing jenis segiempat, hingga aplikasi pada masalah kontekstual.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan keliling dan luas berbagai jenis segiempat serta menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Keliling dan Luas Persegi, Persegi Panjang, Jajar Genjang, Belah Ketupat, Layang-Layang, dan Trapesium.",
      kemitraan: [
        { title: "PKWU", desc: "Menentukan kebutuhan bahan untuk kerajinan berbentuk segiempat." },
        { title: "IPS", desc: "Menentukan luas lahan pertanian sebagai aplikasi luas segiempat." },
      ],
      apersepsi:
        "Guru menyajikan: \"Berapa banyak ubin 30x30 cm dibutuhkan untuk menutupi lantai berbentuk persegi panjang berukuran 6 m × 4 m?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan berbagai bentuk segiempat dan benda nyata.",
          "Murid mencatat pertanyaan tentang cara menghitung keliling dan luasnya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana rumus luas tiap segiempat? Apa hubungan antar rumus?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba memotong dan menyusun ulang segiempat untuk menemukan rumus luasnya.",
          "Murid mencatat strategi tiap jenis.",
        ] },
        { items: [
          "Murid berdiskusi menyusun rumus keliling dan luas tiap segiempat.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada soal kontekstual baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan rumus keliling dan luas segiempat.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
  ],
};
