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
      </div>
    </div>
  );
};

export default BentukDesimalPage;
