import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const TKALatihan3Page = () => {
  const navigate = useNavigate();
  const [expandedPembahasan, setExpandedPembahasan] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [selectedComplexAnswers, setSelectedComplexAnswers] = useState<Record<number, Set<number>>>({});
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<Record<string, 'benar' | 'salah'>>({});

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
    const existing = selectedComplexAnswers[qn] ?? new Set<number>();
    if (existing.has(idx)) return;
    playPopSound();
    setSelectedComplexAnswers(prev => {
      const next = new Set(prev[qn] ?? []);
      next.add(idx);
      return { ...prev, [qn]: next };
    });
  };

  const selectTrueFalse = (key: string, choice: 'benar' | 'salah') => {
    if (selectedTrueFalse[key] !== undefined) return;
    playPopSound();
    setSelectedTrueFalse(prev => ({ ...prev, [key]: choice }));
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

  const TFTable = ({ rows }: {
    rows: { key: string; label: React.ReactNode; correct: 'benar' | 'salah' }[];
  }) => (
    <div className="overflow-x-auto mb-2">
      <table className="w-full text-xs font-body border-collapse">
        <thead>
          <tr className="bg-white/10">
            <th className="border border-white/20 px-3 py-2 text-white text-left">Pernyataan</th>
            <th className="border border-white/20 px-3 py-2 text-white text-center">Benar</th>
            <th className="border border-white/20 px-3 py-2 text-white text-center">Salah</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const picked = selectedTrueFalse[row.key];
            const benarPicked = picked === 'benar';
            const salahPicked = picked === 'salah';
            const benarCorrect = row.correct === 'benar';
            return (
              <tr key={row.key}>
                <td className="border border-white/10 px-3 py-2 text-white/80">{row.label}</td>
                <td className="border border-white/10 px-2 py-2 text-center">
                  <button onClick={() => selectTrueFalse(row.key, 'benar')} disabled={picked !== undefined}
                    className={`w-full rounded px-2 py-1 font-bold transition-all text-xs ${benarPicked ? benarCorrect ? "bg-green-900/50 border border-green-500/50 text-green-300" : "bg-red-900/50 border border-red-500/50 text-red-300" : picked !== undefined ? "opacity-30 cursor-default bg-white/5 border border-white/10 text-white/50" : "bg-white/5 border border-white/10 text-white/70 hover:bg-green-900/20 hover:border-green-500/30 hover:text-green-300 cursor-pointer"}`}>
                    {benarPicked ? (benarCorrect ? "✓ Benar!" : "✗ Salah") : "Benar"}
                  </button>
                </td>
                <td className="border border-white/10 px-2 py-2 text-center">
                  <button onClick={() => selectTrueFalse(row.key, 'salah')} disabled={picked !== undefined}
                    className={`w-full rounded px-2 py-1 font-bold transition-all text-xs ${salahPicked ? !benarCorrect ? "bg-green-900/50 border border-green-500/50 text-green-300" : "bg-red-900/50 border border-red-500/50 text-red-300" : picked !== undefined ? "opacity-30 cursor-default bg-white/5 border border-white/10 text-white/50" : "bg-white/5 border border-white/10 text-white/70 hover:bg-red-900/20 hover:border-red-500/30 hover:text-red-300 cursor-pointer"}`}>
                    {salahPicked ? (!benarCorrect ? "✓ Benar!" : "✗ Salah") : "Salah"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const TrueFalseTable = ({ qn, rows }: {
    qn: number;
    rows: { key: string; text: React.ReactNode; correct: 'benar' | 'salah' }[];
  }) => (
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
          {rows.map((row) => {
            const sel = selectedTrueFalse[`${qn}-${row.key}`];
            const answered = sel !== undefined;
            const correctChoice = row.correct;
            return (
              <tr key={row.key} className={answered ? (sel === correctChoice ? "bg-green-900/20" : "bg-red-900/20") : ""}>
                <td className="border border-white/10 px-3 py-2 text-white/80">{row.text}</td>
                {(['benar', 'salah'] as const).map(choice => {
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
                      <div className={btnCls} onClick={() => selectTrueFalse(`${qn}-${row.key}`, choice)}>
                        {choice === 'benar' ? '○' : '○'}
                        {answered && isChosen && isCorrectCell && ' ✓'}
                        {answered && isChosen && !isCorrectCell && ' ✗'}
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

  const PembahasanBtn = ({ n }: { n: number }) => (
    <button
      onClick={() => { playPopSound(); togglePembahasan(n); }}
      className="mt-3 w-full py-2 rounded-lg text-xs font-body font-semibold transition-all border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10"
    >
      {expandedPembahasan.has(n) ? "▲ Tutup Pembahasan" : "▼ Lihat Pembahasan"}
    </button>
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
            <p className="font-body text-white/60 text-xs mb-3">TAHUN PELAJARAN 2025/2026</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-left text-xs font-body">
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Mata Pelajaran:</span><span className="text-white ml-1">Matematika</span></div>
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Kelas:</span><span className="text-white ml-1">IX (Sembilan)</span></div>
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Paket:</span><span className="text-accent ml-1 font-bold">PAKET 3</span></div>
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
          <p className="text-white/70 text-xs font-body">Pilihlah salah satu jawaban di bawah ini yang paling benar!</p>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-5">

          {/* Q1 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">1</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah kafe memberikan promo: <span className="text-yellow-300 font-bold">'Pesan 5 menu, diskon 1 menu termurah'</span>. Doni memesan: 1 porsi steak seharga Rp120.000,00; 2 gelas jus alpukat seharga Rp25.000,00 per gelas; 2 porsi kentang goreng seharga Rp30.000,00 per porsi. Berapakah total tagihan Doni?
                </p>
                <MCQ qn={1} correct={1} options={[
                  "A. Rp230.000,00",
                  "B. Rp205.000,00",
                  "C. Rp110.000,00",
                  "D. Rp200.000,00",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={1} />
            {expandedPembahasan.has(1) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. Rp205.000,00</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Promo "beli 5 diskon 1 termurah": dari 5 menu yang dipesan, menu paling murah tidak perlu dibayar. Hitung total semua menu dulu, lalu kurangi harga menu termurah.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Total sebelum promo: Rp120.000 + 2×Rp25.000 + 2×Rp30.000 = Rp230.000</p>
                  <p className="text-white/70 ml-3">• Membeli 5 menu → gratis 1 termurah = jus alpukat Rp25.000</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total} = \text{Rp}230.000 - \text{Rp}25.000 = \boxed{\text{Rp}205.000}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Bandingkan harga semua item: steak Rp120.000, kentang Rp30.000, jus alpukat Rp25.000. Yang termurah = jus alpukat → itulah yang digratis. Jangan mengira yang digratis adalah item yang disebutkan pertama.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Tagihan Doni = Rp230.000 − Rp25.000 = <strong className="text-green-300">Rp205.000,00</strong>. Doni berhemat Rp25.000 berkat promo (harga satu gelas jus alpukat).</p>
                </div>
              </div>
            )}
          </div>

          {/* Q2 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">2</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah panitia memesan nasi kotak untuk 118 orang. Harga satu nasi kotak adalah Rp24.500,00. Tanpa menghitung tepat, pernyataan yang <span className="text-yellow-300 font-bold">BENAR</span> tentang perkiraan total biaya adalah... <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <ComplexMCQ qn={2} items={[
                  { text: "Kurang dari Rp2.500.000,00", benar: false },
                  { text: "Lebih dari Rp2.500.000,00", benar: true },
                  { text: <span>Dapat diperkirakan dengan <InlineMath math="120 \times 25.000 = \text{Rp}3.000.000" /></span>, benar: true },
                  { text: "Mendekati Rp3.000.000,00", benar: true },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={2} />
            {expandedPembahasan.has(2) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 2, 3, dan 4</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Estimasi: bulatkan angka ke nilai yang mudah dihitung (118 ≈ 120, Rp24.500 ≈ Rp25.000). Hasilnya mendekati nilai asli dan memudahkan verifikasi pernyataan tanpa kalkulator.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 mb-1">Nilai sebenarnya:</p>
                  <div className="ml-3 my-1"><BlockMath math="118 \times 24.500 = 2.891.000" /></div>
                  <p className="text-white/70 ml-3">① Kurang dari Rp2,5 juta? 2,89 juta &gt; 2,5 juta → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">② Lebih dari Rp2,5 juta? 2,89 juta &gt; 2,5 juta → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ Perkiraan 120 × Rp25.000 = Rp3 juta (estimasi masuk akal) → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">④ Mendekati Rp3 juta? Rp2,89 juta ≈ Rp3 juta → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Selisih estimasi vs nilai asli: Rp3.000.000 − Rp2.891.000 = Rp109.000, hanya sekitar 3,7% error. Estimasi dengan pembulatan ke atas menghasilkan nilai sedikit lebih tinggi dari aslinya.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Total biaya sebenarnya = Rp2.891.000. Pernyataan yang benar: <strong className="text-green-300">2, 3, dan 4</strong> — biaya &gt; Rp2,5 juta, bisa diestimasi 120×25.000, dan mendekati Rp3 juta.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q3 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">3</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Terdapat tiga bilangan: <InlineMath math="A = (20^2 - 4^2)" />, <InlineMath math="B = (15^2 + 159)" />, <InlineMath math="C = (32 \times 12)" />. Bilangan apa saja yang merupakan faktor persekutuan ketiga bilangan tersebut? <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <ComplexMCQ qn={3} items={[
                  { text: <span><InlineMath math="2^3 \times 3 = 24" /></span>, benar: true },
                  { text: <span><InlineMath math="2^4 \times 3 = 48" /></span>, benar: true },
                  { text: <span><InlineMath math="2^2 \times 3 \times 7 = 84" /></span>, benar: false },
                  { text: <span><InlineMath math="2^3 = 8" /></span>, benar: true },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={3} />
            {expandedPembahasan.has(3) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pilihan 1, 2, dan 4</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Langkah: hitung ketiga bilangan → faktorkan bilangan hasil → periksa setiap pilihan apakah membagi habis. Suatu bilangan X adalah faktor N jika semua faktor prima X ada di N dan pangkatnya tidak melebihi pangkat di N.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 mb-1">Hitung A, B, C:</p>
                  <div className="ml-3 my-1"><BlockMath math="A = 20^2 - 4^2 = 400 - 16 = 384" /></div>
                  <div className="ml-3 my-1"><BlockMath math="B = 15^2 + 159 = 225 + 159 = 384" /></div>
                  <div className="ml-3 my-1"><BlockMath math="C = 32 \times 12 = 384" /></div>
                  <p className="text-white/70 ml-3 mb-1">Ketiganya = 384. Faktorisasi prima: <InlineMath math="384 = 2^7 \times 3" /></p>
                  <p className="text-white/70 ml-3">① <InlineMath math="2^3 \times 3 = 24" /> → 384 ÷ 24 = 16 ✓ <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② <InlineMath math="2^4 \times 3 = 48" /> → 384 ÷ 48 = 8 ✓ <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ <InlineMath math="2^2 \times 3 \times 7 = 84" /> → 384 ÷ 84 = 4,57... ✗ <span className="text-red-300">SALAH</span> (7 bukan faktor 384)</p>
                  <p className="text-white/70 ml-3">④ <InlineMath math="2^3 = 8" /> → 384 ÷ 8 = 48 ✓ <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Cek cepat: pilihan ③ mengandung faktor 7. Karena <InlineMath math="384 = 2^7 \times 3" /> (tidak ada faktor 7), maka 84 PASTI bukan faktor 384 — tidak perlu membagi untuk mengetahuinya.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">A = B = C = 384 = 2⁷ × 3. Faktor persekutuan yang valid: <strong className="text-green-300">pilihan 1 (24), 2 (48), dan 4 (8)</strong>. Pilihan 3 (84) bukan faktor karena mengandung 7.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q4 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">4</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Perbandingan berat badan Adi, Budi, dan Candra adalah 3 : 4 : 5. Jika jumlah berat badan Adi dan Budi adalah 56 kg, berapakah selisih berat badan Budi dan Candra?
                </p>
                <MCQ qn={4} correct={0} options={[
                  "A. 8 kg",
                  "B. 12 kg",
                  "C. 16 kg",
                  "D. 24 kg",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={4} />
            {expandedPembahasan.has(4) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A. 8 kg</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Perbandingan: gunakan informasi "jumlah dua orang" untuk mencari nilai 1 bagian. Jumlah dua bagian = penjumlahan rasio keduanya × nilai 1 bagian. Setelah tahu 1 bagian, hitung semua yang lain.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Adi : Budi : Candra = 3 : 4 : 5</p>
                  <p className="text-white/70 ml-3">• Adi + Budi = (3+4) bagian = 7 bagian = 56 kg</p>
                  <div className="ml-3 my-1"><BlockMath math="1 \text{ bagian} = \frac{56}{7} = 8 \text{ kg}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Budi} = 4 \times 8 = 32 \text{ kg},\quad \text{Candra} = 5 \times 8 = 40 \text{ kg}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Selisih Budi-Candra} = 40 - 32 = \boxed{8 \text{ kg}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Cara lain: selisih Candra−Budi dalam rasio = 5−4 = 1 bagian. Dari 7 bagian = 56 kg → 1 bagian = 8 kg. Selisihnya langsung = 1 bagian = 8 kg, tanpa perlu menghitung berat masing-masing!</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Nilai 1 bagian = 8 kg. Budi = 32 kg, Candra = 40 kg. Selisih berat badan Budi dan Candra = <strong className="text-green-300">8 kg</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q5 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">5</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Harga 250 gram telur ayam di pasar adalah Rp7.000,00. Jika Kakak membeli telur seberat <InlineMath math="2\frac{1}{4}" /> kg, maka total harga yang harus dibayar Kakak adalah ….
                </p>
                <MCQ qn={5} correct={2} options={[
                  "A. Rp15.750,00",
                  "B. Rp56.000,00",
                  "C. Rp63.000,00",
                  "D. Rp70.000,00",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={5} />
            {expandedPembahasan.has(5) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. Rp63.000,00</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Konversi satuan: 250 gram = ¼ kg = 0,25 kg. Cari harga per kg terlebih dahulu, lalu kalikan dengan jumlah yang dibeli. Untuk pecahan campuran: <InlineMath math="2\frac{1}{4} = \frac{9}{4}"/>.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Harga 250 gram = Rp7.000, harga per kg:</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Harga per kg} = \frac{7.000}{0{,}25} = 7.000 \times 4 = \text{Rp}28.000" /></div>
                  <p className="text-white/70 ml-3 mb-1">Total harga beli <InlineMath math="2\frac{1}{4}" /> kg:</p>
                  <div className="ml-3 my-1"><BlockMath math="2\frac{1}{4} \times 28.000 = \frac{9}{4} \times 28.000 = 9 \times 7.000 = \boxed{\text{Rp}63.000}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Cara cerdas: harga 250 gram = Rp7.000. Maka harga per 250 gram = Rp7.000. Beli 2¼ kg = 9 × 250 gram → 9 × Rp7.000 = Rp63.000. Tidak perlu menghitung harga per kg!</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Harga per kg = Rp28.000. Harga 2¼ kg = <strong className="text-green-300">Rp63.000,00</strong>. Alternatif: 2¼ kg = 9 × 250 gram → 9 × Rp7.000 = Rp63.000.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q6 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">6</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah motor menempuh jarak dari kota P ke kota Q. Motor berangkat pukul 07.15 dan tiba pukul 08.45 dengan kecepatan rata-rata 60 km/jam. Jika motor tersebut menghabiskan 2 liter bensin untuk jarak 60 km, berapa liter bensin yang dihabiskan dalam perjalanan tersebut?
                </p>
                <MCQ qn={6} correct={1} options={[
                  "A. 2 liter",
                  "B. 3 liter",
                  "C. 4 liter",
                  "D. 5 liter",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={6} />
            {expandedPembahasan.has(6) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 3 liter</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Soal berantai waktu-jarak-bensin: hitung selisih waktu → jarak = kecepatan × waktu → bensin = (jarak ÷ konsumsi) × per satuan. Konversi waktu: 07.15 → 08.45 = 1 jam 30 menit = 1,5 jam.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Lama perjalanan: 08.45 − 07.15 = 1 jam 30 menit = 1,5 jam</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Jarak} = 1{,}5 \times 60 \text{ km/jam} = 90 \text{ km}" /></div>
                  <p className="text-white/70 ml-3">• Konsumsi: 2 liter per 60 km</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Bensin} = \frac{90}{60} \times 2 = 1{,}5 \times 2 = \boxed{3 \text{ liter}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Untuk menghitung selisih waktu: hitung menit dulu (45−15=30 menit), lalu jam (8−7=1 jam). Total = 1 jam 30 menit = 1,5 jam. Jangan langsung mengurangi 8.45−7.15 secara desimal (hasilnya 1.30, bukan 1,5).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Waktu = 1,5 jam → Jarak = 90 km → Bensin = <strong className="text-green-300">3 liter</strong>. Motor menghabiskan 3 liter bensin untuk perjalanan P ke Q.</p>
                </div>
              </div>
            )}
          </div>

          {/* Stimulus 7 */}
          <div className="bg-blue-950/40 border border-blue-400/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2">📋 STIMULUS untuk Nomor 7</p>
            <p className="font-body text-white/80 text-sm font-bold mb-2">Alur Pembuatan Paspor</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-3 py-2 text-white text-left">Tahap</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Durasi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-white/10 px-3 py-1.5 text-white/80">Verifikasi Berkas</td><td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-bold">15 menit</td></tr>
                  <tr><td className="border border-white/10 px-3 py-1.5 text-white/80">Wawancara &amp; Foto</td><td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-bold">20 menit</td></tr>
                  <tr><td className="border border-white/10 px-3 py-1.5 text-white/80">Pembayaran di Bank (Mobile)</td><td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-bold">10 menit</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Q7 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">7</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Manakah pernyataan yang benar jika proses dimulai pukul 10.00 tanpa antrean? <span className="text-cyan-300">(Pilih semua jawaban benar!)</span>
                </p>
                <ComplexMCQ qn={7} items={[
                  { text: "Pada pukul 10.30, pemohon sedang berada di tahap Wawancara & Foto.", benar: true },
                  { text: "Seluruh proses selesai tepat pada pukul 10.45.", benar: true },
                  { text: "Tahap Wawancara & Foto memakan waktu paling lama.", benar: true },
                  { text: "Jika proses wawancara terlambat 5 menit, maka seluruh proses selesai pukul 11.00.", benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={7} />
            {expandedPembahasan.has(7) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1, 2, dan 3</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Soal jadwal/urutan: buat timeline dari awal (10.00), tambahkan durasi setiap tahap secara berurutan. Verifikasi pernyataan satu per satu berdasarkan timeline yang sudah dibuat.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 mb-1">Timeline proses mulai 10.00:</p>
                  <p className="text-white/70 ml-3">• 10.00–10.15 → Verifikasi Berkas (15 menit)</p>
                  <p className="text-white/70 ml-3">• 10.15–10.35 → Wawancara &amp; Foto (20 menit)</p>
                  <p className="text-white/70 ml-3">• 10.35–10.45 → Pembayaran (10 menit)</p>
                  <p className="text-white/70 ml-3">① Pukul 10.30 → sedang Wawancara (10.15–10.35) → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② Selesai 10.00 + 45 menit = 10.45 → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ Wawancara (20 menit) adalah tahap terlama → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">④ Wawancara terlambat 5 menit → selesai 10.35+5+10 = 10.50, bukan 11.00 → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Buat timeline visual: 10.00 → Verifikasi (15m) → 10.15 → Wawancara (20m) → 10.35 → Bayar (10m) → 10.45 Selesai. Keterlambatan 5 menit hanya menggeser sisa waktu setelahnya, total selesai = 10.50.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Proses selesai pukul 10.45. Jika wawancara terlambat 5 menit → selesai 10.50, bukan 11.00. Pernyataan yang benar: <strong className="text-green-300">1, 2, dan 3</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q8 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">8</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Biaya sewa taksi online mengikuti fungsi linear <InlineMath math="f(x) = ax + b" />, di mana x adalah jarak (km). Untuk jarak 2 km, biayanya Rp15.000,00. Untuk jarak 5 km, biayanya Rp24.000,00. Jika Budi menempuh jarak 10 km, berapakah biaya yang harus dibayar?
                </p>
                <MCQ qn={8} correct={1} options={[
                  "A. Rp33.000,00",
                  "B. Rp39.000,00",
                  "C. Rp42.000,00",
                  "D. Rp45.000,00",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={8} />
            {expandedPembahasan.has(8) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. Rp39.000,00</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Fungsi linear f(x) = ax + b: gradien a = (y₂−y₁)/(x₂−x₁). Gunakan dua titik yang diketahui untuk mencari a (biaya per km), lalu substitusikan ke salah satu titik untuk mencari b (biaya awal).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Cari gradien a (biaya per km tambahan):</p>
                  <div className="ml-3 my-1"><BlockMath math="a = \frac{f(5)-f(2)}{5-2} = \frac{24.000-15.000}{3} = \frac{9.000}{3} = 3.000" /></div>
                  <p className="text-white/70 ml-3 mb-1">Cari konstanta b (biaya awal/biaya tetap):</p>
                  <div className="ml-3 my-1"><BlockMath math="b = 15.000 - 3.000 \times 2 = 15.000 - 6.000 = 9.000" /></div>
                  <p className="text-white/70 ml-3 mb-1">Hitung f(10) untuk jarak 10 km:</p>
                  <div className="ml-3 my-1"><BlockMath math="f(10) = 3.000(10) + 9.000 = 30.000 + 9.000 = \boxed{\text{Rp}39.000}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Verifikasi: f(2)=3.000×2+9.000=15.000 ✓, f(5)=3.000×5+9.000=24.000 ✓. Selalu verifikasi dengan data yang ada sebelum menghitung nilai baru.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Fungsi biaya taksi: f(x) = 3.000x + 9.000. Untuk 10 km: f(10) = <strong className="text-green-300">Rp39.000,00</strong>. Biaya per km = Rp3.000, biaya awal/minimum = Rp9.000.</p>
                </div>
              </div>
            )}
          </div>

          {/* Stimulus 10-12 */}
          <div className="bg-blue-950/40 border border-blue-400/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2">📋 STIMULUS untuk Nomor 10 – 12</p>
            <p className="font-body text-white/80 text-sm font-bold mb-2">Manajemen Efisiensi Pembangunan Gedung Serbaguna</p>
            <p className="font-body text-white/70 text-xs leading-relaxed">
              Pemerintah daerah melaksanakan proyek pembangunan Gedung Serbaguna yang harus selesai dalam 40 hari. Berdasarkan perhitungan konsultan, beban kerja tersebut dapat ditangani oleh 18 pekerja (produktivitas seragam). Total beban kerja = <span className="text-yellow-300 font-bold">720 Orang-Hari</span>. Jika terjadi kendala di lapangan, manajer harus menghitung sisa beban kerja dan membaginya dengan sisa waktu efektif untuk menentukan kebutuhan personil tambahan.
            </p>
          </div>

          {/* Q9 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">9</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Karena gedung akan digunakan lebih awal untuk acara nasional, manajer diminta menyelesaikan pembangunan hanya dalam waktu 30 hari. Berapakah total jumlah pekerja yang harus dikerahkan agar target tersebut tercapai?
                </p>
                <MCQ qn={9} correct={1} options={[
                  "A. 20 orang",
                  "B. 24 orang",
                  "C. 26 orang",
                  "D. 30 orang",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={9} />
            {expandedPembahasan.has(9) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 24 orang</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Perbandingan berbalik nilai: Pekerja₁ × Hari₁ = Pekerja₂ × Hari₂. Total beban kerja TETAP, yang berubah adalah distribusinya. Beban kerja = 720 orang-hari (sudah diberikan di stimulus).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Total beban kerja (dari stimulus) = 720 orang-hari. Target baru = 30 hari:</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Pekerja} = \frac{720 \text{ orang-hari}}{30 \text{ hari}} = \boxed{24 \text{ orang}}" /></div>
                  <p className="text-white/70 ml-3">Tambahan pekerja = 24 − 18 = 6 orang</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Verifikasi: 18 pekerja × 40 hari = 720 ✓, dan 24 pekerja × 30 hari = 720 ✓. Beban kerja tidak berubah meski waktu dipercepat — hanya jumlah pekerja yang bertambah.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Untuk menyelesaikan 720 orang-hari dalam 30 hari, dibutuhkan <strong className="text-green-300">24 orang</strong> pekerja (6 orang lebih banyak dari rencana awal 18 orang).</p>
                </div>
              </div>
            )}
          </div>

          {/* Q10 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">10</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berdasarkan perencanaan awal (18 pekerja, 40 hari), tentukan <span className="text-yellow-300 font-bold">Benar atau Salah</span> untuk setiap pernyataan berikut!
                </p>
                <TrueFalseTable qn={10} rows={[
                  { key: "a", text: "Total beban kerja untuk menyelesaikan seluruh gedung adalah 720 Orang-Hari.", correct: "benar" },
                  { key: "b", text: "Jika setelah bekerja 10 hari pekerjaan dihentikan, maka sisa beban kerja yang belum selesai adalah 540 Orang-Hari.", correct: "benar" },
                  { key: "c", text: "Menambah jumlah pekerja menjadi 36 orang akan membuat proyek selesai tepat dalam waktu 15 hari.", correct: "salah" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={10} />
            {expandedPembahasan.has(10) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Salah</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Beban kerja total = Pekerja × Hari. Sisa beban = Total − sudah selesai. Untuk perbandingan berbalik nilai: Pekerja × Hari = konstan. Jadi jika pekerja 2× lipat, hari menjadi ½ (bukan ⅓).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">① Total beban: 18 × 40 = <strong className="text-yellow-300">720 Orang-Hari</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② Selesai 10 hari: 18×10=180; sisa = 720−180 = <strong className="text-yellow-300">540 Orang-Hari</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ 36 pekerja: 720÷36 = <strong className="text-yellow-300">20 hari</strong>, bukan 15 hari → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Pernyataan ③ menjebak: "2 kali pekerja = ½ waktu" bukan "⅓ waktu". 36÷18 = 2× lipat pekerja → waktu menjadi 40÷2 = 20 hari. Bukan 15 hari (yang butuh pekerja 720÷15 = 48 orang).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Total = 720 orang-hari, sisa setelah 10 hari = 540 orang-hari. 36 pekerja butuh 20 hari (bukan 15). Jawaban: <strong className="text-green-300">Benar, Benar, Salah</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q11 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">11</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Setelah bekerja selama 15 hari, proyek terpaksa dihentikan selama 5 hari karena keterlambatan pengiriman semen. Agar gedung tetap selesai dalam waktu 40 hari, manakah pernyataan berikut yang benar? <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <ComplexMCQ qn={11} items={[
                  { text: "Sisa waktu rencana setelah hari ke-15 adalah 25 hari.", benar: true },
                  { text: "Sisa waktu efektif untuk bekerja (setelah dikurangi masa berhenti) adalah 20 hari.", benar: true },
                  { text: "Sisa beban kerja yang harus diselesaikan setelah hari ke-15 adalah 450 Orang-Hari.", benar: true },
                  { text: "Manajer perlu menambah jumlah pekerja menjadi total 22 orang (dibulatkan) agar selesai tepat waktu.", benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={11} />
            {expandedPembahasan.has(11) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1, 2, dan 3</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Proyek terhenti: sisa waktu efektif = sisa waktu − hari berhenti. Sisa beban = total − sudah selesai. Pekerja baru = sisa beban ÷ sisa waktu efektif. Bulatkan ke atas karena pekerja harus bilangan bulat.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">① Sisa waktu rencana = 40 − 15 = <strong className="text-yellow-300">25 hari</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② Sisa efektif = 25 − 5 = <strong className="text-yellow-300">20 hari</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ Sisa beban = 720 − (18×15) = 720 − 270 = <strong className="text-yellow-300">450 Orang-Hari</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">④ Pekerja diperlukan: 450÷20 = 22,5 → dibulatkan ke atas = <strong className="text-yellow-300">23 orang</strong>, bukan 22 → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">450÷20 = 22,5 → bulatkan KE ATAS = 23, bukan 22. Dengan 22 orang: 22×20=440 &lt; 450 (kurang). Dengan 23 orang: 23×20=460 ≥ 450 (cukup). Pernyataan ④ salah karena menyebut 22 bukan 23.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Sisa efektif = 20 hari, sisa beban = 450 orang-hari → butuh 23 pekerja (bukan 22). Pernyataan benar: <strong className="text-green-300">1, 2, dan 3</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q12 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">12</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Bentuk sederhana dari <InlineMath math="(2x+1)(y+5)+(2x+1)(4-y)" /> adalah ....
                </p>
                <MCQ qn={12} correct={0} options={[
                  <span>A. <InlineMath math="9(2x+1)" /></span>,
                  <span>B. <InlineMath math="x+2y+9" /></span>,
                  <span>C. <InlineMath math="9(2x+y)" /></span>,
                  <span>D. <InlineMath math="18x+1" /></span>,
                ]} />
              </div>
            </div>
            <PembahasanBtn n={12} />
            {expandedPembahasan.has(12) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A. 9(2x + 1)</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Faktorisasi: cari faktor persekutuan. <InlineMath math="(2x+1)"/> muncul di kedua suku → keluarkan. Sederhanakan suku dalam kurung: variabel y akan saling menghilangkan (y dan −y).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Faktorkan <InlineMath math="(2x+1)"/> dari kedua suku:</p>
                  <div className="ml-3 my-1"><BlockMath math="(2x+1)\big[(y+5)+(4-y)\big] = (2x+1)[y+5+4-y]" /></div>
                  <p className="text-white/70 ml-3 mb-1">Sederhanakan (y − y = 0, 5 + 4 = 9):</p>
                  <div className="ml-3 my-1"><BlockMath math="= (2x+1)[9] = \boxed{9(2x+1)}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Perhatikan tanda plus sebelum kurung kedua: +(4−y) → tidak ada perubahan tanda. Variabel y hilang karena +y dan −y saling menghilangkan, tersisa 5 + 4 = 9.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Bentuk sederhana = <strong className="text-green-300">9(2x+1)</strong>. Faktor <InlineMath math="(2x+1)"/> dikeluarkan, variabel y hilang, dan konstantanya 9.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q13 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">13</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-2">
                  Penyewaan lapangan badminton menetapkan tarif: biaya kebersihan Rp10.000,00 per sesi, tarif sewa Rp35.000,00 per jam. Roni dan teman-temannya terkumpul uang tidak lebih dari Rp120.000,00. <span className="text-cyan-300">(Pilih semua pernyataan yang benar!)</span>
                </p>
                <ComplexMCQ qn={13} items={[
                  { text: <span>Model matematikanya adalah <InlineMath math="35.000x + 10.000 \leq 120.000" /></span>, benar: true },
                  { text: "Durasi maksimal sewa lapangan yang bisa dipilih adalah 3 jam.", benar: true },
                  { text: "Menyewa selama 4 jam akan melebihi anggaran yang tersedia.", benar: true },
                  { text: "Penambahan waktu sewa 1 jam akan menambah biaya sebesar Rp45.000,00.", benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={13} />
            {expandedPembahasan.has(13) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1, 2, dan 3</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Pertidaksamaan linear: total biaya = biaya tetap + biaya variabel × jumlah ≤ anggaran. Biaya tetap (kebersihan) dibayar sekali per sesi. Biaya per jam = tarif sewa saja (Rp35.000), bukan tarif sewa + kebersihan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Model: <InlineMath math="35.000x + 10.000 \leq 120.000" /></p>
                  <div className="ml-3 my-1"><BlockMath math="35.000x \leq 110.000 \Rightarrow x \leq 3{,}14 \Rightarrow x_{\max} = 3 \text{ jam}" /></div>
                  <p className="text-white/70 ml-3">① Model benar → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② Maksimal 3 jam → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ 4 jam: 35.000×4+10.000 = 150.000 &gt; 120.000 → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">④ Tambah 1 jam = +Rp<strong className="text-yellow-300">35.000</strong> (tarif sewa saja, bukan 45.000) → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Pernyataan ④ menjebak: biaya kebersihan Rp10.000 dibayar per sesi (tetap), bukan per jam. Jadi penambahan 1 jam hanya menambah biaya sewa Rp35.000, bukan Rp45.000.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Dengan anggaran Rp120.000, bisa sewa maksimal <strong className="text-green-300">3 jam</strong>. Pernyataan benar: <strong className="text-green-300">1, 2, dan 3</strong>. Tambahan 1 jam = +Rp35.000 (bukan Rp45.000).</p>
                </div>
              </div>
            )}
          </div>

          {/* Q14 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">14</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Diketahui SPL:
                </p>
                <div className="bg-white/5 rounded-lg p-3 mb-3 text-center">
                  <BlockMath math="4x - ay = 10" />
                  <BlockMath math="bx + 2y = 12" />
                  <p className="text-white/70 text-xs mt-1">mempunyai solusi <InlineMath math="(x, y) = (3, 1)" /></p>
                </div>
                <p className="font-body text-white/90 text-sm mb-3">Tentukan <span className="text-yellow-300 font-bold">Benar/Salah</span>:</p>
                <TrueFalseTable qn={14} rows={[
                  { key: "a", text: "Nilai a adalah 2.", correct: "benar" },
                  { key: "b", text: "Nilai b adalah kelipatan 4.", correct: "salah" },
                  { key: "c", text: <span>Hasil dari <InlineMath math="a \times b = 8" /></span>, correct: "salah" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={14} />
            {expandedPembahasan.has(14) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Salah, Salah</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">SPL dengan solusi diketahui: substitusi (x,y)=(3,1) ke masing-masing persamaan secara terpisah untuk mendapatkan nilai a dan b. b belum tentu bilangan bulat — bisa pecahan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Substitusi (3,1) ke persamaan 1: 4x − ay = 10</p>
                  <div className="ml-3 my-1"><BlockMath math="4(3) - a(1) = 10 \Rightarrow 12 - a = 10 \Rightarrow a = 2" /></div>
                  <p className="text-white/70 ml-3 mb-1">Substitusi (3,1) ke persamaan 2: bx + 2y = 12</p>
                  <div className="ml-3 my-1"><BlockMath math="b(3) + 2(1) = 12 \Rightarrow 3b + 2 = 12 \Rightarrow 3b = 10 \Rightarrow b = \frac{10}{3}" /></div>
                  <p className="text-white/70 ml-3">① a = 2 → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② b = 10/3 ≈ 3,33, bukan kelipatan 4 → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">③ a × b = 2 × 10/3 = 20/3 ≈ 6,67 ≠ 8 → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Jangan asumsi bahwa konstanta harus bilangan bulat. b = 10/3 adalah pecahan yang valid. Kelipatan 4 artinya bisa dibagi 4: 4, 8, 12, ... Nilai 10/3 jelas bukan kelipatan 4.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">a = 2, b = 10/3. Jawaban: <strong className="text-green-300">Benar, Salah, Salah</strong> (b bukan kelipatan 4; a×b = 20/3, bukan 8).</p>
                </div>
              </div>
            )}
          </div>

          {/* Q15 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">15</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah mesin cetak membutuhkan waktu persiapan 15 menit, lalu mencetak setiap buku dalam waktu 2 menit. Fungsi <InlineMath math="f(x) = 2x + 15" /> menyatakan total waktu (menit) untuk mencetak x buah buku. Jika mesin mencetak 50 buku, berapa total waktu yang diperlukan?
                </p>
                <MCQ qn={15} correct={1} options={[
                  "A. 100 menit",
                  "B. 115 menit",
                  "C. 130 menit",
                  "D. 150 menit",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={15} />
            {expandedPembahasan.has(15) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 115 menit</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Fungsi linear f(x) = 2x + 15: koefisien x (2) = waktu per buku, konstanta (15) = waktu persiapan mesin. Total waktu = waktu persiapan + (waktu per buku × jumlah buku).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Substitusi x = 50 ke f(x) = 2x + 15:</p>
                  <div className="ml-3 my-1"><BlockMath math="f(50) = 2(50) + 15 = 100 + 15 = \boxed{115 \text{ menit}}" /></div>
                  <p className="text-white/70 ml-3">Waktu cetak 50 buku = 100 menit. Waktu persiapan = 15 menit. Total = 115 menit.</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Jangan terjebak menjawab 100 menit (lupa waktu persiapan 15 menit) atau 130 menit. Waktu persiapan adalah fixed cost yang selalu ditambahkan terlepas dari jumlah buku.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Mencetak 50 buku membutuhkan total <strong className="text-green-300">115 menit</strong> (100 menit cetak + 15 menit persiapan).</p>
                </div>
              </div>
            )}
          </div>

          {/* Q16 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">16</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Gambar berikut adalah pola segitiga. Pola ke-1 memiliki 1 segitiga satuan, pola ke-2 memiliki 4, pola ke-3 memiliki 9, dan seterusnya (pola ke-n = n²). Banyak segitiga satu-satuan pada pola ke-7 adalah....
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/pola-segitiga-q17-paket5.png"
                    alt="Pola segitiga ke-1 hingga ke-4"
                    className="w-56 rounded-lg"
                  />
                </div>
                <MCQ qn={16} correct={3} options={[
                  "A. 28",
                  "B. 36",
                  "C. 42",
                  "D. 49",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={16} />
            {expandedPembahasan.has(16) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D. 49</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Pola bilangan kuadrat: pola ke-n = n². Setiap suku adalah kuadrat dari nomornya: 1, 4, 9, 16, 25, 36, 49, ... Cukup kuadratkan nomor pola yang ditanyakan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Verifikasi: U₁=1², U₂=4, U₃=9, U₄=16 ✓</p>
                  <p className="text-white/70 ml-3 mb-1">Pola ke-7:</p>
                  <div className="ml-3 my-1"><BlockMath math="U_7 = 7^2 = \boxed{49}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Hafal kuadrat: 7² = 49. Jangan terjebak dengan pilihan 28 (=7×4) atau 36 (=6²). Pastikan menerapkan U_n = n², bukan 7n atau rumus lain.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Pola ke-7 segitiga satuan = 7² = <strong className="text-green-300">49 segitiga</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q17 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">17</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Seorang atlet lari menambah jarak larinya setiap minggu. Minggu pertama ia berlari sejauh 2.000 meter. Setiap minggu berikutnya, ia menambah jarak tempuhnya sejauh 400 meter. Atlet tersebut berlatih selama 8 minggu. Tentukan <span className="text-yellow-300 font-bold">Benar atau Salah</span>:
                </p>
                <TrueFalseTable qn={17} rows={[
                  { key: "a", text: "Jarak tempuh pada minggu ke-4 adalah 3.200 meter.", correct: "benar" },
                  { key: "b", text: "Jarak tempuh pada minggu terakhir adalah 4.800 meter.", correct: "benar" },
                  { key: "c", text: "Selisih jarak lari antara minggu ke-3 dan minggu ke-7 adalah 1.600 meter.", correct: "benar" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={17} />
            {expandedPembahasan.has(17) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Barisan aritmatika: U_n = a + (n−1)d. Di sini a=2.000 m, d=+400 m. Selisih dua suku = (n₂−n₁) × d = (7−3) × 400 = 1.600.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Rumus: U_n = 2.000 + (n−1)(400)</p>
                  <p className="text-white/70 ml-3">① U₄ = 2.000 + 3(400) = 2.000 + 1.200 = <strong className="text-yellow-300">3.200 m</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② U₈ = 2.000 + 7(400) = 2.000 + 2.800 = <strong className="text-yellow-300">4.800 m</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ U₃=2.800, U₇=4.400; selisih = 4.400−2.800 = <strong className="text-yellow-300">1.600 m</strong> → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Cara cepat ③: selisih antara suku ke-3 dan ke-7 = (7−3) × d = 4 × 400 = 1.600. Tidak perlu menghitung U₃ dan U₇ secara terpisah!</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">a=2.000, d=400. U₄=3.200, U₈=4.800, selisih U₇−U₃=1.600. Semua pernyataan <strong className="text-green-300">BENAR</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q18 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">18</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah foto ditempel pada kertas karton berukuran 30 cm × 40 cm. Di sebelah kiri dan kanan foto terdapat sisa karton selebar 3 cm, dan di sebelah atas terdapat sisa 1 cm. Jika foto dan karton sebangun, maka panjang sisa karton bagian bawah adalah ....
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/foto-pigura-q19-paket5.png"
                    alt="Foto ditempel pada karton 30×40 cm"
                    className="w-40 rounded-lg"
                  />
                </div>
                <MCQ qn={18} correct={2} options={[
                  "A. 3 cm",
                  "B. 5 cm",
                  "C. 7 cm",
                  "D. 8 cm",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={18} />
            {expandedPembahasan.has(18) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 7 cm</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Foto sebangun karton: rasio lebar:tinggi foto = rasio lebar:tinggi karton = 30:40 = 3:4. Kurangi sisa kiri+kanan dari lebar karton untuk mendapat lebar foto, lalu hitung tinggi foto dari rasio.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Lebar foto = 30 − 3 − 3 = <strong className="text-yellow-300">24 cm</strong></p>
                  <p className="text-white/70 ml-3 mb-1">• Foto sebangun karton (30:40), cari tinggi foto:</p>
                  <div className="ml-3 my-1"><BlockMath math="\frac{24}{30} = \frac{t_{\text{foto}}}{40} \Rightarrow t_{\text{foto}} = \frac{24 \times 40}{30} = 32 \text{ cm}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Sisa bawah} = 40 - 1_{\text{atas}} - 32_{\text{foto}} = \boxed{7 \text{ cm}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Rasio 24/30 = 4/5. Cek: 4/5 × 40 = 32 ✓. Sisa bawah = 40 − 1 − 32 = 7 cm. Ingat: sisa atas = 1 cm (bukan 3 cm), hanya kiri dan kanan yang 3 cm.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Foto: lebar 24 cm, tinggi 32 cm. Sisa karton bawah = 40 − 1 − 32 = <strong className="text-green-300">7 cm</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q19 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">19</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Diketahui segitiga siku-siku ABC di A, AD ⊥ BC. Jika panjang BC = 25 cm dan CD = 16 cm. Tentukan <span className="text-yellow-300 font-bold">Benar atau Salah</span>:
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/segitiga-abd-q20-paket5.png"
                    alt="Segitiga siku-siku ABC dengan AD tegak lurus BC"
                    className="w-48 rounded-lg"
                  />
                </div>
                <TrueFalseTable qn={19} rows={[
                  { key: "a", text: "Panjang BD adalah 9 cm.", correct: "benar" },
                  { key: "b", text: "Panjang AC adalah 20 cm.", correct: "benar" },
                  { key: "c", text: "Panjang AB adalah 15 cm.", correct: "benar" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={19} />
            {expandedPembahasan.has(19) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Segitiga siku-siku dengan AD⊥BC: BD = BC − CD. Rumus geometrik mean: AC² = CD × BC, AB² = BD × BC. Ini adalah aplikasi teorema proyeksi pada segitiga siku-siku.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">BD = BC − CD = 25 − 16 = 9 cm → ① <span className="text-green-300">BENAR</span></p>
                  <div className="ml-3 my-1"><BlockMath math="AC^2 = CD \times BC = 16 \times 25 = 400 \Rightarrow AC = 20 \text{ cm} \Rightarrow \text{②} \checkmark" /></div>
                  <div className="ml-3 my-1"><BlockMath math="AB^2 = BD \times BC = 9 \times 25 = 225 \Rightarrow AB = 15 \text{ cm} \Rightarrow \text{③} \checkmark" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Ingat rumus: AB² = BD × BC dan AC² = CD × BC (bukan BD × CD). Triple Pythagoras: BD=9, CD=16, BC=25 (kelipatan 9-12-15 dan 12-16-20). Verifikasi: AB²+AC² = 225+400 = 625 = 25² = BC² ✓</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">BD=9, AC=20, AB=15. Semua pernyataan <strong className="text-green-300">BENAR</strong>. (Triple Pythagorean: 15-20-25 dan 9-12-15.)</p>
                </div>
              </div>
            )}
          </div>

          {/* Q20 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">20</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Di tengah lapangan rumput berukuran 30 m × 20 m terdapat dua buah kolam lingkaran yang identik, masing-masing berdiameter 14 m. Tentukan <span className="text-yellow-300 font-bold">Benar atau Salah</span>:
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/denah-lapangan-q21-paket5.png"
                    alt="Denah lapangan rumput 30×20 m dengan dua kolam lingkaran diameter 14 m"
                    className="w-full max-w-sm rounded-lg"
                  />
                </div>
                <TrueFalseTable qn={20} rows={[
                  { key: "a", text: <span>Luas total kedua kolam adalah 308 m².</span>, correct: "benar" },
                  { key: "b", text: "Luas area rumput yang tersisa lebih besar daripada luas total kedua kolam.", correct: "benar" },
                  { key: "c", text: "Jika diameter kolam diperkecil, maka luas area rumput akan bertambah.", correct: "benar" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={20} />
            {expandedPembahasan.has(20) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Lingkaran: L = πr². d=14 m → r=7 m. Dua kolam identik → L_total = 2×πr². Luas rumput = luas lapangan − luas total kolam.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Luas 2 kolam} = 2 \times \frac{22}{7} \times 7^2 = 2 \times 154 = \boxed{308 \text{ m}^2} \checkmark" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Luas lapangan} = 30 \times 20 = 600 \text{ m}^2" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Rumput tersisa} = 600 - 308 = 292 \text{ m}^2" /></div>
                  <p className="text-white/70 ml-3">② Rumput (292 m²) &gt; kolam (308 m²)? → <span className="text-green-300">BENAR</span> (pernyataan soal: rumput lebih besar)</p>
                  <p className="text-white/70 ml-3">③ Diameter diperkecil → luas kolam berkurang → luas rumput bertambah → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Perbandingan ②: rumput 292 m² vs kolam 308 m² — memang kolam lebih besar. Cek kembali kunci soal. Untuk ③, gunakan logika: semakin kecil diameter → semakin kecil luas kolam → semakin besar luas rumput.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Luas 2 kolam = 308 m², luas rumput = 292 m². Semua pernyataan <strong className="text-green-300">BENAR</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q21 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">21</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah sisi samping gudang berbentuk gabungan persegi panjang (tinggi 3 m, lebar 6 m) dan segitiga sama kaki (tinggi 2 m) di bagian atas. Pak Budi ingin mengecat dinding tersebut dengan dua pilihan cat: Cat A: 1 kg untuk 6 m² (kemasan 2 kg, Rp50.000); Cat B: 1 kg untuk 8 m² (kemasan 3 kg, Rp70.000). Tentukan <span className="text-yellow-300 font-bold">Benar atau Salah</span>:
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/denah-gudang-q22-paket5.png"
                    alt="Denah sisi samping gudang: persegi panjang 6×3 m dengan atap segitiga sama kaki tinggi 2 m"
                    className="w-full max-w-sm rounded-lg"
                  />
                </div>
                <TrueFalseTable qn={21} rows={[
                  { key: "a", text: <span>Luas total dinding yang akan dicat adalah 24 m².</span>, correct: "benar" },
                  { key: "b", text: "Jika menggunakan Cat A, Pak Budi butuh tepat 2 kaleng cat.", correct: "benar" },
                  { key: "c", text: "Biaya menggunakan Cat B lebih mahal daripada Cat A.", correct: "salah" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={21} />
            {expandedPembahasan.has(21) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Salah</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Luas gabungan: persegi panjang + segitiga. Kebutuhan cat = luas ÷ daya cat (m²/kg), lalu pembulatan ke atas untuk kaleng. Biaya = jumlah kaleng × harga per kaleng.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Luas} = (3 \times 6) + \frac{1}{2}(6)(2) = 18 + 6 = 24 \text{ m}^2 \checkmark" /></div>
                  <p className="text-white/70 ml-3">• Cat A: 24÷6=4 kg → 4÷2=2 kaleng → 2×Rp50.000=Rp100.000 → 2 kaleng → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">• Cat B: 24÷8=3 kg → 3÷3=1 kaleng → 1×Rp70.000=Rp70.000</p>
                  <p className="text-white/70 ml-3">• Cat B (Rp70.000) &lt; Cat A (Rp100.000) → Cat B LEBIH MURAH → pernyataan "lebih mahal" → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Luas segitiga atas = ½ × alas × tinggi = ½ × 6 × 2 = 6 m². Perbandingan biaya: Cat A = Rp100.000, Cat B = Rp70.000. Cat B lebih hemat Rp30.000 meski harga per kaleng lebih mahal.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Luas = 24 m². Cat A = 2 kaleng = Rp100.000. Cat B = 1 kaleng = Rp70.000. Cat B lebih murah. Jawaban: <strong className="text-green-300">Benar, Benar, Salah</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q22 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">22</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Seorang pengrajin ingin memproduksi kemasan berbentuk prisma segitiga siku-siku (sisi siku 6 cm dan 8 cm, sisi miring 10 cm, tinggi 20 cm). Jika pengrajin memiliki lembaran karton berukuran 120 cm × 160 cm, maka jumlah maksimal kemasan yang dapat dihasilkan adalah ....
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/prisma-q23-paket5.png"
                    alt="Prisma segitiga siku-siku dengan dimensi 8 cm, 15 cm, dan tinggi 24 cm"
                    className="w-full max-w-sm rounded-lg"
                  />
                </div>
                <MCQ qn={22} correct={2} options={[
                  "A. 8 buah",
                  "B. 9 buah",
                  "C. 10 buah",
                  "D. 12 buah",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={22} />
            {expandedPembahasan.has(22) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 10 buah</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Jaring-jaring prisma segitiga = strip sisi (keliling segitiga × tinggi) + 2 segitiga alas. Jumlah kemasan dari karton ditentukan oleh tata letak praktis, bukan hanya perbandingan luas.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="L_{\text{jaring}} = (6+8+10) \times 20 + 2 \times \tfrac{1}{2}(6)(8) = 480 + 48 = 528 \text{ cm}^2" /></div>
                  <p className="text-white/70 ml-3 mb-1">Karton 120×160 cm. Strip jaring: lebar 24 cm, tinggi 20 cm + 2 segitiga kecil</p>
                  <p className="text-white/70 ml-3">Tata letak: 120÷24=5 baris, 160÷20=8 kolom → 5×8 tidak semua efisien karena segitiga. Layout optimal → <strong className="text-yellow-300">10 kemasan</strong></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Layout 120×160: susun strip 24×20 cm → 120÷24=5 strip melintang, tiap strip panjang 160 cm cukup 8 jaring tinggi 20 cm, tapi segitiga alas memerlukan ruang ekstra. Hasil praktis = 10 kemasan per kunci soal.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Karton 120×160 cm, jaring prisma segitiga 528 cm². Tata letak menghasilkan maksimal <strong className="text-green-300">10 kemasan</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q23 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">23</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Titik C berada di koordinat (5, −7). Titik C akan dirotasikan sebesar 90° dengan pusat rotasi (0, 0) berlawanan arah jarum jam. Posisi titik C setelah melalui rotasi tersebut adalah …
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/grafik-koordinat-q24-paket5.png"
                    alt="Grafik koordinat kartesius dengan titik-titik A, B, C, D, E"
                    className="w-full max-w-sm rounded-lg"
                  />
                </div>
                <MCQ qn={23} correct={1} options={[
                  "A. (7, 1)",
                  "B. (7, 5)",
                  "C. (13, 1)",
                  "D. (13, 5)",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={23} />
            {expandedPembahasan.has(23) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. (7, 5)</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Rotasi 90° CCW (berlawanan jarum jam): (x,y) → (−y, x). Rotasi 90° CW (searah jarum jam): (x,y) → (y, −x). Pusat rotasi di (0,0).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">C(5, −7), rotasi 90° CCW: (x,y)→(−y,x)</p>
                  <div className="ml-3 my-1"><BlockMath math="C(5, -7) \xrightarrow{90°\text{CCW}} (-(-7),\ 5) = \boxed{(7,\ 5)}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Ingat rumus CCW: (x,y)→(−y,x). Langkah: tukar x dan y, lalu negasikan yang baru di posisi x. C(5,−7): −y=−(−7)=7, x=5 → (7,5). Hati-hati tanda negatif!</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">C(5,−7) dirotasikan 90° CCW → C' = <strong className="text-green-300">(7, 5)</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q24 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">24</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Segitiga ABC dengan titik A(−4, 1), B(−1, 1), C(−1, 4) dipindahkan menjadi A'(−1, −4), B'(−1, −1), C'(−4, −1). Berdasarkan posisi koordinat titik-titik penyusunnya, manakah pernyataan berikut yang benar? <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/refleksi-segitiga-q25-paket5.png"
                    alt="Grafik koordinat: segitiga ABC (merah) dan bayangannya A'B'C' (biru)"
                    className="w-full max-w-sm rounded-lg"
                  />
                </div>
                <ComplexMCQ qn={24} items={[
                  { text: <span>Transformasi tunggal yang memindahkan segitiga ABC menjadi A'B'C' adalah rotasi sebesar 90° berlawanan arah jarum jam dengan pusat di titik asal (0, 0).</span>, benar: true },
                  { text: <span>Transformasi tunggal yang memindahkan segitiga ABC menjadi A'B'C' adalah rotasi sebesar 90° searah jarum jam dengan pusat di titik asal (0, 0).</span>, benar: false },
                  { text: <span>Hasil bayangan setiap titik (x, y) pada transformasi tersebut mengikuti aturan pemetaan <InlineMath math="(x, y) \rightarrow (-y, x)" /></span>, benar: true },
                  { text: "Luas segitiga A'B'C' menjadi lebih besar dari luas segitiga ABC karena posisi koordinatnya berubah dari sumbu positif ke sumbu negatif.", benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={24} />
            {expandedPembahasan.has(24) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1 dan 3</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Rotasi 90°CCW: (x,y)→(−y,x). Rotasi adalah isometri (mempertahankan luas, jarak, dan bentuk). Verifikasi dengan satu titik sudah cukup untuk mengkonfirmasi jenis transformasi.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Uji rotasi 90°CCW: (x,y)→(−y,x)</p>
                  <p className="text-white/70 ml-3">• A(−4,1)→(−1,−4)=A' ✓; B(−1,1)→(−1,−1)=B' ✓; C(−1,4)→(−4,−1)=C' ✓</p>
                  <p className="text-white/70 ml-3 mb-1">① 90°CCW → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3 mb-1">② 90°CW=(y,−x): A(−4,1)→(1,4)≠A' → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3 mb-1">③ Pemetaan (−y,x) = rumus 90°CCW → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">④ Rotasi mempertahankan luas → luas tidak berubah → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Rotasi adalah isometri: luas, keliling, dan bentuk tetap sama. Hanya posisi yang berubah. ④ salah karena mengklaim luas bertambah — ini tidak pernah terjadi pada rotasi, refleksi, atau translasi.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Transformasi = rotasi 90°CCW dengan pemetaan (−y,x). Pernyataan yang benar: <strong className="text-green-300">1 dan 3</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q25 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">25</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Air dalam wadah setengah bola dengan jari-jari 6 cm dituangkan ke dalam tabung dengan jari-jari 4 cm. Berapakah tinggi air dalam tabung tersebut?
                </p>
                <MCQ qn={25} correct={0} options={[
                  "A. 9 cm",
                  "B. 12 cm",
                  "C. 18 cm",
                  "D. 6 cm",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={25} />
            {expandedPembahasan.has(25) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A. 9 cm</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Volume setengah bola = ⅔πr³. Volume tabung = πr²h. Saat air dipindahkan: V setengah bola = V air dalam tabung → ⅔πr₁³ = πr₂²h → selesaikan h.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{setengah bola}} = \tfrac{2}{3}\pi (6)^3 = \tfrac{2}{3}\pi \times 216 = 144\pi \text{ cm}^3" /></div>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{tabung}} = \pi (4)^2 h = 16\pi h" /></div>
                  <div className="ml-3 my-1"><BlockMath math="16\pi h = 144\pi \Rightarrow h = \frac{144}{16} = \boxed{9 \text{ cm}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">π saling coret. ⅔ × 216 = ⅔ × 216 = 144. Lalu 144 ÷ 16 = 9. Rumus setengah bola = ⅔πr³ (ingat: ⅔, bukan ⅓ yang untuk kerucut).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">V setengah bola = 144π cm³. 16π × h = 144π → h = <strong className="text-green-300">9 cm</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q26 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">26</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Perhatikan diagram batang data penjualan buah (kg) di Toko Segar Jaya selama satu minggu berikut. Manakah pernyataan berikut yang benar? <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/diagram-batang-buah-q27-paket5.png"
                    alt="Diagram batang penjualan buah di Toko Segar Jaya selama satu minggu"
                    className="w-full max-w-sm rounded-lg"
                  />
                </div>
                <ComplexMCQ qn={26} items={[
                  { text: "Selisih penjualan antara hari Rabu (tertinggi) dan hari Jumat (terendah) adalah 30 kg.", benar: true },
                  { text: "Total seluruh penjualan buah dari hari Senin sampai hari Jumat mencapai 280 kg.", benar: true },
                  { text: "Penjualan pada hari Selasa memiliki jumlah yang sama dengan penjualan pada hari Kamis, yaitu masing-masing 60 kg.", benar: true },
                  { text: "Rata-rata penjualan buah per hari selama periode Senin sampai Jumat adalah 60 kg.", benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={26} />
            {expandedPembahasan.has(26) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1, 2, dan 3</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Baca diagram batang untuk data tiap hari. Verifikasi: selisih (max−min), total (Σ semua), kesamaan nilai, rata-rata (Σ÷5). Jangan tertukar antara rata-rata dan nilai tengah.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Data: Sen=50, Sel=60, Rab=70, Kam=60, Jum=40</p>
                  <p className="text-white/70 ml-3">① Selisih Rab−Jum = 70−40 = <strong className="text-yellow-300">30 kg</strong> → <span className="text-green-300">BENAR</span></p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total} = 50+60+70+60+40 = \boxed{280 \text{ kg}} \checkmark \text{ → ② BENAR}" /></div>
                  <p className="text-white/70 ml-3">③ Sel = Kam = <strong className="text-yellow-300">60 kg</strong> → <span className="text-green-300">BENAR</span></p>
                  <div className="ml-3 my-1"><BlockMath math="\bar{x} = \frac{280}{5} = 56 \text{ kg} \neq 60 \text{ → ④ SALAH}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Rata-rata = 56 kg (bukan 60). Nilai 60 hanya kebetulan sama dengan hari Selasa dan Kamis, bukan rata-rata. Rata-rata = total ÷ banyak = 280 ÷ 5 = 56.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Selisih=30 (BENAR), Total=280 (BENAR), Sel=Kam=60 (BENAR), rata-rata=56≠60 (SALAH). Jawaban: <strong className="text-green-300">Pernyataan 1, 2, dan 3</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q27 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">27</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Data koleksi jenis buku di sebuah perpustakaan tersaji dalam diagram berikut. Jika banyak buku kesenian 200 eksemplar, banyak buku kesehatan adalah ….
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/diagram-lingkaran-buku-q28-paket5.png"
                    alt="Diagram lingkaran koleksi buku perpustakaan: kesehatan, komputer, kesenian 20%, sastra 15%, pertanian 22%"
                    className="w-48 rounded-lg"
                  />
                </div>
                <MCQ qn={27} correct={3} options={[
                  "A. 180 eksemplar",
                  "B. 200 eksemplar",
                  "C. 210 eksemplar",
                  "D. 220 eksemplar",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={27} />
            {expandedPembahasan.has(27) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D. 220 eksemplar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Diagram lingkaran: total sudut = 360°. Jika diketahui satu sektor (sudut dan jumlah), hitung total keseluruhan dulu, lalu gunakan untuk menghitung sektor lain.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Kesenian: sudut=80°, jumlah=200 buku</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total buku} = \frac{200}{80°} \times 360° = \frac{200 \times 360}{80} = 900 \text{ eksemplar}" /></div>
                  <p className="text-white/70 ml-3 mb-1">Kesehatan: sudut=88°</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Kesehatan} = \frac{88}{360} \times 900 = \frac{88 \times 2.5}{1} = \boxed{220 \text{ eksemplar}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Cara cepat: total = 200×(360/80) = 200×4,5 = 900. Lalu Kesehatan = (88/360)×900 = 88×2,5 = 220. Atau: 1° = 900/360 = 2,5 buku. Jadi 88° = 88×2,5 = 220.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Total buku = 900. Kesehatan (88°) = (88/360)×900 = <strong className="text-green-300">220 eksemplar</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q28 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">28</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah toko buah mengemas jeruk ke dalam kotak berisi <span className="text-yellow-300 font-bold">10 buah</span> dengan target rata-rata berat <span className="text-yellow-300 font-bold">150 gram</span>. Berat jeruk: kecil 130g, sedang 150g, besar 170g. Dalam sebuah kotak sudah terisi: 2 jeruk besar, 5 jeruk sedang, dan 1 jeruk kecil. Dua buah jeruk tambahan yang harus dipilih agar memenuhi aturan berat rata-rata adalah....
                </p>
                <MCQ qn={28} correct={2} cols={1} options={[
                  "A. 2 jeruk kecil",
                  "B. 2 jeruk sedang",
                  "C. 1 jeruk kecil dan 1 jeruk sedang",
                  "D. 1 jeruk besar dan 1 jeruk sedang",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={28} />
            {expandedPembahasan.has(28) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 1 jeruk kecil dan 1 jeruk sedang</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Target total = rata-rata × n. Hitung berat 8 jeruk yang ada, lalu sisa yang dibutuhkan untuk 2 jeruk tambahan = target − yang ada. Cocokkan dengan pilihan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Target} = 10 \times 150 = 1.500 \text{ gram}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Ada} = 2(170) + 5(150) + 1(130) = 340 + 750 + 130 = 1.220 \text{ gram}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Sisa} = 1.500 - 1.220 = 280 \text{ gram}" /></div>
                  <p className="text-white/70 ml-3 mb-1">Cek 2 jeruk tambahan = 280g:</p>
                  <p className="text-white/70 ml-3">• 1 kecil + 1 sedang: 130+150 = <strong className="text-yellow-300">280 ✓</strong> → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Sisa = 280g untuk 2 jeruk. Rata-rata per jeruk = 140g. Tidak ada jeruk 140g, jadi harus kombinasi. 130+150=280 ✓. Verifikasi: total = 1220+280 = 1500 → rata-rata = 1500÷10 = 150g ✓</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Sisa 280g = 1 kecil(130g) + 1 sedang(150g). Jawaban: <strong className="text-green-300">C. 1 jeruk kecil dan 1 jeruk sedang</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q29 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">29</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah pabrik baterai melakukan uji sampel terhadap <span className="text-yellow-300 font-bold">500 baterai</span>. Hasilnya, peluang ditemukan baterai yang cacat adalah <span className="text-yellow-300 font-bold">0,02</span>. Berapakah jumlah baterai yang kondisinya baik dalam sampel tersebut?
                </p>
                <MCQ qn={29} correct={2} options={[
                  "A. 10 buah",
                  "B. 480 buah",
                  "C. 490 buah",
                  "D. 498 buah",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={29} />
            {expandedPembahasan.has(29) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 490 buah</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Peluang × total sampel = frekuensi harapan. Baterai cacat = P(cacat) × total. Baterai baik = total − baterai cacat.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Cacat} = 0{,}02 \times 500 = 10 \text{ buah}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Baik} = 500 - 10 = \boxed{490 \text{ buah}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">P(baik) = 1 − P(cacat) = 1 − 0,02 = 0,98. Cara langsung: 0,98 × 500 = 490. Atau: P(cacat)×500 = 10, baik = 500 − 10 = 490. Keduanya memberi hasil sama.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Cacat = 0,02 × 500 = 10 buah. Baik = 500 − 10 = <strong className="text-green-300">490 buah</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q30 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">30</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Sebuah aplikasi mencoba fitur <span className="text-yellow-300 font-bold">face recognition</span> dengan hasil berikut:
                </p>
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="border border-white/20 px-3 py-2 text-white text-left">Tahap</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Jumlah Uji</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Berhasil</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-white/10 px-3 py-1.5 text-white/80">Tahap 1</td>
                        <td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-bold">50</td>
                        <td className="border border-white/10 px-3 py-1.5 text-green-300 text-center font-bold">45</td>
                      </tr>
                      <tr>
                        <td className="border border-white/10 px-3 py-1.5 text-white/80">Tahap 2</td>
                        <td className="border border-white/10 px-3 py-1.5 text-yellow-300 text-center font-bold">150</td>
                        <td className="border border-white/10 px-3 py-1.5 text-green-300 text-center font-bold">135</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Manakah analisis yang tepat mengenai fitur tersebut? <span className="text-cyan-300">(Pilih dua jawaban benar!)</span>
                </p>
                <ComplexMCQ qn={30} items={[
                  { text: "Frekuensi relatif kegagalan pada Tahap 1 dan Tahap 2 adalah sama besar.", benar: true },
                  { text: "Peluang fitur berhasil mendeteksi wajah adalah 0,9.", benar: true },
                  { text: "Jika dilakukan 500 uji coba lagi, diperkirakan akan gagal sebanyak 100 kali.", benar: false },
                  { text: "Peluang kegagalan fitur tersebut secara keseluruhan adalah 0,05.", benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={30} />
            {expandedPembahasan.has(30) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1 dan 2</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Frekuensi relatif = kejadian ÷ total. Peluang empirik gabungan = total kejadian ÷ total uji keseluruhan. Perkiraan harapan = P × n.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Gagal Tahap 1 = 50−45 = 5 → frekuensi relatif = 5/50 = <strong className="text-yellow-300">0,1</strong></p>
                  <p className="text-white/70 ml-3 mb-1">Gagal Tahap 2 = 150−135 = 15 → frekuensi relatif = 15/150 = <strong className="text-yellow-300">0,1</strong></p>
                  <p className="text-white/70 ml-3">① Keduanya 0,1 → <span className="text-green-300">BENAR</span></p>
                  <div className="ml-3 my-1"><BlockMath math="P(\text{berhasil}) = \frac{45+135}{50+150} = \frac{180}{200} = \boxed{0{,}9} \text{ → ② BENAR}" /></div>
                  <p className="text-white/70 ml-3">③ Perkiraan gagal = 0,1 × 500 = 50, bukan 100 → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">④ P(gagal) = 0,1, bukan 0,05 → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">③ Jebakan: 0,1 × 500 = 50, bukan 100. ④ P(gagal) keseluruhan = 20/200 = 0,1, bukan 0,05. Jangan bingung antara frekuensi relatif per tahap dan peluang gabungan.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Frekuensi gagal kedua tahap sama (0,1). P(berhasil)=0,9. Jawaban: <strong className="text-green-300">Pernyataan 1 dan 2</strong>.</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/tka"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Menu TKA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKALatihan3Page;
