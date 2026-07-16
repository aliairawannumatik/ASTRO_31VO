import { Move, FlipHorizontal, RotateCw, ZoomIn } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menggunakan transformasi geometri (translasi, refleksi, rotasi, dan dilatasi) untuk menyelesaikan masalah geometri pada bidang koordinat.";

export const transformasiGeometri: MateriCatalogEntry = {
  slug: "transformasi-geometri",
  title: "Transformasi Geometri",
  shortTitle: "Transformasi Geometri",
  icon: Move,
  intro: "Pilih sub-topik transformasi geometri untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.cyan,
  subMateri: [
    {
      slug: "translasi",
      title: "Translasi (Pergeseran)",
      desc: "RPP konsep translasi dan menentukan bayangan titik atau bangun terhadap translasi tertentu.",
      icon: Move,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("translasi"), DIMENSI.bernalarKritis("translasi"), DIMENSI.komunikatif],
      relevansi:
        "Translasi tampak pada gerakan elevator, gerakan lurus kendaraan, dan animasi grafis komputer.",
      strukturMateri:
        "Bertahap dari konsep translasi sebagai pergeseran, ke notasi (a, b), hingga menentukan bayangan titik (x, y) → (x+a, y+b).",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan bayangan titik atau bangun datar terhadap translasi tertentu.",
      topikPembelajaran: "Konsep Translasi, Notasi (a, b), dan Bayangan Titik.",
      kemitraan: [
        { title: "Informatika", desc: "Konsep translasi pada animasi grafis komputer." },
        { title: "PJOK", desc: "Konsep translasi pada gerakan lurus dalam olahraga." },
      ],
      apersepsi:
        "Guru menyajikan: \"Sebuah elevator naik 5 lantai. Bagaimana memodelkan perpindahannya secara matematis?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang gerakan elevator atau pergeseran benda.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi cara menulis translasi sebagai pasangan bilangan.",
          "Guru memberi pertanyaan pemandu menuju rumus bayangan (x+a, y+b).",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan rumusnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus translasi.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "refleksi",
      title: "Refleksi (Pencerminan)",
      desc: "RPP konsep refleksi terhadap sumbu x, sumbu y, garis y = x, dan titik asal.",
      icon: FlipHorizontal,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("refleksi"), DIMENSI.mandiri, DIMENSI.kreatif("simetri")],
      relevansi:
        "Refleksi tampak pada bayangan di cermin, motif simetris pada batik, dan rancangan logo.",
      strukturMateri:
        "Bertahap dari refleksi terhadap sumbu x, sumbu y, garis y = x, garis y = -x, dan titik asal.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan bayangan titik atau bangun datar terhadap pencerminan tertentu.",
      topikPembelajaran: "Refleksi terhadap Sumbu X, Sumbu Y, Garis y = x, y = -x, dan Titik Asal.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Konsep simetri pada motif batik dan tenun nusantara." },
        { title: "IPA", desc: "Aplikasi refleksi pada cermin datar (optik)." },
      ],
      apersepsi:
        "Guru menampilkan motif batik simetris dan menanyakan: \"Sumbu apa yang menjadi cermin pada motif ini?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa motif simetris dan ilustrasi cermin.",
          "Murid mencatat pertanyaan tentang aturan refleksi.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana koordinat berubah saat dicerminkan?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba mencerminkan beberapa titik terhadap berbagai garis.",
          "Murid mencatat hasil.",
        ] },
        { items: [
          "Murid berdiskusi menyusun aturan refleksi terhadap berbagai garis cermin.",
        ] },
        { items: [
          "Murid memverifikasi aturan pada bangun baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan aturan-aturan refleksi.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "rotasi",
      title: "Rotasi (Perputaran)",
      desc: "RPP konsep rotasi terhadap titik pusat dan menentukan bayangan titik.",
      icon: RotateCw,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("rotasi"), DIMENSI.bernalarKritis("rotasi"), DIMENSI.komunikatif],
      relevansi:
        "Rotasi tampak pada perputaran roda kendaraan, jarum jam, dan rotasi gambar pada aplikasi desain.",
      strukturMateri:
        "Bertahap dari konsep rotasi 90°, 180°, dan 270° (searah dan berlawanan jarum jam), terhadap titik asal.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan bayangan titik terhadap rotasi 90°, 180°, atau 270°.",
      topikPembelajaran: "Rotasi 90°, 180°, dan 270° terhadap Titik Asal.",
      kemitraan: [
        { title: "Informatika", desc: "Aplikasi rotasi pada manipulasi gambar digital." },
        { title: "Seni Budaya", desc: "Pola rotasi pada motif mandala dan ornamen." },
      ],
      apersepsi:
        "Guru menampilkan jarum jam pada pukul 12, 3, 6, 9 dan menanyakan: \"Berapa derajat jarum jam berputar dari pukul 12 ke 3?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang perputaran benda di sekitar.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi cara menentukan bayangan titik terhadap rotasi.",
          "Guru memberi pertanyaan pemandu menuju aturan rotasi.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan hasil rotasinya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan aturan rotasi 90°, 180°, dan 270°.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "dilatasi",
      title: "Dilatasi (Perkalian)",
      desc: "RPP konsep dilatasi terhadap titik pusat dengan faktor skala k.",
      icon: ZoomIn,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("dilatasi"), DIMENSI.mandiri, DIMENSI.kreatif("transformasi")],
      relevansi:
        "Dilatasi tampak pada zoom in/out pada peta digital, perbesaran foto, dan model arsitektur dengan skala.",
      strukturMateri:
        "Bertahap dari konsep dilatasi, ke faktor skala (k > 1, 0 < k < 1, k < 0), hingga menentukan bayangan titik (x, y) → (kx, ky).",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan bayangan titik atau bangun terhadap dilatasi dengan faktor skala k.",
      topikPembelajaran: "Konsep Dilatasi, Faktor Skala, dan Bayangan Titik (kx, ky).",
      kemitraan: [
        { title: "Informatika", desc: "Aplikasi dilatasi pada zoom peta digital dan editor foto." },
        { title: "Seni Budaya", desc: "Aplikasi perbesaran/perkecilan pada karya seni." },
      ],
      apersepsi:
        "Guru menampilkan dua foto sama dengan ukuran berbeda dan menanyakan: \"Faktor skala apa yang dipakai?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa contoh dilatasi pada peta atau foto.",
          "Murid mencatat pertanyaan tentang aturan perubahan koordinat.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana koordinat berubah saat didilatasi dengan faktor k?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba mendilatasi beberapa titik dengan faktor skala berbeda.",
          "Murid mencatat hasilnya.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan aturan dilatasi (x, y) → (kx, ky).",
        ] },
        { items: [
          "Murid memverifikasi aturan pada bangun baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan aturan dilatasi.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
  ],
};
