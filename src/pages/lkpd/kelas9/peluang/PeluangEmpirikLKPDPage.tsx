import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Eksperimen Lempar Koin 100 Kali",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#fde68a" textAnchor="middle">100 lemparan koin → muncul Angka 47 kali</text>
          <rect x="30" y="60" width="100" height="80" rx="8" fill="#fbbf24" fillOpacity="0.4" stroke="#fde68a" strokeWidth="1.5" />
          <text x="80" y="85" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Angka (A)</text>
          <text x="80" y="108" fontSize="22" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">47</text>
          <text x="80" y="128" fontSize="10" fill="#fde68a" textAnchor="middle">muncul</text>
          <rect x="150" y="60" width="100" height="80" rx="8" fill="#9ca3af" fillOpacity="0.4" stroke="#e5e7eb" strokeWidth="1.5" />
          <text x="200" y="85" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Gambar (G)</text>
          <text x="200" y="108" fontSize="22" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">53</text>
          <text x="200" y="128" fontSize="10" fill="#fde68a" textAnchor="middle">muncul</text>
          <rect x="40" y="158" width="200" height="32" rx="6" fill="#34d399" fillOpacity="0.4" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="180" fontSize="12" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">fr(A) = 47/100 = 0,47</text>
        </svg>
      </div>
    ),
    text:
      "Saat KOIN dilempar 100 kali, Angka muncul 47 kali. FREKUENSI RELATIF = banyak kejadian ÷ banyak percobaan = 47/100 = 0,47. Inilah PELUANG EMPIRIK — peluang dari HASIL EKSPERIMEN nyata.",
  },
  {
    title: "Situasi 2 — Semakin Banyak Percobaan, Semakin Stabil",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#67e8f9" textAnchor="middle">fr(Angka) untuk n yang berbeda</text>
          <line x1="40" y1="160" x2="260" y2="160" stroke="#67e8f9" strokeWidth="1.5" />
          <line x1="40" y1="40" x2="40" y2="160" stroke="#67e8f9" strokeWidth="1.5" />
          <line x1="40" y1="100" x2="260" y2="100" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" />
          <text x="265" y="103" fontSize="9" fill="#34d399">0,5</text>
          <circle cx="70" cy="55" r="4" fill="#fbbf24" />
          <text x="70" y="48" fontSize="9" fill="#fde68a" textAnchor="middle">10×</text>
          <circle cx="120" cy="120" r="4" fill="#fbbf24" />
          <text x="120" y="135" fontSize="9" fill="#fde68a" textAnchor="middle">50×</text>
          <circle cx="170" cy="108" r="4" fill="#fbbf24" />
          <text x="170" y="123" fontSize="9" fill="#fde68a" textAnchor="middle">100×</text>
          <circle cx="220" cy="102" r="4" fill="#fbbf24" />
          <text x="220" y="93" fontSize="9" fill="#fde68a" textAnchor="middle">1000×</text>
          <path d="M70 55 L120 120 L170 108 L220 102" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
          <text x="140" y="185" fontSize="10" fill="#a78bfa" textAnchor="middle">Semakin banyak n → fr semakin mendekati 0,5</text>
        </svg>
      </div>
    ),
    text:
      "Lihat! Saat n KECIL, frekuensi relatif berfluktuasi. Saat n BESAR (semakin banyak percobaan), nilai fr semakin STABIL mendekati 0,5 → ini sama dengan peluang TEORETIK. Inilah HUKUM BILANGAN BESAR.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Frekuensi RELATIF (fr) suatu kejadian A dirumuskan: fr(A) = …",
    kind: "choice",
    options: [
      "banyak A ÷ banyak percobaan",
      "banyak A × banyak percobaan",
      "banyak percobaan ÷ banyak A",
      "banyak A − banyak bukan A",
    ],
    correctIndex: 0,
    discussion: ["fr(A) = f(A) / n, dengan f(A) = banyak munculnya A dan n = banyak percobaan."],
  },
  {
    id: "g2",
    label: "Koin dilempar 50 kali, Angka muncul 28 kali. fr(Angka) = …",
    kind: "fill",
    answers: ["0,56", "0.56", "28/50", "14/25"],
    discussion: ["fr = 28/50 = 0,56."],
  },
  {
    id: "g3",
    label: "Dadu dilempar 60 kali, mata 6 muncul 12 kali. fr(mata 6) = …",
    kind: "fill",
    answers: ["0,2", "0.2", "12/60", "1/5"],
    discussion: ["fr = 12/60 = 1/5 = 0,2."],
  },
  {
    id: "g4",
    label: "PELUANG EMPIRIK adalah …",
    kind: "choice",
    options: [
      "perkiraan peluang berdasarkan hasil eksperimen sebenarnya",
      "peluang yang dihitung dari rumus n(A)/n(S)",
      "peluang yang selalu sama dengan 0,5",
      "perkiraan kasar tanpa data",
    ],
    correctIndex: 0,
    discussion: ["Peluang empirik = frekuensi relatif dari data eksperimen."],
  },
  {
    id: "g5",
    label: "Nilai frekuensi relatif fr(A) selalu berada antara …",
    kind: "fill",
    answers: ["0 dan 1", "0 sampai 1", "0-1"],
    discussion: ["0 ≤ fr(A) ≤ 1, sama seperti peluang."],
  },
  {
    id: "g6",
    label: "Pernyataan: Semakin BANYAK percobaan, peluang empirik semakin DEKAT dengan peluang teoretik.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Inilah hukum bilangan besar (law of large numbers).",
    ],
  },
  {
    id: "g7",
    label:
      "Dari 200 kelereng yang diambil acak, 30 berwarna merah. fr(merah) = …",
    kind: "fill",
    answers: ["0,15", "0.15", "30/200", "3/20"],
    discussion: ["fr = 30/200 = 3/20 = 0,15."],
  },
  {
    id: "g8",
    label:
      "Sebuah pabrik mengambil 500 produk, ditemukan 25 cacat. Peluang empirik produk cacat = …",
    kind: "fill",
    answers: ["0,05", "0.05", "1/20", "25/500"],
    discussion: ["fr = 25/500 = 0,05."],
  },
  {
    id: "g9",
    label:
      "Pernyataan: Peluang empirik selalu BERNILAI SAMA dengan peluang teoretik.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Peluang empirik bisa BEDA, terutama jika n kecil. Mereka MENDEKAT saat n besar.",
    ],
  },
  {
    id: "g10",
    label:
      "Pasangkan EKSPERIMEN dengan FREKUENSI RELATIF-nya:",
    kind: "match",
    pairs: [
      { left: "Koin: 40 kali, A muncul 22", right: "0,55" },
      { left: "Dadu: 100 kali, mata 6 muncul 18", right: "0,18" },
      { left: "Spinner: 80 putaran, Merah 24", right: "0,3" },
      { left: "Kartu: 50 ambil, As muncul 5", right: "0,1" },
    ],
    discussion: ["fr(A) = f(A) / n untuk masing-masing."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Frekuensi Relatif",
    text: "fr(A) = f(A) / n. Banyak munculnya kejadian A dibagi banyak percobaan. Hasilnya selalu antara 0 dan 1.",
    tone: "cyan",
  },
  {
    title: "Peluang Empirik",
    text: "PELUANG EMPIRIK = frekuensi relatif dari eksperimen NYATA. Diperoleh dari DATA, bukan dari rumus teoretik.",
    tone: "violet",
  },
  {
    title: "Hukum Bilangan Besar",
    text: "Semakin BANYAK percobaan (n besar), peluang empirik semakin DEKAT dengan peluang teoretik. Itulah mengapa eksperimen panjang lebih akurat.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "empirik-game-fr",
    title: "🎯 Game 1 — Tentukan Nilai Frekuensi Relatif",
    description: "Seret tiap kasus ke nilai frekuensi relatif yang TEPAT!",
    buckets: [
      { id: "v01", label: "0,1", emoji: "🔟", color: "cyan" },
      { id: "v025", label: "0,25", emoji: "📊", color: "violet" },
      { id: "v05", label: "0,5", emoji: "⚖️", color: "emerald" },
      { id: "v075", label: "0,75", emoji: "📈", color: "amber" },
    ],
    items: [
      { id: "f1", label: "20 dari 200", bucketId: "v01", emoji: "🔟" },
      { id: "f2", label: "5 dari 50", bucketId: "v01", emoji: "🔟" },
      { id: "f3", label: "10 dari 40", bucketId: "v025", emoji: "📊" },
      { id: "f4", label: "25 dari 100", bucketId: "v025", emoji: "📊" },
      { id: "f5", label: "30 dari 60", bucketId: "v05", emoji: "⚖️" },
      { id: "f6", label: "50 dari 100", bucketId: "v05", emoji: "⚖️" },
      { id: "f7", label: "30 dari 40", bucketId: "v075", emoji: "📈" },
      { id: "f8", label: "75 dari 100", bucketId: "v075", emoji: "📈" },
    ],
  },
  {
    kind: "arrow-match",
    id: "empirik-game-hitung",
    title: "🎯 Game 2 — Hitung Peluang Empirik",
    description: "Pasangkan tiap eksperimen dengan peluang empiriknya. Tekan ◀ ▶.",
    rightOptions: ["0,1", "0,2", "0,3", "0,4", "0,5", "0,6"],
    pairs: [
      { id: "h1", left: "Koin 100×, A 50×", correctRight: "0,5", emoji: "🪙" },
      { id: "h2", left: "Dadu 60×, '6' 12×", correctRight: "0,2", emoji: "🎲" },
      { id: "h3", left: "Kelereng 200, merah 60", correctRight: "0,3", emoji: "🔴" },
      { id: "h4", left: "Spinner 50, biru 5", correctRight: "0,1", emoji: "🔵" },
      { id: "h5", left: "Bola 50, kuning 30", correctRight: "0,6", emoji: "🟡" },
      { id: "h6", left: "Kartu 25, hati 10", correctRight: "0,4", emoji: "♥️" },
      { id: "h7", left: "Lampu 200, rusak 20", correctRight: "0,1", emoji: "💡" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Koin dilempar 80 kali, Gambar muncul 36 kali. fr(Gambar) = …",
    kind: "fill",
    answers: ["0,45", "0.45", "36/80", "9/20"],
    hint: "f/n.",
    discussion: ["36/80 = 9/20 = 0,45."],
  },
  {
    id: "pp2",
    question:
      "Dari 250 mahasiswa diambil acak, 40 menyukai matematika. Peluang empirik = …",
    kind: "fill",
    answers: ["0,16", "0.16", "40/250", "4/25"],
    hint: "40/250.",
    discussion: ["40/250 = 4/25 = 0,16."],
  },
  {
    id: "pp3",
    question:
      "Sebuah pabrik dari 1000 produk menemukan 35 cacat. Peluang empirik produk BAIK = …",
    kind: "fill",
    answers: ["0,965", "0.965", "965/1000", "193/200"],
    hint: "Hitung produk baik = 1000 − 35.",
    discussion: ["965/1000 = 0,965."],
  },
  {
    id: "pp4",
    question:
      "Dadu dilempar 120 kali, mata 4 muncul 19 kali. fr(mata 4) = …",
    kind: "fill",
    answers: ["19/120"],
    hint: "Tuliskan dalam pecahan paling sederhana atau bentuk pecahan asli.",
    discussion: ["19/120 (sudah paling sederhana)."],
  },
  {
    id: "pp5",
    question:
      "Pernyataan: Frekuensi relatif bisa bernilai NEGATIF.",
    kind: "truefalse",
    correct: false,
    hint: "Pikirkan rentang nilai fr.",
    discussion: ["SALAH. fr selalu 0 ≤ fr ≤ 1, tidak pernah negatif."],
  },
  {
    id: "pp6",
    question:
      "Dari 60 siswa, 24 menyukai sepak bola. Peluang empirik siswa MENYUKAI sepak bola = …",
    kind: "fill",
    answers: ["0,4", "0.4", "24/60", "2/5"],
    hint: "24/60.",
    discussion: ["24/60 = 2/5 = 0,4."],
  },
  {
    id: "pp7",
    question:
      "Pernyataan: Semakin SEDIKIT percobaan, peluang empirik semakin akurat.",
    kind: "truefalse",
    correct: false,
    hint: "Hukum bilangan besar.",
    discussion: [
      "SALAH. Justru sebaliknya — semakin BANYAK percobaan, semakin akurat.",
    ],
  },
  {
    id: "pp8",
    question:
      "Sebuah toko mengamati: dari 400 pembeli, 80 membeli kopi. Berapa peluang empirik pembeli BUKAN membeli kopi?",
    kind: "fill",
    answers: ["0,8", "0.8", "320/400", "4/5"],
    hint: "Pembeli bukan kopi = 400 − 80 = 320.",
    discussion: ["320/400 = 4/5 = 0,8."],
  },
];

const PeluangEmpirikLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Peluang"
    title="Peluang Empirik & Frekuensi Relatif — Penemuan Terbimbing"
    intro="Sobat Numatik 📊! Yuk lakukan eksperimen — lempar koin, putar spinner, ambil kelereng — lalu HITUNG sendiri frekuensi relatifnya. Kamu akan menemukan rumus fr(A) = f(A) / n dan memahami HUKUM BILANGAN BESAR!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan konsep peluang empirik."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/peluang"
    backLabel="Kembali ke Menu Peluang"
    scoreMessages={{
      perfect: "🌟 Mantap! Frekuensi relatif sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang rumus fr(A) = f(A)/n.",
      low: "💪 Tetap semangat! Mulai dari koin sederhana.",
    }}
  />
);

export default PeluangEmpirikLKPDPage;
