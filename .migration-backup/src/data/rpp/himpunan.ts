import { Boxes, GitMerge, CircleDot, Network } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Mengenali, menyatakan, dan menggunakan operasi himpunan untuk menyelesaikan masalah kontekstual.";

export const himpunan: MateriCatalogEntry = {
  slug: "himpunan",
  title: "Himpunan",
  shortTitle: "Himpunan",
  icon: Boxes,
  intro: "Pilih sub-topik himpunan untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.blue,
  subMateri: [
    {
      slug: "konsep-himpunan",
      title: "Konsep Himpunan",
      desc: "RPP pengenalan konsep himpunan, anggota himpunan, dan cara menyatakan himpunan.",
      icon: Boxes,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("konsep himpunan"), DIMENSI.mandiri, DIMENSI.kreatif("representasi himpunan")],
      relevansi:
        "Konsep himpunan dipakai dalam mengelompokkan benda di dapur, mengelompokkan jenis hewan, atau pengelompokan data.",
      strukturMateri:
        "Bertahap dari pengertian himpunan, ke notasi himpunan, hingga cara menyatakan himpunan (kata-kata, daftar, dan notasi pembentuk).",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menjelaskan konsep himpunan dan menyatakan himpunan dengan beberapa cara.",
      topikPembelajaran: "Pengertian Himpunan, Anggota Himpunan, dan Cara Menyatakan Himpunan.",
      kemitraan: [
        { title: "IPA", desc: "Pengelompokan jenis hewan, tumbuhan, atau zat sebagai contoh himpunan." },
        { title: "Bahasa Indonesia", desc: "Mengelompokkan kata-kata berdasarkan jenis sebagai contoh himpunan." },
      ],
      apersepsi:
        "Guru meminta murid mengelompokkan benda-benda dalam tas mereka berdasarkan jenisnya untuk memantik konsep himpunan.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa kelompok benda dan mengajak murid menamai kelompoknya.",
          "Murid mencatat pertanyaan tentang cara menyatakan himpunan.",
        ] },
        { items: [
          "Murid merumuskan: \"Apa ciri sebuah himpunan? Bagaimana cara menulisnya?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba menyatakan beberapa himpunan dengan tiga cara berbeda.",
          "Murid mencatat hasilnya.",
        ] },
        { items: [
          "Murid berdiskusi menyusun pengertian himpunan dan ketiga cara menyatakannya.",
        ] },
        { items: [
          "Murid memverifikasi pengertian pada contoh dan bukan contoh himpunan.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan konsep himpunan.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "operasi-himpunan",
      title: "Operasi Himpunan",
      desc: "RPP operasi irisan, gabungan, selisih, dan komplemen pada himpunan.",
      icon: GitMerge,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("operasi himpunan"), DIMENSI.bernalarKritis("operasi himpunan"), DIMENSI.komunikatif],
      relevansi:
        "Operasi himpunan dipakai dalam menentukan irisan dua kelompok pelanggan, gabungan dua data, atau pengelompokan informasi.",
      strukturMateri:
        "Bertahap dari operasi irisan, gabungan, selisih, hingga komplemen pada himpunan.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan irisan, gabungan, selisih, dan komplemen dua himpunan.",
      topikPembelajaran: "Irisan, Gabungan, Selisih, dan Komplemen Himpunan.",
      kemitraan: [
        { title: "IPS", desc: "Pengelompokan data demografi dengan operasi himpunan." },
        { title: "Informatika", desc: "Operasi himpunan pada basis data sederhana." },
      ],
      apersepsi:
        "Guru menyajikan dua kelompok murid yang ikut ekstrakurikuler basket dan voli, lalu menanyakan cara mencari murid yang ikut keduanya.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang pengelompokan ekstrakurikuler.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi operasi irisan, gabungan, selisih, dan komplemen.",
          "Guru memberi pertanyaan pemandu menuju definisi tiap operasi.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi penyelesaian dan kesimpulannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan operasi pada himpunan.",
          "Murid merefleksikan kekuatan kolaborasi.",
        ] },
      ],
    },
    {
      slug: "diagram-venn",
      title: "Diagram Venn",
      desc: "RPP penggunaan diagram Venn untuk menyajikan operasi himpunan.",
      icon: CircleDot,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("diagram Venn"), DIMENSI.mandiri, DIMENSI.kreatif("representasi visual")],
      relevansi:
        "Diagram Venn dipakai untuk memvisualisasikan kelompok data, hubungan antar kategori, dan analisis survei.",
      strukturMateri:
        "Bertahap dari menggambar diagram Venn dua himpunan, ke tiga himpunan, hingga membaca informasi dari diagram Venn.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menggambar diagram Venn dan membaca informasi yang disajikan padanya.",
      topikPembelajaran: "Diagram Venn Dua Himpunan, Tiga Himpunan, dan Membaca Diagram Venn.",
      kemitraan: [
        { title: "IPS", desc: "Diagram Venn untuk hasil survei sederhana." },
        { title: "Informatika", desc: "Visualisasi data dengan diagram Venn." },
      ],
      apersepsi:
        "Guru menampilkan diagram Venn sederhana hasil survei jenis musik favorit dan menanyakan informasi yang dapat dibaca.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa contoh diagram Venn.",
          "Murid mencatat pertanyaan tentang cara membuat dan membacanya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana menggambar diagram Venn? Bagaimana membaca informasinya?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba menggambar diagram Venn untuk berbagai operasi himpunan.",
          "Murid mencatat strategi tiap operasi.",
        ] },
        { items: [
          "Murid berdiskusi menyusun langkah-langkah membaca diagram Venn.",
        ] },
        { items: [
          "Murid memverifikasi pada diagram Venn baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan langkah membuat dan membaca diagram Venn.",
          "Murid menulis refleksi atas pengalaman.",
        ] },
      ],
    },
    {
      slug: "aplikasi-himpunan",
      title: "Aplikasi Himpunan",
      desc: "RPP penerapan konsep dan operasi himpunan pada masalah kontekstual.",
      icon: Network,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("aplikasi himpunan"), DIMENSI.bernalarKritis("aplikasi himpunan"), DIMENSI.komunikatif],
      relevansi:
        "Aplikasi himpunan dipakai dalam analisis data survei, pengelompokan pelanggan, dan pengambilan keputusan berbasis data.",
      strukturMateri:
        "Bertahap dari memilih operasi yang relevan, ke menyusun diagram Venn, hingga menyimpulkan informasi.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menerapkan konsep dan operasi himpunan untuk menyelesaikan masalah kontekstual yang melibatkan analisis data.",
      topikPembelajaran: "Aplikasi Himpunan pada Analisis Data, Survei, dan Pemecahan Masalah.",
      kemitraan: [
        { title: "IPS", desc: "Studi kasus survei sosial sederhana." },
        { title: "PPKn", desc: "Pengambilan keputusan berbasis data sebagai sikap kritis warga negara." },
      ],
      apersepsi:
        "Guru menyajikan data survei: \"Dari 30 murid, 18 suka voli, 15 suka basket, 8 suka keduanya. Berapa murid yang tidak suka keduanya?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik survei kelas.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi strategi memodelkan masalah dengan diagram Venn dan operasi himpunan.",
          "Guru memberi pertanyaan pemandu menuju strategi efisien.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi penyelesaian dan hasilnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan strategi penerapan himpunan pada survei.",
          "Murid merefleksikan kekuatan kolaborasi.",
        ] },
      ],
    },
  ],
};
