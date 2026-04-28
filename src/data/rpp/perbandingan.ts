import { Scale, Ratio, RefreshCcw, Map } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menggunakan rasio (skala, proporsi, dan laju perubahan) dalam penyelesaian masalah kontekstual.";

export const perbandingan: MateriCatalogEntry = {
  slug: "perbandingan",
  title: "Perbandingan",
  shortTitle: "Perbandingan",
  icon: Scale,
  intro: "Pilih sub-topik perbandingan untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.amber,
  subMateri: [
    {
      slug: "konsep-perbandingan",
      title: "Konsep Perbandingan",
      desc: "RPP pengenalan konsep perbandingan dua besaran dan menyederhanakan perbandingan.",
      icon: Scale,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("perbandingan"), DIMENSI.bernalarKritis("perbandingan"), DIMENSI.komunikatif],
      relevansi:
        "Konsep perbandingan dipakai dalam membaca skala peta, perbandingan resep masakan, perbandingan jumlah peserta dalam komposisi tim, dan banyak situasi nyata lainnya.",
      strukturMateri:
        "Bertahap dari konsep perbandingan dua besaran sejenis, menyederhanakan perbandingan, hingga perbandingan dengan tiga besaran atau lebih.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menjelaskan konsep perbandingan, menyederhanakan perbandingan, dan menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Konsep Perbandingan, Bentuk Perbandingan, Penyederhanaan Perbandingan.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Perbandingan komposisi warna pada lukisan atau motif batik." },
        { title: "PJOK", desc: "Perbandingan jumlah pemain dalam tim olahraga." },
      ],
      apersepsi:
        "Guru menyajikan masalah: \"Pada kelas ada 12 anak laki-laki dan 18 anak perempuan. Berapa perbandingan jumlah keduanya?\" untuk memantik konsep perbandingan.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang komposisi kelompok.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen dan membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi cara menulis dan menyederhanakan perbandingan dengan FPB.",
          "Guru memberi pertanyaan pemandu menuju konsep perbandingan paling sederhana.",
        ] },
        { items: [
          "Setiap kelompok menyajikan perbandingan yang disusun dan disederhanakan.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan konsep dan strategi menyederhanakan perbandingan.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "perbandingan-senilai",
      title: "Perbandingan Senilai",
      desc: "RPP konsep perbandingan senilai dan strategi penyelesaiannya.",
      icon: Ratio,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("perbandingan senilai"), DIMENSI.mandiri, DIMENSI.kreatif("strategi perbandingan")],
      relevansi:
        "Perbandingan senilai dipakai dalam menambah resep masakan, menghitung total harga banyak barang dengan harga satuan tetap, atau menghitung jarak tempuh.",
      strukturMateri:
        "Bertahap dari mengidentifikasi ciri perbandingan senilai, ke strategi pembanding satuan, hingga strategi pembanding silang.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan ciri perbandingan senilai dan menyelesaikan masalah kontekstual yang berkaitan dengannya.",
      topikPembelajaran: "Ciri Perbandingan Senilai, Strategi Pembanding Satuan, Strategi Pembanding Silang.",
      kemitraan: [
        { title: "PKWU", desc: "Menggandakan resep masakan sebagai aplikasi perbandingan senilai." },
        { title: "IPA", desc: "Menghitung jarak tempuh pada kecepatan tetap sebagai aplikasi perbandingan senilai." },
      ],
      apersepsi:
        "Guru menyajikan: \"Jika 3 buku seharga Rp30.000, berapa harga 7 buku?\" untuk memantik strategi perbandingan senilai.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa pasangan besaran (jumlah barang vs harga, waktu vs jarak).",
          "Murid mencatat pertanyaan yang muncul.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana ciri pasangan besaran yang berbanding senilai?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba membandingkan beberapa pasangan besaran dengan tabel.",
          "Murid mencatat pola yang muncul.",
        ] },
        { items: [
          "Murid berdiskusi menyusun strategi pembanding satuan dan pembanding silang.",
        ] },
        { items: [
          "Murid memverifikasi strategi pada soal kontekstual baru.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan strategi penyelesaian perbandingan senilai.",
          "Murid menulis refleksi tentang strategi paling efisien.",
        ] },
      ],
    },
    {
      slug: "perbandingan-berbalik-nilai",
      title: "Perbandingan Berbalik Nilai",
      desc: "RPP konsep perbandingan berbalik nilai serta strategi penyelesaiannya.",
      icon: RefreshCcw,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("perbandingan berbalik nilai"), DIMENSI.bernalarKritis("perbandingan berbalik nilai"), DIMENSI.komunikatif],
      relevansi:
        "Perbandingan berbalik nilai dipakai dalam menentukan banyak pekerja vs lama waktu pekerjaan, jumlah pipa vs waktu pengisian bak, dan situasi sejenis.",
      strukturMateri:
        "Bertahap dari mengidentifikasi ciri perbandingan berbalik nilai, ke strategi penyelesaian dengan hasil kali konstan.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat membedakan perbandingan senilai dan berbalik nilai serta menyelesaikan masalah perbandingan berbalik nilai.",
      topikPembelajaran: "Ciri Perbandingan Berbalik Nilai, Hasil Kali Konstan, Strategi Penyelesaian.",
      kemitraan: [
        { title: "IPS", desc: "Konteks proyek pembangunan: jumlah pekerja vs lama waktu kerja." },
        { title: "IPA", desc: "Hubungan kecepatan dan waktu pada jarak tetap." },
      ],
      apersepsi:
        "Guru menyajikan: \"Jika 4 orang dapat menyelesaikan suatu pekerjaan dalam 6 hari, berapa hari pekerjaan selesai bila dikerjakan 8 orang?\" untuk memantik perbandingan berbalik nilai.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang banyak pekerja vs lama waktu.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi pasangan besaran dan menemukan pola hasil kali konstan.",
          "Guru memberi pertanyaan pemandu menuju strategi penyelesaian.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi penyelesaian dan kesimpulannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan ciri dan strategi perbandingan berbalik nilai.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "skala",
      title: "Skala",
      desc: "RPP konsep skala pada peta dan denah serta penerapannya dalam menentukan jarak sebenarnya.",
      icon: Map,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("skala"), DIMENSI.kebinekaanGlobal("skala peta nusantara"), DIMENSI.kreatif("denah dan peta")],
      relevansi:
        "Skala dipakai dalam membaca peta, denah rumah, model bangunan, dan kerja proyek arsitektur.",
      strukturMateri:
        "Bertahap dari konsep skala sebagai perbandingan, menentukan jarak sebenarnya dari peta, hingga menentukan ukuran model dari ukuran sebenarnya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menjelaskan konsep skala dan menerapkannya untuk menentukan jarak sebenarnya, jarak pada peta, atau ukuran model.",
      topikPembelajaran: "Konsep Skala, Jarak Sebenarnya, Jarak pada Peta, Ukuran Model.",
      kemitraan: [
        { title: "IPS", desc: "Membaca skala pada peta wilayah Indonesia." },
        { title: "Seni Budaya", desc: "Menggambar denah rumah dengan skala tertentu." },
      ],
      apersepsi:
        "Guru menampilkan peta Indonesia dengan skala 1:10.000.000 dan bertanya: \"Bagaimana cara menghitung jarak sebenarnya dari Jakarta ke Surabaya?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa peta dan denah dengan skala berbeda.",
          "Murid mencatat pertanyaan tentang arti skala.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana hubungan skala, jarak peta, dan jarak sebenarnya?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba mengukur jarak pada peta dan menghitung jarak sebenarnya untuk berbagai skala.",
          "Murid mencatat hasilnya.",
        ] },
        { items: [
          "Murid berdiskusi menyusun rumus hubungan ketiga besaran.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada peta atau denah baru.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan konsep skala dan strategi penyelesaiannya.",
          "Murid menulis refleksi atas pengalaman menemukan rumus.",
        ] },
      ],
    },
  ],
};
