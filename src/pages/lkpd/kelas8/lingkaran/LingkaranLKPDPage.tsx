import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import LingkaranInteractive from "@/components/LingkaranInteractive";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Roda Sepeda",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-600/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 200 160" className="w-full">
          <rect width="200" height="160" fill="#0b1220" rx="8" />
          <circle cx="100" cy="80" r="55" fill="none" stroke="#22d3ee" strokeWidth="3" />
          <circle cx="100" cy="80" r="3" fill="#fde047" />
          <line x1="100" y1="80" x2="155" y2="80" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="45" y1="80" x2="155" y2="80" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 3" />
          <text x="125" y="75" fill="#fbbf24" fontSize="11" fontWeight="bold">r</text>
          <text x="98" y="105" fill="#a78bfa" fontSize="11" fontWeight="bold" textAnchor="middle">d</text>
          <text x="100" y="150" fill="#67e8f9" fontSize="10" textAnchor="middle">d = 2r (diameter = 2 × jari-jari)</text>
        </svg>
      </div>
    ),
    text:
      "Roda sepeda berbentuk LINGKARAN. Jarak dari pusat ke tepi disebut JARI-JARI (r). Jarak antara dua tepi yang melewati pusat disebut DIAMETER (d). Hubungannya: d = 2r. Berapa jauh sepedamu maju setiap roda berputar 1 kali? Jawabannya = KELILING lingkaran.",
  },
  {
    title: "Situasi 2 — Potongan Pizza",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-600/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 200 160" className="w-full">
          <rect width="200" height="160" fill="#0b1220" rx="8" />
          <circle cx="100" cy="80" r="55" fill="#7c2d12" fillOpacity="0.4" stroke="#fb923c" strokeWidth="2" />
          <path d="M 100 80 L 155 80 A 55 55 0 0 0 127 32 Z" fill="#fbbf24" fillOpacity="0.7" stroke="#fbbf24" strokeWidth="2" />
          <text x="135" y="60" fill="#0f172a" fontSize="10" fontWeight="bold">JURING</text>
          <text x="100" y="80" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">⭐</text>
          <text x="100" y="150" fill="#fed7aa" fontSize="10" textAnchor="middle">sudut pusat menentukan ukuran juring</text>
        </svg>
      </div>
    ),
    text:
      "Pizza utuh dipotong menjadi beberapa bagian. Setiap potongan adalah JURING — bagian lingkaran yang dibatasi dua jari-jari dan satu busur. Lengkungan tepi potongan disebut BUSUR. Semakin besar SUDUT PUSAT, semakin besar potongan juring dan semakin panjang busurnya.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Lingkaran adalah kumpulan titik-titik yang berjarak SAMA terhadap satu titik tertentu yang disebut …",
    kind: "fill",
    answers: ["pusat", "titik pusat", "pusat lingkaran"],
    discussion: [
      "Titik tetap itu adalah PUSAT lingkaran (biasanya dilambangkan O).",
      "Jarak dari pusat ke setiap titik di lingkaran selalu SAMA — disebut jari-jari (r).",
    ],
  },
  {
    id: "g2",
    label:
      "Hubungan antara diameter (d) dan jari-jari (r) sebuah lingkaran adalah …",
    kind: "choice",
    options: ["d = r", "d = 2r", "d = r²", "d = ½r"],
    correctIndex: 1,
    discussion: [
      "Diameter adalah ruas garis yang melewati pusat dan menghubungkan dua titik pada lingkaran.",
      "Diameter = 2 × jari-jari → d = 2r.",
      "Atau sebaliknya, r = d/2.",
    ],
  },
  {
    id: "g3",
    label:
      "Jodohkan unsur lingkaran dengan definisinya:",
    kind: "match",
    pairs: [
      { left: "Jari-jari", right: "ruas garis dari pusat ke titik pada lingkaran" },
      { left: "Diameter", right: "ruas garis melalui pusat menghubungkan dua titik di lingkaran" },
      { left: "Tali Busur", right: "ruas garis menghubungkan dua titik di lingkaran tanpa melalui pusat" },
      { left: "Busur", right: "lengkungan bagian dari lingkaran" },
      { left: "Juring", right: "daerah dibatasi dua jari-jari dan busur" },
      { left: "Tembereng", right: "daerah dibatasi satu tali busur dan busur" },
    ],
    discussion: [
      "Jari-jari (r) — dari pusat ke tepi.",
      "Diameter (d) — tali busur yang melalui pusat, paling panjang.",
      "Tali busur — penghubung dua titik di lingkaran (tidak harus melalui pusat).",
      "Busur — bagian melengkung dari lingkaran.",
      "Juring — 'potongan pizza' yang dibatasi dua jari-jari dan busur.",
      "Tembereng — daerah antara tali busur dan busur (seperti bulan sabit).",
    ],
  },
  {
    id: "g4",
    label:
      "Ratio (perbandingan) keliling lingkaran terhadap diameternya selalu konstan dan disebut …",
    kind: "fill",
    answers: ["pi", "π", "phi"],
    discussion: [
      "Keliling : diameter = π (pi).",
      "π adalah bilangan IRASIONAL ≈ 3,14159… atau bisa didekati dengan 22/7.",
      "Gunakan π = 22/7 jika r kelipatan 7, dan π = 3,14 jika r tidak kelipatan 7.",
    ],
  },
  {
    id: "g5",
    label: "Rumus KELILING lingkaran adalah …",
    kind: "choice",
    options: ["K = πr", "K = πr²", "K = 2πr", "K = πd²"],
    correctIndex: 2,
    discussion: [
      "K = π × diameter = π × 2r = 2πr.",
      "Bisa ditulis: K = πd ATAU K = 2πr.",
      "Contoh r = 7: K = 2 × (22/7) × 7 = 44 satuan.",
    ],
  },
  {
    id: "g6",
    label: "Rumus LUAS lingkaran adalah …",
    kind: "fill",
    answers: ["πr²", "πr^2", "pi r²", "pi*r^2", "pir^2", "pir²"],
    discussion: [
      "L = π × r².",
      "Bukan πr saja, dan bukan 2πr (itu rumus keliling).",
      "Contoh r = 7: L = (22/7) × 49 = 154 satuan persegi.",
    ],
  },
  {
    id: "g7",
    label:
      "Sebuah lingkaran berjari-jari 14 cm. Kelilingnya adalah … cm.",
    kind: "fill",
    answers: ["88"],
    discussion: [
      "K = 2πr = 2 × (22/7) × 14 = 2 × 22 × 2 = 88 cm.",
      "Karena r kelipatan 7, gunakan π = 22/7.",
    ],
  },
  {
    id: "g8",
    label:
      "Sebuah lingkaran berjari-jari 14 cm. Luasnya adalah … cm².",
    kind: "fill",
    answers: ["616"],
    discussion: [
      "L = πr² = (22/7) × 14² = (22/7) × 196 = 22 × 28 = 616 cm².",
    ],
  },
  {
    id: "g9",
    label:
      "Pernyataan: Jika diameter lingkaran 20 cm, maka kelilingnya menggunakan π = 3,14 adalah 62,8 cm.",
    kind: "truefalse",
    correctTrue: true,
    discussion: [
      "K = πd = 3,14 × 20 = 62,8 cm. ✓ BENAR.",
    ],
  },
  {
    id: "g10",
    label:
      "Sudut pusat adalah sudut yang titik sudutnya (vertex) berada di … lingkaran.",
    kind: "fill",
    answers: ["pusat", "titik pusat"],
    discussion: [
      "Sudut PUSAT memiliki vertex di pusat lingkaran (O), dengan kedua kakinya berupa jari-jari.",
      "Misalnya ∠AOB.",
    ],
  },
  {
    id: "g11",
    label:
      "Sudut keliling adalah sudut yang titik sudutnya (vertex) berada di …",
    kind: "choice",
    options: [
      "pusat lingkaran",
      "tepi lingkaran (pada lingkaran)",
      "luar lingkaran",
      "tali busur",
    ],
    correctIndex: 1,
    discussion: [
      "Sudut KELILING memiliki vertex di tepi/lingkaran, dengan kedua kakinya berupa tali busur.",
      "Misalnya ∠ACB dengan C di lingkaran.",
    ],
  },
  {
    id: "g12",
    label:
      "Hubungan sudut pusat dan sudut keliling yang menatap busur SAMA: sudut pusat = … × sudut keliling.",
    kind: "fill",
    answers: ["2", "dua"],
    discussion: [
      "TEOREMA: ∠ pusat = 2 × ∠ keliling (jika menatap busur yang sama).",
      "Atau: ∠ keliling = ½ × ∠ pusat.",
      "Coba di laboratorium interaktif: geser titik C — sudut keliling tetap = ½ sudut pusat!",
    ],
  },
  {
    id: "g13",
    label:
      "Jika sudut pusat ∠AOB = 80°, maka sudut keliling ∠ACB (yang menatap busur AB sama) = …",
    kind: "fill",
    answers: ["40", "40°"],
    discussion: [
      "∠ACB = ½ × ∠AOB = ½ × 80° = 40°.",
    ],
  },
  {
    id: "g14",
    label:
      "AB adalah DIAMETER lingkaran. C titik sembarang pada lingkaran. Maka ∠ACB = … (sudut keliling menatap diameter).",
    kind: "fill",
    answers: ["90", "90°"],
    discussion: [
      "Diameter membuat sudut pusat = 180° (garis lurus).",
      "Sudut keliling = ½ × 180° = 90°.",
      "Inilah teorema Thales: sudut keliling yang menatap diameter selalu siku-siku!",
      "Coba tantangan 'AOB = 180°' di laboratorium — ∠ACB akan menjadi 90°.",
    ],
  },
  {
    id: "g15",
    label:
      "Rumus PANJANG BUSUR jika sudut pusat α derajat dan jari-jari r adalah …",
    kind: "choice",
    options: [
      "(α/360) × 2πr",
      "(α/360) × πr²",
      "(360/α) × 2πr",
      "α × 2πr",
    ],
    correctIndex: 0,
    discussion: [
      "Panjang busur = (sudut pusat / 360°) × keliling lingkaran.",
      "Panjang busur = (α/360) × 2πr.",
      "Logika: kalau α = 360°, panjang busur = keliling penuh.",
    ],
  },
  {
    id: "g16",
    label:
      "Rumus LUAS JURING jika sudut pusat α derajat dan jari-jari r adalah …",
    kind: "choice",
    options: [
      "(α/360) × 2πr",
      "(α/360) × πr²",
      "(360/α) × πr²",
      "α × πr²",
    ],
    correctIndex: 1,
    discussion: [
      "Luas juring = (sudut pusat / 360°) × luas lingkaran.",
      "Luas juring = (α/360) × πr².",
      "Logika: kalau α = 360°, luas juring = luas lingkaran penuh.",
    ],
  },
  {
    id: "g17",
    label:
      "Lingkaran berjari-jari 7 cm dan sudut pusat 90°. Panjang busurnya = … cm.",
    kind: "fill",
    answers: ["11"],
    discussion: [
      "Panjang busur = (90/360) × 2 × (22/7) × 7 = ¼ × 44 = 11 cm.",
    ],
  },
  {
    id: "g18",
    label:
      "Lingkaran berjari-jari 7 cm dan sudut pusat 90°. Luas juringnya = … cm².",
    kind: "fill",
    answers: ["38.5", "38,5"],
    discussion: [
      "Luas juring = (90/360) × (22/7) × 7² = ¼ × 154 = 38,5 cm².",
    ],
  },
  {
    id: "g19",
    label:
      "Hubungan PERBANDINGAN: panjang busur AB ÷ keliling = … ÷ 360°",
    kind: "fill",
    answers: ["sudut pusat", "α", "alpha", "sudut AOB"],
    discussion: [
      "Panjang busur / keliling = sudut pusat / 360°.",
      "Atau: luas juring / luas lingkaran = sudut pusat / 360°.",
      "Inilah konsep dasar PROPORSI pada lingkaran.",
    ],
  },
  {
    id: "g20",
    label:
      "Urutkan langkah menghitung LUAS JURING jika diketahui jari-jari dan sudut pusat:",
    kind: "sort",
    items: [
      "Hitung luas lingkaran penuh: L = πr².",
      "Tuliskan rumus luas juring = (α/360) × L.",
      "Substitusikan nilai α dan luas lingkaran ke dalam rumus.",
      "Sederhanakan untuk mendapat luas juring akhir.",
    ],
    correctOrder: [
      "Tuliskan rumus luas juring = (α/360) × L.",
      "Hitung luas lingkaran penuh: L = πr².",
      "Substitusikan nilai α dan luas lingkaran ke dalam rumus.",
      "Sederhanakan untuk mendapat luas juring akhir.",
    ],
    discussion: [
      "Contoh: r = 14 cm, α = 60°.",
      "Langkah 1: rumus juring = (α/360) × πr².",
      "Langkah 2: L = (22/7) × 14² = 616 cm².",
      "Langkah 3: juring = (60/360) × 616.",
      "Langkah 4: juring = ⅙ × 616 = 102,67 cm².",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Unsur-Unsur Lingkaran",
    body:
      "Pusat (O), jari-jari (r), diameter (d = 2r), tali busur, busur, juring (potongan pizza), tembereng (bulan sabit), dan apotema.",
    color: "cyan",
  },
  {
    title: "Keliling & Luas",
    body:
      "Keliling: K = 2πr atau K = πd.\nLuas: L = πr².\nGunakan π = 22/7 jika r kelipatan 7, dan π = 3,14 jika tidak.",
    color: "amber",
  },
  {
    title: "Sudut Pusat & Sudut Keliling",
    body:
      "∠ pusat = 2 × ∠ keliling (menatap busur sama).\nDiameter membuat sudut keliling = 90° (Teorema Thales).\nPanjang busur = (α/360) × 2πr.\nLuas juring = (α/360) × πr².",
    color: "violet",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-unsur",
    title: "🎯 Game 1 — Kelompokkan Unsur Lingkaran",
    description: "Seret setiap unsur ke kategori RUAS GARIS, DAERAH, atau LENGKUNG.",
    buckets: [
      { id: "ruas", label: "RUAS GARIS", emoji: "📏", color: "cyan" },
      { id: "daerah", label: "DAERAH", emoji: "🟧", color: "amber" },
      { id: "lengkung", label: "LENGKUNG", emoji: "〰️", color: "violet" },
    ],
    items: [
      { id: "i1", label: "Jari-jari", bucketId: "ruas", emoji: "📏" },
      { id: "i2", label: "Diameter", bucketId: "ruas", emoji: "📏" },
      { id: "i3", label: "Tali busur", bucketId: "ruas", emoji: "📏" },
      { id: "i4", label: "Busur", bucketId: "lengkung", emoji: "〰️" },
      { id: "i5", label: "Juring", bucketId: "daerah", emoji: "🟧" },
      { id: "i6", label: "Tembereng", bucketId: "daerah", emoji: "🌙" },
      { id: "i7", label: "Apotema", bucketId: "ruas", emoji: "📏" },
      { id: "i8", label: "Lingkaran", bucketId: "lengkung", emoji: "⭕" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-sudut",
    title: "🎯 Game 2 — Sudut Pusat ↔ Sudut Keliling",
    description: "Pasangkan setiap sudut pusat dengan sudut keliling yang TEPAT (menatap busur sama).",
    rightOptions: ["20°", "30°", "40°", "45°", "60°", "90°"],
    pairs: [
      { id: "p1", left: "∠ pusat = 40°", correctRight: "20°", emoji: "📐" },
      { id: "p2", left: "∠ pusat = 60°", correctRight: "30°", emoji: "📐" },
      { id: "p3", left: "∠ pusat = 80°", correctRight: "40°", emoji: "📐" },
      { id: "p4", left: "∠ pusat = 90°", correctRight: "45°", emoji: "📐" },
      { id: "p5", left: "∠ pusat = 120°", correctRight: "60°", emoji: "📐" },
      { id: "p6", left: "∠ pusat = 180° (diameter)", correctRight: "90°", emoji: "📐" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    label:
      "Sebuah lingkaran berjari-jari 21 cm. Tentukan kelilingnya (gunakan π = 22/7).",
    kind: "fill",
    answers: ["132", "132 cm"],
    hint: "K = 2πr.",
    discussion: [
      "K = 2 × (22/7) × 21 = 2 × 22 × 3 = 132 cm.",
    ],
  },
  {
    id: "p2",
    label:
      "Sebuah lingkaran berjari-jari 10 cm. Tentukan luasnya (gunakan π = 3,14).",
    kind: "fill",
    answers: ["314", "314 cm²", "314 cm2"],
    hint: "L = πr².",
    discussion: [
      "L = 3,14 × 10² = 3,14 × 100 = 314 cm².",
    ],
  },
  {
    id: "p3",
    label:
      "Diameter sebuah roda sepeda 70 cm. Berapa jarak yang ditempuh sepeda jika roda berputar 100 kali? (π = 22/7)",
    kind: "choice",
    options: ["220 m", "22 m", "2.200 m", "22.000 cm"],
    correctIndex: 0,
    hint: "Jarak = banyak putaran × keliling roda.",
    discussion: [
      "K = πd = (22/7) × 70 = 220 cm.",
      "Jarak = 100 × 220 = 22.000 cm = 220 m.",
    ],
  },
  {
    id: "p4",
    label:
      "Sebuah lingkaran memiliki sudut pusat 72°. Sudut keliling yang menatap busur SAMA adalah …°",
    kind: "fill",
    answers: ["36"],
    hint: "Sudut keliling = ½ sudut pusat.",
    discussion: [
      "∠ keliling = ½ × 72° = 36°.",
    ],
  },
  {
    id: "p5",
    label:
      "AB adalah diameter lingkaran. Titik C berada pada lingkaran. Berapa besar ∠ACB?",
    kind: "choice",
    options: ["45°", "60°", "90°", "180°"],
    correctIndex: 2,
    hint: "Teorema Thales: sudut keliling yang menatap diameter.",
    discussion: [
      "Sudut pusat untuk diameter = 180°.",
      "Sudut keliling = ½ × 180° = 90°.",
      "Maka ∠ACB selalu siku-siku, di mana pun C berada.",
    ],
  },
  {
    id: "p6",
    label:
      "Lingkaran berjari-jari 14 cm dan sudut pusat 45°. Panjang busurnya = … cm.",
    kind: "fill",
    answers: ["11"],
    hint: "Panjang busur = (α/360) × 2πr.",
    discussion: [
      "K = 2πr = 2 × (22/7) × 14 = 88 cm.",
      "Panjang busur = (45/360) × 88 = ⅛ × 88 = 11 cm.",
    ],
  },
  {
    id: "p7",
    label:
      "Lingkaran berjari-jari 21 cm dan sudut pusat 60°. Luas juringnya = … cm².",
    kind: "fill",
    answers: ["231"],
    hint: "Luas juring = (α/360) × πr².",
    discussion: [
      "L = πr² = (22/7) × 21² = (22/7) × 441 = 22 × 63 = 1.386 cm².",
      "Luas juring = (60/360) × 1.386 = ⅙ × 1.386 = 231 cm².",
    ],
  },
  {
    id: "p8",
    label:
      "Sebuah pizza diameter 28 cm dipotong menjadi 8 bagian sama besar. Luas tiap potongan adalah … cm².",
    kind: "fill",
    answers: ["77"],
    hint: "Cari luas penuh dulu, lalu bagi 8.",
    discussion: [
      "r = 28/2 = 14 cm.",
      "Luas pizza penuh = (22/7) × 14² = 616 cm².",
      "Luas tiap potong = 616 / 8 = 77 cm².",
      "Atau: tiap potong sudut pusat = 360/8 = 45°, juring = (45/360) × 616 = 77 cm².",
    ],
  },
];

const LingkaranLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab 8"
    title="Lingkaran — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami dunia LINGKARAN! Kamu akan mengenal unsur-unsurnya, menemukan rumus keliling & luas, mengeksplorasi sudut pusat dan sudut keliling, hingga menghitung panjang busur dan luas juring — sambil bermain dengan lingkaran interaktif yang bisa kamu seret!"
    situations={situations}
    guidedIntro="Kerjakan soal-soal berikut secara berurutan. Setiap jawabanmu akan menuntun pada konsep lingkaran. Tekan 'Periksa Jawaban' di bawah untuk melihat pembahasan lengkap."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={
      <section className="rounded-3xl border border-rose-300/30 bg-gradient-to-br from-rose-500/10 via-orange-500/10 to-cyan-500/10 p-5 md:p-6 shadow-[0_0_45px_rgba(251,113,133,0.18)]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🎮</span>
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-rose-200">
              Laboratorium Lingkaran
            </h3>
            <p className="text-sm text-white/70">
              Seret titik A, B, dan C — buktikan sendiri bahwa sudut keliling = ½ × sudut pusat!
            </p>
          </div>
        </div>
        <LingkaranInteractive />
        <p className="mt-3 text-xs text-white/65 italic">
          💡 Tantangan: cobalah tantangan AOB = 180° dan amati bahwa sudut keliling C otomatis menjadi 90° (siku-siku) — itulah Teorema Thales!
        </p>
      </section>
    }
    games={games}
    practiceIntro="Kerjakan soal latihan untuk mengasah pemahamanmu tentang keliling, luas, sudut pusat, sudut keliling, panjang busur, dan luas juring."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/lingkaran"
    backLabel="Kembali ke Menu Lingkaran"
    scoreMessages={{
      perfect: "🌟 Luar biasa, Sobat Numatik! Pemahaman Lingkaran-mu sudah sempurna!",
      high: "👍 Bagus sekali! Periksa kembali bagian yang masih merah agar lebih mantap.",
      medium: "🚀 Sudah mulai paham. Ulangi penemuan terbimbing dan main lagi laboratorium lingkarannya.",
      low: "💪 Tetap semangat! Mulai dari atas, ingat K = 2πr, L = πr², dan ∠keliling = ½ × ∠pusat.",
    }}
  />
);

export default LingkaranLKPDPage;
