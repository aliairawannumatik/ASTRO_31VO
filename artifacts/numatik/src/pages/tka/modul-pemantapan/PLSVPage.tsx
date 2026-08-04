import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";
import { BlockMath, InlineMath } from "react-katex";

const materiSections: MateriSection[] = [
  { heading: "A. Persamaan Linear Satu Variabel (PLSV)", content: `Persamaan linear satu variabel adalah kalimat matematika terbuka yang hanya memuat satu variabel dan berpangkat satu.\n\nBentuk umum: $ax + b = 0$, dengan $a \\neq 0$, $x$ variabel, $a$ koefisien, $b$ konstanta.\n\nSifat-sifat kesetaraan persamaan:\n1. Kedua ruas ditambah/dikurang bilangan yang sama.\n2. Kedua ruas dikali/dibagi bilangan yang sama (bukan nol).` },
  { heading: "B. Pertidaksamaan Linear Satu Variabel (PtLSV)", content: `PtLSV adalah kalimat matematika terbuka yang menggunakan tanda ketidaksamaan: $<$, $>$, $\\leq$, $\\geq$.\n\nBentuk umum: $ax + b < 0$, $ax + b > 0$, $ax + b \\leq 0$, $ax + b \\geq 0$, dengan $a \\neq 0$.\n\nHimpunan penyelesaian PtLSV dapat digambarkan pada garis bilangan.\n\nPerhatikan: jika kedua ruas dikalikan atau dibagi dengan bilangan negatif, tanda ketidaksamaan harus dibalik.` },
  {
    heading: "C. Metode Penyelesaian",
    content: `Langkah-langkah menyelesaikan PLSV/PtLSV:\n1. Kumpulkan suku yang memuat variabel di ruas kiri.\n2. Kumpulkan konstanta di ruas kanan.\n3. Sederhanakan hingga bentuk $ax = b$ atau $ax$ (tanda) $b$.\n4. Bagi kedua ruas dengan koefisien $a$.\n5. Untuk PtLSV: perhatikan arah tanda ketidaksamaan bila mengalikan/membagi bilangan negatif.`,
    jsxAfter: (
      <div className="mt-4 space-y-4">
        {/* ── Aturan Pembalikan Tanda ── */}
        <div className="rounded-xl overflow-hidden border border-rose-500/40"
          style={{ background: "linear-gradient(135deg, rgba(244,63,94,0.12), rgba(15,12,41,0.95))" }}>
          <div className="px-4 py-3 flex items-center gap-2 border-b border-rose-500/20"
            style={{ background: "rgba(244,63,94,0.15)" }}>
            <span className="text-base">⚠️</span>
            <span className="font-display text-xs font-bold text-rose-300 tracking-wide uppercase">
              Aturan Penting — Pembalikan Tanda Pertidaksamaan
            </span>
          </div>
          <div className="px-4 py-3">
            <p className="font-body text-sm text-white/80 leading-relaxed mb-3">
              Jika kedua ruas pertidaksamaan <strong className="text-rose-300">dikalikan</strong> atau{" "}
              <strong className="text-rose-300">dibagi</strong> dengan bilangan{" "}
              <strong className="text-rose-300">NEGATIF</strong>, maka tanda pertidaksamaan harus{" "}
              <strong className="text-yellow-300">DIBALIK</strong>.
            </p>

            {/* Symbol flip table */}
            <div className="rounded-xl overflow-hidden border border-white/10 mb-3">
              <div className="grid grid-cols-3 border-b border-white/10 text-center"
                style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="py-2 text-[10px] font-bold font-display text-white/50 uppercase tracking-widest">Tanda Asal</div>
                <div className="py-2 text-[10px] font-bold font-display text-yellow-400/70 uppercase tracking-widest border-x border-white/10">Perubahan</div>
                <div className="py-2 text-[10px] font-bold font-display text-white/50 uppercase tracking-widest">Tanda Baru</div>
              </div>
              {[
                { from: "<", arrow: "→", to: ">" },
                { from: ">", arrow: "→", to: "<" },
                { from: "\\leq", arrow: "→", to: "\\geq" },
                { from: "\\geq", arrow: "→", to: "\\leq" },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-3 text-center items-center ${i < 3 ? "border-b border-white/8" : ""}`}
                  style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <div className="py-3 text-lg font-bold text-sky-300">
                    <InlineMath math={row.from} />
                  </div>
                  <div className="py-3 border-x border-white/10">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-yellow-300"
                      style={{ background: "rgba(234,179,8,0.18)", border: "1px solid rgba(234,179,8,0.35)" }}>
                      ×(−)
                    </span>
                  </div>
                  <div className="py-3 text-lg font-bold text-rose-300">
                    <InlineMath math={row.to} />
                  </div>
                </div>
              ))}
            </div>

            {/* Example */}
            <div className="rounded-xl border border-emerald-500/30 overflow-hidden"
              style={{ background: "rgba(16,185,129,0.07)" }}>
              <div className="px-4 py-2 border-b border-emerald-500/20 flex items-center gap-2">
                <span className="text-xs font-bold font-display text-emerald-400">📌 Contoh Penerapan</span>
              </div>
              <div className="px-4 py-3 space-y-2 font-body text-sm text-white/80">
                <p>Selesaikan: <InlineMath math="-2x \geq 24" /></p>
                <div className="bg-slate-900/60 rounded-lg p-3 text-center space-y-1">
                  <BlockMath math="-2x \geq 24" />
                  <p className="text-xs text-yellow-300/80 font-body">
                    ÷ (−2) kedua ruas → tanda <InlineMath math="\geq" /> berubah menjadi <InlineMath math="\leq" />
                  </p>
                  <BlockMath math="x \leq -12" />
                </div>
                <p className="text-xs text-white/50">
                  Jika dibagi <strong className="text-rose-300">+2</strong> (positif): tanda tetap.{" "}
                  Jika dibagi <strong className="text-rose-300">−2</strong> (negatif): tanda <strong className="text-yellow-300">dibalik</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  { heading: "D. Memodelkan Masalah", content: `Soal cerita dapat dimodelkan ke dalam PLSV/PtLSV:\n1. Tetapkan variabel untuk besaran yang dicari.\n2. Ubah kalimat soal menjadi kalimat matematika.\n3. Selesaikan persamaan atau pertidaksamaan.\n4. Periksa jawaban dengan mensubstitusi kembali.` },
];

const contohSoal: LatihanSoal[] = [
  {
    no: 1,
    type: "pg",
    soal: "Apabila $x$ merupakan penyelesaian dari persamaan $4x - 5 = 2x + 11$, berapakah nilai dari $x + 4$?",
    options: ["A. $2$", "B. $8$", "C. $12$", "D. $15$"],
    jawaban: "C",
    pembahasan: "Kelompokkan suku berpangkat/bervariabel dan konstanta pada ruas yang berbeda:\n$4x - 5 = 2x + 11$\n$4x - 2x = 11 + 5$\n$2x = 16$\nKalikan kedua ruas dengan $\\frac{1}{2}$ untuk mendapatkan nilai $x$:\n$x = 8$\nTentukan nilai $x + 4$:\n$x + 4 = 8 + 4 = 12$\nJawaban: C",
  },
  {
    no: 2,
    type: "pg",
    soal: "Tentukan himpunan penyelesaian dari pertidaksamaan $6x - 4 \\ge 20 + 8x$, di mana $x$ adalah anggota bilangan bulat!",
    options: [
      "A. $\\{\\dots, -15, -14, -13\\}$",
      "B. $\\{\\dots, -14, -13, -12\\}$",
      "C. $\\{\\dots, -14, -13, -12, -11\\}$",
      "D. $\\{-11, -10, -9, \\dots\\}$",
    ],
    jawaban: "A",
    pembahasan: "Pindahkan variabel ke ruas kiri dan konstanta ke ruas kanan:\n$6x - 4 \\ge 20 + 8x$\n$6x - 8x \\ge 20 + 4$\n$-2x \\ge 24$\nBagi kedua ruas dengan $-2$ (ingat: tanda pertidaksamaan akan berbalik jika dibagi/dikalikan bilangan negatif):\n$x \\le -12$\nAnggota himpunan penyelesaian untuk $x \\le -12$ adalah $\\{\\dots, -15, -14, -13, -12\\}$.\nJawaban: A",
  },
  {
    no: 3,
    type: "pgkbs",
    soal: "Sebuah kebun berbentuk persegi panjang memiliki ukuran panjang $(4x + 3)\\text{ cm}$ dan lebar $(2x - 1)\\text{ cm}$. Jika keliling kebun tersebut diketahui $76\\text{ cm}$, beri tanda centang ($\\checkmark$) pada pernyataan yang bernilai benar!",
    pernyataan: [
      "Panjang kebun tersebut adalah $27\\text{ cm}$.",
      "Lebar kebun tersebut adalah $11\\text{ cm}$.",
      "Selisih antara panjang dan lebar kebun adalah $16\\text{ cm}$.",
      "Luas kebun tersebut adalah $297\\text{ cm}^2$.",
    ],
    jawabanBS: ["B", "B", "B", "B"],
    pembahasan: "Mencari nilai $x$ melalui rumus keliling:\n$K = 2 \\times (p + l)$\n$76 = 2 \\times \\big((4x + 3) + (2x - 1)\\big)$\n$76 = 2 \\times (6x + 2)$\n$76 = 12x + 4$\n$12x = 72 \\implies x = 6$\nPanjang: $p = 4(6) + 3 = 27\\text{ cm}$ → BENAR\nLebar: $l = 2(6) - 1 = 11\\text{ cm}$ → BENAR\nSelisih: $p - l = 27 - 11 = 16\\text{ cm}$ → BENAR\nLuas: $L = 27 \\times 11 = 297\\text{ cm}^2$ → BENAR\nSemua pernyataan BENAR.",
  },
  {
    no: 4,
    type: "pgkbs",
    soal: "Pak Budi mempunyai sebidang tanah berbentuk belah ketupat dengan panjang diagonal masing-masing $(2x + 6)\\text{ meter}$ dan $(4x - 10)\\text{ meter}$. Di sekeliling tanah tersebut akan dipasangi tiang pancang dengan jarak antartiang $1\\text{ meter}$. Selanjutnya, tanah dibagi menjadi 4 bagian sama besar. Tentukan apakah pernyataan berikut Benar atau Salah!",
    pernyataan: [
      "Panjang diagonal tanah tersebut adalah $22\\text{ meter}$.",
      "Jumlah tiang pancang yang dibutuhkan adalah $53$ buah.",
      "Luas setiap bagian tanah yang telah dibagi adalah $121\\text{ m}^2$.",
    ],
    jawabanBS: ["B", "S", "S"],
    pembahasan: "Karena kedua diagonal belah ketupat nilainya sama:\n$2x + 6 = 4x - 10$\n$2x = 16 \\implies x = 8$\nDiagonal: $2(8) + 6 = 22\\text{ m}$ → BENAR\nKeliling: $s = \\sqrt{11^2 + 11^2} = \\sqrt{242} \\approx 15{,}55\\text{ m}$, Keliling $\\approx 62{,}2$ → tiang $\\approx 62$ buah, bukan 53 → SALAH\nLuas total $= \\frac{22 \\times 22}{2} = 242\\text{ m}^2$, Luas per bagian $= \\frac{242}{4} = 60{,}5\\text{ m}^2$, bukan $121\\text{ m}^2$ → SALAH",
  },
  {
    no: 5,
    type: "pg",
    soal: "Tentukan himpunan penyelesaian dari pertidaksamaan $\\dfrac{1}{3}x - 3 > \\dfrac{3}{5}x + 5$!",
    options: ["A. $x < -30$", "B. $x < -20$", "C. $x > -30$", "D. $x > -20$"],
    jawaban: "A",
    pembahasan: "Kelompokkan variabel dan konstanta:\n$\\frac{1}{3}x - \\frac{3}{5}x > 5 + 3$\nSamakan penyebut ruas kiri:\n$\\left(\\frac{5 - 9}{15}\\right)x > 8$\n$-\\frac{4}{15}x > 8$\nKalikan kedua ruas dengan $-\\frac{15}{4}$ (tanda pertidaksamaan dibalik):\n$x < 8 \\times \\left(-\\frac{15}{4}\\right)$\n$x < -30$\nJawaban: A",
  },
];

const latihanDasar: LatihanSoal[] = [
  // ── No. 1 — PG ──────────────────────────────────────────────────────────────
  {
    no: 1, type: "pg",
    soal: "Jika $p$ merupakan penyelesaian dari $6(2x + 5) = 3(3x - 2) + 6$, maka nilai $p + 2$ adalah ...",
    options: ["A. $-4$", "B. $-6$", "C. $-8$", "D. $-10$"],
    jawaban: "C",
    pembahasan: "Uraikan kedua ruas:\n$12x + 30 = 9x - 6 + 6$\n$12x + 30 = 9x$\n$3x = -30$\n$x = p = -10$\n$p + 2 = -10 + 2 = -8$ → Jawaban C",
  },

  // ── No. 2 — PGK ─────────────────────────────────────────────────────────────
  {
    no: 2, type: "pgk",
    soal: "Perhatikan pertidaksamaan $6x - 4 \\geq 20 + 8x$. Pernyataan-pernyataan berikut berkaitan dengan penyelesaiannya.",
    pernyataan: [
      "Setelah pengelompokan suku, diperoleh $-2x \\geq 24$.",
      "Ketika membagi kedua ruas dengan $-2$, tanda pertidaksamaan harus dibalik menjadi $x \\leq -12$.",
      "Nilai $x = -12$ memenuhi pertidaksamaan tersebut.",
      "Nilai $x = -11$ termasuk dalam himpunan penyelesaian.",
    ],
    options: [
      "A. 1 dan 2",
      "B. 1 dan 4",
      "C. 2 dan 4",
      "D. 1, 2, dan 3",
    ],
    jawaban: "D",
    pembahasan: "Langkah penyelesaian:\n$6x - 4 \\geq 20 + 8x$\n$6x - 8x \\geq 20 + 4$\n$-2x \\geq 24$ → Pernyataan (1) BENAR\nBagi dengan $-2$ (negatif) → tanda dibalik: $x \\leq -12$ → Pernyataan (2) BENAR\nCek $x = -12$: $6(-12)-4 = -76$; $20+8(-12) = -76$. $-76 \\geq -76$ ✓ → Pernyataan (3) BENAR\nCek $x = -11$: $-11 > -12$, tidak memenuhi $x \\leq -12$ → Pernyataan (4) SALAH\nBenar: 1, 2, dan 3 → Jawaban D",
  },

  // ── No. 3 — PGKBS ───────────────────────────────────────────────────────────
  {
    no: 3, type: "pgkbs",
    soal: "Diketahui persamaan $\\dfrac{1}{2}(x - 10) = 2x - 5$. Tentukan kebenaran setiap pernyataan berikut!",
    pernyataan: [
      "Mengalikan kedua ruas dengan 2 menghasilkan $x - 10 = 4x - 10$.",
      "Penyelesaian persamaan tersebut adalah $x = 0$.",
      "Nilai $x = 2$ juga memenuhi persamaan tersebut.",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Kalikan kedua ruas dengan 2:\n$x - 10 = 4x - 10$ → Pernyataan (1) BENAR\nSederhanakan: $x - 4x = -10 + 10$ → $-3x = 0$ → $x = 0$ → Pernyataan (2) BENAR\nUji $x = 2$: $\\frac{1}{2}(2-10) = -4$; $2(2)-5 = -1$. $-4 \\neq -1$ → Pernyataan (3) SALAH",
  },

  // ── No. 4 — PG ──────────────────────────────────────────────────────────────
  {
    no: 4, type: "pg",
    soal: "Persamaan $5(2x - 3) + 4 = 2(3x + 1) - (-3)$ mempunyai penyelesaian $n$. Nilai dari $3n + 5$ adalah ...",
    options: ["A. $4$", "B. $7$", "C. $13$", "D. $17$"],
    jawaban: "D",
    pembahasan: "$10x - 15 + 4 = 6x + 2 + 3$\n$10x - 11 = 6x + 5$\n$4x = 16 \\Rightarrow x = n = 4$\n$3n + 5 = 12 + 5 = 17$ → Jawaban D",
  },

  // ── No. 5 — PGK ─────────────────────────────────────────────────────────────
  {
    no: 5, type: "pgk",
    soal: "Diberikan persamaan $\\dfrac{1}{2}(x - 6) = 2 + 3x$. Pernyataan-pernyataan di bawah ini berkaitan dengan penyelesaiannya.",
    pernyataan: [
      "Mengalikan kedua ruas dengan 2 menghasilkan $x - 6 = 4 + 6x$.",
      "Koefisien $x$ setelah pengelompokan suku adalah $-5$.",
      "Penyelesaian persamaan adalah $x = -2$.",
      "Nilai $x + 5 = -7$ untuk nilai $x$ yang diperoleh.",
    ],
    options: [
      "A. 1 dan 4",
      "B. 2 dan 4",
      "C. 1, 2, dan 3",
      "D. 2, 3, dan 4",
    ],
    jawaban: "C",
    pembahasan: "Kalikan 2: $x - 6 = 4 + 6x$ → Pernyataan (1) BENAR\nKelompokkan: $x - 6x = 4 + 6$ → $-5x = 10$ → koefisien $-5$ → Pernyataan (2) BENAR\n$x = -2$ → Pernyataan (3) BENAR\n$x + 5 = -2 + 5 = 3 \\neq -7$ → Pernyataan (4) SALAH\nBenar: 1, 2, dan 3 → Jawaban C",
  },

  // ── No. 6 — PGKBS ───────────────────────────────────────────────────────────
  {
    no: 6, type: "pgkbs",
    soal: "Diketahui persamaan $\\dfrac{4x + 5}{2x + 1} = \\dfrac{16}{5}$. Tentukan kebenaran setiap pernyataan berikut!",
    pernyataan: [
      "Dengan perkalian silang diperoleh $5(4x + 5) = 16(2x + 1)$.",
      "Penyelesaian persamaan tersebut adalah $x = \\dfrac{3}{4}$.",
      "Nilai $4x + 5 = 7$ untuk nilai $x$ yang diperoleh.",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Perkalian silang: $5(4x+5) = 16(2x+1)$ → Pernyataan (1) BENAR\n$20x + 25 = 32x + 16$\n$-12x = -9 \\Rightarrow x = \\dfrac{3}{4}$ → Pernyataan (2) BENAR\nUji: $4 \\times \\frac{3}{4} + 5 = 3 + 5 = 8 \\neq 7$ → Pernyataan (3) SALAH",
  },

  // ── No. 7 — PG ──────────────────────────────────────────────────────────────
  {
    no: 7, type: "pg",
    soal: "Jika $\\dfrac{4}{x - 3} = \\dfrac{2}{x + 1}$, maka nilai $x$ yang memenuhi adalah ...",
    options: ["A. $-5$", "B. $-4$", "C. $-2$", "D. $5$"],
    jawaban: "A",
    pembahasan: "Perkalian silang:\n$4(x + 1) = 2(x - 3)$\n$4x + 4 = 2x - 6$\n$2x = -10 \\Rightarrow x = -5$ → Jawaban A",
  },

  // ── No. 8 — PGK ─────────────────────────────────────────────────────────────
  {
    no: 8, type: "pgk",
    soal: "Perhatikan persamaan $\\dfrac{x + 3}{2} - \\dfrac{x - 1}{4} = 3$. Pernyataan-pernyataan berikut berkaitan dengan penyelesaiannya.",
    pernyataan: [
      "KPK dari penyebut 2 dan 4 pada persamaan tersebut adalah 4.",
      "Setelah mengalikan dengan KPK, diperoleh $2(x + 3) - (x - 1) = 12$.",
      "Penyelesaian persamaan tersebut adalah $x = 5$.",
      "Nilai $\\dfrac{x - 1}{4}$ untuk nilai $x$ yang diperoleh adalah 2.",
    ],
    options: [
      "A. 1 dan 4",
      "B. 2 dan 4",
      "C. 1, 2, dan 3",
      "D. 2, 3, dan 4",
    ],
    jawaban: "C",
    pembahasan: "KPK(2, 4) = 4 → Pernyataan (1) BENAR\nKalikan 4: $2(x+3) - (x-1) = 12$ → Pernyataan (2) BENAR\n$2x + 6 - x + 1 = 12 \\Rightarrow x + 7 = 12 \\Rightarrow x = 5$ → Pernyataan (3) BENAR\n$\\frac{5-1}{4} = \\frac{4}{4} = 1 \\neq 2$ → Pernyataan (4) SALAH\nBenar: 1, 2, dan 3 → Jawaban C",
  },

  // ── No. 9 — PGKBS ───────────────────────────────────────────────────────────
  {
    no: 9, type: "pgkbs",
    soal: "Diketahui pertidaksamaan $3(2x + 4) \\leq 2(x - 2)$, dengan $x$ bilangan bulat. Tentukan kebenaran setiap pernyataan berikut!",
    pernyataan: [
      "Penyelesaian pertidaksamaan adalah $x \\leq -4$.",
      "Nilai $x = -3$ memenuhi pertidaksamaan tersebut.",
      "Himpunan penyelesaian untuk bilangan bulat adalah $\\{\\ldots, -6, -5, -4\\}$.",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan: "$6x + 12 \\leq 2x - 4$\n$4x \\leq -16 \\Rightarrow x \\leq -4$ → Pernyataan (1) BENAR\nUji $x = -3$: $-3 > -4$, tidak memenuhi → Pernyataan (2) SALAH\nHP bilangan bulat: $\\{\\ldots, -6, -5, -4\\}$ → Pernyataan (3) BENAR",
  },

  // ── No. 10 — PG ─────────────────────────────────────────────────────────────
  {
    no: 10, type: "pg",
    soal: "Himpunan penyelesaian dari $2x - 3 \\geq 21 + 4x$ dengan $x$ bilangan bulat adalah ...",
    options: [
      "A. $\\{-12, -11, -10, \\ldots\\}$",
      "B. $\\{\\ldots, -14, -13, -12\\}$",
      "C. $\\{-11, -10, -9, \\ldots\\}$",
      "D. $\\{\\ldots, -13, -12, -11\\}$",
    ],
    jawaban: "B",
    pembahasan: "$2x - 3 \\geq 21 + 4x$\n$2x - 4x \\geq 21 + 3$\n$-2x \\geq 24$\nBagi dengan $-2$ (tanda dibalik): $x \\leq -12$\nHP bilangan bulat: $\\{\\ldots, -14, -13, -12\\}$ → Jawaban B",
  },

  // ── No. 11 — PGK ────────────────────────────────────────────────────────────
  {
    no: 11, type: "pgk",
    soal: "Harga sebuah buku Rp4.000,00 lebihnya dari harga bolpoin. Rina membeli dua buah buku dan sebuah bolpoin seharga Rp26.000,00. Pernyataan-pernyataan berikut berkaitan dengan situasi tersebut.",
    pernyataan: [
      "Jika harga bolpoin $x$ rupiah, maka harga buku $(x + 4.000)$ rupiah.",
      "Model matematika yang tepat adalah $3x + 8.000 = 26.000$.",
      "Harga bolpoin adalah Rp6.000,00.",
      "Harga buku adalah Rp12.000,00.",
    ],
    options: [
      "A. 1 dan 4",
      "B. 2 dan 4",
      "C. 1, 2, dan 3",
      "D. 1, 3, dan 4",
    ],
    jawaban: "C",
    pembahasan: "Harga buku = $x + 4.000$ → Pernyataan (1) BENAR\n$2(x + 4.000) + x = 26.000 \\Rightarrow 3x + 8.000 = 26.000$ → Pernyataan (2) BENAR\n$3x = 18.000 \\Rightarrow x = 6.000$ → harga bolpoin Rp6.000 → Pernyataan (3) BENAR\nHarga buku $= 6.000 + 4.000 = 10.000 \\neq 12.000$ → Pernyataan (4) SALAH\nBenar: 1, 2, dan 3 → Jawaban C",
  },

  // ── No. 12 — PGKBS ──────────────────────────────────────────────────────────
  {
    no: 12, type: "pgkbs",
    soal: "Umur ayah $p$ tahun dan ayah 6 tahun lebih tua dari paman. Jika jumlah umur paman dan ayah adalah 38 tahun, tentukan kebenaran setiap pernyataan berikut!",
    pernyataan: [
      "Model matematika yang tepat adalah $2p - 6 = 38$.",
      "Umur ayah adalah 22 tahun.",
      "Umur paman adalah 10 tahun.",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Umur paman $= p - 6$\n$p + (p - 6) = 38 \\Rightarrow 2p - 6 = 38$ → Pernyataan (1) BENAR\n$2p = 44 \\Rightarrow p = 22$ → Pernyataan (2) BENAR\nUmur paman $= 22 - 6 = 16 \\neq 10$ → Pernyataan (3) SALAH",
  },

  // ── No. 13 — PG ─────────────────────────────────────────────────────────────
  {
    no: 13, type: "pg",
    soal: "Besar uang Rohayah sama dengan tiga kali dari Rp5.000,00 lebihnya dari uang Danu, kemudian dikurangi Rp10.000,00. Jika uang Danu dimisalkan $p$, maka uang Rohayah dapat dinyatakan sebagai ...",
    options: [
      "A. $3(p - 5.000) - 10.000$",
      "B. $3(p + 5.000) - 10.000$",
      "C. $3p - 5.000 - 10.000$",
      "D. $3p + 5.000 - 10.000$",
    ],
    jawaban: "B",
    pembahasan: "Rp5.000 lebihnya dari uang Danu $= p + 5.000$\nTiga kali dari itu $= 3(p + 5.000)$\nDikurangi Rp10.000 $= 3(p + 5.000) - 10.000$ → Jawaban B",
  },

  // ── No. 14 — PGK ────────────────────────────────────────────────────────────
  {
    no: 14, type: "pgk",
    soal: "Jumlah tiga bilangan ganjil berurutan adalah 45. Pernyataan-pernyataan berikut berkaitan dengan situasi tersebut.",
    pernyataan: [
      "Jika bilangan tengah adalah $n$, maka persamaannya adalah $3n = 45$.",
      "Bilangan tengah dari ketiga bilangan tersebut adalah 15.",
      "Tiga bilangan ganjil berurutan tersebut adalah 13, 15, dan 17.",
      "Jumlah bilangan terbesar dan terkecil adalah 32.",
    ],
    options: [
      "A. 1 dan 4",
      "B. 2 dan 4",
      "C. 2 dan 3",
      "D. 1, 2, dan 3",
    ],
    jawaban: "D",
    pembahasan: "Misalkan tiga bilangan: $(n-2), n, (n+2)$\nJumlah: $3n = 45 \\Rightarrow n = 15$ → Pernyataan (1) dan (2) BENAR\nBilangan: 13, 15, 17 → Pernyataan (3) BENAR\nTerbesar + terkecil $= 17 + 13 = 30 \\neq 32$ → Pernyataan (4) SALAH\nBenar: 1, 2, dan 3 → Jawaban D",
  },

  // ── No. 15 — PGKBS ──────────────────────────────────────────────────────────
  {
    no: 15, type: "pgkbs",
    soal: "Sebuah taman berbentuk persegi panjang dengan panjang $(2x + 5)$ m dan lebar $(3x - 2)$ m. Kelilingnya adalah 46 m. Tentukan kebenaran setiap pernyataan berikut!",
    pernyataan: [
      "Nilai $x$ yang memenuhi adalah $x = 4$.",
      "Panjang taman adalah 13 m.",
      "Luas taman adalah 140 m².",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "$2[(2x+5)+(3x-2)] = 46$\n$2(5x+3) = 46 \\Rightarrow 5x+3 = 23 \\Rightarrow 5x = 20 \\Rightarrow x = 4$ → Pernyataan (1) BENAR\nPanjang $= 2(4)+5 = 13$ m → Pernyataan (2) BENAR\nLebar $= 3(4)-2 = 10$ m; Luas $= 13 \\times 10 = 130 \\neq 140$ m² → Pernyataan (3) SALAH",
  },

  // ── No. 16 — PG ─────────────────────────────────────────────────────────────
  {
    no: 16, type: "pg",
    soal: "Diketahui taman berbentuk persegi panjang dengan panjang $(2x - 6)$ cm dan lebar $x$ cm. Jika kelilingnya tidak lebih dari 48 cm, maka lebar taman $l$ yang mungkin adalah ...",
    options: [
      "A. $0 < l \\leq 10$",
      "B. $0 < l \\leq 12$",
      "C. $3 < l \\leq 10$",
      "D. $3 < l \\leq 12$",
    ],
    jawaban: "C",
    pembahasan: "$2[(2x-6)+x] \\leq 48$\n$2(3x-6) \\leq 48 \\Rightarrow 3x-6 \\leq 24 \\Rightarrow x \\leq 10$\nSyarat: panjang $> 0 \\Rightarrow 2x-6 > 0 \\Rightarrow x > 3$\nJadi $3 < x \\leq 10$, sehingga $3 < l \\leq 10$ → Jawaban C",
  },

  // ── No. 17 — PGK ────────────────────────────────────────────────────────────
  {
    no: 17, type: "pgk",
    soal: "Kebun Pak Hartono berbentuk persegi panjang. Panjang dan diagonalnya berturut-turut dinyatakan sebagai $(4x - 10)$ meter dan $(3x - 5)$ meter. Pernyataan-pernyataan berikut berkaitan dengan situasi tersebut.",
    pernyataan: [
      "Persamaan yang terbentuk adalah $4x - 10 = 3x - 5$.",
      "Nilai $x$ yang memenuhi adalah $x = 5$.",
      "Panjang diagonal kebun Pak Hartono adalah 10 meter.",
      "Substitusi $x = 5$ ke ekspresi $3x - 5$ menghasilkan nilai 20.",
    ],
    options: [
      "A. 1 dan 4",
      "B. 1 dan 2",
      "C. 2, 3, dan 4",
      "D. 1, 2, dan 3",
    ],
    jawaban: "D",
    pembahasan: "$4x - 10 = 3x - 5 \\Rightarrow x = 5$ → Pernyataan (1) dan (2) BENAR\nDiagonal $= 4(5) - 10 = 10$ meter; cek: $3(5)-5 = 10$ ✓ → Pernyataan (3) BENAR\n$3(5) - 5 = 10 \\neq 20$ → Pernyataan (4) SALAH\nBenar: 1, 2, dan 3 → Jawaban D",
  },

  // ── No. 18 — PGKBS ──────────────────────────────────────────────────────────
  {
    no: 18, type: "pgkbs",
    soal: "Perbandingan panjang dan lebar sebuah persegi panjang adalah $7 : 4$. Jika kelilingnya 66 cm, tentukan kebenaran setiap pernyataan berikut!",
    pernyataan: [
      "Nilai pembanding $k$ yang memenuhi adalah $k = 3$.",
      "Panjang persegi panjang tersebut adalah 21 cm.",
      "Luas persegi panjang tersebut adalah 198 cm².",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Misalkan panjang $= 7k$, lebar $= 4k$\n$2(7k + 4k) = 66 \\Rightarrow 22k = 66 \\Rightarrow k = 3$ → Pernyataan (1) BENAR\nPanjang $= 7(3) = 21$ cm → Pernyataan (2) BENAR\nLebar $= 4(3) = 12$ cm; Luas $= 21 \\times 12 = 252 \\neq 198$ cm² → Pernyataan (3) SALAH",
  },

  // ── No. 19 — PG ─────────────────────────────────────────────────────────────
  {
    no: 19, type: "pg",
    soal: "Syarat seseorang dapat mengikuti suatu lomba adalah apabila umurnya tidak kurang dari 17 tahun. Jika umur Ali 18 tahun, Ani 15 tahun, Alex 16 tahun, dan Ahmad 19 tahun, berapa orang di antara mereka yang sudah boleh mengikuti lomba?",
    options: ["A. 1 orang", "B. 2 orang", "C. 3 orang", "D. 4 orang"],
    jawaban: "B",
    pembahasan: "Syarat: umur $\\geq 17$ tahun\nAli $= 18 \\geq 17$ ✓\nAni $= 15 < 17$ ✗\nAlex $= 16 < 17$ ✗\nAhmad $= 19 \\geq 17$ ✓\nYang boleh ikut: 2 orang (Ali dan Ahmad) → Jawaban B",
  },

  // ── No. 20 — PGK ────────────────────────────────────────────────────────────
  {
    no: 20, type: "pgk",
    soal: "Taman bunga berbentuk persegi panjang dengan panjang $(8x + 2)$ meter dan lebar $(6x - 16)$ meter. Jika kelilingnya tidak kurang dari 140 meter, pernyataan-pernyataan berikut berkaitan dengan situasi tersebut.",
    pernyataan: [
      "Pertidaksamaan yang terbentuk adalah $28x - 28 \\geq 140$.",
      "Nilai $x$ yang memenuhi adalah $x \\geq 6$.",
      "Panjang taman $(p)$ yang memenuhi adalah $p \\geq 50$ meter.",
      "Lebar taman $(6x - 16)$ untuk nilai $x = 6$ adalah 22 meter.",
    ],
    options: [
      "A. 2 dan 4",
      "B. 1 dan 3",
      "C. 1, 2, dan 4",
      "D. 1, 2, dan 3",
    ],
    jawaban: "D",
    pembahasan: "$2[(8x+2)+(6x-16)] \\geq 140$\n$2(14x-14) \\geq 140 \\Rightarrow 28x - 28 \\geq 140$ → Pernyataan (1) BENAR\n$28x \\geq 168 \\Rightarrow x \\geq 6$ → Pernyataan (2) BENAR\n$p = 8x+2 \\geq 8(6)+2 = 50$ meter → Pernyataan (3) BENAR\nLebar $= 6(6)-16 = 36-16 = 20 \\neq 22$ meter → Pernyataan (4) SALAH\nBenar: 1, 2, dan 3 → Jawaban D",
  },

  // ── No. 21 — PGKBS ──────────────────────────────────────────────────────────
  {
    no: 21, type: "pgkbs",
    soal: "Diketahui segitiga dengan alas 10 cm dan tinggi $(x - 4)$ cm. Jika luas segitiga tidak kurang dari $(2x - 2)$ cm², tentukan kebenaran setiap pernyataan berikut!",
    pernyataan: [
      "Rumus luas segitiga tersebut dapat dinyatakan sebagai $5(x - 4)$ cm².",
      "Pertidaksamaan yang terbentuk adalah $5x - 20 \\geq 2x - 2$.",
      "Nilai minimum $x$ yang memenuhi semua syarat adalah $x = 4$.",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Luas $= \\frac{1}{2} \\times 10 \\times (x-4) = 5(x-4)$ → Pernyataan (1) BENAR\n$5(x-4) \\geq 2x-2 \\Rightarrow 5x-20 \\geq 2x-2$ → Pernyataan (2) BENAR\n$3x \\geq 18 \\Rightarrow x \\geq 6$; juga syarat tinggi $> 0 \\Rightarrow x > 4$; gabungan: $x \\geq 6$\nNilai minimum adalah 6, bukan 4 → Pernyataan (3) SALAH",
  },

  // ── No. 22 — PG ─────────────────────────────────────────────────────────────
  {
    no: 22, type: "pg",
    soal: "Diketahui persamaan $\\dfrac{2(3x - 6)}{(x-1)(x+1)} + \\dfrac{1}{x+1} = \\dfrac{3}{x-1}$. Nilai $x$ yang memenuhi persamaan adalah ...",
    options: ["A. $-\\dfrac{4}{3}$", "B. $1$", "C. $4$", "D. $5$"],
    jawaban: "C",
    pembahasan: "Kalikan semua dengan $(x-1)(x+1)$:\n$2(3x-6) + (x-1) = 3(x+1)$\n$6x - 12 + x - 1 = 3x + 3$\n$7x - 13 = 3x + 3$\n$4x = 16 \\Rightarrow x = 4$ → Jawaban C",
  },

  // ── No. 23 — PGK ────────────────────────────────────────────────────────────
  {
    no: 23, type: "pgk",
    soal: "Perhatikan pertidaksamaan $\\dfrac{1}{2}(2x - 6) \\geq \\dfrac{1}{3}(x - 4)$. Pernyataan-pernyataan berikut berkaitan dengan penyelesaiannya.",
    pernyataan: [
      "Penyederhanaan ruas kiri menghasilkan $x - 3$.",
      "Mengalikan kedua ruas dengan 3 menghasilkan $3(x - 3) \\geq x - 4$.",
      "Penyelesaian pertidaksamaan adalah $x \\geq \\dfrac{5}{2}$.",
      "Nilai $x = 2$ (bilangan bulat) memenuhi pertidaksamaan tersebut.",
    ],
    options: [
      "A. 1 dan 4",
      "B. 2 dan 4",
      "C. 1 dan 3",
      "D. 1, 2, dan 3",
    ],
    jawaban: "D",
    pembahasan: "$\\frac{1}{2}(2x-6) = x - 3$ → Pernyataan (1) BENAR\nKalikan 3: $3(x-3) \\geq x - 4$ → Pernyataan (2) BENAR\n$3x - 9 \\geq x - 4 \\Rightarrow 2x \\geq 5 \\Rightarrow x \\geq \\frac{5}{2}$ → Pernyataan (3) BENAR\nUji $x = 2$: $2 < 2{,}5$, tidak memenuhi $x \\geq \\frac{5}{2}$ → Pernyataan (4) SALAH\nBenar: 1, 2, dan 3 → Jawaban D",
  },
];

const PLSVPage = () => (
  <TKAPemantapanLayout
    title="PERSAMAAN DAN PERTIDAKSAMAAN LINEAR SATU VARIABEL"
    materiSections={materiSections}
    contohSoal={contohSoal}
    latihanDasar={latihanDasar}
  />
);

export default PLSVPage;
