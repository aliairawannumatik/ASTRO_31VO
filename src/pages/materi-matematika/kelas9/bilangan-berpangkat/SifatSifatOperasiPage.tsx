import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const SifatSifatOperasiPage = () => {
  const navigate = useNavigate();
  const allSections = [
    "intro",
    "k1","c1","k2","c2","k3","c3","k4","c4",
    "k5","c5","k6","c6","k7","c7","k8","c8","k9","c9",
  ];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor: string; title: React.ReactNode }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expandedSections.includes(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const Card = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      {children}
      {expandedSections.includes(id) && null}
    </div>
  );

  /* ─── helpers ─── */
  const DiffBadge = ({ level }: { level: "MUDAH" | "SEDANG" | "SULIT" }) => {
    const map = {
      MUDAH: "bg-green-500/20 text-green-400 border-green-500",
      SEDANG: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
      SULIT: "bg-red-500/20 text-red-400 border-red-500",
    };
    const bar = { MUDAH: "border-green-500", SEDANG: "border-yellow-500", SULIT: "border-red-500" };
    return { badge: map[level], bar: bar[level] };
  };

  const ExampleBlock = ({
    level, title, soal, pembahasan,
  }: {
    level: "MUDAH" | "SEDANG" | "SULIT";
    title: string;
    soal: React.ReactNode;
    pembahasan: React.ReactNode;
  }) => {
    const { badge, bar } = DiffBadge({ level });
    return (
      <div className={`border-l-4 ${bar} pl-4 space-y-3`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${badge}`}>{level}</span>
          <span className="font-body font-semibold text-white">{title}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 font-body text-sm text-white">{soal}</div>
        <div className={`border ${bar.replace("border-", "border-").replace("500", "500/20")} rounded-lg p-4`}
          style={{ background: level === "MUDAH" ? "rgba(34,197,94,0.03)" : level === "SEDANG" ? "rgba(234,179,8,0.03)" : "rgba(239,68,68,0.03)" }}>
          <p className={`font-body text-xs font-semibold mb-3 ${level === "MUDAH" ? "text-green-400" : level === "SEDANG" ? "text-yellow-400" : "text-red-400"}`}>
            PEMBAHASAN:
          </p>
          <div className="space-y-3 font-body text-sm text-white/80">{pembahasan}</div>
        </div>
      </div>
    );
  };

  const Box = ({ color, children }: { color: string; children: React.ReactNode }) => {
    const map: Record<string, string> = {
      cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-200",
      green: "bg-green-500/10 border-green-500/30",
      yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
      purple: "bg-purple-500/10 border-purple-500/30",
      orange: "bg-orange-500/10 border-orange-500/30",
      blue: "bg-blue-500/10 border-blue-500/30",
      pink: "bg-pink-500/10 border-pink-500/30",
      slate: "bg-slate-900/50 border-slate-700/30",
    };
    return <div className={`border rounded-lg p-4 ${map[color] || map.slate}`}>{children}</div>;
  };

  const Dark = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-slate-900/50 rounded p-3">{children}</div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Bilangan Berpangkat · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ─────────── INTRO ─────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400"
              title="Kenapa Kita Butuh Sifat-Sifat Pangkat?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan kamu harus menghitung <InlineMath math="2^{10} \times 2^{15}" />. Kalau ditulis penuh, itu <strong>25 kali perkalian</strong>! Tapi dengan sifat-sifat pangkat, kamu bisa selesaikan dalam hitungan detik. Sifat-sifat ini bukan sulap — semuanya punya logika yang bisa kamu turunkan sendiri.
                </p>
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">
                    Ada <strong>9 sifat utama</strong> bilangan berpangkat. Kuasai semuanya dan kamu akan jago menyederhanakan ekspresi matematika yang tampak rumit sekalipun! 🚀
                  </p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm"><strong>Tips:</strong> Pelajari <em>cara menurunkan</em> rumusnya, bukan cuma menghafalnya. Jika lupa, kamu bisa reconstruct sendiri!</p>
                </Box>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════
              SIFAT 1: a^m × a^n = a^(m+n)
          ═══════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400"
              title={<span>📘 Sifat 1: <InlineMath math="a^m \times a^n = a^{m+n}" /></span>} />
            {expandedSections.includes("k1") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="green">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika dua bilangan berpangkat dengan <strong className="text-green-300">basis yang sama</strong> dikalikan, cukup <strong className="text-green-300">jumlahkan pangkatnya</strong> saja. Basis tidak berubah.
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🔍 ASAL USUL RUMUS:</p>
                  <p className="font-body text-xs text-white/70 mb-2">Ekspansi langsung dari definisi perkalian berulang:</p>
                  <BlockMath math="a^m \times a^n = \underbrace{(a \times a \times \cdots \times a)}_{m} \times \underbrace{(a \times a \times \cdots \times a)}_{n} = \underbrace{a \times a \times \cdots \times a}_{m+n} = a^{m+n}" />
                  <p className="font-body text-xs text-white/60 mt-2">Contoh konkret: <InlineMath math="2^3 \times 2^4 = (2\cdot2\cdot2)\times(2\cdot2\cdot2\cdot2) = 2^7 = 128" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>Catatan:</strong> Sifat ini hanya berlaku jika <strong>basisnya sama</strong>! <InlineMath math="2^3 \times 3^2" /> tidak bisa digabung.</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c1" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title={<span>📝 Contoh Soal — Sifat 1: <InlineMath math="a^m \times a^n" /></span>} />
            {expandedSections.includes("c1") && (
              <div className="px-5 pb-5 space-y-6">
                <ExampleBlock level="MUDAH" title="Contoh 1"
                  soal={<>Sederhanakan: <InlineMath math="5^3 \times 5^6" /></>}
                  pembahasan={<>
                    <p><strong>Basis sama (5)</strong>, jumlahkan pangkat:</p>
                    <Dark><BlockMath math="5^3 \times 5^6 = 5^{3+6} = 5^9" /></Dark>
                    <p>Nilai: <InlineMath math="5^9 = 1.953.125" /></p>
                  </>}
                />
                <ExampleBlock level="SEDANG" title="Contoh 2"
                  soal={<>Sederhanakan: <InlineMath math="x^4 \cdot x^3 \cdot x^2" /></>}
                  pembahasan={<>
                    <p><strong>Tiga faktor dengan basis sama</strong>, semua pangkat dijumlahkan sekaligus:</p>
                    <Dark><BlockMath math="x^4 \cdot x^3 \cdot x^2 = x^{4+3+2} = x^9" /></Dark>
                  </>}
                />
                <ExampleBlock level="SULIT" title="Contoh 3"
                  soal={<>Jika <InlineMath math="2^a \times 2^3 = 2^7" />, tentukan nilai <InlineMath math="a" />!</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Terapkan sifat perkalian pangkat:</p>
                    <Dark><BlockMath math="2^a \times 2^3 = 2^{a+3}" /></Dark>
                    <p><strong>Langkah 2:</strong> Samakan dengan ruas kanan:</p>
                    <Dark><BlockMath math="2^{a+3} = 2^7 \implies a+3 = 7 \implies a = 4" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════
              SIFAT 2: a^m / a^n = a^(m-n)
          ═══════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k2" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400"
              title={<span>📘 Sifat 2: <InlineMath math="a^m \div a^n = a^{m-n}" /></span>} />
            {expandedSections.includes("k2") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm leading-relaxed">
                    Ketika basis yang sama <strong className="text-cyan-300">dibagi</strong>, cukup <strong className="text-cyan-300">kurangkan pangkat penyebut dari pangkat pembilang</strong>. Berlaku selama <InlineMath math="a \neq 0" />.
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🔍 ASAL USUL RUMUS:</p>
                  <p className="font-body text-xs text-white/70 mb-2">Anggap <InlineMath math="m > n" />. Masing-masing faktor <InlineMath math="a" /> yang sama di atas dan bawah saling menghilangkan:</p>
                  <BlockMath math="\frac{a^m}{a^n} = \frac{\overbrace{a \times a \times \cdots \times a}^{m}}{\underbrace{a \times a \times \cdots \times a}_{n}} = \underbrace{a \times a \times \cdots \times a}_{m-n} = a^{m-n}" />
                  <p className="font-body text-xs text-white/60 mt-2">Contoh: <InlineMath math="\frac{3^5}{3^2} = \frac{3\cdot3\cdot3\cdot\cancel{3}\cdot\cancel{3}}{\cancel{3}\cdot\cancel{3}} = 3^3 = 27" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>Catatan:</strong> Jika <InlineMath math="m = n" />, hasilnya <InlineMath math="a^0 = 1" />. Jika <InlineMath math="m < n" />, hasilnya pangkat negatif (lihat Sifat 7).</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c2" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400"
              title={<span>📝 Contoh Soal — Sifat 2: <InlineMath math="a^m \div a^n" /></span>} />
            {expandedSections.includes("c2") && (
              <div className="px-5 pb-5 space-y-6">
                <ExampleBlock level="MUDAH" title="Contoh 1"
                  soal={<>Sederhanakan: <InlineMath math="\dfrac{7^8}{7^5}" /></>}
                  pembahasan={<>
                    <p>Basis sama, kurangkan pangkat:</p>
                    <Dark><BlockMath math="\frac{7^8}{7^5} = 7^{8-5} = 7^3 = 343" /></Dark>
                  </>}
                />
                <ExampleBlock level="SEDANG" title="Contoh 2"
                  soal={<>Sederhanakan: <InlineMath math="\dfrac{y^{10}}{y^4 \cdot y^2}" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Sederhanakan penyebut dengan Sifat 1:</p>
                    <Dark><BlockMath math="y^4 \cdot y^2 = y^{4+2} = y^6" /></Dark>
                    <p><strong>Langkah 2:</strong> Gunakan Sifat 2:</p>
                    <Dark><BlockMath math="\frac{y^{10}}{y^6} = y^{10-6} = y^4" /></Dark>
                  </>}
                />
                <ExampleBlock level="SULIT" title="Contoh 3"
                  soal={<>Jika <InlineMath math="\dfrac{3^n}{3^4} = 81" />, tentukan <InlineMath math="n" />!</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Ubah 81 ke pangkat 3:</p>
                    <Dark><BlockMath math="81 = 3^4" /></Dark>
                    <p><strong>Langkah 2:</strong> Terapkan sifat pembagian:</p>
                    <Dark><BlockMath math="3^{n-4} = 3^4 \implies n-4 = 4 \implies n = 8" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════
              SIFAT 3: (a^m)^n = a^mn
          ═══════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k3" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400"
              title={<span>📘 Sifat 3: <InlineMath math="(a^m)^n = a^{mn}" /></span>} />
            {expandedSections.includes("k3") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika suatu bilangan berpangkat <strong className="text-purple-300">dipangkatkan lagi</strong>, cukup <strong className="text-purple-300">kalikan kedua pangkatnya</strong>. Ini disebut <em>pangkat dari pangkat</em>.
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🔍 ASAL USUL RUMUS:</p>
                  <p className="font-body text-xs text-white/70 mb-2">Gunakan Sifat 1 berulang kali:</p>
                  <BlockMath math="(a^m)^n = \underbrace{a^m \times a^m \times \cdots \times a^m}_{n \text{ kali}} = a^{\underbrace{m+m+\cdots+m}_{n}} = a^{mn}" />
                  <p className="font-body text-xs text-white/60 mt-2">Contoh: <InlineMath math="(2^3)^4 = 2^{3 \times 4} = 2^{12} = 4096" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>Catatan:</strong> Jangan keliru! <InlineMath math="(a^m)^n \neq a^{m^n}" />. Yang benar adalah <InlineMath math="a^{m \times n}" />, bukan <InlineMath math="a" /> dipangkat <InlineMath math="m^n" />.</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c3" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400"
              title={<span>📝 Contoh Soal — Sifat 3: <InlineMath math="(a^m)^n" /></span>} />
            {expandedSections.includes("c3") && (
              <div className="px-5 pb-5 space-y-6">
                <ExampleBlock level="MUDAH" title="Contoh 1"
                  soal={<>Sederhanakan: <InlineMath math="(3^4)^5" /></>}
                  pembahasan={<>
                    <p>Kalikan pangkatnya:</p>
                    <Dark><BlockMath math="(3^4)^5 = 3^{4 \times 5} = 3^{20}" /></Dark>
                  </>}
                />
                <ExampleBlock level="SEDANG" title="Contoh 2"
                  soal={<>Sederhanakan: <InlineMath math="((x^2)^3)^4" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Kerjakan dari dalam ke luar:</p>
                    <Dark>
                      <BlockMath math="(x^2)^3 = x^{2 \times 3} = x^6" />
                      <BlockMath math="(x^6)^4 = x^{6 \times 4} = x^{24}" />
                    </Dark>
                    <p>Atau langsung: <InlineMath math="x^{2 \times 3 \times 4} = x^{24}" /></p>
                  </>}
                />
                <ExampleBlock level="SULIT" title="Contoh 3"
                  soal={<>Jika <InlineMath math="(5^a)^3 = 5^{21}" />, tentukan <InlineMath math="a" />, lalu hitung <InlineMath math="(5^a)^2" />!</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Terapkan sifat 3:</p>
                    <Dark><BlockMath math="5^{3a} = 5^{21} \implies 3a = 21 \implies a = 7" /></Dark>
                    <p><strong>Langkah 2:</strong> Hitung <InlineMath math="(5^7)^2" />:</p>
                    <Dark><BlockMath math="(5^7)^2 = 5^{14}" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════
              SIFAT 4: (a.b)^n = a^n . b^n
          ═══════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k4" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400"
              title={<span>📘 Sifat 4: <InlineMath math="(a \cdot b)^n = a^n \cdot b^n" /></span>} />
            {expandedSections.includes("k4") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="orange">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Pangkat dari sebuah <strong className="text-orange-300">perkalian</strong> bisa <strong className="text-orange-300">didistribusikan</strong> ke masing-masing faktornya. Seperti berbagi "beban pangkat" secara merata.
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🔍 ASAL USUL RUMUS:</p>
                  <BlockMath math="(a \cdot b)^n = \underbrace{(ab)(ab)\cdots(ab)}_{n} = \underbrace{(a \cdot a \cdots a)}_{n} \cdot \underbrace{(b \cdot b \cdots b)}_{n} = a^n \cdot b^n" />
                  <p className="font-body text-xs text-white/60 mt-2">Contoh: <InlineMath math="(2 \cdot 3)^4 = 2^4 \cdot 3^4 = 16 \cdot 81 = 1296 = 6^4" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>Tips:</strong> Berlaku juga untuk lebih dari dua faktor: <InlineMath math="(abc)^n = a^n b^n c^n" />. Distribusikan ke semua!</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c4" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400"
              title={<span>📝 Contoh Soal — Sifat 4: <InlineMath math="(a \cdot b)^n" /></span>} />
            {expandedSections.includes("c4") && (
              <div className="px-5 pb-5 space-y-6">
                <ExampleBlock level="MUDAH" title="Contoh 1"
                  soal={<>Hitunglah: <InlineMath math="(2 \cdot 5)^3" /></>}
                  pembahasan={<>
                    <p>Distribusikan pangkat:</p>
                    <Dark><BlockMath math="(2 \cdot 5)^3 = 2^3 \cdot 5^3 = 8 \cdot 125 = 1000" /></Dark>
                    <p>Verifikasi: <InlineMath math="10^3 = 1000" /> ✓</p>
                  </>}
                />
                <ExampleBlock level="SEDANG" title="Contoh 2"
                  soal={<>Sederhanakan: <InlineMath math="(3x^2y)^4" /></>}
                  pembahasan={<>
                    <p>Distribusikan pangkat ke setiap faktor:</p>
                    <Dark><BlockMath math="(3x^2y)^4 = 3^4 \cdot (x^2)^4 \cdot y^4 = 81x^8y^4" /></Dark>
                  </>}
                />
                <ExampleBlock level="SULIT" title="Contoh 3"
                  soal={<>Sederhanakan: <InlineMath math="(2a^3b^2)^3 \times (3a^2b)^2" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Ekspansi masing-masing:</p>
                    <Dark>
                      <BlockMath math="(2a^3b^2)^3 = 2^3 a^9 b^6 = 8a^9b^6" />
                      <BlockMath math="(3a^2b)^2 = 3^2 a^4 b^2 = 9a^4b^2" />
                    </Dark>
                    <p><strong>Langkah 2:</strong> Kalikan, gabungkan basis yang sama:</p>
                    <Dark><BlockMath math="8a^9b^6 \times 9a^4b^2 = 72\,a^{9+4}b^{6+2} = 72a^{13}b^8" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════
              SIFAT 5: (a/b)^n = a^n / b^n
          ═══════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k5" icon={<Target className="w-5 h-5" />} iconColor="text-pink-400"
              title={<span>📘 Sifat 5: <InlineMath math="\left(\dfrac{a}{b}\right)^n = \dfrac{a^n}{b^n}" /></span>} />
            {expandedSections.includes("k5") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="pink">
                  <p className="font-body text-sm font-semibold text-pink-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Pangkat dari sebuah <strong className="text-pink-300">pecahan</strong> bisa didistribusikan secara terpisah ke <strong className="text-pink-300">pembilang dan penyebut</strong>. Berlaku selama <InlineMath math="b \neq 0" />.
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🔍 ASAL USUL RUMUS:</p>
                  <BlockMath math="\left(\frac{a}{b}\right)^n = \underbrace{\frac{a}{b} \cdot \frac{a}{b} \cdots \frac{a}{b}}_{n} = \frac{a \cdot a \cdots a}{b \cdot b \cdots b} = \frac{a^n}{b^n}" />
                  <p className="font-body text-xs text-white/60 mt-2">Contoh: <InlineMath math="\left(\frac{3}{4}\right)^2 = \frac{3^2}{4^2} = \frac{9}{16}" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>Tips:</strong> Ini adalah kebalikan dari Sifat 4 — tapi untuk pembagian. Logikanya sama persis!</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c5" icon={<Calculator className="w-5 h-5" />} iconColor="text-pink-400"
              title={<span>📝 Contoh Soal — Sifat 5: <InlineMath math="(a/b)^n" /></span>} />
            {expandedSections.includes("c5") && (
              <div className="px-5 pb-5 space-y-6">
                <ExampleBlock level="MUDAH" title="Contoh 1"
                  soal={<>Hitunglah: <InlineMath math="\left(\dfrac{2}{3}\right)^5" /></>}
                  pembahasan={<>
                    <Dark><BlockMath math="\left(\frac{2}{3}\right)^5 = \frac{2^5}{3^5} = \frac{32}{243}" /></Dark>
                  </>}
                />
                <ExampleBlock level="SEDANG" title="Contoh 2"
                  soal={<>Sederhanakan: <InlineMath math="\left(\dfrac{x^3}{y^2}\right)^4" /></>}
                  pembahasan={<>
                    <Dark><BlockMath math="\left(\frac{x^3}{y^2}\right)^4 = \frac{(x^3)^4}{(y^2)^4} = \frac{x^{12}}{y^8}" /></Dark>
                  </>}
                />
                <ExampleBlock level="SULIT" title="Contoh 3"
                  soal={<>Sederhanakan: <InlineMath math="\left(\dfrac{2a^2}{3b}\right)^3 \div \left(\dfrac{4a}{9b^2}\right)" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Ekspansi perpangkatan:</p>
                    <Dark><BlockMath math="\left(\frac{2a^2}{3b}\right)^3 = \frac{8a^6}{27b^3}" /></Dark>
                    <p><strong>Langkah 2:</strong> Bagi (kalikan dengan kebalikan penyebut):</p>
                    <Dark><BlockMath math="\frac{8a^6}{27b^3} \div \frac{4a}{9b^2} = \frac{8a^6}{27b^3} \times \frac{9b^2}{4a} = \frac{72a^6b^2}{108ab^3} = \frac{2a^5}{3b}" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════
              SIFAT 6: a^0 = 1
          ═══════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k6" icon={<Target className="w-5 h-5" />} iconColor="text-blue-400"
              title={<span>📘 Sifat 6: <InlineMath math="a^0 = 1" /> <InlineMath math="(a \neq 0)" /></span>} />
            {expandedSections.includes("k6") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="blue">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Bilangan apa pun (kecuali nol) yang dipangkatkan nol selalu menghasilkan <strong className="text-blue-300">1</strong>. Ini bukan definisi sembarangan — ada logika matematika yang mendasarinya!
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🔍 ASAL USUL RUMUS (2 cara):</p>
                  <p className="font-body text-xs font-semibold text-blue-300 mt-2 mb-1">Cara 1 — Pola Pembagian:</p>
                  <BlockMath math="\frac{a^n}{a^n} = a^{n-n} = a^0 \quad \text{dan} \quad \frac{a^n}{a^n} = 1 \implies a^0 = 1" />
                  <p className="font-body text-xs font-semibold text-blue-300 mt-3 mb-1">Cara 2 — Pola Deret:</p>
                  <div className="bg-slate-800/50 rounded p-3 text-xs font-body text-white/70 space-y-1">
                    <p><InlineMath math="2^4 = 16,\; 2^3 = 8,\; 2^2 = 4,\; 2^1 = 2,\; 2^0 = ?" /></p>
                    <p>Setiap turun satu pangkat, nilainya dibagi 2 → maka <InlineMath math="2^0 = 2 \div 2 = 1" /></p>
                  </div>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>Catatan Penting:</strong> <InlineMath math="0^0" /> <strong>tidak terdefinisi</strong>! Hanya <InlineMath math="a^0 = 1" /> jika <InlineMath math="a \neq 0" />.</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c6" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400"
              title={<span>📝 Contoh Soal — Sifat 6: <InlineMath math="a^0 = 1" /></span>} />
            {expandedSections.includes("c6") && (
              <div className="px-5 pb-5 space-y-6">
                <ExampleBlock level="MUDAH" title="Contoh 1"
                  soal={<>Hitunglah: <InlineMath math="7^0 + 100^0 + (0{,}5)^0" /></>}
                  pembahasan={<>
                    <p>Setiap basis (bukan nol) dipangkat nol = 1:</p>
                    <Dark><BlockMath math="7^0 + 100^0 + (0{,}5)^0 = 1 + 1 + 1 = 3" /></Dark>
                  </>}
                />
                <ExampleBlock level="SEDANG" title="Contoh 2"
                  soal={<>Sederhanakan: <InlineMath math="(3x^2y^5)^0 + 5x^0" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Seluruh ekspresi dalam kurung dipangkat nol:</p>
                    <Dark><BlockMath math="(3x^2y^5)^0 = 1" /></Dark>
                    <p><strong>Langkah 2:</strong> <InlineMath math="x^0 = 1" />, jadi <InlineMath math="5x^0 = 5 \cdot 1 = 5" />:</p>
                    <Dark><BlockMath math="1 + 5 = 6" /></Dark>
                  </>}
                />
                <ExampleBlock level="SULIT" title="Contoh 3"
                  soal={<>Jika <InlineMath math="(2x-6)^0 = 1" /> dengan <InlineMath math="x \neq 3" />, apakah ada nilai <InlineMath math="x" /> yang <strong>tidak memenuhi</strong>? Jelaskan!</>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> <InlineMath math="a^0 = 1" /> berlaku untuk semua <InlineMath math="a \neq 0" />, maka <InlineMath math="(2x-6) \neq 0" />.</p>
                    <Dark><BlockMath math="2x - 6 \neq 0 \implies x \neq 3" /></Dark>
                    <p><strong>Kesimpulan:</strong> Nilai <InlineMath math="x = 3" /> <strong className="text-red-400">tidak memenuhi</strong> karena membuat basisnya nol sehingga ekspresi tidak terdefinisi.</p>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════
              SIFAT 7: a^(-n) = 1/a^n
          ═══════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k7" icon={<Target className="w-5 h-5" />} iconColor="text-red-400"
              title={<span>📘 Sifat 7: <InlineMath math="a^{-n} = \dfrac{1}{a^n}" /></span>} />
            {expandedSections.includes("k7") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="slate">
                  <p className="font-body text-sm font-semibold text-slate-200 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Pangkat negatif bukan berarti hasilnya negatif! Pangkat negatif artinya bilangan tersebut pindah ke posisi <strong className="text-red-300">kebalikannya</strong> (di bawah garis pecahan). <InlineMath math="a^{-n}" /> adalah <strong className="text-red-300">kebalikan</strong> dari <InlineMath math="a^n" />.
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🔍 ASAL USUL RUMUS:</p>
                  <p className="font-body text-xs text-white/70 mb-1">Turunkan dari Sifat 2 dengan <InlineMath math="m = 0" />:</p>
                  <BlockMath math="\frac{a^0}{a^n} = a^{0-n} = a^{-n} \quad \text{dan} \quad \frac{a^0}{a^n} = \frac{1}{a^n} \implies a^{-n} = \frac{1}{a^n}" />
                  <p className="font-body text-xs text-white/60 mt-2">Contoh: <InlineMath math="2^{-3} = \frac{1}{2^3} = \frac{1}{8}" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>Tips:</strong> Pangkat negatif = "pindah posisi". Di pembilang berpangkat negatif → turun ke penyebut jadi positif. Di penyebut berpangkat negatif → naik ke pembilang jadi positif!</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c7" icon={<Calculator className="w-5 h-5" />} iconColor="text-red-400"
              title={<span>📝 Contoh Soal — Sifat 7: <InlineMath math="a^{-n}" /></span>} />
            {expandedSections.includes("c7") && (
              <div className="px-5 pb-5 space-y-6">
                <ExampleBlock level="MUDAH" title="Contoh 1"
                  soal={<>Nyatakan dalam bentuk pecahan positif: <InlineMath math="4^{-3}" /></>}
                  pembahasan={<>
                    <Dark><BlockMath math="4^{-3} = \frac{1}{4^3} = \frac{1}{64}" /></Dark>
                  </>}
                />
                <ExampleBlock level="SEDANG" title="Contoh 2"
                  soal={<>Sederhanakan: <InlineMath math="\dfrac{x^{-3}}{y^{-5}}" /></>}
                  pembahasan={<>
                    <p>Pangkat negatif pindah posisi:</p>
                    <Dark><BlockMath math="\frac{x^{-3}}{y^{-5}} = \frac{y^5}{x^3}" /></Dark>
                  </>}
                />
                <ExampleBlock level="SULIT" title="Contoh 3"
                  soal={<>Sederhanakan: <InlineMath math="\dfrac{2^{-2} \cdot 3^3}{2^3 \cdot 3^{-1}}" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Kelompokkan basis yang sama:</p>
                    <Dark><BlockMath math="\frac{2^{-2}}{2^3} \cdot \frac{3^3}{3^{-1}} = 2^{-2-3} \cdot 3^{3-(-1)} = 2^{-5} \cdot 3^4" /></Dark>
                    <p><strong>Langkah 2:</strong> Ubah pangkat negatif:</p>
                    <Dark><BlockMath math="= \frac{3^4}{2^5} = \frac{81}{32}" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════
              SIFAT 8: a^(1/n) = n√a
          ═══════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k8" icon={<Target className="w-5 h-5" />} iconColor="text-teal-400"
              title={<span>📘 Sifat 8: <InlineMath math="a^{1/n} = \sqrt[n]{a}" /></span>} />
            {expandedSections.includes("k8") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm font-semibold text-teal-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Pangkat pecahan <InlineMath math="\frac{1}{n}" /> adalah cara menulis <strong className="text-teal-300">akar ke-n</strong>. Sifat ini menjadi jembatan antara operasi pangkat dan operasi akar.
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🔍 ASAL USUL RUMUS:</p>
                  <p className="font-body text-xs text-white/70 mb-1">Misalkan <InlineMath math="x = a^{1/n}" />. Pangkatkan kedua ruas dengan <InlineMath math="n" /> menggunakan Sifat 3:</p>
                  <BlockMath math="x^n = \left(a^{1/n}\right)^n = a^{\frac{1}{n} \cdot n} = a^1 = a" />
                  <p className="font-body text-xs text-white/70 mt-1">Artinya <InlineMath math="x^n = a" />, sehingga <InlineMath math="x = \sqrt[n]{a}" />. Terbukti: <InlineMath math="a^{1/n} = \sqrt[n]{a}" /></p>
                  <p className="font-body text-xs text-white/60 mt-2">Contoh: <InlineMath math="8^{1/3} = \sqrt[3]{8} = 2" /> karena <InlineMath math="2^3 = 8" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>Tips:</strong> <InlineMath math="a^{1/2} = \sqrt{a}" /> (akar kuadrat), <InlineMath math="a^{1/3} = \sqrt[3]{a}" /> (akar kubik).</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c8" icon={<Calculator className="w-5 h-5" />} iconColor="text-teal-400"
              title={<span>📝 Contoh Soal — Sifat 8: <InlineMath math="a^{1/n}" /></span>} />
            {expandedSections.includes("c8") && (
              <div className="px-5 pb-5 space-y-6">
                <ExampleBlock level="MUDAH" title="Contoh 1"
                  soal={<>Hitunglah: <InlineMath math="64^{1/2}" /> dan <InlineMath math="27^{1/3}" /></>}
                  pembahasan={<>
                    <Dark>
                      <BlockMath math="64^{1/2} = \sqrt{64} = 8 \quad \text{(karena } 8^2 = 64\text{)}" />
                      <BlockMath math="27^{1/3} = \sqrt[3]{27} = 3 \quad \text{(karena } 3^3 = 27\text{)}" />
                    </Dark>
                  </>}
                />
                <ExampleBlock level="SEDANG" title="Contoh 2"
                  soal={<>Sederhanakan: <InlineMath math="(16x^4)^{1/2}" /></>}
                  pembahasan={<>
                    <p>Gunakan Sifat 4 terlebih dahulu:</p>
                    <Dark><BlockMath math="(16x^4)^{1/2} = 16^{1/2} \cdot (x^4)^{1/2} = 4 \cdot x^2 = 4x^2" /></Dark>
                  </>}
                />
                <ExampleBlock level="SULIT" title="Contoh 3"
                  soal={<>Sederhanakan: <InlineMath math="\left(\dfrac{81a^8}{b^4}\right)^{1/4}" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Distribusikan pangkat:</p>
                    <Dark><BlockMath math="\frac{81^{1/4} \cdot (a^8)^{1/4}}{(b^4)^{1/4}}" /></Dark>
                    <p><strong>Langkah 2:</strong> Hitung masing-masing:</p>
                    <Dark><BlockMath math="81^{1/4} = \sqrt[4]{81} = 3,\quad (a^8)^{1/4} = a^2,\quad (b^4)^{1/4} = b" /></Dark>
                    <p><strong>Hasil:</strong></p>
                    <Dark><BlockMath math="\frac{3a^2}{b}" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════
              SIFAT 9: a^(m/n) = n√(a^m)
          ═══════════════════════════════════════════════ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k9" icon={<Target className="w-5 h-5" />} iconColor="text-violet-400"
              title={<span>📘 Sifat 9: <InlineMath math="a^{m/n} = \sqrt[n]{a^m}" /></span>} />
            {expandedSections.includes("k9") && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ini adalah gabungan antara Sifat 3 dan Sifat 8. Pangkat pecahan <InlineMath math="\frac{m}{n}" /> berarti: <strong className="text-violet-300">pangkatkan dengan m</strong>, lalu <strong className="text-violet-300">ambil akar ke-n</strong> (atau sebaliknya — hasilnya sama!).
                  </p>
                </Box>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🔍 ASAL USUL RUMUS:</p>
                  <p className="font-body text-xs text-white/70 mb-1">Turunkan menggunakan Sifat 3 dan Sifat 8:</p>
                  <BlockMath math="a^{m/n} = a^{m \cdot \frac{1}{n}} = \left(a^m\right)^{1/n} = \sqrt[n]{a^m}" />
                  <p className="font-body text-xs text-white/70 mt-2 mb-1">Atau urutan terbalik:</p>
                  <BlockMath math="a^{m/n} = a^{\frac{1}{n} \cdot m} = \left(a^{1/n}\right)^m = \left(\sqrt[n]{a}\right)^m" />
                  <p className="font-body text-xs text-white/60 mt-2">Contoh: <InlineMath math="8^{2/3} = \sqrt[3]{8^2} = \sqrt[3]{64} = 4" /> atau <InlineMath math="= (\sqrt[3]{8})^2 = 2^2 = 4" /></p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm text-yellow-200"><strong>Tips:</strong> Pilih cara yang lebih mudah dihitung. Biasanya lebih mudah akar dulu baru pangkat, karena bilangan yang diakarkan lebih kecil!</p>
                </Box>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c9" icon={<Calculator className="w-5 h-5" />} iconColor="text-violet-400"
              title={<span>📝 Contoh Soal — Sifat 9: <InlineMath math="a^{m/n}" /></span>} />
            {expandedSections.includes("c9") && (
              <div className="px-5 pb-5 space-y-6">
                <ExampleBlock level="MUDAH" title="Contoh 1"
                  soal={<>Hitunglah: <InlineMath math="32^{3/5}" /></>}
                  pembahasan={<>
                    <p>Akar dulu lalu pangkat (lebih mudah):</p>
                    <Dark>
                      <BlockMath math="32^{3/5} = \left(\sqrt[5]{32}\right)^3 = 2^3 = 8" />
                    </Dark>
                    <p className="text-xs text-white/60">Karena <InlineMath math="\sqrt[5]{32} = 2" /> (sebab <InlineMath math="2^5 = 32" />)</p>
                  </>}
                />
                <ExampleBlock level="SEDANG" title="Contoh 2"
                  soal={<>Sederhanakan: <InlineMath math="x^{3/4} \cdot x^{1/4}" /></>}
                  pembahasan={<>
                    <p>Gunakan Sifat 1 (jumlahkan pangkat):</p>
                    <Dark><BlockMath math="x^{3/4} \cdot x^{1/4} = x^{3/4 + 1/4} = x^{4/4} = x^1 = x" /></Dark>
                  </>}
                />
                <ExampleBlock level="SULIT" title="Contoh 3"
                  soal={<>Sederhanakan: <InlineMath math="\dfrac{a^{5/6} \cdot a^{1/3}}{a^{1/2}}" /></>}
                  pembahasan={<>
                    <p><strong>Langkah 1:</strong> Jumlahkan pangkat di pembilang (KPK penyebut = 6):</p>
                    <Dark><BlockMath math="a^{5/6} \cdot a^{1/3} = a^{5/6} \cdot a^{2/6} = a^{7/6}" /></Dark>
                    <p><strong>Langkah 2:</strong> Bagi dengan penyebut (<InlineMath math="a^{1/2} = a^{3/6}" />):</p>
                    <Dark><BlockMath math="\frac{a^{7/6}}{a^{3/6}} = a^{7/6 - 3/6} = a^{4/6} = a^{2/3} = \sqrt[3]{a^2}" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* ─── Rangkuman ─── */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/30 rounded-xl p-5 space-y-3">
            <p className="font-body text-sm font-semibold text-cyan-300 text-center">🌟 RANGKUMAN 9 SIFAT BILANGAN BERPANGKAT</p>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-xs text-center">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="py-2 px-2 text-slate-300 text-left">No</th>
                    <th className="py-2 px-2 text-slate-300 text-left">Sifat</th>
                    <th className="py-2 px-2 text-slate-300">Rumus</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  {[
                    ["1", "Perkalian pangkat", "a^m \\times a^n = a^{m+n}"],
                    ["2", "Pembagian pangkat", "a^m \\div a^n = a^{m-n}"],
                    ["3", "Pangkat dari pangkat", "(a^m)^n = a^{mn}"],
                    ["4", "Pangkat perkalian", "(ab)^n = a^n b^n"],
                    ["5", "Pangkat pecahan", "(a/b)^n = a^n/b^n"],
                    ["6", "Pangkat nol", "a^0 = 1"],
                    ["7", "Pangkat negatif", "a^{-n} = 1/a^n"],
                    ["8", "Pangkat 1/n", "a^{1/n} = \\sqrt[n]{a}"],
                    ["9", "Pangkat m/n", "a^{m/n} = \\sqrt[n]{a^m}"],
                  ].map(([no, nama, rumus]) => (
                    <tr key={no} className="border-b border-slate-700/50">
                      <td className="py-2 px-2 text-primary font-bold">{no}</td>
                      <td className="py-2 px-2 text-left text-white/70">{nama}</td>
                      <td className="py-2 px-2"><InlineMath math={rumus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/bilangan-berpangkat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};

export default SifatSifatOperasiPage;
