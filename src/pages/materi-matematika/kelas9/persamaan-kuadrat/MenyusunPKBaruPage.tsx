import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MenyusunPKBaruPage = () => {
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
          MENYUSUN PERSAMAAN KUADRAT BARU
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Persamaan Kuadrat · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🏗️ Membangun Persamaan dari Akar-Akarnya" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Selama ini kita belajar <em>mencari akar dari persamaan</em>. Sekarang kita balik: <strong>diberi akar-akarnya, susun persamaannya!</strong> Ini seperti membangun teka-teki dari potongan yang sudah diketahui.
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80">Ada dua cara utama:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-1">Cara 1: Langsung</p>
                    <p className="font-body text-xs text-white/70">Dari faktor <InlineMath math="(x - x_1)(x - x_2) = 0" /></p>
                  </Box>
                  <Box color="orange">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1">Cara 2: Rumus Vieta</p>
                    <p className="font-body text-xs text-white/70">Gunakan jumlah dan hasil kali akar-akar.</p>
                  </Box>
                </div>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="📘 Rumus Vieta & Cara Menyusun PK Baru" />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm mb-2">Jika <InlineMath math="x_1" /> dan <InlineMath math="x_2" /> adalah akar-akar dari <InlineMath math="ax^2 + bx + c = 0" />, maka berlaku <strong>Rumus Vieta</strong>:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <Box color="green">
                      <p className="font-body text-xs text-green-300 font-bold">Jumlah Akar</p>
                      <Dark><BlockMath math="x_1 + x_2 = -\frac{b}{a}" /></Dark>
                    </Box>
                    <Box color="orange">
                      <p className="font-body text-xs text-orange-300 font-bold">Hasil Kali Akar</p>
                      <Dark><BlockMath math="x_1 \cdot x_2 = \frac{c}{a}" /></Dark>
                    </Box>
                  </div>
                </Box>
                <Box color="cyan">
                  <p className="font-body text-xs font-bold text-cyan-300 mb-2">🏗️ Menyusun Persamaan Baru</p>
                  <p className="font-body text-xs text-white/80 mb-2">Jika diketahui akar-akar <InlineMath math="x_1" /> dan <InlineMath math="x_2" />, susun persamaan:</p>
                  <Dark>
                    <BlockMath math="x^2 - (x_1 + x_2)x + x_1 \cdot x_2 = 0" />
                  </Dark>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Tips:</strong> Ingat polanya — <em>koefisien x adalah negatif dari jumlah akar</em>, dan <em>konstanta adalah hasil kali akar</em>!</p>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Contoh Soal — Menyusun Persamaan Kuadrat Baru" />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Susun persamaan kuadrat yang akar-akarnya <InlineMath math="3" /> dan <InlineMath math="5" />.</>}
                  pembahasan={<>
                    <p>Cara langsung:</p>
                    <Dark><BlockMath math="(x - 3)(x - 5) = 0" /></Dark>
                    <Dark><BlockMath math="x^2 - 8x + 15 = 0" /></Dark>
                    <p>✅ Persamaan: <strong><InlineMath math="x^2 - 8x + 15 = 0" /></strong></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Susun persamaan kuadrat yang akar-akarnya <InlineMath math="-2" /> dan <InlineMath math="7" />.</>}
                  pembahasan={<>
                    <p>Jumlah: <InlineMath math="-2 + 7 = 5" />, Hasil kali: <InlineMath math="(-2)(7) = -14" /></p>
                    <Dark><BlockMath math="x^2 - 5x + (-14) = 0" /></Dark>
                    <p>✅ <strong><InlineMath math="x^2 - 5x - 14 = 0" /></strong></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Diketahui akar-akar <InlineMath math="x^2 - 6x + 8 = 0" /> adalah <InlineMath math="x_1" /> dan <InlineMath math="x_2" />. Susun persamaan kuadrat baru yang akar-akarnya <InlineMath math="2x_1" /> dan <InlineMath math="2x_2" />.</>}
                  pembahasan={<>
                    <p>Dari Vieta: <InlineMath math="x_1 + x_2 = 6" /> dan <InlineMath math="x_1 x_2 = 8" /></p>
                    <p>Akar baru: jumlah = <InlineMath math="2(x_1 + x_2) = 12" />, hasil kali = <InlineMath math="4x_1 x_2 = 32" /></p>
                    <Dark><BlockMath math="x^2 - 12x + 32 = 0" /></Dark>
                    <p>✅ <strong><InlineMath math="x^2 - 12x + 32 = 0" /></strong></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Diketahui akar-akar <InlineMath math="x^2 - 5x + 4 = 0" /> adalah <InlineMath math="x_1" /> dan <InlineMath math="x_2" />. Susun PK baru yang akar-akarnya <InlineMath math="(x_1 + 1)" /> dan <InlineMath math="(x_2 + 1)" />.</>}
                  pembahasan={<>
                    <p>Dari Vieta: <InlineMath math="x_1 + x_2 = 5" />, <InlineMath math="x_1 x_2 = 4" /></p>
                    <p>Jumlah akar baru: <InlineMath math="(x_1+1)+(x_2+1) = 5+2 = 7" /></p>
                    <p>Hasil kali baru: <InlineMath math="(x_1+1)(x_2+1) = x_1x_2 + x_1 + x_2 + 1 = 4+5+1 = 10" /></p>
                    <Dark><BlockMath math="x^2 - 7x + 10 = 0" /></Dark>
                    <p>✅ <strong><InlineMath math="x^2 - 7x + 10 = 0" /></strong></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Akar-akar <InlineMath math="2x^2 - 4x - 6 = 0" /> adalah <InlineMath math="x_1" /> dan <InlineMath math="x_2" />. Tentukan nilai <InlineMath math="x_1^2 + x_2^2" />.</>}
                  pembahasan={<>
                    <p>Dari Vieta (<InlineMath math="a=2, b=-4, c=-6" />): <InlineMath math="x_1+x_2 = 2" />, <InlineMath math="x_1 x_2 = -3" /></p>
                    <p>Gunakan identitas:</p>
                    <Dark><BlockMath math="x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2 = 4 - 2(-3) = 4 + 6 = 10" /></Dark>
                    <p>✅ <InlineMath math="x_1^2 + x_2^2 = 10" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Susun PK baru yang akar-akarnya adalah <InlineMath math="\dfrac{1}{x_1}" /> dan <InlineMath math="\dfrac{1}{x_2}" />, jika <InlineMath math="x_1, x_2" /> adalah akar-akar dari <InlineMath math="3x^2 - 7x + 2 = 0" />.</>}
                  pembahasan={<>
                    <p>Dari Vieta: <InlineMath math="x_1+x_2 = \frac{7}{3}" />, <InlineMath math="x_1 x_2 = \frac{2}{3}" /></p>
                    <p>Jumlah akar baru: <InlineMath math="\frac{1}{x_1}+\frac{1}{x_2} = \frac{x_1+x_2}{x_1 x_2} = \frac{7/3}{2/3} = \frac{7}{2}" /></p>
                    <p>Hasil kali akar baru: <InlineMath math="\frac{1}{x_1} \cdot \frac{1}{x_2} = \frac{1}{x_1 x_2} = \frac{3}{2}" /></p>
                    <Dark><BlockMath math="x^2 - \frac{7}{2}x + \frac{3}{2} = 0 \quad \times 2" /></Dark>
                    <Dark><BlockMath math="2x^2 - 7x + 3 = 0" /></Dark>
                    <p>✅ <strong><InlineMath math="2x^2 - 7x + 3 = 0" /></strong></p>
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

export default MenyusunPKBaruPage;
