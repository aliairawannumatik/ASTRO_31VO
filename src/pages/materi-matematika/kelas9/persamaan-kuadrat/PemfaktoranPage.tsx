import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PemfaktoranPage = () => {
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
    const map = { MUDAH: "bg-green-500/20 text-green-400 border border-green-500", SEDANG: "bg-yellow-500/20 text-yellow-400 border border-yellow-500", SULIT: "bg-red-500/20 text-red-400 border border-red-500" };
    const bar = { MUDAH: "border-green-500", SEDANG: "border-yellow-500", SULIT: "border-red-500" };
    return { badge: map[level], bar: bar[level] };
  };

  const ExampleBlock = ({ level, no, soal, pembahasan }: { level: "MUDAH" | "SEDANG" | "SULIT"; no: number; soal: React.ReactNode; pembahasan: React.ReactNode; }) => {
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
          AKAR PERSAMAAN KUADRAT — PEMFAKTORAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Persamaan Kuadrat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title="🔧 Kenapa Pakai Pemfaktoran?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Pemfaktoran adalah cara <strong>tercepat</strong> dan paling elegan untuk mencari akar persamaan kuadrat — kalau bisa dilakukan. Idenya sederhana: ubah <InlineMath math="ax^2 + bx + c" /> menjadi hasil kali dua faktor linear <InlineMath math="(px + q)(rx + s)" />, lalu gunakan sifat <em>zero product property</em>: kalau hasil kali dua bilangan nol, maka salah satunya pasti nol!
                  </p>
                </Box>
                <Box color="green">
                  <p className="font-body text-sm font-bold text-green-300 mb-2">⚡ Sifat Zero Product Property:</p>
                  <Dark><BlockMath math="\text{Jika } A \times B = 0 \implies A = 0 \text{ atau } B = 0" /></Dark>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Tips:</strong> Pemfaktoran paling mudah saat <InlineMath math="a = 1" />. Cari dua bilangan yang <strong>hasil kalinya = c</strong> dan <strong>jumlahnya = b</strong>!</p>
                </Box>
              </div>
            )}
          </div>

          {/* ── TEORI ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-green-400"
              title="📘 Strategi Pemfaktoran — 3 Pola Utama" />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">

                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm leading-relaxed">Ada 3 pola pemfaktoran yang wajib dikuasai:</p>
                </Box>

                <div className="space-y-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-1">Pola 1: Koefisien <InlineMath math="a = 1" /></p>
                    <Dark><BlockMath math="x^2 + bx + c = (x + p)(x + q)" /></Dark>
                    <p className="font-body text-xs text-white/70">Syarat: <InlineMath math="p + q = b" /> dan <InlineMath math="p \times q = c" /></p>
                  </Box>
                  <Box color="orange">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1">Pola 2: Koefisien <InlineMath math="a \neq 1" /> (Metode AC)</p>
                    <Dark><BlockMath math="ax^2 + bx + c \xrightarrow{\text{cari } p,q: pq=ac,\; p+q=b} \text{faktorkan}" /></Dark>
                    <p className="font-body text-xs text-white/70">Kalikan <InlineMath math="a \times c" />, cari dua bilangan dengan hasil kali tersebut dan jumlah = <InlineMath math="b" />.</p>
                  </Box>
                  <Box color="cyan">
                    <p className="font-body text-xs font-bold text-cyan-300 mb-1">Pola 3: Selisih Dua Kuadrat</p>
                    <Dark><BlockMath math="x^2 - k^2 = (x+k)(x-k)" /></Dark>
                    <p className="font-body text-xs text-white/70">Berlaku saat tidak ada suku tengah dan konstanta negatif.</p>
                  </Box>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title="📝 Contoh Soal — Pemfaktoran" />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Tentukan akar-akar dari <InlineMath math="x^2 + 5x + 6 = 0" /> dengan pemfaktoran.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Cari dua bilangan dengan hasil kali = 6 dan jumlah = 5:</p>
                    <p>Coba: <InlineMath math="2 \times 3 = 6" /> dan <InlineMath math="2 + 3 = 5" /> ✅</p>
                    <Dark><BlockMath math="x^2 + 5x + 6 = (x + 2)(x + 3) = 0" /></Dark>
                    <p><strong>Langkah 2:</strong> Zero product property:</p>
                    <Dark><BlockMath math="x + 2 = 0 \Rightarrow x_1 = -2" /></Dark>
                    <Dark><BlockMath math="x + 3 = 0 \Rightarrow x_2 = -3" /></Dark>
                    <p>✅ Akar-akar: <InlineMath math="x_1 = -2" /> dan <InlineMath math="x_2 = -3" /></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Selesaikan: <InlineMath math="x^2 - 49 = 0" /></>}
                  pembahasan={<>
                    <p>Kenali pola <strong>selisih dua kuadrat</strong>: <InlineMath math="x^2 - 7^2 = 0" /></p>
                    <Dark><BlockMath math="(x + 7)(x - 7) = 0" /></Dark>
                    <p><InlineMath math="x + 7 = 0 \Rightarrow x_1 = -7" /></p>
                    <p><InlineMath math="x - 7 = 0 \Rightarrow x_2 = 7" /></p>
                    <p>✅ <InlineMath math="x_1 = -7" /> dan <InlineMath math="x_2 = 7" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Tentukan akar-akar: <InlineMath math="x^2 - 3x - 10 = 0" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Cari dua bilangan dengan hasil kali = −10 dan jumlah = −3:</p>
                    <p>Coba: <InlineMath math="(-5) \times 2 = -10" /> dan <InlineMath math="(-5) + 2 = -3" /> ✅</p>
                    <Dark><BlockMath math="(x - 5)(x + 2) = 0" /></Dark>
                    <p><InlineMath math="x_1 = 5" /> dan <InlineMath math="x_2 = -2" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Selesaikan dengan pemfaktoran: <InlineMath math="2x^2 + 7x + 3 = 0" /></>}
                  pembahasan={<>
                    <p><strong>Metode AC:</strong> <InlineMath math="a \times c = 2 \times 3 = 6" />. Cari bilangan dengan hasil kali 6 dan jumlah 7:</p>
                    <p><InlineMath math="1 \times 6 = 6" /> dan <InlineMath math="1 + 6 = 7" /> ✅</p>
                    <p><strong>Langkah 2:</strong> Pecah suku tengah:</p>
                    <Dark><BlockMath math="2x^2 + x + 6x + 3 = 0" /></Dark>
                    <p><strong>Langkah 3:</strong> Faktorkan per kelompok:</p>
                    <Dark><BlockMath math="x(2x + 1) + 3(2x + 1) = 0" /></Dark>
                    <Dark><BlockMath math="(2x + 1)(x + 3) = 0" /></Dark>
                    <p>✅ <InlineMath math="x_1 = -\dfrac{1}{2}" /> dan <InlineMath math="x_2 = -3" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Selesaikan: <InlineMath math="6x^2 - x - 2 = 0" /></>}
                  pembahasan={<>
                    <p><strong>Metode AC:</strong> <InlineMath math="a \times c = 6 \times (-2) = -12" />. Cari bilangan hasil kali −12, jumlah −1:</p>
                    <p><InlineMath math="(-4) \times 3 = -12" /> dan <InlineMath math="(-4) + 3 = -1" /> ✅</p>
                    <Dark><BlockMath math="6x^2 - 4x + 3x - 2 = 0" /></Dark>
                    <Dark><BlockMath math="2x(3x - 2) + 1(3x - 2) = 0" /></Dark>
                    <Dark><BlockMath math="(3x - 2)(2x + 1) = 0" /></Dark>
                    <p>✅ <InlineMath math="x_1 = \dfrac{2}{3}" /> dan <InlineMath math="x_2 = -\dfrac{1}{2}" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Selesaikan: <InlineMath math="3x^2 - 12x = 0" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Faktorkan GCF (Faktor Persekutuan Terbesar). GCF dari <InlineMath math="3x^2" /> dan <InlineMath math="12x" /> adalah <InlineMath math="3x" />:</p>
                    <Dark><BlockMath math="3x(x - 4) = 0" /></Dark>
                    <p><strong>Langkah 2:</strong> Zero product property:</p>
                    <p><InlineMath math="3x = 0 \Rightarrow x_1 = 0" /></p>
                    <p><InlineMath math="x - 4 = 0 \Rightarrow x_2 = 4" /></p>
                    <p>✅ <InlineMath math="x_1 = 0" /> dan <InlineMath math="x_2 = 4" /></p>
                    <Box color="yellow"><p className="font-body text-xs text-yellow-200"><strong>Ingat:</strong> Jangan pernah bagi kedua ruas dengan <InlineMath math="x" />! Nanti kehilangan solusi <InlineMath math="x = 0" />.</p></Box>
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

export default PemfaktoranPage;
