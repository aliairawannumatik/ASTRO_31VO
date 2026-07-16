import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Bentuk aljabar 3x + 5 terdiri dari berapa suku?",
    kind: "choice",
    options: ["1 suku", "2 suku", "3 suku", "5 suku"],
    correctIndex: 1,
    discussion: [
      "Suku adalah bagian yang dipisahkan oleh tanda + atau −.",
      "3x dan 5 dipisahkan oleh tanda +, sehingga ada 2 suku.",
    ],
  },
  {
    id: "g2",
    label: "Pada suku 7y, bilangan 7 disebut … dan huruf y disebut …",
    kind: "match",
    pairs: [
      { left: "Angka 7 (di depan)", right: "Koefisien" },
      { left: "Huruf y", right: "Variabel" },
      { left: "Suku tanpa variabel (mis. 5)", right: "Konstanta" },
      { left: "Pemisah +/−", right: "Pembatas suku" },
    ],
    discussion: [
      "Koefisien = bilangan pengali variabel.",
      "Variabel = huruf yang mewakili nilai.",
      "Konstanta = suku berupa angka tanpa variabel.",
    ],
  },
  {
    id: "g3",
    label: "Pada bentuk aljabar 4a + 2b − 6, koefisien dari b adalah ...",
    kind: "fill",
    answers: ["2"],
    discussion: ["Koefisien b adalah bilangan yang berada tepat di depan b, yaitu 2."],
  },
  {
    id: "g4",
    label: "Benar atau salah: 3x dan 5x adalah suku sejenis.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Suku sejenis = variabel & pangkat sama, hanya beda koefisien.",
      "3x dan 5x sama-sama variabel x pangkat 1 → sejenis. BENAR.",
    ],
  },
  {
    id: "g5",
    label: "Manakah yang merupakan konstanta pada 8m + 3n − 12?",
    kind: "choice",
    options: ["8", "3", "−12", "m"],
    correctIndex: 2,
    discussion: ["Konstanta = suku tanpa variabel, yaitu −12."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Tentukan banyak suku pada bentuk: 5x + 2y − 3 + 4xy.",
    kind: "fill",
    answers: ["4"],
    hint: "Hitung bagian yang dipisahkan tanda + atau −.",
    discussion: ["Sukunya: 5x, 2y, −3, 4xy → ada 4 suku."],
  },
  {
    id: "p2",
    question: "Pada 9p − 4q + 11, sebutkan koefisien q.",
    kind: "fill",
    answers: ["-4", "−4"],
    hint: "Lihat tanda di depan q.",
    discussion: ["Koefisien q = −4 (tanda minus ikut)."],
  },
  {
    id: "p3",
    question: "Manakah yang BUKAN suku sejenis dengan 7x²?",
    kind: "choice",
    options: ["3x²", "−x²", "5x", "10x²"],
    correctIndex: 2,
    hint: "Pangkat variabel harus sama persis.",
    discussion: ["5x berpangkat 1, sedangkan 7x² berpangkat 2, sehingga tidak sejenis."],
  },
  {
    id: "p4",
    question: "Benar atau salah: pada 6ab + 2a, suku 6ab dan 2a adalah suku sejenis.",
    kind: "truefalse",
    correct: false,
    hint: "Variabelnya harus persis sama.",
    discussion: ["6ab memiliki variabel a dan b; 2a hanya a. Tidak sejenis. SALAH."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-pisah-unsur",
    title: "🎯 Game 1: Pisahkan Unsur Aljabar",
    description: "Tarik atau ketuk setiap kotak aljabar, lalu lepaskan ke wadah yang tepat: Variabel, Koefisien, atau Konstanta.",
    buckets: [
      { id: "var", label: "VARIABEL", emoji: "🔤", color: "cyan" },
      { id: "koef", label: "KOEFISIEN", emoji: "🔢", color: "violet" },
      { id: "kons", label: "KONSTANTA", emoji: "💎", color: "emerald" },
    ],
    items: [
      { id: "i1", label: "x", bucketId: "var", emoji: "🔤" },
      { id: "i2", label: "5 (pada 5y)", bucketId: "koef" },
      { id: "i3", label: "7", bucketId: "kons", emoji: "💎" },
      { id: "i4", label: "ab", bucketId: "var" },
      { id: "i5", label: "−3", bucketId: "kons" },
      { id: "i6", label: "−2 (pada −2m)", bucketId: "koef" },
      { id: "i7", label: "p", bucketId: "var" },
      { id: "i8", label: "10", bucketId: "kons" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-jodoh-suku",
    title: "🎮 Game 2: Jodohkan Suku Sejenis",
    description: "Tekan panah ◀ ▶ untuk memilih pasangan suku sejenis yang tepat untuk setiap suku di kiri.",
    rightOptions: ["8x", "−2y", "9a²", "5ab", "12"],
    pairs: [
      { id: "r1", left: "3x", correctRight: "8x", emoji: "🟦" },
      { id: "r2", left: "7y", correctRight: "−2y", emoji: "🟥" },
      { id: "r3", left: "4a²", correctRight: "9a²", emoji: "🟨" },
      { id: "r4", left: "−6ab", correctRight: "5ab", emoji: "🟩" },
      { id: "r5", left: "−5 (konstanta)", correctRight: "12", emoji: "💎" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Toko Buku Aljabar",
    visual: (
      <div className="text-center">
        <div className="text-5xl mb-2">📚 + 📚 + 📕 = ?</div>
        <p className="text-sm text-white/70">Misal harga 1 buku tulis = x rupiah, 1 buku gambar = y rupiah.</p>
        <p className="font-display text-2xl font-bold text-cyan-300 mt-2">2x + y</p>
      </div>
    ),
    text: "Bentuk 2x + y berarti 2 buku tulis ditambah 1 buku gambar. Angka 2 dan 1 adalah koefisien, x dan y adalah variabel.",
  },
  {
    title: "Situasi: Saku Sobat Numatik",
    visual: (
      <div className="text-center">
        <div className="text-5xl mb-2">🎒 + 💵</div>
        <p className="font-display text-2xl font-bold text-yellow-300 mt-2">3a + 5</p>
        <p className="text-xs text-white/60 mt-1">3 amplop berisi a rupiah + uang tunai 5 ribu rupiah.</p>
      </div>
    ),
    text: "Pada 3a + 5: koefisien 3, variabel a, dan konstanta 5.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Variabel", text: "Huruf yang mewakili nilai (mis. x, y, a, b).", tone: "cyan" },
  { title: "Koefisien", text: "Bilangan pengali variabel (mis. 3 pada 3x).", tone: "violet" },
  { title: "Konstanta", text: "Suku berupa angka, tanpa variabel (mis. −5).", tone: "emerald" },
];

const PengertianUnsurAljabarLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aljabar • Kelas 7"
    title="🧩 Pengertian & Unsur Aljabar"
    intro="Kenali variabel, koefisien, konstanta, dan suku lewat permainan tarik-pindah dan jodoh-panah yang seru!"
    situations={situations}
    guidedIntro="Selesaikan soal terbimbing untuk memahami unsur-unsur aljabar."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Asah pemahamanmu dengan soal-soal latihan berikut."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aljabar"
    backLabel="Kembali ke menu LKPD Aljabar"
  />
);

export default PengertianUnsurAljabarLKPDPage;
