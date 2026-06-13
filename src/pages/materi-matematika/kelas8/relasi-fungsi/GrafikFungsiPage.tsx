import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const GrafikFungsiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);
  const [jawaban, setJawaban] = useState<Record<string, string>>({});

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const pilihJawaban = (soal: string, opsi: string) => {
    playPopSound();
    setJawaban((prev) => ({ ...prev, [soal]: opsi }));
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const PilihanGanda = ({
    soal, opsi, kunci, pembahasan, pembahasanSteps, autoShow = false
  }: {
    soal: string;
    opsi: { kode: string; teks: string }[];
    kunci: string;
    pembahasan?: string;
    pembahasanSteps?: string[];
    autoShow?: boolean;
  }) => {
    const dipilih = autoShow ? kunci : jawaban[soal];
    const sudahJawab = autoShow || !!dipilih;
    return (
      <div className="space-y-2">
        {opsi.map(({ kode, teks }) => {
          const benar = kode === kunci;
          const dipilihIni = dipilih === kode;
          let cls = "border rounded-lg px-4 py-2.5 text-sm font-body transition-all flex items-center gap-3 ";
          if (!sudahJawab) {
            cls += "cursor-pointer border-white/20 text-white/80 hover:border-cyan-400/60 hover:bg-cyan-900/20";
          } else if (benar) {
            cls += "border-green-500 bg-green-900/30 text-green-300 font-semibold cursor-default";
          } else {
            cls += "border-white/10 text-white/40 cursor-default";
          }
          return (
            <button key={kode} onClick={() => !sudahJawab && pilihJawaban(soal, kode)} className={cls} disabled={sudahJawab}>
              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${benar && sudahJawab ? "border-green-400 bg-green-500/30 text-green-300" : sudahJawab && dipilihIni ? "border-red-400 bg-red-500/20 text-red-300" : "border-white/30 text-white/50"}`}>{kode}</span>
              {teks}
              {sudahJawab && benar && <span className="ml-auto text-green-400 text-xs font-bold">✓ BENAR</span>}
              {sudahJawab && dipilihIni && !benar && <span className="ml-auto text-red-400 text-xs font-bold">✗ SALAH</span>}
            </button>
          );
        })}
        {sudahJawab && (
          <div className="rounded-lg p-3 text-xs font-body mt-1 bg-green-900/20 border border-green-500/40 text-green-200 space-y-1">
            <p className="font-bold text-green-300 mb-2">💡 Pembahasan:</p>
            {pembahasanSteps ? (
              <ol className="space-y-1.5 list-none">
                {pembahasanSteps.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-green-700/60 text-green-200 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p>{pembahasan}</p>
            )}
          </div>
        )}
        {!sudahJawab && (
          <p className="text-xs text-white/30 text-center font-body pt-1">Klik salah satu pilihan untuk menjawab</p>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          GRAFIK FUNGSI (PENGAYAAN)
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Membaca Grafik Fungsi Linear dalam Kehidupan Nyata
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Relasi dan Fungsi · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Grafik Fungsi Linear di Kehidupan Nyata" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Fungsi linear <InlineMath math="f(x) = ax + b" /> menghasilkan grafik berupa <strong className="text-cyan-300">garis lurus</strong>. Grafik ini sering muncul dalam kehidupan nyata: tarif taksi, harga barang, keuntungan usaha, dan lain-lain.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                  {[
                    { icon: "📈", judul: "Grafik Naik", ket: "Koefisien a > 0, nilai y bertambah seiring x bertambah", color: "bg-green-900/30 border-green-500/30 text-green-200" },
                    { icon: "📉", judul: "Grafik Turun", ket: "Koefisien a < 0, nilai y berkurang seiring x bertambah", color: "bg-red-900/30 border-red-500/30 text-red-200" },
                    { icon: "➡️", judul: "Grafik Datar", ket: "Koefisien a = 0, nilai y selalu tetap (fungsi konstan)", color: "bg-slate-700/50 border-white/20 text-white/60" },
                  ].map(({ icon, judul, ket, color }) => (
                    <div key={judul} className={`border ${color} rounded-lg p-3`}>
                      <p className="font-bold mb-1">{icon} {judul}</p>
                      <p className="text-white/60 leading-relaxed">{ket}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* KONSEP MEMBACA GRAFIK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Cara Membaca Grafik Fungsi" />
            {expandedSections.includes("konsep") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Dua Cara Membaca Grafik</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">① Diketahui x → Cari nilai y (f(x))</p>
                      <p className="text-white/70 text-xs leading-relaxed">Tarik garis vertikal ke atas dari nilai x di sumbu-x, lalu tarik garis horizontal ke kiri sampai sumbu-y. Nilai y yang diperoleh adalah f(x).</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">② Diketahui y (bayangan) → Cari nilai x</p>
                      <p className="text-white/70 text-xs leading-relaxed">Tarik garis horizontal dari nilai y di sumbu-y, lalu tarik garis vertikal ke bawah sampai sumbu-x. Nilai x yang diperoleh adalah nilai input yang dicari.</p>
                    </div>
                  </div>
                </div>
                {/* Ilustrasi 1: f(x) = x + 1 */}
                <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 mb-1 text-center">Ilustrasi 1: Grafik f(x) = x + 1</p>
                  <p className="font-body text-xs text-white/40 mb-3 text-center">Dari x = 3 → f(3) = 3 + 1 = 4</p>
                  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto">
                    {/* Grid: x 0-4 (45px/unit), y 0-6 (25.83px/unit) */}
                    {[1,2,3,4].map(v => (
                      <line key={"gx"+v} x1={40+v*45} y1={20} x2={40+v*45} y2={175} stroke="#1e293b" strokeWidth="1" />
                    ))}
                    {[1,2,3,4,5,6].map(v => (
                      <line key={"gy"+v} x1={40} y1={175-v*25.83} x2={225} y2={175-v*25.83} stroke="#1e293b" strokeWidth="1" />
                    ))}
                    {/* Axes */}
                    <line x1={40} y1={15} x2={40} y2={180} stroke="#475569" strokeWidth="1.5" />
                    <line x1={35} y1={175} x2={230} y2={175} stroke="#475569" strokeWidth="1.5" />
                    <polygon points="230,172 230,178 237,175" fill="#475569" />
                    <polygon points="37,15 43,15 40,8" fill="#475569" />
                    <text x={240} y={179} fill="#94a3b8" fontSize="9">x</text>
                    <text x={44} y={13} fill="#94a3b8" fontSize="9">y</text>
                    {/* X ticks: 1,2,3,4 */}
                    {[1,2,3,4].map(v => (
                      <text key={v} x={40+v*45-3} y={189} fill="#64748b" fontSize="8">{v}</text>
                    ))}
                    <text x={33} y={189} fill="#64748b" fontSize="8">0</text>
                    {/* Y ticks: 1–6 */}
                    {[1,2,3,4,5,6].map(v => (
                      <text key={v} x={28} y={175-v*25.83+3} fill="#64748b" fontSize="8">{v}</text>
                    ))}
                    {/* Line: f(0)=1 → (40,149), f(4)=5 → (220,46) */}
                    <line x1={40} y1={149} x2={220} y2={46} stroke="#22d3ee" strokeWidth="2.5" />
                    {/* Guide: x=3, f(3)=4 → x_px=175, y_px=72 */}
                    <line x1={175} y1={175} x2={175} y2={72} stroke="#fb923c" strokeWidth="1.5" strokeDasharray="5,3" />
                    <line x1={40} y1={72} x2={175} y2={72} stroke="#fb923c" strokeWidth="1.5" strokeDasharray="5,3" />
                    <circle cx={175} cy={72} r="5" fill="#fb923c" stroke="#fdba74" strokeWidth="1.5" />
                    <text x={179} y={69} fill="#fb923c" fontSize="9" fontWeight="bold">(3, 4)</text>
                    <text x={170} y={189} fill="#fb923c" fontSize="8" fontWeight="bold">3</text>
                    <text x={20} y={75} fill="#fb923c" fontSize="8" fontWeight="bold">4</text>
                    {/* y-intercept dot */}
                    <circle cx={40} cy={149} r="4" fill="#22d3ee" opacity="0.7" />
                    <text x={44} y={146} fill="#94a3b8" fontSize="8">(0,1)</text>
                  </svg>
                </div>

                {/* Ilustrasi 2: f(x) = 2x */}
                <div className="bg-slate-900/60 border border-violet-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-violet-300 mb-1 text-center">Ilustrasi 2: Grafik f(x) = 2x</p>
                  <p className="font-body text-xs text-white/40 mb-3 text-center">Dari x = 2 → f(2) = 2 × 2 = 4</p>
                  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto">
                    {/* Grid: x 0-3 (60px/unit), y 0-6 (25.83px/unit) */}
                    {[1,2,3].map(v => (
                      <line key={"gx"+v} x1={40+v*60} y1={20} x2={40+v*60} y2={175} stroke="#1e293b" strokeWidth="1" />
                    ))}
                    {[1,2,3,4,5,6].map(v => (
                      <line key={"gy"+v} x1={40} y1={175-v*25.83} x2={225} y2={175-v*25.83} stroke="#1e293b" strokeWidth="1" />
                    ))}
                    {/* Axes */}
                    <line x1={40} y1={15} x2={40} y2={180} stroke="#475569" strokeWidth="1.5" />
                    <line x1={35} y1={175} x2={230} y2={175} stroke="#475569" strokeWidth="1.5" />
                    <polygon points="230,172 230,178 237,175" fill="#475569" />
                    <polygon points="37,15 43,15 40,8" fill="#475569" />
                    <text x={240} y={179} fill="#94a3b8" fontSize="9">x</text>
                    <text x={44} y={13} fill="#94a3b8" fontSize="9">y</text>
                    {/* X ticks: 1,2,3 */}
                    {[1,2,3].map(v => (
                      <text key={v} x={40+v*60-3} y={189} fill="#64748b" fontSize="8">{v}</text>
                    ))}
                    <text x={33} y={189} fill="#64748b" fontSize="8">0</text>
                    {/* Y ticks: 1–6 */}
                    {[1,2,3,4,5,6].map(v => (
                      <text key={v} x={28} y={175-v*25.83+3} fill="#64748b" fontSize="8">{v}</text>
                    ))}
                    {/* Line: f(0)=0 → (40,175), f(3)=6 → (220,20) */}
                    <line x1={40} y1={175} x2={220} y2={20} stroke="#a78bfa" strokeWidth="2.5" />
                    {/* Guide: x=2, f(2)=4 → x_px=160, y_px=72 */}
                    <line x1={160} y1={175} x2={160} y2={72} stroke="#fb923c" strokeWidth="1.5" strokeDasharray="5,3" />
                    <line x1={40} y1={72} x2={160} y2={72} stroke="#fb923c" strokeWidth="1.5" strokeDasharray="5,3" />
                    <circle cx={160} cy={72} r="5" fill="#fb923c" stroke="#fdba74" strokeWidth="1.5" />
                    <text x={164} y={69} fill="#fb923c" fontSize="9" fontWeight="bold">(2, 4)</text>
                    <text x={155} y={189} fill="#fb923c" fontSize="8" fontWeight="bold">2</text>
                    <text x={20} y={75} fill="#fb923c" fontSize="8" fontWeight="bold">4</text>
                    {/* Origin dot */}
                    <circle cx={40} cy={175} r="4" fill="#a78bfa" opacity="0.7" />
                    <text x={44} y={172} fill="#94a3b8" fontSize="8">(0,0)</text>
                  </svg>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Tips:</strong> Pada soal kontekstual, perhatikan satuan pada sumbu-x dan sumbu-y. Bacalah keterangan grafik dengan teliti sebelum menjawab!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 — MODAL VS UNTUNG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Grafik Modal dan Untung" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MEMBACA GRAFIK" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed mb-4">
                    Perhatikan grafik berikut yang menunjukkan hubungan antara <strong className="text-cyan-300">modal</strong> (sumbu-x, dalam ribuan rupiah) dan <strong className="text-orange-300">keuntungan</strong> (sumbu-y, dalam ribuan rupiah) suatu usaha!
                  </p>
                  {/* GRAFIK MODAL VS UNTUNG */}
                  <div className="bg-slate-900/70 border border-green-500/20 rounded-xl p-4">
                    <svg viewBox="0 0 310 220" className="w-full max-w-sm mx-auto">
                      {/* Grid lines */}
                      {[1,2,3,4,5].map(i => (
                        <g key={i}>
                          <line x1={65+i*40} y1={15} x2={65+i*40} y2={175} stroke="#1e293b" strokeWidth="1" />
                          <line x1={65} y1={175-i*30} x2={270} y2={175-i*30} stroke="#1e293b" strokeWidth="1" />
                        </g>
                      ))}
                      {/* Axes */}
                      <line x1={65} y1={15} x2={65} y2={180} stroke="#475569" strokeWidth="1.5" />
                      <line x1={60} y1={175} x2={275} y2={175} stroke="#475569" strokeWidth="1.5" />
                      {/* Axis arrows */}
                      <polygon points="275,172 275,178 282,175" fill="#475569" />
                      <polygon points="62,15 68,15 65,8" fill="#475569" />
                      {/* Axis titles */}
                      <text x={283} y={179} fill="#94a3b8" fontSize="9">Modal</text>
                      <text x={2} y={9} fill="#94a3b8" fontSize="8">Untung</text>
                      <text x={2} y={17} fill="#94a3b8" fontSize="8">(ribu Rp)</text>
                      {/* X labels: 10,20,30,40,50 (in thousands) */}
                      {[10,20,30,40,50].map((v,i) => (
                        <text key={v} x={65+(i+1)*40-7} y={190} fill="#64748b" fontSize="8">{v}</text>
                      ))}
                      {/* Y labels: ribuan Rp 0.5, 1.0, 1.5, 2.0, 2.5 */}
                      {[0.5,1.0,1.5,2.0,2.5].map((v,i) => (
                        <text key={v} x={18} y={175-(i+1)*30+3} fill="#64748b" fontSize="8">{v}</text>
                      ))}
                      <text x={49} y={179} fill="#64748b" fontSize="8">0</text>
                      {/* (ribuan Rp) label on x axis */}
                      <text x={150} y={207} fill="#94a3b8" fontSize="8">(ribuan Rp)</text>
                      {/* Line: x px = 65 + x_val*4; y px = 175 - y_val*60 (y in 0–2.5 units) */}
                      <line x1={65} y1={175} x2={265} y2={25} stroke="#4ade80" strokeWidth="2.5" />
                      {/* Points */}
                      {[[10,0.5],[20,1.0],[30,1.5],[40,2.0],[50,2.5]].map(([x,y]) => (
                        <circle key={x} cx={65+x*4} cy={175-y*60} r="4" fill="#4ade80" stroke="#86efac" strokeWidth="1.5" />
                      ))}
                      {/* Highlight x=25 */}
                      <line x1={165} y1={175} x2={165} y2={100} stroke="#f97316" strokeWidth="1.5" strokeDasharray="5,3" />
                      <line x1={65} y1={100} x2={165} y2={100} stroke="#f97316" strokeWidth="1.5" strokeDasharray="5,3" />
                      <circle cx={165} cy={100} r="5" fill="#f97316" stroke="#fdba74" strokeWidth="1.5" />
                      <text x={155} y={191} fill="#f97316" fontSize="9" fontWeight="bold">25</text>
                    </svg>
                    <p className="text-xs text-center text-white/40 mt-1 font-body">Grafik hubungan modal dan untung suatu usaha</p>
                  </div>
                  <p className="font-body text-sm text-white/85 mt-4">
                    Dengan modal <strong className="text-orange-300">Rp 25.000,00</strong>, berapakah untung yang diperoleh?
                  </p>
                </div>
                <PilihanGanda
                  autoShow
                  soal="c1"
                  opsi={[
                    { kode: "A", teks: "Rp 1.250,00" },
                    { kode: "B", teks: "Rp 1.350,00" },
                    { kode: "C", teks: "Rp 1.500,00" },
                    { kode: "D", teks: "Rp 1.750,00" },
                  ]}
                  kunci="A"
                  pembahasanSteps={[
                    "Cari nilai x = 25 pada sumbu-x grafik.",
                    "Tarik garis vertikal ke atas dari x = 25 hingga menyentuh garis grafik.",
                    "Dari titik pertemuan itu, tarik garis horizontal ke kiri menuju sumbu-y.",
                    "Nilai yang terbaca pada sumbu-y = 1,25 (ribuan Rp).",
                    "Jadi, untung = 1,25 × Rp 1.000 = Rp 1.250,00 ✓",
                  ]}
                />
              </div>
            )}
          </div>

          {/* CONTOH 2 — TARIF TAKSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Grafik Tarif Taksi" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="KONTEKSTUAL" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-3">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed mb-4">
                    Suatu perusahaan taksi memasang tarif seperti grafik berikut (sumbu-x = jarak tempuh dalam km, sumbu-y = tarif dalam ribuan rupiah).
                  </p>
                  {/* GRAFIK TARIF TAKSI — rekonstruksi dari gambar asli */}
                  <div className="bg-transparent border border-yellow-500/20 rounded-xl p-4">
                    <svg viewBox="0 0 320 240" className="w-full max-w-sm mx-auto">
                      {/* Chart area: x 70–260, y 20–195 */}
                      {/* Y scale: 0 at y=195, 30 at y=25 → 170px/30 = 5.667px per unit */}
                      {/* X scale: 0 at x=70, 6 at x=220 (then extend axis) → 150px/6 = 25px per unit */}
                      {/* Grid lines — horizontal, every 5 units */}
                      {[0,5,10,15,20,25,30].map((v) => {
                        const yPx = 195 - v * (170/30);
                        return <line key={v} x1={70} y1={yPx} x2={250} y2={yPx} stroke="#334155" strokeWidth="0.8" />;
                      })}
                      {/* Axes */}
                      <line x1={70} y1={20} x2={70} y2={198} stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1={67} y1={195} x2={260} y2={195} stroke="#94a3b8" strokeWidth="1.5" />
                      {/* Y labels: 0, 5, 10, 15, 20, 25, 30 */}
                      {[0,5,10,15,20,25,30].map((v) => {
                        const yPx = 195 - v * (170/30);
                        return (
                          <text key={v} x={58} y={yPx + 3} fill="#94a3b8" fontSize="9" textAnchor="end">{v}</text>
                        );
                      })}
                      {/* "(dalam ribuan)" label at top-left of y-axis */}
                      <text x={72} y={16} fill="#94a3b8" fontSize="8">(dalam ribuan)</text>
                      {/* X labels: 2, 4, 6 */}
                      {[2,4,6].map((v) => {
                        const xPx = 70 + v * 25;
                        return (
                          <text key={v} x={xPx} y={210} fill="#94a3b8" fontSize="9" textAnchor="middle">{v}</text>
                        );
                      })}
                      {/* X tick marks */}
                      {[2,4,6].map((v) => {
                        const xPx = 70 + v * 25;
                        return <line key={v} x1={xPx} y1={195} x2={xPx} y2={200} stroke="#94a3b8" strokeWidth="1" />;
                      })}
                      {/* Data line f(x)=3x+7: (2,13),(4,19),(6,25) */}
                      {/* x=2 → xPx=120, y=13 → yPx=195-13*(170/30)=195-73.67=121.3 */}
                      {/* x=4 → xPx=170, y=19 → yPx=195-19*(170/30)=195-107.67=87.3 */}
                      {/* x=6 → xPx=220, y=25 → yPx=195-25*(170/30)=195-141.67=53.3 */}
                      <polyline
                        points="120,121 170,87 220,53"
                        fill="none" stroke="#3b82f6" strokeWidth="2"
                      />
                      {/* Diamond markers */}
                      {([[120,121,13,-1],[170,87,19,-1],[220,53,25,-1]] as [number,number,number,number][]).map(([cx,cy,label]) => (
                        <g key={cx}>
                          <polygon
                            points={`${cx},${cy-6} ${cx+6},${cy} ${cx},${cy+6} ${cx-6},${cy}`}
                            fill="#3b82f6" stroke="#e2e8f0" strokeWidth="1"
                          />
                          <text x={cx+9} y={cy+4} fill="#f1f5f9" fontSize="10" fontWeight="bold">{label}</text>
                        </g>
                      ))}
                      {/* Legend */}
                      <polygon points="270,60 276,66 270,72 264,66" fill="#3b82f6" stroke="white" strokeWidth="1" />
                      <line x1={258} y1={66} x2={282} y2={66} stroke="#3b82f6" strokeWidth="1.5" />
                      <text x={285} y={70} fill="#94a3b8" fontSize="9">jarak</text>
                      {/* Highlight x=5 */}
                      <line x1={195} y1={195} x2={195} y2={70} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3" />
                      <line x1={70} y1={70} x2={195} y2={70} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3" />
                      <circle cx={195} cy={70} r="5" fill="#f97316" stroke="#fdba74" strokeWidth="1.5" />
                      <text x={192} y={210} fill="#f97316" fontSize="9" fontWeight="bold" textAnchor="middle">5</text>
                    </svg>
                    <p className="text-xs text-center text-slate-400 mt-1 font-body">Grafik tarif taksi berdasarkan jarak tempuh</p>
                  </div>
                  <p className="font-body text-sm text-white/85 mt-4">
                    Rudi akan menumpang taksi sejauh <strong className="text-orange-300">5 kilometer</strong>. Berapa tarif taksi yang harus dibayar Rudi?
                  </p>
                </div>
                <PilihanGanda
                  autoShow
                  soal="c2"
                  opsi={[
                    { kode: "A", teks: "Rp 18.000,00" },
                    { kode: "B", teks: "Rp 20.000,00" },
                    { kode: "C", teks: "Rp 22.000,00" },
                    { kode: "D", teks: "Rp 25.000,00" },
                  ]}
                  kunci="C"
                  pembahasanSteps={[
                    "Baca dua titik dari grafik: (2, 13) dan (4, 19).",
                    "Misalkan rumus fungsi: f(x) = ax + b.",
                    "Substitusi titik (2, 13): 2a + b = 13  … (1)",
                    "Substitusi titik (4, 19): 4a + b = 19  … (2)",
                    "Kurangi (1) dari (2): 2a = 6  →  a = 3.",
                    "Substitusi a = 3 ke (1): 2(3) + b = 13  →  b = 7.",
                    "Rumus fungsi: f(x) = 3x + 7.",
                    "Hitung: f(5) = 3(5) + 7 = 15 + 7 = 22 (ribuan) = Rp 22.000,00 ✓",
                  ]}
                />
              </div>
            )}
          </div>

          {/* CONTOH 3 — DIAGRAM PANAH KE RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="✏️ Contoh 3 — Menentukan Rumus dari Diagram Panah" />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MENEBAK RUMUS" color="bg-purple-700/60 text-purple-200" />
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed mb-4">
                    Perhatikan gambar diagram panah berikut. Rumus fungsi diagram tersebut adalah …
                  </p>
                  {/* BIDANG KOORDINAT — rekonstruksi gambar upload */}
                  <div className="bg-slate-900/70 border border-purple-500/20 rounded-xl p-4">
                    <svg viewBox="0 0 180 200" className="w-full max-w-[200px] mx-auto">
                      <defs>
                        <marker id="axArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0,0 6,3 0,6" fill="#94a3b8" />
                        </marker>
                        <marker id="axArrRev" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
                          <polygon points="0,0 6,3 0,6" fill="#94a3b8" />
                        </marker>
                        <marker id="lineArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0,0 6,3 0,6" fill="#a78bfa" />
                        </marker>
                        <marker id="lineArrRev" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
                          <polygon points="0,0 6,3 0,6" fill="#a78bfa" />
                        </marker>
                      </defs>
                      {/* Origin: (80, 125). Scale: 38px/unit. y inverted. */}
                      {/* x-axis */}
                      <line x1={15} y1={125} x2={163} y2={125}
                        stroke="#94a3b8" strokeWidth="1.5"
                        markerEnd="url(#axArr)" markerStart="url(#axArrRev)" />
                      {/* y-axis */}
                      <line x1={80} y1={190} x2={80} y2={12}
                        stroke="#94a3b8" strokeWidth="1.5"
                        markerEnd="url(#axArr)" markerStart="url(#axArrRev)" />
                      {/* Tick: x=1 at xPx=80+38=118 */}
                      <line x1={118} y1={121} x2={118} y2={129} stroke="#94a3b8" strokeWidth="1.2" />
                      <text x={114} y={141} fill="#e2e8f0" fontSize="13" fontWeight="bold">1</text>
                      {/* Tick: y=2 at yPx=125-76=49 */}
                      <line x1={76} y1={49} x2={84} y2={49} stroke="#94a3b8" strokeWidth="1.2" />
                      <text x={60} y={53} fill="#e2e8f0" fontSize="13" fontWeight="bold">2</text>
                      {/* Tick: y=-1 at yPx=125+38=163 */}
                      <line x1={76} y1={163} x2={84} y2={163} stroke="#94a3b8" strokeWidth="1.2" />
                      <text x={44} y={167} fill="#e2e8f0" fontSize="12" fontWeight="bold">-1</text>
                      {/* Dashed blue lines to point (1,2) */}
                      <line x1={118} y1={125} x2={118} y2={49}
                        stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="4,3" />
                      <line x1={80} y1={49} x2={118} y2={49}
                        stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="4,3" />
                      {/* Line f(x)=3x-1 with arrows at both ends */}
                      {/* At yPx=188: y=(125-188)/38=-1.66, x=(-1.66+1)/3=-0.22, xPx=80-8.3=71.7≈72 */}
                      {/* At yPx=14: y=(125-14)/38=2.92, x=(2.92+1)/3=1.31, xPx=80+49.6≈130 */}
                      <line x1={72} y1={188} x2={130} y2={14}
                        stroke="#a78bfa" strokeWidth="2"
                        markerEnd="url(#lineArr)" markerStart="url(#lineArrRev)" />
                    </svg>
                  </div>
                </div>
                <PilihanGanda
                  autoShow
                  soal="c3"
                  opsi={[
                    { kode: "A", teks: "f(x) = x + 1" },
                    { kode: "B", teks: "f(x) = 2x – 1" },
                    { kode: "C", teks: "f(x) = 3x – 1" },
                    { kode: "D", teks: "f(x) = 4x – 2" },
                  ]}
                  kunci="C"
                  pembahasanSteps={[
                    "Misalkan rumus fungsi: f(x) = ax + b.",
                    "Dari grafik, garis memotong sumbu-y di titik (0, −1)  →  f(0) = −1.",
                    "Substitusi ke rumus: a(0) + b = −1  →  b = −1.",
                    "Dari grafik, garis melalui titik (1, 2)  →  f(1) = 2.",
                    "Substitusi ke rumus: a(1) + (−1) = 2  →  a = 3.",
                    "Jadi rumus fungsinya: f(x) = 3x − 1.",
                    "Verifikasi: f(1) = 3(1) − 1 = 2 ✓",
                  ]}
                />
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman & Kesimpulan" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-6 space-y-4">

                {/* RANGKUMAN */}
                <p className="font-display text-xs font-bold text-green-300 uppercase tracking-wider pt-1">📚 Rangkuman Materi</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { icon: "📈", label: "Fungsi Linear", desc: "f(x) = ax + b menghasilkan grafik berupa garis lurus. a = kemiringan, b = titik potong sumbu-y.", color: "from-green-900/60 to-emerald-900/60 border-green-500/40 text-green-300" },
                    { icon: "👁️", label: "Membaca Grafik", desc: "Dari x → tarik garis vertikal ke garis grafik → tarik horizontal → baca nilai y.", color: "from-teal-900/60 to-cyan-900/60 border-teal-500/40 text-teal-300" },
                    { icon: "🌍", label: "Konteks Nyata", desc: "Sumbu-x dan sumbu-y mewakili besaran nyata. Selalu baca satuannya sebelum menjawab!", color: "from-blue-900/60 to-indigo-900/60 border-blue-500/40 text-blue-300" },
                    { icon: "↕️", label: "Selisih Tetap", desc: "Jika selisih nilai f(x) selalu sama, fungsinya linear. Nilai a = selisih f(x) per satuan x.", color: "from-violet-900/60 to-purple-900/60 border-violet-500/40 text-violet-300" },
                    { icon: "🔍", label: "Mencari Rumus", desc: "Ambil dua titik dari grafik → misalkan f(x) = ax + b → substitusi → selesaikan a dan b.", color: "from-orange-900/60 to-amber-900/60 border-orange-500/40 text-orange-300" },
                  ].map(({ icon, label, desc, color }) => (
                    <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="font-display text-xs font-bold mb-0.5">{label}</p>
                        <p className="font-body text-xs text-white/80 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TIPS & TRIK */}
                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">💡 Tips &amp; Trik</p>
                  <div className="space-y-2">
                    {[
                      "Selalu cek satuan sumbu-x dan sumbu-y dulu — jangan langsung hitung tanpa tahu satuannya!",
                      "Grafik naik (a > 0), grafik turun (a < 0), grafik datar/mendatar (a = 0).",
                      "Untuk mencari rumus dari grafik: ambil dua titik yang jelas koordinatnya, lalu substitusi ke f(x) = ax + b.",
                    ].map((tip, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/30 text-amber-200 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                        <p className="font-body text-xs text-amber-100/90 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KESIMPULAN */}
                <div className="bg-gradient-to-r from-green-900/60 to-teal-900/60 border border-green-400/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-green-300 uppercase tracking-wider mb-2">🎯 Kesimpulan</p>
                  <p className="font-body text-sm text-white/90 leading-relaxed">
                    Grafik fungsi linear adalah <strong className="text-green-300">"peta visual"</strong> dari sebuah fungsi. Baca grafiknya dengan teliti, perhatikan <strong className="text-teal-300">satuannya</strong>, dan kamu bisa menjawab soal bahkan tanpa rumus!
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrafikFungsiPage;
