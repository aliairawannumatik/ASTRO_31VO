import { Divide, Plus, X, Percent, PieChart } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Membaca, menulis, membandingkan, dan mengurutkan bilangan rasional (termasuk pecahan), serta menerapkan operasi aritmetika pada pecahan untuk menyelesaikan masalah kontekstual.";

export const pecahan: MateriCatalogEntry = {
  slug: "pecahan",
  title: "Pecahan",
  shortTitle: "Pecahan",
  icon: PieChart,
  intro: "Pilih sub-topik pecahan untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.pink,
  subMateri: [
    {
      slug: "konsep-bentuk-pecahan",
      title: "Konsep dan Bentuk Pecahan",
      desc: "RPP pengenalan konsep pecahan, jenis-jenis pecahan, serta perbandingan dan pengurutan pecahan.",
      icon: PieChart,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("pecahan"), DIMENSI.bernalarKritis("pecahan"), DIMENSI.komunikatif],
      relevansi:
        "Konsep pecahan dipakai dalam membagi makanan, membaca resep masakan, mengukur waktu (jam), dan dalam berbagai aktivitas sehari-hari.",
      strukturMateri:
        "Bertahap dari konsep pecahan biasa, pecahan campuran, pecahan senilai, hingga membandingkan dan mengurutkan pecahan.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menjelaskan konsep pecahan, menentukan pecahan senilai, serta membandingkan dan mengurutkan pecahan.",
      topikPembelajaran: "Konsep Pecahan, Jenis Pecahan, Pecahan Senilai, Membandingkan dan Mengurutkan Pecahan.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Konteks pembagian potongan kue tradisional sebagai contoh pecahan." },
        { title: "PJOK", desc: "Konsep pembagian waktu istirahat atau lapangan menjadi bagian sama besar." },
      ],
      apersepsi:
        "Guru menyajikan ilustrasi sebuah pizza yang dipotong menjadi 8 bagian sama besar, lalu bertanya: \"Jika Andi makan 3 potong, berapa bagian pizza yang dimakannya?\" untuk memantik diskusi tentang pecahan.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah pembagian potongan kue tradisional yang harus dibagi rata kepada beberapa anak.",
          "Murid memahami informasi: jumlah kue, jumlah anak, dan permintaan pembagian.",
        ] },
        { items: [
          "Murid dikelompokkan secara heterogen 4-5 orang.",
          "Setiap kelompok membagi peran (penyaji, notulis, pengelola waktu, juru bicara).",
        ] },
        { items: [
          "Murid mengeksplorasi cara membagi kue dengan berbagai representasi (gambar, pita pecahan, garis bilangan).",
          "Guru memberikan pertanyaan pemandu untuk menemukan konsep pecahan senilai.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi pembagiannya dan menjelaskan pecahan senilai yang ditemukan.",
          "Kelompok lain memberikan tanggapan dan pertanyaan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan konsep pecahan, pecahan senilai, dan strategi membandingkan pecahan.",
          "Murid merefleksikan pengalaman kolaborasi dan strategi paling efektif.",
        ] },
      ],
    },
    {
      slug: "penjumlahan-pengurangan-pecahan",
      title: "Penjumlahan dan Pengurangan Pecahan",
      desc: "RPP operasi penjumlahan dan pengurangan pecahan biasa, pecahan campuran, dan pecahan dengan penyebut berbeda.",
      icon: Plus,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("operasi pecahan"), DIMENSI.mandiri, DIMENSI.kreatif("operasi pecahan")],
      relevansi:
        "Penjumlahan dan pengurangan pecahan dipakai saat menambahkan bahan resep, menghitung sisa bahan bakar, atau menjumlahkan waktu kegiatan.",
      strukturMateri:
        "Bertahap dari penjumlahan/pengurangan pecahan dengan penyebut sama, ke penyebut berbeda, hingga melibatkan pecahan campuran.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan operasi penjumlahan dan pengurangan pecahan dengan penyebut sama maupun berbeda dan menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Penjumlahan Pecahan, Pengurangan Pecahan, Penyamaan Penyebut, Pecahan Campuran.",
      kemitraan: [
        { title: "IPA", desc: "Konteks pengukuran volume cairan dalam pecahan liter sebagai aplikasi nyata." },
        { title: "PKWU", desc: "Konsep pengurangan bahan resep masakan sebagai contoh kontekstual." },
      ],
      apersepsi:
        "Guru menyajikan ilustrasi: \"Ibu memiliki 3/4 kg tepung. Untuk membuat kue, Ibu memakai 1/2 kg. Berapa sisa tepung Ibu?\" untuk memantik penemuan strategi pengurangan pecahan.",
      langkahInti: [
        { items: [
          "Guru menampilkan video singkat tentang membagi dan menambah bahan masakan.",
          "Murid mencatat pertanyaan yang muncul tentang operasi pecahan.",
        ] },
        { items: [
          "Murid merumuskan dugaan: \"Bagaimana cara menjumlahkan pecahan dengan penyebut berbeda?\"",
          "Murid menulis hipotesis pada LKPD.",
        ] },
        { items: [
          "Murid mencoba beberapa pasangan pecahan menggunakan pita pecahan dan garis bilangan.",
          "Murid mencatat hasil dan pola yang muncul.",
        ] },
        { items: [
          "Murid berdiskusi mengamati pola dan menyimpulkan perlunya menyamakan penyebut.",
          "Murid menyusun langkah-langkah umum penjumlahan & pengurangan pecahan.",
        ] },
        { items: [
          "Murid memverifikasi dugaannya pada soal-soal baru.",
          "Guru memberikan umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru merumuskan aturan umum penjumlahan & pengurangan pecahan.",
          "Murid menuliskan refleksi tentang strategi yang paling membantu.",
        ] },
      ],
    },
    {
      slug: "perkalian-pembagian-pecahan",
      title: "Perkalian dan Pembagian Pecahan",
      desc: "RPP operasi perkalian dan pembagian pecahan termasuk konsep kebalikan (resiprok) pecahan.",
      icon: X,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("perkalian dan pembagian pecahan"), DIMENSI.bernalarKritis("perkalian dan pembagian pecahan"), DIMENSI.komunikatif],
      relevansi:
        "Perkalian dan pembagian pecahan dipakai dalam menggandakan resep masakan, menghitung porsi, dan berbagai konteks pengukuran.",
      strukturMateri:
        "Bertahap dari perkalian pecahan dengan bilangan asli, antar pecahan biasa, hingga pembagian pecahan menggunakan kebalikan (resiprok).",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan operasi perkalian dan pembagian pecahan, termasuk pecahan campuran, pada masalah kontekstual.",
      topikPembelajaran: "Perkalian Pecahan, Pembagian Pecahan, Kebalikan (Resiprok) Pecahan.",
      kemitraan: [
        { title: "PKWU", desc: "Konsep menggandakan atau memperkecil resep masakan sebagai aplikasi perkalian pecahan." },
        { title: "IPA", desc: "Pembagian volume cairan menjadi takaran kecil sebagai aplikasi pembagian pecahan." },
      ],
      apersepsi:
        "Guru menyajikan masalah: \"Sebuah pita panjangnya 3/4 m akan dipotong menjadi bagian-bagian sepanjang 1/8 m. Berapa banyak potongan yang dihasilkan?\" sebagai pemantik diskusi pembagian pecahan.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang menggandakan resep dan memotong pita.",
          "Murid menuliskan informasi yang diketahui dan ditanyakan.",
        ] },
        { items: [
          "Murid dikelompokkan secara heterogen 4-5 orang.",
          "Setiap kelompok membagi peran dan menyepakati strategi awal.",
        ] },
        { items: [
          "Murid mengeksplorasi konsep perkalian dengan model area dan pembagian dengan model pengukuran berulang.",
          "Guru memberikan pertanyaan pemandu untuk menemukan konsep resiprok.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi penyelesaian dan menemukan aturan umum.",
          "Kelompok lain memberi tanggapan dan pertanyaan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan aturan perkalian dan pembagian pecahan.",
          "Murid merefleksikan kontribusi anggota kelompok dan strategi paling efisien.",
        ] },
      ],
    },
    {
      slug: "pecahan-desimal-persen",
      title: "Pecahan Desimal dan Persen",
      desc: "RPP konversi antar bentuk pecahan biasa, pecahan desimal, dan persen serta penerapannya.",
      icon: Percent,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("pecahan desimal dan persen"), DIMENSI.mandiri, DIMENSI.kreatif("representasi pecahan")],
      relevansi:
        "Pecahan desimal dan persen dipakai dalam transaksi belanja (diskon, pajak), pengukuran ilmiah, hasil tes, dan literasi finansial.",
      strukturMateri:
        "Bertahap dari konversi pecahan biasa ke desimal, ke persen, dan kembali, hingga aplikasi persen pada situasi nyata.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengubah bentuk pecahan biasa, pecahan desimal, dan persen serta menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Pecahan Desimal, Persen, Konversi Antar Bentuk Pecahan, Aplikasi Persen.",
      kemitraan: [
        { title: "IPS", desc: "Konteks diskon dan pajak dalam transaksi sederhana sebagai aplikasi persen." },
        { title: "Bahasa Indonesia", desc: "Membaca grafik dan tabel data persen pada teks informasi." },
      ],
      apersepsi:
        "Guru menampilkan label diskon \"50% off\" pada gambar produk dan bertanya: \"Apa arti angka itu? Berapa harga setelah diskon jika harga awal Rp80.000?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan label harga, diskon, dan persentase nilai ujian.",
          "Murid mencatat hal-hal menarik yang dapat dihitung dengan persen dan desimal.",
        ] },
        { items: [
          "Murid merumuskan pertanyaan: \"Bagaimana mengubah persen menjadi pecahan? Bagaimana sebaliknya?\"",
          "Murid menulis dugaan strategi pada LKPD.",
        ] },
        { items: [
          "Murid mengeksplorasi konversi melalui tabel pecahan-desimal-persen.",
          "Murid mencatat pola yang muncul dari berbagai contoh.",
        ] },
        { items: [
          "Murid mendiskusikan strategi konversi paling efisien.",
          "Murid menyusun aturan umum konversi pada LKPD.",
        ] },
        { items: [
          "Murid menguji aturan pada soal-soal kontekstual baru.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan aturan konversi dan aplikasi persen pada konteks belanja.",
          "Murid merefleksikan strategi yang paling membantu.",
        ] },
      ],
    },
  ],
};
