import { Crosshair, MapPin, Move3d } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menggunakan sistem koordinat Kartesius dalam memodelkan dan menyelesaikan masalah geometri.";

export const koordinatCartesius: MateriCatalogEntry = {
  slug: "koordinat-cartesius",
  title: "Koordinat Kartesius",
  shortTitle: "Koordinat Kartesius",
  icon: Crosshair,
  intro: "Pilih sub-topik koordinat Kartesius untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.cyan,
  subMateri: [
    {
      slug: "sistem-koordinat",
      title: "Sistem Koordinat",
      desc: "RPP pengenalan sistem koordinat Kartesius dan posisi titik di kuadran.",
      icon: Crosshair,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("sistem koordinat"), DIMENSI.bernalarKritis("sistem koordinat"), DIMENSI.komunikatif],
      relevansi:
        "Sistem koordinat dipakai pada peta digital, GPS, denah ruangan, dan grafik pada presentasi data.",
      strukturMateri:
        "Bertahap dari sumbu x dan y, ke titik asal, kuadran, hingga membaca dan menulis koordinat titik.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat membaca dan menentukan posisi titik pada bidang koordinat Kartesius.",
      topikPembelajaran: "Sumbu Koordinat, Titik Asal, Kuadran, dan Posisi Titik.",
      kemitraan: [
        { title: "IPS", desc: "Membaca peta dengan sistem koordinat." },
        { title: "Informatika", desc: "Posisi piksel pada layar komputer." },
      ],
      apersepsi:
        "Guru menampilkan denah sekolah berbentuk grid dan menanyakan letak ruang kelas tertentu menggunakan koordinat.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang denah sekolah dengan grid koordinat.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi cara menulis koordinat titik dan menentukan kuadrannya.",
          "Guru memberi pertanyaan pemandu menuju aturan penulisan koordinat.",
        ] },
        { items: [
          "Setiap kelompok menyajikan koordinat tempat-tempat di denah.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan aturan koordinat dan kuadran.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "posisi-titik-thd-sumbu",
      title: "Posisi Titik terhadap Sumbu",
      desc: "RPP menentukan jarak titik terhadap sumbu x dan sumbu y.",
      icon: MapPin,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("posisi titik thd sumbu"), DIMENSI.mandiri, DIMENSI.kreatif("representasi posisi")],
      relevansi:
        "Konsep jarak titik terhadap sumbu dipakai pada penentuan ketinggian dari permukaan tanah, jarak ke jalan utama, dan navigasi.",
      strukturMateri:
        "Bertahap dari membaca koordinat titik, menentukan jarak titik ke sumbu x, hingga jarak titik ke sumbu y.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan jarak titik terhadap sumbu x dan sumbu y pada bidang koordinat.",
      topikPembelajaran: "Jarak Titik ke Sumbu X, Jarak Titik ke Sumbu Y.",
      kemitraan: [
        { title: "IPA", desc: "Konsep ketinggian benda dari permukaan tanah." },
        { title: "Geografi", desc: "Konsep garis lintang dan bujur sebagai analogi koordinat." },
      ],
      apersepsi:
        "Guru menyajikan beberapa titik pada bidang koordinat dan menanyakan: \"Berapa jarak titik (3, 4) ke sumbu x?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa titik pada bidang koordinat.",
          "Murid mencatat pertanyaan tentang jarak titik ke sumbu.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana jarak titik ke sumbu x dan sumbu y?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mengukur jarak beberapa titik ke kedua sumbu.",
          "Murid mencatat hasil dan pola.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan jarak titik (x, y) ke sumbu x adalah |y| dan ke sumbu y adalah |x|.",
        ] },
        { items: [
          "Murid memverifikasi pada titik baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan rumus jarak titik ke sumbu.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "posisi-titik-thd-garis",
      title: "Posisi Titik terhadap Garis",
      desc: "RPP menentukan posisi titik terhadap garis sejajar atau tegak lurus sumbu.",
      icon: Move3d,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("posisi titik thd garis"), DIMENSI.bernalarKritis("posisi titik thd garis"), DIMENSI.komunikatif],
      relevansi:
        "Konsep posisi titik terhadap garis dipakai pada penataan letak benda relatif terhadap garis batas, jalur kendaraan, atau patokan tertentu.",
      strukturMateri:
        "Bertahap dari posisi titik terhadap garis sejajar sumbu x dan y, ke garis yang melalui dua titik, hingga aplikasi.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan posisi suatu titik terhadap garis pada bidang koordinat.",
      topikPembelajaran: "Posisi Titik terhadap Garis Sejajar Sumbu, Garis Melalui Dua Titik, dan Aplikasi.",
      kemitraan: [
        { title: "Geografi", desc: "Posisi suatu wilayah terhadap garis khatulistiwa." },
        { title: "PJOK", desc: "Posisi pemain terhadap garis lapangan dalam olahraga." },
      ],
      apersepsi:
        "Guru menampilkan denah lapangan dengan garis pembatas dan menanyakan posisi pemain terhadap garis tersebut.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang denah lapangan.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi posisi titik terhadap berbagai garis.",
          "Guru memberi pertanyaan pemandu menuju klasifikasi posisi titik.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan kesimpulannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan strategi menentukan posisi titik terhadap garis.",
          "Murid merefleksikan kekuatan kolaborasi.",
        ] },
      ],
    },
  ],
};
