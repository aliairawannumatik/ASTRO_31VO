import { X } from "lucide-react";
import RPPDetailPage, { type RPPDetailData } from "@/components/RPPDetailPage";

const data: RPPDetailData = {
  topicTitle: "Perkalian Bilangan Bulat",
  topicIcon: X,
  theme: {
    badgeBorder: "border-amber-300/40",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-100",
    subtitle: "text-amber-200",
  },
  alokasiWaktu: "2 x 40 JP",
  identifikasi:
    "Guru mengidentifikasi kesiapan murid melalui pertanyaan singkat tentang penjumlahan berulang. Guru juga memetakan minat dan kemampuan kolaborasi murid agar pembagian kelompok pada model PBL berjalan optimal.",
  jenisPengetahuan: [
    {
      label: "Faktual",
      desc: "Tanda perkalian (\u00d7 atau \u00b7), serta pengertian bilangan bulat positif dan negatif.",
      color: "text-cyan-200",
      bg: "bg-cyan-500/10",
      border: "border-cyan-300/40",
    },
    {
      label: "Konseptual",
      desc: "Perkalian sebagai penjumlahan berulang, dan aturan tanda dalam perkalian bilangan bulat.",
      color: "text-violet-200",
      bg: "bg-violet-500/10",
      border: "border-violet-300/40",
    },
    {
      label: "Prosedural",
      desc: "Langkah-langkah menentukan tanda hasil terlebih dahulu, lalu mengalikan nilai mutlaknya.",
      color: "text-amber-200",
      bg: "bg-amber-500/10",
      border: "border-amber-300/40",
    },
  ],
  relevansi:
    "Perkalian bilangan bulat dipakai dalam menghitung total kerugian/keuntungan beberapa hari berturut-turut, perubahan suhu kumulatif, atau total perpindahan dalam beberapa langkah.",
  tingkatKesulitan:
    "Sedang. Murid sudah memahami konsep penjumlahan berulang, tantangannya adalah memahami aturan tanda (positif × negatif, negatif × negatif).",
  strukturMateri:
    "Bertahap dari perkalian dua bilangan positif, positif dengan negatif, hingga negatif dengan negatif, lalu sifat-sifat perkalian (komutatif, asosiatif, distributif).",
  integrasiNilai:
    "Pembelajaran menanamkan nilai tanggung jawab, kerja sama, ketekunan dalam menyelesaikan masalah kontekstual, serta sikap saling menghargai dalam diskusi kelompok.",
  dimensiProfil: [
    {
      title: "Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia",
      desc: "Melalui doa pembuka, bersyukur atas anugerah akal, serta menjaga sikap santun saat menyampaikan dan menerima pendapat.",
    },
    {
      title: "Bergotong Royong (Kolaborasi)",
      desc: "Melalui kerja kelompok dalam memecahkan masalah perkalian bilangan bulat, saling membantu memahami aturan tanda, dan berbagi peran dalam presentasi.",
    },
    {
      title: "Bernalar Kritis",
      desc: "Melalui kegiatan menganalisis masalah, mengaitkannya dengan konsep penjumlahan berulang, serta mengevaluasi kebenaran solusi yang dihasilkan kelompok lain.",
    },
    {
      title: "Komunikatif",
      desc: "Melalui kegiatan presentasi hasil pemecahan masalah dan tanya jawab antar kelompok dengan bahasa matematika yang tepat.",
    },
  ],
  capaianPembelajaran:
    "Membaca, menulis, dan membandingkan bilangan bulat serta menerapkan operasi aritmetika (termasuk perkalian) pada bilangan bulat untuk menyelesaikan masalah kontekstual.",
  tujuanPembelajaran:
    "Peserta didik dapat menjelaskan konsep perkalian bilangan bulat (termasuk aturan tanda) dan menyelesaikan masalah kontekstual yang berkaitan dengan perkalian bilangan bulat.",
  topikPembelajaran:
    "Perkalian sebagai Penjumlahan Berulang, Aturan Tanda Perkalian, Sifat Perkalian Bilangan Bulat, dan Penerapan Perkalian Bilangan Bulat dalam Kehidupan Sehari-hari.",
  praktikPedagogis: [
    { label: "Model", value: "Problem Based Learning (PBL)" },
    { label: "Pendekatan", value: "Saintifik" },
    { label: "Metode", value: "Diskusi kelompok, presentasi, tanya jawab, dan penugasan kontekstual." },
  ],
  praktikPedagogisCatatan:
    "PBL membawa murid menyelesaikan masalah autentik tentang perkalian bilangan bulat, mendorong kolaborasi serta penalaran kritis, sehingga aturan tanda dipahami melalui pengalaman memecahkan masalah.",
  kemitraan: [
    {
      title: "Ilmu Pengetahuan Sosial (IPS)",
      desc: "Konteks ekonomi sederhana: kerugian harian dikalikan jumlah hari, sebagai contoh perkalian bilangan bulat negatif.",
    },
    {
      title: "Pendidikan Pancasila (PPKn)",
      desc: "Penanaman sikap kerja sama dan saling menghargai dalam diskusi kelompok untuk memecahkan masalah perkalian bilangan bulat.",
    },
  ],
  budayaBelajar:
    "Iklim kelas yang kolaboratif, terbuka, dan saling memuliakan, memungkinkan setiap murid berkontribusi dalam pemecahan masalah secara nyaman.",
  ruangFisik:
    "Meja diatur berkelompok 4-5 murid dengan menyediakan papan tulis kecil/whiteboard untuk merancang strategi pemecahan masalah perkalian bilangan bulat.",
  pemanfaatanDigital: [
    "Aplikasi NUMATIK digunakan untuk menyajikan masalah autentik, simulasi perkalian bilangan bulat, dan quiz interaktif.",
  ],
  apersepsi:
    "Guru menyajikan masalah: \"Sebuah toko mengalami kerugian Rp25.000 per hari selama 4 hari berturut-turut. Berapa total kerugiannya?\" untuk memantik diskusi tentang perkalian bilangan bulat negatif.",
  langkahInti: [
    {
      fase: "Orientasi Peserta Didik pada Masalah",
      color: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-300/40",
      text: "text-cyan-100",
      items: [
        "Guru menyajikan masalah autentik berbasis konteks ekonomi/cuaca yang melibatkan perkalian bilangan bulat positif dan negatif.",
        "Murid diberi waktu memahami masalah dan menuliskan informasi yang diketahui dan ditanyakan.",
      ],
    },
    {
      fase: "Mengorganisasi Peserta Didik untuk Belajar",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-300/40",
      text: "text-emerald-100",
      items: [
        "Murid dikelompokkan secara heterogen.",
        "Setiap kelompok membagi peran (pemimpin diskusi, notulis, penyaji, pengelola waktu).",
      ],
    },
    {
      fase: "Membimbing Penyelidikan Kelompok",
      color: "from-violet-500/20 to-indigo-500/10",
      border: "border-violet-300/40",
      text: "text-violet-100",
      items: [
        "Murid mengeksplorasi masalah menggunakan ilustrasi penjumlahan berulang.",
        "Guru berkeliling memberikan pertanyaan pemandu untuk menemukan aturan tanda perkalian.",
      ],
    },
    {
      fase: "Mengembangkan dan Menyajikan Hasil Karya",
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-300/40",
      text: "text-amber-100",
      items: [
        "Setiap kelompok menyajikan langkah-langkah pemecahan masalah serta kesimpulan aturan tanda perkalian.",
        "Kelompok lain memberi tanggapan dan pertanyaan kritis.",
      ],
    },
    {
      fase: "Menganalisis & Mengevaluasi Proses Pemecahan Masalah",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-300/40",
      text: "text-pink-100",
      items: [
        "Guru bersama murid menganalisis berbagai strategi yang muncul dan menyimpulkan aturan tanda perkalian bilangan bulat.",
        "Murid merefleksikan proses pemecahan masalah dan kekuatan kolaborasi yang dialami.",
      ],
    },
  ],
  langkahPenutup: [
    "Guru memberi penghargaan kepada kelompok atas kerja sama dan kualitas presentasi.",
    "Guru memberikan postes singkat untuk mengukur ketercapaian tujuan pembelajaran.",
    "Guru memberi PR berupa soal kontekstual perkalian bilangan bulat.",
    "Guru menginformasikan materi pembagian bilangan bulat untuk pertemuan berikutnya.",
  ],
  asesmen: [
    {
      title: "Asesmen sebagai Pembelajaran (Assessment as Learning)",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-300/40",
      text: "text-emerald-100",
      items: [
        "Penilaian Diri: Murid menilai pemahaman konsep dan kontribusi dalam kelompok.",
        "Penilaian Sejawat: Murid memberi umpan balik atas peran dan keaktifan rekan satu kelompok.",
      ],
    },
    {
      title: "Asesmen untuk Pembelajaran (Assessment for Learning)",
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-300/40",
      text: "text-amber-100",
      items: [
        "Observasi: Guru mengamati proses penyelidikan dan diskusi kelompok.",
        "Tanya Jawab: Guru memberi pertanyaan pemandu untuk mengecek pemahaman aturan tanda.",
        "LKPD: Hasil pekerjaan kelompok digunakan untuk memperbaiki instruksi.",
      ],
    },
    {
      title: "Asesmen Hasil Pembelajaran (Assessment of Learning)",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-300/40",
      text: "text-pink-100",
      items: [
        "Tes Tertulis: Soal perkalian bilangan bulat dengan konteks ekonomi dan sains sederhana.",
        "Penilaian Produk: Laporan pemecahan masalah kelompok dinilai dengan rubrik.",
      ],
    },
  ],
  backPath: "/ruang-untuk-guru/rpp/bilangan-bulat",
  backLabel: "Kembali ke RPP Bilangan Bulat",
};

const RPPPerkalianBilanganBulatPage = () => <RPPDetailPage data={data} />;

export default RPPPerkalianBilanganBulatPage;
