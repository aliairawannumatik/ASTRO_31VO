import { Network } from "lucide-react";
import RPPDetailPage, { type RPPDetailData } from "@/components/RPPDetailPage";

const data: RPPDetailData = {
  topicTitle: "KPK dan FPB",
  topicIcon: Network,
  theme: {
    badgeBorder: "border-fuchsia-300/40",
    badgeBg: "bg-fuchsia-500/10",
    badgeText: "text-fuchsia-100",
    subtitle: "text-fuchsia-200",
  },
  alokasiWaktu: "3 x 40 JP",
  identifikasi:
    "Guru mengidentifikasi penguasaan murid tentang faktor dan kelipatan bilangan sebagai prasyarat. Guru juga memetakan minat dan latar belakang sosial budaya untuk menyajikan konteks Discovery Learning yang beragam dan inklusif.",
  jenisPengetahuan: [
    {
      label: "Faktual",
      desc: "Pengertian faktor, kelipatan, bilangan prima, KPK, dan FPB beserta lambangnya.",
      color: "text-cyan-200",
      bg: "bg-cyan-500/10",
      border: "border-cyan-300/40",
    },
    {
      label: "Konseptual",
      desc: "Konsep KPK sebagai kelipatan persekutuan terkecil dan FPB sebagai faktor persekutuan terbesar dari dua bilangan atau lebih.",
      color: "text-violet-200",
      bg: "bg-violet-500/10",
      border: "border-violet-300/40",
    },
    {
      label: "Prosedural",
      desc: "Langkah menentukan KPK dan FPB dengan faktorisasi prima, pohon faktor, dan tabel pembagian.",
      color: "text-amber-200",
      bg: "bg-amber-500/10",
      border: "border-amber-300/40",
    },
  ],
  relevansi:
    "KPK dipakai untuk menentukan kapan dua kejadian berulang akan bertemu kembali (jadwal piket, lampu lalu lintas), sedangkan FPB dipakai untuk membagi benda dalam jumlah sama besar tanpa sisa.",
  tingkatKesulitan:
    "Sedang. Murid sudah mengenal faktor dan kelipatan, namun perlu memahami perbedaan KPK dan FPB serta memilih strategi yang tepat untuk masalah kontekstual.",
  strukturMateri:
    "Bertahap dari konsep faktor & kelipatan, faktor persekutuan & kelipatan persekutuan, faktorisasi prima, hingga aplikasi KPK-FPB dalam masalah sehari-hari.",
  integrasiNilai:
    "Pembelajaran menanamkan nilai keberagaman, ketelitian, kemandirian, kreativitas, dan kepedulian sosial melalui pemilihan konteks budaya dan kehidupan masyarakat.",
  dimensiProfil: [
    {
      title: "Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia",
      desc: "Melalui doa pembuka, bersyukur atas keteraturan ciptaan Tuhan yang dapat dianalisis melalui matematika, dan menjaga akhlak mulia dalam berdiskusi.",
    },
    {
      title: "Berkebinekaan Global",
      desc: "Melalui pemilihan konteks masalah dari berbagai budaya nusantara (jadwal kegiatan adat, pembagian hasil panen, jadwal lampion festival) yang menumbuhkan kesadaran akan keberagaman.",
    },
    {
      title: "Bernalar Kritis",
      desc: "Melalui kegiatan mengidentifikasi pola faktor & kelipatan, mengevaluasi strategi penentuan KPK/FPB, dan menyimpulkan strategi yang paling efisien.",
    },
    {
      title: "Kreatif",
      desc: "Melalui kebebasan murid memilih representasi (pohon faktor, tabel, faktorisasi prima) dan merancang masalah kontekstual sendiri.",
    },
  ],
  capaianPembelajaran:
    "Membaca, menulis, dan membandingkan bilangan bulat, menerapkan operasi aritmetika, serta menggunakan konsep faktor, kelipatan, KPK, dan FPB dalam menyelesaikan masalah kontekstual.",
  tujuanPembelajaran:
    "Peserta didik dapat menentukan KPK dan FPB dari dua atau tiga bilangan menggunakan berbagai strategi (faktorisasi prima, pohon faktor, tabel) dan menerapkannya dalam menyelesaikan masalah kontekstual.",
  topikPembelajaran:
    "Faktor dan Kelipatan, Bilangan Prima, Faktorisasi Prima, KPK, FPB, dan Aplikasi KPK-FPB dalam Kehidupan Sehari-hari.",
  praktikPedagogis: [
    { label: "Model", value: "Discovery Learning" },
    { label: "Pendekatan", value: "Saintifik" },
    { label: "Metode", value: "Eksperimen, diskusi kelompok, tanya jawab, dan penugasan." },
  ],
  praktikPedagogisCatatan:
    "Discovery Learning memberi pengalaman menemukan strategi paling efisien untuk menentukan KPK dan FPB melalui 6 sintaks (Stimulation hingga Generalization), dengan konteks dari kekayaan budaya nusantara.",
  kemitraan: [
    {
      title: "Ilmu Pengetahuan Sosial (IPS)",
      desc: "Konteks jadwal kegiatan masyarakat, festival budaya, atau pembagian hasil panen sebagai masalah autentik KPK & FPB.",
    },
    {
      title: "Seni Budaya",
      desc: "Konteks pengulangan pola motif batik atau ritme gamelan sebagai contoh aplikasi kelipatan dan KPK.",
    },
  ],
  budayaBelajar:
    "Iklim eksploratif yang merayakan keragaman strategi murid dan konteks budaya yang dibawa, dengan menjunjung saling menghormati.",
  ruangFisik:
    "Meja kelompok 4-5 murid, dilengkapi LKPD eksplorasi, alat tulis warna untuk pohon faktor, serta kartu bilangan.",
  pemanfaatanDigital: [
    "Aplikasi NUMATIK untuk simulasi pohon faktor, animasi kelipatan, serta quiz interaktif berkonteks budaya nusantara.",
  ],
  apersepsi:
    "Guru menyajikan cerita: \"Lampion merah dinyalakan tiap 4 hari sekali, lampion kuning tiap 6 hari sekali. Hari ini keduanya menyala bersama, kapan keduanya akan menyala bersama lagi?\" untuk memantik penemuan konsep KPK.",
  langkahInti: [
    {
      fase: "Stimulation (Pemberian Rangsangan)",
      color: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-300/40",
      text: "text-cyan-100",
      items: [
        "Guru menyajikan video singkat festival budaya yang melibatkan jadwal berulang.",
        "Murid mencatat pertanyaan dan rasa ingin tahu yang muncul tentang pola perulangan.",
      ],
    },
    {
      fase: "Problem Statement (Identifikasi Masalah)",
      color: "from-violet-500/20 to-indigo-500/10",
      border: "border-violet-300/40",
      text: "text-violet-100",
      items: [
        "Murid merumuskan pertanyaan: \"Bagaimana menentukan kapan dua kejadian berulang akan bertemu lagi?\" dan \"Bagaimana membagi benda secara merata?\"",
        "Murid mencatat dugaan strategi yang akan dicoba.",
      ],
    },
    {
      fase: "Data Collection (Pengumpulan Data)",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-300/40",
      text: "text-emerald-100",
      items: [
        "Murid mendaftar kelipatan dan faktor dari beberapa pasangan bilangan menggunakan tabel atau pohon faktor.",
        "Murid mencatat pola yang muncul dari masing-masing strategi.",
      ],
    },
    {
      fase: "Data Processing (Pengolahan Data)",
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-300/40",
      text: "text-amber-100",
      items: [
        "Murid berdiskusi membandingkan strategi pohon faktor, tabel pembagian, dan faktorisasi prima.",
        "Murid memilih strategi paling efisien sesuai jenis bilangan.",
      ],
    },
    {
      fase: "Verification (Pembuktian)",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-300/40",
      text: "text-pink-100",
      items: [
        "Murid memverifikasi strategi terpilih pada beberapa soal kontekstual baru.",
        "Guru memberi umpan balik dan meluruskan miskonsepsi yang ditemukan.",
      ],
    },
    {
      fase: "Generalization (Menarik Kesimpulan)",
      color: "from-fuchsia-500/20 to-purple-500/10",
      border: "border-fuchsia-300/40",
      text: "text-fuchsia-100",
      items: [
        "Murid bersama guru menyimpulkan langkah umum menentukan KPK dan FPB.",
        "Murid merancang satu masalah kontekstual budaya yang dapat diselesaikan dengan KPK atau FPB sebagai unjuk kreativitasnya.",
      ],
    },
  ],
  langkahPenutup: [
    "Guru memberi apresiasi atas kreativitas dan keragaman strategi yang muncul.",
    "Guru memberikan postes singkat tentang penentuan KPK dan FPB.",
    "Guru memberi PR berupa masalah kontekstual KPK/FPB.",
    "Guru menginformasikan materi pecahan untuk pertemuan berikutnya sebagai lanjutan dari konsep bilangan.",
  ],
  asesmen: [
    {
      title: "Asesmen sebagai Pembelajaran (Assessment as Learning)",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-300/40",
      text: "text-emerald-100",
      items: [
        "Penilaian Diri: Murid menilai pemahaman konsep KPK & FPB dan kemampuannya memilih strategi.",
        "Penilaian Sejawat: Murid saling memberi tanggapan terhadap kreativitas kontekstualisasi masalah.",
      ],
    },
    {
      title: "Asesmen untuk Pembelajaran (Assessment for Learning)",
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-300/40",
      text: "text-amber-100",
      items: [
        "Observasi: Guru mengamati eksplorasi strategi dan diskusi kelompok.",
        "Tanya Jawab: Guru menggali pemahaman saat tahap Verification.",
        "LKPD: Hasil eksplorasi LKPD dijadikan dasar umpan balik formatif.",
      ],
    },
    {
      title: "Asesmen Hasil Pembelajaran (Assessment of Learning)",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-300/40",
      text: "text-pink-100",
      items: [
        "Tes Tertulis: Soal penentuan KPK & FPB dan aplikasinya pada masalah kontekstual.",
        "Penilaian Produk: Soal kontekstual budaya rancangan murid sendiri yang dinilai dengan rubrik kreativitas.",
      ],
    },
  ],
  backPath: "/ruang-untuk-guru/rpp/bilangan-bulat",
  backLabel: "Kembali ke RPP Bilangan Bulat",
};

const RPPKpkFpbPage = () => <RPPDetailPage data={data} />;

export default RPPKpkFpbPage;
