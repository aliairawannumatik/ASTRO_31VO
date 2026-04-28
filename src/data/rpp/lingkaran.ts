import { Circle, CircleDot, Compass, PieChart, GitBranch } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menggunakan unsur, sifat, dan rumus pada lingkaran untuk menyelesaikan masalah geometri.";

export const lingkaran: MateriCatalogEntry = {
  slug: "lingkaran",
  title: "Lingkaran",
  shortTitle: "Lingkaran",
  icon: Circle,
  intro: "Pilih sub-topik lingkaran untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.pink,
  subMateri: [
    {
      slug: "unsur-lingkaran",
      title: "Unsur-Unsur Lingkaran",
      desc: "RPP pengenalan unsur lingkaran: pusat, jari-jari, diameter, busur, tali busur, juring, tembereng, dan apotema.",
      icon: CircleDot,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("unsur lingkaran"), DIMENSI.mandiri, DIMENSI.kreatif("representasi lingkaran")],
      relevansi:
        "Unsur lingkaran tampak pada roda kendaraan, jam dinding, kompas, dan peta wilayah berbentuk lingkaran.",
      strukturMateri:
        "Bertahap dari mengenal pusat dan jari-jari, ke diameter, busur, tali busur, juring, tembereng, hingga apotema.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengenali dan menamai unsur-unsur lingkaran dengan tepat.",
      topikPembelajaran: "Pusat, Jari-jari, Diameter, Busur, Tali Busur, Juring, Tembereng, dan Apotema.",
      kemitraan: [
        { title: "IPA", desc: "Penerapan unsur lingkaran pada roda dan gerak melingkar." },
        { title: "Seni Budaya", desc: "Penerapan unsur lingkaran pada motif mandala." },
      ],
      apersepsi:
        "Guru menampilkan jam dinding dan menanyakan unsur-unsur lingkaran yang dapat dikenali padanya.",
      langkahInti: [
        { items: [
          "Guru menampilkan berbagai benda berbentuk lingkaran.",
          "Murid mencatat pertanyaan tentang bagian-bagian lingkaran.",
        ] },
        { items: [
          "Murid merumuskan: \"Apa saja unsur sebuah lingkaran?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mengeksplorasi setiap unsur dengan menggambar dan memberi label.",
          "Murid mencatat definisi tiap unsur.",
        ] },
        { items: [
          "Murid berdiskusi menyusun definisi lengkap setiap unsur lingkaran.",
        ] },
        { items: [
          "Murid memverifikasi pada lingkaran baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan unsur-unsur lingkaran.",
          "Murid menulis refleksi atas pengamatan.",
        ] },
      ],
    },
    {
      slug: "keliling-luas-lingkaran",
      title: "Keliling dan Luas Lingkaran",
      desc: "RPP rumus keliling dan luas lingkaran serta penerapannya.",
      icon: Circle,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("keliling luas lingkaran"), DIMENSI.bernalarKritis("keliling luas lingkaran"), DIMENSI.komunikatif],
      relevansi:
        "Keliling dan luas lingkaran dipakai untuk menentukan kebutuhan bahan tepi karpet bundar atau menghitung luas kolam berbentuk lingkaran.",
      strukturMateri:
        "Bertahap dari konsep π, rumus keliling K = πd, hingga rumus luas L = πr².",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan keliling dan luas lingkaran serta menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Konsep Pi (π), Rumus Keliling Lingkaran, dan Rumus Luas Lingkaran.",
      kemitraan: [
        { title: "PKWU", desc: "Menentukan kebutuhan bahan untuk produk berbentuk lingkaran." },
        { title: "IPA", desc: "Konsep gerak melingkar dan keliling lintasan." },
      ],
      apersepsi:
        "Guru menyajikan masalah: \"Sebuah taman berbentuk lingkaran berdiameter 14 m. Berapa panjang pagar yang diperlukan dan luas tamannya?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik taman berbentuk lingkaran.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi rumus keliling dan luas lingkaran dengan mengukur dan membandingkan.",
          "Guru memberi pertanyaan pemandu menuju nilai π dan rumus.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan rumusnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus keliling dan luas lingkaran.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "sudut-pusat-keliling",
      title: "Sudut Pusat dan Sudut Keliling",
      desc: "RPP konsep sudut pusat, sudut keliling, dan hubungannya.",
      icon: Compass,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("sudut pusat keliling"), DIMENSI.mandiri, DIMENSI.kreatif("strategi geometri")],
      relevansi:
        "Konsep sudut pusat dan keliling dipakai dalam jam dinding, jarum kompas, dan rancangan rumah berbentuk lingkaran.",
      strukturMateri:
        "Bertahap dari pengertian sudut pusat dan sudut keliling, ke hubungan keduanya, hingga sifat sudut keliling pada busur yang sama.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan hubungan sudut pusat dan sudut keliling pada lingkaran.",
      topikPembelajaran: "Sudut Pusat, Sudut Keliling, dan Hubungannya.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Penerapan sudut pada pola mandala atau motif lingkaran." },
        { title: "IPA", desc: "Sudut pada jam dinding sebagai aplikasi sudut pusat." },
      ],
      apersepsi:
        "Guru menampilkan lingkaran dengan sudut pusat dan sudut keliling pada busur yang sama, lalu menanyakan hubungannya.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa lingkaran dengan sudut pusat dan sudut keliling.",
          "Murid mencatat pertanyaan tentang hubungannya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana hubungan sudut pusat dengan sudut keliling pada busur yang sama?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mengukur kedua sudut pada beberapa lingkaran.",
          "Murid mencatat hasil dan pola.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan: sudut pusat = 2 × sudut keliling pada busur yang sama.",
        ] },
        { items: [
          "Murid memverifikasi pada lingkaran baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan hubungan sudut pusat dan sudut keliling.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "panjang-busur-luas-juring",
      title: "Panjang Busur dan Luas Juring",
      desc: "RPP menentukan panjang busur dan luas juring berdasarkan sudut pusat.",
      icon: PieChart,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("panjang busur luas juring"), DIMENSI.bernalarKritis("panjang busur luas juring"), DIMENSI.komunikatif],
      relevansi:
        "Panjang busur dan luas juring dipakai pada potongan kue bundar, lintasan melingkar, dan diagram lingkaran.",
      strukturMateri:
        "Bertahap dari konsep proporsi sudut, ke rumus panjang busur, hingga rumus luas juring.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan panjang busur dan luas juring berdasarkan sudut pusatnya.",
      topikPembelajaran: "Proporsi Sudut, Rumus Panjang Busur, dan Rumus Luas Juring.",
      kemitraan: [
        { title: "PKWU", desc: "Menentukan luas potongan kue dengan rumus juring." },
        { title: "IPS", desc: "Membaca diagram lingkaran sebagai aplikasi luas juring." },
      ],
      apersepsi:
        "Guru menyajikan: \"Sebuah pizza berdiameter 30 cm dipotong dengan sudut pusat 60°. Berapa panjang busur dan luas potongan tersebut?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang potongan kue/pizza.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi proporsi sudut pusat terhadap 360° untuk panjang busur dan luas juring.",
          "Guru memberi pertanyaan pemandu menuju rumus.",
        ] },
        { items: [
          "Setiap kelompok menyajikan rumus dan strategi penyelesaiannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus panjang busur dan luas juring.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "hubungan-sudut-pusat-keliling",
      title: "Sifat Sudut pada Lingkaran",
      desc: "RPP sifat-sifat sudut keliling: sudut keliling pada diameter dan sifat sudut keliling pada busur yang sama.",
      icon: GitBranch,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("sifat sudut lingkaran"), DIMENSI.mandiri, DIMENSI.kreatif("strategi pembuktian")],
      relevansi:
        "Sifat sudut pada lingkaran dipakai dalam analisis konstruksi rangka berbentuk lingkaran dan pengukuran sudut bidang.",
      strukturMateri:
        "Bertahap dari sudut keliling pada diameter, ke sifat sudut keliling pada busur yang sama, hingga aplikasinya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menerapkan sifat-sifat sudut pada lingkaran dalam menyelesaikan masalah geometri.",
      topikPembelajaran: "Sudut Keliling pada Diameter, Sudut Keliling pada Busur Sama, dan Aplikasinya.",
      kemitraan: [
        { title: "PKWU", desc: "Aplikasi sifat sudut lingkaran pada perancangan kerajinan." },
        { title: "Informatika", desc: "Sudut pada visualisasi grafik berbentuk lingkaran." },
      ],
      apersepsi:
        "Guru menyajikan beberapa lingkaran dengan sudut keliling pada diameter dan menanyakan: \"Apakah selalu 90°?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa konfigurasi sudut keliling pada lingkaran.",
          "Murid mencatat pertanyaan tentang sifat-sifatnya.",
        ] },
        { items: [
          "Murid merumuskan: \"Apa sifat sudut keliling pada diameter?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mengukur sudut pada berbagai konfigurasi.",
          "Murid mencatat hasil dan pola.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan sifat-sifat sudut keliling.",
        ] },
        { items: [
          "Murid memverifikasi sifat pada konfigurasi baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan sifat sudut pada lingkaran.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
  ],
};
