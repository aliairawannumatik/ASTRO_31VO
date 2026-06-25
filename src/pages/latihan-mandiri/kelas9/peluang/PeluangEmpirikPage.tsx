import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
          {headers.map((h, i) => <th key={i} className="px-3 py-2 text-amber-200 font-bold text-center border-b border-amber-500/30">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-amber-900/10"}>
            {row.map((cell, ci) => <td key={ci} className="px-3 py-2 text-center text-white/80 border-b border-white/5">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const renderOpt = (opt: string) => {
  if (opt.includes('\\')) return <InlineMath math={opt} />;
  return <>{opt}</>;
};

type MCQ = { n: number; title: string; content: React.ReactNode; diagram?: React.ReactNode; options: string[]; answer: number };

const questions: MCQ[] = [
  {
    n: 1, title: "Frekuensi Relatif – Koin 50 Lemparan",
    content: "Sebuah koin dilempar 50 kali. Sisi Angka muncul sebanyak 28 kali dan sisi Gambar muncul 22 kali. Frekuensi relatif munculnya sisi Angka adalah ...",
    diagram: (
      <FreqTable caption="Hasil percobaan melempar koin"
        headers={["Hasil", "Frekuensi"]}
        rows={[["Angka", 28], ["Gambar", 22], ["Total", 50]]} />
    ),
    options: ["\\frac{11}{25}", "\\frac{14}{25}", "\\frac{11}{14}", "\\frac{14}{50}"],
    answer: 1,
  },
  {
    n: 2, title: "Peluang Empirik – Penjualan Produk",
    content: "Data penjualan produk selama 30 hari sesuai tabel di atas. Peluang empirik terjualnya produk B adalah ...",
    diagram: (
      <FreqTable caption="Data penjualan produk selama 30 hari"
        headers={["Produk", "A", "B", "C", "D", "Total"]}
        rows={[["Terjual", 8, 12, 6, 4, 30]]} />
    ),
    options: ["\\frac{4}{15}", "\\frac{1}{3}", "\\frac{2}{5}", "\\frac{1}{5}"],
    answer: 2,
  },
  {
    n: 3, title: "Peluang Empirik – Survei Mapel Favorit",
    content: "Survei terhadap 80 siswa: Matematika 24, IPA 20, IPS 16, Bahasa 12, Seni 8. Jika dipilih satu siswa acak, peluang empirik terpilihnya siswa yang menyukai Matematika adalah ...",
    diagram: (
      <FreqTable caption="Survei mata pelajaran favorit (80 siswa)"
        headers={["Mata Pelajaran", "Matematika", "IPA", "IPS", "Bahasa", "Seni"]}
        rows={[["Jumlah Siswa", 24, 20, 16, 12, 8]]} />
    ),
    options: ["\\frac{1}{4}", "\\frac{3}{10}", "\\frac{3}{20}", "\\frac{1}{5}"],
    answer: 1,
  },
  {
    n: 4, title: "Peluang Empirik – Dadu 120 Lemparan",
    content: "Sebuah dadu dilempar 120 kali. Hasil percobaan seperti pada tabel. Peluang empirik muncul angka genap adalah ...",
    diagram: (
      <FreqTable caption="Frekuensi munculnya angka dadu (120 lemparan)"
        headers={["Angka", "1", "2", "3", "4", "5", "6"]}
        rows={[["Frekuensi", 18, 22, 19, 21, 20, 20]]} />
    ),
    options: ["\\frac{1}{2}", "\\frac{21}{40}", "\\frac{19}{40}", "\\frac{13}{24}"],
    answer: 1,
  },
  {
    n: 5, title: "Peluang Empirik – Kelereng 200 Kali",
    content: "Percobaan pengambilan kelereng dilakukan 200 kali dengan pengembalian. Hasilnya seperti pada tabel. Peluang empirik terambilnya kelereng bukan Kuning adalah ...",
    diagram: (
      <FreqTable caption="Pengambilan kelereng 200 kali"
        headers={["Warna", "Merah", "Biru", "Kuning", "Hijau", "Total"]}
        rows={[["Frekuensi", 65, 55, 45, 35, 200]]} />
    ),
    options: ["\\frac{9}{40}", "\\frac{1}{2}", "\\frac{31}{40}", "\\frac{3}{5}"],
    answer: 2,
  },
  {
    n: 6, title: "Frekuensi Relatif – Data Cuaca",
    content: "Selama 60 hari tercatat: Cerah 35 hari, Berawan 15 hari, Hujan 10 hari. Frekuensi relatif hari tidak hujan adalah ...",
    diagram: (
      <FreqTable caption="Data cuaca selama 60 hari"
        headers={["Cuaca", "Cerah", "Berawan", "Hujan", "Total"]}
        rows={[["Hari", 35, 15, 10, 60]]} />
    ),
    options: ["\\frac{1}{6}", "\\frac{7}{12}", "\\frac{5}{6}", "\\frac{1}{4}"],
    answer: 2,
  },
  {
    n: 7, title: "Peluang Empirik – Dadu 180 Lemparan",
    content: "Dadu dilempar 180 kali dengan hasil sesuai tabel di atas. Peluang empirik muncul angka lebih dari 4 adalah ...",
    diagram: (
      <FreqTable caption="Percobaan 180 kali melempar dadu"
        headers={["Angka", "1", "2", "3", "4", "5", "6", "Total"]}
        rows={[["Frekuensi", 28, 30, 32, 29, 31, 30, 180]]} />
    ),
    options: ["\\frac{61}{180}", "\\frac{1}{3}", "\\frac{59}{180}", "\\frac{31}{90}"],
    answer: 0,
  },
  {
    n: 8, title: "Soal UN – Frekuensi dari Frekuensi Relatif",
    content: <>Sebuah dadu dilempar 90 kali. Frekuensi relatif muncul angka 5 adalah <InlineMath math="\frac{1}{6}" />. Berapa kali angka 5 muncul dalam percobaan tersebut?</>,
    options: ["12 \\text{ kali}", "15 \\text{ kali}", "18 \\text{ kali}", "20 \\text{ kali}"],
    answer: 1,
  },
  {
    n: 9, title: "Soal TKA – FR Gabungan Dua Koin",
    content: "Dari 400 percobaan melempar dua koin: Angka Angka muncul 97 kali, Angka Gambar muncul 104 kali, Gambar Angka muncul 99 kali, Gambar Gambar muncul 100 kali. Peluang empirik muncul tepat satu sisi Angka adalah ...",
    options: ["\\frac{97}{400}", "\\frac{1}{4}", "\\frac{203}{400}", "\\frac{13}{50}"],
    answer: 2,
  },
  {
    n: 10, title: "Soal ANBK – Peluang Empirik Kualitas Produk",
    content: "Dari 1.000 produk yang diperiksa: Sangat Baik 650, Baik 250, Cukup 70, Kurang 30. Peluang empirik produk berkualitas Cukup atau Kurang adalah ...",
    diagram: (
      <FreqTable caption="Kontrol kualitas: 1.000 produk"
        headers={["Kategori", "Sangat Baik", "Baik", "Cukup", "Kurang"]}
        rows={[["Jumlah", 650, 250, 70, 30]]} />
    ),
    options: ["\\frac{7}{100}", "\\frac{3}{100}", "\\frac{1}{10}", "\\frac{9}{10}"],
    answer: 2,
  },
  {
    n: 11, title: "Soal UN – Frekuensi Relatif Warna Merah",
    content: "Dari 100 kali pengambilan, warna Biru muncul 30 kali, Kuning 25 kali, Putih 20 kali, dan Merah sisanya. Tentukan frekuensi relatif muncul warna Merah adalah ...",
    diagram: (
      <FreqTable caption="Frekuensi warna dalam 100 kali pengambilan"
        headers={["Warna", "Merah", "Biru", "Kuning", "Putih", "Total"]}
        rows={[["Frekuensi", "?", 30, 25, 20, 100]]} />
    ),
    options: ["\\frac{1}{4}", "\\frac{3}{10}", "\\frac{1}{5}", "\\frac{1}{2}"],
    answer: 0,
  },
  {
    n: 12, title: "Soal UN – Menghitung Frekuensi dari FR",
    content: <>Dalam percobaan melempar dadu 300 kali, frekuensi relatif muncul bilangan genap adalah <InlineMath math="0{,}52" />. Berapa kali bilangan genap muncul dalam percobaan tersebut?</>,
    options: ["144 \\text{ kali}", "150 \\text{ kali}", "156 \\text{ kali}", "160 \\text{ kali}"],
    answer: 2,
  },
  {
    n: 13, title: "Soal TKA – Mencari Banyak Percobaan dari FR",
    content: <>Frekuensi relatif muncul sisi Angka pada percobaan melempar koin adalah <InlineMath math="0{,}52" />. Sisi Angka muncul sebanyak 130 kali. Berapa total percobaan yang dilakukan?</>,
    options: ["200 \\text{ kali}", "225 \\text{ kali}", "250 \\text{ kali}", "260 \\text{ kali}"],
    answer: 2,
  },
];

const OPTS = ["A", "B", "C", "D"];

const PeluangEmpirikPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center mb-3">
            <BarChart3 className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-amber-300 text-center mb-1" style={{ textShadow: "0 0 20px rgba(251,191,36,0.7)" }}>
            PELUANG EMPIRIK & FREKUENSI RELATIF
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
            <span className="text-amber-400 text-xs font-bold">📋 {questions.length} {t('practice.suffixSoal')} {t('practice.multipleChoice')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-amber-900/20 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
            <BlockMath math="P_{empirik}(A) = \frac{\text{Frekuensi kejadian } A}{\text{Banyak percobaan}}" />
          </div>
          <p className="text-white/50 text-xs font-body text-center mt-1">Semakin besar n, semakin mendekati peluang teoretik</p>
        </div>
        <div className="flex flex-col gap-5 animate-slide-up">
          {questions.map((q, qi) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden" style={{ animationDelay: `${qi * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900/80 to-orange-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-amber-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                    <span className="text-amber-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.diagram && <div className="mb-3">{q.diagram}</div>}
                    <p className="font-body text-sm text-white/90 leading-relaxed mb-4">{q.content}</p>
                    <div className="flex flex-col gap-1.5">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-white/5 border border-white/10">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border bg-white/10 border-white/20 text-white/70">
                            {OPTS[oi]}
                          </span>
                          <span className="font-body text-sm text-white/80 overflow-x-auto">{renderOpt(opt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/peluang"); }}
            className="text-sm text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeluangEmpirikPage;
