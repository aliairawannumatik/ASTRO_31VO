import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Kaleng Susu",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <ellipse cx="100" cy="40" rx="50" ry="14" fill="#22d3ee" fillOpacity="0.55" stroke="#67e8f9" strokeWidth="2" />
          <rect x="50" y="40" width="100" height="120" fill="#22d3ee" fillOpacity="0.35" stroke="#67e8f9" strokeWidth="2" />
          <ellipse cx="100" cy="160" rx="50" ry="14" fill="#22d3ee" fillOpacity="0.55" stroke="#67e8f9" strokeWidth="2" />
          <line x1="100" y1="40" x2="100" y2="160" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="105" y="105" fontSize="11" fill="#fbbf24">t</text>
          <line x1="100" y1="40" x2="150" y2="40" stroke="#f472b6" strokeWidth="1.5" />
          <text x="125" y="35" fontSize="11" fill="#f472b6" textAnchor="middle">r</text>
          <text x="200" y="60" fontSize="10" fontWeight="bold" fill="#fff">Kaleng = TABUNG!</text>
          <text x="200" y="80" fontSize="9" fill="#a7f3d0">2 lingkaran (atas-bawah)</text>
          <text x="200" y="95" fontSize="9" fill="#a7f3d0">+ 1 selimut (persegi panjang</text>
          <text x="200" y="110" fontSize="9" fill="#a7f3d0">yang dilengkungkan)</text>
        </svg>
      </div>
    ),
    text:
      "Sebuah kaleng susu, drum minyak, atau gelas adalah TABUNG. Dibatasi 2 lingkaran sejajar (alas & tutup) dan satu SELIMUT yang berbentuk persegi panjang saat dibuka.",
  },
  {
    title: "Situasi 2 — Selimut Tabung Dibuka",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <circle cx="50" cy="40" r="20" fill="#fbbf24" fillOpacity="0.4" stroke="#fde68a" strokeWidth="2" />
          <text x="50" y="44" fontSize="9" fill="#fff" textAnchor="middle">alas</text>
          <circle cx="50" cy="160" r="20" fill="#fbbf24" fillOpacity="0.4" stroke="#fde68a" strokeWidth="2" />
          <text x="50" y="164" fontSize="9" fill="#fff" textAnchor="middle">tutup</text>
          <rect x="100" y="60" width="160" height="80" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="2" />
          <text x="180" y="105" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">Selimut</text>
          <text x="180" y="55" fontSize="10" fill="#fde68a" textAnchor="middle">panjang = keliling alas = 2πr</text>
          <text x="270" y="100" fontSize="10" fill="#fde68a" textAnchor="end">tinggi = t</text>
          <text x="180" y="160" fontSize="11" fontWeight="bold" fill="#34d399" textAnchor="middle">Luas selimut = 2πr × t</text>
        </svg>
      </div>
    ),
    text:
      "Saat selimut tabung DIBUKA, ia menjadi PERSEGI PANJANG dengan panjang = KELILING alas (2πr) dan tinggi = t. Maka Luas Selimut = 2πr × t. Penemuan kunci!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Tabung memiliki sisi alas dan tutup berbentuk … dan selimut berbentuk … (saat dibuka).",
    kind: "choice",
    options: [
      "persegi & lingkaran",
      "lingkaran & persegi panjang",
      "segitiga & trapesium",
      "lingkaran & lingkaran",
    ],
    correctIndex: 1,
    discussion: [
      "Alas & tutup = LINGKARAN.",
      "Selimut = persegi panjang (saat jaring-jaring dibuka).",
    ],
  },
  {
    id: "g2",
    label:
      "Panjang sisi PANJANG selimut tabung = KELILING alas = …",
    kind: "choice",
    options: ["πr", "2πr", "πr²", "πd²"],
    correctIndex: 1,
    discussion: ["Keliling lingkaran = 2πr (atau πd)."],
  },
  {
    id: "g3",
    label:
      "Maka rumus LUAS SELIMUT tabung = …",
    kind: "choice",
    options: ["πr × t", "2πr × t", "πr² × t", "2πr²"],
    correctIndex: 1,
    discussion: [
      "Luas persegi panjang = panjang × lebar = 2πr × t.",
      "L_selimut = 2πrt.",
    ],
  },
  {
    id: "g4",
    label:
      "Luas alas tabung (lingkaran) = …",
    kind: "fill",
    answers: ["πr²", "πr^2", "πr2", "pi r²", "phi r²"],
    discussion: ["L_alas = πr² (rumus luas lingkaran)."],
  },
  {
    id: "g5",
    label:
      "LUAS PERMUKAAN total tabung = 2 × L_alas + L_selimut = 2πr² + 2πrt. Disederhanakan menjadi …",
    kind: "choice",
    options: [
      "2πr(r + t)",
      "πr(r + 2t)",
      "πr² + 2πrt",
      "2πr² × 2πrt",
    ],
    correctIndex: 0,
    discussion: [
      "Faktorkan 2πr: 2πr² + 2πrt = 2πr(r + t).",
      "Lebih ringkas dan mudah dihafal!",
    ],
  },
  {
    id: "g6",
    label:
      "Volume tabung = Luas alas × tinggi = …",
    kind: "choice",
    options: ["πr² + t", "πr × t", "πr² × t", "2πr × t"],
    correctIndex: 2,
    discussion: ["V = πr² × t."],
  },
  {
    id: "g7",
    label:
      "Sebuah tabung r = 7 cm, t = 10 cm. Luas selimut = … cm² (gunakan π = 22/7).",
    kind: "fill",
    answers: ["440"],
    discussion: ["L_selimut = 2πrt = 2 × 22/7 × 7 × 10 = 440 cm²."],
  },
  {
    id: "g8",
    label:
      "Volume tabung r = 7 cm, t = 10 cm = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["1540", "1.540"],
    discussion: ["V = πr²t = 22/7 × 49 × 10 = 22 × 70 = 1.540 cm³."],
  },
  {
    id: "g9",
    label:
      "Luas permukaan tabung r = 7, t = 10 = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["748"],
    discussion: [
      "L = 2πr(r + t) = 2 × 22/7 × 7 × (7 + 10) = 44 × 17 = 748 cm².",
    ],
  },
  {
    id: "g10",
    label:
      "Pernyataan: Tabung TANPA tutup (terbuka di atas) memiliki luas permukaan = πr² + 2πrt.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Hanya alas (1 lingkaran) + selimut.",
      "Bukan 2πr(r+t) yang menghitung tutup juga.",
    ],
  },
  {
    id: "g11",
    label:
      "Tabung diisi air setinggi 5 cm. Jika r = 14 cm, volume air = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["3080", "3.080"],
    discussion: [
      "V_air = πr² × t_air = 22/7 × 196 × 5 = 22 × 28 × 5 = 3.080 cm³.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan rumus tabung dengan namanya:",
    kind: "match",
    pairs: [
      { left: "L_alas", right: "πr²" },
      { left: "L_selimut", right: "2πrt" },
      { left: "L_permukaan", right: "2πr(r + t)" },
      { left: "Volume", right: "πr²t" },
    ],
    discussion: [
      "Hafal 4 rumus dasar tabung dengan baik.",
      "L_permukaan = 2 × L_alas + L_selimut.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Bagian Tabung",
    text: "Tabung dibatasi 2 lingkaran sejajar (alas & tutup) berjari-jari r dan 1 selimut. Selimut = persegi panjang dengan panjang 2πr dan tinggi t.",
    tone: "cyan",
  },
  {
    title: "Rumus Luas",
    text: "L_alas = πr². L_selimut = 2πrt. L_permukaan tertutup = 2πr(r + t). Tabung tanpa tutup = πr² + 2πrt.",
    tone: "violet",
  },
  {
    title: "Rumus Volume",
    text: "V = πr² × t = Luas alas × tinggi. Untuk hitungan: π ≈ 22/7 (jika r kelipatan 7) atau π ≈ 3,14.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "tabung-game-rumus",
    title: "🎯 Game 1 — Cocokkan Rumus (Seret!)",
    description: "Seret setiap rumus ke kategori BAGIAN tabung yang sesuai.",
    buckets: [
      { id: "alas", label: "L. Alas", emoji: "⭕", color: "cyan" },
      { id: "selimut", label: "L. Selimut", emoji: "📜", color: "amber" },
      { id: "permukaan", label: "L. Permukaan", emoji: "📦", color: "emerald" },
      { id: "volume", label: "Volume", emoji: "🥫", color: "violet" },
    ],
    items: [
      { id: "t1", label: "πr²", bucketId: "alas", emoji: "⭕" },
      { id: "t2", label: "2πrt", bucketId: "selimut", emoji: "📜" },
      { id: "t3", label: "2πr(r + t)", bucketId: "permukaan", emoji: "📦" },
      { id: "t4", label: "πr² × t", bucketId: "volume", emoji: "🥫" },
      { id: "t5", label: "Luas lingkaran", bucketId: "alas", emoji: "⭕" },
      { id: "t6", label: "Keliling × tinggi", bucketId: "selimut", emoji: "📜" },
      { id: "t7", label: "2L_alas + L_selimut", bucketId: "permukaan", emoji: "📦" },
      { id: "t8", label: "L_alas × t", bucketId: "volume", emoji: "🥫" },
    ],
  },
  {
    kind: "arrow-match",
    id: "tabung-game-hitung",
    title: "🎯 Game 2 — Hitung Cepat (Pakai π = 22/7)",
    description: "Pasangkan setiap soal dengan HASIL hitungannya. Tekan ◀ ▶.",
    rightOptions: ["154", "440", "616", "770", "1.540", "3.080", "9.240"],
    pairs: [
      { id: "h1", left: "L_alas, r=7", correctRight: "154", emoji: "🥫" },
      { id: "h2", left: "L_selimut, r=7, t=10", correctRight: "440", emoji: "🥫" },
      { id: "h3", left: "L_alas, r=14", correctRight: "616", emoji: "🥫" },
      { id: "h4", left: "L_selimut, r=7, t=17,5", correctRight: "770", emoji: "🥫" },
      { id: "h5", left: "V, r=7, t=10", correctRight: "1.540", emoji: "🥫" },
      { id: "h6", left: "V, r=14, t=5", correctRight: "3.080", emoji: "🥫" },
      { id: "h7", left: "V, r=14, t=15", correctRight: "9.240", emoji: "🥫" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Tabung r = 10 cm, t = 20 cm. Volume = … cm³ (π = 3,14).",
    kind: "fill",
    answers: ["6280", "6.280"],
    hint: "V = πr²t.",
    discussion: ["V = 3,14 × 100 × 20 = 6.280 cm³."],
  },
  {
    id: "pp2",
    question: "Tabung r = 7, t = 12. Luas selimut = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["528"],
    hint: "L_selimut = 2πrt.",
    discussion: ["L = 2 × 22/7 × 7 × 12 = 44 × 12 = 528 cm²."],
  },
  {
    id: "pp3",
    question: "Tabung r = 7, t = 10. Luas permukaan = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["748"],
    hint: "2πr(r + t).",
    discussion: ["2 × 22/7 × 7 × 17 = 44 × 17 = 748 cm²."],
  },
  {
    id: "pp4",
    question:
      "Drum air tinggi 1 m, jari-jari 35 cm. Volume = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["385000", "385.000"],
    hint: "Konversi tinggi: 1 m = 100 cm.",
    discussion: ["V = 22/7 × 35² × 100 = 22 × 175 × 100 = 385.000 cm³."],
  },
  {
    id: "pp5",
    question:
      "Tabung tanpa tutup r = 7, t = 20. Luas permukaan = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["1034"],
    hint: "πr² + 2πrt (alas + selimut).",
    discussion: [
      "L = 22/7 × 49 + 2 × 22/7 × 7 × 20 = 154 + 880 = 1.034 cm².",
    ],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Jika jari-jari tabung dilipatduakan, volume juga dilipatduakan.",
    kind: "truefalse",
    correct: false,
    hint: "V = πr²t — perhatikan r².",
    discussion: [
      "SALAH. r dikuadratkan, jadi r dikalikan 2 → r² dikalikan 4.",
      "Volume menjadi 4 kali lipat.",
    ],
  },
  {
    id: "pp7",
    question:
      "Sebuah tabung diisi air ½ penuh. r = 14 cm, t total = 20 cm. Volume air = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["6160", "6.160"],
    hint: "Tinggi air = ½ × 20 = 10 cm.",
    discussion: ["V_air = 22/7 × 196 × 10 = 6.160 cm³."],
  },
  {
    id: "pp8",
    question:
      "Sebuah kaleng cat berdiameter 14 cm dan tinggi 20 cm. Berapa luas label yang dibutuhkan menutupi seluruh sisi melengkung? (π = 22/7)",
    kind: "fill",
    answers: ["880"],
    hint: "r = d/2 = 7. Hitung L_selimut.",
    discussion: [
      "r = 7. L_selimut = 2 × 22/7 × 7 × 20 = 880 cm².",
    ],
  },
];

const TabungLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Bangun Ruang Sisi Lengkung"
    title="Tabung — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami TABUNG 🥫! Kamu akan menemukan bagaimana selimut tabung yang dibuka menjadi persegi panjang, lalu menurunkan rumus luas dan volume — sambil bermain seret kartu mencocokkan rumus!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan rumus luas selimut, luas permukaan, dan volume tabung."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu tentang tabung dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/bangun-ruang-sisi-lengkung"
    backLabel="Kembali ke Menu Bangun Ruang Sisi Lengkung"
    scoreMessages={{
      perfect: "🌟 Mantap! Rumus tabung sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang penurunan L_selimut = 2πrt.",
      low: "💪 Tetap semangat! Mulai dari L_alas = πr² dan keliling = 2πr.",
    }}
  />
);

export default TabungLKPDPage;
