import { Equal, LineChart, ArrowRightLeft, Minus, Lightbulb } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Memodelkan dan menyelesaikan sistem persamaan linear dua variabel dengan berbagai metode untuk menyelesaikan masalah kontekstual.";

export const spldv: MateriCatalogEntry = {
  slug: "spldv",
  title: "Sistem Persamaan Linear Dua Variabel",
  shortTitle: "SPLDV",
  icon: Equal,
  intro: "Pilih sub-topik SPLDV untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.emerald,
  subMateri: [
    {
      slug: "konsep-spldv",
      title: "Konsep SPLDV",
      desc: "RPP pengenalan konsep SPLDV, ciri-ciri, dan pemodelan masalah kontekstual.",
      icon: Equal,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("SPLDV"), DIMENSI.bernalarKritis("SPLDV"), DIMENSI.komunikatif],
      relevansi:
        "SPLDV dipakai dalam menentukan dua harga yang tidak diketahui dari informasi pembelian beberapa kombinasi barang.",
      strukturMateri:
        "Bertahap dari pengertian SPLDV, ciri-ciri, hingga pemodelan masalah kontekstual ke SPLDV.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengenali SPLDV dan memodelkan masalah kontekstual ke bentuk SPLDV.",
      topikPembelajaran: "Pengertian SPLDV, Ciri-ciri SPLDV, dan Pemodelan Masalah ke SPLDV.",
      kemitraan: [
        { title: "IPS", desc: "Memodelkan masalah ekonomi sederhana ke SPLDV." },
        { title: "Bahasa Indonesia", desc: "Menerjemahkan masalah kontekstual ke bentuk matematika." },
      ],
      apersepsi:
        "Guru menyajikan: \"Tina membeli 2 buku dan 3 pensil seharga Rp19.000. Tono membeli 1 buku dan 2 pensil seharga Rp11.000. Berapa harga sebuah buku dan pensil?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang pembelian beberapa kombinasi barang.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi cara menerjemahkan masalah ke dua persamaan.",
          "Guru memberi pertanyaan pemandu menuju ciri-ciri SPLDV.",
        ] },
        { items: [
          "Setiap kelompok menyajikan SPLDV yang disusun beserta interpretasinya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan ciri-ciri SPLDV.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "metode-grafik",
      title: "Metode Grafik",
      desc: "RPP menyelesaikan SPLDV dengan menggambar grafik kedua persamaan dan menentukan titik potongnya.",
      icon: LineChart,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("metode grafik"), DIMENSI.mandiri, DIMENSI.kreatif("visualisasi grafik")],
      relevansi:
        "Metode grafik membantu memvisualisasikan penyelesaian SPLDV sebagai titik potong dua garis.",
      strukturMateri:
        "Bertahap dari menggambar dua garis, mencari titik potong, hingga menafsirkan penyelesaian.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan SPLDV dengan metode grafik dan menafsirkan penyelesaiannya.",
      topikPembelajaran: "Menggambar Grafik PLDV, Mencari Titik Potong, dan Menafsirkan Penyelesaian.",
      kemitraan: [
        { title: "Informatika", desc: "Visualisasi penyelesaian sistem persamaan dengan aplikasi grafik." },
        { title: "IPA", desc: "Penggunaan grafik dalam analisis data percobaan." },
      ],
      apersepsi:
        "Guru menyajikan dua garis pada bidang koordinat dan menanyakan: \"Apa arti titik potong kedua garis?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa SPLDV dengan grafiknya.",
          "Murid mencatat pertanyaan tentang hubungan titik potong dengan penyelesaian SPLDV.",
        ] },
        { items: [
          "Murid merumuskan: \"Apakah titik potong selalu menjadi penyelesaian?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba menggambar grafik beberapa SPLDV dan mengamati titik potongnya.",
          "Murid mencatat hasilnya.",
        ] },
        { items: [
          "Murid berdiskusi menyusun strategi metode grafik.",
        ] },
        { items: [
          "Murid memverifikasi penyelesaian dengan substitusi ke kedua persamaan.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan langkah-langkah metode grafik.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "metode-substitusi",
      title: "Metode Substitusi",
      desc: "RPP menyelesaikan SPLDV dengan mengganti satu variabel ke dalam persamaan lain.",
      icon: ArrowRightLeft,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("metode substitusi"), DIMENSI.bernalarKritis("metode substitusi"), DIMENSI.komunikatif],
      relevansi:
        "Metode substitusi efektif untuk SPLDV dengan koefisien sederhana, sering dipakai dalam analisis ekonomi dasar.",
      strukturMateri:
        "Bertahap dari memilih variabel untuk diisolasi, mensubstitusi ke persamaan lain, hingga menyelesaikannya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan SPLDV dengan metode substitusi.",
      topikPembelajaran: "Mengisolasi Variabel, Substitusi Antar Persamaan, dan Penyelesaian SPLDV.",
      kemitraan: [
        { title: "IPS", desc: "Penggunaan substitusi dalam menentukan dua harga barang." },
        { title: "PKWU", desc: "Aplikasi substitusi dalam pengelolaan komposisi bahan." },
      ],
      apersepsi:
        "Guru menyajikan SPLDV: \"x + y = 10 dan x = 2y. Bagaimana mencari x dan y?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah SPLDV dengan satu persamaan yang sudah mudah diisolasi.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi cara mengganti satu variabel dengan ekspresi variabel lain.",
          "Guru memberi pertanyaan pemandu menuju strategi substitusi.",
        ] },
        { items: [
          "Setiap kelompok menyajikan langkah substitusi dan hasilnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan langkah metode substitusi.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "metode-eliminasi",
      title: "Metode Eliminasi",
      desc: "RPP menyelesaikan SPLDV dengan menghilangkan salah satu variabel.",
      icon: Minus,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("metode eliminasi"), DIMENSI.mandiri, DIMENSI.kreatif("strategi eliminasi")],
      relevansi:
        "Metode eliminasi efektif jika koefisien variabel mudah disamakan dengan perkalian.",
      strukturMateri:
        "Bertahap dari menyamakan koefisien, mengeliminasi satu variabel, hingga menemukan nilai variabel lain.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan SPLDV dengan metode eliminasi.",
      topikPembelajaran: "Menyamakan Koefisien, Eliminasi Variabel, dan Penyelesaian SPLDV.",
      kemitraan: [
        { title: "IPA", desc: "Penyelesaian dua persamaan rumus fisika dengan eliminasi." },
        { title: "IPS", desc: "Aplikasi eliminasi dalam analisis data ekonomi." },
      ],
      apersepsi:
        "Guru menyajikan SPLDV: \"2x + 3y = 13 dan 2x + y = 7. Bagaimana cara menghilangkan x?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa SPLDV dan menanyakan strategi penyelesaian tanpa substitusi.",
          "Murid mencatat pertanyaan dan dugaan.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana menghilangkan satu variabel dengan operasi pada persamaan?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba mengurangkan/menjumlahkan persamaan untuk menghilangkan satu variabel.",
          "Murid mencatat strategi.",
        ] },
        { items: [
          "Murid berdiskusi menyusun langkah eliminasi termasuk menyamakan koefisien.",
        ] },
        { items: [
          "Murid memverifikasi pada SPLDV baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan langkah metode eliminasi.",
          "Murid menulis refleksi atas pengalaman.",
        ] },
      ],
    },
    {
      slug: "aplikasi-spldv",
      title: "Aplikasi SPLDV",
      desc: "RPP penerapan SPLDV pada masalah kontekstual dengan memilih metode penyelesaian terbaik.",
      icon: Lightbulb,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("aplikasi SPLDV"), DIMENSI.bernalarKritis("aplikasi SPLDV"), DIMENSI.komunikatif],
      relevansi:
        "Aplikasi SPLDV dipakai dalam pemecahan masalah ekonomi, fisika, dan kombinasi pembelian sehari-hari.",
      strukturMateri:
        "Bertahap dari memilih metode terbaik, ke menyelesaikan SPLDV, hingga menafsirkan hasil.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menerapkan SPLDV untuk menyelesaikan masalah kontekstual dengan metode yang tepat.",
      topikPembelajaran: "Pemilihan Metode, Penyelesaian Masalah Kontekstual, dan Penafsiran Hasil.",
      kemitraan: [
        { title: "IPS", desc: "Studi kasus permasalahan ekonomi sederhana." },
        { title: "IPA", desc: "Penyelesaian sistem rumus fisika dengan SPLDV." },
      ],
      apersepsi:
        "Guru menyajikan masalah pembelian dua jenis barang dan meminta murid memilih metode penyelesaian yang paling efisien.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik yang dapat dimodelkan dengan SPLDV.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi metode mana yang paling efisien untuk masalah tersebut.",
          "Guru memberi pertanyaan pemandu untuk membandingkan metode.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi pilihan, langkah, dan hasilnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan kriteria pemilihan metode.",
          "Murid merefleksikan kekuatan kolaborasi.",
        ] },
      ],
    },
  ],
};
