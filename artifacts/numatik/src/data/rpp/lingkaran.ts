import { Circle, CircleDot, Compass, PieChart, LayoutGrid, MapPin } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menggunakan unsur, sifat, dan rumus pada lingkaran untuk menyelesaikan masalah geometri.";

export const lingkaran: MateriCatalogEntry = {
  slug: "lingkaran",
  title: "Lingkaran",
  shortTitle: "Lingkaran",
  icon: Circle,
  intro: "Pilih sub-topik lingkaran untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.pink,
  subMateri: [
    {
      slug: "unsur-lingkaran",
      title: "Unsur-Unsur Lingkaran",
      desc: "RPP pengenalan unsur lingkaran: pusat, jari-jari, diameter, busur, tali busur, juring, tembereng, dan apotema.",
      icon: CircleDot,
      model: "Discovery",
      dimensiProfil: [
        DIMENSI.beriman,
        DIMENSI.bernalarKritis("unsur lingkaran"),
        DIMENSI.mandiri,
        DIMENSI.kreatif("representasi lingkaran"),
      ],
      relevansi:
        "Unsur lingkaran tampak pada roda kendaraan, jam dinding, kompas, lapangan olahraga berbentuk lingkaran, dan peta wilayah melingkar.",
      strukturMateri:
        "Bertahap dari mengenal pusat dan jari-jari, ke diameter, busur, tali busur, juring, tembereng, hingga apotema.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengenali, menamai, dan mendeskripsikan unsur-unsur lingkaran dengan tepat.",
      topikPembelajaran: "Pusat, Jari-jari, Diameter, Busur, Tali Busur, Juring, Tembereng, dan Apotema.",
      kemitraan: [
        { title: "IPA", desc: "Penerapan unsur lingkaran pada roda dan gerak melingkar dalam fisika." },
        { title: "Seni Budaya", desc: "Penerapan unsur lingkaran pada motif mandala dan karya seni geometris." },
      ],
      apersepsi:
        "Guru menampilkan jam dinding dan menanyakan: \"Bagian mana yang menjadi pusat, jari-jari, dan busurnya?\" lalu menampilkan aplikasi NUMATIK untuk memperkuat visualisasi.",
      langkahInti: [
        { items: [
          "Guru menampilkan berbagai benda berbentuk lingkaran (jam, roda, koin).",
          "Murid mencatat pertanyaan tentang bagian-bagian lingkaran yang belum diketahui namanya.",
        ] },
        { items: [
          "Murid merumuskan masalah: \"Apa saja nama dan fungsi setiap bagian lingkaran?\"",
          "Murid menulis dugaan awal pada LKPD.",
        ] },
        { items: [
          "Murid menggambar lingkaran dan melabeli setiap unsur berdasarkan definisi yang mereka eksplorasi.",
          "Murid mencatat definisi tiap unsur dari berbagai sumber (LKPD, NUMATIK, buku).",
        ] },
        { items: [
          "Murid berdiskusi kelompok menyusun definisi lengkap setiap unsur lingkaran dalam bahasa mereka sendiri.",
        ] },
        { items: [
          "Murid memverifikasi label unsur pada lingkaran baru yang diberikan guru.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan definisi dan nama seluruh unsur lingkaran.",
          "Murid menulis refleksi tentang unsur mana yang paling menantang untuk dipahami.",
        ] },
      ],
    },
    {
      slug: "keliling-luas-lingkaran",
      title: "Keliling dan Luas Lingkaran",
      desc: "RPP rumus keliling (K = 2πr) dan luas lingkaran (L = πr²) serta penerapannya pada masalah kontekstual.",
      icon: Circle,
      model: "PBL",
      dimensiProfil: [
        DIMENSI.beriman,
        DIMENSI.gotongRoyong("keliling dan luas lingkaran"),
        DIMENSI.bernalarKritis("keliling dan luas lingkaran"),
        DIMENSI.komunikatif,
      ],
      relevansi:
        "Keliling dan luas lingkaran dipakai untuk menentukan kebutuhan tepi karpet bundar, menghitung luas kolam, lapangan, atau taman berbentuk lingkaran.",
      strukturMateri:
        "Bertahap dari konsep π, rumus keliling K = 2πr = πd, hingga rumus luas L = πr² dan bangun gabungan.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan keliling dan luas lingkaran serta menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Konsep Pi (π), Rumus Keliling Lingkaran K = 2πr, dan Rumus Luas Lingkaran L = πr².",
      kemitraan: [
        { title: "PKWU", desc: "Menentukan kebutuhan bahan untuk produk berbentuk lingkaran (karpet, alas kue)." },
        { title: "IPA", desc: "Konsep gerak melingkar dan keliling lintasan pada roda atau orbit." },
      ],
      apersepsi:
        "Guru menyajikan masalah: \"Sebuah taman berbentuk lingkaran berdiameter 14 m. Berapa panjang pagar yang diperlukan dan berapa luas tamannya?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik: menghitung panjang pagar dan luas taman berbentuk lingkaran.",
          "Murid menuliskan informasi yang diketahui dan ditanyakan.",
        ] },
        { items: [
          "Murid dikelompokkan secara heterogen dan membagi peran (pengukur, penulis, penyaji).",
        ] },
        { items: [
          "Murid mengeksplorasi hubungan keliling dengan diameter (nilai π) menggunakan pengukuran benda nyata.",
          "Guru memberi pertanyaan pemandu menuju rumus K = 2πr dan L = πr².",
        ] },
        { items: [
          "Setiap kelompok menyajikan rumus yang ditemukan dan strategi penyelesaian masalah.",
          "Kelompok lain memberi tanggapan kritis dan membandingkan strategi.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus keliling dan luas lingkaran.",
          "Murid merefleksikan kontribusi anggota dan proses penemuan rumus.",
        ] },
      ],
    },
    {
      slug: "kaitan-bangun-datar",
      title: "Kaitan Lingkaran dengan Bangun Datar Lainnya",
      desc: "RPP hubungan lingkaran dengan bangun datar: lingkaran dalam/luar persegi, segitiga, dan menghitung luas daerah yang diarsir.",
      icon: LayoutGrid,
      model: "Discovery",
      dimensiProfil: [
        DIMENSI.beriman,
        DIMENSI.bernalarKritis("kaitan lingkaran dan bangun datar"),
        DIMENSI.kreatif("strategi menghitung luas daerah"),
        DIMENSI.mandiri,
      ],
      relevansi:
        "Kaitan lingkaran dengan bangun datar muncul pada desain logo, ubin, jendela, dan motif arsitektur yang memadukan bentuk lingkaran dan persegi atau segitiga.",
      strukturMateri:
        "Bertahap dari lingkaran dalam persegi, lingkaran luar persegi, lingkaran dalam/luar segitiga sama sisi, hingga luas daerah yang diarsir pada bangun gabungan.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan hubungan antara lingkaran dengan bangun datar dan menghitung luas daerah yang diarsir pada bangun gabungan.",
      topikPembelajaran: "Lingkaran Dalam Persegi, Lingkaran Luar Persegi, Lingkaran Dalam/Luar Segitiga, Luas Daerah Arsir.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Motif geometris yang memadukan lingkaran dan bangun datar lain pada batik atau kerajinan." },
        { title: "PKWU", desc: "Perhitungan kebutuhan bahan pada kemasan berbentuk gabungan lingkaran dan persegi." },
      ],
      apersepsi:
        "Guru menampilkan gambar ubin kamar mandi berbentuk persegi dengan motif lingkaran di dalamnya, lalu bertanya: \"Berapa luas bagian yang tidak tertutup lingkaran?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan berbagai gambar bangun gabungan (lingkaran dalam persegi, persegi dalam lingkaran).",
          "Murid mencatat pertanyaan: bagaimana mencari jari-jari lingkaran dalam/luar bangun datar?",
        ] },
        { items: [
          "Murid merumuskan masalah: \"Bagaimana hubungan sisi bangun datar dengan jari-jari lingkaran dalam/luarnya?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid menggambar beberapa konfigurasi lingkaran-bangun datar dan mengukur hubungannya.",
          "Murid mencatat pola hubungan sisi/diagonal dengan jari-jari.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan: r_dalam = ½ × sisi (untuk persegi), r_luar = ½ × diagonal.",
          "Murid menghitung luas daerah arsir pada beberapa bangun gabungan.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada konfigurasi baru yang berbeda.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan hubungan lingkaran dengan berbagai bangun datar.",
          "Murid menulis refleksi: langkah mana yang paling sulit dalam menghitung luas arsir?",
        ] },
      ],
    },
    {
      slug: "panjang-busur-luas-juring",
      title: "Panjang Busur dan Luas Juring",
      desc: "RPP menentukan panjang busur dan luas juring berdasarkan sudut pusat serta penerapannya pada masalah nyata.",
      icon: PieChart,
      model: "PBL",
      dimensiProfil: [
        DIMENSI.beriman,
        DIMENSI.gotongRoyong("panjang busur dan luas juring"),
        DIMENSI.bernalarKritis("panjang busur dan luas juring"),
        DIMENSI.komunikatif,
      ],
      relevansi:
        "Panjang busur dan luas juring dipakai pada potongan kue bundar, lintasan melingkar, diagram lingkaran, dan perhitungan sektor lapangan berbentuk lingkaran.",
      strukturMateri:
        "Bertahap dari konsep proporsi sudut terhadap 360°, ke rumus panjang busur (α/360°) × 2πr, hingga rumus luas juring (α/360°) × πr².",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan panjang busur dan luas juring berdasarkan sudut pusat serta menerapkannya pada masalah kontekstual.",
      topikPembelajaran: "Proporsi Sudut, Rumus Panjang Busur, Rumus Luas Juring, dan Luas Tembereng.",
      kemitraan: [
        { title: "PKWU", desc: "Menentukan luas potongan kue atau pizza sebagai aplikasi rumus juring." },
        { title: "IPS", desc: "Membaca dan menghitung persentase pada diagram lingkaran sebagai aplikasi luas juring." },
      ],
      apersepsi:
        "Guru menyajikan: \"Sebuah pizza berdiameter 30 cm dipotong menjadi potongan dengan sudut pusat 60°. Berapa panjang busur tepi dan luas potongan tersebut?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang potongan pizza/kue dan diagram lingkaran dari media statistik.",
          "Murid menuliskan informasi yang diketahui dan strategi awal penyelesaian.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen dan membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi proporsi sudut pusat terhadap 360° untuk menentukan panjang busur dan luas juring.",
          "Guru memberi pertanyaan pemandu: \"Jika sudut pusat 90°, berapa bagian dari lingkaran penuh?\"",
        ] },
        { items: [
          "Setiap kelompok menyajikan rumus yang ditemukan dan strategi penyelesaian masalah pizza.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus panjang busur dan luas juring.",
          "Murid merefleksikan kontribusi anggota dan kegunaan konsep proporsi.",
        ] },
      ],
    },
    {
      slug: "sudut-pusat-keliling",
      title: "Sudut Pusat dan Sudut Keliling",
      desc: "RPP konsep sudut pusat, sudut keliling, dan hubungannya: sudut pusat = 2 × sudut keliling pada busur yang sama.",
      icon: Compass,
      model: "Discovery",
      dimensiProfil: [
        DIMENSI.beriman,
        DIMENSI.bernalarKritis("sudut pusat dan sudut keliling"),
        DIMENSI.mandiri,
        DIMENSI.kreatif("strategi pembuktian geometri"),
      ],
      relevansi:
        "Konsep sudut pusat dan keliling dipakai dalam desain jam dinding, jarum kompas, rancangan stadion berbentuk lingkaran, dan segi empat tali busur.",
      strukturMateri:
        "Bertahap dari pengertian sudut pusat dan sudut keliling, ke teorema hubungan keduanya, sifat sudut keliling pada busur yang sama, hingga sudut keliling pada diameter.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan hubungan sudut pusat dan sudut keliling serta menerapkan sifat-sifatnya dalam menyelesaikan masalah geometri.",
      topikPembelajaran: "Sudut Pusat, Sudut Keliling, Teorema ∠Pusat = 2 × ∠Keliling, dan Sifat Segi Empat Tali Busur.",
      kemitraan: [
        { title: "Seni Budaya", desc: "Penerapan sudut pada pola mandala atau motif lingkaran dalam kerajinan." },
        { title: "IPA", desc: "Sudut pada jam dinding sebagai aplikasi nyata sudut pusat dan keliling." },
      ],
      apersepsi:
        "Guru menampilkan lingkaran dengan sudut pusat 80° dan sudut keliling 40° pada busur yang sama, lalu menantang murid: \"Apakah ini kebetulan atau selalu berlaku?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa lingkaran dengan sudut pusat dan sudut keliling pada busur yang sama.",
          "Murid mencatat pertanyaan tentang pola hubungan kedua sudut tersebut.",
        ] },
        { items: [
          "Murid merumuskan masalah: \"Apakah selalu ada hubungan tetap antara sudut pusat dan sudut keliling pada busur yang sama?\"",
          "Murid menulis dugaan awal pada LKPD.",
        ] },
        { items: [
          "Murid mengukur sudut pusat dan sudut keliling pada beberapa lingkaran dengan sudut berbeda.",
          "Murid mencatat hasil pengukuran dan mencari pola.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan teorema: sudut pusat = 2 × sudut keliling pada busur yang sama.",
          "Murid menerapkan teorema untuk menentukan sudut yang tidak diketahui.",
        ] },
        { items: [
          "Murid memverifikasi teorema pada konfigurasi lingkaran baru.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan teorema dan sifat sudut pusat-keliling secara lengkap.",
          "Murid menulis refleksi: apa yang paling mengejutkan dari penemuan ini?",
        ] },
      ],
    },
    {
      slug: "penerapan-kontekstual",
      title: "Penerapan Konsep Lingkaran pada Permasalahan Kontekstual",
      desc: "RPP penerapan terpadu konsep lingkaran pada masalah nyata: roda, kolam, lapangan, jam, pizza, satelit, drone, dan taman.",
      icon: MapPin,
      model: "PBL",
      dimensiProfil: [
        DIMENSI.beriman,
        DIMENSI.gotongRoyong("penerapan konsep lingkaran"),
        DIMENSI.bernalarKritis("penerapan konsep lingkaran"),
        DIMENSI.kreatif("solusi masalah kontekstual"),
      ],
      relevansi:
        "Seluruh konsep lingkaran (keliling, luas, busur, juring, sudut) diterapkan secara terpadu dalam kehidupan nyata: perancangan taman, lintasan roda, dan desain arsitektur.",
      strukturMateri:
        "Terpadu dan bertahap: memilih konsep yang tepat (keliling/luas/busur/juring/sudut) sesuai konteks masalah, lalu menyelesaikan secara sistematis.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat memilih dan menerapkan konsep lingkaran yang sesuai untuk menyelesaikan berbagai masalah kontekstual secara sistematis.",
      topikPembelajaran: "Integrasi Keliling, Luas, Busur, Juring, Sudut Pusat, dan Sudut Keliling dalam Konteks Nyata.",
      kemitraan: [
        { title: "IPA", desc: "Konsep lintasan roda dan gerak melingkar pada kendaraan serta satelit." },
        { title: "IPS / Geografi", desc: "Penerapan skala dan jarak melingkar pada peta serta zonasi wilayah berbentuk lingkaran." },
      ],
      apersepsi:
        "Guru menyajikan klip singkat tentang perancangan taman kota berbentuk lingkaran, lalu bertanya: \"Konsep lingkaran apa saja yang perlu dikuasai untuk merancang taman ini?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan proyek mini: merancang taman berbentuk lingkaran dengan jalur melingkar, area juring, dan sudut tertentu.",
          "Murid mengidentifikasi konsep-konsep lingkaran yang dibutuhkan dan menuliskan rencananya.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen dan membagi tugas: tim keliling, tim luas, tim busur/juring, tim sudut.",
        ] },
        { items: [
          "Setiap tim menyelesaikan bagiannya menggunakan konsep yang relevan.",
          "Guru memfasilitasi diskusi antar tim untuk memastikan konsistensi hasil.",
        ] },
        { items: [
          "Setiap kelompok menyajikan desain taman beserta perhitungan lengkap dari semua konsep lingkaran.",
          "Kelompok lain memberi tanggapan dan pertanyaan kritis.",
        ] },
        { items: [
          "Guru bersama murid mengevaluasi ketepatan pemilihan konsep dan kebenaran perhitungan.",
          "Murid merefleksikan keterpaduan konsep lingkaran dan relevansinya dalam kehidupan nyata.",
        ] },
      ],
    },
  ],
};
