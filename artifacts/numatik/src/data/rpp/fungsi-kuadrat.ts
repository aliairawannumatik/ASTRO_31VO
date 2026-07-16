import { Activity, LineChart, Crosshair, Lightbulb } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Mengenali, memodelkan, dan menyelesaikan masalah yang berkaitan dengan fungsi kuadrat dan grafiknya.";

export const fungsiKuadrat: MateriCatalogEntry = {
  slug: "fungsi-kuadrat",
  title: "Fungsi Kuadrat",
  shortTitle: "Fungsi Kuadrat",
  icon: Activity,
  intro: "Pilih sub-topik fungsi kuadrat untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.orange,
  subMateri: [
    {
      slug: "konsep-fungsi-kuadrat",
      title: "Konsep Fungsi Kuadrat",
      desc: "RPP pengenalan konsep fungsi kuadrat dan ciri-cirinya.",
      icon: Activity,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("fungsi kuadrat"), DIMENSI.mandiri, DIMENSI.kreatif("representasi fungsi")],
      relevansi:
        "Fungsi kuadrat memodelkan lintasan parabola, hubungan biaya-kuantitas pada usaha, dan banyak fenomena alam lainnya.",
      strukturMateri:
        "Bertahap dari bentuk umum f(x) = ax² + bx + c, ke ciri-ciri fungsi kuadrat, hingga membedakannya dengan fungsi lain.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengenali fungsi kuadrat dan menentukan koefisien-koefisiennya.",
      topikPembelajaran: "Bentuk Umum Fungsi Kuadrat, Koefisien, dan Ciri-cirinya.",
      kemitraan: [
        { title: "IPA", desc: "Pemodelan lintasan parabola dengan fungsi kuadrat." },
        { title: "IPS", desc: "Pemodelan hubungan biaya dan kuantitas dalam ekonomi." },
      ],
      apersepsi:
        "Guru menampilkan lintasan air mancur dan menanyakan: \"Bagaimana memodelkan tinggi air sebagai fungsi jarak horizontal?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa contoh lintasan parabola dan grafik fungsi kuadrat.",
          "Murid mencatat pertanyaan tentang ciri fungsi kuadrat.",
        ] },
        { items: [
          "Murid merumuskan: \"Apa ciri sebuah fungsi disebut kuadrat?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba mengidentifikasi beberapa fungsi sebagai kuadrat atau bukan.",
          "Murid mencatat strategi.",
        ] },
        { items: [
          "Murid berdiskusi menyusun pengertian dan ciri-ciri fungsi kuadrat.",
        ] },
        { items: [
          "Murid memverifikasi pengertian pada fungsi baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan konsep fungsi kuadrat.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "grafik-fungsi-kuadrat",
      title: "Grafik Fungsi Kuadrat",
      desc: "RPP menggambar grafik fungsi kuadrat dan mengidentifikasi unsurnya.",
      icon: LineChart,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("grafik fungsi kuadrat"), DIMENSI.bernalarKritis("grafik fungsi kuadrat"), DIMENSI.komunikatif],
      relevansi:
        "Grafik fungsi kuadrat (parabola) tampak pada lintasan benda dilempar, antena parabola, dan rancangan jembatan lengkung.",
      strukturMateri:
        "Bertahap dari membuat tabel nilai fungsi, ke memplot titik, hingga menggambar parabola dengan unsur-unsurnya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menggambar grafik fungsi kuadrat dan mengidentifikasi titik puncak, sumbu simetri, serta titik potong.",
      topikPembelajaran: "Tabel Nilai Fungsi, Memplot Titik, dan Menggambar Parabola.",
      kemitraan: [
        { title: "IPA", desc: "Visualisasi lintasan benda dengan grafik fungsi kuadrat." },
        { title: "Seni Budaya", desc: "Bentuk parabola pada karya seni rupa dan arsitektur." },
      ],
      apersepsi:
        "Guru menyajikan: \"f(x) = x² - 4x + 3. Bagaimana cara membuat grafiknya?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik membuat grafik fungsi kuadrat.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi langkah-langkah membuat tabel nilai dan memplot titik.",
          "Guru memberi pertanyaan pemandu menuju identifikasi unsur grafik.",
        ] },
        { items: [
          "Setiap kelompok menyajikan grafik dan unsur-unsurnya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan langkah menggambar grafik fungsi kuadrat.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "sumbu-simetri-titik-puncak",
      title: "Sumbu Simetri dan Titik Puncak",
      desc: "RPP menentukan sumbu simetri dan titik puncak fungsi kuadrat.",
      icon: Crosshair,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("titik puncak"), DIMENSI.mandiri, DIMENSI.kreatif("strategi parabola")],
      relevansi:
        "Sumbu simetri dan titik puncak parabola dipakai untuk menentukan nilai maksimum/minimum dalam masalah optimasi.",
      strukturMateri:
        "Bertahap dari konsep sumbu simetri x = -b/(2a), ke titik puncak, hingga menentukan nilai maksimum/minimum.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan sumbu simetri, titik puncak, dan nilai ekstrem fungsi kuadrat.",
      topikPembelajaran: "Sumbu Simetri, Titik Puncak, dan Nilai Maksimum/Minimum.",
      kemitraan: [
        { title: "IPA", desc: "Aplikasi titik puncak pada tinggi maksimum lintasan parabola." },
        { title: "PKWU", desc: "Aplikasi optimasi pada perancangan kerajinan." },
      ],
      apersepsi:
        "Guru menyajikan: \"Suatu bola dilempar mengikuti h(t) = -5t² + 20t. Berapa tinggi maksimum bola?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa parabola dengan titik puncak yang berbeda.",
          "Murid mencatat pertanyaan tentang cara menentukannya.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana rumus sumbu simetri dan titik puncak?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba mencari titik puncak pada beberapa fungsi kuadrat.",
          "Murid mencatat hasil dan pola.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan x = -b/(2a) dan titik puncak.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada fungsi baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan rumus sumbu simetri dan titik puncak.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "aplikasi-fungsi-kuadrat",
      title: "Aplikasi Fungsi Kuadrat",
      desc: "RPP penerapan fungsi kuadrat pada masalah kontekstual termasuk masalah optimasi.",
      icon: Lightbulb,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("aplikasi fungsi kuadrat"), DIMENSI.bernalarKritis("aplikasi fungsi kuadrat"), DIMENSI.komunikatif],
      relevansi:
        "Aplikasi fungsi kuadrat dipakai pada perancangan jembatan lengkung, optimasi luas, lintasan benda, dan analisis ekonomi.",
      strukturMateri:
        "Bertahap dari memodelkan masalah ke fungsi kuadrat, ke menentukan nilai ekstrem, hingga menafsirkan hasil.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menerapkan fungsi kuadrat untuk menyelesaikan masalah kontekstual termasuk optimasi.",
      topikPembelajaran: "Pemodelan dengan Fungsi Kuadrat dan Aplikasi Optimasi.",
      kemitraan: [
        { title: "IPS", desc: "Studi kasus optimasi laba dalam ekonomi sederhana." },
        { title: "Seni Budaya", desc: "Pemodelan rancangan jembatan lengkung." },
      ],
      apersepsi:
        "Guru menyajikan: \"Sebuah peternak ingin membuat kandang persegi panjang dengan kawat 40 m. Berapa ukuran agar luasnya maksimum?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik optimasi luas atau lintasan benda.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi pemodelan ke fungsi kuadrat dan mencari titik puncak.",
          "Guru memberi pertanyaan pemandu menuju penafsiran hasil.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi pemodelan dan hasil optimasinya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan strategi aplikasi fungsi kuadrat.",
          "Murid merefleksikan kekuatan kolaborasi.",
        ] },
      ],
    },
  ],
};
