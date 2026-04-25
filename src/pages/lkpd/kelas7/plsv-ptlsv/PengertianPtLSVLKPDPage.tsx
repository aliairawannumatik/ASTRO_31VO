import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: 'PtLSV adalah pertidaksamaan linear ... variabel.',
    kind: "choice",
    options: ["dua", "satu", "tiga", "tanpa"],
    correctIndex: 1,
    discussion: ["PtLSV = Pertidaksamaan Linear SATU Variabel."],
  },
  {
    id: "g2",
    label: "Tanda yang DIPAKAI pada PtLSV (bukan PLSV) adalah ...",
    kind: "choice",
    options: ["= (sama dengan)", "<, >, ≤, ≥", "+ atau −", "× atau ÷"],
    correctIndex: 1,
    discussion: ["PLSV pakai '=', PtLSV pakai pertidaksamaan: <, >, ≤, ≥."],
  },
  {
    id: "g3",
    label: 'Manakah yang merupakan PtLSV?',
    kind: "choice",
    options: ["x² > 9", "2x + 3 ≤ 11", "xy < 6", "5 + 4 = 9"],
    correctIndex: 1,
    discussion: ["x² bukan linear; xy ada 2 variabel; 5+4=9 PLSV (tertutup). Hanya 2x + 3 ≤ 11 yang PtLSV."],
  },
  {
    id: "g4",
    label: 'Tanda "kurang dari atau sama dengan" ditulis ...',
    kind: "fill",
    answers: ["≤", "<="],
    discussion: ["≤ artinya ≤ (kurang dari atau sama dengan). Bila membaca: paling banyak."],
  },
  {
    id: "g5",
    label: 'Tanda "lebih dari atau sama dengan" ditulis ...',
    kind: "fill",
    answers: ["≥", ">="],
    discussion: ["≥ artinya lebih dari atau sama dengan. Bila membaca: paling sedikit / minimal."],
  },
  {
    id: "g6",
    label: "Pasangkan tanda dengan kata kunci di soal cerita:",
    kind: "match",
    pairs: [
      { left: "≤ (paling banyak / tidak lebih dari)", right: "≤" },
      { left: "≥ (paling sedikit / minimal)", right: "≥" },
      { left: "< (kurang dari)", right: "<" },
      { left: "> (lebih dari)", right: ">" },
    ],
    discussion: ["Hafalkan pasangan kata kunci ↔ tanda agar mudah memodelkan soal cerita."],
  },
  {
    id: "g7",
    label: "Benar atau salah: 3x − 1 < 8 adalah PtLSV.",
    kind: "truefalse",
    correct: true,
    discussion: ["Satu variabel x berpangkat 1 dan tanda < → PtLSV."],
  },
  {
    id: "g8",
    label: "Urutkan langkah memeriksa apakah suatu kalimat adalah PtLSV:",
    kind: "sort",
    items: [
      "Periksa pangkat variabel = 1?",
      "Pastikan ada satu jenis variabel.",
      "Pastikan ada tanda <, >, ≤, atau ≥.",
      "Simpulkan PtLSV / bukan.",
    ],
    correctOrder: [
      "Pastikan ada tanda <, >, ≤, atau ≥.",
      "Pastikan ada satu jenis variabel.",
      "Periksa pangkat variabel = 1?",
      "Simpulkan PtLSV / bukan.",
    ],
    discussion: ["Cek tanda pertidaksamaan → satu variabel → pangkat 1 → simpulkan."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Manakah yang BUKAN PtLSV?",
    kind: "choice",
    options: ["x − 2 > 5", "3y ≤ 12", "p² < 16", "2a + 1 ≥ 7"],
    correctIndex: 2,
    hint: "Cek pangkat variabel.",
    discussion: ["p² berpangkat 2 → bukan linear, jadi BUKAN PtLSV."],
  },
  {
    id: "p2",
    question: 'Pada PtLSV "5x − 3 ≤ 12", koefisien dari x adalah ...',
    kind: "fill",
    answers: ["5"],
    hint: "Bilangan yang melekat pada variabel.",
    discussion: ["Koefisien x = 5."],
  },
  {
    id: "p3",
    question: "Tanda 'tidak kurang dari' ditulis dengan tanda ...",
    kind: "fill",
    answers: ["≥", ">="],
    hint: "Tidak kurang = paling sedikit.",
    discussion: ["'Tidak kurang dari' artinya ≥."],
  },
  {
    id: "p4",
    question: "Benar atau salah: 4x + 1 = 9 adalah PtLSV.",
    kind: "truefalse",
    correct: false,
    hint: "Lihat tanda hubung.",
    discussion: ["Tandanya '=', berarti PERSAMAAN (PLSV), bukan pertidaksamaan."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-tanda",
    title: "🎯 Game 1: Tarik Kata Kunci ke Tandanya",
    description: "Tarik setiap kata kunci ke tanda pertidaksamaan yang tepat.",
    buckets: [
      { id: "b1", label: "<", emoji: "◀", color: "cyan" },
      { id: "b2", label: ">", emoji: "▶", color: "violet" },
      { id: "b3", label: "≤", emoji: "🔻", color: "emerald" },
      { id: "b4", label: "≥", emoji: "🔺", color: "yellow" },
    ],
    items: [
      { id: "i1", label: "Kurang dari", bucketId: "b1" },
      { id: "i2", label: "Lebih dari", bucketId: "b2" },
      { id: "i3", label: "Paling banyak", bucketId: "b3" },
      { id: "i4", label: "Paling sedikit", bucketId: "b4" },
      { id: "i5", label: "Tidak lebih dari", bucketId: "b3" },
      { id: "i6", label: "Minimal", bucketId: "b4" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-pt-bukan",
    title: "🎮 Game 2: PtLSV atau Bukan?",
    description: "Tekan ◀ ▶ untuk memilih label yang benar.",
    rightOptions: ["PtLSV ✅", "Bukan PtLSV ❌"],
    pairs: [
      { id: "r1", left: "x + 4 < 10", correctRight: "PtLSV ✅", emoji: "◀" },
      { id: "r2", left: "x² ≥ 9", correctRight: "Bukan PtLSV ❌", emoji: "❌" },
      { id: "r3", left: "3y ≤ 21", correctRight: "PtLSV ✅", emoji: "🔻" },
      { id: "r4", left: "5 + 2 = 7", correctRight: "Bukan PtLSV ❌", emoji: "🟰" },
      { id: "r5", left: "2x − 1 > 7", correctRight: "PtLSV ✅", emoji: "▶" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: 4 Tanda Pertidaksamaan",
    visual: (
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-cyan-300/40 bg-cyan-500/15 p-3 text-cyan-100 text-center font-display">{`<`}<div className="text-xs text-white/70">kurang dari</div></div>
        <div className="rounded-xl border border-violet-300/40 bg-violet-500/15 p-3 text-violet-100 text-center font-display">{`>`}<div className="text-xs text-white/70">lebih dari</div></div>
        <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/15 p-3 text-emerald-100 text-center font-display">{`≤`}<div className="text-xs text-white/70">paling banyak</div></div>
        <div className="rounded-xl border border-yellow-300/40 bg-yellow-500/15 p-3 text-yellow-100 text-center font-display">{`≥`}<div className="text-xs text-white/70">paling sedikit</div></div>
      </div>
    ),
    text: "Empat tanda inilah yang membedakan pertidaksamaan dengan persamaan.",
  },
  {
    title: "Situasi: Bentuk Umum PtLSV",
    visual: (
      <div className="text-center">
        <div className="font-display text-2xl text-yellow-200 mb-2">ax + b ◇ c</div>
        <p className="text-sm text-white/75">
          dengan ◇ ∈ &#123;&lt;, &gt;, ≤, ≥&#125; <br />a ≠ 0; a, b, c bilangan real
        </p>
      </div>
    ),
    text: "Sama seperti PLSV (ax + b = c), tetapi tanda '=' diganti dengan salah satu tanda pertidaksamaan.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Definisi PtLSV", text: "Pertidaksamaan linear satu variabel berpangkat 1.", tone: "cyan" },
  { title: "Tanda Pertidaksamaan", text: "Hanya boleh: <, >, ≤, ≥. Bukan '='.", tone: "violet" },
  { title: "Bentuk Umum", text: "ax + b ◇ c, a ≠ 0; ◇ ∈ {<, >, ≤, ≥}.", tone: "emerald" },
];

const PengertianPtLSVLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif PtLSV • Kelas 7"
    title="🚦 Pengertian PtLSV"
    intro="Temukan ciri-ciri Pertidaksamaan Linear Satu Variabel (PtLSV) dan kenali keempat tanda pertidaksamaan lewat dua mini-game!"
    situations={situations}
    guidedIntro="Lakukan aktivitas berikut untuk membangun pengertian PtLSV."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Uji pemahamanmu dengan soal latihan."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke menu LKPD PLSV & PtLSV"
  />
);

export default PengertianPtLSVLKPDPage;
