import { Move, Triangle, GitBranch, Compass } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menerapkan konsep garis, sudut, dan hubungan antar sudut dalam menyelesaikan masalah geometri.";

export const garisDanSudut: MateriCatalogEntry = {
  slug: "garis-dan-sudut",
  title: "Garis dan Sudut",
  shortTitle: "Garis & Sudut",
  icon: Move,
  intro: "Pilih sub-topik garis dan sudut untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.teal,
  subMateri: [
    {
      slug: "konsep-garis-sudut",
      title: "Konsep Garis dan Sudut",
      desc: "RPP pengenalan unsur garis (titik, ruas garis, sinar) dan unsur sudut serta jenis-jenisnya.",
      icon: Move,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("garis dan sudut"), DIMENSI.mandiri, DIMENSI.kreatif("representasi geometri")],
      relevansi:
        "Konsep garis dan sudut tampak pada pertemuan jalan, sudut bangunan, jam dinding, dan rancangan denah ruangan.",
      strukturMateri:
        "Bertahap dari unsur garis (titik, ruas garis, sinar), pengertian sudut, satuan sudut, hingga jenis-jenis sudut (lancip, siku-siku, tumpul, lurus).",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menjelaskan unsur garis dan sudut serta mengenali jenis-jenis sudut berdasarkan ukurannya.",
      topikPembelajaran: "Unsur Garis, Unsur Sudut, Satuan Sudut, dan Jenis-jenis Sudut.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Sudut pada motif geometris seni rupa nusantara." },
        { title: "PJOK", desc: "Sudut tendangan dan lemparan dalam olahraga." },
      ],
      apersepsi:
        "Guru menampilkan jam dinding pada beberapa waktu (pukul 3, 6, 9) dan menanyakan: \"Sudut apa yang terbentuk antara jarum panjang dan pendek?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan foto bangunan, jam, dan persimpangan jalan.",
          "Murid mencatat pertanyaan tentang macam-macam sudut.",
        ] },
        { items: [
          "Murid merumuskan: \"Apa unsur sudut? Bagaimana mengukurnya?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mengukur berbagai sudut di sekitar dengan busur derajat.",
          "Murid mencatat hasil pengukuran dan jenis sudutnya.",
        ] },
        { items: [
          "Murid berdiskusi mengelompokkan sudut berdasarkan ukurannya.",
        ] },
        { items: [
          "Murid memverifikasi pengelompokan dengan contoh sudut baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan unsur garis dan sudut serta jenis-jenisnya.",
          "Murid menulis refleksi atas pengamatan.",
        ] },
      ],
    },
    {
      slug: "hubungan-antar-sudut",
      title: "Hubungan Antar Sudut",
      desc: "RPP konsep sudut berpenyiku, berpelurus, bertolak belakang, dan berdampingan.",
      icon: Triangle,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("hubungan antar sudut"), DIMENSI.bernalarKritis("hubungan antar sudut"), DIMENSI.komunikatif],
      relevansi:
        "Hubungan antar sudut digunakan dalam menentukan besar sudut yang tidak diketahui pada rancangan bangunan, jembatan, dan rangka konstruksi.",
      strukturMateri:
        "Bertahap dari sudut berpenyiku, berpelurus, bertolak belakang, hingga sudut berdampingan.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan besar sudut yang berpenyiku, berpelurus, bertolak belakang, dan berdampingan pada masalah kontekstual.",
      topikPembelajaran: "Sudut Berpenyiku, Berpelurus, Bertolak Belakang, dan Berdampingan.",
      kemitraan: [
        { title: "PKWU", desc: "Aplikasi sudut pada perancangan kerajinan tangan." },
        { title: "Informatika", desc: "Aplikasi sudut pada desain antarmuka grafis sederhana." },
      ],
      apersepsi:
        "Guru menyajikan dua garis berpotongan dengan sudut x dan 3x; murid diminta menentukan x menggunakan hubungan sudut bertolak belakang.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik pada rangka konstruksi dengan beberapa sudut tidak diketahui.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi hubungan sudut dengan model dan pengukuran.",
          "Guru memberi pertanyaan pemandu menuju definisi tiap hubungan sudut.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi penyelesaian dan kesimpulannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan sifat-sifat hubungan antar sudut.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "sudut-pada-garis-sejajar",
      title: "Sudut pada Dua Garis Sejajar",
      desc: "RPP konsep sudut sehadap, dalam berseberangan, luar berseberangan, dan dalam sepihak.",
      icon: GitBranch,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("sudut pada garis sejajar"), DIMENSI.mandiri, DIMENSI.kreatif("strategi geometri")],
      relevansi:
        "Konsep sudut pada dua garis sejajar dipakai pada konstruksi rel kereta api, jembatan, dan rancangan bangunan dengan elemen sejajar.",
      strukturMateri:
        "Bertahap dari mengenal garis transversal, ke sudut sehadap, dalam/luar berseberangan, hingga dalam sepihak.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan besar sudut-sudut pada dua garis sejajar yang dipotong garis transversal.",
      topikPembelajaran: "Garis Transversal, Sudut Sehadap, Dalam/Luar Berseberangan, dan Dalam Sepihak.",
      kemitraan: [
        { title: "IPA", desc: "Konsep pembiasan cahaya pada media sejajar." },
        { title: "Seni Budaya", desc: "Pola sudut pada motif tenun atau batik dengan garis sejajar." },
      ],
      apersepsi:
        "Guru menampilkan dua rel kereta api yang dipotong jembatan dan menanyakan hubungan sudut yang terbentuk.",
      langkahInti: [
        { items: [
          "Guru menampilkan ilustrasi dua garis sejajar dipotong garis transversal.",
          "Murid mencatat pertanyaan tentang sudut-sudut yang terbentuk.",
        ] },
        { items: [
          "Murid merumuskan: \"Sudut mana yang sama besar? Sudut mana yang saling berpelurus?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mengukur sudut yang terbentuk pada beberapa konfigurasi garis sejajar.",
          "Murid mencatat hasil dan pola.",
        ] },
        { items: [
          "Murid berdiskusi menyusun sifat-sifat sudut sehadap, berseberangan, dan sepihak.",
        ] },
        { items: [
          "Murid memverifikasi sifat pada konfigurasi baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan sifat-sifat sudut pada dua garis sejajar.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "aplikasi-garis-dan-sudut",
      title: "Aplikasi Garis dan Sudut",
      desc: "RPP penerapan konsep garis dan sudut pada masalah kontekstual termasuk pemecahan masalah geometri.",
      icon: Compass,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("aplikasi geometri"), DIMENSI.bernalarKritis("aplikasi geometri"), DIMENSI.komunikatif],
      relevansi:
        "Aplikasi garis dan sudut dipakai pada perancangan denah, navigasi, hingga seni rupa dan fotografi.",
      strukturMateri:
        "Bertahap dari memilih konsep yang relevan, menggabungkan beberapa sifat sudut, hingga memecahkan masalah kontekstual yang kompleks.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menerapkan konsep garis dan sudut untuk menyelesaikan masalah kontekstual yang melibatkan beberapa hubungan sudut.",
      topikPembelajaran: "Aplikasi Garis dan Sudut pada Denah, Navigasi, dan Pemecahan Masalah Geometri.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Penerapan sudut pada karya seni rupa dan fotografi." },
        { title: "Informatika", desc: "Aplikasi sudut pada desain antarmuka dan grafis komputer." },
      ],
      apersepsi:
        "Guru menyajikan denah ruangan dan menanyakan strategi menentukan sudut antara dinding-dinding tertentu.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik denah ruangan dengan beberapa sudut tidak diketahui.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi strategi menggabungkan beberapa sifat sudut.",
          "Guru memberi pertanyaan pemandu menuju strategi efisien.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi penyelesaian dan kesimpulannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan strategi aplikasi konsep garis dan sudut.",
          "Murid merefleksikan kekuatan kolaborasi.",
        ] },
      ],
    },
  ],
};
