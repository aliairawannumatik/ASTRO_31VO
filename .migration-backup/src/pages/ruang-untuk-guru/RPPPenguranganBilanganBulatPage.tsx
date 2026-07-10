import { Minus } from "lucide-react";
import RPPDetailPage, { type RPPDetailData } from "@/components/RPPDetailPage";

const data: RPPDetailData = {
  topicTitle: "Pengurangan Bilangan Bulat",
  topicIcon: Minus,
  theme: {
    badgeBorder: "border-cyan-300/40",
    badgeBg: "bg-cyan-500/10",
    badgeText: "text-cyan-100",
    subtitle: "text-cyan-200",
  },
  alokasiWaktu: "2 x 40 JP",
  identifikasi:
    "Guru mengidentifikasi kemampuan awal murid melalui pretes singkat tentang penjumlahan bilangan bulat sebagai prasyarat. Guru juga memetakan minat dan gaya belajar murid agar pembelajaran Discovery Learning dapat diakomodasi sesuai kebutuhan masing-masing kelompok.",
  jenisPengetahuan: [
    {
      label: "Faktual",
      desc: "Notasi pengurangan, lambang \"-\", serta pengertian lawan (invers) suatu bilangan bulat.",
      color: "text-cyan-200",
      bg: "bg-cyan-500/10",
      border: "border-cyan-300/40",
    },
    {
      label: "Konseptual",
      desc: "Konsep pengurangan sebagai penjumlahan dengan lawan bilangan, dan representasi pada garis bilangan.",
      color: "text-violet-200",
      bg: "bg-violet-500/10",
      border: "border-violet-300/40",
    },
    {
      label: "Prosedural",
      desc: "Langkah-langkah mengubah operasi pengurangan menjadi penjumlahan dengan lawan, lalu menyelesaikannya.",
      color: "text-amber-200",
      bg: "bg-amber-500/10",
      border: "border-amber-300/40",
    },
  ],
  relevansi:
    "Pengurangan bilangan bulat banyak digunakan dalam kehidupan sehari-hari, misalnya menghitung selisih suhu pagi dan siang, perubahan ketinggian, selisih saldo tabungan, atau perubahan posisi lift dari lantai dasar.",
  tingkatKesulitan:
    "Sedang. Murid sudah memiliki dasar penjumlahan, namun perlu memahami konsep \"lawan bilangan\" agar tidak tertukar pada operasi dengan tanda negatif berurutan.",
  strukturMateri:
    "Bertahap dari pengurangan dua bilangan bulat positif, positif dengan negatif, negatif dengan positif, hingga negatif dengan negatif menggunakan garis bilangan dan aturan lawan.",
  integrasiNilai:
    "Selama pembelajaran ditanamkan nilai ketelitian, kejujuran dalam mengerjakan, rasa ingin tahu, serta kemandirian dalam menemukan pola pengurangan bilangan bulat.",
  dimensiProfil: [
    {
      title: "Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia",
      desc: "Melalui doa pembuka, bersyukur atas kemampuan menalar, serta menjaga akhlak baik selama berdiskusi dan menanggapi pendapat teman.",
    },
    {
      title: "Bernalar Kritis",
      desc: "Melalui kegiatan mengamati pola, merumuskan dugaan, mencoba beberapa contoh, dan menarik kesimpulan tentang aturan pengurangan bilangan bulat.",
    },
    {
      title: "Mandiri",
      desc: "Melalui pengumpulan data dan penyelesaian LKPD secara individu sebelum dibahas dalam kelompok.",
    },
    {
      title: "Kreatif",
      desc: "Melalui kebebasan murid memilih cara representasi (garis bilangan, kartu positif-negatif, atau aturan lawan) untuk membuktikan jawaban.",
    },
  ],
  capaianPembelajaran:
    "Membaca, menulis, dan membandingkan bilangan bulat serta menerapkan operasi aritmetika pada bilangan bulat untuk menyelesaikan masalah kontekstual, termasuk yang berkaitan dengan literasi finansial sederhana.",
  tujuanPembelajaran:
    "Peserta didik dapat menjelaskan konsep pengurangan bilangan bulat sebagai penjumlahan dengan lawan, serta menyelesaikan masalah kontekstual yang berkaitan dengan pengurangan bilangan bulat.",
  topikPembelajaran:
    "Konsep Lawan Bilangan, Pengurangan pada Garis Bilangan, Aturan Pengurangan Bilangan Bulat, dan Aplikasi Pengurangan Bilangan Bulat dalam Konteks Sehari-hari.",
  praktikPedagogis: [
    { label: "Model", value: "Discovery Learning" },
    { label: "Pendekatan", value: "Saintifik" },
    { label: "Metode", value: "Eksperimen, diskusi kelompok, tanya jawab, dan penugasan." },
  ],
  praktikPedagogisCatatan:
    "Discovery Learning memandu murid menemukan sendiri aturan pengurangan bilangan bulat melalui 6 sintaks (Stimulation hingga Generalization), sehingga konsep menjadi lebih bermakna dan tertanam kuat.",
  kemitraan: [
    {
      title: "Ilmu Pengetahuan Alam (IPA)",
      desc: "Konsep selisih suhu antara dua tempat atau dua waktu pengukuran sebagai konteks nyata pengurangan bilangan bulat.",
    },
    {
      title: "Ilmu Pengetahuan Sosial (IPS)",
      desc: "Konsep selisih ketinggian wilayah, perubahan jumlah penduduk, atau perubahan saldo digunakan untuk soal kontekstual.",
    },
  ],
  budayaBelajar:
    "Iklim kelas yang aman dan saling menghargai sehingga murid berani mengajukan dugaan, salah dianggap sebagai bagian dari proses penemuan, dan setiap pendapat dihargai.",
  ruangFisik:
    "Meja diatur berkelompok 4-5 orang dilengkapi kartu bilangan positif-negatif dan papan garis bilangan untuk menunjang aktivitas penemuan.",
  pemanfaatanDigital: [
    "Penggunaan aplikasi NUMATIK untuk simulasi garis bilangan interaktif, animasi pengurangan, serta quiz formatif.",
  ],
  apersepsi:
    "Guru menampilkan ilustrasi termometer di pegunungan: \"Pagi suhu 5°C, malam turun menjadi -3°C, berapa selisih suhunya?\" untuk menggugah rasa ingin tahu murid tentang pengurangan bilangan bulat.",
  langkahInti: [
    {
      fase: "Stimulation (Pemberian Rangsangan)",
      color: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-300/40",
      text: "text-cyan-100",
      items: [
        "Guru menyajikan gambar termometer dan video singkat tentang perubahan suhu di kutub.",
        "Murid diminta mengamati dan menuliskan hal-hal menarik yang dapat dihitung dengan operasi pengurangan.",
      ],
    },
    {
      fase: "Problem Statement (Identifikasi Masalah)",
      color: "from-violet-500/20 to-indigo-500/10",
      border: "border-violet-300/40",
      text: "text-violet-100",
      items: [
        "Murid merumuskan pertanyaan, misalnya: \"Bagaimana cara menghitung 5 - (-3)?\"",
        "Guru memfasilitasi sehingga muncul dugaan-dugaan awal yang ditulis pada LKPD.",
      ],
    },
    {
      fase: "Data Collection (Pengumpulan Data)",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-300/40",
      text: "text-emerald-100",
      items: [
        "Setiap kelompok mencoba beberapa pasangan bilangan bulat menggunakan kartu positif-negatif dan garis bilangan.",
        "Murid mencatat hasil pengurangan untuk berbagai kombinasi bilangan positif dan negatif.",
      ],
    },
    {
      fase: "Data Processing (Pengolahan Data)",
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-300/40",
      text: "text-amber-100",
      items: [
        "Murid mengamati pola hasil dan mendiskusikan hubungan a - b dengan a + (-b).",
        "Murid menyusun tabel kesimpulan sementara di LKPD.",
      ],
    },
    {
      fase: "Verification (Pembuktian)",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-300/40",
      text: "text-pink-100",
      items: [
        "Murid menguji dugaannya pada soal-soal baru dan membandingkan dengan jawaban kelompok lain.",
        "Guru memberikan umpan balik dan meluruskan miskonsepsi yang ditemukan.",
      ],
    },
    {
      fase: "Generalization (Menarik Kesimpulan)",
      color: "from-fuchsia-500/20 to-purple-500/10",
      border: "border-fuchsia-300/40",
      text: "text-fuchsia-100",
      items: [
        "Murid bersama guru merumuskan aturan umum: a - b = a + (-b).",
        "Murid menuliskan refleksi singkat tentang strategi yang paling membantu mereka memahami pengurangan bilangan bulat.",
      ],
    },
  ],
  langkahPenutup: [
    "Guru memberikan apresiasi atas keaktifan murid dalam menemukan konsep.",
    "Guru memberikan postes singkat untuk mengukur ketercapaian tujuan pembelajaran.",
    "Guru memberikan PR latihan kontekstual mengenai pengurangan bilangan bulat.",
    "Guru menginformasikan materi perkalian bilangan bulat untuk pertemuan berikutnya.",
  ],
  asesmen: [
    {
      title: "Asesmen sebagai Pembelajaran (Assessment as Learning)",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-300/40",
      text: "text-emerald-100",
      items: [
        "Penilaian Diri: Murid menilai sendiri pemahaman konsep lawan bilangan dan aturan pengurangan.",
        "Penilaian Sejawat: Murid memberi umpan balik pada strategi pemecahan teman dalam kelompok.",
      ],
    },
    {
      title: "Asesmen untuk Pembelajaran (Assessment for Learning)",
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-300/40",
      text: "text-amber-100",
      items: [
        "Observasi: Guru mengamati kerja kelompok pada tahap Data Collection dan Data Processing.",
        "Tanya Jawab: Guru bertanya pada momen Verification untuk mengecek pemahaman.",
        "LKPD: Hasil pengisian LKPD dijadikan dasar perbaikan instruksi.",
      ],
    },
    {
      title: "Asesmen Hasil Pembelajaran (Assessment of Learning)",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-300/40",
      text: "text-pink-100",
      items: [
        "Tes Tertulis: Soal pengurangan bilangan bulat termasuk konteks nyata.",
        "Unjuk Kerja: Mempresentasikan strategi penemuan aturan pengurangan di depan kelas.",
      ],
    },
  ],
  backPath: "/ruang-untuk-guru/rpp/bilangan-bulat",
  backLabel: "Kembali ke RPP Bilangan Bulat",
};

const RPPPenguranganBilanganBulatPage = () => <RPPDetailPage data={data} />;

export default RPPPenguranganBilanganBulatPage;
