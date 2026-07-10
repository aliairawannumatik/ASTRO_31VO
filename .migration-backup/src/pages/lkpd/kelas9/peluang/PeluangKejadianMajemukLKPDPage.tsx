import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Saling LEPAS (Mutually Exclusive)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#67e8f9" textAnchor="middle">Dadu: A = mata genap, B = mata 1</text>
          <rect x="30" y="38" width="220" height="100" rx="8" fill="#1e293b" stroke="#67e8f9" strokeWidth="2" />
          <text x="38" y="52" fontSize="9" fill="#67e8f9">S</text>
          <circle cx="100" cy="88" r="35" fill="#22d3ee" fillOpacity="0.45" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="100" y="92" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">A</text>
          <text x="100" y="108" fontSize="9" fill="#fde68a" textAnchor="middle">{"{2,4,6}"}</text>
          <circle cx="180" cy="88" r="22" fill="#a78bfa" fillOpacity="0.45" stroke="#c4b5fd" strokeWidth="1.5" />
          <text x="180" y="92" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">B</text>
          <text x="180" y="108" fontSize="9" fill="#fde68a" textAnchor="middle">{"{1}"}</text>
          <text x="140" y="155" fontSize="11" fill="#a7f3d0" textAnchor="middle">A ∩ B = ∅ → SALING LEPAS</text>
          <rect x="40" y="170" width="200" height="22" rx="6" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="186" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">P(A∪B) = P(A) + P(B) = 3/6 + 1/6 = 4/6</text>
        </svg>
      </div>
    ),
    text:
      "Dua kejadian SALING LEPAS jika TIDAK MUNGKIN terjadi bersamaan (A ∩ B = ∅). Maka peluang gabungannya = jumlah peluang masing-masing: P(A∪B) = P(A) + P(B).",
  },
  {
    title: "Situasi 2 — TIDAK Saling Lepas (Beririsan)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#fda4af" textAnchor="middle">{"Dadu: A = genap, B = mata > 3"}</text>
          <rect x="30" y="38" width="220" height="110" rx="8" fill="#1e293b" stroke="#fda4af" strokeWidth="2" />
          <circle cx="115" cy="92" r="40" fill="#22d3ee" fillOpacity="0.4" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="80" y="80" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">A</text>
          <text x="80" y="100" fontSize="9" fill="#fde68a" textAnchor="middle">{"{2,4,6}"}</text>
          <circle cx="170" cy="92" r="40" fill="#fbbf24" fillOpacity="0.4" stroke="#fde68a" strokeWidth="1.5" />
          <text x="200" y="80" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">B</text>
          <text x="200" y="100" fontSize="9" fill="#fde68a" textAnchor="middle">{"{4,5,6}"}</text>
          <text x="142" y="98" fontSize="9" fill="var(--icon-color)" textAnchor="middle">{"{4,6}"}</text>
          <text x="140" y="165" fontSize="10" fill="#fda4af" textAnchor="middle">A ∩ B = {"{4,6}"} ≠ ∅ → BERIRISAN</text>
          <rect x="20" y="178" width="240" height="18" rx="6" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="191" fontSize="10" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">P(A∪B) = P(A)+P(B)−P(A∩B) = 3/6+3/6−2/6 = 4/6</text>
        </svg>
      </div>
    ),
    text:
      "Saat dua kejadian BERIRISAN, kita harus KURANGI irisan agar tidak terhitung dua kali: P(A∪B) = P(A) + P(B) − P(A∩B). Inilah ATURAN INKLUSI-EKSKLUSI.",
  },
  {
    title: "Situasi 3 — Saling BEBAS (Independent)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 180" className="w-full">
          <rect width="280" height="180" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#a7f3d0" textAnchor="middle">2 koin: P(A pada koin1 DAN A pada koin2)</text>
          <circle cx="80" cy="80" r="32" fill="#fbbf24" fillOpacity="0.45" stroke="#fde68a" strokeWidth="1.5" />
          <text x="80" y="86" fontSize="20" fontWeight="bold" fill="#1f2937" textAnchor="middle">A</text>
          <text x="80" y="125" fontSize="10" fill="var(--icon-color)" textAnchor="middle">P=1/2</text>
          <text x="140" y="85" fontSize="22" fill="#67e8f9" textAnchor="middle">×</text>
          <circle cx="200" cy="80" r="32" fill="#fbbf24" fillOpacity="0.45" stroke="#fde68a" strokeWidth="1.5" />
          <text x="200" y="86" fontSize="20" fontWeight="bold" fill="#1f2937" textAnchor="middle">A</text>
          <text x="200" y="125" fontSize="10" fill="var(--icon-color)" textAnchor="middle">P=1/2</text>
          <rect x="40" y="145" width="200" height="28" rx="6" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="164" fontSize="12" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">P(A∩B) = 1/2 × 1/2 = 1/4</text>
        </svg>
      </div>
    ),
    text:
      "Dua kejadian SALING BEBAS jika hasil yang satu TIDAK mempengaruhi yang lain (misal: 2 koin). Maka P(A ∩ B) = P(A) × P(B). Untuk LEMPAR LALU AMBIL DENGAN PENGEMBALIAN, biasanya saling bebas.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Dua kejadian disebut SALING LEPAS jika …",
    kind: "choice",
    options: [
      "irisannya tidak kosong",
      "irisannya kosong (tidak bisa terjadi bersamaan)",
      "peluangnya selalu sama",
      "selalu saling bebas",
    ],
    correctIndex: 1,
    discussion: ["Saling lepas ⇔ A ∩ B = ∅."],
  },
  {
    id: "g2",
    label: "Untuk kejadian saling LEPAS: P(A ∪ B) = …",
    kind: "choice",
    options: [
      "P(A) × P(B)",
      "P(A) + P(B)",
      "P(A) + P(B) − P(A∩B)",
      "1 − P(A) − P(B)",
    ],
    correctIndex: 1,
    discussion: ["Karena A ∩ B = ∅ → P(A∩B) = 0, sehingga P(A∪B) = P(A) + P(B)."],
  },
  {
    id: "g3",
    label: "Untuk kejadian TIDAK saling lepas (umum): P(A ∪ B) = …",
    kind: "fill",
    answers: ["P(A)+P(B)-P(A∩B)", "P(A)+P(B)−P(A∩B)"],
    discussion: ["Aturan inklusi-eksklusi: P(A∪B) = P(A) + P(B) − P(A∩B)."],
  },
  {
    id: "g4",
    label: "Dua kejadian disebut SALING BEBAS jika …",
    kind: "choice",
    options: [
      "irisannya kosong",
      "salah satu menentukan yang lain",
      "hasil yang satu tidak mempengaruhi peluang yang lain",
      "selalu saling lepas",
    ],
    correctIndex: 2,
    discussion: ["Saling bebas: P(A) tidak berubah karena B terjadi atau tidak."],
  },
  {
    id: "g5",
    label: "Untuk kejadian saling BEBAS: P(A ∩ B) = …",
    kind: "fill",
    answers: ["P(A) × P(B)", "P(A)*P(B)", "P(A).P(B)", "P(A)P(B)"],
    discussion: ["P(A ∩ B) = P(A) · P(B) untuk kejadian saling bebas."],
  },
  {
    id: "g6",
    label:
      "Lempar dadu. A = 'genap' dan B = 'mata 1'. Apakah saling LEPAS?",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. {2,4,6} ∩ {1} = ∅ → saling lepas.",
    ],
  },
  {
    id: "g7",
    label:
      "Lempar dadu. P(genap atau mata 1) = …",
    kind: "fill",
    answers: ["4/6", "2/3"],
    discussion: ["Saling lepas: P = 3/6 + 1/6 = 4/6 = 2/3."],
  },
  {
    id: "g8",
    label:
      "Lempar dadu. P(genap atau > 3) = … (perhatikan irisannya!)",
    kind: "fill",
    answers: ["4/6", "2/3"],
    discussion: [
      "A = {2,4,6}, B = {4,5,6}, A∩B = {4,6}.",
      "P = 3/6 + 3/6 − 2/6 = 4/6 = 2/3.",
    ],
  },
  {
    id: "g9",
    label: "Lempar 2 koin. P(keduanya Angka) = …",
    kind: "fill",
    answers: ["1/4"],
    discussion: ["Saling bebas: 1/2 × 1/2 = 1/4."],
  },
  {
    id: "g10",
    label:
      "Sebuah dadu dilempar 2 kali. P(mata 6 pada lemparan ke-1 DAN mata 6 pada lemparan ke-2) = …",
    kind: "fill",
    answers: ["1/36"],
    discussion: ["Saling bebas: 1/6 × 1/6 = 1/36."],
  },
  {
    id: "g11",
    label:
      "Pernyataan: Jika dua kejadian saling LEPAS, maka mereka pasti SALING BEBAS.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Saling lepas BERBEDA dengan saling bebas. Kejadian saling lepas dengan P>0 justru TIDAK mungkin saling bebas.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan KASUS dengan RUMUS yang tepat:",
    kind: "match",
    pairs: [
      { left: "Saling lepas (atau)", right: "P(A) + P(B)" },
      { left: "Tidak saling lepas (atau)", right: "P(A)+P(B)−P(A∩B)" },
      { left: "Saling bebas (dan)", right: "P(A) × P(B)" },
      { left: "Komplemen", right: "1 − P(A)" },
    ],
    discussion: ["Hafalkan 4 rumus utama peluang majemuk."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Saling Lepas (∩ = ∅)",
    text: "P(A ∪ B) = P(A) + P(B). Tidak ada irisan, jadi langsung dijumlahkan.",
    tone: "cyan",
  },
  {
    title: "Tidak Saling Lepas",
    text: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B). KURANGI irisan supaya tidak dihitung dua kali (Inklusi–Eksklusi).",
    tone: "rose",
  },
  {
    title: "Saling Bebas",
    text: "P(A ∩ B) = P(A) × P(B). Hasil yang satu TIDAK mempengaruhi yang lain. Sering muncul pada lemparan berulang & pengambilan DENGAN pengembalian.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "majemuk-game-rumus",
    title: "🎯 Game 1 — Pilih Rumus yang Tepat",
    description: "Seret tiap kasus ke RUMUS yang harus dipakai!",
    buckets: [
      { id: "lepas", label: "P(A)+P(B) — Lepas", emoji: "🚫", color: "cyan" },
      { id: "irisan", label: "P(A)+P(B)−P(A∩B) — Beririsan", emoji: "🔗", color: "rose" },
      { id: "bebas", label: "P(A)·P(B) — Bebas", emoji: "🎲🎲", color: "emerald" },
    ],
    items: [
      { id: "k1", label: "Dadu: genap ATAU mata 1", bucketId: "lepas", emoji: "🎲" },
      { id: "k2", label: "Dadu: genap ATAU > 3", bucketId: "irisan", emoji: "🎲" },
      { id: "k3", label: "2 dadu: mata 6 DAN mata 6", bucketId: "bebas", emoji: "🎲🎲" },
      { id: "k4", label: "Dadu: mata 1 ATAU mata 2", bucketId: "lepas", emoji: "🎲" },
      { id: "k5", label: "Kartu: As ATAU Hati", bucketId: "irisan", emoji: "♥️" },
      { id: "k6", label: "2 koin: Angka DAN Angka", bucketId: "bebas", emoji: "🪙🪙" },
      { id: "k7", label: "Bola merah ATAU biru (kotak)", bucketId: "lepas", emoji: "🔴" },
      { id: "k8", label: "Tarik kartu DUA kali (kembali)", bucketId: "bebas", emoji: "🎴" },
    ],
  },
  {
    kind: "arrow-match",
    id: "majemuk-game-hitung",
    title: "🎯 Game 2 — Hitung Peluang Majemuk",
    description: "Pasangkan tiap soal dengan peluangnya. Tekan ◀ ▶.",
    rightOptions: ["1/36", "1/12", "1/6", "1/4", "1/3", "1/2", "2/3"],
    pairs: [
      { id: "m1", left: "2 dadu: mata 6 DAN 6", correctRight: "1/36", emoji: "🎲🎲" },
      { id: "m2", left: "Dadu+koin: mata 6 & Angka", correctRight: "1/12", emoji: "🎲🪙" },
      { id: "m3", left: "Dadu: mata 1 ATAU 2", correctRight: "1/3", emoji: "🎲" },
      { id: "m4", left: "Dadu: mata 6", correctRight: "1/6", emoji: "🎲" },
      { id: "m5", left: "2 koin: 2 Angka", correctRight: "1/4", emoji: "🪙🪙" },
      { id: "m6", left: "Dadu: genap ATAU ganjil", correctRight: "1/2", emoji: "🎲" },
      { id: "m7", left: "Dadu: genap ATAU > 3", correctRight: "2/3", emoji: "🎲" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Lempar dadu. P(mata 2 ATAU mata 5) = …",
    kind: "fill",
    answers: ["2/6", "1/3"],
    hint: "Saling lepas.",
    discussion: ["1/6 + 1/6 = 2/6 = 1/3."],
  },
  {
    id: "pp2",
    question:
      "Lempar dadu. P(mata GENAP ATAU PRIMA) = … (cek irisan)",
    kind: "fill",
    answers: ["5/6"],
    hint: "Genap = {2,4,6}, Prima = {2,3,5}, irisan = {2}.",
    discussion: ["3/6 + 3/6 − 1/6 = 5/6."],
  },
  {
    id: "pp3",
    question: "Lempar 2 dadu. P(kedua mata ganjil) = …",
    kind: "fill",
    answers: ["1/4", "9/36"],
    hint: "Saling bebas: P(ganjil)×P(ganjil).",
    discussion: ["P(ganjil)=1/2, jadi 1/2 × 1/2 = 1/4."],
  },
  {
    id: "pp4",
    question:
      "Kotak A: 4 merah, 6 biru. Diambil 2 kelereng DENGAN pengembalian. P(keduanya merah) = …",
    kind: "fill",
    answers: ["4/25", "16/100", "0,16", "0.16"],
    hint: "Saling bebas: 4/10 × 4/10.",
    discussion: ["(4/10)² = 16/100 = 4/25 = 0,16."],
  },
  {
    id: "pp5",
    question:
      "Sebuah kartu diambil dari 52 kartu. P(As ATAU Hati) = …",
    kind: "fill",
    answers: ["16/52", "4/13"],
    hint: "P(As)=4/52, P(Hati)=13/52, P(As∩Hati)=1/52.",
    discussion: ["4/52 + 13/52 − 1/52 = 16/52 = 4/13."],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Jika P(A)=0,4, P(B)=0,3, dan A,B saling bebas, maka P(A∩B)=0,12.",
    kind: "truefalse",
    correct: true,
    hint: "0,4 × 0,3.",
    discussion: ["BENAR. 0,4 × 0,3 = 0,12."],
  },
  {
    id: "pp7",
    question:
      "Sebuah koin & dadu dilempar. P(GAMBAR DAN mata > 4) = …",
    kind: "fill",
    answers: ["1/6", "2/12"],
    hint: "1/2 × 2/6.",
    discussion: ["P(G)=1/2, P(>4)=2/6. Jadi 1/2 × 1/3 = 1/6."],
  },
  {
    id: "pp8",
    question:
      "P(A) = 0,5, P(B) = 0,4, P(A∩B) = 0,2. P(A∪B) = …",
    kind: "fill",
    answers: ["0,7", "0.7", "7/10"],
    hint: "Inklusi–eksklusi.",
    discussion: ["0,5 + 0,4 − 0,2 = 0,7."],
  },
];

const PeluangKejadianMajemukLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Peluang"
    title="Peluang Kejadian Majemuk — Penemuan Terbimbing"
    intro="Sobat Numatik 🔗! Saatnya menggabungkan dua kejadian. Kapan kita JUMLAH peluangnya, kapan KURANG irisan, kapan KALI? Kamu akan menemukan rumus untuk SALING LEPAS, BERIRISAN, dan SALING BEBAS — lengkap dengan game seru!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan rumus peluang majemuk."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/peluang"
    backLabel="Kembali ke Menu Peluang"
    scoreMessages={{
      perfect: "🌟 Mantap! Peluang majemuk sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ulang lagi 3 rumus utama (lepas, irisan, bebas).",
      low: "💪 Tetap semangat! Mulai dari kasus saling lepas dulu.",
    }}
  />
);

export default PeluangKejadianMajemukLKPDPage;
