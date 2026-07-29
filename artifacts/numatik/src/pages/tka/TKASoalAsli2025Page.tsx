import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath, BlockMath } from "react-katex";
import { AlertCircle } from "lucide-react";
import "katex/dist/katex.min.css";

const TKASoalAsli2025Page = () => {
  const navigate = useNavigate();
  const [expandedPembahasan, setExpandedPembahasan] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [selectedComplexAnswers, setSelectedComplexAnswers] = useState<Record<number, Set<number>>>({});
  const [selectedCategory, setSelectedCategory] = useState<Record<string, string>>({});

  const togglePembahasan = (n: number) => {
    setExpandedPembahasan(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const selectAnswer = (qn: number, idx: number) => {
    if (selectedAnswers[qn] !== undefined) return;
    playPopSound();
    setSelectedAnswers(prev => ({ ...prev, [qn]: idx }));
  };

  const selectComplexAnswer = (qn: number, idx: number) => {
    if ((selectedComplexAnswers[qn] ?? new Set()).has(idx)) return;
    playPopSound();
    setSelectedComplexAnswers(prev => {
      const next = new Set(prev[qn] ?? []);
      next.add(idx);
      return { ...prev, [qn]: next };
    });
  };

  const selectCategory = (key: string, choice: string) => {
    if (selectedCategory[key] !== undefined) return;
    playPopSound();
    setSelectedCategory(prev => ({ ...prev, [key]: choice }));
  };

  // ─── Komponen UI ───────────────────────────────────────────────

  const MCQ = ({ qn, options, correct, cols = 2 }: {
    qn: number; options: React.ReactNode[]; correct: number; cols?: number;
  }) => {
    const sel = selectedAnswers[qn];
    const answered = sel !== undefined;
    return (
      <div className={cols === 1 ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"}>
        {options.map((opt, i) => {
          const isSelected = sel === i;
          const isCorrect = i === correct;
          let cls = "border rounded-lg px-3 py-2 text-xs font-body transition-all flex items-center justify-between ";
          if (!answered) cls += "bg-white/5 border-white/10 text-white/80 cursor-pointer hover:bg-white/10 hover:border-amber-500/40 active:scale-95";
          else if (isCorrect) cls += "bg-green-900/30 border-green-500/50 text-green-300 font-bold";
          else if (isSelected) cls += "bg-red-900/30 border-red-500/50 text-red-300";
          else cls += "bg-white/5 border-white/10 text-white/30";
          return (
            <div key={i} className={cls} onClick={() => selectAnswer(qn, i)}>
              <span>{opt}</span>
              {answered && isCorrect && <span className="ml-2 text-green-400 font-bold shrink-0">✓</span>}
              {answered && isSelected && !isCorrect && <span className="ml-2 text-red-400 font-bold shrink-0">✗</span>}
            </div>
          );
        })}
      </div>
    );
  };

  const ComplexMCQ = ({ qn, items }: {
    qn: number;
    items: { text: React.ReactNode; benar: boolean }[];
  }) => {
    const clicks = selectedComplexAnswers[qn] ?? new Set<number>();
    return (
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const isClicked = clicks.has(i);
          let cls = "border rounded-lg px-3 py-2 text-xs font-body transition-all flex items-center justify-between ";
          if (!isClicked) cls += "bg-white/5 border-white/10 text-white/80 cursor-pointer hover:bg-white/10 hover:border-amber-500/40 active:scale-95";
          else if (item.benar) cls += "bg-green-900/30 border-green-500/50 text-green-300 font-bold";
          else cls += "bg-red-900/30 border-red-500/50 text-red-300";
          return (
            <div key={i} className={cls} onClick={() => selectComplexAnswer(qn, i)}>
              <span>{item.text}</span>
              {isClicked && item.benar && <span className="ml-2 text-green-400 font-bold shrink-0">✓ Benar!</span>}
              {isClicked && !item.benar && <span className="ml-2 text-red-400 font-bold shrink-0">✗ Salah</span>}
            </div>
          );
        })}
      </div>
    );
  };

  const CategoryTable = ({ qn, colA, colB, rows, correctKey }: {
    qn: number;
    colA: string;
    colB: string;
    rows: { key: string; text: React.ReactNode }[];
    correctKey: Record<string, string>;
  }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-body border-collapse">
        <thead>
          <tr className="bg-white/10">
            <th className="border border-white/20 px-3 py-2 text-white text-left">Pernyataan</th>
            <th className="border border-white/20 px-3 py-2 text-white text-center w-28">{colA}</th>
            <th className="border border-white/20 px-3 py-2 text-white text-center w-28">{colB}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const key = `${qn}-${row.key}`;
            const sel = selectedCategory[key];
            const answered = sel !== undefined;
            const correct = correctKey[row.key];
            return (
              <tr key={row.key} className={answered ? (sel === correct ? "bg-green-900/20" : "bg-red-900/20") : ""}>
                <td className="border border-white/10 px-3 py-2 text-white/80">{row.text}</td>
                {[colA, colB].map(choice => {
                  const isChosen = sel === choice;
                  const isCorrectCell = correct === choice;
                  let btnCls = "w-full py-1 rounded text-center transition-all cursor-pointer text-xs font-bold ";
                  if (!answered) btnCls += "bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-white/50";
                  else if (isCorrectCell) btnCls += "bg-green-700/50 text-green-300";
                  else if (isChosen) btnCls += "bg-red-700/50 text-red-300";
                  else btnCls += "bg-white/5 text-white/20";
                  return (
                    <td key={choice} className="border border-white/10 px-2 py-2 text-center">
                      <div className={btnCls} onClick={() => selectCategory(key, choice)}>
                        ○{answered && isChosen && isCorrectCell && " ✓"}{answered && isChosen && !isCorrectCell && " ✗"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const TrueFalseTable = ({ qn, rows }: {
    qn: number;
    rows: { key: string; text: React.ReactNode; correct: "benar" | "salah" }[];
  }) => (
    <CategoryTable
      qn={qn}
      colA="Benar"
      colB="Salah"
      rows={rows}
      correctKey={Object.fromEntries(rows.map(r => [r.key, r.correct === "benar" ? "Benar" : "Salah"]))}
    />
  );

  const PembahasanBtn = ({ n }: { n: number }) => (
    <button
      onClick={() => { playPopSound(); togglePembahasan(n); }}
      className="mt-3 w-full py-2 rounded-lg text-xs font-body font-semibold transition-all border border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
    >
      {expandedPembahasan.has(n) ? "▲ Tutup Pembahasan" : "▼ Lihat Pembahasan"}
    </button>
  );

  const ImageNote = ({ text }: { text: string }) => (
    <div className="flex items-start gap-2 bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 mb-3">
      <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
      <p className="text-blue-300 text-xs font-body">{text}</p>
    </div>
  );

  const Soal = ({ n, elemen, subelemen, children }: {
    n: number; elemen: string; subelemen: string; children: React.ReactNode;
  }) => (
    <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-amber-500/20 text-amber-300 font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">{n}</span>
        <span className="text-[10px] font-body text-white/40 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{elemen} · {subelemen}</span>
      </div>
      {children}
    </div>
  );

  // ─── Bacaan ────────────────────────────────────────────────────

  const Bacaan1 = () => (
    <div className="bg-cyan-900/15 border border-cyan-500/30 rounded-xl p-4 mb-5">
      <p className="text-cyan-400 text-[10px] font-body font-bold uppercase tracking-wider mb-2">
        Bacaan 1 — untuk menjawab Soal Nomor 2 dan 3
      </p>
      <p className="text-white/80 text-xs font-body leading-relaxed mb-3">
        Rina lebih suka berbelanja online karena lebih mudah dan praktis. Ia sering menggunakan
        cashback yang disediakan oleh aplikasi belanja online. Di era transaksi digital seperti
        sekarang, istilah cashback barangkali sudah tak asing lagi. Apa itu cashback? Cashback
        merupakan persentase pengembalian uang tunai atau virtual yang didapat saat pembeli
        memenuhi syarat tertentu. Potongan tersebut bisa diberikan secara langsung atau di
        kemudian hari. Cashback berbeda dengan diskon. Diskon diberikan dengan memberikan
        potongan harga di awal. Bentuk diskon pun sudah pasti berupa uang alias potongan harga.
        Selain menggunakan uang tunai, cashback biasanya diberikan dalam bentuk poin atau koin
        digital. Beberapa penjual juga sering kali memberikan cashback dalam bentuk produk
        hingga voucher. Berikut beberapa penawaran cashback yang ada di aplikasi belanja online Rina.
      </p>
      <div className="mb-3 flex justify-center">
        <img src="/tka-2025-bacaan1.png" alt="Tabel voucher cashback Bacaan 1" className="max-w-full rounded-lg border border-white/10" />
      </div>
      <p className="text-white/70 text-xs font-body leading-relaxed mb-2">
        <span className="text-cyan-300 font-bold">Cashback 25% s/d 100RB</span> artinya uang yang dikembalikan sebanyak 25% dari total belanjaan dan tidak lebih dari Rp100.000,00.
      </p>
      <div className="bg-white/5 rounded-lg p-3 text-xs font-body text-white/60 space-y-1">
        <p className="font-bold text-white/70 mb-1">Contoh:</p>
        <p>Total belanjaan Rp500.000,00 → 25% × Rp500.000 = Rp125.000 → dibatasi Rp100.000, jadi cashback <span className="text-amber-300 font-bold">Rp100.000,00</span>.</p>
        <p>Total belanjaan Rp300.000,00 → 25% × Rp300.000 = Rp75.000 → tidak melewati batas, jadi cashback <span className="text-amber-300 font-bold">Rp75.000,00</span>.</p>
        <p className="text-white/40 mt-1">Voucher cashback yang lainnya juga berlaku dengan cara yang sama.</p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="bg-card/80 backdrop-blur border border-amber-500/30 rounded-2xl p-5 mb-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/40 rounded-full px-4 py-1 mb-3">
              <span className="text-amber-400 text-[10px] font-body font-bold uppercase tracking-widest">✦ SOAL ASLI ✦</span>
            </div>
            <h1 className="font-display text-lg font-bold text-amber-200 mb-1">TES KEMAMPUAN AKADEMIK (TKA)</h1>
            <p className="font-body text-white/60 text-xs mb-0.5">MATEMATIKA — SMP/MTs/Sederajat</p>
            <p className="font-display text-xl font-bold text-amber-300">TAHUN 2025</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-left text-xs font-body">
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Mata Pelajaran:</span><span className="text-white ml-1">Matematika</span></div>
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Jenjang:</span><span className="text-white ml-1">SMP/MTs</span></div>
            <div className="bg-white/5 rounded-lg p-2 col-span-2 flex items-center gap-2">
              <span className="text-white/40">Progress:</span>
              <span className="text-amber-300 font-bold ml-1">Soal 1 – 30</span>
              <span className="text-white/30">dari 30 soal (Lengkap)</span>
              <span className="ml-auto text-amber-400/70 text-[10px]">Soal 11–30 segera ditambahkan</span>
            </div>
          </div>
        </div>

        {/* ── Petunjuk ── */}
        <div className="bg-amber-900/15 border border-amber-500/25 rounded-xl p-4 mb-6">
          <p className="font-body text-amber-300 text-xs font-bold mb-2">PETUNJUK</p>
          <ul className="space-y-1 text-white/65 text-xs font-body list-disc list-inside">
            <li>Klik pilihan jawaban untuk menjawab. Jawaban tidak dapat diubah setelah diklik.</li>
            <li>Soal bertipe <span className="text-cyan-300">Pilihan Ganda Sederhana (PGS)</span>: hanya satu jawaban benar.</li>
            <li>Soal bertipe <span className="text-green-300">MCMA</span>: jawaban benar lebih dari satu — klik semua yang menurutmu benar.</li>
            <li>Soal bertipe <span className="text-violet-300">Benar/Salah</span> dan <span className="text-violet-300">Kategori</span>: klik kolom yang sesuai untuk setiap pernyataan.</li>
          </ul>
        </div>

        {/* ── Soal ── */}
        <div className="flex flex-col gap-5">

          {/* ══════════════ SOAL 1 ══════════════ */}
          <Soal n={1} elemen="Bilangan" subelemen="Bilangan Real">
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Hasil dari operasi bilangan berpangkat berikut adalah ....
                </p>
                <div className="my-3 flex justify-center">
                  <BlockMath math="\dfrac{7^3 \times 7^{-4}}{7^2}" />
                </div>
                <MCQ qn={1} correct={2} options={[
                  <span key="a">A. <InlineMath math="7^{-9}" /></span>,
                  <span key="b">B. <InlineMath math="7^{-6}" /></span>,
                  <span key="c">C. <InlineMath math="7^{-3}" /></span>,
                  <span key="d">D. <InlineMath math="7" /></span>,
                ]} />
              </div>
            </div>
            <PembahasanBtn n={1} />
            {expandedPembahasan.has(1) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. <InlineMath math="7^{-3}" /></div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep</p>
                  <p className="text-white/70">Sifat perkalian pangkat: <InlineMath math="a^m \times a^n = a^{m+n}" /> dan pembagian pangkat: <InlineMath math="a^m \div a^n = a^{m-n}" /></p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-3 space-y-1">
                    <p className="text-white/70">Pembilang: <InlineMath math="7^3 \times 7^{-4} = 7^{3+(-4)} = 7^{-1}" /></p>
                    <div className="my-2"><BlockMath math="\frac{7^{-1}}{7^2} = 7^{-1-2} = 7^{-3}" /></div>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ BACAAN 1 ══════════════ */}
          <Bacaan1 />

          {/* ══════════════ SOAL 2 ══════════════ */}
          <Soal n={2} elemen="Bilangan" subelemen="Bilangan Real">
            <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
              Rina akan membeli hadiah untuk dua orang temannya. Hadiahnya akan dikirim ke alamat
              masing-masing sehingga Rina harus melakukan dua kali transaksi. Setiap satu kali
              transaksi, Rina dapat memilih satu voucher cashback. Setiap voucher hanya dapat
              digunakan satu kali. Hadiah yang dikirim harganya sama yaitu{" "}
              <span className="text-amber-300 font-bold">Rp50.000,00</span>.{" "}
              Jika Rina menginginkan cashback lebih dari Rp10.000,00, voucher mana sajakah yang harus ia pilih?
            </p>
            <p className="text-cyan-300 text-xs font-body font-semibold mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
            <ComplexMCQ qn={2} items={[
              { text: "Voucher A", benar: true },
              { text: "Voucher B", benar: false },
              { text: "Voucher C", benar: true },
              { text: "Voucher D", benar: false },
            ]} />
            <PembahasanBtn n={2} />
            {expandedPembahasan.has(2) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Cara Menyelesaikan</p>
                  <p className="text-white/70 mb-2">Untuk mendapatkan cashback &gt; Rp10.000 dari belanjaan Rp50.000, diperlukan cashback rate &gt; 20%.</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{cashback} = \text{rate} \times \text{Rp50.000} > \text{Rp10.000}" /></div>
                  <p className="text-white/70">Periksa setiap voucher: hitung rate% × Rp50.000, bandingkan dengan batas maksimal voucher, lalu lihat apakah hasilnya &gt; Rp10.000.</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs">📌 Untuk jawaban pasti, lihat tabel voucher pada dokumen soal asli dan hitung masing-masing: rate × Rp50.000, dibatasi nilai maksimal voucher.</p>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 3 ══════════════ */}
          <Soal n={3} elemen="Bilangan" subelemen="Bilangan Real">
            <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
              Rina memiliki voucher A, B, dan D yang bisa ia gunakan untuk berbelanja online.
              Tentukan <span className="text-green-300 font-bold">benar</span> atau{" "}
              <span className="text-red-300 font-bold">salah</span> pernyataan berikut ini
              berkaitan dengan nominal transaksi Rina dan voucher yang seharusnya ia gunakan
              untuk mendapatkan cashback terbesar!
            </p>
            <p className="text-violet-300 text-xs font-body font-semibold mb-2">Klik pada kotak yang sesuai!</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-3 py-2 text-white text-left">Pernyataan</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center w-20">Benar</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center w-20">Salah</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: 1, img: "/tka-2025-soal3-p1.png", alt: "Pernyataan 1 soal 3" },
                    { n: 2, img: "/tka-2025-soal3-p2.png", alt: "Pernyataan 2 soal 3" },
                    { n: 3, img: "/tka-2025-soal3-p3.png", alt: "Pernyataan 3 soal 3" },
                  ].map(({ n, img, alt }) => (
                    <tr key={n}>
                      <td className="border border-white/10 px-3 py-2">
                        <img src={img} alt={alt} className="max-w-full rounded-lg border border-white/10" />
                      </td>
                      <td className="border border-white/10 px-2 py-2 text-center">
                        <div className="w-full py-1 rounded text-center text-xs font-bold bg-white/5 text-white/20">○</div>
                      </td>
                      <td className="border border-white/10 px-2 py-2 text-center">
                        <div className="w-full py-1 rounded text-center text-xs font-bold bg-white/5 text-white/20">○</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PembahasanBtn n={3} />
            {expandedPembahasan.has(3) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2 text-xs font-body">
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Cara Menyelesaikan</p>
                  <p className="text-white/70">Rina memiliki Voucher A, B, dan D. Untuk setiap nominal transaksi, hitung cashback yang diperoleh dari masing-masing voucher (rate × nominal, dibatasi cap voucher), lalu tentukan voucher mana yang memberikan cashback terbesar.</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs">📌 Lihat pernyataan dan tabel voucher pada dokumen soal asli untuk menentukan nilai benar/salah tiap pernyataan.</p>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 4 ══════════════ */}
          <Soal n={4} elemen="Bilangan" subelemen="Bilangan Real">
            <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
              Buah merupakan salah satu sumber vitamin C. Untuk mengetahui kandungan vitamin C,
              tim peneliti akan menguji kandungan vitamin C dari keempat buah berikut.
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-3 py-2 text-white text-left">Buah</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Berat (gr)</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Kandungan Air (mL)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { buah: "Buah A", berat: "118,4", air: "96,3" },
                    { buah: "Buah B", berat: "130,7", air: "150" },
                    { buah: "Buah C", berat: "130,55", air: "140" },
                    { buah: "Buah D", berat: "96,255", air: "118,15" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white/3" : ""}>
                      <td className="border border-white/10 px-3 py-2 font-semibold text-white/80">{row.buah}</td>
                      <td className="border border-white/10 px-3 py-2 text-white/70 text-center">{row.berat}</td>
                      <td className="border border-white/10 px-3 py-2 text-white/70 text-center">{row.air}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Karena keterbatasan waktu pengujian, pada hari pertama hanya satu buah yang akan diteliti.
              Buah yang akan diteliti pertama adalah buah yang memiliki{" "}
              <span className="text-amber-300 font-bold">berat terbesar</span> dan{" "}
              <span className="text-amber-300 font-bold">kandungan air paling banyak</span>.
              Buah yang akan diteliti pertama adalah ....
            </p>
            <MCQ qn={4} correct={1} options={["A. Buah A", "B. Buah B", "C. Buah C", "D. Buah D"]} />
            <PembahasanBtn n={4} />
            {expandedPembahasan.has(4) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. Buah B</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <p className="text-white/70 mb-1">Urutkan berat dari terbesar ke terkecil:</p>
                  <p className="text-white/70 ml-3">B (130,7) &gt; C (130,55) &gt; A (118,4) &gt; D (96,255)</p>
                  <p className="text-white/70 mb-1 mt-2">Urutkan kandungan air dari terbanyak:</p>
                  <p className="text-white/70 ml-3">B (150) &gt; C (140) &gt; D (118,15) &gt; A (96,3)</p>
                  <p className="text-green-300 font-bold mt-2 ml-3">→ Buah B memiliki berat terbesar (130,7 gr) sekaligus kandungan air terbanyak (150 mL).</p>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 5 ══════════════ */}
          <Soal n={5} elemen="Bilangan" subelemen="Bilangan Real">
            <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
              Pada beberapa jenis makanan, suhu penyimpanan yang terlalu tinggi dapat menyebabkan
              makanan tersebut menjadi cepat basi. Gambar di bawah ini menunjukkan berbagai suhu
              penyimpanan makanan di dalam lemari pendingin menurut Departemen Pertanian Amerika
              Serikat (FDA).
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal5.png" alt="Tabel suhu penyimpanan FDA soal 5" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3 text-xs font-body text-white/60">
              <p><span className="text-white/80 font-semibold">Catatan:</span> daging unggas adalah daging yang berasal dari burung ternak seperti ayam, merpati dan sebagainya. Daging merah adalah daging yang berasal dari mamalia ternak seperti sapi, kambing dan sebagainya.</p>
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Berdasarkan saran FDA, berapa suhu lemari pendingin yang direkomendasikan untuk menyimpan daging ayam?
            </p>
            <MCQ qn={5} correct={0} cols={1} options={[
              "A. 18 derajat di bawah 0 °C",
              "B. 18 derajat di atas 0 °C",
              "C. 19 derajat di bawah 0 °C",
              "D. 19 derajat di atas 0 °C",
            ]} />
            <PembahasanBtn n={5} />
            {expandedPembahasan.has(5) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A. 18 derajat di bawah 0 °C</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep</p>
                  <p className="text-white/70">Rekomendasi FDA untuk penyimpanan daging unggas (ayam): 0°F atau di bawahnya.</p>
                  <div className="ml-3 my-1"><BlockMath math="0°F \approx -17{,}8°C \approx -18°C" /></div>
                  <p className="text-white/70">Artinya: <span className="text-green-300 font-bold">18 derajat di bawah 0°C</span>.</p>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 6 ══════════════ */}
          <Soal n={6} elemen="Aljabar" subelemen="Bentuk Aljabar">
            <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
              Diketahui bentuk aljabar berikut ini.
            </p>
            <div className="my-3 flex justify-center">
              <BlockMath math="2ab - b^2 + 3a^2b + ab^2 - 5" />
            </div>
            <p className="font-body text-white/80 text-sm mb-2">
              Tentukan <span className="text-green-300 font-bold">Benar</span> atau{" "}
              <span className="text-red-300 font-bold">Salah</span> pada setiap pernyataan berikut terkait bentuk aljabar tersebut!
            </p>
            <TrueFalseTable qn={6} rows={[
              { key: "a", text: "Terdapat 2 variabel yaitu a dan b.", correct: "benar" },
              { key: "b", text: "Konstanta pada bentuk aljabar tersebut adalah 5.", correct: "salah" },
              { key: "c", text: <span>Bilangan 2, −1, 3, dan 1 merupakan koefisien.</span>, correct: "benar" },
            ]} />
            <PembahasanBtn n={6} />
            {expandedPembahasan.has(6) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar / Salah / Benar</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">
                    <span className="text-green-300 font-bold">① BENAR</span> — Variabel dalam <InlineMath math="2ab - b^2 + 3a^2b + ab^2 - 5" /> adalah <InlineMath math="a" /> dan <InlineMath math="b" /> (2 variabel).
                  </p>
                  <p className="text-white/70 ml-3 mb-1">
                    <span className="text-red-300 font-bold">② SALAH</span> — Konstantanya adalah <InlineMath math="-5" />, bukan 5 (tanda negatif merupakan bagian dari konstanta).
                  </p>
                  <p className="text-white/70 ml-3">
                    <span className="text-green-300 font-bold">③ BENAR</span> — Koefisien dari <InlineMath math="ab" /> adalah 2, dari <InlineMath math="b^2" /> adalah −1, dari <InlineMath math="a^2b" /> adalah 3, dari <InlineMath math="ab^2" /> adalah 1.
                  </p>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 7 ══════════════ */}
          <Soal n={7} elemen="Aljabar" subelemen="Fungsi">
            <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
              Perhatikan diagram panah berikut ini.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal7.png" alt="Tiga diagram panah soal 7" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm mb-2">
              Apakah diagram 1, diagram 2, dan diagram 3 merupakan fungsi?
              Tentukan <span className="text-cyan-300 font-bold">Fungsi</span> atau{" "}
              <span className="text-orange-300 font-bold">Bukan Fungsi</span> pada setiap diagram berikut!
            </p>
            <CategoryTable
              qn={7}
              colA="Fungsi"
              colB="Bukan Fungsi"
              rows={[
                { key: "d1", text: "Diagram 1" },
                { key: "d2", text: "Diagram 2" },
                { key: "d3", text: "Diagram 3" },
              ]}
              correctKey={{ d1: "Bukan Fungsi", d2: "Fungsi", d3: "Fungsi" }}
            />
            <PembahasanBtn n={7} />
            {expandedPembahasan.has(7) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep Fungsi</p>
                  <p className="text-white/70">Suatu relasi disebut <span className="text-cyan-300 font-bold">fungsi</span> jika setiap anggota domain (himpunan asal) dipasangkan tepat dengan <span className="text-cyan-300">satu</span> anggota kodomain. Jika ada anggota domain yang berpasangan dengan lebih dari satu anggota kodomain, maka relasi tersebut <span className="text-red-300">bukan fungsi</span>.</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs">📌 Lihat diagram panah pada dokumen soal asli dan terapkan konsep di atas untuk menentukan jawaban masing-masing diagram.</p>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 8 ══════════════ */}
          <Soal n={8} elemen="Aljabar" subelemen="Fungsi">
            <p className="font-body text-white/90 text-sm leading-relaxed mb-2">
              Pembayaran air PDAM setiap rumah berbeda-beda tergantung banyaknya pemakaian air.
              Biaya pemasangan awal adalah{" "}
              <span className="text-amber-300 font-bold">Rp800.000,00</span>.
              Tarif pemakaian air berdasarkan banyak air yang digunakan dengan pemasangan awal
              dapat dilihat pada grafik berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal8.png" alt="Grafik tarif pemakaian air PDAM soal 8" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Seseorang menghabiskan biaya{" "}
              <span className="text-amber-300 font-bold">Rp920.000,00</span> dalam 1 bulan
              pemakaian dengan pemasangan baru.
            </p>
            <p className="font-body text-white/80 text-sm mb-2">
              Tentukan <span className="text-green-300 font-bold">Benar</span> atau{" "}
              <span className="text-red-300 font-bold">Salah</span> pada setiap pernyataan berikut!
            </p>
            <TrueFalseTable qn={8} rows={[
              { key: "a", text: <span>Jumlah pemakaian air mencapai 60 m³.</span>, correct: "salah" },
              { key: "b", text: <span>Orang tersebut akan menghabiskan biaya sebesar Rp120.000,00 jika tanpa pemasangan baru.</span>, correct: "benar" },
              { key: "c", text: <span>Tarif dapat mencapai 1 juta jika pemakaian air kurang dari 90 m³ dengan pemasangan baru.</span>, correct: "benar" },
            ]} />
            <PembahasanBtn n={8} />
            {expandedPembahasan.has(8) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Analisis</p>
                  <p className="text-white/70 mb-1">Total biaya = Rp920.000 = biaya pemasangan + biaya pemakaian air</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Biaya air} = \text{Rp920.000} - \text{Rp800.000} = \text{Rp120.000}" /></div>
                  <p className="text-white/70 ml-3 mb-1">
                    <span className="text-green-300 font-bold">② BENAR</span> — Biaya air (tanpa pemasangan) = Rp120.000. ✓
                  </p>
                  <p className="text-white/70 ml-3 mb-1">
                    <span className="text-red-300 font-bold">① SALAH</span> — Pemakaian 60 m³ atau bukan bergantung tarif per m³ pada grafik.
                  </p>
                  <p className="text-white/70 ml-3">
                    <span className="text-green-300 font-bold">③ BENAR</span> — Rp1.000.000 dengan pemasangan baru: biaya air = Rp200.000. Berdasarkan grafik, Rp200.000 dapat dicapai dengan pemakaian &lt; 90 m³.
                  </p>
                </div>
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs">📌 Untuk pernyataan ① dan ③, lihat grafik pada dokumen soal asli untuk konfirmasi nilai pemakaian air.</p>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 9 ══════════════ */}
          <Soal n={9} elemen="Aljabar" subelemen="Fungsi">
            <p className="font-body text-white/90 text-sm leading-relaxed mb-2">
              <span className="text-amber-300 font-bold">Pekarangan Rumah</span>
            </p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Ayunda mulai memanfaatkan lahan kosong di pekarangan rumahnya untuk menanam berbagai
              jenis tanaman. Setelah melihat tanamannya tumbuh subur, ia berencana untuk menanam
              pohon mangga di pekarangan tersebut. Berikut adalah peta pekarangan rumah Ayunda.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal9.png" alt="Peta pekarangan koordinat kartesius soal 9" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Dalam menentukan lokasi penanaman, Ayunda harus mempertimbangkan beberapa faktor
              penting yaitu ketersediaan sinar matahari dan kualitas tanah. Berdasarkan beberapa
              faktor tersebut, Ayunda hanya akan menanam pohon mangga di{" "}
              <span className="text-amber-300 font-bold">lokasi 1, 3, dan 4</span> hanya pada
              lahan yang masih kosong (belum ada tanaman lain) di lokasi tersebut.
            </p>
            <p className="font-body text-white/80 text-sm mb-2">
              Tentukan <span className="text-green-300 font-bold">"Bisa ditanami pohon mangga"</span> atau{" "}
              <span className="text-red-300 font-bold">"Tidak bisa ditanami pohon mangga"</span> untuk koordinat berikut!
            </p>
            <CategoryTable
              qn={9}
              colA="Bisa ditanami"
              colB="Tidak bisa"
              rows={[
                { key: "c1", text: <span>Koordinat (9, −2)</span> },
                { key: "c2", text: <span>Koordinat (−2, 9)</span> },
                { key: "c3", text: <span>Koordinat (−9, −9)</span> },
              ]}
              correctKey={{ c1: "Bisa ditanami", c2: "Tidak bisa", c3: "Tidak bisa" }}
            />
            <PembahasanBtn n={9} />
            {expandedPembahasan.has(9) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Cara Menyelesaikan</p>
                  <p className="text-white/70 mb-2">Langkah-langkah:</p>
                  <ol className="list-decimal list-inside space-y-1 text-white/70 ml-2">
                    <li>Tentukan apakah koordinat tersebut berada di Lokasi 1, 3, atau 4 (bukan Lokasi 2 dan lainnya).</li>
                    <li>Periksa apakah pada koordinat tersebut sudah ada tanaman lain atau belum (masih kosong).</li>
                    <li>Jika koordinat berada di Lokasi 1/3/4 <span className="text-cyan-300">DAN</span> masih kosong → Bisa ditanami.</li>
                  </ol>
                </div>
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs">📌 Lihat peta pekarangan (koordinat kartesius) pada dokumen soal asli untuk menentukan posisi dan status masing-masing koordinat.</p>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 10 ══════════════ */}
          <Soal n={10} elemen="Aljabar" subelemen="Persamaan dan Pertidaksamaan Linear">
            <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
              Diketahui pertidaksamaan sebagai berikut.
            </p>
            <div className="my-3 flex justify-center">
              <BlockMath math="3x + 17 \leq 7 - 2x" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Manakah garis bilangan yang menunjukkan himpunan penyelesaian dari pertidaksamaan tersebut?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["A","B","C","D"] as const).map((opt, i) => (
                <div
                  key={i}
                  className={`border rounded-lg p-2 text-xs font-body transition-all flex flex-col items-center gap-1 cursor-pointer
                    ${selectedAnswers[10] === i
                      ? i === 1
                        ? "bg-green-900/30 border-green-500/50"
                        : "bg-red-900/30 border-red-500/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/40 active:scale-95"
                    }
                    ${selectedAnswers[10] !== undefined && i === 1 ? "bg-green-900/30 border-green-500/50" : ""}
                  `}
                  onClick={() => selectAnswer(10, i)}
                >
                  <img
                    src={`/tka-2025-soal10${opt.toLowerCase()}.png`}
                    alt={`Pilihan ${opt} soal 10`}
                    className="w-full rounded"
                  />
                  <div className="flex items-center justify-between w-full px-1">
                    <span className={`font-bold ${selectedAnswers[10] === i ? (i === 1 ? "text-green-300" : "text-red-300") : "text-white/70"}`}>{opt}.</span>
                    {selectedAnswers[10] !== undefined && i === 1 && <span className="text-green-400 font-bold">✓</span>}
                    {selectedAnswers[10] === i && i !== 1 && <span className="text-red-400 font-bold">✗</span>}
                  </div>
                </div>
              ))}
            </div>
            <PembahasanBtn n={10} />
            {expandedPembahasan.has(10) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B (garis bilangan dengan x ≤ −2)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-3 space-y-1">
                    <div className="my-1"><BlockMath math="3x + 17 \leq 7 - 2x" /></div>
                    <div className="my-1"><BlockMath math="3x + 2x \leq 7 - 17" /></div>
                    <div className="my-1"><BlockMath math="5x \leq -10" /></div>
                    <div className="my-1"><BlockMath math="x \leq -2" /></div>
                  </div>
                  <p className="text-white/70 ml-3 mt-2">Himpunan penyelesaian: <InlineMath math="x \leq -2" /></p>
                  <p className="text-white/70 ml-3">Garis bilangan: <span className="text-amber-300">lingkaran tertutup (●) di −2, dengan arsiran ke kiri (−∞).</span></p>
                </div>
              </div>
            )}
          </Soal>

        </div>

          {/* ══════════════ SOAL 11 ══════════════ */}
          <Soal n={11} elemen="Aljabar" subelemen="Persamaan dan Pertidaksamaan Linear">
            <p className="font-body text-white/90 text-sm font-bold mb-2">Jajanan Tradisional</p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-2">
              Jajanan tradisional merupakan makanan khas dari nenek moyang dan biasanya digunakan untuk acara atau tradisi. Seiring berjalannya waktu, jajanan tradisional bisa dijumpai dan ditemukan setiap hari tidak hanya saat acara tertentu.
            </p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Berikut merupakan harga jajanan tradisional kue putu mayang dan kue pancong yang dijual di sebuah bazar makanan.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal11.png" alt="Gambar kue putu mayang dan kue pancong soal 11" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm mb-3">
              Berapa harga <span className="text-amber-300 font-bold">3 kotak kue putu mayang</span> dan <span className="text-amber-300 font-bold">1 kotak kue pancong</span>?
            </p>
            <MCQ qn={11} correct={3} options={[
              "A. Rp10.000,00",
              "B. Rp14.000,00",
              "C. Rp44.000,00",
              "D. Rp52.000,00",
            ]} />
            <PembahasanBtn n={11} />
            {expandedPembahasan.has(11) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D (Rp52.000,00)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian (SPLDV)</p>
                  <p className="text-white/70 mb-1">Misal: p = harga putu mayang, c = harga pancong</p>
                  <div className="ml-2 space-y-1">
                    <div className="my-1"><BlockMath math="2p + 3c = 58.000 \quad \cdots (1)" /></div>
                    <div className="my-1"><BlockMath math="3p + 2c = 62.000 \quad \cdots (2)" /></div>
                  </div>
                  <p className="text-white/70 mt-2 mb-1">Eliminasi: (1)×3 − (2)×2:</p>
                  <div className="ml-2 space-y-1">
                    <div className="my-1"><BlockMath math="9c - 4c = 174.000 - 124.000 \Rightarrow 5c = 50.000 \Rightarrow c = 10.000" /></div>
                    <div className="my-1"><BlockMath math="2p + 3(10.000) = 58.000 \Rightarrow p = 14.000" /></div>
                    <div className="my-1"><BlockMath math="3p + c = 3(14.000) + 10.000 = 42.000 + 10.000 = 52.000" /></div>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 12 ══════════════ */}
          <Soal n={12} elemen="Aljabar" subelemen="Bentuk Aljabar">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Rino, Tiko, dan Bayu pergi ke toko buku untuk membeli buku tulis dan pulpen. Keterangan pembelian:
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal12.png" alt="Keterangan pembelian buku soal 12" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 font-body text-xs space-y-1 text-white/80">
              <p>• <span className="text-cyan-300 font-bold">Rino</span> membeli <span className="text-amber-300">4 buku tulis</span> dan <span className="text-amber-300">3 pulpen</span></p>
              <p>• <span className="text-cyan-300 font-bold">Tiko</span> membeli <span className="text-amber-300">dua kali lipat</span> dari masing-masing jumlah Rino</p>
              <p>• <span className="text-cyan-300 font-bold">Bayu</span> membeli <span className="text-amber-300">tiga kali lipat</span> dari masing-masing jumlah Rino</p>
            </div>
            <p className="font-body text-white/80 text-sm mb-3">
              Jika harga 1 buku = <InlineMath math="x" /> dan 1 pulpen = <InlineMath math="y" />, bagaimana kalimat matematika total harga ketiganya?
            </p>
            <MCQ qn={12} correct={0} options={[
              "A. 24x + 18y",
              "B. 20x + 15y",
              "C. 12x + 9y",
              "D. 4x + 3y",
            ]} />
            <PembahasanBtn n={12} />
            {expandedPembahasan.has(12) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A (24x + 18y)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-1 text-white/70">
                    <p>Total buku: 4 + 8 + 12 = <span className="text-amber-300 font-bold">24</span></p>
                    <p>Total pulpen: 3 + 6 + 9 = <span className="text-amber-300 font-bold">18</span></p>
                    <div className="my-1"><BlockMath math="\text{Total} = 24x + 18y" /></div>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 13 ══════════════ */}
          <Soal n={13} elemen="Aljabar" subelemen="Fungsi">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Naura menggunakan operator seluler "Nusantara Mobile". Naura menuliskan pilihan paket kuota dan harganya dalam bentuk himpunan pasangan berurutan:
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal13.png" alt="Paket kuota Nusantara Mobile soal 13" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm mb-3">
              Jika <InlineMath math="x" /> adalah paket kuota dalam GB, rumus fungsi <InlineMath math="f(x)" /> yang menyatakan harga paket kuota adalah …
            </p>
            <MCQ qn={13} correct={3} cols={1} options={[
              "A.  f(x) = 2.000x + 4.000",
              "B.  f(x) = 2.000x + 1.000",
              "C.  f(x) = 1.800x + 9.000",
              "D.  f(x) = 1.800x + 5.000",
            ]} />
            <PembahasanBtn n={13} />
            {expandedPembahasan.has(13) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D — f(x) = 1.800x + 5.000</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-1">
                    <p className="text-white/70">Gradien (slope):</p>
                    <div className="my-1"><BlockMath math="m = \frac{23.000 - 14.000}{10 - 5} = \frac{9.000}{5} = 1.800" /></div>
                    <p className="text-white/70">Nilai b (konstanta):</p>
                    <div className="my-1"><BlockMath math="14.000 = 1.800(5) + b \Rightarrow b = 14.000 - 9.000 = 5.000" /></div>
                    <p className="text-white/70">Verifikasi: f(20) = 1800(20)+5000 = 41.000 ✓, f(25) = 1800(25)+5000 = 50.000 ✓</p>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ BACAAN 2 (Soal 14 & 15) ══════════════ */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 mb-4">
            <p className="text-blue-300 font-display font-bold text-xs mb-2">📖 BACAAN 2 — untuk menjawab Soal Nomor 14 dan 15</p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-bacaan2.png" alt="Bacaan 2 pola batu bata" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Suatu kompleks X memiliki kebiasaan membuat pagar rumah dengan desain yang unik. Hampir seluruh warga kompleks X menyusun pagar membentuk pola barisan. Desain pagar rumah tersebut disusun menggunakan <span className="text-amber-300 font-bold">2 jenis batu bata</span>, yang jika dilihat dari depan batu bata tersebut terlihat berbentuk segitiga dan persegi panjang. Batu bata tersebut disusun membentuk pola seperti gambar di bawah.
            </p>
          </div>

          {/* ══════════════ SOAL 14 ══════════════ */}
          <Soal n={14} elemen="Aljabar" subelemen="Barisan dan Deret">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              <span className="text-amber-300 italic">(Perhatikan Bacaan 2)</span><br />
              Jika ingin dibuat pagar dengan <span className="text-amber-300 font-bold">10 tingkat</span> susunan batu bata, berapakah jumlah total batu bata (segitiga maupun persegi panjang) yang ada pada <span className="text-amber-300 font-bold">tingkat ke-10</span> dari pagar tersebut?
            </p>
            <MCQ qn={14} correct={3} options={[
              "A. 10 batu bata",
              "B. 11 batu bata",
              "C. 20 batu bata",
              "D. 21 batu bata",
            ]} />
            <PembahasanBtn n={14} />
            {expandedPembahasan.has(14) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D (21 batu bata)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-1">
                    <p className="text-white/70">Pola: tingkat ke-n = n segitiga + (n+1) persegi = 2n+1 batu bata</p>
                    <div className="my-1"><BlockMath math="\text{Tingkat ke-10} = 2(10) + 1 = 21" /></div>
                    <p className="text-white/70">→ 10 segitiga + 11 persegi panjang = 21 batu bata</p>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 15 ══════════════ */}
          <Soal n={15} elemen="Aljabar" subelemen="Barisan dan Deret">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              <span className="text-amber-300 italic">(Perhatikan Bacaan 2)</span><br />
              Dua pagar yang sama persis dengan masing-masing memiliki <span className="text-amber-300 font-bold">9 tingkat</span> akan dibangun. Tetapi hanya ada persediaan sebanyak <span className="text-green-300 font-bold">60 batu bata segitiga</span> dan <span className="text-purple-300 font-bold">80 batu bata persegi panjang</span>. Apakah jumlah kedua jenis batu bata tersebut cukup untuk membuat kedua pagar?
            </p>
            <TrueFalseTable qn={15} rows={[
              { key: "a", text: <span>Diperlukan tambahan <span className="text-amber-300 font-bold">15</span> batu bata segitiga.</span> },
              { key: "b", text: <span>Diperlukan tambahan <span className="text-amber-300 font-bold">28</span> batu bata persegi panjang.</span> },
              { key: "c", text: <span>Diperlukan tambahan total sebanyak <span className="text-amber-300 font-bold">43</span> batu bata baik segitiga maupun persegi panjang.</span> },
            ]} correctKey={{ a: "Salah", b: "Benar", c: "Salah" }} />
            <PembahasanBtn n={15} />
            {expandedPembahasan.has(15) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Salah / Benar / Salah</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-2 text-white/70">
                    <div>
                      <p className="font-bold text-white/80">Segitiga per pagar (9 tingkat): <InlineMath math="1+2+\cdots+9 = \frac{9 \cdot 10}{2} = 45" /></p>
                      <p>Untuk 2 pagar = 90 segitiga. Kurang = 90 − 60 = <span className="text-red-300 font-bold">30</span> (bukan 15 → Salah)</p>
                    </div>
                    <div>
                      <p className="font-bold text-white/80">Persegi panjang per pagar: <InlineMath math="2+3+\cdots+10 = \frac{9(2+10)}{2} = 54" /></p>
                      <p>Untuk 2 pagar = 108 persegi. Kurang = 108 − 80 = <span className="text-green-300 font-bold">28</span> (Benar)</p>
                    </div>
                    <div>
                      <p>Total tambahan = 30 + 28 = <span className="text-red-300 font-bold">58</span> (bukan 43 → Salah)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 16 ══════════════ */}
          <Soal n={16} elemen="Geometri dan Pengukuran" subelemen="Objek Geometri">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Garis AB dan garis PQ berpotongan di titik Q. Sudut yang terbentuk:
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal16.png" alt="Garis AB dan PQ berpotongan soal 16" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm mb-3">Nilai <InlineMath math="x" /> yang tepat adalah …</p>
            <MCQ qn={16} correct={1} options={[
              "A. 15°",
              "B. 24°",
              "C. 69°",
              "D. 96°",
            ]} />
            <PembahasanBtn n={16} />
            {expandedPembahasan.has(16) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B (x = 24°)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <p className="text-white/70 mb-1">Sudut 72° dan (4x+12)° berpelurus (membentuk garis lurus AB):</p>
                  <div className="ml-2 space-y-1">
                    <div className="my-1"><BlockMath math="72° + (4x + 12)° = 180°" /></div>
                    <div className="my-1"><BlockMath math="4x + 84 = 180" /></div>
                    <div className="my-1"><BlockMath math="4x = 96 \Rightarrow x = 24°" /></div>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 17 ══════════════ */}
          <Soal n={17} elemen="Geometri dan Pengukuran" subelemen="Objek Geometri">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Perhatikan gambar jaring-jaring prisma segitiga berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal17.png" alt="Jaring-jaring prisma segitiga soal 17" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Sisi tutup pada prisma adalah <span className="text-amber-300 font-bold">sisi ABC</span>. Rusuk <span className="text-cyan-300 font-bold">AC</span> pada sisi tutup akan berhimpit dengan salah satu rusuk pada sisi tegak prisma nomor …
            </p>
            <MCQ qn={17} correct={1} options={[
              "A. 1",
              "B. 2",
              "C. 3",
              "D. 4",
            ]} />
            <PembahasanBtn n={17} />
            {expandedPembahasan.has(17) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B (Sisi tegak nomor 2)</div>
                <p className="text-white/60">Saat jaring-jaring dilipat menjadi prisma, rusuk AC pada sisi tutup berhimpit dengan rusuk pada sisi tegak nomor 2 yang berbagi titik sudut A dan C. Lihat posisi sisi tegak pada jaring-jaring soal asli.</p>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 18 ══════════════ */}
          <Soal n={18} elemen="Geometri dan Pengukuran" subelemen="Objek Geometri">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Perhatikan gambar dua garis sejajar <InlineMath math="p \parallel q" /> yang dipotong transversal berikut ini.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal18.png" alt="Dua garis sejajar p dan q dipotong transversal soal 18" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm mb-3">Berdasarkan gambar tersebut, berapa nilai <InlineMath math="b" />?</p>
            <MCQ qn={18} correct={1} options={[
              "A. 46",
              "B. 68",
              "C. 112",
              "D. 134",
            ]} />
            <PembahasanBtn n={18} />
            {expandedPembahasan.has(18) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B (b = 68°)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-1 text-white/70">
                    <p>Karena <InlineMath math="p \parallel q" />, sudut 68° dan sudut di bawah garis p (sudut dalam berseberangan) adalah sama besar.</p>
                    <p>Sudut <InlineMath math="b°" /> merupakan sudut dalam berseberangan (Z-angle / alternate interior angle) dengan sudut 68° pada garis p.</p>
                    <div className="my-1"><BlockMath math="b = 68°" /></div>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 19 ══════════════ */}
          <Soal n={19} elemen="Geometri dan Pengukuran" subelemen="Objek Geometri">
            <p className="font-body text-white/90 text-sm font-bold mb-2">Pagar Tangga</p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Pak Anton baru saja membangun rumah. Ada beberapa bagian dalam rumahnya yang belum terpasang. Salah satunya adalah pagar tangga. Pagar tangga berfungsi untuk pegangan saat naik maupun turun tangga. Berikut adalah gambar tangga Pak Anton.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal19.png" alt="Gambar tangga Pak Anton soal 19" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Gambar garis putus-putus adalah rancangan pagar tangga. Setiap anak tangga memiliki tinggi yang sama yaitu <span className="text-amber-300 font-bold">25 cm</span>. Tersedia 4 jenis bahan:
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-body text-white/70">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2">🪵 Kayu jati: <span className="text-amber-300">6 m</span></div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2">🪵 Kayu meranti: <span className="text-amber-300">4 m</span></div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2">⚙️ Besi: <span className="text-amber-300">5,5 m</span></div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2">🔩 Aluminium: <span className="text-amber-300">4,5 m</span></div>
            </div>
            <p className="font-body text-white/80 text-sm mb-3">
              Jenis bahan apa yang harus dipilih Pak Anton agar <span className="text-green-300 font-bold">cukup</span> untuk membuat pagar tangga dan memiliki <span className="text-cyan-300 font-bold">sisa paling sedikit</span>?
            </p>
            <MCQ qn={19} correct={1} cols={1} options={[
              "A. Pagar kayu jati (6 m)",
              "B. Pagar kayu meranti (4 m)",
              "C. Pagar besi (5,5 m)",
              "D. Pagar aluminium (4,5 m)",
            ]} />
            <PembahasanBtn n={19} />
            {expandedPembahasan.has(19) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B (Pagar kayu meranti 4 m)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian (Teorema Pythagoras)</p>
                  <div className="ml-2 space-y-1 text-white/70">
                    <p>Horizontal (alas) = 150 cm, Vertikal (tinggi) = 6 × 25 = 150 cm</p>
                    <div className="my-1"><BlockMath math="\text{Pagar} = \sqrt{150^2 + 150^2} = 150\sqrt{2} \approx 212 \text{ cm} = 2{,}12 \text{ m}" /></div>
                    <p>Semua pilihan ≥ 4 m cukup. Sisa paling sedikit = yang terpendek dari pilihan yang cukup:</p>
                    <p>4 m − 2,12 m = <span className="text-green-300 font-bold">1,88 m</span> (paling kecil) → <span className="text-amber-300 font-bold">Kayu meranti (4 m)</span></p>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 20 ══════════════ */}
          <Soal n={20} elemen="Geometri dan Pengukuran" subelemen="Transformasi Geometri">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Perhatikan dua segitiga kongruen pada koordinat kartesius berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal20.png" alt="Koordinat kartesius segitiga PQR dan KLM soal 20" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Diketahui titik <span className="text-amber-300 font-bold">Q = titik K</span>. Segitiga PQR akan ditranslasikan oleh{" "}
              <InlineMath math="T = (-4, -2)" />. Bayangan segitiga PQR dan segitiga KLM akan saling …
            </p>
            <MCQ qn={20} correct={3} options={[
              "A. Tegak lurus",
              "B. Berpotongan",
              "C. Sejajar",
              "D. Berhimpit",
            ]} />
            <PembahasanBtn n={20} />
            {expandedPembahasan.has(20) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D (Berhimpit)</div>
                <p className="text-white/70">Karena Q = K dan translasi T = (−4, −2) memindahkan segitiga PQR sehingga Q' bertepatan dengan K, dan kedua segitiga kongruen, maka bayangan PQR (yaitu P'Q'R') akan <span className="text-amber-300 font-bold">berhimpit</span> dengan segitiga KLM.</p>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 21 ══════════════ */}
          <Soal n={21} elemen="Geometri dan Pengukuran" subelemen="Pengukuran">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Perhatikan gambar juring pada lingkaran di bawah ini.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal21.png" alt="Gambar juring lingkaran soal 21" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm mb-3">Manakah pernyataan yang benar terkait luas juring A, B, dan C?</p>
            <MCQ qn={21} correct={0} cols={1} options={[
              "A. Luas juring B dua kali dari luas juring C.",
              "B. Luas juring C setengah dari luas juring A.",
              "C. Luas juring A tiga kali dari luas juring B.",
              "D. Luas juring B dua kali dari luas juring A.",
            ]} />
            <PembahasanBtn n={21} />
            {expandedPembahasan.has(21) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A (Luas juring B = 2 × luas juring C)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-1 text-white/70">
                    <p>Sudut juring: B = 70°, C = 35°, A = 360° − 70° − 35° = 255°</p>
                    <p>Luas juring ∝ sudut pusat</p>
                    <div className="my-1"><BlockMath math="\frac{\text{Luas B}}{\text{Luas C}} = \frac{70°}{35°} = 2" /></div>
                    <p>→ Luas juring B = <span className="text-green-300 font-bold">2 × Luas juring C</span> ✓</p>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 22 ══════════════ */}
          <Soal n={22} elemen="Geometri dan Pengukuran" subelemen="Pengukuran">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Perhatikan dua persegi panjang berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal22.png" alt="Dua persegi panjang sebangun soal 22" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Diketahui luas persegi panjang yang lebih besar adalah <span className="text-amber-300 font-bold">320 cm²</span> dan kedua persegi panjang tersebut <span className="text-cyan-300 font-bold">sebangun</span>. Berapakah keliling persegi panjang yang lebih kecil?
            </p>
            <MCQ qn={22} correct={1} options={[
              "A. 9 cm",
              "B. 18 cm",
              "C. 20 cm",
              "D. 72 cm",
            ]} />
            <PembahasanBtn n={22} />
            {expandedPembahasan.has(22) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B (18 cm)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-1">
                    <p className="text-white/70">Persegi besar: tinggi = 20 cm, luas = 320 cm²</p>
                    <div className="my-1"><BlockMath math="\text{Lebar besar} = \frac{320}{20} = 16 \text{ cm}" /></div>
                    <p className="text-white/70">Skala kesebangunan: <InlineMath math="k = \frac{5}{20} = \frac{1}{4}" /></p>
                    <p className="text-white/70">Persegi kecil: lebar = 16 × ¼ = 4 cm, tinggi = 5 cm</p>
                    <div className="my-1"><BlockMath math="K = 2(5 + 4) = 18 \text{ cm}" /></div>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ BACAAN 3 (Soal 23 & 24) ══════════════ */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 mb-4">
            <p className="text-blue-300 font-display font-bold text-xs mb-2">📖 BACAAN 3 — untuk menjawab Soal Nomor 23 dan 24</p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Pak Dodi adalah pemasok minyak goreng curah di Pasar Maju. Minyak goreng curah adalah minyak goreng tanpa kemasan khusus dan tidak memiliki label atau merek. Terdapat dua jenis minyak goreng curah yang dijual Pak Dodi yakni jenis A dan jenis B. Masing-masing jenis minyak goreng dimasukkan dalam tangki berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-bacaan3.png" alt="Bacaan 3 tangki minyak goreng" className="max-w-full rounded-lg border border-white/10" />
            </div>
          </div>

          {/* ══════════════ SOAL 23 ══════════════ */}
          <Soal n={23} elemen="Geometri dan Pengukuran" subelemen="Pengukuran">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              <span className="text-amber-300 italic">(Perhatikan Bacaan 3)</span><br />
              Minyak jenis B pada tangki yang berisi penuh akan dikemas ke botol dan jeriken. Sebanyak <span className="text-amber-300 font-bold">300 botol berukuran 2 liter</span> diisi minyak curah jenis B. Sisa minyak dikemas ke dalam <span className="text-cyan-300 font-bold">jeriken berukuran 5 liter</span>.
            </p>
            <p className="font-body text-white/80 text-sm mb-3">Bagaimana perbandingan banyak kemasan botol dan jeriken? <span className="text-amber-300 text-xs">(Pilih semua jawaban benar!)</span></p>
            <ComplexMCQ qn={23} items={[
              {
                text: "Jumlah kemasan botol lebih banyak daripada jeriken.",
                correct: true,
                explanation: "300 botol > 232 jeriken ✓",
              },
              {
                text: "Total kemasan botol dan jeriken yang terisi adalah 532.",
                correct: true,
                explanation: "300 + 232 = 532 ✓",
              },
              {
                text: "Sisa minyak di tangki cukup untuk mengisi 1 kemasan botol.",
                correct: false,
                explanation: "Sisa minyak = 0 (1160 ÷ 5 = 232 pas, tidak ada sisa) ✗",
              },
              {
                text: "Banyak kemasan jeriken yang terisi minyak adalah 332.",
                correct: false,
                explanation: "Jeriken = 232, bukan 332 ✗",
              },
            ]} />
            <PembahasanBtn n={23} />
            {expandedPembahasan.has(23) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1 dan 2 Benar</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-1 text-white/70">
                    <p>Volume tangki B = 1.760 L</p>
                    <p>Botol: 300 × 2 = 600 L terpakai</p>
                    <p>Sisa untuk jeriken: 1.760 − 600 = <span className="text-amber-300">1.160 L</span></p>
                    <div className="my-1"><BlockMath math="\text{Jeriken} = \frac{1.160}{5} = 232 \text{ buah}" /></div>
                    <p>Total kemasan: 300 + 232 = <span className="text-green-300 font-bold">532</span>, botol (300) &gt; jeriken (232) ✓</p>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 24 ══════════════ */}
          <Soal n={24} elemen="Geometri dan Pengukuran" subelemen="Pengukuran">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-2">
              Hari ini di toko Pak Dodi kedatangan dua pelanggan minyak curah yakni Pak Angga dan Bu Susi. Pak Angga dan Bu Susi membawa jeriken untuk wadah minyak dalam jumlah banyak. Jeriken minyak Pak Angga berukuran <span className="text-amber-300 font-bold">25 liter</span>, jeriken minyak milik Bu Susi berukuran <span className="text-cyan-300 font-bold">30 liter</span>. Pak Dodi memiliki persediaan <span className="text-green-300 font-bold">1 tangki minyak jenis A</span> dan <span className="text-green-300 font-bold">1 tangki minyak jenis B</span>. Pak Angga dan Bu Susi membeli <span className="text-green-300 font-bold">seluruh</span> minyak tersebut sehingga tidak ada lagi sisa minyak di tangki. Seluruh jeriken yang dibawa berisi penuh dan masing-masing mendapatkan kedua jenis minyak.
            </p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Bagaimana kemungkinan perbandingan banyaknya jeriken Pak Angga dan Bu Susi? <span className="text-amber-300 text-xs">Tentukan <strong>Mungkin</strong> atau <strong>Tidak Mungkin</strong> pada setiap pernyataan berikut!</span>
            </p>
            <CategoryTable
              qn={24}
              colA="Mungkin"
              colB="Tidak Mungkin"
              rows={[
                { key: "r1", text: <span>Bu Susi membawa 32 jeriken minyak jenis A dan 22 jeriken minyak jenis B.</span> },
                { key: "r2", text: <span>Pak Angga membawa 24 jeriken minyak jenis A dan 44 jeriken minyak jenis B.</span> },
                { key: "r3", text: <span>Bu Susi membawa 21 jeriken minyak jenis A dan Pak Angga membawa 40 jeriken minyak jenis B.</span> },
              ]}
              correctKey={{ r1: "Tidak Mungkin", r2: "Mungkin", r3: "Tidak Mungkin" }}
            />
            <PembahasanBtn n={24} />
            {expandedPembahasan.has(24) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Tidak Mungkin / Mungkin / Tidak Mungkin</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-2 text-white/70">
                    <div>
                      <p className="font-bold text-white/80">Pernyataan 1 (Bu Susi: 32 jar A + 22 jar B):</p>
                      <p>A Bu Susi = 32 × 30 = 960 L → Pak Angga dapat 0 L jenis A. Melanggar syarat "masing-masing mendapat kedua jenis" → <span className="text-red-300">Tidak Mungkin</span></p>
                    </div>
                    <div>
                      <p className="font-bold text-white/80">Pernyataan 2 (Pak Angga: 24 jar A + 44 jar B):</p>
                      <p>A: 24×25=600L, Bu Susi A: (960−600)/30=12 jeriken ✓</p>
                      <p>B: 44×25=1100L, Bu Susi B: (1760−1100)/30=22 jeriken ✓ → <span className="text-green-300">Mungkin</span></p>
                    </div>
                    <div>
                      <p className="font-bold text-white/80">Pernyataan 3 (Bu Susi: 21 jar A, Pak Angga: 40 jar B):</p>
                      <p>A Bu Susi=21×30=630L, Pak Angga A=(960−630)/25=330/25=13,2 (bukan bilangan bulat) → <span className="text-red-300">Tidak Mungkin</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 25 ══════════════ */}
          <Soal n={25} elemen="Data dan Peluang" subelemen="Data">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Karet dan kelapa sangat penting bagi banyak industri di dunia, mulai dari ban hingga makanan. Indonesia adalah penghasil utama keduanya, dan meskipun ada tantangan dalam produksi, kedua komoditas ini tetap penting untuk ekonomi Indonesia dan pasokan global. Berikut adalah data produksi karet dan kelapa di Indonesia.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal25-tabel.png" alt="Tabel produksi karet dan kelapa 2018-2024 soal 25" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm mb-3">
              Berdasarkan data di atas, diagram garis manakah yang menunjukkan penyajian data dari salah satu hasil produksi karet atau kelapa di Indonesia?
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(["A","B","C","D"] as const).map((opt, i) => (
                <div
                  key={i}
                  className={`border rounded-lg p-2 text-xs font-body transition-all flex flex-col items-center gap-1 cursor-pointer
                    ${selectedAnswers[25] === i
                      ? i === 1
                        ? "bg-green-900/30 border-green-500/50"
                        : "bg-red-900/30 border-red-500/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/40 active:scale-95"
                    }
                    ${selectedAnswers[25] !== undefined && i === 1 ? "bg-green-900/30 border-green-500/50" : ""}
                  `}
                  onClick={() => selectAnswer(25, i)}
                >
                  <img
                    src={`/tka-2025-soal25${opt.toLowerCase()}.png`}
                    alt={`Pilihan ${opt} soal 25`}
                    className="w-full rounded"
                  />
                  <div className="flex items-center justify-between w-full px-1">
                    <span className={`font-bold ${selectedAnswers[25] === i ? (i === 1 ? "text-green-300" : "text-red-300") : "text-white/70"}`}>{opt}.</span>
                    {selectedAnswers[25] !== undefined && i === 1 && <span className="text-green-400 font-bold">✓</span>}
                    {selectedAnswers[25] === i && i !== 1 && <span className="text-red-400 font-bold">✗</span>}
                  </div>
                </div>
              ))}
            </div>
            <PembahasanBtn n={25} />
            {expandedPembahasan.has(25) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B (diagram karet — konsisten menurun)</div>
                <p className="text-white/70">Data karet turun <span className="text-amber-300">monoton</span> setiap tahun: 3,68 → 3,50 → 3,30 → 3,12 → 2,95 → 2,75 → 2,60. Diagram B yang menunjukkan garis turun terus-menerus adalah yang benar.</p>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 26 ══════════════ */}
          <Soal n={26} elemen="Data dan Peluang" subelemen="Data">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Tory suka sekali bermain game online. Dia selalu mengabaikan batasan waktu dalam bermain game online. Belakangan ini Tory sering merasa gelisah dan mudah marah apabila tidak diijinkan bermain. Dia juga sering merasakan sakit mata dan pusing. Dokter mengatakan bahwa Tory telah kecanduan bermain game online. Tory harus berusaha perlahan-lahan mengontrol waktu bermainnya. Dokter mengatakan bahwa batas waktu maksimal Tory diperbolehkan bermain adalah <span className="text-amber-300 font-bold">7 jam dalam satu minggu</span>. Selama <span className="text-amber-300 font-bold">12 minggu</span>, waktu bermain game Tory terus dipantau oleh kedua orang tuanya dan dilaporkan ke dokter.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal26.png" alt="Diagram batang durasi Tory bermain game soal 26" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm mb-3">
              Dalam 12 minggu terakhir, Tory paling sering menghabiskan waktu bermain game online setiap minggunya yaitu selama …
            </p>
            <MCQ qn={26} correct={1} options={[
              "A. 10 jam",
              "B. 14 jam",
              "C. 20 jam",
              "D. 22 jam",
            ]} />
            <PembahasanBtn n={26} />
            {expandedPembahasan.has(26) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B (14 jam)</div>
                <p className="text-white/70">Data: 22, 20, 18, 20, <span className="text-amber-300 font-bold">14</span>, 16, <span className="text-amber-300 font-bold">14</span>, <span className="text-amber-300 font-bold">14</span>, 12, <span className="text-amber-300 font-bold">14</span>, 10, 12</p>
                <p className="text-white/70"><span className="text-amber-300 font-bold">Modus = 14</span> (muncul 4 kali — paling sering)</p>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 27 ══════════════ */}
          <Soal n={27} elemen="Data dan Peluang" subelemen="Data">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-2">
              Tory suka sekali bermain game online. Dia selalu mengabaikan batasan waktu dalam bermain game online. Belakangan ini Tory sering merasa gelisah dan mudah marah apabila tidak diijinkan bermain. Dia juga sering merasakan sakit mata dan pusing. Dokter mengatakan bahwa Tory telah kecanduan bermain game online. Tory harus berusaha perlahan-lahan mengontrol waktu bermainnya. Dokter mengatakan bahwa batas waktu maksimal Tory diperbolehkan bermain adalah <span className="text-amber-300 font-bold">7 jam dalam satu minggu</span>.
            </p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Selama <span className="text-amber-300 font-bold">12 minggu</span>, waktu bermain game Tory terus dipantau oleh kedua orang tuanya dan dilaporkan ke dokter.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal27-bar.png" alt="Diagram batang durasi Tory bermain game online setiap minggu soal 27" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Dokter dan orang tua Tory memahami bahwa tidak mudah menghilangkan kecanduan bermain game online, namun mereka ingin terus memantau bagaimana perkembangan Tory. Dokter membuat skema sebagai berikut.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal27.png" alt="Diagram fase penyembuhan soal 27" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-2">
              Dokter memantau dan membandingkan rata-rata jam bermain game online setiap 4 minggu dan menyebutnya sebagai <span className="text-amber-300 font-bold">fase</span>.
            </p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-2">
              <span className="text-cyan-300 font-bold">Fase pertama</span> membandingkan rata-rata jam bermain pada 4 minggu pertama dengan rata-rata jam bermain pada 4 minggu kedua.
            </p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-2">
              <span className="text-cyan-300 font-bold">Fase kedua</span> membandingkan rata-rata jam bermain pada 4 minggu kedua dengan rata-rata jam bermain pada 4 minggu ketiga.
            </p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-2">
              <span className="text-cyan-300 font-bold">Fase akhir</span> membandingkan rata-rata jam bermain pada 4 minggu ketiga dengan batas waktu maksimal yang disarankan.
            </p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Hal tersebut dilakukan untuk melihat perkembangan kebiasaan Tory dalam bermain game online. Apakah yang terjadi pada Tory selama fase penyembuhan?
            </p>
            <p className="font-body text-white/80 text-sm mb-2">
              <span className="text-amber-300 text-xs font-bold">Pilihlah semua jawaban benar! Jawaban benar lebih dari satu.</span>
            </p>
            <ComplexMCQ qn={27} items={[
              {
                text: "Fase pertama berkurang 5,5 jam.",
                correct: true,
                explanation: "Rata-rata Fase 1 (20) → Fase 2 (14,5): berkurang 5,5 jam ✓",
              },
              {
                text: "Fase kedua berkurang 2,25 jam.",
                correct: false,
                explanation: "Fase 2 (14,5) → Fase 3 (12): berkurang 2,5 jam, bukan 2,25 ✗",
              },
              {
                text: "Fase akhir berkurang 5,25 jam.",
                correct: false,
                explanation: "Fase 3 (12) → batas (7): berkurang 5 jam, bukan 5,25 ✗",
              },
              {
                text: "Fase penyembuhan berkurang 8 jam.",
                correct: true,
                explanation: "Total turun dari Fase 1 (20) ke Fase 3 (12) = berkurang 8 jam ✓",
              },
            ]} />
            <PembahasanBtn n={27} />
            {expandedPembahasan.has(27) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1 dan 4 Benar</div>
                <div className="ml-2 space-y-1 text-white/70">
                  <p>• Fase 1→2: 20 − 14,5 = <span className="text-green-300 font-bold">5,5 jam</span> ✓</p>
                  <p>• Fase 2→3: 14,5 − 12 = 2,5 jam (bukan 2,25) ✗</p>
                  <p>• Fase 3→batas: 12 − 7 = 5 jam (bukan 5,25) ✗</p>
                  <p>• Total Fase 1→3: 20 − 12 = <span className="text-green-300 font-bold">8 jam</span> ✓</p>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 28 ══════════════ */}
          <Soal n={28} elemen="Data dan Peluang" subelemen="Peluang">
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Suatu paket terdiri dari <span className="text-amber-300 font-bold">20 kotak misteri</span>. Kotak misteri tersebut berisi patung figur karakter yang bernama <span className="text-blue-300 font-bold">Saka</span> dan <span className="text-pink-300 font-bold">Kirana</span>. Berikut ini banyak paket figur karakter yang tersedia dalam satu paket.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal28.png" alt="Figur Saka 8 buah dan Kirana 12 buah soal 28" className="max-w-full rounded-lg border border-white/10" />
            </div>

            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Riana mengambil <span className="text-amber-300 font-bold">3 kotak secara acak</span> dan mendapat <span className="text-blue-300 font-bold">1 Saka + 2 Kirana</span>. Kemudian, <span className="text-cyan-300 font-bold">Santi</span> akan mengambil 1 kotak misteri. Berapakah peluang Santi mendapatkan <span className="text-blue-300 font-bold">Saka</span>?
            </p>
            <MCQ qn={28} correct={3} options={[
              "A. 7/20",
              "B. 8/20",
              "C. 8/17",
              "D. 7/17",
            ]} />
            <PembahasanBtn n={28} />
            {expandedPembahasan.has(28) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D (7/17)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-1 text-white/70">
                    <p>Setelah Riana ambil 1 Saka + 2 Kirana:</p>
                    <p>Sisa kotak: 20 − 3 = <span className="text-amber-300">17 kotak</span></p>
                    <p>Sisa Saka: 8 − 1 = <span className="text-blue-300">7 Saka</span></p>
                    <div className="my-1"><BlockMath math="P(\text{Saka}) = \frac{7}{17}" /></div>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 29 ══════════════ */}
          <Soal n={29} elemen="Data dan Peluang" subelemen="Peluang">
            <p className="font-body text-white/90 text-sm font-bold mb-2">Mesin Tetas Telur</p>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Mesin tetas telur adalah sebuah alat yang digunakan untuk membantu proses penetasan telur. Cara kerja alat atau mesin ini adalah melakukan proses pengeraman tanpa induk dengan menggunakan sebuah lampu pijar. Mesin ini dilengkapi dengan motor yang berfungsi untuk meratakan proses pemanasan telur agar telur dapat menetas secara maksimal. Mesin ini umumnya hanya bisa digunakan untuk menetaskan telur unggas seperti telur ayam, puyuh, bebek, dan entok.
            </p>
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal29.png" alt="Gambar mesin tetas telur soal 29" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Mesin tetas telur menetaskan telur dalam <span className="text-amber-300 font-bold">18 hari</span>. Saat ini terdapat telur puyuh di dalam mesin dengan rincian:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-amber-900/30 text-amber-300">
                    <th className="border border-white/10 px-3 py-1.5 text-left">Usia Telur di Dalam Mesin</th>
                    <th className="border border-white/10 px-3 py-1.5 text-center">Banyak Telur</th>
                    <th className="border border-white/10 px-3 py-1.5 text-center">Sisa hari tetas</th>
                  </tr>
                </thead>
                <tbody>
                  {[["2 hari", "20", "16 hari"],["4 hari","35","14 hari"],["6 hari","30","12 hari"],["8 hari","15","10 hari"]].map(([usia,n,sisa],i)=>(
                    <tr key={i} className={i===3 ? "bg-green-900/20 text-green-300 font-bold" : "text-white/80"}>
                      <td className="border border-white/10 px-3 py-1.5">{usia}</td>
                      <td className="border border-white/10 px-3 py-1.5 text-center">{n}</td>
                      <td className="border border-white/10 px-3 py-1.5 text-center">{sisa}</td>
                    </tr>
                  ))}
                  <tr className="bg-white/5 text-amber-300 font-bold">
                    <td className="border border-white/10 px-3 py-1.5">Total</td>
                    <td className="border border-white/10 px-3 py-1.5 text-center">100</td>
                    <td className="border border-white/10 px-3 py-1.5 text-center">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="font-body text-white/80 text-sm mb-3">
              Jika dilakukan pengamatan pada satu telur yang dipilih secara acak, berapakah peluang telur tersebut akan menetas dalam <span className="text-amber-300 font-bold">10 hari ke depan</span>?
            </p>
            <MCQ qn={29} correct={0} options={[
              "A. 3/20",
              "B. 1/15",
              "C. 1/10",
              "D. 1/8",
            ]} />
            <PembahasanBtn n={29} />
            {expandedPembahasan.has(29) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A (3/20)</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-1 text-white/70">
                    <p>Telur menetas dalam ≤ 10 hari → sisa hari tetas ≤ 10</p>
                    <p>→ Hanya telur berusia <span className="text-green-300 font-bold">8 hari</span> (sisa 10 hari) yang memenuhi syarat: <span className="text-amber-300 font-bold">15 telur</span></p>
                    <div className="my-1"><BlockMath math="P = \frac{15}{100} = \frac{3}{20}" /></div>
                  </div>
                </div>
              </div>
            )}
          </Soal>

          {/* ══════════════ SOAL 30 ══════════════ */}
          <Soal n={30} elemen="Data dan Peluang" subelemen="Peluang">
            <div className="mb-3 flex justify-center">
              <img src="/tka-2025-soal30.png" alt="Guru ujian matematika kode soal A B atau C soal 30" className="max-w-full rounded-lg border border-white/10" />
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Seorang guru menyiapkan sejumlah kertas soal ujian yang digulung dan dimasukkan ke dalam sebuah kotak. Setiap kertas berisi kode soal <span className="text-amber-300 font-bold">A, B, atau C</span>.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 font-body text-xs text-white/80 space-y-1">
              <p>• Jumlah kertas kode A <span className="text-amber-300 font-bold">lebih sedikit</span> dari kode B</p>
              <p>• Guru mengambil <span className="text-amber-300 font-bold">3 kertas berkode sama</span> dari kotak</p>
              <p>• Sisa kertas di kotak menjadi <span className="text-amber-300 font-bold">28 lembar</span></p>
              <p>• Kertas kode B <span className="text-amber-300 font-bold">lebih banyak</span> dari kode C setelah pengambilan</p>
              <p>• Jika diambil 1 kertas secara acak: P(kode C) = <InlineMath math="\frac{2}{7}" /></p>
            </div>
            <p className="font-body text-white/80 text-sm mb-3">
              Berapakah kemungkinan jumlah kertas soal ujian kode B mula-mula? <span className="text-amber-300 text-xs">(Jawaban benar lebih dari satu)</span>
            </p>
            <ComplexMCQ qn={30} items={[
              {
                text: "10 lembar",
                correct: false,
                explanation: "B=10 → A+10+8=31, A=13. Tapi A<B syaratnya 13<10 ✗",
              },
              {
                text: "11 lembar",
                correct: false,
                explanation: "B=11 → B−3=8=C, syarat B−3>C tidak terpenuhi (8≯8) ✗",
              },
              {
                text: "12 lembar",
                correct: true,
                explanation: "B=12 → A=11, C=8. A<B: 11<12 ✓, B−3=9>8=C ✓",
              },
              {
                text: "14 lembar",
                correct: true,
                explanation: "B=14 → A=9, C=8. A<B: 9<14 ✓, B−3=11>8=C ✓",
              },
            ]} />
            <PembahasanBtn n={30} />
            {expandedPembahasan.has(30) && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: 12 lembar dan 14 lembar</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Penyelesaian</p>
                  <div className="ml-2 space-y-1 text-white/70">
                    <p>Total awal: A + B + C = 28 + 3 = <span className="text-amber-300">31</span></p>
                    <p>P(C setelah) = C/28 = 2/7 → <span className="text-amber-300">C = 8</span></p>
                    <p>A + B = 31 − 8 = 23, dengan A &lt; B dan B−3 &gt; 8 → B &gt; 11</p>
                    <p>B ≥ 12. Dari pilihan: <span className="text-green-300 font-bold">B = 12</span> (A=11) dan <span className="text-green-300 font-bold">B = 14</span> (A=9) keduanya valid ✓</p>
                  </div>
                </div>
              </div>
            )}
          </Soal>

        {/* ── Footer ── */}
        <div className="mt-8 bg-green-900/20 border border-green-500/30 rounded-xl p-4 text-center">
          <p className="text-green-300 font-display font-bold text-sm mb-1">✅ Semua 30 Soal Lengkap!</p>
          <p className="text-white/50 text-xs font-body">Sumber: Soal Asli TKA Matematika SMP Tahun 2025.</p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/tka"); }}
            className="text-sm text-muted-foreground hover:text-amber-300 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke TKA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKASoalAsli2025Page;
