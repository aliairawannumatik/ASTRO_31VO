import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Cari 2 Bilangan Ajaib",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="13" fontWeight="bold" fill="#67e8f9" textAnchor="middle">x² + 5x + 6 = 0</text>
          <text x="140" y="50" fontSize="11" fill="#fde68a" textAnchor="middle">Cari p, q sehingga: p · q = 6 dan p + q = 5</text>
          <rect x="40" y="70" width="90" height="55" rx="8" fill="#22d3ee" fillOpacity="0.4" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="85" y="92" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">p = 2</text>
          <text x="85" y="112" fontSize="10" fill="#fde68a" textAnchor="middle">+ q = 3</text>
          <rect x="150" y="70" width="90" height="55" rx="8" fill="#a78bfa" fillOpacity="0.4" stroke="#c4b5fd" strokeWidth="1.5" />
          <text x="195" y="92" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">2 × 3 = 6 ✓</text>
          <text x="195" y="112" fontSize="10" fill="#fde68a" textAnchor="middle">2 + 3 = 5 ✓</text>
          <rect x="40" y="140" width="200" height="48" rx="8" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="160" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{"(x + 2)(x + 3) = 0"}</text>
          <text x="140" y="180" fontSize="11" fontWeight="bold" fill="#fde68a" textAnchor="middle">x = −2 atau x = −3</text>
        </svg>
      </div>
    ),
    text:
      "Untuk PK x² + bx + c = 0, cari 2 bilangan p, q dengan p × q = c DAN p + q = b. Lalu faktorkan menjadi (x + p)(x + q) = 0. Jika hasil kali = 0, maka salah satu faktor harus = 0.",
  },
  {
    title: "Situasi 2 — Pemfaktoran AC ketika a ≠ 1",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 220" className="w-full">
          <rect width="280" height="220" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="13" fontWeight="bold" fill="#fde68a" textAnchor="middle">2x² + 7x + 3 = 0</text>
          <text x="140" y="48" fontSize="10" fill="#fbbf24" textAnchor="middle">a·c = 2·3 = 6, b = 7</text>
          <text x="140" y="65" fontSize="10" fill="#fbbf24" textAnchor="middle">Cari p, q: p·q = 6, p+q = 7 → 6 dan 1</text>
          <rect x="20" y="80" width="240" height="22" rx="6" fill="#fbbf24" fillOpacity="0.35" />
          <text x="140" y="96" fontSize="11" fill="var(--icon-color)" textAnchor="middle">{"2x² + 6x + 1x + 3 = 0"}</text>
          <rect x="20" y="106" width="240" height="22" rx="6" fill="#fbbf24" fillOpacity="0.35" />
          <text x="140" y="122" fontSize="11" fill="var(--icon-color)" textAnchor="middle">{"2x(x + 3) + 1(x + 3) = 0"}</text>
          <rect x="20" y="132" width="240" height="22" rx="6" fill="#22d3ee" fillOpacity="0.45" />
          <text x="140" y="148" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{"(2x + 1)(x + 3) = 0"}</text>
          <rect x="40" y="165" width="200" height="40" rx="8" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="190" fontSize="13" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">x = −1/2 atau x = −3</text>
        </svg>
      </div>
    ),
    text:
      "Untuk a ≠ 1, gunakan METODE AC: cari p, q dengan p·q = a·c dan p+q = b. Pecah suku tengah, lalu faktorkan berpasangan. Inilah pemfaktoran TINGKAT LANJUT!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Untuk x² + 5x + 6 = 0, cari 2 bilangan p, q sehingga p+q=5 dan p·q=6. Bilangan itu adalah …",
    kind: "choice",
    options: ["1 dan 6", "2 dan 3", "−2 dan −3", "−1 dan −6"],
    correctIndex: 1,
    discussion: ["2 + 3 = 5 ✓ dan 2 × 3 = 6 ✓."],
  },
  {
    id: "g2",
    label:
      "Faktorisasi x² + 5x + 6 menjadi …",
    kind: "choice",
    options: [
      "(x+2)(x+3)",
      "(x−2)(x−3)",
      "(x+1)(x+6)",
      "(x−1)(x−6)",
    ],
    correctIndex: 0,
    discussion: ["(x+2)(x+3) = x² + 5x + 6."],
  },
  {
    id: "g3",
    label:
      "Akar-akar dari (x+2)(x+3) = 0 adalah …",
    kind: "choice",
    options: ["x = 2 dan x = 3", "x = −2 dan x = −3", "x = 2 dan x = −3", "x = −2 dan x = 3"],
    correctIndex: 1,
    discussion: ["x+2=0 → x=−2; x+3=0 → x=−3."],
  },
  {
    id: "g4",
    label: "Faktorkan x² − 7x + 12 = 0 → akar-akarnya adalah …",
    kind: "choice",
    options: ["3 dan 4", "−3 dan −4", "−3 dan 4", "3 dan −4"],
    correctIndex: 0,
    discussion: ["(x−3)(x−4)=0 → x=3 atau x=4."],
  },
  {
    id: "g5",
    label: "Faktorkan x² − x − 6 = 0 → akar-akarnya adalah …",
    kind: "choice",
    options: ["3 dan 2", "−3 dan 2", "3 dan −2", "−3 dan −2"],
    correctIndex: 2,
    discussion: ["p·q=−6, p+q=−1 → 2 dan −3. (x+2)(x−3)=0 → x=−2 atau x=3."],
  },
  {
    id: "g6",
    label:
      "Untuk 2x² + 7x + 3 = 0, ac = 6, b = 7. Cari p, q: p·q=6, p+q=7 → …",
    kind: "fill",
    answers: ["1 dan 6", "6 dan 1"],
    discussion: ["1 × 6 = 6 dan 1 + 6 = 7."],
  },
  {
    id: "g7",
    label: "Faktorkan 2x² + 7x + 3 = 0 → akarnya adalah …",
    kind: "choice",
    options: ["x = −3 dan x = −1/2", "x = 3 dan x = 1/2", "x = −3 dan x = 1/2", "x = 3 dan x = −1/2"],
    correctIndex: 0,
    discussion: ["(2x+1)(x+3)=0 → x=−1/2 atau x=−3."],
  },
  {
    id: "g8",
    label: "Faktorkan x² − 9 = 0 → akar-akarnya adalah …",
    kind: "choice",
    options: ["x = 3 dan x = −3", "x = 9 dan x = −9", "x = 3 dan x = 9", "x = 0 dan x = 9"],
    correctIndex: 0,
    discussion: ["(x−3)(x+3)=0 → x = ±3 (selisih 2 kuadrat)."],
  },
  {
    id: "g9",
    label: "Faktorkan x² − 6x = 0 → akar-akarnya adalah …",
    kind: "choice",
    options: ["x = 0 dan x = 6", "x = 0 dan x = −6", "x = 6 dan x = −6", "x = 1 dan x = 6"],
    correctIndex: 0,
    discussion: ["x(x−6)=0 → x=0 atau x=6 (faktor bersama x)."],
  },
  {
    id: "g10",
    label: "Pernyataan: Jika hasil kali (x−a)(x−b) = 0, maka x=a atau x=b.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Inilah hukum NOL: AB = 0 ⇒ A = 0 atau B = 0.",
    ],
  },
  {
    id: "g11",
    label: "Pasangkan PK dengan akar-akarnya:",
    kind: "match",
    pairs: [
      { left: "x² − 5x + 6 = 0", right: "x = 2, x = 3" },
      { left: "x² + x − 12 = 0", right: "x = 3, x = −4" },
      { left: "x² − 4 = 0", right: "x = 2, x = −2" },
      { left: "x² − 9x = 0", right: "x = 0, x = 9" },
    ],
    discussion: ["Faktorkan masing-masing PK."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Pemfaktoran a = 1",
    text: "x² + bx + c = 0 → cari p, q dengan p·q = c dan p+q = b. Faktorkan menjadi (x+p)(x+q) = 0.",
    tone: "cyan",
  },
  {
    title: "Metode AC (a ≠ 1)",
    text: "Untuk ax² + bx + c = 0: cari p, q dengan p·q = a·c dan p+q = b. Pecah bx = px + qx, faktorkan berpasangan.",
    tone: "violet",
  },
  {
    title: "Bentuk Khusus",
    text: "Selisih 2 kuadrat: x² − k² = (x−k)(x+k). Faktor bersama: ax² + bx = x(ax+b). Hafalkan untuk pemecahan cepat!",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "fakt-game-pasang",
    title: "🎯 Game 1 — Cari 2 Bilangan Ajaib",
    description: "Seret tiap PK ke pasangan bilangan (p, q) yang TEPAT!",
    buckets: [
      { id: "23", label: "p, q = 2, 3", emoji: "✨", color: "cyan" },
      { id: "minus34", label: "p, q = −3, 4", emoji: "✨", color: "rose" },
      { id: "16", label: "p, q = 1, 6", emoji: "✨", color: "violet" },
      { id: "minus2minus3", label: "p, q = −2, −3", emoji: "✨", color: "amber" },
    ],
    items: [
      { id: "f1", label: "x² + 5x + 6 = 0", bucketId: "23", emoji: "📐" },
      { id: "f2", label: "x² + x − 12 = 0", bucketId: "minus34", emoji: "📐" },
      { id: "f3", label: "x² + 7x + 6 = 0", bucketId: "16", emoji: "📐" },
      { id: "f4", label: "x² − 5x + 6 = 0", bucketId: "minus2minus3", emoji: "📐" },
      { id: "f5", label: "x² + x − 12 = 0 (duplikat)", bucketId: "minus34", emoji: "📐" },
      { id: "f6", label: "x² + 5x + 6 = 0 (varian)", bucketId: "23", emoji: "📐" },
    ],
  },
  {
    kind: "arrow-match",
    id: "fakt-game-akar",
    title: "🎯 Game 2 — Tebak Akar PK",
    description: "Pasangkan tiap PK dengan AKAR-akarnya. Tekan ◀ ▶.",
    rightOptions: ["−3, −2", "−2, 3", "2, 3", "0, 5", "−5, 5", "1, −6"],
    pairs: [
      { id: "a1", left: "x² − 5x + 6 = 0", correctRight: "2, 3", emoji: "📐" },
      { id: "a2", left: "x² + 5x + 6 = 0", correctRight: "−3, −2", emoji: "📐" },
      { id: "a3", left: "x² − x − 6 = 0", correctRight: "−2, 3", emoji: "📐" },
      { id: "a4", left: "x² − 25 = 0", correctRight: "−5, 5", emoji: "📐" },
      { id: "a5", left: "x² − 5x = 0", correctRight: "0, 5", emoji: "📐" },
      { id: "a6", left: "x² + 5x − 6 = 0", correctRight: "1, −6", emoji: "📐" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Akar-akar PK x² − 8x + 15 = 0 adalah …",
    kind: "choice",
    options: ["3 dan 5", "−3 dan −5", "3 dan −5", "−3 dan 5"],
    correctIndex: 0,
    hint: "Cari p, q: p+q=8, p·q=15.",
    discussion: ["(x−3)(x−5)=0 → x=3 atau x=5."],
  },
  {
    id: "pp2",
    question: "Akar PK 3x² − 5x − 2 = 0 adalah …",
    kind: "choice",
    options: ["x = 2, x = −1/3", "x = −2, x = 1/3", "x = 2, x = 1/3", "x = −2, x = −1/3"],
    correctIndex: 0,
    hint: "Metode AC: ac=−6, b=−5 → −6 dan 1.",
    discussion: ["3x² − 6x + x − 2 = 3x(x−2)+(x−2) = (3x+1)(x−2) → x=2 atau x=−1/3."],
  },
  {
    id: "pp3",
    question: "Akar PK x² − 16 = 0 adalah …",
    kind: "choice",
    options: ["±4", "±8", "±16", "±2"],
    correctIndex: 0,
    hint: "Selisih 2 kuadrat.",
    discussion: ["(x−4)(x+4)=0 → x = ±4."],
  },
  {
    id: "pp4",
    question: "Akar PK 2x² − 8x = 0 adalah …",
    kind: "choice",
    options: ["x = 0, x = 4", "x = 0, x = −4", "x = 4, x = −4", "x = 2, x = 4"],
    correctIndex: 0,
    hint: "Faktor bersama 2x.",
    discussion: ["2x(x−4)=0 → x=0 atau x=4."],
  },
  {
    id: "pp5",
    question: "Salah satu akar dari x² + 7x + 12 = 0 adalah …",
    kind: "fill",
    answers: ["-3", "−3", "-4", "−4"],
    hint: "Cari p,q: p+q=7, p·q=12.",
    discussion: ["(x+3)(x+4)=0 → x=−3 atau x=−4."],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: PK 6x² + 11x − 10 = 0 dapat difaktorkan menjadi (3x − 2)(2x + 5) = 0.",
    kind: "truefalse",
    correct: true,
    hint: "Cek dengan distribusi.",
    discussion: ["(3x−2)(2x+5) = 6x² + 15x − 4x − 10 = 6x² + 11x − 10 ✓."],
  },
  {
    id: "pp7",
    question: "Hasil kali akar-akar PK x² − 7x + 10 = 0 = …",
    kind: "fill",
    answers: ["10"],
    hint: "x₁ · x₂ = c/a.",
    discussion: ["x₁=2, x₂=5 → 2 × 5 = 10. Atau langsung c/a = 10/1 = 10."],
  },
  {
    id: "pp8",
    question:
      "Jumlah akar-akar PK x² − 9x + 18 = 0 = …",
    kind: "fill",
    answers: ["9"],
    hint: "x₁ + x₂ = −b/a.",
    discussion: ["x₁=3, x₂=6 → 3+6=9. Atau −b/a = 9/1 = 9."],
  },
];

const PemfaktoranLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan PK"
    title="Pemfaktoran Persamaan Kuadrat — Penemuan Terbimbing"
    intro="Sobat Numatik ✂️! Saatnya jadi DETEKTIF — cari 2 bilangan ajaib (p, q) yang menjadi kunci faktorisasi! Kamu akan menemukan teknik faktorisasi (x+p)(x+q)=0, METODE AC untuk a ≠ 1, dan bentuk khusus selisih 2 kuadrat."
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan strategi pemfaktoran."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Menu Persamaan Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Pemfaktoran sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ulang strategi 'cari p, q'.",
      low: "💪 Tetap semangat! Mulai dari PK dengan a = 1.",
    }}
  />
);

export default PemfaktoranLKPDPage;
