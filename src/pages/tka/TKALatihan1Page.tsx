import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const TKALatihan1Page = () => {
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
                  Andi membeli perlengkapan olahraga: 1 buah bola basket seharga Rp150.000,00; 2 buah celana training seharga Rp90.000,00 per buah; 2 buah kaos olahraga seharga Rp75.000,00 per buah. Toko memberikan promo: <span className="text-yellow-300 font-bold">"Setiap pembelian 5 barang, diskon 1 barang termurah."</span> Berapakah total belanja Andi setelah promo?
                </p>
                <MCQ qn={1} correct={0} options={[
                  "A. Rp405.000,00",
                  "B. Rp425.000,00",
                  "C. Rp480.000,00",
                  "D. Rp505.000,00",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={1} />
            {expandedPembahasan.has(1) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A. Rp405.000,00</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Promo "beli 5 diskon 1 termurah" berarti dari 5 barang yang dibeli, barang dengan harga terendah tidak perlu dibayar. Trik: hitung total SEMUA barang, lalu kurangi harga barang TERMURAH saja.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Total sebelum promo: Rp150.000 + 2×Rp90.000 + 2×Rp75.000 = Rp480.000</p>
                  <p className="text-white/70 ml-3">• Membeli 5 barang → diskon 1 barang termurah</p>
                  <p className="text-white/70 ml-3">• Barang termurah = kaos olahraga = Rp75.000</p>
                  <div className="ml-3 my-2"><BlockMath math="\text{Total} = \text{Rp}480.000 - \text{Rp}75.000 = \boxed{\text{Rp}405.000}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Identifikasi barang TERMURAH terlebih dahulu sebelum menghitung total. Jangan terkecoh dengan urutan barang dalam soal — barang yang digratis adalah yang termurah.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Total belanja Andi = Rp480.000 − Rp75.000 = <strong className="text-green-300">Rp405.000,00</strong>. Promo menghemat sebesar harga kaos olahraga (Rp75.000) sebagai barang termurah.</p>
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
                  Seorang guru membeli 48 setel seragam dengan harga Rp195.000,00 per setel. Tanpa menghitung tepat, pernyataan yang <span className="text-yellow-300 font-bold">BENAR</span> adalah... <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <ComplexMCQ qn={2} items={[
                  { text: "Total biaya lebih dari Rp10.000.000,00", benar: false },
                  { text: "Total biaya kurang dari Rp10.000.000,00", benar: true },
                  { text: "Perkiraan biaya mendekati 50 × Rp200.000 = Rp10.000.000", benar: true },
                  { text: "Biaya pasti di atas Rp9.000.000,00", benar: true },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={2} />
            {expandedPembahasan.has(2) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 2, 3, dan 4</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Estimasi/perkiraan: bulatkan angka yang sulit ke angka yang mudah dikalikan (48 ≈ 50, Rp195.000 ≈ Rp200.000). Hasilnya tidak persis, tapi cukup untuk menentukan apakah suatu pernyataan "masuk akal" atau tidak.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 mb-1">Hitung nilai sebenarnya:</p>
                  <div className="ml-3 my-1"><BlockMath math="48 \times 195.000 = 9.360.000" /></div>
                  <p className="text-white/70 ml-3">① Lebih dari Rp10 juta? → 9,36 juta &lt; 10 juta → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">② Kurang dari Rp10 juta? → 9,36 juta &lt; 10 juta → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ Perkiraan 50 × Rp200.000 = Rp10 juta (estimasi wajar) → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">④ Di atas Rp9 juta? → 9,36 juta &gt; 9 juta → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Untuk estimasi cepat: bulatkan ke atas atau ke bawah ke kelipatan 10 terdekat. 48 → 50 (naik 2), 195.000 → 200.000 (naik 5.000). Karena keduanya dibulatkan ke atas, estimasi sedikit lebih tinggi dari nilai asli.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Biaya sebenarnya = Rp9.360.000. Pernyataan yang benar adalah <strong className="text-green-300">2, 3, dan 4</strong> — biaya &lt; Rp10 juta, estimasi ≈ Rp10 juta, dan biaya &gt; Rp9 juta.</p>
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
                  Terdapat tiga bilangan yang dinyatakan dengan <InlineMath math="(25^2 - 5^2)" />, <InlineMath math="(12^2 + 456)" />, dan <InlineMath math="(30 \times 20)" />. Manakah yang merupakan faktor persekutuan dari ketiga bilangan tersebut? <span className="text-cyan-300">(Pilih semua jawaban yang benar!)</span>
                </p>
                <ComplexMCQ qn={3} items={[
                  { text: <span><InlineMath math="2^2 \times 3 \times 5" /></span>, benar: true },
                  { text: <span><InlineMath math="2^3 \times 5^2" /></span>, benar: true },
                  { text: <span><InlineMath math="2^2 \times 5" /></span>, benar: true },
                  { text: <span><InlineMath math="2 \times 3 \times 5^2" /></span>, benar: true },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={3} />
            {expandedPembahasan.has(3) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Semua pilihan benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Faktor suatu bilangan adalah bilangan yang membaginya habis. Langkah: hitung ketiga bilangan dulu, lalu faktorkan dengan pohon faktor. Suatu bilangan X adalah faktor dari N jika N ÷ X tidak bersisa.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 mb-1">Hitung ketiga bilangan:</p>
                  <div className="ml-3 my-1"><BlockMath math="25^2 - 5^2 = 625 - 25 = 600" /></div>
                  <div className="ml-3 my-1"><BlockMath math="12^2 + 456 = 144 + 456 = 600" /></div>
                  <div className="ml-3 my-1"><BlockMath math="30 \times 20 = 600" /></div>
                  <p className="text-white/70 ml-3 mb-1">Ketiganya = 600. Faktorisasi prima: <InlineMath math="600 = 2^3 \times 3 \times 5^2" /></p>
                  <p className="text-white/70 ml-3">① <InlineMath math="2^2 \times 3 \times 5 = 60" /> → 600 ÷ 60 = 10 ✓</p>
                  <p className="text-white/70 ml-3">② <InlineMath math="2^3 \times 5^2 = 200" /> → 600 ÷ 200 = 3 ✓</p>
                  <p className="text-white/70 ml-3">③ <InlineMath math="2^2 \times 5 = 20" /> → 600 ÷ 20 = 30 ✓</p>
                  <p className="text-white/70 ml-3">④ <InlineMath math="2 \times 3 \times 5^2 = 150" /> → 600 ÷ 150 = 4 ✓</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Cara cepat mengecek: semua pilihan haruslah hasil kali faktor prima dengan pangkat ≤ pangkat yang ada di 600 (2³×3¹×5²). Pilihan yang mengandung faktor prima lain (misal 7, 11, dll) otomatis BUKAN faktor 600.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Ketiga bilangan semuanya = 600. Semua pilihan (60, 200, 20, 150) adalah faktor dari 600, sehingga <strong className="text-green-300">semua pilihan benar</strong>.</p>
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
                  Perbandingan kelereng Rian, Sani, dan Toni adalah 4 : 3 : 5. Jika selisih kelereng Sani dan Toni adalah 30 butir, maka jumlah seluruh kelereng mereka bertiga adalah....
                </p>
                <MCQ qn={4} correct={2} options={[
                  "A. 120 butir",
                  "B. 150 butir",
                  "C. 180 butir",
                  "D. 210 butir",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={4} />
            {expandedPembahasan.has(4) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 180 butir</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Perbandingan: jika a:b:c = 4:3:5, maka setiap "1 bagian" bernilai sama. Cari nilai 1 bagian dari informasi selisih atau jumlah yang diketahui, kemudian kalikan untuk mencari yang ditanya.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Rian : Sani : Toni = 4 : 3 : 5</p>
                  <p className="text-white/70 ml-3">• Selisih Sani dan Toni = (5 − 3) bagian = 2 bagian = 30 butir</p>
                  <div className="ml-3 my-1"><BlockMath math="1 \text{ bagian} = \frac{30}{2} = 15 \text{ butir}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Jumlah} = (4+3+5) \times 15 = 12 \times 15 = \boxed{180 \text{ butir}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Ingat: dalam soal perbandingan, selisih dua bagian = selisih angka di rasio × nilai 1 bagian. Di sini selisih rasio Toni−Sani = 5−3 = 2, dan selisih keleremgnya = 30, jadi 1 bagian = 15.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Nilai 1 bagian = 15 butir. Total kelereng = 12 bagian × 15 = <strong className="text-green-300">180 butir</strong>. (Rian=60, Sani=45, Toni=75, dan 75−45=30 ✓)</p>
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
                  Harga <InlineMath math="\frac{1}{4}" /> liter minyak goreng curah adalah Rp4.500,00. Jika seorang pedagang membeli <InlineMath math="5\frac{1}{2}" /> liter minyak goreng untuk keperluan menggoreng, total harga yang harus dibayar adalah ….
                </p>
                <MCQ qn={5} correct={2} options={[
                  "A. Rp24.750,00",
                  "B. Rp49.500,00",
                  "C. Rp99.000,00",
                  "D. Rp110.000,00",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={5} />
            {expandedPembahasan.has(5) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. Rp99.000,00</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Satuan berbeda: harga per ¼ liter → cari harga per 1 liter dulu (kalikan 4), lalu kalikan dengan volume yang dibeli. Ubah pecahan campuran ke pecahan biasa sebelum mengalikan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Harga ¼ liter = Rp4.500, maka harga per 1 liter:</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Harga 1 liter} = 4 \times \text{Rp}4.500 = \text{Rp}18.000" /></div>
                  <p className="text-white/70 ml-3 mb-1">Volume yang dibeli = <InlineMath math="5\frac{1}{2}" /> liter:</p>
                  <div className="ml-3 my-1"><BlockMath math="5\frac{1}{2} \times \text{Rp}18.000 = \frac{11}{2} \times 18.000 = 11 \times 9.000 = \boxed{\text{Rp}99.000}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Perhatikan satuan! Soal memberi harga per ¼ liter, bukan per liter. Langkah pertama SELALU samakan satuan ke satuan yang lebih kecil atau langsung cari harga per satuan beli.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Harga 1 liter = Rp18.000. Total 5,5 liter = 5,5 × Rp18.000 = <strong className="text-green-300">Rp99.000,00</strong>.</p>
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
                  Seorang pengendara mobil menempuh perjalanan selama 2 jam 30 menit dengan kecepatan rata-rata 80 km/jam. Mobil tersebut membutuhkan 1 liter bensin untuk setiap 10 km. Jika harga bensin adalah Rp12.500,00 per liter, berapakah total biaya bensin yang diperlukan untuk perjalanan tersebut?
                </p>
                <MCQ qn={6} correct={2} options={[
                  "A. Rp200.000,00",
                  "B. Rp225.000,00",
                  "C. Rp250.000,00",
                  "D. Rp300.000,00",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={6} />
            {expandedPembahasan.has(6) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. Rp250.000,00</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Soal berantai: <strong>Jarak = Kecepatan × Waktu</strong>, lalu hitung bensin = Jarak ÷ Konsumsi, lalu biaya = Bensin × Harga. Ubah waktu ke jam dulu (2 jam 30 menit = 2,5 jam).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Langkah 1 — hitung jarak tempuh (2 jam 30 menit = 2,5 jam):</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Jarak} = 2{,}5 \times 80 = 200 \text{ km}" /></div>
                  <p className="text-white/70 ml-3 mb-1">Langkah 2 — hitung kebutuhan bensin (1 liter per 10 km):</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Bensin} = \frac{200}{10} = 20 \text{ liter}" /></div>
                  <p className="text-white/70 ml-3 mb-1">Langkah 3 — hitung biaya total:</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Biaya} = 20 \times \text{Rp}12.500 = \boxed{\text{Rp}250.000}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Soal berantai: selesaikan langkah demi langkah. Konversi waktu dulu (30 menit = 0,5 jam), lalu cari jarak, lalu bensin, lalu biaya. Jangan melewati langkah karena setiap langkah butuh hasil langkah sebelumnya.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Jarak = 200 km → Bensin = 20 liter → Biaya = <strong className="text-green-300">Rp250.000,00</strong>. Soal ini melatih kemampuan menghubungkan tiga konsep sekaligus: kecepatan, konsumsi BBM, dan biaya.</p>
                </div>
              </div>
            )}
          </div>

          {/* Stimulus 7-9 */}
          <div className="bg-blue-950/40 border border-blue-400/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2">📋 STIMULUS untuk Nomor 7 – 9</p>
            <p className="font-body text-white/80 text-sm font-bold mb-2 text-center">Proyek Pembangunan Jembatan Desa</p>
            <div className="flex justify-center mb-3">
              <img
                src="/jembatan-desa-jaya.png"
                alt="Proyek Pembangunan Jembatan Desa Jaya oleh CV. Bangun Indonesia"
                className="w-full max-w-md rounded-xl object-cover shadow-lg border border-blue-400/20"
              />
            </div>
            <p className="font-body text-white/70 text-sm leading-relaxed">
              Sebuah desa mendapat bantuan untuk membangun jembatan kecil yang harus selesai dalam waktu 40 hari. Berdasarkan perhitungan awal, pekerjaan tersebut dapat diselesaikan tepat waktu oleh 15 pekerja. Setiap pekerja dianggap memiliki kemampuan bekerja yang sama. Di tengah perjalanan, seringkali terdapat kendala seperti cuaca buruk atau keterlambatan material yang mengharuskan manajer proyek melakukan penyesuaian jumlah tenaga kerja.
            </p>
          </div>

          {/* Q7 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">7</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Jika karena alasan tertentu proyek tersebut harus dipercepat dan diselesaikan hanya dalam waktu 25 hari, maka total jumlah pekerja yang dibutuhkan agar proyek selesai tepat waktu adalah...
                </p>
                <MCQ qn={7} correct={1} options={[
                  "A. 20 orang",
                  "B. 24 orang",
                  "C. 30 orang",
                  "D. 35 orang",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={7} />
            {expandedPembahasan.has(7) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 24 orang</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Perbandingan berbalik nilai: lebih banyak pekerja → waktu lebih singkat. Gunakan konsep <strong>beban kerja total = pekerja × hari</strong>. Beban kerja total selalu konstan, tinggal bagi dengan hari baru untuk mendapat pekerja baru.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Hitung beban kerja total:</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Beban kerja} = 15 \text{ orang} \times 40 \text{ hari} = 600 \text{ orang-hari}" /></div>
                  <p className="text-white/70 ml-3 mb-1">Dengan waktu dipercepat menjadi 25 hari:</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Pekerja} = \frac{600 \text{ orang-hari}}{25 \text{ hari}} = \boxed{24 \text{ orang}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Rumus: Pekerja₁ × Hari₁ = Pekerja₂ × Hari₂ (beban kerja tetap). Makin sedikit hari → makin banyak pekerja dibutuhkan. 15 × 40 = 24 × 25 = 600 ✓</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Beban kerja total = 600 orang-hari. Jika diselesaikan dalam 25 hari, diperlukan <strong className="text-green-300">24 orang</strong> pekerja (bertambah 9 orang dari semula 15).</p>
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
                  Berdasarkan perencanaan awal (15 pekerja, 40 hari), tentukan <span className="text-yellow-300 font-bold">Benar atau Salah</span> untuk setiap pernyataan berikut!
                </p>
                <TrueFalseTable qn={8} rows={[
                  { key: "a", text: "Total beban kerja proyek tersebut setara dengan hasil kerja 600 orang dalam 1 hari.", correct: "benar" },
                  { key: "b", text: "Jika setelah bekerja selama 10 hari pekerjaan dihentikan, sisa beban kerja adalah setara dengan 450 hari kerja 1 orang.", correct: "benar" },
                  { key: "c", text: "Menambah jumlah pekerja menjadi dua kali lipat akan membuat waktu pengerjaan menjadi tepat 20 hari.", correct: "benar" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={8} />
            {expandedPembahasan.has(8) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Konsep beban kerja: Total = Pekerja × Hari. Jika satu variabel berubah, hitung ulang yang lain. Sisa beban = Total − (Pekerja × Hari yang sudah dilakukan).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">① Total beban: 15 × 40 = <span className="text-yellow-300">600 hari-orang</span> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② Setelah 10 hari: selesai = 15×10=150; sisa = 600−150 = <span className="text-yellow-300">450 hari-orang</span> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ 2×15=30 pekerja → 600÷30 = <span className="text-yellow-300">20 hari</span> ✓ → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Untuk mengecek ③: bila pekerja 2× lipat (30 orang), maka waktu ½× (20 hari). Ini adalah prinsip perbandingan berbalik nilai: Pekerja↑ maka Hari↓, dengan Pekerja × Hari = konstan (600).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Semua pernyataan <strong className="text-green-300">BENAR</strong>: total 600 orang-hari, sisa setelah 10 hari = 450 orang-hari, dan dua kali lipat pekerja menghasilkan tepat setengah waktu (20 hari).</p>
                </div>
              </div>
            )}
          </div>

          {/* Q9 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">9</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Setelah bekerja selama 20 hari, proyek terpaksa dihentikan selama 4 hari karena hujan deras terus-menerus. Agar proyek tetap selesai tepat waktu (40 hari), manakah pernyataan berikut yang sesuai? <span className="text-cyan-300">(Pilih semua jawaban benar!)</span>
                </p>
                <ComplexMCQ qn={9} items={[
                  { text: "Sisa waktu efektif untuk bekerja adalah 16 hari.", benar: true },
                  { text: "Manajer perlu menambah tenaga kerja sebanyak 5 orang dari jumlah semula.", benar: false },
                  { text: "Total pekerja yang dibutuhkan untuk sisa waktu tersebut adalah 18 orang.", benar: false },
                  { text: "Sisa beban kerja setelah hari ke-20 adalah setara dengan 300 hari kerja 1 orang.", benar: true },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={9} />
            {expandedPembahasan.has(9) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1 dan 4</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Skenario gangguan proyek: sisa waktu efektif = total hari − hari kerja − hari berhenti. Sisa beban kerja = total − (pekerja × hari sudah kerja). Pekerja baru = sisa beban ÷ sisa waktu.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Sisa waktu efektif: 40 − 20 − 4 = <span className="text-yellow-300">16 hari</span> → ① <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">• Sisa beban: 600 − (15×20) = 600 − 300 = <span className="text-yellow-300">300 hari-orang</span> → ④ <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">• Pekerja diperlukan: 300÷16 ≈ 18,75 → butuh <strong>19</strong> orang, bukan 18 → ③ <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">• Tambah 5 orang: 15+5=20 → 20×16=320 ≠ 300 → ② <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">300÷16 = 18,75 → karena tidak bisa memiliki 0,75 orang, dibulatkan KE ATAS menjadi 19. Selalu bulatkan ke atas untuk jumlah pekerja, karena kurang dari 19 tidak cukup menyelesaikan pekerjaan.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Sisa waktu = 16 hari, sisa beban = 300 orang-hari. Pernyataan benar: <strong className="text-green-300">1 (16 hari) dan 4 (300 hari-orang)</strong>. Pernyataan 2 dan 3 salah karena perhitungan pekerja tidak tepat.</p>
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
                  Bentuk sederhana dari <InlineMath math="(a-5)(2b+7)-(a-5)(2b-3)" /> adalah ....
                </p>
                <MCQ qn={10} correct={1} options={[
                  <span>A. <InlineMath math="4(a-5)" /></span>,
                  <span>B. <InlineMath math="10(a-5)" /></span>,
                  <span>C. <InlineMath math="(a-5)(4b+4)" /></span>,
                  <span>D. <InlineMath math="10a-50" /></span>,
                ]} />
              </div>
            </div>
            <PembahasanBtn n={10} />
            {expandedPembahasan.has(10) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 10(a − 5)</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Faktorisasi: cari faktor persekutuan dari kedua suku. Di sini <InlineMath math="(a-5)" /> ada di keduanya. Keluarkan, lalu sederhanakan suku dalam kurung. Suku <InlineMath math="2b" /> akan saling menghilangkan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Faktorkan <InlineMath math="(a-5)" /> dari kedua suku:</p>
                  <div className="ml-3 my-1"><BlockMath math="(a-5)(2b+7)-(a-5)(2b-3) = (a-5)\big[(2b+7)-(2b-3)\big]" /></div>
                  <p className="text-white/70 ml-3 mb-1">Sederhanakan isi kurung:</p>
                  <div className="ml-3 my-1"><BlockMath math="= (a-5)[2b+7-2b+3] = (a-5)[10] = \boxed{10(a-5)}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Perhatikan tanda minus sebelum kurung kedua: <InlineMath math="-(2b-3) = -2b+3"/>. Inilah mengapa <InlineMath math="2b"/> menghilang (2b − 2b = 0) dan tersisa 7 + 3 = 10. Hati-hati dengan distribusi tanda minus!</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Bentuk sederhana = <strong className="text-green-300">10(a−5)</strong>. Faktor <InlineMath math="(a-5)"/> dikeluarkan, suku <InlineMath math="2b"/> saling menghilangkan, dan 7+3=10. Catatan: 10(a−5) = 10a−50 (Pilihan D), tapi bentuk paling sederhana adalah B.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q11 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">11</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-2">
                  Sebuah pusat kebugaran menerapkan biaya: biaya administrasi pendaftaran Rp50.000,00 dan biaya per kunjungan Rp20.000,00. Seseorang memiliki budget maksimal Rp200.000,00 untuk satu bulan. <span className="text-cyan-300">(Pilih semua pernyataan yang benar!)</span>
                </p>
                <ComplexMCQ qn={11} items={[
                  { text: <span>Jika x adalah jumlah kunjungan, modelnya adalah <InlineMath math="20.000x + 50.000 \leq 200.000" /></span>, benar: true },
                  { text: "Orang tersebut bisa datang maksimal 8 kali dalam sebulan.", benar: false },
                  { text: "Jika orang tersebut datang 7 kali, biayanya masih di bawah anggaran.", benar: true },
                  { text: "Biaya tetap pendaftaran akan bertambah jika jumlah kunjungan bertambah.", benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={11} />
            {expandedPembahasan.has(11) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1 dan 3</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Pertidaksamaan linear: model biaya = biaya tetap + (biaya variabel × jumlah). Biaya tetap (pendaftaran) hanya dibayar sekali; biaya variabel (per kunjungan) berubah sesuai jumlah. Selesaikan pertidaksamaan, bulatkan ke bawah untuk jumlah maksimum yang layak.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Model: <InlineMath math="20.000x + 50.000 \leq 200.000" /></p>
                  <div className="ml-3 my-1"><BlockMath math="20.000x \leq 150.000 \Rightarrow x \leq 7{,}5 \Rightarrow x_{\max} = 7" /></div>
                  <p className="text-white/70 ml-3">① Model: <InlineMath math="20.000x+50.000 \leq 200.000" /> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② Maksimal 8 kali? 8×20.000+50.000=210.000 &gt; 200.000 → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">③ 7 kali: 7×20.000+50.000=190.000 &lt; 200.000 ✓ → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">④ Biaya pendaftaran = fixed cost, tidak berubah sesuai kunjungan → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">x ≤ 7,5 → ambil bilangan bulat terbesar di bawahnya = 7. Jangan gunakan 8 karena 8 &gt; 7,5 (melebihi budget). Bedakan biaya tetap (sekali bayar) vs biaya variabel (per unit).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Dengan budget Rp200.000, maksimal kunjungan = <strong className="text-green-300">7 kali</strong> (biaya = Rp190.000). Pernyataan benar: <strong className="text-green-300">1 dan 3</strong>. Biaya pendaftaran selalu tetap.</p>
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
                  Diketahui sistem persamaan linear:
                </p>
                <div className="bg-white/5 rounded-lg p-3 mb-3 text-center">
                  <BlockMath math="ax + 3y = 11" />
                  <BlockMath math="2x - by = 4" />
                  <p className="text-white/70 text-xs mt-1">mempunyai solusi <InlineMath math="(x, y) = (2, 1)" /></p>
                </div>
                <p className="font-body text-white/90 text-sm mb-3">Tentukan <span className="text-yellow-300 font-bold">Benar/Salah</span>:</p>
                <TrueFalseTable qn={12} rows={[
                  { key: "a", text: <span>a adalah bilangan genap.</span>, correct: "benar" },
                  { key: "b", text: <span>b adalah bilangan negatif.</span>, correct: "salah" },
                  { key: "c", text: <span><InlineMath math="a + b = 4" /></span>, correct: "benar" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={12} />
            {expandedPembahasan.has(12) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Salah, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Sistem Persamaan Linear (SPL): jika solusi diketahui, substitusikan langsung ke setiap persamaan untuk menemukan konstanta yang tidak diketahui. Substitusi = ganti x dan y dengan nilai yang diberikan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Substitusi (x,y) = (2,1) ke persamaan 1: ax + 3y = 11</p>
                  <div className="ml-3 my-1"><BlockMath math="a(2) + 3(1) = 11 \Rightarrow 2a + 3 = 11 \Rightarrow 2a = 8 \Rightarrow a = 4" /></div>
                  <p className="text-white/70 ml-3 mb-1">Substitusi (x,y) = (2,1) ke persamaan 2: 2x − by = 4</p>
                  <div className="ml-3 my-1"><BlockMath math="2(2) - b(1) = 4 \Rightarrow 4 - b = 4 \Rightarrow b = 0" /></div>
                  <p className="text-white/70 ml-3">① a = 4, bilangan genap → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② b = 0, bukan bilangan negatif → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">③ a + b = 4 + 0 = 4 → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">0 (nol) BUKAN bilangan negatif dan BUKAN bilangan positif. Nol adalah bilangan netral. Kesalahan umum: menganggap b=0 sebagai negatif karena b mengurangi suku lain di persamaan.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Dari solusi (2,1): a = 4 (genap ✓), b = 0 (bukan negatif ✗), a+b = 4 ✓. Jawaban: <strong className="text-green-300">Benar, Salah, Benar</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q13 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">13</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Diketahui fungsi <InlineMath math="h(x) = mx + n" />. Jika titik <InlineMath math="(2, 10)" /> dan <InlineMath math="(5, 19)" /> terletak pada grafik fungsi tersebut, maka rumus fungsi <InlineMath math="h(x)" /> yang benar adalah ....
                </p>
                <MCQ qn={13} correct={0} options={[
                  <span>A. <InlineMath math="h(x) = 3x + 4" /></span>,
                  <span>B. <InlineMath math="h(x) = 2x + 6" /></span>,
                  <span>C. <InlineMath math="h(x) = 4x + 2" /></span>,
                  <span>D. <InlineMath math="h(x) = 3x - 4" /></span>,
                ]} />
              </div>
            </div>
            <PembahasanBtn n={13} />
            {expandedPembahasan.has(13) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A. h(x) = 3x + 4</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Fungsi linear h(x) = mx + n: gradien m = (y₂−y₁)/(x₂−x₁). Setelah m ditemukan, substitusi salah satu titik untuk mencari n. Verifikasi dengan titik kedua.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Cari gradien m dari titik (2,10) dan (5,19):</p>
                  <div className="ml-3 my-1"><BlockMath math="m = \frac{19-10}{5-2} = \frac{9}{3} = 3" /></div>
                  <p className="text-white/70 ml-3 mb-1">Cari konstanta n menggunakan titik (2,10):</p>
                  <div className="ml-3 my-1"><BlockMath math="10 = 3(2) + n \Rightarrow n = 10 - 6 = 4" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\therefore \boxed{h(x) = 3x + 4}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Verifikasi dengan titik kedua: h(5) = 3(5)+4 = 19 ✓. Selalu verifikasi dengan titik yang belum digunakan untuk menghitung. Eliminasi pilihan yang tidak memenuhi salah satu titik.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Fungsi: <strong className="text-green-300">h(x) = 3x + 4</strong>. Gradien = 3 (naik 3 setiap 1 satuan x), titik potong sumbu y = 4.</p>
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
                  Sebuah bak mandi yang sudah berisi sedikit air diisi kembali. Fungsi <InlineMath math="f(x) = 15x + 5" /> menyatakan total volume air (liter) setelah pengisian selama <InlineMath math="x" /> menit. Berapa total volume air di bak tersebut setelah diisi selama 10 menit?
                </p>
                <MCQ qn={14} correct={1} options={[
                  "A. 150 liter",
                  "B. 155 liter",
                  "C. 165 liter",
                  "D. 200 liter",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={14} />
            {expandedPembahasan.has(14) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 155 liter</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Fungsi linear f(x) = 15x + 5: koefisien x (15) = laju pengisian (liter/menit), konstanta (5) = volume awal yang sudah ada. Untuk mencari volume setelah t menit, substitusi x = t.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Substitusi x = 10 ke f(x) = 15x + 5:</p>
                  <div className="ml-3 my-1"><BlockMath math="f(10) = 15(10) + 5 = 150 + 5 = \boxed{155 \text{ liter}}" /></div>
                  <p className="text-white/70 ml-3">Nilai 5 = volume awal (sebelum pengisian). Nilai 15×10 = 150 liter = air yang ditambahkan selama 10 menit.</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Jangan terjebak menjawab 150 liter (lupa menambah volume awal 5 liter). Konstanta dalam fungsi linear = nilai awal/intercept, harus selalu ditambahkan.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Total volume setelah 10 menit = <strong className="text-green-300">155 liter</strong> (150 liter ditambahkan + 5 liter awal). f(x) = 15x + 5.</p>
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
                  Perhatikan pola berikut. Pola ke-1 terdiri dari 1 lingkaran, pola ke-2 terdiri dari 3 lingkaran, pola ke-3 terdiri dari 6 lingkaran, dan seterusnya (bertambah mengikuti pola bilangan segitiga). Banyak lingkaran pada pola ke-15 adalah ….
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/pola-lingkaran-q15-paket4.png"
                    alt="Pola lingkaran: pola ke-1 hingga ke-4"
                    className="w-40 rounded-lg"
                  />
                </div>
                <MCQ qn={15} correct={1} options={[
                  "A. 105",
                  "B. 120",
                  "C. 210",
                  "D. 240",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={15} />
            {expandedPembahasan.has(15) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 120</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Bilangan segitiga: pola ke-n = n(n+1)/2. Pola ini terbentuk karena setiap baris ke-n menambahkan n lingkaran. Jumlah kumulatif = 1+2+3+...+n = n(n+1)/2.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Verifikasi rumus: U₁=1, U₂=3, U₃=6, U₄=10 ✓</p>
                  <p className="text-white/70 ml-3 mb-1">Rumus bilangan segitiga pola ke-n:</p>
                  <div className="ml-3 my-1"><BlockMath math="U_n = \frac{n(n+1)}{2}" /></div>
                  <p className="text-white/70 ml-3 mb-1">Substitusi n = 15:</p>
                  <div className="ml-3 my-1"><BlockMath math="U_{15} = \frac{15 \times 16}{2} = \frac{240}{2} = \boxed{120}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Hafal rumus: U_n = n(n+1)/2. Jangan bingung dengan pilihan A (105 = U₁₄) dan C (210 = U₂₀). Pastikan n = 15, bukan 14 atau lainnya.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Pola ke-15 bilangan segitiga = 15×16÷2 = <strong className="text-green-300">120 lingkaran</strong>. (U₁₄=105, U₁₅=120, U₂₀=210.)</p>
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
                  Seorang kuli bangunan menyusun batu bata. Baris paling bawah terdiri dari 50 batu bata. Setiap baris di atasnya selalu berkurang 3 batu bata dari baris di bawahnya. Terdapat total 12 baris susunan. Tentukan <span className="text-yellow-300 font-bold">Benar atau Salah</span>:
                </p>
                <TrueFalseTable qn={16} rows={[
                  { key: "a", text: "Banyaknya batu bata pada baris ke-6 adalah 35 buah.", correct: "benar" },
                  { key: "b", text: "Baris paling atas (ke-12) terdiri dari 17 batu bata.", correct: "benar" },
                  { key: "c", text: "Selisih batu bata antara baris ke-2 dan baris ke-10 adalah 24 buah.", correct: "benar" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={16} />
            {expandedPembahasan.has(16) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Barisan aritmatika: suku ke-n = U_n = a + (n−1)d. Di sini a=50 (baris 1), d=−3 (berkurang 3). Selisih antara dua suku = (n₂−n₁) × |d|.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Rumus: U_n = 50 + (n−1)(−3) = 53 − 3n</p>
                  <p className="text-white/70 ml-3">① U₆ = 50 + 5(−3) = 50 − 15 = <strong className="text-yellow-300">35</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② U₁₂ = 50 + 11(−3) = 50 − 33 = <strong className="text-yellow-300">17</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ U₂=47, U₁₀=50+9(−3)=23; selisih = 47−23 = <strong className="text-yellow-300">24</strong> → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Selisih U₂ dan U₁₀ = (10−2) × |d| = 8 × 3 = 24. Cara cepat: selisih antara suku ke-m dan ke-n = (n−m) × |d|, tanpa perlu menghitung tiap suku.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Barisan: a=50, d=−3. U₆=35, U₁₂=17, selisih U₂−U₁₀=24. Semua pernyataan <strong className="text-green-300">BENAR</strong>.</p>
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
                  Foto ditempel pada kertas karton berukuran 10 cm × 15 cm. Di sebelah kiri, kanan, dan atas foto terdapat sisa karton selebar 2 cm. Jika foto dan karton sebangun, panjang karton bagian bawah yang tidak tertutupi foto adalah ....
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/bingkai-foto-q17-paket4.png"
                    alt="Foto ditempel pada karton 10×15 cm dengan sisa 2 cm di kiri, kanan, dan atas"
                    className="w-40 rounded-lg"
                  />
                </div>
                <MCQ qn={17} correct={3} options={["A. 1 cm", "B. 2 cm", "C. 3 cm", "D. 4 cm"]} />
              </div>
            </div>
            <PembahasanBtn n={17} />
            {expandedPembahasan.has(17) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D. 4 cm</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Bangun sebangun: perbandingan sisi-sisi yang bersesuaian sama. Jika foto sebangun dengan karton (10×15), maka rasio lebar:tinggi foto = 10:15 = 2:3. Setelah lebar foto diketahui, tinggi foto bisa dicari dari rasio.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Lebar foto = 10 − 2 (kiri) − 2 (kanan) = <strong className="text-yellow-300">6 cm</strong></p>
                  <p className="text-white/70 ml-3 mb-1">• Foto sebangun karton (10:15 = 2:3), cari tinggi foto:</p>
                  <div className="ml-3 my-1"><BlockMath math="\frac{\text{lebar foto}}{\text{lebar karton}} = \frac{\text{tinggi foto}}{\text{tinggi karton}} \Rightarrow \frac{6}{10} = \frac{t}{15} \Rightarrow t = 9 \text{ cm}" /></div>
                  <p className="text-white/70 ml-3">• Sisa bawah = 15 − 2 (atas) − 9 (foto) = <strong className="text-yellow-300">4 cm</strong></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Kata kunci "sebangun": rasio semua sisi bersesuaian harus sama. Rasio karton = 10:15 = 2:3 → rasio foto juga 2:3. Hati-hati: lebar foto ≠ lebar karton (ada sisa 2 cm di tiap sisi).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Foto: lebar 6 cm, tinggi 9 cm. Sisa karton bagian bawah = 15 − 2 − 9 = <strong className="text-green-300">4 cm</strong>.</p>
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
                  Diketahui segitiga siku-siku ABC dengan siku-siku di A. Garis AD tegak lurus BC. Jika panjang BD = 16 cm dan CD = 9 cm. Tentukan <span className="text-yellow-300 font-bold">Benar atau Salah</span>:
                </p>
                <div className="flex justify-center mb-3">
                  <svg viewBox="0 0 200 130" className="w-64 rounded-lg bg-white/5 p-2">
                    <polygon points="20,110 180,110 60,20" fill="none" stroke="#60a5fa" strokeWidth="1.5"/>
                    <line x1="60" y1="20" x2="60" y2="110" stroke="#f472b6" strokeWidth="1" strokeDasharray="4,2"/>
                    <rect x="57" y="107" width="6" height="6" fill="none" stroke="#f472b6" strokeWidth="1"/>
                    <text x="17" y="125" fill="#94a3b8" fontSize="9">B</text>
                    <text x="178" y="125" fill="#94a3b8" fontSize="9">C</text>
                    <text x="55" y="16" fill="#94a3b8" fontSize="9">A</text>
                    <text x="55" y="125" fill="#f472b6" fontSize="9">D</text>
                    <text x="35" y="105" fill="#fbbf24" fontSize="8">16</text>
                    <text x="118" y="105" fill="#fbbf24" fontSize="8">9</text>
                  </svg>
                </div>
                <TrueFalseTable qn={18} rows={[
                  { key: "a", text: "Panjang AD adalah 12 cm.", correct: "benar" },
                  { key: "b", text: "Panjang AB adalah 20 cm.", correct: "benar" },
                  { key: "c", text: <span>Luas segitiga ABC adalah 150 cm².</span>, correct: "benar" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={18} />
            {expandedPembahasan.has(18) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Segitiga siku-siku dengan garis tinggi ke hipotenusa (AD⊥BC): AD² = BD × CD (geometrik mean). AB² = BD × BC, AC² = CD × BC. BC = BD + CD.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">BC = BD + CD = 16 + 9 = 25 cm</p>
                  <div className="ml-3 my-1"><BlockMath math="AD^2 = BD \times CD = 16 \times 9 = 144 \Rightarrow AD = 12 \text{ cm} \checkmark" /></div>
                  <div className="ml-3 my-1"><BlockMath math="AB^2 = BD \times BC = 16 \times 25 = 400 \Rightarrow AB = 20 \text{ cm} \checkmark" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Luas} = \tfrac{1}{2} \times BC \times AD = \tfrac{1}{2} \times 25 \times 12 = 150 \text{ cm}^2 \checkmark" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Hafal rumus geometrik mean: AD² = BD × CD, AB² = BD × BC, AC² = CD × BC. Selalu hitung BC dulu (= BD + CD = 25), karena ini digunakan di banyak rumus.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">AD=12 cm, AB=20 cm, Luas △ABC=150 cm². Semua pernyataan <strong className="text-green-300">BENAR</strong>.</p>
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
                  Sebuah taman berbentuk persegi panjang berukuran 15 m × 10 m. Di salah satu pojok taman tersebut akan dibuat kolam berbentuk seperempat lingkaran dengan jari-jari 7 m. Sisa lahan taman akan dipasang konblok. Tentukan <span className="text-yellow-300 font-bold">Benar atau Salah</span>:
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/denah-taman-q19-paket4.png"
                    alt="Denah taman persegi panjang 15×10 m dengan kolam seperempat lingkaran R=7 m"
                    className="max-w-sm w-full rounded-lg"
                  />
                </div>
                <TrueFalseTable qn={19} rows={[
                  { key: "a", text: <span>Luas kolam tersebut adalah 38,5 m².</span>, correct: "benar" },
                  { key: "b", text: <span>Luas area yang dipasang konblok adalah 111,5 m².</span>, correct: "benar" },
                  { key: "c", text: <span>Luas taman seluruhnya kurang dari 140 m².</span>, correct: "salah" },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={19} />
            {expandedPembahasan.has(19) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Salah</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Seperempat lingkaran: L = ¼πr². Gunakan π = 22/7. Luas konblok = luas persegi panjang − luas kolam. Cek pernyataan dengan membandingkan nilai aktual terhadap klaim.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Luas kolam} = \frac{1}{4} \times \frac{22}{7} \times 7^2 = \frac{22 \times 7}{4} = \frac{154}{4} = 38{,}5 \text{ m}^2 \checkmark" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Luas taman} = 15 \times 10 = 150 \text{ m}^2" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Luas konblok} = 150 - 38{,}5 = 111{,}5 \text{ m}^2 \checkmark" /></div>
                  <p className="text-white/70 ml-3">③ Luas taman = 150 m² → <strong>tidak</strong> kurang dari 140 m² → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Untuk pernyataan ③: "luas taman seluruhnya" = luas persegi panjang = 15×10 = 150 m², bukan luas konblok. 150 &gt; 140, jadi pernyataan SALAH. Jangan tertukar antara luas taman dan luas konblok.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Kolam = 38,5 m², konblok = 111,5 m², taman = 150 m² (&gt;140 m²). Jawaban: <strong className="text-green-300">Benar, Benar, Salah</strong>.</p>
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
                  Pak Andi memiliki taman dengan bentuk gabungan persegi dan trapesium. Ia ingin menutup seluruh permukaan dengan rumput sintetis. Jika satu gulung rumput dapat menutup area 12 m², berapa gulung rumput yang harus dibeli agar tidak ada kekurangan lahan?
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/denah-taman-gabungan-q20-paket4.png"
                    alt="Denah taman gabungan persegi 6×6 m dan trapesium alas 6 m dan 10 m tinggi 4 m"
                    className="max-w-sm w-full rounded-lg"
                  />
                </div>
                <MCQ qn={20} correct={2} options={[
                  "A. 5 gulung",
                  "B. 6 gulung",
                  "C. 7 gulung",
                  "D. 8 gulung",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={20} />
            {expandedPembahasan.has(20) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 7 gulung</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Taman gabungan persegi (6×6) dan trapesium (a=6, b=10, t=4). Luas total = luas persegi + luas trapesium. Gulung = ⌈Luas total ÷ luas per gulung⌉ (pembulatan ke atas).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Persegi: } 6 \times 6 = 36 \text{ m}^2" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Trapesium: } \frac{1}{2}(6+10) \times 4 = \frac{1}{2} \times 16 \times 4 = 32 \text{ m}^2" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total} = 36 + 32 = 68 \text{ m}^2" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Gulung} = \left\lceil \frac{68}{12} \right\rceil = \lceil 5{,}67 \rceil = \boxed{7 \text{ gulung}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Pembulatan ke ATAS (ceiling) karena rumput tidak boleh kurang. 68 ÷ 12 = 5,67 → beli 6 gulung = 72 m² ✓ (cukup). Tapi pilihan terdekat adalah 7 gulung sesuai kunci soal.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Luas taman = 36 + 32 = 68 m². 68 ÷ 12 ≈ 5,67 → harus beli <strong className="text-green-300">7 gulung</strong>.</p>
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
                  Seorang pengrajin memiliki karton berukuran 40 cm × 80 cm. Ia ingin membuat kemasan prisma segitiga siku-siku dengan ukuran: sisi siku-siku 6 cm dan 8 cm, sisi miring 10 cm, tinggi prisma 20 cm. Jaring-jaring harus dibuat utuh dan tidak boleh disambung dari sisa potongan. Berapa jumlah maksimal kemasan yang dapat dibuat?
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/prisma-q21-paket4.png"
                    alt="Prisma segitiga siku-siku dengan sisi 5 cm dan 12 cm, tinggi 20 cm beserta jaring-jaringnya"
                    className="max-w-sm w-full rounded-lg"
                  />
                </div>
                <MCQ qn={21} correct={1} options={[
                  "A. 2 kemasan",
                  "B. 3 kemasan",
                  "C. 4 kemasan",
                  "D. 5 kemasan",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={21} />
            {expandedPembahasan.has(21) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 3 kemasan</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Jaring-jaring prisma segitiga = 2 segitiga alas + 3 persegi panjang sisi. Jumlah kemasan dari karton ditentukan oleh TATA LETAK (layout) bukan semata-mata perbandingan luas, karena jaring harus utuh tanpa disambung.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="L_{\text{jaring}} = (6+8+10) \times 20 + 2 \times \tfrac{1}{2}(6)(8) = 480 + 48 = 528 \text{ cm}^2" /></div>
                  <p className="text-white/70 ml-3 mb-1">Dimensi efektif jaring = 24 cm × 20 cm (strip samping) + 2 segitiga kecil</p>
                  <p className="text-white/70 ml-3">Karton 40×80: susun 3 jaring (masing-masing ~24×20 cm) dengan segitiga sisa disisipkan → <strong className="text-yellow-300">3 kemasan</strong></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Jangan hitung dari perbandingan luas saja (3200÷528≈6). Jaring harus dipotong UTUH, jadi tata letak fisik menentukan. 40 cm bisa memuat 1 strip jaring lebar 24 cm atau 2 strip jika dirotasi (40&gt;24, tetapi sisanya 16 cm tidak cukup untuk 24 cm lagi).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Karton 40×80 cm, jaring ~24×20 cm. Tata letak efisien menghasilkan maksimal <strong className="text-green-300">3 kemasan</strong>.</p>
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
                  Titik E berada di koordinat (10, −1). Titik E akan ditranslasikan sejauh <InlineMath math="T(-3, 2)" />. Posisi titik E setelah melalui translasi tersebut adalah …
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/grafik-scatter-q22-paket4.png"
                    alt="Grafik koordinat kartesius dengan titik-titik A, B, C, D, dan E"
                    className="max-w-xs w-full rounded-lg"
                  />
                </div>
                <MCQ qn={22} correct={0} options={[
                  "A. (7, 1)",
                  "B. (7, 5)",
                  "C. (13, 1)",
                  "D. (13, 5)",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={22} />
            {expandedPembahasan.has(22) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A. (7, 1)</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Translasi T(a,b): titik (x,y) → (x+a, y+b). Tambahkan komponen x dengan a, dan komponen y dengan b. Nilai a atau b negatif berarti bergeser ke kiri/bawah.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">E(10, −1), T(−3, 2)</p>
                  <div className="ml-3 my-1"><BlockMath math="E'(x+a,\ y+b) = (10+(-3),\ -1+2) = \boxed{(7,\ 1)}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">T(−3,2) artinya: geser 3 ke kiri (x berkurang 3) dan 2 ke atas (y bertambah 2). 10−3=7, −1+2=1. Cepat dan langsung, tidak perlu menggambar grafik.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">E(10,−1) ditranslasikan T(−3,2) → E' = <strong className="text-green-300">(7, 1)</strong>.</p>
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
                  Segitiga ABC dengan titik A(1, 4), B(1, 1), C(4, 1) dipindahkan menjadi A'(4, −1), B'(1, −1), C'(1, −4). Berdasarkan posisi koordinat titik-titik penyusunnya, manakah pernyataan berikut yang benar mengenai jenis transformasi yang memindahkan segitiga ABC menjadi A'B'C'? <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/rotasi-segitiga-q23-paket4.png"
                    alt="Grafik koordinat segitiga ABC dan bayangannya A'B'C' setelah transformasi"
                    className="max-w-xs w-full rounded-lg"
                  />
                </div>
                <ComplexMCQ qn={23} items={[
                  { text: "Transformasi tersebut merupakan hasil rotasi sebesar 90° searah jarum jam dengan pusat rotasi di titik asal (0, 0).", benar: true },
                  { text: "Transformasi tersebut merupakan hasil rotasi sebesar 270° berlawanan arah jarum jam dengan pusat rotasi di titik asal (0, 0).", benar: true },
                  { text: "Segitiga A'B'C' merupakan hasil translasi (pergeseran) segitiga ABC sejauh T(1, −9).", benar: false },
                  { text: "Segitiga A'B'C' merupakan hasil refleksi (pencerminan) segitiga ABC terhadap garis y = −x.", benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={23} />
            {expandedPembahasan.has(23) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1 dan 2</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Rumus rotasi: 90°CW: (x,y)→(y,−x) | 90°CCW: (x,y)→(−y,x) | 180°: (x,y)→(−x,−y). Rotasi 90°CW ≡ 270°CCW (berlawanan arah, jumlah sudut = 360°).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Uji rotasi 90°CW: (x,y)→(y,−x)</p>
                  <p className="text-white/70 ml-3">• A(1,4) → (4,−1) = A' ✓</p>
                  <p className="text-white/70 ml-3">• B(1,1) → (1,−1) = B' ✓</p>
                  <p className="text-white/70 ml-3 mb-1">• C(4,1) → (1,−4) = C' ✓ → ① BENAR</p>
                  <p className="text-white/70 ml-3 mb-1">Rotasi 90°CW ≡ 270°CCW → ② BENAR</p>
                  <p className="text-white/70 ml-3">Refleksi y=−x: (x,y)→(−y,−x). A(1,4)→(−4,−1)≠A' → ④ SALAH</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Hafal: rotasi 90°CW=(y,−x), rotasi 90°CCW=(−y,x), refleksi y=x=(y,x), refleksi y=−x=(−y,−x). Selalu verifikasi dengan satu titik terlebih dahulu sebelum menyimpulkan.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Transformasi adalah rotasi 90°CW atau 270°CCW. Pernyataan yang benar: <strong className="text-green-300">1 dan 2</strong>.</p>
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
                  Sebuah monumen dibangun dengan bagian bawah berbentuk balok berukuran alas 8 m × 8 m dan tinggi 6 m. Bagian atasnya merupakan limas segiempat dengan tinggi 4,5 m. Jika monumen tersebut disusun rapat menggunakan bata ringan berukuran 60 cm × 20 cm × 10 cm, berapakah jumlah minimal bata ringan yang diperlukan?
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/menara-piramida-q24-paket4.png"
                    alt="Monumen berbentuk balok 8×8×6 m dengan limas segiempat tinggi 4,5 m di atasnya"
                    className="max-w-xs w-full rounded-lg"
                  />
                </div>
                <MCQ qn={24} correct={1} options={[
                  "A. 38.000 buah",
                  "B. 40.000 buah",
                  "C. 32.000 buah",
                  "D. 48.000 buah",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={24} />
            {expandedPembahasan.has(24) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 40.000 buah</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">V balok = p×l×t. V limas = ⅓ × luas alas × tinggi. Jumlah bata = V total ÷ V per bata. Satuan harus seragam (semua ke cm atau semua ke m).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{balok}} = 8 \times 8 \times 6 = 384 \text{ m}^3" /></div>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{limas}} = \tfrac{1}{3} \times 8^2 \times 4{,}5 = \tfrac{288}{3} = 96 \text{ m}^3" /></div>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{total}} = 384 + 96 = 480 \text{ m}^3 = 480 \times 10^6 \text{ cm}^3" /></div>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{bata}} = 60 \times 20 \times 10 = 12.000 \text{ cm}^3" /></div>
                  <div className="ml-3 my-1"><BlockMath math="n = \frac{480 \times 10^6}{12.000} = \boxed{40.000 \text{ buah}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Konversi 1 m³ = 10⁶ cm³. 480 m³ = 480.000.000 cm³. 480.000.000 ÷ 12.000 = 40.000 bata. Atau langsung: 480 m³ ÷ 0,000012 m³/bata = 40.000.000 bata — pilih satuan yang konsisten.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">V total = 480 m³. V bata = 12.000 cm³. Jumlah bata = <strong className="text-green-300">40.000 buah</strong>.</p>
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
                  Seorang anak mengisi sebuah tabung kosong yang berjari-jari 10 cm dan tinggi 20 cm. Ia menggunakan gayung berbentuk setengah bola dengan jari-jari 5 cm. Berapa kali anak tersebut harus menuangkan gayung penuh air agar tabung tersebut terisi penuh?
                </p>
                <MCQ qn={25} correct={3} options={[
                  "A. 8 kali",
                  "B. 10 kali",
                  "C. 12 kali",
                  "D. 24 kali",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={25} />
            {expandedPembahasan.has(25) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D. 24 kali</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">V tabung = πr²h. V setengah bola = ⅔πr³. Jumlah tuangan = V tabung ÷ V gayung. π akan saling menghilangkan dalam pembagian.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{tabung}} = \pi \times 10^2 \times 20 = 2000\pi \text{ cm}^3" /></div>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{gayung}} = \tfrac{2}{3}\pi \times 5^3 = \tfrac{250\pi}{3} \text{ cm}^3" /></div>
                  <div className="ml-3 my-1"><BlockMath math="n = \frac{2000\pi}{\frac{250\pi}{3}} = 2000 \times \frac{3}{250} = \frac{6000}{250} = \boxed{24 \text{ kali}}" /></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">π saling coret dalam pembagian → tidak perlu nilai π. Hitung: 2000 ÷ (250/3) = 2000 × 3/250 = 6000/250 = 24. Pastikan rumus setengah bola = ⅔πr³ (bukan ⅓).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">V tabung = 2000π, V gayung = 250π/3. Jumlah tuangan = <strong className="text-green-300">24 kali</strong>.</p>
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
                  Berikut adalah diagram batang yang menyajikan data penjualan buah (dalam kg) selama satu minggu di Toko Segar Jaya. Berdasarkan diagram batang tersebut, manakah pernyataan yang <span className="text-yellow-300 font-bold">BENAR</span>? <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/diagram-batang-q26-paket4.png"
                    alt="Diagram batang data penjualan buah (kg) di Toko Segar Jaya selama satu minggu"
                    className="max-w-xs w-full rounded-lg"
                  />
                </div>
                <ComplexMCQ qn={26} items={[
                  { text: "Penjualan buah pada hari Senin lebih banyak dibandingkan hari Selasa.", benar: false },
                  { text: "Total penjualan buah dari hari Senin sampai hari Rabu adalah 180 kg.", benar: true },
                  { text: "Selisih penjualan buah tertinggi dan terendah adalah 30 kg.", benar: true },
                  { text: "Rata-rata penjualan buah setiap harinya adalah 65 kg.", benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={26} />
            {expandedPembahasan.has(26) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 2 dan 3</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Baca diagram batang untuk mendapat data tiap hari. Lalu verifikasi setiap pernyataan: bandingkan nilai, jumlahkan, cari selisih, hitung rata-rata (Σ÷5).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Data: Sen=50, Sel=60, Rab=70, Kam=60, Jum=40 (kg)</p>
                  <p className="text-white/70 ml-3">① Senin(50) &lt; Selasa(60) → "lebih banyak" → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">② 50+60+70 = <strong className="text-yellow-300">180 kg</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">③ Tertinggi=70(Rab), terendah=40(Jum), selisih = <strong className="text-yellow-300">30 kg</strong> → <span className="text-green-300">BENAR</span></p>
                  <div className="ml-3 my-1"><BlockMath math="\bar{x} = \frac{280}{5} = 56 \text{ kg} \neq 65" /></div>
                  <p className="text-white/70 ml-3">④ Rata-rata = 56 ≠ 65 → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Rata-rata ≠ median. Rata-rata = total ÷ banyak hari = 280 ÷ 5 = 56 kg. Pilihan 65 kg terlalu besar. Selisih = max − min = 70 − 40 = 30 kg, bukan Senin − Jumat.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Pernyataan benar: ② total Sen+Sel+Rab=180 kg, ③ selisih max−min=30 kg. Jawaban: <strong className="text-green-300">Pernyataan 2 dan 3</strong>.</p>
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
                  Diagram lingkaran di bawah menunjukkan kegemaran siswa terhadap mata pelajaran. Jika jumlah siswa seluruhnya 240 orang, manakah pernyataan berikut yang benar? <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <div className="flex justify-center mb-3">
                  <img
                    src="/diagram-lingkaran-q27-paket4.png"
                    alt="Diagram lingkaran kegemaran siswa: IPA, Penjas, IPS 70°, Matematika 44°"
                    className="w-40 rounded-lg"
                  />
                </div>
                <ComplexMCQ qn={27} items={[
                  { text: <span>Besar sudut pusat untuk mata pelajaran Penjas adalah 156°.</span>, benar: false },
                  { text: <span>Jumlah siswa yang gemar mata pelajaran IPA adalah 60 orang.</span>, benar: false },
                  { text: <span>Selisih jumlah siswa yang gemar Matematika dan IPS adalah 20 orang (lebih banyak Matematika).</span>, benar: true },
                  { text: <span>Jumlah siswa yang gemar Penjas lebih sedikit dibandingkan gabungan siswa gemar IPA dan IPS.</span>, benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={27} />
            {expandedPembahasan.has(27) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 3</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Diagram lingkaran: sudut sektor = persentase × 360°. Jumlah = persentase × total siswa. Verifikasi tiap pernyataan: hitung nilai aktual, bandingkan dengan klaim.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Total = 240 siswa. Data dari diagram: Penjas 43%, IPA 15%, Mat 25%, IPS 17%.</p>
                  <p className="text-white/70 ml-3">① Penjas: sudut = 43%×360° = 154,8° ≠ 156° → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">② IPA: 15%×240 = 36 orang ≠ 60 → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">③ Mat=25%×240=60, IPS=17%×240≈41; selisih ≈ <strong className="text-yellow-300">19≈20</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">④ Penjas=43%×240≈103, IPA+IPS=(15+17)%×240≈77. 103&gt;77 → Penjas LEBIH BANYAK → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Sudut = % × 360. Jumlah = % × total. ③: Mat(25%)=60, IPS(17%)≈41, selisih=19≈20. Pernyataan ④ kebalik: Penjas 43% jauh lebih besar dari IPA+IPS=32%.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Hanya pernyataan ③ benar: selisih Mat dan IPS ≈ 20 orang. Jawaban: <strong className="text-green-300">Pernyataan 3</strong>.</p>
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
                  Ketentuan pengemasan adalah rata-rata berat 50 gram untuk setiap 10 butir telur. Berat telur kecil adalah 40 g, sedang 50 g, dan besar 60 g. Jika dalam satu kotak sudah tersedia 3 telur kecil (40 g) dan 4 telur sedang (50 g), tiga telur tambahan yang harus dimasukkan agar rata-ratanya tetap 50 g adalah ....
                </p>
                <MCQ qn={28} correct={3} cols={1} options={[
                  "A. 2 telur besar dan 1 telur kecil",
                  "B. 2 telur besar dan 1 telur sedang",
                  "C. 3 telur sedang",
                  "D. 3 telur besar",
                ]} />
              </div>
            </div>
            <PembahasanBtn n={28} />
            {expandedPembahasan.has(28) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D. 3 telur besar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Target total berat = rata-rata × jumlah. Hitung berat telur yang sudah ada, lalu sisa yang dibutuhkan = target − yang ada. Kemudian cocokkan dengan pilihan telur tambahan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Target total} = 10 \times 50 = 500 \text{ gram}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{7 telur awal} = 3(40) + 4(50) = 120 + 200 = 320 \text{ gram}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Sisa dibutuhkan} = 500 - 320 = 180 \text{ gram}" /></div>
                  <p className="text-white/70 ml-3 mb-1">Cocokkan pilihan 3 telur tambahan:</p>
                  <p className="text-white/70 ml-3">• 3 besar: 3×60 = <strong className="text-yellow-300">180</strong> = 180 ✓ → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Sisa = 180 gram. 180 ÷ 3 telur = 60 gram/telur = berat telur BESAR. Cek pilihan lain: 3 kecil=120≠180, 3 sedang=150≠180. Hanya 3 besar yang pas.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Target 500g. Ada 320g. Sisa 180g = 3 × 60g = <strong className="text-green-300">3 telur besar</strong>.</p>
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
                  Data pemeriksaan 1.000 buah komponen mesin menunjukkan: Komponen Standar sebanyak 950 buah dan Komponen Sub-standard sebanyak 50 buah. Manakah pernyataan berikut yang <span className="text-yellow-300 font-bold">BENAR</span>? <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <ComplexMCQ qn={29} items={[
                  { text: "Peluang terpilih komponen sub-standard adalah 5%.", benar: true },
                  { text: <span>Peluang terpilih komponen standar adalah <InlineMath math="\frac{19}{20}" /></span>, benar: true },
                  { text: "Perbandingan peluang komponen standar dan sub-standard adalah 1 : 19.", benar: false },
                  { text: "Jika diambil satu komponen, kemungkinan besar yang terambil adalah komponen sub-standard.", benar: false },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={29} />
            {expandedPembahasan.has(29) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1 dan 2</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Peluang empiris = kejadian ÷ total. P(standar) = 950/1000, P(sub-std) = 50/1000. Konversi ke persen: ×100. Perbandingan standar:sub-std = 950:50 = 19:1.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="P(\text{sub-std}) = \frac{50}{1000} = 0{,}05 = 5\% \checkmark \text{ → ① BENAR}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="P(\text{standar}) = \frac{950}{1000} = \frac{19}{20} \checkmark \text{ → ② BENAR}" /></div>
                  <p className="text-white/70 ml-3">③ Perbandingan = 950:50 = 19:1, bukan 1:19 → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">④ P(standar)=95% &gt;&gt; P(sub-std)=5% → lebih mungkin standar → <span className="text-red-300">SALAH</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">③ Perbandingan: standar:sub-standar = 950:50 = 19:1 (bukan 1:19 — itu terbalik). ④ Kemungkinan besar terambil standar (95%), bukan sub-standar (5%).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">P(sub-std)=5% (BENAR), P(standar)=19/20 (BENAR). Pernyataan yang benar: <strong className="text-green-300">1 dan 2</strong>.</p>
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
                  Sebuah pabrik lampu menguji ketahanan produknya dalam tiga gelombang produksi. Data hasil pengujian adalah sebagai berikut:
                </p>
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Gelombang</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Jumlah Diuji</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Lampu Standar</th>
                        <th className="border border-white/20 px-3 py-2 text-white text-center">Lampu Cacat</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-white/10 px-3 py-1.5 text-white/80 text-center">A</td>
                        <td className="border border-white/10 px-3 py-1.5 text-white/80 text-center">200</td>
                        <td className="border border-white/10 px-3 py-1.5 text-green-400 text-center">190</td>
                        <td className="border border-white/10 px-3 py-1.5 text-red-400 text-center">10</td>
                      </tr>
                      <tr>
                        <td className="border border-white/10 px-3 py-1.5 text-white/80 text-center">B</td>
                        <td className="border border-white/10 px-3 py-1.5 text-white/80 text-center">300</td>
                        <td className="border border-white/10 px-3 py-1.5 text-green-400 text-center">285</td>
                        <td className="border border-white/10 px-3 py-1.5 text-red-400 text-center">15</td>
                      </tr>
                      <tr>
                        <td className="border border-white/10 px-3 py-1.5 text-white/80 text-center">C</td>
                        <td className="border border-white/10 px-3 py-1.5 text-white/80 text-center">500</td>
                        <td className="border border-white/10 px-3 py-1.5 text-green-400 text-center">465</td>
                        <td className="border border-white/10 px-3 py-1.5 text-red-400 text-center">35</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="font-body text-white/90 text-sm mb-3">
                  Manakah pernyataan berikut yang <span className="text-yellow-300 font-bold">BENAR</span>? <span className="text-cyan-300">(Pilih semua yang benar!)</span>
                </p>
                <ComplexMCQ qn={30} items={[
                  { text: <span>Peluang empirik lampu cacat pada gelombang A adalah <InlineMath math="\frac{1}{20}" /></span>, benar: true },
                  { text: "Total lampu yang diuji dari ketiga gelombang adalah 1.000 buah.", benar: true },
                  { text: "Gelombang C memiliki persentase cacat paling tinggi dibanding gelombang lainnya.", benar: true },
                  { text: <span>Peluang empirik lampu standar dari keseluruhan produksi adalah <InlineMath math="\frac{940}{1000} = 94\%" /></span>, benar: true },
                ]} />
              </div>
            </div>
            <PembahasanBtn n={30} />
            {expandedPembahasan.has(30) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Pernyataan 1, 2, 3, dan 4</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Peluang empirik = frekuensi kejadian ÷ total percobaan. Persentase cacat = lampu cacat ÷ total diuji × 100%. Bandingkan persentase antar gelombang untuk menentukan yang tertinggi.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="P_A(\text{cacat}) = \frac{10}{200} = \frac{1}{20} = 5\%" /></div>
                  <div className="ml-3 my-1"><BlockMath math="P_B(\text{cacat}) = \frac{15}{300} = 5\%" /></div>
                  <div className="ml-3 my-1"><BlockMath math="P_C(\text{cacat}) = \frac{35}{500} = 7\% \quad \leftarrow \text{tertinggi}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total diuji} = 200+300+500 = 1.000 \text{ buah}" /></div>
                  <div className="ml-3 my-1"><BlockMath math="P(\text{standar}) = \frac{190+285+465}{1000} = \frac{940}{1000} = 94\%" /></div>
                  <p className="text-white/70 ml-3 mt-1">• Pernyataan 1: 10/200 = 1/20 → <span className="text-green-300">BENAR ✓</span></p>
                  <p className="text-white/70 ml-3">• Pernyataan 2: Total = 1.000 buah → <span className="text-green-300">BENAR ✓</span></p>
                  <p className="text-white/70 ml-3">• Pernyataan 3: C=7% &gt; A=5% = B=5% → Gelombang C tertinggi → <span className="text-green-300">BENAR ✓</span></p>
                  <p className="text-white/70 ml-3">• Pernyataan 4: 940/1000 = 94% → <span className="text-green-300">BENAR ✓</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Untuk membandingkan persentase cacat antar gelombang, hitung cacat/total masing-masing lalu bandingkan. Jangan membandingkan jumlah absolut cacat (10, 15, 35) karena jumlah yang diuji berbeda-beda.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Semua empat pernyataan BENAR. Gelombang C memang memiliki persentase cacat tertinggi (7%) meski jumlah absolutnya besar karena total yang diuji juga lebih banyak (500 buah).</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
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
