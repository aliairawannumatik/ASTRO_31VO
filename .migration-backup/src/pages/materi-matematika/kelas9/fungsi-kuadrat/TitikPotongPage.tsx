import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const TitikPotongPage = () => {
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
          TITIK POTONG TERHADAP SUMBU-SUMBU
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Fungsi Kuadrat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title="🎯 Di Mana Parabola Menyentuh Sumbu?" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Saat menggambar grafik fungsi kuadrat, kita perlu tahu <strong>di mana grafik memotong sumbu koordinat</strong>.
                    Ada dua jenis titik potong: dengan <strong>sumbu-x</strong> (akar-akar fungsi) dan dengan <strong>sumbu-y</strong> (nilai fungsi saat <InlineMath math="x=0" />).
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Titik-titik potong ini seperti "jangkar" 🪝 yang membantu kita menempatkan grafik dengan tepat di bidang koordinat.
                  Banyaknya titik potong dengan sumbu-x ditentukan oleh nilai <strong>diskriminan</strong> <InlineMath math="D = b^2 - 4ac" />.
                </p>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Ingat:</strong> Titik potong sumbu-y selalu ada (satu titik saja), tapi titik potong sumbu-x bisa 0, 1, atau 2 titik — tergantung nilai diskriminan!</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title="📘 Cara Menentukan Titik Potong" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">🎯 Ringkasan Intisari</p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-body text-sm font-semibold text-cyan-300">📌 Titik Potong dengan Sumbu-y</p>
                      <p className="font-body text-xs text-white/80 mt-1">Substitusikan <InlineMath math="x = 0" /> ke dalam fungsi:</p>
                      <Dark><BlockMath math="f(0) = a(0)^2 + b(0) + c = c" /></Dark>
                      <p className="font-body text-xs text-white/70">Titik potong sumbu-y selalu di <InlineMath math="(0, c)" /></p>
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-green-300">📌 Titik Potong dengan Sumbu-x</p>
                      <p className="font-body text-xs text-white/80 mt-1">Substitusikan <InlineMath math="f(x) = 0" />, lalu selesaikan:</p>
                      <Dark><BlockMath math="ax^2 + bx + c = 0" /></Dark>
                      <p className="font-body text-xs text-white/70">Gunakan pemfaktoran atau rumus kuadratik untuk mencari <InlineMath math="x_1" /> dan <InlineMath math="x_2" /></p>
                    </div>
                  </div>
                </Box>

                <p className="font-body text-sm text-white/80 font-semibold">🌟 Jumlah Titik Potong Berdasarkan Diskriminan:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-1"><InlineMath math="D > 0" /></p>
                    <div className="flex justify-center my-1">
                      <svg viewBox="0 0 80 60" className="w-20 h-14">
                        <line x1="5" y1="35" x2="75" y2="35" stroke="#4ade8060" strokeWidth="1"/>
                        <path d="M 5 55 Q 40 10 75 55" stroke="#4ade80" strokeWidth="2" fill="none"/>
                        <circle cx="18" cy="35" r="3" fill="#4ade80"/>
                        <circle cx="62" cy="35" r="3" fill="#4ade80"/>
                      </svg>
                    </div>
                    <p className="font-body text-xs text-white/70 text-center"><strong>2 titik potong</strong> berbeda</p>
                  </Box>
                  <Box color="yellow">
                    <p className="font-body text-xs font-bold text-yellow-300 mb-1"><InlineMath math="D = 0" /></p>
                    <div className="flex justify-center my-1">
                      <svg viewBox="0 0 80 60" className="w-20 h-14">
                        <line x1="5" y1="35" x2="75" y2="35" stroke="#facc1560" strokeWidth="1"/>
                        <path d="M 5 55 Q 40 35 75 55" stroke="#facc15" strokeWidth="2" fill="none"/>
                        <circle cx="40" cy="35" r="3" fill="#facc15"/>
                      </svg>
                    </div>
                    <p className="font-body text-xs text-white/70 text-center"><strong>1 titik singgung</strong> (akar kembar)</p>
                  </Box>
                  <Box color="red">
                    <p className="font-body text-xs font-bold text-red-300 mb-1"><InlineMath math="D < 0" /></p>
                    <div className="flex justify-center my-1">
                      <svg viewBox="0 0 80 60" className="w-20 h-14">
                        <line x1="5" y1="45" x2="75" y2="45" stroke="#f8717160" strokeWidth="1"/>
                        <path d="M 5 58 Q 40 20 75 58" stroke="#f87171" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                    <p className="font-body text-xs text-white/70 text-center"><strong>Tidak ada</strong> titik potong</p>
                  </Box>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title="📝 Contoh Soal — Titik Potong Sumbu" />
            {true && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Tentukan titik potong fungsi <InlineMath math="f(x) = x^2 - 5x + 6" /> dengan sumbu-x dan sumbu-y.</>}
                  pembahasan={<>
                    <p><strong>Titik potong sumbu-y</strong> (substitusi <InlineMath math="x = 0" />):</p>
                    <Dark><BlockMath math="f(0) = 0 - 0 + 6 = 6 \implies (0, 6)" /></Dark>
                    <p><strong>Titik potong sumbu-x</strong> (selesaikan <InlineMath math="f(x) = 0" />):</p>
                    <Dark><BlockMath math="x^2 - 5x + 6 = 0 \implies (x-2)(x-3) = 0" /></Dark>
                    <p>✅ <InlineMath math="x_1 = 2" /> dan <InlineMath math="x_2 = 3" /> → titik potong: <InlineMath math="(2, 0)" /> dan <InlineMath math="(3, 0)" /></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Tentukan titik potong <InlineMath math="g(x) = 2x^2 - 8" /> dengan kedua sumbu koordinat.</>}
                  pembahasan={<>
                    <p><strong>Titik potong sumbu-y:</strong> <InlineMath math="g(0) = -8" /> → <InlineMath math="(0, -8)" /></p>
                    <p><strong>Titik potong sumbu-x</strong> (<InlineMath math="g(x) = 0" />):</p>
                    <Dark><BlockMath math="2x^2 - 8 = 0 \implies x^2 = 4 \implies x = \pm 2" /></Dark>
                    <p>✅ Titik potong sumbu-x: <InlineMath math="(-2, 0)" /> dan <InlineMath math="(2, 0)" /></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Tentukan titik potong <InlineMath math="h(x) = x^2 - 4x + 4" /> dengan sumbu-x. Apa yang istimewa dari titik potong ini?</>}
                  pembahasan={<>
                    <p><strong>Cek diskriminan:</strong> <InlineMath math="a=1, b=-4, c=4" /></p>
                    <Dark><BlockMath math="D = (-4)^2 - 4(1)(4) = 16 - 16 = 0" /></Dark>
                    <p>Karena <InlineMath math="D = 0" />, ada <strong>akar kembar</strong>:</p>
                    <Dark><BlockMath math="x = \frac{-(-4)}{2(1)} = \frac{4}{2} = 2" /></Dark>
                    <p>✅ Parabola hanya <strong>menyinggung</strong> sumbu-x di titik <InlineMath math="(2, 0)" /> — tidak memotong, hanya menyentuh!</p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Fungsi <InlineMath math="p(x) = -x^2 + 3x - 5" />. Apakah grafiknya memotong sumbu-x? Tentukan titik potong sumbu-y-nya.</>}
                  pembahasan={<>
                    <p><strong>Diskriminan:</strong> <InlineMath math="a=-1, b=3, c=-5" /></p>
                    <Dark><BlockMath math="D = 9 - 4(-1)(-5) = 9 - 20 = -11 < 0" /></Dark>
                    <p>❌ <InlineMath math="D < 0" /> → grafik <strong>tidak memotong sumbu-x</strong> sama sekali.</p>
                    <p><strong>Titik potong sumbu-y:</strong></p>
                    <Dark><BlockMath math="p(0) = -0 + 0 - 5 = -5 \implies (0, -5)" /></Dark>
                    <p>✅ Karena <InlineMath math="a < 0" /> dan tidak memotong sumbu-x → seluruh grafik berada di <strong>bawah sumbu-x</strong>.</p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Fungsi <InlineMath math="f(x) = 2x^2 + (k-1)x - 6" /> memotong sumbu-x di titik <InlineMath math="(2, 0)" />. Tentukan nilai <InlineMath math="k" /> dan titik potong lainnya.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Substitusikan <InlineMath math="x = 2, f(x) = 0" />:</p>
                    <Dark><BlockMath math="2(4) + (k-1)(2) - 6 = 0" /></Dark>
                    <Dark><BlockMath math="8 + 2k - 2 - 6 = 0 \implies 2k = 0 \implies k = 0" /></Dark>
                    <p><strong>Langkah 2:</strong> Substitusi <InlineMath math="k = 0" />: <InlineMath math="f(x) = 2x^2 - x - 6" /></p>
                    <p><strong>Langkah 3:</strong> Faktorkan untuk menemukan akar lain:</p>
                    <Dark><BlockMath math="2x^2 - x - 6 = (2x + 3)(x - 2) = 0" /></Dark>
                    <p>✅ <InlineMath math="x = 2" /> (konfirmasi) dan <InlineMath math="x = -\dfrac{3}{2}" /> → titik potong lain: <InlineMath math="\left(-\dfrac{3}{2}, 0\right)" /></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Parabola <InlineMath math="f(x) = ax^2 + bx + c" /> memotong sumbu-x di <InlineMath math="(-1, 0)" /> dan <InlineMath math="(4, 0)" />, serta memotong sumbu-y di <InlineMath math="(0, -8)" />. Tentukan nilai <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" />.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Dari titik potong sumbu-x, akar-akarnya <InlineMath math="x_1 = -1" /> dan <InlineMath math="x_2 = 4" />:</p>
                    <Dark><BlockMath math="f(x) = a(x+1)(x-4)" /></Dark>
                    <p><strong>Langkah 2:</strong> Gunakan titik potong sumbu-y: <InlineMath math="f(0) = -8" /></p>
                    <Dark><BlockMath math="a(0+1)(0-4) = -8 \implies -4a = -8 \implies a = 2" /></Dark>
                    <p><strong>Langkah 3:</strong> Ekspansikan:</p>
                    <Dark><BlockMath math="f(x) = 2(x+1)(x-4) = 2(x^2 - 3x - 4) = 2x^2 - 6x - 8" /></Dark>
                    <p>✅ <InlineMath math="a = 2,\; b = -6,\; c = -8" /></p>
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

export default TitikPotongPage;
