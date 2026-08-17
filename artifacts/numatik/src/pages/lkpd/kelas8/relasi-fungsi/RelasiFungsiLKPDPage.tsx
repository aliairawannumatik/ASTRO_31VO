import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import FunctionMachineAnimation from "@/components/FunctionMachineAnimation";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Anak dan Hobi",
    visual: (
      <div className="rounded-xl bg-slate-900/60 p-4">
        <div className="grid grid-cols-3 items-center gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-center text-[11px] uppercase tracking-widest text-cyan-300/80 font-bold">
              Anak (A)
            </p>
            {["Andi", "Budi", "Cici", "Dimas"].map((n) => (
              <div
                key={n}
                className="rounded-lg border border-cyan-300/40 bg-cyan-500/15 px-3 py-2 text-center font-semibold text-white"
              >
                {n}
              </div>
            ))}
          </div>
          <svg viewBox="0 0 100 220" className="w-full">
            {[
              { y1: 30, y2: 30 },
              { y1: 30, y2: 90 },
              { y1: 75, y2: 30 },
              { y1: 120, y2: 150 },
              { y1: 165, y2: 90 },
              { y1: 165, y2: 210 },
            ].map((l, i) => (
              <line
                key={i}
                x1="0"
                y1={l.y1}
                x2="100"
                y2={l.y2}
                stroke="#facc15"
                strokeWidth="1.5"
                markerEnd="url(#arr1)"
                opacity="0.85"
              />
            ))}
            <defs>
              <marker id="arr1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0 0 L6 3 L0 6 Z" fill="#facc15" />
              </marker>
            </defs>
          </svg>
          <div className="space-y-2">
            <p className="text-center text-[11px] uppercase tracking-widest text-fuchsia-300/80 font-bold">
              Hobi (B)
            </p>
            {["Sepak bola", "Catur", "Renang", "Melukis"].map((n) => (
              <div
                key={n}
                className="rounded-lg border border-fuchsia-300/40 bg-fuchsia-500/15 px-3 py-2 text-center font-semibold text-white"
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    text:
      "Andi suka sepak bola dan catur. Budi suka sepak bola. Cici suka renang. Dimas suka catur dan melukis. Hubungan 'suka' antara himpunan ANAK dan himpunan HOBI inilah yang disebut RELASI. Perhatikan: satu anak boleh punya lebih dari satu hobi.",
  },
  {
    title: "Situasi 2 — Anak dan Berat Badan",
    visual: (
      <div className="rounded-xl bg-slate-900/60 p-4">
        <div className="grid grid-cols-3 items-center gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-center text-[11px] uppercase tracking-widest text-emerald-300/80 font-bold">
              Anak (A)
            </p>
            {["Andi", "Budi", "Cici", "Dimas"].map((n) => (
              <div
                key={n}
                className="rounded-lg border border-emerald-300/40 bg-emerald-500/15 px-3 py-2 text-center font-semibold text-white"
              >
                {n}
              </div>
            ))}
          </div>
          <svg viewBox="0 0 100 220" className="w-full">
            {[
              { y1: 30, y2: 30 },
              { y1: 75, y2: 90 },
              { y1: 120, y2: 30 },
              { y1: 165, y2: 150 },
            ].map((l, i) => (
              <line
                key={i}
                x1="0"
                y1={l.y1}
                x2="100"
                y2={l.y2}
                stroke="#22d3ee"
                strokeWidth="1.5"
                markerEnd="url(#arr2)"
              />
            ))}
            <defs>
              <marker id="arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0 0 L6 3 L0 6 Z" fill="#22d3ee" />
              </marker>
            </defs>
          </svg>
          <div className="space-y-2">
            <p className="text-center text-[11px] uppercase tracking-widest text-cyan-300/80 font-bold">
              Berat (B) kg
            </p>
            {["35", "40", "42", "50"].map((n) => (
              <div
                key={n}
                className="rounded-lg border border-cyan-300/40 bg-cyan-500/15 px-3 py-2 text-center font-mono font-semibold text-white"
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    text:
      "Andi 35 kg, Budi 40 kg, Cici 35 kg, Dimas 42 kg. Setiap anak HANYA punya SATU berat badan — tidak mungkin satu anak punya dua berat sekaligus. Relasi seperti ini, yang menghubungkan setiap anggota A dengan TEPAT SATU anggota B, disebut FUNGSI atau pemetaan.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Pada Situasi 1, hubungan antara himpunan A (Anak) dan B (Hobi) disebut … antara A dan B.",
    kind: "fill",
    answers: ["relasi"],
    discussion: [
      "Relasi adalah aturan yang menghubungkan anggota himpunan A dengan anggota himpunan B.",
      "Pada Situasi 1, relasinya adalah 'suka'.",
    ],
  },
  {
    id: "g2",
    label:
      "Manakah yang BUKAN cara menyajikan sebuah relasi?",
    kind: "choice",
    options: [
      "Diagram panah",
      "Diagram Kartesius",
      "Himpunan pasangan berurutan",
      "Diagram batang",
    ],
    correctIndex: 3,
    discussion: [
      "Tiga cara menyajikan relasi adalah: (1) Diagram panah, (2) Himpunan pasangan berurutan, (3) Diagram Kartesius.",
      "Diagram batang dipakai untuk statistik, BUKAN untuk relasi.",
    ],
  },
  {
    id: "g3",
    label:
      "Pasangan berurutan untuk Situasi 1 (Andi suka sepak bola dan catur, Budi suka sepak bola, Cici suka renang, Dimas suka catur dan melukis) ditulis sebagai {(Andi, Sepak bola), (Andi, Catur), (Budi, Sepak bola), (Cici, Renang), (Dimas, Catur), (Dimas, Melukis)}. Banyaknya pasangan berurutan adalah …",
    kind: "fill",
    answers: ["6"],
    discussion: [
      "Hitung tanda panah: Andi → 2, Budi → 1, Cici → 1, Dimas → 2. Total = 6 pasangan.",
    ],
  },
  {
    id: "g4",
    label:
      "Perhatikan Situasi 2 (Anak dan Berat Badan). Apakah relasi tersebut merupakan FUNGSI?",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Setiap anak (Andi, Budi, Cici, Dimas) punya TEPAT SATU berat badan.",
      "Tidak ada anak yang dipasangkan ke dua berat sekaligus → ini adalah FUNGSI.",
    ],
  },
  {
    id: "g5",
    label:
      "Apakah relasi pada Situasi 1 (Anak dan Hobi) merupakan FUNGSI?",
    kind: "truefalse",
    correct: false,
    discussion: [
      "Andi memiliki DUA hobi (sepak bola dan catur), Dimas juga DUA hobi.",
      "Karena ada anggota A yang dipasangkan dengan lebih dari satu anggota B, ini BUKAN fungsi.",
    ],
  },
  {
    id: "g6",
    label:
      "Lengkapi: Sebuah relasi dari A ke B disebut FUNGSI jika setiap anggota A dipasangkan dengan … anggota B.",
    kind: "choice",
    options: [
      "tepat satu",
      "boleh banyak",
      "paling sedikit dua",
      "tidak ada yang khusus",
    ],
    correctIndex: 0,
    discussion: [
      "Definisi fungsi: setiap anggota domain (A) dipasangkan dengan TEPAT SATU anggota kodomain (B).",
    ],
  },
  {
    id: "g7",
    label:
      "Pada fungsi f: A → B, himpunan A disebut DOMAIN, himpunan B disebut KODOMAIN, dan hasil pemetaan disebut …",
    kind: "fill",
    answers: ["range", "wilayah hasil", "daerah hasil"],
    discussion: [
      "Domain (daerah asal) = A.",
      "Kodomain (daerah kawan) = B.",
      "Range (daerah hasil) = anggota B yang DIPETAKAN dari A. Range adalah HIMPUNAN BAGIAN dari kodomain.",
    ],
  },
  {
    id: "g8",
    label:
      "Diketahui A = {p, q} dan B = {1, 2, 3}. Banyaknya fungsi yang mungkin dari A ke B adalah …",
    kind: "choice",
options: ["6", "8", "9", "12"],
  correctIndex: 2,
  discussion: [
  "Rumus banyak fungsi dari A ke B = n(B) pangkat n(A).",
  "n(B)^n(A) = 3² = 9.",
  "Setiap dari 2 anggota A punya 3 pilihan di B → 3 × 3 = 9.",
    ],
  },
  {
    id: "g9",
    label:
      "Diketahui A = {1, 2, 3} dan B = {a, b, c}. Banyaknya korespondensi SATU-SATU dari A ke B adalah …",
    kind: "fill",
    answers: ["6"],
    discussion: [
      "Korespondensi satu-satu hanya mungkin jika n(A) = n(B).",
      "Banyaknya = n! = n(A)! = 3! = 3 × 2 × 1 = 6.",
    ],
  },
  {
    id: "g10",
    label:
      "Pasangkan setiap istilah dengan rumus banyaknya yang benar (anggap n(A) = a dan n(B) = b).",
    kind: "match",
    pairs: [
      { left: "Banyak fungsi dari A ke B", right: "b pangkat a" },
      { left: "Banyak fungsi dari B ke A", right: "a pangkat b" },
      { left: "Banyak korespondensi satu-satu (jika a = b)", right: "a! (a faktorial)" },
      { left: "Banyak relasi dari A ke B", right: "2 pangkat (a × b)" },
    ],
    discussion: [
      "Banyak fungsi A → B = n(B)^n(A) = b^a.",
      "Banyak fungsi B → A = n(A)^n(B) = a^b.",
      "Korespondensi 1-1 hanya jika a = b, banyaknya = a!.",
      "Setiap pasangan boleh ada/tidak ada → 2^(a×b) relasi.",
    ],
  },
  {
    id: "g11",
    label:
      "Sebuah fungsi dinotasikan f: x → 2x + 1, atau ditulis f(x) = 2x + 1. Nilai f(3) adalah …",
    kind: "fill",
    answers: ["7"],
    discussion: [
      "Substitusi x = 3 ke f(x) = 2x + 1.",
      "f(3) = 2(3) + 1 = 6 + 1 = 7.",
    ],
  },
  {
    id: "g12",
    label:
      "Diketahui f(x) = 3x − 5. Nilai f(4) adalah …",
    kind: "fill",
    answers: ["7"],
    discussion: [
      "f(4) = 3(4) − 5 = 12 − 5 = 7.",
    ],
  },
  {
    id: "g13",
    label:
      "Diketahui f(x) = 2x − 1 dengan domain {1, 2, 3, 4}. Range fungsi tersebut adalah …",
    kind: "choice",
    options: [
      "{1, 2, 3, 4}",
      "{0, 1, 2, 3}",
      "{1, 3, 5, 7}",
      "{2, 4, 6, 8}",
    ],
    correctIndex: 2,
    discussion: [
      "f(1) = 2(1) − 1 = 1.",
      "f(2) = 2(2) − 1 = 3.",
      "f(3) = 2(3) − 1 = 5.",
      "f(4) = 2(4) − 1 = 7.",
      "Range = {1, 3, 5, 7}.",
    ],
  },
  {
    id: "g14",
    label:
      "Grafik fungsi f(x) = 2x + 1 berbentuk …",
    kind: "choice",
    options: [
      "Garis lurus",
      "Parabola",
      "Lingkaran",
      "Kurva eksponen",
    ],
    correctIndex: 0,
    discussion: [
      "f(x) = 2x + 1 adalah fungsi LINEAR (pangkat tertinggi x adalah 1).",
      "Grafik fungsi linear selalu berupa GARIS LURUS pada bidang Kartesius.",
    ],
  },
  {
    id: "g15",
    label:
      "Urutkan langkah menggambar grafik fungsi linear f(x) = x + 2 dari yang paling awal.",
    kind: "sort",
    items: [
      "Tentukan beberapa nilai x (misal: −2, −1, 0, 1, 2).",
      "Hitung nilai f(x) untuk setiap x.",
      "Tulis pasangan (x, f(x)) sebagai titik koordinat.",
      "Plot titik-titik tersebut pada bidang Kartesius.",
      "Hubungkan titik-titik dengan garis lurus.",
    ],
    correctOrder: [
      "Tentukan beberapa nilai x (misal: −2, −1, 0, 1, 2).",
      "Hitung nilai f(x) untuk setiap x.",
      "Tulis pasangan (x, f(x)) sebagai titik koordinat.",
      "Plot titik-titik tersebut pada bidang Kartesius.",
      "Hubungkan titik-titik dengan garis lurus.",
    ],
    discussion: [
      "Pilih nilai x dulu (biasanya −2 sampai 2 cukup).",
      "Substitusi ke rumus untuk dapat nilai y = f(x).",
      "Susun tabel pasangan (x, y).",
      "Plot setiap pasangan sebagai titik di bidang Kartesius.",
      "Hubungkan titik-titiknya — untuk fungsi linear akan terbentuk GARIS LURUS.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "🔗 Relasi vs Fungsi",
    text: "RELASI = aturan yang memasangkan anggota A dengan anggota B (boleh bebas). FUNGSI = relasi khusus di mana setiap anggota A dipasangkan dengan TEPAT SATU anggota B.",
    tone: "cyan",
  },
  {
    title: "📋 Tiga Cara Penyajian",
    text: "Relasi/fungsi dapat disajikan dalam: (1) Diagram panah, (2) Himpunan pasangan berurutan {(x, y)}, dan (3) Diagram Kartesius (titik-titik di bidang xy).",
    tone: "violet",
  },
  {
    title: "🔢 Banyaknya Fungsi",
    text: "Jika n(A) = a dan n(B) = b: banyak fungsi A → B = bᵃ. Banyak korespondensi 1-1 (hanya jika a = b) = a!. Banyak relasi dari A ke B = 2^(a·b).",
    tone: "yellow",
  },
  {
    title: "📝 Notasi Fungsi",
    text: "f: x → ax + b atau f(x) = ax + b. Untuk mencari nilai fungsi pada suatu titik, substitusikan nilai x ke dalam rumus. Contoh: f(x) = 2x + 1, maka f(3) = 7.",
    tone: "emerald",
  },
  {
    title: "📊 Daerah",
    text: "DOMAIN = daerah asal (himpunan A). KODOMAIN = daerah kawan (himpunan B). RANGE = daerah hasil = anggota B yang benar-benar dipasangkan dari A.",
    tone: "rose",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-fungsi-bukan",
    title: "🎯 Game 1 — Mana Fungsi, Mana BUKAN?",
    description:
      "Periksa setiap diagram/relasi di bawah, lalu seret ke kotak yang benar. Ingat: FUNGSI = setiap anggota A punya tepat SATU pasangan di B.",
    buckets: [
      { id: "fungsi", label: "✅ FUNGSI", emoji: "✓", color: "emerald" },
      { id: "bukan", label: "❌ BUKAN FUNGSI", emoji: "✗", color: "rose" },
    ],
    items: [
      { id: "i1", label: "{(1, a), (2, b), (3, c)}", bucketId: "fungsi", emoji: "📝" },
      { id: "i2", label: "{(1, a), (1, b), (2, c)}", bucketId: "bukan", emoji: "⚠️" },
      { id: "i3", label: "Setiap siswa → satu nomor absen", bucketId: "fungsi", emoji: "🎓" },
      { id: "i4", label: "Setiap siswa → semua mata pelajaran yang disukai", bucketId: "bukan", emoji: "📚" },
      { id: "i5", label: "{(2, 4), (3, 9), (4, 16)} (kuadrat)", bucketId: "fungsi", emoji: "🔢" },
      { id: "i6", label: "{(1, 5), (2, 6), (1, 7)} (1 berpasangan dua)", bucketId: "bukan", emoji: "⚠️" },
      { id: "i7", label: "Setiap orang → satu tanggal lahir", bucketId: "fungsi", emoji: "🎂" },
      { id: "i8", label: "Setiap kota → semua orang yang tinggal di sana", bucketId: "bukan", emoji: "🏙️" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-nilai-fungsi",
    title: "🎯 Game 2 — Hitung Nilai Fungsi",
    description:
      "Diketahui f(x) = 2x + 3. Jodohkan setiap nilai x di kiri dengan nilai f(x) yang benar di kanan.",
    rightOptions: ["1", "3", "5", "7", "9", "11", "13"],
    pairs: [
      { id: "n1", left: "f(−1)", correctRight: "1", emoji: "🟦" },
      { id: "n2", left: "f(0)", correctRight: "3", emoji: "🟪" },
      { id: "n3", left: "f(1)", correctRight: "5", emoji: "🟨" },
      { id: "n4", left: "f(2)", correctRight: "7", emoji: "🟩" },
      { id: "n5", left: "f(3)", correctRight: "9", emoji: "🟧" },
      { id: "n6", left: "f(5)", correctRight: "13", emoji: "🟫" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question:
      "Diketahui A = {1, 2, 3, 4} dan B = {a, b, c}. Banyaknya fungsi yang mungkin dari A ke B adalah …",
    kind: "fill",
    answers: ["81"],
    hint: "Gunakan rumus banyak fungsi A → B = n(B)^n(A).",
    discussion: [
      "n(A) = 4 dan n(B) = 3.",
      "Banyak fungsi = n(B)^n(A) = 3⁴ = 81.",
    ],
  },
  {
    id: "p2",
    question:
      "Diketahui f(x) = 3x + 2. Nilai f(−4) adalah …",
    kind: "fill",
    answers: ["-10", "−10"],
    hint: "Substitusi x = −4 ke rumus f(x).",
    discussion: [
      "f(−4) = 3(−4) + 2 = −12 + 2 = −10.",
    ],
  },
  {
    id: "p3",
    question:
      "Diketahui A = {p, q, r, s} dan B = {1, 2, 3, 4}. Banyaknya korespondensi satu-satu yang mungkin adalah …",
    kind: "fill",
    answers: ["24"],
    hint: "Karena n(A) = n(B), gunakan n!.",
    discussion: [
      "n(A) = n(B) = 4, jadi korespondensi satu-satu MUNGKIN.",
      "Banyaknya = 4! = 4 × 3 × 2 × 1 = 24.",
    ],
  },
  {
    id: "p4",
    question:
      "Pernyataan: 'Setiap fungsi pasti merupakan relasi.' Apakah benar?",
    kind: "truefalse",
    correct: true,
    hint: "Periksa definisi fungsi.",
    discussion: [
      "FUNGSI adalah relasi khusus yang setiap anggota domainnya dipasangkan tepat satu kali.",
      "Jadi semua fungsi adalah relasi, tetapi tidak semua relasi adalah fungsi. Pernyataan BENAR.",
    ],
  },
  {
    id: "p5",
    question:
      "Diketahui rumus fungsi f(x) = ax + b. Jika f(2) = 7 dan f(4) = 13, maka nilai a adalah …",
    kind: "choice",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
    hint: "Susun dua persamaan dari f(2) dan f(4), lalu kurangi.",
    discussion: [
      "f(2) = 2a + b = 7  …(i)",
      "f(4) = 4a + b = 13 …(ii)",
      "Kurangi (ii) − (i): 2a = 6 → a = 3.",
    ],
  },
  {
    id: "p6",
    question:
      "Pasangkan setiap fungsi dengan nilai f(2)-nya.",
    kind: "match",
    pairs: [
      { left: "f(x) = x + 5", right: "7" },
      { left: "f(x) = 2x − 1", right: "3" },
      { left: "f(x) = x²", right: "4" },
      { left: "f(x) = 3x + 4", right: "10" },
    ],
    hint: "Substitusi x = 2 ke setiap rumus.",
    discussion: [
      "f(x) = x + 5 → f(2) = 2 + 5 = 7.",
      "f(x) = 2x − 1 → f(2) = 4 − 1 = 3.",
      "f(x) = x² → f(2) = 4.",
      "f(x) = 3x + 4 → f(2) = 6 + 4 = 10.",
    ],
  },
  {
    id: "p7",
    question:
      "Diketahui f(x) = 2x + 1 dengan domain {0, 1, 2, 3}. Range fungsi tersebut adalah …",
    kind: "choice",
    options: [
      "{0, 1, 2, 3}",
      "{1, 2, 3, 4}",
      "{1, 3, 5, 7}",
      "{2, 4, 6, 8}",
    ],
    correctIndex: 2,
    hint: "Hitung f(0), f(1), f(2), f(3).",
    discussion: [
      "f(0) = 1, f(1) = 3, f(2) = 5, f(3) = 7.",
      "Range = {1, 3, 5, 7}.",
    ],
  },
  {
    id: "p8",
    question:
      "Sebuah fungsi linear melalui titik (1, 4) dan (3, 10). Rumus fungsinya adalah f(x) = …",
    kind: "choice",
    options: [
      "f(x) = 2x + 2",
      "f(x) = 3x + 1",
      "f(x) = x + 3",
      "f(x) = 4x",
    ],
    correctIndex: 1,
    hint: "Cek kedua titik dengan tiap pilihan.",
    discussion: [
      "Coba f(x) = 3x + 1: f(1) = 3 + 1 = 4 ✔ dan f(3) = 9 + 1 = 10 ✔.",
      "Jadi rumus fungsinya adalah f(x) = 3x + 1.",
    ],
  },
];

const RelasiFungsiLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab 2"
    title="Relasi dan Fungsi — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo menemukan sendiri perbedaan RELASI dan FUNGSI! Kamu akan belajar dari kisah anak dan hobinya, lalu masuk ke laboratorium MESIN FUNGSI yang bisa kamu jalankan sendiri — masukkan angka, lihat mesinnya berputar, dan saksikan hasilnya keluar!"
    situations={situations}
    guidedIntro="Kerjakan setiap soal secara berurutan. Jawabanmu akan membimbingmu menemukan konsep relasi, fungsi, korespondensi satu-satu, dan rumus fungsi. Tekan 'Periksa Jawaban' di bawah untuk melihat pembahasannya."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={
      <section className="mb-6 rounded-3xl border border-violet-300/30 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 p-5 md:p-7 backdrop-blur">
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-violet-500/15 px-4 py-2 text-xs font-bold text-violet-100">
            ⚙️ LABORATORIUM MESIN FUNGSI
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-3">
            B. Eksplorasi Mesin Fungsi
          </h2>
          <p className="text-sm text-white/70 font-body mt-2 max-w-2xl mx-auto">
            Bayangkan fungsi sebagai sebuah MESIN: kamu masukkan satu angka (input/domain),
            mesin memprosesnya dengan rumus, lalu mengeluarkan satu angka baru (output/kodomain).
            Pilih rumus, masukkan nilai x, tekan ▶ Jalankan Mesin, dan saksikan rodanya berputar
            sambil menampilkan langkah-langkah perhitungannya!
          </p>
        </div>
        <FunctionMachineAnimation />
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs font-body">
          <div className="rounded-xl border border-violet-200/20 bg-violet-500/10 p-3 text-white/80">
            <p className="font-bold text-violet-200 mb-1">🔍 Coba ini #1</p>
            <p>Pilih rumus 2x + 3 dan masukkan x = 5. Berapa hasilnya? Apakah sama dengan f(5) = 13?</p>
          </div>
          <div className="rounded-xl border border-fuchsia-200/20 bg-fuchsia-500/10 p-3 text-white/80">
            <p className="font-bold text-fuchsia-200 mb-1">🔍 Coba ini #2</p>
            <p>Pilih rumus x² − 1 dan coba x = −3. Apakah hasilnya 8? Mengapa bisa positif?</p>
          </div>
          <div className="rounded-xl border border-pink-200/20 bg-pink-500/10 p-3 text-white/80">
            <p className="font-bold text-pink-200 mb-1">🔍 Coba ini #3</p>
            <p>Bandingkan: jalankan rumus 3x − 5 dengan x = 4 dan x = 0. Mana yang lebih besar?</p>
          </div>
        </div>
      </section>
    }
    games={games}
    practiceIntro="Sekarang giliranmu menerapkan apa yang sudah kamu temukan. Gunakan mesin fungsi di atas untuk membantumu mengecek perhitungan jika ragu."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/relasi-dan-fungsi"
    backLabel="Kembali ke menu Relasi dan Fungsi"
    scoreMessages={{
      perfect: "Mantap, Sobat Numatik! Kamu sudah jago membedakan relasi, fungsi, dan menghitung nilai fungsi.",
      high: "Bagus sekali! Periksa kembali bagian yang masih merah agar makin mantap.",
      medium: "Sudah mulai paham. Ulangi penemuan terbimbing dan main-main lagi dengan mesin fungsinya.",
      low: "Tetap semangat! Mulai dari atas, ingat: fungsi = setiap x dipasangkan dengan TEPAT SATU y.",
    }}
  />
);

export default RelasiFungsiLKPDPage;
