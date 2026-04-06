import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const RumusKuadratikPage = () => {
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
          AKAR PERSAMAAN KUADRAT — RUMUS KUADRATIK
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Persamaan Kuadrat · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🚀 Rumus Paling Sakti — ABC!" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Rumus kuadratik (sering disebut <strong>rumus ABC</strong>) adalah senjata pamungkas untuk mencari akar persamaan kuadrat. Tidak peduli seberapa rumit persamaannya — selama ia berbentuk <InlineMath math="ax^2 + bx + c = 0" /> dengan <InlineMath math="a \neq 0" />, rumus ini selalu bisa dipakai!
                  </p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Kapan pakai rumus ini?</strong> Gunakan rumus ABC saat persamaan <strong>tidak bisa difaktorkan</strong> dengan mudah, atau saat koefisiennya bilangan besar/pecahan.</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Rumus Kuadratik & Cara Membacanya" />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm mb-2">Untuk setiap persamaan <InlineMath math="ax^2 + bx + c = 0" />, akar-akarnya adalah:</p>
                  <Dark>
                    <BlockMath math="x_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
                  </Dark>
                  <p className="font-body text-sm mt-2">Tanda <InlineMath math="\pm" /> berarti ada <strong>dua</strong> solusi: satu pakai <InlineMath math="+" />, satu pakai <InlineMath math="-" />.</p>
                </Box>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-1"><InlineMath math="x_1 = \dfrac{-b + \sqrt{b^2-4ac}}{2a}" /></p>
                    <p className="font-body text-xs text-white/70">Akar pertama (gunakan tanda +)</p>
                  </Box>
                  <Box color="orange">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1"><InlineMath math="x_2 = \dfrac{-b - \sqrt{b^2-4ac}}{2a}" /></p>
                    <p className="font-body text-xs text-white/70">Akar kedua (gunakan tanda −)</p>
                  </Box>
                </div>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🔑 LANGKAH PENGGUNAAN:</p>
                  <ol className="font-body text-xs text-white/70 space-y-1 list-decimal list-inside">
                    <li>Pastikan bentuk: <InlineMath math="ax^2 + bx + c = 0" /></li>
                    <li>Identifikasi nilai <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /></li>
                    <li>Hitung nilai di bawah akar: <InlineMath math="D = b^2 - 4ac" /></li>
                    <li>Substitusikan ke rumus</li>
                    <li>Sederhanakan</li>
                  </ol>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Rumus Kuadratik" />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Tentukan akar-akar <InlineMath math="x^2 - 5x + 6 = 0" /> menggunakan rumus kuadratik.</>}
                  pembahasan={<>
                    <p><InlineMath math="a = 1,\; b = -5,\; c = 6" /></p>
                    <Dark><BlockMath math="x = \frac{-(-5) \pm \sqrt{(-5)^2 - 4(1)(6)}}{2(1)} = \frac{5 \pm \sqrt{25-24}}{2} = \frac{5 \pm 1}{2}" /></Dark>
                    <p><InlineMath math="x_1 = \dfrac{5+1}{2} = 3" />, <InlineMath math="x_2 = \dfrac{5-1}{2} = 2" /></p>
                    <p>✅ <InlineMath math="x_1 = 3" /> dan <InlineMath math="x_2 = 2" /></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Selesaikan: <InlineMath math="x^2 + 4x - 5 = 0" /></>}
                  pembahasan={<>
                    <p><InlineMath math="a = 1,\; b = 4,\; c = -5" /></p>
                    <Dark><BlockMath math="x = \frac{-4 \pm \sqrt{16 + 20}}{2} = \frac{-4 \pm \sqrt{36}}{2} = \frac{-4 \pm 6}{2}" /></Dark>
                    <p><InlineMath math="x_1 = \dfrac{-4+6}{2} = 1" />, <InlineMath math="x_2 = \dfrac{-4-6}{2} = -5" /></p>
                    <p>✅ <InlineMath math="x_1 = 1" /> dan <InlineMath math="x_2 = -5" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Tentukan akar-akar: <InlineMath math="2x^2 - 3x - 2 = 0" /></>}
                  pembahasan={<>
                    <p><InlineMath math="a = 2,\; b = -3,\; c = -2" /></p>
                    <Dark><BlockMath math="x = \frac{3 \pm \sqrt{9 + 16}}{4} = \frac{3 \pm \sqrt{25}}{4} = \frac{3 \pm 5}{4}" /></Dark>
                    <p><InlineMath math="x_1 = \dfrac{3+5}{4} = 2" />, <InlineMath math="x_2 = \dfrac{3-5}{4} = -\dfrac{1}{2}" /></p>
                    <p>✅ <InlineMath math="x_1 = 2" /> dan <InlineMath math="x_2 = -\tfrac{1}{2}" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Selesaikan: <InlineMath math="3x^2 + x - 4 = 0" /></>}
                  pembahasan={<>
                    <p><InlineMath math="a = 3,\; b = 1,\; c = -4" /></p>
                    <Dark><BlockMath math="D = 1 + 48 = 49 \Rightarrow \sqrt{D} = 7" /></Dark>
                    <Dark><BlockMath math="x = \frac{-1 \pm 7}{6}" /></Dark>
                    <p><InlineMath math="x_1 = \dfrac{6}{6} = 1" />, <InlineMath math="x_2 = \dfrac{-8}{6} = -\dfrac{4}{3}" /></p>
                    <p>✅ <InlineMath math="x_1 = 1" /> dan <InlineMath math="x_2 = -\tfrac{4}{3}" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Selesaikan: <InlineMath math="x^2 - 4x + 1 = 0" /> (jawaban dalam bentuk akar).</>}
                  pembahasan={<>
                    <p><InlineMath math="a = 1,\; b = -4,\; c = 1" /></p>
                    <Dark><BlockMath math="D = 16 - 4 = 12 \Rightarrow \sqrt{12} = 2\sqrt{3}" /></Dark>
                    <Dark><BlockMath math="x = \frac{4 \pm 2\sqrt{3}}{2} = 2 \pm \sqrt{3}" /></Dark>
                    <p>✅ <InlineMath math="x_1 = 2 + \sqrt{3}" /> dan <InlineMath math="x_2 = 2 - \sqrt{3}" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Diketahui <InlineMath math="5x^2 - 2x - 7 = 0" />. Tentukan akar-akarnya dan verifikasi hasil.</>}
                  pembahasan={<>
                    <p><InlineMath math="a = 5,\; b = -2,\; c = -7" /></p>
                    <Dark><BlockMath math="D = 4 + 140 = 144 \Rightarrow \sqrt{D} = 12" /></Dark>
                    <Dark><BlockMath math="x = \frac{2 \pm 12}{10}" /></Dark>
                    <p><InlineMath math="x_1 = \dfrac{14}{10} = \dfrac{7}{5}" />, <InlineMath math="x_2 = \dfrac{-10}{10} = -1" /></p>
                    <p><strong>Verifikasi</strong> <InlineMath math="x_2 = -1" />: <InlineMath math="5(1) - 2(-1) - 7 = 5 + 2 - 7 = 0" /> ✅</p>
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

export default RumusKuadratikPage;
