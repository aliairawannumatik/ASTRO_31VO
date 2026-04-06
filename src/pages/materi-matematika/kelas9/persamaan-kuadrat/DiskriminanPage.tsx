import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DiskriminanPage = () => {
  const navigate = useNavigate();
  const allSections = ["intro", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor: string; title: React.ReactNode }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expandedSections.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const DiffBadge = ({ level }: { level: "MUDAH" | "SEDANG" | "SULIT" }) => {
    const map = { MUDAH: "bg-green-500/20 text-green-400 border border-green-500", SEDANG: "bg-yellow-500/20 text-yellow-400 border border-yellow-500", SULIT: "bg-red-500/20 text-red-400 border border-red-500" };
    const bar = { MUDAH: "border-green-500", SEDANG: "border-yellow-500", SULIT: "border-red-500" };
    return { badge: map[level], bar: bar[level] };
  };

  const ExampleBlock = ({ level, no, soal, pembahasan }: { level: "MUDAH" | "SEDANG" | "SULIT"; no: number; soal: React.ReactNode; pembahasan: React.ReactNode }) => {
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
    const map: Record<string, string> = { cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-100", green: "bg-green-500/10 border-green-500/30 text-green-100", yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-100", purple: "bg-purple-500/10 border-purple-500/30 text-purple-100", orange: "bg-orange-500/10 border-orange-500/30 text-orange-100", red: "bg-red-500/10 border-red-500/30 text-red-100", slate: "bg-slate-900/60 border-slate-700/40 text-white/80" };
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
          DISKRIMINAN PERSAMAAN KUADRAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Persamaan Kuadrat · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🔭 Apa Itu Diskriminan?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Diskriminan adalah nilai yang bisa memberi tahu kamu <strong>jenis akar</strong> persamaan kuadrat <em>tanpa perlu menghitung akarnya dulu</em>! Ibarat ramalan bintang — hanya dari satu angka, kamu sudah tahu "nasib" solusinya.
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80">Ingat rumus ABC? Di bawah tanda akarnya ada ekspresi <InlineMath math="b^2 - 4ac" />. Itulah yang kita sebut <strong>diskriminan</strong>, dilambangkan dengan huruf <InlineMath math="D" /> (atau kadang <InlineMath math="\Delta" />).</p>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Manfaat Utama:</strong> Dengan diskriminan, kamu bisa langsung tahu apakah persamaan punya 2 akar berbeda, 1 akar kembar, atau tidak punya akar real — tanpa repot menghitung!</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Jenis-Jenis Diskriminan & Artinya" />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">🎯 Ringkasan Intisari</p>
                  <Dark><BlockMath math="D = b^2 - 4ac" /></Dark>
                </Box>
                <div className="space-y-3">
                  <Box color="green">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-body text-sm font-bold text-green-300">Jika <InlineMath math="D > 0" /></p>
                        <p className="font-body text-xs text-white/80 mt-1">Persamaan memiliki <strong>dua akar real yang berbeda</strong> (<InlineMath math="x_1 \neq x_2" />). Parabola memotong sumbu-x di <strong>dua titik</strong>.</p>
                        <p className="font-body text-xs text-green-300 mt-1">Jika <InlineMath math="D" /> adalah bilangan kuadrat sempurna → akar-akarnya <strong>rasional</strong>.</p>
                      </div>
                    </div>
                  </Box>
                  <Box color="yellow">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="font-body text-sm font-bold text-yellow-300">Jika <InlineMath math="D = 0" /></p>
                        <p className="font-body text-xs text-white/80 mt-1">Persamaan memiliki <strong>dua akar real yang sama</strong> (akar kembar): <InlineMath math="x_1 = x_2 = -\dfrac{b}{2a}" />. Parabola <strong>menyentuh</strong> sumbu-x di satu titik.</p>
                      </div>
                    </div>
                  </Box>
                  <Box color="red">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">❌</span>
                      <div>
                        <p className="font-body text-sm font-bold text-red-300">Jika <InlineMath math="D < 0" /></p>
                        <p className="font-body text-xs text-white/80 mt-1">Persamaan <strong>tidak memiliki akar real</strong> (akar-akarnya imajiner/kompleks). Parabola <strong>tidak memotong</strong> sumbu-x sama sekali.</p>
                      </div>
                    </div>
                  </Box>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Diskriminan" />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Tentukan jenis akar dari <InlineMath math="x^2 - 5x + 4 = 0" /> menggunakan diskriminan.</>}
                  pembahasan={<>
                    <p><InlineMath math="a = 1,\; b = -5,\; c = 4" /></p>
                    <Dark><BlockMath math="D = (-5)^2 - 4(1)(4) = 25 - 16 = 9" /></Dark>
                    <p><InlineMath math="D = 9 > 0" /> → <strong>Dua akar real berbeda</strong>. Karena 9 = 3², akarnya bilangan <strong>rasional</strong> ✅</p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Tentukan jenis akar dari <InlineMath math="x^2 - 6x + 9 = 0" /></>}
                  pembahasan={<>
                    <p><InlineMath math="a = 1,\; b = -6,\; c = 9" /></p>
                    <Dark><BlockMath math="D = (-6)^2 - 4(1)(9) = 36 - 36 = 0" /></Dark>
                    <p><InlineMath math="D = 0" /> → <strong>Akar kembar (dua akar sama)</strong>. Akar: <InlineMath math="x = -\frac{-6}{2} = 3" /> ✅</p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Tentukan nilai <InlineMath math="k" /> agar <InlineMath math="x^2 + kx + 9 = 0" /> memiliki akar kembar.</>}
                  pembahasan={<>
                    <p>Syarat akar kembar: <InlineMath math="D = 0" /></p>
                    <Dark><BlockMath math="k^2 - 4(1)(9) = 0" /></Dark>
                    <Dark><BlockMath math="k^2 = 36 \implies k = \pm 6" /></Dark>
                    <p>✅ <InlineMath math="k = 6" /> atau <InlineMath math="k = -6" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Tentukan jenis akar dari <InlineMath math="2x^2 + 3x + 5 = 0" /></>}
                  pembahasan={<>
                    <p><InlineMath math="a = 2,\; b = 3,\; c = 5" /></p>
                    <Dark><BlockMath math="D = 9 - 40 = -31" /></Dark>
                    <p><InlineMath math="D = -31 < 0" /> → Persamaan <strong>tidak memiliki akar real</strong> ❌</p>
                    <p>Grafiknya adalah parabola yang seluruhnya berada di atas sumbu-x.</p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Tentukan nilai <InlineMath math="m" /> agar <InlineMath math="mx^2 - 4x + m = 0" /> memiliki dua akar real berbeda.</>}
                  pembahasan={<>
                    <p>Syarat: <InlineMath math="D > 0" /> dan <InlineMath math="m \neq 0" /></p>
                    <Dark><BlockMath math="D = 16 - 4m^2 > 0" /></Dark>
                    <Dark><BlockMath math="4m^2 < 16 \implies m^2 < 4 \implies -2 < m < 2" /></Dark>
                    <p>Tapi <InlineMath math="m \neq 0" />, maka: ✅ <InlineMath math="-2 < m < 2,\; m \neq 0" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Persamaan <InlineMath math="3x^2 + (k-1)x + 3 = 0" /> memiliki dua akar real. Tentukan rentang nilai <InlineMath math="k" />.</>}
                  pembahasan={<>
                    <p>Syarat dua akar real: <InlineMath math="D \geq 0" /></p>
                    <Dark><BlockMath math="D = (k-1)^2 - 4(3)(3) \geq 0" /></Dark>
                    <Dark><BlockMath math="(k-1)^2 \geq 36" /></Dark>
                    <p><InlineMath math="|k - 1| \geq 6 \implies k - 1 \geq 6 \text{ atau } k - 1 \leq -6" /></p>
                    <p>✅ <InlineMath math="k \geq 7" /> atau <InlineMath math="k \leq -5" /></p>
                  </>}
                />

              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/persamaan-kuadrat"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body flex items-center gap-2 mx-auto">
              <Star className="w-4 h-4" /> Kembali ke Persamaan Kuadrat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiskriminanPage;
