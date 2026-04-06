import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MenyusunFungsiPage = () => {
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
          MENYUSUN FUNGSI KUADRAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Fungsi Kuadrat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title="🔧 Merancang Parabola Sendiri!" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Menyusun fungsi kuadrat adalah kebalikan dari menganalisis grafik — kita punya <strong>informasi tentang grafik</strong>,
                    lalu kita tentukan <strong>rumus fungsinya</strong>. Ibarat seorang arsitek yang merancang jembatan dari spesifikasi yang diberikan 🌉.
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Ada tiga cara utama menyusun fungsi kuadrat, tergantung informasi yang diberikan:
                  berdasarkan <strong>titik potong sumbu-x</strong>, berdasarkan <strong>titik puncak</strong>,
                  atau berdasarkan <strong>tiga titik sembarang</strong> yang dilalui grafik.
                </p>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Kunci:</strong> Selalu ada konstanta bebas (biasanya dilambangkan <InlineMath math="a" />) yang ditentukan menggunakan titik tambahan yang diketahui!</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title="📘 Tiga Cara Menyusun Fungsi Kuadrat" />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">🎯 Ringkasan Intisari</p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-xs font-bold text-green-300 mb-1">📌 Cara 1 — Diketahui Akar-Akar (<InlineMath math="x_1" /> dan <InlineMath math="x_2" />)</p>
                      <Dark><BlockMath math="f(x) = a(x - x_1)(x - x_2)" /></Dark>
                      <p className="font-body text-xs text-white/60">Nilai <InlineMath math="a" /> ditentukan menggunakan satu titik lain yang dilalui grafik.</p>
                    </div>
                    <div>
                      <p className="font-body text-xs font-bold text-cyan-300 mb-1">📌 Cara 2 — Diketahui Titik Puncak (<InlineMath math="h, k" />)</p>
                      <Dark><BlockMath math="f(x) = a(x - h)^2 + k" /></Dark>
                      <p className="font-body text-xs text-white/60">Nilai <InlineMath math="a" /> ditentukan menggunakan satu titik lain yang dilalui grafik.</p>
                    </div>
                    <div>
                      <p className="font-body text-xs font-bold text-orange-300 mb-1">📌 Cara 3 — Diketahui Tiga Titik Sembarang</p>
                      <Dark><BlockMath math="f(x) = ax^2 + bx + c" /></Dark>
                      <p className="font-body text-xs text-white/60">Substitusikan ketiga titik → sistem persamaan linear 3 variabel untuk mencari <InlineMath math="a, b, c" />.</p>
                    </div>
                  </div>
                </Box>

                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">📊 PANDUAN MEMILIH CARA:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 pr-3 text-cyan-300">Informasi yang Diketahui</th>
                          <th className="text-left py-2 text-yellow-300">Gunakan Cara</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-slate-700/50"><td className="py-2 pr-3">Dua akar + satu titik</td><td className="py-2 text-green-300 font-bold">Cara 1</td></tr>
                        <tr className="border-b border-slate-700/50"><td className="py-2 pr-3">Titik puncak + satu titik</td><td className="py-2 text-cyan-300 font-bold">Cara 2</td></tr>
                        <tr className="border-b border-slate-700/50"><td className="py-2 pr-3">Sumbu simetri + dua titik</td><td className="py-2 text-cyan-300 font-bold">Cara 2</td></tr>
                        <tr><td className="py-2 pr-3">Tiga titik sembarang</td><td className="py-2 text-orange-300 font-bold">Cara 3</td></tr>
                      </tbody>
                    </table>
                  </div>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title="📝 Contoh Soal — Menyusun Fungsi Kuadrat" />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Tentukan fungsi kuadrat yang memiliki akar-akar <InlineMath math="x_1 = 1" /> dan <InlineMath math="x_2 = 5" />, dan melalui titik <InlineMath math="(0, 5)" />.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Gunakan bentuk dari akar-akar:</p>
                    <Dark><BlockMath math="f(x) = a(x - 1)(x - 5)" /></Dark>
                    <p><strong>Langkah 2:</strong> Substitusi titik <InlineMath math="(0, 5)" />:</p>
                    <Dark><BlockMath math="5 = a(0-1)(0-5) = a(-1)(-5) = 5a \implies a = 1" /></Dark>
                    <p><strong>Langkah 3:</strong> Ekspansikan:</p>
                    <Dark><BlockMath math="f(x) = (x-1)(x-5) = x^2 - 6x + 5" /></Dark>
                    <p>✅ <InlineMath math="f(x) = x^2 - 6x + 5" /></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Susun fungsi kuadrat yang titik puncaknya <InlineMath math="(3, -4)" /> dan melalui titik <InlineMath math="(5, 0)" />.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Gunakan bentuk vertex dengan <InlineMath math="h = 3,\; k = -4" />:</p>
                    <Dark><BlockMath math="f(x) = a(x - 3)^2 - 4" /></Dark>
                    <p><strong>Langkah 2:</strong> Substitusi titik <InlineMath math="(5, 0)" />:</p>
                    <Dark><BlockMath math="0 = a(5-3)^2 - 4 = 4a - 4 \implies a = 1" /></Dark>
                    <p><strong>Langkah 3:</strong> Ekspansikan:</p>
                    <Dark><BlockMath math="f(x) = (x-3)^2 - 4 = x^2 - 6x + 9 - 4 = x^2 - 6x + 5" /></Dark>
                    <p>✅ <InlineMath math="f(x) = x^2 - 6x + 5" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Grafik fungsi kuadrat melalui titik <InlineMath math="(0, 2)" />, <InlineMath math="(1, 0)" />, dan <InlineMath math="(-2, 0)" />. Susunlah fungsi kuadrat tersebut.</>}
                  pembahasan={<>
                    <p>Dari titik <InlineMath math="(1,0)" /> dan <InlineMath math="(-2,0)" /> → akar-akar adalah <InlineMath math="x_1 = 1" /> dan <InlineMath math="x_2 = -2" /></p>
                    <Dark><BlockMath math="f(x) = a(x-1)(x+2)" /></Dark>
                    <p>Substitusi titik <InlineMath math="(0,2)" />:</p>
                    <Dark><BlockMath math="2 = a(0-1)(0+2) = -2a \implies a = -1" /></Dark>
                    <Dark><BlockMath math="f(x) = -(x-1)(x+2) = -(x^2 + x - 2) = -x^2 - x + 2" /></Dark>
                    <p>✅ <InlineMath math="f(x) = -x^2 - x + 2" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Susun fungsi kuadrat yang memiliki sumbu simetri <InlineMath math="x = 2" />, nilai optimum <InlineMath math="3" />, dan melalui titik <InlineMath math="(4, -5)" />.</>}
                  pembahasan={<>
                    <p>Sumbu simetri <InlineMath math="x = 2" /> dan nilai optimum <InlineMath math="3" /> → titik puncak <InlineMath math="(2, 3)" /></p>
                    <Dark><BlockMath math="f(x) = a(x-2)^2 + 3" /></Dark>
                    <p>Substitusi titik <InlineMath math="(4, -5)" />:</p>
                    <Dark><BlockMath math="-5 = a(4-2)^2 + 3 = 4a + 3 \implies 4a = -8 \implies a = -2" /></Dark>
                    <Dark><BlockMath math="f(x) = -2(x-2)^2 + 3 = -2x^2 + 8x - 8 + 3 = -2x^2 + 8x - 5" /></Dark>
                    <p>✅ <InlineMath math="f(x) = -2x^2 + 8x - 5" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Susun fungsi kuadrat yang melalui tiga titik: <InlineMath math="A(-1, 6)" />, <InlineMath math="B(1, 2)" />, <InlineMath math="C(3, 6)" />.</>}
                  pembahasan={<>
                    <p>Gunakan bentuk <InlineMath math="f(x) = ax^2 + bx + c" />. Substitusi ketiga titik:</p>
                    <Dark>
                      <p className="text-sm">Dari A(-1,6): <InlineMath math="a - b + c = 6 \quad \cdots (1)" /></p>
                      <p className="text-sm mt-1">Dari B(1,2): <InlineMath math="a + b + c = 2 \quad \cdots (2)" /></p>
                      <p className="text-sm mt-1">Dari C(3,6): <InlineMath math="9a + 3b + c = 6 \quad \cdots (3)" /></p>
                    </Dark>
                    <p><strong>(2) - (1):</strong> <InlineMath math="2b = -4 \implies b = -2" /></p>
                    <p><strong>(2) + (1):</strong> <InlineMath math="2a + 2c = 8 \implies a + c = 4 \quad \cdots (4)" /></p>
                    <p><strong>Substitusi b=-2 ke (3):</strong> <InlineMath math="9a - 6 + c = 6 \implies 9a + c = 12 \quad \cdots (5)" /></p>
                    <p><strong>(5) - (4):</strong> <InlineMath math="8a = 8 \implies a = 1,\; c = 3" /></p>
                    <p>✅ <InlineMath math="f(x) = x^2 - 2x + 3" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Fungsi kuadrat <InlineMath math="f" /> memiliki titik puncak di <InlineMath math="(p, q)" /> dan akar-akar <InlineMath math="x_1" />, <InlineMath math="x_2" />. Buktikan bahwa <InlineMath math="p = \dfrac{x_1 + x_2}{2}" />.</>}
                  pembahasan={<>
                    <p>Dari bentuk faktor: <InlineMath math="f(x) = a(x - x_1)(x - x_2)" /></p>
                    <p>Ekspansikan: <InlineMath math="f(x) = a[x^2 - (x_1+x_2)x + x_1 x_2]" /></p>
                    <p>Bandingkan dengan <InlineMath math="ax^2 + bx + c" />: <InlineMath math="b = -a(x_1 + x_2)" /></p>
                    <p>Sumbu simetri (koordinat-x puncak):</p>
                    <Dark><BlockMath math="p = -\frac{b}{2a} = -\frac{-a(x_1+x_2)}{2a} = \frac{x_1 + x_2}{2}" /></Dark>
                    <p>✅ Terbukti: titik puncak berada tepat di <strong>tengah-tengah</strong> antara kedua akar! (Sifat simetri parabola)</p>
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

export default MenyusunFungsiPage;
