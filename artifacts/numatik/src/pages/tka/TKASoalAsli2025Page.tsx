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
              <span className="text-amber-300 font-bold ml-1">Soal 1 – 10</span>
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

        {/* ── Footer ── */}
        <div className="mt-8 bg-amber-900/15 border border-amber-500/20 rounded-xl p-4 text-center">
          <p className="text-amber-300 font-display font-bold text-sm mb-1">📋 Soal 1 – 10 dari 30 Soal</p>
          <p className="text-white/50 text-xs font-body">Soal 11 – 30 akan segera ditambahkan. Sumber: Soal Asli TKA Matematika SMP Tahun 2025.</p>
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
