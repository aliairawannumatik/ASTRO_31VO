import { Triangle, Shapes, CheckCheck } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menggunakan konsep kesebangunan dan kekongruenan dalam menyelesaikan masalah geometri.";

export const kesebangunanKekongruenan: MateriCatalogEntry = {
  slug: "kesebangunan-kekongruenan",
  title: "Kesebangunan dan Kekongruenan",
  shortTitle: "Kesebangunan & Kekongruenan",
  icon: Shapes,
  intro: "Pilih sub-topik kesebangunan dan kekongruenan untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.emerald,
  subMateri: [
    {
      slug: "kesebangunan-bangun-datar",
      title: "Kesebangunan Bangun Datar",
      desc: "RPP konsep kesebangunan dua bangun datar dan syarat-syaratnya.",
      icon: Shapes,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("kesebangunan bangun datar"), DIMENSI.bernalarKritis("kesebangunan bangun datar"), DIMENSI.komunikatif],
      relevansi:
        "Kesebangunan tampak pada peta dan denah dengan skala, foto dengan ukuran berbeda, dan rancangan model bangunan.",
      strukturMateri:
        "Bertahap dari ciri kesebangunan (sudut bersesuaian sama besar, sisi sebanding), ke memeriksa kesebangunan, hingga aplikasinya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan apakah dua bangun datar sebangun dan menggunakan perbandingan sisi-sisinya.",
      topikPembelajaran: "Ciri Kesebangunan, Sudut Bersesuaian, Sisi Sebanding, dan Aplikasi.",
      kemitraan: [
        { title: "Geografi", desc: "Aplikasi kesebangunan pada peta dan denah." },
        { title: "PKWU", desc: "Aplikasi kesebangunan pada model dan prototipe kerajinan." },
      ],
      apersepsi:
        "Guru menampilkan dua foto sama dengan ukuran berbeda dan menanyakan: \"Apa yang sama dan apa yang berbeda?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang dua peta dengan skala berbeda.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi syarat-syarat kesebangunan dua bangun datar.",
          "Guru memberi pertanyaan pemandu menuju definisi formal.",
        ] },
        { items: [
          "Setiap kelompok menyajikan analisis dan kesimpulannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan ciri kesebangunan bangun datar.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "kesebangunan-segitiga",
      title: "Kesebangunan Segitiga",
      desc: "RPP syarat kesebangunan dua segitiga (AA, SAS, SSS) dan aplikasinya.",
      icon: Triangle,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("kesebangunan segitiga"), DIMENSI.mandiri, DIMENSI.kreatif("strategi geometri")],
      relevansi:
        "Kesebangunan segitiga dipakai untuk menentukan tinggi pohon/gedung dengan bayangan, jarak titik tak terjangkau, dan rancangan jembatan.",
      strukturMateri:
        "Bertahap dari syarat AA (dua sudut), SAS (dua sisi sebanding dan sudut apit sama), hingga SSS (tiga sisi sebanding).",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan apakah dua segitiga sebangun dan menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Syarat Kesebangunan AA, SAS, SSS, dan Aplikasinya.",
      kemitraan: [
        { title: "IPA", desc: "Pengukuran tinggi benda menggunakan bayangan dan kesebangunan segitiga." },
        { title: "PKWU", desc: "Aplikasi kesebangunan pada perancangan rangka." },
      ],
      apersepsi:
        "Guru menyajikan: \"Tinggi pohon tidak dapat diukur langsung. Jika bayangan pohon 8 m dan bayangan tongkat 1 m setinggi 2 m, berapa tinggi pohon?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa pasangan segitiga dengan ciri-ciri yang sama.",
          "Murid mencatat pertanyaan tentang syarat kesebangunan.",
        ] },
        { items: [
          "Murid merumuskan: \"Cukupkah dua sudut sama untuk menyimpulkan kesebangunan?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba memeriksa kesebangunan dengan ciri AA, SAS, SSS.",
          "Murid mencatat hasil dan pola.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan tiga syarat kesebangunan segitiga.",
        ] },
        { items: [
          "Murid memverifikasi syarat pada masalah baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan syarat kesebangunan segitiga.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "kekongruenan-segitiga",
      title: "Kekongruenan Segitiga",
      desc: "RPP syarat kekongruenan dua segitiga (SSS, SAS, ASA, AAS) dan aplikasinya.",
      icon: CheckCheck,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("kekongruenan segitiga"), DIMENSI.bernalarKritis("kekongruenan segitiga"), DIMENSI.komunikatif],
      relevansi:
        "Kekongruenan dipakai untuk memastikan bagian-bagian rakitan persis sama, misalnya pada produksi massal komponen mesin.",
      strukturMateri:
        "Bertahap dari syarat kekongruenan SSS, SAS, ASA, hingga AAS dan aplikasinya pada pembuktian.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan apakah dua segitiga kongruen dan menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Syarat Kekongruenan SSS, SAS, ASA, AAS, dan Aplikasinya.",
      kemitraan: [
        { title: "PKWU", desc: "Aplikasi kekongruenan pada produksi kerajinan dengan bagian sama." },
        { title: "Informatika", desc: "Konsep kekongruenan pada pencocokan pola digital." },
      ],
      apersepsi:
        "Guru menyajikan dua segitiga yang tampaknya identik dan menanyakan: \"Bagaimana memastikan keduanya benar-benar sama?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang produksi komponen yang harus sama.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi syarat-syarat yang menjamin dua segitiga kongruen.",
          "Guru memberi pertanyaan pemandu menuju empat syarat kekongruenan.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan kesimpulannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan syarat kekongruenan segitiga.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
  ],
};
