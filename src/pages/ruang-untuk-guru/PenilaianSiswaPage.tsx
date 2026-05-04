import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardCheck,
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

const STORAGE_KEY = "numatik:penilaian-siswa:v1";

type KolomNilai = { id: string; label: string; jenis: string; bobot: number };
type Siswa = { id: string; nama: string; nisn: string };
type NilaiData = { [siswaId: string]: { [kolomId: string]: string } };

type PenilaianState = {
  satuanPendidikan: string;
  mataPelajaran: string;
  kelas: string;
  semester: string;
  tahunPelajaran: string;
  guru: string;
  kktp: string;
  siswaList: Siswa[];
  kolomList: KolomNilai[];
  nilaiData: NilaiData;
};

const mkId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const mkSiswa = (): Siswa => ({ id: mkId(), nama: "", nisn: "" });
const mkKolom = (label: string, jenis: string, bobot: number): KolomNilai => ({
  id: mkId(), label, jenis, bobot,
});

const defaultKolom: KolomNilai[] = [
  mkKolom("Tugas 1", "Tugas", 10),
  mkKolom("Tugas 2", "Tugas", 10),
  mkKolom("UH 1", "Ulangan Harian", 20),
  mkKolom("PTS", "PTS", 30),
  mkKolom("PAS", "PAS", 30),
];

const defaultState: PenilaianState = {
  satuanPendidikan: "",
  mataPelajaran: "Matematika",
  kelas: "",
  semester: "1 (Ganjil)",
  tahunPelajaran: "2025 / 2026",
  guru: "",
  kktp: "66",
  siswaList: Array.from({ length: 5 }, mkSiswa),
  kolomList: defaultKolom,
  nilaiData: {},
};

const JENIS_OPTS = ["Tugas", "Ulangan Harian", "PTS", "PAS", "Praktik", "Proyek", "Portofolio", "Lainnya"];

const getPredikat = (avg: number, kktp: number): { label: string; color: string } => {
  if (avg >= 90) return { label: "A", color: "text-cyan-300" };
  if (avg >= kktp) return { label: "B", color: "text-emerald-300" };
  if (avg >= kktp - 15) return { label: "C", color: "text-amber-300" };
  return { label: "D", color: "text-rose-300" };
};

const getKetuntasan = (avg: number, kktp: number) =>
  avg >= kktp
    ? { label: "Tuntas", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" }
    : { label: "Belum Tuntas", color: "text-rose-400", bg: "bg-rose-500/15 border-rose-500/30" };

const PenilaianSiswaPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<PenilaianState>(defaultState);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PenilaianState;
        if (parsed?.siswaList) setState(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  const setField = <K extends keyof Omit<PenilaianState, "siswaList" | "kolomList" | "nilaiData">>(k: K, v: string) =>
    setState(p => ({ ...p, [k]: v }));

  const addSiswa = () => setState(p => ({ ...p, siswaList: [...p.siswaList, mkSiswa()] }));
  const removeSiswa = (id: string) => setState(p => ({ ...p, siswaList: p.siswaList.filter(s => s.id !== id) }));
  const updateSiswa = (id: string, field: keyof Omit<Siswa, "id">, val: string) =>
    setState(p => ({ ...p, siswaList: p.siswaList.map(s => s.id === id ? { ...s, [field]: val } : s) }));

  const addKolom = () => setState(p => ({
    ...p, kolomList: [...p.kolomList, mkKolom(`Nilai ${p.kolomList.length + 1}`, "Tugas", 10)],
  }));
  const removeKolom = (id: string) => setState(p => ({ ...p, kolomList: p.kolomList.filter(k => k.id !== id) }));
  const updateKolom = (id: string, field: keyof Omit<KolomNilai, "id">, val: string | number) =>
    setState(p => ({ ...p, kolomList: p.kolomList.map(k => k.id === id ? { ...k, [field]: val } : k) }));

  const setNilai = (siswaId: string, kolomId: string, val: string) => {
    const num = val === "" ? "" : Math.min(100, Math.max(0, parseInt(val) || 0)).toString();
    setState(p => ({
      ...p,
      nilaiData: {
        ...p.nilaiData,
        [siswaId]: { ...(p.nilaiData[siswaId] ?? {}), [kolomId]: num },
      },
    }));
  };

  const getNilai = (siswaId: string, kolomId: string): string =>
    state.nilaiData[siswaId]?.[kolomId] ?? "";

  const getWeightedAvg = (siswaId: string): number | null => {
    const totalBobot = state.kolomList.reduce((s, k) => s + k.bobot, 0);
    if (totalBobot === 0) return null;
    let sum = 0;
    let bobotHasNilai = 0;
    let allFilled = true;
    state.kolomList.forEach(k => {
      const v = getNilai(siswaId, k.id);
      if (v !== "") { sum += parseFloat(v) * k.bobot; bobotHasNilai += k.bobot; }
      else allFilled = false;
    });
    if (bobotHasNilai === 0) return null;
    return Math.round((sum / (allFilled ? totalBobot : bobotHasNilai)) * 10) / 10;
  };

  const getSimpleAvg = (siswaId: string): number | null => {
    const filled = state.kolomList.map(k => getNilai(siswaId, k.id)).filter(v => v !== "");
    if (filled.length === 0) return null;
    return Math.round((filled.reduce((s, v) => s + parseFloat(v), 0) / filled.length) * 10) / 10;
  };

  const getAvg = (siswaId: string) => {
    const totalBobot = state.kolomList.reduce((s, k) => s + k.bobot, 0);
    return totalBobot > 0 ? getWeightedAvg(siswaId) : getSimpleAvg(siswaId);
  };

  const kktp = parseInt(state.kktp) || 66;

  const handleSave = () => {
    playPopSound();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    setSaved(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(false), 3000);
  };

  const buildHTML = () => {
    const thStyle = "border:1px solid #aaa;padding:5px 4px;background:#1a7a6e;color:white;text-align:center;font-size:8pt;";
    const tdStyle = "border:1px solid #bbb;padding:4px 5px;text-align:center;font-size:8.5pt;";

    const kolomHeaders = state.kolomList.map(k =>
      `<th style="${thStyle}">${k.label}<br/><span style="font-size:7pt;">${k.jenis}</span>${
        k.bobot > 0 ? `<br/><span style="font-size:7pt;">Bobot:${k.bobot}%</span>` : ""
      }</th>`
    ).join("");

    const rows = state.siswaList.map((s, i) => {
      const nilaiCells = state.kolomList.map(k => {
        const v = getNilai(s.id, k.id);
        const num = parseFloat(v);
        const bg = v === "" ? "" : num >= kktp ? "background:#d1fae5;" : "background:#ffe4e6;";
        return `<td style="${tdStyle}${bg}">${v}</td>`;
      }).join("");
      const avg = getAvg(s.id);
      const pred = avg !== null ? getPredikat(avg, kktp) : null;
      const ket = avg !== null ? getKetuntasan(avg, kktp) : null;
      return `<tr>
        <td style="${tdStyle}">${i + 1}</td>
        <td style="${tdStyle}text-align:left;">${s.nama}</td>
        <td style="${tdStyle}">${s.nisn}</td>
        ${nilaiCells}
        <td style="${tdStyle}font-weight:bold;">${avg ?? "-"}</td>
        <td style="${tdStyle}font-weight:bold;">${pred?.label ?? "-"}</td>
        <td style="${tdStyle}font-weight:bold;">${ket?.label ?? "-"}</td>
      </tr>`;
    }).join("");

    return `<html><head><meta charset="UTF-8">
<style>body{font-family:Arial,sans-serif;font-size:10pt;margin:1.5cm;}</style>
</head><body>
<h2 style="text-align:center;margin:0 0 4px;font-size:14pt;">DAFTAR NILAI PESERTA DIDIK</h2>
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
    <td style="padding:2px 6px;"><b>KKTP</b> : ${state.kktp}</td>
  </tr>
  <tr>
    <td colspan="2" style="padding:2px 6px;"><b>Guru Mata Pelajaran</b> : ${state.guru}</td>
  </tr>
</table>
<p style="font-size:8.5pt;margin-bottom:6px;"><b>Keterangan Predikat:</b> A = ≥ 90 &nbsp;|&nbsp; B = ≥ KKTP &nbsp;|&nbsp; C = KKTP−15 s/d KKTP−1 &nbsp;|&nbsp; D = &lt; KKTP−15</p>
<table style="width:100%;border-collapse:collapse;">
  <thead>
    <tr>
      <th style="${thStyle}width:28px;">No</th>
      <th style="${thStyle}">Nama Peserta Didik</th>
      <th style="${thStyle}">NISN</th>
      ${kolomHeaders}
      <th style="${thStyle}">Rata-rata</th>
      <th style="${thStyle}">Predikat</th>
      <th style="${thStyle}">Ketuntasan</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<br/>
<table style="width:100%;border:none;margin-top:16px;">
  <tr>
    <td style="width:50%;text-align:center;border:none;">
      <p>Mengetahui,<br/>Kepala Sekolah</p><br/><br/><br/>
      <p>____________________________<br/>NIP. ________________________</p>
    </td>
    <td style="width:50%;text-align:center;border:none;">
      <p>_____________, __________ 20__<br/>Guru Mata Pelajaran</p><br/><br/><br/>
      <p>____________________________<br/>NIP. ________________________</p>
    </td>
  </tr>
</table>
</body></html>`;
  };

  const handlePrintPDF = () => {
    playPopSound();
    const win = window.open("", "_blank");
    if (win) { win.document.write(buildHTML()); win.document.close(); setTimeout(() => win.print(), 400); }
  };

  const handleDownloadWord = () => {
    playPopSound();
    const blob = new Blob(["\ufeff", buildHTML()], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `Penilaian_${state.kelas || "Siswa"}.doc`; a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-400/60 focus:bg-white/8 transition-colors";

  const totalBobot = state.kolomList.reduce((s, k) => s + k.bobot, 0);

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-full px-4 pt-20 pb-14">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-100 mb-4">
              <ClipboardCheck className="w-4 h-4" />
              Ruang Untuk Guru
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan">
              PENILAIAN SISWA
            </h1>
            <p className="mt-2 text-sm text-white/60 font-body max-w-xl mx-auto">
              Input nilai peserta didik per jenis penilaian. Rata-rata dan predikat dihitung otomatis berdasarkan bobot dan KKTP.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-5 animate-slide-up">
            <button onClick={handleSave}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-200 hover:scale-[1.03] ${saved ? "bg-emerald-600/80 border-emerald-400/40 text-white" : "bg-violet-600/80 hover:bg-violet-500 border-violet-400/40 text-white"}`}>
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
            <p className="text-violet-300 text-xs font-bold uppercase tracking-wider mb-4">📋 Identitas Kelas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              <div>
                <label className="text-white/50 text-[11px] block mb-1">KKTP (nilai minimal)</label>
                <input className={inputCls} type="number" min={0} max={100} placeholder="66" value={state.kktp} onChange={e => setField("kktp", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Predikat Legend */}
          <div className="flex gap-3 flex-wrap mb-4 animate-slide-up">
            {[
              { label: "A  ≥ 90", color: "text-cyan-300", bg: "bg-cyan-500/10 border-cyan-500/30" },
              { label: `B  ≥ ${kktp}`, color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/30" },
              { label: `C  ${kktp - 15}–${kktp - 1}`, color: "text-amber-300", bg: "bg-amber-500/10 border-amber-500/30" },
              { label: `D  < ${kktp - 15}`, color: "text-rose-300", bg: "bg-rose-500/10 border-rose-500/30" },
            ].map(c => (
              <span key={c.label} className={`text-xs font-bold px-3 py-1 rounded-full border ${c.bg} ${c.color}`}>{c.label}</span>
            ))}
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${totalBobot === 100 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"}`}>
              Total Bobot: {totalBobot}% {totalBobot === 100 ? "✓" : "(belum 100%)"}
            </span>
          </div>

          {/* Kolom Controls */}
          <div className="flex items-center gap-3 mb-3 animate-slide-up">
            <p className="text-white/60 text-xs font-semibold">Kolom Penilaian ({state.kolomList.length})</p>
            <button onClick={() => { playPopSound(); addKolom(); }}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/30 text-violet-300 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Tambah Kolom Nilai
            </button>
          </div>

          {/* Kolom Editor */}
          <div className="bg-card/50 border border-white/10 rounded-2xl p-4 mb-4 animate-slide-up">
            <p className="text-white/40 text-[11px] mb-3">Edit nama, jenis, dan bobot setiap kolom penilaian:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {state.kolomList.map((k) => (
                <div key={k.id} className="bg-white/3 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-400/60 transition-colors"
                      value={k.label}
                      onChange={e => updateKolom(k.id, "label", e.target.value)}
                      placeholder="Label (misal: UH 1)"
                    />
                    {state.kolomList.length > 1 && (
                      <button onClick={() => { playPopSound(); removeKolom(k.id); }}
                        className="text-rose-400/50 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:border-violet-400/60 transition-colors"
                    value={k.jenis}
                    onChange={e => updateKolom(k.id, "jenis", e.target.value)}
                  >
                    {JENIS_OPTS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-white/40 text-[10px] shrink-0">Bobot %</label>
                    <input
                      type="number" min={0} max={100}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-400/60 transition-colors"
                      value={k.bobot}
                      onChange={e => updateKolom(k.id, "bobot", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card/70 backdrop-blur border border-white/10 rounded-2xl overflow-hidden mb-5 animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse min-w-max">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-2 border-r border-white/10 text-white/40 font-normal w-8">No</th>
                    <th className="p-2 border-r border-white/10 text-white/40 font-normal text-left min-w-[160px]">Nama Siswa</th>
                    <th className="p-2 border-r border-white/10 text-white/40 font-normal min-w-[80px]">NISN</th>
                    {state.kolomList.map(k => (
                      <th key={k.id} className="p-2 border-r border-white/10 text-violet-300 font-bold min-w-[70px] text-center">
                        <div>{k.label}</div>
                        <div className="text-[9px] text-white/30 font-normal">{k.jenis}</div>
                        {k.bobot > 0 && <div className="text-[9px] text-violet-400/60 font-normal">{k.bobot}%</div>}
                      </th>
                    ))}
                    <th className="p-2 border-r border-white/10 text-amber-300 font-bold min-w-[65px]">Rata-rata</th>
                    <th className="p-2 border-r border-white/10 text-cyan-300 font-bold w-14">Predikat</th>
                    <th className="p-2 text-white/60 font-bold min-w-[90px]">Ketuntasan</th>
                  </tr>
                </thead>
                <tbody>
                  {state.siswaList.map((siswa, idx) => {
                    const avg = getAvg(siswa.id);
                    const pred = avg !== null ? getPredikat(avg, kktp) : null;
                    const ket = avg !== null ? getKetuntasan(avg, kktp) : null;
                    return (
                      <tr key={siswa.id} className={`border-b border-white/5 ${idx % 2 === 0 ? "" : "bg-white/2"} hover:bg-white/5 transition-colors`}>
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
                                className="text-rose-400/40 hover:text-rose-400 transition-colors p-1 shrink-0">
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
                        {state.kolomList.map(k => {
                          const v = getNilai(siswa.id, k.id);
                          const num = parseFloat(v);
                          const isBelow = v !== "" && num < kktp;
                          return (
                            <td key={k.id} className="p-1 border-r border-white/10">
                              <input
                                type="number" min={0} max={100}
                                className={`w-full rounded-lg px-2 py-1.5 text-sm text-center font-bold focus:outline-none transition-colors ${
                                  v === ""
                                    ? "bg-white/5 border border-white/10 text-white/40"
                                    : isBelow
                                    ? "bg-rose-500/15 border border-rose-500/30 text-rose-300"
                                    : "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                                }`}
                                value={v}
                                onChange={e => setNilai(siswa.id, k.id, e.target.value)}
                                placeholder="-"
                              />
                            </td>
                          );
                        })}
                        <td className="p-2 border-r border-white/10 text-center">
                          <span className="text-amber-300 font-bold text-sm">{avg ?? "-"}</span>
                        </td>
                        <td className="p-2 border-r border-white/10 text-center">
                          <span className={`font-bold text-lg ${pred?.color ?? "text-white/30"}`}>{pred?.label ?? "-"}</span>
                        </td>
                        <td className="p-2 text-center">
                          {ket ? (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${ket.bg} ${ket.color}`}>{ket.label}</span>
                          ) : <span className="text-white/20">-</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-white/10">
              <button onClick={() => { playPopSound(); addSiswa(); }}
                className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-400/30 text-violet-300 hover:text-violet-200 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Tambah Siswa
              </button>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-slide-up">
            {(() => {
              const avgs = state.siswaList.map(s => getAvg(s.id)).filter((v): v is number => v !== null);
              const tuntas = avgs.filter(v => v >= kktp).length;
              const belum = avgs.length - tuntas;
              const classAvg = avgs.length ? Math.round((avgs.reduce((a, b) => a + b, 0) / avgs.length) * 10) / 10 : null;
              return [
                { label: "Jumlah Siswa", val: state.siswaList.length, color: "text-white" },
                { label: "Tuntas", val: tuntas, color: "text-emerald-400" },
                { label: "Belum Tuntas", val: belum, color: "text-rose-400" },
                { label: "Rata-rata Kelas", val: classAvg ?? "-", color: "text-amber-300" },
              ];
            })().map(s => (
              <div key={s.label} className="bg-white/3 border border-white/10 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold font-display ${s.color}`}>{s.val}</p>
                <p className="text-white/50 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="bg-white/3 border border-white/10 rounded-xl p-4 mb-8 text-xs text-white/50 font-body space-y-1 animate-slide-up">
            <p className="text-white/70 font-bold text-[11px] uppercase mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Petunjuk Pengisian
            </p>
            <p>• Isikan nilai 0–100 pada setiap sel. Sel <span className="text-emerald-400">hijau</span> = tuntas, <span className="text-rose-400">merah</span> = belum tuntas (di bawah KKTP).</p>
            <p>• Jika total bobot = 100%, rata-rata dihitung secara berbobot (weighted average). Jika tidak, dihitung rata-rata biasa.</p>
            <p>• Edit nama kolom, jenis penilaian, dan bobot di bagian <b>Edit Kolom Penilaian</b> di atas tabel.</p>
            <p>• Tekan <span className="text-violet-300 font-bold">Simpan</span> agar data tidak hilang saat halaman di-refresh.</p>
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

export default PenilaianSiswaPage;
