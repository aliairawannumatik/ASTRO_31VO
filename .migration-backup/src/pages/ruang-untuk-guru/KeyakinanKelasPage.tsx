import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Printer, FileDown, Save, Plus, Trash2 } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

type KeyakinanItem = {
  id: string;
  title: string;
  desc: string;
  color: string;
  border: string;
  text: string;
};

const COLOR_PRESETS = [
  { color: "from-pink-500/20 to-rose-500/10", border: "border-pink-300/40", text: "text-pink-100" },
  { color: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-300/40", text: "text-emerald-100" },
  { color: "from-cyan-500/20 to-blue-500/10", border: "border-cyan-300/40", text: "text-cyan-100" },
  { color: "from-amber-500/20 to-yellow-500/10", border: "border-amber-300/40", text: "text-amber-100" },
  { color: "from-violet-500/20 to-purple-500/10", border: "border-violet-300/40", text: "text-violet-100" },
  { color: "from-fuchsia-500/20 to-pink-500/10", border: "border-fuchsia-300/40", text: "text-fuchsia-100" },
];

const STORAGE_KEY = "numatik:keyakinan-kelas:v1";

const defaultKeyakinan: KeyakinanItem[] = [
  { id: "1", title: "Saling menghormati dan menghargai", desc: "Menghargai pendapat, perasaan, dan perbedaan setiap warga kelas dalam setiap interaksi.", ...COLOR_PRESETS[0] },
  { id: "2", title: "Menjaga kebersihan dan kerapihan", desc: "Membuang sampah pada tempatnya, merapikan meja dan kursi, serta menjaga lingkungan belajar tetap nyaman.", ...COLOR_PRESETS[1] },
  { id: "3", title: "Menggunakan gawai/HP dengan bijak", desc: "Gawai hanya digunakan untuk keperluan belajar dan saat diizinkan oleh guru.", ...COLOR_PRESETS[2] },
  { id: "4", title: "Menyelesaikan pekerjaan yang diberikan guru", desc: "Mengerjakan tugas, latihan, dan proyek dengan tanggung jawab serta tepat waktu.", ...COLOR_PRESETS[3] },
];

const mkId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const KeyakinanKelasPage = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [items, setItems] = useState<KeyakinanItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultKeyakinan;
    } catch { return defaultKeyakinan; }
  });

  const updateItem = (id: string, field: "title" | "desc", value: string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  };

  const addItem = () => {
    playPopSound();
    const preset = COLOR_PRESETS[items.length % COLOR_PRESETS.length];
    setItems(prev => [...prev, { id: mkId(), title: "Keyakinan baru", desc: "Tulis deskripsi keyakinan di sini.", ...preset }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    playPopSound();
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const handleSave = () => {
    playPopSound();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const buildWordHtml = () => {
    const rows = items.map((k, i) =>
      `<tr><td style="border:1px solid #ccc;padding:5pt 8pt;text-align:center;">${i + 1}</td><td style="border:1px solid #ccc;padding:5pt 8pt;font-weight:bold;">${k.title}</td><td style="border:1px solid #ccc;padding:5pt 8pt;">${k.desc}</td></tr>`
    ).join("");
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial;font-size:11pt;margin:2cm}h1{text-align:center;font-size:14pt;font-weight:bold;margin:0 0 6pt 0}table{width:100%;border-collapse:collapse;margin-top:12pt}th{background:#eaf4fb;font-weight:bold;border:1px solid #ccc;padding:5pt 8pt}</style></head><body><h1>KEYAKINAN KELAS</h1><p style="text-align:center;font-size:10pt;margin:2pt 0 14pt 0">Mata Pelajaran Matematika</p><table><thead><tr><th style="width:5%">No</th><th style="width:35%">Keyakinan</th><th>Deskripsi</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">

        {/* Header */}
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
                const html = buildWordHtml();
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

        {/* Keyakinan Cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {items.map((k, i) => (
            <div
              key={k.id}
              className={`relative rounded-2xl border ${k.border} bg-gradient-to-br ${k.color} p-5 backdrop-blur animate-slide-up`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Hapus button */}
              <button
                onClick={() => removeItem(k.id)}
                disabled={items.length <= 1}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-4 pr-8">
                {/* Nomor */}
                <div className={`shrink-0 w-10 h-10 rounded-xl border ${k.border} bg-black/20 flex items-center justify-center font-display font-bold text-lg ${k.text}`}>
                  {i + 1}
                </div>
                <div className="flex-1 space-y-2">
                  {/* Judul editable */}
                  <input
                    value={k.title}
                    onChange={e => updateItem(k.id, "title", e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none font-display text-base md:text-lg font-bold text-white leading-snug pb-0.5 transition-colors placeholder-white/40"
                    placeholder="Judul keyakinan"
                  />
                  {/* Deskripsi editable */}
                  <textarea
                    value={k.desc}
                    onChange={e => updateItem(k.id, "desc", e.target.value)}
                    rows={2}
                    className="w-full bg-black/10 border border-white/15 rounded-lg px-2 py-1.5 text-xs md:text-sm text-white/80 font-body leading-relaxed resize-none focus:outline-none focus:border-white/35 transition-colors placeholder-white/30"
                    placeholder="Deskripsi keyakinan"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tambah Box */}
        <div className="flex justify-center mb-8">
          <button
            onClick={addItem}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-teal-400/40 bg-teal-500/15 hover:bg-teal-500/25 text-teal-100 text-sm font-semibold font-body transition-colors hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Tambah Box Keyakinan
          </button>
        </div>

        {/* Kutipan */}
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
