import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const TKALatihan4Page = () => {
  const navigate = useNavigate();
  const [expandedPembahasan, setExpandedPembahasan] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
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

  const selectTrueFalse = (key: string, choice: 'benar' | 'salah') => {
    if (selectedTrueFalse[key] !== undefined) return;
    playPopSound();
    setSelectedTrueFalse(prev => ({ ...prev, [key]: choice }));
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

  const QBox = ({ n, children }: { n: number; children: React.ReactNode }) => (
    <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
      <div className="flex gap-3 mb-3">
        <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">{n}</span>
        <div className="flex-1">{children}</div>
      </div>
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
            <img src="/logo-numatik.png" alt="NUMATIK" className="mx-auto mb-2 w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <p className="font-body text-white/60 text-xs mb-1">SOAL TES PENDALAMAN MATERI TKA</p>
            <h1 className="font-display text-lg font-bold text-primary text-glow-cyan mb-1">TES KEMAMPUAN AKADEMIK (TKA)</h1>
            <p className="font-body text-white/60 text-xs mb-3">KORWIL YOGYA UTARA — MATEMATIKA</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-left text-xs font-body">
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Mata Pelajaran:</span><span className="text-white ml-1">Matematika</span></div>
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Kelas:</span><span className="text-white ml-1">VI SD</span></div>
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Paket:</span><span className="text-accent ml-1 font-bold">PAKET 4</span></div>
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Jumlah Soal:</span><span className="text-white ml-1">30 Soal</span></div>
          </div>
        </div>

        {/* Petunjuk */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <p className="font-body text-blue-300 text-xs font-bold mb-2">PETUNJUK UMUM</p>
          <ol className="list-decimal list-inside space-y-1 text-white/70 text-xs font-body">
            <li>Berdoalah sebelum dan sesudah mengerjakan test!</li>
            <li>Jumlah soal sebanyak 30 butir soal.</li>
            <li>Periksa dan bacalah soal-soal dengan cermat sebelum menjawab!</li>
            <li>Periksalah pekerjaan Anda sebelum selesai!</li>
          </ol>
          <p className="font-body text-yellow-300 text-xs font-bold mt-3 mb-1">PETUNJUK KHUSUS</p>
          <p className="text-white/70 text-xs font-body">Jawablah sesuai dengan bentuk soal: pilihan ganda, pilihan ganda kompleks, ataupun kategori (Benar/Salah)!</p>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-5">

          {/* Q1 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">1</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">Perhatikan gambar berikut! Bagian yang diarsir pada gambar senilai dengan ….</p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal1.png" alt="Gambar soal nomor 1" className="max-w-[200px] rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={1} correct={3} options={[
                  <span>A. <InlineMath math="\dfrac{3}{4}"/></span>,
                  <span>B. <InlineMath math="\dfrac{2}{5}"/></span>,
                  <span>C. <InlineMath math="\dfrac{4}{12}"/></span>,
                  <span>D. <InlineMath math="\dfrac{1}{4}"/></span>,
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={1}/>
            {expandedPembahasan.has(1) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D. 1/4</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Pecahan = bagian yang dipilih ÷ total bagian keseluruhan. Untuk soal gambar arsiran, hitung banyak bagian yang diarsir dibagi total bagian yang sama besar, lalu sederhanakan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/80 mb-1">Dari gambar, segitiga besar terbagi menjadi <strong className="text-yellow-300">16 segitiga kecil</strong> sama besar (4 baris). Segitiga yang diarsir ada <strong className="text-yellow-300">4 buah</strong>.</p>
                  <div className="ml-3 my-2"><BlockMath math="\text{Bagian diarsir} = \frac{4}{16} = \frac{1}{4}"/></div>
                  <p className="text-white/70">Pilihan D (<InlineMath math="\frac{1}{4}"/>) adalah hasil penyederhanaan dari <InlineMath math="\frac{4}{16}"/> (dibagi 4).</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Pastikan semua bagian memiliki ukuran yang sama sebelum menghitung. Jika tidak sama, bagi dulu hingga semua sama besar. Kemudian sederhanakan pecahan dengan FPB pembilang dan penyebut.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Bagian yang diarsir = <strong className="text-green-300">1/4</strong> dari keseluruhan gambar. Ini karena 4 dari 16 segitiga kecil yang diarsir, dan 4/16 disederhanakan menjadi 1/4.</p>
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
                  Pak Mardi membuat kartu bilangan untuk kelompok Candra yang terdiri 5 anak (Candra, Edi, Dirga, Andi, Budi). Setiap anak memegang satu kartu pecahan. Kelompok Candra diminta berdiri sesuai urutan dari kartu <strong className="text-yellow-300">terbesar</strong>. Urutan Kelompok Candra yang benar adalah ….
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal2.png" alt="Gambar soal nomor 2" className="max-w-full rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={2} correct={0} cols={1} options={[
                  "A. Candra, Edi, Dirga, Andi, Budi",
                  "B. Candra, Edi, Dirga, Budi, Andi",
                  "C. Candra, Dirga, Edi, Andi, Budi",
                  "D. Budi, Andi, Dirga, Edi, Candra",
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={2}/>
            {expandedPembahasan.has(2) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A. Candra, Edi, Dirga, Andi, Budi</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Untuk membandingkan pecahan yang berbeda bentuk (biasa, desimal, persen, campuran), ubah semua ke bentuk DESIMAL dulu. Ini paling mudah dan akurat untuk perbandingan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/80 mb-1">Ubah semua kartu ke bentuk desimal:</p>
                  <div className="bg-white/5 rounded-lg p-3 space-y-1 my-2">
                    <p className="text-white/70">• Andi: <InlineMath math="\dfrac{21}{8} = 2{,}625"/></p>
                    <p className="text-white/70">• Budi: <InlineMath math="\dfrac{13}{5} = 2{,}600"/></p>
                    <p className="text-white/70">• Candra: <InlineMath math="2{,}67 = 2{,}670"/></p>
                    <p className="text-white/70">• Dirga: <InlineMath math="266\% = 2{,}660"/></p>
                    <p className="text-white/70">• Edi: <InlineMath math="2\tfrac{2}{3} \approx 2{,}6\overline{6} = 2{,}667"/></p>
                  </div>
                  <p className="text-white/80 mb-1">Urutkan dari <strong className="text-yellow-300">terbesar ke terkecil</strong>:</p>
                  <div className="ml-3 my-1"><BlockMath math="2{,}670 > 2{,}667 > 2{,}660 > 2{,}625 > 2{,}600"/></div>
                  <div className="ml-3"><BlockMath math="\underbrace{Candra}_{2,670} > \underbrace{Edi}_{2,667} > \underbrace{Dirga}_{2,660} > \underbrace{Andi}_{2,625} > \underbrace{Budi}_{2,600}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Ubah ke desimal: pecahan biasa (bagi), persen (÷100), campuran (bulat + sisa÷penyebut). Hati-hati dengan bilangan berulang: <InlineMath math="2\tfrac{2}{3} = 2{,}666..." /> lebih besar dari 2,660 meskipun terlihat hampir sama.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Urutan dari terbesar ke terkecil: <strong className="text-green-300">Candra (2,670) → Edi (2,667) → Dirga (2,660) → Andi (2,625) → Budi (2,600)</strong>. Jawaban A benar.</p>
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
                  Lanang membuat jus jambu, jus nanas, dan jus mangga. Banyaknya jus mangga <InlineMath math="1\frac{5}{16}"/> liter, jus nanas 1,37 liter, jus jambu 1,375 liter. Tentukan Benar atau Salah pernyataan berikut!
                </p>
                <TrueFalseTable qn={3} rows={[
                  { key:"a", text:"Jus buah terbanyak yang dibuat Lanang adalah jus jambu", correct:"benar" },
                  { key:"b", text:<span>Selisih jus jambu dengan jus mangga adalah 0,0625 liter</span>, correct:"benar" },
                  { key:"c", text:"Jus buah yang dibuat Lanang paling sedikit adalah jus nanas", correct:"salah" },
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={3}/>
            {expandedPembahasan.has(3) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Salah</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Untuk membandingkan pecahan campuran dengan desimal: ubah semua ke desimal terlebih dahulu. Pecahan campuran <InlineMath math="a\frac{b}{c}"/> = a + b÷c. Setelah dalam desimal, urutan mudah ditentukan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Mangga: <InlineMath math="1\frac{5}{16} = 1 + 0{,}3125 = 1{,}3125"/> liter</p>
                  <p className="text-white/70 ml-3">• Nanas: 1,37 liter</p>
                  <p className="text-white/70 ml-3 mb-2">• Jambu: 1,375 liter</p>
                  <p className="text-white/80">Urutan dari kecil ke besar: 1,3125 (mangga) &lt; 1,37 (nanas) &lt; 1,375 (jambu)</p>
                  <p className="text-white/70 mt-1">① Jus terbanyak = jambu (1,375) ✓ <strong className="text-green-300">BENAR</strong></p>
                  <p className="text-white/70">② Selisih jambu − mangga = 1,375 − 1,3125 = <strong className="text-yellow-300">0,0625</strong> ✓ <strong className="text-green-300">BENAR</strong></p>
                  <p className="text-white/70">③ Paling sedikit = mangga (1,3125), bukan nanas ✗ <strong className="text-red-300">SALAH</strong></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Jangan langsung membandingkan angka tanpa menyamakan bentuknya. 1,37 ≠ 1,375 meskipun sama-sama "1,37-sekian". Selalu samakan jumlah digit desimalnya sebelum membandingkan.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Urutan dari sedikit ke banyak: mangga (1,3125) &lt; nanas (1,37) &lt; jambu (1,375). Jus <strong className="text-green-300">paling sedikit adalah mangga</strong>, bukan nanas, sehingga pernyataan ③ SALAH.</p>
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
                  Hasil dari <InlineMath math="7{,}2 - 3{,}375 \div \dfrac{7}{12} \times \dfrac{14}{15}"/> adalah ….
                </p>
                <MCQ qn={4} correct={2} options={["A. 2,8","B. 2,6","C. 1,8","D. 1,6"]}/>
              </div>
            </div>
            <PembahasanBtn n={4}/>
            {expandedPembahasan.has(4) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 1,8</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Urutan operasi hitung (PEMDAS/BODMAS): kerjakan <strong>× dan ÷</strong> dari kiri ke kanan DULU sebelum + dan −. Pembagian oleh pecahan = dikali dengan kebalikan (flip) pecahan tersebut.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 mb-1">Kerjakan perkalian/pembagian terlebih dahulu:</p>
                  <div className="ml-3 my-1"><BlockMath math="3{,}375 \div \frac{7}{12} \times \frac{14}{15} = 3{,}375 \times \frac{12}{7} \times \frac{14}{15}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="= 3{,}375 \times \frac{12 \times 14}{7 \times 15} = 3{,}375 \times \frac{168}{105} = 3{,}375 \times 1{,}6 = 5{,}4"/></div>
                  <p className="text-white/70 mb-1">Kemudian kerjakan pengurangan:</p>
                  <div className="ml-3 my-1"><BlockMath math="7{,}2 - 5{,}4 = \boxed{1{,}8}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Jangan lakukan 7,2 − 3,375 dulu! Ingat aturan: × dan ÷ dikerjakan sebelum + dan −. Untuk membagi pecahan: <InlineMath math="a \div \frac{b}{c} = a \times \frac{c}{b}"/>.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Hasilnya = <strong className="text-green-300">1,8</strong>. Kunci keberhasilan: ikuti urutan operasi hitung (× dan ÷ dulu), kemudian sederhanakan pecahan sebelum dikalikan.</p>
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
                  Ello memiliki persediaan tepung terigu <InlineMath math="1\frac{3}{5}"/> kg, ia membeli lagi 3,2 kg. Untuk membuat gorengan dibutuhkan <InlineMath math="\frac{1}{4}"/> bagian, untuk membuat kue 30%. Ello memberikan tepung kepada Cinta sebanyak 0,75 kg. Sisa tepung terigu Ello adalah ….
                </p>
                <MCQ qn={5} correct={1} options={["A. 1,14","B. 1,41","C. 2,36","D. 3,656"]}/>
              </div>
            </div>
            <PembahasanBtn n={5}/>
            {expandedPembahasan.has(5) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 1,41</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Soal bertahap: hitung total dulu, lalu kurangi satu per satu. Ubah semua pecahan ke desimal sebelum menghitung. Persen ke desimal: 30% = 0,30. Pecahan campuran: <InlineMath math="1\frac{3}{5} = 1{,}6"/>.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Total tepung: <InlineMath math="1\frac{3}{5} + 3{,}2 = 1{,}6 + 3{,}2 = 4{,}8"/> kg</p>
                  <p className="text-white/70 ml-3">• Untuk gorengan: <InlineMath math="\frac{1}{4} \times 4{,}8 = 1{,}2"/> kg</p>
                  <p className="text-white/70 ml-3">• Untuk kue: <InlineMath math="30\% \times 4{,}8 = 0{,}30 \times 4{,}8 = 1{,}44"/> kg</p>
                  <p className="text-white/70 ml-3 mb-1">• Diberikan Cinta: 0,75 kg</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Sisa} = 4{,}8 - 1{,}2 - 1{,}44 - 0{,}75 = \boxed{1{,}41 \text{ kg}}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Soal menyebutkan "¼ bagian" dan "30%" — keduanya merujuk pada total 4,8 kg, bukan sisa. Baca soal cermat: semua persentase/pecahan dihitung dari total awal, kecuali ada keterangan lain.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Sisa tepung Ello = 4,8 − 1,2 − 1,44 − 0,75 = <strong className="text-green-300">1,41 kg</strong>. Total yang digunakan/diberikan = 3,39 kg dari 4,8 kg.</p>
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
                  Hasil dari <InlineMath math="65 + 5.035 \div 5 \times 8 - 521"/> = ….
                </p>
                <MCQ qn={6} correct={1} options={["A. 7.639","B. 7.600","C. 839","D. 400"]}/>
              </div>
            </div>
            <PembahasanBtn n={6}/>
            {expandedPembahasan.has(6) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 7.600</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Aturan urutan operasi hitung campuran: kerjakan <strong>× dan ÷ dari kiri ke kanan</strong> terlebih dahulu, baru kerjakan <strong>+ dan −</strong>. Jangan mengerjakan dari kiri ke kanan begitu saja tanpa memperhatikan aturan ini.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 mb-1">Langkah 1 — kerjakan ÷ dan × terlebih dahulu:</p>
                  <div className="ml-3 my-1"><BlockMath math="5.035 \div 5 \times 8 = 1.007 \times 8 = 8.056"/></div>
                  <p className="text-white/70 mb-1">Langkah 2 — kerjakan + dan − dari kiri ke kanan:</p>
                  <div className="ml-3 my-1"><BlockMath math="65 + 8.056 - 521 = 8.121 - 521 = \boxed{7.600}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Perhatikan: 5.035 ÷ 5 × 8 harus dikerjakan dari kiri. Jangan hitung 5 × 8 = 40 dulu lalu 5.035 ÷ 40 — itu salah! Aturannya: ÷ dan × sama derajatnya, dikerjakan dari kiri ke kanan.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Hasil dari 65 + 5.035 ÷ 5 × 8 − 521 = <strong className="text-green-300">7.600</strong>. Kunci: dahulukan pembagian dan perkalian sebelum penjumlahan dan pengurangan.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q7 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">7</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Lembaga amal WargaMU berencana memberikan air bersih kepada 2.000 keluarga. Tahap I: 26 tangki, Tahap II: 27 tangki. Setiap tangki untuk 25 keluarga. Tentukan Benar atau Salah!
                </p>
                <TrueFalseTable qn={7} rows={[
                  { key:"a", text:"Banyak keluarga yang belum mendapat bantuan hingga tahap II ada 685 keluarga", correct:"salah" },
                  { key:"b", text:"Tahap ke-III bantuan air bersih sebanyak 1 tangki lebih banyak dari Tahap I", correct:"benar" },
                  { key:"c", text:"Bantuan air selama dua tahap diterima 1.325 keluarga", correct:"benar" },
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={7}/>
            {expandedPembahasan.has(7) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Salah, Benar, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Hitung dari informasi dasar: 1 tangki = 25 keluarga. Total tangki yang dibutuhkan = 2.000 ÷ 25 = 80 tangki. Hitung bertahap: Tahap I, II, lalu sisa untuk Tahap III.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Tahap I + II: (26+27) tangki × 25 = 53 × 25 = <strong className="text-yellow-300">1.325 keluarga</strong></p>
                  <p className="text-white/70 ml-3">• Belum dapat bantuan: 2.000 − 1.325 = <strong className="text-yellow-300">675</strong> (bukan 685) → ① <strong className="text-red-300">SALAH</strong></p>
                  <p className="text-white/70 ml-3">• Total tangki: 2.000 ÷ 25 = 80 tangki. Tahap III = 80 − 26 − 27 = <strong className="text-yellow-300">27 tangki</strong> = Tahap I (26) + 1 → ② <strong className="text-green-300">BENAR</strong></p>
                  <p className="text-white/70 ml-3">• Dua tahap = 1.325 keluarga → ③ <strong className="text-green-300">BENAR</strong></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Pernyataan ① menyebut "685 keluarga" — hitung dulu yang benar: 2.000 − 1.325 = 675. Selisih 675 vs 685 = 10 keluarga. Jangan menganggap pernyataan "hampir benar" sebagai benar dalam soal matematika.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Dua tahap = 1.325 keluarga (sisa 675, bukan 685). Tahap III = 27 tangki = Tahap I + 1. Jawaban: <strong className="text-green-300">Salah, Benar, Benar</strong>.</p>
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
                  Pak Juna memanen kacang dari dua petak sawah: <InlineMath math="12\frac{2}{5}"/> kuintal dan 9,75 kuintal. Kacang dijual dua kali dengan berat sama. Sisa kacang sekarang 15 kuintal. Berat kacang dalam sekali penjualan adalah … kuintal.
                </p>
                <MCQ qn={8} correct={2} options={["A. 5,675","B. 5,625","C. 3,575","D. 3,275"]}/>
              </div>
            </div>
            <PembahasanBtn n={8}/>
            {expandedPembahasan.has(8) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 3,575</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Soal bertahap: hitung total panen → kurangi sisa = yang terjual → bagi rata untuk 2 kali penjualan. Ubah pecahan campuran ke desimal dulu: <InlineMath math="12\frac{2}{5} = 12{,}4"/>.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Total panen dari dua petak:</p>
                  <div className="ml-3 my-1"><BlockMath math="12\tfrac{2}{5} + 9{,}75 = 12{,}4 + 9{,}75 = 22{,}15 \text{ kuintal}"/></div>
                  <p className="text-white/70 ml-3 mb-1">Kacang yang terjual = total − sisa:</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Terjual} = 22{,}15 - 15 = 7{,}15 \text{ kuintal}"/></div>
                  <p className="text-white/70 ml-3 mb-1">Dijual 2 kali dengan berat sama:</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Per penjualan} = 7{,}15 \div 2 = \boxed{3{,}575 \text{ kuintal}}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Kunci: "dijual dua kali dengan berat sama" → total terjual ÷ 2. Ubah semua ke desimal dulu sebelum menjumlahkan. <InlineMath math="12\frac{2}{5}"/> = 12 + 2/5 = 12 + 0,4 = 12,4.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Total panen = 22,15 kuintal. Terjual = 7,15 kuintal. Berat sekali jual = <strong className="text-green-300">3,575 kuintal</strong>.</p>
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
                  SD Pertiwi memberikan sumbangan: gula pasir 140 bungkus, susu 168 kaleng, mie instan 196 bungkus. Dibagikan kepada sebanyak-banyaknya keluarga, setiap keluarga mendapat tiga jenis dengan jumlah sama. Pemerintah desa menambah 10 bungkus mie per keluarga. Tentukan Benar atau Salah!
                </p>
                <TrueFalseTable qn={9} rows={[
                  { key:"a", text:"Selisih banyak gula pasir dengan mie instan yang diterima setiap keluarga ada 2 bungkus", correct:"benar" },
                  { key:"b", text:"Banyaknya keluarga yang menerima bantuan sebanyak 28 keluarga", correct:"benar" },
                  { key:"c", text:"Setiap keluarga menerima mie instan 17 bungkus", correct:"benar" },
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={9}/>
            {expandedPembahasan.has(9) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Benar, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">FPB (Faktor Persekutuan Terbesar) digunakan untuk membagi barang secara merata ke kelompok terbanyak. Gunakan pohon faktor → ambil faktor prima dengan pangkat TERKECIL yang ada di semua bilangan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/80 mb-1">Faktorisasi prima ketiga bilangan:</p>
                  <p className="text-white/70 ml-3">140 = 2² × 5 × 7 &nbsp;|&nbsp; 168 = 2³ × 3 × 7 &nbsp;|&nbsp; 196 = 2² × 7²</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{FPB}(140,168,196) = 2^2 \times 7 = 4 \times 7 = 28 \text{ keluarga}"/></div>
                  <p className="text-white/70 ml-3">• Gula per keluarga: 140 ÷ 28 = <strong className="text-yellow-300">5</strong> bungkus</p>
                  <p className="text-white/70 ml-3">• Mie dari sekolah: 196 ÷ 28 = <strong className="text-yellow-300">7</strong> bungkus</p>
                  <p className="text-white/70 ml-3">① Selisih gula−mie = 7 − 5 = <strong className="text-green-300">2</strong> ✓ BENAR</p>
                  <p className="text-white/70 ml-3">② Keluarga = <strong className="text-green-300">28</strong> ✓ BENAR</p>
                  <p className="text-white/70 ml-3">③ Total mie per keluarga: 7 + 10 = <strong className="text-green-300">17</strong> bungkus ✓ BENAR</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Untuk FPB: cari faktor prima yang MUNCUL DI SEMUA bilangan, ambil pangkat terkecilnya. Di sini: 2² muncul di semua (140: 2², 168: 2³, 196: 2²) → ambil 2². Faktor 7 muncul di semua → ambil 7¹.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">FPB(140,168,196) = 28 keluarga. Per keluarga: gula 5 bungkus, susu 6 kaleng, mie 17 bungkus (7+10). Semua pernyataan <strong className="text-green-300">BENAR</strong>.</p>
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
                  Ardi memasang umbul-umbul di Gang Arjuna panjang 0,6 km. Umbul-umbul dipasang di kanan kiri gang. Umbul-umbul merah jarak 4 m, umbul-umbul biru jarak 6 m, dipasang sejajar mulai dari ujung gang. Tentukan pernyataan yang Benar!
                </p>
                <TrueFalseTable qn={10} rows={[
                  { key:"a", text:"Kedua umbul-umbul terpasang sejajar sebanyak 50 kali sepanjang gang", correct:"salah" },
                  { key:"b", text:"Banyaknya umbul-umbul merah yang terpasang sebanyak 151 buah (kanan dan kiri)", correct:"benar" },
                  { key:"c", text:"Selisih kedua umbul-umbul yang terpasang adalah 50 buah", correct:"benar" },
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={10}/>
            {expandedPembahasan.has(10) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Salah, Benar, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Banyak tiang/umbul dari ujung ke ujung = panjang ÷ jarak + 1. KPK digunakan untuk mencari posisi sejajar. Konversi satuan: 0,6 km = 600 m.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• Panjang gang: 0,6 km = <strong className="text-yellow-300">600 m</strong></p>
                  <p className="text-white/70 ml-3">• KPK(4,6) = 12 m → umbul-umbul sejajar setiap 12 m</p>
                  <p className="text-white/70 ml-3">• Titik sejajar: 0, 12, 24, ..., 600 → 600÷12 + 1 = <strong className="text-yellow-300">51 titik</strong> (bukan 50) → ① <strong className="text-red-300">SALAH</strong></p>
                  <p className="text-white/70 ml-3">• Merah (1 sisi): 600÷4 + 1 = 151 buah → kiri+kanan = 302, tapi soal = 151 (1 sisi) → ② <strong className="text-green-300">BENAR</strong></p>
                  <p className="text-white/70 ml-3">• Biru (1 sisi): 600÷6 + 1 = 101 buah. Selisih: 151 − 101 = <strong className="text-yellow-300">50</strong> → ③ <strong className="text-green-300">BENAR</strong></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Rumus banyak tiang: (panjang ÷ jarak) + 1. Jangan lupa +1 karena dihitung dari ujung ke ujung (titik awal termasuk). Kesalahan umum: tidak menambah +1 sehingga hasilnya kurang 1.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Sejajar tiap 12 m → 51 titik (bukan 50). Merah = 151 buah (1 sisi), Biru = 101 buah (1 sisi), selisih = <strong className="text-green-300">50 buah</strong>. Jawaban: Salah, Benar, Benar.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q11 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">11</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-2">Perhatikan sifat-sifat bangun datar berikut!</p>
                <div className="bg-white/5 rounded-lg p-3 mb-3 text-white/80 text-xs space-y-1 font-body">
                  <p>(i) Memiliki dua pasang sisi sama panjang.</p>
                  <p>(ii) Memiliki empat sisi sama panjang.</p>
                  <p>(iii) Memiliki sepasang sudut sama besar.</p>
                  <p>(iv) Memiliki dua pasang sudut yang berhadapan sama besar.</p>
                  <p>(v) Memiliki 1 simetri lipat.</p>
                </div>
                <p className="font-body text-white/90 text-sm mb-3">Sifat-sifat bangun datar <strong className="text-yellow-300">layang-layang</strong> yang tepat ditunjukkan oleh huruf ….</p>
                <MCQ qn={11} correct={0} options={["A. (i), (iii), dan (v)","B. (ii), (iv), dan (v)","C. (i), (ii), dan (v)","D. (i), (iii), dan (iv)"]}/>
              </div>
            </div>
            <PembahasanBtn n={11}/>
            {expandedPembahasan.has(11) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A. (i), (iii), dan (v)</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Layang-layang: dua pasang sisi berdekatan sama panjang (bukan berhadapan). Memiliki 1 simetri lipat (diagonal panjang). Sepasang sudut berhadapan sama besar (sudut yang diapit sisi tidak sama panjang).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">✓ (i) Dua pasang sisi <em>berdekatan</em> sama panjang → sifat layang-layang ✓</p>
                  <p className="text-white/70 ml-3">✓ (iii) Sepasang sudut berhadapan sama besar (sudut di ujung diagonal pendek) ✓</p>
                  <p className="text-white/70 ml-3">✓ (v) Tepat 1 simetri lipat (sepanjang diagonal panjang) ✓</p>
                  <p className="text-white/70 ml-3">✗ (ii) Keempat sisi sama panjang → sifat <strong className="text-yellow-300">belah ketupat</strong>, bukan layang-layang</p>
                  <p className="text-white/70 ml-3">✗ (iv) Dua pasang sudut berhadapan sama → sifat <strong className="text-yellow-300">jajargenjang/persegi panjang</strong></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Ingat perbedaan: layang-layang = sisi BERDEKATAN sama, belah ketupat = semua sisi sama. Layang-layang hanya 1 simetri lipat; belah ketupat punya 2 simetri lipat.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Sifat layang-layang yang tepat: <strong className="text-green-300">(i), (iii), dan (v)</strong> — dua pasang sisi berdekatan sama, sepasang sudut berhadapan sama, dan 1 simetri lipat.</p>
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
                  Arman membuat mainan dadu dari kertas karton. Mata dadu yang saling berhadapan jumlahnya 7 (1–6, 2–5, 3–4). Sebelumnya ia membuat jaring-jaring kubus. Pola jaring-jaring yang benar adalah ….
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal12.png" alt="Gambar soal nomor 12" className="max-w-[160px] rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={12} correct={1} options={[
                  <span className="flex flex-col items-center gap-1"><img src="/tka-paket3-soal12a.png" alt="Pola A" className="w-24 rounded bg-white p-1"/><span>A</span></span>,
                  <span className="flex flex-col items-center gap-1"><img src="/tka-paket3-soal12b.png" alt="Pola B" className="w-24 rounded bg-white p-1"/><span>B</span></span>,
                  <span className="flex flex-col items-center gap-1"><img src="/tka-paket3-soal12c.png" alt="Pola C" className="w-24 rounded bg-white p-1"/><span>C</span></span>,
                  <span className="flex flex-col items-center gap-1"><img src="/tka-paket3-soal12d.png" alt="Pola D" className="w-24 rounded bg-white p-1"/><span>D</span></span>,
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={12}/>
            {expandedPembahasan.has(12) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Jaring-jaring kubus: kubus punya 6 sisi. Sisi-sisi yang berhadapan pada kubus dadu berjumlah 7 (1↔6, 2↔5, 3↔4). Dalam jaring-jaring yang benar, pasangan yang berhadapan TIDAK boleh bersebelahan langsung.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 mb-1">Pasangan muka berhadapan (jumlahnya = 7):</p>
                  <p className="text-white/70 ml-3">• 1 ↔ 6 (bersama = 7) &nbsp;|&nbsp; 2 ↔ 5 (bersama = 7) &nbsp;|&nbsp; 3 ↔ 4 (bersama = 7)</p>
                  <p className="text-white/70 mt-1">Pilihan B adalah satu-satunya jaring-jaring di mana ketiga pasangan berhadapan tersebut tidak bersebelahan langsung dalam pola lipatan kubus.</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Cara cek jaring-jaring dadu: lipat secara mental. Sisi yang berlawanan arah di jaring = sisi berhadapan di kubus. Eliminasi pilihan yang menempatkan pasangan (1,6), (2,5), atau (3,4) di posisi bersebelahan.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Jaring-jaring yang benar adalah <strong className="text-green-300">Pilihan B</strong>, karena ketiga pasangan muka berhadapan (1↔6, 2↔5, 3↔4) tidak bersebelahan dalam pola tersebut.</p>
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
                  Perhatikan gambar bangun tiga dimensi berikut! Tentukan Benar atau Salah untuk setiap pernyataan tampak berikut!
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal13.png" alt="Gambar soal nomor 13" className="w-full max-w-[280px] rounded-lg bg-white/5 p-2" />
                </div>
                <TrueFalseTable qn={13} rows={[
                  { key:"a", text:<span className="flex flex-col gap-1"><span>Gambar tampak dari samping kanan</span><img src="/tka-paket3-soal13a.png" alt="Tampak samping kanan" className="w-20 rounded bg-white p-1"/></span>, correct:"benar" },
                  { key:"b", text:<span className="flex flex-col gap-1"><span>Gambar tampak dari samping kiri</span><img src="/tka-paket3-soal13b.png" alt="Tampak samping kiri" className="w-24 rounded bg-white p-1"/></span>, correct:"salah" },
                  { key:"c", text:<span className="flex flex-col gap-1"><span>Gambar tampak dari atas</span><img src="/tka-paket3-soal13c.png" alt="Tampak dari atas" className="w-20 rounded bg-white p-1"/></span>, correct:"benar" },
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={13}/>
            {expandedPembahasan.has(13) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Salah, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Tampak bangun 3D: bayangkan melihat dari tiga arah—depan, samping, dan atas. Tampak samping kanan ≠ tampak samping kiri (cerminan). Tampak atas menunjukkan bentuk "jejak" bangun dari atas.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70">Analisis setiap tampak berdasarkan gambar bangun 3D pada soal:</p>
                  <p className="text-white/70 ml-3">① Tampak samping kanan: cocok dengan bentuk yang terlihat dari kanan → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② Tampak samping kiri: tidak cocok (berbeda dengan tampak kanan yang merupakan cerminannya) → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">③ Tampak dari atas: cocok dengan proyeksi atas bangun → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Untuk tampak 3D: tampak kanan dan kiri adalah cerminan satu sama lain. Tampak atas menunjukkan pola "footprint" bukan tinggi. Bayangkan bangun diletakkan di depan Anda lalu amati dari setiap arah.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Tampak samping kanan = <strong className="text-green-300">BENAR</strong>, tampak samping kiri = <strong className="text-red-300">SALAH</strong> (bukan cerminan yang benar), tampak atas = <strong className="text-green-300">BENAR</strong>.</p>
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
                  Pak Raka memiliki kebun berbentuk seperti gambar. Salah satu sisi kebun terdapat pintu lebar 2 m. Di sekeliling tanah dipasang tiang lampu dengan jarak 3 m. Banyaknya tiang lampu yang terpasang adalah ….
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal14.png" alt="Gambar soal nomor 14" className="w-full max-w-[300px] rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={14} correct={1} options={["A. 25","B. 26","C. 30","D. 31"]}/>
              </div>
            </div>
            <PembahasanBtn n={14}/>
            {expandedPembahasan.has(14) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 26</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Tiang lampu di sekeliling tanah: banyak tiang = panjang pagar ÷ jarak tiang. Jika ada pintu (celah), kurangi lebarnya dari keliling terlebih dahulu. Tidak perlu +1 karena polanya melingkar (ujung bertemu awal).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/80 mb-1">Langkah 1 – Hitung keliling kebun dari gambar:</p>
                  <div className="ml-3 my-1"><BlockMath math="K = 80 \text{ m}"/></div>
                  <p className="text-white/80 mb-1">Langkah 2 – Hitung panjang pagar (keliling − lebar pintu):</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Panjang pagar} = 80 - 2 = 78 \text{ m}"/></div>
                  <p className="text-white/80 mb-1">Langkah 3 – Banyak tiang (setiap 3 m dipasang 1 tiang):</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Banyak tiang} = \frac{78}{3} = \boxed{26 \text{ tiang}}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Untuk pemasangan melingkar (pagar keliling), tidak perlu +1. Untuk pemasangan lurus (ujung ke ujung), gunakan +1. Di sini pagar melingkar: 78÷3 = 26, tanpa +1.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Keliling kebun = 80 m. Panjang pagar = 78 m (dikurangi pintu 2 m). Banyak tiang = 78 ÷ 3 = <strong className="text-green-300">26 tiang</strong>.</p>
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
                  Perhatikan gambar bangun datar berikut! Luas bangun tersebut adalah ….
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal15.png" alt="Gambar soal nomor 15" className="max-w-[240px] rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={15} correct={2} options={["A. 297 cm²","B. 325 cm²","C. 369 cm²","D. 594 cm²"]}/>
              </div>
            </div>
            <PembahasanBtn n={15}/>
            {expandedPembahasan.has(15) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 369 cm²</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Trapesium: dua sisi sejajar (a = atas, b = bawah) dan tinggi tegak (t). Rumus: L = ½ × (a+b) × t. Kunci: tentukan kedua sisi sejajar dan tinggi dengan benar dari gambar.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/80 mb-1">Identifikasi ukuran dari gambar (trapesium):</p>
                  <p className="text-white/70 ml-3">• Sisi sejajar atas (a) = 8 cm</p>
                  <p className="text-white/70 ml-3">• Sisi sejajar bawah (b) = 8 + 25 = 33 cm</p>
                  <p className="text-white/70 ml-3">• Tinggi (t) = 18 cm</p>
                  <p className="text-white/80 mt-2 mb-1">Hitung luas:</p>
                  <div className="ml-3 my-1"><BlockMath math="L = \frac{1}{2} \times (a + b) \times t = \frac{1}{2} \times (8 + 33) \times 18"/></div>
                  <div className="ml-3 my-1"><BlockMath math="= \frac{1}{2} \times 41 \times 18 = \boxed{369 \text{ cm}^2}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Identifikasi sisi sejajar dari gambar — sisi bawah bisa lebih panjang dari yang terlihat jika ada perpanjangan. Tinggi = jarak tegak lurus antara dua sisi sejajar, bukan sisi miring.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Trapesium dengan sisi sejajar 8 dan 33 cm, tinggi 18 cm → luas = <strong className="text-green-300">369 cm²</strong>.</p>
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
                  Perhatikan gambar berikut! Luas bangun gabungan adalah … cm².
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal16.png" alt="Gambar soal nomor 16" className="w-full max-w-[300px] rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={16} correct={2} options={["A. 128","B. 224","C. 242","D. 594"]}/>
              </div>
            </div>
            <PembahasanBtn n={16}/>
            {expandedPembahasan.has(16) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 242 cm²</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Luas bangun gabungan yang tumpang tindih: L = L₁ + L₂ − L_irisan. Ini mencegah penghitungan ganda pada area yang dihitung dua kali. Identifikasi tiap bangun penyusun dan daerah irisannya.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/80 mb-1">Dari gambar: dua belah ketupat saling tumpang tindih dengan:</p>
                  <p className="text-white/70 ml-3">• Diagonal tiap belah ketupat = 16 cm × lebar</p>
                  <p className="text-white/70 ml-3">• Luas gabungan dihitung dengan mengurangi irisan:</p>
                  <div className="ml-3 my-1"><BlockMath math="L_{\text{gabungan}} = L_1 + L_2 - L_{\text{irisan}} = \boxed{242 \text{ cm}^2}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Rumus umum luas gabungan (union): L_A∪B = L_A + L_B − L_A∩B. Perhatikan gambar dengan saksama untuk menentukan lebar irisan, karena ini yang sering membedakan jawaban yang benar dari yang salah.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Luas bangun gabungan dua belah ketupat = <strong className="text-green-300">242 cm²</strong>, dengan menjumlahkan luas keduanya lalu mengurangi daerah irisan.</p>
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
                  Kardus besar milik Dayu berbentuk balok. Kardus kecil berbentuk kubus diletakkan di dalamnya. Tinggi tumpukan kardus kecil pada kardus besar milik Dayu adalah … kubus.
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal17.png" alt="Gambar soal nomor 17" className="w-full max-w-[320px] rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={17} correct={1} options={["A. 5","B. 6","C. 11","D. 55"]}/>
              </div>
            </div>
            <PembahasanBtn n={17}/>
            {expandedPembahasan.has(17) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 6</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Volume kubus = s³. Untuk mencari sisi dari volume: s = ∛V. Hapalan: 11³ = 1.331, 12³ = 1.728. Banyak tumpukan = tinggi balok ÷ sisi kubus.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/80 mb-1">Langkah 1 – Cari sisi kubus kecil dari volumenya:</p>
                  <div className="ml-3 my-1"><BlockMath math="V = s^3 = 1.331 \text{ cm}^3 \Rightarrow s = \sqrt[3]{1.331} = \sqrt[3]{11^3} = 11 \text{ cm}"/></div>
                  <p className="text-white/80 mb-1">Langkah 2 – Bagi tinggi balok besar dengan sisi kubus:</p>
                  <p className="text-white/70 ml-3 mb-1">Dari gambar, tinggi kardus besar = 66 cm.</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Tinggi tumpukan} = \frac{66}{11} = \boxed{6 \text{ kubus}}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">∛1331 = 11 karena 11³ = 1331. Hafalan kubik: 10³=1000, 11³=1331, 12³=1728. Kemudian 66 ÷ 11 = 6 tumpukan.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Sisi kubus kecil = ∛1331 = 11 cm. Tinggi tumpukan = 66 ÷ 11 = <strong className="text-green-300">6 kubus</strong>.</p>
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
                  Nasywa memiliki akuarium berbentuk kubus dengan panjang sisi bagian dalam 30 cm. Akuarium berisi air sebanyak <InlineMath math="\frac{1}{2}"/> bagian. Kemudian Nasywa menambahkan air hingga volumenya menjadi 24.750 cm³. Volume air yang ditambahkan adalah … cm³.
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal18.png" alt="Gambar soal nomor 18" className="max-w-[200px] rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={18} correct={2} options={["A. 2.250","B. 3.750","C. 11.250","D. 11.750"]}/>
              </div>
            </div>
            <PembahasanBtn n={18}/>
            {expandedPembahasan.has(18) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 11.250 cm³</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Volume kubus = s³. Volume tambahan = volume akhir − volume awal. Hitung dulu volume total kubus, lalu cari volume awal (½ bagian), kemudian selisihnya = air yang ditambahkan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{kubus}} = 30^3 = 27.000 \text{ cm}^3"/></div>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{awal}} = \tfrac{1}{2} \times 27.000 = 13.500 \text{ cm}^3"/></div>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{tambah}} = 24.750 - 13.500 = \boxed{11.250 \text{ cm}^3}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">30³ = 27.000 (hafalan: 3³=27, tambahkan 3 nol). V awal = ½ × 27.000 = 13.500. V tambah = 24.750 − 13.500 = 11.250. Cek: 13.500 + 11.250 = 24.750 ✓</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">V kubus = 27.000 cm³. V awal (½) = 13.500 cm³. Air ditambahkan = 24.750 − 13.500 = <strong className="text-green-300">11.250 cm³</strong>.</p>
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
                  Perhatikan gambar berikut! Besar sudut QOR berapa kali sudut ROP?
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal19.png" alt="Gambar soal nomor 19" className="max-w-[220px] rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={19} correct={1} options={["A. 5 kali","B. 4 kali","C. 3 kali","D. 2 kali"]}/>
              </div>
            </div>
            <PembahasanBtn n={19}/>
            {expandedPembahasan.has(19) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 4 kali</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Sudut diantara dua sinar: ∠QOR = ∠QOP − ∠ROP. Jika ∠QOP = 90° (siku-siku, Q di atas dan P di kanan), dan ∠ROP terukur dari gambar, hitung ∠QOR lalu bandingkan keduanya.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3">• ∠QOP = 90° (sudut siku-siku: Q di atas, P ke kanan)</p>
                  <p className="text-white/70 ml-3">• ∠ROP = 18° (dari gambar)</p>
                  <p className="text-white/70 ml-3">• ∠QOR = ∠QOP − ∠ROP = 90° − 18° = 72°</p>
                  <div className="ml-3 my-1"><BlockMath math="\frac{\angle QOR}{\angle ROP} = \frac{72°}{18°} = \boxed{4 \text{ kali}}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">∠QOR = 90° − 18° = 72°. Cek: 72 ÷ 18 = 4. Jadi ∠QOR = 4 × ∠ROP. Kunci: identifikasi bahwa ∠QOP = 90° dari posisi sinar Q (atas) dan P (kanan).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">∠QOR = 72°, ∠ROP = 18°. Perbandingan = <strong className="text-green-300">4 kali</strong> (72 ÷ 18 = 4).</p>
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
                  Perhatikan gambar berikut! Besar sudut r adalah ….
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal20.png" alt="Gambar soal nomor 20" className="w-full max-w-[320px] rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={20} correct={2} options={["A. 50°","B. 60°","C. 70°","D. 80°"]}/>
              </div>
            </div>
            <PembahasanBtn n={20}/>
            {expandedPembahasan.has(20) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 70°</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Jumlah sudut dalam segitiga = 180°. Jika dua sudut diketahui (60° dan 50°), cari sudut ketiga dengan: r = 180° − sudut₁ − sudut₂.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Dari gambar: dua sudut yang diketahui = 60° dan 50°.</p>
                  <div className="ml-3 my-1"><BlockMath math="r + 60° + 50° = 180°"/></div>
                  <div className="ml-3 my-1"><BlockMath math="r = 180° - 60° - 50° = \boxed{70°}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Jumlah ketiga sudut segitiga = 180° (teorema sudut dalam segitiga). Cara cepat: 60+50=110, lalu 180−110=70. Ini berlaku untuk semua jenis segitiga.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">r = 180° − 60° − 50° = <strong className="text-green-300">70°</strong>.</p>
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
                  Ratu dan teman-temannya menyambung tongkat untuk tiang bendera. Panjang tongkat setelah disambung 46,9 dm. Panjang setiap sambungan tongkat tersebut adalah ….
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal21.png" alt="Gambar soal nomor 21" className="max-w-full rounded-lg bg-white/5 p-2" />
                </div>
                <MCQ qn={21} correct={2} options={["A. 4,3 dm","B. 3,4 dm","C. 1,7 dm","D. 1,4 dm"]}/>
              </div>
            </div>
            <PembahasanBtn n={21}/>
            {expandedPembahasan.has(21) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 1,7 dm</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Panjang sambungan tumpang tindih (overlap). 3 tongkat + 2 sambungan. Samakan satuan ke dm dulu (1 m = 10 dm, 1 cm = 0,1 dm). Tiap sambungan = (jumlah terpisah − total tersambung) ÷ jumlah sambungan.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Konversi ke dm:</p>
                  <p className="text-white/70 ml-3">• Tongkat kiri: 1,8 m = <strong className="text-yellow-300">18 dm</strong></p>
                  <p className="text-white/70 ml-3">• Tongkat tengah: <strong className="text-yellow-300">15,4 dm</strong></p>
                  <p className="text-white/70 ml-3 mb-1">• Tongkat kanan: 169 cm = <strong className="text-yellow-300">16,9 dm</strong></p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total terpisah} = 18 + 15{,}4 + 16{,}9 = 50{,}3 \text{ dm}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total overlap} = 50{,}3 - 46{,}9 = 3{,}4 \text{ dm}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Tiap sambungan} = \frac{3{,}4}{2} = \boxed{1{,}7 \text{ dm}}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Kunci: 3 tongkat → 2 sambungan (bukan 3). Panjang tiap sambungan = total overlap ÷ jumlah sambungan = 3,4 ÷ 2 = 1,7 dm. Pastikan satuan sudah disamakan sebelum operasi.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Total terpisah = 50,3 dm. Total tersambung = 46,9 dm. Panjang tiap sambungan = (50,3 − 46,9) ÷ 2 = <strong className="text-green-300">1,7 dm</strong>.</p>
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
                  Industri sirup secang memiliki persediaan sirup 6,375 dal. Sirup terjual 37 dm³. Industri memproduksi 41.250 cc. Sirup dituangkan ke botol kaca, setiap botol 1,5 liter. Banyaknya botol yang berisi penuh sebanyak … buah.
                </p>
                <MCQ qn={22} correct={0} options={["A. 45","B. 46","C. 47","D. 48"]}/>
              </div>
            </div>
            <PembahasanBtn n={22}/>
            {expandedPembahasan.has(22) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: A. 45</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Konversi satuan volume ke liter: 1 dal=10 L, 1 dm³=1 L, 1 cc=1 mL=0,001 L. Total = persediaan − terjual + produksi. Botol penuh = ⌊total ÷ kapasitas botol⌋ (pembulatan ke bawah).</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Samakan ke liter:</p>
                  <p className="text-white/70 ml-3">• Persediaan: 6,375 dal = 63,75 L</p>
                  <p className="text-white/70 ml-3">• Terjual: 37 dm³ = 37 L</p>
                  <p className="text-white/70 ml-3 mb-1">• Produksi: 41.250 cc = 41,25 L</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total} = 63{,}75 - 37 + 41{,}25 = 68 \text{ L}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Botol penuh} = \lfloor 68 \div 1{,}5 \rfloor = \lfloor 45{,}33 \rfloor = \boxed{45 \text{ botol}}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Kunci konversi: 1 dal = 10 L (dekaliter), 1 cc = 0,001 L. Pembulatan ke BAWAH karena hanya botol yang PENUH yang dihitung. 68 ÷ 1,5 = 45,33 → ambil 45 botol.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Total sirup = 63,75 − 37 + 41,25 = 68 L. 68 ÷ 1,5 = 45,33 → <strong className="text-green-300">45 botol</strong> penuh.</p>
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
                  Pak Jura memiliki gabah dari hasil panen ketiga sawahnya: 1,26 ton, 4,38 kuintal, dan 1.175 kg. Setelah dijemur beratnya menyusut 1,27 kuintal. Hasil panen padi Pak Jura menjadi … kg.
                </p>
                <MCQ qn={23} correct={2} options={["A. 3.000","B. 2.756","C. 2.746","D. 2.736"]}/>
              </div>
            </div>
            <PembahasanBtn n={23}/>
            {expandedPembahasan.has(23) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 2.746 kg</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Konversi satuan massa ke kg: 1 ton = 1.000 kg, 1 kuintal = 100 kg. Jumlahkan semua gabah, lalu kurangi susut. Susut juga dalam kuintal → konversi dulu.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Konversi ke kg:</p>
                  <p className="text-white/70 ml-3">• 1,26 ton = <strong className="text-yellow-300">1.260 kg</strong></p>
                  <p className="text-white/70 ml-3">• 4,38 kuintal = <strong className="text-yellow-300">438 kg</strong></p>
                  <p className="text-white/70 ml-3 mb-1">• 1.175 kg</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total panen} = 1.260 + 438 + 1.175 = 2.873 \text{ kg}"/></div>
                  <p className="text-white/70 ml-3 mb-1">Susut: 1,27 kuintal = 127 kg</p>
                  <div className="ml-3 my-1"><BlockMath math="2.873 - 127 = \boxed{2.746 \text{ kg}}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Hafal: 1 ton = 1.000 kg, 1 kuintal = 100 kg. Cek: 1,26 ton = 1.260 kg (×1.000), 4,38 kuintal = 438 kg (×100), susut 1,27 kuintal = 127 kg. Pastikan semua disamakan ke kg sebelum operasi.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Total panen = 2.873 kg. Susut = 127 kg. Hasil akhir = 2.873 − 127 = <strong className="text-green-300">2.746 kg</strong>.</p>
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
                  Pak Sigit memotong sebuah balok kayu menjadi 5 bagian. Ia mulai pukul 09.56. Setiap satu potongan membutuhkan waktu 7 menit. Pak Sigit menyelesaikan pekerjaannya pada pukul ….
                </p>
                <MCQ qn={24} correct={2} options={["A. 10.31","B. 10.21","C. 10.24","D. 10.14"]}/>
              </div>
            </div>
            <PembahasanBtn n={24}/>
            {expandedPembahasan.has(24) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 10.24</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Memotong n bagian = (n−1) kali potong. Waktu total = jumlah potongan × waktu per potong. Tambahkan ke waktu mulai untuk dapat waktu selesai.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">5 bagian → butuh <strong className="text-yellow-300">4 potongan</strong> (bukan 5!)</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Waktu total} = 4 \times 7 = 28 \text{ menit}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="09.56 + 28 \text{ menit} = \boxed{10.24}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Jebakan klasik: "jadi 5 bagian" ≠ "5 kali potong". Hanya butuh 4 potongan. Analogi: pagar 5 tiang = 4 jarak. Cek waktu: 09.56 + 28 menit = 09.56 + 24 = 10.20 + 4 = 10.24 ✓</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">4 potongan × 7 menit = 28 menit. Selesai pukul 09.56 + 28 menit = <strong className="text-green-300">10.24</strong>.</p>
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
                  Nara berangkat ke sekolah bersepeda dengan kecepatan 24 km/jam. Berangkat pukul 09.09 dan sampai pukul 09.54. Jarak rumah Nara ke sekolah adalah ….
                </p>
                <MCQ qn={25} correct={1} options={["A. 16 km","B. 18 km","C. 32 km","D. 36 km"]}/>
              </div>
            </div>
            <PembahasanBtn n={25}/>
            {expandedPembahasan.has(25) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 18 km</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Rumus jarak: s = v × t. Kecepatan dalam km/jam, waktu harus dikonversi ke jam. 45 menit = 45/60 = ¾ jam.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="t = 09.54 - 09.09 = 45 \text{ menit} = \frac{45}{60} = \frac{3}{4} \text{ jam}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="s = v \times t = 24 \times \frac{3}{4} = \boxed{18 \text{ km}}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Kecepatan dalam km/jam → waktu harus dalam JAM (bukan menit). 45 menit = ¾ jam. Cara cepat: 24 × ¾ = 24 ÷ 4 × 3 = 6 × 3 = 18 km ✓</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">t = 45 menit = ¾ jam. s = 24 × ¾ = <strong className="text-green-300">18 km</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q26 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">26</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-2">Data berat badan (kg) siswa kelas VI SD Cerdas:</p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal26.png" alt="Gambar soal nomor 26" className="max-w-full rounded-lg bg-white p-2" />
                </div>
                <p className="font-body text-white/90 text-sm mb-3">Tabel yang tepat berdasarkan data tersebut adalah ….</p>
                <MCQ qn={26} correct={2} cols={1} options={[
                  <span className="block"><span className="font-bold mr-2">A.</span><img src="/tka-paket3-soal26-opsiA.png" alt="Opsi A" className="inline-block max-w-full rounded bg-white p-1 mt-1" /></span>,
                  <span className="block"><span className="font-bold mr-2">B.</span><img src="/tka-paket3-soal26-opsiB.png" alt="Opsi B" className="inline-block max-w-full rounded bg-white p-1 mt-1" /></span>,
                  <span className="block"><span className="font-bold mr-2">C.</span><img src="/tka-paket3-soal26-opsiC.png" alt="Opsi C" className="inline-block max-w-full rounded bg-white p-1 mt-1" /></span>,
                  <span className="block"><span className="font-bold mr-2">D.</span><img src="/tka-paket3-soal26-opsiD.png" alt="Opsi D" className="inline-block max-w-full rounded bg-white p-1 mt-1" /></span>,
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={26}/>
            {expandedPembahasan.has(26) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Tabel frekuensi: hitung berapa kali tiap nilai muncul dalam data. Baca data dari gambar/dot plot, lalu isi kolom frekuensi sesuai banyaknya kemunculan tiap nilai.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Hitung frekuensi tiap berat dari data:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead><tr className="bg-white/10"><th className="border border-white/20 px-2 py-1">Berat (kg)</th><th className="border border-white/20 px-2 py-1">35</th><th className="border border-white/20 px-2 py-1">38</th><th className="border border-white/20 px-2 py-1">39</th><th className="border border-white/20 px-2 py-1">40</th><th className="border border-white/20 px-2 py-1">42</th><th className="border border-white/20 px-2 py-1">45</th></tr></thead>
                      <tbody><tr><td className="border border-white/10 px-2 py-1 text-white/70">Frekuensi</td><td className="border border-white/10 px-2 py-1 text-center text-white">3</td><td className="border border-white/10 px-2 py-1 text-center text-white">5</td><td className="border border-white/10 px-2 py-1 text-center text-green-300 font-bold">6</td><td className="border border-white/10 px-2 py-1 text-center text-white">4</td><td className="border border-white/10 px-2 py-1 text-center text-white">3</td><td className="border border-white/10 px-2 py-1 text-center text-white">5</td></tr></tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Cara mudah: buat turus (tally) untuk setiap nilai saat membaca data. Pastikan total semua frekuensi = jumlah seluruh data. Cek: 3+5+6+4+3+5 = 26 siswa.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Tabel dengan frekuensi: 35→3, 38→5, 39→6, 40→4, 42→3, 45→5. Jawaban yang tepat: <strong className="text-green-300">C</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* Q27 */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">27</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-2">Berikut data ukuran sepatu siswa kelas VI SD Matahari 12:</p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal27-data.png" alt="Data soal nomor 27" className="max-w-full rounded-lg bg-white p-2" />
                </div>
                <p className="font-body text-white/90 text-sm mb-3">Modus data tersebut adalah ….</p>
                <MCQ qn={27} correct={2} options={["A. 36","B. 37","C. 38","D. 39"]}/>
              </div>
            </div>
            <PembahasanBtn n={27}/>
            {expandedPembahasan.has(27) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 38</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Modus = nilai yang paling sering muncul (frekuensi tertinggi). Jika ada dua nilai dengan frekuensi tertinggi sama, data bimodal. Di sini cukup cari kolom dengan angka terbesar.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Tabel frekuensi ukuran sepatu:</p>
                  <div className="overflow-x-auto mb-2">
                    <table className="w-full border-collapse text-xs">
                      <thead><tr className="bg-white/10"><th className="border border-white/20 px-2 py-1">Ukuran</th><th className="border border-white/20 px-2 py-1">36</th><th className="border border-white/20 px-2 py-1">37</th><th className="border border-white/20 px-2 py-1">38</th><th className="border border-white/20 px-2 py-1">39</th><th className="border border-white/20 px-2 py-1">40</th></tr></thead>
                      <tbody><tr><td className="border border-white/10 px-2 py-1 text-white/70">Frekuensi</td><td className="border border-white/10 px-2 py-1 text-center text-white">6</td><td className="border border-white/10 px-2 py-1 text-center text-white">6</td><td className="border border-white/10 px-2 py-1 text-center text-green-300 font-bold">7</td><td className="border border-white/10 px-2 py-1 text-center text-white">6</td><td className="border border-white/10 px-2 py-1 text-center text-white">5</td></tr></tbody>
                    </table>
                  </div>
                  <p className="text-white/70 ml-3">Frekuensi tertinggi = 7 → ukuran <strong className="text-yellow-300">38</strong> = Modus</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Modus ≠ nilai tertinggi. Modus = nilai yang PALING SERING muncul. Di sini ukuran 38 muncul 7 kali, lebih banyak dari yang lain (6, 6, 6, 5). Total = 6+6+7+6+5 = 30 siswa.</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Ukuran 38 muncul 7 kali (paling banyak). Modus = <strong className="text-green-300">38</strong>.</p>
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
                  Untuk daftar SMP unggulan, nilai rata-rata 6 mata pelajaran minimal 85. Berikut nilai yang dimiliki Tirta (lihat tabel pada soal). Agar Tirta bisa mendaftar, nilai Tirta paling sedikit adalah ….
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal28-tabel.png" alt="Tabel nilai soal nomor 28" className="max-w-full rounded-lg bg-white p-2" />
                </div>
                <MCQ qn={28} correct={3} options={["A. 78","B. 80","C. 82","D. 83"]}/>
              </div>
            </div>
            <PembahasanBtn n={28}/>
            {expandedPembahasan.has(28) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D. 83</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Rumus rata-rata: x̄ = jumlah ÷ banyak data. Untuk mencari nilai yang belum diketahui: nilai_x = (x̄ × n) − jumlah nilai lain. Di sini: nilai Matematika = (85×6) − total 5 mapel lain.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total minimum} = 85 \times 6 = 510"/></div>
                  <p className="text-white/70 ml-3 mb-1">Nilai 5 mapel: B.Indonesia=88, PPKn=92, IPA=85, IPS=80, B.Inggris=82</p>
                  <div className="ml-3 my-1"><BlockMath math="88 + 92 + 85 + 80 + 82 = 427"/></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Nilai Matematika} = 510 - 427 = \boxed{83}"/></div>
                  <p className="text-white/70 ml-3">Verifikasi: (88+92+83+85+80+82) ÷ 6 = 510 ÷ 6 = 85 ✓</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Rumus cepat: nilai yang dicari = (x̄ × n) − Σ(nilai lain) = (85×6) − 427 = 510 − 427 = 83. Jika rata-rata harus tepat 85, nilai minimum pun tepat 83 (tidak boleh kurang).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Total min = 85×6 = 510. Total 5 mapel = 427. Nilai Matematika minimal = 510 − 427 = <strong className="text-green-300">83</strong>.</p>
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
                  Data hasil panen semangka petani Desa Pandansimo 2025 disajikan dalam piktogram. Keterangan: <InlineMath math="\bigcirc"/> = 10 kuintal, <InlineMath math="\bullet"/> = 5 kuintal. Tentukan Benar atau Salah!
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal29-diagram.png" alt="Piktogram hasil panen soal nomor 29" className="max-w-full rounded-lg bg-white p-2" />
                </div>
                <TrueFalseTable qn={29} rows={[
                  { key:"a", text:"Selisih hasil panen paling banyak dan paling sedikit adalah 45 kuintal", correct:"benar" },
                  { key:"b", text:"Jumlah hasil panen Pak Cahyo dengan Pak Fatah sebanyak 155 kuintal", correct:"salah" },
                  { key:"c", text:"Hasil panen Pak Erwan lebih banyak 45 kuintal dari hasil panen Pak Bayu", correct:"benar" },
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={29}/>
            {expandedPembahasan.has(29) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Salah, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Baca piktogram: ○ = 10 kuintal, ◑ = 5 kuintal. Hitung total tiap petani, lalu verifikasi setiap pernyataan satu per satu.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Baca piktogram (○=10, ◑=5 kuintal):</p>
                  <p className="text-white/70 ml-3">• Pak Adi: 4○+1◑ = 45 | Pak Bayu: 3○+1◑ = <strong className="text-yellow-300">35</strong> (min)</p>
                  <p className="text-white/70 ml-3">• Pak Cahyo: 4○ = 40 | Pak Didik: 4○+1◑ = 45</p>
                  <p className="text-white/70 ml-3 mb-1">• Pak Erwan: 8○ = <strong className="text-yellow-300">80</strong> (max) | Pak Fatah: 6○+1◑ = 65</p>
                  <p className="text-white/70 ml-3">① Selisih max−min = 80−35 = <strong className="text-yellow-300">45</strong> → <span className="text-green-300">BENAR</span></p>
                  <p className="text-white/70 ml-3">② Cahyo+Fatah = 40+65 = 105, bukan 155 → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">③ Erwan−Bayu = 80−35 = <strong className="text-yellow-300">45</strong> → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Baca piktogram teliti: lingkaran penuh=10, setengah=5. Pernyataan ② jebakan: 155 jauh lebih besar dari 105. Pernyataan ① dan ③ menanyakan hal berbeda tapi nilainya kebetulan sama (45).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Selisih max−min = 45 (BENAR). Cahyo+Fatah = 105 ≠ 155 (SALAH). Erwan−Bayu = 45 (BENAR). Jawaban: <strong className="text-green-300">Benar, Salah, Benar</strong>.</p>
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
                  Siswa kelas VI SD Negeri Bunder 2 telah selesai melaksanakan sumatif Matematika Kelas VI. Siswa yang mendapat nilai kurang dari 75 mengikuti perbaikan. Siswa yang mendapat nilai 75 ke atas mengikuti pengayaan. Hasil sumatif ditampilkan dalam diagram batang berikut.
                </p>
                <div className="flex justify-center mb-3">
                  <img src="/tka-paket3-soal30-diagram.png" alt="Diagram batang hasil nilai sumatif soal nomor 30" className="max-w-full rounded-lg bg-white p-2" />
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">Berdasarkan ilustrasi di atas, diperoleh pernyataan sebagai berikut. Tentukan pernyataan yang Benar!</p>
                <TrueFalseTable qn={30} rows={[
                  { key:"a", text:"Siswa yang mengikuti pengayaan lebih banyak daripada yang mengikuti perbaikan", correct:"benar" },
                  { key:"b", text:"Banyak siswa yang mendapat nilai di atas rata-rata ada 19 siswa", correct:"salah" },
                  { key:"c", text:"Jumlah siswa kelas VI SD Negeri Bunder 2 adalah 30 siswa", correct:"benar" },
                ]}/>
              </div>
            </div>
            <PembahasanBtn n={30}/>
            {expandedPembahasan.has(30) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Salah, Benar</div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-300 font-bold mb-1">🧠 Konsep dan Trik</p>
                  <p className="text-white/70">Baca diagram batang untuk mendapat frekuensi tiap nilai. Perbaikan = nilai &lt;75, pengayaan = nilai ≥75. Rata-rata = Σ(nilai×frekuensi) ÷ total. Nilai di atas rata-rata = nilai yang melebihi x̄.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold mb-2">📋 Step by Step Penyelesaian</p>
                  <p className="text-white/70 ml-3 mb-1">Data dari diagram: 70→2, 75→4, 80→5, 85→5, 90→9, 95→3, 100→2</p>
                  <p className="text-white/70 ml-3">① Perbaikan (&lt;75)=2 siswa, Pengayaan (≥75)=4+5+5+9+3+2=<strong className="text-yellow-300">28</strong> siswa. 28 &gt; 2 → <span className="text-green-300">BENAR</span></p>
                  <div className="ml-3 my-1"><BlockMath math="\bar{x} = \frac{70(2)+75(4)+80(5)+85(5)+90(9)+95(3)+100(2)}{30} = \frac{2.560}{30} \approx 85{,}3"/></div>
                  <p className="text-white/70 ml-3">② Di atas 85,3: nilai 90→9, 95→3, 100→2 = <strong className="text-yellow-300">14 siswa</strong>, bukan 19 → <span className="text-red-300">SALAH</span></p>
                  <p className="text-white/70 ml-3">③ Total: 2+4+5+5+9+3+2 = <strong className="text-yellow-300">30</strong> siswa ✓ → <span className="text-green-300">BENAR</span></p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">💡 Tips</p>
                  <p className="text-white/70">Rata-rata ≈ 85,3. Nilai di atas rata-rata adalah &gt;85 yaitu 90, 95, 100 (9+3+2=14 siswa). Pernyataan ② menyebut 19 siswa, jelas salah. Cek total selalu untuk verifikasi (2+4+5+5+9+3+2=30 ✓).</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 font-bold mb-1">📌 Kesimpulan</p>
                  <p className="text-white/70">Pengayaan=28 (BENAR). Di atas rata-rata=14≠19 (SALAH). Total=30 (BENAR). Jawaban: <strong className="text-green-300">Benar, Salah, Benar</strong>.</p>
                </div>
              </div>
            )}
          </div>

        </div>

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

export default TKALatihan4Page;
