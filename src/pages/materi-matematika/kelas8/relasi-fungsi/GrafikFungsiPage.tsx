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
    soal, opsi, kunci, pembahasan
  }: { soal: string; opsi: { kode: string; teks: string }[]; kunci: string; pembahasan: string }) => {
    const dipilih = jawaban[soal];
    const sudahJawab = !!dipilih;
    return (
      <div className="space-y-2">
        {opsi.map(({ kode, teks }) => {
          const benar = kode === kunci;
          const dipilihIni = dipilih === kode;
          let cls = "border rounded-lg px-4 py-2.5 text-sm font-body cursor-pointer transition-all flex items-center gap-3 ";
          if (!sudahJawab) {
            cls += "border-white/20 text-white/80 hover:border-cyan-400/60 hover:bg-cyan-900/20";
          } else if (benar) {
            cls += "border-green-500 bg-green-900/30 text-green-300 font-semibold";
          } else if (dipilihIni) {
            cls += "border-red-500 bg-red-900/20 text-red-300 line-through";
          } else {
            cls += "border-white/10 text-white/40";
          }
          return (
            <button key={kode} onClick={() => !sudahJawab && pilihJawaban(soal, kode)} className={cls} disabled={sudahJawab}>
              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${sudahJawab && benar ? "border-green-400 bg-green-500/30 text-green-300" : sudahJawab && dipilihIni ? "border-red-400 bg-red-500/20 text-red-300" : "border-white/30 text-white/50"}`}>{kode}</span>
              {teks}
              {sudahJawab && benar && <span className="ml-auto text-green-400 text-xs font-bold">✓ BENAR</span>}
              {sudahJawab && dipilihIni && !benar && <span className="ml-auto text-red-400 text-xs font-bold">✗ SALAH</span>}
            </button>
          );
        })}
        {sudahJawab && (
          <div className={`rounded-lg p-3 text-xs font-body mt-1 ${jawaban[soal] === kunci ? "bg-green-900/20 border border-green-500/40 text-green-200" : "bg-orange-900/20 border border-orange-500/40 text-orange-200"}`}>
            <strong>💡 Pembahasan:</strong> {pembahasan}
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
                    Perhatikan grafik berikut yang menunjukkan hubungan antara <strong className="text-cyan-300">modal</strong> (sumbu-x, dalam ribuan rupiah) dan <strong className="text-orange-300">keuntungan</strong> (sumbu-y, dalam rupiah) suatu usaha!
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
                      <text x={9} y={17} fill="#94a3b8" fontSize="8">(Rp)</text>
                      {/* X labels: 10,20,30,40,50 (in thousands) */}
                      {[10,20,30,40,50].map((v,i) => (
                        <text key={v} x={65+(i+1)*40-7} y={190} fill="#64748b" fontSize="8">{v}</text>
                      ))}
                      {/* Y labels: actual rupiah 500, 1.000, 1.500, 2.000, 2.500 */}
                      {["500","1.000","1.500","2.000","2.500"].map((v,i) => (
                        <text key={v} x={2} y={175-(i+1)*30+3} fill="#64748b" fontSize="7.5">{v}</text>
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
                  soal="c1"
                  opsi={[
                    { kode: "A", teks: "Rp 1.250,00" },
                    { kode: "B", teks: "Rp 1.350,00" },
                    { kode: "C", teks: "Rp 1.500,00" },
                    { kode: "D", teks: "Rp 1.750,00" },
                  ]}
                  kunci="A"
                  pembahasan="Dari grafik, fungsinya adalah f(x) = 0,05x (untung = 5% dari modal). Dengan modal x = 25 (ribu), maka untung = 0,05 × 25 = 1,25 (ribu) = Rp 1.250,00. Bisa juga dibaca langsung dari grafik: tarik garis vertikal dari x=25 ke garis grafik, lalu tarik horizontal ke sumbu-y → hasilnya 1,25 (ribu Rp)."
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
                  {/* GRAFIK TARIF TAKSI */}
                  <div className="bg-slate-900/70 border border-yellow-500/20 rounded-xl p-4">
                    <svg viewBox="0 0 310 230" className="w-full max-w-sm mx-auto">
                      {/* Grid */}
                      {[1,2,3,4,5,6].map(i => (
                        <g key={i}>
                          <line x1={55+i*35} y1={15} x2={55+i*35} y2={180} stroke="#1e293b" strokeWidth="1" />
                          <line x1={55} y1={180-i*25} x2={270} y2={180-i*25} stroke="#1e293b" strokeWidth="1" />
                        </g>
                      ))}
                      {/* Axes */}
                      <line x1={55} y1={15} x2={55} y2={185} stroke="#475569" strokeWidth="1.5" />
                      <line x1={50} y1={180} x2={275} y2={180} stroke="#475569" strokeWidth="1.5" />
                      <polygon points="275,177 275,183 282,180" fill="#475569" />
                      <polygon points="52,15 58,15 55,8" fill="#475569" />
                      {/* Axis titles */}
                      <text x={280} y={184} fill="#94a3b8" fontSize="8">km</text>
                      <text x={5} y={18} fill="#94a3b8" fontSize="8">Tarif</text>
                      <text x={3} y={27} fill="#94a3b8" fontSize="8">(ribu Rp)</text>
                      {/* X axis: 0, 5, 10, 15, 20, 25, 30 */}
                      {[5,10,15,20,25,30].map((v,i) => (
                        <text key={v} x={55+(i+1)*35-5} y={195} fill="#64748b" fontSize="8">{v}</text>
                      ))}
                      {/* Y axis: 10,20,30,40,50,60,70,80 → scale 25px each = 8 */}
                      {/* f(x) = 8 + 2.6x; f(0)=8, f(5)=21, f(10)=34, f(15)=47, f(20)=60, f(25)=73, f(30)=86 */}
                      {/* y_px = 180 - (y_val - 0) * (180-15) / 90 = 180 - y_val * 1.833 */}
                      {/* x_px = 55 + x_val * 35/5 = 55 + x_val*7 */}
                      {[10,20,30,40,50,60,70,80].map((v,i) => (
                        <text key={v} x={32} y={180-(i+1)*20+3} fill="#64748b" fontSize="8">{v}</text>
                      ))}
                      <text x={42} y={184} fill="#64748b" fontSize="8">0</text>
                      <text x={130} y={215} fill="#94a3b8" fontSize="8">Jarak (km)</text>
                      {/* Line: f(x) = 8 + 2.6x */}
                      {/* Scale: x_px = 55 + x*7; y_px = 180 - y*2 */}
                      {/* f(0)=8: (55, 180-16=164); f(30)=86: (265, 180-172=8) */}
                      <line x1={55} y1={164} x2={265} y2={8} stroke="#fbbf24" strokeWidth="2.5" />
                      {/* Points at multiples of 5 */}
                      {[[0,8],[5,21],[10,34],[15,47],[20,60],[25,73],[30,86]].map(([x,y]) => (
                        <circle key={x} cx={55+x*7} cy={180-y*2} r="3.5" fill="#fbbf24" stroke="#fde68a" strokeWidth="1.5" />
                      ))}
                      {/* Highlight x=25, y=73 */}
                      <line x1={230} y1={180} x2={230} y2={34} stroke="#f97316" strokeWidth="1.5" strokeDasharray="5,3" />
                      <line x1={55} y1={34} x2={230} y2={34} stroke="#f97316" strokeWidth="1.5" strokeDasharray="5,3" />
                      <circle cx={230} cy={34} r="5.5" fill="#f97316" stroke="#fdba74" strokeWidth="1.5" />
                      <text x={235} y={31} fill="#f97316" fontSize="9" fontWeight="bold">(25, 73)</text>
                      <text x={222} y={196} fill="#f97316" fontSize="9" fontWeight="bold">25</text>
                      <text x={10} y={37} fill="#f97316" fontSize="9" fontWeight="bold">73</text>
                    </svg>
                    <p className="text-xs text-center text-white/40 mt-1 font-body">Grafik tarif taksi berdasarkan jarak tempuh</p>
                  </div>
                  <p className="font-body text-sm text-white/85 mt-4">
                    Una pergi ke rumah nenek yang berjarak <strong className="text-orange-300">25 kilometer</strong>. Berapa tarif taksi yang harus dibayar Una?
                  </p>
                </div>
                <PilihanGanda
                  soal="c2"
                  opsi={[
                    { kode: "A", teks: "Rp 66.000,00" },
                    { kode: "B", teks: "Rp 73.000,00" },
                    { kode: "C", teks: "Rp 82.000,00" },
                    { kode: "D", teks: "Rp 143.000,00" },
                  ]}
                  kunci="B"
                  pembahasan="Dari grafik, fungsi tarif adalah f(x) = 8 + 2,6x (dalam ribuan rupiah), di mana 8 = tarif dasar dan 2,6 = tarif per km. Untuk jarak x = 25 km: f(25) = 8 + 2,6 × 25 = 8 + 65 = 73 (ribu) = Rp 73.000,00. Bisa dibaca langsung dari titik (25, 73) pada grafik."
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
                  {/* DIAGRAM PANAH */}
                  <div className="bg-slate-900/70 border border-purple-500/20 rounded-xl p-4">
                    <svg viewBox="0 0 280 180" className="w-full max-w-xs mx-auto">
                      {/* Domain circle */}
                      <ellipse cx={70} cy={90} rx={50} ry={75} fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
                      <text x={55} y={22} fill="#a78bfa" fontSize="10" fontWeight="bold">Domain</text>
                      {/* Range circle */}
                      <ellipse cx={210} cy={90} rx={50} ry={75} fill="none" stroke="#06b6d4" strokeWidth="1.5" />
                      <text x={196} y={22} fill="#67e8f9" fontSize="10" fontWeight="bold">Range</text>
                      {/* Domain values */}
                      {[["1",45],["2",70],["3",95],["4",120]].map(([v,y]) => (
                        <text key={v} x={62} y={Number(y)+4} fill="#c4b5fd" fontSize="13" fontWeight="bold">{v}</text>
                      ))}
                      {/* Range values */}
                      {[["2",45],["5",70],["8",95],["11",120]].map(([v,y]) => (
                        <text key={v} x={202} y={Number(y)+4} fill="#67e8f9" fontSize="13" fontWeight="bold">{v}</text>
                      ))}
                      {/* Arrows */}
                      {[[45,45],[70,70],[95,95],[120,120]].map(([y1,y2]) => (
                        <g key={y1}>
                          <line x1={82} y1={y1} x2={190} y2={y2} stroke="#94a3b8" strokeWidth="1.2" markerEnd="url(#arr)" />
                        </g>
                      ))}
                      <defs>
                        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                          <polygon points="0,0 6,3 0,6" fill="#94a3b8" />
                        </marker>
                      </defs>
                      {/* Labels inside */}
                      <text x={52} y={160} fill="#7c3aed" fontSize="8">A</text>
                      <text x={196} y={160} fill="#0e7490" fontSize="8">B</text>
                    </svg>
                    <div className="flex justify-center gap-8 mt-2 text-xs font-body">
                      <div className="text-center">
                        <p className="text-purple-300 font-bold">Domain (A)</p>
                        <p className="text-white/60">&#123; 1, 2, 3, 4 &#125;</p>
                      </div>
                      <div className="text-center text-white/40">→</div>
                      <div className="text-center">
                        <p className="text-cyan-300 font-bold">Range (B)</p>
                        <p className="text-white/60">&#123; 2, 5, 8, 11 &#125;</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-700/40 rounded-lg p-3 mt-3">
                    <p className="text-xs font-body text-white/60 mb-2">📋 Tabel pasangan nilai dari diagram panah:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body border-collapse text-center">
                        <thead>
                          <tr className="bg-purple-900/40">
                            <th className="border border-purple-500/30 px-3 py-1.5 text-purple-200">x (Domain)</th>
                            {[1,2,3,4].map(v => <td key={v} className="border border-purple-500/30 px-3 py-1.5 text-white">{v}</td>)}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th className="border border-purple-500/30 px-3 py-1.5 text-cyan-200">f(x) (Range)</th>
                            {[2,5,8,11].map(v => <td key={v} className="border border-purple-500/30 px-3 py-1.5 text-cyan-300 font-bold">{v}</td>)}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <PilihanGanda
                  soal="c3"
                  opsi={[
                    { kode: "A", teks: "f(x) = x + 1" },
                    { kode: "B", teks: "f(x) = 2x − 1" },
                    { kode: "C", teks: "f(x) = 3x − 1" },
                    { kode: "D", teks: "f(x) = 4x − 2" },
                  ]}
                  kunci="C"
                  pembahasan="Perhatikan pola: setiap x bertambah 1, nilai f(x) bertambah 3. Jadi koefisien x adalah 3. Cek: f(1)=3(1)−1=2 ✓, f(2)=3(2)−1=5 ✓, f(3)=3(3)−1=8 ✓, f(4)=3(4)−1=11 ✓. Rumus fungsinya adalah f(x) = 3x − 1."
                />
                {/* Cara menentukan rumus */}
                <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🔑 Cara Menentukan Rumus dari Tabel/Diagram</p>
                  <div className="space-y-2 text-xs font-body text-white/70">
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">Langkah 1 — Cari selisih nilai f(x):</p>
                      <BlockMath math="5-2=3,\quad 8-5=3,\quad 11-8=3" />
                      <p>Selisih tetap = 3 → koefisien x adalah <strong className="text-cyan-300">3</strong></p>
                    </div>
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Cari konstanta (c):</p>
                      <p>Anggap f(x) = 3x + c, substitusi satu titik, misal (1, 2):</p>
                      <BlockMath math="2 = 3(1) + c \implies c = 2 - 3 = -1" />
                    </div>
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Langkah 3 — Tulis rumus & verifikasi:</p>
                      <BlockMath math="f(x) = 3x - 1" />
                      <p>Cek semua titik → semuanya cocok ✓</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {[
                    ["Fungsi Linear", "f(x) = ax + b menghasilkan grafik garis lurus"],
                    ["Membaca Grafik", "Dari x → tarik vertikal ke garis → tarik horizontal → baca nilai y"],
                    ["Konteks Nyata", "Sumbu-x dan sumbu-y mewakili besaran nyata; baca satuannya!"],
                    ["Selisih Tetap", "Jika selisih f(x) selalu sama, fungsinya linear dengan a = selisih itu"],
                    ["Cari Rumus", "Koefisien x = selisih f(x) per satuan x; konstanta b dari substitusi titik"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>💡 Tip Ujian:</strong> Selalu perhatikan satuan pada sumbu-x dan sumbu-y! Jangan lupa konversi satuan jika diperlukan (misal: ribu rupiah ke rupiah).
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
