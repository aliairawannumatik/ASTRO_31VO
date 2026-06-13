import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen, ChevronRight, Lightbulb, Calculator,
  Target, Plus, Minus, Info, ArrowRight, Zap
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PenjumlahanPenguranganBentukDesimalPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    playPopSound();
    setActiveSection(activeSection === index ? null : index);
  };

  const ColTable = ({
    rows,
    operator,
    result,
  }: {
    rows: string[][];
    operator: string;
    result: string[];
  }) => {
    const headers = ["R", "P", "S", "", "p", "r", "b"];
    return (
      <div className="overflow-x-auto">
        <table className="mx-auto font-mono text-sm border-separate border-spacing-0">
          <thead>
            <tr>
              <td className="w-6" />
              {headers.map((h, i) =>
                h === "" ? (
                  <td key={i} className="w-4 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                ) : (
                  <td key={i} className="w-8 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <td className="text-right pr-1 text-white/50 text-xs w-6">
                  {ri === rows.length - 1 ? operator : ""}
                </td>
                {row.map((cell, ci) =>
                  ci === 3 ? (
                    <td key={ci} className="w-4 text-center text-yellow-400 font-bold">,</td>
                  ) : (
                    <td key={ci} className="w-8 text-center text-white px-1">{cell}</td>
                  )
                )}
              </tr>
            ))}
            <tr>
              <td />
              <td colSpan={8} className="pt-0">
                <div className="border-t-2 border-white/40 my-1" />
              </td>
            </tr>
            <tr>
              <td className="text-right pr-1 text-primary text-xs">=</td>
              {result.map((cell, ci) =>
                ci === 3 ? (
                  <td key={ci} className="w-4 text-center text-yellow-400 font-bold">,</td>
                ) : (
                  <td key={ci} className="w-8 text-center text-primary font-bold px-1">{cell}</td>
                )
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-4xl w-full px-4 py-10">

        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENJUMLAHAN DAN PENGURANGAN BENTUK DESIMAL
        </h1>
        <p className="text-white/50 text-xs text-center mb-4 font-body">
          Kelas 7 – Bilangan Rasional
        </p>

        {/* Konsep Awal: Nilai Tempat */}
        <div className="mb-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-500/30 rounded-2xl p-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 className="font-display text-sm font-bold text-cyan-300">Konsep Dasar: Nilai Tempat Desimal</h2>
          </div>
          <p className="font-body text-sm text-white/80 leading-relaxed mb-4">
            Sebelum menjumlahkan atau mengurangkan, penting banget buat paham dulu struktur <strong className="text-cyan-300">nilai tempat</strong> desimal.
            Setiap angka punya "posisi" sendiri yang menentukan nilainya. Kunci utamanya: <strong className="text-yellow-300">tanda koma harus selalu sejajar!</strong>
          </p>

          {/* Tabel Nilai Tempat */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-center text-xs font-body border-separate border-spacing-1">
              <thead>
                <tr>
                  {["Ribuan", "Ratusan", "Puluhan", "Satuan", "⟵ Koma ⟶", "Persepuluhan", "Perseratusan", "Perseribuan"].map((h, i) => (
                    <th key={i} className={`px-2 py-2 rounded-lg font-semibold ${
                      i === 4 ? "text-yellow-300 bg-yellow-500/10" :
                      i < 4 ? "text-blue-300 bg-blue-500/10" :
                      "text-green-300 bg-green-500/10"
                    }`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {["B", "R", "P", "S", ",", "p", "r", "b"].map((v, i) => (
                    <td key={i} className={`px-2 py-2 font-mono font-bold text-base rounded ${
                      i === 4 ? "text-yellow-400" :
                      i < 4 ? "text-blue-200" :
                      "text-green-200"
                    }`}>{v}</td>
                  ))}
                </tr>
                <tr>
                  {["1000", "100", "10", "1", "", "0,1", "0,01", "0,001"].map((v, i) => (
                    <td key={i} className="px-2 py-1 text-white/50 text-xs">{v}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Ilustrasi 934,456 + 70,806 */}
          <div className="bg-black/30 rounded-xl p-4">
            <p className="font-body text-xs text-white/60 mb-3 text-center">
              Contoh Ilustrasi: <InlineMath math="934{,}456 + 70{,}806" />
            </p>
            <div className="overflow-x-auto">
              <table className="mx-auto font-mono text-sm border-separate border-spacing-0">
                <thead>
                  <tr>
                    <td className="w-6" />
                    {["R","P","S","","p","r","b"].map((h,i)=> h===""
                      ? <td key={i} className="w-6 text-center text-yellow-400 font-bold text-xs">,</td>
                      : <td key={i} className="w-8 text-center text-white/40 text-xs font-body">{h}</td>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td />
                    {["9","3","4","","4","5","6"].map((c,i)=> c===""
                      ? <td key={i} className="text-center text-yellow-400 font-bold">,</td>
                      : <td key={i} className="text-center text-white px-1">{c}</td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-right pr-1 text-white/50 text-xs">+</td>
                    {["","7","0","","8","0","6"].map((c,i)=> c===""&&i===0
                      ? <td key={i} className="text-center px-1" />
                      : c===""&&i===3
                        ? <td key={i} className="text-center text-yellow-400 font-bold">,</td>
                        : <td key={i} className="text-center text-white px-1">{c}</td>
                    )}
                  </tr>
                  <tr>
                    <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1" /></td>
                  </tr>
                  <tr>
                    <td className="text-right pr-1 text-primary text-xs">=</td>
                    {["1","0","0","","2","6","2"].map((c,i)=> c===""
                      ? <td key={i} className="text-center text-yellow-400 font-bold">,</td>
                      : <td key={i} className="text-center text-primary font-bold px-1">{c}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 space-y-1 text-xs text-white/60 font-body">
              <div className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />
                <p>Kolom <strong className="text-green-300">perseribuan (b)</strong>: 6 + 6 = 12 → tulis 2, simpan 1 ke kolom perseratusan</p>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                <p>Kolom <strong className="text-cyan-300">persepuluhan (p)</strong>: 4 + 8 = 12 → tulis 2, simpan 1 ke kolom satuan</p>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                <p>Kolom <strong className="text-purple-300">puluhan (P)</strong>: 3 + 7 = 10 → tulis 0, simpan 1 ke kolom ratusan</p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
            <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="font-body text-xs text-yellow-200 leading-relaxed">
              <strong>Kesimpulan:</strong> Untuk menjumlahkan atau mengurangkan bilangan desimal, letakkan tanda koma pada
              satu lajur yang sama agar angka ribuan, ratusan, puluhan, satuan, persepuluhan, dan seterusnya
              masing-masing berada pada kolom yang tepat!
            </p>
          </div>
        </div>

        {/* ===================== SUB-BAB 1: PENJUMLAHAN ===================== */}
        <div className="mb-6 animate-slide-up">
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <Plus className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Penjumlahan Bentuk Desimal</span>
            
          </div>

          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-green-500/20 rounded-xl px-5 py-6 space-y-5 animate-slide-up">

              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-xl p-4">
                <h3 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="font-body text-sm text-white/90 leading-relaxed">
                  Menjumlahkan bilangan desimal itu <strong className="text-green-300">semudah menjumlahkan bilangan bulat</strong> — triknya
                  cuma satu: pastikan <strong className="text-yellow-300">tanda koma selalu sejajar secara vertikal</strong>. Dengan begitu,
                  angka persepuluhan ketemu persepuluhan, perseratusan ketemu perseratusan, dan seterusnya. Kalau
                  jumlah digit di belakang koma berbeda, tinggal tambahkan nol agar sama panjang.
                </p>
              </div>

              {/* Langkah-Langkah */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Langkah-Langkah Penjumlahan Desimal
                </h4>
                <div className="space-y-2">
                  {[
                    { n: "1", t: "Susun bilangan secara vertikal", d: "Pastikan tanda koma berada dalam satu kolom (sejajar ke bawah)." },
                    { n: "2", t: "Samakan panjang digit desimal", d: "Tambahkan angka 0 di belakang koma pada bilangan yang digit desimalnya lebih sedikit." },
                    { n: "3", t: "Jumlahkan kolom per kolom", d: "Mulai dari kolom paling kanan (perseribuan), bergerak ke kiri. Jika hasilnya ≥ 10, simpan angka puluhannya ke kolom berikutnya." },
                    { n: "4", t: "Tuliskan tanda koma pada hasil", d: "Posisi koma pada hasil sama persis dengan posisi koma di soal." },
                  ].map(step => (
                    <div key={step.n} className="flex gap-3 items-start">
                      <span className="bg-purple-500/30 text-purple-300 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">{step.n}</span>
                      <div>
                        <p className="font-body text-sm text-white font-semibold">{step.t}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTOH SOAL */}
              <div className="border-t border-white/10 pt-4">
                <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-400" /> Contoh Soal dan Pembahasan
                </p>

                {/* ---- MUDAH ---- */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-500/40">MUDAH</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan hasil penjumlahan <InlineMath math="14{,}7 + 8{,}39" />
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-400 tracking-wider">✦ PEMBAHASAN</p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 1:</strong> Samakan digit desimal — <InlineMath math="14{,}7" /> menjadi <InlineMath math="14{,}70" /> (tambah 1 nol)
                    </p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 2:</strong> Susun vertikal dengan koma sejajar, lalu jumlahkan kolom demi kolom:
                    </p>
                    <div className="bg-black/40 rounded-xl p-4 my-2">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {["P","S","","p","r"].map((h,i)=> h===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["1","4","","7","0"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">+</td>
                              {["","8","","3","9"].map((c,i)=> i===0
                                ? <td key={i} className="w-9 text-center px-1 text-white/30">—</td>
                                : c===""
                                  ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={6}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-green-400 text-sm font-bold">=</td>
                              {["2","3","","0","9"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-green-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 3:</strong> Koma tetap di posisi yang sama pada hasil.
                    </p>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="14{,}7 + 8{,}39 = 23{,}09" />
                    </div>
                    <p className="text-green-400 font-semibold font-body text-sm">
                      ∴ Jadi, hasil penjumlahannya adalah <InlineMath math="23{,}09" />
                    </p>
                  </div>
                </div>

                {/* ---- SEDANG ---- */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/40">SEDANG</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan hasil penjumlahan <InlineMath math="9{,}754 + 52{,}18" />
                    </p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-400 tracking-wider">✦ PEMBAHASAN</p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 1:</strong> <InlineMath math="52{,}18" /> punya 2 digit desimal, <InlineMath math="9{,}754" /> punya 3 digit.
                      Tambah 1 nol pada <InlineMath math="52{,}18" /> → <InlineMath math="52{,}180" />
                    </p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 2:</strong> Susun vertikal dan hitung:
                    </p>
                    <div className="bg-black/40 rounded-xl p-4 my-2">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {["P","S","","p","r","b"].map((h,i)=> h===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["","9","","7","5","4"].map((c,i)=> i===0
                                ? <td key={i} className="w-9 text-center text-white/30 px-1">—</td>
                                : c===""
                                  ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">+</td>
                              {["5","2","","1","8","0"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={7}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-yellow-400 text-sm font-bold">=</td>
                              {["6","1","","9","3","4"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-yellow-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/70 italic">
                      Perseribuan: 4 + 0 = 4 &nbsp;|&nbsp; Perseratusan: 5 + 8 = 13 (tulis 3, simpan 1) &nbsp;|&nbsp; Persepuluhan: 7 + 1 + 1 = 9
                    </p>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="9{,}754 + 52{,}18 = 61{,}934" />
                    </div>
                    <p className="text-yellow-400 font-semibold font-body text-sm">
                      ∴ Jadi, hasil penjumlahannya adalah <InlineMath math="61{,}934" />
                    </p>
                  </div>
                </div>

                {/* ---- SULIT ---- */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 rounded-full border border-red-500/40">SULIT</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Sebuah proyek jalan membutuhkan 3 gulungan kawat. Gulungan pertama sepanjang <InlineMath math="934{,}456" /> m,
                      gulungan kedua sepanjang <InlineMath math="70{,}806" /> m, dan gulungan ketiga sepanjang <InlineMath math="8{,}34" /> m.
                      Berapa meter total panjang kawat yang dibutuhkan?
                    </p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-400 tracking-wider">✦ PEMBAHASAN</p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 1:</strong> Kenali bilangan yang dijumlahkan:
                    </p>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <BlockMath math="\text{Total} = 934{,}456 + 70{,}806 + 8{,}34" />
                    </div>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 2:</strong> Samakan digit desimal — <InlineMath math="8{,}34" /> menjadi <InlineMath math="8{,}340" />
                    </p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 3:</strong> Susun vertikal dan jumlahkan:
                    </p>
                    <div className="bg-black/40 rounded-xl p-4 my-2">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {["R","P","S","","p","r","b"].map((h,i)=> h===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ["9","3","4","","4","5","6"],
                              ["-","7","0","","8","0","6"],
                              ["-","-","8","","3","4","0"],
                            ].map((row, ri) => (
                              <tr key={ri}>
                                <td className="text-right pr-1 text-white/50 text-xs">{ri === 2 ? "+" : ""}</td>
                                {row.map((c,i)=> c===""
                                  ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                  : c==="-"
                                    ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                    : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                                )}
                              </tr>
                            ))}
                            <tr>
                              <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-red-400 text-sm font-bold">=</td>
                              {["1","0","1","","6","0","2"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-red-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="934{,}456 + 70{,}806 + 8{,}340 = 1013{,}602" />
                    </div>
                    <p className="text-red-400 font-semibold font-body text-sm">
                      ∴ Jadi, total panjang kawat yang dibutuhkan adalah <InlineMath math="1013{,}602" /> m
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================== SUB-BAB 2: PENGURANGAN ===================== */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <Minus className="w-5 h-5 text-red-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Pengurangan Bentuk Desimal</span>
            
          </div>

          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-red-500/20 rounded-xl px-5 py-6 space-y-5 animate-slide-up">

              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4">
                <h3 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="font-body text-sm text-white/90 leading-relaxed">
                  Pengurangan desimal prinsipnya <strong className="text-red-300">sama persis dengan penjumlahan</strong>:
                  jajarkan koma, samakan panjang digit desimal dengan menambahkan nol. Bedanya, saat kamu mengurangkan
                  kolom dan angka atas lebih kecil dari angka bawah, kamu perlu <strong className="text-orange-300">meminjam
                  1 nilai dari kolom sebelah kiri</strong> (persis seperti pengurangan bilangan bulat biasa).
                </p>
              </div>

              {/* Langkah-Langkah */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <h4 className="text-orange-300 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Langkah-Langkah Pengurangan Desimal
                </h4>
                <div className="space-y-2">
                  {[
                    { n: "1", t: "Susun vertikal, koma sejajar", d: "Bilangan yang dikurangi di atas, pengurang di bawah." },
                    { n: "2", t: "Samakan panjang digit desimal", d: "Tambahkan nol di posisi yang kurang agar jumlah digit di belakang koma sama." },
                    { n: "3", t: "Kurangkan kolom per kolom dari kanan", d: "Mulai dari kolom paling kanan. Jika angka atas < angka bawah, pinjam 1 dari kolom sebelah kiri (nilainya jadi +10)." },
                    { n: "4", t: "Tuliskan koma pada posisi yang sama", d: "Koma hasil sejajar dengan koma di soal." },
                  ].map(step => (
                    <div key={step.n} className="flex gap-3 items-start">
                      <span className="bg-orange-500/30 text-orange-300 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">{step.n}</span>
                      <div>
                        <p className="font-body text-sm text-white font-semibold">{step.t}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 flex items-start gap-2">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="font-body text-xs text-cyan-200 leading-relaxed">
                  <strong>Tips:</strong> Kalau bilangan yang dikurangi adalah bilangan bulat (contoh: 467,8 dikurangi sesuatu),
                  kamu bisa tulis bilangan itu dengan nol di belakang koma sesuai kebutuhan. Misal <InlineMath math="467{,}8" /> bisa
                  ditulis <InlineMath math="467{,}800" /> agar punya 3 digit desimal.
                </p>
              </div>

              {/* CONTOH SOAL */}
              <div className="border-t border-white/10 pt-4">
                <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-400" /> Contoh Soal dan Pembahasan
                </p>

                {/* ---- MUDAH ---- */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-500/40">MUDAH</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">
                      Kurangkan <InlineMath math="23{,}5 - 7{,}25" />
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-400 tracking-wider">✦ PEMBAHASAN</p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 1:</strong> Samakan digit desimal — <InlineMath math="23{,}5" /> menjadi <InlineMath math="23{,}50" />
                    </p>
                    <div className="bg-black/40 rounded-xl p-4 my-2">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {["P","S","","p","r"].map((h,i)=> h===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["2","3","","5","0"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">−</td>
                              {["","7","","2","5"].map((c,i)=> i===0
                                ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                : c===""
                                  ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={6}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-green-400 text-sm font-bold">=</td>
                              {["1","6","","2","5"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-green-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="23{,}50 - 7{,}25 = 16{,}25" />
                    </div>
                    <p className="text-green-400 font-semibold font-body text-sm">
                      ∴ Jadi, <InlineMath math="23{,}5 - 7{,}25 = 16{,}25" />
                    </p>
                  </div>
                </div>

                {/* ---- SEDANG ---- */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/40">SEDANG</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">
                      Kurangkan <InlineMath math="84{,}937" /> dari <InlineMath math="725{,}46" />
                    </p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-400 tracking-wider">✦ PEMBAHASAN</p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Perhatian:</strong> "Kurangkan A dari B" artinya <InlineMath math="B - A" />, jadi soalnya: <InlineMath math="725{,}46 - 84{,}937" />
                    </p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 1:</strong> Samakan digit desimal — <InlineMath math="725{,}46" /> menjadi <InlineMath math="725{,}460" />
                    </p>
                    <div className="bg-black/40 rounded-xl p-4 my-2">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {["R","P","S","","p","r","b"].map((h,i)=> h===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["7","2","5","","4","6","0"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">−</td>
                              {["-","8","4","","9","3","7"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : c==="-"
                                  ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-yellow-400 text-sm font-bold">=</td>
                              {["6","4","0","","5","2","3"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-yellow-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="725{,}460 - 84{,}937 = 640{,}523" />
                    </div>
                    <p className="text-yellow-400 font-semibold font-body text-sm">
                      ∴ Jadi, hasilnya adalah <InlineMath math="640{,}523" />
                    </p>
                  </div>
                </div>

                {/* ---- SULIT ---- */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 rounded-full border border-red-500/40">SULIT</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Kurangkan <InlineMath math="89{,}276" /> dari <InlineMath math="467{,}8" />.
                      Kemudian kurangkan lagi hasilnya dengan <InlineMath math="120{,}05" />. Berapa hasil akhirnya?
                    </p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-400 tracking-wider">✦ PEMBAHASAN</p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 1:</strong> Operasi pertama — <InlineMath math="467{,}8 - 89{,}276" />
                    </p>
                    <p className="font-body text-sm text-white/80">Samakan digit desimal: <InlineMath math="467{,}8" /> → <InlineMath math="467{,}800" /></p>
                    <div className="bg-black/40 rounded-xl p-4 my-1">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {["R","P","S","","p","r","b"].map((h,i)=> h===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["4","6","7","","8","0","0"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">−</td>
                              {["-","8","9","","2","7","6"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : c==="-"
                                  ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-orange-400 text-sm font-bold">=</td>
                              {["3","7","8","","5","2","4"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-orange-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 2:</strong> Operasi kedua — <InlineMath math="378{,}524 - 120{,}050" />
                    </p>
                    <div className="bg-black/40 rounded-xl p-4 my-1">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {["R","P","S","","p","r","b"].map((h,i)=> h===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["3","7","8","","5","2","4"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">−</td>
                              {["1","2","0","","0","5","0"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-red-400 text-sm font-bold">=</td>
                              {["2","5","8","","4","7","4"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-red-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="467{,}800 - 89{,}276 = 378{,}524" />
                      <BlockMath math="378{,}524 - 120{,}050 = 258{,}474" />
                    </div>
                    <p className="text-red-400 font-semibold font-body text-sm">
                      ∴ Jadi, hasil akhirnya adalah <InlineMath math="258{,}474" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================== SUB-BAB 3: GABUNGAN ===================== */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <Calculator className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">Gabungan Penjumlahan dan Pengurangan</span>
            
          </div>

          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-cyan-500/20 rounded-xl px-5 py-6 space-y-5 animate-slide-up">

              {/* Ringkasan Intisari */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-4">
                <h3 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Ringkasan Intisari
                </h3>
                <p className="font-body text-sm text-white/90 leading-relaxed">
                  Saat soal menggabungkan penjumlahan <strong className="text-cyan-300">sekaligus</strong> pengurangan,
                  ingat aturan sederhananya: <strong className="text-yellow-300">kerjakan dari kiri ke kanan</strong>.
                  Penjumlahan dan pengurangan memiliki tingkat prioritas yang sama, jadi tidak ada yang didahulukan —
                  cukup ikuti urutan penulisannya.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-2">
                <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="font-body text-xs text-blue-200 leading-relaxed">
                  <strong>Cara Efisien:</strong> Kamu bisa juga mengumpulkan semua yang bernilai positif (+) dulu,
                  lalu kurangkan semua yang bernilai negatif (−) dari totalnya. Hasilnya akan sama!
                </p>
              </div>

              {/* CONTOH SOAL */}
              <div className="border-t border-white/10 pt-4">
                <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-400" /> Contoh Soal dan Pembahasan
                </p>

                {/* ---- MUDAH ---- */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-500/40">MUDAH</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">
                      Hitunglah <InlineMath math="18{,}6 + 7{,}45 - 9{,}3" />
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-400 tracking-wider">✦ PEMBAHASAN</p>
                    <p className="font-body text-sm text-white/80"><strong>Kerjakan dari kiri ke kanan:</strong></p>
                    <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Hitung <InlineMath math="18{,}60 + 7{,}45" /> terlebih dahulu:</p>
                    <div className="bg-black/40 rounded-xl p-3 text-center">
                      <BlockMath math="18{,}60 + 7{,}45 = 26{,}05" />
                    </div>
                    <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Lanjutkan <InlineMath math="26{,}05 - 9{,}30" />:</p>
                    <div className="bg-black/40 rounded-xl p-3 text-center">
                      <BlockMath math="26{,}05 - 9{,}30 = 16{,}75" />
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="18{,}6 + 7{,}45 - 9{,}3 = 16{,}75" />
                    </div>
                    <p className="text-green-400 font-semibold font-body text-sm">
                      ∴ Jadi, hasilnya adalah <InlineMath math="16{,}75" />
                    </p>
                  </div>
                </div>

                {/* ---- SEDANG ---- */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/40">SEDANG</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white">
                      Hitunglah <InlineMath math="45{,}72 - 18{,}5 + 9{,}384 - 6{,}2" />
                    </p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-400 tracking-wider">✦ PEMBAHASAN (Cara Efisien)</p>
                    <p className="font-body text-sm text-white/80">Kelompokkan yang positif dan negatif terpisah:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                        <p className="font-body text-xs text-green-400 mb-1">Yang dijumlahkan (+)</p>
                        <BlockMath math="45{,}720 + 9{,}384 = 55{,}104" />
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                        <p className="font-body text-xs text-red-400 mb-1">Yang dikurangkan (−)</p>
                        <BlockMath math="18{,}500 + 6{,}200 = 24{,}700" />
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/80"><strong>Hasil akhir:</strong></p>
                    <div className="bg-black/40 rounded-xl p-3 text-center">
                      <BlockMath math="55{,}104 - 24{,}700 = 30{,}404" />
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="45{,}72 - 18{,}5 + 9{,}384 - 6{,}2 = 30{,}404" />
                    </div>
                    <p className="text-yellow-400 font-semibold font-body text-sm">
                      ∴ Jadi, hasilnya adalah <InlineMath math="30{,}404" />
                    </p>
                  </div>
                </div>

                {/* ---- SULIT ---- */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 rounded-full border border-red-500/40">SULIT</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                    <p className="font-body text-sm text-white leading-relaxed">
                      Pak Budi memiliki sebidang lahan seluas <InlineMath math="1250{,}75" /> m². Ia menjual
                      <InlineMath math="375{,}5" /> m² kepada tetangganya, kemudian membeli tambahan lahan seluas
                      <InlineMath math="128{,}25" /> m². Berapa luas lahan Pak Budi sekarang?
                    </p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/25 rounded-xl p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-400 tracking-wider">✦ PEMBAHASAN</p>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 1:</strong> Susun persamaan (jual = berkurang, beli = bertambah):
                    </p>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <BlockMath math="\text{Luas} = 1250{,}75 - 375{,}5 + 128{,}25" />
                    </div>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 2:</strong> Kerjakan dari kiri: <InlineMath math="1250{,}75 - 375{,}50" />
                    </p>
                    <div className="bg-black/40 rounded-xl p-4">
                      <div className="overflow-x-auto">
                        <table className="mx-auto font-mono text-base border-separate border-spacing-0">
                          <thead>
                            <tr>
                              <td className="w-6" />
                              {["R","P","S","","p","r"].map((h,i)=> h===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold text-xs pb-1">,</td>
                                : <td key={i} className="w-9 text-center text-white/40 text-xs pb-1 font-body">{h}</td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td />
                              {["1","2","5","0","","7","5"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-white/50 text-sm">−</td>
                              {["-","3","7","5","","5","0"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : c==="-"
                                  ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                  : <td key={i} className="w-9 text-center text-white px-1">{c}</td>
                              )}
                            </tr>
                            <tr>
                              <td /><td colSpan={8}><div className="border-t-2 border-white/40 my-1.5" /></td>
                            </tr>
                            <tr>
                              <td className="text-right pr-1 text-orange-400 text-sm font-bold">=</td>
                              {["-","8","7","5","","2","5"].map((c,i)=> c===""
                                ? <td key={i} className="w-5 text-center text-yellow-400 font-bold">,</td>
                                : c==="-"
                                  ? <td key={i} className="w-9 text-center text-white/20 px-1">·</td>
                                  : <td key={i} className="w-9 text-center text-orange-400 font-bold px-1">{c}</td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="font-body text-sm text-white/80">
                      <strong>Langkah 3:</strong> Lanjutkan: <InlineMath math="875{,}25 + 128{,}25" />
                    </p>
                    <div className="bg-black/40 rounded-xl p-3 text-center">
                      <BlockMath math="875{,}25 + 128{,}25 = 1003{,}50" />
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                      <BlockMath math="1250{,}75 - 375{,}50 + 128{,}25 = 1003{,}50" />
                    </div>
                    <p className="text-red-400 font-semibold font-body text-sm">
                      ∴ Jadi, luas lahan Pak Budi sekarang adalah <InlineMath math="1003{,}5" /> m²
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">➕➖ RANGKUMAN LENGKAP</p>
            <p className="font-body text-xs text-white/80 mt-0.5">Penjumlahan &amp; Pengurangan Bentuk Desimal — Kelas 7</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-500 flex items-center justify-center text-[10px]">1</span>
                Aturan Penjumlahan &amp; Pengurangan Desimal
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "⭐ Aturan #1: SEJAJARKAN TANDA KOMA!", desc: "Ini adalah aturan paling penting! Kolom satuan sejajar, persepuluhan sejajar, perseratusan sejajar, dan seterusnya.", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
                  { label: "Tambahkan nol jika panjang desimal berbeda", desc: "5,3 + 2,45: ubah menjadi 5,30 + 2,45 agar kolom sejajar. Menambah nol di akhir tidak mengubah nilai!", color: "from-sky-900/70 to-sky-800/30 border-sky-500/50 text-sky-200" },
                  { label: "Kerjakan kolom per kolom dari kanan ke kiri", desc: "Sama seperti bilangan bulat! Mulai dari kolom paling kanan (nilai paling kecil), lalu ke kiri. Ingat simpan angka bila ≥ 10.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
                  { label: "Tanda koma di hasil sejajar dengan yang di soal", desc: "Setelah menghitung, letakkan koma tepat di bawah koma-koma yang disejajarkan di langkah pertama.", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
                ].map(({ label, desc, color }) => (
                  <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                    <div><p className="font-body text-xs font-bold">{label}</p><p className="font-body text-xs text-white/65 mt-0.5">{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">2</span>
                Tips &amp; Trik Jitu
              </p>
              <div className="space-y-2">
                {[
                  { icon: "📐", tip: "Selalu tulis dalam bentuk kolom sejajar", detail: "Menulis 3,14 + 2,5 dalam satu baris sering menyebabkan kesalahan. Tulis dalam kolom bersusun — koma di bawah koma!", color: "bg-cyan-900/30 border-cyan-500/30" },
                  { icon: "0️⃣", tip: "Tambahkan nol sebagai placeholder", detail: "3,1 − 1,25 → ubah 3,1 menjadi 3,10 dulu. Nol di akhir tidak mengubah nilai tapi membantu perhitungan!", color: "bg-sky-900/30 border-sky-500/30" },
                  { icon: "🎯", tip: "Estimasi dulu: berapa angka sebelum koma?", detail: "12,5 + 7,3 harus sekitar 19 atau 20. Jika dapatmu 192 atau 1,92 → koma di posisi yang salah!", color: "bg-blue-900/30 border-blue-500/30" },
                  { icon: "✅", tip: "Cek dengan membalik urutan (komutatif)", detail: "3,14 + 2,5 = 5,64. Cek: 2,5 + 3,14 juga harus 5,64. Untuk pengurangan, ubah ke penjumlahan: a − b + b = a.", color: "bg-indigo-900/30 border-indigo-500/30" },
                ].map(({ icon, tip, detail, color }) => (
                  <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div><p className="font-body text-xs font-bold text-white">{tip}</p><p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/20 via-sky-500/15 to-blue-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">💧</div>
              <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Penjumlahan dan pengurangan desimal sangat mirip dengan bilangan bulat — bedanya hanya pada <strong className="text-cyan-300">posisi koma yang harus disejajarkan</strong>. Ingat satu aturan emas: <strong className="text-yellow-300">koma di bawah koma, kolom per kolom, nol sebagai placeholder</strong>. Dengan disiplin dalam menyejajarkan koma, kamu tidak akan pernah salah!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {["Sejajarkan Koma!", "Tambah Nol Placeholder", "Kolom Kanan ke Kiri", "Koma Hasil Sejajar", "Estimasi Kewajaran"].map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">🚀 Lanjut ke Perkalian dan Pembagian Desimal!</p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/bilangan-rasional"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Bilangan Rasional
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjumlahanPenguranganBentukDesimalPage;
