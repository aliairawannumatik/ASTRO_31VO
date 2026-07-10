import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import AngryBirdParabola from "@/components/AngryBirdParabola";

const PenerapanNilaiMaksMinPage = () => {
  const navigate = useNavigate();
  const allSections = ["intro", "game", "teori", "contoh"];
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
          PENERAPAN FUNGSI KUADRAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-2 font-body">
          Nilai Maksimum & Minimum
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Fungsi Kuadrat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title="🌍 Matematika yang Nyata di Dunia Nyata!" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Fungsi kuadrat bukan hanya ada di buku pelajaran — ia hadir di mana-mana!
                    Dari menghitung <strong>keuntungan maksimum</strong> suatu usaha, menentukan <strong>luas maksimum</strong> sebidang tanah,
                    hingga menghitung <strong>ketinggian tertinggi</strong> bola yang dilempar ke atas 🚀.
                  </p>
                </Box>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kunci dari penerapan ini adalah kemampuan kita menerjemahkan situasi nyata ke dalam
                  <strong> model matematika</strong> berupa fungsi kuadrat, lalu mencari titik puncaknya
                  (nilai optimum yang dicari — maksimum atau minimum).
                </p>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>💡 Strategi Utama:</strong> Nyatakan besaran yang ingin dioptimalkan sebagai fungsi kuadrat satu variabel, lalu cari titik puncaknya menggunakan <InlineMath math="x_p = -\dfrac{b}{2a}" />.</p>
                </Box>
              </div>
            )}
          </div>

          {/* ANGRY BIRD GAME */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="game" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400"
              title="🐦 Simulasi: Angry Math Bird — Lintasan Parabola!" />
            {true && (
              <div className="px-4 pb-5 space-y-3">
                <p className="font-body text-xs text-white/60 leading-relaxed">
                  Tarik burung pada ketapel dan lepaskan! Lintasannya mengikuti <strong className="text-orange-300">fungsi kuadrat h(x) = ax² + bx + c</strong>.
                  Perhatikan bagaimana nilai <em>a</em>, <em>b</em>, <em>c</em> berubah tergantung sudut dan kekuatan lemparanmu.
                </p>
                <AngryBirdParabola />
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title="📘 Langkah Penerapan & Rumus Optimum" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">🎯 Ringkasan Intisari</p>
                  <div className="space-y-2">
                    {[
                      { no: "1", color: "text-cyan-300", label: "Pahami situasi masalah", desc: "Identifikasi variabel dan besaran yang dicari (maksimum/minimum)" },
                      { no: "2", color: "text-green-300", label: "Buat model fungsi kuadrat", desc: "Nyatakan besaran yang dioptimalkan sebagai f(x) = ax² + bx + c" },
                      { no: "3", color: "text-yellow-300", label: "Tentukan titik puncak", desc: "Hitung xₚ = -b/2a dan yₚ = f(xₚ)" },
                      { no: "4", color: "text-orange-300", label: "Interpretasikan hasil", desc: "Kembalikan ke konteks masalah: apa arti xₚ dan yₚ?" },
                    ].map(({ no, color, label, desc }) => (
                      <div key={no} className="flex gap-3 items-start">
                        <span className={`font-bold ${color} shrink-0`}>{no}.</span>
                        <div>
                          <p className={`font-body text-xs font-semibold ${color}`}>{label}</p>
                          <p className="font-body text-xs text-white/60">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-2">📈 Nilai Minimum</p>
                    <p className="font-body text-xs text-white/70">Terjadi jika <InlineMath math="a > 0" /> (parabola terbuka ke atas)</p>
                    <Dark><BlockMath math="y_{\min} = f\!\left(-\frac{b}{2a}\right) = \frac{4ac-b^2}{4a}" /></Dark>
                  </Box>
                  <Box color="red">
                    <p className="font-body text-xs font-bold text-red-300 mb-2">📉 Nilai Maksimum</p>
                    <p className="font-body text-xs text-white/70">Terjadi jika <InlineMath math="a < 0" /> (parabola terbuka ke bawah)</p>
                    <Dark><BlockMath math="y_{\max} = f\!\left(-\frac{b}{2a}\right) = \frac{4ac-b^2}{4a}" /></Dark>
                  </Box>
                </div>

                <Box color="blue">
                  <p className="font-body text-sm"><strong>🌐 Konteks Nyata yang Sering Muncul:</strong></p>
                  <ul className="mt-2 space-y-1 font-body text-xs text-white/70 list-none">
                    <li>🏗️ <strong>Luas/Keliling:</strong> optimasi bentuk persegi panjang dengan batasan keliling</li>
                    <li>💰 <strong>Keuntungan/Pendapatan:</strong> model bisnis dengan biaya dan harga jual</li>
                    <li>🎯 <strong>Fisika:</strong> ketinggian maksimum benda yang dilempar ke atas</li>
                    <li>🌾 <strong>Pertanian:</strong> luas panen maksimum dengan pagar terbatas</li>
                  </ul>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title="📝 Contoh Soal — Penerapan Fungsi Kuadrat" />
            {true && (
              <div className="px-5 pb-5 space-y-7">

                <ExampleBlock level="MUDAH" no={1}
                  soal={<>Sebuah bola dilempar ke atas. Ketinggiannya (dalam meter) dinyatakan dengan <InlineMath math="h(t) = -5t^2 + 20t + 2" />, di mana <InlineMath math="t" /> adalah waktu dalam detik. Tentukan ketinggian maksimum bola.</>}
                  pembahasan={<>
                    <p><InlineMath math="a = -5 < 0" /> → ada nilai maksimum ✅</p>
                    <p><strong>Waktu saat ketinggian maksimum:</strong></p>
                    <Dark><BlockMath math="t_p = -\frac{20}{2(-5)} = -\frac{20}{-10} = 2 \text{ detik}" /></Dark>
                    <p><strong>Ketinggian maksimum:</strong></p>
                    <Dark><BlockMath math="h(2) = -5(4) + 20(2) + 2 = -20 + 40 + 2 = 22 \text{ meter}" /></Dark>
                    <p>✅ Ketinggian maksimum bola adalah <strong>22 meter</strong> yang dicapai pada <strong>t = 2 detik</strong>.</p>
                  </>}
                />

                <ExampleBlock level="MUDAH" no={2}
                  soal={<>Sebuah kebun berbentuk persegi panjang dengan panjang <InlineMath math="(20 - x)" /> meter dan lebar <InlineMath math="x" /> meter. Tentukan nilai <InlineMath math="x" /> agar luasnya maksimum, dan berapa luas maksimumnya?</>}
                  pembahasan={<>
                    <p><strong>Model fungsi luas:</strong></p>
                    <Dark><BlockMath math="L(x) = x(20 - x) = -x^2 + 20x" /></Dark>
                    <p><InlineMath math="a = -1 < 0" /> → ada nilai maksimum.</p>
                    <p><strong>Nilai x optimal:</strong></p>
                    <Dark><BlockMath math="x_p = -\frac{20}{2(-1)} = 10" /></Dark>
                    <p><strong>Luas maksimum:</strong></p>
                    <Dark><BlockMath math="L(10) = -(100) + 200 = 100 \text{ m}^2" /></Dark>
                    <p>✅ Luas maksimum <strong>100 m²</strong> saat panjang = lebar = <strong>10 m</strong> (berbentuk persegi!).</p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={3}
                  soal={<>Harga tiket konser: jika harga tiket <InlineMath math="x" /> ribu rupiah, maka jumlah penonton yang datang adalah <InlineMath math="(300 - 2x)" /> orang. Tentukan harga tiket agar pendapatan total maksimum.</>}
                  pembahasan={<>
                    <p><strong>Model pendapatan total:</strong></p>
                    <Dark><BlockMath math="P(x) = x \cdot (300 - 2x) = -2x^2 + 300x" /></Dark>
                    <p><InlineMath math="a = -2 < 0" /> → ada nilai maksimum.</p>
                    <p><strong>Harga tiket optimal:</strong></p>
                    <Dark><BlockMath math="x_p = -\frac{300}{2(-2)} = \frac{300}{4} = 75 \text{ ribu rupiah}" /></Dark>
                    <p><strong>Pendapatan maksimum:</strong></p>
                    <Dark><BlockMath math="P(75) = -2(5625) + 300(75) = -11250 + 22500 = 11250 \text{ ribu rupiah}" /></Dark>
                    <p>✅ Harga tiket optimal: <strong>Rp75.000</strong>, pendapatan maksimum: <strong>Rp11.250.000</strong></p>
                  </>}
                />

                <ExampleBlock level="SEDANG" no={4}
                  soal={<>Seorang petani memiliki kawat pagar 60 m untuk memagari kebun berbentuk persegi panjang di tepi sungai (sisi yang berbatasan sungai tidak perlu dipagar). Tentukan dimensi agar luas kebun maksimum.</>}
                  pembahasan={<>
                    <p>Misal lebar kebun = <InlineMath math="x" /> m (tegak lurus sungai). Panjang kebun = <InlineMath math="(60 - 2x)" /> m.</p>
                    <p><strong>Syarat:</strong> <InlineMath math="x > 0" /> dan <InlineMath math="60 - 2x > 0 \implies x < 30" /></p>
                    <p><strong>Model luas:</strong></p>
                    <Dark><BlockMath math="L(x) = x(60 - 2x) = -2x^2 + 60x" /></Dark>
                    <p><strong>Lebar optimal:</strong></p>
                    <Dark><BlockMath math="x_p = -\frac{60}{2(-2)} = 15 \text{ m}" /></Dark>
                    <p><strong>Panjang:</strong> <InlineMath math="60 - 2(15) = 30" /> m</p>
                    <p><strong>Luas maksimum:</strong> <InlineMath math="15 \times 30 = 450 \text{ m}^2" /></p>
                    <p>✅ Dimensi optimal: <strong>15 m × 30 m</strong>, luas <strong>450 m²</strong></p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={5}
                  soal={<>Sebuah peluru ditembakkan dengan ketinggian <InlineMath math="h(t) = -4t^2 + 32t" /> meter. Tentukan: (a) ketinggian maksimum, (b) waktu saat peluru kembali ke tanah, (c) total waktu di udara.</>}
                  pembahasan={<>
                    <p><strong>(a) Ketinggian maksimum:</strong></p>
                    <Dark><BlockMath math="t_p = -\frac{32}{2(-4)} = 4 \text{ detik}" /></Dark>
                    <Dark><BlockMath math="h(4) = -4(16) + 32(4) = -64 + 128 = 64 \text{ meter}" /></Dark>
                    <p><strong>(b) Saat kembali ke tanah:</strong> <InlineMath math="h(t) = 0" /></p>
                    <Dark><BlockMath math="-4t^2 + 32t = 0 \implies -4t(t - 8) = 0" /></Dark>
                    <p><InlineMath math="t = 0" /> (saat ditembak) atau <InlineMath math="t = 8" /> detik (saat mendarat)</p>
                    <p><strong>(c) Total waktu di udara: 8 detik</strong></p>
                    <p>✅ Ketinggian maks: <strong>64 m</strong> pada t = 4s. Mendarat saat <strong>t = 8 detik</strong>.</p>
                  </>}
                />

                <ExampleBlock level="SULIT" no={6}
                  soal={<>Sebuah toko menjual <InlineMath math="(100 - 2p)" /> unit produk per hari jika harga satuan <InlineMath math="p" /> ribu rupiah. Biaya produksi per unit adalah 10 ribu rupiah dan biaya tetap per hari 200 ribu rupiah. Tentukan harga jual <InlineMath math="p" /> agar keuntungan harian maksimum dan berapa keuntungan maksimumnya.</>}
                  pembahasan={<>
                    <p><strong>Jumlah unit terjual:</strong> <InlineMath math="n = 100 - 2p" /></p>
                    <p><strong>Pendapatan total:</strong> <InlineMath math="R = p \cdot n = p(100 - 2p) = -2p^2 + 100p" /></p>
                    <p><strong>Biaya total:</strong> <InlineMath math="C = 10n + 200 = 10(100-2p) + 200 = 1200 - 20p" /></p>
                    <p><strong>Keuntungan:</strong></p>
                    <Dark><BlockMath math="\pi(p) = R - C = -2p^2 + 100p - 1200 + 20p = -2p^2 + 120p - 1200" /></Dark>
                    <p><strong>Harga optimal:</strong></p>
                    <Dark><BlockMath math="p_p = -\frac{120}{2(-2)} = 30 \text{ ribu rupiah}" /></Dark>
                    <p><strong>Keuntungan maksimum:</strong></p>
                    <Dark><BlockMath math="\pi(30) = -2(900) + 120(30) - 1200 = -1800 + 3600 - 1200 = 600 \text{ ribu rupiah}" /></Dark>
                    <p>✅ Harga jual optimal: <strong>Rp30.000/unit</strong>. Keuntungan maksimum: <strong>Rp600.000/hari</strong></p>
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

export default PenerapanNilaiMaksMinPage;
