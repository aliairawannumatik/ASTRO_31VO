import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const JamDindingSVG = () => (
  <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto my-2" aria-label="Jam dinding analogi lingkaran">
    <defs>
      <style>{`
        @keyframes rotateJarum{from{transform-origin:130px 130px;transform:rotate(0deg);}to{transform-origin:130px 130px;transform:rotate(360deg);}}
        @keyframes rotateJarumMenit{from{transform-origin:130px 130px;transform:rotate(0deg);}to{transform-origin:130px 130px;transform:rotate(360deg);}}
        .jarum-jam{animation:rotateJarum 12s linear infinite;}
        .jarum-menit{animation:rotateJarumMenit 60s linear infinite;}
      `}</style>
    </defs>
    <circle cx="130" cy="130" r="100" fill="rgba(30,41,59,0.9)" stroke="#06b6d4" strokeWidth="3"/>
    <circle cx="130" cy="130" r="95" fill="none" stroke="#0e7490" strokeWidth="1"/>
    {[...Array(12)].map((_, i) => {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const x1 = 130 + 82 * Math.cos(angle);
      const y1 = 130 + 82 * Math.sin(angle);
      const x2 = 130 + 95 * Math.cos(angle);
      const y2 = 130 + 95 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#06b6d4" strokeWidth={i % 3 === 0 ? 3 : 1.5}/>;
    })}
    {[12,3,6,9].map((n, i) => {
      const angle = (i * 90 - 90) * Math.PI / 180;
      const x = 130 + 70 * Math.cos(angle);
      const y = 130 + 70 * Math.sin(angle);
      return <text key={n} x={x} y={y + 4} fill="#67e8f9" fontSize="16" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{n}</text>;
    })}
    <line x1="130" y1="130" x2="130" y2="80" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" className="jarum-jam"/>
    <line x1="130" y1="130" x2="160" y2="68" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" className="jarum-menit"/>
    <circle cx="130" cy="130" r="5" fill="#f59e0b"/>
    <text x="130" y="240" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Sudut jarum jam = busur/juring lingkaran!</text>
  </svg>
);

const RodaGigiSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto my-2" aria-label="Roda gigi - penerapan lingkaran">
    <defs>
      <style>{`
        @keyframes spin1{from{transform-origin:80px 90px;transform:rotate(0deg);}to{transform-origin:80px 90px;transform:rotate(360deg);}}
        @keyframes spin2{from{transform-origin:210px 90px;transform:rotate(0deg);}to{transform-origin:210px 90px;transform:rotate(-360deg);}}
        .gear1{animation:spin1 4s linear infinite;}
        .gear2{animation:spin2 4s linear infinite;}
      `}</style>
    </defs>
    <circle cx="80" cy="90" r="55" fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth="2.5" className="gear1"/>
    <circle cx="80" cy="90" r="10" fill="#f59e0b" className="gear1"/>
    <text x="80" y="155" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace">r₁ = 55</text>
    <circle cx="210" cy="90" r="35" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2.5" className="gear2"/>
    <circle cx="210" cy="90" r="8" fill="#22c55e" className="gear2"/>
    <text x="210" y="155" fill="#4ade80" fontSize="10" textAnchor="middle" fontFamily="monospace">r₂ = 35</text>
    <line x1="80" y1="90" x2="210" y2="90" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3"/>
    <text x="145" y="83" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">135</text>
    <text x="145" y="170" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">K₁/K₂ = r₁/r₂ → kec. putar berbeda!</text>
  </svg>
);

const KolongSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto my-2" aria-label="Tampang melintang pipa">
    <defs>
      <style>{`@keyframes waterFlow{0%{opacity:0.3;}50%{opacity:0.9;}100%{opacity:0.3;}}.wf{animation:waterFlow 2s ease-in-out infinite;}`}</style>
    </defs>
    <circle cx="150" cy="100" r="80" fill="rgba(6,182,212,0.05)" stroke="#0e7490" strokeWidth="3"/>
    <circle cx="150" cy="100" r="65" fill="rgba(59,130,246,0.25)" stroke="#3b82f6" strokeWidth="2" className="wf"/>
    <circle cx="150" cy="100" r="65" fill="rgba(59,130,246,0.1)" stroke="none"/>
    <line x1="150" y1="100" x2="215" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2"/>
    <text x="185" y="92" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">R=80</text>
    <line x1="150" y1="100" x2="150" y2="35" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2"/>
    <text x="155" y="65" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">r=65</text>
    <circle cx="150" cy="100" r="4" fill="var(--icon-color)"/>
    <text x="150" y="185" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">L.air = π(R² - r²) — luas cincin pipa</text>
  </svg>
);

const PenerapanKontekstualPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "strategi", "contoh1", "contoh2", "contoh3", "rangkuman"]);
  const toggle = (id: string) => { playPopSound(); setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]); };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">PENERAPAN LINGKARAN PADA MASALAH KONTEKSTUAL</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Lingkaran · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌍 Lingkaran Ada di Mana-Mana!" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Selama ini kita belajar rumus — sekarang waktunya pakai rumus itu untuk menyelesaikan masalah nyata! Lingkaran hadir dalam kehidupan sehari-hari: <strong className="text-cyan-300">jam dinding, roda kendaraan, pipa air, permukaan kaleng, taman melingkar, antena parabola</strong>, dan masih banyak lagi.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                  {[
                    { color: "yellow", emoji: "⏰", label: "Jam & Sudut", hint: "Jarum jam → sudut pusat & busur" },
                    { color: "green", emoji: "⚙️", label: "Roda & Mesin", hint: "Keliling roda → jarak tempuh" },
                    { color: "blue", emoji: "🚿", label: "Pipa & Kolam", hint: "Luas cincin → debit air" },
                  ].map(({ color, emoji, label, hint }) => (
                    <div key={label} className={`bg-${color}-900/30 border border-${color}-500/30 rounded-lg p-3 text-center`}>
                      <p className="text-2xl mb-1">{emoji}</p>
                      <p className={`text-${color}-300 font-bold`}>{label}</p>
                      <p className="text-white/50 mt-1">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="strategi" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📐 Strategi Menyelesaikan Soal Kontekstual" />
            {open.includes("strategi") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Soal kontekstual = soal cerita. Kuncinya adalah <strong className="text-yellow-300">terjemahkan kata-kata ke gambar/model matematis</strong>, baru hitung!</p>
                </div>
                <JamDindingSVG />
                <div className="space-y-2">
                  {[
                    { step: "1", color: "blue", title: "Baca & Pahami", desc: "Apa yang diketahui? Apa yang dicari? Gambarkan jika perlu." },
                    { step: "2", color: "green", title: "Identifikasi Konsep", desc: "Apakah ini soal keliling, luas, busur, juring, atau sudut?" },
                    { step: "3", color: "yellow", title: "Pilih Rumus", desc: "Tulis rumus yang sesuai dan substitusikan nilai yang diketahui." },
                    { step: "4", color: "orange", title: "Hitung & Cek Satuan", desc: "Pastikan satuannya konsisten (cm, m, cm², dll)." },
                  ].map(({ step, color, title, desc }) => (
                    <div key={step} className={`flex gap-3 bg-${color}-900/20 border border-${color}-500/20 rounded-lg p-3`}>
                      <span className={`bg-${color}-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5`}>{step}</span>
                      <div>
                        <p className="font-body text-sm font-bold text-white">{title}</p>
                        <p className="font-body text-xs text-white/60">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Roda dan Jarak Tempuh (Mudah)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah sepeda memiliki roda berdiameter 56 cm. Jika roda berputar sebanyak 500 kali, berapa jarak yang ditempuh sepeda? (π = 22/7)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><em>Identifikasi:</em> Satu putaran roda = menempuh jarak sejauh keliling roda.</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Keliling roda</p>
                  <BlockMath math="K = \pi \times d = \frac{22}{7} \times 56 = 176 \text{ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Jarak total (500 putaran)</p>
                  <BlockMath math="\text{Jarak} = 500 \times 176 = 88.000 \text{ cm} = 880 \text{ m}" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">✅ Jarak tempuh = <strong>880 m = 0,88 km</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Biaya Pengecatan Taman (Sedang)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah taman kota berbentuk lingkaran dengan diameter 28 m. Di tengah taman terdapat air mancur berbentuk lingkaran berjari-jari 3,5 m. Sisa tanah taman akan ditanami rumput dengan biaya Rp15.000 per m². Tentukan total biaya yang diperlukan! (π = 22/7)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Jari-jari taman besar</p>
                  <BlockMath math="R = \frac{28}{2} = 14 \text{ m}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Luas taman besar</p>
                  <BlockMath math="L_{\text{taman}} = \pi R^2 = \frac{22}{7} \times 196 = 616 \text{ m}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 3:</strong> Luas air mancur</p>
                  <BlockMath math="L_{\text{mancur}} = \pi r^2 = \frac{22}{7} \times 3{,}5^2 = \frac{22}{7} \times 12{,}25 = 38{,}5 \text{ m}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 4:</strong> Luas yang ditanami rumput</p>
                  <BlockMath math="L_{\text{rumput}} = 616 - 38{,}5 = 577{,}5 \text{ m}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 5:</strong> Total biaya</p>
                  <BlockMath math="\text{Biaya} = 577{,}5 \times 15.000 = \text{Rp } 8.662.500" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">✅ Total biaya = <strong>Rp 8.662.500</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Debit Air Pipa (Sulit)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah pipa air berdiameter luar 10 cm dan diameter dalam 8 cm. Air mengalir dengan kecepatan 2 m/s melalui bagian dalam pipa. Hitunglah debit air (volume per detik) yang mengalir! (π = 3,14, jawab dalam cm³/s)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <KolongSVG />
                  <p className="font-body text-sm text-white/80"><em>Identifikasi:</em> Debit = luas penampang × kecepatan aliran. Penampang = lingkaran dalam pipa.</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Jari-jari dalam pipa</p>
                  <BlockMath math="r = \frac{d_{\text{dalam}}}{2} = \frac{8}{2} = 4 \text{ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Luas penampang dalam</p>
                  <BlockMath math="A = \pi r^2 = 3{,}14 \times 4^2 = 3{,}14 \times 16 = 50{,}24 \text{ cm}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 3:</strong> Konversi kecepatan (2 m/s = 200 cm/s)</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 4:</strong> Debit air</p>
                  <BlockMath math="Q = A \times v = 50{,}24 \times 200 = 10.048 \text{ cm}^3/\text{s}" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">✅ Debit air = <strong>10.048 cm³/s ≈ 10,05 liter/detik</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="📌 Rangkuman Sub-Bab" />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• <strong className="text-green-300">Jarak tempuh roda</strong> = jumlah putaran × keliling roda</p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">Luas daerah berlubang/cincin</strong> = <InlineMath math="\pi(R^2 - r^2)"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-yellow-300">Biaya</strong> = luas area × harga per satuan luas</p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-cyan-300">Debit air</strong> = luas penampang × kecepatan aliran</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Semua rumus lingkaran yang kamu pelajari digunakan para insinyur NASA untuk merancang roket, orbit satelit, dan antena radar. Kamu sudah satu langkah lebih dekat menjadi insinyur antariksa!
                  </p>
                </div>
                <RodaGigiSVG />
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenerapanKontekstualPage;
