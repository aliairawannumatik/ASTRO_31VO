import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import {
  ArrowLeft,
  ClipboardCheck,
  GraduationCap,
  Award,
  Printer,
  FileDown,
  Save,
  FileText,
} from "lucide-react";

const dimensiList = [
  {
    dimensi: "Keimanan dan Ketakwaan",
    aspek: "Menunjukkan sikap religius dalam pembelajaran",
    skor: {
      4: "Selalu berdoa dengan khusyuk, bersyukur, dan mengaitkan materi dengan kebesaran Tuhan",
      3: "Berdoa dan bersyukur dengan baik, kadang mengaitkan materi dengan nilai religius",
      2: "Hanya mengikuti doa bersama tanpa refleksi mendalam",
      1: "Tidak menunjukkan sikap religius dalam pembelajaran",
    },
  },
  {
    dimensi: "Kewargaan",
    aspek: "Tanggung jawab dan kepedulian dalam kerja kelompok dan konteks sosial",
    skor: {
      4: "Aktif membantu kelompok, menghargai pendapat, dan mengaitkan materi dengan masalah sosial",
      3: "Bekerja sama dengan baik, menunjukkan kepedulian sosial",
      2: "Terlibat pasif dalam kelompok, sedikit menunjukkan kepedulian sosial",
      1: "Tidak bekerja sama, tidak peduli terhadap dinamika kelompok",
    },
  },
  {
    dimensi: "Penalaran Kritis",
    aspek: "Proses berpikir dalam memahami dan menerapkan konsep",
    skor: {
      4: "Menyampaikan argumen logis, menyimpulkan dengan tepat, dan menyelesaikan masalah kompleks",
      3: "Mampu menganalisis dan menyimpulkan dengan baik dalam situasi umum",
      2: "Memahami konsep dasar, tapi kesulitan menerapkannya pada masalah",
      1: "Gagal memahami dan menerapkan konsep",
    },
  },
  {
    dimensi: "Kreativitas",
    aspek: "Gagasan baru dan orisinal dalam kegiatan pembelajaran",
    skor: {
      4: "Menghasilkan ide unik dan solutif dalam percobaan/kegiatan",
      3: "Menunjukkan kreativitas dalam pendekatan tugas",
      2: "Mengikuti instruksi dengan sedikit inisiatif",
      1: "Tidak menunjukkan kreativitas atau inisiatif",
    },
  },
  {
    dimensi: "Kolaborasi",
    aspek: "Partisipasi dalam kerja kelompok",
    skor: {
      4: "Berperan aktif, mendengarkan, dan menghargai semua anggota",
      3: "Bekerja sama secara efektif dengan kontribusi yang jelas",
      2: "Terlibat dalam kelompok tetapi pasif",
      1: "Tidak berpartisipasi dalam kerja kelompok",
    },
  },
  {
    dimensi: "Kemandirian",
    aspek: "Pengelolaan tugas individu dan refleksi",
    skor: {
      4: "Menyelesaikan tugas tepat waktu dan merefleksikan pembelajaran dengan mendalam",
      3: "Menyelesaikan tugas dengan baik dan melakukan refleksi sederhana",
      2: "Menyelesaikan tugas sebagian, refleksi kurang",
      1: "Tidak menyelesaikan tugas, tidak melakukan refleksi",
    },
  },
  {
    dimensi: "Komunikasi",
    aspek: "Penyampaian ide dan hasil diskusi",
    skor: {
      4: "Menyampaikan ide dengan jelas, percaya diri, dan terbuka terhadap tanggapan",
      3: "Menyampaikan pendapat dengan baik dan sopan",
      2: "Menyampaikan dengan ragu-ragu dan kurang terstruktur",
      1: "Tidak menyampaikan pendapat atau diam saat presentasi",
    },
  },
];

const skorHeader = [
  { value: 4, label: "Sangat Baik", color: "from-emerald-500/30 to-emerald-700/20", text: "text-emerald-100", border: "border-emerald-300/40" },
  { value: 3, label: "Baik", color: "from-cyan-500/30 to-cyan-700/20", text: "text-cyan-100", border: "border-cyan-300/40" },
  { value: 2, label: "Cukup", color: "from-yellow-500/30 to-yellow-700/20", text: "text-yellow-100", border: "border-yellow-300/40" },
  { value: 1, label: "Perlu Bimbingan", color: "from-rose-500/30 to-rose-700/20", text: "text-rose-100", border: "border-rose-300/40" },
];

const kategoriList = [
  { totalSkor: "25 – 28", nilai: "90 – 100", kategori: "Sangat Baik", color: "text-emerald-200", bg: "bg-emerald-500/10", border: "border-emerald-300/30" },
  { totalSkor: "21 – 24", nilai: "80 – 89", kategori: "Baik", color: "text-cyan-200", bg: "bg-cyan-500/10", border: "border-cyan-300/30" },
  { totalSkor: "17 – 20", nilai: "70 – 79", kategori: "Cukup", color: "text-yellow-200", bg: "bg-yellow-500/10", border: "border-yellow-300/30" },
  { totalSkor: "≤ 16", nilai: "< 70", kategori: "Perlu Bimbingan", color: "text-rose-200", bg: "bg-rose-500/10", border: "border-rose-300/30" },
];

const RubrikPenilaianDimensiLulusanPage = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    playPopSound();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePrintPDF = () => {
    playPopSound();
    const prevTitle = document.title;
    document.title = "RUBRIK PENILAIAN DIMENSI LULUSAN - numatik";
    window.print();
    window.addEventListener("afterprint", () => { document.title = prevTitle; }, { once: true });
  };

  const handleDownloadWord = () => {
    playPopSound();
    const rows = dimensiList.map((d, i) => `
      <tr>
        <td style="border:1px solid #ccc;padding:5pt 8pt;text-align:center;">${i + 1}</td>
        <td style="border:1px solid #ccc;padding:5pt 8pt;font-weight:bold;">${d.dimensi}</td>
        <td style="border:1px solid #ccc;padding:5pt 8pt;">${d.aspek}</td>
        <td style="border:1px solid #ccc;padding:5pt 8pt;">4</td>
        <td style="border:1px solid #ccc;padding:5pt 8pt;">3</td>
        <td style="border:1px solid #ccc;padding:5pt 8pt;">2</td>
        <td style="border:1px solid #ccc;padding:5pt 8pt;">1</td>
      </tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:Arial,sans-serif;font-size:11pt;margin:2cm}
h1{text-align:center;font-size:14pt;font-weight:bold;margin:0 0 6pt 0}
table{width:100%;border-collapse:collapse;margin-top:12pt}
th{background:#eaf4fb;font-weight:bold;border:1px solid #ccc;padding:5pt 8pt}
</style></head><body>
<h1>RUBRIK PENILAIAN DIMENSI LULUSAN</h1>
<p style="text-align:center;font-size:10pt;margin:2pt 0 14pt 0">Mata Pelajaran Matematika — SMP/MTs Fase D</p>
<table>
<thead><tr><th style="width:4%">No</th><th style="width:22%">Dimensi</th><th>Aspek yang Diamati</th><th style="width:7%">Skor 4</th><th style="width:7%">Skor 3</th><th style="width:7%">Skor 2</th><th style="width:7%">Skor 1</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "RUBRIK PENILAIAN DIMENSI LULUSAN - numatik.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <ClipboardCheck className="w-4 h-4" />
            Rubrik Penilaian Karakter Murid
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-primary text-glow-cyan leading-tight">
            RUBRIK PENILAIAN DIMENSI LULUSAN
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            Panduan penilaian tujuh dimensi profil lulusan yang dapat digunakan guru selama proses pembelajaran berlangsung.
          </p>
        </div>

        {/* Tabel Versi Desktop */}
        <section className="hidden lg:block rounded-3xl border border-cyan-200/25 bg-card/85 backdrop-blur p-5 mb-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-3 font-display text-cyan-100 border-b border-white/10 bg-black/30 rounded-tl-xl w-[14%]">
                  Dimensi
                </th>
                <th className="text-left p-3 font-display text-cyan-100 border-b border-white/10 bg-black/30 w-[18%]">
                  Aspek yang Dinilai
                </th>
                {skorHeader.map((s, i) => (
                  <th
                    key={s.value}
                    className={`text-left p-3 font-display border-b border-white/10 bg-gradient-to-br ${s.color} ${s.text} ${i === skorHeader.length - 1 ? "rounded-tr-xl" : ""}`}
                  >
                    <div className="text-base font-bold">{s.value}</div>
                    <div className="text-xs font-normal opacity-90">{s.label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dimensiList.map((row, idx) => (
                <tr
                  key={row.dimensi}
                  className={idx % 2 === 0 ? "bg-white/5" : "bg-transparent"}
                >
                  <td className="p-3 align-top font-semibold text-yellow-100 border-b border-white/5 font-body">
                    {row.dimensi}
                  </td>
                  <td className="p-3 align-top text-white/85 border-b border-white/5 font-body">
                    {row.aspek}
                  </td>
                  {skorHeader.map((s) => (
                    <td
                      key={s.value}
                      className="p-3 align-top text-white/80 border-b border-white/5 leading-relaxed font-body"
                    >
                      {row.skor[s.value as 1 | 2 | 3 | 4]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Versi Mobile/Tablet — Card per Dimensi */}
        <section className="lg:hidden space-y-4 mb-8">
          {dimensiList.map((row, idx) => (
            <article
              key={row.dimensi}
              className="rounded-3xl border border-cyan-200/25 bg-card/85 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="mb-4">
                <h3 className="font-display text-lg font-bold text-yellow-100 mb-1">
                  {row.dimensi}
                </h3>
                <p className="text-xs text-white/60 font-body">{row.aspek}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {skorHeader.map((s) => (
                  <div
                    key={s.value}
                    className={`rounded-2xl border ${s.border} bg-gradient-to-br ${s.color} p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 font-display font-bold ${s.text}`}>
                        {s.value}
                      </span>
                      <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>
                    </div>
                    <p className="text-xs text-white/85 leading-relaxed font-body">
                      {row.skor[s.value as 1 | 2 | 3 | 4]}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* Konversi Skor */}
        <section className="rounded-3xl border border-fuchsia-200/25 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-violet-500/10 backdrop-blur p-5 md:p-7 mb-8">
          <div className="flex items-start gap-3 mb-5">
            <Award className="w-8 h-8 text-fuchsia-200 shrink-0" />
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-fuchsia-100">
                Konversi Total Skor (dari 28)
              </h2>
              <p className="text-sm text-white/65 mt-1 font-body">
                Total skor tujuh dimensi dikonversi ke nilai skala 100 dan kategori berikut.
              </p>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/40">
                <tr>
                  <th className="text-left p-3 font-display text-cyan-100">Total Skor (dari 28)</th>
                  <th className="text-left p-3 font-display text-cyan-100">Nilai Skala 100</th>
                  <th className="text-left p-3 font-display text-cyan-100">Kategori</th>
                </tr>
              </thead>
              <tbody>
                {kategoriList.map((k, idx) => (
                  <tr key={k.kategori} className={idx % 2 === 0 ? "bg-white/5" : "bg-transparent"}>
                    <td className="p-3 font-semibold text-white font-body">{k.totalSkor}</td>
                    <td className="p-3 text-white/85 font-body">{k.nilai}</td>
                    <td className={`p-3 font-display font-bold ${k.color}`}>{k.kategori}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden grid sm:grid-cols-2 gap-3">
            {kategoriList.map((k) => (
              <div
                key={k.kategori}
                className={`rounded-2xl border ${k.border} ${k.bg} p-4`}
              >
                <p className={`font-display text-lg font-bold ${k.color} mb-2`}>
                  {k.kategori}
                </p>
                <div className="space-y-1 text-xs text-white/80 font-body">
                  <p>
                    <span className="text-white/55">Total Skor:</span>{" "}
                    <span className="text-white font-semibold">{k.totalSkor}</span>
                  </p>
                  <p>
                    <span className="text-white/55">Nilai Skala 100:</span>{" "}
                    <span className="text-white font-semibold">{k.nilai}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={handleSave}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-white text-sm font-semibold font-body transition-all ${saved ? "bg-emerald-400 border-emerald-300/60" : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500/60"}`}
          >
            <Save className="w-4 h-4" />
            {saved ? "Tersimpan!" : "Simpan"}
          </button>
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500/90 border border-cyan-400/40 text-white text-sm font-semibold font-body transition-all"
          >
            <Printer className="w-4 h-4" />
            Simpan sebagai PDF
          </button>
          <button
            onClick={handleDownloadWord}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-500/90 border border-violet-400/40 text-white text-sm font-semibold font-body transition-all"
          >
            <FileDown className="w-4 h-4" />
            Simpan sebagai Word
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              playPopSound();
              navigate("/ruang-untuk-guru");
            }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Ruang Untuk Guru
          </button>
        </div>
      </div>
    </div>
  );
};

export default RubrikPenilaianDimensiLulusanPage;
