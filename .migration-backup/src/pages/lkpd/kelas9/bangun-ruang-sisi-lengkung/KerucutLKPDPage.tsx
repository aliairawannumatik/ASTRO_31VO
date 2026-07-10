import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Topi Ulang Tahun",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <polygon points="100,30 50,170 150,170" fill="#f472b6" fillOpacity="0.5" stroke="#f9a8d4" strokeWidth="2" />
          <ellipse cx="100" cy="170" rx="50" ry="12" fill="#f472b6" fillOpacity="0.4" stroke="#f9a8d4" strokeWidth="2" />
          <line x1="100" y1="30" x2="100" y2="170" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="105" y="100" fontSize="11" fill="#fbbf24">t</text>
          <line x1="100" y1="170" x2="150" y2="170" stroke="#34d399" strokeWidth="1.5" />
          <text x="125" y="185" fontSize="11" fill="#34d399" textAnchor="middle">r</text>
          <line x1="100" y1="30" x2="150" y2="170" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="135" y="105" fontSize="11" fill="#67e8f9">s</text>
          <text x="200" y="60" fontSize="10" fontWeight="bold" fill="var(--icon-color)">Kerucut!</text>
          <text x="200" y="80" fontSize="9" fill="#fde68a">r = jari-jari alas</text>
          <text x="200" y="95" fontSize="9" fill="#fde68a">t = tinggi (tegak)</text>
          <text x="200" y="110" fontSize="9" fill="#fde68a">s = garis pelukis</text>
          <text x="200" y="135" fontSize="11" fontWeight="bold" fill="#34d399">s² = r² + t²</text>
        </svg>
      </div>
    ),
    text:
      "Topi ulang tahun, ujung pensil, atau es krim cone adalah KERUCUT. Bagiannya: alas (lingkaran berjari-jari r), tinggi t, dan garis pelukis s yang menghubungkan puncak ke tepi alas. Berlaku Pythagoras: s² = r² + t².",
  },
  {
    title: "Situasi 2 — Selimut Kerucut Dibuka",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <path d="M 140 20 L 60 160 A 90 90 0 0 1 220 160 Z" fill="#a78bfa" fillOpacity="0.45" stroke="#c4b5fd" strokeWidth="2" />
          <text x="140" y="100" fontSize="10" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Selimut</text>
          <text x="140" y="115" fontSize="9" fill="var(--icon-color)" textAnchor="middle">(JURING lingkaran)</text>
          <line x1="140" y1="20" x2="60" y2="160" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="92" y="98" fontSize="10" fill="#fbbf24">s</text>
          <text x="140" y="180" fontSize="11" fontWeight="bold" fill="#34d399" textAnchor="middle">Luas Selimut = πrs</text>
        </svg>
      </div>
    ),
    text:
      "Selimut kerucut yang dibuka berbentuk JURING lingkaran berjari-jari s. Hasil penurunan: Luas Selimut = πrs. Inilah penemuan kunci untuk rumus luas permukaan kerucut!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Bagian kerucut: alas berbentuk … dan selimut (saat dibuka) berbentuk …",
    kind: "choice",
    options: [
      "lingkaran & persegi panjang",
      "persegi & juring",
      "lingkaran & juring lingkaran",
      "elips & segitiga",
    ],
    correctIndex: 2,
    discussion: [
      "Alas = LINGKARAN.",
      "Selimut = JURING lingkaran (berjari-jari s).",
    ],
  },
  {
    id: "g2",
    label:
      "Hubungan antara r (jari-jari alas), t (tinggi), dan s (garis pelukis) adalah …",
    kind: "choice",
    options: ["s = r + t", "s² = r² + t²", "s² = r² − t²", "s = r × t"],
    correctIndex: 1,
    discussion: [
      "Pythagoras pada segitiga r-t-s: s² = r² + t².",
      "Maka s = √(r² + t²).",
    ],
  },
  {
    id: "g3",
    label:
      "Kerucut dengan r = 6 cm, t = 8 cm. Garis pelukis s = … cm.",
    kind: "fill",
    answers: ["10"],
    discussion: ["s = √(6² + 8²) = √100 = 10 cm."],
  },
  {
    id: "g4",
    label: "Rumus LUAS SELIMUT kerucut = …",
    kind: "choice",
    options: ["πr²", "πrs", "2πrs", "½πrs"],
    correctIndex: 1,
    discussion: ["L_selimut = πrs (turunan dari luas juring)."],
  },
  {
    id: "g5",
    label:
      "Luas alas kerucut = …",
    kind: "fill",
    answers: ["πr²", "πr^2", "πr2", "pi r²"],
    discussion: ["L_alas = πr² (rumus luas lingkaran)."],
  },
  {
    id: "g6",
    label:
      "LUAS PERMUKAAN kerucut = L_alas + L_selimut = πr² + πrs. Disederhanakan menjadi …",
    kind: "choice",
    options: [
      "πr(r + s)",
      "πr(2r + s)",
      "π(r + s)",
      "πrs",
    ],
    correctIndex: 0,
    discussion: ["Faktorkan πr: πr² + πrs = πr(r + s)."],
  },
  {
    id: "g7",
    label:
      "VOLUME kerucut = … (dibandingkan dengan volume tabung yang alas dan tingginya sama).",
    kind: "choice",
    options: [
      "sama dengan tabung",
      "½ × volume tabung",
      "⅓ × volume tabung",
      "2 × volume tabung",
    ],
    correctIndex: 2,
    discussion: [
      "Volume kerucut = ⅓ × volume tabung sealas dan setinggi.",
      "Karena V_tabung = πr²t, maka V_kerucut = ⅓πr²t.",
    ],
  },
  {
    id: "g8",
    label: "Rumus VOLUME kerucut = …",
    kind: "choice",
    options: ["πr²t", "⅓πr²t", "πrs", "⅓πrs"],
    correctIndex: 1,
    discussion: ["V = ⅓ × πr² × t = ⅓πr²t."],
  },
  {
    id: "g9",
    label:
      "Kerucut r = 7 cm, t = 24 cm. Hitung s = … cm.",
    kind: "fill",
    answers: ["25"],
    discussion: ["s = √(49 + 576) = √625 = 25 cm."],
  },
  {
    id: "g10",
    label:
      "Kerucut r = 7, s = 25. Luas permukaan = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["704"],
    discussion: [
      "L = πr(r + s) = 22/7 × 7 × 32 = 22 × 32 = 704 cm².",
    ],
  },
  {
    id: "g11",
    label:
      "Kerucut r = 7, t = 24. Volume = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["1232", "1.232"],
    discussion: [
      "V = ⅓ × 22/7 × 49 × 24 = ⅓ × 22 × 7 × 24 = 1.232 cm³.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan rumus kerucut dengan namanya:",
    kind: "match",
    pairs: [
      { left: "Garis pelukis s", right: "√(r² + t²)" },
      { left: "L_selimut", right: "πrs" },
      { left: "L_permukaan", right: "πr(r + s)" },
      { left: "Volume", right: "⅓πr²t" },
    ],
    discussion: ["Hafal 4 rumus dasar kerucut + Pythagoras."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Bagian Kerucut",
    text: "Alas = lingkaran (jari-jari r). t = tinggi tegak. s = garis pelukis (puncak ke tepi alas). Selimut = juring lingkaran berjari-jari s. Pythagoras: s² = r² + t².",
    tone: "rose",
  },
  {
    title: "Rumus Luas",
    text: "L_alas = πr². L_selimut = πrs. L_permukaan = πr(r + s). Tanpa alas (terbuka): hanya πrs.",
    tone: "violet",
  },
  {
    title: "Rumus Volume",
    text: "V = ⅓ × πr² × t = ⅓πr²t. Volume kerucut = ⅓ volume tabung sealas dan setinggi.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "kerucut-game-rumus",
    title: "🎯 Game 1 — Cocokkan Rumus (Seret!)",
    description: "Seret setiap rumus ke kategori yang sesuai.",
    buckets: [
      { id: "pelukis", label: "Garis Pelukis s", emoji: "📏", color: "cyan" },
      { id: "selimut", label: "L. Selimut", emoji: "🎉", color: "amber" },
      { id: "permukaan", label: "L. Permukaan", emoji: "📦", color: "emerald" },
      { id: "volume", label: "Volume", emoji: "🍦", color: "violet" },
    ],
    items: [
      { id: "k1", label: "πrs", bucketId: "selimut", emoji: "🎉" },
      { id: "k2", label: "πr(r + s)", bucketId: "permukaan", emoji: "📦" },
      { id: "k3", label: "⅓πr²t", bucketId: "volume", emoji: "🍦" },
      { id: "k4", label: "√(r² + t²)", bucketId: "pelukis", emoji: "📏" },
      { id: "k5", label: "Juring lingkaran", bucketId: "selimut", emoji: "🎉" },
      { id: "k6", label: "L_alas + L_selimut", bucketId: "permukaan", emoji: "📦" },
      { id: "k7", label: "⅓ × πr² × t", bucketId: "volume", emoji: "🍦" },
      { id: "k8", label: "Pythagoras r,t,s", bucketId: "pelukis", emoji: "📏" },
    ],
  },
  {
    kind: "arrow-match",
    id: "kerucut-game-hitung",
    title: "🎯 Game 2 — Hitung Cepat (π = 22/7)",
    description: "Pasangkan setiap soal dengan HASIL hitungannya. Tekan ◀ ▶.",
    rightOptions: ["10", "13", "25", "154", "550", "704", "1.232"],
    pairs: [
      { id: "h1", left: "s, r=6, t=8", correctRight: "10", emoji: "🍦" },
      { id: "h2", left: "s, r=5, t=12", correctRight: "13", emoji: "🍦" },
      { id: "h3", left: "s, r=7, t=24", correctRight: "25", emoji: "🍦" },
      { id: "h4", left: "L_alas, r=7", correctRight: "154", emoji: "🍦" },
      { id: "h5", left: "L_selimut, r=7, s=25", correctRight: "550", emoji: "🍦" },
      { id: "h6", left: "L_permukaan, r=7, s=25", correctRight: "704", emoji: "🍦" },
      { id: "h7", left: "V, r=7, t=24", correctRight: "1.232", emoji: "🍦" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Kerucut r = 9 cm, t = 12 cm. Tentukan s = … cm.",
    kind: "fill",
    answers: ["15"],
    hint: "s = √(r² + t²).",
    discussion: ["s = √(81 + 144) = √225 = 15."],
  },
  {
    id: "pp2",
    question: "Kerucut r = 7, s = 10. Luas selimut = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["220"],
    hint: "πrs.",
    discussion: ["22/7 × 7 × 10 = 220 cm²."],
  },
  {
    id: "pp3",
    question:
      "Kerucut r = 7, s = 25. Luas permukaan = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["704"],
    hint: "πr(r + s).",
    discussion: ["22/7 × 7 × (7 + 25) = 22 × 32 = 704."],
  },
  {
    id: "pp4",
    question: "Kerucut r = 6, t = 8. Volume = … cm³ (π = 3,14).",
    kind: "fill",
    answers: ["301,44", "301.44"],
    hint: "⅓πr²t.",
    discussion: ["⅓ × 3,14 × 36 × 8 = ⅓ × 904,32 = 301,44 cm³."],
  },
  {
    id: "pp5",
    question: "Kerucut r = 14, t = 24. Volume = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["4928", "4.928"],
    hint: "⅓ × 22/7 × 196 × 24.",
    discussion: ["⅓ × 22/7 × 196 × 24 = ⅓ × 22 × 28 × 24 = 4.928 cm³."],
  },
  {
    id: "pp6",
    question:
      "Kerucut tanpa alas (kap lampu) r = 7, s = 14. Luas bahan = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["308"],
    hint: "Hanya selimut: πrs.",
    discussion: ["22/7 × 7 × 14 = 22 × 14 = 308 cm²."],
  },
  {
    id: "pp7",
    question:
      "Pernyataan: Volume kerucut = ⅓ volume tabung yang alas dan tingginya sama.",
    kind: "truefalse",
    correct: true,
    hint: "Hubungan klasik kerucut–tabung.",
    discussion: ["BENAR. V_kerucut = ⅓ × V_tabung sealas-setinggi."],
  },
  {
    id: "pp8",
    question:
      "Sebuah topi ulang tahun berbentuk kerucut tanpa alas, r = 7 cm dan t = 24 cm. Berapa luas kertas yang dibutuhkan? (π = 22/7)",
    kind: "fill",
    answers: ["550"],
    hint: "Cari s dulu, lalu L_selimut = πrs.",
    discussion: [
      "s = √(49 + 576) = 25.",
      "L_selimut = 22/7 × 7 × 25 = 22 × 25 = 550 cm².",
    ],
  },
];

const KerucutLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Bangun Ruang Sisi Lengkung"
    title="Kerucut — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami KERUCUT 🍦! Kamu akan menemukan hubungan Pythagoras s² = r² + t², menurunkan rumus luas selimut πrs, luas permukaan πr(r + s), dan volume ⅓πr²t — sambil bermain seret kartu mencocokkan rumus!"
    situations={situations}
    guidedIntro="Jawab berurutan. Setiap jawabanmu menuntun ke rumus dasar kerucut."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu tentang kerucut dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/bangun-ruang-sisi-lengkung"
    backLabel="Kembali ke Menu Bangun Ruang Sisi Lengkung"
    scoreMessages={{
      perfect: "🌟 Mantap! Rumus kerucut sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang Pythagoras s² = r² + t² dan πrs.",
      low: "💪 Tetap semangat! Mulai dari hubungan s, r, dan t.",
    }}
  />
);

export default KerucutLKPDPage;
