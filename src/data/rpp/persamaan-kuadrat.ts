import { Equal, Split, Square, Calculator, Lightbulb } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Memodelkan dan menyelesaikan persamaan kuadrat satu variabel serta menerapkannya untuk menyelesaikan masalah kontekstual.";

export const persamaanKuadrat: MateriCatalogEntry = {
  slug: "persamaan-kuadrat",
  title: "Persamaan Kuadrat",
  shortTitle: "Persamaan Kuadrat",
  icon: Equal,
  intro: "Pilih sub-topik persamaan kuadrat untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.fuchsia,
  subMateri: [
    {
      slug: "konsep-persamaan-kuadrat",
      title: "Konsep Persamaan Kuadrat",
      desc: "RPP pengenalan bentuk umum persamaan kuadrat dan ciri-cirinya.",
      icon: Equal,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("persamaan kuadrat"), DIMENSI.bernalarKritis("persamaan kuadrat"), DIMENSI.komunikatif],
      relevansi:
        "Persamaan kuadrat dipakai untuk memodelkan lintasan parabola, luas optimum, dan masalah optimasi sederhana.",
      strukturMateri:
        "Bertahap dari pengertian persamaan kuadrat, bentuk umum ax² + bx + c = 0, hingga ciri-cirinya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengenali dan menulis persamaan kuadrat dalam bentuk umum.",
      topikPembelajaran: "Pengertian Persamaan Kuadrat, Bentuk Umum, dan Ciri-cirinya.",
      kemitraan: [
        { title: "IPA", desc: "Pemodelan lintasan parabola benda dilempar ke atas." },
        { title: "PKWU", desc: "Pemodelan luas optimum kerajinan berbentuk segiempat." },
      ],
      apersepsi:
        "Guru menampilkan lintasan bola yang dilempar ke atas dan menanyakan: \"Bagaimana memodelkan tinggi bola sebagai fungsi waktu?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik lintasan parabola atau luas optimum.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi cara memodelkan masalah ke persamaan kuadrat.",
          "Guru memberi pertanyaan pemandu menuju bentuk umum.",
        ] },
        { items: [
          "Setiap kelompok menyajikan persamaan yang disusun beserta interpretasinya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan bentuk umum dan ciri-ciri persamaan kuadrat.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "pemfaktoran",
      title: "Penyelesaian dengan Pemfaktoran",
      desc: "RPP teknik menyelesaikan persamaan kuadrat dengan metode pemfaktoran.",
      icon: Split,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("pemfaktoran"), DIMENSI.mandiri, DIMENSI.kreatif("strategi faktor")],
      relevansi:
        "Pemfaktoran adalah metode efisien menyelesaikan persamaan kuadrat dengan koefisien sederhana.",
      strukturMateri:
        "Bertahap dari faktorisasi bentuk x² + bx + c, ke ax² + bx + c, hingga prinsip nol-perkalian untuk menentukan akar.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan persamaan kuadrat dengan metode pemfaktoran.",
      topikPembelajaran: "Faktorisasi Persamaan Kuadrat dan Prinsip Nol-Perkalian.",
      kemitraan: [
        { title: "IPA", desc: "Pemecahan masalah fisika dengan persamaan kuadrat." },
        { title: "Informatika", desc: "Penggunaan algoritma pemfaktoran sederhana." },
      ],
      apersepsi:
        "Guru menyajikan: \"Jika ab = 0, maka a = 0 atau b = 0. Bagaimana hubungannya dengan x² - 5x + 6 = 0?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa persamaan kuadrat dengan koefisien sederhana.",
          "Murid mencatat pertanyaan tentang cara mencari akar-akarnya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana memfaktorkan ax² + bx + c?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba memfaktorkan beberapa persamaan kuadrat dan mencari akar.",
          "Murid mencatat strategi.",
        ] },
        { items: [
          "Murid berdiskusi menyusun langkah-langkah pemfaktoran dan prinsip nol-perkalian.",
        ] },
        { items: [
          "Murid memverifikasi langkah pada persamaan baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan metode pemfaktoran.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "melengkapkan-kuadrat",
      title: "Melengkapkan Kuadrat Sempurna",
      desc: "RPP teknik menyelesaikan persamaan kuadrat dengan melengkapkan kuadrat sempurna.",
      icon: Square,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("melengkapkan kuadrat"), DIMENSI.bernalarKritis("melengkapkan kuadrat"), DIMENSI.komunikatif],
      relevansi:
        "Teknik melengkapkan kuadrat menjadi dasar penurunan rumus abc dan mengubah bentuk fungsi kuadrat ke bentuk titik puncak.",
      strukturMateri:
        "Bertahap dari konsep kuadrat sempurna (a±b)² = a² ± 2ab + b², ke melengkapkan suku, hingga menyelesaikan persamaan.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan persamaan kuadrat dengan teknik melengkapkan kuadrat sempurna.",
      topikPembelajaran: "Kuadrat Sempurna, Melengkapkan Suku, dan Penyelesaian Persamaan Kuadrat.",
      kemitraan: [
        { title: "IPA", desc: "Aplikasi melengkapkan kuadrat pada rumus fisika." },
        { title: "Seni Budaya", desc: "Konsep kuadrat sempurna pada motif geometris simetris." },
      ],
      apersepsi:
        "Guru menyajikan: \"x² + 6x = 7. Tambahkan apa pada kedua ruas agar menjadi kuadrat sempurna?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah persamaan kuadrat yang sulit difaktorkan.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi teknik melengkapkan kuadrat untuk membentuk (x+p)² = q.",
          "Guru memberi pertanyaan pemandu menuju strategi yang efisien.",
        ] },
        { items: [
          "Setiap kelompok menyajikan langkah dan hasilnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan langkah melengkapkan kuadrat sempurna.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "rumus-abc",
      title: "Rumus abc",
      desc: "RPP teknik menyelesaikan persamaan kuadrat dengan rumus abc dan diskriminan.",
      icon: Calculator,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("rumus abc"), DIMENSI.mandiri, DIMENSI.kreatif("strategi penyelesaian")],
      relevansi:
        "Rumus abc adalah metode universal menyelesaikan semua persamaan kuadrat termasuk yang tidak dapat difaktorkan dengan mudah.",
      strukturMateri:
        "Bertahap dari penurunan rumus abc dari melengkapkan kuadrat, ke konsep diskriminan, hingga menentukan jenis akar.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menggunakan rumus abc untuk menyelesaikan persamaan kuadrat dan menentukan jenis akarnya.",
      topikPembelajaran: "Rumus abc, Konsep Diskriminan, dan Jenis-jenis Akar Persamaan Kuadrat.",
      kemitraan: [
        { title: "IPA", desc: "Aplikasi rumus abc pada perhitungan fisika sederhana." },
        { title: "Informatika", desc: "Implementasi rumus abc dalam algoritma sederhana." },
      ],
      apersepsi:
        "Guru menyajikan: \"x² + 3x + 1 = 0. Faktorkan! Sulit, kan? Adakah cara lain?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa persamaan kuadrat yang sulit difaktorkan.",
          "Murid mencatat pertanyaan tentang strategi alternatif.",
        ] },
        { items: [
          "Murid merumuskan: \"Apakah ada rumus untuk menemukan akar persamaan kuadrat secara langsung?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mengikuti penurunan rumus abc dari teknik melengkapkan kuadrat.",
          "Murid mencatat strategi dan formulanya.",
        ] },
        { items: [
          "Murid berdiskusi menyusun rumus abc dan konsep diskriminan untuk jenis akar.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada persamaan baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan rumus abc dan diskriminan.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "aplikasi-persamaan-kuadrat",
      title: "Aplikasi Persamaan Kuadrat",
      desc: "RPP penerapan persamaan kuadrat pada masalah kontekstual.",
      icon: Lightbulb,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("aplikasi PK"), DIMENSI.bernalarKritis("aplikasi PK"), DIMENSI.komunikatif],
      relevansi:
        "Persamaan kuadrat dipakai untuk menentukan tinggi maksimum lintasan, luas optimum, dan waktu kembalinya benda yang dilempar.",
      strukturMateri:
        "Bertahap dari memodelkan masalah ke persamaan kuadrat, memilih metode penyelesaian, hingga menafsirkan hasil.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menerapkan persamaan kuadrat untuk menyelesaikan masalah kontekstual dengan metode yang tepat.",
      topikPembelajaran: "Pemodelan dengan Persamaan Kuadrat, Pemilihan Metode, dan Penafsiran Hasil.",
      kemitraan: [
        { title: "IPA", desc: "Aplikasi PK pada lintasan benda dan rumus fisika." },
        { title: "PKWU", desc: "Optimasi luas pada pembuatan kerajinan berbentuk segiempat." },
      ],
      apersepsi:
        "Guru menyajikan: \"Sebuah taman berbentuk persegi panjang dengan keliling 20 m dan luas 24 m². Berapa panjang dan lebarnya?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang taman, lintasan benda, atau optimasi luas.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi pemodelan ke PK dan memilih metode penyelesaian terbaik.",
          "Guru memberi pertanyaan pemandu untuk membandingkan metode.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi pemodelan, metode, dan hasilnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan strategi aplikasi PK.",
          "Murid merefleksikan kekuatan kolaborasi.",
        ] },
      ],
    },
  ],
};
