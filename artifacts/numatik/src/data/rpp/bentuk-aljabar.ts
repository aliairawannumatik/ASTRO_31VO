import { Variable, Plus, X, Divide, Minimize2 } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Mengenali, memodelkan, dan menyelesaikan masalah aljabar dengan bentuk linear dan operasinya, serta menerapkannya untuk menyelesaikan masalah kontekstual.";

export const bentukAljabar: MateriCatalogEntry = {
  slug: "bentuk-aljabar",
  title: "Bentuk Aljabar",
  shortTitle: "Bentuk Aljabar",
  icon: Variable,
  intro: "Pilih sub-topik bentuk aljabar untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.violet,
  subMateri: [
    {
      slug: "pengenalan-bentuk-aljabar",
      title: "Pengenalan Bentuk Aljabar",
      desc: "RPP pengenalan unsur-unsur bentuk aljabar (variabel, koefisien, konstanta, suku, dan suku sejenis).",
      icon: Variable,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("bentuk aljabar"), DIMENSI.bernalarKritis("bentuk aljabar"), DIMENSI.komunikatif],
      relevansi:
        "Bentuk aljabar dipakai untuk memodelkan situasi sehari-hari, misalnya menyatakan harga total beberapa barang, jumlah peserta dalam satu kelompok kelas, atau rumus keliling.",
      strukturMateri:
        "Bertahap dari mengenal variabel dan konstanta, menentukan koefisien dan suku, hingga mengidentifikasi suku-suku sejenis.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengenali unsur-unsur bentuk aljabar (variabel, koefisien, konstanta, suku) dan menyatakan situasi nyata dalam bentuk aljabar.",
      topikPembelajaran: "Variabel, Koefisien, Konstanta, Suku, dan Suku Sejenis pada Bentuk Aljabar.",
      kemitraan: [
        { title: "IPS", desc: "Memodelkan harga total belanja sebagai bentuk aljabar." },
        { title: "Bahasa Indonesia", desc: "Menerjemahkan kalimat narasi ke bentuk aljabar dan sebaliknya." },
      ],
      apersepsi:
        "Guru bertanya: \"Jika satu pensil seharga Rp2.000 dan kamu membeli x pensil, berapa total uang yang harus dibayar? Bagaimana menulisnya secara singkat?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah kontekstual: harga total belanja x buku dan y pensil.",
          "Murid mencatat informasi yang diketahui dan ditanyakan.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, masing-masing membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi cara menulis bentuk aljabar dari masalah dan mengidentifikasi unsur-unsurnya.",
          "Guru memberi pertanyaan pemandu mengenai variabel, koefisien, konstanta, dan suku sejenis.",
        ] },
        { items: [
          "Setiap kelompok menyajikan bentuk aljabar yang dirumuskan beserta unsur-unsurnya.",
          "Kelompok lain mengkritisi dan memberi alternatif representasi.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan pengertian dan unsur bentuk aljabar.",
          "Murid merefleksikan kontribusi anggota dan kekuatan kolaborasi.",
        ] },
      ],
    },
    {
      slug: "penjumlahan-pengurangan-aljabar",
      title: "Penjumlahan dan Pengurangan Bentuk Aljabar",
      desc: "RPP operasi penjumlahan dan pengurangan bentuk aljabar dengan menggabungkan suku-suku sejenis.",
      icon: Plus,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("operasi aljabar"), DIMENSI.mandiri, DIMENSI.kreatif("strategi aljabar")],
      relevansi:
        "Operasi penjumlahan dan pengurangan bentuk aljabar dipakai untuk menggabungkan model matematis dari beberapa keadaan, misalnya menjumlahkan harga beberapa kelompok belanja.",
      strukturMateri:
        "Bertahap dari menggabungkan suku sejenis, ke penjumlahan/pengurangan dua bentuk aljabar, hingga melibatkan tanda kurung.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan penjumlahan dan pengurangan bentuk aljabar dengan menggabungkan suku-suku sejenis.",
      topikPembelajaran: "Suku Sejenis, Penjumlahan dan Pengurangan Bentuk Aljabar, Tanda Kurung.",
      kemitraan: [
        { title: "IPS", desc: "Menggabungkan beberapa kelompok pengeluaran dalam bentuk aljabar." },
        { title: "PJOK", desc: "Total skor permainan dari beberapa babak sebagai bentuk aljabar." },
      ],
      apersepsi:
        "Guru menyajikan: \"Andi punya 3 buku dan 2 pensil. Budi punya 2 buku dan 4 pensil. Berapa total buku dan pensil mereka?\" untuk memantik gagasan menjumlahkan suku sejenis.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa contoh kelompok benda yang dimodelkan dengan bentuk aljabar.",
          "Murid menulis pertanyaan dan dugaan tentang cara menjumlahkannya.",
        ] },
        { items: [
          "Murid merumuskan masalah: \"Bagaimana menjumlahkan 3a + 2b dengan 2a + 4b?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba beberapa pasangan bentuk aljabar dan mencatat hasil.",
          "Murid mengeksplorasi peran tanda kurung pada operasi.",
        ] },
        { items: [
          "Murid berdiskusi pola hasil dan menyusun aturan menggabungkan suku sejenis.",
          "Murid menulis aturan umum pada LKPD.",
        ] },
        { items: [
          "Murid memverifikasi pada soal baru dan membandingkan dengan kelompok lain.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan aturan penjumlahan & pengurangan bentuk aljabar.",
          "Murid menulis refleksi singkat tentang strategi yang paling membantu.",
        ] },
      ],
    },
    {
      slug: "perkalian-aljabar",
      title: "Perkalian Bentuk Aljabar",
      desc: "RPP operasi perkalian bentuk aljabar termasuk perkalian suku tunggal, distributif, dan perkalian dua bentuk aljabar.",
      icon: X,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("perkalian aljabar"), DIMENSI.bernalarKritis("perkalian aljabar"), DIMENSI.komunikatif],
      relevansi:
        "Perkalian bentuk aljabar dipakai untuk memodelkan luas persegi panjang yang sisinya berupa ekspresi aljabar atau total biaya beberapa kelompok belanja.",
      strukturMateri:
        "Bertahap dari perkalian konstanta dengan suku, sifat distributif, hingga perkalian dua bentuk aljabar (misal (a+b)(c+d)).",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan perkalian bentuk aljabar termasuk perkalian dua suku dengan dua suku.",
      topikPembelajaran: "Sifat Distributif, Perkalian Suku Tunggal, Perkalian Dua Bentuk Aljabar.",
      kemitraan: [
        { title: "IPA", desc: "Memodelkan luas bidang dengan sisi berupa bentuk aljabar." },
        { title: "Seni Budaya", desc: "Pola perkalian bentuk aljabar pada motif geometris dekorasi." },
      ],
      apersepsi:
        "Guru menampilkan persegi panjang dengan panjang (x+3) dan lebar (x+2), bertanya: \"Bagaimana menghitung luasnya?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah luas persegi panjang dengan sisi bentuk aljabar.",
          "Murid memahami informasi dari masalah.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran dan menyepakati strategi.",
        ] },
        { items: [
          "Murid mengeksplorasi luas dengan model luas (area model) dan sifat distributif.",
          "Guru memberi pertanyaan pemandu menuju aturan perkalian bentuk aljabar.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi perkalian dan hasilnya.",
          "Kelompok lain memberi tanggapan dan pertanyaan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan aturan perkalian bentuk aljabar.",
          "Murid merefleksikan kekuatan kolaborasi dan strategi paling efisien.",
        ] },
      ],
    },
    {
      slug: "pembagian-aljabar",
      title: "Pembagian Bentuk Aljabar",
      desc: "RPP operasi pembagian bentuk aljabar dengan suku tunggal dan pembagian sederhana.",
      icon: Divide,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("pembagian aljabar"), DIMENSI.mandiri, DIMENSI.kreatif("strategi aljabar")],
      relevansi:
        "Pembagian bentuk aljabar dipakai untuk menentukan satu sisi suatu bidang ketika luas dan sisi lainnya berupa ekspresi aljabar.",
      strukturMateri:
        "Bertahap dari pembagian suku tunggal, ke pembagian bentuk aljabar dengan satu suku, hingga pembagian sederhana dengan dua suku.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyelesaikan pembagian bentuk aljabar dengan satu suku dan pembagian sederhana.",
      topikPembelajaran: "Pembagian Suku Tunggal, Pembagian Bentuk Aljabar dengan Satu Suku.",
      kemitraan: [
        { title: "IPA", desc: "Menentukan rumus tinggi dari rumus volume bangun ruang." },
        { title: "PKWU", desc: "Menentukan banyak porsi dari total bahan dalam bentuk aljabar." },
      ],
      apersepsi:
        "Guru menyajikan: \"Luas persegi panjang adalah 6x² satuan luas dan panjangnya 2x. Berapa lebarnya?\" untuk memantik penemuan strategi pembagian aljabar.",
      langkahInti: [
        { items: [
          "Guru menampilkan masalah luas dan sisi persegi panjang dalam bentuk aljabar.",
          "Murid mencatat pertanyaan dan dugaan strategi.",
        ] },
        { items: [
          "Murid merumuskan masalah: \"Bagaimana membagi bentuk aljabar dengan suku tunggal?\"",
          "Murid menulis hipotesis pada LKPD.",
        ] },
        { items: [
          "Murid mencoba beberapa pasangan pembagian bentuk aljabar.",
          "Murid mencatat hasil dan pola yang muncul.",
        ] },
        { items: [
          "Murid mendiskusikan pola dan menyusun aturan pembagian bentuk aljabar.",
        ] },
        { items: [
          "Murid memverifikasi aturan pada soal-soal baru.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan aturan umum pembagian bentuk aljabar.",
          "Murid menulis refleksi atas strategi yang paling efektif.",
        ] },
      ],
    },
    {
      slug: "penyederhanaan-aljabar",
      title: "Penyederhanaan Bentuk Aljabar",
      desc: "RPP penyederhanaan bentuk aljabar dan operasi pecahan bentuk aljabar sederhana.",
      icon: Minimize2,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("penyederhanaan aljabar"), DIMENSI.bernalarKritis("penyederhanaan aljabar"), DIMENSI.komunikatif],
      relevansi:
        "Penyederhanaan bentuk aljabar dipakai untuk membuat ekspresi matematika lebih mudah diolah, dipakai pada perhitungan rumus fisika, ekonomi, dan teknik.",
      strukturMateri:
        "Bertahap dari menggabungkan suku sejenis, faktorisasi sederhana, hingga menyederhanakan pecahan bentuk aljabar sederhana.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyederhanakan bentuk aljabar dan pecahan bentuk aljabar sederhana melalui penggabungan suku sejenis dan faktorisasi.",
      topikPembelajaran: "Penyederhanaan Bentuk Aljabar, Faktorisasi Sederhana, Pecahan Bentuk Aljabar Sederhana.",
      kemitraan: [
        { title: "IPA", desc: "Menyederhanakan rumus fisika dengan operasi aljabar." },
        { title: "Informatika", desc: "Menyederhanakan ekspresi matematika untuk pemrograman dasar." },
      ],
      apersepsi:
        "Guru menyajikan ekspresi panjang seperti 3x + 2y - x + 5y dan menanyakan: \"Bisakah ini ditulis lebih singkat?\" untuk memantik penyederhanaan.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah penyederhanaan ekspresi panjang yang muncul dari penjumlahan dan perkalian aljabar.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan dan membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi langkah penyederhanaan: gabungkan suku sejenis dan faktorkan jika memungkinkan.",
          "Guru memberi pertanyaan pemandu menuju strategi efisien.",
        ] },
        { items: [
          "Setiap kelompok menyajikan langkah penyederhanaan dan hasil akhirnya.",
          "Kelompok lain memberi tanggapan dan strategi alternatif.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan strategi penyederhanaan bentuk aljabar yang paling efisien.",
          "Murid merefleksikan kontribusi anggota dan strategi terbaik.",
        ] },
      ],
    },
  ],
};
