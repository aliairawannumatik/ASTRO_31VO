import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Faktorisasi sederhana 6x + 9 menggunakan FPB. FPB(6, 9) = ...",
    kind: "fill",
    answers: ["3"],
    discussion: ["FPB(6, 9) = 3."],
  },
  {
    id: "g2",
    label: "Hasil faktorisasi 6x + 9 adalah ...",
    kind: "choice",
    options: ["3(2x + 3)", "6(x + 9)", "3(x + 3)", "9(x + 1)"],
    correctIndex: 0,
    discussion: ["6x + 9 = 3·2x + 3·3 = 3(2x + 3)."],
  },
  {
    id: "g3",
    label: "Faktorisasi 4a − 8 = ...",
    kind: "fill",
    answers: ["4(a-2)", "4(a − 2)"],
    discussion: ["FPB(4, 8) = 4. Hasil: 4(a − 2)."],
  },
  {
    id: "g4",
    label: "Benar atau salah: 5x + 10 = 5(x + 2).",
    kind: "truefalse",
    correct: true,
    discussion: ["FPB(5, 10) = 5. 5x + 10 = 5(x + 2). BENAR."],
  },
  {
    id: "g5",
    label: "Faktor persekutuan dari 12x dan 18x² adalah ...",
    kind: "choice",
    options: ["6x", "12x", "18x", "6x²"],
    correctIndex: 0,
    discussion: ["FPB koefisien: 6. Variabel persekutuan: x. Jadi 6x."],
  },
  {
    id: "g6",
    label: "Sederhanakan pecahan aljabar: 6x/9 = ...",
    kind: "fill",
    answers: ["2x/3"],
    discussion: ["Bagi pembilang & penyebut dengan FPB(6, 9) = 3 → 2x/3."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Faktorkanlah 8x + 12.",
    kind: "fill",
    answers: ["4(2x+3)", "4(2x + 3)"],
    hint: "FPB(8, 12) = 4.",
    discussion: ["8x + 12 = 4(2x + 3)."],
  },
  {
    id: "p2",
    question: "Faktorkanlah 10y² − 15y.",
    kind: "fill",
    answers: ["5y(2y-3)", "5y(2y − 3)"],
    hint: "Cari FPB koefisien dan variabel persekutuan.",
    discussion: ["FPB(10, 15) = 5; variabel persekutuan y. Hasil: 5y(2y − 3)."],
  },
  {
    id: "p3",
    question: "Sederhanakan: 8x²/12x.",
    kind: "choice",
    options: ["2x/3", "2x²/3", "4x/3", "8x/12"],
    correctIndex: 0,
    hint: "Bagi koefisien dengan FPB-nya, lalu bagi variabel.",
    discussion: ["8/12 = 2/3; x²/x = x. Hasil: 2x/3."],
  },
  {
    id: "p4",
    question: "Benar atau salah: 9a + 6 = 3(3a + 2).",
    kind: "truefalse",
    correct: true,
    hint: "Distribusi balik: kalikan 3 ke setiap suku.",
    discussion: ["3·3a = 9a; 3·2 = 6. Hasil: 9a + 6. BENAR."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-fpb-faktor",
    title: "🎯 Game 1: Cocokkan Bentuk dengan Faktornya",
    description: "Tarik bentuk aljabar ke wadah hasil faktorisasinya.",
    buckets: [
      { id: "b1", label: "Hasil = 3(x + 2)", emoji: "🟦", color: "cyan" },
      { id: "b2", label: "Hasil = 4(x + 3)", emoji: "🟨", color: "amber" },
      { id: "b3", label: "Hasil = 5(2x + 1)", emoji: "🟩", color: "emerald" },
      { id: "b4", label: "Hasil = 2x(x + 2)", emoji: "🟪", color: "violet" },
    ],
    items: [
      { id: "i1", label: "3x + 6", bucketId: "b1" },
      { id: "i2", label: "4x + 12", bucketId: "b2" },
      { id: "i3", label: "10x + 5", bucketId: "b3" },
      { id: "i4", label: "2x² + 4x", bucketId: "b4" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-pecahan-aljabar",
    title: "🎮 Game 2: Sederhanakan Pecahan Aljabar",
    description: "Tekan ◀ ▶ untuk memilih bentuk paling sederhana dari setiap pecahan aljabar.",
    rightOptions: ["x/2", "2x/3", "3/x", "x²", "1/2"],
    pairs: [
      { id: "r1", left: "4x/8", correctRight: "x/2", emoji: "🍰" },
      { id: "r2", left: "8x/12", correctRight: "2x/3", emoji: "🍫" },
      { id: "r3", left: "9/3x", correctRight: "3/x", emoji: "🍕" },
      { id: "r4", left: "x³/x", correctRight: "x²", emoji: "🟪" },
      { id: "r5", left: "5x/10x", correctRight: "1/2", emoji: "💎" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Membungkus Kado",
    visual: (
      <div className="text-center">
        <div className="text-3xl mb-2">🎁🎁🎁 + 🎀🎀🎀</div>
        <p className="text-sm text-white/70">3 kotak (x rupiah) + 3 pita (1 rupiah) = 3x + 3</p>
        <p className="font-display text-2xl font-bold text-cyan-300 mt-2">3x + 3 = 3(x + 1)</p>
      </div>
    ),
    text: "Faktorisasi = mengeluarkan faktor persekutuan keluar dari kurung.",
  },
  {
    title: "Situasi: Pizza Sederhana",
    visual: (
      <div className="text-center">
        <div className="text-3xl mb-2">🍕 6/9 = 2/3</div>
        <p className="text-sm text-white/70">Pecahan disederhanakan dengan membagi pembilang & penyebut.</p>
        <p className="font-display text-2xl font-bold text-yellow-300 mt-2">6x/9 = 2x/3</p>
      </div>
    ),
    text: "Pada pecahan aljabar, lakukan hal yang sama: bagi dengan FPB pembilang & penyebut.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Cari FPB", text: "Tentukan FPB koefisien, lalu variabel yang muncul di semua suku.", tone: "cyan" },
  { title: "Keluarkan Faktor", text: "Tulis FPB di luar kurung, sisa hasil bagi tiap suku di dalam kurung.", tone: "violet" },
  { title: "Pecahan Aljabar", text: "Bagi pembilang & penyebut dengan faktor persekutuan terbesar.", tone: "emerald" },
];

const FaktorisasiAljabarLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aljabar • Kelas 7"
    title="🧮 Faktorisasi & Pecahan Aljabar"
    intro="Latihan memfaktorkan dengan FPB dan menyederhanakan pecahan aljabar lewat dua mini-game ceria!"
    situations={situations}
    guidedIntro="Lakukan penemuan terbimbing untuk memahami langkah faktorisasi."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Mantapkan pemahaman lewat soal latihan berikut."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aljabar"
    backLabel="Kembali ke menu LKPD Aljabar"
  />
);

export default FaktorisasiAljabarLKPDPage;
