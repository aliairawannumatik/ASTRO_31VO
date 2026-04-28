import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  School,
  User,
  Calendar,
  Clock,
  GraduationCap,
  BookOpen,
  Target,
  Layers,
  ClipboardCheck,
  Lightbulb,
  Heart,
  Sparkles,
  Globe,
  Monitor,
  Play,
  Compass,
  CheckSquare,
  Search,
} from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const identitas = [
  { label: "Penyusun", value: "Irawan Sutiawan, M.Pd", icon: User },
  { label: "Sekolah", value: "Sekolah Menengah Pertama", icon: School },
  { label: "Kelas / Fase", value: "IX / D", icon: GraduationCap },
  { label: "Tahun Ajaran", value: "2025 - 2026", icon: Calendar },
  { label: "Alokasi Waktu", value: "2 x 40 JP", icon: Clock },
  { label: "Topik", value: "Penjumlahan Bilangan Bulat", icon: Plus },
];

const jenisPengetahuan = [
  {
    label: "Faktual",
    desc: "Definisi bilangan bulat, simbol, dan cara membacanya.",
    color: "text-cyan-200",
    bg: "bg-cyan-500/10",
    border: "border-cyan-300/40",
  },
  {
    label: "Konseptual",
    desc: "Konsep bilangan bulat positif, nol, dan negatif, serta konsep garis bilangan.",
    color: "text-violet-200",
    bg: "bg-violet-500/10",
    border: "border-violet-300/40",
  },
  {
    label: "Prosedural",
    desc: "Langkah-langkah dalam operasi penjumlahan bilangan bulat baik tanpa maupun dengan bantuan garis bilangan.",
    color: "text-amber-200",
    bg: "bg-amber-500/10",
    border: "border-amber-300/40",
  },
];

const dimensiProfil = [
  {
    title: "Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia",
    desc: "Melalui kegiatan berdoa di awal pembelajaran, bersyukur atas nikmat akal, dan refleksi terhadap keteraturan alam semesta.",
  },
  {
    title: "Bernalar Kritis",
    desc: "Melalui kegiatan menemukan sendiri konsep penjumlahan bilangan bulat dengan menyelidiki pola, menguji dugaan, dan menarik kesimpulan secara mandiri.",
  },
  {
    title: "Kreatif",
    desc: "Melalui kegiatan menemukan beragam cara penyelesaian masalah penjumlahan bilangan bulat, baik dengan garis bilangan maupun konteks kehidupan sehari-hari.",
  },
  {
    title: "Kolaborasi",
    desc: "Melalui kerja kelompok dalam fase pengumpulan dan pengolahan data hingga pembuktian hasil temuan.",
  },
  {
    title: "Mandiri",
    desc: "Melalui penugasan individu dan refleksi mandiri terhadap proses menemukan konsep.",
  },
];

const praktikPedagogis = [
  { label: "Model", value: "Discovery Learning" },
  { label: "Pendekatan", value: "Saintifik" },
  { label: "Metode", value: "Tanya jawab, eksplorasi, diskusi kelompok, dan presentasi temuan." },
];

const kemitraan = [
  {
    title: "Ilmu Pengetahuan Alam (IPA)",
    desc: "Konsep suhu, ketinggian, dan kedalaman air digunakan sebagai konteks apersepsi yang kontekstual.",
  },
  {
    title: "Ilmu Pengetahuan Sosial (IPS)",
    desc: "Konsep utang piutang atau sejarah suhu di suatu tempat dapat digunakan sebagai contoh soal.",
  },
];

const pemanfaatanDigital = [
  "Penggunaan aplikasi NUMATIK untuk presentasi konsep dan contoh, presentasi, video dan quiz.",
];

const langkahAwal = [
  "Guru mengucapkan salam dan memimpin doa.",
  "Guru mengecek kehadiran dan kesiapan fisik serta psikis murid.",
  "Guru membuat kesepakatan kelas.",
  "Guru menginformasikan tujuan pembelajaran dan kegiatan yang akan dilaksanakan.",
  "Guru menginformasikan mengenai sistem penilaian selama pembelajaran.",
  "Apersepsi Kontekstual: Guru memancing rasa ingin tahu murid dengan tanya jawab tentang suhu di Puncak Jaya atau ketinggian tempat di bawah permukaan laut. Guru mengarahkan murid pada kesadaran akan perlunya bilangan baru untuk menyatakan nilai di bawah nol.",
];

const langkahInti = [
  {
    fase: "1. Stimulation (Pemberian Rangsangan)",
    color: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-300/40",
    text: "text-cyan-100",
    items: [
      "Guru menayangkan video / animasi singkat tentang perubahan suhu (misal: suhu pagi 5°C, lalu turun 8°C) atau permainan ular tangga dengan langkah maju-mundur.",
      "Guru menyajikan beberapa permasalahan terbuka, misalnya: 'Jika seekor ikan berada di kedalaman 6 meter lalu naik 4 meter, di kedalaman berapakah ia sekarang?'",
      "Murid diberi waktu untuk mengamati dan menuliskan hal-hal menarik yang ingin mereka selidiki.",
    ],
  },
  {
    fase: "2. Problem Statement (Identifikasi Masalah)",
    color: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-300/40",
    text: "text-amber-100",
    items: [
      "Guru membagi murid ke dalam kelompok kecil (4-5 orang) dan membagikan LKPD.",
      "Setiap kelompok merumuskan pertanyaan/dugaan, misalnya: 'Bagaimana cara menjumlahkan dua bilangan bulat yang berbeda tanda?' atau 'Apakah hasil 5 + (-3) sama dengan -3 + 5?'",
      "Guru memfasilitasi murid menentukan satu pertanyaan utama yang akan diselidiki.",
    ],
  },
  {
    fase: "3. Data Collection (Pengumpulan Data)",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-300/40",
    text: "text-emerald-100",
    items: [
      "Murid menggunakan media garis bilangan, kartu positif-negatif, atau aplikasi NUMATIK untuk mencoba berbagai operasi penjumlahan bilangan bulat.",
      "Murid mencatat hasil percobaan dalam tabel pada LKPD: bilangan pertama, bilangan kedua, prosesnya, dan hasilnya.",
      "Guru berkeliling memberikan pertanyaan pemandu tanpa langsung memberi jawaban.",
    ],
  },
  {
    fase: "4. Data Processing (Pengolahan Data)",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-300/40",
    text: "text-violet-100",
    items: [
      "Murid mendiskusikan pola yang muncul dari tabel hasil percobaan, misalnya: kapan hasilnya positif, kapan negatif, dan kapan nol.",
      "Murid mengelompokkan kasus berdasarkan tanda bilangan: positif + positif, negatif + negatif, dan beda tanda.",
      "Setiap kelompok menyusun rumusan sementara aturan penjumlahan bilangan bulat dengan kalimat sendiri.",
    ],
  },
  {
    fase: "5. Verification (Pembuktian)",
    color: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-300/40",
    text: "text-rose-100",
    items: [
      "Setiap kelompok mempresentasikan dugaan/rumusan mereka di depan kelas.",
      "Kelompok lain menguji rumusan tersebut dengan contoh soal baru, lalu memberikan tanggapan.",
      "Guru memfasilitasi diskusi konfirmasi dan meluruskan miskonsepsi yang ditemukan.",
    ],
  },
  {
    fase: "6. Generalization (Menarik Kesimpulan)",
    color: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-300/40",
    text: "text-blue-100",
    items: [
      "Murid bersama guru merumuskan kesimpulan umum tentang aturan penjumlahan bilangan bulat.",
      "Murid menerapkan kesimpulan tersebut pada beberapa soal latihan kontekstual, baik secara individu maupun kelompok.",
      "Guru bertanya kepada murid tentang pesan/kesan dari pembelajaran hari ini melalui Google Form yang sudah disediakan linknya.",
    ],
  },
];

const langkahPenutup = [
  "Setiap kelompok diberikan penghargaan atas partisipasi mereka selama proses penemuan konsep.",
  "Guru memberikan postes singkat untuk mengetahui ketercapaian tujuan pembelajaran.",
  "Guru memberikan PR untuk penguatan konsep penjumlahan bilangan bulat.",
  "Guru menginformasikan materi yang akan dipelajari pada pertemuan berikutnya.",
];

const asesmen = [
  {
    title: "Asesmen sebagai Pembelajaran (Assessment as Learning)",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-300/40",
    text: "text-emerald-100",
    items: [
      "Penilaian Diri: Murid merefleksikan proses penemuan dan pemahaman mereka terhadap konsep penjumlahan bilangan bulat.",
      "Penilaian Sejawat: Murid saling memberikan umpan balik atas dugaan/rumusan yang dipresentasikan dalam kelompok.",
    ],
  },
  {
    title: "Asesmen untuk Pembelajaran (Assessment for Learning)",
    color: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-300/40",
    text: "text-amber-100",
    items: [
      "Observasi: Guru mengamati keterlibatan murid pada setiap fase Discovery Learning, terutama saat pengumpulan dan pengolahan data.",
      "Tanya Jawab: Guru mengajukan pertanyaan pemandu untuk mengecek pemahaman dan memberikan umpan balik langsung.",
      "Penugasan (LKPD/PR): Hasil tugas digunakan guru untuk mengidentifikasi kesulitan dan memberikan intervensi.",
    ],
  },
  {
    title: "Asesmen Hasil Pembelajaran (Assessment of Learning)",
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-300/40",
    text: "text-pink-100",
    items: [
      "Tes Tertulis: Dilaksanakan pada akhir bab untuk mengukur pencapaian tujuan pembelajaran secara keseluruhan.",
      "Penilaian Unjuk Kerja: Melalui kegiatan menemukan dan mempresentasikan aturan penjumlahan bilangan bulat dengan medium pilihan murid (poster, video singkat, atau peta konsep).",
    ],
  },
];

const SectionCard = ({
  icon: Icon,
  title,
  iconColor,
  borderColor,
  bgColor,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  iconColor: string;
  borderColor: string;
  bgColor: string;
  children: React.ReactNode;
}) => (
  <div className={`backdrop-blur border ${borderColor} rounded-2xl p-5 mb-5 animate-slide-up`} style={{ background: bgColor }}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="font-display text-base md:text-lg font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const RPPPenjumlahanBilanganBulatDiscoveryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru/rpp/bilangan-bulat" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-100 mb-4">
            <Search className="w-4 h-4" />
            RPP - Penjumlahan Bilangan Bulat (Discovery Learning)
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            PERENCANAAN PEMBELAJARAN
          </h1>
          <p className="mt-3 text-base md:text-lg text-emerald-200 font-body font-semibold">
            Penjumlahan Bilangan Bulat · Model Discovery Learning
          </p>
        </div>

        {/* Identitas */}
        <SectionCard
          icon={School}
          title="Identitas"
          iconColor="bg-cyan-500"
          borderColor="border-cyan-300/40"
          bgColor="linear-gradient(135deg, rgba(6,182,212,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {identitas.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2.5 border border-white/10">
                <item.icon className="w-4 h-4 text-cyan-300 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">{item.label}</div>
                  <div className="text-sm text-white font-body">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Identifikasi */}
        <SectionCard
          icon={Compass}
          title="Identifikasi"
          iconColor="bg-violet-500"
          borderColor="border-violet-300/40"
          bgColor="linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <p className="text-sm text-white/85 font-body leading-relaxed">
            Guru menyiapkan murid secara psikis dan fisik sebelum memulai pembelajaran sebagaimana sebelumnya guru telah mengidentifikasi peserta didik melalui kemampuan awal, minat dan latar belakang untuk mengakomodasi berbagai kebutuhan belajar melalui kegiatan penemuan konsep yang dilakukan secara berkelompok dan mandiri.
          </p>
        </SectionCard>

        {/* Materi Pembelajaran */}
        <SectionCard
          icon={BookOpen}
          title="Materi Pembelajaran"
          iconColor="bg-emerald-500"
          borderColor="border-emerald-300/40"
          bgColor="linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <div className="mb-4">
            <h3 className="font-display text-sm font-bold text-emerald-200 mb-2">Bilangan Bulat - Jenis Pengetahuan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {jenisPengetahuan.map((jp, i) => (
                <div key={i} className={`${jp.bg} ${jp.border} border rounded-xl p-3`}>
                  <div className={`text-xs font-bold ${jp.color} uppercase tracking-wide mb-1`}>{jp.label}</div>
                  <p className="text-xs text-white/80 font-body leading-relaxed">{jp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide mb-1">Relevansi dengan Kehidupan Nyata</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">
              Materi ini relevan untuk menjelaskan fenomena sehari-hari, seperti suhu (suhu di bawah 0°C), kedalaman laut, utang piutang, dan ketinggian tempat. Hal ini membantu peserta didik menemukan sendiri konsep penjumlahan bilangan bulat dalam konteks nyata.
            </p>
          </div>

          <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide mb-1">Tingkat Kesulitan</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">
              Bervariasi, dimulai dari pengamatan pola sederhana hingga perumusan aturan umum penjumlahan bilangan bulat secara mandiri.
            </p>
          </div>

          <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide mb-1">Struktur Materi</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">
              Progresif, dimulai dari pengenalan bilangan bulat dan garis bilangan, eksplorasi pola penjumlahan dengan berbagai kombinasi tanda, hingga perumusan aturan umum penjumlahan bilangan bulat.
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide mb-1">Integrasi Nilai dan Karakter</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">
              Selama pembelajaran, akan diintegrasikan nilai-nilai religius (bersyukur), kejujuran, disiplin, tanggung jawab, peduli, kolaborasi, santun, dan percaya diri yang mendukung pengembangan dimensi profil lulusan.
            </p>
          </div>
        </SectionCard>

        {/* Dimensi Profil Lulusan */}
        <SectionCard
          icon={Heart}
          title="Dimensi Profil Lulusan"
          iconColor="bg-pink-500"
          borderColor="border-pink-300/40"
          bgColor="linear-gradient(135deg, rgba(236,72,153,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <ul className="space-y-3">
            {dimensiProfil.map((d, i) => (
              <li key={i} className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2.5 border border-white/10">
                <Sparkles className="w-4 h-4 text-pink-300 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-pink-100 font-body mb-0.5">{d.title}</div>
                  <p className="text-xs text-white/80 font-body leading-relaxed">{d.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Capaian Pembelajaran & Tujuan */}
        <SectionCard
          icon={Target}
          title="Capaian & Tujuan Pembelajaran"
          iconColor="bg-amber-500"
          borderColor="border-amber-300/40"
          bgColor="linear-gradient(135deg, rgba(251,191,36,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-2">Capaian Pembelajaran (Bilangan)</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">
              Membaca, menulis, dan membandingkan bilangan bulat, bilangan rasional, bilangan desimal, bilangan berpangkat bulat dan akar, bilangan dalam notasi ilmiah; menerapkan operasi aritmatika pada bilangan real, dan memberikan estimasi/perkiraan dalam menyelesaikan masalah (termasuk berkaitan dengan literasi finansial). Murid dapat menggunakan rasio (skala, proporsi, dan laju perubahan) dalam penyelesaian masalah.
            </p>
          </div>

          <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-2">Tujuan Pembelajaran</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">
              Melalui kegiatan Discovery Learning, peserta didik dapat menemukan dan menerapkan aturan penjumlahan bilangan bulat secara mandiri.
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-2">Topik Pembelajaran</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">
              Konsep Dasar Bilangan Bulat (Positif, Negatif, Nol), Garis Bilangan, Penjumlahan Bilangan Bulat, dan Aplikasinya dalam Kehidupan Sehari-hari.
            </p>
          </div>
        </SectionCard>

        {/* Praktik Pedagogis */}
        <SectionCard
          icon={Layers}
          title="Praktik Pedagogis"
          iconColor="bg-cyan-500"
          borderColor="border-cyan-300/40"
          bgColor="linear-gradient(135deg, rgba(6,182,212,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {praktikPedagogis.map((p, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-3 border border-cyan-300/30">
                <div className="text-xs font-bold text-cyan-200 uppercase tracking-wide mb-1">{p.label}</div>
                <p className="text-sm text-white font-body">{p.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/70 italic font-body bg-white/5 rounded-lg px-3 py-2 border border-white/10">
            Pembelajaran ini dirancang dengan model Discovery Learning agar peserta didik aktif menemukan, menyelidiki, dan merumuskan sendiri konsep penjumlahan bilangan bulat melalui pengalaman belajar yang berkesadaran, bermakna, dan menggembirakan.
          </p>
        </SectionCard>

        {/* Kemitraan & Lintas Disiplin */}
        <SectionCard
          icon={Globe}
          title="Kemitraan / Lintas Disiplin Ilmu"
          iconColor="bg-teal-500"
          borderColor="border-teal-300/40"
          bgColor="linear-gradient(135deg, rgba(20,184,166,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <ul className="space-y-3">
            {kemitraan.map((k, i) => (
              <li key={i} className="bg-white/5 rounded-lg px-3 py-2.5 border border-white/10">
                <div className="text-sm font-semibold text-teal-100 font-body mb-1">{k.title}</div>
                <p className="text-xs text-white/80 font-body leading-relaxed">{k.desc}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Lingkungan Pembelajaran */}
        <SectionCard
          icon={Lightbulb}
          title="Lingkungan Pembelajaran"
          iconColor="bg-yellow-500"
          borderColor="border-yellow-300/40"
          bgColor="linear-gradient(135deg, rgba(234,179,8,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <div className="mb-3 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-yellow-200 uppercase tracking-wide mb-1">Budaya Belajar</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">
              Dikembangkan iklim belajar yang aman, nyaman, dan saling memuliakan. Peserta didik diberi kebebasan untuk mengajukan dugaan, menguji, dan berdebat secara sehat dalam proses penemuan konsep.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs font-bold text-yellow-200 uppercase tracking-wide mb-1">Ruang Fisik</div>
            <p className="text-sm text-white/85 font-body leading-relaxed">
              Kelas diatur untuk memfasilitasi kerja kelompok kecil, eksplorasi media (garis bilangan, kartu positif-negatif), dan presentasi temuan.
            </p>
          </div>
        </SectionCard>

        {/* Pemanfaatan Digital */}
        <SectionCard
          icon={Monitor}
          title="Pemanfaatan Digital"
          iconColor="bg-blue-500"
          borderColor="border-blue-300/40"
          bgColor="linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <ul className="space-y-2">
            {pemanfaatanDigital.map((d, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                <Monitor className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/85 font-body leading-relaxed">{d}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Langkah-Langkah Pembelajaran */}
        <SectionCard
          icon={Play}
          title="Langkah-Langkah Pembelajaran (Discovery Learning)"
          iconColor="bg-rose-500"
          borderColor="border-rose-300/40"
          bgColor="linear-gradient(135deg, rgba(244,63,94,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          {/* AWAL */}
          <div className="mb-5">
            <div className="inline-block bg-rose-500/30 text-rose-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-3 border border-rose-300/50">
              AWAL · Berkesadaran, Bermakna, Menggembirakan
            </div>
            <ol className="space-y-2">
              {langkahAwal.map((l, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/20 border border-rose-300/40 flex items-center justify-center text-xs font-bold text-rose-200">
                    {i + 1}
                  </span>
                  <p className="text-sm text-white/85 font-body leading-relaxed">{l}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* INTI - 6 Sintaks Discovery Learning */}
          <div className="mb-5">
            <div className="inline-block bg-rose-500/30 text-rose-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-3 border border-rose-300/50">
              INTI · 6 Sintaks Discovery Learning
            </div>
            <p className="text-xs text-white/70 italic mb-3">
              Pada tahap inti, murid melalui enam fase Discovery Learning: Stimulation, Problem Statement, Data Collection, Data Processing, Verification, dan Generalization.
            </p>
            <div className="space-y-3">
              {langkahInti.map((fase, i) => (
                <div key={i} className={`bg-gradient-to-br ${fase.color} ${fase.border} border rounded-xl p-4`}>
                  <div className={`font-display text-sm font-bold ${fase.text} mb-2`}>{fase.fase}</div>
                  <ul className="space-y-1.5">
                    {fase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-white/85 font-body leading-relaxed">
                        <span className={`w-1.5 h-1.5 rounded-full ${fase.text.replace("text-", "bg-")} mt-1.5 flex-shrink-0`}></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* PENUTUP */}
          <div>
            <div className="inline-block bg-rose-500/30 text-rose-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-3 border border-rose-300/50">
              PENUTUP · Berkesadaran, Bermakna, Menggembirakan
            </div>
            <ol className="space-y-2">
              {langkahPenutup.map((l, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/20 border border-rose-300/40 flex items-center justify-center text-xs font-bold text-rose-200">
                    {i + 1}
                  </span>
                  <p className="text-sm text-white/85 font-body leading-relaxed">{l}</p>
                </li>
              ))}
            </ol>
          </div>
        </SectionCard>

        {/* Asesmen Pembelajaran */}
        <SectionCard
          icon={ClipboardCheck}
          title="Asesmen Pembelajaran"
          iconColor="bg-purple-500"
          borderColor="border-purple-300/40"
          bgColor="linear-gradient(135deg, rgba(168,85,247,0.10) 0%, rgba(15,23,42,0.65) 100%)"
        >
          <p className="text-xs text-white/70 italic mb-4">
            Asesmen dalam pembelajaran mendalam dilaksanakan melalui kombinasi teknik dan instrumen, terutama untuk mengamati proses penemuan konsep oleh murid.
          </p>
          <div className="space-y-3">
            {asesmen.map((a, i) => (
              <div key={i} className={`bg-gradient-to-br ${a.color} ${a.border} border rounded-xl p-4`}>
                <div className={`font-display text-sm font-bold ${a.text} mb-2 flex items-center gap-2`}>
                  <CheckSquare className="w-4 h-4" />
                  {a.title}
                </div>
                <ul className="space-y-1.5">
                  {a.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-white/85 font-body leading-relaxed">
                      <span className={`w-1.5 h-1.5 rounded-full ${a.text.replace("text-", "bg-")} mt-1.5 flex-shrink-0`}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Tanda Tangan */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-6 mt-6 animate-slide-up">
          <div className="text-right text-sm text-white/80 font-body mb-6">
            Bandung, &nbsp; Juli 2025
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-xs text-white/60 font-body mb-1">Mengetahui,</div>
              <div className="text-sm font-semibold text-white font-body mb-16">Kepala Sekolah Menengah Pertama</div>
              <div className="text-sm font-bold text-white font-body border-t border-white/20 pt-2">
                ..........................................................
              </div>
              <div className="text-xs text-white/60 font-body mt-1">NIP. ..........................................................</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-white/60 font-body mb-1">&nbsp;</div>
              <div className="text-sm font-semibold text-white font-body mb-16">Guru Mata Pelajaran</div>
              <div className="text-sm font-bold text-white font-body border-t border-white/20 pt-2">
                ..........................................................
              </div>
              <div className="text-xs text-white/60 font-body mt-1">NIP. ..........................................................</div>
            </div>
          </div>
        </div>

        {/* Footer Nav */}
        <div className="text-center mt-10">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru/rpp/bilangan-bulat"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke RPP Bilangan Bulat
          </button>
        </div>
      </div>
    </div>
  );
};

export default RPPPenjumlahanBilanganBulatDiscoveryPage;
