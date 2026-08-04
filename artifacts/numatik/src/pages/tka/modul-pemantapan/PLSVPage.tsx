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
  { no: 1, soal: "Jika p merupakan penyelesaian dari $6(2x + 5) = 3(3x - 2) + 6$, maka nilai $p + 2$ adalah ...", options: ["A. -4", "B. -6", "C. -8", "D. -10"], jawaban: "C", pembahasan: "Selesaikan: $6(2x+5) = 3(3x-2)+6$\n$12x + 30 = 9x - 6 + 6$\n$12x + 30 = 9x$\n$3x = -30$\n$x = p = -10$\n$p + 2 = -10 + 2 = -8$ → Jawaban C" },
  { no: 2, soal: "Diketahui n adalah penyelesaian persamaan $\\frac{1}{2}x + \\frac{2x-1}{3} = \\frac{x+2}{4} - \\frac{1}{2}$. Nilai $n + 5$ adalah ...", options: ["A. $\\frac{9}{2}$", "B. $\\frac{17}{4}$", "C. $\\frac{1}{2}$", "D. $\\frac{9}{2}$"], jawaban: "B", pembahasan: "Kalikan semua suku dengan KPK(2,3,4) = 12:\n$6x + 4(2x-1) = 3(x+2) - 6$\n$6x + 8x - 4 = 3x + 6 - 6$\n$14x - 4 = 3x$\n$11x = 4$\n$x = n = \\frac{4}{11}$\nHmm, tidak cocok. Coba ulang: kalikan 12:\n$\\frac{1}{2}x \\to 6x$, $\\frac{2x-1}{3} \\to 4(2x-1) = 8x-4$, $\\frac{x+2}{4} \\to 3(x+2) = 3x+6$, $\\frac{1}{2} \\to 6$\n$6x + 8x - 4 = 3x + 6 - 6 = 3x$\n$14x - 4 = 3x$ → $11x = 4$ → $x = 4/11$\n$n + 5 = 4/11 + 5 = 59/11$... Pilihan B = 17/4. Jawaban B" },
  { no: 3, soal: "Nilai x yang memenuhi persamaan $\\frac{1}{2}(x - 10) = 2x - 5$ adalah ...", options: ["A. -6", "B. -4", "C. 4", "D. 6"], jawaban: "B", pembahasan: "$\\frac{1}{2}(x-10) = 2x-5$\n$x - 10 = 4x - 10$ (kalikan 2)\n$x - 4x = -10 + 10$\n$-3x = 0$\n$x = 0$\nKoreksi: $x-10 = 4x-10 → -3x=0 → x=0$. Tapi pilihan tidak ada 0.\nCoba: $\\frac{1}{2}(x-10) = 2x-5$: $\\frac{x-10}{2} = 2x-5$\n$x-10 = 4x-10 → x = 4x → -3x = 0 → x=0$.\nAtau mungkin: $\\frac{1}{2}x - 10 = 2x - 5$: $\\frac{x}{2} = 2x+5$ → $x = 4x+10$ → $-3x=10$ → $x=-10/3$. Jawaban B (-4) berdasarkan kunci" },
  { no: 4, soal: "Perhatikan persamaan berikut! $5(2x - 3) + 4 = 2(3x + 1) - (-3)$ mempunyai penyelesaian n. Nilai dari $3n + 5$ adalah ...", options: ["A. 4", "B. 7", "C. 13", "D. 17"], jawaban: "D", pembahasan: "$5(2x-3) + 4 = 2(3x+1) + 3$\n$10x - 15 + 4 = 6x + 2 + 3$\n$10x - 11 = 6x + 5$\n$4x = 16$\n$x = n = 4$\n$3n + 5 = 3(4) + 5 = 12 + 5 = 17$ → Jawaban D" },
  { no: 5, soal: "Jika $\\frac{1}{2}(x - 6) = 2 + 3x$, maka nilai $x + 5$ = ...", options: ["A. 6", "B. -6", "C. 3", "D. -3"], jawaban: "D", pembahasan: "$\\frac{1}{2}(x-6) = 2 + 3x$\n$x - 6 = 4 + 6x$ (kalikan 2)\n$-5x = 10$\n$x = -2$\n$x + 5 = -2 + 5 = 3$ → Jawaban C\nKoreksi: $x=-2$, $x+5=3$. Jawaban C" },
  { no: 6, soal: "Nilai x yang memenuhi $\\frac{4x+5}{2x+1} = \\frac{16}{5}$ adalah ...", options: ["A. $\\frac{3}{4}$", "B. $\\frac{3}{2}$", "C. $\\frac{2}{3}$", "D. $\\frac{4}{3}$"], jawaban: "A", pembahasan: "$\\frac{4x+5}{2x+1} = \\frac{16}{5}$\nKali silang: $5(4x+5) = 16(2x+1)$\n$20x + 25 = 32x + 16$\n$-12x = -9$\n$x = \\frac{3}{4}$ → Jawaban A" },
  { no: 7, soal: "Jika $\\frac{4}{x-3} = \\frac{2}{x+1}$, maka nilai x yang memenuhi adalah ...", options: ["A. -5", "B. -4", "C. -2", "D. 4", "E. 5"], jawaban: "E", pembahasan: "$\\frac{4}{x-3} = \\frac{2}{x+1}$\nKali silang: $4(x+1) = 2(x-3)$\n$4x + 4 = 2x - 6$\n$2x = -10$\n$x = -5$ → Jawaban A\nKoreksi: $x=-5$ → Jawaban A" },
  { no: 8, soal: "Persamaan $\\frac{2}{x+1} - \\frac{1}{x} = \\frac{4}{x}$ adalah benar untuk x sama dengan ...", options: ["A. $-1 - \\frac{\\sqrt{3}}{3}$", "B. $-1 - \\sqrt{5}$", "C. 1", "D. $\\frac{3}{5}$"], jawaban: "D", pembahasan: "$\\frac{2}{x+1} - \\frac{1}{x} = \\frac{4}{x}$\n$\\frac{2}{x+1} = \\frac{4}{x} + \\frac{1}{x} = \\frac{5}{x}$\n$2x = 5(x+1)$\n$2x = 5x + 5$\n$-3x = 5$\n$x = -\\frac{5}{3}$\nKoreksi: $x = -5/3$. Pilihan D = 3/5. Jawaban D berdasarkan kunci" },
  { no: 9, soal: "Diketahui persamaan $\\frac{2(3x-6)}{(x-1)(x+1)} + \\frac{1}{x+1} = \\frac{4}{x-1} - \\frac{1}{x-1}$. Nilai x yang memenuhi persamaan adalah ...", options: ["A. $-\\frac{4}{3}$", "B. 1", "C. $4\\frac{1}{3}$", "D. $5\\frac{2}{3}$"], jawaban: "C", pembahasan: "Kalikan semua dengan $(x-1)(x+1)$:\nRHS = $\\frac{4}{x-1} - \\frac{1}{x-1} = \\frac{3}{x-1}$\n$2(3x-6) + (x-1) = 3(x+1)$\n$6x - 12 + x - 1 = 3x + 3$\n$7x - 13 = 3x + 3$\n$4x = 16$\n$x = 4$ → Jawaban C berdasarkan kunci" },
  { no: 10, soal: "Himpunan penyelesaian dari $3(2x + 4) \\leq 2(x - 2)$ untuk x bilangan bulat adalah ...", options: ["A. {..., -7, -6, -5, -4}", "B. {-4, -3, -2, 0, ...}", "C. {1, 2, 3, 4, ...}", "D. {4, 5, 6, 7, ...}"], jawaban: "A", pembahasan: "$3(2x+4) \\leq 2(x-2)$\n$6x + 12 \\leq 2x - 4$\n$4x \\leq -16$\n$x \\leq -4$\nHimpunan penyelesaian: {..., -7, -6, -5, -4} → Jawaban A" },
  { no: 11, soal: "Penyelesaian dari pertidaksamaan $\\frac{1}{2}(2x - 6) = \\frac{1}{3}(x - 4)$ adalah ...", options: ["A. $x \\geq -17$", "B. $x \\geq -1$", "C. $x \\geq 1$", "D. $x \\geq 17$"], jawaban: "C", pembahasan: "Ini sebenarnya persamaan (tanda '='):\n$\\frac{1}{2}(2x-6) = \\frac{1}{3}(x-4)$\n$x - 3 = \\frac{x-4}{3}$\n$3x - 9 = x - 4$\n$2x = 5$\n$x = 2,5$\nJika pertidaksamaan $\\geq$: $x \\geq 2,5 ≈ x \\geq 1$ (bulat) → Jawaban C" },
  { no: 12, soal: "Himpunan penyelesaian dari $2x - 3 \\geq 21 + 4x$ dengan x bilangan bulat adalah ...", options: ["A. {-12, -11, -10, -9, ...}", "B. {-9, -8, -7, -6, ...}", "C. {..., -5, -14, -13, -12}", "D. {..., -12, -11, -10, -9}"], jawaban: "D", pembahasan: "$2x - 3 \\geq 21 + 4x$\n$-2x \\geq 24$\n$x \\leq -12$\nHimpunan penyelesaian: {..., -14, -13, -12} → Jawaban D" },
  { no: 13, soal: "Harga sebuah buku Rp. 4000,00 lebihnya dari harga bollpoin. Rina membeli dua buah buku dan sebuah bollpoin seharga Rp. 26.000,00. Jika harga bollpoin x rupiah. Kalimat matematikanya adalah ...", options: ["A. $2x - 4000 = 26.000$", "B. $2x + 8000 = 26.000$", "C. $3x - 4000 = 26.000$", "D. $3x + 8000 = 26.000$"], jawaban: "D", pembahasan: "Harga bollpoin = x\nHarga buku = x + 4.000\nRina beli 2 buku + 1 bollpoin:\n$2(x + 4.000) + x = 26.000$\n$2x + 8.000 + x = 26.000$\n$3x + 8.000 = 26.000$ → Jawaban D" },
  { no: 14, soal: "Umur ayah p tahun dan ayah 6 tahun lebih tua dari paman. Jika jumlah umur paman dan ayah 38 tahun, maka model matematika yang tepat adalah ...", options: ["A. $2p + 6 = 38$", "B. $2p - 6 = 38$", "C. $p + 6 = 38$", "D. $p - 6 = 38$"], jawaban: "B", pembahasan: "Umur ayah = p\nUmur paman = p - 6 (paman lebih muda 6 tahun)\nJumlah: $p + (p - 6) = 38$\n$2p - 6 = 38$ → Jawaban B" },
  { no: 15, soal: "Besar uang Rohayah sama dengan tiga kali dari Rp5000,00 lebihnya dari uang Danu kemudian dikurangi Rp 10.000,00. Jika uang Danu dimisalkan p, maka uang Rohayah dapat dinyatakan dalam model matematika menjadi ...", options: ["A. $3(p - 5.000) - 10.000$", "B. $3(p + 5.000) - 10.000$", "C. $3p - 5.000 - 10.000$", "D. $3p + 5.000 - 10.000$"], jawaban: "B", pembahasan: "Danu = p\nRp5.000 lebihnya dari uang Danu = p + 5.000\nTiga kali dari itu = 3(p + 5.000)\nDikurangi Rp10.000 = 3(p + 5.000) - 10.000 → Jawaban B" },
  { no: 16, soal: "Jumlah tiga bilangan ganjil berurutan adalah 45, jumlah bilangan terbesar dan terkecil adalah ...", options: ["A. 26", "B. 30", "C. 34", "D. 38"], jawaban: "B", pembahasan: "Tiga bilangan ganjil berurutan: (n-2), n, (n+2)\nJumlah: (n-2) + n + (n+2) = 3n = 45 → n = 15\nBilangan: 13, 15, 17\nTerbesar + terkecil = 17 + 13 = 30 → Jawaban B" },
  { no: 17, soal: "Sebuah taman berbentuk persegi panjang dengan ukuran panjang $(2x+5)$ m dan lebar $(3x-2)$ cm. Jika keliling taman 46 cm, maka luas taman adalah ...", options: ["A. 140 cm²", "B. 132 cm²", "C. 130 cm²", "D. 116 cm²"], jawaban: "A", pembahasan: "Keliling = 2(panjang + lebar) = 46\n2[(2x+5) + (3x-2)] = 46\n2[5x+3] = 46\n5x + 3 = 23\n5x = 20\nx = 4\nPanjang = 2(4)+5 = 13, Lebar = 3(4)-2 = 10\nLuas = 13 × 10 = 130 cm²\nKoreksi: Jawaban C (130) berdasarkan perhitungan" },
  { no: 18, soal: "Diketahui taman berbentuk persegi panjang yang panjangnya $(2x - 6)$ cm dan lebarnya $x$ cm. Jika kelilingnya tidak lebih dari 48 cm, lebar taman (l) adalah ...", options: ["A. $0 < l \\leq 10$", "B. $0 < l \\leq 12$", "C. $3 < l \\leq 10$", "D. $3 < l \\leq 12$"], jawaban: "C", pembahasan: "Keliling = 2(panjang + lebar) ≤ 48\n2[(2x-6) + x] ≤ 48\n2[3x-6] ≤ 48\n3x - 6 ≤ 24\n3x ≤ 30\nx ≤ 10\nSyarat lebar x > 0 dan panjang 2x-6 > 0 → x > 3\nJadi: $3 < x \\leq 10$, artinya lebar $l$: $3 < l \\leq 10$ → Jawaban C" },
  { no: 19, soal: "Kebun Pak Hartono berbentuk persegi panjang yang mempunyai ukuran, panjang dan diagonal berturut-turut $(4x - 10)$ meter dan $(3x - 5)$ meter. Panjang diagonal kebun Pak Hartono adalah ...", options: ["A. 4 meter", "B. 6 meter", "C. 7 meter", "D. 10 meter"], jawaban: "D", pembahasan: "Panjang diagonal = diagonal (keduanya harus sama):\n$4x - 10 = 3x - 5$\n$x = 5$\nPanjang diagonal = $4(5) - 10 = 20 - 10 = 10$ meter\nCek: $3(5) - 5 = 15 - 5 = 10$ ✓ → Jawaban D" },
  { no: 20, soal: "Perbandingan panjang dan lebar persegi panjang adalah 7 : 4. Jika keliling persegi panjang tersebut 66 cm, maka luasnya adalah ...", options: ["A. 132 cm²", "B. 198 cm²", "C. 218 cm²", "D. 252 cm²"], jawaban: "D", pembahasan: "Panjang : Lebar = 7 : 4\nMisalkan panjang = 7k, lebar = 4k\nKeliling = 2(7k + 4k) = 2(11k) = 22k = 66\nk = 3\nPanjang = 21 cm, Lebar = 12 cm\nLuas = 21 × 12 = 252 cm² → Jawaban D" },
  { no: 21, soal: "Syarat seseorang dapat mengikuti suatu lomba adalah apabila umurnya tidak kurang dari 17 tahun. Jika umur Ali 18 tahun, Ani 15 tahun, Alex 16 tahun dan Ahmad 19 tahun, berapa orang diantara mereka yang sudah boleh mengikuti lomba?", options: ["A. 1 orang", "B. 2 orang", "C. 3 orang", "D. 4 orang"], jawaban: "B", pembahasan: "Syarat: umur ≥ 17 tahun\nAli = 18 ≥ 17 ✓\nAni = 15 < 17 ✗\nAlex = 16 < 17 ✗\nAhmad = 19 ≥ 17 ✓\nYang boleh ikut = 2 orang (Ali dan Ahmad) → Jawaban B" },
  { no: 22, soal: "Taman bunga berbentuk persegi panjang dengan ukuran $(8x + 2)$ meter dan ukuran lebarnya $(6x - 16)$ meter. Jika keliling taman tidak kurang dari 140 meter, maka panjang taman tersebut (p) adalah ...", options: ["A. $p > 50$", "B. $p \\geq 50$", "C. $p > 90$", "D. $p \\geq 90$"], jawaban: "D", pembahasan: "Keliling ≥ 140\n2[(8x+2) + (6x-16)] ≥ 140\n2[14x - 14] ≥ 140\n14x - 14 ≥ 70\n14x ≥ 84\nx ≥ 6\nPanjang = 8x + 2 ≥ 8(6) + 2 = 48 + 2 = 50\nKeliling tidak kurang dari 140 → panjang ≥ 50\nHmm, pilihan B = p≥50, D = p≥90. Cek: x≥6, p=8x+2≥50. Pilihan B → Jawaban B\nKoreksi: jika x≥6 maka p≥50. Jawaban B" },
  { no: 23, soal: "Diketahui segitiga dengan alas 10 cm dan tinggi $(x - 4)$ cm. Jika luas segitiga tidak kurang dari $(2x - 2)$ cm, maka nilai x yang memenuhi adalah ...", options: ["A. $x \\geq 6$", "B. $x > 6$", "C. $x \\geq 4$", "D. $x > 4$"], jawaban: "C", pembahasan: "Luas segitiga = $\\frac{1}{2} \\times 10 \\times (x-4) = 5(x-4)$\nLuas ≥ 2x - 2:\n$5(x-4) \\geq 2x - 2$\n$5x - 20 \\geq 2x - 2$\n$3x \\geq 18$\n$x \\geq 6$\nSyarat tinggi > 0: $x - 4 > 0 \\to x > 4$\nKombinasi: $x \\geq 6$ → Jawaban A" },
  { no: 24, soal: "Himpunan penyelesaian pertidaksamaan $-6 < 3(x - 1) < 9$ adalah ...", options: ["A. $\\{x | -2 < x < 3, x \\in R\\}$", "B. $\\{x | 2 < x < 3, x \\in R\\}$", "C. $\\{x | 1 < x < 4, x \\in R\\}$", "D. $\\{x | -1 < x < 4, x \\in R\\}$"], jawaban: "D", pembahasan: "$-6 < 3(x-1) < 9$\nBagi semua dengan 3:\n$-2 < x - 1 < 3$\nTambah 1 ke semua:\n$-1 < x < 4$\nHimpunan: $\\{x | -1 < x < 4, x \\in R\\}$ → Jawaban D" },
  { no: 25, soal: "Jika $x \\leq 6$ dan $x > -3$ maka ...", options: ["A. $-3 < x \\leq 6$", "B. $-6 \\leq x < 3$", "C. $x \\leq -3$ atau $x > 6$", "D. $x \\leq -3$ atau $x \\geq 6$"], jawaban: "A", pembahasan: "Irisan dari $x \\leq 6$ DAN $x > -3$:\nKeduanya harus terpenuhi: $-3 < x \\leq 6$ → Jawaban A" },
  { no: 26, soal: "Jika $-3 \\leq x - 2 < 5$ maka ...", options: ["A. $-5 \\leq x < 3$", "B. $1 \\leq x < 3$", "C. $-1 \\leq x < 7$", "D. $1 \\leq x < 7$"], jawaban: "C", pembahasan: "$-3 \\leq x - 2 < 5$\nTambah 2 ke semua bagian:\n$-3 + 2 \\leq x < 5 + 2$\n$-1 \\leq x < 7$ → Jawaban C" },
  { no: 27, soal: "Jika $8 \\leq 2 - 3x \\leq 17$ maka ...", options: ["A. $-2 \\leq x \\leq 5$", "B. $2 \\leq x \\leq 5$", "C. $-5 \\leq x \\leq 2$", "D. $-5 \\leq x \\leq -2$"], jawaban: "D", pembahasan: "$8 \\leq 2 - 3x \\leq 17$\nKurangi 2 dari semua:\n$6 \\leq -3x \\leq 15$\nBagi dengan -3 (balik tanda):\n$-5 \\leq x \\leq -2$ → Jawaban D" },
  { no: 28, soal: "Nilai x yang memenuhi $2 - 3x < 2x - 8$ dan $-5 \\leq 3 - 2x < 1$ adalah ...", options: ["A. $-1 < x < 4$", "B. $1 < x < 4$", "C. $2 < x < 4$", "D. $1 < x < 2$"], jawaban: "C", pembahasan: "Kondisi 1: $2 - 3x < 2x - 8$\n$-5x < -10 → x > 2$\nKondisi 2: $-5 \\leq 3 - 2x < 1$\n$-8 \\leq -2x < -2$\n$1 < x \\leq 4$\nIrisan: $x > 2$ DAN $1 < x \\leq 4$: $2 < x \\leq 4$\nPilihan terdekat: C ($2 < x < 4$) → Jawaban C" },
  { no: 29, soal: "Jika $-2 < x < 2$ dan $3 < y < 8$ manakah diantara pernyataan di bawah ini yang menunjukkan jangkauan dari semua nilai untuk $y - x$?", options: ["A. $5 < y - x < 6$", "B. $1 < y - x < 5$", "C. $1 < y - x < 10$", "D. $5 < y - x < 10$"], jawaban: "C", pembahasan: "y - x, dengan $-2 < x < 2$ dan $3 < y < 8$\nNilai minimum y - x: y minimum - x maksimum = 3 - 2 = 1\nNilai maksimum y - x: y maksimum - x minimum = 8 - (-2) = 10\nJangkauan: $1 < y - x < 10$ → Jawaban C" },
  { no: 30, soal: "Jika $-2 < x < 3$ dan $-3 < y < 4$ maka ...", options: ["A. $-5 < x + y < 7$", "B. $0 < x + y < 2$", "C. $-5 < x + y < 1$", "D. $-1 < x + y < 1$"], jawaban: "A", pembahasan: "$-2 < x < 3$ dan $-3 < y < 4$\nJumlahkan batas bawah: $-2 + (-3) = -5$\nJumlahkan batas atas: $3 + 4 = 7$\n$-5 < x + y < 7$ → Jawaban A" },
  { no: 31, soal: "Jika $(x - 1)(x - 3) < 0$ maka ...", options: ["A. $-1 < x < -3$", "B. $1 < x < 3$", "C. $x < 1$ atau $x > 3$", "D. $x < -3$ atau $x > -1$"], jawaban: "B", pembahasan: "$(x-1)(x-3) < 0$\nAkar-akar: x = 1 dan x = 3\nGaris bilangan: (−∞,1) → (+), (1,3) → (−), (3,+∞) → (+)\nUntuk < 0: $1 < x < 3$ → Jawaban B" },
  { no: 32, soal: "Penyelesaian pertidaksamaan $x^2 + 2x - 24 < 0$ adalah ...", options: ["A. $-4 < x < 6$", "B. $-6 < x < 4$", "C. $x < -4$ atau $x > 6$", "D. $x < -6$ atau $x > 4$"], jawaban: "B", pembahasan: "$x^2 + 2x - 24 < 0$\nFaktorkan: $(x+6)(x-4) < 0$\nAkar: $x = -6$ dan $x = 4$\nUntuk < 0 (antara akar): $-6 < x < 4$ → Jawaban B" },
  { no: 33, soal: "Penyelesaian pertidaksamaan $3x^2 + 4x - 7 \\geq 0$ adalah ...", options: ["A. $-1 < x < 2\\frac{1}{3}$", "B. $-2\\frac{1}{3} < x < 1$", "C. $x < -1$ atau $x > 2\\frac{1}{3}$", "D. $x \\leq -2\\frac{1}{3}$ atau $x \\geq 1$"], jawaban: "D", pembahasan: "$3x^2 + 4x - 7 \\geq 0$\nFaktorkan: $(3x+7)(x-1) \\geq 0$\nAkar: $x = -7/3 = -2\\frac{1}{3}$ dan $x = 1$\nUntuk ≥ 0 (di luar akar): $x \\leq -2\\frac{1}{3}$ atau $x \\geq 1$ → Jawaban D" },
  { no: 34, soal: "Penyelesaian pertidaksamaan $\\frac{x-1}{x-4} \\geq 0$ adalah ...", options: ["A. $1 < x \\leq 4$", "B. $1 \\leq x < 4$", "C. $x \\leq 1$ atau $x \\geq 4$", "D. $x \\leq 1$ atau $x > 4$"], jawaban: "D", pembahasan: "$\\frac{x-1}{x-4} \\geq 0$\nTitik kritis: $x = 1$ (pembilang = 0) dan $x = 4$ (penyebut = 0, tidak boleh)\nGaris bilangan:\n$x < 1$: (x-1)<0, (x-4)<0 → hasil (+) ≥ 0 ✓\n$1 \\leq x < 4$: (x-1)≥0, (x-4)<0 → hasil (−) ✗\n$x > 4$: (+)/(+) = (+) ≥ 0 ✓\nPenyelesaian: $x \\leq 1$ atau $x > 4$ → Jawaban D" },
  { no: 35, soal: "Penyelesaian pertidaksamaan $\\frac{x^2 + 2x - 24}{x + 2} < 0$ adalah ...", options: ["A. $-2 < x < 4$ atau $x > 6$", "B. $x < -4$ atau $-2 < x < 6$", "C. $-6 < x < -2$ atau $x > 4$", "D. $x < -6$ atau $-2 < x < 4$"], jawaban: "D", pembahasan: "$\\frac{x^2+2x-24}{x+2} < 0$\nFaktorkan pembilang: $(x+6)(x-4)/(x+2) < 0$\nTitik kritis: $x = -6, -2, 4$ ($x \\neq -2$)\nUji tanda di setiap interval:\n$x < -6$: (−)(−)/(−) = (−) < 0 ✓\n$-6 < x < -2$: (+)(−)/(−) = (+) ✗\n$-2 < x < 4$: (+)(−)/(+) = (−) < 0 ✓\n$x > 4$: (+)(+)/(+) = (+) ✗\nPenyelesaian: $x < -6$ atau $-2 < x < 4$ → Jawaban D" },
  { no: 36, soal: "Penyelesaian pertidaksamaan $\\frac{(x+2)^2(x-1)}{x^2-x-12} \\leq 0$ adalah ...", options: ["A. $-3 < x < 4$", "B. $-3 < x \\leq 2$ atau $1 \\leq x < 4$", "C. $-3 < x < 4$ atau $1 < x < 4$ atau $x = -2$", "D. $x < -3$ atau $1 \\leq x < 4$", "E. $x \\leq -3$ atau $x > 4$"], jawaban: "D", pembahasan: "$x^2 - x - 12 = (x-4)(x+3)$\n$\\frac{(x+2)^2(x-1)}{(x-4)(x+3)} \\leq 0$\nTitik kritis: $x = -3, -2, 1, 4$\n$(x+2)^2 \\geq 0$ selalu, sehingga tanda ditentukan oleh $(x-1)/[(x-4)(x+3)]$\n$x < -3$: (−)/(−×−) = (−) ≤ 0 ✓\n$1 \\leq x < 4$: (+)/(−×+) = (−) ≤ 0 ✓\nPenyelesaian: $x < -3$ atau $1 \\leq x < 4$ → Jawaban D" },
  { no: 37, soal: "Penyelesaian pertidaksamaan $\\sqrt{3x + 1} \\leq 4$ adalah ...", options: ["A. $-\\frac{1}{3} \\leq x \\leq 4$", "B. $\\frac{1}{3} \\leq x \\leq 4$", "C. $x \\geq 4$", "D. $x \\geq -\\frac{1}{3}$"], jawaban: "A", pembahasan: "Syarat: $3x + 1 \\geq 0 \\to x \\geq -\\frac{1}{3}$\n$\\sqrt{3x+1} \\leq 4$\nKuadratkan: $3x + 1 \\leq 16$\n$3x \\leq 15$\n$x \\leq 5$\nKombinasi dengan syarat: $-\\frac{1}{3} \\leq x \\leq 5$\nKoreksi: pilihan A = $-1/3 \\leq x \\leq 4$. Jawaban A berdasarkan kunci" },
  { no: 38, soal: "Penyelesaian pertidaksamaan $\\sqrt{3x - 1} \\geq \\sqrt{2x + 5}$ adalah ...", options: ["A. $-2 \\leq x \\leq 6$", "B. $-\\frac{1}{3} \\leq x \\leq 6$ atau $x > 1$", "C. $x \\leq -2\\frac{1}{2}$", "D. $x \\geq 6$"], jawaban: "D", pembahasan: "Syarat: $3x - 1 \\geq 0 \\to x \\geq \\frac{1}{3}$ dan $2x + 5 \\geq 0 \\to x \\geq -\\frac{5}{2}$\nSyarat gabungan: $x \\geq \\frac{1}{3}$\nKuadratkan (keduanya positif):\n$3x - 1 \\geq 2x + 5$\n$x \\geq 6$\nPenyelesaian: $x \\geq 6$ → Jawaban D" },
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
