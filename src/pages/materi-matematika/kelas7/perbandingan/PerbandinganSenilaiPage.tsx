import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import imgSenilai from "@assets/image_1775451452551.png";
import imgBangunan from "@assets/image_1775451578472.png";

const SenilaiAnimasi = () => {
  const [v1, setV1] = useState(4);
  const v2 = v1 * 5;
  const maxV2 = 50;
  const pct1 = (v1 / 10) * 100;
  const pct2 = (v2 / maxV2) * 100;

  return (
    <div className="mt-4 bg-black/30 border border-green-500/20 rounded-xl p-4 space-y-4">
      <p className="font-body text-xs font-bold text-green-300 text-center tracking-wide uppercase">
        🎮 Animasi Interaktif — Perbandingan Senilai
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-xs text-white/60">⛽ Bensin (liter)</span>
          <div className="relative w-14 h-32 bg-slate-800/60 rounded-lg border border-green-500/20 flex flex-col-reverse overflow-hidden">
            <div
              className="w-full rounded-b-lg bg-gradient-to-t from-green-600 to-green-400 transition-all duration-500 ease-in-out"
              style={{ height: `${pct1}%` }}
            />
          </div>
          <span className="font-body text-lg font-bold text-green-300 tabular-nums">{v1} L</span>
          <TrendingUp className="w-4 h-4 text-green-400" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-xs text-white/60">🚗 Jarak (km)</span>
          <div className="relative w-14 h-32 bg-slate-800/60 rounded-lg border border-green-500/20 flex flex-col-reverse overflow-hidden">
            <div
              className="w-full rounded-b-lg bg-gradient-to-t from-emerald-600 to-emerald-300 transition-all duration-500 ease-in-out"
              style={{ height: `${pct2}%` }}
            />
          </div>
          <span className="font-body text-lg font-bold text-emerald-300 tabular-nums">{v2} km</span>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      <div className="flex items-center gap-1 justify-center">
        <span className="font-body text-[10px] text-green-400 font-bold">↑↑</span>
        <span className="font-body text-[10px] text-white/50">keduanya bergerak searah</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between font-body text-[10px] text-white/40">
          <span>1 L</span>
          <span>Geser untuk mengubah bensin</span>
          <span>10 L</span>
        </div>
        <input
          type="range" min={1} max={10} value={v1}
          onChange={(e) => { playPopSound(); setV1(Number(e.target.value)); }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-green-400"
        />
      </div>

      <div className="bg-green-500/10 rounded-lg p-2 text-center">
        <span className="font-body text-xs text-white/60">Rasio tetap: </span>
        <span className="font-body text-xs font-bold text-green-300">
          {v1} : {v2} = 1 : 5 ✓
        </span>
      </div>
    </div>
  );
};

const BerbalikAnimasi = () => {
  const [v1, setV1] = useState(4);
  const produk = 60;
  const v2 = Math.round(produk / v1);
  const pct1 = (v1 / 10) * 100;
  const pct2 = (v2 / produk) * 100;

  return (
    <div className="mt-4 bg-black/30 border border-red-500/20 rounded-xl p-4 space-y-4">
      <p className="font-body text-xs font-bold text-red-300 text-center tracking-wide uppercase">
        🎮 Animasi Interaktif — Perbandingan Berbalik Nilai
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-xs text-white/60">👷 Pekerja</span>
          <div className="relative w-14 h-32 bg-slate-800/60 rounded-lg border border-red-500/20 flex flex-col-reverse overflow-hidden">
            <div
              className="w-full rounded-b-lg bg-gradient-to-t from-red-600 to-red-400 transition-all duration-500 ease-in-out"
              style={{ height: `${pct1}%` }}
            />
          </div>
          <span className="font-body text-lg font-bold text-red-300 tabular-nums">{v1} org</span>
          <TrendingUp className="w-4 h-4 text-red-400" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-xs text-white/60">📅 Hari selesai</span>
          <div className="relative w-14 h-32 bg-slate-800/60 rounded-lg border border-orange-500/20 flex flex-col-reverse overflow-hidden">
            <div
              className="w-full rounded-b-lg bg-gradient-to-t from-orange-600 to-yellow-400 transition-all duration-500 ease-in-out"
              style={{ height: `${pct2}%` }}
            />
          </div>
          <span className="font-body text-lg font-bold text-orange-300 tabular-nums">{v2} hari</span>
          <TrendingDown className="w-4 h-4 text-orange-400" />
        </div>
      </div>

      <div className="flex items-center gap-1 justify-center">
        <span className="font-body text-[10px] text-red-400 font-bold">↑↓</span>
        <span className="font-body text-[10px] text-white/50">keduanya bergerak berlawanan arah</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between font-body text-[10px] text-white/40">
          <span>1 org</span>
          <span>Geser untuk mengubah pekerja</span>
          <span>10 org</span>
        </div>
        <input
          type="range" min={1} max={10} value={v1}
          onChange={(e) => { playPopSound(); setV1(Number(e.target.value)); }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-red-400"
        />
      </div>

      <div className="bg-red-500/10 rounded-lg p-2 text-center">
        <span className="font-body text-xs text-white/60">Hasil kali tetap: </span>
        <span className="font-body text-xs font-bold text-red-300">
          {v1} × {v2} ≈ {produk} ✓
        </span>
      </div>
    </div>
  );
};

const PerbandinganSenilaiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "senilai", "berbalik", "kasus", "contoh"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERBANDINGAN SENILAI & BERBALIK NILAI
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 - Perbandingan - Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* SECTION: PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">Kunci: Bagaimana Dua Besaran Bergerak Bersama?</span>
              </div>
              {expandedSections.includes("intro") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan dua skenario berbeda. Pertama, semakin banyak bensin yang kamu isi, semakin jauh kamu bisa berkendara — keduanya naik bersama. Kedua, semakin banyak pekerja yang menggarap sawah, semakin cepat sawah itu selesai — satu naik, yang lain turun.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* SENILAI CARD */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-bold text-green-300 mb-2">↑↑ Senilai (Searah)</p>

                    {/* DEFINISI SENILAI */}
                    <div className="bg-green-500/10 border border-green-400/30 rounded-lg px-3 py-2 mb-3">
                      <p className="font-body text-xs font-semibold text-green-200 leading-relaxed">
                        <span className="text-green-400 font-bold">Perbandingan senilai</span> adalah hubungan antara dua variabel di mana jika variabel pertama bertambah, variabel kedua juga akan ikut bertambah dan jika variabel pertama berkurang, variabel kedua juga ikut berkurang secara proporsional.
                      </p>
                    </div>

                    <p className="font-body text-xs text-green-200 mb-3">Contoh: Bensin ↑ → Jarak tempuh ↑</p>
                    <div className="rounded-lg overflow-hidden border border-green-500/20">
                      <img
                        src={imgSenilai}
                        alt="Ilustrasi bensin dan jarak tempuh"
                        className="w-full h-auto object-contain"
                      />
                      <div className="px-2 py-1 bg-black/30">
                        <a
                          href="https://imgx.gridoto.com/crop/0x0:0x0/700x0/filters:watermark(file/2017/gridoto/img/watermark.png,5,5,60)/photo/gridoto/2017/10/20/292677212.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-xs text-primary/60 hover:text-primary underline underline-offset-2 break-all"
                        >
                          Sumber gambar
                        </a>
                      </div>
                    </div>
                    <SenilaiAnimasi />
                  </div>

                  {/* BERBALIK NILAI CARD */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-bold text-red-300 mb-2">↑↓ Berbalik Nilai (Berlawanan)</p>

                    {/* DEFINISI BERBALIK NILAI */}
                    <div className="bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2 mb-3">
                      <p className="font-body text-xs font-semibold text-red-200 leading-relaxed">
                        <span className="text-red-400 font-bold">Perbandingan berbalik nilai</span> adalah hubungan antara dua variabel di mana jika variabel pertama bertambah, variabel kedua justru berkurang, dan sebaliknya — hasil kali keduanya selalu tetap (konstan).
                      </p>
                    </div>

                    <p className="font-body text-xs text-red-200 mb-3">Contoh: Pekerja ↑ → Waktu selesai ↓</p>
                    <div className="rounded-lg overflow-hidden border border-red-500/20">
                      <img
                        src={imgBangunan}
                        alt="Ilustrasi pekerja bangunan"
                        className="w-full h-auto object-contain"
                      />
                      <div className="px-2 py-1 bg-black/30">
                        <a
                          href="https://www.emporioarchitect.com/img/blog/siap-membangun-rumah-ketahui-dulu-masalah-umum-dalam-proses-pembangunan-rumah-dan-solusi-mengatasinya-070222103548184287.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-xs text-primary/60 hover:text-primary underline underline-offset-2 break-all"
                        >
                          Sumber gambar
                        </a>
                      </div>
                    </div>
                    <BerbalikAnimasi />
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* SECTION: SENILAI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("senilai")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Perbandingan Senilai</span>
              </div>
              {expandedSections.includes("senilai") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("senilai") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pada perbandingan senilai, <strong className="text-primary">rasio antara dua besaran selalu konstan</strong> (tetap). Sehingga ketika salah satu berubah, yang lain berubah secara proporsional.
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-green-300">Rumus Perbandingan Senilai:</p>

                  {/* Tabel V1 V2 */}
                  <div className="overflow-x-auto">
                    <table className="w-full font-body text-sm border-collapse text-center">
                      <thead>
                        <tr className="bg-green-600/30">
                          <th className="px-4 py-2 text-green-200 border border-green-500/40 font-bold">Variabel</th>
                          <th className="px-4 py-2 text-green-200 border border-green-500/40 font-bold">
                            <InlineMath math="V_1" />
                          </th>
                          <th className="px-4 py-2 text-green-200 border border-green-500/40 font-bold">
                            <InlineMath math="V_2" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        <tr className="bg-slate-800/40">
                          <td className="px-4 py-2 border border-green-500/30 text-green-300 font-semibold">Besaran A</td>
                          <td className="px-4 py-2 border border-green-500/30 font-bold text-white">
                            <InlineMath math="a_1" />
                          </td>
                          <td className="px-4 py-2 border border-green-500/30 font-bold text-white">
                            <InlineMath math="a_2" />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border border-green-500/30 text-green-300 font-semibold">Besaran B</td>
                          <td className="px-4 py-2 border border-green-500/30 font-bold text-white">
                            <InlineMath math="b_1" />
                          </td>
                          <td className="px-4 py-2 border border-green-500/30 font-bold text-white">
                            <InlineMath math="b_2" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Kali silang visual */}
                  <div className="bg-slate-900/60 rounded-lg p-4 flex flex-col items-center gap-2">
                    <p className="font-body text-xs text-white/50 mb-1">Kali silang (cross multiplication):</p>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="font-body text-xs text-green-300">A</span>
                        <div className="flex gap-4 relative">
                          <div className="text-center">
                            <div className="bg-green-600/30 border border-green-500/50 rounded px-3 py-1">
                              <InlineMath math="a_1" />
                            </div>
                            <div className="text-[10px] text-white/40 mt-1">V₁</div>
                          </div>
                          <div className="text-center">
                            <div className="bg-green-600/30 border border-green-500/50 rounded px-3 py-1">
                              <InlineMath math="a_2" />
                            </div>
                            <div className="text-[10px] text-white/40 mt-1">V₂</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/30 text-lg font-bold select-none">
                      <span className="text-yellow-400 text-xl">✕</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex gap-4">
                          <div className="text-center">
                            <div className="bg-blue-600/30 border border-blue-500/50 rounded px-3 py-1">
                              <InlineMath math="b_1" />
                            </div>
                            <div className="text-[10px] text-white/40 mt-1">V₁</div>
                          </div>
                          <div className="text-center">
                            <div className="bg-blue-600/30 border border-blue-500/50 rounded px-3 py-1">
                              <InlineMath math="b_2" />
                            </div>
                            <div className="text-[10px] text-white/40 mt-1">V₂</div>
                          </div>
                        </div>
                        <span className="font-body text-xs text-blue-300 mt-1">B</span>
                      </div>
                    </div>
                    <div className="mt-2 w-full border-t border-white/10 pt-3 text-center">
                      <BlockMath math="a_1 \times b_2 = a_2 \times b_1" />
                    </div>
                  </div>

                  <p className="font-body text-xs text-white/60">Di mana <InlineMath math="a" /> dan <InlineMath math="b" /> adalah dua besaran yang bergerak searah (senilai).</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-body text-sm border-collapse">
                    <thead>
                      <tr className="bg-green-500/20">
                        <th className="px-3 py-2 text-green-300 text-left border border-green-500/30">Besaran A (naik ↑)</th>
                        <th className="px-3 py-2 text-green-300 text-left border border-green-500/30">Besaran B (naik ↑)</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border border-green-500/20"><td className="px-3 py-2">Jumlah barang dibeli</td><td className="px-3 py-2">Total harga</td></tr>
                      <tr className="border border-green-500/20 bg-slate-800/30"><td className="px-3 py-2">Lama bekerja (jam)</td><td className="px-3 py-2">Jumlah produk yang dibuat</td></tr>
                      <tr className="border border-green-500/20"><td className="px-3 py-2">Jumlah bahan bakar</td><td className="px-3 py-2">Jarak yang ditempuh</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: BERBALIK NILAI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("berbalik")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">Ringkasan Intisari: Perbandingan Berbalik Nilai</span>
              </div>
              {expandedSections.includes("berbalik") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("berbalik") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pada perbandingan berbalik nilai, <strong className="text-primary">hasil kali kedua besaran selalu konstan</strong>. Artinya, saat satu naik dua kali lipat, yang lain turun menjadi setengahnya.
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-red-300">Rumus Perbandingan Berbalik Nilai:</p>

                  {/* Tabel V1 V2 */}
                  <div className="overflow-x-auto">
                    <table className="w-full font-body text-sm border-collapse text-center">
                      <thead>
                        <tr className="bg-red-600/30">
                          <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold">Variabel</th>
                          <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold">
                            <InlineMath math="V_1" />
                          </th>
                          <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold">
                            <InlineMath math="V_2" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        <tr className="bg-slate-800/40">
                          <td className="px-4 py-2 border border-red-500/30 text-red-300 font-semibold">Besaran A</td>
                          <td className="px-4 py-2 border border-red-500/30 font-bold text-white">
                            <InlineMath math="a_1" />
                          </td>
                          <td className="px-4 py-2 border border-red-500/30 font-bold text-white">
                            <InlineMath math="a_2" />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border border-red-500/30 text-red-300 font-semibold">Besaran B</td>
                          <td className="px-4 py-2 border border-red-500/30 font-bold text-white">
                            <InlineMath math="b_1" />
                          </td>
                          <td className="px-4 py-2 border border-red-500/30 font-bold text-white">
                            <InlineMath math="b_2" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Kali sejajar visual */}
                  <div className="bg-slate-900/60 rounded-lg p-4 flex flex-col items-center gap-3">
                    <p className="font-body text-xs text-white/50">Kali sejajar (parallel multiplication):</p>

                    <div className="flex items-center gap-3 w-full justify-center">
                      {/* Kolom V1 */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-body text-[10px] text-white/40 font-bold tracking-widest">V₁</span>
                        <div className="bg-red-600/30 border border-red-500/50 rounded px-4 py-2 text-center">
                          <InlineMath math="a_1" />
                        </div>
                        <span className="text-yellow-400 font-bold text-lg leading-none">×</span>
                        <div className="bg-orange-600/30 border border-orange-500/50 rounded px-4 py-2 text-center">
                          <InlineMath math="b_1" />
                        </div>
                      </div>

                      {/* Tanda = */}
                      <div className="flex flex-col items-center justify-center h-full mt-4">
                        <span className="font-body text-2xl font-bold text-white/40">=</span>
                      </div>

                      {/* Kolom V2 */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-body text-[10px] text-white/40 font-bold tracking-widest">V₂</span>
                        <div className="bg-red-600/30 border border-red-500/50 rounded px-4 py-2 text-center">
                          <InlineMath math="a_2" />
                        </div>
                        <span className="text-yellow-400 font-bold text-lg leading-none">×</span>
                        <div className="bg-orange-600/30 border border-orange-500/50 rounded px-4 py-2 text-center">
                          <InlineMath math="b_2" />
                        </div>
                      </div>
                    </div>

                    <div className="w-full border-t border-white/10 pt-3 text-center">
                      <BlockMath math="a_1 \times b_1 = a_2 \times b_2" />
                    </div>
                  </div>

                  <p className="font-body text-xs text-white/60">Hasil kali besaran A dan B pada setiap kolom selalu <strong>sama (konstan)</strong>.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-body text-sm border-collapse">
                    <thead>
                      <tr className="bg-red-500/20">
                        <th className="px-3 py-2 text-red-300 text-left border border-red-500/30">Besaran A (naik ↑)</th>
                        <th className="px-3 py-2 text-red-300 text-left border border-red-500/30">Besaran B (turun ↓)</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border border-red-500/20"><td className="px-3 py-2">Jumlah pekerja</td><td className="px-3 py-2">Waktu penyelesaian proyek</td></tr>
                      <tr className="border border-red-500/20 bg-slate-800/30"><td className="px-3 py-2">Kecepatan kendaraan</td><td className="px-3 py-2">Waktu tempuh perjalanan</td></tr>
                      <tr className="border border-red-500/20"><td className="px-3 py-2">Jumlah hewan ternak</td><td className="px-3 py-2">Durasi persediaan pakan</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: KASUS KHUSUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kasus")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">Kasus Khusus: Proyek yang Terhenti</span>
              </div>
              {expandedSections.includes("kasus") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("kasus") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Soal tingkat lanjut sering menggabungkan berbalik nilai dengan konsep <strong className="text-orange-300">sisa pekerjaan</strong>. Strategi penyelesaiannya adalah menghitung "satuan kerja" total lalu menggunakan sisanya.
                </p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">Langkah Strategis:</p>
                  <div className="font-body text-sm text-white/80 space-y-1">
                    <p><strong className="text-orange-300">①</strong> Hitung <strong>total beban kerja</strong> = jumlah pekerja awal × total hari rencana</p>
                    <p><strong className="text-orange-300">②</strong> Hitung <strong>pekerjaan yang sudah selesai</strong> = pekerja awal × hari yang sudah berjalan</p>
                    <p><strong className="text-orange-300">③</strong> Cari <strong>sisa beban kerja</strong> = total − yang sudah selesai</p>
                    <p><strong className="text-orange-300">④</strong> Hitung <strong>sisa waktu tersedia</strong> = total hari − hari sudah berjalan − hari libur</p>
                    <p><strong className="text-orange-300">⑤</strong> Pekerja yang dibutuhkan = sisa beban ÷ sisa waktu</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white/60 text-xs">Contoh singkat: Proyek 20 hari oleh 15 pekerja. Setelah 8 hari, libur 4 hari. Berapa tambahan pekerja?</p>
                  <div className="mt-2 space-y-1 font-body text-sm text-white/80">
                    <p>Total beban = <InlineMath math="20 \times 15 = 300" /> satuan</p>
                    <p>Selesai = <InlineMath math="8 \times 15 = 120" /> satuan → Sisa = <InlineMath math="300 - 120 = 180" /></p>
                    <p>Sisa waktu = <InlineMath math="20 - 8 - 4 = 8" /> hari</p>
                    <p>Pekerja dibutuhkan = <InlineMath math="180 \div 8 = 22{,}5 \approx 23" /> orang</p>
                    <p className="text-orange-300 font-semibold">Tambahan = <InlineMath math="23 - 15 = 8" /> orang</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">Contoh Soal dan Pembahasan</span>
              </div>
              {expandedSections.includes("contoh") ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1 – Senilai: Harga Buah</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Harga 5 buah mangga adalah Rp20.000. Berapakah harga 8 buah mangga?
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Analisis:</strong> Makin banyak mangga → harga makin mahal. Ini adalah perbandingan <strong className="text-green-400">senilai</strong>.</p>
                      <p>Diketahui: <InlineMath math="a_1 = 5" /> buah, <InlineMath math="b_1 = 20.000" />, <InlineMath math="a_2 = 8" /> buah, <InlineMath math="b_2 = x" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{5}{8} = \frac{20.000}{x}" />
                        <BlockMath math="\Rightarrow 5x = 8 \times 20.000 = 160.000" />
                        <BlockMath math="x = \frac{160.000}{5} = 32.000" />
                      </div>
                      <p className="text-primary font-semibold">Harga 8 buah mangga = <strong>Rp32.000</strong></p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 – Berbalik Nilai: Pakan Ternak</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Persediaan pakan cukup untuk 20 ekor sapi selama 18 hari. Jika peternak membeli 10 ekor sapi lagi, berapa hari persediaan pakan akan habis?
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Analisis:</strong> Sapi bertambah → pakan lebih cepat habis → hari berkurang. Ini <strong className="text-yellow-400">berbalik nilai</strong>.</p>
                      <p><strong>Perhatikan:</strong> Total sapi sekarang = <InlineMath math="20 + 10 = 30" /> ekor.</p>
                      <p>Diketahui: <InlineMath math="a_1 = 20" />, <InlineMath math="b_1 = 18" />, <InlineMath math="a_2 = 30" />, <InlineMath math="b_2 = x" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="a_1 \times b_1 = a_2 \times b_2" />
                        <BlockMath math="20 \times 18 = 30 \times x \Rightarrow 360 = 30x" />
                        <BlockMath math="x = \frac{360}{30} = 12 \text{ hari}" />
                      </div>
                      <p className="text-primary font-semibold">Persediaan pakan akan habis dalam <strong>12 hari</strong>.</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3 – Berbalik Nilai: Proyek Terhenti</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Sebuah jembatan direncanakan selesai dalam 30 hari oleh 20 pekerja. Setelah 12 hari berjalan, proyek libur selama 3 hari karena cuaca buruk. Agar proyek selesai tepat waktu, berapa tambahan pekerja yang harus direkrut?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p><strong>① Total beban kerja:</strong> <InlineMath math="30 \times 20 = 600" /> satuan kerja</p>
                        <p><strong>② Pekerjaan selesai:</strong> <InlineMath math="12 \times 20 = 240" /> satuan kerja</p>
                        <p><strong>③ Sisa beban:</strong> <InlineMath math="600 - 240 = 360" /> satuan kerja</p>
                        <p><strong>④ Sisa waktu:</strong> <InlineMath math="30 - 12 - 3 = 15" /> hari</p>
                        <p><strong>⑤ Pekerja dibutuhkan:</strong> <InlineMath math="360 \div 15 = 24" /> orang</p>
                      </div>
                      <p className="text-primary font-semibold">Tambahan pekerja = <InlineMath math="24 - 20 = 4" /> orang</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/perbandingan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Perbandingan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerbandinganSenilaiPage;
