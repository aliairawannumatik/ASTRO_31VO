import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MenggambarGrafikPage = () => {
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
      <ChevronUp className="w-5 h-5 text-primary" />
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
          MENGGAMBAR GRAFIK FUNGSI KUADRAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Fungsi Kuadrat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title="🎨 Melukis Parabola Langkah demi Langkah!" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Menggambar grafik fungsi kuadrat bukan sekadar menghubungkan titik-titik sembarangan.
                    Ada <strong>urutan langkah sistematis</strong> yang membuat hasilnya akurat dan indah — seperti melukis dengan panduan bintang di langit malam 🌌.
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dengan menemukan titik-titik kunci (titik potong sumbu, titik puncak, dan beberapa titik bantu),
                  kamu bisa menggambar parabola yang sempurna tanpa perlu menghitung puluhan titik!
                </p>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Kunci Sukses:</strong> Selalu cek tanda nilai <InlineMath math="a" /> dulu untuk tahu arah bukaan parabola sebelum menggambar!</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title="📘 Langkah-Langkah Menggambar Grafik" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">🎯 Ringkasan Intisari — 5 Langkah Utama</p>
                  <div className="space-y-2">
                    {[
                      { step: "1", color: "text-cyan-300", label: "Tentukan arah bukaan", desc: "Cek tanda a: positif → ke atas, negatif → ke bawah" },
                      { step: "2", color: "text-green-300", label: "Titik potong sumbu-y", desc: "Substitusikan x = 0 → titik (0, c)" },
                      { step: "3", color: "text-yellow-300", label: "Titik potong sumbu-x", desc: "Selesaikan f(x) = 0 (jika ada)" },
                      { step: "4", color: "text-orange-300", label: "Titik puncak (vertex)", desc: "Hitung xp = -b/2a, lalu yp = f(xp)" },
                      { step: "5", color: "text-pink-300", label: "Titik bantu tambahan", desc: "Pilih 2–4 nilai x lain, hitung f(x)-nya" },
                    ].map(({ step, color, label, desc }) => (
                      <div key={step} className="flex gap-3 items-start">
                        <span className={`font-bold text-lg ${color} shrink-0 w-5`}>{step}.</span>
                        <div>
                          <p className={`font-body text-xs font-semibold ${color}`}>{label}</p>
                          <p className="font-body text-xs text-white/60">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>

                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">📋 CONTOH TABEL NILAI — <InlineMath math="f(x) = x^2 - 2x - 3" /></p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse text-center">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="py-2 px-3 text-cyan-300"><InlineMath math="x" /></th>
                          <th className="py-2 px-3 text-white/60">-2</th>
                          <th className="py-2 px-3 text-white/60">-1</th>
                          <th className="py-2 px-3 text-yellow-300 font-bold">0</th>
                          <th className="py-2 px-3 text-yellow-300 font-bold">1</th>
                          <th className="py-2 px-3 text-yellow-300 font-bold">2</th>
                          <th className="py-2 px-3 text-white/60">3</th>
                          <th className="py-2 px-3 text-white/60">4</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-white/80">
                          <td className="py-2 px-3 text-cyan-300 font-semibold"><InlineMath math="f(x)" /></td>
                          <td className="py-2 px-3">5</td>
                          <td className="py-2 px-3">0</td>
                          <td className="py-2 px-3 text-green-300 font-bold">-3</td>
                          <td className="py-2 px-3 text-orange-300 font-bold">-4</td>
                          <td className="py-2 px-3 text-orange-300 font-bold">-3</td>
                          <td className="py-2 px-3">0</td>
                          <td className="py-2 px-3">5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="font-body text-xs text-slate-400 mt-2">
                    🟡 Titik puncak: <InlineMath math="(1, -4)" /> | 🟢 Sumbu-y: <InlineMath math="(0,-3)" /> | Sumbu-x: <InlineMath math="(-1,0)" /> dan <InlineMath math="(3,0)" />
                  </p>
                </Box>

                <Box color="orange">
                  <p className="font-body text-sm"><strong>⚠️ Tips Gambar:</strong> Selalu sertakan <strong>sumbu simetri</strong> sebagai garis putus-putus vertikal melewati titik puncak. Ini membantu menunjukkan sifat simetri parabola!</p>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title="📝 Contoh Soal — Menggambar Grafik" />
            {true && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Tentukan semua titik kunci dan arah grafik <InlineMath math="f(x) = x^2 - 4" /> untuk keperluan menggambar.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1 — Arah bukaan:</strong> <InlineMath math="a = 1 > 0" /> → terbuka ke <strong>atas</strong> ☝️</p>
                    <p><strong>Langkah 2 — Titik potong sumbu-y:</strong> <InlineMath math="f(0) = -4" /> → <InlineMath math="(0, -4)" /></p>
                    <p><strong>Langkah 3 — Titik potong sumbu-x</strong> (<InlineMath math="f(x) = 0" />):</p>
                    <Dark><BlockMath math="x^2 = 4 \implies x = \pm 2 \implies (-2,0) \text{ dan } (2,0)" /></Dark>
                    <p><strong>Langkah 4 — Titik puncak:</strong> <InlineMath math="x_p = 0" />, <InlineMath math="f(0) = -4" /> → <InlineMath math="(0, -4)" /></p>
                    <p>✅ Grafik berbentuk "U", puncak minimum di <InlineMath math="(0, -4)" /></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Buatlah tabel nilai untuk <InlineMath math="f(x) = -x^2 + 2x + 3" /> dengan <InlineMath math="x \in \{-1, 0, 1, 2, 3\}" /> dan tentukan titik kuncinya.</>}
                  pembahasan={<>
                    <p><strong>Hitung nilai f(x):</strong></p>
                    <Dark>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-center">
                          <thead><tr className="border-b border-slate-600"><th className="py-1 px-2 text-cyan-300">x</th><th className="px-2">-1</th><th className="px-2">0</th><th className="px-2 text-yellow-300">1</th><th className="px-2">2</th><th className="px-2">3</th></tr></thead>
                          <tbody><tr className="text-white/80"><td className="py-1 px-2 text-cyan-300">f(x)</td><td className="px-2">0</td><td className="px-2">3</td><td className="px-2 text-yellow-300 font-bold">4</td><td className="px-2">3</td><td className="px-2">0</td></tr></tbody>
                        </table>
                      </div>
                    </Dark>
                    <p>✅ Puncak maksimum di <InlineMath math="(1, 4)" />. Memotong sumbu-x di <InlineMath math="(-1, 0)" /> dan <InlineMath math="(3, 0)" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Gambarkan (secara deskriptif) grafik <InlineMath math="f(x) = x^2 - 2x - 8" />. Sebutkan semua titik penting.</>}
                  pembahasan={<>
                    <p><strong>Arah bukaan:</strong> <InlineMath math="a = 1 > 0" /> → ke atas.</p>
                    <p><strong>Titik potong sumbu-y:</strong> <InlineMath math="f(0) = -8" /> → <InlineMath math="(0,-8)" /></p>
                    <p><strong>Titik puncak:</strong></p>
                    <Dark><BlockMath math="x_p = -\frac{-2}{2} = 1,\quad f(1) = 1 - 2 - 8 = -9" /></Dark>
                    <p>Puncak minimum: <InlineMath math="(1, -9)" /></p>
                    <p><strong>Titik potong sumbu-x</strong> (<InlineMath math="f(x) = 0" />):</p>
                    <Dark><BlockMath math="x^2 - 2x - 8 = (x-4)(x+2) = 0 \implies x = 4 \text{ atau } x = -2" /></Dark>
                    <p>✅ Titik-titik kunci: <InlineMath math="(-2,0)" />, <InlineMath math="(0,-8)" />, <InlineMath math="(1,-9)" />, <InlineMath math="(4,0)" />. Sumbu simetri: <InlineMath math="x = 1" />.</p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Grafik <InlineMath math="f(x) = 2x^2 - 4x + 5" /> tidak memotong sumbu-x. Tentukan semua titik kunci dan jelaskan posisi grafik terhadap sumbu-x.</>}
                  pembahasan={<>
                    <p><strong>Diskriminan:</strong> <InlineMath math="D = 16 - 40 = -24 < 0" /> → tidak memotong sumbu-x ✓</p>
                    <p><strong>Arah bukaan:</strong> <InlineMath math="a = 2 > 0" /> → ke atas → nilai minimum ada.</p>
                    <p><strong>Titik puncak:</strong></p>
                    <Dark><BlockMath math="x_p = 1,\quad f(1) = 2 - 4 + 5 = 3" /></Dark>
                    <p><strong>Titik potong sumbu-y:</strong> <InlineMath math="f(0) = 5" /> → <InlineMath math="(0, 5)" /></p>
                    <p>✅ Seluruh grafik berada <strong>di atas sumbu-x</strong> (<InlineMath math="f(x) > 0" /> untuk semua <InlineMath math="x" />), dengan titik terendah di <InlineMath math="(1, 3)" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Sketsa grafik <InlineMath math="f(x) = -2x^2 + 8x - 6" />. Tentukan: titik potong kedua sumbu, titik puncak, sumbu simetri, dan interval di mana <InlineMath math="f(x) \geq 0" />.</>}
                  pembahasan={<>
                    <p><strong>Titik potong sumbu-y:</strong> <InlineMath math="f(0) = -6" /> → <InlineMath math="(0,-6)" /></p>
                    <p><strong>Titik potong sumbu-x</strong> (<InlineMath math="f(x) = 0" />):</p>
                    <Dark><BlockMath math="-2x^2 + 8x - 6 = 0 \implies x^2 - 4x + 3 = 0 \implies (x-1)(x-3) = 0" /></Dark>
                    <p>Titik potong: <InlineMath math="(1, 0)" /> dan <InlineMath math="(3, 0)" /></p>
                    <p><strong>Titik puncak:</strong> <InlineMath math="x_p = 2" />, <InlineMath math="f(2) = -8 + 16 - 6 = 2" /> → <InlineMath math="(2, 2)" /> (maksimum)</p>
                    <p><strong>Sumbu simetri:</strong> <InlineMath math="x = 2" /></p>
                    <p>✅ <InlineMath math="f(x) \geq 0" /> pada interval <InlineMath math="1 \leq x \leq 3" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Dua parabola: <InlineMath math="f(x) = x^2 - 4x + 3" /> dan <InlineMath math="g(x) = -x^2 + 2x + 3" />. Tentukan titik-titik potong antara kedua grafik tersebut.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Dua grafik berpotongan saat <InlineMath math="f(x) = g(x)" />:</p>
                    <Dark><BlockMath math="x^2 - 4x + 3 = -x^2 + 2x + 3" /></Dark>
                    <Dark><BlockMath math="2x^2 - 6x = 0 \implies 2x(x - 3) = 0" /></Dark>
                    <p><InlineMath math="x = 0" /> atau <InlineMath math="x = 3" /></p>
                    <p><strong>Langkah 2:</strong> Hitung nilai y:</p>
                    <Dark>
                      <p className="text-sm"><InlineMath math="x = 0" />: <InlineMath math="f(0) = 3" /> → titik <InlineMath math="(0, 3)" /></p>
                      <p className="text-sm mt-1"><InlineMath math="x = 3" />: <InlineMath math="f(3) = 9-12+3 = 0" /> → titik <InlineMath math="(3, 0)" /></p>
                    </Dark>
                    <p>✅ Kedua grafik berpotongan di <InlineMath math="(0, 3)" /> dan <InlineMath math="(3, 0)" /></p>
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

export default MenggambarGrafikPage;
