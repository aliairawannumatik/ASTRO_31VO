import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Bola Sepak",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <defs>
            <radialGradient id="bolaG" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.6" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="70" fill="url(#bolaG)" stroke="#6ee7b7" strokeWidth="2" />
          <ellipse cx="100" cy="100" rx="70" ry="20" fill="none" stroke="#6ee7b7" strokeWidth="0.7" strokeDasharray="2 2" />
          <ellipse cx="100" cy="100" rx="20" ry="70" fill="none" stroke="#6ee7b7" strokeWidth="0.7" strokeDasharray="2 2" />
          <line x1="100" y1="100" x2="170" y2="100" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="135" y="95" fontSize="11" fill="#fbbf24" textAnchor="middle">r</text>
          <circle cx="100" cy="100" r="3" fill="#fbbf24" />
          <text x="200" y="60" fontSize="11" fontWeight="bold" fill="var(--icon-color)">BOLA</text>
          <text x="200" y="80" fontSize="9" fill="#a7f3d0">Semua titik di permukaan</text>
          <text x="200" y="95" fontSize="9" fill="#a7f3d0">berjarak SAMA (= r) dari pusat.</text>
          <text x="200" y="125" fontSize="11" fontWeight="bold" fill="#34d399">L = 4πr²</text>
          <text x="200" y="145" fontSize="11" fontWeight="bold" fill="#fbbf24">V = 4/3 πr³</text>
        </svg>
      </div>
    ),
    text:
      "Bola sepak, kelereng, atau planet adalah BOLA. Semua titik di permukaannya berjarak SAMA (= r) dari pusat. Hanya butuh SATU besaran: jari-jari r.",
  },
  {
    title: "Situasi 2 — Bola dalam Tabung (Penemuan Archimedes)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <ellipse cx="100" cy="30" rx="50" ry="12" fill="#a78bfa" fillOpacity="0.4" stroke="#c4b5fd" strokeWidth="1.5" />
          <rect x="50" y="30" width="100" height="140" fill="#a78bfa" fillOpacity="0.2" stroke="#c4b5fd" strokeWidth="1.5" />
          <ellipse cx="100" cy="170" rx="50" ry="12" fill="#a78bfa" fillOpacity="0.4" stroke="#c4b5fd" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="50" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="2" />
          <text x="100" y="105" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">BOLA</text>
          <text x="200" y="60" fontSize="10" fontWeight="bold" fill="var(--icon-color)">Archimedes:</text>
          <text x="200" y="80" fontSize="9" fill="#fde68a">V_bola = ⅔ V_tabung</text>
          <text x="200" y="95" fontSize="9" fill="#fde68a">(tabung sealas & setinggi 2r)</text>
          <text x="200" y="125" fontSize="9" fill="#a7f3d0">V_tabung = πr² × 2r = 2πr³</text>
          <text x="200" y="140" fontSize="11" fontWeight="bold" fill="#34d399">V_bola = ⅔ × 2πr³ = 4/3 πr³</text>
        </svg>
      </div>
    ),
    text:
      "Penemuan Archimedes: bola PAS muat dalam tabung dengan jari-jari r dan tinggi 2r. Volume bola = ⅔ volume tabung tersebut → V = ⅔ × 2πr³ = ⁴⁄₃ πr³!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Bola hanya membutuhkan SATU besaran utama, yaitu …",
    kind: "choice",
    options: [
      "diameter dan tinggi",
      "jari-jari (r)",
      "garis pelukis",
      "alas dan tutup",
    ],
    correctIndex: 1,
    discussion: [
      "Bola adalah simetri sempurna — hanya jari-jari r yang menentukan ukurannya.",
      "Jika dikenal d (diameter), maka r = d/2.",
    ],
  },
  {
    id: "g2",
    label: "Rumus LUAS PERMUKAAN bola = …",
    kind: "choice",
    options: ["πr²", "2πr²", "4πr²", "πr³"],
    correctIndex: 2,
    discussion: [
      "L_permukaan bola = 4πr².",
      "Setara dengan 4 lingkaran berjari-jari r.",
    ],
  },
  {
    id: "g3",
    label: "Rumus VOLUME bola = …",
    kind: "choice",
    options: ["πr³", "4πr²", "⁴⁄₃ πr³", "⅓ πr³"],
    correctIndex: 2,
    discussion: ["V = ⁴⁄₃ πr³ (turunan dari V_tabung sealas-setinggi 2r)."],
  },
  {
    id: "g4",
    label:
      "Bola r = 7 cm. Luas permukaan = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["616"],
    discussion: ["L = 4 × 22/7 × 49 = 4 × 22 × 7 = 616 cm²."],
  },
  {
    id: "g5",
    label:
      "Bola r = 7 cm. Volume = … cm³ (π = 22/7). Bulatkan jika perlu.",
    kind: "fill",
    answers: ["1437,33", "1437.33", "1.437,33", "4312/3"],
    discussion: [
      "V = ⁴⁄₃ × 22/7 × 343 = (4 × 22 × 49)/3 = 4.312/3 ≈ 1.437,33 cm³.",
    ],
  },
  {
    id: "g6",
    label:
      "Pernyataan: Volume setengah bola = ½ × ⁴⁄₃ πr³ = ⅔ πr³.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Setengah bola = ⅔ πr³.",
      "Untuk SETENGAH BOLA tertutup: Luas = 2πr² (kubah) + πr² (alas) = 3πr².",
    ],
  },
  {
    id: "g7",
    label:
      "Bola d = 14 cm. Berapa jari-jarinya? r = … cm.",
    kind: "fill",
    answers: ["7"],
    discussion: ["r = d/2 = 14/2 = 7 cm."],
  },
  {
    id: "g8",
    label:
      "Bola d = 14, hitung VOLUME = … cm³ (π = 22/7). Setara dengan jawaban g5.",
    kind: "fill",
    answers: ["1437,33", "1437.33", "1.437,33", "4312/3"],
    discussion: ["d = 14 → r = 7. Sama seperti g5: ≈ 1.437,33 cm³."],
  },
  {
    id: "g9",
    label:
      "Setengah bola dengan r = 7 cm. Luas seluruh permukaannya (TERMASUK alas lingkaran) = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["462"],
    discussion: [
      "L = 2πr² (kubah) + πr² (alas) = 3πr² = 3 × 22/7 × 49 = 3 × 22 × 7 = 462 cm².",
    ],
  },
  {
    id: "g10",
    label:
      "Hubungan antara volume bola dan volume tabung yang sealas dan setinggi 2r adalah …",
    kind: "choice",
    options: [
      "V_bola = V_tabung",
      "V_bola = ½ V_tabung",
      "V_bola = ⅔ V_tabung",
      "V_bola = 2 V_tabung",
    ],
    correctIndex: 2,
    discussion: [
      "Penemuan Archimedes: V_bola = ⅔ × V_tabung sealas-setinggi 2r.",
      "V_tabung = πr² × 2r = 2πr³, jadi V_bola = ⅔ × 2πr³ = ⁴⁄₃ πr³.",
    ],
  },
  {
    id: "g11",
    label:
      "Pernyataan: Jika jari-jari bola DILIPATDUAKAN, volume bola menjadi 8 kali lipat.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. V ∝ r³. Jika r → 2r, maka V → 2³ = 8 kali lipat.",
      "Sama: luas → 2² = 4 kali lipat.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan rumus bola dengan namanya:",
    kind: "match",
    pairs: [
      { left: "Luas permukaan bola", right: "4πr²" },
      { left: "Volume bola", right: "⁴⁄₃ πr³" },
      { left: "Volume setengah bola", right: "⅔ πr³" },
      { left: "Luas setengah bola tertutup", right: "3πr²" },
    ],
    discussion: ["Hafal 4 rumus dasar bola dengan baik."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Definisi Bola",
    text: "Bola = himpunan titik berjarak SAMA (= r) dari satu titik pusat. Hanya butuh r (jari-jari) atau d = 2r (diameter).",
    tone: "emerald",
  },
  {
    title: "Rumus Bola Penuh",
    text: "L_permukaan = 4πr². V = ⁴⁄₃ πr³. Hubungan dengan tabung sealas-setinggi 2r: V_bola = ⅔ V_tabung.",
    tone: "violet",
  },
  {
    title: "Setengah Bola & Skala",
    text: "Setengah bola: V = ⅔πr³, L tertutup = 3πr². Jika r dilipatkan k kali: L → k², V → k³.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "bola-game-rumus",
    title: "🎯 Game 1 — Cocokkan Rumus (Seret!)",
    description: "Seret setiap rumus ke kategori yang sesuai.",
    buckets: [
      { id: "lp", label: "L. Permukaan Bola", emoji: "🌐", color: "emerald" },
      { id: "vp", label: "Volume Bola", emoji: "⚽", color: "violet" },
      { id: "ls", label: "Setengah Bola", emoji: "🛕", color: "amber" },
      { id: "rel", label: "Hubungan Tabung-Bola", emoji: "🔗", color: "rose" },
    ],
    items: [
      { id: "b1", label: "4πr²", bucketId: "lp", emoji: "🌐" },
      { id: "b2", label: "⁴⁄₃ πr³", bucketId: "vp", emoji: "⚽" },
      { id: "b3", label: "⅔ πr³ (V)", bucketId: "ls", emoji: "🛕" },
      { id: "b4", label: "3πr² (L tertutup)", bucketId: "ls", emoji: "🛕" },
      { id: "b5", label: "V_bola = ⅔ V_tabung(2r)", bucketId: "rel", emoji: "🔗" },
      { id: "b6", label: "L = 4 × luas lingkaran", bucketId: "lp", emoji: "🌐" },
      { id: "b7", label: "V = ½ × ⁴⁄₃πr³", bucketId: "ls", emoji: "🛕" },
      { id: "b8", label: "V = ⅔ × 2πr³", bucketId: "rel", emoji: "🔗" },
    ],
  },
  {
    kind: "arrow-match",
    id: "bola-game-hitung",
    title: "🎯 Game 2 — Hitung Cepat (π = 22/7)",
    description: "Pasangkan setiap soal dengan HASIL hitungannya. Tekan ◀ ▶.",
    rightOptions: [
      "154",
      "314",
      "462",
      "616",
      "2.464",
      "1.437,33",
      "11.498,67",
    ],
    pairs: [
      { id: "h1", left: "L bola, r=7", correctRight: "616", emoji: "⚽" },
      { id: "h2", left: "L bola, r=14", correctRight: "2.464", emoji: "⚽" },
      { id: "h3", left: "L setengah bola tertutup, r=7", correctRight: "462", emoji: "⚽" },
      { id: "h4", left: "V bola, r=7", correctRight: "1.437,33", emoji: "⚽" },
      { id: "h5", left: "V bola, r=14", correctRight: "11.498,67", emoji: "⚽" },
      { id: "h6", left: "L lingkaran, r=7", correctRight: "154", emoji: "⚽" },
      { id: "h7", left: "L lingkaran, r=10 (π=3,14)", correctRight: "314", emoji: "⚽" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Bola r = 10 cm. Luas permukaan = … cm² (π = 3,14).",
    kind: "fill",
    answers: ["1256"],
    hint: "L = 4πr².",
    discussion: ["L = 4 × 3,14 × 100 = 1.256 cm²."],
  },
  {
    id: "pp2",
    question: "Bola r = 21 cm. Luas permukaan = … cm² (π = 22/7).",
    kind: "fill",
    answers: ["5544"],
    hint: "L = 4πr².",
    discussion: ["L = 4 × 22/7 × 441 = 4 × 22 × 63 = 5.544 cm²."],
  },
  {
    id: "pp3",
    question: "Bola r = 3 cm. Volume = … cm³ (π = 3,14).",
    kind: "fill",
    answers: ["113,04", "113.04"],
    hint: "V = ⁴⁄₃πr³.",
    discussion: ["V = ⁴⁄₃ × 3,14 × 27 = 4 × 3,14 × 9 = 113,04 cm³."],
  },
  {
    id: "pp4",
    question: "Bola d = 14 cm. Volume = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["1437,33", "1437.33", "1.437,33", "4312/3"],
    hint: "r = 7. ⁴⁄₃ × 22/7 × 343.",
    discussion: ["≈ 1.437,33 cm³."],
  },
  {
    id: "pp5",
    question: "Setengah bola r = 7 cm. Volume = … cm³ (π = 22/7).",
    kind: "fill",
    answers: ["718,67", "718.67"],
    hint: "V = ⅔πr³.",
    discussion: ["V = ⅔ × 22/7 × 343 = 718,67 cm³."],
  },
  {
    id: "pp6",
    question:
      "Setengah bola TERTUTUP (kubah masjid) r = 14 m. Luas permukaan = … m² (π = 22/7).",
    kind: "fill",
    answers: ["1848"],
    hint: "L = 3πr².",
    discussion: ["L = 3 × 22/7 × 196 = 3 × 22 × 28 = 1.848 m²."],
  },
  {
    id: "pp7",
    question:
      "Pernyataan: Jika jari-jari bola dijadikan 3 kali, volumenya menjadi 9 kali.",
    kind: "truefalse",
    correct: false,
    hint: "V ∝ r³.",
    discussion: [
      "SALAH. r → 3r, maka V → 3³ = 27 kali.",
      "Yang dikalikan 9 adalah LUAS (k² = 9).",
    ],
  },
  {
    id: "pp8",
    question:
      "Sebuah bola memiliki volume 36π cm³. Jari-jari bola = … cm.",
    kind: "fill",
    answers: ["3"],
    hint: "⁴⁄₃πr³ = 36π → cari r.",
    discussion: [
      "⁴⁄₃ r³ = 36 → r³ = 27 → r = 3 cm.",
    ],
  },
];

const BolaLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Bangun Ruang Sisi Lengkung"
    title="Bola — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami BOLA ⚽! Kamu akan menemukan rumus L = 4πr² dan V = ⁴⁄₃πr³ lewat hubungan klasik bola–tabung Archimedes — sambil bermain seret kartu mencocokkan rumus!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan rumus dasar bola dan setengah bola."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu tentang bola dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/bangun-ruang-sisi-lengkung"
    backLabel="Kembali ke Menu Bangun Ruang Sisi Lengkung"
    scoreMessages={{
      perfect: "🌟 Mantap! Rumus bola sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang L = 4πr² dan V = ⁴⁄₃πr³.",
      low: "💪 Tetap semangat! Mulai dari hubungan d = 2r.",
    }}
  />
);

export default BolaLKPDPage;
