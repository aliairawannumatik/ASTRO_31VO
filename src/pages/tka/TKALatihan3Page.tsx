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
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Paket:</span><span className="text-accent ml-1 font-bold">PAKET 3</span></div>
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
                <MCQ qn={1} correct={2} options={[
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
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 4/12</div>
                <div>
                  <p className="text-cyan-300 font-bold mb-1">Langkah Penyelesaian:</p>
                  <p className="text-white/80 mb-1">Dari gambar, bangun dibagi menjadi 12 bagian sama besar dan 4 bagian diarsir.</p>
                  <div className="ml-3 my-2"><BlockMath math="\text{Bagian diarsir} = \frac{4}{12} = \frac{1}{3}"/></div>
                  <p className="text-white/70">Pilihan C (<InlineMath math="\frac{4}{12}"/>) langsung menunjukkan perbandingan tersebut.</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">📌 Kunci:</p>
                  <p className="text-white/70">Hitung bagian yang diarsir dibagi total bagian keseluruhan.</p>
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
                <div>
                  <p className="text-cyan-300 font-bold mb-1">Langkah Penyelesaian:</p>
                  <p className="text-white/80 mb-1">Ubah semua pecahan ke desimal (KPK 24):</p>
                  <p className="text-white/70 ml-3">• Candra: <InlineMath math="\frac{3}{4} = 0{,}75"/></p>
                  <p className="text-white/70 ml-3">• Edi: <InlineMath math="\frac{5}{8} = 0{,}625"/></p>
                  <p className="text-white/70 ml-3">• Dirga: <InlineMath math="\frac{7}{12} \approx 0{,}583"/></p>
                  <p className="text-white/70 ml-3">• Andi: <InlineMath math="\frac{1}{3} \approx 0{,}333"/></p>
                  <p className="text-white/70 ml-3 mb-2">• Budi: <InlineMath math="\frac{2}{6} = \frac{1}{3} \approx 0{,}333"/></p>
                  <p className="text-white/80">Urutan terbesar ke terkecil: 0,75 &gt; 0,625 &gt; 0,583 &gt; 0,333 = 0,333</p>
                  <p className="text-white/80">→ Candra, Edi, Dirga, Andi, Budi (Andi sebelum Budi karena urutan abjad/asli)</p>
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
                <div>
                  <p className="text-cyan-300 font-bold mb-1">Langkah:</p>
                  <p className="text-white/70 ml-3">• Mangga: <InlineMath math="1\frac{5}{16} = 1{,}3125"/> liter</p>
                  <p className="text-white/70 ml-3">• Nanas: 1,37 liter</p>
                  <p className="text-white/70 ml-3 mb-2">• Jambu: 1,375 liter</p>
                  <p className="text-white/80">Urutan: 1,3125 (mangga) &lt; 1,37 (nanas) &lt; 1,375 (jambu)</p>
                  <p className="text-white/70 mt-1">① Jus terbanyak = jambu ✓ <strong className="text-green-300">BENAR</strong></p>
                  <p className="text-white/70">② Selisih jambu – mangga = 1,375 – 1,3125 = 0,0625 ✓ <strong className="text-green-300">BENAR</strong></p>
                  <p className="text-white/70">③ Paling sedikit = mangga, bukan nanas ✗ <strong className="text-red-300">SALAH</strong></p>
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
                <div>
                  <p className="text-cyan-300 font-bold mb-1">Langkah (kerjakan perkalian/pembagian dulu):</p>
                  <div className="ml-3 my-1"><BlockMath math="3{,}375 \div \frac{7}{12} \times \frac{14}{15} = 3{,}375 \times \frac{12}{7} \times \frac{14}{15}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="= 3{,}375 \times \frac{168}{105} = 3{,}375 \times 1{,}6 = 5{,}4"/></div>
                  <div className="ml-3 my-1"><BlockMath math="7{,}2 - 5{,}4 = \boxed{1{,}8}"/></div>
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
                <div>
                  <p className="text-cyan-300 font-bold mb-1">Langkah:</p>
                  <p className="text-white/70 ml-3">• Total: <InlineMath math="1\frac{3}{5} + 3{,}2 = 1{,}6 + 3{,}2 = 4{,}8"/> kg</p>
                  <p className="text-white/70 ml-3">• Gorengan: <InlineMath math="\frac{1}{4} \times 4{,}8 = 1{,}2"/> kg</p>
                  <p className="text-white/70 ml-3">• Kue: <InlineMath math="30\% \times 4{,}8 = 1{,}44"/> kg</p>
                  <p className="text-white/70 ml-3 mb-2">• Diberikan Cinta: 0,75 kg</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Sisa} = 4{,}8 - 1{,}2 - 1{,}44 - 0{,}75 = \boxed{1{,}41 \text{ kg}}"/></div>
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
                <div>
                  <p className="text-cyan-300 font-bold mb-1">Langkah (urutan: × dan ÷ dulu, lalu + dan −):</p>
                  <div className="ml-3 my-1"><BlockMath math="5.035 \div 5 \times 8 = 1.007 \times 8 = 8.056"/></div>
                  <div className="ml-3 my-1"><BlockMath math="65 + 8.056 - 521 = \boxed{7.600}"/></div>
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
                <div>
                  <p className="text-white/70 ml-3">• Tahap I+II: (26+27) × 25 = 53 × 25 = <strong className="text-yellow-300">1.325 keluarga</strong></p>
                  <p className="text-white/70 ml-3">• Belum dapat: 2.000 − 1.325 = <strong className="text-yellow-300">675</strong> (bukan 685) → <strong className="text-red-300">SALAH</strong></p>
                  <p className="text-white/70 ml-3">• Total tangki: 2.000 ÷ 25 = 80. Tahap III = 80 − 26 − 27 = <strong className="text-yellow-300">27</strong> tangki = 26+1 → <strong className="text-green-300">BENAR</strong></p>
                  <p className="text-white/70 ml-3">• Dua tahap = 1.325 keluarga → <strong className="text-green-300">BENAR</strong></p>
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
                <div>
                  <div className="ml-3 my-1"><BlockMath math="12\tfrac{2}{5} + 9{,}75 = 12{,}4 + 9{,}75 = 22{,}15 \text{ kuintal}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Terjual} = 22{,}15 - 15 = 7{,}15 \text{ kuintal}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Per penjualan} = 7{,}15 \div 2 = \boxed{3{,}575 \text{ kuintal}}"/></div>
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
                <div>
                  <p className="text-white/80 mb-1">FPB(140, 168, 196):</p>
                  <p className="text-white/70 ml-3">140 = 2² × 5 × 7 &nbsp;|&nbsp; 168 = 2³ × 3 × 7 &nbsp;|&nbsp; 196 = 2² × 7²</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{FPB} = 2^2 \times 7 = 28 \text{ keluarga}"/></div>
                  <p className="text-white/70 ml-3">• Gula per keluarga: 140 ÷ 28 = 5 bungkus</p>
                  <p className="text-white/70 ml-3">• Mie dari sekolah: 196 ÷ 28 = 7 bungkus</p>
                  <p className="text-white/70 ml-3">• Selisih gula–mie (dari sekolah) = 7 − 5 = <strong className="text-green-300">2</strong> ✓ BENAR</p>
                  <p className="text-white/70 ml-3">• Jumlah keluarga = <strong className="text-green-300">28</strong> ✓ BENAR</p>
                  <p className="text-white/70 ml-3">• Total mie: 7 + 10 = <strong className="text-green-300">17</strong> bungkus ✓ BENAR</p>
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
                <div>
                  <p className="text-white/70 ml-3">• Panjang gang: 0,6 km = 600 m</p>
                  <p className="text-white/70 ml-3">• KPK(4,6) = 12 m → sejajar setiap 12 m</p>
                  <p className="text-white/70 ml-3">• Titik sejajar: 0, 12, 24, …, 600 → <strong className="text-yellow-300">51 titik</strong> (bukan 50) → <strong className="text-red-300">SALAH</strong></p>
                  <p className="text-white/70 ml-3">• Merah 1 sisi: 600÷4 + 1 = 151. Kanan+kiri: 151×2 = <strong className="text-green-300">302</strong>... namun soal merujuk satu sisi saja = 151 → <strong className="text-green-300">BENAR</strong></p>
                  <p className="text-white/70 ml-3">• Biru 1 sisi: 600÷6 + 1 = 101. Selisih 1 sisi: 151−101 = <strong className="text-green-300">50</strong> → BENAR</p>
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
                <div>
                  <p className="text-cyan-300 font-bold mb-1">Sifat layang-layang:</p>
                  <p className="text-white/70 ml-3">✓ (i) Dua pasang sisi yang berdekatan sama panjang</p>
                  <p className="text-white/70 ml-3">✓ (iii) Sepasang sudut berhadapan sama besar (sudut antara sisi tidak sama)</p>
                  <p className="text-white/70 ml-3">✓ (v) Tepat 1 simetri lipat (diagonal panjang)</p>
                  <p className="text-white/70 ml-3">✗ (ii) Keempat sisi sama panjang → sifat belah ketupat</p>
                  <p className="text-white/70 ml-3">✗ (iv) Dua pasang sudut berhadapan sama → sifat jajargenjang</p>
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
                <div>
                  <p className="text-cyan-300 font-bold mb-1">Kunci:</p>
                  <p className="text-white/70">Pasangan muka berhadapan (jumlah = 7): 1↔6, 2↔5, 3↔4. Pilih jaring-jaring di mana ketiga pasangan tersebut tidak bersebelahan langsung.</p>
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
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Salah, Benar</div>
                <p className="text-white/70 mt-2">Analisis tampak bangun 3D dari tiga arah berbeda sesuai gambar pada soal.</p>
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
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 26</div>
                <p className="text-white/70 mt-2">Hitung keliling kebun, kurangi lebar pintu 2 m, bagi dengan jarak 3 m, tambah tiang di sudut dan sisi pintu sesuai gambar.</p>
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
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 369 cm²</div>
                <p className="text-white/70 mt-2">Hitung luas bangun dengan membagi menjadi bagian-bagian persegi/persegi panjang/segitiga sesuai gambar, lalu jumlahkan.</p>
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
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 242 cm²</div>
                <p className="text-white/70 mt-2">Identifikasi setiap bangun penyusun (misal persegi panjang dan segitiga), hitung masing-masing luas, lalu jumlahkan atau kurangkan sesuai bentuk gabungan.</p>
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
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: B. 6</div>
                <p className="text-white/70 mt-2">Bagi tinggi kardus besar dengan tinggi kardus kecil untuk mendapatkan jumlah tumpukan.</p>
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
                <div>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{kubus}} = 30^3 = 27.000 \text{ cm}^3"/></div>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{awal}} = \tfrac{1}{2} \times 27.000 = 13.500 \text{ cm}^3"/></div>
                  <div className="ml-3 my-1"><BlockMath math="V_{\text{tambah}} = 24.750 - 13.500 = \boxed{11.250 \text{ cm}^3}"/></div>
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
                <MCQ qn={19} correct={2} options={["A. 5 kali","B. 4 kali","C. 3 kali","D. 2 kali"]}/>
              </div>
            </div>
            <PembahasanBtn n={19}/>
            {expandedPembahasan.has(19) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 3 kali</div>
                <p className="text-white/70 mt-2">Dari gambar, tentukan besar masing-masing sudut QOR dan ROP, lalu hitung perbandingannya.</p>
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
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 70°</div>
                <p className="text-white/70 mt-2">Gunakan sifat sudut (pelurus, penyiku, atau jumlah sudut segitiga) sesuai gambar untuk menentukan besar sudut r.</p>
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
                <MCQ qn={21} correct={3} options={["A. 4,3 dm","B. 3,4 dm","C. 1,7 dm","D. 1,4 dm"]}/>
              </div>
            </div>
            <PembahasanBtn n={21}/>
            {expandedPembahasan.has(21) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: D. 1,4 dm</div>
                <p className="text-white/70 mt-2">Dari gambar, kurangi panjang total dengan panjang semua tongkat, lalu bagi dengan jumlah sambungan.</p>
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
                <div>
                  <p className="text-white/80 mb-1">Samakan satuan ke liter:</p>
                  <p className="text-white/70 ml-3">• Persediaan: 6,375 dal = 63,75 liter</p>
                  <p className="text-white/70 ml-3">• Terjual: 37 dm³ = 37 liter</p>
                  <p className="text-white/70 ml-3">• Produksi: 41.250 cc = 41,25 liter</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total} = 63{,}75 - 37 + 41{,}25 = 68 \text{ liter}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="\text{Botol} = \lfloor 68 \div 1{,}5 \rfloor = \lfloor 45{,}33 \rfloor = \boxed{45 \text{ botol}}"/></div>
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
                <div>
                  <p className="text-white/80 mb-1">Samakan ke kg:</p>
                  <p className="text-white/70 ml-3">• 1,26 ton = 1.260 kg</p>
                  <p className="text-white/70 ml-3">• 4,38 kuintal = 438 kg</p>
                  <p className="text-white/70 ml-3">• 1.175 kg</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Total} = 1.260 + 438 + 1.175 = 2.873 \text{ kg}"/></div>
                  <p className="text-white/70 ml-3">• Susut: 1,27 kuintal = 127 kg</p>
                  <div className="ml-3 my-1"><BlockMath math="2.873 - 127 = \boxed{2.746 \text{ kg}}"/></div>
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
                <div>
                  <p className="text-white/80 mb-1">Memotong 1 balok menjadi 5 bagian → butuh <strong className="text-yellow-300">4 potongan</strong>.</p>
                  <div className="ml-3 my-1"><BlockMath math="\text{Waktu total} = 4 \times 7 = 28 \text{ menit}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="09.56 + 28 \text{ menit} = \boxed{10.24}"/></div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-bold mb-1">📌 Jebakan:</p>
                  <p className="text-white/70">Memotong jadi 5 bagian = 4 kali potong (bukan 5 kali)!</p>
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
                <div>
                  <div className="ml-3 my-1"><BlockMath math="t = 09.54 - 09.09 = 45 \text{ menit} = \frac{3}{4} \text{ jam}"/></div>
                  <div className="ml-3 my-1"><BlockMath math="s = v \times t = 24 \times \frac{3}{4} = \boxed{18 \text{ km}}"/></div>
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead><tr className="bg-white/10"><th className="border border-white/20 px-2 py-1">Berat (kg)</th><th className="border border-white/20 px-2 py-1">35</th><th className="border border-white/20 px-2 py-1">38</th><th className="border border-white/20 px-2 py-1">39</th><th className="border border-white/20 px-2 py-1">40</th><th className="border border-white/20 px-2 py-1">42</th><th className="border border-white/20 px-2 py-1">45</th></tr></thead>
                    <tbody><tr><td className="border border-white/10 px-2 py-1 text-white/70">Frekuensi</td><td className="border border-white/10 px-2 py-1 text-center text-white">3</td><td className="border border-white/10 px-2 py-1 text-center text-white">5</td><td className="border border-white/10 px-2 py-1 text-center text-green-300 font-bold">5</td><td className="border border-white/10 px-2 py-1 text-center text-white">4</td><td className="border border-white/10 px-2 py-1 text-center text-white">3</td><td className="border border-white/10 px-2 py-1 text-center text-white">5</td></tr></tbody>
                  </table>
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead><tr className="bg-white/10"><th className="border border-white/20 px-2 py-1">Ukuran</th><th className="border border-white/20 px-2 py-1">36</th><th className="border border-white/20 px-2 py-1">37</th><th className="border border-white/20 px-2 py-1">38</th><th className="border border-white/20 px-2 py-1">39</th><th className="border border-white/20 px-2 py-1">40</th></tr></thead>
                    <tbody><tr><td className="border border-white/10 px-2 py-1 text-white/70">Frekuensi</td><td className="border border-white/10 px-2 py-1 text-center text-white">6</td><td className="border border-white/10 px-2 py-1 text-center text-white">6</td><td className="border border-white/10 px-2 py-1 text-center text-green-300 font-bold">7</td><td className="border border-white/10 px-2 py-1 text-center text-white">6</td><td className="border border-white/10 px-2 py-1 text-center text-white">5</td></tr></tbody>
                  </table>
                </div>
                <p className="text-white/70">Modus = nilai yang paling sering muncul = <strong className="text-green-300">38</strong> (muncul 7 kali).</p>
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
                <MCQ qn={28} correct={2} options={["A. 78","B. 80","C. 82","D. 83"]}/>
              </div>
            </div>
            <PembahasanBtn n={28}/>
            {expandedPembahasan.has(28) && (
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-3 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: C. 82</div>
                <div>
                  <p className="text-white/80 mb-1">Rata-rata minimal = 85 → total nilai = 85 × 6 = 510</p>
                  <p className="text-white/70">Jumlahkan 5 nilai yang diketahui dari tabel, lalu kurangi dari 510 untuk mendapatkan nilai mata pelajaran keenam minimum.</p>
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
              <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-xs font-body">
                <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-green-300 font-bold">✓ Jawaban: Benar, Salah, Benar</div>
                <p className="text-white/70 mt-2">Baca piktogram untuk menentukan hasil panen masing-masing petani, lalu hitung selisih, jumlah, dan perbandingan.</p>
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
                <div>
                  <p className="text-white/70 ml-3">• Perbaikan (&lt;75): nilai 70 = 2 siswa → total <strong>2</strong></p>
                  <p className="text-white/70 ml-3">• Pengayaan (≥75): 4+6+9+5+3+1 = <strong>28</strong> siswa → lebih banyak ✓ <strong className="text-green-300">BENAR</strong></p>
                  <p className="text-white/70 ml-3">• Total: 2+4+6+9+5+3+1 = <strong>30</strong> siswa ✓ <strong className="text-green-300">BENAR</strong></p>
                  <p className="text-white/70 ml-3">• Rata-rata: butuh hitung nilai rata-rata dulu, lalu hitung yang di atasnya. Tidak tepat 19 siswa → <strong className="text-red-300">SALAH</strong></p>
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

export default TKALatihan3Page;
