import { Divide } from "lucide-react";
import RPPDetailPage, { type RPPDetailData } from "@/components/RPPDetailPage";

const data: RPPDetailData = {
  topicTitle: "Pembagian Bilangan Bulat",
  topicIcon: Divide,
  theme: {
    badgeBorder: "border-pink-300/40",
    badgeBg: "bg-pink-500/10",
    badgeText: "text-pink-100",
    subtitle: "text-pink-200",
  },
  alokasiWaktu: "2 x 40 JP",
  identifikasi:
    "Guru mengidentifikasi kesiapan murid melalui pertanyaan tentang aturan tanda perkalian sebagai prasyarat pembagian. Guru juga memetakan gaya belajar untuk mengoptimalkan tahap pengumpulan dan pengolahan data dalam Discovery Learning.",
  jenisPengetahuan: [
    {
      label: "Faktual",
      desc: "Tanda pembagian (\u00f7 atau /), serta hubungan pembagian dengan perkalian sebagai operasi kebalikan.",
      color: "text-cyan-200",
      bg: "bg-cyan-500/10",
      border: "border-cyan-300/40",
    },
    {
      label: "Konseptual",
      desc: "Pembagian sebagai kebalikan perkalian, aturan tanda pembagian, dan pembagi yang tidak boleh nol.",
      color: "text-violet-200",
      bg: "bg-violet-500/10",
      border: "border-violet-300/40",
    },
    {
      label: "Prosedural",
      desc: "Langkah menentukan tanda hasil terlebih dahulu, lalu membagi nilai mutlaknya.",
      color: "text-amber-200",
      bg: "bg-amber-500/10",
      border: "border-amber-300/40",
    },
  ],
  relevansi:
    "Pembagian bilangan bulat digunakan dalam membagi rata kerugian/keuntungan, menentukan rata-rata perubahan suhu, atau membagi posisi pada garis bilangan secara merata.",
  tingkatKesulitan:
    "Sedang. Murid perlu memahami bahwa aturan tanda pembagian sama dengan perkalian, dan memahami mengapa pembagian dengan nol tidak terdefinisi.",
  strukturMateri:
    "Bertahap dari pembagian dua bilangan positif, positif dengan negatif, negatif dengan positif, hingga negatif dengan negatif, dilanjutkan dengan kasus pembagi nol.",
  integrasiNilai:
    "Menanamkan nilai ketelitian, ketekunan, kemandirian, dan kreativitas dalam menemukan pola serta merumuskan aturan pembagian bilangan bulat.",
  dimensiProfil: [
    {
      title: "Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia",
      desc: "Melalui doa pembuka, bersyukur atas keteraturan ilmu matematika, dan menjaga sikap jujur dalam mencatat hasil percobaan.",
    },
    {
      title: "Mandiri",
      desc: "Melalui aktivitas eksplorasi mandiri pada tahap data collection sebelum mendiskusikan hasilnya bersama kelompok.",
    },
    {
      title: "Bernalar Kritis",
      desc: "Melalui kegiatan menganalisis pola hasil pembagian, mengevaluasi dugaan awal, dan menyimpulkan aturan secara logis.",
    },
    {
      title: "Kreatif",
      desc: "Melalui keleluasaan murid memilih representasi (tabel, garis bilangan, atau hubungan dengan perkalian) untuk menemukan aturan pembagian.",
    },
  ],
  capaianPembelajaran:
    "Membaca, menulis, dan membandingkan bilangan bulat, serta menerapkan operasi aritmetika (termasuk pembagian) pada bilangan bulat untuk menyelesaikan masalah kontekstual.",
  tujuanPembelajaran:
    "Peserta didik dapat menjelaskan konsep pembagian bilangan bulat (termasuk aturan tanda dan ketentuan pembagi tidak nol) dan menyelesaikan masalah kontekstual yang berkaitan dengan pembagian bilangan bulat.",
  topikPembelajaran:
    "Pembagian sebagai Kebalikan Perkalian, Aturan Tanda Pembagian, Pembagi Nol, dan Aplikasi Pembagian Bilangan Bulat dalam Kehidupan Sehari-hari.",
  praktikPedagogis: [
    { label: "Model", value: "Discovery Learning" },
    { label: "Pendekatan", value: "Saintifik" },
    { label: "Metode", value: "Eksperimen, diskusi kelompok, tanya jawab, dan penugasan." },
  ],
  praktikPedagogisCatatan:
    "Discovery Learning memberi pengalaman menemukan sendiri aturan tanda pembagian dan alasan pembagi nol tidak terdefinisi melalui 6 sintaks (Stimulation hingga Generalization).",
  kemitraan: [
    {
      title: "Ilmu Pengetahuan Alam (IPA)",
      desc: "Konteks rata-rata perubahan suhu per jam selama beberapa jam pengamatan sebagai contoh kontekstual pembagian bilangan bulat.",
    },
    {
      title: "Ilmu Pengetahuan Sosial (IPS)",
      desc: "Konteks pembagian kerugian total kepada beberapa pihak yang menanggung sebagai aplikasi pembagian bilangan bulat negatif.",
    },
  ],
  budayaBelajar:
    "Iklim eksploratif yang menghargai pertanyaan dan rasa ingin tahu, dengan pembelajaran inklusif dan saling menghormati antar murid.",
  ruangFisik:
    "Meja kelompok 4-5 murid dilengkapi LKPD eksplorasi pembagian, kalkulator (untuk verifikasi), dan kartu bilangan bulat.",
  pemanfaatanDigital: [
    "Aplikasi NUMATIK untuk simulasi pembagian, kalkulator interaktif, dan quiz formatif.",
  ],
  apersepsi:
    "Guru menyajikan masalah: \"Selama 4 hari, suhu kota turun total 12°C. Berapa rata-rata penurunan suhu per harinya?\" untuk memancing rasa ingin tahu murid tentang pembagian bilangan bulat.",
  langkahInti: [
    {
      fase: "Stimulation (Pemberian Rangsangan)",
      color: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-300/40",
      text: "text-cyan-100",
      items: [
        "Guru menampilkan video singkat tentang perubahan suhu rata-rata di kutub.",
        "Murid menuliskan pertanyaan-pertanyaan yang muncul terkait pembagian bilangan bulat.",
      ],
    },
    {
      fase: "Problem Statement (Identifikasi Masalah)",
      color: "from-violet-500/20 to-indigo-500/10",
      border: "border-violet-300/40",
      text: "text-violet-100",
      items: [
        "Murid merumuskan dugaan tentang aturan tanda pembagian dengan menghubungkannya pada perkalian.",
        "Murid juga merumuskan pertanyaan: \"Apakah hasil pembagian dengan nol selalu nol?\"",
      ],
    },
    {
      fase: "Data Collection (Pengumpulan Data)",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-300/40",
      text: "text-emerald-100",
      items: [
        "Murid melakukan eksplorasi mandiri dengan mengisi tabel hasil pembagian bilangan bulat.",
        "Murid mencoba kasus pembagi nol dan mencatat keganjilan yang muncul.",
      ],
    },
    {
      fase: "Data Processing (Pengolahan Data)",
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-300/40",
      text: "text-amber-100",
      items: [
        "Murid berdiskusi dalam kelompok untuk merumuskan aturan tanda pembagian dari pola hasil.",
        "Murid menyusun argumentasi mengapa pembagi nol tidak terdefinisi.",
      ],
    },
    {
      fase: "Verification (Pembuktian)",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-300/40",
      text: "text-pink-100",
      items: [
        "Murid memverifikasi rumusan aturan dengan soal-soal baru.",
        "Guru memberi umpan balik dan meluruskan miskonsepsi.",
      ],
    },
    {
      fase: "Generalization (Menarik Kesimpulan)",
      color: "from-fuchsia-500/20 to-purple-500/10",
      border: "border-fuchsia-300/40",
      text: "text-fuchsia-100",
      items: [
        "Murid bersama guru merumuskan aturan tanda pembagian dan ketentuan pembagi tidak boleh nol.",
        "Murid menuliskan refleksi pengalaman menemukan konsep secara mandiri dan kelompok.",
      ],
    },
  ],
  langkahPenutup: [
    "Guru memberi apresiasi atas eksplorasi dan refleksi murid.",
    "Guru memberikan postes singkat untuk mengukur ketercapaian tujuan.",
    "Guru memberi PR latihan kontekstual pembagian bilangan bulat.",
    "Guru menginformasikan materi operasi hitung campuran untuk pertemuan berikutnya.",
  ],
  asesmen: [
    {
      title: "Asesmen sebagai Pembelajaran (Assessment as Learning)",
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-300/40",
      text: "text-emerald-100",
      items: [
        "Penilaian Diri: Murid menilai pemahaman aturan tanda pembagian dan kemampuan kemandirian belajarnya.",
        "Penilaian Sejawat: Murid saling memberi tanggapan terhadap argumentasi rekan dalam kelompok.",
      ],
    },
    {
      title: "Asesmen untuk Pembelajaran (Assessment for Learning)",
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-300/40",
      text: "text-amber-100",
      items: [
        "Observasi: Guru mengamati eksplorasi mandiri dan diskusi kelompok.",
        "Tanya Jawab: Guru menggali pemahaman saat tahap Verification.",
        "LKPD: Pengisian LKPD digunakan untuk memberi umpan balik.",
      ],
    },
    {
      title: "Asesmen Hasil Pembelajaran (Assessment of Learning)",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-300/40",
      text: "text-pink-100",
      items: [
        "Tes Tertulis: Soal pembagian bilangan bulat termasuk soal kontekstual.",
        "Unjuk Kerja: Mempresentasikan kesimpulan tentang aturan pembagian bilangan bulat.",
      ],
    },
  ],
  backPath: "/ruang-untuk-guru/rpp/bilangan-bulat",
  backLabel: "Kembali ke RPP Bilangan Bulat",
};

const RPPPembagianBilanganBulatPage = () => <RPPDetailPage data={data} />;

export default RPPPembagianBilanganBulatPage;
