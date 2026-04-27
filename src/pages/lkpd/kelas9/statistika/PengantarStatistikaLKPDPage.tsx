import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Survei Tinggi Badan",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <rect x="20" y="20" width="240" height="50" rx="8" fill="#22d3ee" fillOpacity="0.25" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="140" y="40" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">POPULASI: Seluruh siswa SMP X (450 siswa)</text>
          <text x="140" y="58" fontSize="9" fill="#a7f3d0" textAnchor="middle">Semua individu yang ingin diteliti</text>
          <rect x="80" y="90" width="120" height="40" rx="8" fill="#fbbf24" fillOpacity="0.35" stroke="#fde68a" strokeWidth="1.5" />
          <text x="140" y="108" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">SAMPEL: 45 siswa</text>
          <text x="140" y="122" fontSize="9" fill="#fde68a" textAnchor="middle">Bagian populasi yang diukur</text>
          <text x="140" y="155" fontSize="10" fill="#34d399" textAnchor="middle">Data tinggi badan: 150, 152, 148, 155, …</text>
          <text x="140" y="172" fontSize="9" fill="#a7f3d0" textAnchor="middle">→ DATA KUANTITATIF (angka, dapat diukur)</text>
        </svg>
      </div>
    ),
    text:
      "Untuk meneliti tinggi badan siswa SMP X (450 anak), kita pilih SAMPEL 45 siswa secara acak. Tinggi badan adalah DATA KUANTITATIF (berupa angka). Hasil sampel digunakan untuk memperkirakan keadaan POPULASI.",
  },
  {
    title: "Situasi 2 — Warna Favorit",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-fuchsia-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">"Apa warna favoritmu?"</text>
          <circle cx="60" cy="80" r="22" fill="#ef4444" />
          <text x="60" y="84" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">Merah</text>
          <text x="60" y="115" fontSize="9" fill="#a7f3d0" textAnchor="middle">12</text>
          <circle cx="120" cy="80" r="22" fill="#3b82f6" />
          <text x="120" y="84" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">Biru</text>
          <text x="120" y="115" fontSize="9" fill="#a7f3d0" textAnchor="middle">18</text>
          <circle cx="180" cy="80" r="22" fill="#22c55e" />
          <text x="180" y="84" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">Hijau</text>
          <text x="180" y="115" fontSize="9" fill="#a7f3d0" textAnchor="middle">8</text>
          <circle cx="240" cy="80" r="22" fill="#fbbf24" />
          <text x="240" y="84" fontSize="10" fontWeight="bold" fill="#0b1220" textAnchor="middle">Kuning</text>
          <text x="240" y="115" fontSize="9" fill="#a7f3d0" textAnchor="middle">7</text>
          <text x="140" y="150" fontSize="10" fontWeight="bold" fill="#34d399" textAnchor="middle">Warna = DATA KUALITATIF (kategori)</text>
          <text x="140" y="170" fontSize="9" fill="#a7f3d0" textAnchor="middle">Frekuensi 12, 18, 8, 7 = data KUANTITATIF</text>
          <text x="140" y="185" fontSize="9" fill="#fde68a" textAnchor="middle">Pengumpulan: ANGKET / KUESIONER</text>
        </svg>
      </div>
    ),
    text:
      "Bertanya 'warna favoritmu?' menghasilkan DATA KUALITATIF (berupa kategori, bukan angka). Cara pengumpulan: ANGKET. Cara lain: WAWANCARA, OBSERVASI, dan STUDI PUSTAKA/DOKUMENTASI.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "POPULASI = … sedangkan SAMPEL = …",
    kind: "choice",
    options: [
      "bagian dari objek; seluruh objek",
      "seluruh objek yang diteliti; bagian dari populasi yang diambil",
      "data angka; data kategori",
      "alat ukur; cara pengumpulan",
    ],
    correctIndex: 1,
    discussion: [
      "POPULASI: SELURUH objek/individu yang ingin diteliti.",
      "SAMPEL: BAGIAN populasi yang diambil sebagai wakil.",
    ],
  },
  {
    id: "g2",
    label:
      "Data BERUPA ANGKA dan dapat diukur disebut data …",
    kind: "choice",
    options: ["kualitatif", "kuantitatif", "primer", "sekunder"],
    correctIndex: 1,
    discussion: [
      "KUANTITATIF = berupa angka (kuantitas).",
      "Contoh: tinggi, berat, nilai, banyaknya saudara.",
    ],
  },
  {
    id: "g3",
    label:
      "Data BERUPA KATEGORI/sifat (bukan angka) disebut data …",
    kind: "choice",
    options: ["kuantitatif", "kualitatif", "tunggal", "kelompok"],
    correctIndex: 1,
    discussion: [
      "KUALITATIF = berupa kategori, sifat, atau golongan.",
      "Contoh: warna, jenis kelamin, agama, hobi.",
    ],
  },
  {
    id: "g4",
    label:
      "Tinggi badan, berat badan, dan nilai ulangan adalah data …",
    kind: "fill",
    answers: ["kuantitatif"],
    discussion: ["Semua bisa dinyatakan dengan ANGKA → kuantitatif."],
  },
  {
    id: "g5",
    label:
      "Hobi siswa, jenis kelamin, dan suku bangsa adalah data …",
    kind: "fill",
    answers: ["kualitatif"],
    discussion: ["Semua berupa KATEGORI → kualitatif."],
  },
  {
    id: "g6",
    label:
      "Cara pengumpulan data dengan menyebar lembar pertanyaan tertulis adalah …",
    kind: "choice",
    options: ["wawancara", "observasi", "angket/kuesioner", "studi pustaka"],
    correctIndex: 2,
    discussion: ["ANGKET = lembar tertulis berisi pertanyaan."],
  },
  {
    id: "g7",
    label:
      "Bertanya langsung secara LISAN kepada responden disebut …",
    kind: "choice",
    options: ["wawancara", "observasi", "angket", "eksperimen"],
    correctIndex: 0,
    discussion: ["WAWANCARA = tanya jawab LISAN."],
  },
  {
    id: "g8",
    label:
      "Mengamati dan mencatat secara langsung di lapangan disebut …",
    kind: "choice",
    options: ["wawancara", "observasi", "angket", "studi pustaka"],
    correctIndex: 1,
    discussion: ["OBSERVASI = pengamatan langsung."],
  },
  {
    id: "g9",
    label:
      "Mengambil data dari buku, internet, atau dokumen yang sudah ada disebut …",
    kind: "choice",
    options: ["wawancara", "observasi", "angket", "studi pustaka/dokumentasi"],
    correctIndex: 3,
    discussion: ["STUDI PUSTAKA = data dari sumber yang sudah ada."],
  },
  {
    id: "g10",
    label:
      "Dari 600 siswa SMP, diteliti 60 siswa untuk mengetahui jajanan favorit. Yang menjadi POPULASI adalah …",
    kind: "choice",
    options: ["60 siswa yang diteliti", "600 siswa SMP", "jajanan favorit", "semua jajanan"],
    correctIndex: 1,
    discussion: [
      "POPULASI = seluruh objek (600 siswa).",
      "Sampel = 60 siswa.",
    ],
  },
  {
    id: "g11",
    label:
      "Pernyataan: 'Banyak saudara kandung' adalah data kualitatif.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Banyak saudara berupa ANGKA → KUANTITATIF.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan ISTILAH dengan PENGERTIANNYA:",
    kind: "match",
    pairs: [
      { left: "Populasi", right: "Seluruh objek penelitian" },
      { left: "Sampel", right: "Bagian populasi yang diteliti" },
      { left: "Data kuantitatif", right: "Berupa angka" },
      { left: "Data kualitatif", right: "Berupa kategori" },
    ],
    discussion: ["Hafal istilah-istilah dasar statistika."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Populasi & Sampel",
    text: "POPULASI = seluruh objek yang akan diteliti. SAMPEL = bagian dari populasi yang dipilih sebagai wakil. Sampel yang baik harus representatif dan acak.",
    tone: "cyan",
  },
  {
    title: "Jenis Data",
    text: "KUANTITATIF = berupa angka (tinggi, berat, nilai). KUALITATIF = berupa kategori (warna, hobi, jenis kelamin). Berdasarkan sumber: data PRIMER (langsung) dan SEKUNDER (dari pihak lain).",
    tone: "violet",
  },
  {
    title: "Cara Pengumpulan Data",
    text: "ANGKET (kuesioner tertulis), WAWANCARA (lisan), OBSERVASI (pengamatan langsung), STUDI PUSTAKA/DOKUMENTASI (dari sumber yang sudah ada).",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "stat-game-jenis",
    title: "🎯 Game 1 — Jenis Data (Seret!)",
    description: "Seret setiap data ke kategori KUALITATIF atau KUANTITATIF.",
    buckets: [
      { id: "kual", label: "KUALITATIF (kategori)", emoji: "🎨", color: "rose" },
      { id: "kuan", label: "KUANTITATIF (angka)", emoji: "🔢", color: "cyan" },
    ],
    items: [
      { id: "d1", label: "Tinggi badan", bucketId: "kuan", emoji: "📏" },
      { id: "d2", label: "Warna favorit", bucketId: "kual", emoji: "🎨" },
      { id: "d3", label: "Nilai matematika", bucketId: "kuan", emoji: "💯" },
      { id: "d4", label: "Hobi", bucketId: "kual", emoji: "⚽" },
      { id: "d5", label: "Berat badan", bucketId: "kuan", emoji: "⚖️" },
      { id: "d6", label: "Jenis kelamin", bucketId: "kual", emoji: "👫" },
      { id: "d7", label: "Banyak saudara", bucketId: "kuan", emoji: "🧑‍🤝‍🧑" },
      { id: "d8", label: "Suku bangsa", bucketId: "kual", emoji: "🌏" },
    ],
  },
  {
    kind: "arrow-match",
    id: "stat-game-cara",
    title: "🎯 Game 2 — Cara Pengumpulan Data",
    description: "Pasangkan situasi dengan METODE pengumpulan datanya. Tekan ◀ ▶.",
    rightOptions: ["Angket", "Wawancara", "Observasi", "Studi Pustaka"],
    pairs: [
      { id: "c1", left: "Tanya jawab LISAN", correctRight: "Wawancara", emoji: "🎤" },
      { id: "c2", left: "Lembar pertanyaan TERTULIS", correctRight: "Angket", emoji: "📝" },
      { id: "c3", left: "Mengamati & mencatat langsung", correctRight: "Observasi", emoji: "👁️" },
      { id: "c4", left: "Data dari buku & internet", correctRight: "Studi Pustaka", emoji: "📚" },
      { id: "c5", left: "Survei lewat Google Form", correctRight: "Angket", emoji: "💻" },
      { id: "c6", left: "Reporter mewawancarai pemain", correctRight: "Wawancara", emoji: "🎙️" },
      { id: "c7", left: "Menghitung pengunjung mall", correctRight: "Observasi", emoji: "🚶" },
      { id: "c8", left: "Mencari data BPS sensus 2023", correctRight: "Studi Pustaka", emoji: "📖" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question:
      "Untuk meneliti rasa es krim favorit di SMP (700 siswa), diambil 70 siswa secara acak. Yang menjadi SAMPEL adalah … siswa.",
    kind: "fill",
    answers: ["70"],
    hint: "Sampel = bagian populasi yang diambil.",
    discussion: ["Sampel = 70 siswa. Populasi = 700 siswa."],
  },
  {
    id: "pp2",
    question: "Banyak buku di perpustakaan sekolah adalah data jenis …",
    kind: "fill",
    answers: ["kuantitatif"],
    hint: "Berupa angka.",
    discussion: ["Banyak buku = angka → kuantitatif."],
  },
  {
    id: "pp3",
    question: "Jenis golongan darah siswa adalah data jenis …",
    kind: "fill",
    answers: ["kualitatif"],
    hint: "Berupa kategori (A, B, AB, O).",
    discussion: ["Berupa kategori → kualitatif."],
  },
  {
    id: "pp4",
    question:
      "Cara mengumpulkan data jumlah penonton bioskop dengan langsung mengamati dan menghitung disebut …",
    kind: "choice",
    options: ["wawancara", "observasi", "angket", "studi pustaka"],
    correctIndex: 1,
    hint: "Pengamatan langsung.",
    discussion: ["OBSERVASI."],
  },
  {
    id: "pp5",
    question:
      "Pernyataan: Sampel yang baik harus dipilih secara ACAK agar mewakili populasi.",
    kind: "truefalse",
    correct: true,
    hint: "Acak = representatif.",
    discussion: ["BENAR. Pengambilan sampel acak = sampel representatif."],
  },
  {
    id: "pp6",
    question:
      "Data hasil wawancara langsung dengan responden adalah data …",
    kind: "choice",
    options: ["primer", "sekunder", "tunggal", "kelompok"],
    correctIndex: 0,
    hint: "Diambil langsung oleh peneliti.",
    discussion: ["PRIMER = data langsung dari sumber pertama."],
  },
  {
    id: "pp7",
    question:
      "Data dari laporan tahunan BPS yang diambil ulang oleh peneliti adalah data …",
    kind: "choice",
    options: ["primer", "sekunder", "kualitatif", "diskrit"],
    correctIndex: 1,
    hint: "Sudah dikumpulkan pihak lain sebelumnya.",
    discussion: ["SEKUNDER = data dari pihak lain."],
  },
  {
    id: "pp8",
    question:
      "Sebutkan jenis cara pengumpulan data yang TEPAT untuk mengetahui pendapat 1.000 pelanggan tentang layanan bank: …",
    kind: "choice",
    options: ["observasi", "angket/kuesioner", "studi pustaka", "eksperimen"],
    correctIndex: 1,
    hint: "Jumlah responden BANYAK → tertulis lebih efisien.",
    discussion: [
      "ANGKET paling efisien untuk responden banyak.",
      "Wawancara cocok untuk SEDIKIT responden.",
    ],
  },
];

const PengantarStatistikaLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Statistika"
    title="Pengantar Statistika & Pengumpulan Data — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami STATISTIKA 📚! Kamu akan menemukan perbedaan POPULASI vs SAMPEL, jenis data KUANTITATIF vs KUALITATIF, dan cara-cara mengumpulkan data — sambil bermain seret kartu mengelompokkan jenis data!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan istilah-istilah dasar statistika."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/statistika"
    backLabel="Kembali ke Menu Statistika"
    scoreMessages={{
      perfect: "🌟 Mantap! Konsep dasar statistika sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang populasi/sampel & jenis data.",
      low: "💪 Tetap semangat! Mulai dari beda populasi & sampel.",
    }}
  />
);

export default PengantarStatistikaLKPDPage;
