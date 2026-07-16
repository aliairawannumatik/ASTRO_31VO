import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HeartHandshake, Sparkles, Smartphone, ClipboardCheck, ShieldCheck, Printer, FileDown, Save, FileText } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const keyakinan = [
  {
    title: "Saling menghormati dan menghargai",
    desc: "Menghargai pendapat, perasaan, dan perbedaan setiap warga kelas dalam setiap interaksi.",
    icon: HeartHandshake,
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-300/40",
    text: "text-pink-100",
  },
  {
    title: "Menjaga kebersihan dan kerapihan",
    desc: "Membuang sampah pada tempatnya, merapikan meja dan kursi, serta menjaga lingkungan belajar tetap nyaman.",
    icon: Sparkles,
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-300/40",
    text: "text-emerald-100",
  },
  {
    title: "Menggunakan gawai/HP dengan bijak",
    desc: "Gawai hanya digunakan untuk keperluan belajar dan saat diizinkan oleh guru.",
    icon: Smartphone,
    color: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-300/40",
    text: "text-cyan-100",
  },
  {
    title: "Menyelesaikan pekerjaan yang diberikan guru",
    desc: "Mengerjakan tugas, latihan, dan proyek dengan tanggung jawab serta tepat waktu.",
    icon: ClipboardCheck,
    color: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-300/40",
    text: "text-amber-100",
  },
];

const KeyakinanKelasPage = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    playPopSound();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <ShieldCheck className="w-4 h-4" />
            Kesepakatan Bersama
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            KEYAKINAN KELAS
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-2xl mx-auto font-body">
            Nilai-nilai yang kita yakini dan kita laksanakan bersama agar kelas menjadi tempat belajar yang aman, nyaman, dan menyenangkan.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-white text-sm font-semibold font-body transition-all hover:scale-105 shadow-lg ${saved ? "bg-emerald-400 border-emerald-300/60" : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500/60"}`}
            >
              <Save className="w-4 h-4" />
              {saved ? "Tersimpan!" : "Simpan"}
            </button>
            <button
              onClick={() => { playPopSound(); const t = document.title; document.title = "KEYAKINAN KELAS - numatik"; window.print(); window.addEventListener("afterprint", () => { document.title = t; }, { once: true }); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500/90 border border-cyan-400/40 text-white text-sm font-semibold font-body transition-all hover:scale-105 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              Simpan sebagai PDF
            </button>
            <button
              onClick={() => {
                playPopSound();
                const rows = keyakinan.map((k, i) => `<tr><td style="border:1px solid #ccc;padding:5pt 8pt;text-align:center;">${i + 1}</td><td style="border:1px solid #ccc;padding:5pt 8pt;font-weight:bold;">${k.title}</td><td style="border:1px solid #ccc;padding:5pt 8pt;">${k.desc}</td></tr>`).join("");
                const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial;font-size:11pt;margin:2cm}h1{text-align:center;font-size:14pt;font-weight:bold;margin:0 0 6pt 0}table{width:100%;border-collapse:collapse;margin-top:12pt}th{background:#eaf4fb;font-weight:bold;border:1px solid #ccc;padding:5pt 8pt}</style></head><body><h1>KEYAKINAN KELAS</h1><p style="text-align:center;font-size:10pt;margin:2pt 0 14pt 0">Mata Pelajaran Matematika</p><table><thead><tr><th style="width:5%">No</th><th style="width:35%">Keyakinan</th><th>Deskripsi</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
                const blob = new Blob(["\ufeff", html], { type: "application/msword" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "KEYAKINAN KELAS - numatik.doc";
                document.body.appendChild(a); a.click();
                document.body.removeChild(a); URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-500/90 border border-violet-400/40 text-white text-sm font-semibold font-body transition-all hover:scale-105 shadow-lg"
            >
              <FileDown className="w-4 h-4" />
              Simpan sebagai Word
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {keyakinan.map((k, i) => (
            <div
              key={k.title}
              className={`relative rounded-2xl border ${k.border} bg-gradient-to-br ${k.color} p-5 backdrop-blur animate-slide-up`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-xl border ${k.border} bg-black/20 flex items-center justify-center`}>
                  <k.icon className={`w-6 h-6 ${k.text}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${k.text}`}>#{i + 1}</span>
                  </div>
                  <h3 className="font-display text-base md:text-lg font-bold text-white leading-snug mb-1">
                    {k.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/75 font-body leading-relaxed">
                    {k.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center mb-8">
          <p className="text-sm md:text-base text-white/80 font-body italic">
            "Keyakinan kelas adalah janji bersama — bukan aturan yang dipaksakan, melainkan nilai yang kita pegang dengan sepenuh hati."
          </p>
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

export default KeyakinanKelasPage;
