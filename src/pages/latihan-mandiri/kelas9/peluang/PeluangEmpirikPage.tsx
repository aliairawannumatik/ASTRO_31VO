import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { BarChart3 } from "lucide-react";

const FreqTable = ({ headers, rows, caption }: { headers: string[]; rows: (string | number)[][]; caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-amber-500/30 my-2">
    {caption && <div className="text-[10px] text-amber-300/70 font-bold text-center pt-2 px-2">{caption}</div>}
    <table className="min-w-full text-xs font-body">
      <thead>
        <tr className="bg-amber-900/40">
          {headers.map((h, i) => (
            <th key={i} className="px-3 py-2 text-amber-200 font-bold text-center border-b border-amber-500/30">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-amber-900/10"}>
            {row.map((cell, ci) => (
              <td key={ci} className="px-3 py-2 text-center text-white/80 border-b border-white/5">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BarChart = ({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-28 px-2 pb-1">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <span className="text-[9px] text-white/70 font-bold">{d.value}</span>
          <div className="w-full rounded-t-md" style={{ height: `${(d.value / max) * 80}px`, background: colors[i % colors.length] }} />
          <span className="text-[9px] text-white/60">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Memahami Frekuensi Relatif", {
    type: "mixed",
    content: "Sebuah koin dilempar 50 kali. Hasilnya: Angka muncul 28 kali dan Gambar muncul 22 kali.",
    diagram: (
      <FreqTable
        caption="Hasil percobaan melempar koin"
        headers={["Hasil", "Frekuensi", "Frekuensi Relatif"]}
        rows={[["Angka",28,"?"],[" Gambar",22,"?"],["Total",50,"1"]]}
      />
    ),
    parts: [
      { label: "a.", math: "\\text{FR(Angka)} = \\frac{28}{50} = \\ldots" },
      { label: "b.", math: "\\text{FR(Gambar)} = \\frac{22}{50} = \\ldots" },
      { label: "c.", text: "Apakah FR(Angka) + FR(Gambar) = 1? Mengapa selalu demikian?" },
    ],
  }),
  Qn(2, "Peluang Empirik dari Data Percobaan", {
    type: "mixed",
    content: "Sebuah dadu dilempar 120 kali. Data frekuensi muncul setiap angka:",
    diagram: (
      <FreqTable
        caption="Frekuensi munculnya angka dadu (120 lemparan)"
        headers={["Angka","1","2","3","4","5","6"]}
        rows={[["Frekuensi",18,22,19,21,20,20]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{empirik}(1) = \\frac{18}{120} = \\ldots" },
      { label: "b.", math: "P_{empirik}(\\text{genap}) = \\frac{22+21+20}{120} = \\ldots" },
      { label: "c.", text: "Apakah peluang empirik ini mendekati peluang teoretik? Jelaskan." },
    ],
  }),
  Qn(3, "Tabel Frekuensi – Warna Kelereng", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Pengambilan kelereng 200 kali (dengan pengembalian)"
        headers={["Warna","Merah","Biru","Kuning","Hijau","Total"]}
        rows={[["Frekuensi",65,55,45,35,200]]}
      />
    ),
    content: "Percobaan pengambilan kelereng dilakukan 200 kali. Hasilnya dicatat dalam tabel.",
    parts: [
      { label: "a.", math: "P_{emp}(\\text{Merah}) = \\frac{65}{200} = \\ldots" },
      { label: "b.", math: "P_{emp}(\\text{bukan Kuning}) = \\frac{200-45}{200} = \\ldots" },
      { label: "c.", text: "Warna kelereng apa yang paling jarang muncul?" },
    ],
  }),
  Qn(4, "Diagram Batang – Analisis Data", {
    type: "mixed",
    diagram: (
      <BarChart
        data={[{label:"Sen",value:12},{label:"Sel",value:18},{label:"Rab",value:15},{label:"Kam",value:20},{label:"Jum",value:10}]}
        colors={["#f59e0b","#f97316","#eab308","#fb923c","#fbbf24"]}
      />
    ),
    content: "Diagram batang menunjukkan banyaknya siswa yang hadir ke perpustakaan setiap hari dalam sepekan.",
    parts: [
      { label: "a.", text: "Berapa total siswa yang datang ke perpustakaan dalam sepekan?" },
      { label: "b.", text: "Berapa frekuensi relatif hari Kamis?" },
      { label: "c.", text: "Pada hari apa peluang empirik seorang siswa pergi ke perpustakaan paling besar?" },
    ],
  }),
  Qn(5, "Membandingkan Dua Percobaan", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Perbandingan dua percobaan melempar koin"
        headers={["Percobaan","Jumlah Lemparan","Muncul Angka","FR(Angka)"]}
        rows={[["Andi",10,4,"?"],[" Budi",100,47,"?"],[" Citra",1000,503,"?"]]}
      />
    ),
    parts: [
      { label: "a.", text: "Hitung FR(Angka) untuk setiap percobaan." },
      { label: "b.", text: "Siapa yang hasil FR-nya paling mendekati peluang teoretik (0,5)?" },
      { label: "c.", text: "Apa kesimpulanmu tentang hubungan banyak percobaan dan nilai FR?" },
    ],
  }),
  Qn(6, "Peluang Empirik – Penjualan Produk", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Data penjualan produk selama 30 hari"
        headers={["Produk","A","B","C","D","Total"]}
        rows={[["Terjual",8,12,6,4,30]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{emp}(A) = \\frac{8}{30} = \\ldots" },
      { label: "b.", text: "Produk mana yang paling sering terjual?" },
      { label: "c.", text: "Berapa frekuensi relatif produk C dan D digabung?" },
    ],
  }),
  Qn(7, "Peluang Empirik vs Teoretik", {
    type: "mixed",
    content: "Sebuah dadu dilempar 60 kali. Angka 6 muncul sebanyak 14 kali.",
    parts: [
      { label: "a.", math: "P_{emp}(6) = \\frac{14}{60} = \\ldots" },
      { label: "b.", math: "P_{teoretik}(6) = \\frac{1}{6} \\approx \\ldots" },
      { label: "c.", text: "Apakah perbedaan antara peluang empirik dan teoretik wajar? Jelaskan." },
    ],
  }),
  Qn(8, "Frekuensi Relatif – Cuaca", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Data cuaca selama 60 hari"
        headers={["Cuaca","Cerah","Berawan","Hujan","Total"]}
        rows={[["Hari",35,15,10,60]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{emp}(\\text{Hujan}) = \\frac{10}{60} = \\ldots" },
      { label: "b.", text: "Cuaca apa yang paling sering terjadi?" },
      { label: "c.", text: "Berapa frekuensi relatif cuaca tidak hujan?" },
    ],
  }),
  Qn(9, "Tabel Percobaan Melempar Paku", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Percobaan melempar paku (posisi jatuh)"
        headers={["Posisi","Kepala Atas","Kepala Samping","Total"]}
        rows={[["Frekuensi",72,28,100]]}
      />
    ),
    content: "Sebuah paku dilempar 100 kali. Posisi jatuh dicatat:",
    parts: [
      { label: "a.", math: "P_{emp}(\\text{Kepala Atas}) = \\frac{72}{100} = \\ldots" },
      { label: "b.", text: "Apakah paku ini simetris? Mengapa atau mengapa tidak?" },
      { label: "c.", text: "Jika paku dilempar 250 kali, perkirakan berapa kali kepala atas muncul." },
    ],
  }),
  Qn(10, "Menentukan Peluang dari Data Survei", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Survei mata pelajaran favorit (80 siswa)"
        headers={["Mata Pelajaran","Matematika","IPA","IPS","Bahasa","Seni"]}
        rows={[["Jumlah Siswa",24,20,16,12,8]]}
      />
    ),
    parts: [
      { label: "a.", text: "Jika dipilih satu siswa secara acak, berapa peluang empirik terpilihnya siswa yang menyukai Matematika?" },
      { label: "b.", math: "P_{emp}(\\text{IPA atau IPS}) = \\frac{20+16}{80} = \\ldots" },
      { label: "c.", text: "Mata pelajaran favorit mana yang peluangnya paling kecil?" },
    ],
  }),
  Qn(11, "Frekuensi Relatif – Nilai Ulangan", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Distribusi nilai ulangan 40 siswa"
        headers={["Nilai","40–54","55–69","70–84","85–100","Total"]}
        rows={[["Frekuensi",4,12,18,6,40]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{emp}(\\text{nilai} \\geq 70) = \\frac{18+6}{40} = \\ldots" },
      { label: "b.", text: "Berapa frekuensi relatif siswa yang nilainya di bawah 70?" },
      { label: "c.", text: "Interval nilai mana yang paling banyak siswanya?" },
    ],
  }),
  Qn(12, "Peluang Empirik – Produk Cacat", {
    type: "mixed",
    content: "Sebuah pabrik memproduksi 500 buah lampu. Setelah diperiksa, 25 lampu cacat.",
    parts: [
      { label: "a.", math: "P_{emp}(\\text{cacat}) = \\frac{25}{500} = \\ldots" },
      { label: "b.", math: "P_{emp}(\\text{tidak cacat}) = 1 - \\frac{25}{500} = \\ldots" },
      { label: "c.", text: "Jika pabrik memproduksi 2.000 lampu lagi, perkirakan berapa lampu yang cacat." },
    ],
  }),
  Qn(13, "Diagram Batang – Frekuensi Warna", {
    type: "mixed",
    diagram: (
      <BarChart
        data={[{label:"Merah",value:30},{label:"Biru",value:45},{label:"Kuning",value:15},{label:"Hijau",value:10}]}
        colors={["#ef4444","#3b82f6","#eab308","#22c55e"]}
      />
    ),
    content: "Diagram batang menunjukkan frekuensi warna yang dipilih oleh 100 responden.",
    parts: [
      { label: "a.", text: "Berapa total responden? Cocokkan dengan diagram." },
      { label: "b.", text: "Hitung frekuensi relatif warna Biru." },
      { label: "c.", text: "Warna mana yang paling jarang dipilih?" },
    ],
  }),
  Qn(14, "Percobaan Berulang – Semakin Stabil", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Frekuensi relatif Angka pada melempar koin"
        headers={["n (lemparan)","10","50","100","500","1000"]}
        rows={[["FR(Angka)","0,40","0,48","0,51","0,502","0,499"]]}
      />
    ),
    parts: [
      { label: "a.", text: "Apa yang terjadi pada nilai FR saat n semakin besar?" },
      { label: "b.", text: "Nilai berapa yang dituju oleh FR seiring n → ∞?" },
      { label: "c.", text: "Apa hubungan antara peluang empirik dan peluang teoretik pada percobaan berulang?" },
    ],
  }),
  Qn(15, "Soal Kontekstual – Toko Buah", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Penjualan buah selama 50 transaksi"
        headers={["Buah","Mangga","Apel","Jeruk","Pisang","Total"]}
        rows={[["Frekuensi",15,20,10,5,50]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{emp}(\\text{Apel}) = \\frac{20}{50} = \\ldots" },
      { label: "b.", text: "Berapa peluang empirik pelanggan membeli buah selain Mangga?" },
      { label: "c.", text: "Jika ada 200 transaksi berikutnya, perkirakan berapa kali Jeruk terjual." },
    ],
  }),
  Qn(16, "Frekuensi Relatif – Kendaraan di Jalan", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Jenis kendaraan melintas dalam 1 jam (total: 240)"
        headers={["Kendaraan","Motor","Mobil","Bus","Truk"]}
        rows={[["Jumlah",120,80,24,16]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{emp}(\\text{Motor}) = \\frac{120}{240} = \\ldots" },
      { label: "b.", text: "Berapa frekuensi relatif kendaraan roda empat atau lebih?" },
      { label: "c.", text: "Berapa peluang empirik kendaraan bukan bus?" },
    ],
  }),
  Qn(17, "Frekuensi Relatif – Data Sepatu Siswa", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Ukuran sepatu 32 siswa"
        headers={["Ukuran","36","37","38","39","40","Total"]}
        rows={[["Frekuensi",4,8,10,6,4,32]]}
      />
    ),
    parts: [
      { label: "a.", text: "Tentukan frekuensi relatif ukuran 38." },
      { label: "b.", text: "Berapa peluang empirik terpilihnya siswa dengan sepatu ukuran di atas 38?" },
      { label: "c.", text: "Ukuran berapa yang paling umum di kelas tersebut?" },
    ],
  }),
  Qn(18, "Menghitung Frekuensi dari FR yang Diketahui", {
    type: "mixed",
    content: "Dalam suatu percobaan 80 kali pengambilan kartu, frekuensi relatif terambilnya kartu merah adalah 0,45.",
    parts: [
      { label: "a.", math: "\\text{Frekuensi kartu merah} = 0{,}45 \\times 80 = \\ldots" },
      { label: "b.", math: "\\text{Frekuensi kartu tidak merah} = 80 - \\ldots = \\ldots" },
      { label: "c.", text: "Apakah ini sesuai dengan peluang teoretik kartu merah (1/2)? Jelaskan." },
    ],
  }),
  Qn(19, "Peluang Empirik – Nilai Dadu", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Percobaan 180 kali melempar dadu"
        headers={["Angka","1","2","3","4","5","6","Total"]}
        rows={[["Frekuensi",28,30,32,29,31,30,180]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{emp}(\\text{angka} > 4) = \\frac{31+30}{180} = \\ldots" },
      { label: "b.", math: "P_{emp}(\\text{angka ganjil}) = \\frac{28+32+31}{180} = \\ldots" },
      { label: "c.", text: "Apakah dadu ini seimbang (fair)? Jelaskan berdasarkan data." },
    ],
  }),
  Qn(20, "Soal UN – Frekuensi Relatif", {
    type: "mixed",
    content: "Sebuah dadu dilempar 90 kali. Frekuensi relatif muncul angka 5 adalah 1/6.",
    parts: [
      { label: "a.", math: "\\text{Frekuensi angka 5} = \\frac{1}{6} \\times 90 = \\ldots" },
      { label: "b.", text: "Berapa banyak angka selain 5 muncul?" },
      { label: "c.", text: "Apakah frekuensi relatif selalu sama dengan peluang teoretik? Jelaskan." },
    ],
  }),
  Qn(21, "Peluang Empirik – Absensi Siswa", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Absensi kelas selama 20 hari"
        headers={["Tidak Hadir","0 siswa","1 siswa","2 siswa","≥3 siswa","Total"]}
        rows={[["Frekuensi hari",10,5,3,2,20]]}
      />
    ),
    parts: [
      { label: "a.", text: "Berapa peluang empirik hari di mana semua siswa hadir?" },
      { label: "b.", text: "Berapa peluang empirik hari di mana ada paling sedikit 1 siswa tidak hadir?" },
      { label: "c.", text: "Apakah kedua jawaban di atas saling melengkapi? Mengapa?" },
    ],
  }),
  Qn(22, "Membandingkan Percobaan Koin", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Percobaan melempar koin oleh 3 siswa"
        headers={["Siswa","Jumlah Lemparan","Muncul A","Muncul G","FR(A)"]}
        rows={[["Ayu",20,9,11,"?"],["Bagas",50,27,23,"?"],["Cici",200,98,102,"?"]]}
      />
    ),
    parts: [
      { label: "a.", text: "Hitung FR(A) untuk masing-masing siswa." },
      { label: "b.", text: "Siapa yang FR(A)-nya paling mendekati 0,5?" },
      { label: "c.", text: "Simpulkan: bagaimana pengaruh n terhadap FR?" },
    ],
  }),
  Qn(23, "Tabel Frekuensi – Hasil Ulangan Fisika", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Nilai ulangan Fisika 50 siswa"
        headers={["Nilai","< 60","60–74","75–89","90–100","Total"]}
        rows={[["Siswa",6,18,20,6,50]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{emp}(\\text{nilai} \\geq 75) = \\frac{20+6}{50} = \\ldots" },
      { label: "b.", text: "Berapa peluang siswa mendapat nilai di bawah 75?" },
      { label: "c.", text: "Berapa persen siswa yang lulus jika nilai lulus ≥ 60?" },
    ],
  }),
  Qn(24, "Soal TKA – Frekuensi Relatif Gabungan", {
    type: "mixed",
    content: "Dari 400 percobaan melempar dua koin, hasil AA muncul 97 kali, AG muncul 104 kali, GA muncul 99 kali, dan GG muncul 100 kali.",
    parts: [
      { label: "a.", math: "P_{emp}(\\text{AA}) = \\frac{97}{400} = \\ldots" },
      { label: "b.", math: "P_{emp}(\\text{tepat 1 Angka}) = \\frac{104+99}{400} = \\ldots" },
      { label: "c.", text: "Bandingkan dengan peluang teoretik masing-masing. Apakah mendekati?" },
    ],
  }),
  Qn(25, "Soal ANBK – Peluang Empirik Produksi", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Kontrol kualitas: 1000 produk"
        headers={["Kategori","Sangat Baik","Baik","Cukup","Kurang"]}
        rows={[["Jumlah",650,250,70,30]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{emp}(\\text{Baik atau Sangat Baik}) = \\frac{650+250}{1000} = \\ldots" },
      { label: "b.", math: "P_{emp}(\\text{Cukup atau Kurang}) = \\frac{70+30}{1000} = \\ldots" },
      { label: "c.", text: "Jika produksi 5000 unit, perkirakan berapa yang berkualitas Kurang." },
    ],
  }),
  Qn(26, "Diagram Batang – Bulan Lahir", {
    type: "mixed",
    diagram: (
      <BarChart
        data={[
          {label:"Jan",value:5},{label:"Feb",value:4},{label:"Mar",value:6},{label:"Apr",value:3},
          {label:"Mei",value:7},{label:"Jun",value:5},
        ]}
        colors={["#f59e0b","#f97316","#eab308","#fb923c","#fbbf24","#fde68a"]}
      />
    ),
    content: "Diagram batang menunjukkan bulan lahir 30 siswa (Jan–Jun saja yang ditampilkan).",
    parts: [
      { label: "a.", text: "Berapa frekuensi relatif lahir di bulan Mei?" },
      { label: "b.", text: "Berapa peluang empirik lahir di bulan dengan huruf awal 'J'?" },
      { label: "c.", text: "Bulan mana yang paling banyak siswanya lahir?" },
    ],
  }),
  Qn(27, "Soal UN – Menghitung Frekuensi dari FR", {
    type: "mixed",
    content: "Dalam percobaan melempar dadu 300 kali, frekuensi relatif muncul bilangan genap adalah 0,52.",
    parts: [
      { label: "a.", math: "\\text{Frekuensi genap} = 0{,}52 \\times 300 = \\ldots" },
      { label: "b.", math: "\\text{Frekuensi ganjil} = 300 - \\ldots = \\ldots" },
      { label: "c.", math: "P_{emp}(\\text{ganjil}) = \\frac{\\ldots}{300} = \\ldots" },
    ],
  }),
  Qn(28, "Membaca Tabel Frekuensi Kumulatif", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Frekuensi nilai ujian 60 siswa"
        headers={["Nilai","Frekuensi","Frekuensi Rel.","Frekuensi Kumulatif"]}
        rows={[["50–59",6,"0,10","6"],["60–69",15,"0,25","21"],["70–79",24,"0,40","45"],["80–89",12,"0,20","57"],["90–99",3,"0,05","60"]]}
      />
    ),
    parts: [
      { label: "a.", text: "Berapa peluang empirik nilai di bawah 70?" },
      { label: "b.", text: "Berapa peluang empirik nilai di antara 70–89?" },
      { label: "c.", text: "Berapa banyak siswa yang nilainya di atas 79?" },
    ],
  }),
  Qn(29, "Peluang Empirik – Jenis Kelamin Bayi", {
    type: "mixed",
    content: "Dari catatan 150 kelahiran di rumah sakit, 78 bayi laki-laki dan 72 bayi perempuan.",
    parts: [
      { label: "a.", math: "P_{emp}(\\text{Laki-laki}) = \\frac{78}{150} = \\ldots" },
      { label: "b.", math: "P_{emp}(\\text{Perempuan}) = \\frac{72}{150} = \\ldots" },
      { label: "c.", text: "Apakah peluang empirik lahir laki-laki lebih besar dari 0,5? Apa artinya?" },
    ],
  }),
  Qn(30, "Soal UN – Frekuensi Relatif Kartu", {
    type: "mixed",
    content: "Satu kartu diambil dari 52 kartu remi sebanyak 260 kali (dengan pengembalian). Kartu As muncul 22 kali.",
    parts: [
      { label: "a.", math: "P_{emp}(\\text{As}) = \\frac{22}{260} = \\ldots" },
      { label: "b.", math: "P_{teoretik}(\\text{As}) = \\frac{4}{52} = \\frac{1}{13} \\approx \\ldots" },
      { label: "c.", text: "Apakah perbedaan keduanya masih dalam batas wajar? Jelaskan." },
    ],
  }),
  Qn(31, "Menentukan n dari FR dan Frekuensi", {
    type: "mixed",
    content: "Dalam percobaan melempar koin, frekuensi relatif muncul Angka adalah 0,44 dan muncul Angka sebanyak 44 kali.",
    parts: [
      { label: "a.", math: "n = \\frac{\\text{Frekuensi}}{\\text{FR}} = \\frac{44}{0{,}44} = \\ldots" },
      { label: "b.", text: "Berapa frekuensi muncul Gambar?" },
      { label: "c.", math: "\\text{FR(Gambar)} = \\frac{\\ldots}{n} = \\ldots" },
    ],
  }),
  Qn(32, "Peluang Empirik – Golongan Darah", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Golongan darah 200 orang Indonesia (sampel)"
        headers={["Gol. Darah","A","B","AB","O","Total"]}
        rows={[["Frekuensi",58,62,20,60,200]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{emp}(\\text{golongan O}) = \\frac{60}{200} = \\ldots" },
      { label: "b.", text: "Berapa peluang empirik golongan darah bukan AB?" },
      { label: "c.", text: "Golongan darah mana yang paling jarang dalam sampel ini?" },
    ],
  }),
  Qn(33, "Soal ANBK – Interpretasi Grafik", {
    type: "mixed",
    diagram: (
      <BarChart
        data={[{label:"Kelas 7",value:25},{label:"Kelas 8",value:30},{label:"Kelas 9",value:20}]}
        colors={["#f59e0b","#f97316","#fbbf24"]}
      />
    ),
    content: "Diagram menunjukkan banyaknya siswa yang mengikuti ekstrakurikuler seni dari masing-masing kelas.",
    parts: [
      { label: "a.", text: "Total berapa siswa yang mengikuti ekskul seni?" },
      { label: "b.", text: "Berapa frekuensi relatif siswa kelas 9 yang ikut ekskul seni?" },
      { label: "c.", text: "Jika dipilih satu siswa secara acak, berapa peluang empirik terpilihnya siswa kelas 8?" },
    ],
  }),
  Qn(34, "Frekuensi Relatif – Curah Hujan", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Intensitas hujan selama 120 hari"
        headers={["Intensitas","Tidak Hujan","Ringan","Sedang","Lebat","Total"]}
        rows={[["Hari",45,30,30,15,120]]}
      />
    ),
    parts: [
      { label: "a.", math: "P_{emp}(\\text{Hujan Lebat}) = \\frac{15}{120} = \\ldots" },
      { label: "b.", text: "Berapa peluang empirik hari dengan hujan (ringan, sedang, atau lebat)?" },
      { label: "c.", text: "Dari 30 hari ke depan, perkirakan berapa hari yang tidak hujan." },
    ],
  }),
  Qn(35, "Soal TKA – FR dari Dua Kejadian", {
    type: "mixed",
    content: "Dalam 240 lemparan dadu, muncul bilangan prima sebanyak 122 kali dan bilangan genap 116 kali.",
    parts: [
      { label: "a.", math: "P_{emp}(\\text{prima}) = \\frac{122}{240} = \\ldots" },
      { label: "b.", math: "P_{emp}(\\text{genap}) = \\frac{116}{240} = \\ldots" },
      { label: "c.", text: "Bilangan pada dadu yang prima DAN genap adalah? Berapa peluangnya secara teoretik?" },
    ],
  }),
  Qn(36, "Soal UN – Mencari Frekuensi yang Hilang", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Frekuensi warna dalam 100 kali pengambilan"
        headers={["Warna","Merah","Biru","Kuning","Putih","Total"]}
        rows={[["Frekuensi","?",30,25,20,100]]}
      />
    ),
    parts: [
      { label: "a.", text: "Tentukan frekuensi warna Merah." },
      { label: "b.", math: "P_{emp}(\\text{Merah}) = \\frac{\\ldots}{100} = \\ldots" },
      { label: "c.", text: "Apakah warna Merah memiliki peluang empirik terbesar? Jelaskan." },
    ],
  }),
  Qn(37, "Soal UN – FR dan Prediksi", {
    type: "mixed",
    content: "Dalam 50 lemparan dadu, angka 3 muncul 9 kali.",
    parts: [
      { label: "a.", math: "P_{emp}(3) = \\frac{9}{50} = \\ldots" },
      { label: "b.", text: "Jika dadu dilempar 300 kali, perkirakan berapa kali angka 3 muncul berdasarkan peluang empirik ini." },
      { label: "c.", text: "Jika berdasarkan peluang teoretik, berapa kali angka 3 diharapkan muncul dalam 300 lemparan?" },
    ],
  }),
  Qn(38, "Soal ANBK – Menyimpulkan dari Data", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Hasil survei olahraga favorit (150 responden)"
        headers={["Olahraga","Sepak Bola","Basket","Badminton","Renang","Lainnya"]}
        rows={[["Jumlah",60,35,25,20,10]]}
      />
    ),
    parts: [
      { label: "a.", text: "Olahraga mana yang memiliki peluang empirik terbesar?" },
      { label: "b.", math: "P_{emp}(\\text{Basket atau Badminton}) = \\frac{35+25}{150} = \\ldots" },
      { label: "c.", text: "Berapa persen responden yang memilih olahraga selain Sepak Bola?" },
    ],
  }),
  Qn(39, "Soal TKA – Mencari n Percobaan", {
    type: "mixed",
    content: "Frekuensi relatif muncul sisi Angka pada percobaan melempar koin adalah 0,52. Angka muncul sebanyak 130 kali.",
    parts: [
      { label: "a.", math: "n = \\frac{130}{0{,}52} = \\ldots" },
      { label: "b.", text: "Berapa kali sisi Gambar muncul?" },
      { label: "c.", math: "P_{emp}(\\text{Gambar}) = \\frac{\\ldots}{n} = \\ldots" },
    ],
  }),
  Qn(40, "Soal UN Level Tinggi – Analisis Lengkap", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Percobaan melempar dua dadu 360 kali (jumlah kedua dadu)"
        headers={["Jumlah","2","3","4","5","6","7","8","9","10","11","12"]}
        rows={[["Frekuensi",8,18,28,38,45,58,48,40,32,22,23]]}
      />
    ),
    parts: [
      { label: "a.", text: "Berapa frekuensi relatif jumlah = 7?" },
      { label: "b.", text: "Berapa peluang empirik jumlah ≥ 10?" },
      { label: "c.", text: "Bandingkan peluang empirik jumlah = 7 dengan peluang teoretiknya (6/36). Apakah mendekati?" },
    ],
  }),
];

const PeluangEmpirikPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center mb-3">
            <BarChart3 className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-amber-300 text-center mb-1"
            style={{ textShadow: "0 0 20px rgba(251,191,36,0.7)" }}>
            PELUANG EMPIRIK & FREKUENSI RELATIF
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
            <span className="text-amber-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-amber-900/20 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="flex flex-col gap-2">
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
              <BlockMath math="P_{empirik}(A) = \frac{\text{Frekuensi kejadian } A}{\text{Banyak percobaan}}" />
            </div>
            <p className="text-white/50 text-xs font-body text-center">Semakin besar n, semakin mendekati peluang teoretik</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900/80 to-orange-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-amber-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                    <span className="text-amber-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.math && <div className="mb-3 text-white overflow-x-auto"><BlockMath math={q.math} /></div>}
                    {q.diagram && <div className="mb-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? "bg-white/5" : "bg-transparent px-0"}`}>
                            {p.label && <span className="text-amber-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/peluang"); }}
            className="text-sm text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeluangEmpirikPage;
