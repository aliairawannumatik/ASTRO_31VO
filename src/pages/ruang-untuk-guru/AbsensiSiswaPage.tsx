import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Plus,
  Trash2,
  Save,
  Printer,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const STORAGE_KEY = "numatik:absensi-siswa:v1";

const STATUS_OPTS = ["H", "I", "S", "A", ""] as const;
type StatusVal = (typeof STATUS_OPTS)[number];

const STATUS_STYLE: Record<StatusVal, string> = {
  H: "bg-emerald-500/25 text-emerald-300 border-emerald-500/40",
  I: "bg-amber-500/25 text-amber-300 border-amber-500/40",
  S: "bg-blue-500/25 text-blue-300 border-blue-500/40",
  A: "bg-rose-500/25 text-rose-300 border-rose-500/40",
  "": "bg-white/5 text-white/30 border-white/10",
};

const NEXT_STATUS: Record<StatusVal, StatusVal> = {
  "": "H",
  H: "I",
  I: "S",
  S: "A",
  A: "",
};

type Siswa = { id: string; nama: string; nisn: string };
type Pertemuan = { id: string; label: string; tanggal: string };
type AbsensiData = { [siswaId: string]: { [pertemuanId: string]: StatusVal } };

type AbsensiState = {
  satuanPendidikan: string;
  mataPelajaran: string;
  kelas: string;
  semester: string;
  tahunPelajaran: string;
  guru: string;
  siswaList: Siswa[];
  pertemuanList: Pertemuan[];
  absensiData: AbsensiData;
};

const mkId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const mkSiswa = (n = ""): Siswa => ({ id: mkId(), nama: n, nisn: "" });
const mkPertemuan = (i: number): Pertemuan => ({
  id: mkId(),
  label: `Ke-${i}`,
  tanggal: "",
});

const defaultState: AbsensiState = {
  satuanPendidikan: "",
  mataPelajaran: "Matematika",
  kelas: "",
  semester: "1 (Ganjil)",
  tahunPelajaran: "2025 / 2026",
  guru: "",
  siswaList: Array.from({ length: 5 }, () => mkSiswa()),
  pertemuanList: Array.from({ length: 4 }, (_, i) => mkPertemuan(i + 1)),
  absensiData: {},
};

const AbsensiSiswaPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<AbsensiState>(defaultState);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AbsensiState;
        if (parsed?.siswaList) setState(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  const setField = <K extends keyof Omit<AbsensiState, "siswaList" | "pertemuanList" | "absensiData">>(k: K, v: string) =>
    setState(p => ({ ...p, [k]: v }));

  const addSiswa = () => setState(p => ({ ...p, siswaList: [...p.siswaList, mkSiswa()] }));
  const removeSiswa = (id: string) => setState(p => ({ ...p, siswaList: p.siswaList.filter(s => s.id !== id) }));
  const updateSiswa = (id: string, field: keyof Omit<Siswa, "id">, val: string) =>
    setState(p => ({ ...p, siswaList: p.siswaList.map(s => s.id === id ? { ...s, [field]: val } : s) }));

  const addPertemuan = () => setState(p => ({
    ...p,
    pertemuanList: [...p.pertemuanList, mkPertemuan(p.pertemuanList.length + 1)],
  }));
  const removePertemuan = (id: string) => setState(p => ({ ...p, pertemuanList: p.pertemuanList.filter(pt => pt.id !== id) }));
  const updatePertemuan = (id: string, field: keyof Omit<Pertemuan, "id">, val: string) =>
    setState(p => ({ ...p, pertemuanList: p.pertemuanList.map(pt => pt.id === id ? { ...pt, [field]: val } : pt) }));

  const toggleStatus = (siswaId: string, pertemuanId: string) => {
    setState(p => {
      const cur: StatusVal = p.absensiData[siswaId]?.[pertemuanId] ?? "";
      return {
        ...p,
        absensiData: {
          ...p.absensiData,
          [siswaId]: { ...(p.absensiData[siswaId] ?? {}), [pertemuanId]: NEXT_STATUS[cur] },
        },
      };
    });
  };

  const getStatus = (siswaId: string, pertemuanId: string): StatusVal =>
    state.absensiData[siswaId]?.[pertemuanId] ?? "";

  const getSummary = (siswaId: string) => {
    let H = 0, I = 0, S = 0, A = 0;
    state.pertemuanList.forEach(pt => {
      const v = getStatus(siswaId, pt.id);
      if (v === "H") H++;
      else if (v === "I") I++;
      else if (v === "S") S++;
      else if (v === "A") A++;
    });
    return { H, I, S, A };
  };

  const handleSave = () => {
    playPopSound();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    setSaved(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(false), 3000);
  };

  const buildPrintHTML = () => {
    const header = `
      <h2 style="text-align:center;margin:0 0 4px;font-size:14pt;">DAFTAR HADIR PESERTA DIDIK</h2>
      <h3 style="text-align:center;margin:0 0 16px;font-size:11pt;font-weight:normal;">Mata Pelajaran ${state.mataPelajaran}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:8px;">
        <tr>
          <td style="width:50%;padding:2px 6px;"><b>Satuan Pendidikan</b> : ${state.satuanPendidikan}</td>
          <td style="width:50%;padding:2px 6px;"><b>Semester</b> : ${state.semester}</td>
        </tr>
        <tr>
          <td style="padding:2px 6px;"><b>Mata Pelajaran</b> : ${state.mataPelajaran}</td>
          <td style="padding:2px 6px;"><b>Tahun Pelajaran</b> : ${state.tahunPelajaran}</td>
        </tr>
        <tr>
          <td style="padding:2px 6px;"><b>Kelas</b> : ${state.kelas}</td>
          <td style="padding:2px 6px;"><b>Guru</b> : ${state.guru}</td>
        </tr>
      </table>`;

    const thStyle = "border:1px solid #aaa;padding:5px 4px;background:#1a7a6e;color:white;text-align:center;font-size:8.5pt;";
    const tdStyle = "border:1px solid #bbb;padding:4px;text-align:center;font-size:8.5pt;";

    const ptHeaders = state.pertemuanList.map(pt =>
      `<th style="${thStyle}">${pt.label}<br/><span style="font-size:7pt;">${pt.tanggal}</span></th>`
    ).join("");

    const rows = state.siswaList.map((s, i) => {
      const cells = state.pertemuanList.map(pt => {
        const v = getStatus(s.id, pt.id);
        const bg = v === "H" ? "#d1fae5" : v === "I" ? "#fef3c7" : v === "S" ? "#dbeafe" : v === "A" ? "#ffe4e6" : "#fff";
        return `<td style="${tdStyle}background:${bg};">${v}</td>`;
      }).join("");
      const sum = getSummary(s.id);
      return `<tr>
        <td style="${tdStyle}">${i + 1}</td>
        <td style="${tdStyle}text-align:left;padding-left:6px;">${s.nama}</td>
        <td style="${tdStyle}">${s.nisn}</td>
        ${cells}
        <td style="${tdStyle}background:#d1fae5;">${sum.H}</td>
        <td style="${tdStyle}background:#fef3c7;">${sum.I}</td>
        <td style="${tdStyle}background:#dbeafe;">${sum.S}</td>
        <td style="${tdStyle}background:#ffe4e6;">${sum.A}</td>
      </tr>`;
    }).join("");

    const signBlock = `
      <br/>
      <table style="width:100%;border:none;margin-top:16px;">
        <tr>
          <td style="width:50%;text-align:center;border:none;">
            <p style="margin:0;">Mengetahui,<br/>Kepala Sekolah</p><br/><br/><br/>
            <p style="margin:0;">____________________________<br/>NIP. ________________________</p>
          </td>
          <td style="width:50%;text-align:center;border:none;">
            <p style="margin:0;">_____________, __________ 20__<br/>Guru Mata Pelajaran</p><br/><br/><br/>
            <p style="margin:0;">____________________________<br/>NIP. ________________________</p>
          </td>
        </tr>
      </table>`;

    return `<html><head><meta charset="UTF-8">
<style>body{font-family:Arial,sans-serif;font-size:10pt;margin:1.5cm;}</style>
</head><body>
${header}
<p style="font-size:8.5pt;margin-bottom:6px;"><b>Keterangan:</b> H = Hadir &nbsp;|&nbsp; I = Izin &nbsp;|&nbsp; S = Sakit &nbsp;|&nbsp; A = Alfa/Tanpa Keterangan</p>
<table style="width:100%;border-collapse:collapse;">
  <thead>
    <tr>
      <th style="${thStyle}width:28px;">No</th>
      <th style="${thStyle}">Nama Peserta Didik</th>
      <th style="${thStyle}">NISN</th>
      ${ptHeaders}
      <th style="${thStyle}">H</th>
      <th style="${thStyle}">I</th>
      <th style="${thStyle}">S</th>
      <th style="${thStyle}">A</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
${signBlock}
</body></html>`;
  };

  const handlePrintPDF = () => {
    playPopSound();
    const win = window.open("", "_blank");
    if (win) { win.document.write(buildPrintHTML()); win.document.close(); setTimeout(() => win.print(), 400); }
  };

  const handleDownloadWord = () => {
    playPopSound();
    const blob = new Blob(["\ufeff", buildPrintHTML()], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `Absensi_${state.kelas || "Siswa"}.doc`; a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-400/60 focus:bg-white/8 transition-colors";

  return (
    <div className="guru-editable relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-full px-4 pt-20 pb-14">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/40 bg-teal-500/10 px-4 py-2 text-xs font-semibold text-teal-100 mb-4">
              <Users className="w-4 h-4" />
              Ruang Untuk Guru
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan">
              ABSENSI SISWA
            </h1>
            <p className="mt-2 text-sm text-white/60 font-body max-w-xl mx-auto">
              Daftar hadir peserta didik per pertemuan. Klik sel status untuk mengubah: Hadir → Izin → Sakit → Alfa.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-5 animate-slide-up">
            <button onClick={handleSave}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-200 hover:scale-[1.03] ${saved ? "bg-emerald-600/80 border-emerald-400/40 text-white" : "bg-teal-600/80 hover:bg-teal-500 border-teal-400/40 text-white"}`}>
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Tersimpan!" : "Simpan"}
            </button>
            <button onClick={handleDownloadWord}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-500 border border-blue-400/40 text-white text-xs font-bold transition-all duration-200 hover:scale-[1.03]">
              <FileText className="w-4 h-4" /> Cetak Word
            </button>
            <button onClick={handlePrintPDF}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 border border-rose-400/40 text-white text-xs font-bold transition-all duration-200 hover:scale-[1.03]">
              <Printer className="w-4 h-4" /> Cetak PDF
            </button>
          </div>

          {/* Identitas */}
          <div className="bg-card/70 backdrop-blur border border-white/10 rounded-2xl p-5 mb-5 animate-slide-up">
            <p className="text-teal-300 text-xs font-bold uppercase tracking-wider mb-4">📋 Identitas Kelas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {([
                ["satuanPendidikan", "Satuan Pendidikan", "SMPN ..."],
                ["mataPelajaran", "Mata Pelajaran", "Matematika"],
                ["kelas", "Kelas", "VII A"],
                ["semester", "Semester", "1 (Ganjil)"],
                ["tahunPelajaran", "Tahun Pelajaran", "2025 / 2026"],
                ["guru", "Guru Mata Pelajaran", "Nama guru..."],
              ] as const).map(([key, label, ph]) => (
                <div key={key}>
                  <label className="text-white/50 text-[11px] block mb-1">{label}</label>
                  <input className={inputCls} placeholder={ph} value={(state as Record<string, string>)[key]} onChange={e => setField(key, e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-3 flex-wrap mb-4 animate-slide-up">
            {(["H", "I", "S", "A"] as const).map((s) => {
              const labels: Record<string, string> = { H: "Hadir", I: "Izin", S: "Sakit", A: "Alfa" };
              return (
                <span key={s} className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_STYLE[s]}`}>
                  {s} = {labels[s]}
                </span>
              );
            })}
            <span className="text-xs text-white/40 self-center">· Klik sel untuk mengubah status</span>
          </div>

          {/* Pertemuan Controls */}
          <div className="flex items-center gap-3 mb-3 animate-slide-up">
            <p className="text-white/60 text-xs font-semibold">Pertemuan ({state.pertemuanList.length})</p>
            <button onClick={() => { playPopSound(); addPertemuan(); }}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/30 text-teal-300 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Tambah Pertemuan
            </button>
          </div>

          {/* Table Wrapper */}
          <div className="bg-card/70 backdrop-blur border border-white/10 rounded-2xl overflow-hidden mb-5 animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse min-w-max">
                <thead>
                  {/* Pertemuan header label edit row */}
                  <tr className="bg-white/3 border-b border-white/10">
                    <th className="p-2 border-r border-white/10 text-white/40 font-normal text-left w-8">No</th>
                    <th className="p-2 border-r border-white/10 text-white/40 font-normal text-left min-w-[160px]">Nama Siswa</th>
                    <th className="p-2 border-r border-white/10 text-white/40 font-normal min-w-[80px]">NISN</th>
                    {state.pertemuanList.map((pt) => (
                      <th key={pt.id} className="p-1 border-r border-white/10 min-w-[76px]">
                        <div className="flex flex-col gap-1">
                          <input
                            className="w-full bg-white/5 border border-white/10 rounded px-1.5 py-1 text-center text-white/80 text-[11px] focus:outline-none focus:border-teal-400/60"
                            value={pt.label}
                            onChange={e => updatePertemuan(pt.id, "label", e.target.value)}
                            placeholder="Label"
                          />
                          <input
                            className="w-full bg-white/5 border border-white/10 rounded px-1.5 py-1 text-center text-white/50 text-[10px] focus:outline-none focus:border-teal-400/60"
                            value={pt.tanggal}
                            onChange={e => updatePertemuan(pt.id, "tanggal", e.target.value)}
                            placeholder="Tanggal"
                          />
                          {state.pertemuanList.length > 1 && (
                            <button onClick={() => { playPopSound(); removePertemuan(pt.id); }}
                              className="self-center text-rose-400/60 hover:text-rose-400 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="p-2 border-r border-white/10 text-emerald-400 font-bold w-8">H</th>
                    <th className="p-2 border-r border-white/10 text-amber-400 font-bold w-8">I</th>
                    <th className="p-2 border-r border-white/10 text-blue-400 font-bold w-8">S</th>
                    <th className="p-2 text-rose-400 font-bold w-8">A</th>
                  </tr>
                </thead>
                <tbody>
                  {state.siswaList.map((siswa, idx) => {
                    const sum = getSummary(siswa.id);
                    return (
                      <tr key={siswa.id} className={`border-b border-white/5 ${idx % 2 === 0 ? "bg-white/1" : "bg-white/3"} hover:bg-white/6 transition-colors`}>
                        <td className="p-2 border-r border-white/10 text-white/40 text-center">{idx + 1}</td>
                        <td className="p-1 border-r border-white/10">
                          <div className="flex items-center gap-1">
                            <input
                              className="flex-1 bg-transparent focus:bg-white/5 border border-transparent focus:border-white/20 rounded px-2 py-1 text-white/85 text-[12px] focus:outline-none transition-colors"
                              value={siswa.nama}
                              onChange={e => updateSiswa(siswa.id, "nama", e.target.value)}
                              placeholder={`Siswa ${idx + 1}`}
                            />
                            {state.siswaList.length > 1 && (
                              <button onClick={() => { playPopSound(); removeSiswa(siswa.id); }}
                                className="text-rose-400/40 hover:text-rose-400 transition-colors shrink-0 p-1">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-1 border-r border-white/10">
                          <input
                            className="w-full bg-transparent focus:bg-white/5 border border-transparent focus:border-white/20 rounded px-2 py-1 text-white/60 text-[11px] text-center focus:outline-none transition-colors"
                            value={siswa.nisn}
                            onChange={e => updateSiswa(siswa.id, "nisn", e.target.value)}
                            placeholder="NISN"
                          />
                        </td>
                        {state.pertemuanList.map((pt) => {
                          const v = getStatus(siswa.id, pt.id);
                          return (
                            <td key={pt.id} className="p-1 border-r border-white/10 text-center">
                              <button
                                onClick={() => toggleStatus(siswa.id, pt.id)}
                                className={`w-9 h-9 rounded-lg border font-bold text-sm transition-all duration-150 hover:scale-105 active:scale-95 ${STATUS_STYLE[v]}`}
                              >
                                {v || "·"}
                              </button>
                            </td>
                          );
                        })}
                        <td className="p-2 border-r border-white/10 text-center text-emerald-400 font-bold">{sum.H}</td>
                        <td className="p-2 border-r border-white/10 text-center text-amber-400 font-bold">{sum.I}</td>
                        <td className="p-2 border-r border-white/10 text-center text-blue-400 font-bold">{sum.S}</td>
                        <td className="p-2 text-center text-rose-400 font-bold">{sum.A}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add Siswa */}
            <div className="p-3 border-t border-white/10">
              <button onClick={() => { playPopSound(); addSiswa(); }}
                className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/30 text-teal-300 hover:text-teal-200 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Tambah Siswa
              </button>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-white/3 border border-white/10 rounded-xl p-4 mb-8 text-xs text-white/50 font-body space-y-1 animate-slide-up">
            <p className="text-white/70 font-bold text-[11px] uppercase mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Petunjuk Pengisian
            </p>
            <p>• Klik sel pada baris siswa untuk mengubah status secara berurutan: <span className="text-emerald-400 font-bold">H</span> → <span className="text-amber-400 font-bold">I</span> → <span className="text-blue-400 font-bold">S</span> → <span className="text-rose-400 font-bold">A</span> → kosong.</p>
            <p>• Edit label pertemuan (misal: "P-1", "UH-1") dan tanggal di baris header tabel.</p>
            <p>• Kolom H/I/S/A di kanan menampilkan total otomatis per siswa.</p>
            <p>• Tekan <span className="text-teal-300 font-bold">Simpan</span> agar data tidak hilang saat halaman di-refresh.</p>
          </div>

          <div className="text-center">
            <button onClick={() => { playPopSound(); navigate("/ruang-untuk-guru"); }}
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Ruang Untuk Guru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsensiSiswaPage;
