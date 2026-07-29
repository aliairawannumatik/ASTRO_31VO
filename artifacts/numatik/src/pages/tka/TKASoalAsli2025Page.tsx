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
      <ImageNote text="Tabel voucher cashback (Voucher A, B, C, D beserta nilainya) tersedia pada dokumen soal asli." />
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
              <span className="text-amber-300 font-bold ml-1">Soal 1 – 20</span>
              <span className="text-white/30">dari 30 soal</span>
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
            <ImageNote text="Lihat tabel voucher cashback (Voucher A, B, C, D beserta nilai persentase dan batas maksimalnya) pada dokumen soal asli untuk menentukan jawaban." />
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
            <ImageNote text="Pernyataan pada tabel (baris 1, 2, 3) beserta tabel voucher tersedia pada dokumen soal asli." />
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
                  {[1, 2, 3].map(i => (
                    <tr key={i}>
                      <td className="border border-white/10 px-3 py-3 text-white/40 italic text-xs">
                        [Pernyataan {i} — lihat dokumen soal asli]
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
            <ImageNote text="Gambar tabel suhu penyimpanan FDA (menampilkan suhu untuk berbagai jenis makanan termasuk daging unggas) tersedia pada dokumen soal asli." />
            <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3 text-xs font-body text-white/60">
              <p><span className="text-white/80 font-semibold">Catatan:</span> Daging unggas = daging ayam, merpati, dsb. Daging merah = daging sapi, kambing, dsb.</p>
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
            <ImageNote text="Tiga diagram panah (Diagram 1, Diagram 2, Diagram 3) tersedia pada dokumen soal asli." />
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
            <ImageNote text="Grafik fungsi linear tarif pemakaian air PDAM tersedia pada dokumen soal asli." />
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
            <ImageNote text="Peta pekarangan (koordinat kartesius dengan posisi tanaman dan lokasi 1, 3, 4) tersedia pada dokumen soal asli." />
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
            <ImageNote text="Pilihan A, B, C, D berupa gambar garis bilangan tersedia pada dokumen soal asli. Himpunan penyelesaian: x ≤ −2 (lingkaran tertutup di −2, garis ke kiri)." />
            <div className="grid grid-cols-2 gap-2">
              {["A", "B", "C", "D"].map((opt, i) => (
                <div
                  key={i}
                  className={`border rounded-lg px-3 py-3 text-xs font-body transition-all flex items-center justify-between cursor-pointer
                    ${selectedAnswers[10] === i
                      ? i === 1
                        ? "bg-green-900/30 border-green-500/50 text-green-300 font-bold"
                        : "bg-red-900/30 border-red-500/50 text-red-300"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-amber-500/40 active:scale-95"
                    }
                    ${selectedAnswers[10] !== undefined && i === 1 ? "bg-green-900/30 border-green-500/50 text-green-300 font-bold" : ""}
                  `}
                  onClick={() => selectAnswer(10, i)}
                >
                  <span>{opt}. [Garis bilangan — lihat soal asli]</span>
                  {selectedAnswers[10] !== undefined && i === 1 && <span className="text-green-400 font-bold shrink-0 ml-2">✓</span>}
                  {selectedAnswers[10] === i && i !== 1 && <span className="text-red-400 font-bold shrink-0 ml-2">✗</span>}
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
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Berikut merupakan harga jajanan tradisional kue putu mayang dan kue pancong yang dijual di sebuah bazar makanan.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 font-body text-sm space-y-1">
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-green-300">●</span>
                <span><span className="text-green-300 font-bold">2 kotak putu mayang</span> + <span className="text-red-300 font-bold">3 kotak pancong</span> = <span className="text-amber-300 font-bold">Rp58.000</span></span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-green-300">●</span>
                <span><span className="text-green-300 font-bold">3 kotak putu mayang</span> + <span className="text-red-300 font-bold">2 kotak pancong</span> = <span className="text-amber-300 font-bold">Rp62.000</span></span>
              </div>
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
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 font-body text-xs space-y-1 text-white/80">
              <p>• <span className="text-cyan-300 font-bold">Rino</span> membeli <span className="text-amber-300">4 buku tulis</span> dan <span className="text-amber-300">3 pulpen</span></p>
              <p>• <span className="text-cyan-300 font-bold">Tiko</span> membeli <span className="text-amber-300">dua kali lipat</span> dari masing-masing jumlah Rino → 8 buku, 6 pulpen</p>
              <p>• <span className="text-cyan-300 font-bold">Bayu</span> membeli <span className="text-amber-300">tiga kali lipat</span> dari masing-masing jumlah Rino → 12 buku, 9 pulpen</p>
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
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 text-center">
              <p className="font-body text-xs text-amber-300 font-bold mb-1">Paket Kuota Internet Nusantara Mobile</p>
              <p className="font-body text-sm text-white/90 font-mono">{"{(5, 14.000), (10, 23.000), (20, 41.000), (25, 50.000)}"}</p>
              <p className="font-body text-[10px] text-white/50 mt-1">(kuota dalam GB, harga dalam Rupiah)</p>
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
            <p className="font-body text-white/80 text-sm leading-relaxed mb-3">
              Suatu kompleks X memiliki kebiasaan membuat pagar rumah dengan desain yang unik. Desain pagar disusun menggunakan <span className="text-amber-300 font-bold">2 jenis batu bata</span> berbentuk segitiga (▲) dan persegi panjang (▬), membentuk pola bertingkat.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-2 font-body text-xs text-white/80">
              <p className="text-amber-300 font-bold mb-2">Pola pada setiap tingkat:</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[1,2,3].map(k => (
                  <div key={k} className="bg-white/5 rounded-lg py-2">
                    <p className="text-cyan-300 font-bold text-xs">Tingkat {k}</p>
                    <p className="text-white/70 text-[10px] mt-1">{k} segitiga ▲</p>
                    <p className="text-white/70 text-[10px]">{k+1} persegi panjang ▬</p>
                    <p className="text-amber-300 text-[10px] font-bold">{2*k+1} batu bata</p>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-[10px] mt-2 text-center">Pola: tingkat ke-n → n segitiga + (n+1) persegi = (2n+1) batu bata</p>
            </div>
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
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-3 flex justify-center">
              <svg viewBox="0 0 260 160" className="w-56 h-36 font-body">
                {/* Line AB horizontal */}
                <line x1="20" y1="110" x2="240" y2="110" stroke="#94a3b8" strokeWidth="2" />
                {/* Line PQ going upper-right from Q */}
                <line x1="130" y1="110" x2="190" y2="20" stroke="#94a3b8" strokeWidth="2" />
                {/* 72° arc (left side of PQ from AB) */}
                <path d="M 85 110 A 45 45 0 0 1 113 75" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="72" y="95" fill="#fbbf24" fontSize="11" fontFamily="serif">72°</text>
                {/* (4x+12)° arc (right side of PQ from AB) */}
                <path d="M 165 110 A 35 35 0 0 0 148 78" fill="none" stroke="#86efac" strokeWidth="1.5" />
                <text x="155" y="95" fill="#86efac" fontSize="10" fontFamily="serif">(4x+12)°</text>
                {/* Labels */}
                <text x="12" y="104" fill="#94a3b8" fontSize="13" fontFamily="serif">A</text>
                <text x="233" y="104" fill="#94a3b8" fontSize="13" fontFamily="serif">B</text>
                <text x="127" y="122" fill="#94a3b8" fontSize="13" fontFamily="serif">Q</text>
                <text x="188" y="16" fill="#94a3b8" fontSize="13" fontFamily="serif">P</text>
              </svg>
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
            <ImageNote text="Gambar jaring-jaring prisma segitiga dengan 4 sisi tegak bernomor 1–4 dan sisi tutup ABC tersedia pada dokumen soal asli." />
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
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-3 flex justify-center">
              <svg viewBox="0 0 260 180" className="w-56 h-40 font-body">
                {/* Line p (upper) */}
                <line x1="20" y1="50" x2="240" y2="50" stroke="#60a5fa" strokeWidth="2" />
                <text x="5" y="54" fill="#60a5fa" fontSize="12" fontFamily="serif" fontStyle="italic">p</text>
                {/* Line q (lower) */}
                <line x1="20" y1="140" x2="240" y2="140" stroke="#60a5fa" strokeWidth="2" />
                <text x="5" y="144" fill="#60a5fa" fontSize="12" fontFamily="serif" fontStyle="italic">q</text>
                {/* Left transversal: p to between */}
                <line x1="70" y1="50" x2="130" y2="95" stroke="#e2e8f0" strokeWidth="2" />
                {/* Right transversal: between to q */}
                <line x1="130" y1="95" x2="190" y2="140" stroke="#e2e8f0" strokeWidth="2" />
                {/* 68° at p */}
                <path d="M 90 50 A 22 22 0 0 0 75 66" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="94" y="67" fill="#fbbf24" fontSize="11" fontFamily="serif">68°</text>
                {/* b° at middle vertex */}
                <path d="M 113 88 A 18 18 0 0 0 147 88" fill="none" stroke="#f87171" strokeWidth="1.5" />
                <text x="123" y="83" fill="#f87171" fontSize="11" fontFamily="serif" fontStyle="italic">b°</text>
                {/* 46° at q */}
                <path d="M 175 140 A 20 20 0 0 0 162 124" fill="none" stroke="#86efac" strokeWidth="1.5" />
                <text x="176" y="128" fill="#86efac" fontSize="11" fontFamily="serif">46°</text>
              </svg>
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
              Pak Anton baru saja membangun rumah. Berikut adalah gambar tangga Pak Anton.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-3 flex justify-center">
              <svg viewBox="0 0 260 200" className="w-64 h-48 font-body">
                {/* Staircase steps (6 steps) */}
                {[0,1,2,3,4,5].map(i => (
                  <g key={i}>
                    <rect x={20 + i*35} y={170 - i*25} width={35} height={25}
                      fill="rgba(100,120,150,0.3)" stroke="#94a3b8" strokeWidth="1" />
                  </g>
                ))}
                {/* Diagonal dashed pagar line */}
                <line x1="20" y1="170" x2="230" y2="20" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6,3" />
                {/* 150cm label */}
                <line x1="20" y1="183" x2="230" y2="183" stroke="#94a3b8" strokeWidth="1" />
                <text x="105" y="197" fill="#94a3b8" fontSize="11" fontFamily="serif" textAnchor="middle">150 cm</text>
                {/* Arrow heads for 150cm */}
                <text x="14" y="187" fill="#94a3b8" fontSize="10">←</text>
                <text x="220" y="187" fill="#94a3b8" fontSize="10">→</text>
                {/* Step height label */}
                <text x="238" y="108" fill="#e2e8f0" fontSize="10" fontFamily="serif">25 cm</text>
                <text x="238" y="119" fill="#e2e8f0" fontSize="10" fontFamily="serif">per anak</text>
                <text x="238" y="130" fill="#e2e8f0" fontSize="10" fontFamily="serif">tangga</text>
              </svg>
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
            <ImageNote text="Gambar koordinat kartesius dengan segitiga PQR dan segitiga KLM (kongruen) tersedia pada dokumen soal asli." />
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

        {/* ── Footer ── */}
        <div className="mt-8 bg-amber-900/15 border border-amber-500/20 rounded-xl p-4 text-center">
          <p className="text-amber-300 font-display font-bold text-sm mb-1">📋 Soal 1 – 20 dari 30 Soal</p>
          <p className="text-white/50 text-xs font-body">Soal 21 – 30 akan segera ditambahkan. Sumber: Soal Asli TKA Matematika SMP Tahun 2025.</p>
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
