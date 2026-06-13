import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, BookOpen, Calculator, RefreshCw } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const BentukDesimalPage = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setActiveSection(activeSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/materi-matematika/kelas-7/bilangan-rasional" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6">
          <ArrowLeft size={20} />
          <span>Kembali ke Bilangan Rasional</span>
        </Link>

        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 mb-8 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Bentuk Desimal</h1>
          <p className="text-cyan-100">Memahami bilangan desimal dan konversinya dengan pecahan</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl mb-4 overflow-hidden border border-slate-700">
          <button onClick={() => toggleSection(0)} className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50">
            <div className="flex items-center gap-3">
              <BookOpen className="text-cyan-400" size={24} />
              <span className="font-semibold text-lg">1. Memahami Bilangan Desimal</span>
            </div>
            <ChevronRight className={`transform transition-transform ${activeSection === 0 ? "rotate-90" : ""}`} size={20} />
          </button>
          {activeSection === 0 && (
            <div className="p-4 border-t border-slate-700 space-y-4">
              <div className="bg-cyan-900/30 border-l-4 border-cyan-400 p-4 rounded-r-lg">
                <p className="font-medium text-cyan-300">Ringkasan Intisari</p>
                <p className="text-slate-300 mt-1">Bilangan desimal adalah cara penulisan bilangan menggunakan tanda koma untuk memisahkan bagian bulat dan bagian pecahan.</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="font-medium mb-3">Nilai Tempat dalam Bilangan Desimal:</p>
                <p className="text-sm text-slate-300">Contoh: 2345,678</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>2 = ribuan (2000)</li>
                  <li>3 = ratusan (300)</li>
                  <li>4 = puluhan (40)</li>
                  <li>5 = satuan (5)</li>
                  <li>6 = persepuluhan (6/10)</li>
                  <li>7 = perseratusan (7/100)</li>
                  <li>8 = perseribu (8/1000)</li>
                </ul>
              </div>
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">Mudah</span>
                <p className="font-medium mb-2">Tentukan nilai tempat angka 7 pada bilangan 3,478!</p>
                <div className="bg-slate-800 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">Pembahasan:</p>
                  <p>3 = satuan, 4 = persepuluhan, 7 = perseratusan, 8 = perseribu</p>
                  <p className="text-cyan-400 font-semibold mt-2">Jadi, angka 7 berada di tempat perseratusan.</p>
                </div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">Sedang</span>
                <p className="font-medium mb-2">Nyatakan 2345,678 dalam bentuk penjumlahan nilai tempat!</p>
                <div className="bg-slate-800 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">Pembahasan:</p>
                  <BlockMath math="2345,678 = 2000 + 300 + 40 + 5 + 0,6 + 0,07 + 0,008" />
                  <p className="text-cyan-400 font-semibold mt-2">Setiap digit dikalikan dengan nilai tempatnya.</p>
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">Sulit</span>
                <p className="font-medium mb-2">Nyatakan 4,67 sebagai pecahan campuran!</p>
                <div className="bg-slate-800 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">Pembahasan:</p>
                  <p>4,67 memiliki 2 angka di belakang koma (perseratusan)</p>
                  <BlockMath math="4,67 = 4\frac{67}{100}" />
                  <p className="text-cyan-400 font-semibold mt-2">Jadi, 4,67 sama dengan 4 67/100</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-800/50 rounded-xl mb-4 overflow-hidden border border-slate-700">
          <button onClick={() => toggleSection(1)} className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50">
            <div className="flex items-center gap-3">
              <Calculator className="text-cyan-400" size={24} />
              <span className="font-semibold text-lg">2. Mengubah Pecahan ke Desimal</span>
            </div>
            <ChevronRight className={`transform transition-transform ${activeSection === 1 ? "rotate-90" : ""}`} size={20} />
          </button>
          {activeSection === 1 && (
            <div className="p-4 border-t border-slate-700 space-y-4">
              <div className="bg-cyan-900/30 border-l-4 border-cyan-400 p-4 rounded-r-lg">
                <p className="font-medium text-cyan-300">Ringkasan Intisari</p>
                <p className="text-slate-300 mt-1">Ada dua cara: (1) mengubah penyebut menjadi 10, 100, atau 1000, dan (2) membagi pembilang dengan penyebut.</p>
              </div>
              <div className="bg-amber-900/20 border border-amber-600 rounded-lg p-3">
                <p className="text-amber-300 font-medium">Tips:</p>
                <p className="text-sm">Jika penyebut sulit diubah menjadi 10/100/1000, gunakan cara pembagian!</p>
              </div>
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">Mudah</span>
                <p className="font-medium mb-2">Ubah 3/5 menjadi bentuk desimal!</p>
                <div className="bg-slate-800 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">Pembahasan:</p>
                  <BlockMath math="\frac{3}{5} = \frac{3 \times 2}{5 \times 2} = \frac{6}{10} = 0,6" />
                  <p className="text-cyan-400 font-semibold mt-2">Jadi, 3/5 = 0,6</p>
                </div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">Sedang</span>
                <p className="font-medium mb-2">Ubah 4/125 menjadi bentuk desimal!</p>
                <div className="bg-slate-800 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">Pembahasan:</p>
                  <BlockMath math="\frac{4}{125} = \frac{4 \times 8}{125 \times 8} = \frac{32}{1000} = 0,032" />
                  <p className="text-cyan-400 font-semibold mt-2">Jadi, 4/125 = 0,032</p>
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">Sulit</span>
                <p className="font-medium mb-2">Ubah 7/11 menjadi desimal (4 tempat desimal)!</p>
                <div className="bg-slate-800 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">Pembahasan:</p>
                  <p>Penyebut 11 tidak bisa diubah ke 10/100/1000, gunakan pembagian:</p>
                  <BlockMath math="7 \div 11 = 0,6363..." />
                  <p className="text-cyan-400 font-semibold mt-2">Jadi, 7/11 = 0,6363 (desimal berulang)</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-800/50 rounded-xl mb-4 overflow-hidden border border-slate-700">
          <button onClick={() => toggleSection(2)} className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50">
            <div className="flex items-center gap-3">
              <RefreshCw className="text-cyan-400" size={24} />
              <span className="font-semibold text-lg">3. Mengubah Desimal ke Pecahan</span>
            </div>
            <ChevronRight className={`transform transition-transform ${activeSection === 2 ? "rotate-90" : ""}`} size={20} />
          </button>
          {activeSection === 2 && (
            <div className="p-4 border-t border-slate-700 space-y-4">
              <div className="bg-cyan-900/30 border-l-4 border-cyan-400 p-4 rounded-r-lg">
                <p className="font-medium text-cyan-300">Ringkasan Intisari</p>
                <p className="text-slate-300 mt-1">Hitung jumlah angka di belakang koma untuk menentukan penyebutnya.</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="font-medium mb-2">Aturan Penyebut:</p>
                <ul className="space-y-1 text-sm">
                  <li>1 angka = penyebut 10</li>
                  <li>2 angka = penyebut 100</li>
                  <li>3 angka = penyebut 1000</li>
                </ul>
              </div>
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">Mudah</span>
                <p className="font-medium mb-2">Ubah 0,6 menjadi pecahan!</p>
                <div className="bg-slate-800 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">Pembahasan:</p>
                  <BlockMath math="0,6 = \frac{6}{10} = \frac{3}{5}" />
                  <p className="text-cyan-400 font-semibold mt-2">Jadi, 0,6 = 3/5</p>
                </div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">Sedang</span>
                <p className="font-medium mb-2">Ubah 0,125 menjadi pecahan paling sederhana!</p>
                <div className="bg-slate-800 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">Pembahasan:</p>
                  <BlockMath math="0,125 = \frac{125}{1000} = \frac{1}{8}" />
                  <p className="text-cyan-400 font-semibold mt-2">Jadi, 0,125 = 1/8</p>
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">Sulit</span>
                <p className="font-medium mb-2">Ubah 0,000289 menjadi pecahan!</p>
                <div className="bg-slate-800 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">Pembahasan:</p>
                  <p>6 angka di belakang koma, penyebut = 1000000</p>
                  <BlockMath math="0,000289 = \frac{289}{1000000}" />
                  <p className="text-cyan-400 font-semibold mt-2">Jadi, 0,000289 = 289/1000000</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">🔢 RANGKUMAN LENGKAP</p>
            <p className="font-body text-xs text-white/80 mt-0.5">Bentuk Desimal — Kelas 7</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-sky-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/30 border border-sky-500 flex items-center justify-center text-[10px]">1</span>
                Konsep Bentuk Desimal
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Desimal = Pecahan dengan penyebut 10ⁿ", desc: "0,3 = 3/10 | 0,45 = 45/100 | 0,125 = 125/1000. Hitung angka di belakang koma untuk tahu penyebutnya!", color: "from-sky-900/70 to-sky-800/30 border-sky-500/50 text-sky-200" },
                  { label: "Konversi Pecahan → Desimal", desc: "Cara 1: bagi pembilang ÷ penyebut. 3/4 = 3÷4 = 0,75. Cara 2: jadikan penyebut 10ⁿ. 3/4 = 75/100 = 0,75", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
                  { label: "Konversi Desimal → Pecahan", desc: "Tuliskan angkanya sebagai pembilang dengan penyebut 10ⁿ sesuai jumlah desimal, lalu sederhanakan dengan FPB.", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
                  { label: "Desimal berulang dan berhenti", desc: "1/3 = 0,333... (berulang). 1/4 = 0,25 (berhenti). Penyebut hanya faktor 2 dan 5 → desimal berhenti!", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
                ].map(({ label, desc, color }) => (
                  <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                    <div><p className="font-body text-xs font-bold">{label}</p><p className="font-body text-xs text-white/65 mt-0.5">{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">2</span>
                Tips &amp; Trik Jitu
              </p>
              <div className="space-y-2">
                {[
                  { icon: "🔑", tip: "Hitung angka di belakang koma → tentukan penyebut", detail: "0,7 punya 1 angka → penyebut 10. 0,75 punya 2 angka → penyebut 100. 0,125 punya 3 angka → penyebut 1000. Sesederhana itu!", color: "bg-sky-900/30 border-sky-500/30" },
                  { icon: "⚡", tip: "Pecahan dengan penyebut 2, 4, 5, 8, 10, 25 → desimal berhenti", detail: "1/8 = 0,125 (berhenti). 1/7 = 0,142857... (berulang). Bila penyebut setelah disederhanakan hanya faktor 2 dan 5, desimalnya pasti berhenti!", color: "bg-blue-900/30 border-blue-500/30" },
                  { icon: "🎯", tip: "Hafal konversi pecahan umum", detail: "1/2=0,5 | 1/4=0,25 | 3/4=0,75 | 1/5=0,2 | 1/8=0,125 | 1/10=0,1. Hafal ini dan konversi jadi super cepat!", color: "bg-indigo-900/30 border-indigo-500/30" },
                  { icon: "✅", tip: "Sederhanakan setelah konversi", detail: "0,25 = 25/100 = 1/4 (bagi dengan FPB=25). Selalu cari FPB akhir agar jawabannya dalam bentuk paling sederhana!", color: "bg-violet-900/30 border-violet-500/30" },
                ].map(({ icon, tip, detail, color }) => (
                  <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div><p className="font-body text-xs font-bold text-white">{tip}</p><p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-500/20 via-blue-500/15 to-indigo-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">💙</div>
              <p className="font-display text-base font-bold text-white">KESIMPULAN</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Bentuk desimal dan pecahan adalah <strong className="text-sky-300">dua cara berbeda untuk menyatakan hal yang sama</strong>. Kunci konversinya: jumlah angka di belakang koma menentukan penyebut (10, 100, 1000). Hafalkan pecahan-desimal umum, dan kamu akan bisa bergerak bebas antara kedua bentuk ini dengan cepat!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {["Desimal = Pecahan /10ⁿ", "Pecahan → Bagi", "Desimal → Penyebut 10ⁿ", "Sederhanakan FPB", "Hafal Konversi Umum"].map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">🚀 Lanjut ke operasi-operasi bentuk desimal!</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/materi-matematika/kelas-7/bilangan-rasional")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Bilangan Rasional
          </button>
        </div>
      </div>
    </div>
  );
};

export default BentukDesimalPage;
