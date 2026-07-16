import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Tabung Diperbesar 2×",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <ellipse cx="60" cy="80" rx="20" ry="6" fill="#22d3ee" fillOpacity="0.5" stroke="#67e8f9" strokeWidth="1.5" />
          <rect x="40" y="80" width="40" height="60" fill="#22d3ee" fillOpacity="0.3" stroke="#67e8f9" strokeWidth="1.5" />
          <ellipse cx="60" cy="140" rx="20" ry="6" fill="#22d3ee" fillOpacity="0.5" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="60" y="165" fontSize="9" fill="#67e8f9" textAnchor="middle">r=2, t=6</text>
          <ellipse cx="180" cy="50" rx="40" ry="11" fill="#a78bfa" fillOpacity="0.5" stroke="#c4b5fd" strokeWidth="1.5" />
          <rect x="140" y="50" width="80" height="120" fill="#a78bfa" fillOpacity="0.3" stroke="#c4b5fd" strokeWidth="1.5" />
          <ellipse cx="180" cy="170" rx="40" ry="11" fill="#a78bfa" fillOpacity="0.5" stroke="#c4b5fd" strokeWidth="1.5" />
          <text x="180" y="190" fontSize="9" fill="#c4b5fd" textAnchor="middle">r=4, t=12 (2× besar)</text>
          <text x="20" y="30" fontSize="10" fontWeight="bold" fill="#fbbf24">Volume → 2³ = 8 kali lipat!</text>
        </svg>
      </div>
    ),
    text:
      "Sebuah tabung dengan r dan t DILIPATKAN dengan faktor skala k = 2 (semua dimensi). Volume baru menjadi 2³ = 8 kali volume lama. Luas permukaan menjadi 2² = 4 kali. Inilah ATURAN PERUBAHAN.",
  },
  {
    title: "Situasi 2 — Hanya Tinggi yang Berubah",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <ellipse cx="60" cy="100" rx="25" ry="7" fill="#fbbf24" fillOpacity="0.5" stroke="#fde68a" strokeWidth="1.5" />
          <rect x="35" y="100" width="50" height="50" fill="#fbbf24" fillOpacity="0.3" stroke="#fde68a" strokeWidth="1.5" />
          <ellipse cx="60" cy="150" rx="25" ry="7" fill="#fbbf24" fillOpacity="0.5" stroke="#fde68a" strokeWidth="1.5" />
          <text x="60" y="175" fontSize="9" fill="#fde68a" textAnchor="middle">r=5, t=4</text>
          <ellipse cx="180" cy="50" rx="25" ry="7" fill="#f472b6" fillOpacity="0.5" stroke="#f9a8d4" strokeWidth="1.5" />
          <rect x="155" y="50" width="50" height="120" fill="#f472b6" fillOpacity="0.3" stroke="#f9a8d4" strokeWidth="1.5" />
          <ellipse cx="180" cy="170" rx="25" ry="7" fill="#f472b6" fillOpacity="0.5" stroke="#f9a8d4" strokeWidth="1.5" />
          <text x="180" y="190" fontSize="9" fill="#f9a8d4" textAnchor="middle">r=5, t=12 (3× lebih tinggi)</text>
          <text x="20" y="30" fontSize="10" fontWeight="bold" fill="#fbbf24">Hanya t × 3 → V hanya × 3 (bukan 27)!</text>
        </svg>
      </div>
    ),
    text:
      "Jika HANYA tinggi yang berubah (t × 3), volume tabung juga × 3. Karena V = πr²t hanya linear terhadap t. Tapi jika r juga × 3, volume × 3² × 3 = 27.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Sebuah TABUNG dengan jari-jari r dan tinggi t. Jika SEMUA dimensi (r dan t) dilipatkan k, volume baru = … × volume lama.",
    kind: "fill",
    answers: ["k³", "k^3", "k3"],
    discussion: [
      "V = πr²t. Jika r → kr dan t → kt: V_baru = π(kr)²(kt) = k³ × πr²t.",
      "Volume × k³.",
    ],
  },
  {
    id: "g2",
    label:
      "Pada kasus tabung di atas, LUAS PERMUKAAN baru = … × luas permukaan lama.",
    kind: "fill",
    answers: ["k²", "k^2", "k2"],
    discussion: [
      "L = 2πr(r + t). Setiap r dan t dikalikan k → L baru = 2π(kr)(kr + kt) = k² × L.",
      "Luas × k².",
    ],
  },
  {
    id: "g3",
    label:
      "Jika HANYA r yang dilipatduakan (t tetap), volume tabung menjadi … × semula.",
    kind: "choice",
    options: ["2", "4", "6", "8"],
    correctIndex: 1,
    discussion: [
      "V = πr²t. r → 2r → V × 2² = 4 (t tetap).",
    ],
  },
  {
    id: "g4",
    label:
      "Jika HANYA t yang dilipattigakan (r tetap), volume tabung menjadi … × semula.",
    kind: "choice",
    options: ["3", "6", "9", "27"],
    correctIndex: 0,
    discussion: ["V = πr²t. t → 3t → V × 3 (linear)."],
  },
  {
    id: "g5",
    label:
      "Sebuah BOLA r dilipatkan dengan k. Volume bola baru = … × volume lama.",
    kind: "fill",
    answers: ["k³", "k^3", "k3"],
    discussion: ["V = ⁴⁄₃ πr³ → V_baru = ⁴⁄₃ π(kr)³ = k³ × V."],
  },
  {
    id: "g6",
    label:
      "Bola r dilipatkan k. Luas permukaan baru = … × luas permukaan lama.",
    kind: "fill",
    answers: ["k²", "k^2", "k2"],
    discussion: ["L = 4πr² → L_baru = 4π(kr)² = k² × L."],
  },
  {
    id: "g7",
    label:
      "KESIMPULAN umum: jika SEMUA panjang dimensi diubah dengan faktor k, maka panjang × k, luas × …, volume × …",
    kind: "choice",
    options: [
      "k, k",
      "k², k³",
      "k³, k²",
      "k, k²",
    ],
    correctIndex: 1,
    discussion: [
      "Panjang × k.",
      "Luas × k² (dua dimensi).",
      "Volume × k³ (tiga dimensi).",
    ],
  },
  {
    id: "g8",
    label:
      "Tabung r = 5, t = 10, V = 250π. Jika r dan t dilipatkan 2×, V baru = … π.",
    kind: "fill",
    answers: ["2000", "2.000"],
    discussion: ["V baru = 2³ × 250π = 8 × 250π = 2.000 π."],
  },
  {
    id: "g9",
    label:
      "Bola r = 3, V = 36π. Jika r diperbesar menjadi 6, V baru = … π.",
    kind: "fill",
    answers: ["288"],
    discussion: ["k = 6/3 = 2. V baru = 2³ × 36π = 8 × 36π = 288 π."],
  },
  {
    id: "g10",
    label:
      "Pernyataan: Jika r KERUCUT dilipatduakan dan t tetap, volume kerucut TIDAK berubah.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. V = ⅓πr²t → r × 2 → V × 4 (t tetap).",
    ],
  },
  {
    id: "g11",
    label:
      "Tabung dengan r dan t. Jika hanya t YANG dijadikan setengah, volume menjadi … volume semula.",
    kind: "fill",
    answers: ["½", "1/2", "0,5", "0.5", "setengah"],
    discussion: [
      "V = πr²t. t → t/2 → V × ½.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan PERUBAHAN dengan FAKTOR perubahan volumenya:",
    kind: "match",
    pairs: [
      { left: "Semua dimensi × 2", right: "Volume × 8" },
      { left: "Semua dimensi × 3", right: "Volume × 27" },
      { left: "Semua dimensi × ½", right: "Volume × ⅛" },
      { left: "Hanya tinggi × 4 (lainnya tetap)", right: "Volume × 4" },
    ],
    discussion: [
      "Faktor pada SEMUA dimensi → k³.",
      "Faktor hanya pada SATU dimensi linear (t) → k saja.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Aturan Skala",
    text: "Jika semua panjang dikali faktor k: panjang × k, luas × k², volume × k³. Berlaku untuk SEMUA bangun ruang (tabung, kerucut, bola, dsb).",
    tone: "violet",
  },
  {
    title: "Perubahan Sebagian",
    text: "Tabung: V = πr²t. Jika hanya r × k → V × k². Jika hanya t × k → V × k. Bola: V hanya tergantung r → r × k → V × k³.",
    tone: "yellow",
  },
  {
    title: "Tips Hitungan",
    text: "Cari faktor k = (dimensi baru / dimensi lama). Volume baru = k³ × volume lama (jika SEMUA dimensi seragam berubah). Untuk perubahan parsial, kembali ke rumus dasar.",
    tone: "rose",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "perubahan-game-faktor",
    title: "🎯 Game 1 — Faktor Perubahan Volume (Seret!)",
    description: "Seret setiap perubahan ke FAKTOR perubahan VOLUME-nya.",
    buckets: [
      { id: "x4", label: "× 4", emoji: "4️⃣", color: "cyan" },
      { id: "x8", label: "× 8", emoji: "8️⃣", color: "emerald" },
      { id: "x27", label: "× 27", emoji: "🔢", color: "amber" },
      { id: "x125", label: "× 125", emoji: "💯", color: "rose" },
    ],
    items: [
      { id: "p1", label: "Tabung: r×2 (t tetap)", bucketId: "x4", emoji: "🥫" },
      { id: "p2", label: "Tabung: semua ×2", bucketId: "x8", emoji: "🥫" },
      { id: "p3", label: "Bola: r×2", bucketId: "x8", emoji: "⚽" },
      { id: "p4", label: "Tabung: semua ×3", bucketId: "x27", emoji: "🥫" },
      { id: "p5", label: "Bola: r×3", bucketId: "x27", emoji: "⚽" },
      { id: "p6", label: "Tabung: semua ×5", bucketId: "x125", emoji: "🥫" },
      { id: "p7", label: "Bola: r×5", bucketId: "x125", emoji: "⚽" },
      { id: "p8", label: "Kerucut: r×2 (t tetap)", bucketId: "x4", emoji: "🍦" },
    ],
  },
  {
    kind: "arrow-match",
    id: "perubahan-game-rasio",
    title: "🎯 Game 2 — Rasio Volume Baru / Lama",
    description: "Pasangkan perubahan dengan RASIO volume baru terhadap lama. Tekan ◀ ▶.",
    rightOptions: ["½", "1", "2", "4", "8", "27", "64"],
    pairs: [
      { id: "r1", left: "r dan t × 1", correctRight: "1", emoji: "📐" },
      { id: "r2", left: "Tabung: t × 2 (r tetap)", correctRight: "2", emoji: "📐" },
      { id: "r3", left: "Tabung: r × 2 (t tetap)", correctRight: "4", emoji: "📐" },
      { id: "r4", left: "Tabung: r dan t × 2", correctRight: "8", emoji: "📐" },
      { id: "r5", left: "Tabung: r dan t × 3", correctRight: "27", emoji: "📐" },
      { id: "r6", left: "Bola: r × 4", correctRight: "64", emoji: "📐" },
      { id: "r7", left: "Tabung: t × ½ (r tetap)", correctRight: "½", emoji: "📐" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question:
      "Tabung r=4, t=10 → r=8, t=20 (dilipatduakan semua). Rasio V baru / V lama = …",
    kind: "fill",
    answers: ["8"],
    hint: "k = 2, V × k³.",
    discussion: ["V baru/lama = 2³ = 8."],
  },
  {
    id: "pp2",
    question:
      "Bola r = 3 cm volumenya 36π cm³. Jika r menjadi 9 cm, volume baru = … π cm³.",
    kind: "fill",
    answers: ["972"],
    hint: "k = 9/3 = 3. V × k³ = 27.",
    discussion: ["V baru = 27 × 36π = 972π."],
  },
  {
    id: "pp3",
    question:
      "Tabung HANYA tingginya dilipattigakan (r tetap). Jika V_lama = 100, V_baru = …",
    kind: "fill",
    answers: ["300"],
    hint: "V = πr²t → t × 3 → V × 3.",
    discussion: ["V_baru = 3 × 100 = 300."],
  },
  {
    id: "pp4",
    question:
      "Tabung HANYA jari-jarinya dilipatduakan (t tetap). Jika V_lama = 50, V_baru = …",
    kind: "fill",
    answers: ["200"],
    hint: "V = πr²t → r × 2 → V × 4.",
    discussion: ["V_baru = 4 × 50 = 200."],
  },
  {
    id: "pp5",
    question:
      "Bola r dilipatkan ½ (mengecil setengah). Volume baru / lama = …",
    kind: "fill",
    answers: ["⅛", "1/8", "0,125", "0.125"],
    hint: "k = ½. V × (½)³.",
    discussion: ["V baru / lama = (½)³ = ⅛."],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Jika SEMUA dimensi suatu bangun ruang dilipatkan 2, luasnya menjadi 4 kali.",
    kind: "truefalse",
    correct: true,
    hint: "Luas × k².",
    discussion: ["BENAR. L × 2² = 4."],
  },
  {
    id: "pp7",
    question:
      "Sebuah kerucut V_lama = 24 cm³. Jari-jari & tinggi dilipatkan 2 → V_baru = … cm³.",
    kind: "fill",
    answers: ["192"],
    hint: "k = 2 → V × 8.",
    discussion: ["V_baru = 8 × 24 = 192 cm³."],
  },
  {
    id: "pp8",
    question:
      "Tabung r=2, t=10 berisi air penuh = 40π. Jika tabung diganti dengan r=4, t=10, isi air maksimum = … π.",
    kind: "fill",
    answers: ["160"],
    hint: "Hanya r yang berubah: r × 2 → V × 4.",
    discussion: [
      "V baru = π × 4² × 10 = 160π.",
      "Atau dengan rasio: 4 × 40π = 160π.",
    ],
  },
];

const PerubahanLuasVolumeLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Bangun Ruang Sisi Lengkung"
    title="Perubahan Luas & Volume — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami efek perubahan ukuran 📐! Kamu akan menemukan aturan: panjang × k, luas × k², volume × k³ — dan kapan aturan ini berlaku penuh atau hanya sebagian. Sambil bermain seret kartu mencocokkan faktor perubahan!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan aturan perubahan luas dan volume."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/bangun-ruang-sisi-lengkung"
    backLabel="Kembali ke Menu Bangun Ruang Sisi Lengkung"
    scoreMessages={{
      perfect: "🌟 Mantap! Aturan k–k²–k³ sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari kembali kapan k³ vs k saja yang berlaku.",
      low: "💪 Tetap semangat! Mulai dari V = πr²t — perhatikan r².",
    }}
  />
);

export default PerubahanLuasVolumeLKPDPage;
