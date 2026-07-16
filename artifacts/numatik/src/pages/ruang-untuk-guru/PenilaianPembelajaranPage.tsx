import { useNavigate } from "react-router-dom";
import { ArrowLeft, HandHeart, Brain, MessagesSquare, Timer, Target, ClipboardList, Printer, FileDown } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const aspek = [
  {
    title: "Religiusitas",
    desc: "Menunjukkan rasa syukur dan konsistensi dalam berbuat kebajikan.",
    icon: HandHeart,
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-300/40",
    text: "text-amber-100",
  },
  {
    title: "Berpikir Kritis",
    desc: "Terampil mengajukan pertanyaan dan menyusun argumen yang logis.",
    icon: Brain,
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-300/40",
    text: "text-violet-100",
  },
  {
    title: "Kolaborasi",
    desc: "Bekerja sama secara aktif dan efektif dengan teman dalam diskusi maupun kerja kelompok.",
    icon: MessagesSquare,
    color: "from-cyan-500/20 to-sky-500/10",
    border: "border-cyan-300/40",
    text: "text-cyan-100",
  },
  {
    title: "Kedisiplinan",
    desc: "Menunjukkan komitmen dengan menyelesaikan tugas tepat waktu.",
    icon: Timer,
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-300/40",
    text: "text-emerald-100",
  },
  {
    title: "Akurasi Akademik",
    desc: "Menampilkan kualitas dan ketepatan tinggi dalam pengerjaan soal latihan matematika.",
    icon: Target,
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-300/40",
    text: "text-pink-100",
  },
];

const PenilaianPembelajaranPage = () => {
  const navigate = useNavigate();

  const handlePrintPDF = () => {
    playPopSound();
    window.print();
  };

  const handleDownloadWord = () => {
    playPopSound();
    const rows = aspek.map((a, i) => `
      <tr>
        <td style="border:1px solid #ccc;padding:5pt 8pt;text-align:center;">${i + 1}</td>
        <td style="border:1px solid #ccc;padding:5pt 8pt;font-weight:bold;">${a.title}</td>
        <td style="border:1px solid #ccc;padding:5pt 8pt;">${a.desc}</td>
      </tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:Arial,sans-serif;font-size:11pt;margin:2cm}
h1{text-align:center;font-size:14pt;font-weight:bold;margin:0 0 6pt 0}
table{width:100%;border-collapse:collapse;margin-top:12pt}
th{background:#eaf4fb;font-weight:bold;border:1px solid #ccc;padding:5pt 8pt}
</style></head><body>
<h1>PENILAIAN PEMBELAJARAN</h1>
<p style="text-align:center;font-size:10pt;margin:2pt 0 14pt 0">Aspek Penilaian Peserta Didik — Mata Pelajaran Matematika</p>
<table>
<thead><tr><th style="width:5%">No</th><th style="width:25%">Aspek</th><th>Deskripsi</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Penilaian_Pembelajaran.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <ClipboardList className="w-4 h-4" />
            Aspek Penilaian Peserta Didik
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            PENILAIAN PEMBELAJARAN
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-2xl mx-auto font-body">
            Lima aspek utama yang menjadi acuan dalam menilai sikap, keterampilan, dan capaian belajar peserta didik di kelas matematika.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {aspek.map((a, i) => (
            <div
              key={a.title}
              className={`relative rounded-2xl border ${a.border} bg-gradient-to-br ${a.color} p-5 backdrop-blur animate-slide-up`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-xl border ${a.border} bg-black/20 flex items-center justify-center`}>
                  <a.icon className={`w-6 h-6 ${a.text}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${a.text}`}>#{i + 1}</span>
                  </div>
                  <h3 className="font-display text-base md:text-lg font-bold text-white leading-snug mb-1">
                    {a.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/75 font-body leading-relaxed">
                    {a.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center mb-8">
          <p className="text-sm md:text-base text-white/80 font-body italic">
            "Penilaian yang baik bukan sekadar mengukur hasil, melainkan menumbuhkan karakter dan semangat belajar peserta didik."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
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
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Ruang untuk Guru
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenilaianPembelajaranPage;
