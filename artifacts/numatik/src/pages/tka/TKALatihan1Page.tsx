import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const TKALatihan1Page = () => {
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [selectedComplexAnswers, setSelectedComplexAnswers] = useState<Record<number, Set<number>>>({});
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<Record<string, string>>({});
  const [expandedPembahasan, setExpandedPembahasan] = useState<Set<number>>(new Set());

  const togglePembahasan = (n: number) => {
    playPopSound();
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
    const existing = selectedComplexAnswers[qn] ?? new Set<number>();
    if (existing.has(idx)) return;
    playPopSound();
    setSelectedComplexAnswers(prev => {
      const next = new Set(prev[qn] ?? []);
      next.add(idx);
      return { ...prev, [qn]: next };
    });
  };

  const selectTF = (key: string, choice: string) => {
    if (selectedTrueFalse[key] !== undefined) return;
    playPopSound();
    setSelectedTrueFalse(prev => ({ ...prev, [key]: choice }));
  };

  /* ── Multiple Choice ── */
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
          if (!answered) {
            cls += "bg-white/5 border-white/10 text-white/80 cursor-pointer hover:bg-white/10 hover:border-cyan-500/40 active:scale-95";
          } else if (isCorrect) {
            cls += "bg-green-900/30 border-green-500/50 text-green-300 font-bold";
          } else if (isSelected) {
            cls += "bg-red-900/30 border-red-500/50 text-red-300";
          } else {
            cls += "bg-white/5 border-white/10 text-white/30";
          }
          return (
            <div key={i} className={cls} onClick={() => selectAnswer(qn, i)}>
              <span>{opt}</span>
              {answered && isCorrect && <span className="ml-2 text-green-400 font-bold shrink-0">✓ Benar!</span>}
              {answered && isSelected && !isCorrect && <span className="ml-2 text-red-400 font-bold shrink-0">✗ Salah</span>}
            </div>
          );
        })}
      </div>
    );
  };

  /* ── Checkbox / Complex MCQ ── */
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
          if (!isClicked) {
            cls += "bg-white/5 border-white/10 text-white/80 cursor-pointer hover:bg-white/10 hover:border-cyan-500/40 active:scale-95";
          } else if (item.benar) {
            cls += "bg-green-900/30 border-green-500/50 text-green-300 font-bold";
          } else {
            cls += "bg-red-900/30 border-red-500/50 text-red-300";
          }
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

  /* ── True / False table (generic 2-column) ── */
  const TF2Table = ({ qn, col1, col2, correct1, rows }: {
    qn: number;
    col1: string;
    col2: string;
    correct1: boolean[];  // true = col1 is correct, false = col2 is correct
    rows: React.ReactNode[];
  }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-body border-collapse">
        <thead>
          <tr className="bg-white/10">
            <th className="border border-white/20 px-3 py-2 text-white text-left">Pernyataan</th>
            <th className="border border-white/20 px-2 py-2 text-white text-center">{col1}</th>
            <th className="border border-white/20 px-2 py-2 text-white text-center">{col2}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const k = `${qn}-${ri}`;
            const sel = selectedTrueFalse[k];
            const answered = sel !== undefined;
            const correctChoice = correct1[ri] ? "0" : "1";
            return (
              <tr key={ri} className={answered ? (sel === correctChoice ? "bg-green-900/20" : "bg-red-900/20") : ""}>
                <td className="border border-white/10 px-3 py-2 text-white/80">{row}</td>
                {["0", "1"].map(choice => {
                  const isChosen = sel === choice;
                  const isCorrectCell = correctChoice === choice;
                  let btnCls = "w-full py-1 rounded text-center transition-all cursor-pointer text-xs font-bold ";
                  if (!answered) {
                    btnCls += "bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-white/50";
                  } else if (isCorrectCell) {
                    btnCls += "bg-green-700/50 text-green-300";
                  } else if (isChosen) {
                    btnCls += "bg-red-700/50 text-red-300";
                  } else {
                    btnCls += "bg-white/5 text-white/20";
                  }
                  return (
                    <td key={choice} className="border border-white/10 px-2 py-2 text-center">
                      <div className={btnCls} onClick={() => selectTF(k, choice)}>
                        ○
                        {answered && isChosen && isCorrectCell && " ✓"}
                        {answered && isChosen && !isCorrectCell && " ✗"}
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

  /* ── Benar / Salah table shorthand ── */
  const BenarSalah = ({ qn, correct, rows }: {
    qn: number; correct: boolean[]; rows: React.ReactNode[];
  }) => (
    <TF2Table qn={qn} col1="Benar" col2="Salah" correct1={correct} rows={rows} />
  );

  /* ── Fungsi / Bukan Fungsi table ── */
  const FungsiBukan = ({ qn, correct, rows }: {
    qn: number; correct: boolean[]; rows: React.ReactNode[];
  }) => (
    <TF2Table qn={qn} col1="Fungsi" col2="Bukan Fungsi" correct1={correct} rows={rows} />
  );

  /* ── Bisa / Tidak bisa table ── */
  const BisaTidak = ({ qn, correct, rows }: {
    qn: number; correct: boolean[]; rows: React.ReactNode[];
  }) => (
    <TF2Table qn={qn} col1="Bisa ditanami cabai" col2="Tidak bisa ditanami cabai" correct1={correct} rows={rows} />
  );

  /* ── Pembahasan sub-components ── */
  const PBJawaban = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3 border bg-gradient-to-r from-green-900/60 to-emerald-900/30 border-green-500/60">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-base border bg-green-500/20 border-green-400/40">✅</div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5 text-green-400">① Jawaban</p>
        <p className="font-bold text-xs leading-snug text-green-200">{children}</p>
      </div>
    </div>
  );

  const PBKonsep = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl px-4 py-3 border bg-gradient-to-r from-violet-900/50 to-purple-900/25 border-violet-500/50">
      <p className="text-[9px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 text-violet-300">
        🧠 ② Konsep &amp; Trik
      </p>
      <div className="text-xs space-y-1.5 text-white/80">{children}</div>
    </div>
  );

  const PBSteps = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl px-4 py-3 border bg-gradient-to-r from-cyan-900/40 to-sky-900/20 border-cyan-500/40">
      <p className="text-[9px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 text-cyan-300">
        📐 ③ Step by Step
      </p>
      <div className="text-xs space-y-2 text-white/80">{children}</div>
    </div>
  );

  const PembahasanBtn = ({ n }: { n: number }) => (
    <button
      onClick={() => togglePembahasan(n)}
      className="mt-3 w-full py-2 rounded-lg text-xs font-body font-semibold transition-all border border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
    >
      {expandedPembahasan.has(n) ? "▲ Tutup Pembahasan" : "▼ Lihat Pembahasan"}
    </button>
  );

  const S = ({ n, children }: { n: number; children: React.ReactNode }) => (
    <div className="flex gap-2 items-start">
      <span className="w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 bg-cyan-500/30 text-cyan-300 border border-cyan-500/30">{n}</span>
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* Header */}
        <div className="bg-card/80 backdrop-blur border border-accent/30 rounded-2xl p-5 mb-6">
          <div className="text-center">
            <img
              src="/logo-numatik.png"
              alt="NUMATIK"
              className="mx-auto mb-2 w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
            />
            <p className="font-body text-white/60 text-xs mb-1">PEMANTAPAN DAN PERSIAPAN</p>
            <h1 className="font-display text-lg font-bold text-primary text-glow-cyan mb-1">TES KEMAMPUAN AKADEMIK (TKA)</h1>
            <p className="font-body text-white/60 text-xs mb-3">TAHUN PELAJARAN 2026/2027</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-left text-xs font-body">
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Mata Pelajaran:</span><span className="text-white ml-1">Matematika</span></div>
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Kelas:</span><span className="text-white ml-1">IX (Sembilan)</span></div>
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Paket:</span><span className="text-accent ml-1 font-bold">PAKET 1</span></div>
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Waktu:</span><span className="text-white ml-1">60 Menit</span></div>
          </div>
        </div>

        {/* Petunjuk */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <p className="font-body text-blue-300 text-xs font-bold mb-2">PETUNJUK UMUM</p>
          <ol className="list-decimal list-inside space-y-1 text-white/70 text-xs font-body">
            <li>Berdoalah sebelum dan sesudah mengerjakan test!</li>
            <li>Isikan identitas Anda dengan benar!</li>
            <li>Jumlah soal sebanyak 30 butir soal.</li>
            <li>Periksa dan bacalah soal-soal dengan cermat sebelum Anda menjawabnya!</li>
            <li>Periksalah pekerjaan Anda sebelum dikirim atau submit!</li>
          </ol>
          <p className="font-body text-yellow-300 text-xs font-bold mt-3 mb-1">PETUNJUK KHUSUS</p>
          <p className="text-white/70 text-xs font-body">Pilihlah salah satu jawaban di bawah ini yang paling benar! Untuk soal tipe benar/salah dan checkbox, pilih sesuai petunjuk masing-masing soal.</p>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-5">

          {/* Q1 — MCQ: Bilangan Berpangkat */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">1</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Hasil dari operasi bilangan berpangkat berikut adalah ....
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 text-center font-body text-white/90 text-sm">
                  <InlineMath math="(5^3 \times 5^{-2}) \div 5^4" />
                </div>
                <MCQ qn={1} correct={0} options={[
                  <span key="a"><InlineMath math="A.\ 5^{-3}" /></span>,
                  <span key="b"><InlineMath math="B.\ 5^{-1}" /></span>,
                  <span key="c"><InlineMath math="C.\ 5^1" /></span>,
                  <span key="d"><InlineMath math="D.\ 5^3" /></span>,
                ]} />
              </div>
            </div>
            <PembahasanBtn n={1} />
            {expandedPembahasan.has(1) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>A. <InlineMath math="5^{-3}" /></PBJawaban>
                <PBKonsep>
                  <p><strong className="text-violet-300">Sifat Perkalian Bilangan Berpangkat:</strong></p>
                  <div className="my-1 text-center"><InlineMath math="a^m \times a^n = a^{m+n}" /></div>
                  <p><strong className="text-violet-300">Sifat Pembagian Bilangan Berpangkat:</strong></p>
                  <div className="my-1 text-center"><InlineMath math="a^m \div a^n = a^{m-n}" /></div>
                  <p className="text-yellow-300/80">🔑 Trik: Kerjakan dari kiri ke kanan — kali dulu, baru bagi.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Hitung bagian perkalian terlebih dahulu:</p>
                    <div className="my-1"><InlineMath math="5^3 \times 5^{-2} = 5^{3+(-2)} = 5^1" /></div>
                  </S>
                  <S n={2}>
                    <p>Lanjutkan dengan pembagian:</p>
                    <div className="my-1"><InlineMath math="5^1 \div 5^4 = 5^{1-4} = 5^{-3}" /></div>
                  </S>
                  <S n={3}>
                    <p>Jadi, hasil operasinya adalah <InlineMath math="5^{-3}" /> → Jawaban <strong className="text-green-300">A</strong>.</p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q2 — Complex MCQ: Diskon */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">2</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Toko <span className="text-yellow-300 font-bold">"Baju Kita"</span> memberikan diskon bertingkat pada setiap transaksi. Berikut pilihan diskon yang tersedia.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 text-xs font-body text-white/80 space-y-1">
                  <p>• <span className="text-cyan-300 font-bold">Diskon A:</span> 20% s/d Rp80.000,00</p>
                  <p>• <span className="text-cyan-300 font-bold">Diskon B:</span> 10% s/d Rp150.000,00</p>
                  <p>• <span className="text-cyan-300 font-bold">Diskon C:</span> 15% s/d Rp50.000,00</p>
                  <p>• <span className="text-cyan-300 font-bold">Diskon D:</span> 30% s/d Rp30.000,00</p>
                  <p className="text-white/50 italic pt-1">Artinya, potongan yang diberikan adalah persentase dari total belanja, tetapi tidak boleh melebihi batas maksimal yang tertulis.</p>
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Rani akan melakukan dua kali transaksi belanja online, masing-masing seharga Rp100.000,00. Setiap transaksi hanya boleh menggunakan satu diskon, dan setiap diskon hanya boleh dipakai satu kali. Jika Rani menginginkan potongan harga <span className="text-yellow-300 font-bold">lebih dari Rp15.000,00</span> pada setiap transaksinya, diskon mana sajakah yang boleh ia pilih?
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={2} items={[
                  { text: "Diskon A", benar: true },
                  { text: "Diskon B", benar: false },
                  { text: "Diskon C", benar: false },
                  { text: "Diskon D", benar: true },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={2} />
            {expandedPembahasan.has(2) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>Diskon A dan Diskon D (keduanya memberikan potongan lebih dari Rp15.000,00)</PBJawaban>
                <PBKonsep>
                  <p>Potongan diskon = persentase × total belanja, <strong className="text-violet-300">tetapi tidak boleh melebihi batas maksimal.</strong></p>
                  <p className="text-yellow-300/80">🔑 Trik: Hitung potongan riil (persentase × belanja), lalu bandingkan dengan batas maks — ambil yang lebih kecil. Kemudian cek apakah hasilnya &gt; Rp15.000.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Transaksi = Rp100.000,00. Hitung potongan riil setiap diskon:</p>
                  </S>
                  <S n={2}>
                    <p><strong className="text-cyan-300">Diskon A</strong> (20%, maks Rp80.000):</p>
                    <p>20% × 100.000 = Rp20.000 &lt; Rp80.000 → potongan = <strong className="text-green-300">Rp20.000 &gt; Rp15.000 ✓</strong></p>
                  </S>
                  <S n={3}>
                    <p><strong className="text-cyan-300">Diskon B</strong> (10%, maks Rp150.000):</p>
                    <p>10% × 100.000 = Rp10.000 → potongan = <strong className="text-red-300">Rp10.000 &lt; Rp15.000 ✗</strong></p>
                  </S>
                  <S n={4}>
                    <p><strong className="text-cyan-300">Diskon C</strong> (15%, maks Rp50.000):</p>
                    <p>15% × 100.000 = Rp15.000 → potongan = <strong className="text-red-300">Rp15.000, tidak LEBIH DARI Rp15.000 ✗</strong></p>
                  </S>
                  <S n={5}>
                    <p><strong className="text-cyan-300">Diskon D</strong> (30%, maks Rp30.000):</p>
                    <p>30% × 100.000 = Rp30.000 = batas maks → potongan = <strong className="text-green-300">Rp30.000 &gt; Rp15.000 ✓</strong></p>
                  </S>
                  <S n={6}>
                    <p>Jawaban benar: <strong className="text-green-300">Diskon A dan Diskon D</strong>.</p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q3 — True/False: Diskon Rani */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">3</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Rani memiliki <span className="text-cyan-300 font-bold">diskon A, C, dan D</span> yang dapat digunakan untuk transaksi berikutnya. Tentukan benar atau salah pernyataan berikut berkaitan dengan nominal transaksi dan diskon yang seharusnya digunakan agar potongan harga paling besar!
                </p>
                <BenarSalah qn={3}
                  correct={[true, false, true]}
                  rows={[
                    "Untuk transaksi Rp200.000,00, diskon A memberikan potongan terbesar dibanding diskon C dan D.",
                    "Untuk transaksi Rp600.000,00, diskon C memberikan potongan terbesar dibanding diskon A dan D.",
                    "Untuk transaksi Rp150.000,00, diskon A dan diskon D memberikan potongan yang sama besar.",
                  ]}
                />
              </div>
            </div>
            <PembahasanBtn n={3} />
            {expandedPembahasan.has(3) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>Pernyataan 1 = Benar, Pernyataan 2 = Salah, Pernyataan 3 = Benar</PBJawaban>
                <PBKonsep>
                  <p>Rani memiliki <strong className="text-violet-300">Diskon A</strong> (20%, maks Rp80.000), <strong className="text-violet-300">Diskon C</strong> (15%, maks Rp50.000), dan <strong className="text-violet-300">Diskon D</strong> (30%, maks Rp30.000).</p>
                  <p className="text-yellow-300/80">🔑 Trik: Hitung potongan riil = min(persen × belanja, batas maks). Lalu bandingkan ketiganya.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p><strong className="text-cyan-300">Pernyataan 1</strong> — Transaksi Rp200.000:</p>
                    <p>A: min(20%×200rb, 80rb) = min(40rb, 80rb) = <strong className="text-green-300">Rp40.000</strong></p>
                    <p>C: min(15%×200rb, 50rb) = min(30rb, 50rb) = Rp30.000</p>
                    <p>D: min(30%×200rb, 30rb) = min(60rb, 30rb) = Rp30.000</p>
                    <p>A terbesar → <strong className="text-green-300">BENAR ✓</strong></p>
                  </S>
                  <S n={2}>
                    <p><strong className="text-cyan-300">Pernyataan 2</strong> — Transaksi Rp600.000:</p>
                    <p>A: min(20%×600rb, 80rb) = min(120rb, 80rb) = <strong className="text-green-300">Rp80.000</strong></p>
                    <p>C: min(15%×600rb, 50rb) = min(90rb, 50rb) = Rp50.000</p>
                    <p>D: min(30%×600rb, 30rb) = min(180rb, 30rb) = Rp30.000</p>
                    <p>A terbesar, bukan C → <strong className="text-red-300">SALAH ✗</strong></p>
                  </S>
                  <S n={3}>
                    <p><strong className="text-cyan-300">Pernyataan 3</strong> — Transaksi Rp150.000:</p>
                    <p>A: min(20%×150rb, 80rb) = min(30rb, 80rb) = <strong className="text-green-300">Rp30.000</strong></p>
                    <p>D: min(30%×150rb, 30rb) = min(45rb, 30rb) = <strong className="text-green-300">Rp30.000</strong></p>
                    <p>Sama besar → <strong className="text-green-300">BENAR ✓</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q4 — MCQ: Data buah */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">4</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah tim gizi meneliti kandungan vitamin C pada beberapa jenis buah. Diduga semakin berat dan semakin banyak kandungan gula suatu buah, semakin banyak pula kandungan vitamin C-nya. Berikut data berat dan kandungan gula empat jenis buah.
                </p>
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="border border-white/20 px-3 py-2 text-white text-left">Buah</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Berat (gr)</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Kandungan Gula (gr)</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/80">
                      <tr><td className="border border-white/10 px-3 py-2">Buah P</td><td className="border border-white/10 px-3 py-2 text-center">145,25</td><td className="border border-white/10 px-3 py-2 text-center">60,40</td></tr>
                      <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">Buah Q</td><td className="border border-white/10 px-3 py-2 text-center">138,70</td><td className="border border-white/10 px-3 py-2 text-center">55,15</td></tr>
                      <tr><td className="border border-white/10 px-3 py-2">Buah R</td><td className="border border-white/10 px-3 py-2 text-center">155,50</td><td className="border border-white/10 px-3 py-2 text-center">65,80</td></tr>
                      <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">Buah S</td><td className="border border-white/10 px-3 py-2 text-center">150,30</td><td className="border border-white/10 px-3 py-2 text-center">62,10</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Karena keterbatasan waktu, pada hari pertama hanya satu buah yang akan diteliti, yaitu buah dengan <span className="text-yellow-300 font-bold">berat terbesar</span> dan <span className="text-yellow-300 font-bold">kandungan gula paling banyak</span>. Buah yang akan diteliti pertama adalah ....
                </p>
                <MCQ qn={4} correct={2} options={[
                  "A. Buah P", "B. Buah Q", "C. Buah R", "D. Buah S",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={4} />
            {expandedPembahasan.has(4) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>C. Buah R (berat 155,50 gr dan kandungan gula 65,80 gr — keduanya terbesar)</PBJawaban>
                <PBKonsep>
                  <p>Soal meminta buah dengan <strong className="text-violet-300">berat terbesar DAN kandungan gula paling banyak</strong> secara bersamaan.</p>
                  <p className="text-yellow-300/80">🔑 Trik: Urutkan tabel untuk setiap kolom lalu cari buah yang menang di kedua kolom sekaligus.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Bandingkan berat semua buah:</p>
                    <p>P=145,25 · Q=138,70 · <strong className="text-green-300">R=155,50</strong> · S=150,30</p>
                    <p>→ Berat terbesar: <strong className="text-green-300">Buah R</strong></p>
                  </S>
                  <S n={2}>
                    <p>Bandingkan kandungan gula semua buah:</p>
                    <p>P=60,40 · Q=55,15 · <strong className="text-green-300">R=65,80</strong> · S=62,10</p>
                    <p>→ Gula terbanyak: <strong className="text-green-300">Buah R</strong></p>
                  </S>
                  <S n={3}>
                    <p>Buah R unggul di kedua kriteria → <strong className="text-green-300">Buah R yang diteliti pertama</strong>.</p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q5 — MCQ: Vaksin */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">5</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Penyimpanan vaksin memerlukan suhu tertentu agar tetap efektif. Berikut rekomendasi suhu penyimpanan beberapa jenis vaksin di dalam lemari pendingin khusus.
                </p>
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="border border-white/20 px-3 py-2 text-white text-left">Jenis Vaksin</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Rekomendasi Suhu</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/80">
                      <tr><td className="border border-white/10 px-3 py-2">Vaksin A</td><td className="border border-white/10 px-3 py-2 text-center"><InlineMath math="\leq -15\,°C" /></td></tr>
                      <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2 font-bold text-cyan-300">Vaksin B</td><td className="border border-white/10 px-3 py-2 text-center"><InlineMath math="= -20\,°C" /></td></tr>
                      <tr><td className="border border-white/10 px-3 py-2">Vaksin C</td><td className="border border-white/10 px-3 py-2 text-center"><InlineMath math="= -8\,°C" /></td></tr>
                      <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">Vaksin D</td><td className="border border-white/10 px-3 py-2 text-center"><InlineMath math="\leq 8\,°C" /></td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berdasarkan tabel tersebut, berapa suhu lemari pendingin yang direkomendasikan untuk menyimpan <span className="text-cyan-300 font-bold">Vaksin B</span>?
                </p>
                <MCQ qn={5} correct={0} cols={1} options={[
                  "A. 20 derajat di bawah 0 °C",
                  "B. 20 derajat di atas 0 °C",
                  "C. 15 derajat di bawah 0 °C",
                  "D. 15 derajat di atas 0 °C",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={5} />
            {expandedPembahasan.has(5) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>A. 20 derajat di bawah 0 °C</PBJawaban>
                <PBKonsep>
                  <p>Suhu negatif berarti di <strong className="text-violet-300">bawah titik beku (0 °C)</strong>. Notasi <InlineMath math="= -20\,°C" /> berarti suhu tersebut tepat −20 °C, yaitu 20 derajat di bawah nol.</p>
                  <p className="text-yellow-300/80">🔑 Trik: Tanda "−" pada suhu = jumlah derajat DI BAWAH 0 °C. Jangan terkecoh dengan angka 15 (itu syarat Vaksin A, bukan B).</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Baca tabel: suhu penyimpanan Vaksin B = <InlineMath math="= -20\,°C" /></p>
                  </S>
                  <S n={2}>
                    <p>Interpretasi: −20 °C artinya 20 derajat di bawah 0 °C.</p>
                  </S>
                  <S n={3}>
                    <p>Jawaban: <strong className="text-green-300">A. 20 derajat di bawah 0 °C</strong>.</p>
                    <p className="text-white/50 text-[10px]">Opsi B salah (di atas 0 = positif). Opsi C dan D menggunakan angka 15 milik Vaksin A, bukan Vaksin B.</p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q6 — True/False: Aljabar */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">6</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-2">
                  Diketahui bentuk aljabar berikut ini.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 text-center font-body text-white/90 text-sm">
                  <InlineMath math="4x^2y - 2xy^2 + 5x^2y - y^2 + 7" />
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut terkait bentuk aljabar tersebut!
                </p>
                <BenarSalah qn={6}
                  correct={[true, true, false]}
                  rows={[
                    "Terdapat 2 variabel yaitu x dan y.",
                    "Konstanta pada bentuk aljabar tersebut adalah 7.",
                    <span key="r3">Bilangan 4, −2, 5, dan 1 merupakan koefisien.</span>,
                  ]}
                />
              </div>
            </div>
            <PembahasanBtn n={6} />
            {expandedPembahasan.has(6) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>Pernyataan 1 = Benar, Pernyataan 2 = Benar, Pernyataan 3 = Salah</PBJawaban>
                <PBKonsep>
                  <p>Pada bentuk aljabar <InlineMath math="4x^2y - 2xy^2 + 5x^2y - y^2 + 7" />:</p>
                  <p>• <strong className="text-violet-300">Variabel</strong>: huruf-huruf yang mewakili nilai berubah (x, y)</p>
                  <p>• <strong className="text-violet-300">Konstanta</strong>: suku tanpa variabel (bilangan tetap)</p>
                  <p>• <strong className="text-violet-300">Koefisien</strong>: bilangan yang mengalikan variabel pada setiap suku</p>
                  <p className="text-yellow-300/80">🔑 Trik: Koefisien suku <InlineMath math="-y^2" /> adalah <InlineMath math="-1" />, bukan 1!</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p><strong className="text-cyan-300">Pernyataan 1:</strong> Variabel yang muncul adalah x dan y → <strong className="text-green-300">BENAR ✓</strong></p>
                  </S>
                  <S n={2}>
                    <p><strong className="text-cyan-300">Pernyataan 2:</strong> Suku tanpa variabel adalah +7 → konstanta = 7 → <strong className="text-green-300">BENAR ✓</strong></p>
                  </S>
                  <S n={3}>
                    <p><strong className="text-cyan-300">Pernyataan 3:</strong> Koefisien dari masing-masing suku:</p>
                    <p><InlineMath math="4x^2y" /> → koef. 4 &nbsp;|&nbsp; <InlineMath math="-2xy^2" /> → koef. −2</p>
                    <p><InlineMath math="5x^2y" /> → koef. 5 &nbsp;|&nbsp; <InlineMath math="-y^2" /> → koef. <strong className="text-red-300">−1</strong> (bukan 1!)</p>
                    <p>Pernyataan menyebut "1" padahal seharusnya "−1" → <strong className="text-red-300">SALAH ✗</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q7 — Fungsi/Bukan Fungsi */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">7</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Diketahui himpunan <InlineMath math="A = \{2, 4, 6, 8\}" /> dan <InlineMath math="B = \{p, q, r, s\}" />. Perhatikan tiga relasi dari A ke B berikut.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 text-xs font-body text-white/80 space-y-1">
                  <p>• <span className="text-cyan-300 font-bold">Relasi 1:</span> 2 → p, 4 → q, 6 → r, 8 → s</p>
                  <p>• <span className="text-cyan-300 font-bold">Relasi 2:</span> 2 → p, 2 → q, 4 → r, 6 → s</p>
                  <p>• <span className="text-cyan-300 font-bold">Relasi 3:</span> 2 → p, 4 → p, 6 → q, 8 → r</p>
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan fungsi atau bukan fungsi pada setiap relasi berikut!
                </p>
                <FungsiBukan qn={7}
                  correct={[true, false, true]}
                  rows={["Relasi 1", "Relasi 2", "Relasi 3"]}
                />
              </div>
            </div>
            <PembahasanBtn n={7} />
            {expandedPembahasan.has(7) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>Relasi 1 = Fungsi, Relasi 2 = Bukan Fungsi, Relasi 3 = Fungsi</PBJawaban>
                <PBKonsep>
                  <p><strong className="text-violet-300">Definisi Fungsi:</strong> Setiap anggota domain (himpunan asal) dipasangkan ke <em>tepat satu</em> anggota kodomain (himpunan kawan).</p>
                  <p className="text-yellow-300/80">🔑 Trik: Cek domain — jika ada satu anggota domain yang dipetakan ke DUA anggota berbeda, bukan fungsi. Boleh banyak domain ke satu kodomain.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p><strong className="text-cyan-300">Relasi 1:</strong> 2→p, 4→q, 6→r, 8→s</p>
                    <p>Setiap anggota A (2,4,6,8) dipetakan ke tepat 1 anggota B → <strong className="text-green-300">FUNGSI ✓</strong></p>
                  </S>
                  <S n={2}>
                    <p><strong className="text-cyan-300">Relasi 2:</strong> 2→p, 2→q, 4→r, 6→s</p>
                    <p>Anggota 2 dipetakan ke DUA anggota (p dan q) → <strong className="text-red-300">BUKAN FUNGSI ✗</strong></p>
                  </S>
                  <S n={3}>
                    <p><strong className="text-cyan-300">Relasi 3:</strong> 2→p, 4→p, 6→q, 8→r</p>
                    <p>Beberapa domain → p, tapi setiap domain dipetakan ke tepat 1 kodomain → <strong className="text-green-300">FUNGSI ✓</strong></p>
                    <p className="text-white/50 text-[10px]">Banyak-ke-satu diperbolehkan dalam fungsi; yang dilarang hanya satu-ke-banyak.</p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q8 — True/False: Persamaan Garis / Listrik */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">8</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah perusahaan listrik prabayar mengenakan biaya admin awal di setiap pembelian token. Berdasarkan grafik hubungan antara pemakaian listrik (kWh) dan total biaya (rupiah), diketahui titik <span className="text-cyan-300 font-bold">(10, 35.000)</span> dan titik <span className="text-cyan-300 font-bold">(30, 75.000)</span> berada pada garis tersebut.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Seseorang membayar total biaya sebesar <span className="text-yellow-300 font-bold">Rp95.000,00</span> dalam satu bulan pemakaian.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut terkait kondisi tersebut!
                </p>
                <BenarSalah qn={8}
                  correct={[true, false, true]}
                  rows={[
                    "Jumlah pemakaian listrik mencapai 40 kWh.",
                    "Biaya admin awal sebesar Rp20.000,00.",
                    "Jika pemakaian mencapai 50 kWh, biaya yang harus dibayar adalah Rp115.000,00.",
                  ]}
                />
              </div>
            </div>
            <PembahasanBtn n={8} />
            {expandedPembahasan.has(8) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>Pernyataan 1 = Benar, Pernyataan 2 = Salah, Pernyataan 3 = Benar</PBJawaban>
                <PBKonsep>
                  <p>Soal ini menggunakan <strong className="text-violet-300">Persamaan Garis Lurus</strong> <InlineMath math="y = mx + c" />, di mana:</p>
                  <p>• <InlineMath math="x" /> = pemakaian listrik (kWh), <InlineMath math="y" /> = total biaya (Rp)</p>
                  <p>• <InlineMath math="m" /> = tarif per kWh, <InlineMath math="c" /> = biaya admin awal (konstan)</p>
                  <p className="text-yellow-300/80">🔑 Trik: Cari gradien dari dua titik, lalu substitusi untuk cari konstanta (biaya admin).</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Dua titik: <InlineMath math="(10,\ 35.000)" /> dan <InlineMath math="(30,\ 75.000)" /></p>
                    <p>Gradien: <InlineMath math="m = \dfrac{75.000 - 35.000}{30 - 10} = \dfrac{40.000}{20} = 2.000" /></p>
                  </S>
                  <S n={2}>
                    <p>Cari biaya admin (konstanta <InlineMath math="c" />):</p>
                    <p><InlineMath math="35.000 = 2.000 \times 10 + c \Rightarrow c = 35.000 - 20.000 = 15.000" /></p>
                    <p>Persamaan: <InlineMath math="y = 2.000x + 15.000" /></p>
                  </S>
                  <S n={3}>
                    <p><strong className="text-cyan-300">P1</strong> — Total biaya Rp95.000: <InlineMath math="95.000 = 2.000x + 15.000 \Rightarrow x = 40" /> kWh → <strong className="text-green-300">BENAR ✓</strong></p>
                  </S>
                  <S n={4}>
                    <p><strong className="text-cyan-300">P2</strong> — Biaya admin = Rp15.000, bukan Rp20.000 → <strong className="text-red-300">SALAH ✗</strong></p>
                  </S>
                  <S n={5}>
                    <p><strong className="text-cyan-300">P3</strong> — Pemakaian 50 kWh: <InlineMath math="y = 2.000(50) + 15.000 = 115.000" /> → <strong className="text-green-300">BENAR ✓</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q9 — Bisa/Tidak: Koordinat Kartesius */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">9</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Warga suatu kompleks perumahan sepakat untuk menanam cabai di lahan kosong pekarangan bersama. Berdasarkan kesepakatan, cabai hanya boleh ditanam pada lahan yang berada di <span className="text-cyan-300 font-bold">kuadran II atau kuadran III</span> pada peta kartesius pekarangan tersebut, dan lahan tersebut harus masih kosong.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan <span className="text-green-300 font-bold">"Bisa ditanami cabai"</span> atau <span className="text-red-300 font-bold">"Tidak bisa ditanami cabai"</span> untuk koordinat berikut ini!
                </p>
                <BisaTidak qn={9}
                  correct={[true, false, true]}
                  rows={[
                    <span key="r1"><InlineMath math="(-5,\ 4)" /></span>,
                    <span key="r2"><InlineMath math="(6,\ -3)" /></span>,
                    <span key="r3"><InlineMath math="(-7,\ -8)" /></span>,
                  ]}
                />
              </div>
            </div>
            <PembahasanBtn n={9} />
            {expandedPembahasan.has(9) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>(-5, 4) = Bisa · (6, -3) = Tidak Bisa · (-7, -8) = Bisa</PBJawaban>
                <PBKonsep>
                  <p><strong className="text-violet-300">Pembagian Kuadran Koordinat Kartesius:</strong></p>
                  <p>• Kuadran I: <InlineMath math="x > 0,\ y > 0" /></p>
                  <p>• Kuadran II: <InlineMath math="x < 0,\ y > 0" /> ← <strong className="text-green-300">boleh ditanami</strong></p>
                  <p>• Kuadran III: <InlineMath math="x < 0,\ y < 0" /> ← <strong className="text-green-300">boleh ditanami</strong></p>
                  <p>• Kuadran IV: <InlineMath math="x > 0,\ y < 0" /></p>
                  <p className="text-yellow-300/80">🔑 Trik: Lihat tanda x dan y. Negatif-positif = Kuadran II. Negatif-negatif = Kuadran III.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p><strong className="text-cyan-300"><InlineMath math="(-5,\ 4)" /></strong>: x = −5 &lt; 0, y = 4 &gt; 0 → <strong className="text-green-300">Kuadran II → Bisa ditanami ✓</strong></p>
                  </S>
                  <S n={2}>
                    <p><strong className="text-cyan-300"><InlineMath math="(6,\ -3)" /></strong>: x = 6 &gt; 0, y = −3 &lt; 0 → <strong className="text-red-300">Kuadran IV → Tidak bisa ditanami ✗</strong></p>
                  </S>
                  <S n={3}>
                    <p><strong className="text-cyan-300"><InlineMath math="(-7,\ -8)" /></strong>: x = −7 &lt; 0, y = −8 &lt; 0 → <strong className="text-green-300">Kuadran III → Bisa ditanami ✓</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q10 — MCQ: Pertidaksamaan */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">10</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-2">
                  Diketahui pertidaksamaan sebagai berikut.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 text-center font-body text-white/90 text-sm">
                  <InlineMath math="5x - 12 \geq 2x + 3" />
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Manakah garis bilangan yang menunjukkan himpunan penyelesaian dari pertidaksamaan tersebut?
                </p>
                <MCQ qn={10} correct={0} cols={1} options={[
                  "A. Titik tertutup di 5, diarsir ke arah bilangan lebih besar (kanan)",
                  "B. Titik terbuka di 5, diarsir ke arah bilangan lebih besar (kanan)",
                  "C. Titik tertutup di 5, diarsir ke arah bilangan lebih kecil (kiri)",
                  "D. Titik terbuka di −5, diarsir ke arah bilangan lebih besar (kanan)",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={10} />
            {expandedPembahasan.has(10) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>A. Titik tertutup di 5, diarsir ke arah bilangan lebih besar (kanan) — karena x ≥ 5</PBJawaban>
                <PBKonsep>
                  <p><strong className="text-violet-300">Pertidaksamaan Linear Satu Variabel (PtLSV):</strong></p>
                  <p>• Operasi hitung kedua ruas (tambah, kurang, kali/bagi bilangan <em>positif</em>) tidak mengubah tanda ketidaksamaan.</p>
                  <p>• Tanda <InlineMath math="\geq" /> → titik <strong className="text-violet-300">tertutup</strong> (nilai tersebut termasuk solusi)</p>
                  <p>• Tanda <InlineMath math=">" /> → titik <strong className="text-violet-300">terbuka</strong> (nilai tersebut tidak termasuk)</p>
                  <p className="text-yellow-300/80">🔑 Trik: Pindahkan suku x ke kiri, konstanta ke kanan, lalu baca arah arsiran dari tanda ketidaksamaan.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Mulai dari pertidaksamaan: <InlineMath math="5x - 12 \geq 2x + 3" /></p>
                  </S>
                  <S n={2}>
                    <p>Pindahkan suku x ke kiri (kurangi 2x kedua ruas):</p>
                    <p><InlineMath math="5x - 2x - 12 \geq 3 \Rightarrow 3x - 12 \geq 3" /></p>
                  </S>
                  <S n={3}>
                    <p>Pindahkan konstanta ke kanan (tambah 12 kedua ruas):</p>
                    <p><InlineMath math="3x \geq 3 + 12 \Rightarrow 3x \geq 15" /></p>
                  </S>
                  <S n={4}>
                    <p>Bagi kedua ruas dengan 3 (positif, tanda tidak berubah):</p>
                    <p><InlineMath math="x \geq 5" /></p>
                  </S>
                  <S n={5}>
                    <p>HP: <InlineMath math="\{x \mid x \geq 5\}" /> → <strong className="text-green-300">titik tertutup di 5, arsir ke kanan</strong> → Jawaban A.</p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q11 — MCQ: SPLDV */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">11</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Di sebuah bazar makanan, harga <span className="text-cyan-300 font-bold">2 kotak kue lapis dan 3 kotak kue lumpur</span> adalah <span className="text-yellow-300 font-bold">Rp42.000,00</span>. Sementara itu, harga <span className="text-cyan-300 font-bold">4 kotak kue lapis dan 1 kotak kue lumpur</span> adalah <span className="text-yellow-300 font-bold">Rp44.000,00</span>.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berapa harga <span className="text-cyan-300 font-bold">2 kotak kue lapis dan 2 kotak kue lumpur</span>?
                </p>
                <MCQ qn={11} correct={2} options={[
                  "A. Rp30.000,00", "B. Rp32.000,00", "C. Rp34.000,00", "D. Rp36.000,00",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={11} />
            {expandedPembahasan.has(11) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>C. Rp34.000,00 (kue lapis Rp9.000 dan kue lumpur Rp8.000)</PBJawaban>
                <PBKonsep>
                  <p><strong className="text-violet-300">Sistem Persamaan Linear Dua Variabel (SPLDV)</strong> — selesaikan dengan eliminasi.</p>
                  <p>Misalkan <InlineMath math="L" /> = harga kue lapis, <InlineMath math="M" /> = harga kue lumpur.</p>
                  <p className="text-yellow-300/80">🔑 Trik: Eliminasi M dengan mengalikan persamaan (ii) agar koefisien M sama dengan (i), lalu kurangi.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Buat persamaan dari soal:</p>
                    <div className="my-1"><InlineMath math="2L + 3M = 42.000 \quad \text{...(i)}" /></div>
                    <div className="my-1"><InlineMath math="4L + 1M = 44.000 \quad \text{...(ii)}" /></div>
                  </S>
                  <S n={2}>
                    <p>Kalikan (ii) dengan 3: <InlineMath math="12L + 3M = 132.000 \quad \text{...(iii)}" /></p>
                    <p>Kurangi (i) dari (iii): <InlineMath math="10L = 90.000 \Rightarrow L = 9.000" /></p>
                  </S>
                  <S n={3}>
                    <p>Substitusi ke (ii): <InlineMath math="4(9.000) + M = 44.000 \Rightarrow M = 8.000" /></p>
                  </S>
                  <S n={4}>
                    <p>Hitung yang ditanya:</p>
                    <div className="my-1"><InlineMath math="2L + 2M = 2(9.000) + 2(8.000) = 18.000 + 16.000 = \mathbf{34.000}" /></div>
                    <p>Jawaban: <strong className="text-green-300">C. Rp34.000,00</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q12 — MCQ: Aljabar (buku gambar & crayon) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">12</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Reni, Sari, dan Dinda pergi ke toko alat tulis untuk membeli buku gambar dan crayon. Berikut keterangannya:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 text-xs font-body text-white/80 space-y-1">
                  <p>• <span className="text-cyan-300 font-bold">Reni</span> membeli 3 buku gambar dan 2 crayon.</p>
                  <p>• <span className="text-cyan-300 font-bold">Sari</span> membeli dua kali lipat dari masing-masing jumlah yang dibeli Reni.</p>
                  <p>• <span className="text-cyan-300 font-bold">Dinda</span> membeli tiga kali lipat dari masing-masing jumlah yang dibeli Reni.</p>
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Apabila harga 1 buku gambar disimbolkan dengan <InlineMath math="x" /> dan harga 1 crayon disimbolkan dengan <InlineMath math="y" />, bagaimana kalimat matematika yang menyatakan total harga yang harus dibayar oleh ketiga anak tersebut?
                </p>
                <MCQ qn={12} correct={0} options={[
                  <span key="a"><InlineMath math="A.\ 18x + 12y" /></span>,
                  <span key="b"><InlineMath math="B.\ 15x + 10y" /></span>,
                  <span key="c"><InlineMath math="C.\ 9x + 6y" /></span>,
                  <span key="d"><InlineMath math="D.\ 3x + 2y" /></span>,
                ]} />
              </div>
            </div>
            <PembahasanBtn n={12} />
            {expandedPembahasan.has(12) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban><span>A. <InlineMath math="18x + 12y" /></span></PBJawaban>
                <PBKonsep>
                  <p>Total belanja = Reni + Sari + Dinda. Karena Sari beli 2× Reni dan Dinda beli 3× Reni, totalnya = (1 + 2 + 3)× belanja Reni.</p>
                  <p className="text-yellow-300/80">🔑 Trik: Jumlahkan multiplier (1+2+3=6), lalu kalikan langsung dengan belanja dasar Reni.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Belanja Reni: <InlineMath math="3x + 2y" /></p>
                  </S>
                  <S n={2}>
                    <p>Belanja Sari (2× Reni): <InlineMath math="2(3x + 2y) = 6x + 4y" /></p>
                  </S>
                  <S n={3}>
                    <p>Belanja Dinda (3× Reni): <InlineMath math="3(3x + 2y) = 9x + 6y" /></p>
                  </S>
                  <S n={4}>
                    <p>Total ketiga anak:</p>
                    <div className="my-1"><InlineMath math="(3x+2y)+(6x+4y)+(9x+6y) = 18x+12y" /></div>
                    <p>Jawaban: <strong className="text-green-300">A. 18x + 12y</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q13 — MCQ: Fungsi (paket internet) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">13</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Provider <span className="text-yellow-300 font-bold">"Cerdas Net"</span> menuliskan pilihan paket kuota internet dan harganya dalam bentuk himpunan pasangan berurutan (paket kuota dalam GB, harga dalam rupiah) sebagai berikut.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 text-center font-body text-white/90 text-sm">
                  {'{ (2, 9.000), (4, 15.000), (8, 27.000), (10, 33.000) }'}
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Jika <InlineMath math="x" /> adalah paket kuota internet dalam GB, rumus fungsi <InlineMath math="f(x)" /> yang menyatakan harga paket kuota internet adalah ....
                </p>
                <MCQ qn={13} correct={0} cols={1} options={[
                  <span key="a"><InlineMath math="A.\ f(x) = 3.000x + 3.000" /></span>,
                  <span key="b"><InlineMath math="B.\ f(x) = 3.000x + 1.000" /></span>,
                  <span key="c"><InlineMath math="C.\ f(x) = 2.500x + 4.000" /></span>,
                  <span key="d"><InlineMath math="D.\ f(x) = 2.500x + 9.000" /></span>,
                ]} />
              </div>
            </div>
            <PembahasanBtn n={13} />
            {expandedPembahasan.has(13) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban><span>A. <InlineMath math="f(x) = 3.000x + 3.000" /></span></PBJawaban>
                <PBKonsep>
                  <p>Pasangan berurutan membentuk <strong className="text-violet-300">fungsi linear</strong> <InlineMath math="f(x) = mx + c" />, di mana:</p>
                  <p>• <InlineMath math="m" /> = gradien (kenaikan harga per GB)</p>
                  <p>• <InlineMath math="c" /> = konstanta (biaya tetap saat x = 0)</p>
                  <p className="text-yellow-300/80">🔑 Trik: Hitung gradien dari selisih dua pasangan, lalu substitusi untuk c. Verifikasi dengan pasangan lain.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Hitung gradien dari (2, 9.000) dan (4, 15.000):</p>
                    <div className="my-1"><InlineMath math="m = \frac{15.000 - 9.000}{4 - 2} = \frac{6.000}{2} = 3.000" /></div>
                  </S>
                  <S n={2}>
                    <p>Cari konstanta c dengan substitusi (2, 9.000):</p>
                    <div className="my-1"><InlineMath math="9.000 = 3.000(2) + c \Rightarrow c = 3.000" /></div>
                  </S>
                  <S n={3}>
                    <p>Verifikasi: <InlineMath math="f(8) = 24.000 + 3.000 = 27.000\ ✓" /> dan <InlineMath math="f(10) = 30.000 + 3.000 = 33.000\ ✓" /></p>
                    <p>Jawaban: <strong className="text-green-300">A. f(x) = 3.000x + 3.000</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q14 — MCQ: Pola Bilangan (pagar bambu) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">14</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Suatu komunitas menyusun pagar bambu dengan pola bertingkat menggunakan dua jenis bata: bata persegi dan bata segitiga. Pada tingkat ke-<InlineMath math="n" />, banyak bata persegi adalah <InlineMath math="(n + 2)" /> buah dan banyak bata segitiga adalah <InlineMath math="(n + 1)" /> buah.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Jika ingin dibuat pagar dengan 10 tingkat susunan batu bata, berapakah jumlah total batu bata (segitiga maupun persegi) yang ada pada <span className="text-yellow-300 font-bold">tingkat ke-10</span> dari pagar tersebut?
                </p>
                <MCQ qn={14} correct={3} options={[
                  "A. 20 batu bata", "B. 21 batu bata", "C. 22 batu bata", "D. 23 batu bata",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={14} />
            {expandedPembahasan.has(14) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>D. 23 batu bata (12 persegi + 11 segitiga)</PBJawaban>
                <PBKonsep>
                  <p>Pada tingkat ke-<InlineMath math="n" />:</p>
                  <p>• Bata persegi = <InlineMath math="n + 2" /></p>
                  <p>• Bata segitiga = <InlineMath math="n + 1" /></p>
                  <p>• <strong className="text-violet-300">Total = </strong><InlineMath math="(n+2)+(n+1) = 2n+3" /></p>
                  <p className="text-yellow-300/80">🔑 Trik: Substitusi langsung n = 10 ke rumus total tanpa menghitung satu per satu.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Tingkat ke-10: bata persegi = <InlineMath math="10 + 2 = 12" /></p>
                  </S>
                  <S n={2}>
                    <p>Tingkat ke-10: bata segitiga = <InlineMath math="10 + 1 = 11" /></p>
                  </S>
                  <S n={3}>
                    <p>Total = <InlineMath math="12 + 11 = 23" /> batu bata</p>
                    <p>Jawaban: <strong className="text-green-300">D. 23 batu bata</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q15 — True/False: Pola Bilangan (dua pagar) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">15</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Dua pagar yang sama persis dengan pola pada Soal No 14, masing-masing memiliki <span className="text-yellow-300 font-bold">8 tingkat</span>, akan dibangun sekaligus (sehingga dibutuhkan jumlah bata dari tingkat 1 hingga tingkat 8, dikalikan dua). Persediaan yang ada hanya <span className="text-cyan-300 font-bold">90 batu bata persegi</span> dan <span className="text-cyan-300 font-bold">70 batu bata segitiga</span>.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut!
                </p>
                <BenarSalah qn={15}
                  correct={[true, false, true]}
                  rows={[
                    "Diperlukan tambahan 14 batu bata persegi.",
                    "Diperlukan tambahan 20 batu bata segitiga.",
                    "Diperlukan tambahan total sebanyak 32 batu bata baik segitiga maupun persegi.",
                  ]}
                />
              </div>
            </div>
            <PembahasanBtn n={15} />
            {expandedPembahasan.has(15) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>Pernyataan 1 = Benar, Pernyataan 2 = Salah, Pernyataan 3 = Benar</PBJawaban>
                <PBKonsep>
                  <p>Hitung total bata tiap jenis untuk 1 pagar (tingkat 1–8), lalu kalikan 2 untuk kedua pagar.</p>
                  <p>• Persegi 1 pagar: <InlineMath math="\sum_{n=1}^{8}(n+2) = 3+4+5+6+7+8+9+10 = 52" /></p>
                  <p>• Segitiga 1 pagar: <InlineMath math="\sum_{n=1}^{8}(n+1) = 2+3+4+5+6+7+8+9 = 44" /></p>
                  <p className="text-yellow-300/80">🔑 Trik: Gunakan rumus deret aritmetika S = n/2×(a+l) atau jumlahkan langsung.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Kebutuhan 2 pagar: persegi = <InlineMath math="2 \times 52 = 104" />, segitiga = <InlineMath math="2 \times 44 = 88" /></p>
                  </S>
                  <S n={2}>
                    <p><strong className="text-cyan-300">P1</strong> — Kekurangan persegi: <InlineMath math="104 - 90 = 14" /> → <strong className="text-green-300">BENAR ✓</strong></p>
                  </S>
                  <S n={3}>
                    <p><strong className="text-cyan-300">P2</strong> — Kekurangan segitiga: <InlineMath math="88 - 70 = 18" /> (bukan 20!) → <strong className="text-red-300">SALAH ✗</strong></p>
                  </S>
                  <S n={4}>
                    <p><strong className="text-cyan-300">P3</strong> — Total kekurangan: <InlineMath math="14 + 18 = 32" /> → <strong className="text-green-300">BENAR ✓</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>


          {/* Q16 — MCQ: Sudut bertolak belakang */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">16</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Garis CD dan garis MN berpotongan di titik N. Kedua garis tersebut membentuk dua sudut yang saling bertolak belakang (vertikal), yaitu sudut sebesar <span className="text-yellow-300 font-bold">65°</span> dan sudut sebesar <span className="text-yellow-300 font-bold">(5x + 5)°</span>.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Nilai x yang tepat adalah ....
                </p>
                <MCQ qn={16} correct={1} options={[
                  "A. 10°", "B. 12°", "C. 13°", "D. 15°",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={16} />
            {expandedPembahasan.has(16) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>B. x = 12 (sehingga sudut = 65°)</PBJawaban>
                <PBKonsep>
                  <p><strong className="text-violet-300">Sudut Bertolak Belakang (Vertikal):</strong> Dua sudut yang terbentuk saat dua garis berpotongan dan saling berhadapan selalu <strong className="text-violet-300">sama besar</strong>.</p>
                  <p className="text-yellow-300/80">🔑 Trik: Samakan langsung kedua sudut bertolak belakang, lalu selesaikan persamaan linear satu langkah.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Karena sudut bertolak belakang sama besar:</p>
                    <div className="my-1"><InlineMath math="5x + 5 = 65" /></div>
                  </S>
                  <S n={2}>
                    <div className="my-1"><InlineMath math="5x = 60 \Rightarrow x = 12" /></div>
                  </S>
                  <S n={3}>
                    <p>Verifikasi: <InlineMath math="5(12) + 5 = 65°\ ✓" /></p>
                    <p>Jawaban: <strong className="text-green-300">B. 12°</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q17 — MCQ: Rusuk prisma segi enam */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">17</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah prisma segi enam memiliki alas berbentuk segi enam beraturan. Banyak rusuk pada prisma segi enam tersebut adalah ....
                </p>
                <MCQ qn={17} correct={2} options={[
                  "A. 12 rusuk", "B. 16 rusuk", "C. 18 rusuk", "D. 24 rusuk",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={17} />
            {expandedPembahasan.has(17) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>C. 18 rusuk</PBJawaban>
                <PBKonsep>
                  <p><strong className="text-violet-300">Rumus rusuk prisma segi-n:</strong></p>
                  <div className="my-1 text-center"><InlineMath math="\text{Banyak rusuk} = 3n" /></div>
                  <p className="text-yellow-300/80">🔑 Trik: Prisma segi-n punya n rusuk alas + n rusuk tutup + n rusuk tegak = 3n total. Untuk n = 6: 3 × 6 = 18.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Prisma segi enam memiliki alas dan tutup berbentuk segi enam (n = 6).</p>
                  </S>
                  <S n={2}>
                    <p>Rincian rusuk:</p>
                    <p>• 6 rusuk alas &nbsp;|&nbsp; 6 rusuk tutup &nbsp;|&nbsp; 6 rusuk tegak</p>
                  </S>
                  <S n={3}>
                    <p>Total = <InlineMath math="6 + 6 + 6 = 18" /> rusuk</p>
                    <p>Jawaban: <strong className="text-green-300">C. 18 rusuk</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q18 — MCQ: Sudut puncak segitiga (garis sejajar) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">18</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Garis p dan garis q sejajar. Dua garis transversal memotong garis p dan garis q sehingga membentuk sebuah segitiga di antara keduanya, dengan titik puncak segitiga berada di luar garis p dan garis q. Sudut yang terbentuk antara transversal pertama dengan garis p adalah <span className="text-yellow-300 font-bold">75°</span>, dan sudut yang terbentuk antara transversal kedua dengan garis q adalah <span className="text-yellow-300 font-bold">55°</span> (sudut-sudut tersebut sehadap/sepihak terhadap segitiga). Sudut pada titik puncak segitiga (di antara kedua transversal) adalah b°.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berdasarkan gambar tersebut, berapa nilai b?
                </p>
                <MCQ qn={18} correct={3} options={[
                  "A. 55°", "B. 75°", "C. 110°", "D. 130°",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={18} />
            {expandedPembahasan.has(18) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>D. b = 130°</PBJawaban>
                <PBKonsep>
                  <p>Jika titik puncak segitiga berada di luar dua garis sejajar, dan dua transversal membentuk sudut α dengan garis p dan sudut β dengan garis q (masing-masing menghadap ke segitiga), maka:</p>
                  <div className="my-1 text-center"><InlineMath math="b = \alpha + \beta" /></div>
                  <p className="text-yellow-300/80">🔑 Trik: Tarik garis bantu melalui puncak sejajar dengan p dan q. Sudut puncak = α + β (sudut sehadap kiri + sudut sehadap kanan).</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Tarik garis <InlineMath math="r" /> melalui titik puncak, sejajar dengan p dan q.</p>
                  </S>
                  <S n={2}>
                    <p>Transversal 1 membentuk 75° dengan p. Karena <InlineMath math="r \parallel p" />, sudut transversal 1 dengan r = <strong className="text-cyan-300">75°</strong> (sudut sehadap).</p>
                  </S>
                  <S n={3}>
                    <p>Transversal 2 membentuk 55° dengan q. Karena <InlineMath math="r \parallel q" />, sudut transversal 2 dengan r = <strong className="text-cyan-300">55°</strong> (sudut sehadap).</p>
                  </S>
                  <S n={4}>
                    <p>Sudut puncak b = <InlineMath math="75° + 55° = 130°" /></p>
                    <p>Jawaban: <strong className="text-green-300">D. 130°</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q19 — MCQ: Teorema Pythagoras (kabel penyangga) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">19</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Seorang teknisi akan memasang kabel penyangga sebuah tiang listrik. Tiang tersebut memiliki tinggi <span className="text-cyan-300 font-bold">8 meter</span>, dan kabel penyangga akan dipasang dari ujung atas tiang ke sebuah titik di tanah yang berjarak <span className="text-cyan-300 font-bold">6 meter</span> dari kaki tiang.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tersedia 4 pilihan bahan kabel, yaitu kabel sepanjang 8 meter, 9,5 meter, 10,5 meter, dan 12 meter. Jenis kabel apa yang harus dipilih agar cukup untuk memasang penyangga tiang tersebut dan memiliki sisa paling sedikit?
                </p>
                <MCQ qn={19} correct={2} cols={1} options={[
                  "A. Kabel 8 meter",
                  "B. Kabel 9,5 meter",
                  "C. Kabel 10,5 meter",
                  "D. Kabel 12 meter",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={19} />
            {expandedPembahasan.has(19) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>C. Kabel 10,5 meter (panjang minimum kabel = 10 m, sisa paling sedikit dari opsi ≥ 10 m)</PBJawaban>
                <PBKonsep>
                  <p><strong className="text-violet-300">Teorema Pythagoras:</strong> <InlineMath math="c = \sqrt{a^2 + b^2}" /></p>
                  <p>Di mana a = tinggi tiang, b = jarak ke tanah, c = panjang kabel.</p>
                  <p className="text-yellow-300/80">🔑 Trik: Kenali tripel Pythagoras! 6-8-10 adalah tripel umum (kelipatan 3-4-5). Kabel harus ≥ 10 m — pilih yang paling mendekati dari atas.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>Tiang 8 m (tegak) dan jarak ke tanah 6 m (mendatar) membentuk segitiga siku-siku.</p>
                  </S>
                  <S n={2}>
                    <p>Panjang kabel minimum:</p>
                    <div className="my-1"><InlineMath math="c = \sqrt{8^2 + 6^2} = \sqrt{64 + 36} = \sqrt{100} = 10 \text{ m}" /></div>
                  </S>
                  <S n={3}>
                    <p>Cek setiap pilihan:</p>
                    <p>• 8 m → tidak cukup (8 &lt; 10) ✗</p>
                    <p>• 9,5 m → tidak cukup (9,5 &lt; 10) ✗</p>
                    <p>• <strong className="text-green-300">10,5 m → cukup, sisa = 0,5 m ✓</strong></p>
                    <p>• 12 m → cukup, sisa = 2 m (sisa lebih banyak dari 10,5 m)</p>
                  </S>
                  <S n={4}>
                    <p>Kabel yang cukup dan sisa paling sedikit: <strong className="text-green-300">C. Kabel 10,5 meter</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q20 — MCQ: Transformasi (translasi + rotasi) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">20</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Diketahui dua segitiga kongruen, yaitu segitiga DEF dan segitiga GHI, pada bidang koordinat kartesius, dengan titik E = titik H (kedua segitiga saling berimpit di satu titik, dan segitiga GHI merupakan bayangan segitiga DEF hasil <span className="text-cyan-300 font-bold">rotasi 180°</span> terhadap titik E). Segitiga DEF kemudian akan ditranslasikan oleh <InlineMath math="T = (3,\ 5)" />.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Bayangan segitiga DEF (setelah translasi) dan segitiga GHI akan saling ....
                </p>
                <MCQ qn={20} correct={2} options={[
                  "A. tegak lurus", "B. berpotongan", "C. sejajar", "D. berhimpit",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={20} />
            {expandedPembahasan.has(20) && (
              <div className="mt-3 flex flex-col gap-3">
                <PBJawaban>C. Sejajar (DEF' dan GHI kongruen, sisi-sisinya sejajar, tidak saling berhimpit maupun berpotongan)</PBJawaban>
                <PBKonsep>
                  <p><strong className="text-violet-300">Rotasi 180°</strong> menghasilkan bangun kongruen dengan orientasi terbalik — setiap sisi pada bayangan sejajar dengan sisi aslinya.</p>
                  <p><strong className="text-violet-300">Translasi</strong> hanya menggeser posisi tanpa mengubah orientasi atau ukuran.</p>
                  <p className="text-yellow-300/80">🔑 Trik: GHI ∥ DEF (dari rotasi 180°). Translasi menggeser DEF ke DEF' tanpa mengubah sifat kesejajaran → DEF' tetap sejajar GHI tetapi tidak lagi berhimpit.</p>
                </PBKonsep>
                <PBSteps>
                  <S n={1}>
                    <p>GHI = bayangan DEF hasil rotasi 180° terhadap E=H → GHI kongruen dengan DEF, dan sisi-sisi GHI sejajar sisi-sisi DEF.</p>
                  </S>
                  <S n={2}>
                    <p>DEF ditranslasikan oleh <InlineMath math="T = (3,\ 5)" /> → DEF' bergeser 3 ke kanan dan 5 ke atas.</p>
                  </S>
                  <S n={3}>
                    <p>Translasi tidak mengubah orientasi DEF, sehingga sisi-sisi DEF' tetap sejajar dengan GHI. Namun posisi DEF' sudah tidak berhimpit dengan GHI → keduanya <strong className="text-green-300">sejajar</strong>.</p>
                    <p>Jawaban: <strong className="text-green-300">C. Sejajar</strong></p>
                  </S>
                </PBSteps>
              </div>
            )}
          </div>

          {/* Q21 — MCQ: Juring lingkaran */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">21</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah lingkaran terbagi menjadi tiga juring, yaitu juring D, juring E, dan juring F, dengan sudut pusat berturut-turut <span className="text-yellow-300 font-bold">30°</span>, <span className="text-yellow-300 font-bold">90°</span>, dan <span className="text-yellow-300 font-bold">60°</span>.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Manakah pernyataan yang benar di bawah ini terkait luas juring D, E, dan F?
                </p>
                <MCQ qn={21} correct={0} cols={1} options={[
                  "A. Luas juring E tiga kali dari luas juring D.",
                  "B. Luas juring F setengah dari luas juring E.",
                  "C. Luas juring D dua kali dari luas juring F.",
                  "D. Luas juring E dua kali dari luas juring F.",
                ]} />
              </div>
            </div>
          </div>

          {/* Q22 — MCQ: Kesebangunan persegi panjang */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">22</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Terdapat dua persegi panjang yang sebangun. Persegi panjang yang lebih besar memiliki tinggi <span className="text-cyan-300 font-bold">24 cm</span> dan luas <span className="text-cyan-300 font-bold">480 cm²</span>. Persegi panjang yang lebih kecil memiliki tinggi <span className="text-cyan-300 font-bold">6 cm</span>.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berapakah keliling persegi panjang yang lebih kecil?
                </p>
                <MCQ qn={22} correct={2} options={[
                  "A. 11 cm", "B. 16 cm", "C. 22 cm", "D. 44 cm",
                ]} />
              </div>
            </div>
          </div>

          {/* Q23 — ComplexMCQ: Madu Bu Rina */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">23</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Bu Rina adalah pemasok madu curah. Madu jenis A disimpan dalam tangki berukuran <span className="text-cyan-300 font-bold">5 dm × 1,5 m × 0,6 m</span> dan dalam keadaan penuh. Madu tersebut akan dikemas ke dalam botol berukuran <span className="text-yellow-300 font-bold">0,5 liter</span> sebanyak <span className="text-yellow-300 font-bold">600 botol</span>, dan sisanya dikemas ke dalam jerigen berukuran <span className="text-yellow-300 font-bold">2 liter</span>.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Bagaimana perbandingan banyak kemasan botol dan jerigen? Pilihlah semua jawaban benar! Jawaban benar lebih dari satu.
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={23} items={[
                  { text: "Jumlah kemasan botol lebih banyak daripada jerigen.", benar: true },
                  { text: "Total kemasan botol dan jerigen yang terisi adalah 675.", benar: true },
                  { text: "Sisa minyak di tangki masih cukup untuk mengisi 1 kemasan botol tambahan.", benar: false },
                  { text: "Banyak kemasan jerigen yang terisi minyak adalah 80.", benar: false },
                ]} />
              </div>
            </div>
          </div>

          {/* Q24 — Mungkin/Tidak Mungkin: Madu Pak Budi & Bu Ani */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">24</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Madu jenis A pada tangki Bu Rina (lihat Soal No 23) berjumlah <span className="text-cyan-300 font-bold">450 liter</span>, sedangkan madu jenis B dalam tangki berukuran <span className="text-cyan-300 font-bold">6 dm × 2 m × 0,8 m</span> dalam keadaan penuh berjumlah <span className="text-cyan-300 font-bold">960 liter</span>. Dua pelanggan, <span className="text-yellow-300 font-bold">Pak Budi</span> (membawa jerigen 15 liter) dan <span className="text-yellow-300 font-bold">Bu Ani</span> (membawa jerigen 20 liter), membeli seluruh madu tersebut sehingga tidak ada sisa. Seluruh jerigen yang dibawa berisi penuh, dan masing-masing pelanggan mendapatkan kedua jenis madu.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan <span className="text-green-300 font-bold">Mungkin</span> atau <span className="text-red-300 font-bold">Tidak Mungkin</span> pada setiap pernyataan berikut!
                </p>
                <TF2Table qn={24} col1="Mungkin" col2="Tidak Mungkin"
                  correct1={[true, false, true]}
                  rows={[
                    "Pak Budi membawa pulang 10 jerigen madu jenis A dan 24 jerigen madu jenis B.",
                    "Pak Budi membawa pulang 8 jerigen madu jenis A dan 40 jerigen madu jenis B.",
                    "Bu Ani membawa pulang 12 jerigen madu jenis A dan Pak Budi membawa pulang 60 jerigen madu jenis B.",
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Q25 — MCQ: Tren produksi kopi dan teh */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">25</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berikut adalah data produksi kopi dan teh di suatu daerah dari tahun 2019 hingga 2025 (dalam juta ton).
                </p>
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Tahun</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Kopi</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Teh</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/80 text-center">
                      <tr><td className="border border-white/10 px-3 py-2">2019</td><td className="border border-white/10 px-3 py-2">1,20</td><td className="border border-white/10 px-3 py-2">1,05</td></tr>
                      <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">2020</td><td className="border border-white/10 px-3 py-2">1,15</td><td className="border border-white/10 px-3 py-2">1,06</td></tr>
                      <tr><td className="border border-white/10 px-3 py-2">2021</td><td className="border border-white/10 px-3 py-2">1,05</td><td className="border border-white/10 px-3 py-2">1,08</td></tr>
                      <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">2022</td><td className="border border-white/10 px-3 py-2">0,98</td><td className="border border-white/10 px-3 py-2">1,10</td></tr>
                      <tr><td className="border border-white/10 px-3 py-2">2023</td><td className="border border-white/10 px-3 py-2">0,90</td><td className="border border-white/10 px-3 py-2">1,12</td></tr>
                      <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">2024</td><td className="border border-white/10 px-3 py-2">0,85</td><td className="border border-white/10 px-3 py-2">1,14</td></tr>
                      <tr><td className="border border-white/10 px-3 py-2">2025</td><td className="border border-white/10 px-3 py-2">0,80</td><td className="border border-white/10 px-3 py-2">1,16</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berdasarkan data di atas, pernyataan manakah yang benar mengenai tren produksi kopi dan teh?
                </p>
                <MCQ qn={25} correct={1} cols={1} options={[
                  "A. Produksi kopi terus meningkat sedangkan produksi teh terus menurun.",
                  "B. Produksi kopi terus menurun sedangkan produksi teh terus meningkat.",
                  "C. Produksi kopi dan teh sama-sama meningkat setiap tahun.",
                  "D. Produksi kopi dan teh sama-sama menurun setiap tahun.",
                ]} />
              </div>
            </div>
          </div>

          {/* Q26 — MCQ: Modus durasi belajar */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">26</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sinta mencatat durasi belajarnya (dalam jam) setiap minggu selama 12 minggu berturut-turut sebagai berikut.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 text-center font-body text-white/90 text-sm tracking-wide">
                  8, 10, 9, 10, 12, 9, 11, 9, 8, 9, 7, 9
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Modus dari data durasi belajar Sinta tersebut adalah ....
                </p>
                <MCQ qn={26} correct={2} options={[
                  "A. 7 jam", "B. 8 jam", "C. 9 jam", "D. 10 jam",
                ]} />
              </div>
            </div>
          </div>

          {/* Q27 — MCQ: Rata-rata durasi belajar (lanjutan Q26) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">27</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Menggunakan data durasi belajar Sinta pada Soal No 26, berapakah <span className="text-yellow-300 font-bold">rata-rata</span> durasi belajar Sinta selama 12 minggu tersebut?
                </p>
                <MCQ qn={27} correct={1} options={[
                  "A. 8,5 jam", "B. 9,25 jam", "C. 9,5 jam", "D. 10 jam",
                ]} />
              </div>
            </div>
          </div>

          {/* Q28 — MCQ: Peluang boneka Luna */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">28</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Suatu paket berisi <span className="text-cyan-300 font-bold">25 kotak misteri</span> yang berisi boneka bernama Luna dan Nino. Dalam satu paket, terdapat <span className="text-yellow-300 font-bold">10 boneka Luna</span> dan <span className="text-yellow-300 font-bold">15 boneka Nino</span>.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Rian mengambil <span className="text-cyan-300 font-bold">4 kotak misteri</span> secara acak dari paket tersebut dan ternyata mendapatkan 1 boneka Luna dan 3 boneka Nino. Kemudian, Wati akan mengambil 1 kotak misteri dari sisa kotak yang ada. Berapakah peluang Wati mendapatkan boneka Luna?
                </p>
                <MCQ qn={28} correct={2} options={[
                  <span key="a"><InlineMath math="A.\ \tfrac{9}{25}" /></span>,
                  <span key="b"><InlineMath math="B.\ \tfrac{10}{21}" /></span>,
                  <span key="c"><InlineMath math="C.\ \tfrac{9}{21}" /></span>,
                  <span key="d"><InlineMath math="D.\ \tfrac{12}{21}" /></span>,
                ]} />
              </div>
            </div>
          </div>

          {/* Q29 — MCQ: Peluang telur menetas */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">29</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah inkubator digunakan untuk menetaskan telur bebek. Masa penetasan berlangsung selama <span className="text-cyan-300 font-bold">21 hari</span> terhitung dari awal telur dimasukkan ke dalam mesin. Berikut rincian usia telur di dalam mesin saat ini.
                </p>
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="border border-white/20 px-3 py-2 text-white text-left">Usia Telur di Dalam Mesin</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Banyak Telur</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/80">
                      <tr><td className="border border-white/10 px-3 py-2">3 hari</td><td className="border border-white/10 px-3 py-2 text-center">18</td></tr>
                      <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">6 hari</td><td className="border border-white/10 px-3 py-2 text-center">24</td></tr>
                      <tr><td className="border border-white/10 px-3 py-2">9 hari</td><td className="border border-white/10 px-3 py-2 text-center">20</td></tr>
                      <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">12 hari</td><td className="border border-white/10 px-3 py-2 text-center">8</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Telur-telur tersebut diletakkan secara acak di dalam mesin. Jika dilakukan pengamatan khusus pada satu telur yang dipilih secara acak, berapakah peluang telur tersebut akan menetas dalam <span className="text-yellow-300 font-bold">12 hari ke depan</span>?
                </p>
                <MCQ qn={29} correct={1} options={[
                  <span key="a"><InlineMath math="A.\ \tfrac{1}{5}" /></span>,
                  <span key="b"><InlineMath math="B.\ \tfrac{2}{5}" /></span>,
                  <span key="c"><InlineMath math="C.\ \tfrac{3}{7}" /></span>,
                  <span key="d"><InlineMath math="D.\ \tfrac{4}{7}" /></span>,
                ]} />
              </div>
            </div>
          </div>

          {/* Q30 — ComplexMCQ: Kertas kuis kode Y */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">30</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Seorang guru menyiapkan kertas kuis bertuliskan kode <span className="text-cyan-300 font-bold">X</span>, <span className="text-cyan-300 font-bold">Y</span>, atau <span className="text-cyan-300 font-bold">Z</span> di dalam sebuah kotak. Diketahui jumlah kertas berkode X lebih banyak daripada kertas berkode Y. Guru kemudian mengambil 4 kertas dengan kode yang sama dari dalam kotak (tidak diketahui kode apa yang diambil). Setelah pengambilan, jumlah seluruh kertas yang tersisa menjadi <span className="text-yellow-300 font-bold">30 lembar</span>, dan jumlah kertas berkode Y lebih banyak daripada kertas berkode Z. Jika kemudian diambil satu kertas secara acak dari kotak tersebut, diketahui bahwa peluang terambilnya kertas berkode Z adalah <InlineMath math="\tfrac{3}{10}" />.
                </p>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berdasarkan informasi tersebut, berapakah kemungkinan jumlah kertas kuis kode Y mula-mula? Pilihlah semua jawaban benar! Jawaban benar lebih dari satu.
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={30} items={[
                  { text: "9 lembar", benar: false },
                  { text: "10 lembar", benar: true },
                  { text: "12 lembar", benar: true },
                  { text: "13 lembar", benar: false },
                ]} />
              </div>
            </div>
          </div>

        </div>{/* end questions */}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/tka"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke TKA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKALatihan1Page;
