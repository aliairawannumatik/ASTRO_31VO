import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const pageUi = {
  id: { title: "MEMBUAT MODEL SPLDV" },
  en: { title: "BUILDING MODELS FROM SLETV WORD PROBLEMS" },
  ja: { title: "連立方程式の立式" },
};

const accentColor = "#facc15";
const accentDim = "rgba(250,204,21,0.10)";
const borderColor = "rgba(250,204,21,0.25)";

type Part = { label: string; math?: string; text?: string };
type Badge = "UN" | "ANBK" | "TKA" | "AKM";
type Q = { n: number; title: string; content?: string; math?: string; blockMath?: string; parts?: Part[]; badge?: Badge; type: "essay" | "mixed"; };
const badgeStyle: Record<Badge, string> = {
  UN: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
  ANBK: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  TKA: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  AKM: "bg-green-500/20 text-green-300 border-green-400/40",
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qf(1, "Membuat Model dari Belanja", {
    badge: "UN", type: "mixed",
    content: "Ibu membeli 3 kg beras dan 2 kg gula seharga Rp 47.000. Ayah membeli 5 kg beras dan 1 kg gula seharga Rp 61.000.",
    parts: [
      { label: "a.", text: "Tentukan variabel yang tepat (misalnya beras = x, gula = y)." },
      { label: "b.", text: "Tuliskan dua persamaan linearnya." },
      { label: "c.", text: "Tuliskan dalam bentuk SPLDV." },
    ],
  }),
  Qf(2, "Model dari Umur", {
    badge: "UN", type: "mixed",
    content: "Umur Bapak 3 kali umur Anak. Lima tahun lagi, umur Bapak 2 kali umur Anak.",
    parts: [
      { label: "a.", text: "Misal umur Bapak sekarang = x dan umur Anak = y. Tuliskan persamaan pertama." },
      { label: "b.", text: "Lima tahun lagi: umur Bapak = x + 5, umur Anak = y + 5. Tuliskan persamaan kedua." },
      { label: "c.", text: "Gabungkan menjadi SPLDV." },
    ],
  }),
  Qf(3, "Model dari Keliling", {
    badge: "ANBK", type: "mixed",
    content: "Sebuah persegi panjang memiliki keliling 60 cm. Panjangnya 6 cm lebih dari lebarnya.",
    parts: [
      { label: "a.", text: "Misal panjang = p dan lebar = l. Tuliskan persamaan dari keliling." },
      { label: "b.", text: "Tuliskan persamaan dari hubungan panjang dan lebar." },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(4, "Model dari Koin", {
    badge: "TKA", type: "mixed",
    content: "Dompet Rani berisi 25 keping uang logam Rp 500 dan Rp 1.000. Total nilai = Rp 16.000.",
    parts: [
      { label: "a.", text: "Misal banyak koin Rp 500 = x dan Rp 1.000 = y." },
      { label: "b.", text: "Tuliskan persamaan jumlah koin dan persamaan nilai total." },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(5, "Model dari Tiket", {
    badge: "UN", type: "mixed",
    content: "Harga tiket bioskop dewasa Rp 50.000 dan anak-anak Rp 30.000. Sebanyak 200 tiket terjual dengan total pemasukan Rp 8.400.000.",
    parts: [
      { label: "a.", text: "Misal tiket dewasa = x dan anak = y. Tuliskan dua persamaan." },
      { label: "b.", text: "Tuliskan sebagai SPLDV." },
    ],
  }),
  Qf(6, "Model dari Kecepatan", {
    badge: "AKM", type: "mixed",
    content: "Dua mobil melaju dari kota A ke kota B (240 km). Mobil pertama (kecepatan x km/jam) tiba 1 jam lebih cepat dari mobil kedua (kecepatan y km/jam). Kecepatan mobil kedua 20 km/jam lebih lambat.",
    parts: [
      { label: "a.", text: "Tuliskan persamaan dari selisih kecepatan." },
      { label: "b.", text: "Tuliskan persamaan dari selisih waktu, gunakan:", math: "t = \\dfrac{d}{v}" },
      { label: "c.", text: "Susun SPLDV." },
    ],
  }),
  Qf(7, "Model dari Penjualan", {
    badge: "UN", type: "mixed",
    content: "Toko menjual dua jenis barang. Harga barang A = Rp 12.000 dan barang B = Rp 8.000. Dalam satu hari terjual 150 barang dengan pendapatan Rp 1.560.000.",
    parts: [
      { label: "a.", text: "Misal barang A = x dan barang B = y. Tuliskan SPLDV." },
      { label: "b.", text: "Tuliskan setiap persamaan secara jelas." },
    ],
  }),
  Qf(8, "Model Bilangan Dua Angka", {
    badge: "UN", type: "mixed",
    content: "Suatu bilangan dua angka. Jumlah digitnya = 11. Jika digit-digitnya dipertukarkan, bilangan baru lebih besar 27 dari bilangan semula.",
    parts: [
      { label: "a.", text: "Misal angka puluhan = x dan satuan = y." },
      { label: "b.", text: "Bilangan semula = 10x + y. Bilangan baru = 10y + x. Tuliskan dua persamaan." },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(9, "Model dari Campuran Larutan", {
    badge: "TKA", type: "mixed",
    content: "Larutan A mengandung 20% garam dan larutan B mengandung 50% garam. Dicampurkan x liter A dan y liter B untuk menghasilkan 30 liter larutan 35% garam.",
    parts: [
      { label: "a.", text: "Tuliskan persamaan total volume." },
      { label: "b.", text: "Tuliskan persamaan kandungan garam." },
      { label: "c.", text: "Tuliskan SPLDV." },
    ],
  }),
  Qf(10, "Model dari Pekerjaan", {
    badge: "TKA", type: "mixed",
    content: "Tukang A dapat menyelesaikan pekerjaan dalam x hari. Tukang B dalam y hari. Bersama dapat selesai dalam 4 hari. Tukang A bekerja 6 hari lebih cepat dari Tukang B.",
    parts: [
      { label: "a.", text: "Kecepatan bersama:", math: "\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{4}" },
      { label: "b.", text: "Tuliskan persamaan kedua dari selisih waktu." },
      { label: "c.", text: "Tuliskan SPLDV (dalam bentuk x dan y)." },
    ],
  }),
  Qf(11, "Model Geometri — Sudut", {
    badge: "ANBK", type: "mixed",
    content: "Dua sudut saling berpelurus (jumlah = 180°). Sudut pertama = 3 kali sudut kedua dikurangi 20°.",
    parts: [
      { label: "a.", text: "Misal sudut pertama = x° dan sudut kedua = y°. Tuliskan dua persamaan." },
      { label: "b.", text: "Susun SPLDV." },
    ],
  }),
  Qf(12, "Model Tenaga Kerja", {
    badge: "AKM", type: "mixed",
    content: "Pabrik mempekerjakan pekerja laki-laki (gaji Rp 80.000/hari) dan perempuan (gaji Rp 60.000/hari). Total pekerja 40 orang dan total gaji Rp 2.800.000/hari.",
    parts: [
      { label: "a.", text: "Misal pekerja laki-laki = x dan perempuan = y. Susun SPLDV." },
      { label: "b.", text: "Verifikasi apakah (25, 15) adalah solusinya." },
    ],
  }),
  Qf(13, "Model Campuran Logam", {
    badge: "TKA", type: "mixed",
    content: "Campuran emas dan perak seberat 100 gram mengandung 30 gram emas. Perbandingan emas terhadap perak = 3 : 7.",
    parts: [
      { label: "a.", text: "Misal berat emas = x dan perak = y. Tuliskan persamaan total berat." },
      { label: "b.", text: "Tuliskan persamaan dari perbandingan x : y = 3 : 7." },
      { label: "c.", text: "Susun SPLDV." },
    ],
  }),
  Qf(14, "Model Usia dengan Masa Lalu", {
    badge: "UN", type: "mixed",
    content: "Empat tahun yang lalu, jumlah umur Ibu dan Anak = 42 tahun. Sekarang, umur Ibu = 3 kali umur Anak.",
    parts: [
      { label: "a.", text: "Misal umur Ibu sekarang = x dan Anak = y." },
      { label: "b.", text: "Tuliskan persamaan dari kondisi 4 tahun lalu." },
      { label: "c.", text: "Tuliskan persamaan dari kondisi sekarang. Susun SPLDV." },
    ],
  }),
  Qf(15, "Model dari Konteks Digital", {
    badge: "AKM", type: "mixed",
    content: "Sebuah platform streaming memiliki pelanggan premium (Rp 50.000/bulan = x) dan reguler (Rp 20.000/bulan = y). Total 500 pelanggan, total pendapatan Rp 16.000.000/bulan.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Tentukan banyaknya pelanggan premium dan reguler." },
    ],
  }),
  Qf(16, "Model dari Soal ANBK", {
    badge: "ANBK", type: "mixed",
    content: "Tentukan BENAR (B) atau SALAH (S) dari pernyataan dalam pemodelan SPLDV berikut:",
    parts: [
      { label: "(1)", text: "Langkah pertama membuat model adalah menentukan variabel yang mewakili besaran yang tidak diketahui." },
      { label: "(2)", text: "Setiap masalah dengan dua hal yang tidak diketahui pasti bisa dimodelkan sebagai SPLDV." },
      { label: "(3)", text: "SPLDV membutuhkan tepat dua persamaan linear untuk membentuk sistem." },
      { label: "(4)", text: "Setelah menemukan solusi, hasilnya perlu diverifikasi terhadap kondisi asli masalah." },
    ],
  }),
];

const ModelSPLDVPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const pu = pageUi[language as keyof typeof pageUi] ?? pageUi.id;
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <FileText className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            {pu.title}
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · {t('practice.breadcrumb')} · 16 Soal</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {(["UN","ANBK","TKA","AKM"] as Badge[]).map(b => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b]}`}>{b}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl overflow-hidden border" style={{ background: accentDim, borderColor }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor, background: "rgba(250,204,21,0.08)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: accentColor + "30", color: accentColor }}>{q.n}</div>
                <span className="font-display text-sm font-bold" style={{ color: accentColor }}>{q.title}</span>
                {q.badge && <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle[q.badge]}`}>{q.badge}</span>}
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.content && <p className="font-body text-sm text-white/85 leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-white/90 text-sm"><InlineMath math={q.math} /></div>}
                {q.blockMath && (
                  <div className="rounded-xl px-4 py-3 text-white/90 overflow-x-auto"
                    style={{ background: "rgba(250,204,21,0.08)", border: `1px solid ${borderColor}` }}>
                    <BlockMath math={q.blockMath} />
                  </div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1">
                    {q.parts.map((p, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <span className="font-bold text-xs shrink-0 mt-0.5" style={{ color: accentColor }}>{p.label}</span>
                        <span className="font-body text-sm text-white/80 leading-relaxed">
                          {p.text && p.text}{p.math && <InlineMath math={p.math} />}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/spldv"); }}
            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer font-body">
            ← {t('practice.backToMenu')} SPLDV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelSPLDVPage;
