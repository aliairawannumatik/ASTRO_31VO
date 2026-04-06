import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const BentukUmumKarakteristikPage = () => {
  const navigate = useNavigate();
  const allSections = ["intro", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor: string; title: React.ReactNode;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expandedSections.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const DiffBadge = ({ level }: { level: "MUDAH" | "SEDANG" | "SULIT" }) => {
    const map = {
      MUDAH: "bg-green-500/20 text-green-400 border border-green-500",
      SEDANG: "bg-yellow-500/20 text-yellow-400 border border-yellow-500",
      SULIT: "bg-red-500/20 text-red-400 border border-red-500",
    };
    const bar = { MUDAH: "border-green-500", SEDANG: "border-yellow-500", SULIT: "border-red-500" };
    return { badge: map[level], bar: bar[level] };
  };

  const ExampleBlock = ({ level, no, soal, pembahasan }: {
    level: "MUDAH" | "SEDANG" | "SULIT"; no: number;
    soal: React.ReactNode; pembahasan: React.ReactNode;
  }) => {
    const { badge, bar } = DiffBadge({ level });
    const bg = level === "MUDAH" ? "rgba(34,197,94,0.04)" : level === "SEDANG" ? "rgba(234,179,8,0.04)" : "rgba(239,68,68,0.04)";
    const pColor = level === "MUDAH" ? "text-green-400" : level === "SEDANG" ? "text-yellow-400" : "text-red-400";
    return (
      <div className={`border-l-4 ${bar} pl-4 space-y-3`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${badge}`}>{level}</span>
          <span className="font-body font-semibold text-white">Contoh {no}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 font-body text-sm text-white/90">{soal}</div>
        <div className="rounded-lg p-4" style={{ background: bg, border: `1px solid ${level === "MUDAH" ? "rgba(34,197,94,0.2)" : level === "SEDANG" ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)"}` }}>
          <p className={`font-body text-xs font-semibold mb-3 ${pColor}`}>📋 PEMBAHASAN:</p>
          <div className="space-y-2 font-body text-sm text-white/80">{pembahasan}</div>
        </div>
      </div>
    );
  };

  const Box = ({ color, children }: { color: string; children: React.ReactNode }) => {
    const map: Record<string, string> = {
      cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-100",
      green: "bg-green-500/10 border-green-500/30 text-green-100",
      yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-100",
      purple: "bg-purple-500/10 border-purple-500/30 text-purple-100",
      orange: "bg-orange-500/10 border-orange-500/30 text-orange-100",
      blue: "bg-blue-500/10 border-blue-500/30 text-blue-100",
      pink: "bg-pink-500/10 border-pink-500/30 text-pink-100",
      red: "bg-red-500/10 border-red-500/30 text-red-100",
      slate: "bg-slate-900/60 border-slate-700/40 text-white/80",
    };
    return <div className={`border rounded-xl p-4 ${map[color] || map.slate}`}>{children}</div>;
  };

  const Dark = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-slate-900/70 rounded-lg p-3 my-2">{children}</div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          BENTUK UMUM & KARAKTERISTIK GRAFIK
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Fungsi Kuadrat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title="🚀 Fungsi Kuadrat — Si Parabola Luar Angkasa!" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Pernah lihat lintasan bola yang dilempar ke udara? Atau bentuk jembatan gantung yang melengkung indah?
                    Semua itu adalah contoh nyata dari <strong>fungsi kuadrat</strong> — sebuah fungsi yang menghasilkan kurva mulus bernama <strong>parabola</strong> 🌙.
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Berbeda dengan persamaan kuadrat yang kita cari solusinya (titik potong sumbu-x), fungsi kuadrat
                  menggambarkan <strong>hubungan antara input dan output</strong> secara keseluruhan — menghasilkan sebuah kurva yang bisa kita pelajari bentuk dan sifatnya.
                </p>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Perbedaan Kunci:</strong> Persamaan kuadrat → mencari nilai <InlineMath math="x" /> saat <InlineMath math="y = 0" />.
                  Fungsi kuadrat → memetakan setiap nilai <InlineMath math="x" /> ke nilai <InlineMath math="y" /> tertentu.</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title="📘 Bentuk Umum & Karakteristik Grafik" />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm mb-2">Bentuk umum fungsi kuadrat adalah:</p>
                  <Dark><BlockMath math="f(x) = ax^2 + bx + c, \quad a \neq 0" /></Dark>
                  <p className="font-body text-xs text-purple-200">di mana <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /> adalah konstanta real dan <InlineMath math="a \neq 0" />.</p>
                </Box>

                <p className="font-body text-sm text-white/80 font-semibold">⭐ Karakteristik Berdasarkan Nilai <InlineMath math="a" />:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-2">📈 Jika <InlineMath math="a > 0" /></p>
                    <div className="flex justify-center my-2">
                      <svg viewBox="0 0 120 80" className="w-28 h-20">
                        <defs>
                          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8"/>
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8"/>
                          </linearGradient>
                        </defs>
                        <line x1="10" y1="60" x2="110" y2="60" stroke="#ffffff30" strokeWidth="1"/>
                        <line x1="60" y1="5" x2="60" y2="75" stroke="#ffffff30" strokeWidth="1"/>
                        <path d="M 15 65 Q 60 10 105 65" stroke="url(#grad1)" strokeWidth="2.5" fill="none"/>
                        <text x="60" y="78" textAnchor="middle" fontSize="7" fill="#4ade80">Terbuka ke Atas ↑</text>
                      </svg>
                    </div>
                    <p className="font-body text-xs text-white/70">Parabola terbuka ke <strong>atas</strong>. Titik puncak adalah nilai <strong>minimum</strong>.</p>
                  </Box>
                  <Box color="red">
                    <p className="font-body text-xs font-bold text-red-300 mb-2">📉 Jika <InlineMath math="a < 0" /></p>
                    <div className="flex justify-center my-2">
                      <svg viewBox="0 0 120 80" className="w-28 h-20">
                        <defs>
                          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f87171" stopOpacity="0.8"/>
                            <stop offset="100%" stopColor="#fb923c" stopOpacity="0.8"/>
                          </linearGradient>
                        </defs>
                        <line x1="10" y1="20" x2="110" y2="20" stroke="#ffffff30" strokeWidth="1"/>
                        <line x1="60" y1="5" x2="60" y2="75" stroke="#ffffff30" strokeWidth="1"/>
                        <path d="M 15 15 Q 60 70 105 15" stroke="url(#grad2)" strokeWidth="2.5" fill="none"/>
                        <text x="60" y="78" textAnchor="middle" fontSize="7" fill="#f87171">Terbuka ke Bawah ↓</text>
                      </svg>
                    </div>
                    <p className="font-body text-xs text-white/70">Parabola terbuka ke <strong>bawah</strong>. Titik puncak adalah nilai <strong>maksimum</strong>.</p>
                  </Box>
                </div>

                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">📊 PENGARUH KOEFISIEN TERHADAP GRAFIK:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 pr-3 text-cyan-300">Koefisien</th>
                          <th className="text-left py-2 pr-3 text-yellow-300">Pengaruh pada Grafik</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 pr-3 font-bold"><InlineMath math="|a|" /> besar</td>
                          <td className="py-2">Parabola lebih <strong>sempit/lancip</strong></td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 pr-3 font-bold"><InlineMath math="|a|" /> kecil</td>
                          <td className="py-2">Parabola lebih <strong>lebar/landai</strong></td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 pr-3 font-bold"><InlineMath math="c" /></td>
                          <td className="py-2">Titik potong grafik dengan <strong>sumbu-y</strong> di <InlineMath math="(0, c)" /></td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-3 font-bold"><InlineMath math="b" /></td>
                          <td className="py-2">Mempengaruhi posisi <strong>sumbu simetri</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Box>

                <Box color="orange">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">🔑 Sifat-Sifat Penting Parabola</p>
                  <ul className="space-y-1 font-body text-xs text-white/80 list-none">
                    <li>🪐 <strong>Simetris</strong> terhadap garis vertikal yang disebut sumbu simetri</li>
                    <li>🌟 Punya satu titik <strong>ekstrem</strong> (puncak/minimum atau maksimum)</li>
                    <li>🚀 Domain fungsi: semua bilangan real <InlineMath math="(\mathbb{R})" /></li>
                    <li>🌙 Range tergantung pada nilai <InlineMath math="a" /> dan titik puncak</li>
                  </ul>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title="📝 Contoh Soal — Bentuk Umum & Karakteristik" />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Identifikasi nilai <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /> dari fungsi <InlineMath math="f(x) = 3x^2 - 4x + 7" />, lalu tentukan arah bukaan parabolanya.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Bandingkan dengan bentuk umum <InlineMath math="ax^2 + bx + c" />:</p>
                    <Dark><BlockMath math="a = 3,\quad b = -4,\quad c = 7" /></Dark>
                    <p><strong>Langkah 2:</strong> Karena <InlineMath math="a = 3 > 0" />, parabola <strong>terbuka ke atas</strong> ☝️</p>
                    <p>✅ Titik puncaknya adalah nilai <strong>minimum</strong> fungsi.</p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Diketahui <InlineMath math="f(x) = -2x^2 + x - 5" />. Tentukan: (a) nilai <InlineMath math="a, b, c" />, (b) arah bukaan parabola, (c) nilai <InlineMath math="f(0)" />.</>}
                  pembahasan={<>
                    <p><strong>(a)</strong> <InlineMath math="a = -2,\; b = 1,\; c = -5" /></p>
                    <p><strong>(b)</strong> <InlineMath math="a = -2 < 0" /> → parabola <strong>terbuka ke bawah</strong> 👇 (punya nilai maksimum)</p>
                    <p><strong>(c)</strong> <InlineMath math="f(0) = -2(0)^2 + 1(0) - 5" /></p>
                    <Dark><BlockMath math="f(0) = -5" /></Dark>
                    <p>✅ Titik potong dengan sumbu-y adalah <InlineMath math="(0, -5)" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Fungsi <InlineMath math="g(x) = (x - 3)(2x + 1)" />. Ubah ke bentuk umum dan identifikasi karakteristiknya.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Kalikan dua faktor (distribusi):</p>
                    <Dark><BlockMath math="g(x) = 2x^2 + x - 6x - 3" /></Dark>
                    <Dark><BlockMath math="g(x) = 2x^2 - 5x - 3" /></Dark>
                    <p><strong>Langkah 2:</strong> Identifikasi: <InlineMath math="a = 2,\; b = -5,\; c = -3" /></p>
                    <p><strong>Langkah 3:</strong> <InlineMath math="a = 2 > 0" /> → parabola <strong>terbuka ke atas</strong>, nilai minimum ada.</p>
                    <p>✅ Titik potong sumbu-y: <InlineMath math="g(0) = -3" />, yaitu <InlineMath math="(0,-3)" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Dua fungsi: <InlineMath math="f(x) = \frac{1}{2}x^2 + 3" /> dan <InlineMath math="g(x) = 4x^2 + 3" />. Keduanya memiliki <InlineMath math="c = 3" /> yang sama. Jelaskan perbedaan bentuk grafik keduanya.</>}
                  pembahasan={<>
                    <p>Kedua fungsi sama-sama terbuka ke atas (<InlineMath math="a > 0" />) dan memotong sumbu-y di <InlineMath math="(0, 3)" />.</p>
                    <p><strong>Perbedaannya pada nilai <InlineMath math="|a|" />:</strong></p>
                    <Dark>
                      <p className="text-sm text-white/80">• <InlineMath math="f(x)" />: <InlineMath math="a = \frac{1}{2}" /> → parabola <strong>lebar/landai</strong></p>
                      <p className="text-sm text-white/80 mt-1">• <InlineMath math="g(x)" />: <InlineMath math="a = 4" /> → parabola <strong>sempit/lancip</strong></p>
                    </Dark>
                    <p>✅ Semakin besar <InlineMath math="|a|" />, semakin lancip/sempit parabolanya.</p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Fungsi <InlineMath math="h(x) = (k-1)x^2 - 2kx + 4" />. Tentukan nilai <InlineMath math="k" /> agar grafik <InlineMath math="h" /> merupakan parabola yang terbuka ke bawah.</>}
                  pembahasan={<>
                    <p>Agar merupakan <strong>fungsi kuadrat</strong> dengan parabola terbuka ke bawah, syaratnya:</p>
                    <Dark><BlockMath math="a < 0 \quad \text{dan} \quad a \neq 0" /></Dark>
                    <p>Di sini <InlineMath math="a = k - 1" />, maka:</p>
                    <Dark><BlockMath math="k - 1 < 0 \implies k < 1" /></Dark>
                    <p>Dan syarat fungsi kuadrat: <InlineMath math="k - 1 \neq 0 \implies k \neq 1" /> (sudah terpenuhi karena <InlineMath math="k < 1" />)</p>
                    <p>✅ Nilai <InlineMath math="k" /> yang memenuhi: <InlineMath math="k < 1" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Diketahui <InlineMath math="f(x) = -x^2 + 4x + 5" /> dan <InlineMath math="g(x) = x^2 - 4x - 5" />. Jelaskan hubungan geometri antara kedua grafik tersebut tanpa menghitung titik puncaknya.</>}
                  pembahasan={<>
                    <p>Perhatikan: <InlineMath math="g(x) = -(- x^2 + 4x + 5) = -f(x)" /></p>
                    <Dark><BlockMath math="g(x) = -f(x)" /></Dark>
                    <p><strong>Interpretasi geometri:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-white/80">
                      <li>Grafik <InlineMath math="g" /> adalah <strong>pencerminan grafik <InlineMath math="f" /> terhadap sumbu-x</strong></li>
                      <li><InlineMath math="f(x)" />: <InlineMath math="a = -1 < 0" /> → terbuka ke <strong>bawah</strong></li>
                      <li><InlineMath math="g(x)" />: <InlineMath math="a = 1 > 0" /> → terbuka ke <strong>atas</strong></li>
                    </ul>
                    <p>✅ Kedua parabola identik tetapi saling berkebalikan arah (simetri terhadap sumbu-x).</p>
                  </>}
                />

              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/fungsi-kuadrat"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body flex items-center gap-2 mx-auto">
              <Star className="w-4 h-4" /> Kembali ke Fungsi Kuadrat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentukUmumKarakteristikPage;
