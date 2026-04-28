import { Box, Layers, Pyramid, Calculator } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menentukan luas permukaan dan volume bangun ruang sisi datar (kubus, balok, prisma, dan limas) untuk menyelesaikan masalah kontekstual.";

export const bangunRuangSisiDatar: MateriCatalogEntry = {
  slug: "bangun-ruang-sisi-datar",
  title: "Bangun Ruang Sisi Datar",
  shortTitle: "BRSD",
  icon: Box,
  intro: "Pilih sub-topik bangun ruang sisi datar untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.violet,
  subMateri: [
    {
      slug: "kubus-balok",
      title: "Kubus dan Balok",
      desc: "RPP unsur-unsur, jaring-jaring, luas permukaan, dan volume kubus dan balok.",
      icon: Box,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("kubus dan balok"), DIMENSI.bernalarKritis("kubus dan balok"), DIMENSI.komunikatif],
      relevansi:
        "Kubus dan balok tampak pada kotak kemasan, ruang kelas, akuarium, dan kontainer.",
      strukturMateri:
        "Bertahap dari unsur dan jaring-jaring kubus/balok, ke rumus luas permukaan, hingga rumus volume.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan luas permukaan dan volume kubus dan balok pada masalah kontekstual.",
      topikPembelajaran: "Unsur, Jaring-jaring, Luas Permukaan, dan Volume Kubus & Balok.",
      kemitraan: [
        { title: "PKWU", desc: "Pembuatan kemasan berbentuk balok untuk kerajinan." },
        { title: "IPS", desc: "Konsep kapasitas gudang berbentuk balok." },
      ],
      apersepsi:
        "Guru menyajikan: \"Sebuah akuarium berbentuk balok berukuran 80 × 40 × 50 cm. Berapa volume air maksimal yang dapat ditampung?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik akuarium atau kotak kemasan.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi jaring-jaring, luas permukaan, dan volume kubus/balok.",
          "Guru memberi pertanyaan pemandu menuju rumus.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan hasilnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus luas permukaan dan volume kubus/balok.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "prisma",
      title: "Prisma",
      desc: "RPP unsur-unsur, jaring-jaring, luas permukaan, dan volume prisma.",
      icon: Layers,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("prisma"), DIMENSI.mandiri, DIMENSI.kreatif("representasi prisma")],
      relevansi:
        "Prisma tampak pada batu bata, prism kaca, tenda, dan kotak hadiah berbagai bentuk alas.",
      strukturMateri:
        "Bertahap dari unsur dan jaring-jaring prisma, ke rumus luas permukaan, hingga rumus volume V = Luas alas × tinggi.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan luas permukaan dan volume prisma berbagai bentuk alas.",
      topikPembelajaran: "Unsur, Jaring-jaring, Luas Permukaan, dan Volume Prisma.",
      kemitraan: [
        { title: "PKWU", desc: "Pembuatan kotak prisma sebagai produk kerajinan." },
        { title: "IPA", desc: "Aplikasi prisma kaca pada pembiasan cahaya." },
      ],
      apersepsi:
        "Guru menampilkan tenda kemah berbentuk prisma segitiga dan menanyakan: \"Berapa kebutuhan kain dan volume udara di dalamnya?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa benda berbentuk prisma.",
          "Murid mencatat pertanyaan tentang luas permukaan dan volumenya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana rumus luas permukaan dan volume prisma?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mengeksplorasi jaring-jaring dan menemukan rumus.",
          "Murid mencatat strategi.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan luas permukaan = 2 × Luas alas + (Keliling alas × tinggi) dan V = Luas alas × tinggi.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada prisma baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan rumus luas permukaan dan volume prisma.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "limas",
      title: "Limas",
      desc: "RPP unsur-unsur, jaring-jaring, luas permukaan, dan volume limas.",
      icon: Pyramid,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("limas"), DIMENSI.bernalarKritis("limas"), DIMENSI.komunikatif],
      relevansi:
        "Limas tampak pada piramida Mesir, atap rumah, tenda kerucut, dan dekorasi tradisional.",
      strukturMateri:
        "Bertahap dari unsur limas, ke jaring-jaring, hingga rumus luas permukaan dan volume V = ⅓ × Luas alas × tinggi.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan luas permukaan dan volume limas berbagai bentuk alas.",
      topikPembelajaran: "Unsur, Jaring-jaring, Luas Permukaan, dan Volume Limas.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Bentuk limas pada candi dan piramida tradisional." },
        { title: "PKWU", desc: "Pembuatan kerajinan berbentuk limas." },
      ],
      apersepsi:
        "Guru menampilkan piramida Mesir dan menanyakan: \"Bagaimana cara menentukan volume bangunan ini?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang piramida atau atap rumah berbentuk limas.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi rumus luas permukaan dan volume limas.",
          "Guru memberi pertanyaan pemandu menuju V = ⅓ × Luas alas × tinggi.",
        ] },
        { items: [
          "Setiap kelompok menyajikan rumus dan strategi penyelesaiannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus luas permukaan dan volume limas.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "aplikasi-volume-luas-brsd",
      title: "Aplikasi Volume dan Luas Permukaan BRSD",
      desc: "RPP penerapan rumus luas permukaan dan volume bangun ruang sisi datar pada masalah kontekstual.",
      icon: Calculator,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("aplikasi BRSD"), DIMENSI.mandiri, DIMENSI.kreatif("strategi pemodelan")],
      relevansi:
        "Aplikasi rumus volume dan luas permukaan BRSD dipakai pada perhitungan kebutuhan bahan bangun, kapasitas ruangan, dan harga material.",
      strukturMateri:
        "Bertahap dari memilih rumus yang relevan, ke menggabungkan beberapa bangun ruang, hingga aplikasi pada masalah kompleks.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menerapkan rumus volume dan luas permukaan BRSD untuk menyelesaikan masalah kontekstual.",
      topikPembelajaran: "Aplikasi Volume dan Luas Permukaan BRSD pada Masalah Kontekstual.",
      kemitraan: [
        { title: "PKWU", desc: "Studi kasus pembuatan kemasan dan kerajinan." },
        { title: "IPS", desc: "Studi kasus kapasitas gudang dan biaya material." },
      ],
      apersepsi:
        "Guru menyajikan masalah pembangunan akuarium berbentuk gabungan balok dan limas, menanyakan strategi perhitungan.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa masalah kontekstual gabungan BRSD.",
          "Murid mencatat pertanyaan dan dugaan.",
        ] },
        { items: [
          "Murid merumuskan: \"Rumus apa yang diperlukan? Bagaimana strategi paling efisien?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba menyelesaikan beberapa masalah dengan strategi gabungan.",
          "Murid mencatat strategi.",
        ] },
        { items: [
          "Murid berdiskusi menyusun langkah-langkah penyelesaian.",
        ] },
        { items: [
          "Murid memverifikasi langkah pada masalah baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan strategi aplikasi BRSD.",
          "Murid menulis refleksi atas pengalaman.",
        ] },
      ],
    },
  ],
};
