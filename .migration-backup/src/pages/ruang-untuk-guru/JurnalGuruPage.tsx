import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import {
  ArrowLeft,
  NotebookPen,
  Plus,
  Trash2,
  Printer,
  Eraser,
  FileDown,
  Save,
  FileText,
} from "lucide-react";

type JurnalEntry = {
  id: string;
  waktu: string;
  nama: string;
  kejadian: string;
  tindakLanjut: string;
};

type JurnalState = {
  satuanPendidikan: string;
  tahunPelajaran: string;
  kelasSemester: string;
  mataPelajaranGuru: string;
  entries: JurnalEntry[];
};

const STORAGE_KEY = "numatik:jurnal-guru:v1";

const createEmptyEntry = (): JurnalEntry => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  waktu: "",
  nama: "",
  kejadian: "",
  tindakLanjut: "",
});

const initialState: JurnalState = {
  satuanPendidikan: "SMPN 28 BANDUNG",
  tahunPelajaran: "2023 - 2024",
  kelasSemester: "",
  mataPelajaranGuru: "",
  entries: Array.from({ length: 5 }, () => createEmptyEntry()),
};

const JurnalGuruPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<JurnalState>(initialState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as JurnalState;
        if (parsed && Array.isArray(parsed.entries)) {
          setState(parsed);
        }
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const updateField = (key: keyof Omit<JurnalState, "entries">, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const updateEntry = (id: string, key: keyof JurnalEntry, value: string) => {
    setState((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === id ? { ...entry, [key]: value } : entry
      ),
    }));
  };

  const addEntry = () => {
    playPopSound();
    setState((prev) => ({ ...prev, entries: [...prev.entries, createEmptyEntry()] }));
  };

  const removeEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      entries:
        prev.entries.length <= 1
          ? prev.entries
          : prev.entries.filter((entry) => entry.id !== id),
    }));
  };

  const resetJurnal = () => {
    if (window.confirm("Yakin ingin mengosongkan seluruh isi jurnal?")) {
      setState({
        ...initialState,
        entries: Array.from({ length: 5 }, () => createEmptyEntry()),
      });
    }
  };

  const handleSave = () => {
    playPopSound();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePrint = () => {
    playPopSound();
    const prevTitle = document.title;
    document.title = "JURNAL GURU - numatik";
    window.print();
    window.addEventListener("afterprint", () => { document.title = prevTitle; }, { once: true });
  };

  const handleDownloadWord = () => {
    playPopSound();
    const rows = state.entries.map((e, i) => `
      <tr>
        <td style="border:1px solid #ccc;padding:4pt 6pt;text-align:center;">${i + 1}</td>
        <td style="border:1px solid #ccc;padding:4pt 6pt;">${e.waktu || ""}</td>
        <td style="border:1px solid #ccc;padding:4pt 6pt;">${e.nama || ""}</td>
        <td style="border:1px solid #ccc;padding:4pt 6pt;">${e.kejadian || ""}</td>
        <td style="border:1px solid #ccc;padding:4pt 6pt;">${e.tindakLanjut || ""}</td>
      </tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:Arial,sans-serif;font-size:11pt;margin:2cm}
h1{text-align:center;font-size:14pt;font-weight:bold;margin:0 0 4pt 0}
table{width:100%;border-collapse:collapse;margin-top:12pt}
th{background:#eaf4fb;font-weight:bold;border:1px solid #ccc;padding:5pt 6pt;font-size:10pt}
</style></head><body>
<h1>JURNAL GURU</h1>
<p style="text-align:center;font-size:10pt;margin:2pt 0">Satuan Pendidikan: ${state.satuanPendidikan || "____________________________"} | ${state.kelasSemester || ""}</p>
<table>
<thead><tr>
<th style="width:4%">No</th><th>Waktu/Tanggal</th><th>Nama Siswa</th><th>Kejadian/Catatan</th><th>Tindak Lanjut</th>
</tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "JURNAL GURU - numatik.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="guru-editable relative min-h-screen gradient-space overflow-x-hidden text-white print:bg-white print:text-black">
      <div className="print:hidden">
        <Starfield />
        <PageNavigation prevPath="/ruang-untuk-guru" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-14 print:pt-6">
        <div className="text-center mb-8 animate-slide-up print:hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <NotebookPen className="w-4 h-4" />
            Jurnal Catatan Guru
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            JURNAL GURU
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            Buku catatan harian untuk merekam kejadian, perilaku peserta didik, dan tindak lanjut yang dilakukan guru selama pembelajaran.
          </p>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5 print:hidden">
          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-white text-sm font-semibold font-body transition-all hover:scale-105 shadow-lg ${saved ? "bg-emerald-400 border-emerald-300/60" : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500/60"}`}
          >
            <Save className="w-4 h-4" />
            {saved ? "Tersimpan!" : "Simpan"}
          </button>
          <button
            onClick={() => { playPopSound(); handlePrint(); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500/90 border border-cyan-400/40 text-white text-sm font-semibold font-body transition-all hover:scale-105 shadow-lg"
          >
            <Printer className="w-4 h-4" />
            Simpan sebagai PDF
          </button>
          <button
            onClick={handleDownloadWord}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-500/90 border border-violet-400/40 text-white text-sm font-semibold font-body transition-all hover:scale-105 shadow-lg"
          >
            <FileDown className="w-4 h-4" />
            Simpan sebagai Word
          </button>
          <button
            onClick={addEntry}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/25 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Baris
          </button>
          <button
            onClick={resetJurnal}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/25 transition-colors"
          >
            <Eraser className="w-4 h-4" />
            Kosongkan
          </button>
        </div>

        {/* Identitas */}
        <section className="rounded-3xl border border-cyan-200/25 bg-card/85 backdrop-blur p-5 md:p-7 mb-6 print:bg-white print:border-black print:rounded-none">
          <h2 className="font-display text-xl font-bold text-cyan-100 mb-4 text-center print:text-black">
            JURNAL
          </h2>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 text-sm font-body">
            <IdentitasField
              label="Nama Satuan Pendidikan"
              value={state.satuanPendidikan}
              onChange={(v) => updateField("satuanPendidikan", v)}
            />
            <IdentitasField
              label="Tahun Pelajaran"
              value={state.tahunPelajaran}
              onChange={(v) => updateField("tahunPelajaran", v)}
            />
            <IdentitasField
              label="Kelas / Semester"
              value={state.kelasSemester}
              onChange={(v) => updateField("kelasSemester", v)}
              placeholder="contoh: VIII A / Ganjil"
            />
            <IdentitasField
              label="Mata Pelajaran / Guru"
              value={state.mataPelajaranGuru}
              onChange={(v) => updateField("mataPelajaranGuru", v)}
              placeholder="contoh: Matematika / Irawan Sutiawan, M.Pd."
            />
          </div>
        </section>

        {/* Tabel Jurnal */}
        <section className="rounded-3xl border border-border bg-card/85 backdrop-blur overflow-x-auto mb-8 print:bg-white print:border-black print:rounded-none">
          <table className="w-full text-sm border-collapse min-w-[860px]">
            <thead>
              <tr className="bg-black/30 print:bg-gray-200">
                <th className="p-3 font-display text-cyan-100 border border-white/10 print:text-black print:border-black w-12">NO</th>
                <th className="p-3 font-display text-cyan-100 border border-white/10 print:text-black print:border-black w-32">WAKTU</th>
                <th className="p-3 font-display text-cyan-100 border border-white/10 print:text-black print:border-black w-48">NAMA PESERTA DIDIK</th>
                <th className="p-3 font-display text-cyan-100 border border-white/10 print:text-black print:border-black">KEJADIAN / PERILAKU</th>
                <th className="p-3 font-display text-cyan-100 border border-white/10 print:text-black print:border-black">TINDAK LANJUT</th>
                <th className="p-3 font-display text-cyan-100 border border-white/10 print:text-black print:border-black w-32">TTD PESERTA DIDIK</th>
                <th className="p-3 font-display text-cyan-100 border border-white/10 print:hidden w-12">⋯</th>
              </tr>
            </thead>
            <tbody>
              {state.entries.map((entry, idx) => (
                <tr key={entry.id} className="align-top">
                  <td className="p-2 text-center border border-white/10 text-white/80 print:text-black print:border-black">
                    {idx + 1}
                  </td>
                  <td className="p-1 border border-white/10 print:border-black">
                    <input
                      type="text"
                      value={entry.waktu}
                      onChange={(e) => updateEntry(entry.id, "waktu", e.target.value)}
                      placeholder="dd/mm/yyyy"
                      className="w-full bg-transparent text-white/90 text-sm px-2 py-2 rounded-md outline-none focus:bg-cyan-500/10 print:text-black"
                    />
                  </td>
                  <td className="p-1 border border-white/10 print:border-black">
                    <input
                      type="text"
                      value={entry.nama}
                      onChange={(e) => updateEntry(entry.id, "nama", e.target.value)}
                      className="w-full bg-transparent text-white/90 text-sm px-2 py-2 rounded-md outline-none focus:bg-cyan-500/10 print:text-black"
                    />
                  </td>
                  <td className="p-1 border border-white/10 print:border-black">
                    <textarea
                      rows={2}
                      value={entry.kejadian}
                      onChange={(e) => updateEntry(entry.id, "kejadian", e.target.value)}
                      className="w-full bg-transparent text-white/90 text-sm px-2 py-2 rounded-md outline-none resize-y focus:bg-cyan-500/10 print:text-black"
                    />
                  </td>
                  <td className="p-1 border border-white/10 print:border-black">
                    <textarea
                      rows={2}
                      value={entry.tindakLanjut}
                      onChange={(e) => updateEntry(entry.id, "tindakLanjut", e.target.value)}
                      className="w-full bg-transparent text-white/90 text-sm px-2 py-2 rounded-md outline-none resize-y focus:bg-cyan-500/10 print:text-black"
                    />
                  </td>
                  <td className="p-2 border border-white/10 print:border-black print:h-16">
                    {/* Sengaja kosong untuk diisi manual atau ditandatangani saat dicetak */}
                    <div className="min-h-[48px]" />
                  </td>
                  <td className="p-2 text-center border border-white/10 print:hidden">
                    <button
                      onClick={() => removeEntry(entry.id)}
                      disabled={state.entries.length <= 1}
                      className="text-rose-300 hover:text-rose-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="text-center print:hidden">
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

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 12mm; }
          body { background: white !important; }
          input, textarea {
            color: black !important;
            background: transparent !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const IdentitasField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="flex items-baseline gap-2 print:text-black">
    <span className="text-white/70 shrink-0 print:text-black">{label}</span>
    <span className="text-white/70 print:text-black">:</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 bg-transparent border-b border-white/20 focus:border-cyan-300 outline-none text-white px-1 py-1 print:text-black print:border-black"
    />
  </div>
);

export default JurnalGuruPage;
