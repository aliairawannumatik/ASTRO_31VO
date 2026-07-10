import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Perhatikan kumpulan berikut: 'Kumpulan hewan berkaki empat'. Apakah anggotanya dapat ditentukan dengan jelas? Tulis YA atau TIDAK.",
    kind: "fill",
    answers: ["ya", "Ya", "YA"],
    discussion: [
      "'Hewan berkaki empat' jelas batasannya — sapi (ya), ayam (tidak), kucing (ya).",
      "Karena anggotanya dapat ditentukan dengan jelas, kumpulan ini disebut HIMPUNAN.",
    ],
  },
  {
    id: "g2",
    label:
      "Kumpulan 'Siswa yang pandai' apakah termasuk himpunan?",
    kind: "truefalse",
    correct: false,
    discussion: [
      "Kata 'pandai' bersifat relatif — batas pandai berbeda menurut tiap orang.",
      "Karena anggotanya tidak dapat ditentukan secara pasti, ini BUKAN himpunan.",
    ],
  },
  {
    id: "g3",
    label:
      "Tuliskan dengan notasi tegak: A = himpunan bilangan asli kurang dari 5. Maka A = { … }",
    kind: "fill",
    answers: ["1,2,3,4", "{1,2,3,4}", "1, 2, 3, 4"],
    discussion: [
      "Bilangan asli kurang dari 5 adalah 1, 2, 3, 4.",
      "Jadi A = {1, 2, 3, 4}. Cara ini disebut metode tabular/roster (mendaftar).",
    ],
  },
  {
    id: "g4",
    label:
      "Lambang yang tepat untuk pernyataan '3 anggota A' adalah …",
    kind: "choice",
    options: ["3 ∈ A", "3 ∉ A", "3 ⊂ A", "3 ⊄ A"],
    correctIndex: 0,
    discussion: [
      "Lambang ∈ artinya 'anggota dari'.",
      "Lambang ∉ artinya 'bukan anggota dari'.",
      "Karena 3 termasuk dalam A = {1,2,3,4}, ditulis 3 ∈ A.",
    ],
  },
  {
    id: "g5",
    label:
      "Banyaknya anggota himpunan A = {1, 2, 3, 4} dilambangkan n(A). Maka n(A) = …",
    kind: "fill",
    answers: ["4"],
    discussion: [
      "n(A) menyatakan kardinalitas, yaitu banyak anggota A.",
      "A memiliki 4 anggota, jadi n(A) = 4.",
    ],
  },
  {
    id: "g6",
    label:
      "Pasangkan setiap himpunan dengan jenisnya berdasarkan banyak anggota dan kondisi khususnya.",
    kind: "match",
    pairs: [
      { left: "{ } atau ∅", right: "Himpunan kosong" },
      { left: "{1, 2, 3, …, 100}", right: "Himpunan berhingga" },
      { left: "{1, 2, 3, 4, …}", right: "Himpunan tak berhingga" },
      { left: "{x} dengan satu anggota", right: "Himpunan tunggal" },
    ],
    discussion: [
      "Himpunan kosong tidak punya anggota, ditulis { } atau ∅.",
      "Himpunan berhingga: jumlah anggotanya dapat dihitung selesai.",
      "Himpunan tak berhingga: jumlah anggotanya tidak terbatas.",
      "Himpunan tunggal: hanya memiliki satu anggota.",
    ],
  },
  {
    id: "g7",
    label:
      "Himpunan semesta dari A = {2, 4, 6, 8} dapat berupa …",
    kind: "choice",
    options: [
      "S = {bilangan asli}",
      "S = {bilangan ganjil}",
      "S = {bilangan prima}",
      "S = {0, 1}",
    ],
    correctIndex: 0,
    discussion: [
      "Himpunan semesta (S) adalah himpunan yang memuat semua anggota yang sedang dibicarakan.",
      "Karena 2, 4, 6, 8 semuanya bilangan asli, S = {bilangan asli} memuat semua anggota A.",
      "Pilihan lain tidak memuat 2, 4, 6, 8 sekaligus.",
    ],
  },
  {
    id: "g8",
    label:
      "Diberikan A = {1, 2, 3} dan B = {2, 3, 4, 5}. Anggota yang ada di A dan juga di B (irisan) adalah …",
    kind: "fill",
    answers: ["2,3", "{2,3}", "2, 3"],
    discussion: [
      "Irisan (A ∩ B) berisi anggota yang dimiliki KEDUA himpunan.",
      "Anggota A yang juga ada di B: 2 dan 3.",
      "Jadi A ∩ B = {2, 3}.",
    ],
  },
  {
    id: "g9",
    label:
      "Dengan A dan B di atas, gabungan (A ∪ B) berarti seluruh anggota A dan B tanpa pengulangan = …",
    kind: "fill",
    answers: ["1,2,3,4,5", "{1,2,3,4,5}", "1, 2, 3, 4, 5"],
    discussion: [
      "Gabungan (A ∪ B) berisi semua anggota dari A maupun B (anggota yang sama hanya ditulis sekali).",
      "Jadi A ∪ B = {1, 2, 3, 4, 5}.",
    ],
  },
  {
    id: "g10",
    label:
      "Selisih A − B berarti anggota A yang TIDAK ada di B. Untuk A = {1, 2, 3} dan B = {2, 3, 4, 5}, A − B = …",
    kind: "fill",
    answers: ["1", "{1}"],
    discussion: [
      "A − B berarti anggota A yang TIDAK termasuk dalam B.",
      "Anggota A: 1, 2, 3. Yang tidak ada di B: hanya 1.",
      "Jadi A − B = {1}.",
    ],
  },
  {
    id: "g11",
    label:
      "Jika S = {1,2,3,4,5,6,7,8,9,10} dan A = {2,4,6,8,10}, maka komplemen A (Aᶜ) berisi anggota S yang BUKAN anggota A, yaitu …",
    kind: "fill",
    answers: [
      "1,3,5,7,9",
      "{1,3,5,7,9}",
      "1, 3, 5, 7, 9",
    ],
    discussion: [
      "Komplemen Aᶜ berisi anggota S yang BUKAN anggota A.",
      "Anggota S yang tidak ada di A adalah 1, 3, 5, 7, 9.",
      "Jadi Aᶜ = {1, 3, 5, 7, 9}.",
    ],
  },
  {
    id: "g12",
    label:
      "Banyak himpunan bagian dari A = {a, b, c} adalah … (gunakan rumus 2ⁿ).",
    kind: "fill",
    answers: ["8"],
    discussion: [
      "Banyak himpunan bagian = 2ⁿ, dengan n = banyak anggota.",
      "n = 3, maka 2³ = 8 himpunan bagian.",
      "Daftarnya: { }, {a}, {b}, {c}, {a,b}, {a,c}, {b,c}, {a,b,c}.",
    ],
  },
  {
    id: "g13",
    label:
      "Urutkan langkah membuat diagram Venn untuk dua himpunan A dan B.",
    kind: "sort",
    items: [
      "Tuliskan anggota gabungan A ∪ B yang tersisa.",
      "Gambar persegi panjang sebagai semesta S.",
      "Tentukan anggota irisan A ∩ B dan letakkan di bagian tengah.",
      "Gambar dua lingkaran berpotongan untuk A dan B di dalam S.",
    ],
    correctOrder: [
      "Gambar persegi panjang sebagai semesta S.",
      "Gambar dua lingkaran berpotongan untuk A dan B di dalam S.",
      "Tentukan anggota irisan A ∩ B dan letakkan di bagian tengah.",
      "Tuliskan anggota gabungan A ∪ B yang tersisa.",
    ],
    discussion: [
      "Selalu mulai dengan persegi panjang sebagai semesta S.",
      "Lalu gambar lingkaran A dan B yang berpotongan.",
      "Letakkan irisan di tengah (dimiliki keduanya).",
      "Terakhir, isi bagian sisanya.",
    ],
  },
  {
    id: "g14",
    label:
      "Rumus dasar: n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Jika n(A)=15, n(B)=12, n(A ∩ B)=5, maka n(A ∪ B) = …",
    kind: "fill",
    answers: ["22"],
    discussion: [
      "Gunakan rumus inklusi-eksklusi: n(A ∪ B) = n(A) + n(B) − n(A ∩ B).",
      "n(A ∪ B) = 15 + 12 − 5 = 22.",
      "Pengurangan dilakukan agar anggota irisan tidak terhitung dua kali.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question:
      "Diketahui A = {bilangan prima kurang dari 12}. Tuliskan A dengan metode tabular!",
    kind: "fill",
    answers: [
      "2,3,5,7,11",
      "{2,3,5,7,11}",
      "2, 3, 5, 7, 11",
    ],
    hint: "Bilangan prima: 2, 3, 5, 7, 11, 13, ...",
    discussion: [
      "Bilangan prima kurang dari 12 adalah 2, 3, 5, 7, 11.",
      "Jadi A = {2, 3, 5, 7, 11}.",
    ],
  },
  {
    id: "p2",
    question:
      "Manakah pernyataan berikut yang BENAR untuk A = {1, 2, 3, 4, 5}?",
    kind: "choice",
    options: ["6 ∈ A", "0 ∈ A", "3 ∈ A", "5 ∉ A"],
    correctIndex: 2,
    hint: "Cek apakah angka tersebut benar-benar ada di A.",
    discussion: [
      "Anggota A adalah 1, 2, 3, 4, 5.",
      "3 termasuk anggota A, jadi 3 ∈ A bernilai BENAR.",
    ],
  },
  {
    id: "p3",
    question:
      "Sebuah kelas memiliki 30 siswa. 18 siswa suka basket, 14 siswa suka voli, dan 8 siswa suka keduanya. Berapa siswa yang suka basket SAJA?",
    kind: "fill",
    answers: ["10"],
    hint: "Suka basket saja = n(B) − n(B ∩ V).",
    discussion: [
      "Suka basket saja = 18 − 8 = 10 siswa.",
      "Pengurangan dilakukan agar siswa yang suka keduanya tidak ikut terhitung.",
    ],
  },
  {
    id: "p4",
    question:
      "Pada soal di atas, berapa siswa yang TIDAK suka kedua olahraga tersebut?",
    kind: "fill",
    answers: ["6"],
    hint: "Hitung dulu yang suka basket atau voli (n(B ∪ V)), lalu kurangkan dari total siswa.",
    discussion: [
      "n(B ∪ V) = n(B) + n(V) − n(B ∩ V) = 18 + 14 − 8 = 24.",
      "Yang tidak suka keduanya = 30 − 24 = 6 siswa.",
    ],
  },
  {
    id: "p5",
    question:
      "Benar atau salah: Banyak himpunan bagian dari himpunan dengan 5 anggota adalah 32.",
    kind: "truefalse",
    correct: true,
    hint: "Gunakan rumus 2ⁿ.",
    discussion: [
      "Rumus banyak himpunan bagian = 2ⁿ.",
      "Untuk n = 5, hasilnya 2⁵ = 32. Pernyataan BENAR.",
    ],
  },
  {
    id: "p6",
    question:
      "Diketahui A = {x | x bilangan asli, x < 8} dan B = {x | x bilangan ganjil, x < 10}. Tentukan A ∩ B!",
    kind: "fill",
    answers: [
      "1,3,5,7",
      "{1,3,5,7}",
      "1, 3, 5, 7",
    ],
    hint: "Tuliskan dulu A = {1,2,3,4,5,6,7} dan B = {1,3,5,7,9}, lalu cari yang sama.",
    discussion: [
      "A = {1, 2, 3, 4, 5, 6, 7} dan B = {1, 3, 5, 7, 9}.",
      "Anggota yang sama: 1, 3, 5, 7.",
      "Jadi A ∩ B = {1, 3, 5, 7}.",
    ],
  },
  {
    id: "p7",
    question:
      "Sebuah survei terhadap 50 orang: 30 menyukai teh, 25 menyukai kopi, dan 5 tidak menyukai keduanya. Berapa banyak orang yang menyukai TEH dan KOPI?",
    kind: "fill",
    answers: ["10"],
    hint: "n(T ∪ K) = 50 − 5 = 45. Lalu gunakan rumus inklusi-eksklusi.",
    discussion: [
      "Yang suka teh atau kopi = 50 − 5 = 45.",
      "n(T ∪ K) = n(T) + n(K) − n(T ∩ K).",
      "45 = 30 + 25 − n(T ∩ K) → n(T ∩ K) = 10.",
      "Jadi 10 orang menyukai keduanya.",
    ],
  },
  {
    id: "p8",
    question:
      "Manakah dari berikut yang merupakan HIMPUNAN KOSONG?",
    kind: "choice",
    options: [
      "Himpunan bilangan ganjil yang habis dibagi 2",
      "Himpunan bilangan asli kurang dari 1",
      "Himpunan segitiga dengan 3 sisi",
      "A dan B benar",
    ],
    correctIndex: 3,
    hint: "Cek satu per satu apakah ada anggotanya.",
    discussion: [
      "Bilangan ganjil tidak ada yang habis dibagi 2 → kosong.",
      "Bilangan asli mulai dari 1, jadi tidak ada yang kurang dari 1 → kosong.",
      "Setiap segitiga punya 3 sisi → bukan himpunan kosong.",
      "Jawaban yang tepat: A dan B benar.",
    ],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-jenis-himpunan",
    title: "🎯 Game 1: Klasifikasi Himpunan",
    description:
      "Pindahkan setiap himpunan ke kategori yang tepat: Berhingga, Tak Berhingga, atau Kosong.",
    buckets: [
      { id: "b-berhingga", label: "Berhingga", emoji: "🔢", color: "cyan" },
      { id: "b-takhingga", label: "Tak Berhingga", emoji: "♾️", color: "violet" },
      { id: "b-kosong", label: "Kosong", emoji: "⭕", color: "rose" },
    ],
    items: [
      { id: "h1", label: "{1, 2, 3, 4, 5}", bucketId: "b-berhingga" },
      { id: "h2", label: "{bilangan asli}", bucketId: "b-takhingga" },
      { id: "h3", label: "{ }", bucketId: "b-kosong" },
      { id: "h4", label: "{huruf vokal}", bucketId: "b-berhingga" },
      { id: "h5", label: "{bilangan bulat}", bucketId: "b-takhingga" },
      { id: "h6", label: "{x | x bilangan asli, x < 1}", bucketId: "b-kosong" },
      { id: "h7", label: "{nama hari}", bucketId: "b-berhingga" },
      { id: "h8", label: "{bilangan prima}", bucketId: "b-takhingga" },
      { id: "h9", label: "{segitiga bersisi 4}", bucketId: "b-kosong" },
    ],
  },
  {
    kind: "drag-match",
    id: "game-operasi-himpunan",
    title: "🧩 Game 2: Tebak Operasinya",
    description:
      "A = {1, 2, 3, 4} dan B = {3, 4, 5, 6}. Letakkan setiap hasil ke operasi yang sesuai.",
    buckets: [
      { id: "irisan", label: "A ∩ B", emoji: "🔗", color: "amber" },
      { id: "gabungan", label: "A ∪ B", emoji: "🤝", color: "emerald" },
      { id: "selisih", label: "A − B", emoji: "✂️", color: "rose" },
    ],
    items: [
      { id: "o1", label: "{3, 4}", bucketId: "irisan" },
      { id: "o2", label: "{1, 2, 3, 4, 5, 6}", bucketId: "gabungan" },
      { id: "o3", label: "{1, 2}", bucketId: "selisih" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-notasi-himpunan",
    title: "🔤 Game 3: Tebak Notasi yang Benar",
    description:
      "Gunakan tombol ◀ ▶ untuk memilih notasi yang sesuai dengan setiap pernyataan.",
    rightOptions: ["∈", "∉", "⊂", "∅", "∪", "∩"],
    pairs: [
      { id: "n1", left: "Lambang 'anggota dari'", correctRight: "∈", emoji: "✅" },
      { id: "n2", left: "Lambang 'bukan anggota'", correctRight: "∉", emoji: "❌" },
      { id: "n3", left: "Lambang 'himpunan bagian'", correctRight: "⊂", emoji: "📦" },
      { id: "n4", left: "Lambang 'himpunan kosong'", correctRight: "∅", emoji: "⭕" },
      { id: "n5", left: "Lambang 'gabungan'", correctRight: "∪", emoji: "🤝" },
      { id: "n6", left: "Lambang 'irisan'", correctRight: "∩", emoji: "🔗" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-banyak-anggota",
    title: "🧮 Game 4: Hitung Cepat n(A ∪ B)",
    description:
      "Gunakan rumus n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Pilih hasil yang tepat.",
    rightOptions: ["10", "12", "15", "18", "20", "24", "27", "30"],
    pairs: [
      { id: "k1", left: "n(A)=8, n(B)=6, n(A ∩ B)=2", correctRight: "12", emoji: "🧠" },
      { id: "k2", left: "n(A)=10, n(B)=12, n(A ∩ B)=4", correctRight: "18", emoji: "🚀" },
      { id: "k3", left: "n(A)=15, n(B)=15, n(A ∩ B)=10", correctRight: "20", emoji: "💡" },
      { id: "k4", left: "n(A)=20, n(B)=18, n(A ∩ B)=8", correctRight: "30", emoji: "🎯" },
    ],
  },
  {
    kind: "page-link",
    id: "game-arena-himpunan",
    title: "🚀 Game 5: Arena Himpunan Layar Penuh",
    description:
      "Buka mode permainan layar penuh dan tantang dirimu menjawab soal himpunan secepat mungkin!",
    path: "/math-game-arena/kelas-7/himpunan",
    buttonLabel: "MAINKAN DI MATH GAME ARENA",
    emoji: "🎮",
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi 1: Buah-buahan di Keranjang 🧺",
    visual: (
      <div className="text-center space-y-2">
        <div className="text-4xl">🍎🍌🍇🍊🍓</div>
        <p className="text-sm text-white/85 font-body">
          Semua benda di sini adalah <span className="font-bold text-yellow-300">buah</span>.
        </p>
        <p className="text-lg font-bold text-emerald-300">
          B = {"{apel, pisang, anggur, jeruk, stroberi}"}
        </p>
        <p className="text-sm text-white/70">
          Anggota dapat ditentukan dengan jelas → B adalah HIMPUNAN.
        </p>
      </div>
    ),
    text:
      "Himpunan adalah kumpulan benda atau objek yang anggotanya dapat ditentukan dengan jelas.",
  },
  {
    title: "Situasi 2: Diagram Venn Hobi Siswa 🎨",
    visual: (
      <div className="text-center space-y-2">
        <div className="relative mx-auto w-64 h-40">
          <div className="absolute inset-0 rounded-2xl border-2 border-white/30 bg-white/5">
            <span className="absolute top-1 left-2 text-[11px] font-bold text-white/70">S</span>
          </div>
          <div className="absolute left-3 top-6 w-32 h-28 rounded-full bg-cyan-400/30 border-2 border-cyan-300 flex items-center justify-center">
            <span className="text-cyan-100 font-display font-bold text-sm absolute top-2 left-3">A</span>
          </div>
          <div className="absolute right-3 top-6 w-32 h-28 rounded-full bg-fuchsia-400/30 border-2 border-fuchsia-300 flex items-center justify-center">
            <span className="text-fuchsia-100 font-display font-bold text-sm absolute top-2 right-3">B</span>
          </div>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-200 font-bold text-xs">
            A ∩ B
          </span>
        </div>
        <p className="text-sm text-white/80 font-body">
          Lingkaran A = pemain basket, lingkaran B = pemain voli. Bagian tengah adalah siswa
          yang menyukai <span className="font-bold text-yellow-300">keduanya</span>.
        </p>
      </div>
    ),
    text:
      "Diagram Venn membantu kita melihat hubungan antar himpunan: irisan (∩), gabungan (∪), dan komplemen.",
  },
  {
    title: "Situasi 3: Operasi Himpunan dalam Kehidupan 🍕",
    visual: (
      <div className="space-y-2">
        <p className="text-center text-2xl">🍕 🍔 🌭 🥗 🍩</p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl border border-cyan-300/40 bg-cyan-400/15 p-2">
            <p className="font-bold text-cyan-200">A ∩ B</p>
            <p className="text-white/80">disukai keduanya</p>
          </div>
          <div className="rounded-xl border border-emerald-300/40 bg-emerald-400/15 p-2">
            <p className="font-bold text-emerald-200">A ∪ B</p>
            <p className="text-white/80">disukai salah satu/keduanya</p>
          </div>
          <div className="rounded-xl border border-rose-300/40 bg-rose-400/15 p-2">
            <p className="font-bold text-rose-200">A − B</p>
            <p className="text-white/80">hanya disukai A</p>
          </div>
        </div>
      </div>
    ),
    text:
      "Operasi himpunan: irisan (∩), gabungan (∪), selisih (−), dan komplemen (ᶜ) sangat berguna untuk menganalisis data.",
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Notasi Penting",
    text: "∈ anggota, ∉ bukan anggota, ⊂ himpunan bagian, ∅ kosong, ∩ irisan, ∪ gabungan.",
    tone: "cyan",
  },
  {
    title: "Jenis Himpunan",
    text: "Berhingga, tak berhingga, kosong (∅), tunggal, sama, ekuivalen, semesta (S), bagian (⊂).",
    tone: "yellow",
  },
  {
    title: "Banyak Himpunan Bagian",
    text: "Untuk himpunan dengan n anggota, banyaknya himpunan bagian = 2ⁿ.",
    tone: "violet",
  },
  {
    title: "Operasi Himpunan",
    text: "A ∩ B (anggota bersama), A ∪ B (semua anggota), A − B (anggota A saja), Aᶜ (bukan A).",
    tone: "emerald",
  },
  {
    title: "Rumus Inklusi-Eksklusi",
    text: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Untuk soal cerita: total = n(A ∪ B) + yang tidak keduanya.",
    tone: "rose",
  },
];

const HimpunanLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Himpunan • Kelas 7 (Pengayaan)"
    title="🎯 Himpunan: Petualangan Konsep, Notasi, dan Operasi"
    intro="Sobat Numatik, ayo kita berpetualang menemukan konsep HIMPUNAN! Kamu akan belajar mengenali himpunan, menulis dengan notasi, mengenal jenis-jenisnya, sampai menyelesaikan operasi himpunan menggunakan diagram Venn — sambil bermain game seru!"
    situations={situations}
    guidedIntro="Lengkapi setiap langkah penemuan terbimbing berikut. Variasi soal: isian, pilihan, benar/salah, mencocokkan, dan menyusun urutan langkah."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Sekarang giliranmu menerapkan konsep himpunan pada soal kontekstual yang beragam!"
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7"
    backLabel="Kembali ke menu LKPD Kelas 7"
    scoreMessages={{
      perfect:
        "Luar biasa! Konsep himpunan, notasi, jenis, diagram Venn, dan operasinya sudah kamu kuasai dengan sempurna! ✨",
      high: "Hebat! Pemahamanmu sudah kuat. Periksa kembali bagian yang masih merah agar makin mantap.",
      medium:
        "Kamu sudah mulai memahami. Baca lagi penemuan terbimbing dan rumusnya, lalu coba perbaiki jawaban yang belum tepat.",
      low: "Tetap semangat, Sobat Numatik! Pelan-pelan ikuti langkah dari konsep, notasi, sampai operasi himpunan. Kamu pasti bisa!",
    }}
  />
);

export default HimpunanLKPDPage;
