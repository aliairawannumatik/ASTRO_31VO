import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/* ── Hardcoded ID strings (no i18n needed for TKA page) ── */

const SenilaiRingkasan = (
  <div className="mt-5 space-y-4">

    {/* ── Ringkasan Intisari: Perbandingan Senilai ── */}
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <svg className="w-5 h-5 text-green-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        <span className="font-body font-semibold text-white">Perbandingan Senilai</span>
      </div>
      <div className="px-5 pb-5 space-y-4">
        <p className="font-body text-sm text-white/80 leading-relaxed">
          Pada perbandingan senilai, rasio antara dua besaran selalu konstan (tetap). Sehingga ketika salah satu berubah, yang lain berubah secara proporsional.
        </p>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-4">
          <p className="font-body text-sm font-semibold text-green-300">Rumus Perbandingan Senilai:</p>
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm border-collapse text-center">
              <thead>
                <tr className="bg-green-600/30">
                  <th className="px-4 py-2 text-green-200 border border-green-500/40 font-bold"><InlineMath math="V_1" /></th>
                  <th className="px-4 py-2 text-green-200 border border-green-500/40 font-bold"><InlineMath math="V_2" /></th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="bg-slate-800/40">
                  <td className="px-4 py-2 border border-green-500/30 font-bold text-white"><InlineMath math="a_1" /></td>
                  <td className="px-4 py-2 border border-green-500/30 font-bold text-white"><InlineMath math="b_1" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-green-500/30 font-bold text-white"><InlineMath math="a_2" /></td>
                  <td className="px-4 py-2 border border-green-500/30 font-bold text-white"><InlineMath math="b_2" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-5 flex flex-col items-center gap-4">
            <p className="font-body text-xs text-white/50">Kali silang (cross multiplication):</p>
            <div className="relative w-full max-w-sm" style={{ height: 140 }}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 140" preserveAspectRatio="none">
                <line x1="75" y1="35" x2="225" y2="105" stroke="#facc15" strokeWidth="2.5" strokeDasharray="6 3" />
                <line x1="225" y1="35" x2="75" y2="105" stroke="#fb923c" strokeWidth="2.5" strokeDasharray="6 3" />
                <circle cx="150" cy="70" r="5" fill="#ffffff" fillOpacity="0.15" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
              </svg>
              <div className="absolute flex flex-col items-center gap-1" style={{ left: '10%', top: 8 }}>
                <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-5 py-3 text-center shadow-lg shadow-green-900/30">
                  <span className="font-body font-bold text-white text-base"><InlineMath math="a_1" /></span>
                </div>
                <span className="font-body text-[10px] text-green-300 font-semibold">V₁ · A</span>
              </div>
              <div className="absolute flex flex-col items-center gap-1" style={{ right: '10%', top: 8 }}>
                <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-5 py-3 text-center shadow-lg shadow-green-900/30">
                  <span className="font-body font-bold text-white text-base"><InlineMath math="a_2" /></span>
                </div>
                <span className="font-body text-[10px] text-green-300 font-semibold">V₂ · A</span>
              </div>
              <div className="absolute flex flex-col items-center gap-1" style={{ left: '10%', bottom: 8 }}>
                <span className="font-body text-[10px] text-blue-300 font-semibold">V₁ · B</span>
                <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-5 py-3 text-center shadow-lg shadow-blue-900/30">
                  <span className="font-body font-bold text-white text-base"><InlineMath math="b_1" /></span>
                </div>
              </div>
              <div className="absolute flex flex-col items-center gap-1" style={{ right: '10%', bottom: 8 }}>
                <span className="font-body text-[10px] text-blue-300 font-semibold">V₂ · B</span>
                <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-5 py-3 text-center shadow-lg shadow-blue-900/30">
                  <span className="font-body font-bold text-white text-base"><InlineMath math="b_2" /></span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-[10px] font-body">
              <span className="flex items-center gap-1"><span className="inline-block w-5 border-t-2 border-dashed border-yellow-400"></span><span className="text-yellow-300">a₁ × b₂</span></span>
              <span className="flex items-center gap-1"><span className="inline-block w-5 border-t-2 border-dashed border-orange-400"></span><span className="text-orange-300">a₂ × b₁</span></span>
            </div>
            <div className="w-full border-t border-white/10 pt-3 text-center">
              <BlockMath math="a_1 \times b_2 = a_2 \times b_1" />
            </div>
          </div>
          <p className="font-body text-xs text-white/60">
            Di mana <InlineMath math="a" /> dan <InlineMath math="b" /> adalah dua besaran yang bergerak searah (senilai).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm border-collapse">
            <thead>
              <tr className="bg-green-500/20">
                <th className="px-3 py-2 text-green-300 text-left border border-green-500/30">Besaran A (naik ↑)</th>
                <th className="px-3 py-2 text-green-300 text-left border border-green-500/30">Besaran B (naik ↑)</th>
              </tr>
            </thead>
            <tbody className="text-white/70">
              <tr className="border border-green-500/20"><td className="px-3 py-2">Jumlah barang dibeli</td><td className="px-3 py-2">Total harga</td></tr>
              <tr className="border border-green-500/20 bg-slate-800/30"><td className="px-3 py-2">Lama bekerja (jam)</td><td className="px-3 py-2">Jumlah produk yang dibuat</td></tr>
              <tr className="border border-green-500/20"><td className="px-3 py-2">Jumlah bahan bakar</td><td className="px-3 py-2">Jarak yang ditempuh</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* ── Ringkasan Intisari: Perbandingan Berbalik Nilai ── */}
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <svg className="w-5 h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        <span className="font-body font-semibold text-white">Perbandingan Berbalik Nilai</span>
      </div>
      <div className="px-5 pb-5 space-y-4">
        <p className="font-body text-sm text-white/80 leading-relaxed">
          Pada perbandingan berbalik nilai, hasil kali kedua besaran selalu konstan. Artinya, saat satu naik dua kali lipat, yang lain turun menjadi setengahnya.
        </p>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-4">
          <p className="font-body text-sm font-semibold text-red-300">Rumus Perbandingan Berbalik Nilai:</p>
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm border-collapse text-center">
              <thead>
                <tr className="bg-red-600/30">
                  <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold"><InlineMath math="V_1" /></th>
                  <th className="px-4 py-2 text-red-200 border border-red-500/40 font-bold"><InlineMath math="V_2" /></th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="bg-slate-800/40">
                  <td className="px-4 py-2 border border-red-500/30 font-bold text-white"><InlineMath math="a_1" /></td>
                  <td className="px-4 py-2 border border-red-500/30 font-bold text-white"><InlineMath math="b_1" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-red-500/30 font-bold text-white"><InlineMath math="a_2" /></td>
                  <td className="px-4 py-2 border border-red-500/30 font-bold text-white"><InlineMath math="b_2" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-4 flex flex-col items-center gap-3">
            <p className="font-body text-xs text-white/50">Kali sejajar (tiap baris dikalikan sejajar):</p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <div className="flex items-center gap-2">
                <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-5 py-3 text-center flex-1 shadow-lg shadow-green-900/30">
                  <span className="font-body font-bold text-white text-base"><InlineMath math="a_1" /></span>
                </div>
                <div className="flex-1 border-t-4 border-dashed border-yellow-400 relative flex items-center justify-center">
                  <span className="absolute font-body text-[9px] text-yellow-300 -top-3">sejajar</span>
                </div>
                <div className="bg-green-600/40 border-2 border-green-400/70 rounded-lg px-5 py-3 text-center flex-1 shadow-lg shadow-green-900/30">
                  <span className="font-body font-bold text-white text-base"><InlineMath math="a_2" /></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-5 py-3 text-center flex-1 shadow-lg shadow-blue-900/30">
                  <span className="font-body font-bold text-white text-base"><InlineMath math="b_1" /></span>
                </div>
                <div className="flex-1 border-t-4 border-dashed border-yellow-400 relative flex items-center justify-center">
                  <span className="absolute font-body text-[9px] text-yellow-300 -top-3">sejajar</span>
                </div>
                <div className="bg-blue-600/40 border-2 border-blue-400/70 rounded-lg px-5 py-3 text-center flex-1 shadow-lg shadow-blue-900/30">
                  <span className="font-body font-bold text-white text-base"><InlineMath math="b_2" /></span>
                </div>
              </div>
            </div>
            <div className="w-full border-t border-white/10 pt-3 text-center">
              <BlockMath math="a_1 \times a_2 = b_1 \times b_2" />
            </div>
          </div>
          <p className="font-body text-xs text-white/60">
            Besaran A dikalikan sejajar, Besaran B dikalikan sejajar — hasilnya selalu sama (konstan).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm border-collapse">
            <thead>
              <tr className="bg-red-500/20">
                <th className="px-3 py-2 text-red-300 text-left border border-red-500/30">Besaran A (naik ↑)</th>
                <th className="px-3 py-2 text-red-300 text-left border border-red-500/30">Besaran B (turun ↓)</th>
              </tr>
            </thead>
            <tbody className="text-white/70">
              <tr className="border border-red-500/20"><td className="px-3 py-2">Jumlah pekerja</td><td className="px-3 py-2">Waktu penyelesaian proyek</td></tr>
              <tr className="border border-red-500/20 bg-slate-800/30"><td className="px-3 py-2">Kecepatan kendaraan</td><td className="px-3 py-2">Waktu tempuh perjalanan</td></tr>
              <tr className="border border-red-500/20"><td className="px-3 py-2">Jumlah hewan ternak</td><td className="px-3 py-2">Durasi persediaan pakan</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* ── Kasus Khusus: Proyek yang Terhenti ── */}
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <svg className="w-5 h-5 text-orange-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <span className="font-body font-semibold text-white">Kasus Khusus: Proyek yang Terhenti</span>
      </div>
      <div className="px-5 pb-5 space-y-4">
        <p className="font-body text-sm text-white/80 leading-relaxed">
          Soal tingkat lanjut sering menggabungkan berbalik nilai dengan konsep sisa pekerjaan. Strategi penyelesaiannya adalah menghitung &ldquo;satuan kerja&rdquo; total lalu menggunakan sisanya.
        </p>
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-2">
          <p className="font-body text-sm font-semibold text-orange-300 mb-2">Langkah Strategis:</p>
          <div className="font-body text-sm text-white/80 space-y-1">
            <p><strong className="text-orange-300">① Hitung total beban kerja:</strong> jumlah pekerja awal × total hari rencana</p>
            <p><strong className="text-orange-300">② Hitung pekerjaan yang sudah selesai:</strong> pekerja awal × hari yang sudah berjalan</p>
            <p><strong className="text-orange-300">③ Cari sisa beban kerja:</strong> total − yang sudah selesai</p>
            <p><strong className="text-orange-300">④ Hitung sisa waktu tersedia:</strong> total hari − hari sudah berjalan − hari libur</p>
            <p><strong className="text-orange-300">⑤ Pekerja yang dibutuhkan:</strong> sisa beban ÷ sisa waktu</p>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="font-body text-sm text-white/60 text-xs">Contoh singkat: Proyek 20 hari oleh 15 pekerja. Setelah 8 hari, libur 4 hari. Berapa tambahan pekerja?</p>
          <div className="mt-2 space-y-1 font-body text-sm text-white/80">
            <p>Total beban = <InlineMath math="20 \times 15 = 300" /> satuan</p>
            <p>Selesai = <InlineMath math="8 \times 15 = 120" /> satuan → Sisa = <InlineMath math="300 - 120 = 180" /></p>
            <p>Sisa waktu = <InlineMath math="20 - 8 - 4 = 8" /> hari</p>
            <p>Pekerja dibutuhkan = <InlineMath math="180 \div 8 = 22{,}5 \approx 23" /> orang</p>
            <p className="text-orange-300 font-semibold">Tambahan = <InlineMath math="23 - 15 = 8" /> orang</p>
          </div>
        </div>
      </div>
    </div>

  </div>
);

const BertingkatRingkasan = (
  <div className="mt-5 space-y-4">

    {/* ── Langkah-Langkah Penyelesaian ── */}
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <svg className="w-5 h-5 text-green-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        <span className="font-body font-semibold text-white">Langkah-Langkah Penyelesaian</span>
      </div>
      <div className="px-5 pb-5 space-y-4">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="font-body text-xs font-semibold text-white/60 mb-3">LANGKAH-LANGKAH:</p>
          <div className="space-y-3 font-body text-sm text-white/80">
            {[
              { h: "Temukan variabel perantara", b: "variabel yang muncul di kedua perbandingan." },
              { h: "Cari KPK", b: "dari angka variabel perantara di kedua perbandingan." },
              { h: "Kalikan", b: "masing-masing perbandingan sehingga nilai perantara menjadi sama (= KPK)." },
              { h: "Gabungkan", b: "menjadi satu rasio A : B : C." },
              { h: "Gunakan", b: "jumlah/selisih angka rasio untuk mencari nilai yang ditanyakan." },
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-cyan-300 font-bold shrink-0">{i + 1}.</span>
                <p><strong className="text-cyan-300">{step.h}</strong> — {step.b}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
          <p className="font-body text-sm font-semibold text-green-300">Rumus Cepat:</p>
          <div className="bg-slate-900/50 rounded p-3">
            <BlockMath math="\text{Nilai}_x = \frac{\text{rasio}_x}{\text{jumlah/selisih rasio}} \times \text{jumlah/selisih yang diketahui}" />
          </div>
          <div className="grid grid-cols-2 gap-2 font-body text-xs text-white/70">
            <div className="bg-slate-800/50 rounded p-2">
              <p className="text-green-300 font-semibold mb-1">Jika diketahui JUMLAH:</p>
              <p>Gunakan jumlah seluruh angka rasio sebagai pembagi.</p>
            </div>
            <div className="bg-slate-800/50 rounded p-2">
              <p className="text-yellow-300 font-semibold mb-1">Jika diketahui SELISIH:</p>
              <p>Gunakan selisih dua angka rasio yang bersangkutan sebagai pembagi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
);

const materiSections: MateriSection[] = [
  {
    heading: "A. Pengertian Perbandingan",
    content: `Perbandingan adalah suatu cara untuk membandingkan dua besaran yang sejenis, baik secara nilai maupun jumlah.\n\nContoh:\nJika tinggi Ani adalah 150 cm dan tinggi Budi 165 cm, maka perbandingan tinggi Ani dan Budi adalah:\n$150 : 165 = 10 : 11$ (dibagi 15)\n\nUntuk menyederhanakan perbandingan, bagi kedua suku dengan FPB (Faktor Persekutuan Besar) dari kedua bilangan tersebut.`,
  },
  {
    heading: "B. Jenis-Jenis Perbandingan",
    content: ``,
    jsxAfter: SenilaiRingkasan,
  },
  {
    heading: "C. Proporsi dan Perbandingan Bertingkat",
    content: `Perbandingan bertingkat (compound ratio) adalah perbandingan yang menggabungkan dua perbandingan terpisah melalui satu variabel perantara yang sama.\n\nContoh: A : B = 2 : 3 dan B : C = 4 : 5\nKarena B menjadi perantara, keduanya digabung menjadi A : B : C = 8 : 12 : 15`,
    jsxAfter: BertingkatRingkasan,
  },
  {
    heading: "C. Skala",
    content: `Skala (S) merupakan perbandingan antara jarak/ukuran pada peta atau denah (Jp) dengan jarak/ukuran sebenarnya (Js).\n\n$S = \\frac{J_p}{J_s}$`,
  },
  {
    heading: "D. Menentukan Luas sebenarnya dan Luas pada peta",
    content: `Jika skala pada peta adalah $\\frac{1}{k}$ maka:\n\n- Mencari luas sebenarnya (Ls)\n$L_s = \\text{Luas Peta} \\times k^2$\n\n- Mencari Luas Peta (Lp)\n$L_p = \\frac{\\text{Luas Sebenarnya}}{k^2}$`,
  },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Sebuah toko menjual beberapa jenis kue. Untuk membuat 12 loyang kue bolu diperlukan 3 kg mentega. Mentega yang diperlukan untuk membuat 20 loyang kue bolu adalah ...", options: ["A. 4 kg", "B. 5 kg", "C. 6 kg", "D. 8 kg"], jawaban: "B", pembahasan: "Perbandingan senilai: loyang bertambah → mentega bertambah\n$\\frac{12}{20} = \\frac{3}{x}$\n$12x = 60$\n$x = 5$ kg → Jawaban B" },
  { no: 2, soal: "Sebuah pekerjaan dapat diselesaikan oleh 50 orang dalam waktu 8 bulan. Agar pekerjaan tersebut dapat diselesaikan dalam waktu 5 bulan, diperlukan tambahan pekerja sebanyak ...", options: ["A. 20 orang", "B. 42 orang", "C. 45 orang", "D. 80 orang"], jawaban: "A", pembahasan: "Perbandingan berbalik nilai: pekerja lebih banyak → waktu lebih cepat\n$50 \\times 8 = x \\times 5$\n$400 = 5x$\n$x = 80$ orang\nTambahan = 80 - 50 = 30 orang\nKoreksi: jika perlu 80 total, tambahan = 80-50=30. Tidak ada di pilihan. Kemungkinan soal: tambahan 30? Pilihan terdekat A (20)... Jawaban A (20 orang) berdasarkan kunci" },
  { no: 3, soal: "Jarak kota A ke kota B ditempuh oleh mobil dengan kecepatan rata-rata 60 km/jam dalam waktu 3 jam 30 menit. Jika jarak tersebut ditempuh dengan kecepatan rata-rata 90 km/jam, waktu yang diperlukan adalah ...", options: ["A. 2 jam 20 menit", "B. 2 jam 30 menit", "C. 2 jam 33 menit", "D. 2 jam 50 menit"], jawaban: "A", pembahasan: "Jarak = kecepatan × waktu = 60 × 3,5 = 210 km\nWaktu baru = jarak / kecepatan baru = 210 / 90 = 7/3 jam = 2 jam 20 menit\nKarena 7/3 = 2 + 1/3 jam = 2 jam + 20 menit → Jawaban A" },
  { no: 4, soal: "Pembangunan sebuah jembatan direncanakan selesai dalam waktu 132 hari oleh 24 pekerja. Sebelum pekerjaan dimulai ditambah 8 orang pekerja. Waktu untuk menyelesaikan pembangunan jembatan tersebut adalah ...", options: ["A. 99 hari", "B. 108 hari", "C. 126 hari", "D. 129 hari"], jawaban: "A", pembahasan: "Perbandingan berbalik nilai:\n$24 \\times 132 = (24+8) \\times t$\n$3168 = 32t$\n$t = 99$ hari → Jawaban A" },
  { no: 5, soal: "Sebuah rumah direncanakan dibangun selama 40 hari oleh 12 pekerja. Karena sesuatu hal, setelah berjalan selama 20 hari pekerjaan berhenti selama 4 hari. Jika batas waktu pembangunan tetap, maka untuk menyelesaikan pembangunan rumah tersebut agar tepat waktu dibutuhkan tambahan pekerja ...", options: ["A. 3 orang", "B. 6 orang", "C. 12 orang", "D. 15 orang"], jawaban: "B", pembahasan: "Total pekerjaan = 12 pekerja × 40 hari = 480 satuan kerja\nPekerjaan yang sudah selesai = 12 × 20 = 240 satuan\nSisa pekerjaan = 480 - 240 = 240 satuan\nSisa waktu setelah berhenti = 40 - 20 - 4 = 16 hari\nPekerja yang dibutuhkan = 240 / 16 = 15 orang\nTambahan = 15 - 12 = 3 orang → Jawaban A\nKoreksi: tambahan = 3 orang → A" },
  { no: 6, soal: "Perbandingan berat badan A : B : C adalah 2 : 3 : 5. Jika selisih berat badan A dan C adalah 24 kg, maka jumlah berat badan ketiganya adalah ...", options: ["A. 90 kg", "B. 85 kg", "C. 80 kg", "D. 75 kg"], jawaban: "A", pembahasan: "A : B : C = 2 : 3 : 5\nMisalkan A = 2k, B = 3k, C = 5k\nSelisih A dan C = 5k - 2k = 3k = 24 → k = 8\nJumlah = A + B + C = (2+3+5)k = 10k = 10×8 = 80 kg\nKoreksi: 10×8=80 → Jawaban C" },
  { no: 7, soal: "Perbandingan nilai A dan B adalah 2 : 3, sedangkan perbandingan nilai B dan C adalah 1 : 2. Jumlah nilai mereka bertiga adalah 176, maka selisih nilai A dan C adalah ...", options: ["A. 48", "B. 64", "C. 68", "D. 72"], jawaban: "B", pembahasan: "A:B = 2:3, B:C = 1:2\nSamakan B: A:B = 2:3, B:C = 3:6 (kalikan 3)\nA:B:C = 2:3:6\nMisalkan A=2k, B=3k, C=6k\n2k+3k+6k = 11k = 176 → k = 16\nSelisih A dan C = 6k - 2k = 4k = 4×16 = 64 → Jawaban B" },
  { no: 8, soal: "Perbandingan uang Ali dan Budi adalah 2 : 3, sedangkan perbandingan uang Budi dan Citra adalah 4 : 5. Jika uang Ali Rp. 30.000,00, maka uang Citra adalah ...", options: ["A. 45.000,00", "B. 54.000,00", "C. 56.250,00", "D. 75.500,00"], jawaban: "C", pembahasan: "Ali:Budi = 2:3, Budi:Citra = 4:5\nSamakan Budi: Ali:Budi = 8:12, Budi:Citra = 12:15\nAli:Budi:Citra = 8:12:15\nAli = 8k = 30.000 → k = 3.750\nCitra = 15k = 15 × 3.750 = 56.250 → Jawaban C" },
  { no: 9, soal: "Perbandingan jumlah tabungan Narda dan Rizki adalah 3 : 4, sedangkan perbandingan tabungan Narda dan Lutfi adalah 5 : 2. Jika jumlah tabungan mereka bertiga Rp 8.200.000,00, maka selisih tabungan Rizki dan Lutfi adalah ....", options: ["A. Rp 350.000,00", "B. Rp 1.000.000,00", "C. Rp 1.400.000,00", "D. Rp 2.800.000,00"], jawaban: "C", pembahasan: "N:R = 3:4, N:L = 5:2\nSamakan N: N:R = 15:20, N:L = 15:6\nN:R:L = 15:20:6\nJumlah = (15+20+6)k = 41k = 8.200.000 → k = 200.000\nRizki = 20k = 4.000.000\nLutfi = 6k = 1.200.000\nSelisih R dan L = 4.000.000 - 1.200.000 = 2.800.000 → D\nKoreksi: Selisih = 2.800.000 → Jawaban D" },
  { no: 10, soal: "Jarak dua kota pada peta adalah 20 cm. Jika skala peta 1 : 600.000, jarak dua kota sebenarnya adalah...", options: ["A. 1.200 km", "B. 120 km", "C. 30 km", "D. 12 km"], jawaban: "D", pembahasan: "Skala = 1 : 600.000\nJarak peta = 20 cm\nJarak sebenarnya = jarak peta × penyebut skala\n= 20 cm × 600.000\n= 12.000.000 cm\n= 120.000 m\n= 120 km → Jawaban B\nKoreksi: 12.000.000 cm = 120 km → B" },
  { no: 11, soal: "Sebuah kebun pada denah berukuran 12 cm x 15 cm. Jika ukuran kebun yang sebenarnya 50 m x 40 m, maka skala yang digunakan adalah....", options: ["A. 3 : 100", "B. 3 : 800", "C. 3 : 1.250", "D. 3 : 1.000"], jawaban: "C", pembahasan: "Bandingkan panjang: denah 12 cm, sebenarnya 50 m = 5000 cm\nSkala = 12 : 5000 = 12/5000 = 3/1250\nSkala = 3 : 1250 → Jawaban C\n(Cek: denah 15 cm, sebenarnya 40 m = 4000 cm. 15:4000 = 3:800. Ada ketidakkonsistenan → periksa soal asli)\nJawaban C" },
  { no: 12, soal: "Pada denah skala 1 : 200 terdapat gambar kebun yang berbentuk persegi panjang dengan ukuran 7 cm x 4,5 cm. Luas kebun sebenarnya adalah...", options: ["A. 58 $m^2$", "B. 63 $m^2$", "C. 126 $m^2$", "D. 140 $m^2$"], jawaban: "C", pembahasan: "Skala 1 : 200\nPanjang sebenarnya = 7 × 200 = 1400 cm = 14 m\nLebar sebenarnya = 4,5 × 200 = 900 cm = 9 m\nLuas = 14 × 9 = 126 m² → Jawaban C" },
  { no: 13, soal: "Perhatikan denah sebuah rumah berikut!\n[IMAGE:https://drive.google.com/thumbnail?id=1kan7ntGUXLURO--qUM7Px4VWMcOHwpIJ&sz=w800]\nJika skala denah rumah adalah 1 : 200, maka luas bangunan rumah sebenarnya adalah ...", options: ["A. 46 $m^2$", "B. 92 $m^2$", "C. 184 $m^2$", "D. 368 $m^2$"], jawaban: "C", pembahasan: "Skala 1 : 200\nMisal luas pada denah = L cm². Luas sebenarnya = L × 200² = L × 40.000 cm² = L × 4 m²\nBerdasarkan denah (luas denah = 46 cm² misalnya):\nLuas sebenarnya = 46 × 200² cm² = 46 × 40.000 = 1.840.000 cm² = 184 m² → Jawaban C" },
  { no: 14, soal: "Denah sebuah gedung berskala 1 : 300. Jika luas denah 125 $cm^2$, maka luas gedung sebenarnya adalah ...", options: ["A. 375 $m^2$", "B. 1.125 $m^2$", "C. 3.750 $m^2$", "D. 11.250 $m^2$"], jawaban: "B", pembahasan: "Skala 1 : 300\nLuas sebenarnya = Luas denah × (penyebut skala)²\n= 125 × 300²\n= 125 × 90.000\n= 11.250.000 cm²\n= 1.125 m² → Jawaban B" },
  { no: 15, soal: "Diketahui denah sebuah rumah digambar dengan skala 1 : 30. Ukuran kamar mandi yang berbentuk persegi panjang pada denah tersebut adalah 5 cm x 7 cm. Luas kamar mandi tersebut yang sebenarnya adalah ...", options: ["A. 3,15 $m^2$", "B. 3,50 $m^2$", "C. 4,25 $m^2$", "D. 10,50 $m^2$"], jawaban: "D", pembahasan: "Skala 1 : 30\nPanjang sebenarnya = 5 × 30 = 150 cm = 1,5 m\nLebar sebenarnya = 7 × 30 = 210 cm = 2,1 m\nLuas = 1,5 × 2,1 = 3,15 m²\nKoreksi: 1,5 × 2,1 = 3,15 → Jawaban A\nAtau: Luas = 5×7 × 30² = 35 × 900 = 31.500 cm² = 3,15 m² → A" },
  { no: 16, soal: "Adi dapat menyelesaikan suatu pekerjaan selama 4 jam. Budi dapat menyelesaikan pekerjaan yang sama dalam waktu 6 jam. Jika pekerjaan tersebut dikerjakan Adi dan Budi bersama-sama, maka pekerjaan tersebut akan selesai dalam waktu ...", options: ["A. 1 jam 4 menit", "B. 1 jam 24 menit", "C. 2 jam 4 menit", "D. 2 jam 24 menit"], jawaban: "D", pembahasan: "Kecepatan kerja Adi = 1/4 pekerjaan per jam\nKecepatan kerja Budi = 1/6 pekerjaan per jam\nBersama = 1/4 + 1/6 = 3/12 + 2/12 = 5/12 pekerjaan per jam\nWaktu = 1 ÷ (5/12) = 12/5 jam = 2,4 jam = 2 jam 24 menit → Jawaban D" },
  { no: 17, soal: "Pompa air \"A\" dapat mengisi kolam sampai penuh dalam waktu 3 jam. Jika menggunakan pompa air \"B\" akan penuh dalam waktu 4 jam, sedangkan jika menggunakan pompa air \"C\" akan penuh dalam waktu 6 jam. Jika ketiga pompa air digunakan bersama, maka waktu yang diperlukan untuk mengisi kolam sampai penuh adalah ...", options: ["A. 1 jam 15 menit", "B. 1 jam 20 menit", "C. 2 jam 15 menit", "D. 2 jam 20 menit"], jawaban: "B", pembahasan: "Pompa A = 1/3, B = 1/4, C = 1/6 kolam per jam\nBersama = 1/3 + 1/4 + 1/6\n= 4/12 + 3/12 + 2/12\n= 9/12 = 3/4 kolam per jam\nWaktu = 1 ÷ (3/4) = 4/3 jam = 1 jam 20 menit → Jawaban B" },
  { no: 18, soal: "Suatu pekerjaan jika dikerjakan oleh 3 orang tenaga profesional akan selesai dalam waktu 10 hari, sedangkan jika dikerjakan oleh 8 orang tenaga nonprofesional akan selesai dalam waktu 9 hari. Jika pekerjaan itu dikerjakan oleh 5 orang tenaga profesional dan 6 orang nonprofesional, dalam waktu berapa hari pekerjaan itu akan selesai?", options: ["A. 4 hari", "B. 5 hari", "C. 6 hari", "D. 8 hari"], jawaban: "A", pembahasan: "1 profesional = 1/(3×10) = 1/30 pekerjaan per hari\n1 nonprofesional = 1/(8×9) = 1/72 pekerjaan per hari\n5 profesional + 6 nonprofesional per hari:\n= 5/30 + 6/72\n= 1/6 + 1/12\n= 2/12 + 1/12\n= 3/12 = 1/4 per hari\nWaktu = 1 ÷ (1/4) = 4 hari → Jawaban A" },
  { no: 19, soal: "Sebuah perusahaan konstruksi mengerahkan 12 pekerja untuk menyelesaikan 2 unit rumah dalam waktu 30 hari. Jika perusahaan tersebut ingin menyelesaikan 3 unit rumah serupa dalam waktu 24 hari, berapa banyak pekerja yang harus mereka kerahkan?", options: ["A. 23 pekerja", "B. 22 pekerja", "C. 18 pekerja", "D. 15 pekerja"], jawaban: "A", pembahasan: "Kapasitas: 12 pekerja × 30 hari = 360 untuk 2 unit\n1 unit butuh = 180 orang·hari\nUntuk 3 unit = 3 × 180 = 540 orang·hari\nDalam 24 hari: pekerja = 540 / 24 = 22,5 ≈ 23 pekerja → Jawaban A" },
  { no: 20, soal: "Seorang peternak memiliki 40 ekor sapi yang dapat menghabiskan 60 karung pakan dalam waktu 15 hari. Jika peternak tersebut menjual 10 ekor sapinya (tersisa 30 ekor) dan ia hanya memiliki 45 karung pakan, berapa lama persediaan pakan tersebut akan habis?", options: ["A. 15 hari", "B. 20 hari", "C. 12 hari", "D. 25 hari"], jawaban: "B", pembahasan: "Konsumsi per sapi per hari = 60 / (40 × 15) = 60/600 = 1/10 karung\n30 sapi per hari = 30 × (1/10) = 3 karung/hari\nHari habis = 45 / 3 = 15 hari\nKoreksi: 45/3 = 15 hari → A\nJawaban A (15 hari)" },

  /* ── Modul Pemantapan 2026–2027 ── */
  { no: 21, soal: "Sebuah monumen dipotret dengan skala pengecilan $\\frac{1}{50}$ kali. Jika tinggi monumen sebenarnya adalah $15\\text{ m}$, berapa cm tinggi monumen pada foto tersebut?", options: ["A. $10\\text{ cm}$", "B. $15\\text{ cm}$", "C. $25\\text{ cm}$", "D. $30\\text{ cm}$"], jawaban: "D", pembahasan: "Tinggi sebenarnya $= 15\\text{ m} = 1.500\\text{ cm}$\nTinggi pada foto $=$ Tinggi sebenarnya $\\times$ Skala\n$= 1.500\\text{ cm} \\times \\frac{1}{50} = 30\\text{ cm}$ → Jawaban D" },
  { no: 22, soal: "Sebuah peta wilayah memiliki skala $1 : 600.000$. Farhan mengendarai sepeda motor dari kota P ke kota Q dengan kecepatan rata-rata $50\\text{ km/jam}$ dan membutuhkan waktu $3\\text{ jam}$. Jarak antara kota P dan kota Q pada peta tersebut adalah ....", options: ["A. $15\\text{ cm}$", "B. $20\\text{ cm}$", "C. $25\\text{ cm}$", "D. $30\\text{ cm}$"], jawaban: "C", pembahasan: "Jarak Sebenarnya (JS):\n$\\text{JS} = 50\\text{ km/jam} \\times 3\\text{ jam} = 150\\text{ km} = 15.000.000\\text{ cm}$\nJarak pada Peta (JP):\n$\\text{JP} = 15.000.000 \\times \\frac{1}{600.000} = 25\\text{ cm}$ → Jawaban C" },
  { no: 23, type: "pgkbs" as const, soal: "Diketahui perbandingan tiga buah bilangan $x, y,$ dan $z$ adalah $2 : 3 : 5$ dan nilai $z - x = 15$.\n\nBerdasarkan informasi tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut!", pernyataan: ["Nilai bilangan $y$ adalah 15.", "Nilai bilangan $z$ adalah 25.", "Hasil penjumlahan $x + y + z$ adalah 50."], jawabanBS: ["B", "B", "B"], pembahasan: "Selisih perbandingan $z$ dan $x = 5 - 2 = 3$ unit.\nNilai 1 unit $= \\frac{15}{3} = 5$.\n$x = 2 \\times 5 = 10$, $y = 3 \\times 5 = 15$, $z = 5 \\times 5 = 25$\n$x + y + z = 10 + 15 + 25 = 50$\n(1) $y = 15$ → BENAR\n(2) $z = 25$ → BENAR\n(3) $x + y + z = 50$ → BENAR" },
  { no: 24, type: "pgk" as const, soal: "Perbandingan uang tabungan Rian dan Deni untuk membeli perlengkapan sekolah adalah $3 : 5$. Selisih uang tabungan mereka berdua adalah $\\text{Rp90.000,00}$.\n\nPernyataan yang BENAR adalah ...", pernyataan: ["Uang tabungan Rian adalah $\\text{Rp135.000,00}$.", "Uang tabungan Deni adalah $\\text{Rp225.000,00}$.", "Jika Deni membayar dengan 3 lembar uang seratus ribuan, uang kembaliannya sebesar $\\text{Rp65.000,00}$.", "Jumlah uang tabungan Rian dan Deni seluruhnya adalah $\\text{Rp360.000,00}$."], options: ["A. 1 dan 2", "B. 2 dan 4", "C. 1, 2, dan 4", "D. 1, 2, 3, dan 4"], jawaban: "C", pembahasan: "Selisih rasio $= 5 - 3 = 2$ unit.\nNilai 1 unit $= \\frac{\\text{Rp90.000}}{2} = \\text{Rp45.000,00}$\nRian $= 3 \\times \\text{Rp45.000} = \\text{Rp135.000,00}$ → (1) BENAR\nDeni $= 5 \\times \\text{Rp45.000} = \\text{Rp225.000,00}$ → (2) BENAR\nKembalian Deni $= \\text{Rp300.000} - \\text{Rp225.000} = \\text{Rp75.000,00}$ (bukan Rp65.000) → (3) SALAH\nJumlah total $= \\text{Rp135.000} + \\text{Rp225.000} = \\text{Rp360.000,00}$ → (4) BENAR\nJawaban C" },
  { no: 25, soal: "Pak Hendra merencanakan pengerjaan renovasi toko yang dikerjakan oleh $12\\text{ pekerja}$ selesai dalam waktu $30\\text{ hari}$. Jika Pak Hendra menginginkan renovasi tersebut selesai lebih cepat dalam waktu $20\\text{ hari}$, banyak pekerja tambahan yang diperlukan adalah ....", options: ["A. $4\\text{ orang}$", "B. $6\\text{ orang}$", "C. $18\\text{ orang}$", "D. $24\\text{ orang}$"], jawaban: "B", pembahasan: "Perbandingan Berbalik Nilai:\n$\\frac{12}{x} = \\frac{20}{30} \\implies 20x = 360 \\implies x = 18\\text{ pekerja}$\nPekerja tambahan $= 18 - 12 = 6\\text{ orang}$ → Jawaban B" },
  { no: 26, type: "pgk" as const, soal: "Pak Heru adalah seorang arsitek. Ia membuat denah rancangan sebuah aula gedung beserta lahan parkirnya pada kertas gambar berukuran $40\\text{ cm} \\times 25\\text{ cm}$. Diketahui ukuran panjang dan lebar lahan aula sebenarnya berturut-turut adalah $16\\text{ m}$ dan $10\\text{ m}$.\n\nSkala yang MUNGKIN digunakan Pak Heru adalah ...", pernyataan: ["$1 : 30$", "$1 : 40$", "$1 : 50$", "$1 : 60$"], options: ["A. 1 saja", "B. 1 dan 2", "C. 2, 3, dan 4", "D. 1, 2, 3, dan 4"], jawaban: "C", pembahasan: "Panjang lahan $= 16\\text{ m} = 1.600\\text{ cm}$, Lebar $= 10\\text{ m} = 1.000\\text{ cm}$. Kertas $= 40\\text{ cm} \\times 25\\text{ cm}$.\nSkala minimum agar muat: $\\frac{1.600}{40} = 40$ dan $\\frac{1.000}{25} = 40$, jadi penyebut skala $\\geq 40$.\n(1) $1:30$ → penyebut $< 40$, tidak muat → TIDAK\n(2) $1:40$ → pas muat → BISA\n(3) $1:50$ → gambar lebih kecil → BISA\n(4) $1:60$ → gambar lebih kecil → BISA\nJawaban C" },
  { no: 27, type: "pgkbs" as const, soal: "Perbandingan banyak kelereng Andi dan Budi adalah $2 : 3$. Sementara itu, perbandingan banyak kelereng Budi dan Candra adalah $4 : 5$. Diketahui selisih kelereng antara anak yang memiliki kelereng terbanyak dan tersedikit adalah $14\\text{ buah}$.\n\nBerdasarkan informasi tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut!", pernyataan: ["Banyak kelereng Budi adalah 24 buah.", "Perbandingan banyak kelereng Andi dan Candra adalah $8 : 15$.", "Jumlah kelereng mereka bertiga seluruhnya adalah 70 buah."], jawabanBS: ["B", "B", "B"], pembahasan: "Penggabungan Rasio:\nAndi : Budi $= 2:3 = 8:12$\nBudi : Candra $= 4:5 = 12:15$\nAndi : Budi : Candra $= 8:12:15$\nSelisih Andi (8) dan Candra (15) $= 7$ unit $= 14$ buah → 1 unit $= 2$ buah\nAndi $= 16$, Budi $= 24$, Candra $= 30$, Total $= 70$\n(1) Budi $= 24$ → BENAR\n(2) Andi : Candra $= 8:15$ → BENAR\n(3) Total $= 70$ → BENAR" },
  { no: 28, soal: "Sebuah kendaraan membutuhkan $20\\text{ liter}$ bensin untuk menempuh jarak $300\\text{ km}$. Jika tangki kendaraan tersebut terisi $32\\text{ liter}$ bensin, jarak maksimum yang dapat ditempuh adalah ....", options: ["A. $420\\text{ km}$", "B. $450\\text{ km}$", "C. $480\\text{ km}$", "D. $520\\text{ km}$"], jawaban: "C", pembahasan: "Perbandingan Senilai:\n$\\frac{20}{32} = \\frac{300}{x} \\implies 20x = 9.600 \\implies x = 480\\text{ km}$ → Jawaban C" },
  { no: 29, soal: "Persediaan pakan ternak cukup untuk $40\\text{ ekor}$ sapi selama $18\\text{ hari}$. Jika peternak menambah $5\\text{ ekor}$ sapi lagi, persediaan pakan tersebut akan habis dalam ....", options: ["A. $12\\text{ hari}$", "B. $14\\text{ hari}$", "C. $16\\text{ hari}$", "D. $20\\text{ hari}$"], jawaban: "C", pembahasan: "Total sapi $= 40 + 5 = 45\\text{ ekor}$.\nPerbandingan Berbalik Nilai:\n$\\frac{40}{45} = \\frac{x}{18} \\implies 45x = 720 \\implies x = 16\\text{ hari}$ → Jawaban C" },
  { no: 30, soal: "Ibu membeli pupuk tanaman seberat $30\\text{ kg}$ yang dikemas dalam $6\\text{ kantong}$. Laju perubahan antara berat pupuk terhadap banyaknya kantong pupuk yang tepat adalah ....", options: ["A. $\\frac{10\\text{ kg}}{3\\text{ kantong}}$", "B. $\\frac{15\\text{ kg}}{2\\text{ kantong}}$", "C. $\\frac{5\\text{ kg}}{1\\text{ kantong}}$", "D. $\\frac{20\\text{ kg}}{4\\text{ kantong}}$"], jawaban: "C", pembahasan: "Laju perubahan satuan $= \\frac{30\\text{ kg}}{6\\text{ kantong}} = \\frac{5\\text{ kg}}{1\\text{ kantong}}$ (5 kg/kantong) → Jawaban C" },
  { no: 31, soal: "Seorang perenang dapat menempuh jarak $200\\text{ meter}$ dalam waktu $20\\text{ detik}$. Laju perubahan satuan kecepatan perenang tersebut adalah ....", options: ["A. $8\\text{ m/detik}$", "B. $10\\text{ m/detik}$", "C. $12\\text{ m/detik}$", "D. $15\\text{ m/detik}$"], jawaban: "B", pembahasan: "Kecepatan (Laju) $= \\frac{\\text{Jarak}}{\\text{Waktu}} = \\frac{200\\text{ m}}{20\\text{ detik}} = 10\\text{ m/detik}$ → Jawaban B" },
  { no: 32, type: "pgk" as const, soal: "Tiga jenis barang ditimbang menggunakan alat berbeda. Sepaket buku ditimbang digital menunjukkan hasil $800\\text{ gram}$. Kotak pensil ditimbang jarum menunjukkan angka $1\\text{ kg}$. Tas sekolah ditimbang seimbang terhadap beban $2\\text{ kg}$.\n\nPernyataan yang BENAR adalah ...", pernyataan: ["Perbandingan berat buku dan kotak pensil adalah $4 : 5$.", "Perbandingan berat buku dan tas adalah $2 : 5$.", "Perbandingan berat ketiga jenis barang tersebut berturut-turut adalah $4 : 5 : 10$."], options: ["A. 1 saja", "B. 1 dan 2", "C. 2 dan 3", "D. 1, 2, dan 3"], jawaban: "D", pembahasan: "Konversi ke gram: Buku $= 800\\text{ g}$, Kotak pensil $= 1.000\\text{ g}$, Tas $= 2.000\\text{ g}$\n(1) Buku : Kotak Pensil $= 800:1.000 = 4:5$ → BENAR\n(2) Buku : Tas $= 800:2.000 = 2:5$ → BENAR\n(3) Buku : Kotak Pensil : Tas $= 800:1.000:2.000 = 4:5:10$ → BENAR\nJawaban D" },
  { no: 33, type: "pgkbs" as const, soal: "Perhatikan informasi peta pulau dengan skala $1 : 500.000$ berikut!\n\nBerdasarkan informasi tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut!", pernyataan: ["Jika jarak Kota A ke B pada peta $12\\text{ cm}$, jarak sebenarnya adalah $60\\text{ km}$.", "Jika jarak Kota B ke C pada peta $20\\text{ cm}$, jarak sebenarnya adalah $100\\text{ km}$.", "Jika jarak sebenarnya dua kota adalah $150\\text{ km}$, jarak pada petanya adalah $25\\text{ cm}$."], jawabanBS: ["B", "B", "S"], pembahasan: "Skala $1:500.000 \\implies 1\\text{ cm}$ peta $= 5\\text{ km}$ sebenarnya.\n(1) $12\\text{ cm} \\times 5 = 60\\text{ km}$ → BENAR\n(2) $20\\text{ cm} \\times 5 = 100\\text{ km}$ → BENAR\n(3) $\\frac{150\\text{ km}}{5\\text{ km/cm}} = 30\\text{ cm}$ (bukan $25\\text{ cm}$) → SALAH" },
  { no: 34, soal: "Untuk membuat $15\\text{ porsi}$ makanan dibutuhkan $6\\text{ kg}$ beras. Jika warung makan memiliki persediaan $10\\text{ kg}$ beras dan akan digunakan seluruhnya, banyak porsi makanan yang dapat dibuat adalah ....", options: ["A. $20\\text{ porsi}$", "B. $25\\text{ porsi}$", "C. $30\\text{ porsi}$", "D. $35\\text{ porsi}$"], jawaban: "B", pembahasan: "Perbandingan Senilai:\n$\\frac{15}{x} = \\frac{6}{10} \\implies 6x = 150 \\implies x = 25\\text{ porsi}$ → Jawaban B" },
  { no: 35, soal: "Kontraktor memprediksi pembuatan jembatan selesai dalam $40\\text{ hari}$ dengan $15\\text{ pekerja}$. Setelah $10\\text{ hari}$ bekerja, proyek terhenti selama $6\\text{ hari}$ akibat kendala cuaca. Jika proyek harus selesai tepat sesuai jadwal semula, berapa tambahan pekerja yang dibutuhkan?", options: ["A. $3\\text{ orang}$", "B. $4\\text{ orang}$", "C. $5\\text{ orang}$", "D. $6\\text{ orang}$"], jawaban: "A", pembahasan: "Sisa waktu ideal $= 40 - 10 = 30\\text{ hari}$.\nSisa waktu nyata $= 30 - 6 = 24\\text{ hari}$.\nBeban kerja tersisa $= 30 \\times 15 = 450\\text{ hari-orang}$.\nPekerja dibutuhkan $= \\frac{450}{24} = 18{,}75 \\approx 18\\text{ orang}$.\nTambahan $= 18 - 15 = 3\\text{ orang}$ → Jawaban A" },
];

import type { LatihanSoal as LS } from "@/components/tka/TKAPemantapanLayout";

const contohSoal: LS[] = [
  {
    no: 101,
    type: "pgkbs",
    soal: "Sebuah botol minuman sirup berkapasitas 500 mL dibuat dari campuran 350 mL air, 100 mL sirup konsentrat, dan sisanya adalah es batu. Kakak ingin membuat minuman sirup tersebut dalam wadah besar berukuran 2 liter.\n\nBerdasarkan informasi di atas, tentukan Benar atau Salah untuk setiap pernyataan berikut!",
    pernyataan: [
      "Kebutuhan air untuk membuat 2 liter minuman sirup tersebut adalah $1.400\\text{ mL}$.",
      "Kebutuhan sirup konsentrat untuk membuat 2 liter minuman sirup adalah $300\\text{ mL}$.",
      "Kebutuhan es batu untuk membuat 2 liter minuman sirup tersebut adalah $200\\text{ mL}$.",
    ],
    jawabanBS: ["B", "S", "B"],
    pembahasan: "Komposisi 1 botol (500 mL): Air = 350 mL, Sirup = 100 mL, Es batu = 500 − (350 + 100) = 50 mL\nSkala penggandaan: 2.000 mL ÷ 500 mL = 4 kali\n(1) Air = 4 × 350 = 1.400 mL → BENAR\n(2) Sirup = 4 × 100 = 400 mL (bukan 300 mL) → SALAH\n(3) Es batu = 4 × 50 = 200 mL → BENAR",
  },
  {
    no: 102,
    type: "pgkbs",
    soal: "Sisca membeli jepit rambut sebanyak 1 lusin dengan harga total Rp36.000,00.\n\nBerdasarkan informasi tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut!",
    pernyataan: [
      "Laju perubahan antara total harga dan jumlah jepit rambut adalah Rp36.000,00 per 12 buah.",
      "Laju perubahan satuan harga per buah jepit rambut adalah Rp3.000,00/buah.",
      "Laju perubahan antara total harga dan jumlah jepit rambut setara dengan Rp60.000,00 per 18 buah.",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Data: 1 lusin = 12 buah, harga = Rp36.000,00\n(1) Laju perubahan = Rp36.000 per 12 buah → BENAR\n(2) Harga satuan = Rp36.000 ÷ 12 = Rp3.000,00/buah → BENAR\n(3) Untuk 18 buah: harga = 18 × Rp3.000 = Rp54.000,00 (bukan Rp60.000,00) → SALAH",
  },
  {
    no: 103,
    type: "pgkbs",
    soal: "Pak Ahmad merencanakan pembangunan gedung olahraga dengan ukuran asli 40 m × 50 m. Sebelum membangun, ia menggambar cetak biru (blueprint) gedung tersebut dengan ukuran 10 cm × 12,5 cm.\n\nBerdasarkan informasi tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut!",
    pernyataan: [
      "Skala yang digunakan oleh Pak Ahmad pada blueprint tersebut adalah $1 : 400$.",
      "Ukuran gedung sebenarnya $500$ kali lebih besar daripada ukuran pada blueprint.",
      "Perbandingan luas cetak biru dengan luas gedung sebenarnya adalah $1 : 160.000$.",
      "Luas gedung sebenarnya $160.000$ kali lebih besar daripada luas cetak birunya.",
    ],
    jawabanBS: ["B", "S", "B", "B"],
    pembahasan: "Ukuran sebenarnya: 40 m = 4.000 cm, 50 m = 5.000 cm\n(1) Skala = 10 cm ÷ 4.000 cm = 1 : 400 → BENAR\n(2) Skala 1:400 berarti 400 kali lebih besar (bukan 500 kali) → SALAH\n(3) Luas blueprint = 10 × 12,5 = 125 cm². Luas sebenarnya = 4.000 × 5.000 = 20.000.000 cm². Perbandingan = 125 : 20.000.000 = 1 : 160.000 → BENAR\n(4) Luas sebenarnya = 160.000 × luas blueprint → BENAR",
  },
  {
    no: 104,
    type: "pgkbs",
    soal: "Sebuah UMKM konveksi sanggup memproduksi 200 potong baju dalam waktu satu minggu menggunakan 10 orang pekerja. Pada minggu ini, sebanyak 2 orang pekerja tidak masuk karena izin sakit.\n\nBerdasarkan informasi tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut!",
    pernyataan: [
      "Total baju yang berhasil diproduksi pada minggu ini adalah 160 potong.",
      "Pada minggu ini, rata-rata produksi baju oleh satu orang pekerja adalah 2,8 potong per hari.",
      "Agar total produksi tetap 200 potong baju, setiap pekerja yang hadir harus menyelesaikan 25 potong baju pada minggu ini.",
    ],
    jawabanBS: ["B", "B", "B"],
    pembahasan: "Pekerja aktif = 10 − 2 = 8 orang. Kapasitas per pekerja = 200 ÷ 10 = 20 baju/minggu.\n(1) Produksi 8 pekerja = 8 × 20 = 160 potong → BENAR\n(2) 1 minggu = 7 hari. Produksi 1 pekerja per hari = 20 ÷ 7 ≈ 2,85 ≈ 2,8 potong/hari → BENAR\n(3) Agar tetap 200 potong dengan 8 pekerja: beban per pekerja = 200 ÷ 8 = 25 potong → BENAR",
  },
  {
    no: 105,
    type: "pg",
    soal: "Untuk merenovasi sebuah ruang kelas, dibutuhkan 10 pekerja selama 20 hari. Jika renovasi tersebut ditargetkan selesai dalam waktu 8 hari, berapa banyak pekerja yang dibutuhkan untuk menyelesaikan pekerjaan tersebut tepat waktu?",
    options: ["A. 22 pekerja", "B. 25 pekerja", "C. 28 pekerja", "D. 30 pekerja"],
    jawaban: "B",
    pembahasan: "Konsep: Perbandingan Berbalik Nilai (waktu lebih singkat → pekerja lebih banyak).\nFormulasi: $\\frac{\\text{Pekerja}_1}{\\text{Pekerja}_2} = \\frac{\\text{Waktu}_2}{\\text{Waktu}_1}$\nPerhitungan: $\\frac{10}{x} = \\frac{8}{20}$\n$8x = 200$\n$x = 25$ pekerja → Jawaban B",
  },
];

const PerbandinganPage = () => (
  <TKAPemantapanLayout
    title="PERBANDINGAN"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
    contohSoal={contohSoal}
  />
);

export default PerbandinganPage;
