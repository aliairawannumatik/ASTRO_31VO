import { ShoppingCart, Tag, Banknote, Briefcase, Coins } from "lucide-react";
import { THEMES, DIMENSI, type MateriCatalogEntry } from "../rppHelpers";

const CP =
  "Menerapkan operasi aritmetika pada bilangan real, memberikan estimasi/perkiraan dalam menyelesaikan masalah, termasuk yang berkaitan dengan literasi finansial.";

export const aritmetikaSosial: MateriCatalogEntry = {
  slug: "aritmetika-sosial",
  title: "Aritmetika Sosial",
  shortTitle: "Aritmetika Sosial",
  icon: Coins,
  intro: "Pilih sub-topik aritmetika sosial untuk melihat Rencana Pelaksanaan Pembelajaran (RPP) lengkap.",
  theme: THEMES.yellow,
  subMateri: [
    {
      slug: "untung-rugi",
      title: "Untung dan Rugi",
      desc: "RPP konsep harga jual, harga beli, untung, rugi, dan persentase untung/rugi.",
      icon: ShoppingCart,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("untung rugi"), DIMENSI.bernalarKritis("untung rugi"), DIMENSI.komunikatif],
      relevansi:
        "Konsep untung dan rugi dipakai pada aktivitas perdagangan sehari-hari, koperasi sekolah, hingga literasi finansial.",
      strukturMateri:
        "Bertahap dari konsep harga beli/jual, untung/rugi, hingga persentase untung dan rugi terhadap harga beli.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan untung, rugi, dan persentase untung/rugi pada masalah kontekstual.",
      topikPembelajaran: "Harga Beli, Harga Jual, Untung, Rugi, Persentase Untung dan Rugi.",
      kemitraan: [
        { title: "IPS", desc: "Konsep dasar perdagangan dan koperasi sekolah." },
        { title: "PKWU", desc: "Simulasi usaha kecil sebagai aplikasi konsep untung rugi." },
      ],
      apersepsi:
        "Guru menyajikan masalah: \"Pak Adi membeli sepeda Rp1.500.000 dan menjualnya Rp1.700.000. Apakah Pak Adi untung atau rugi? Berapa persen?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik perdagangan koperasi sekolah.",
          "Murid menuliskan informasi yang diketahui (modal, harga jual).",
        ] },
        { items: [
          "Murid dikelompokkan heterogen dan membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi rumus untung, rugi, dan persentasenya.",
          "Guru memberi pertanyaan pemandu menuju strategi paling efisien.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan hasil perhitungan.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus untung/rugi dan persentasenya.",
          "Murid merefleksikan kontribusi anggota.",
        ] },
      ],
    },
    {
      slug: "diskon-pajak-bruto-netto-tara",
      title: "Diskon, Pajak, Bruto, Netto, dan Tara",
      desc: "RPP konsep diskon (rabat), pajak, bruto, netto, dan tara serta perhitungannya.",
      icon: Tag,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("diskon pajak bruto netto tara"), DIMENSI.mandiri, DIMENSI.kreatif("strategi finansial")],
      relevansi:
        "Konsep diskon, pajak, bruto, netto, dan tara dipakai pada transaksi belanja, faktur barang, dan pengelolaan keuangan harian.",
      strukturMateri:
        "Bertahap dari konsep diskon, pajak (PPN), hingga bruto, netto, dan tara pada kemasan barang.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menentukan harga setelah diskon dan pajak, serta menentukan bruto, netto, dan tara pada masalah kontekstual.",
      topikPembelajaran: "Diskon (Rabat), Pajak (PPN), Bruto, Netto, dan Tara.",
      kemitraan: [
        { title: "IPS", desc: "Konteks pajak penjualan dan harga akhir konsumen." },
        { title: "PKWU", desc: "Konsep berat bersih dan kotor pada pengemasan produk." },
      ],
      apersepsi:
        "Guru menampilkan label diskon \"30% off\" dan struk belanja dengan PPN, lalu menanyakan cara menghitung harga akhirnya.",
      langkahInti: [
        { items: [
          "Guru menampilkan label diskon, struk dengan PPN, dan kemasan barang dengan label berat.",
          "Murid mencatat pertanyaan yang muncul.",
        ] },
        { items: [
          "Murid merumuskan: \"Bagaimana menentukan harga setelah diskon? Bagaimana memahami bruto, netto, tara?\"",
          "Murid menulis dugaan pada LKPD.",
        ] },
        { items: [
          "Murid mencoba beberapa contoh perhitungan diskon, PPN, dan menafsirkan label kemasan.",
          "Murid mencatat hasil dan pola.",
        ] },
        { items: [
          "Murid berdiskusi menyusun rumus diskon, pajak, dan hubungan bruto-netto-tara.",
        ] },
        { items: [
          "Murid memverifikasi rumus pada soal kontekstual baru.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan konsep diskon, pajak, bruto, netto, dan tara.",
          "Murid menulis refleksi atas strategi efisien.",
        ] },
      ],
    },
    {
      slug: "bunga-tunggal",
      title: "Bunga Tunggal",
      desc: "RPP konsep bunga tunggal pada tabungan dan pinjaman serta perhitungannya.",
      icon: Banknote,
      model: "PBL",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.gotongRoyong("bunga tunggal"), DIMENSI.bernalarKritis("bunga tunggal"), DIMENSI.komunikatif],
      relevansi:
        "Bunga tunggal dipakai dalam menabung di bank, kredit barang, dan literasi finansial pribadi/keluarga.",
      strukturMateri:
        "Bertahap dari konsep bunga, rumus bunga tunggal, hingga aplikasi pada tabungan dan pinjaman.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menghitung bunga tunggal pada tabungan dan pinjaman serta menerapkannya pada masalah kontekstual finansial.",
      topikPembelajaran: "Konsep Bunga, Rumus Bunga Tunggal, Aplikasi pada Tabungan dan Pinjaman.",
      kemitraan: [
        { title: "IPS", desc: "Konteks tabungan dan pinjaman pada lembaga keuangan." },
        { title: "PPKn", desc: "Membangun sikap bijak dalam mengelola keuangan pribadi." },
      ],
      apersepsi:
        "Guru menyajikan: \"Andi menabung Rp1.000.000 di bank dengan bunga 6% per tahun. Berapa total tabungannya setelah 2 tahun?\"",
      langkahInti: [
        { items: [
          "Guru menyajikan masalah autentik tabungan dan pinjaman dengan bunga tunggal.",
          "Murid menuliskan informasi yang diketahui (modal, persen bunga, lama waktu).",
        ] },
        { items: [
          "Murid dikelompokkan heterogen, membagi peran.",
        ] },
        { items: [
          "Murid mengeksplorasi rumus bunga tunggal: B = M × p% × t.",
          "Guru memberi pertanyaan pemandu untuk konteks bulanan dan tahunan.",
        ] },
        { items: [
          "Setiap kelompok menyajikan strategi dan hasil perhitungan.",
          "Kelompok lain memberi tanggapan kritis.",
        ] },
        { items: [
          "Guru bersama murid menyimpulkan rumus dan aplikasi bunga tunggal.",
          "Murid merefleksikan kekuatan kolaborasi dan strategi efektif.",
        ] },
      ],
    },
    {
      slug: "aplikasi-aritmetika-sosial",
      title: "Aplikasi Aritmetika Sosial",
      desc: "RPP penerapan konsep aritmetika sosial pada masalah belanja, simpan pinjam, dan pengelolaan keuangan.",
      icon: Briefcase,
      model: "Discovery",
      dimensiProfil: [DIMENSI.beriman, DIMENSI.bernalarKritis("aplikasi aritmetika sosial"), DIMENSI.mandiri, DIMENSI.kreatif("kasus aritmetika sosial")],
      relevansi:
        "Aritmetika sosial diterapkan pada situasi nyata seperti merancang anggaran belanja, mengevaluasi penawaran kredit, dan mengelola keuangan pribadi.",
      strukturMateri:
        "Bertahap dari memilih konsep yang tepat, menggabungkan beberapa konsep, hingga merancang skenario finansial sederhana.",
      capaianPembelajaran: CP,
      tujuanPembelajaran:
        "Peserta didik dapat menerapkan berbagai konsep aritmetika sosial untuk menyelesaikan masalah kontekstual yang kompleks.",
      topikPembelajaran: "Aplikasi Untung-Rugi, Diskon, Pajak, Bunga, dan Pengelolaan Keuangan.",
      kemitraan: [
        { title: "IPS", desc: "Studi kasus literasi finansial harian." },
        { title: "PPKn", desc: "Sikap kritis dalam membandingkan penawaran kredit." },
      ],
      apersepsi:
        "Guru menampilkan dua brosur penawaran kredit motor dan menanyakan: \"Penawaran mana yang lebih menguntungkan? Mengapa?\"",
      langkahInti: [
        { items: [
          "Guru menampilkan studi kasus pembelian barang dengan diskon, pajak, dan kredit.",
          "Murid mencatat pertanyaan dan dugaan.",
        ] },
        { items: [
          "Murid merumuskan: \"Konsep apa saja yang harus dikombinasikan?\"",
          "Murid menulis hipotesis pada LKPD.",
        ] },
        { items: [
          "Murid mengumpulkan data dari berbagai konteks finansial.",
          "Murid mencatat strategi penyelesaian.",
        ] },
        { items: [
          "Murid berdiskusi memilih strategi paling efisien dan menyusun langkah-langkah penyelesaian.",
        ] },
        { items: [
          "Murid memverifikasi strategi pada studi kasus baru.",
          "Guru memberi umpan balik dan meluruskan miskonsepsi.",
        ] },
        { items: [
          "Murid bersama guru menyimpulkan strategi pengambilan keputusan finansial.",
          "Murid menulis refleksi atas pengalaman literasi finansial.",
        ] },
      ],
    },
  ],
};
