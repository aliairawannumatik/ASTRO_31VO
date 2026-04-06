import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const BentukUmumPage = () => {
  const navigate = useNavigate();
  const allSections = ["intro", "rumus", "contoh"];
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
          BENTUK UMUM PERSAMAAN KUADRAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Persamaan Kuadrat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title="🚀 Apa Itu Persamaan Kuadrat?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Persamaan kuadrat adalah persamaan polinomial berderajat <strong>dua</strong> — artinya variabelnya punya pangkat tertinggi 2. Nama "kuadrat" berasal dari bahasa Latin <em>quadratus</em> yang berarti persegi, karena variabelnya dikuadratkan!
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Coba bayangkan kamu melempar bola ke udara 🏀. Lintasan bolanya membentuk kurva (parabola) yang digambarkan oleh persamaan kuadrat. Mau tahu kapan bola mendarat? Selesaikan persamaan kuadratnya!
                </p>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Tips:</strong> Persamaan kuadrat selalu punya paling banyak <strong>dua akar</strong> (solusi). Ini beda dengan persamaan linear yang hanya punya satu.</p>
                </Box>
              </div>
            )}
          </div>

          {/* ── RUMUS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title="📘 Bentuk Umum & Komponen Utama" />
            {expandedSections.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm leading-relaxed">
                    Setiap persamaan kuadrat bisa ditulis dalam bentuk standar berikut:
                  </p>
                  <Dark>
                    <BlockMath math="ax^2 + bx + c = 0" />
                  </Dark>
                  <p className="font-body text-sm leading-relaxed">
                    dengan syarat wajib: <strong className="text-purple-300"><InlineMath math="a \neq 0" /></strong>. Kalau <InlineMath math="a = 0" />, persamaannya menjadi linear (bukan kuadrat).
                  </p>
                </Box>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-1">Koefisien <InlineMath math="a" /></p>
                    <p className="font-body text-xs text-white/70">Koefisien <InlineMath math="x^2" />. Menentukan <strong>arah parabola</strong> (buka ke atas/bawah) dan tidak boleh 0.</p>
                  </Box>
                  <Box color="orange">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1">Koefisien <InlineMath math="b" /></p>
                    <p className="font-body text-xs text-white/70">Koefisien <InlineMath math="x" />. Boleh nol. Mempengaruhi posisi sumbu simetri parabola.</p>
                  </Box>
                  <Box color="pink">
                    <p className="font-body text-xs font-bold text-pink-300 mb-1">Konstanta <InlineMath math="c" /></p>
                    <p className="font-body text-xs text-white/70">Suku bebas (tidak ada variabel). Boleh nol. Menentukan titik potong grafik dengan sumbu-<InlineMath math="y" />.</p>
                  </Box>
                </div>

                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">📊 TABEL CONTOH IDENTIFIKASI:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 pr-4 text-slate-300">Persamaan</th>
                          <th className="text-center py-2 px-2 text-green-300"><InlineMath math="a" /></th>
                          <th className="text-center py-2 px-2 text-orange-300"><InlineMath math="b" /></th>
                          <th className="text-center py-2 px-2 text-pink-300"><InlineMath math="c" /></th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-slate-700/50"><td className="py-2 pr-4"><InlineMath math="2x^2 + 5x - 3 = 0" /></td><td className="text-center px-2">2</td><td className="text-center px-2">5</td><td className="text-center px-2">-3</td></tr>
                        <tr className="border-b border-slate-700/50"><td className="py-2 pr-4"><InlineMath math="x^2 - 9 = 0" /></td><td className="text-center px-2">1</td><td className="text-center px-2">0</td><td className="text-center px-2">-9</td></tr>
                        <tr className="border-b border-slate-700/50"><td className="py-2 pr-4"><InlineMath math="-3x^2 + 7x = 0" /></td><td className="text-center px-2">-3</td><td className="text-center px-2">7</td><td className="text-center px-2">0</td></tr>
                        <tr><td className="py-2 pr-4"><InlineMath math="4x^2 = 0" /></td><td className="text-center px-2">4</td><td className="text-center px-2">0</td><td className="text-center px-2">0</td></tr>
                      </tbody>
                    </table>
                  </div>
                </Box>

                <Box color="yellow">
                  <p className="font-body text-sm"><strong>⚠️ Catatan Penting:</strong> Persamaan harus diubah ke bentuk <InlineMath math="ax^2 + bx + c = 0" /> terlebih dahulu (semua suku pindah ke kiri, ruas kanan = 0) sebelum mengidentifikasi <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" />.</p>
                </Box>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title="📝 Contoh Soal — Identifikasi Bentuk Umum" />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Tentukan nilai <InlineMath math="a" />, <InlineMath math="b" />, dan <InlineMath math="c" /> dari persamaan <InlineMath math="3x^2 + 7x - 2 = 0" />.</>}
                  pembahasan={<>
                    <p>Persamaan sudah dalam bentuk <InlineMath math="ax^2 + bx + c = 0" />, langsung identifikasi:</p>
                    <Dark>
                      <BlockMath math="3x^2 + 7x + (-2) = 0" />
                    </Dark>
                    <p>✅ <strong>a = 3</strong>, <strong>b = 7</strong>, <strong>c = −2</strong></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Tentukan <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /> dari <InlineMath math="x^2 - 16 = 0" />.</>}
                  pembahasan={<>
                    <p>Persamaan berbentuk <InlineMath math="x^2 + 0 \cdot x - 16 = 0" />. Koefisien <InlineMath math="b = 0" /> karena tidak ada suku <InlineMath math="x" />.</p>
                    <Dark>
                      <BlockMath math="1 \cdot x^2 + 0 \cdot x + (-16) = 0" />
                    </Dark>
                    <p>✅ <strong>a = 1</strong>, <strong>b = 0</strong>, <strong>c = −16</strong></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Ubah ke bentuk umum, lalu identifikasi <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" />: <InlineMath math="5x^2 = 3x - 4" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Pindahkan semua suku ke kiri (ruas kanan = 0):</p>
                    <Dark><BlockMath math="5x^2 - 3x + 4 = 0" /></Dark>
                    <p><strong>Langkah 2:</strong> Identifikasi:</p>
                    <p>✅ <strong>a = 5</strong>, <strong>b = −3</strong>, <strong>c = 4</strong></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Tentukan <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /> dari: <InlineMath math="(x+3)(x-5) = 0" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Kalikan dua binomial (distribusi/FOIL):</p>
                    <Dark><BlockMath math="x^2 - 5x + 3x - 15 = 0" /></Dark>
                    <Dark><BlockMath math="x^2 - 2x - 15 = 0" /></Dark>
                    <p><strong>Langkah 2:</strong> Identifikasi:</p>
                    <p>✅ <strong>a = 1</strong>, <strong>b = −2</strong>, <strong>c = −15</strong></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Ubah ke bentuk umum dan identifikasi koefisiennya: <InlineMath math="\dfrac{x^2 - 1}{2} = 3x + 2" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Kalikan kedua ruas dengan 2 untuk menghilangkan pecahan:</p>
                    <Dark><BlockMath math="x^2 - 1 = 6x + 4" /></Dark>
                    <p><strong>Langkah 2:</strong> Pindahkan semua ke kiri:</p>
                    <Dark><BlockMath math="x^2 - 6x - 5 = 0" /></Dark>
                    <p>✅ <strong>a = 1</strong>, <strong>b = −6</strong>, <strong>c = −5</strong></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Persamaan <InlineMath math="(2x-1)^2 + 3 = 5x" /> apakah merupakan persamaan kuadrat? Jika ya, tentukan <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" />.</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Ekspansi <InlineMath math="(2x-1)^2" />:</p>
                    <Dark><BlockMath math="4x^2 - 4x + 1 + 3 = 5x" /></Dark>
                    <p><strong>Langkah 2:</strong> Pindahkan semua ke kiri:</p>
                    <Dark><BlockMath math="4x^2 - 4x + 4 - 5x = 0" /></Dark>
                    <Dark><BlockMath math="4x^2 - 9x + 4 = 0" /></Dark>
                    <p><strong>Langkah 3:</strong> Cek: <InlineMath math="a = 4 \neq 0" />, jadi ini <strong>persamaan kuadrat</strong>. ✅</p>
                    <p>✅ <strong>a = 4</strong>, <strong>b = −9</strong>, <strong>c = 4</strong></p>
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

export default BentukUmumPage;
