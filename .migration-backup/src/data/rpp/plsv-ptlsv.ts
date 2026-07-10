import { Equal, Sigma, ChevronsRight, Lightbulb } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Memodelkan dan menyelesaikan persamaan dan pertidaksamaan linear satu variabel serta menggunakannya untuk menyelesaikan masalah kontekstual.";

export const plsvPtlsv: MateriCatalogEntry = {
  slug: "plsv-ptlsv",
  title: "Persamaan dan Pertidaksamaan Linear Satu Variabel",
  shortTitle: "PLSV - PtLSV",
  icon: Equal,
  intro: "Pilih sub-topik PLSV/PtLSV untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.cyan,
  subMateri: [
    {
      slug: "konsep-plsv",
      title: "Konsep Persamaan Linear Satu Variabel",
      desc: "RPP pengenalan konsep PLSV, kalimat terbuka, dan ciri-ciri PLSV.",
      icon: Equal,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("PLSV"), DIMENSI.bernalarKritis("PLSV"), DIMENSI.komunikatif],
      relevansi:
        "PLSV dipakai untuk memodelkan masalah sehari-hari, misalnya menentukan jumlah barang yang dibeli ketika total harga diketahui.",
      strukturMateri: "Bertahap dari kalimat terbuka, persamaan, hingga ciri-ciri PLSV dan contohnya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat membedakan kalimat terbuka dan persamaan, serta mengenali ciri-ciri PLSV dari berbagai contoh.",
      topikPembelajaran: "Kalimat Terbuka, Persamaan, Ciri-ciri PLSV, dan Contoh PLSV.",
      kemitraan: [
        { title: "IPS", desc: "Memodelkan masalah ekonomi sederhana ke dalam PLSV." },
        { title: "Bahasa Indonesia", desc: "Menerjemahkan kalimat narasi ke kalimat matematika." },
      ],
      apersepsi:
        "Guru menyajikan masalah: \"Tiga kali umurku ditambah lima sama dengan dua puluh. Berapa umurku?\" untuk memantik bentuk persamaan.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang umur dan total belanja.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen dan membagi peran.",
        ] },
        { items: [
          "Murid menerjemahkan masalah ke bentuk persamaan dan mengidentifikasi unsur-unsurnya.",
          "Guru memberi pertanyaan pemandu menuju ciri-ciri PLSV.",
        ] },
        { items: [
          "Setiap kelompok menyajikan persamaan yang disusun dan ciri-ciri PLSV yang ditemukan.",
          "Kelompok lain memberi tanggapan dan pertanyaan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan pengertian dan ciri-ciri PLSV.",
          "Murid merefleksikan proses pemodelan masalah ke bentuk PLSV.",
        ] },
      ],
    },
    {
      slug: "penyelesaian-plsv",
      title: "Penyelesaian PLSV",
      desc: "RPP teknik menyelesaikan PLSV menggunakan sifat kesetaraan persamaan (operasi pada kedua ruas).",
      icon: Sigma,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("penyelesaian PLSV"), DIMENSI.mandiri, DIMENSI.kreatif("strategi penyelesaian")],
      relevansi:
        "Penyelesaian PLSV dipakai dalam menentukan nilai variabel pada masalah kontekstual seperti menentukan harga satuan barang atau lama waktu kegiatan.",
      strukturMateri:
        "Bertahap dari sifat kesetaraan persamaan, ke teknik penjumlahan/pengurangan kedua ruas, hingga perkalian/pembagian kedua ruas.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan penyelesaian PLSV menggunakan sifat kesetaraan persamaan dan menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Sifat Kesetaraan Persamaan, Teknik Penyelesaian PLSV, Aplikasi PLSV.",
      kemitraan: [
        { title: "IPS", desc: "Menentukan harga satuan barang dari total belanja." },
        { title: "IPA", desc: "Menyelesaikan rumus fisika sederhana untuk variabel tertentu." },
      ],
      apersepsi:
        "Guru menyajikan timbangan tidak setimbang dengan beban yang harus disamakan, untuk memantik konsep menjaga kesetaraan kedua ruas persamaan.",
      langkahInti: [
        { items: [
          "Guru menampilkan ilustrasi neraca dengan beban yang berbeda di kedua sisi.",
          "Murid mencatat pertanyaan tentang cara menyetimbangkan kedua ruas.",
        ] },
        { items: [
          "Murid merumuskan masalah: \"Operasi apa yang menjaga keseimbangan persamaan?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba menyelesaikan beberapa PLSV menggunakan operasi pada kedua ruas.",
          "Murid mencatat strategi dan hasilnya.",
        ] },
        { items: [
          "Murid berdiskusi pola dan menyusun langkah-langkah umum penyelesaian PLSV.",
        ] },
        { items: [
          "Murid memverifikasi langkah-langkah pada soal kontekstual baru.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan aturan umum penyelesaian PLSV.",
          "Murid menulis refleksi atas strategi paling efisien.",
        ] },
      ],
    },
    {
      slug: "konsep-ptlsv",
      title: "Konsep Pertidaksamaan Linear Satu Variabel",
      desc: "RPP pengenalan konsep PtLSV beserta lambang pertidaksamaan dan ciri-cirinya.",
      icon: ChevronsRight,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("PtLSV"), DIMENSI.bernalarKritis("PtLSV"), DIMENSI.komunikatif],
      relevansi:
        "PtLSV dipakai untuk memodelkan situasi dengan batas, misalnya batas berat penumpang lift atau batas anggaran belanja.",
      strukturMateri:
        "Bertahap dari lambang pertidaksamaan (<, ≤, >, ≥), ke ciri-ciri PtLSV, hingga contoh-contoh kontekstual.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengenali ciri-ciri PtLSV dan menerjemahkan masalah kontekstual ke dalam bentuk PtLSV.",
      topikPembelajaran: "Lambang Pertidaksamaan, Ciri-ciri PtLSV, Pemodelan Masalah ke PtLSV.",
      kemitraan: [
        { title: "IPS", desc: "Memodelkan batas anggaran belanja sebagai PtLSV." },
        { title: "PJOK", desc: "Menerjemahkan batas waktu maksimal kegiatan ke PtLSV." },
      ],
      apersepsi:
        "Guru menyajikan masalah: \"Sebuah lift maksimal mengangkut beban 600 kg. Jika berat rata-rata seseorang 60 kg, berapa banyak orang maksimal yang boleh naik?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang batas anggaran atau batas beban.",
          "Murid mencatat informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid menerjemahkan masalah ke bentuk pertidaksamaan dan menentukan lambang yang sesuai.",
          "Guru memberi pertanyaan pemandu menuju ciri-ciri PtLSV.",
        ] },
        { items: [
          "Setiap kelompok menyajikan PtLSV yang disusun dan menjelaskan maknanya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan ciri-ciri PtLSV.",
          "Murid merefleksikan proses pemodelan masalah dengan batasan.",
        ] },
      ],
    },
    {
      slug: "penyelesaian-ptlsv",
      title: "Penyelesaian PtLSV",
      desc: "RPP teknik menyelesaikan PtLSV serta menyajikan hasilnya pada garis bilangan.",
      icon: Lightbulb,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("penyelesaian PtLSV"), DIMENSI.mandiri, DIMENSI.kreatif("representasi PtLSV")],
      relevansi:
        "Penyelesaian PtLSV dipakai untuk menentukan rentang nilai variabel pada masalah dengan batas, seperti menentukan jumlah maksimal barang yang dapat dibeli.",
      strukturMateri:
        "Bertahap dari aturan pengoperasian dengan bilangan positif, perubahan tanda saat dikalikan/dibagi bilangan negatif, hingga representasi pada garis bilangan.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan PtLSV dan menyajikan himpunan penyelesaiannya pada garis bilangan.",
      topikPembelajaran: "Aturan Penyelesaian PtLSV, Perubahan Tanda Pertidaksamaan, Representasi pada Garis Bilangan.",
      kemitraan: [
        { title: "IPS", desc: "Menentukan rentang anggaran maksimal pengeluaran." },
        { title: "IPA", desc: "Menentukan rentang nilai variabel pada rumus fisika." },
      ],
      apersepsi:
        "Guru memantik dengan pertanyaan: \"Apa yang terjadi jika kedua ruas pertidaksamaan dikalikan -1? Apakah tandanya tetap sama?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa pertidaksamaan dan menanyakan strategi penyelesaiannya.",
          "Murid mencatat pertanyaan dan dugaan.",
        ] },
        { items: [
          "Murid merumuskan: \"Apakah aturan operasi PtLSV sama dengan PLSV?\"",
          "Murid menulis hipotesis pada LKPD.",
        ] },
        { items: [
          "Murid mencoba operasi penjumlahan, pengurangan, perkalian/pembagian dengan bilangan positif dan negatif pada PtLSV.",
          "Murid mencatat pola hasil yang muncul.",
        ] },
        { items: [
          "Murid berdiskusi menyusun aturan penyelesaian PtLSV termasuk perubahan tanda.",
        ] },
        { items: [
          "Murid memverifikasi aturan pada soal baru dan menyajikan hasil pada garis bilangan.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru merumuskan aturan umum penyelesaian PtLSV.",
          "Murid menulis refleksi tentang pengalaman penemuan.",
        ] },
      ],
    },
  ],
};
