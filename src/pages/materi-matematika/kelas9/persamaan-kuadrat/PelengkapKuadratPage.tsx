import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PelengkapKuadratPage = () => {
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
    const map: Record<string, string> = { cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-100", green: "bg-green-500/10 border-green-500/30 text-green-100", yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-100", purple: "bg-purple-500/10 border-purple-500/30 text-purple-100", orange: "bg-orange-500/10 border-orange-500/30 text-orange-100", slate: "bg-slate-900/60 border-slate-700/40 text-white/80" };
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
          AKAR PERSAMAAN KUADRAT — MELENGKAPI KUADRAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Persamaan Kuadrat · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🧩 Apa Itu Melengkapi Kuadrat?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Melengkapi kuadrat (completing the square) adalah metode mengubah persamaan kuadrat menjadi bentuk <InlineMath math="(x + p)^2 = q" /> yang mudah diselesaikan. Ini adalah teknik yang juga digunakan untuk <strong>menurunkan rumus ABC</strong>!
                  </p>
                </Box>
                <Box color="orange">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">🔑 Identitas Kunci:</p>
                  <Dark><BlockMath math="(x + p)^2 = x^2 + 2px + p^2" /></Dark>
                  <p className="font-body text-xs text-white/70 mt-1">Perhatikan: koefisien <InlineMath math="x" /> adalah <InlineMath math="2p" />, dan konstanta adalah <InlineMath math="p^2 = \left(\frac{2p}{2}\right)^2" />. Ini kunci triknya!</p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Trik Inti:</strong> Untuk melengkapi kuadrat dari <InlineMath math="x^2 + bx" />, tambahkan <InlineMath math="\left(\dfrac{b}{2}\right)^2" /> ke kedua ruas.</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="📘 Langkah-Langkah Melengkapi Kuadrat" />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm">Untuk menyelesaikan <InlineMath math="ax^2 + bx + c = 0" /> dengan melengkapi kuadrat:</p>
                </Box>
                <Box color="slate">
                  <ol className="font-body text-sm text-white/80 space-y-3 list-decimal list-inside">
                    <li>Jika <InlineMath math="a \neq 1" />, bagi seluruh persamaan dengan <InlineMath math="a" /></li>
                    <li>Pindahkan konstanta ke kanan: <InlineMath math="x^2 + \frac{b}{a}x = -\frac{c}{a}" /></li>
                    <li>Tambahkan <InlineMath math="\left(\frac{b}{2a}\right)^2" /> ke kedua ruas</li>
                    <li>Tulis ruas kiri sebagai kuadrat sempurna: <InlineMath math="\left(x + \frac{b}{2a}\right)^2 = \ldots" /></li>
                    <li>Akar-kan kedua ruas, selesaikan untuk <InlineMath math="x" /></li>
                  </ol>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Melengkapi Kuadrat" />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Selesaikan <InlineMath math="x^2 + 6x + 5 = 0" /> dengan melengkapi kuadrat.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Pindah konstanta ke kanan:</p>
                    <Dark><BlockMath math="x^2 + 6x = -5" /></Dark>
                    <p><strong>Langkah 2:</strong> Tambah <InlineMath math="\left(\frac{6}{2}\right)^2 = 9" /> ke kedua ruas:</p>
                    <Dark><BlockMath math="x^2 + 6x + 9 = -5 + 9 = 4" /></Dark>
                    <Dark><BlockMath math="(x + 3)^2 = 4" /></Dark>
                    <p><strong>Langkah 3:</strong> Akar-kan: <InlineMath math="x + 3 = \pm 2" /></p>
                    <p>✅ <InlineMath math="x_1 = -1" /> dan <InlineMath math="x_2 = -5" /></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Selesaikan <InlineMath math="x^2 - 8x + 12 = 0" /></>}
                  pembahasan={<>
                    <Dark><BlockMath math="x^2 - 8x = -12" /></Dark>
                    <p>Tambah <InlineMath math="\left(\frac{-8}{2}\right)^2 = 16" />:</p>
                    <Dark><BlockMath math="x^2 - 8x + 16 = 4 \implies (x-4)^2 = 4" /></Dark>
                    <p><InlineMath math="x - 4 = \pm 2" /></p>
                    <p>✅ <InlineMath math="x_1 = 6" /> dan <InlineMath math="x_2 = 2" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Selesaikan <InlineMath math="x^2 + 5x - 14 = 0" /></>}
                  pembahasan={<>
                    <Dark><BlockMath math="x^2 + 5x = 14" /></Dark>
                    <p>Tambah <InlineMath math="\left(\frac{5}{2}\right)^2 = \frac{25}{4}" />:</p>
                    <Dark><BlockMath math="x^2 + 5x + \frac{25}{4} = 14 + \frac{25}{4} = \frac{81}{4}" /></Dark>
                    <Dark><BlockMath math="\left(x + \frac{5}{2}\right)^2 = \frac{81}{4}" /></Dark>
                    <p><InlineMath math="x + \frac{5}{2} = \pm \frac{9}{2}" /></p>
                    <p>✅ <InlineMath math="x_1 = 2" /> dan <InlineMath math="x_2 = -7" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Selesaikan <InlineMath math="2x^2 - 8x - 10 = 0" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Bagi dengan 2:</p>
                    <Dark><BlockMath math="x^2 - 4x - 5 = 0 \implies x^2 - 4x = 5" /></Dark>
                    <p>Tambah <InlineMath math="4" />:</p>
                    <Dark><BlockMath math="(x-2)^2 = 9 \implies x - 2 = \pm 3" /></Dark>
                    <p>✅ <InlineMath math="x_1 = 5" /> dan <InlineMath math="x_2 = -1" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Selesaikan <InlineMath math="3x^2 + 6x - 24 = 0" /> dengan melengkapi kuadrat.</>}
                  pembahasan={<>
                    <p>Bagi dengan 3: <InlineMath math="x^2 + 2x - 8 = 0" /></p>
                    <Dark><BlockMath math="x^2 + 2x = 8" /></Dark>
                    <p>Tambah <InlineMath math="\left(\frac{2}{2}\right)^2 = 1" />:</p>
                    <Dark><BlockMath math="(x+1)^2 = 9 \implies x+1 = \pm 3" /></Dark>
                    <p>✅ <InlineMath math="x_1 = 2" /> dan <InlineMath math="x_2 = -4" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Selesaikan <InlineMath math="4x^2 - 4x - 3 = 0" /> dengan melengkapi kuadrat.</>}
                  pembahasan={<>
                    <p>Bagi dengan 4: <InlineMath math="x^2 - x - \frac{3}{4} = 0" /></p>
                    <Dark><BlockMath math="x^2 - x = \frac{3}{4}" /></Dark>
                    <p>Tambah <InlineMath math="\frac{1}{4}" />:</p>
                    <Dark><BlockMath math="\left(x - \frac{1}{2}\right)^2 = \frac{3}{4} + \frac{1}{4} = 1" /></Dark>
                    <p><InlineMath math="x - \frac{1}{2} = \pm 1" /></p>
                    <p>✅ <InlineMath math="x_1 = \frac{3}{2}" /> dan <InlineMath math="x_2 = -\frac{1}{2}" /></p>
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

export default PelengkapKuadratPage;
