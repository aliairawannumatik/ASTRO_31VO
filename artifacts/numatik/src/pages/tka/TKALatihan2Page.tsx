import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import PembahasanCard from "@/components/PembahasanCard";
import { tkaLatihan2Pembahasan } from "@/data/pembahasan/tkaLatihan2";

const TKALatihan2Page = () => {
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
    correct1: boolean[];
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
            <div className="bg-white/5 rounded-lg p-2"><span className="text-white/40">Paket:</span><span className="text-accent ml-1 font-bold">PAKET 2</span></div>
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

          {/* ── KONTEKS 1–3: DATA AKTIVITAS GUNUNG API ── */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2 uppercase tracking-wide">Perhatikan informasi berikut untuk menjawab nomor 1 – 3!</p>
            <p className="font-body text-white/90 text-xs font-bold mb-2">DATA AKTIVITAS GUNUNG API DI INDONESIA</p>
            <p className="font-body text-white/70 text-xs mb-2">RINCIAN 8 GUNUNG API TERAKTIF &amp; LOKASI</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-3 py-2 text-white text-left">Gunung Api (Lokasi)</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Jumlah Erupsi 2023</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr><td className="border border-white/10 px-3 py-2">Semeru (Jawa Timur)</td><td className="border border-white/10 px-3 py-2 text-center">29.131</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">Ibu (Maluku Utara)</td><td className="border border-white/10 px-3 py-2 text-center">21.100</td></tr>
                  <tr><td className="border border-white/10 px-3 py-2">Ili Lewotolok (NTT)</td><td className="border border-white/10 px-3 py-2 text-center">11.500</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">Dukono (Maluku Utara)</td><td className="border border-white/10 px-3 py-2 text-center">3.324</td></tr>
                  <tr><td className="border border-white/10 px-3 py-2">Anak Krakatau (Lampung)</td><td className="border border-white/10 px-3 py-2 text-center">696</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">Marapi (Sumatera Barat)</td><td className="border border-white/10 px-3 py-2 text-center">436</td></tr>
                  <tr><td className="border border-white/10 px-3 py-2">Dempo (Sumatera Selatan)</td><td className="border border-white/10 px-3 py-2 text-center">5</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">Lewotobi Laki-Laki (NTT)</td><td className="border border-white/10 px-3 py-2 text-center">5</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Q1 — MCQ: Total erupsi */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">1</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berapa total seluruh erupsi gunung api sepanjang 2023 berdasarkan data di atas?
                </p>
                <MCQ qn={1} correct={2} options={[
                  "A. 64.197 kali",
                  "B. 65.197 kali",
                  "C. 66.197 kali",
                  "D. 67.197 kali",
                ]} />
                <PembahasanCard pembahasanKey="tka2-q1" pembahasan={tkaLatihan2Pembahasan[1]} />
              </div>
            </div>
          </div>

          {/* Q2 — ComplexMCQ: Pernyataan BENAR */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">2</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Manakah pernyataan berikut yang <span className="text-yellow-300 font-bold">BENAR</span> berdasarkan data erupsi gunung api?
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={2} items={[
                  { text: "Gunung Semeru mengalami erupsi lebih dari 25.000 kali.", benar: true },
                  { text: "Gunung Ibu mengalami erupsi lebih dari 20.000 kali.", benar: true },
                  { text: "Gunung Dukono mengalami erupsi lebih dari 3.000 kali.", benar: true },
                  { text: "Gunung Dempo dan Lewotobi memiliki jumlah erupsi yang sama.", benar: true },
                  { text: "Gunung Anak Krakatau mengalami erupsi lebih dari 700 kali.", benar: false },
                ]} />
                <PembahasanCard pembahasanKey="tka2-q2" pembahasan={tkaLatihan2Pembahasan[2]} />
              </div>
            </div>
          </div>

          {/* Q3 — BenarSalah */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">3</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut!
                </p>
                <BenarSalah qn={3}
                  correct={[false, true, true]}
                  rows={[
                    "Jumlah erupsi Gunung Semeru lebih dari dua kali lipat erupsi Gunung Ibu.",
                    "Total erupsi Gunung Ili Lewotolok dan Dukono adalah 14.824 kali.",
                    "Gunung Marapi memiliki erupsi lebih sedikit daripada Gunung Anak Krakatau.",
                  ]}
                />
                <PembahasanCard pembahasanKey="tka2-q3" pembahasan={tkaLatihan2Pembahasan[3]} />
              </div>
            </div>
          </div>

          {/* ── KONTEKS 4–6: SAMPAH PLASTIK ── */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2 uppercase tracking-wide">Perhatikan informasi berikut untuk menjawab nomor 4 – 6!</p>
            <p className="font-body text-white/90 text-xs font-bold mb-2">Program Pengelolaan Sampah Plastik</p>
            <p className="font-body text-white/70 text-xs leading-relaxed mb-3">
              Kementerian Lingkungan Hidup mencatat bahwa produksi sampah plastik di Indonesia mencapai <span className="text-yellow-300 font-bold">64 juta ton per tahun</span>. Pemerintah menargetkan pengurangan sampah plastik sebesar 30% pada tahun 2030. Saat ini, baru <span className="text-cyan-300 font-bold">15%</span> dari total sampah plastik yang berhasil didaur ulang. Sisanya berakhir di Tempat Pembuangan Akhir (TPA) atau mencemari lingkungan.
            </p>
            <p className="font-body text-white/70 text-xs mb-2">Berikut data komposisi sampah plastik berdasarkan jenisnya:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-3 py-2 text-white text-left">Jenis Plastik</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Persentase</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Berat per Tahun (juta ton)</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr><td className="border border-white/10 px-3 py-2">Kantong Plastik</td><td className="border border-white/10 px-3 py-2 text-center">35%</td><td className="border border-white/10 px-3 py-2 text-center">22,4</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">Botol Minuman</td><td className="border border-white/10 px-3 py-2 text-center">25%</td><td className="border border-white/10 px-3 py-2 text-center">16,0</td></tr>
                  <tr><td className="border border-white/10 px-3 py-2">Kemasan Makanan</td><td className="border border-white/10 px-3 py-2 text-center">20%</td><td className="border border-white/10 px-3 py-2 text-center">12,8</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2">Lainnya</td><td className="border border-white/10 px-3 py-2 text-center">20%</td><td className="border border-white/10 px-3 py-2 text-center">12,8</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Q4 — MCQ: Daur ulang */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">4</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berapa total sampah plastik yang berhasil didaur ulang saat ini (dalam juta ton)?
                </p>
                <MCQ qn={4} correct={2} options={[
                  "A. 6,4 juta ton",
                  "B. 8,6 juta ton",
                  "C. 9,6 juta ton",
                  "D. 12,8 juta ton",
                ]} />
                <PembahasanCard pembahasanKey="tka2-q4" pembahasan={tkaLatihan2Pembahasan[4]} />
              </div>
            </div>
          </div>

          {/* Q5 — ComplexMCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">5</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Manakah pernyataan berikut yang <span className="text-yellow-300 font-bold">BENAR</span> berdasarkan data sampah plastik?
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={5} items={[
                  { text: "Sampah kantong plastik lebih berat daripada botol minuman dan kemasan makanan digabung.", benar: false },
                  { text: "Total sampah plastik yang tidak didaur ulang adalah 54,4 juta ton.", benar: true },
                  { text: "Jika target pengurangan 30% tercapai, maka akan ada pengurangan sebesar 19,2 juta ton.", benar: true },
                  { text: "Jenis plastik lainnya memiliki persentase 15%.", benar: false },
                  { text: "Botol minuman menyumbang lebih dari 15 juta ton sampah per tahun.", benar: true },
                ]} />
                <PembahasanCard pembahasanKey="tka2-q5" pembahasan={tkaLatihan2Pembahasan[5]} />
              </div>
            </div>
          </div>

          {/* Q6 — BenarSalah */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">6</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut!
                </p>
                <BenarSalah qn={6}
                  correct={[true, false, true]}
                  rows={[
                    "Total sampah plastik yang berhasil didaur ulang saat ini kurang dari 10 juta ton.",
                    "Jika tingkat daur ulang meningkat menjadi 30%, sampah yang didaur ulang menjadi 20 juta ton.",
                    "Sampah botol minuman lebih banyak daripada sampah kemasan makanan.",
                  ]}
                />
                <PembahasanCard pembahasanKey="tka2-q6" pembahasan={tkaLatihan2Pembahasan[6]} />
              </div>
            </div>
          </div>

          {/* ── KONTEKS 7–9: BANTUAN SOSIAL ── */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2 uppercase tracking-wide">Perhatikan informasi berikut untuk menjawab nomor 7 – 9!</p>
            <p className="font-body text-white/90 text-xs font-bold mb-2">PROGRAM BANTUAN SOSIAL (BANSOS)</p>
            <p className="font-body text-white/70 text-xs leading-relaxed mb-3">
              Pemerintah mengalokasikan dana <span className="text-yellow-300 font-bold">Rp1,2 triliun</span> untuk program bantuan sosial tunai kepada <span className="text-cyan-300 font-bold">5.000 Kepala Keluarga (KK)</span> di 10 kecamatan. Setiap KK menerima bantuan yang sama besar setiap bulannya. Program ini berlangsung selama <span className="text-cyan-300 font-bold">6 bulan</span>.
            </p>
            <p className="font-body text-white/70 text-xs mb-2">Berikut data penerima bantuan per kecamatan:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Kecamatan</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Jumlah KK Penerima</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Persentase dari Total</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr><td className="border border-white/10 px-3 py-2 text-center">A</td><td className="border border-white/10 px-3 py-2 text-center">600</td><td className="border border-white/10 px-3 py-2 text-center">12%</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2 text-center">B</td><td className="border border-white/10 px-3 py-2 text-center">700</td><td className="border border-white/10 px-3 py-2 text-center">14%</td></tr>
                  <tr><td className="border border-white/10 px-3 py-2 text-center">C</td><td className="border border-white/10 px-3 py-2 text-center">500</td><td className="border border-white/10 px-3 py-2 text-center">10%</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2 text-center">D</td><td className="border border-white/10 px-3 py-2 text-center">800</td><td className="border border-white/10 px-3 py-2 text-center">16%</td></tr>
                  <tr><td className="border border-white/10 px-3 py-2 text-center">E</td><td className="border border-white/10 px-3 py-2 text-center">650</td><td className="border border-white/10 px-3 py-2 text-center">13%</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2 text-center">Lainnya (5 Kecamatan)</td><td className="border border-white/10 px-3 py-2 text-center">1.750</td><td className="border border-white/10 px-3 py-2 text-center">35%</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Q7 — MCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">7</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berapa besar bantuan yang diterima setiap KK setiap bulan?
                </p>
                <MCQ qn={7} correct={1} options={[
                  "A. Rp30.000",
                  "B. Rp40.000",
                  "C. Rp50.000",
                  "D. Rp60.000",
                ]} />
                <PembahasanCard pembahasanKey="tka2-q7" pembahasan={tkaLatihan2Pembahasan[7]} />
              </div>
            </div>
          </div>

          {/* Q8 — ComplexMCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">8</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Manakah pernyataan berikut yang <span className="text-yellow-300 font-bold">BENAR</span> berdasarkan data bantuan sosial?
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={8} items={[
                  { text: "Kecamatan D menerima jumlah KK terbanyak di antara 5 kecamatan yang disebutkan.", benar: true },
                  { text: "Kecamatan C menerima jumlah KK paling sedikit.", benar: true },
                  { text: "Total KK di 5 kecamatan lainnya adalah 1.750 KK.", benar: true },
                  { text: "Kecamatan A dan C memiliki selisih KK sebanyak 100.", benar: true },
                  { text: "Kecamatan B menerima KK lebih banyak daripada kecamatan E.", benar: true },
                ]} />
                <PembahasanCard pembahasanKey="tka2-q8" pembahasan={tkaLatihan2Pembahasan[8]} />
              </div>
            </div>
          </div>

          {/* Q9 — BenarSalah */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">9</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut!
                </p>
                <BenarSalah qn={9}
                  correct={[false, true, false]}
                  rows={[
                    "Kecamatan D memiliki 700 KK penerima bantuan.",
                    "Total KK penerima bantuan di 5 kecamatan (A–E) adalah 3.250 KK.",
                    "Kecamatan B menerima 100 KK lebih banyak daripada kecamatan E.",
                  ]}
                />
                <PembahasanCard pembahasanKey="tka2-q9" pembahasan={tkaLatihan2Pembahasan[9]} />
              </div>
            </div>
          </div>

          {/* ── KONTEKS 10–12: KERIPIK SINGKONG ── */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2 uppercase tracking-wide">Perhatikan informasi berikut untuk menjawab nomor 10 – 12!</p>
            <p className="font-body text-white/90 text-xs font-bold mb-2">Produksi Keripik Singkong UMKM</p>
            <p className="font-body text-white/70 text-xs leading-relaxed mb-2">
              Seorang pengusaha UMKM memproduksi keripik singkong. Biaya produksi per hari mengikuti fungsi{" "}
              <InlineMath math="B(x) = 3.000x + 40.000" />, dengan <InlineMath math="x = \text{jumlah bungkus}" />.
              Harga jual per bungkus adalah <span className="text-yellow-300 font-bold">Rp7.000</span>.
              Target keuntungan harian minimal <span className="text-cyan-300 font-bold">Rp50.000</span>.
            </p>
          </div>

          {/* Q10 — MCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">10</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berapa jumlah bungkus minimal yang harus dijual untuk mencapai target keuntungan?
                </p>
                <MCQ qn={10} correct={2} options={[
                  "A. 20 bungkus",
                  "B. 22 bungkus",
                  "C. 23 bungkus",
                  "D. 25 bungkus",
                ]} />
                <PembahasanCard pembahasanKey="tka2-q10" pembahasan={tkaLatihan2Pembahasan[10]} />
              </div>
            </div>
          </div>

          {/* Q11 — BenarSalah */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">11</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut!
                </p>
                <BenarSalah qn={11}
                  correct={[true, false, true]}
                  rows={[
                    "Biaya produksi 30 bungkus adalah Rp130.000.",
                    "Pendapatan dari penjualan 25 bungkus adalah Rp170.000.",
                    "Keuntungan dari penjualan 30 bungkus adalah Rp80.000.",
                  ]}
                />
                <PembahasanCard pembahasanKey="tka2-q11" pembahasan={tkaLatihan2Pembahasan[11]} />
              </div>
            </div>
          </div>

          {/* Q12 — ComplexMCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">12</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Jika pengusaha mendapat pesanan <span className="text-yellow-300 font-bold">50 bungkus</span>, manakah pernyataan yang benar?
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={12} items={[
                  { text: "Biaya produksi 50 bungkus adalah Rp190.000.", benar: true },
                  { text: "Pendapatan dari 50 bungkus adalah Rp350.000.", benar: true },
                  { text: "Keuntungan dari 50 bungkus adalah Rp160.000.", benar: true },
                ]} />
                <PembahasanCard pembahasanKey="tka2-q12" pembahasan={tkaLatihan2Pembahasan[12]} />
              </div>
            </div>
          </div>

          {/* ── KONTEKS 13–15: PAKET INTERNET ── */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2 uppercase tracking-wide">Perhatikan informasi berikut untuk menjawab nomor 13 – 15!</p>
            <p className="font-body text-white/90 text-xs font-bold mb-2">Memilih Paket Internet dan Telepon</p>
            <p className="font-body text-white/70 text-xs leading-relaxed mb-3">
              Di era digital, kebutuhan internet dan telepon menjadi bagian penting dalam kehidupan sehari-hari. Dua provider seluler menawarkan paket dengan ketentuan berbeda:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-2 py-2 text-white text-center">Provider</th>
                    <th className="border border-white/20 px-2 py-2 text-white text-center">Paket</th>
                    <th className="border border-white/20 px-2 py-2 text-white text-center">Biaya Bulanan</th>
                    <th className="border border-white/20 px-2 py-2 text-white text-center">Kuota</th>
                    <th className="border border-white/20 px-2 py-2 text-white text-center">Bonus</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr><td className="border border-white/10 px-2 py-2 text-center">TelkomIndo</td><td className="border border-white/10 px-2 py-2 text-center">Keluarga</td><td className="border border-white/10 px-2 py-2 text-center">Rp120.000</td><td className="border border-white/10 px-2 py-2 text-center">20 GB</td><td className="border border-white/10 px-2 py-2 text-center">Telp 100 mnt + SMS 100</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-2 py-2 text-center">IndosatOreo</td><td className="border border-white/10 px-2 py-2 text-center">Keluarga</td><td className="border border-white/10 px-2 py-2 text-center">Rp100.000</td><td className="border border-white/10 px-2 py-2 text-center">15 GB</td><td className="border border-white/10 px-2 py-2 text-center">Telp 50 mnt + SMS 50</td></tr>
                  <tr><td className="border border-white/10 px-2 py-2 text-center">TelkomIndo</td><td className="border border-white/10 px-2 py-2 text-center">Personal</td><td className="border border-white/10 px-2 py-2 text-center">Rp80.000</td><td className="border border-white/10 px-2 py-2 text-center">10 GB</td><td className="border border-white/10 px-2 py-2 text-center">Telp 50 mnt</td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-2 py-2 text-center">IndosatOreo</td><td className="border border-white/10 px-2 py-2 text-center">Personal</td><td className="border border-white/10 px-2 py-2 text-center">Rp60.000</td><td className="border border-white/10 px-2 py-2 text-center">8 GB</td><td className="border border-white/10 px-2 py-2 text-center">Telp 30 mnt</td></tr>
                </tbody>
              </table>
            </div>
            <p className="font-body text-white/70 text-xs mb-2 font-bold">Paket tambahan (add-on) jika kuota habis:</p>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-xs font-body text-white/70 space-y-1">
              <p>• <span className="text-cyan-300 font-bold">TelkomIndo:</span> Tambahan 5 GB = Rp25.000</p>
              <p>• <span className="text-cyan-300 font-bold">IndosatOreo:</span> Tambahan 5 GB = Rp20.000</p>
            </div>
          </div>

          {/* Q13 — MCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">13</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Jika <span className="text-yellow-300 font-bold">Rina</span> menggunakan internet rata-rata <span className="text-cyan-300 font-bold">14 GB</span> per bulan dan telepon <span className="text-cyan-300 font-bold">60 menit</span>, berapa biaya minimal yang harus dikeluarkan jika memilih paket yang paling hemat?
                </p>
                <MCQ qn={13} correct={2} options={[
                  "A. Rp100.000",
                  "B. Rp105.000",
                  "C. Rp120.000",
                  "D. Rp125.000",
                ]} />
                <PembahasanCard pembahasanKey="tka2-q13" pembahasan={tkaLatihan2Pembahasan[13]} />
              </div>
            </div>
          </div>

          {/* Q14 — ComplexMCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">14</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  <span className="text-yellow-300 font-bold">Budi</span> adalah pengguna berat yang membutuhkan minimal <span className="text-cyan-300 font-bold">18 GB</span> internet dan <span className="text-cyan-300 font-bold">80 menit</span> telepon setiap bulan. Manakah pernyataan berikut yang <span className="text-yellow-300 font-bold">BENAR</span> tentang pilihan paket untuk Budi?
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={14} items={[
                  { text: "Paket TelkomIndo Keluarga sudah cukup untuk kebutuhan Budi.", benar: true },
                  { text: "Paket IndosatOreo Keluarga sudah cukup untuk kebutuhan Budi.", benar: false },
                  { text: "Jika Budi memilih IndosatOreo Keluarga + add-on 5 GB, biaya totalnya Rp120.000 dan sudah mencukupi kebutuhan.", benar: false },
                  { text: "Jika Budi memilih TelkomIndo Keluarga, ia tidak perlu membeli add-on karena kuota 20 GB sudah mencukupi.", benar: false },
                  { text: "Paket paling hemat untuk Budi adalah TelkomIndo Keluarga + add-on 5 GB.", benar: false },
                ]} />
                <PembahasanCard pembahasanKey="tka2-q14" pembahasan={tkaLatihan2Pembahasan[14]} />
              </div>
            </div>
          </div>

          {/* Q15 — BenarSalah */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">15</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut!
                </p>
                <BenarSalah qn={15}
                  correct={[false, true, false]}
                  rows={[
                    "Paket IndosatOreo Personal lebih murah Rp15.000 dari TelkomIndo Personal.",
                    "Jika seorang pelanggan hanya menggunakan 8 GB internet dan 20 menit telepon per bulan, paket IndosatOreo Personal adalah pilihan paling hemat.",
                    "Untuk pengguna dengan kebutuhan 12 GB internet dan 40 menit telepon, selisih biaya antara TelkomIndo Personal (+ add-on) dan IndosatOreo Personal (+ add-on) adalah Rp10.000.",
                  ]}
                />
                <PembahasanCard pembahasanKey="tka2-q15" pembahasan={tkaLatihan2Pembahasan[15]} />
              </div>
            </div>
          </div>

          {/* ── KONTEKS 16–18: LOMBA MEMINDAHKAN AIR ── */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2 uppercase tracking-wide">Perhatikan informasi berikut untuk menjawab nomor 16 – 18!</p>
            <p className="font-body text-white/90 text-xs font-bold mb-2">Lomba Memindahkan Air di Hari Kemerdekaan</p>
            <p className="font-body text-white/70 text-xs leading-relaxed mb-3">
              Dalam rangka memperingati Hari Kemerdekaan Republik Indonesia ke-79, RT 05 mengadakan berbagai perlombaan tradisional. Berikut data peralatan yang digunakan oleh dua regu finalis:
            </p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Regu</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Ukuran Gelas Ukur</th>
                    <th className="border border-white/20 px-3 py-2 text-white text-center">Ember Kecil (Diameter × Tinggi)</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr><td className="border border-white/10 px-3 py-2 text-center font-bold text-red-400">Merah</td><td className="border border-white/10 px-3 py-2 text-center">200 ml</td><td className="border border-white/10 px-3 py-2 text-center"><InlineMath math="28\text{ cm} \times 35\text{ cm}" /></td></tr>
                  <tr className="bg-white/3"><td className="border border-white/10 px-3 py-2 text-center font-bold text-gray-300">Putih</td><td className="border border-white/10 px-3 py-2 text-center">150 ml</td><td className="border border-white/10 px-3 py-2 text-center"><InlineMath math="35\text{ cm} \times 40\text{ cm}" /></td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-xs font-body text-white/60 space-y-1">
              <p>• Ember berbentuk tabung, gunakan <InlineMath math="\pi = \tfrac{22}{7}" /></p>
              <p>• <InlineMath math="1\text{ liter} = 1.000\text{ ml}" /></p>
            </div>
          </div>

          {/* Q16 — MCQ: Volume ember Regu Merah */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">16</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Ember kecil Regu Merah berbentuk tabung dengan diameter <span className="text-yellow-300 font-bold">28 cm</span> dan tinggi <span className="text-yellow-300 font-bold">35 cm</span>. Berapa volume ember tersebut?
                </p>
                <MCQ qn={16} correct={2} options={[
                  <span key="a"><InlineMath math="A.\ 19.600\ \text{cm}^3" /></span>,
                  <span key="b"><InlineMath math="B.\ 20.790\ \text{cm}^3" /></span>,
                  <span key="c"><InlineMath math="C.\ 21.560\ \text{cm}^3" /></span>,
                  <span key="d"><InlineMath math="D.\ 22.400\ \text{cm}^3" /></span>,
                ]} />
                <PembahasanCard pembahasanKey="tka2-q16" pembahasan={tkaLatihan2Pembahasan[16]} />
              </div>
            </div>
          </div>

          {/* Q17 — MCQ: Minimal gelas Regu Merah */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">17</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Regu Merah menggunakan gelas ukur <span className="text-yellow-300 font-bold">200 ml</span> untuk memindahkan air ke dalam ember kecilnya. Minimal berapa kali gelas ukur harus dipindahkan agar ember terisi penuh?
                </p>
                <MCQ qn={17} correct={3} options={[
                  "A. 105 kali",
                  "B. 106 kali",
                  "C. 107 kali",
                  "D. 108 kali",
                ]} />
                <PembahasanCard pembahasanKey="tka2-q17" pembahasan={tkaLatihan2Pembahasan[17]} />
              </div>
            </div>
          </div>

          {/* Q18 — MCQ: Selisih volume ember */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">18</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Ember kecil Regu Putih memiliki diameter <span className="text-yellow-300 font-bold">35 cm</span> dan tinggi <span className="text-yellow-300 font-bold">40 cm</span>. Berapa selisih volume antara ember Regu Putih dan ember Regu Merah?
                </p>
                <MCQ qn={18} correct={2} options={[
                  <span key="a"><InlineMath math="A.\ 15.940\ \text{cm}^3" /></span>,
                  <span key="b"><InlineMath math="B.\ 16.140\ \text{cm}^3" /></span>,
                  <span key="c"><InlineMath math="C.\ 16.940\ \text{cm}^3" /></span>,
                  <span key="d"><InlineMath math="D.\ 17.940\ \text{cm}^3" /></span>,
                ]} />
                <PembahasanCard pembahasanKey="tka2-q18" pembahasan={tkaLatihan2Pembahasan[18]} />
              </div>
            </div>
          </div>

          {/* ── KONTEKS 19–21: DEKORASI FESTIVAL BUDAYA SEKOLAH ── */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2 uppercase tracking-wide">Perhatikan informasi berikut untuk menjawab nomor 19 – 21!</p>
            <p className="font-body text-white/90 text-xs font-bold mb-2">Persiapan Festival Budaya Sekolah</p>
            <p className="font-body text-white/70 text-xs leading-relaxed mb-3">
              SMP Nusantara sedang mempersiapkan festival budaya tahunan. Panitia memasang berbagai dekorasi di area panggung:
            </p>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-xs font-body text-white/80 space-y-2">
              <p>• Sebuah <span className="text-yellow-300 font-bold">tangga dekorasi sepanjang 13 m</span> disandarkan ke dinding panggung. Bagian bawah tangga diletakkan sejauh <span className="text-cyan-300 font-bold">5 m</span> dari kaki dinding.</p>
              <p>• Sebuah <span className="text-yellow-300 font-bold">ornamen segitiga</span> dengan titik sudut <InlineMath math="P(3,\ 4)" />, <InlineMath math="Q(5,\ 4)" />, dan <InlineMath math="R(5,\ 1)" /> dicerminkan terhadap sumbu-<InlineMath math="y" /> untuk membuat desain yang simetris.</p>
              <p>• Sebuah <span className="text-yellow-300 font-bold">hiasan juring lingkaran</span> berjari-jari <span className="text-cyan-300 font-bold">14 cm</span> dengan sudut pusat <span className="text-cyan-300 font-bold">90°</span> dipasang di setiap sudut panggung. Gunakan <InlineMath math="\pi = \tfrac{22}{7}" />.</p>
            </div>
          </div>

          {/* Q19 — MCQ: Teorema Pythagoras (tangga dekorasi) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">19</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berdasarkan data tangga dekorasi di atas, berapa tinggi dinding panggung yang dapat dijangkau oleh tangga tersebut?
                </p>
                <MCQ qn={19} correct={2} options={[
                  "A. 10 m",
                  "B. 11 m",
                  "C. 12 m",
                  "D. 14 m",
                ]} />
                <PembahasanCard pembahasanKey="tka2-q19" pembahasan={tkaLatihan2Pembahasan[19]} />
              </div>
            </div>
          </div>

          {/* Q20 — MCQ: Transformasi (pencerminan terhadap sumbu-y) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">20</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Setelah ornamen segitiga dicerminkan terhadap sumbu-<InlineMath math="y" />, koordinat bayangan titik <InlineMath math="R(5,\ 1)" /> adalah ....
                </p>
                <MCQ qn={20} correct={2} options={[
                  <span key="a"><InlineMath math="A.\ (-5,\ {-1})" /></span>,
                  <span key="b"><InlineMath math="B.\ (5,\ {-1})" /></span>,
                  <span key="c"><InlineMath math="C.\ ({-5},\ 1)" /></span>,
                  <span key="d"><InlineMath math="D.\ (1,\ {-5})" /></span>,
                ]} />
                <PembahasanCard pembahasanKey="tka2-q20" pembahasan={tkaLatihan2Pembahasan[20]} />
              </div>
            </div>
          </div>

          {/* Q21 — MCQ: Luas juring lingkaran */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">21</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berapa luas satu hiasan juring lingkaran yang dipasang di sudut panggung?
                </p>
                <MCQ qn={21} correct={2} options={[
                  <span key="a"><InlineMath math="A.\ 144\ \text{cm}^2" /></span>,
                  <span key="b"><InlineMath math="B.\ 148\ \text{cm}^2" /></span>,
                  <span key="c"><InlineMath math="C.\ 154\ \text{cm}^2" /></span>,
                  <span key="d"><InlineMath math="D.\ 176\ \text{cm}^2" /></span>,
                ]} />
                <PembahasanCard pembahasanKey="tka2-q21" pembahasan={tkaLatihan2Pembahasan[21]} />
              </div>
            </div>
          </div>

          {/* ── KONTEKS 22–24: HARGA BARANG POKOK ── */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2 uppercase tracking-wide">Perhatikan informasi berikut untuk menjawab nomor 22 – 24!</p>
            <p className="font-body text-white/70 text-xs mb-2 font-bold">Informasi harga barang pokok dasar:</p>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-xs font-body text-white/80 space-y-1 mb-3">
              <p>• Beras: Rp14.000/kg</p>
              <p>• Gula pasir: Rp16.000/kg</p>
              <p>• Minyak goreng: Rp18.000/liter</p>
              <p>• Telur: Rp24.000/kg</p>
            </div>
            <p className="font-body text-white/70 text-xs leading-relaxed">
              Seorang pembeli membeli <InlineMath math="x\text{ kg}" /> beras, <InlineMath math="y\text{ kg}" /> gula pasir, <InlineMath math="z\text{ liter}" /> minyak goreng, dan <InlineMath math="w\text{ kg}" /> telur.
            </p>
          </div>

          {/* Q22 — MCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">22</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Bentuk aljabar yang menyatakan total harga belanja sebelum diskon adalah ....
                </p>
                <MCQ qn={22} correct={0} cols={1} options={[
                  <span key="a"><InlineMath math="A.\ 14.000x + 16.000y + 18.000z + 24.000w" /></span>,
                  <span key="b"><InlineMath math="B.\ 14.000x + 16.000y + 18.000z" /></span>,
                  <span key="c"><InlineMath math="C.\ 14.000x + 16.000y + 24.000w" /></span>,
                  <span key="d"><InlineMath math="D.\ 16.000y + 18.000z + 24.000w" /></span>,
                ]} />
                <PembahasanCard pembahasanKey="tka2-q22" pembahasan={tkaLatihan2Pembahasan[22]} />
              </div>
            </div>
          </div>

          {/* Q23 — ComplexMCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">23</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Seorang pembeli membeli <span className="text-yellow-300 font-bold">2 kg beras, 3 kg gula pasir, 1 liter minyak goreng, dan 2 kg telur</span>. Manakah pernyataan berikut yang <span className="text-yellow-300 font-bold">BENAR</span> tentang total belanja pembeli tersebut?
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={23} items={[
                  { text: "Total belanja sebelum diskon adalah Rp154.000.", benar: false },
                  { text: "Pembeli mendapatkan diskon 10% karena total belanja di atas Rp100.000.", benar: false },
                  { text: "Pembeli juga mendapatkan diskon tambahan 5% karena membeli 4 jenis bahan pokok.", benar: false },
                  { text: "Total diskon yang didapat adalah 15% karena total belanja di atas Rp100.000 dan membeli minimal 3 jenis.", benar: true },
                  { text: "Total belanja setelah diskon adalah Rp130.900.", benar: false },
                ]} />
                <PembahasanCard pembahasanKey="tka2-q23" pembahasan={tkaLatihan2Pembahasan[23]} />
              </div>
            </div>
          </div>

          {/* Q24 — BenarSalah with BlockMath */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">24</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Jika total belanja sebelum diskon dinyatakan dengan <InlineMath math="T" />, maka fungsi total belanja setelah diskon adalah:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 text-xs font-body text-white/90 overflow-x-auto">
                  <BlockMath math={String.raw`f(T) = \begin{cases} T, & \text{jika } T \le 100.000 \\ 0{,}9T, & \text{jika } T > 100.000 \text{ dan membeli kurang dari 3 jenis} \\ 0{,}85T, & \text{jika } T > 100.000 \text{ dan membeli minimal 3 jenis} \end{cases}`} />
                </div>
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut!
                </p>
                <BenarSalah qn={24}
                  correct={[true, false, true]}
                  rows={[
                    <span key="r1">Jika seseorang membeli <InlineMath math="2\text{ kg}" /> beras dan <InlineMath math="3\text{ kg}" /> gula pasir, total belanja sebelum diskon adalah Rp76.000.</span>,
                    <span key="r2">Pembeli tersebut mendapat diskon 10% karena total belanja di atas Rp100.000.</span>,
                    <span key="r3">Jika seseorang membeli <InlineMath math="4\text{ kg}" /> beras, <InlineMath math="2\text{ kg}" /> gula pasir, dan <InlineMath math="1\text{ liter}" /> minyak goreng, total belanja setelah diskon adalah Rp90.100.</span>,
                  ]}
                />
                <PembahasanCard pembahasanKey="tka2-q24" pembahasan={tkaLatihan2Pembahasan[24]} />
              </div>
            </div>
          </div>

          {/* ── KONTEKS 25–30: TIMNAS AFF 2026 ── */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4">
            <p className="font-body text-blue-300 text-xs font-bold mb-2 uppercase tracking-wide">Perhatikan informasi berikut untuk menjawab nomor 25 – 30!</p>
            <p className="font-body text-white/90 text-xs font-bold mb-2">Perjuangan Timnas Indonesia di Piala AFF 2026</p>
            <p className="font-body text-white/70 text-xs leading-relaxed mb-2">
              Piala AFF 2026 menjadi ajang pembuktian bagi Timnas Indonesia yang belum pernah sekalipun meraih gelar juara dalam 15 edisi sebelumnya. Garuda memegang rekor <span className="text-yellow-300 font-bold">enam kali menjadi runner-up</span>, yakni pada edisi 2000, 2002, 2004, 2010, 2016, dan 2020.
            </p>
            <p className="font-body text-white/70 text-xs leading-relaxed mb-2">
              Pada edisi kali ini, Timnas Indonesia tergabung dalam Grup A bersama Vietnam, Singapura, Kamboja, dan Timor Leste. Perjalanan diawali mulus: dua kemenangan atas <span className="text-green-300 font-bold">Kamboja (5-1)</span> dan <span className="text-green-300 font-bold">Timor Leste (3-0)</span> membuat Indonesia mengoleksi 6 poin, mencetak 8 gol, dan baru sekali kebobolan.
            </p>
            <p className="font-body text-white/70 text-xs leading-relaxed mb-2">
              Seorang pengamat memberikan peluang <span className="text-cyan-300 font-bold">90%</span> bagi Timnas Indonesia untuk menjuarai Piala AFF 2026. Namun pada laga ketiga, Indonesia harus menelan kekalahan <span className="text-red-400 font-bold">0-3 dari Vietnam</span>.
            </p>
          </div>

          {/* Q25 — MCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">25</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Seorang pengamat memberikan peluang 90% bagi Timnas Indonesia untuk menjuarai Piala AFF 2026. Pernyataan tersebut berarti bahwa dari 100 kali turnamen yang diikuti dengan kondisi yang sama, berapa kali Timnas Indonesia diperkirakan akan menjadi juara?
                </p>
                <MCQ qn={25} correct={2} options={[
                  "A. 70 kali",
                  "B. 80 kali",
                  "C. 90 kali",
                  "D. 100 kali",
                ]} />
                <PembahasanCard pembahasanKey="tka2-q25" pembahasan={tkaLatihan2Pembahasan[25]} />
              </div>
            </div>
          </div>

          {/* Q26 — ComplexMCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">26</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Timnas Indonesia telah <span className="text-yellow-300 font-bold">6 kali menjadi runner-up Piala AFF</span> dari 15 edisi yang telah berlangsung. Berdasarkan data historis tersebut, manakah pernyataan berikut yang <span className="text-yellow-300 font-bold">BENAR</span>?
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={26} items={[
                  { text: <span key="i0">Frekuensi relatif Indonesia menjadi runner-up adalah <InlineMath math="\tfrac{6}{15}" /> atau 40%.</span>, benar: true },
                  { text: "Peluang Indonesia menjadi juara berdasarkan data historis adalah 0%.", benar: true },
                  { text: "Frekuensi relatif Indonesia tidak pernah menjadi juara adalah 9/15 atau 60%.", benar: false },
                  { text: "Jika pola yang sama berlanjut, dalam 30 edisi berikutnya Indonesia akan menjadi runner-up sebanyak 12 kali.", benar: true },
                  { text: "Peluang Indonesia menjadi juara lebih besar daripada menjadi runner-up.", benar: false },
                ]} />
                <PembahasanCard pembahasanKey="tka2-q26" pembahasan={tkaLatihan2Pembahasan[26]} />
              </div>
            </div>
          </div>

          {/* Q27 — BenarSalah */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">27</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut!
                </p>
                <BenarSalah qn={27}
                  correct={[false, true, false]}
                  rows={[
                    "Indonesia sudah pernah menjadi juara Piala AFF dalam 15 edisi terakhir.",
                    "Jika Indonesia memiliki peluang 90% untuk menjadi juara, maka peluang tidak menjadi juara adalah 10%.",
                    "Kekalahan 0-3 dari Vietnam membuat peluang Indonesia menjadi juara menjadi 0%.",
                  ]}
                />
                <PembahasanCard pembahasanKey="tka2-q27" pembahasan={tkaLatihan2Pembahasan[27]} />
              </div>
            </div>
          </div>

          {/* Q28 — MCQ (soal tambahan, konteks sama) */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">28</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Berdasarkan data pertandingan tiga laga awal di Grup A (vs Kamboja 5-1, vs Timor Leste 3-0, dan vs Vietnam 0-3), berapakah <span className="text-yellow-300 font-bold">rata-rata selisih gol per pertandingan</span> yang dimiliki oleh Timnas Indonesia saat ini?
                </p>
                <MCQ qn={28} correct={1} options={[
                  "A. +1,00 gol/laga",
                  "B. +1,33 gol/laga",
                  "C. +1,67 gol/laga",
                  "D. +2,00 gol/laga",
                ]} />
                <PembahasanCard pembahasanKey="tka2-q28" pembahasan={tkaLatihan2Pembahasan[28]} />
              </div>
            </div>
          </div>

          {/* Q29 — ComplexMCQ */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">29</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Manakah pernyataan berikut yang <span className="text-yellow-300 font-bold">BENAR</span> terkait performa Timnas Indonesia hingga pertandingan ketiga?
                </p>
                <p className="text-cyan-300 text-xs font-body mb-2">Klik pada setiap pilihan jawaban yang benar! Jawaban benar lebih dari satu.</p>
                <ComplexMCQ qn={29} items={[
                  { text: "Total selisih gol Indonesia setelah tiga laga awal adalah +4.", benar: true },
                  { text: "Rata-rata gol yang dicetak Indonesia per pertandingan adalah 2,67 gol.", benar: true },
                  { text: "Kebobolan terbanyak Indonesia dalam satu laga terjadi saat melawan Vietnam.", benar: true },
                  { text: "Persentase kemenangan Indonesia dalam tiga laga awal Grup A adalah 66,7%.", benar: true },
                  { text: "Jumlah kebobolan Indonesia lebih banyak daripada total gol yang dicetak.", benar: false },
                ]} />
                <PembahasanCard pembahasanKey="tka2-q29" pembahasan={tkaLatihan2Pembahasan[29]} />
              </div>
            </div>
          </div>

          {/* Q30 — BenarSalah */}
          <div className="bg-card/70 backdrop-blur border border-border rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <span className="bg-accent/20 text-accent font-display font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">30</span>
              <div className="flex-1">
                <p className="font-body text-white/90 text-sm leading-relaxed mb-3">
                  Tentukan Benar atau Salah pada setiap pernyataan berikut berdasarkan narasi cerita!
                </p>
                <BenarSalah qn={30}
                  correct={[true, true, true]}
                  rows={[
                    "Peluang komplemen dari Indonesia meraih gelar juara menurut pengamat adalah 0,1.",
                    "Jika Indonesia memenangkan laga pamungkas melawan Singapura, total poin maksimal yang dikumpulkan Indonesia di fase grup adalah 9 poin.",
                    <span key="r3">Berdasarkan data historis 15 edisi sebelumnya, frekuensi relatif Indonesia gagal menjadi runner-up adalah <InlineMath math="\tfrac{9}{15}" /> atau 60%.</span>,
                  ]}
                />
                <PembahasanCard pembahasanKey="tka2-q30" pembahasan={tkaLatihan2Pembahasan[30]} />
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

export default TKALatihan2Page;
