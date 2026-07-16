import { Sigma, Hash, Radical, Atom } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menerapkan sifat-sifat bilangan berpangkat dan bentuk akar untuk menyelesaikan masalah, termasuk masalah yang berkaitan dengan notasi ilmiah.";

export const bilanganBerpangkat: MateriCatalogEntry = {
  slug: "bilangan-berpangkat",
  title: "Bilangan Berpangkat dan Bentuk Akar",
  shortTitle: "Bilangan Berpangkat",
  icon: Sigma,
  intro: "Pilih sub-topik bilangan berpangkat dan bentuk akar untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.blue,
  subMateri: [
    {
      slug: "bilangan-berpangkat-bulat",
      title: "Bilangan Berpangkat Bulat",
      desc: "RPP konsep bilangan berpangkat bulat positif, nol, dan negatif.",
      icon: Sigma,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("bilangan berpangkat"), DIMENSI.bernalarKritis("bilangan berpangkat"), DIMENSI.komunikatif],
      relevansi:
        "Bilangan berpangkat dipakai untuk menulis bilangan yang sangat besar (jumlah penduduk dunia) atau sangat kecil (ukuran sel) dengan ringkas.",
      strukturMateri:
        "Bertahap dari pangkat bulat positif sebagai perkalian berulang, ke pangkat nol (a⁰ = 1), hingga pangkat negatif (a⁻ⁿ = 1/aⁿ).",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menjelaskan dan menghitung bilangan berpangkat bulat positif, nol, dan negatif.",
      topikPembelajaran: "Pangkat Bulat Positif, Pangkat Nol, dan Pangkat Bulat Negatif.",
      kemitraan: [
        { title: "IPA", desc: "Penulisan ukuran sel, atom, dan bakteri dengan bilangan berpangkat." },
        { title: "Informatika", desc: "Konsep pangkat 2 pada satuan komputer (KB, MB, GB)." },
      ],
      apersepsi:
        "Guru menulis 1.000.000.000.000 dan menanyakan: \"Bisakah ditulis lebih ringkas?\" untuk memantik konsep bilangan berpangkat.",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang menulis bilangan sangat besar/kecil.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi pangkat positif sebagai perkalian berulang dan pola pangkat nol & negatif.",
          "Guru memberi pertanyaan pemandu menuju definisi.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan kesimpulan tentang pangkat nol dan negatif.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan konsep bilangan berpangkat bulat.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "sifat-bilangan-berpangkat",
      title: "Sifat-Sifat Bilangan Berpangkat",
      desc: "RPP penemuan sifat-sifat operasi pada bilangan berpangkat.",
      icon: Hash,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("sifat pangkat"), DIMENSI.mandiri, DIMENSI.kreatif("strategi pangkat")],
      relevansi:
        "Sifat bilangan berpangkat dipakai untuk menyederhanakan perhitungan bilangan sangat besar/kecil dalam sains dan teknologi.",
      strukturMateri:
        "Bertahap dari sifat aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ : aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ, hingga (ab)ⁿ = aⁿbⁿ.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menemukan dan menerapkan sifat-sifat bilangan berpangkat untuk menyederhanakan ekspresi.",
      topikPembelajaran: "Sifat Perkalian, Pembagian, Pangkat dari Pangkat, dan Pangkat dari Perkalian.",
      kemitraan: [
        { title: "IPA", desc: "Aplikasi sifat pangkat pada perhitungan ilmiah." },
        { title: "Informatika", desc: "Aplikasi sifat pangkat pada perhitungan satuan data." },
      ],
      apersepsi:
        "Guru menyajikan: \"2³ × 2⁴ = ?\" dan meminta murid mencari pola hasilnya.",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa pasangan operasi pada bilangan berpangkat.",
          "Murid mencatat pertanyaan tentang pola yang muncul.",
        ] },
        { items: [
          "Murid merumuskan: \"Apakah pangkat dapat dijumlahkan saat dikalikan?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba beberapa contoh dan mencari pola.",
          "Murid mencatat hasilnya.",
        ] },
        { items: [
          "Murid berdiskusi merumuskan empat sifat utama bilangan berpangkat.",
        ] },
        { items: [
          "Murid memverifikasi sifat pada soal baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan sifat-sifat bilangan berpangkat.",
          "Murid menulis refleksi atas penemuan.",
        ] },
      ],
    },
    {
      slug: "bentuk-akar",
      title: "Bentuk Akar",
      desc: "RPP konsep bentuk akar dan operasi pada bentuk akar.",
      icon: Radical,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("bentuk akar"), DIMENSI.bernalarKritis("bentuk akar"), DIMENSI.komunikatif],
      relevansi:
        "Bentuk akar muncul dalam menentukan panjang sisi pada teorema Pythagoras, perhitungan ilmiah, dan analisis frekuensi data.",
      strukturMateri:
        "Bertahap dari konsep bentuk akar, ke operasi pada bentuk akar (penjumlahan, pengurangan, perkalian), hingga merasionalkan penyebut.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menyederhanakan bentuk akar dan melakukan operasi pada bentuk akar.",
      topikPembelajaran: "Konsep Bentuk Akar, Operasi pada Bentuk Akar, dan Merasionalkan Penyebut.",
      kemitraan: [
        { title: "IPA", desc: "Aplikasi bentuk akar pada rumus fisika dan kimia." },
        { title: "PKWU", desc: "Penggunaan bentuk akar pada perhitungan kerajinan." },
      ],
      apersepsi:
        "Guru menyajikan: \"Diagonal persegi sisi 1 cm sama dengan √2 cm. Apa arti dan cara memeriksanya?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tentang panjang diagonal yang berbentuk akar.",
          "Murid menuliskan informasi yang diketahui.",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi cara menyederhanakan bentuk akar dan operasinya.",
          "Guru memberi pertanyaan pemandu menuju merasionalkan penyebut.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan kesimpulannya.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan operasi pada bentuk akar.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "notasi-ilmiah",
      title: "Notasi Ilmiah",
      desc: "RPP konsep notasi ilmiah untuk menulis bilangan sangat besar/sangat kecil.",
      icon: Atom,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("notasi ilmiah"), DIMENSI.mandiri, DIMENSI.kreatif("representasi data")],
      relevansi:
        "Notasi ilmiah dipakai oleh ilmuwan untuk menulis bilangan ekstrem (massa elektron, jarak antar bintang) dengan ringkas dan jelas.",
      strukturMateri:
        "Bertahap dari pengertian notasi ilmiah a × 10ⁿ dengan 1 ≤ a < 10, ke konversi bilangan ke notasi ilmiah, hingga aplikasinya.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat mengubah bilangan ke notasi ilmiah dan sebaliknya serta melakukan operasi sederhana.",
      topikPembelajaran: "Konsep Notasi Ilmiah, Konversi Bilangan, dan Operasi pada Notasi Ilmiah.",
      kemitraan: [
        { title: "IPA", desc: "Notasi ilmiah pada data ilmiah (massa elektron, jarak planet)." },
        { title: "Informatika", desc: "Notasi ilmiah pada representasi bilangan komputer." },
      ],
      apersepsi:
        "Guru menulis 0,000000000167 (massa elektron) dan menanyakan: \"Bagaimana menulisnya lebih ringkas?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan beberapa data ilmiah ekstrem.",
          "Murid mencatat pertanyaan tentang penulisan ringkas.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana bentuk notasi ilmiah yang baku?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba mengubah berbagai bilangan ke notasi ilmiah.",
          "Murid mencatat strategi.",
        ] },
        { items: [
          "Murid berdiskusi menyusun aturan baku notasi ilmiah.",
        ] },
        { items: [
          "Murid memverifikasi aturan pada bilangan baru.",
          "Guru memberi umpan balik.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan konsep notasi ilmiah.",
          "Murid menulis refleksi atas pengalaman.",
        ] },
      ],
    },
  ],
};
