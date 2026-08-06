import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const TKALatihan1Page = () => {
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [selectedComplexAnswers, setSelectedComplexAnswers] = useState<Record<number, Set<number>>>({});
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<Record<string, string>>({});

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
            <li>Jumlah soal sebanyak 15 butir soal.</li>
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
