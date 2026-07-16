import { Calculator } from "lucide-react";
import RPPDetailPage, { type RPPDetailData } from "@/components/RPPDetailPage";

const data: RPPDetailData = {
  topicTitle: "Operasi Hitung Campuran Bilangan Bulat",
  topicIcon: Calculator,
  theme: {
    badgeBorder: "border-orange-300/40",
    badgeBg: "bg-orange-500/10",
    badgeText: "text-orange-100",
    subtitle: "text-orange-200",
  },
  alokasiWaktu: "3 x 40 JP",
  identifikasi:
    "Guru memetakan kemampuan murid pada operasi tunggal (penjumlahan, pengurangan, perkalian, pembagian) sebagai prasyarat. Guru juga membentuk kelompok heterogen untuk menjamin kolaborasi efektif dalam pembelajaran berbasis masalah.",
  jenisPengetahuan: [
    {
      label: "Faktual",
      desc: "Lambang operasi (+, -, \u00d7, \u00f7), tanda kurung, serta urutan operasi yang lazim digunakan.",
      color: "text-cyan-200",
      bg: "bg-cyan-500/10",
      border: "border-cyan-300/40",
    },
    {
      label: "Konseptual",
      desc: "Konsep urutan operasi (kurung, perkalian/pembagian, penjumlahan/pengurangan) dan sifat-sifat operasi.",
      color: "text-violet-200",
      bg: "bg-violet-500/10",
      border: "border-violet-300/40",
    },
    {
      label: "Prosedural",
      desc: "Langkah-langkah menyelesaikan ekspresi campuran sesuai urutan operasi pada bilangan bulat.",
      color: "text-amber-200",
      bg: "bg-amber-500/10",
      border: "border-amber-300/40",
    },
  ],
  relevansi:
    "Operasi hitung campuran banyak ditemui dalam perhitungan total belanja dengan diskon, perhitungan skor permainan, atau merancang anggaran sederhana yang melibatkan beberapa operasi sekaligus.",
  tingkatKesulitan:
    "Tinggi karena murid harus mengintegrasikan keempat operasi sekaligus dengan tanda kurung dan aturan urutan operasi pada bilangan bulat positif maupun negatif.",
  strukturMateri:
    "Bertahap dari ekspresi tanpa kurung dengan dua operasi, ke ekspresi dengan tiga operasi, ekspresi dengan tanda kurung, hingga masalah kontekstual yang melibatkan operasi campuran.",
  integrasiNilai:
    "Pembelajaran menanamkan nilai tanggung jawab, kerja sama, ketelitian, dan kemandirian dalam menyelesaikan masalah kontekstual yang kompleks.",
  dimensiProfil: [
    {
      title: "Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia",
      desc: "Melalui doa pembuka, bersyukur atas kemampuan akal, serta menjaga sikap sopan dan santun selama diskusi kelompok.",
    },
    {
      title: "Bergotong Royong (Kolaborasi)",
      desc: "Melalui pembagian peran dalam menyelesaikan masalah kontekstual yang kompleks dan saling membantu memahami urutan operasi.",
    },
    {
      title: "Bernalar Kritis",
      desc: "Melalui kegiatan menganalisis langkah-langkah penyelesaian, memverifikasi kebenaran tiap tahap, dan mengevaluasi strategi yang paling efisien.",
    },
    {
      title: "Mandiri",
      desc: "Melalui penyelesaian individu pada tahap awal sebelum kolaborasi kelompok dan refleksi mandiri di akhir pembelajaran.",
    },
  ],
  capaianPembelajaran:
    "Membaca, menulis, dan membandingkan bilangan bulat serta menerapkan operasi aritmetika pada bilangan bulat (termasuk operasi hitung campuran) untuk menyelesaikan masalah kontekstual yang menuntut estimasi dan perencanaan.",
  tujuanPembelajaran:
    "Peserta didik dapat menyelesaikan operasi hitung campuran pada bilangan bulat dengan memperhatikan urutan operasi dan tanda kurung, serta menerapkannya dalam menyelesaikan masalah kontekstual.",
  topikPembelajaran:
    "Urutan Operasi Hitung, Tanda Kurung, Sifat-sifat Operasi pada Bilangan Bulat, dan Aplikasi Operasi Hitung Campuran dalam Kehidupan Sehari-hari.",
  praktikPedagogis: [
    { label: "Model", value: "Problem Based Learning (PBL)" },
    { label: "Pendekatan", value: "Saintifik" },
    { label: "Metode", value: "Diskusi kelompok, presentasi, studi kasus, dan penugasan kontekstual." },
  ],
  praktikPedagogisCatatan:
    "PBL menuntut murid memecahkan masalah kontekstual yang melibatkan beberapa operasi sekaligus, sehingga kolaborasi, penalaran kritis, dan kemandirian terlatih sekaligus.",
  kemitraan: [
    {
      title: "Ilmu Pengetahuan Sosial (IPS)",
      desc: "Konteks anggaran sederhana keluarga atau perhitungan transaksi belanja sebagai masalah autentik operasi hitung campuran.",
    },
    {
      title: "Pendidikan Pancasila (PPKn)",
      desc: "Penanaman sikap tanggung jawab dan kerja sama saat menyelesaikan masalah kelompok.",
    },
  ],
  budayaBelajar:
    "Iklim kelas yang kolaboratif, terbuka untuk berbagai strategi penyelesaian, dan menghargai proses berpikir tiap murid.",
  ruangFisik:
    "Meja diatur berkelompok 4-5 murid, dilengkapi papan tulis kecil, kartu strategi, dan akses ke kalkulator untuk verifikasi.",
  pemanfaatanDigital: [
    "Aplikasi NUMATIK untuk menyajikan masalah autentik, kalkulator interaktif, dan quiz formatif.",
  ],
  apersepsi:
    "Guru menyajikan masalah: \"Bu Ani membeli 5 buku seharga Rp4.000 per buku, lalu mendapat diskon Rp3.000. Berapa total uang yang harus dibayarkan?\" sebagai pemantik untuk operasi hitung campuran.",
  langkahInti: [
    {
      fase: "Orientasi Peserta Didik pada Masalah",
      color: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-300/40",
      text: "text-cyan-100",
      items: [
        "Guru menyajikan masalah autentik berbentuk transaksi belanja atau perhitungan skor yang melibatkan beberapa operasi.",
        "Murid memahami masalah dan menuliskan informasi yang relevan.",
      ],
    },
    {
      fase: "Mengorganisasi Peserta Didik untuk Belajar",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-300/40",
      text: "text-emerald-100",
      items: [
        "Murid dikelompokkan secara heterogen.",
        "Setiap kelompok membagi peran dan menyepakati strategi awal pemecahan masalah.",
      ],
    },
    {
      fase: "Membimbing Penyelidikan Kelompok",
      color: "from-violet-500/20 to-indigo-500/10",
      border: "border-violet-300/40",
      text: "text-violet-100",
      items: [
        "Murid menyusun ekspresi matematika dari masalah dan menyelesaikan dengan urutan operasi.",
        "Guru memberikan pertanyaan pemandu, terutama untuk peran tanda kurung.",
      ],
    },
    {
      fase: "Mengembangkan dan Menyajikan Hasil Karya",
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-300/40",
      text: "text-amber-100",
      items: [
        "Setiap kelompok menyajikan langkah-langkah penyelesaian dan strategi yang dipilih.",
        "Kelompok lain mengkritisi dan memberi alternatif penyelesaian.",
      ],
    },
    {
      fase: "Menganalisis & Mengevaluasi Proses Pemecahan Masalah",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-300/40",
      text: "text-pink-100",
      items: [
        "Guru bersama murid mengevaluasi strategi yang paling efisien untuk operasi hitung campuran.",
        "Murid merefleksikan kebermaknaan kolaborasi dan mengevaluasi peran masing-masing.",
      ],
    },
  ],
  langkahPenutup: [
    "Guru memberi apresiasi kepada kelompok atas kontribusi dan kualitas presentasi.",
    "Guru memberikan postes singkat untuk mengukur ketercapaian tujuan pembelajaran.",
    "Guru memberi PR berupa soal kontekstual operasi hitung campuran.",
    "Guru menginformasikan materi KPK dan FPB untuk pertemuan berikutnya.",
  ],
  asesmen: [
    {
      title: "Asesmen sebagai Pembelajaran (Assessment as Learning)",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-300/40",
      text: "text-emerald-100",
      items: [
        "Penilaian Diri: Murid menilai sendiri penguasaan urutan operasi dan kontribusinya dalam kelompok.",
        "Penilaian Sejawat: Murid memberi umpan balik atas peran rekan satu kelompok.",
      ],
    },
    {
      title: "Asesmen untuk Pembelajaran (Assessment for Learning)",
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-300/40",
      text: "text-amber-100",
      items: [
        "Observasi: Guru mengamati proses penyelidikan, pembagian tugas, dan diskusi.",
        "Tanya Jawab: Guru memandu pemahaman urutan operasi melalui pertanyaan reflektif.",
        "LKPD: Hasil pekerjaan kelompok dijadikan dasar perbaikan instruksi.",
      ],
    },
    {
      title: "Asesmen Hasil Pembelajaran (Assessment of Learning)",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-300/40",
      text: "text-pink-100",
      items: [
        "Tes Tertulis: Soal operasi hitung campuran termasuk soal kontekstual berbasis transaksi.",
        "Penilaian Proyek: Mini-proyek penyusunan anggaran sederhana yang melibatkan operasi hitung campuran.",
      ],
    },
  ],
  backPath: "/ruang-untuk-guru/rpp/bilangan-bulat",
  backLabel: "Kembali ke RPP Bilangan Bulat",
};

const RPPOperasiCampuranBilanganBulatPage = () => <RPPDetailPage data={data} />;

export default RPPOperasiCampuranBilanganBulatPage;
