import { LineChart, TrendingUp, GitMerge, Lightbulb } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Memodelkan dan menyelesaikan masalah yang berkaitan dengan persamaan garis lurus pada bidang koordinat.";

export const persamaanGarisLurus: MateriCatalogEntry = {
  slug: "persamaan-garis-lurus",
  title: "Persamaan Garis Lurus",
  shortTitle: "PGL",
  icon: LineChart,
  intro: "Pilih sub-topik persamaan garis lurus untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.amber,
  subMateri: [
    {
      slug: "gradien",
      title: "Gradien Garis",
      desc: "RPP konsep gradien (kemiringan) garis lurus dan cara menentukannya.",
      icon: TrendingUp,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("gradien"), DIMENSI.bernalarKritis("gradien"), DIMENSI.komunikatif],
      relevansi:
        "Gradien tampak pada kemiringan jalan menanjak, atap rumah, dan grafik kenaikan/penurunan harga.",
      strukturMateri:
        "Bertahap dari konsep kemiringan, ke menentukan gradien dari grafik, hingga menentukan gradien dari dua titik.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan gradien suatu garis dari grafik atau dari dua titik yang dilaluinya.",
      topikPembelajaran: "Konsep Gradien, Gradien dari Grafik, dan Gradien dari Dua Titik.",
      kemitraan: [
        { title: "IPA", desc: "Konsep kemiringan permukaan dan gaya yang bekerja." },
        { title: "PJOK", desc: "Kemiringan lintasan pada lompat tinggi atau ski." },
      ],
      apersepsi:
        "Guru menampilkan dua tangga dengan kemiringan berbeda dan menanyakan: \"Tangga mana yang lebih curam? Bagaimana mengukurnya secara matematis?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang kemiringan jalan dan tangga.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi rumus gradien sebagai perubahan y per perubahan x.",
          "Guru memberi pertanyaan pemandu menuju rumus gradien dari dua titik.",
        ] },
        { items: [
          "Setiap kelompok menyajikan rumus dan cara menentukan gradien.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus gradien.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "pgl-bentuk-umum",
      title: "Persamaan Garis Lurus Bentuk Umum",
      desc: "RPP bentuk-bentuk PGL: y = mx + c, ax + by + c = 0, dan PGL melalui dua titik.",
      icon: LineChart,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("PGL bentuk umum"), DIMENSI.mandiri, DIMENSI.kreatif("representasi PGL")],
      relevansi:
        "PGL bentuk umum dipakai untuk memodelkan hubungan linier antara dua besaran, misalnya hubungan biaya dengan jumlah barang.",
      strukturMateri:
        "Bertahap dari y = mx + c, ke ax + by + c = 0, hingga menentukan PGL dari dua titik atau gradien dan satu titik.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan PGL dari dua titik atau dari gradien dan satu titik.",
      topikPembelajaran: "Bentuk y = mx + c, Bentuk ax + by + c = 0, dan PGL Melalui Dua Titik.",
      kemitraan: [
        { title: "IPS", desc: "PGL untuk memodelkan harga total terhadap jumlah barang." },
        { title: "IPA", desc: "Hubungan linier waktu dan jarak pada gerak lurus beraturan." },
      ],
      apersepsi:
        "Guru menampilkan dua titik pada bidang koordinat dan menanyakan: \"Bagaimana menentukan persamaan garis yang melalui kedua titik?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa garis pada bidang koordinat dan persamaannya.",
          "Murid mencatat pertanyaan tentang hubungan antara grafik dan persamaan.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana cara menyusun persamaan garis dari informasi yang ada?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba menyusun PGL dari berbagai informasi (gradien & titik, dua titik).",
          "Murid mencatat strategi.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan rumus umum PGL.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada situasi baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan bentuk-bentuk PGL.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "pgl-sejajar-tegak-lurus",
      title: "PGL Sejajar dan Tegak Lurus",
      desc: "RPP hubungan gradien antara dua garis yang sejajar dan tegak lurus.",
      icon: GitMerge,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("PGL sejajar tegak lurus"), DIMENSI.bernalarKritis("PGL sejajar tegak lurus"), DIMENSI.komunikatif],
      relevansi:
        "Konsep garis sejajar dan tegak lurus dipakai pada perencanaan tata kota, garis lintang-bujur, dan rancangan bangunan.",
      strukturMateri:
        "Bertahap dari hubungan gradien dua garis sejajar (m1 = m2), hingga hubungan gradien dua garis tegak lurus (m1 × m2 = -1).",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan PGL yang sejajar atau tegak lurus terhadap garis tertentu.",
      topikPembelajaran: "Hubungan Gradien Dua Garis Sejajar dan Dua Garis Tegak Lurus.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Penerapan garis sejajar dan tegak lurus pada karya seni rupa." },
        { title: "Informatika", desc: "Konsep garis sejajar/tegak lurus pada desain antarmuka." },
      ],
      apersepsi:
        "Guru menampilkan dua jalan sejajar dan dua jalan tegak lurus pada peta, lalu menanyakan hubungan kemiringannya.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang dua jalan sejajar dan tegak lurus.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi hubungan gradien dua garis sejajar dan tegak lurus.",
          "Guru memberi pertanyaan pemandu menuju aturan m1 = m2 dan m1 × m2 = -1.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan kesimpulannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan aturan gradien garis sejajar dan tegak lurus.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "aplikasi-pgl",
      title: "Aplikasi Persamaan Garis Lurus",
      desc: "RPP penerapan PGL pada masalah kontekstual seperti grafik biaya, kecepatan, dan analisis data.",
      icon: Lightbulb,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("aplikasi PGL"), DIMENSI.mandiri, DIMENSI.kreatif("aplikasi PGL")],
      relevansi:
        "Aplikasi PGL dipakai dalam analisis tarif taksi, biaya listrik, hubungan suhu dan waktu, dan tren data ekonomi.",
      strukturMateri:
        "Bertahap dari memilih bentuk PGL yang tepat, ke memodelkan masalah kontekstual, hingga menafsirkan hasil.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menerapkan PGL untuk menyelesaikan masalah kontekstual.",
      topikPembelajaran: "Pemodelan dengan PGL, Aplikasi pada Tarif/Biaya, dan Penafsiran Hasil.",
      kemitraan: [
        { title: "IPS", desc: "Pemodelan tarif taksi sebagai PGL." },
        { title: "IPA", desc: "Hubungan linear besaran fisika dengan PGL." },
      ],
      apersepsi:
        "Guru menyajikan struk taksi dengan tarif buka pintu dan tarif per km, menanyakan: \"Bagaimana menulis biaya total sebagai fungsi jarak?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa konteks kontekstual (tarif taksi, biaya listrik).",
          "Murid mencatat pertanyaan tentang cara memodelkannya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana memilih bentuk PGL yang sesuai?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba memodelkan beberapa konteks ke PGL.",
          "Murid mencatat strategi.",
        ] },
        { items: [
          "Murid berdiskusi menyusun langkah pemodelan.",
        ] },
        { items: [
          "Murid memverifikasi model pada konteks baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan langkah aplikasi PGL.",
          "Murid menulis refleksi atas pengalaman.",
        ] },
      ],
    },
  ],
};
