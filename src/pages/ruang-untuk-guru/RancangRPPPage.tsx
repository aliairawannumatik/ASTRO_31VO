import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Wand2, Save, Printer, FileText, CheckCircle,
  ChevronDown, ChevronUp, BookOpen, Users, ClipboardCheck,
  Lightbulb, Target, Layers, Star, Eye, EyeOff,
} from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const STORAGE_KEY = "numatik:rancang-rpp:v1";

/* ─────────────── DATA ─────────────── */

const MODEL_PEMBELAJARAN = [
  {
    id: "pbl",
    nama: "Problem-Based Learning (PBL)",
    singkat: "PBL",
    deskripsi: "Pembelajaran berbasis masalah nyata yang mendorong peserta didik berpikir kritis dan mencari solusi.",
    sintaks: [
      "Orientasi peserta didik pada masalah",
      "Mengorganisasikan peserta didik untuk belajar",
      "Membimbing penyelidikan individu dan kelompok",
      "Mengembangkan dan menyajikan hasil karya",
      "Menganalisis dan mengevaluasi proses pemecahan masalah",
    ],
    color: "from-blue-500/20 to-cyan-500/10 border-blue-400/40",
    tag: "text-blue-300",
  },
  {
    id: "pjbl",
    nama: "Project-Based Learning (PjBL)",
    singkat: "PjBL",
    deskripsi: "Peserta didik menghasilkan produk/proyek nyata melalui serangkaian penyelidikan.",
    sintaks: [
      "Pertanyaan mendasar (essential question)",
      "Mendesain perencanaan proyek",
      "Menyusun jadwal proyek",
      "Memonitor peserta didik dan kemajuan proyek",
      "Menguji hasil",
      "Mengevaluasi pengalaman belajar",
    ],
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-400/40",
    tag: "text-emerald-300",
  },
  {
    id: "discovery",
    nama: "Discovery Learning",
    singkat: "Discovery",
    deskripsi: "Peserta didik menemukan konsep sendiri melalui eksplorasi, investigasi, dan penemuan.",
    sintaks: [
      "Stimulation (Pemberian rangsangan)",
      "Problem Statement (Identifikasi masalah)",
      "Data Collection (Pengumpulan data)",
      "Data Processing (Pengolahan data)",
      "Verification (Pembuktian)",
      "Generalization (Menarik kesimpulan)",
    ],
    color: "from-violet-500/20 to-purple-500/10 border-violet-400/40",
    tag: "text-violet-300",
  },
  {
    id: "inquiry",
    nama: "Inquiry Learning",
    singkat: "Inquiry",
    deskripsi: "Peserta didik aktif bertanya, menyelidiki, dan menyimpulkan melalui proses ilmiah.",
    sintaks: [
      "Orientasi (mengamati fenomena)",
      "Merumuskan pertanyaan/hipotesis",
      "Merencanakan penyelidikan",
      "Mengumpulkan dan menganalisis data",
      "Menyimpulkan dan mengkomunikasikan",
    ],
    color: "from-amber-500/20 to-yellow-500/10 border-amber-400/40",
    tag: "text-amber-300",
  },
  {
    id: "direct",
    nama: "Direct Instruction",
    singkat: "Direct",
    deskripsi: "Pembelajaran terstruktur dengan penjelasan guru, pemodelan, latihan terbimbing, dan mandiri.",
    sintaks: [
      "Menyampaikan tujuan dan mempersiapkan siswa",
      "Mendemonstrasikan pengetahuan atau keterampilan",
      "Membimbing pelatihan (guided practice)",
      "Mengecek pemahaman dan memberikan umpan balik",
      "Memberikan latihan mandiri (independent practice)",
    ],
    color: "from-rose-500/20 to-pink-500/10 border-rose-400/40",
    tag: "text-rose-300",
  },
  {
    id: "cooperative",
    nama: "Cooperative Learning",
    singkat: "Kooperatif",
    deskripsi: "Belajar dalam kelompok kecil heterogen dengan tanggung jawab bersama dan individual.",
    sintaks: [
      "Menyampaikan tujuan dan memotivasi siswa",
      "Menyajikan informasi awal",
      "Mengorganisasikan siswa dalam kelompok belajar",
      "Membimbing kelompok bekerja dan belajar",
      "Evaluasi hasil belajar kelompok",
      "Memberikan penghargaan",
    ],
    color: "from-cyan-500/20 to-sky-500/10 border-cyan-400/40",
    tag: "text-cyan-300",
  },
  {
    id: "tps",
    nama: "Think-Pair-Share (TPS)",
    singkat: "TPS",
    deskripsi: "Siswa berpikir mandiri, berdiskusi berpasangan, lalu berbagi ke seluruh kelas.",
    sintaks: [
      "Think — Guru mengajukan pertanyaan/masalah, siswa berpikir mandiri",
      "Pair — Siswa berdiskusi dengan pasangannya",
      "Share — Pasangan berbagi jawaban/temuan ke seluruh kelas",
      "Konfirmasi dan penguatan oleh guru",
    ],
    color: "from-orange-500/20 to-amber-500/10 border-orange-400/40",
    tag: "text-orange-300",
  },
  {
    id: "flipped",
    nama: "Flipped Classroom",
    singkat: "Flipped",
    deskripsi: "Materi dipelajari di rumah; waktu kelas digunakan untuk diskusi, latihan, dan pendalaman.",
    sintaks: [
      "Siswa mempelajari materi mandiri sebelum kelas (video/modul)",
      "Tanya jawab dan klarifikasi konsep yang belum dipahami",
      "Aktivitas kolaboratif dan pemecahan masalah di kelas",
      "Presentasi hasil dan diskusi kelompok",
      "Evaluasi dan refleksi",
    ],
    color: "from-indigo-500/20 to-blue-500/10 border-indigo-400/40",
    tag: "text-indigo-300",
  },
  {
    id: "ctl",
    nama: "Contextual Teaching & Learning (CTL)",
    singkat: "CTL",
    deskripsi: "Menghubungkan materi dengan kehidupan nyata sehingga pembelajaran menjadi bermakna.",
    sintaks: [
      "Konstruktivisme — mengaitkan pengetahuan baru dengan yang sudah ada",
      "Inquiry — menemukan konsep melalui penyelidikan",
      "Questioning — mendorong siswa aktif bertanya",
      "Learning Community — belajar bersama dalam komunitas",
      "Modelling — mencontohkan cara berpikir/bekerja",
      "Reflection — merefleksikan apa yang telah dipelajari",
      "Authentic Assessment — penilaian berbasis kinerja nyata",
    ],
    color: "from-teal-500/20 to-green-500/10 border-teal-400/40",
    tag: "text-teal-300",
  },
  {
    id: "stem",
    nama: "STEM Integration",
    singkat: "STEM",
    deskripsi: "Mengintegrasikan Sains, Teknologi, Teknik, dan Matematika dalam satu pembelajaran terpadu.",
    sintaks: [
      "Penyajian tantangan/masalah STEM",
      "Eksplorasi konsep matematika terkait",
      "Koneksi dengan sains dan teknologi",
      "Desain/rekayasa solusi (engineering design)",
      "Pengujian dan evaluasi solusi",
      "Presentasi dan refleksi",
    ],
    color: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-400/40",
    tag: "text-fuchsia-300",
  },
];

const ATP_ELEMEN = [
  {
    elemen: "Bilangan",
    color: "border-blue-400/40 bg-blue-500/10 text-blue-300",
    tp: [
      "Peserta didik dapat membaca, menulis dan membandingkan bilangan bulat.",
      "Peserta didik dapat membaca, menulis dan membandingkan bilangan rasional dan irasional.",
      "Peserta didik dapat membaca, menulis dan membandingkan bilangan desimal.",
      "Peserta didik dapat membaca, menulis dan membandingkan bilangan berpangkat bulat.",
      "Peserta didik dapat membaca, menulis dan membandingkan akar.",
      "Peserta didik dapat membaca, menulis dan membandingkan bilangan dalam notasi ilmiah.",
      "Peserta didik dapat menerapkan operasi aritmatika pada bilangan real.",
      "Peserta didik dapat memberikan estimasi atau perkiraan dalam menyelesaikan masalah termasuk berkaitan dengan literasi finansial.",
      "Peserta didik dapat menggunakan faktorisasi prima.",
      "Peserta didik dapat menggunakan rasio skala, proporsi dan laju perubahan dalam penyelesaian masalah.",
    ],
  },
  {
    elemen: "Aljabar",
    color: "border-violet-400/40 bg-violet-500/10 text-violet-300",
    tp: [
      "Peserta didik dapat mengenali pola dalam bentuk susunan benda dan bilangan.",
      "Peserta didik dapat memprediksi pola dalam bentuk susunan benda dan bilangan.",
      "Peserta didik dapat menggeneralisasi pola dalam bentuk susunan benda dan bilangan.",
      "Peserta didik dapat menyatakan suatu situasi ke dalam bentuk aljabar.",
      "Peserta didik dapat menggunakan sifat-sifat operasi komutatif, asosiatif, dan distributif untuk menghasilkan bentuk aljabar yang ekuivalen.",
      "Peserta didik dapat memahami relasi dan fungsi domain, kodomain, range.",
      "Peserta didik dapat menyajikan relasi dan fungsi dalam bentuk diagram panah, tabel, himpunan pasangan berurutan.",
      "Peserta didik dapat menyajikan relasi dan fungsi dalam bentuk grafik.",
      "Peserta didik dapat membedakan beberapa fungsi nonlinear dari fungsi linear secara grafik.",
      "Peserta didik dapat menyelesaikan persamaan dan pertidaksamaan linear satu variabel.",
      "Peserta didik dapat menganalisis relasi, fungsi dan persamaan linear.",
      "Peserta didik dapat menyelesaikan masalah dengan menggunakan relasi, fungsi, dan persamaan linear.",
      "Peserta didik dapat menyelesaikan sistem persamaan linear dua variabel melalui beberapa cara untuk penyelesaian masalah.",
    ],
  },
  {
    elemen: "Pengukuran",
    color: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
    tp: [
      "Peserta didik dapat menjelaskan cara untuk menentukan luas lingkaran.",
      "Peserta didik dapat menyelesaikan masalah yang berkaitan dengan luas lingkaran.",
      "Peserta didik dapat menjelaskan cara untuk menentukan luas permukaan bangun ruang sisi datar prisma dan limas.",
      "Peserta didik dapat menjelaskan cara untuk menentukan luas permukaan bangun ruang sisi lengkung tabung, bola dan kerucut.",
      "Peserta didik dapat menjelaskan cara untuk menentukan volume bangun ruang sisi datar prisma dan limas.",
      "Peserta didik dapat menjelaskan cara untuk menentukan volume bangun ruang sisi lengkung tabung, bola dan kerucut.",
      "Peserta didik dapat menyelesaikan masalah yang berkaitan dengan bangun ruang sisi datar prisma dan limas.",
      "Peserta didik dapat menyelesaikan masalah yang berkaitan dengan bangun ruang sisi lengkung tabung, bola dan kerucut.",
      "Peserta didik dapat menjelaskan pengaruh perubahan secara proporsional dari bangun datar dan bangun ruang terhadap luas dan volume.",
    ],
  },
  {
    elemen: "Geometri",
    color: "border-amber-400/40 bg-amber-500/10 text-amber-300",
    tp: [
      "Peserta didik dapat membuat jaring-jaring bangun ruang sisi datar kubus, balok, prisma dan limas.",
      "Peserta didik dapat membuat jaring-jaring bangun ruang sisi lengkung tabung, kerucut dan bola.",
      "Peserta didik dapat menggunakan hubungan antar-sudut yang terbentuk oleh dua garis yang berpotongan untuk menyelesaikan masalah.",
      "Peserta didik dapat menggunakan hubungan antar-sudut yang terbentuk oleh dua garis sejajar yang dipotong sebuah garis transversal untuk menyelesaikan masalah.",
      "Peserta didik dapat menentukan jumlah besar sudut dalam sebuah segitiga.",
      "Peserta didik dapat menjelaskan sifat-sifat kekongruenan dan kesebangunan pada segitiga dan segiempat.",
      "Peserta didik dapat menggunakan sifat-sifat kekongruenan dan kesebangunan untuk menyelesaikan masalah.",
      "Peserta didik dapat menunjukkan kebenaran teorema Pythagoras dan menggunakannya dalam menyelesaikan masalah.",
      "Peserta didik dapat melakukan transformasi tunggal refleksi, translasi, rotasi, dan dilatasi bangun datar pada bidang koordinat Kartesius.",
    ],
  },
  {
    elemen: "Analisis Data dan Peluang",
    color: "border-pink-400/40 bg-pink-500/10 text-pink-300",
    tp: [
      "Peserta didik dapat merumuskan pertanyaan, mengumpulkan, menyajikan, dan menganalisis data.",
      "Peserta didik dapat menggunakan diagram batang dan diagram lingkaran untuk menyajikan dan menginterpretasi data.",
      "Peserta didik dapat mengambil sampel yang mewakili suatu populasi untuk mendapatkan data.",
      "Peserta didik dapat menentukan dan menafsirkan mean, median, modus, dan jangkauan (range) dari data.",
      "Peserta didik dapat membandingkan suatu data terhadap kelompoknya dan memprediksi serta membuat keputusan.",
      "Peserta didik dapat menyelidiki kemungkinan adanya perubahan pengukuran pusat akibat perubahan data.",
      "Peserta didik dapat menjelaskan dan menggunakan pengertian peluang untuk menentukan frekuensi harapan.",
      "Peserta didik dapat menggunakan frekuensi relatif untuk menentukan frekuensi harapan satu kejadian pada suatu percobaan sederhana.",
    ],
  },
];

const DIMENSI_PPP = [
  { id: "beriman", label: "Beriman, Bertakwa kepada Tuhan YME & Berakhlak Mulia", icon: "🙏" },
  { id: "berkebhinekaan", label: "Berkebinekaan Global", icon: "🌏" },
  { id: "bergotong", label: "Bergotong Royong", icon: "🤝" },
  { id: "mandiri", label: "Mandiri", icon: "💪" },
  { id: "bernalar", label: "Bernalar Kritis", icon: "🧠" },
  { id: "kreatif", label: "Kreatif", icon: "✨" },
  { id: "kebangsaan", label: "Berwawasan Kebangsaan & Cinta Tanah Air", icon: "🇮🇩" },
  { id: "adaptif", label: "Adaptif, Inovatif & Melek Teknologi", icon: "💡" },
];

const ASESMEN_FORMATIF = [
  "Observasi aktivitas belajar",
  "Pertanyaan lisan / tanya jawab",
  "Kuis singkat",
  "Exit ticket",
  "Lembar kerja peserta didik (LKPD)",
  "Presentasi kelompok",
  "Refleksi harian",
];

const ASESMEN_SUMATIF = [
  "Ulangan harian (tes tertulis)",
  "Penilaian Tengah Semester (PTS)",
  "Penilaian Akhir Semester (PAS)",
  "Proyek individu/kelompok",
  "Portofolio",
  "Tes praktik / unjuk kerja",
];

const MEDIA_BELAJAR = [
  "Papan tulis / whiteboard",
  "LCD proyektor / slide presentasi",
  "Video pembelajaran",
  "Lembar kerja (LKPD)",
  "Alat peraga manipulatif",
  "Aplikasi/platform digital",
  "Buku teks siswa",
  "Modul ajar digital",
];

const SUMBER_BELAJAR = [
  "Buku Matematika SMP Kemdikbudristek",
  "Modul ajar Kurikulum Merdeka",
  "Internet dan sumber digital terpercaya",
  "Lingkungan sekitar / konteks nyata",
  "Lembar kerja guru",
];

/* ─────────────── TYPES ─────────────── */

type RPPState = {
  /* Identitas */
  satuanPendidikan: string;
  mataPelajaran: string;
  kelas: string;
  semester: string;
  tahunPelajaran: string;
  alokasi: string;
  pertemuanKe: string;
  materi: string;
  kompetensiAwal: string;
  pertanyaanPemantik: string;
  pemahamanBermakna: string;
  targetSiswa: string;
  /* Model */
  modelId: string;
  /* TP */
  selectedTP: string[];
  /* PPP */
  selectedDimensi: string[];
  /* Media */
  selectedMedia: string[];
  selectedSumber: string[];
  mediaLain: string;
  /* Asesmen */
  selectedAsesmenFormatif: string[];
  selectedAsesmenSumatif: string[];
  asesmenDiagnostik: string;
  instrumenPenilaian: string;
  /* Kegiatan */
  pendahuluan: string;
  kegiatanInti: string;
  penutup: string;
  /* Pengayaan */
  pengayaan: string;
  remedial: string;
  refleksiGuru: string;
  /* TTD */
  kota: string;
  tanggalTTD: string;
  namaKepala: string;
  nipKepala: string;
  jabatanKepala: string;
  namaGuru: string;
  nipGuru: string;
};

const defaultState: RPPState = {
  satuanPendidikan: "",
  mataPelajaran: "Matematika",
  kelas: "",
  semester: "1 (Ganjil)",
  tahunPelajaran: "2025 / 2026",
  alokasi: "2 × 40 menit",
  pertemuanKe: "1",
  materi: "",
  kompetensiAwal: "Peserta didik telah memahami konsep bilangan bulat dan operasi dasarnya, serta mampu melakukan perhitungan aritmatika sederhana. Peserta didik juga memiliki kemampuan dasar dalam membaca dan menginterpretasikan informasi matematis.",
  pertanyaanPemantik: "Pernahkah kamu melihat pola bilangan di sekitarmu? Bagaimana matematika membantu kita memahami dunia? Apakah ada masalah di kehidupanmu yang bisa diselesaikan dengan konsep yang akan kita pelajari hari ini?",
  pemahamanBermakna: "Memahami konsep matematika membantu peserta didik dalam menyelesaikan masalah kehidupan sehari-hari, seperti menghitung keuangan, mengukur jarak, membaca data, dan membuat keputusan yang logis.",
  targetSiswa: "Peserta didik reguler/tipikal",
  modelId: "",
  selectedTP: [],
  selectedDimensi: [],
  selectedMedia: [],
  selectedSumber: [],
  mediaLain: "",
  selectedAsesmenFormatif: [],
  selectedAsesmenSumatif: [],
  asesmenDiagnostik: "",
  instrumenPenilaian: "",
  pendahuluan: "",
  kegiatanInti: "",
  penutup: "",
  pengayaan: "",
  remedial: "",
  refleksiGuru: "",
  kota: "",
  tanggalTTD: "",
  namaKepala: "",
  nipKepala: "",
  jabatanKepala: "Kepala Sekolah",
  namaGuru: "",
  nipGuru: "",
};

const buildPendahuluan = () =>
  `1. Guru membuka pembelajaran dengan salam dan berdoa bersama.
2. Guru memeriksa kehadiran peserta didik.
3. Guru menyampaikan tujuan pembelajaran dan manfaatnya dalam kehidupan sehari-hari.
4. Guru mengajukan pertanyaan pemantik untuk menggali pengetahuan awal siswa.
5. Guru menyampaikan garis besar kegiatan pembelajaran yang akan dilakukan.`;

const buildPenutup = () =>
  `1. Guru bersama peserta didik membuat rangkuman/simpulan pelajaran.
2. Guru melakukan refleksi terhadap kegiatan yang sudah dilaksanakan.
3. Peserta didik mengisi lembar refleksi singkat (apa yang sudah dipahami, apa yang masih membingungkan).
4. Guru memberikan umpan balik terhadap proses dan hasil pembelajaran.
5. Guru menyampaikan rencana pembelajaran berikutnya.
6. Guru menutup pembelajaran dengan doa dan salam.`;

const buildInti = (model: typeof MODEL_PEMBELAJARAN[0]) =>
  model.sintaks.map((s, i) => `${i + 1}. ${s}:\n   [Deskripsikan aktivitas guru dan peserta didik pada tahap ini]`).join("\n\n");

/* ─────────────── COMPONENT ─────────────── */

const Section = ({
  title, icon: Icon, children, accent = "teal",
}: {
  title: string; icon: React.ElementType; children: React.ReactNode; accent?: string;
}) => {
  const [open, setOpen] = useState(true);
  const colorMap: Record<string, string> = {
    teal: "text-teal-300 border-teal-500/30",
    violet: "text-violet-300 border-violet-500/30",
    amber: "text-amber-300 border-amber-500/30",
    pink: "text-pink-300 border-pink-500/30",
    cyan: "text-cyan-300 border-cyan-500/30",
    emerald: "text-emerald-300 border-emerald-500/30",
    indigo: "text-indigo-300 border-indigo-500/30",
  };
  const c = colorMap[accent] ?? colorMap.teal;
  return (
    <div className="bg-card/70 backdrop-blur border border-white/10 rounded-2xl overflow-hidden mb-4 animate-slide-up">
      <button
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/3 transition-colors"
        onClick={() => { playPopSound(); setOpen(o => !o); }}
      >
        <Icon className={`w-5 h-5 shrink-0 ${c.split(" ")[0]}`} />
        <span className={`font-bold text-sm uppercase tracking-wide flex-1 text-left ${c.split(" ")[0]}`}>{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
      </button>
      {open && <div className={`px-5 pb-5 border-t ${c.split(" ")[1]}`}>{children}</div>}
    </div>
  );
};

const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-400/60 focus:bg-white/8 transition-colors";
const textareaCls = `${inputCls} resize-y min-h-[100px] leading-relaxed`;

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-white/50 text-[11px] block mb-1 mt-3">{children}</label>
);

const Chip = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 ${
      selected
        ? "bg-teal-500/25 border-teal-400/50 text-teal-200"
        : "bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:border-white/25"
    }`}
  >
    {children}
  </button>
);

/* ─────────────── PRINT ─────────────── */

const buildPrintHTML = (s: RPPState): string => {
  const model = MODEL_PEMBELAJARAN.find(m => m.id === s.modelId);
  const tps = s.selectedTP.map((tp, i) => `<li>${i + 1}. ${tp}</li>`).join("");
  const dimensi = s.selectedDimensi
    .map(id => DIMENSI_PPP.find(d => d.id === id)?.label ?? id)
    .join(", ");
  const media = [...s.selectedMedia, s.mediaLain ? s.mediaLain : ""].filter(Boolean).join(", ");
  const sumber = s.selectedSumber.join(", ");
  const formatif = s.selectedAsesmenFormatif.join(", ");
  const sumatif = s.selectedAsesmenSumatif.join(", ");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;font-size:10.5pt;margin:2cm;color:#111;}
  h1{font-size:14pt;text-align:center;margin:0 0 4px;}
  h2{font-size:11pt;text-align:center;font-weight:normal;margin:0 0 18px;}
  h3{font-size:10.5pt;background:#1a7a6e;color:white;padding:5px 10px;margin:14px 0 6px;border-radius:4px;}
  table{width:100%;border-collapse:collapse;margin-bottom:6px;font-size:10pt;}
  td,th{border:1px solid #ccc;padding:4px 8px;vertical-align:top;}
  .lbl{font-weight:bold;width:200px;background:#f5f5f5;}
  ul{margin:4px 0;padding-left:18px;}
  li{margin-bottom:3px;line-height:1.5;}
  p{margin:4px 0;line-height:1.6;}
  .no-border td{border:none;padding:2px 8px;}
  .sign td{text-align:center;border:none;padding:8px;}
</style>
</head><body>
<h1>RENCANA PELAKSANAAN PEMBELAJARAN (RPP)</h1>
<h2>Mata Pelajaran ${s.mataPelajaran} — Kurikulum Merdeka (Fase D)</h2>

<h3>A. IDENTITAS RPP</h3>
<table>
  <tr><td class="lbl">Satuan Pendidikan</td><td>${s.satuanPendidikan}</td><td class="lbl">Kelas / Semester</td><td>${s.kelas} / ${s.semester}</td></tr>
  <tr><td class="lbl">Mata Pelajaran</td><td>${s.mataPelajaran}</td><td class="lbl">Tahun Pelajaran</td><td>${s.tahunPelajaran}</td></tr>
  <tr><td class="lbl">Materi Pokok</td><td>${s.materi}</td><td class="lbl">Alokasi Waktu</td><td>${s.alokasi}</td></tr>
  <tr><td class="lbl">Pertemuan Ke-</td><td>${s.pertemuanKe}</td><td class="lbl">Model Pembelajaran</td><td>${model?.nama ?? "-"}</td></tr>
</table>

<h3>B. KOMPETENSI AWAL</h3>
<p>${s.kompetensiAwal || "-"}</p>

<h3>C. PROFIL LULUSAN 8 DIMENSI</h3>
<p>${dimensi || "-"}</p>

<h3>D. SARANA DAN PRASARANA</h3>
<table>
  <tr><td class="lbl">Media Pembelajaran</td><td>${media || "-"}</td></tr>
  <tr><td class="lbl">Sumber Belajar</td><td>${sumber || "-"}</td></tr>
</table>

<h3>E. TARGET PESERTA DIDIK</h3>
<p>${s.targetSiswa || "-"}</p>

<h3>F. TUJUAN PEMBELAJARAN</h3>
<ul>${tps || "<li>-</li>"}</ul>

<h3>G. PEMAHAMAN BERMAKNA</h3>
<p>${s.pemahamanBermakna || "-"}</p>

<h3>H. PERTANYAAN PEMANTIK</h3>
<p>${s.pertanyaanPemantik || "-"}</p>

<h3>I. KEGIATAN PEMBELAJARAN</h3>
<table>
  <tr><td class="lbl" style="width:150px;">Pendahuluan</td><td><pre style="font-family:inherit;white-space:pre-wrap;margin:0;">${s.pendahuluan || buildPendahuluan()}</pre></td></tr>
  <tr><td class="lbl">Kegiatan Inti<br/><span style="font-weight:normal;font-size:9pt;">(${model?.singkat ?? "-"})</span></td><td><pre style="font-family:inherit;white-space:pre-wrap;margin:0;">${s.kegiatanInti || (model ? buildInti(model) : "-")}</pre></td></tr>
  <tr><td class="lbl">Penutup</td><td><pre style="font-family:inherit;white-space:pre-wrap;margin:0;">${s.penutup || buildPenutup()}</pre></td></tr>
</table>

<h3>J. ASESMEN</h3>
<table>
  <tr><td class="lbl">Asesmen Diagnostik</td><td>${s.asesmenDiagnostik || "-"}</td></tr>
  <tr><td class="lbl">Asesmen Formatif</td><td>${formatif || "-"}</td></tr>
  <tr><td class="lbl">Asesmen Sumatif</td><td>${sumatif || "-"}</td></tr>
  <tr><td class="lbl">Instrumen Penilaian</td><td>${s.instrumenPenilaian || "-"}</td></tr>
</table>

<h3>K. PENGAYAAN DAN REMEDIAL</h3>
<table>
  <tr><td class="lbl">Pengayaan</td><td>${s.pengayaan || "Diberikan kepada peserta didik yang telah mencapai dan melampaui KKTP, berupa soal pengembangan atau proyek lanjutan."}</td></tr>
  <tr><td class="lbl">Remedial</td><td>${s.remedial || "Diberikan kepada peserta didik yang belum mencapai KKTP, berupa pembelajaran ulang dan pendampingan individual."}</td></tr>
</table>

<h3>L. REFLEKSI GURU</h3>
<p>${s.refleksiGuru || "Apakah tujuan pembelajaran sudah tercapai? Apa yang perlu diperbaiki pada pertemuan berikutnya?"}</p>

<br/>
<table class="sign">
  <tr>
    <td style="width:50%;">Mengetahui,<br/>${s.jabatanKepala || "Kepala Sekolah"}<br/><br/><br/><br/>${s.namaKepala ? `<u>${s.namaKepala}</u>` : "____________________________"}<br/>NIP. ${s.nipKepala || "________________________"}</td>
    <td style="width:50%;">${s.kota || "_____________"}, ${s.tanggalTTD || "__________ 20__"}<br/>Guru Mata Pelajaran<br/><br/><br/><br/>${s.namaGuru ? `<u>${s.namaGuru}</u>` : "____________________________"}<br/>NIP. ${s.nipGuru || "________________________"}</td>
  </tr>
</table>
</body></html>`;
};

/* ─────────────── MAIN ─────────────── */

const RancangRPPPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<RPPState>(defaultState);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RPPState;
        if (parsed?.mataPelajaran) setState(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  const set = <K extends keyof RPPState>(k: K, v: RPPState[K]) =>
    setState(p => ({ ...p, [k]: v }));

  const toggleArr = <K extends keyof RPPState>(k: K, val: string) => {
    const arr = (state[k] as string[]);
    set(k, (arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]) as RPPState[K]);
  };

  const selectedModel = MODEL_PEMBELAJARAN.find(m => m.id === state.modelId);

  const handleSelectModel = (id: string) => {
    playPopSound();
    const model = MODEL_PEMBELAJARAN.find(m => m.id === id)!;
    setState(p => ({
      ...p,
      modelId: id,
      kegiatanInti: buildInti(model),
      pendahuluan: p.pendahuluan || buildPendahuluan(),
      penutup: p.penutup || buildPenutup(),
    }));
  };

  const handleSave = () => {
    playPopSound();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    setSaved(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(false), 3000);
  };

  const handlePDF = () => {
    playPopSound();
    const win = window.open("", "_blank");
    if (win) { win.document.write(buildPrintHTML(state)); win.document.close(); setTimeout(() => win.print(), 400); }
  };

  const handleWord = () => {
    playPopSound();
    const blob = new Blob(["\ufeff", buildPrintHTML(state)], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `RPP_${state.materi || "Matematika"}.doc`; a.click();
    URL.revokeObjectURL(url);
  };

  const isReady = state.modelId && state.selectedTP.length > 0 && state.materi;

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru/rpp" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">

        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/40 bg-teal-500/10 px-4 py-2 text-xs font-semibold text-teal-100 mb-4">
            <Wand2 className="w-4 h-4" />
            Pembuat RPP Otomatis · Kurikulum Merdeka
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan">
            RANCANG RPP OTOMATIS
          </h1>
          <p className="mt-2 text-sm text-white/60 max-w-xl mx-auto font-body">
            Isi setiap bagian di bawah sesuai kebutuhan kelasmu. RPP lengkap siap dicetak atau diunduh.
          </p>
        </div>

        {/* Action bar */}
        <div className="flex justify-end gap-2 mb-5 animate-slide-up">
          <button onClick={handleSave}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-[1.03] ${saved ? "bg-emerald-600/80 border-emerald-400/40" : "bg-teal-600/80 hover:bg-teal-500 border-teal-400/40"}`}>
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Tersimpan!" : "Simpan"}
          </button>
          <button onClick={handleWord}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-500 border border-blue-400/40 text-white text-xs font-bold transition-all hover:scale-[1.03]">
            <FileText className="w-4 h-4" /> Cetak Word
          </button>
          <button onClick={handlePDF}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 border border-rose-400/40 text-white text-xs font-bold transition-all hover:scale-[1.03]">
            <Printer className="w-4 h-4" /> Cetak PDF
          </button>
        </div>

        {/* ── SECTION A: IDENTITAS ── */}
        <Section title="A · Identitas RPP" icon={BookOpen} accent="teal">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 pt-2">
            {([
              ["satuanPendidikan", "Satuan Pendidikan", "SMPN ..."],
              ["mataPelajaran", "Mata Pelajaran", "Matematika"],
              ["kelas", "Kelas", "VII A / VIII B ..."],
              ["semester", "Semester", "1 (Ganjil)"],
              ["tahunPelajaran", "Tahun Pelajaran", "2025 / 2026"],
              ["alokasi", "Alokasi Waktu", "2 × 40 menit"],
              ["pertemuanKe", "Pertemuan Ke-", "1"],
              ["materi", "Materi Pokok", "Bilangan Bulat / Aljabar / ..."],
            ] as const).map(([k, label, ph]) => (
              <div key={k}>
                <Label>{label}</Label>
                <input className={inputCls} placeholder={ph}
                  value={(state as Record<string, string>)[k]}
                  onChange={e => set(k, e.target.value)} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Label>Kompetensi Awal Peserta Didik</Label>
              <textarea className={textareaCls} rows={2}
                placeholder="Deskripsikan pengetahuan/keterampilan yang sudah dimiliki siswa sebelum materi ini..."
                value={state.kompetensiAwal} onChange={e => set("kompetensiAwal", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Target Peserta Didik</Label>
              <input className={inputCls} placeholder="Peserta didik reguler / berkebutuhan khusus / cerdas berbakat..."
                value={state.targetSiswa} onChange={e => set("targetSiswa", e.target.value)} />
            </div>
          </div>
        </Section>

        {/* ── SECTION B: MODEL PEMBELAJARAN ── */}
        <Section title="B · Model Pembelajaran (Pilih 1 dari 10)" icon={Layers} accent="violet">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            {MODEL_PEMBELAJARAN.map(m => (
              <button key={m.id} type="button"
                onClick={() => handleSelectModel(m.id)}
                className={`text-left rounded-xl border p-3.5 transition-all duration-200 bg-gradient-to-br ${m.color} ${
                  state.modelId === m.id ? "ring-2 ring-teal-400/60 scale-[1.02]" : "opacity-75 hover:opacity-100 hover:scale-[1.01]"
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/20 ${m.tag}`}>{m.singkat}</span>
                  {state.modelId === m.id && <CheckCircle className="w-3.5 h-3.5 text-teal-400 ml-auto" />}
                </div>
                <p className="font-bold text-xs text-white mb-1">{m.nama}</p>
                <p className="text-[11px] text-white/60 leading-snug">{m.deskripsi}</p>
              </button>
            ))}
          </div>
          {selectedModel && (
            <div className="mt-4 bg-black/20 rounded-xl p-4 border border-white/10">
              <p className="text-teal-300 font-bold text-xs mb-2">Sintaks {selectedModel.nama}:</p>
              <ol className="space-y-1">
                {selectedModel.sintaks.map((s, i) => (
                  <li key={i} className="text-xs text-white/70 flex gap-2">
                    <span className="text-teal-400 font-bold shrink-0">{i + 1}.</span>{s}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Section>

        {/* ── SECTION C: TUJUAN PEMBELAJARAN (ATP) ── */}
        <Section title="C · Tujuan Pembelajaran (dari ATP)" icon={Target} accent="amber">
          <p className="text-white/40 text-[11px] mt-3 mb-3">Pilih satu atau lebih TP sesuai materi pertemuan ini. Dikelompokkan berdasarkan elemen Fase D.</p>
          {ATP_ELEMEN.map(el => (
            <div key={el.elemen} className="mb-4">
              <p className={`text-xs font-bold px-3 py-1.5 rounded-full border inline-block mb-2 ${el.color}`}>{el.elemen}</p>
              <div className="space-y-1.5">
                {el.tp.map(tp => {
                  const sel = state.selectedTP.includes(tp);
                  return (
                    <button key={tp} type="button"
                      onClick={() => { playPopSound(); toggleArr("selectedTP", tp); }}
                      className={`w-full text-left text-xs px-4 py-2.5 rounded-xl border transition-all ${
                        sel ? "bg-teal-500/20 border-teal-400/50 text-white" : "bg-white/3 border-white/8 text-white/60 hover:bg-white/8 hover:text-white/85"
                      }`}>
                      <span className={`inline-block w-4 h-4 rounded border mr-2 align-middle ${sel ? "bg-teal-500 border-teal-400" : "border-white/20"}`}>
                        {sel && <CheckCircle className="w-4 h-4 text-white" />}
                      </span>
                      {tp}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {state.selectedTP.length > 0 && (
            <div className="mt-2 text-xs text-teal-400 font-bold">{state.selectedTP.length} TP terpilih</div>
          )}
        </Section>

        {/* ── SECTION D: PROFIL LULUSAN 8 DIMENSI ── */}
        <Section title="D · Profil Lulusan 8 Dimensi" icon={Star} accent="cyan">
          <p className="text-white/40 text-[11px] mt-3 mb-3">Pilih dimensi yang akan dikembangkan dalam pembelajaran ini (boleh lebih dari satu).</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DIMENSI_PPP.map(d => {
              const sel = state.selectedDimensi.includes(d.id);
              return (
                <button key={d.id} type="button"
                  onClick={() => { playPopSound(); toggleArr("selectedDimensi", d.id); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    sel ? "bg-cyan-500/20 border-cyan-400/50 text-white" : "bg-white/3 border-white/10 text-white/60 hover:bg-white/8"
                  }`}>
                  <span className="text-xl">{d.icon}</span>
                  <span className="text-xs font-semibold leading-snug">{d.label}</span>
                  {sel && <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 ml-auto" />}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── SECTION E: MEDIA & SUMBER BELAJAR ── */}
        <Section title="E · Media & Sumber Belajar" icon={Lightbulb} accent="emerald">
          <Label>Media Pembelajaran</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {MEDIA_BELAJAR.map(m => (
              <Chip key={m} selected={state.selectedMedia.includes(m)}
                onClick={() => { playPopSound(); toggleArr("selectedMedia", m); }}>
                {m}
              </Chip>
            ))}
          </div>
          <Label>Media / Sarana Lainnya</Label>
          <input className={inputCls} placeholder="Tambahkan media lain..."
            value={state.mediaLain} onChange={e => set("mediaLain", e.target.value)} />
          <Label>Sumber Belajar</Label>
          <div className="flex flex-wrap gap-2">
            {SUMBER_BELAJAR.map(s => (
              <Chip key={s} selected={state.selectedSumber.includes(s)}
                onClick={() => { playPopSound(); toggleArr("selectedSumber", s); }}>
                {s}
              </Chip>
            ))}
          </div>
        </Section>

        {/* ── SECTION F: PEMAHAMAN BERMAKNA & PERTANYAAN PEMANTIK ── */}
        <Section title="F · Pemahaman Bermakna & Pertanyaan Pemantik" icon={BookOpen} accent="indigo">
          <Label>Pemahaman Bermakna (manfaat materi dalam kehidupan nyata)</Label>
          <textarea className={textareaCls} rows={2}
            placeholder="Contoh: Memahami bilangan bulat membantu kita dalam membaca suhu, keuangan, dan elevasi..."
            value={state.pemahamanBermakna} onChange={e => set("pemahamanBermakna", e.target.value)} />
          <Label>Pertanyaan Pemantik</Label>
          <textarea className={textareaCls} rows={2}
            placeholder="Pertanyaan yang memancing rasa ingin tahu dan menghubungkan dengan kehidupan nyata..."
            value={state.pertanyaanPemantik} onChange={e => set("pertanyaanPemantik", e.target.value)} />
        </Section>

        {/* ── SECTION G: KEGIATAN PEMBELAJARAN ── */}
        <Section title="G · Kegiatan Pembelajaran" icon={Users} accent="amber">
          {!state.modelId && (
            <p className="text-amber-300/70 text-xs mt-3 italic">
              ⚠ Pilih Model Pembelajaran terlebih dahulu (Bagian B) — kegiatan inti akan terisi otomatis.
            </p>
          )}
          <Label>Pendahuluan (± 10 menit)</Label>
          <textarea className={textareaCls} rows={6}
            placeholder="Langkah-langkah pendahuluan..."
            value={state.pendahuluan}
            onChange={e => set("pendahuluan", e.target.value)} />
          <Label>Kegiatan Inti {selectedModel ? `— ${selectedModel.nama}` : ""} (± 60 menit)</Label>
          <textarea className={textareaCls} rows={12}
            placeholder="Langkah-langkah kegiatan inti sesuai model pembelajaran..."
            value={state.kegiatanInti}
            onChange={e => set("kegiatanInti", e.target.value)} />
          <Label>Penutup (± 10 menit)</Label>
          <textarea className={textareaCls} rows={6}
            placeholder="Langkah-langkah penutup..."
            value={state.penutup}
            onChange={e => set("penutup", e.target.value)} />
        </Section>

        {/* ── SECTION H: ASESMEN ── */}
        <Section title="H · Asesmen & Penilaian" icon={ClipboardCheck} accent="pink">
          <Label>Asesmen Diagnostik (sebelum pembelajaran)</Label>
          <input className={inputCls} placeholder="Tanya jawab lisan / pre-test / pemetaan kemampuan awal..."
            value={state.asesmenDiagnostik} onChange={e => set("asesmenDiagnostik", e.target.value)} />
          <Label>Asesmen Formatif (selama pembelajaran)</Label>
          <div className="flex flex-wrap gap-2 mb-1">
            {ASESMEN_FORMATIF.map(a => (
              <Chip key={a} selected={state.selectedAsesmenFormatif.includes(a)}
                onClick={() => { playPopSound(); toggleArr("selectedAsesmenFormatif", a); }}>
                {a}
              </Chip>
            ))}
          </div>
          <Label>Asesmen Sumatif (akhir unit/semester)</Label>
          <div className="flex flex-wrap gap-2 mb-1">
            {ASESMEN_SUMATIF.map(a => (
              <Chip key={a} selected={state.selectedAsesmenSumatif.includes(a)}
                onClick={() => { playPopSound(); toggleArr("selectedAsesmenSumatif", a); }}>
                {a}
              </Chip>
            ))}
          </div>
          <Label>Instrumen / Teknik Penilaian</Label>
          <textarea className={textareaCls} rows={3}
            placeholder="Rubrik penilaian, lembar observasi, soal essay, daftar ceklis, dll..."
            value={state.instrumenPenilaian} onChange={e => set("instrumenPenilaian", e.target.value)} />
        </Section>

        {/* ── SECTION I: PENGAYAAN & REMEDIAL ── */}
        <Section title="I · Pengayaan, Remedial & Refleksi Guru" icon={BookOpen} accent="teal">
          <Label>Pengayaan (untuk siswa yang sudah melampaui KKTP)</Label>
          <textarea className={textareaCls} rows={2}
            placeholder="Soal pengayaan, proyek tambahan, eksplorasi mandiri..."
            value={state.pengayaan} onChange={e => set("pengayaan", e.target.value)} />
          <Label>Remedial (untuk siswa yang belum mencapai KKTP)</Label>
          <textarea className={textareaCls} rows={2}
            placeholder="Pembelajaran ulang, bimbingan individual, latihan tambahan..."
            value={state.remedial} onChange={e => set("remedial", e.target.value)} />
          <Label>Refleksi Guru</Label>
          <textarea className={textareaCls} rows={3}
            placeholder="Apa yang berjalan baik? Apa yang perlu diperbaiki? Apakah tujuan pembelajaran tercapai?..."
            value={state.refleksiGuru} onChange={e => set("refleksiGuru", e.target.value)} />
        </Section>

        {/* ── SECTION J: TANDA TANGAN ── */}
        <Section title="J · Tanda Tangan" icon={CheckCircle} accent="teal">
          <p className="text-white/40 text-[11px] mt-3 mb-1">Isi data untuk keperluan penandatanganan dokumen RPP.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <div>
              <Label>Kota</Label>
              <input className={inputCls} placeholder="Nama kota..."
                value={state.kota} onChange={e => set("kota", e.target.value)} />
            </div>
            <div>
              <Label>Tanggal</Label>
              <input className={inputCls} placeholder="Contoh: 5 Mei 2026"
                value={state.tanggalTTD} onChange={e => set("tanggalTTD", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 mt-4">
            {/* Kepala Sekolah */}
            <div className="border border-white/10 rounded-xl p-4 bg-white/3">
              <p className="text-cyan-300 text-[11px] font-bold uppercase tracking-wide mb-2">Mengetahui</p>
              <div>
                <Label>Jabatan</Label>
                <input className={inputCls} placeholder="Kepala Sekolah"
                  value={state.jabatanKepala} onChange={e => set("jabatanKepala", e.target.value)} />
              </div>
              <div>
                <Label>Nama Kepala Sekolah</Label>
                <input className={inputCls} placeholder="Nama lengkap..."
                  value={state.namaKepala} onChange={e => set("namaKepala", e.target.value)} />
              </div>
              <div>
                <Label>NIP Kepala Sekolah</Label>
                <input className={inputCls} placeholder="NIP..."
                  value={state.nipKepala} onChange={e => set("nipKepala", e.target.value)} />
              </div>
            </div>
            {/* Guru */}
            <div className="border border-white/10 rounded-xl p-4 bg-white/3">
              <p className="text-teal-300 text-[11px] font-bold uppercase tracking-wide mb-2">Guru Mata Pelajaran</p>
              <div>
                <Label>Nama Guru</Label>
                <input className={inputCls} placeholder="Nama lengkap..."
                  value={state.namaGuru} onChange={e => set("namaGuru", e.target.value)} />
              </div>
              <div>
                <Label>NIP Guru</Label>
                <input className={inputCls} placeholder="NIP..."
                  value={state.nipGuru} onChange={e => set("nipGuru", e.target.value)} />
              </div>
            </div>
          </div>
          {/* Preview TTD */}
          <div className="mt-5 grid grid-cols-2 gap-4 text-center text-xs text-white/60 border border-white/8 rounded-xl p-4 bg-black/20">
            <div>
              <p>Mengetahui,</p>
              <p>{state.jabatanKepala || "Kepala Sekolah"}</p>
              <div className="my-8" />
              <p className="font-bold text-white/80">{state.namaKepala || "____________________________"}</p>
              <p>NIP. {state.nipKepala || "________________________"}</p>
            </div>
            <div>
              <p>{state.kota || "_____________"}, {state.tanggalTTD || "__________ 20__"}</p>
              <p>Guru Mata Pelajaran</p>
              <div className="my-8" />
              <p className="font-bold text-white/80">{state.namaGuru || "____________________________"}</p>
              <p>NIP. {state.nipGuru || "________________________"}</p>
            </div>
          </div>
        </Section>

        {/* ── PREVIEW TOGGLE ── */}
        {isReady && (
          <div className="mb-4 animate-slide-up">
            <button
              onClick={() => { playPopSound(); setShowPreview(p => !p); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-teal-400/40 bg-teal-500/5 hover:bg-teal-500/10 text-teal-300 text-sm font-bold transition-all">
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Sembunyikan Pratinjau RPP" : "Lihat Pratinjau RPP Lengkap"}
            </button>
          </div>
        )}

        {showPreview && isReady && (
          <div className="bg-white text-gray-900 rounded-2xl p-6 mb-6 text-sm leading-relaxed animate-slide-up overflow-auto max-h-[600px] border-4 border-teal-400/30 shadow-2xl shadow-teal-500/10">
            <h2 className="text-center font-bold text-base mb-1">RENCANA PELAKSANAAN PEMBELAJARAN (RPP)</h2>
            <p className="text-center text-gray-600 text-xs mb-4">Mata Pelajaran {state.mataPelajaran} — Kurikulum Merdeka (Fase D)</p>
            <table className="w-full border-collapse text-xs mb-4">
              <tbody>
                {[
                  ["Satuan Pendidikan", state.satuanPendidikan, "Kelas / Semester", `${state.kelas} / ${state.semester}`],
                  ["Mata Pelajaran", state.mataPelajaran, "Tahun Pelajaran", state.tahunPelajaran],
                  ["Materi Pokok", state.materi, "Alokasi Waktu", state.alokasi],
                  ["Pertemuan Ke-", state.pertemuanKe, "Model Pembelajaran", selectedModel?.nama ?? "-"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="border border-gray-300 px-3 py-1.5 font-bold w-40">{row[0]}</td>
                    <td className="border border-gray-300 px-3 py-1.5">{row[1]}</td>
                    <td className="border border-gray-300 px-3 py-1.5 font-bold w-40">{row[2]}</td>
                    <td className="border border-gray-300 px-3 py-1.5">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="font-bold text-teal-700 text-xs mb-1">TUJUAN PEMBELAJARAN:</p>
            <ul className="list-disc pl-5 text-xs text-gray-700 mb-3">
              {state.selectedTP.map((tp, i) => <li key={i}>{tp}</li>)}
            </ul>
            <p className="font-bold text-teal-700 text-xs mb-1">PROFIL LULUSAN 8 DIMENSI:</p>
            <p className="text-xs text-gray-700 mb-3">{state.selectedDimensi.map(id => DIMENSI_PPP.find(d => d.id === id)?.label).join(" · ")}</p>
            <p className="font-bold text-teal-700 text-xs mb-1">KEGIATAN INTI ({selectedModel?.nama}):</p>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans bg-gray-50 p-3 rounded border mb-3">{state.kegiatanInti}</pre>
            <p className="text-center text-xs text-gray-400 italic">— Pratinjau ringkas · Dokumen lengkap tersedia saat Cetak PDF / Word —</p>
          </div>
        )}

        {/* ── BOTTOM ACTIONS ── */}
        <div className="bg-card/50 border border-white/10 rounded-2xl p-5 mb-6 animate-slide-up">
          <p className="text-white/60 text-sm font-body text-center mb-4">RPP siap? Simpan dan cetak dalam format yang kamu butuhkan.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={handleSave}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-sm transition-all hover:scale-[1.03] ${saved ? "bg-emerald-600/80 border-emerald-400/40" : "bg-teal-600/80 hover:bg-teal-500 border-teal-400/40"}`}>
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Tersimpan!" : "Simpan RPP"}
            </button>
            <button onClick={handleWord}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 border border-blue-400/40 text-white font-bold text-sm transition-all hover:scale-[1.03]">
              <FileText className="w-4 h-4" /> Unduh Word (.doc)
            </button>
            <button onClick={handlePDF}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 border border-rose-400/40 text-white font-bold text-sm transition-all hover:scale-[1.03]">
              <Printer className="w-4 h-4" /> Cetak / Unduh PDF
            </button>
          </div>
          {!isReady && (
            <p className="text-amber-400/70 text-xs text-center mt-3">
              ⚠ Isi minimal: Materi Pokok, Model Pembelajaran, dan pilih minimal 1 Tujuan Pembelajaran.
            </p>
          )}
        </div>

        <div className="text-center">
          <button onClick={() => { playPopSound(); navigate("/ruang-untuk-guru/rpp"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Menu RPP
          </button>
        </div>
      </div>
    </div>
  );
};

export default RancangRPPPage;
