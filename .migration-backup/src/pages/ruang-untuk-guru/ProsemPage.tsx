import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, ChevronRight, Save, FileDown, FileText } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const tahunList = [
  {
    label: "2025 / 2026",
    slug: "2025-2026",
    sem1: "Juli 2025 – Desember 2025",
    sem2: "Januari 2026 – Juni 2026",
    color: "from-cyan-500/20 to-teal-500/10",
    border: "border-cyan-400/40",
    badge: "bg-cyan-500/15 text-cyan-300",
  },
  {
    label: "2026 / 2027",
    slug: "2026-2027",
    sem1: "Juli 2026 – Desember 2026",
    sem2: "Januari 2027 – Juni 2027",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-400/40",
    badge: "bg-violet-500/15 text-violet-300",
  },
];

const dokumenStyle = `
  @page { size: A4; margin: 3cm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; margin: 0; padding: 0; }
  h1 { text-align: center; font-size: 14pt; font-weight: bold; margin: 0 0 6pt 0; }
  .header { text-align: center; margin-bottom: 16pt; border-bottom: 2px solid #000; padding-bottom: 8pt; }
  .subtitle { font-size: 11pt; margin: 2pt 0; text-align: center; }
  .card { border: 1px solid #aaa; border-radius: 4pt; padding: 10pt; margin-bottom: 10pt; }
  .badge { font-weight: bold; font-size: 10pt; color: #555; margin: 0 0 4pt 0; }
  .tahun { font-size: 14pt; font-weight: bold; margin: 0 0 8pt 0; }
  .kelas { display: flex; gap: 8pt; margin-top: 6pt; }
  .kelas span { border: 1px solid #aaa; padding: 2pt 6pt; font-size: 9pt; }
  .footer { text-align: center; margin-top: 14pt; font-size: 9pt; color: #666; border-top: 1px solid #ccc; padding-top: 6pt; }
`;

const buildDokumenBody = () => `
  <div class="header">
    <h1>PROGRAM SEMESTER (PROSEM)</h1>
    <p class="subtitle">Mata Pelajaran Matematika — Fase D — Kurikulum Merdeka</p>
    <p class="subtitle">SMP/MTs/Program Paket B</p>
  </div>
  ${tahunList.map(t => `
    <div class="card">
      <p class="badge">TAHUN PELAJARAN</p>
      <p class="tahun">${t.label}</p>
      <p style="margin:2pt 0;font-size:11pt;">📅 Semester Ganjil: ${t.sem1}</p>
      <p style="margin:2pt 0;font-size:11pt;">📅 Semester Genap: ${t.sem2}</p>
      <div class="kelas"><span>Kelas 7</span><span>Kelas 8</span><span>Kelas 9</span></div>
    </div>
  `).join("")}
  <div class="footer">
    <p>Dokumen ini dicetak dari Aplikasi NUMATIK — Numerasi Aktif dengan Teknologi Informasi dan Komunikasi</p>
  </div>
`;

const ProsemPage = () => {
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
    document.title = "PROSEM - numatik";
    window.print();
    window.addEventListener("afterprint", () => { document.title = prevTitle; }, { once: true });
  };

  const handlePrintWord = () => {
    playPopSound();
    const html = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>PROSEM - numatik</title><style>${dokumenStyle}</style></head><body>${buildDokumenBody()}</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PROSEM - numatik.doc";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <style>{`
        @media print {
          @page { size: A4; margin: 3cm; }
          .no-print { display: none !important; }
          body, .gradient-space { background: white !important; color: black !important; }
          *, *::before, *::after { background-color: transparent !important; color: black !important; box-shadow: none !important; }
        }
      `}</style>
      <div className="no-print"><Starfield /></div>
      <div className="no-print"><PageNavigation prevPath="/ruang-untuk-guru" /></div>
      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-10 animate-slide-up">
          <div className="no-print inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <CalendarDays className="w-4 h-4" />
            Perangkat Pembelajaran
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            PROGRAM SEMESTER (PROSEM)
          </h1>
          <p className="mt-4 text-sm text-white/70 max-w-2xl mx-auto font-body">
            Rencana distribusi materi pembelajaran matematika SMP per semester berdasarkan kalender akademik yang berlaku. Pilih tahun pelajaran untuk melihat program semester.
          </p>
          <div className="no-print flex items-center justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg ${saved ? "bg-emerald-400 border-emerald-300/60" : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500/60"}`}
            >
              <Save className="w-4 h-4" />
              {saved ? "Tersimpan!" : "Simpan"}
            </button>
            <button
              onClick={handlePrintPDF}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 border border-red-400/60 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <FileDown className="w-4 h-4" />
              Simpan sebagai PDF
            </button>
            <button
              onClick={handlePrintWord}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-400/60 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <FileText className="w-4 h-4" />
              Simpan sebagai Word
            </button>
          </div>
        </div>

        <div className="grid gap-5 mb-10">
          {tahunList.map((t, i) => (
            <button
              key={t.slug}
              onClick={() => { playPopSound(); navigate(`/ruang-untuk-guru/prosem/${t.slug}`); }}
              className={`group relative bg-gradient-to-br ${t.color} border ${t.border} rounded-2xl p-6
                hover:scale-[1.02] transition-all duration-300 text-left animate-slide-up cursor-pointer`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full mb-3 ${t.badge}`}>
                    TAHUN PELAJARAN
                  </span>
                  <h2 className="font-display text-2xl font-bold text-white mb-4">{t.label}</h2>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current opacity-70 shrink-0" />
                      <span className="text-xs text-white/70 font-body">Semester Ganjil: {t.sem1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current opacity-70 shrink-0" />
                      <span className="text-xs text-white/70 font-body">Semester Genap: {t.sem2}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    {["Kelas 7", "Kelas 8", "Kelas 9"].map(k => (
                      <span key={k} className="text-[10px] font-semibold px-2 py-1 rounded bg-white/10 text-white/80">{k}</span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        <div className="no-print text-center">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru"); }}
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

export default ProsemPage;
