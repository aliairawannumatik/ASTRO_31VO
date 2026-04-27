import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import GarisSinggungInteractive from "@/components/GarisSinggungInteractive";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Bola Menggelinding di Lantai",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 200 160" className="w-full">
          <rect width="200" height="160" fill="#0b1220" rx="8" />
          <line x1="10" y1="130" x2="190" y2="130" stroke="#a78bfa" strokeWidth="3" />
          <circle cx="100" cy="95" r="35" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="100" cy="95" r="3" fill="#fde047" />
          <line x1="100" y1="95" x2="100" y2="130" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
          <rect x="95" y="120" width="10" height="10" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="108" y="115" fill="#fbbf24" fontSize="11" fontWeight="bold">r</text>
          <text x="100" y="150" fill="#c4b5fd" fontSize="10" textAnchor="middle">lantai = garis singgung lingkaran</text>
        </svg>
      </div>
    ),
    text:
      "Bola menggelinding di atas lantai. Lantai hanya MENYENTUH bola di SATU titik. Garis (lantai) yang seperti ini disebut GARIS SINGGUNG LINGKARAN. Perhatikan: jari-jari yang ditarik dari pusat bola ke titik singgung selalu TEGAK LURUS terhadap lantai!",
  },
  {
    title: "Situasi 2 — Dua Roda Sabuk",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-rose-600/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 200 160" className="w-full">
          <rect width="200" height="160" fill="#0b1220" rx="8" />
          <circle cx="60" cy="80" r="32" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="60" cy="80" r="2.5" fill="#fde047" />
          <circle cx="150" cy="80" r="22" fill="none" stroke="#34d399" strokeWidth="2" />
          <circle cx="150" cy="80" r="2.5" fill="#fde047" />
          <line x1="60" y1="48" x2="150" y2="58" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="112" x2="150" y2="102" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />
          <text x="100" y="35" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="middle">sabuk (GSPL)</text>
          <text x="100" y="150" fill="#a78bfa" fontSize="10" textAnchor="middle">menyinggung kedua roda di sisi sama</text>
        </svg>
      </div>
    ),
    text:
      "Dua roda dihubungkan dengan satu sabuk. Sabuk menyinggung KEDUA roda — disebut GARIS SINGGUNG PERSEKUTUAN. Jika sabuk berada di SISI SAMA dari kedua roda, disebut PERSEKUTUAN LUAR (GSPL). Jika sabuk MENYILANG di antara dua roda, disebut PERSEKUTUAN DALAM (GSPD).",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Garis singgung lingkaran adalah garis yang memotong/menyentuh lingkaran tepat di … titik.",
    kind: "fill",
    answers: ["1", "satu"],
    discussion: [
      "Garis singgung HANYA menyentuh lingkaran di SATU titik (titik singgung).",
      "Bandingkan dengan tali busur yang memotong lingkaran di DUA titik.",
    ],
  },
  {
    id: "g2",
    label:
      "Pernyataan: Jari-jari yang ditarik dari pusat ke titik singgung selalu TEGAK LURUS terhadap garis singgung.",
    kind: "truefalse",
    correctTrue: true,
    discussion: [
      "BENAR — inilah SIFAT UTAMA garis singgung lingkaran.",
      "Jika OT adalah jari-jari ke titik singgung T, dan g adalah garis singgung, maka OT ⊥ g.",
      "Sifat ini menjadi DASAR penggunaan Teorema Pythagoras pada panjang garis singgung.",
    ],
  },
  {
    id: "g3",
    label:
      "Sebuah titik P berada di luar lingkaran berpusat O. Berapa banyak garis singgung yang dapat ditarik dari P ke lingkaran?",
    kind: "choice",
    options: ["0 (tidak ada)", "1", "2", "tak terhingga"],
    correctIndex: 2,
    discussion: [
      "Dari titik di LUAR lingkaran, dapat ditarik tepat DUA garis singgung.",
      "Dari titik PADA lingkaran, hanya dapat ditarik SATU garis singgung.",
      "Dari titik di DALAM lingkaran, TIDAK ADA garis singgung yang dapat ditarik.",
    ],
  },
  {
    id: "g4",
    label:
      "Jika dari titik P di luar lingkaran ditarik dua garis singgung PT₁ dan PT₂, maka panjang PT₁ dan PT₂ adalah …",
    kind: "choice",
    options: [
      "tidak sama panjang",
      "selalu SAMA panjang",
      "PT₁ = 2 × PT₂",
      "tergantung sudut",
    ],
    correctIndex: 1,
    discussion: [
      "DUA garis singgung dari satu titik di luar lingkaran SELALU SAMA PANJANG.",
      "PT₁ = PT₂.",
      "Buktinya: segitiga OT₁P dan OT₂P adalah dua segitiga siku-siku yang KONGRUEN (OT₁ = OT₂ = r, OP bersama, sudut siku-siku di T).",
    ],
  },
  {
    id: "g5",
    label:
      "Untuk menghitung PANJANG GARIS SINGGUNG dari titik P di luar lingkaran, gunakan teorema …",
    kind: "fill",
    answers: ["pythagoras", "Pythagoras", "phitagoras"],
    discussion: [
      "Karena segitiga OTP siku-siku di T (sifat utama), gunakan Teorema Pythagoras.",
      "OP² = OT² + PT² → PT² = OP² − OT² → PT² = OP² − r².",
      "PT = √(OP² − r²).",
    ],
  },
  {
    id: "g6",
    label:
      "Diketahui jari-jari lingkaran 6 cm dan jarak P ke pusat O = 10 cm. Panjang garis singgung dari P adalah … cm.",
    kind: "fill",
    answers: ["8"],
    discussion: [
      "PT = √(OP² − r²) = √(10² − 6²) = √(100 − 36) = √64 = 8 cm.",
      "Triple Pythagoras 6-8-10 (kelipatan 2 dari 3-4-5).",
    ],
  },
  {
    id: "g7",
    label:
      "Diketahui jari-jari 5 cm dan panjang garis singgung dari P = 12 cm. Jarak P ke pusat O = … cm.",
    kind: "fill",
    answers: ["13"],
    discussion: [
      "OP² = r² + PT² = 5² + 12² = 25 + 144 = 169.",
      "OP = √169 = 13 cm.",
      "Triple Pythagoras 5-12-13.",
    ],
  },
  {
    id: "g8",
    label:
      "Garis singgung yang menyinggung DUA lingkaran sekaligus disebut garis singgung …",
    kind: "fill",
    answers: ["persekutuan"],
    discussion: [
      "Disebut garis singgung PERSEKUTUAN.",
      "Ada dua jenis: persekutuan LUAR (GSPL) dan persekutuan DALAM (GSPD).",
    ],
  },
  {
    id: "g9",
    label:
      "Garis singgung persekutuan LUAR (GSPL) adalah garis yang menyinggung dua lingkaran di sisi …",
    kind: "choice",
    options: [
      "berlawanan (menyilang)",
      "sama (tidak menyilang)",
      "atas saja",
      "bawah saja",
    ],
    correctIndex: 1,
    discussion: [
      "GSPL: kedua titik singgung berada di SISI SAMA dari kedua lingkaran (tidak menyilang).",
      "Contoh nyata: tali sabuk yang melilit dua roda di sisi sama.",
    ],
  },
  {
    id: "g10",
    label:
      "Rumus PANJANG garis singgung persekutuan LUAR (GSPL) jika jari-jari lingkaran R dan r (R > r), serta jarak antar pusat = d, adalah … (kuadratkan).",
    kind: "choice",
    options: [
      "L² = d² − (R − r)²",
      "L² = d² − (R + r)²",
      "L² = d² + (R − r)²",
      "L² = R² + r² − d²",
    ],
    correctIndex: 0,
    discussion: [
      "GSPL: L² = d² − (R − r)² → L = √(d² − (R − r)²).",
      "Jika r dan R sama, L = d (sama dengan jarak antar pusat).",
      "Catatan: gunakan SELISIH jari-jari (R − r) untuk GSPL.",
    ],
  },
  {
    id: "g11",
    label:
      "Rumus PANJANG garis singgung persekutuan DALAM (GSPD) jika jari-jari R dan r, jarak antar pusat = d, adalah … (kuadratkan).",
    kind: "choice",
    options: [
      "D² = d² − (R − r)²",
      "D² = d² − (R + r)²",
      "D² = d² + (R + r)²",
      "D² = (R + r)² − d²",
    ],
    correctIndex: 1,
    discussion: [
      "GSPD: D² = d² − (R + r)² → D = √(d² − (R + r)²).",
      "Catatan: gunakan JUMLAH jari-jari (R + r) untuk GSPD.",
      "Syarat agar ada GSPD: d > R + r (kedua lingkaran TIDAK saling berpotongan/bersinggungan).",
    ],
  },
  {
    id: "g12",
    label:
      "Dua lingkaran dengan jari-jari 8 cm dan 3 cm. Jarak antar pusat 13 cm. Panjang GSPL = … cm.",
    kind: "fill",
    answers: ["12"],
    discussion: [
      "L² = d² − (R − r)² = 13² − (8 − 3)² = 169 − 25 = 144.",
      "L = √144 = 12 cm.",
    ],
  },
  {
    id: "g13",
    label:
      "Dua lingkaran dengan jari-jari 4 cm dan 2 cm. Jarak antar pusat 10 cm. Panjang GSPD = … cm.",
    kind: "fill",
    answers: ["8"],
    discussion: [
      "D² = d² − (R + r)² = 10² − (4 + 2)² = 100 − 36 = 64.",
      "D = √64 = 8 cm.",
    ],
  },
  {
    id: "g14",
    label:
      "Pernyataan: Untuk GSPD, kedua titik singgung berada di sisi BERLAWANAN dari masing-masing lingkaran (sabuk menyilang).",
    kind: "truefalse",
    correctTrue: true,
    discussion: [
      "BENAR. GSPD = sabuk MENYILANG di antara dua lingkaran.",
      "Bayangkan tali yang membentuk huruf X di antara dua roda.",
    ],
  },
  {
    id: "g15",
    label:
      "Jodohkan istilah dengan rumusnya:",
    kind: "match",
    pairs: [
      { left: "Garis singgung dari titik P (jarak OP, jari-jari r)", right: "PT = √(OP² − r²)" },
      { left: "GSPL (jarak d, jari-jari R dan r)", right: "L = √(d² − (R − r)²)" },
      { left: "GSPD (jarak d, jari-jari R dan r)", right: "D = √(d² − (R + r)²)" },
      { left: "Sifat utama jari-jari & garis singgung", right: "saling tegak lurus (⊥)" },
    ],
    discussion: [
      "PT dari satu titik luar — gunakan Pythagoras pada segitiga OTP.",
      "GSPL — selisih jari-jari (R − r).",
      "GSPD — jumlah jari-jari (R + r).",
      "Sifat dasar: jari-jari ⊥ garis singgung di titik singgung.",
    ],
  },
  {
    id: "g16",
    label:
      "Urutkan langkah menghitung GSPL:",
    kind: "sort",
    items: [
      "Tarik akar pangkat dua untuk memperoleh L.",
      "Tuliskan rumus L² = d² − (R − r)².",
      "Hitung selisih jari-jari (R − r) lalu kuadratkan.",
      "Substitusikan nilai d², (R − r)², dan kurangkan.",
    ],
    correctOrder: [
      "Tuliskan rumus L² = d² − (R − r)².",
      "Hitung selisih jari-jari (R − r) lalu kuadratkan.",
      "Substitusikan nilai d², (R − r)², dan kurangkan.",
      "Tarik akar pangkat dua untuk memperoleh L.",
    ],
    discussion: [
      "Contoh: R = 9, r = 4, d = 13.",
      "Langkah 1: rumus L² = d² − (R − r)².",
      "Langkah 2: (R − r)² = (9 − 4)² = 25.",
      "Langkah 3: L² = 169 − 25 = 144.",
      "Langkah 4: L = √144 = 12 cm.",
    ],
  },
  {
    id: "g17",
    label:
      "Sebuah sabuk melilit MINIMAL dua roda dengan jari-jari sama. Panjang sabuk = … (R = jari-jari, d = jarak antar pusat).",
    kind: "choice",
    options: [
      "2d + 2πR (dua GSPL + setengah keliling tiap roda)",
      "πR + d",
      "2πR",
      "2(R + r)",
    ],
    correctIndex: 0,
    discussion: [
      "Sabuk minimal = 2 GSPL + 2 setengah lingkaran (½ keliling tiap roda).",
      "Karena R = r, GSPL = d. Setengah keliling tiap roda = πR. Ada dua roda, jadi total = 2πR.",
      "Total = 2d + 2πR.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Sifat Garis Singgung",
    body:
      "1) Menyentuh lingkaran TEPAT di satu titik.\n2) Jari-jari ke titik singgung selalu ⊥ garis singgung.\n3) Dari titik luar P, ada DUA garis singgung dengan PT₁ = PT₂.",
    color: "violet",
  },
  {
    title: "Panjang Garis Singgung",
    body:
      "Dari titik luar P: PT = √(OP² − r²) (Pythagoras).\nGSPL (sisi sama): L = √(d² − (R − r)²).\nGSPD (menyilang): D = √(d² − (R + r)²).",
    color: "cyan",
  },
  {
    title: "Sabuk Lilitan Minimal",
    body:
      "Untuk dua roda berjari-jari sama R dan jarak pusat d:\nPanjang sabuk = 2d + 2πR (dua GSPL + setengah keliling tiap roda).",
    color: "amber",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-rumus",
    title: "🎯 Game 1 — Cocokkan Soal dengan Rumus",
    description: "Seret setiap kasus ke RUMUS yang tepat untuk dipakai.",
    buckets: [
      { id: "satu", label: "PT dari 1 titik luar — PT² = OP² − r²", emoji: "📐", color: "violet" },
      { id: "gspl", label: "GSPL — L² = d² − (R − r)²", emoji: "↔️", color: "cyan" },
      { id: "gspd", label: "GSPD — D² = d² − (R + r)²", emoji: "❌", color: "rose" },
    ],
    items: [
      { id: "i1", label: "Titik P di luar lingkaran, r = 5, OP = 13. Cari PT.", bucketId: "satu", emoji: "📐" },
      { id: "i2", label: "Sabuk dua roda di sisi SAMA. R = 6, r = 2, d = 10.", bucketId: "gspl", emoji: "↔️" },
      { id: "i3", label: "Sabuk dua roda MENYILANG. R = 5, r = 3, d = 17.", bucketId: "gspd", emoji: "❌" },
      { id: "i4", label: "Lingkaran r = 9, jarak P ke O = 15. Cari PT.", bucketId: "satu", emoji: "📐" },
      { id: "i5", label: "Garis singgung luar dua lingkaran R = 8, r = 3, d = 13.", bucketId: "gspl", emoji: "↔️" },
      { id: "i6", label: "Garis singgung dalam dua lingkaran R = 4, r = 2, d = 10.", bucketId: "gspd", emoji: "❌" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-tangent-length",
    title: "🎯 Game 2 — Cari Panjang Garis Singgung",
    description: "Pasangkan setiap kasus dengan panjang garis singgungnya (cm).",
    rightOptions: ["6", "8", "12", "15", "20", "24"],
    pairs: [
      { id: "p1", left: "r = 6, OP = 10 → PT = ?", correctRight: "8", emoji: "📐" },
      { id: "p2", left: "r = 5, OP = 13 → PT = ?", correctRight: "12", emoji: "📐" },
      { id: "p3", left: "r = 8, OP = 17 → PT = ?", correctRight: "15", emoji: "📐" },
      { id: "p4", left: "r = 8, OP = 10 → PT = ?", correctRight: "6", emoji: "📐" },
      { id: "p5", left: "GSPL — R = 9, r = 4, d = 13 → L = ?", correctRight: "12", emoji: "↔️" },
      { id: "p6", left: "GSPD — R = 6, r = 2, d = 17 → D = ?", correctRight: "15", emoji: "❌" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    label:
      "Jari-jari sebuah lingkaran 9 cm dan jarak titik P ke pusat = 15 cm. Panjang garis singgung dari P = … cm.",
    kind: "fill",
    answers: ["12"],
    hint: "PT = √(OP² − r²).",
    discussion: [
      "PT² = 15² − 9² = 225 − 81 = 144.",
      "PT = √144 = 12 cm.",
      "Triple 9-12-15 (kelipatan 3 dari 3-4-5).",
    ],
  },
  {
    id: "p2",
    label:
      "Panjang garis singgung dari titik P = 24 cm dan jarak P ke pusat = 25 cm. Jari-jari lingkaran = … cm.",
    kind: "fill",
    answers: ["7"],
    hint: "r² = OP² − PT².",
    discussion: [
      "r² = 25² − 24² = 625 − 576 = 49.",
      "r = √49 = 7 cm.",
      "Triple 7-24-25.",
    ],
  },
  {
    id: "p3",
    label:
      "Dua lingkaran masing-masing berjari-jari 7 cm dan 2 cm. Jarak antar pusat 13 cm. Panjang GSPL = … cm.",
    kind: "fill",
    answers: ["12"],
    hint: "L² = d² − (R − r)².",
    discussion: [
      "L² = 13² − (7 − 2)² = 169 − 25 = 144.",
      "L = √144 = 12 cm.",
    ],
  },
  {
    id: "p4",
    label:
      "Dua lingkaran berjari-jari 6 cm dan 2 cm dengan jarak antar pusat 10 cm. Panjang GSPD = … cm.",
    kind: "fill",
    answers: ["6"],
    hint: "D² = d² − (R + r)².",
    discussion: [
      "D² = 10² − (6 + 2)² = 100 − 64 = 36.",
      "D = √36 = 6 cm.",
    ],
  },
  {
    id: "p5",
    label:
      "Dua lingkaran kongruen berjari-jari 7 cm dengan jarak antar pusat 24 cm. Panjang GSPL adalah … cm.",
    kind: "choice",
    options: ["7 cm", "17 cm", "24 cm", "25 cm"],
    correctIndex: 2,
    hint: "Karena R = r, suku (R − r)² = 0.",
    discussion: [
      "L² = d² − (R − r)² = 24² − 0² = 576.",
      "L = √576 = 24 cm.",
      "Untuk dua lingkaran kongruen, GSPL = jarak antar pusat.",
    ],
  },
  {
    id: "p6",
    label:
      "Panjang GSPL dua lingkaran adalah 12 cm. Jika jari-jarinya 8 cm dan 3 cm, jarak antar pusat = … cm.",
    kind: "fill",
    answers: ["13"],
    hint: "Balik rumus: d² = L² + (R − r)².",
    discussion: [
      "d² = L² + (R − r)² = 12² + (8 − 3)² = 144 + 25 = 169.",
      "d = √169 = 13 cm.",
    ],
  },
  {
    id: "p7",
    label:
      "Sebuah sabuk melilit dua roda kongruen berjari-jari 14 cm. Jarak antar pusat roda 50 cm. Panjang sabuk minimal = … cm. (π = 22/7)",
    kind: "fill",
    answers: ["188"],
    hint: "Panjang sabuk = 2d + 2πR.",
    discussion: [
      "Sabuk = 2 × GSPL + 2 × (½ keliling roda) = 2d + 2πR.",
      "= 2 × 50 + 2 × (22/7) × 14",
      "= 100 + 88 = 188 cm.",
    ],
  },
  {
    id: "p8",
    label:
      "Sebuah lingkaran berjari-jari 8 cm. Dari titik A di luar lingkaran ditarik dua garis singgung sehingga sudut OAT = 30°. Jarak A ke pusat O = … cm.",
    kind: "choice",
    options: ["8 cm", "16 cm", "8√2 cm", "8√3 cm"],
    correctIndex: 1,
    hint: "Pakai perbandingan sisi segitiga 30°-60°-90°.",
    discussion: [
      "Pada segitiga siku-siku OAT, ∠OAT = 30°, sisi r = OT = 8 (depan sudut 30°).",
      "Perbandingan 30°-60°-90° = 1 : √3 : 2.",
      "Hipotenusa OA = 2 × OT = 2 × 8 = 16 cm.",
    ],
  },
];

const GarisSinggungLingkaranLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab 9"
    title="Garis Singgung Lingkaran — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami konsep GARIS SINGGUNG LINGKARAN! Kamu akan menemukan sifat utamanya, menghitung panjang garis singgung dari titik luar, mengeksplorasi GSPL & GSPD, hingga menerapkannya pada masalah sabuk lilitan — sambil bermain dengan lingkaran interaktif yang bisa kamu seret!"
    situations={situations}
    guidedIntro="Kerjakan soal-soal berikut secara berurutan. Setiap jawabanmu akan menuntun pada konsep garis singgung lingkaran. Tekan 'Periksa Jawaban' di bawah untuk melihat pembahasan lengkap."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={
      <section className="rounded-3xl border border-violet-300/30 bg-gradient-to-br from-violet-500/10 via-cyan-500/10 to-emerald-500/10 p-5 md:p-6 shadow-[0_0_45px_rgba(167,139,250,0.18)]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🎮</span>
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-violet-200">
              Laboratorium Garis Singgung
            </h3>
            <p className="text-sm text-white/70">
              Seret titik P (ungu) di luar lingkaran — saksikan dua garis singgung muncul dan panjangnya dihitung otomatis dengan Teorema Pythagoras!
            </p>
          </div>
        </div>
        <GarisSinggungInteractive />
        <p className="mt-3 text-xs text-white/65 italic">
          💡 Tantangan: bentuk Triple Pythagoras 3-4-5, 5-12-13, atau 8-15-17 dengan menggeser P dan slider jari-jari!
        </p>
      </section>
    }
    games={games}
    practiceIntro="Kerjakan soal latihan untuk mengasah pemahamanmu tentang panjang garis singgung, GSPL, GSPD, dan penerapannya."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/garis-singgung-lingkaran"
    backLabel="Kembali ke Menu Garis Singgung Lingkaran"
    scoreMessages={{
      perfect: "🌟 Luar biasa, Sobat Numatik! Pemahaman Garis Singgung Lingkaran-mu sudah sempurna!",
      high: "👍 Bagus sekali! Periksa kembali bagian yang masih merah agar lebih mantap.",
      medium: "🚀 Sudah mulai paham. Ulangi penemuan terbimbing dan main lagi laboratorium garis singgungnya.",
      low: "💪 Tetap semangat! Mulai dari atas, ingat sifat ⊥ dan rumus PT² = OP² − r².",
    }}
  />
);

export default GarisSinggungLingkaranLKPDPage;
