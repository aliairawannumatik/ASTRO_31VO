import { Triangle, Hash, ShieldCheck, Lightbulb } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menerapkan teorema Pythagoras dan kebalikannya untuk menyelesaikan masalah kontekstual yang berkaitan dengan segitiga siku-siku.";

export const teoremaPythagoras: MateriCatalogEntry = {
  slug: "teorema-pythagoras",
  title: "Teorema Pythagoras",
  shortTitle: "Teorema Pythagoras",
  icon: Triangle,
  intro: "Pilih sub-topik teorema Pythagoras untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.orange,
  subMateri: [
    {
      slug: "konsep-pythagoras",
      title: "Konsep Teorema Pythagoras",
      desc: "RPP penemuan dan pembuktian teorema Pythagoras pada segitiga siku-siku.",
      icon: Triangle,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("teorema Pythagoras"), DIMENSI.bernalarKritis("teorema Pythagoras"), DIMENSI.komunikatif],
      relevansi:
        "Teorema Pythagoras dipakai dalam menentukan jarak diagonal televisi, panjang tangga miring, dan jarak antar dua titik di peta.",
      strukturMateri:
        "Bertahap dari mengamati hubungan luas persegi pada sisi-sisi segitiga siku-siku, ke perumusan teorema, hingga menentukan sisi yang belum diketahui.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menggunakan teorema Pythagoras untuk menentukan panjang sisi segitiga siku-siku yang belum diketahui.",
      topikPembelajaran: "Hubungan Luas Persegi pada Sisi Segitiga Siku-siku, Rumus Teorema Pythagoras.",
      kemitraan: [
        { title: "IPA", desc: "Konsep jarak dan kemiringan pada gerak lurus." },
        { title: "PJOK", desc: "Konsep diagonal lapangan dalam strategi olahraga." },
      ],
      apersepsi:
        "Guru menyajikan masalah: \"Sebuah tangga panjangnya 5 m bersandar pada dinding. Jarak kaki tangga ke dinding 3 m. Berapa tinggi dinding yang dijangkau tangga?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tangga miring atau diagonal layar.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi hubungan luas persegi pada ketiga sisi segitiga siku-siku.",
          "Guru memberi pertanyaan pemandu menuju a² + b² = c².",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi penemuan dan rumusnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan teorema Pythagoras.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "tripel-pythagoras",
      title: "Tripel Pythagoras",
      desc: "RPP pengenalan tripel Pythagoras dan cara menentukannya.",
      icon: Hash,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("tripel Pythagoras"), DIMENSI.mandiri, DIMENSI.kreatif("pola tripel")],
      relevansi:
        "Tripel Pythagoras membantu mempercepat perhitungan jika sisi-sisi segitiga merupakan bilangan bulat positif yang khas.",
      strukturMateri:
        "Bertahap dari mengenal tripel Pythagoras dasar (3-4-5, 5-12-13), ke pola pembentuk tripel, hingga aplikasi.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengenali dan menentukan tripel Pythagoras serta mengaplikasikannya.",
      topikPembelajaran: "Tripel Pythagoras Dasar, Pola Pembentuk Tripel, dan Aplikasinya.",
      kemitraan: [
        { title: "PKWU", desc: "Aplikasi tripel Pythagoras pada pembuatan rangka kerajinan." },
        { title: "Seni Budaya", desc: "Tripel Pythagoras pada pola motif geometris." },
      ],
      apersepsi:
        "Guru menampilkan beberapa segitiga siku-siku dengan sisi 3-4-5, 6-8-10, 9-12-15 dan menanyakan polanya.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa segitiga siku-siku dengan sisi bilangan bulat.",
          "Murid mencatat pertanyaan tentang pola yang muncul.",
        ] },
        { items: [
          "Murid merumuskan: \"Apa pola tripel Pythagoras?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba memeriksa berbagai tripel dengan a² + b² = c².",
          "Murid mencatat hasil dan pola.",
        ] },
        { items: [
          "Murid berdiskusi menyusun tripel dasar dan kelipatan tripel.",
        ] },
        { items: [
          "Murid memverifikasi tripel pada situasi baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan ciri tripel Pythagoras.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "kebalikan-pythagoras",
      title: "Kebalikan Teorema Pythagoras",
      desc: "RPP penggunaan kebalikan teorema Pythagoras untuk menentukan jenis segitiga.",
      icon: ShieldCheck,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("kebalikan Pythagoras"), DIMENSI.bernalarKritis("kebalikan Pythagoras"), DIMENSI.komunikatif],
      relevansi:
        "Kebalikan teorema Pythagoras dipakai untuk memeriksa apakah suatu segitiga siku-siku, lancip, atau tumpul, misalnya saat membuat rangka konstruksi.",
      strukturMateri:
        "Bertahap dari pernyataan kebalikan teorema, ke kriteria membandingkan a² + b² dengan c², hingga aplikasinya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan jenis segitiga (siku-siku, lancip, tumpul) menggunakan kebalikan teorema Pythagoras.",
      topikPembelajaran: "Kebalikan Teorema Pythagoras dan Kriteria Jenis Segitiga.",
      kemitraan: [
        { title: "PKWU", desc: "Memastikan sudut siku pada perakitan kerangka kerajinan." },
        { title: "IPA", desc: "Memastikan keadaan tegak lurus pada eksperimen." },
      ],
      apersepsi:
        "Guru menyajikan tiga sisi segitiga: 5, 12, 13 dan menanyakan: \"Apakah segitiga ini siku-siku?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang memastikan kerangka siku.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi kriteria a² + b² < c², =, atau > untuk klasifikasi segitiga.",
          "Guru memberi pertanyaan pemandu menuju strategi.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan kesimpulannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan kriteria kebalikan teorema Pythagoras.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "aplikasi-pythagoras",
      title: "Aplikasi Teorema Pythagoras",
      desc: "RPP penerapan teorema Pythagoras pada masalah jarak, ketinggian, dan diagonal pada bangun datar/ruang.",
      icon: Lightbulb,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("aplikasi Pythagoras"), DIMENSI.mandiri, DIMENSI.kreatif("strategi pemodelan")],
      relevansi:
        "Aplikasi teorema Pythagoras dipakai dalam menentukan jarak, ketinggian, panjang diagonal layar, dan jarak antar dua titik.",
      strukturMateri:
        "Bertahap dari memodelkan masalah ke segitiga siku-siku, menerapkan teorema, hingga menafsirkan hasil.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menerapkan teorema Pythagoras pada berbagai masalah kontekstual termasuk diagonal pada bangun datar.",
      topikPembelajaran: "Aplikasi Pythagoras pada Jarak, Ketinggian, dan Diagonal.",
      kemitraan: [
        { title: "IPA", desc: "Aplikasi pada gerak dua dimensi dan vektor." },
        { title: "IPS", desc: "Menentukan jarak antar dua tempat pada peta." },
      ],
      apersepsi:
        "Guru menampilkan layar TV 32 inci dan menanyakan: \"Bagaimana cara menentukan tinggi dan lebarnya jika rasio 16:9?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa masalah kontekstual yang dapat diselesaikan dengan Pythagoras.",
          "Murid mencatat pertanyaan dan dugaan.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana memodelkan masalah ke segitiga siku-siku?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba memodelkan dan menyelesaikan beberapa masalah.",
          "Murid mencatat strategi.",
        ] },
        { items: [
          "Murid berdiskusi menyusun langkah aplikasi teorema Pythagoras.",
        ] },
        { items: [
          "Murid memverifikasi langkah pada masalah baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan strategi aplikasi Pythagoras.",
          "Murid menulis refleksi atas pengalaman.",
        ] },
      ],
    },
  ],
};
