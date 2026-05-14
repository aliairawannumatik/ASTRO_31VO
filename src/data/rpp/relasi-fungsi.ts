import { Network, FunctionSquare, Calculator, LineChart } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Mengenali, memodelkan, dan menggunakan relasi dan fungsi linear dalam menyelesaikan masalah kontekstual.";

export const relasiFungsi: MateriCatalogEntry = {
  slug: "relasi-fungsi",
  title: "Relasi dan Fungsi",
  shortTitle: "Relasi & Fungsi",
  icon: Network,
  intro: "Pilih sub-topik relasi dan fungsi untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.violet,
  subMateri: [
    {
      slug: "konsep-relasi",
      title: "Konsep Relasi",
      desc: "RPP pengenalan konsep relasi antara dua himpunan dan cara menyatakannya.",
      icon: Network,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("relasi"), DIMENSI.bernalarKritis("relasi"), DIMENSI.komunikatif],
      relevansi:
        "Konsep relasi tampak pada hubungan murid dengan jadwal kelas, hubungan barang dengan harga, dan menu dengan kategori pesanan.",
      strukturMateri:
        "Bertahap dari pengertian relasi, ke cara menyatakannya (diagram panah, himpunan pasangan berurutan, diagram Kartesius).",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyatakan relasi antara dua himpunan dengan tiga cara berbeda.",
      topikPembelajaran: "Pengertian Relasi, Diagram Panah, Himpunan Pasangan Berurutan, Diagram Kartesius.",
      kemitraan: [
        { title: "Bahasa Indonesia", desc: "Menerjemahkan kalimat menjadi relasi antar himpunan." },
        { title: "IPS", desc: "Hubungan kategori barang dengan harga sebagai relasi." },
      ],
      apersepsi:
        "Guru menyajikan: \"Andi suka bakso, Budi suka mie, Citra suka bakso. Bagaimana menyatakan hubungan ini?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang hubungan murid dan kesukaan makanannya.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi tiga cara menyatakan relasi.",
          "Guru memberi pertanyaan pemandu menuju kelebihan dan keterbatasan tiap cara.",
        ] },
        { items: [
          "Setiap kelompok menyajikan ketiga representasi relasi.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan konsep relasi dan cara menyatakannya.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "konsep-fungsi",
      title: "Konsep Fungsi",
      desc: "RPP pengenalan konsep fungsi sebagai relasi khusus serta domain, kodomain, dan range.",
      icon: FunctionSquare,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("fungsi"), DIMENSI.mandiri, DIMENSI.kreatif("representasi fungsi")],
      relevansi:
        "Fungsi tampak pada tarif parkir berdasarkan lama waktu, biaya pengiriman berdasarkan berat barang, dan nilai ujian berdasarkan jumlah benar.",
      strukturMateri:
        "Bertahap dari ciri relasi yang merupakan fungsi, ke pengertian domain, kodomain, dan range.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat membedakan fungsi dan bukan fungsi serta menentukan domain, kodomain, dan range.",
      topikPembelajaran: "Pengertian Fungsi, Domain, Kodomain, dan Range.",
      kemitraan: [
        { title: "IPS", desc: "Tarif parkir berdasarkan lama waktu sebagai fungsi." },
        { title: "Informatika", desc: "Konsep input-output pada fungsi pemrograman." },
      ],
      apersepsi:
        "Guru menampilkan tabel tarif parkir dan menanyakan: \"Apakah satu lama parkir punya satu tarif yang pasti?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa contoh dan bukan contoh fungsi.",
          "Murid mencatat pertanyaan tentang ciri fungsi.",
        ] },
        { items: [
          "Murid merumuskan: \"Apa ciri relasi yang merupakan fungsi?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid memeriksa beberapa relasi: apakah memenuhi syarat fungsi?",
          "Murid mencatat hasilnya.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan ciri fungsi: setiap anggota domain memiliki tepat satu pasangan di kodomain.",
        ] },
        { items: [
          "Murid memverifikasi pada relasi baru dan menentukan domain, kodomain, range.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan pengertian fungsi.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "notasi-nilai-fungsi",
      title: "Notasi dan Nilai Fungsi",
      desc: "RPP notasi fungsi f(x) serta menentukan nilai fungsi untuk berbagai input.",
      icon: Calculator,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("nilai fungsi"), DIMENSI.bernalarKritis("nilai fungsi"), DIMENSI.komunikatif],
      relevansi:
        "Notasi fungsi dipakai untuk meringkas hubungan input-output, misalnya rumus biaya kirim sebagai fungsi berat.",
      strukturMateri:
        "Bertahap dari notasi f(x), ke menentukan nilai fungsi, hingga membuat tabel nilai fungsi.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menggunakan notasi fungsi dan menentukan nilai fungsi untuk berbagai input.",
      topikPembelajaran: "Notasi Fungsi f(x), Menentukan Nilai Fungsi, dan Tabel Fungsi.",
      kemitraan: [
        { title: "IPS", desc: "Rumus biaya kirim berdasarkan berat sebagai fungsi." },
        { title: "Informatika", desc: "Penggunaan fungsi pada bahasa pemrograman dasar." },
      ],
      apersepsi:
        "Guru menyajikan: \"f(x) = 2x + 3. Berapa f(5)? Apa artinya?\" untuk memantik konsep nilai fungsi.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang biaya kirim sebagai fungsi berat.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi cara menentukan nilai fungsi untuk berbagai input.",
          "Guru memberi pertanyaan pemandu menuju penggunaan tabel nilai fungsi.",
        ] },
        { items: [
          "Setiap kelompok menyajikan tabel nilai fungsi dan strategi perhitungan.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan notasi dan strategi menentukan nilai fungsi.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "grafik-fungsi",
      title: "Grafik Fungsi",
      desc: "RPP menggambar grafik fungsi pada bidang koordinat Kartesius dan membaca informasinya.",
      icon: LineChart,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("grafik fungsi"), DIMENSI.mandiri, DIMENSI.kreatif("visualisasi data")],
      relevansi:
        "Grafik fungsi dipakai untuk memvisualisasikan hubungan dua variabel, misalnya grafik suhu, harga saham, atau tinggi bola.",
      strukturMateri:
        "Bertahap dari membuat tabel nilai fungsi, ke memplot titik, hingga menggambar grafik fungsi linear.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menggambar grafik fungsi linear dan membaca informasi dari grafik tersebut.",
      topikPembelajaran: "Membuat Grafik Fungsi Linear dan Membaca Grafik.",
      kemitraan: [
        { title: "IPA", desc: "Grafik perubahan suhu terhadap waktu." },
        { title: "IPS", desc: "Grafik harga barang terhadap jumlah." },
      ],
      apersepsi:
        "Guru menampilkan grafik suhu harian dan menanyakan: \"Bagaimana cara membuat grafik seperti ini dari sebuah fungsi?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa grafik fungsi linear.",
          "Murid mencatat pertanyaan tentang cara membuatnya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana langkah-langkah menggambar grafik fungsi?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba membuat tabel nilai fungsi dan memplot titiknya.",
          "Murid mencatat strategi tiap langkah.",
        ] },
        { items: [
          "Murid berdiskusi menyusun langkah-langkah menggambar grafik.",
        ] },
        { items: [
          "Murid memverifikasi langkah pada fungsi linear baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan langkah menggambar grafik fungsi linear.",
          "Murid menulis refleksi atas pengalaman.",
        ] },
      ],
    },
  ],
};
