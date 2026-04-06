import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PenerapanKontekstualPage = () => {
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
          <span className="font-body font-semibold text-white">Soal {no}</span>
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
          PENERAPAN PERSAMAAN KUADRAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Persamaan Kuadrat · Permasalahan Kontekstual</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌍 Matematika dalam Kehidupan Nyata" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Persamaan kuadrat bukan hanya ada di buku matematika — ia muncul di mana-mana! Dari <strong>lintasan bola yang dilempar</strong>, <strong>desain kolam renang</strong>, <strong>perhitungan laba-rugi bisnis</strong>, hingga <strong>kecepatan kendaraan</strong>. Di sini, kamu akan belajar menerjemahkan soal cerita menjadi model matematika kuadrat.
                  </p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>⚠️ Hal Penting:</strong> Setelah mendapat akar-akar, selalu <strong>periksa relevansinya</strong> dengan konteks soal. Misalnya, panjang atau waktu tidak bisa negatif!</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="📘 Langkah Menyelesaikan Soal Kontekstual" />
            {expandedSections.includes("teori") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">🎯 Ringkasan Intisari — 5 Langkah Emas</p>
                </Box>
                <Box color="slate">
                  <ol className="font-body text-sm text-white/80 space-y-3 list-decimal list-inside">
                    <li><strong className="text-cyan-300">Baca & Pahami:</strong> Identifikasi apa yang diketahui dan ditanyakan.</li>
                    <li><strong className="text-green-300">Definisikan variabel:</strong> Misalkan besaran yang tidak diketahui dengan <InlineMath math="x" />.</li>
                    <li><strong className="text-yellow-300">Buat model matematika:</strong> Ubah soal menjadi persamaan kuadrat.</li>
                    <li><strong className="text-orange-300">Selesaikan persamaan:</strong> Gunakan pemfaktoran, rumus ABC, atau melengkapi kuadrat.</li>
                    <li><strong className="text-pink-300">Interpretasi & validasi:</strong> Pilih solusi yang masuk akal sesuai konteks.</li>
                  </ol>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title="📝 Soal Kontekstual — Penerapan Persamaan Kuadrat" />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Hasil kali dua bilangan bulat positif berurutan adalah 72. Tentukan kedua bilangan tersebut! 🔢</>}
                  pembahasan={<>
                    <p><strong>Definisikan:</strong> Bilangan pertama = <InlineMath math="x" />, bilangan kedua = <InlineMath math="x + 1" /></p>
                    <Dark><BlockMath math="x(x+1) = 72" /></Dark>
                    <Dark><BlockMath math="x^2 + x - 72 = 0" /></Dark>
                    <p>Faktorkan: <InlineMath math="(x+9)(x-8) = 0" /></p>
                    <p><InlineMath math="x = 8" /> atau <InlineMath math="x = -9" /> (tidak valid karena positif)</p>
                    <p>✅ Kedua bilangan: <strong>8 dan 9</strong></p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Sebuah kebun berbentuk persegi panjang memiliki panjang 5 m lebih dari lebarnya. Jika luasnya 84 m², tentukan dimensi kebun! 🌿</>}
                  pembahasan={<>
                    <p><strong>Misalkan:</strong> Lebar = <InlineMath math="x" /> m, Panjang = <InlineMath math="(x+5)" /> m</p>
                    <Dark><BlockMath math="x(x+5) = 84" /></Dark>
                    <Dark><BlockMath math="x^2 + 5x - 84 = 0" /></Dark>
                    <p>Faktorkan: <InlineMath math="(x+12)(x-7) = 0" /></p>
                    <p><InlineMath math="x = 7" /> (karena lebar tidak boleh negatif)</p>
                    <p>✅ Lebar = <strong>7 m</strong>, Panjang = <strong>12 m</strong></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Sebuah bola dilempar ke atas dengan ketinggian (dalam meter) setelah <InlineMath math="t" /> detik dimodelkan sebagai <InlineMath math="h = -5t^2 + 20t + 1" />. Kapan bola kembali ke ketinggian 16 m? 🏀</>}
                  pembahasan={<>
                    <p>Substitusi <InlineMath math="h = 16" />:</p>
                    <Dark><BlockMath math="-5t^2 + 20t + 1 = 16" /></Dark>
                    <Dark><BlockMath math="-5t^2 + 20t - 15 = 0 \div (-5)" /></Dark>
                    <Dark><BlockMath math="t^2 - 4t + 3 = 0" /></Dark>
                    <p>Faktorkan: <InlineMath math="(t-1)(t-3) = 0" /></p>
                    <p>✅ <InlineMath math="t = 1" /> detik (saat naik) dan <InlineMath math="t = 3" /> detik (saat turun)</p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Seorang pedagang menjual <InlineMath math="x" /> buah jeruk per hari dengan harga <InlineMath math="(20 - x)" /> ribu rupiah per buah. Jika pendapatannya Rp. 96.000, berapa buah yang terjual? 🍊</>}
                  pembahasan={<>
                    <p><strong>Model:</strong> Pendapatan = jumlah × harga</p>
                    <Dark><BlockMath math="x(20 - x) = 96" /></Dark>
                    <Dark><BlockMath math="20x - x^2 = 96" /></Dark>
                    <Dark><BlockMath math="x^2 - 20x + 96 = 0" /></Dark>
                    <p>Faktorkan: <InlineMath math="(x-8)(x-12) = 0" /></p>
                    <p>✅ <InlineMath math="x = 8" /> atau <InlineMath math="x = 12" /> buah (keduanya valid)</p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Sebuah kolam renang berbentuk persegi panjang berukuran 8 m × 6 m. Di sekelilingnya terdapat jalan setapak dengan lebar yang sama. Jika luas total (kolam + jalan) adalah 120 m², tentukan lebar jalan! 🏊‍♂️</>}
                  pembahasan={<>
                    <p><strong>Misalkan</strong> lebar jalan = <InlineMath math="x" /> m</p>
                    <p>Dimensi total: panjang = <InlineMath math="(8 + 2x)" />, lebar = <InlineMath math="(6 + 2x)" /></p>
                    <Dark><BlockMath math="(8 + 2x)(6 + 2x) = 120" /></Dark>
                    <Dark><BlockMath math="48 + 16x + 12x + 4x^2 = 120" /></Dark>
                    <Dark><BlockMath math="4x^2 + 28x - 72 = 0 \div 4" /></Dark>
                    <Dark><BlockMath math="x^2 + 7x - 18 = 0" /></Dark>
                    <p>Faktorkan: <InlineMath math="(x+9)(x-2) = 0" /></p>
                    <p><InlineMath math="x = 2" /> (nilai negatif tidak valid)</p>
                    <p>✅ Lebar jalan = <strong>2 m</strong></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Sebuah kapal berlayar ke arah timur sejauh <InlineMath math="x" /> km, kemudian berbelok ke utara sejauh <InlineMath math="(x+7)" /> km. Jarak lurus dari titik awal ke titik akhir adalah 13 km. Tentukan jarak yang ditempuh ke timur! 🚢</>}
                  pembahasan={<>
                    <p>Gunakan <strong>Teorema Pythagoras</strong>:</p>
                    <Dark><BlockMath math="x^2 + (x+7)^2 = 13^2" /></Dark>
                    <Dark><BlockMath math="x^2 + x^2 + 14x + 49 = 169" /></Dark>
                    <Dark><BlockMath math="2x^2 + 14x - 120 = 0 \div 2" /></Dark>
                    <Dark><BlockMath math="x^2 + 7x - 60 = 0" /></Dark>
                    <p>Faktorkan: <InlineMath math="(x+12)(x-5) = 0" /></p>
                    <p><InlineMath math="x = 5" /> (jarak tidak boleh negatif)</p>
                    <p>✅ Jarak ke timur = <strong>5 km</strong>, ke utara = <strong>12 km</strong></p>
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

export default PenerapanKontekstualPage;
