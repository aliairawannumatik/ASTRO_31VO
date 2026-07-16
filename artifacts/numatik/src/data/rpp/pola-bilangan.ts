import { Sigma, ArrowUpRight, Layers, Grid3x3 } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Mengenali, menggambarkan, dan memodelkan pola bilangan serta menentukan suku ke-n suatu barisan dan deret.";

export const polaBilangan: MateriCatalogEntry = {
  slug: "pola-bilangan",
  title: "Pola Bilangan",
  shortTitle: "Pola Bilangan",
  icon: Sigma,
  intro: "Pilih sub-topik pola bilangan untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.fuchsia,
  subMateri: [
    {
      slug: "pola-bilangan",
      title: "Pola Bilangan",
      desc: "RPP pengenalan pola bilangan ganjil, genap, segitiga, persegi, dan Fibonacci.",
      icon: Sigma,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("pola bilangan"), DIMENSI.bernalarKritis("pola bilangan"), DIMENSI.komunikatif],
      relevansi:
        "Pola bilangan tampak pada susunan bunga matahari, struktur cangkang siput, jadwal pertandingan, dan kalender.",
      strukturMateri:
        "Bertahap dari pola bilangan ganjil, genap, segitiga, persegi, hingga pola Fibonacci.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengenali berbagai pola bilangan dan menentukan suku berikutnya.",
      topikPembelajaran: "Pola Bilangan Ganjil, Genap, Segitiga, Persegi, dan Fibonacci.",
      kemitraan: [
        { title: "IPA", desc: "Pola bilangan pada struktur alam (bunga matahari, cangkang siput)." },
        { title: "Seni Budaya", desc: "Pola bilangan pada motif geometri tradisional." },
      ],
      apersepsi:
        "Guru menampilkan susunan bola: 1, 3, 6, 10, ... dan menanyakan: \"Berapa bola pada susunan ke-5?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang susunan benda dengan pola tertentu.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi pola bilangan dan mencari aturan pembentuknya.",
          "Guru memberi pertanyaan pemandu menuju jenis-jenis pola bilangan.",
        ] },
        { items: [
          "Setiap kelompok menyajikan pola dan aturan pembentuknya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan jenis-jenis pola bilangan.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "barisan-aritmetika",
      title: "Barisan Aritmetika",
      desc: "RPP pengenalan barisan aritmetika, beda, dan rumus suku ke-n.",
      icon: ArrowUpRight,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("barisan aritmetika"), DIMENSI.mandiri, DIMENSI.kreatif("strategi pola")],
      relevansi:
        "Barisan aritmetika dipakai pada perencanaan tabungan tetap, pertumbuhan jumlah penduduk dengan tambahan tetap, atau jadwal kegiatan berkala.",
      strukturMateri:
        "Bertahap dari konsep barisan, ke pengertian beda, hingga rumus suku ke-n barisan aritmetika.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan beda dan suku ke-n barisan aritmetika serta menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Konsep Barisan, Beda Barisan, Rumus Suku ke-n Barisan Aritmetika.",
      kemitraan: [
        { title: "IPS", desc: "Tabungan tetap bulanan sebagai aplikasi barisan aritmetika." },
        { title: "PJOK", desc: "Latihan dengan kenaikan tetap sebagai aplikasi barisan aritmetika." },
      ],
      apersepsi:
        "Guru menyajikan: \"3, 7, 11, 15, ... berapa bilangan pada urutan ke-10?\" untuk memantik penemuan rumus suku ke-n.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa barisan dengan beda tetap.",
          "Murid mencatat pertanyaan tentang aturan pembentuknya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana menentukan suku ke-n tanpa harus menulis semuanya?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba menyusun pola dan menemukan hubungan U_n dengan a, b, dan n.",
          "Murid mencatat hasilnya.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan U_n = a + (n-1)b.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada barisan baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan rumus suku ke-n barisan aritmetika.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "barisan-geometri",
      title: "Barisan Geometri",
      desc: "RPP pengenalan barisan geometri, rasio, dan rumus suku ke-n.",
      icon: Layers,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("barisan geometri"), DIMENSI.bernalarKritis("barisan geometri"), DIMENSI.komunikatif],
      relevansi:
        "Barisan geometri dipakai pada bunga majemuk, pertumbuhan bakteri, dan peluruhan zat radioaktif.",
      strukturMateri:
        "Bertahap dari konsep rasio, ke pengamatan barisan geometri, hingga rumus suku ke-n.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan rasio dan suku ke-n barisan geometri serta menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Konsep Rasio, Barisan Geometri, dan Rumus Suku ke-n.",
      kemitraan: [
        { title: "IPA", desc: "Pertumbuhan bakteri sebagai aplikasi barisan geometri." },
        { title: "IPS", desc: "Bunga majemuk sebagai aplikasi barisan geometri." },
      ],
      apersepsi:
        "Guru menyajikan: \"Sehelai kertas dilipat sehingga tebalnya menggandakan diri tiap kali. Berapa lipatan ke-10?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik pertumbuhan bakteri/lipatan kertas.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi pola perkalian tetap dan menemukan rumus suku ke-n.",
          "Guru memberi pertanyaan pemandu menuju U_n = a × r^(n-1).",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi penemuan dan rumusnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus suku ke-n barisan geometri.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "konfigurasi-objek",
      title: "Konfigurasi Objek",
      desc: "RPP pola pada konfigurasi objek (susunan benda) dan strategi memprediksinya.",
      icon: Grid3x3,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("konfigurasi objek"), DIMENSI.mandiri, DIMENSI.kreatif("susunan visual")],
      relevansi:
        "Konfigurasi objek tampak pada susunan kursi pertunjukan, pola batu paving, dan tata letak gudang.",
      strukturMateri:
        "Bertahap dari mengenali pola pada susunan benda, ke mengeneralisasi rumus banyak objek, hingga aplikasi pada situasi nyata.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengeneralisasi pola pada konfigurasi objek dan menentukan banyak objek pada konfigurasi ke-n.",
      topikPembelajaran: "Pola pada Konfigurasi Objek, Generalisasi Pola, dan Aplikasi Konfigurasi Objek.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Pola pada karya seni rupa atau kerajinan tradisional." },
        { title: "Informatika", desc: "Pola pengulangan pada coding sederhana." },
      ],
      apersepsi:
        "Guru menampilkan susunan korek api yang membentuk segitiga bertingkat dan menanyakan banyak korek api pada tingkat ke-n.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa konfigurasi objek dengan pola jelas.",
          "Murid mencatat pertanyaan tentang aturannya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana menentukan banyak objek pada konfigurasi ke-n?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba menyusun pola pada konfigurasi-konfigurasi awal dan mencari hubungan dengan posisi.",
          "Murid mencatat hasilnya.",
        ] },
        { items: [
          "Murid berdiskusi menyusun rumus banyak objek pada konfigurasi ke-n.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada konfigurasi baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan strategi mengeneralisasi pola konfigurasi objek.",
          "Murid menulis refleksi atas pengalaman penemuan.",
        ] },
      ],
    },
  ],
};
