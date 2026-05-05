import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, FileText, FileDown, Save, Plus, Trash2 } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

type MingguRow = { bulan: string; jumlah: number };
type TidakEfektifRow = { bulan: string; kegiatan: string; jumlah: number };
type DistribusiRow = { no: string; materi: string; jp: number };

type SemData = {
  mingguPerBulan: MingguRow[];
  tidakEfektif: TidakEfektifRow[];
  jpPerMinggu: number;
  distribusi: DistribusiRow[];
  jamCadangan: number;
};

type KelasKey = "kelas7" | "kelas8" | "kelas9";
type SemKey = "ganjil" | "genap";
type AllData = Record<KelasKey, Record<SemKey, SemData>>;

type IdentitasData = {
  mataPelajaran: string;
  satuanPendidikan: string;
  tahunPelajaran: string;
  guru: string;
  guruNIP: string;
  kepalaJabatan: string;
  kepalaName: string;
  kepalaSchoolNIP: string;
  kota: string;
  tanggal: string;
};

const defaultIdentitas: IdentitasData = {
  mataPelajaran: "Matematika",
  satuanPendidikan: "SMP / MTs",
  tahunPelajaran: "2025/2026",
  guru: "",
  guruNIP: "",
  kepalaJabatan: "Kepala Sekolah",
  kepalaName: "",
  kepalaSchoolNIP: "",
  kota: "",
  tanggal: "",
};

const makeDefault = (): AllData => ({
  kelas7: {
    ganjil: {
      jpPerMinggu: 5, jamCadangan: 0,
      mingguPerBulan: [
        { bulan: "Juli", jumlah: 5 }, { bulan: "Agustus", jumlah: 4 },
        { bulan: "September", jumlah: 4 }, { bulan: "Oktober", jumlah: 5 },
        { bulan: "November", jumlah: 4 }, { bulan: "Desember", jumlah: 4 },
      ],
      tidakEfektif: [
        { bulan: "Juli", kegiatan: "Hari pertama masuk sekolah / MPLS / Asesmen diagnostik kelas 7", jumlah: 3 },
        { bulan: "Agustus", kegiatan: "Peringatan HUT RI / CPD / ANBK kelas 8", jumlah: 1 },
        { bulan: "Oktober", kegiatan: "Mini Projek lintas mapel kelas 7", jumlah: 1 },
        { bulan: "Desember", kegiatan: "Asesmen sumatif akhir semester 1 / Pembagian raport / Libur semester 1", jumlah: 4 },
      ],
      distribusi: [
        { no: "1", materi: "Bilangan Bulat", jp: 20 },
        { no: "2", materi: "Bilangan Pecahan (Rasional)", jp: 20 },
        { no: "3", materi: "Aljabar", jp: 25 },
        { no: "4", materi: "Persamaan dan Pertidaksamaan Linear Satu Variabel", jp: 20 },
      ],
    },
    genap: {
      jpPerMinggu: 5, jamCadangan: 0,
      mingguPerBulan: [
        { bulan: "Januari", jumlah: 4 }, { bulan: "Februari", jumlah: 4 },
        { bulan: "Maret", jumlah: 4 }, { bulan: "April", jumlah: 5 },
        { bulan: "Mei", jumlah: 4 }, { bulan: "Juni", jumlah: 5 },
      ],
      tidakEfektif: [
        { bulan: "Januari", kegiatan: "Libur Semester 1", jumlah: 2 },
        { bulan: "Februari", kegiatan: "Libur awal ramadhan", jumlah: 1 },
        { bulan: "Maret", kegiatan: "Pesantren Ramadhan", jumlah: 1 },
        { bulan: "Maret", kegiatan: "Libur Idul Fitri", jumlah: 3 },
        { bulan: "Juni", kegiatan: "Asesmen sumatif akhir tahun / PORAK / Penyerahan Raport", jumlah: 5 },
      ],
      distribusi: [
        { no: "1", materi: "Perbandingan", jp: 15 },
        { no: "2", materi: "Aritmetika Sosial", jp: 20 },
        { no: "3", materi: "Garis dan Sudut", jp: 15 },
        { no: "4", materi: "Segitiga dan Segiempat", jp: 20 },
      ],
    },
  },
  kelas8: {
    ganjil: {
      jpPerMinggu: 5, jamCadangan: 0,
      mingguPerBulan: [
        { bulan: "Juli", jumlah: 5 }, { bulan: "Agustus", jumlah: 4 },
        { bulan: "September", jumlah: 4 }, { bulan: "Oktober", jumlah: 5 },
        { bulan: "November", jumlah: 4 }, { bulan: "Desember", jumlah: 4 },
      ],
      tidakEfektif: [
        { bulan: "Juli", kegiatan: "Hari pertama masuk sekolah / MPLS", jumlah: 2 },
        { bulan: "Agustus", kegiatan: "Peringatan HUT RI / ANBK kelas 8", jumlah: 1 },
        { bulan: "Desember", kegiatan: "Asesmen sumatif akhir semester 1 / Pembagian raport / Libur semester 1", jumlah: 4 },
      ],
      distribusi: [
        { no: "1", materi: "Pola Bilangan", jp: 15 },
        { no: "2", materi: "Koordinat Kartesius", jp: 15 },
        { no: "3", materi: "Relasi dan Fungsi", jp: 15 },
        { no: "4", materi: "Persamaan Garis Lurus", jp: 20 },
        { no: "5", materi: "Cadangan / Remedial / Pengayaan", jp: 15 },
      ],
    },
    genap: {
      jpPerMinggu: 5, jamCadangan: 0,
      mingguPerBulan: [
        { bulan: "Januari", jumlah: 4 }, { bulan: "Februari", jumlah: 4 },
        { bulan: "Maret", jumlah: 4 }, { bulan: "April", jumlah: 5 },
        { bulan: "Mei", jumlah: 4 }, { bulan: "Juni", jumlah: 5 },
      ],
      tidakEfektif: [
        { bulan: "Januari", kegiatan: "Libur Semester 1", jumlah: 2 },
        { bulan: "Februari", kegiatan: "Libur awal ramadhan", jumlah: 1 },
        { bulan: "Maret", kegiatan: "Pesantren Ramadhan", jumlah: 1 },
        { bulan: "Maret", kegiatan: "Libur Idul Fitri", jumlah: 3 },
        { bulan: "Juni", kegiatan: "Asesmen sumatif akhir tahun / PORAK / Penyerahan Raport", jumlah: 5 },
      ],
      distribusi: [
        { no: "1", materi: "SPLDV", jp: 20 },
        { no: "2", materi: "Teorema Pythagoras", jp: 15 },
        { no: "3", materi: "Lingkaran", jp: 20 },
        { no: "4", materi: "Bangun Ruang Sisi Datar", jp: 15 },
        { no: "5", materi: "Cadangan / Remedial / Pengayaan", jp: 15 },
      ],
    },
  },
  kelas9: {
    ganjil: {
      jpPerMinggu: 5, jamCadangan: 0,
      mingguPerBulan: [
        { bulan: "Juli", jumlah: 5 }, { bulan: "Agustus", jumlah: 4 },
        { bulan: "September", jumlah: 4 }, { bulan: "Oktober", jumlah: 5 },
        { bulan: "November", jumlah: 4 }, { bulan: "Desember", jumlah: 4 },
      ],
      tidakEfektif: [
        { bulan: "Juli", kegiatan: "Hari pertama masuk sekolah / MPLS", jumlah: 2 },
        { bulan: "Agustus", kegiatan: "Peringatan HUT RI", jumlah: 1 },
        { bulan: "Desember", kegiatan: "Asesmen sumatif akhir semester 1 / Pembagian raport / Libur semester 1", jumlah: 4 },
      ],
      distribusi: [
        { no: "1", materi: "Bilangan Berpangkat & Bentuk Akar", jp: 20 },
        { no: "2", materi: "Persamaan Kuadrat", jp: 20 },
        { no: "3", materi: "Fungsi Kuadrat", jp: 15 },
        { no: "4", materi: "Transformasi Geometri", jp: 15 },
        { no: "5", materi: "Cadangan / Remedial / Pengayaan", jp: 10 },
      ],
    },
    genap: {
      jpPerMinggu: 5, jamCadangan: 0,
      mingguPerBulan: [
        { bulan: "Januari", jumlah: 4 }, { bulan: "Februari", jumlah: 4 },
        { bulan: "Maret", jumlah: 4 }, { bulan: "April", jumlah: 5 },
        { bulan: "Mei", jumlah: 4 }, { bulan: "Juni", jumlah: 5 },
      ],
      tidakEfektif: [
        { bulan: "Januari", kegiatan: "Libur Semester 1", jumlah: 2 },
        { bulan: "Februari", kegiatan: "Libur awal ramadhan", jumlah: 1 },
        { bulan: "Maret", kegiatan: "Pesantren Ramadhan", jumlah: 1 },
        { bulan: "Maret", kegiatan: "Libur Idul Fitri", jumlah: 3 },
        { bulan: "April", kegiatan: "Ujian Sekolah Kelas 9", jumlah: 2 },
        { bulan: "Juni", kegiatan: "PAT / Penyerahan Raport / Libur akhir tahun", jumlah: 5 },
      ],
      distribusi: [
        { no: "1", materi: "Kesebangunan & Kekongruenan", jp: 15 },
        { no: "2", materi: "Bangun Ruang Sisi Lengkung", jp: 20 },
        { no: "3", materi: "Statistika", jp: 15 },
        { no: "4", materi: "Peluang", jp: 10 },
      ],
    },
  },
});

const printStyle = `
  @page { size: 21.5cm 33cm; margin: 3cm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; margin: 0; padding: 0; }
  h1 { text-align: center; font-size: 15pt; font-weight: bold; margin: 0 0 12pt 0; text-transform: uppercase; letter-spacing: 1px; }
  h2 { text-align: center; font-size: 12pt; font-weight: bold; margin: 12pt 0 4pt 0; text-transform: uppercase; }
  h3 { text-align: center; font-size: 11pt; font-weight: bold; margin: 4pt 0 8pt 0; text-transform: uppercase; }
  .underline { border-bottom: 2px solid #000; margin-bottom: 12pt; }
  table.identitas { width: 100%; border: none; border-collapse: collapse; margin-bottom: 14pt; }
  table.identitas td { border: none; padding: 2pt 4pt; font-size: 11pt; }
  table.identitas td.lbl { width: 42%; font-weight: normal; }
  table.identitas td.sep { width: 8pt; }
  .dual { width: 100%; border-collapse: collapse; border: none; margin-bottom: 8pt; }
  .dual > tbody > tr > td { border: none; vertical-align: top; padding: 0 6pt 0 0; width: 50%; }
  .dual > tbody > tr > td:last-child { padding: 0 0 0 6pt; }
  .inner-title { font-weight: bold; font-size: 10.5pt; margin-bottom: 4pt; }
  table.inner { width: 100%; border-collapse: collapse; font-size: 10pt; }
  table.inner th { background: #1a5f7a; color: #fff; border: 1px solid #aaa; padding: 4pt 5pt; text-align: center; font-size: 10pt; }
  table.inner td { border: 1px solid #aaa; padding: 3pt 5pt; vertical-align: top; }
  table.inner td.center { text-align: center; }
  table.inner tfoot td { font-weight: bold; background: #d4edda; }
  .summary { margin: 8pt 0; font-size: 11pt; }
  .summary p { margin: 3pt 0; }
  table.distribusi { width: 100%; border-collapse: collapse; font-size: 10.5pt; margin: 8pt 0; }
  table.distribusi th { background: #1a5f7a; color: #fff; border: 1px solid #aaa; padding: 5pt 6pt; text-align: center; }
  table.distribusi td { border: 1px solid #aaa; padding: 4pt 6pt; }
  table.distribusi td.center { text-align: center; }
  table.distribusi tfoot td { font-weight: bold; background: #d4edda; }
  .calc { font-size: 11pt; margin: 8pt 0; }
  .calc p { margin: 2pt 0; }
  table.ttd { width: 100%; border: none; border-collapse: collapse; margin-top: 20pt; }
  table.ttd td { border: none; text-align: center; width: 50%; padding: 4pt; font-size: 11pt; vertical-align: top; }
  .footer { text-align: center; margin-top: 12pt; font-size: 9pt; color: #666; border-top: 1px solid #ccc; padding-top: 6pt; }
`;

const buildPrintBody = (
  sd: SemData,
  identitas: IdentitasData,
  kelasNum: string,
  semLabel: string,
) => {
  const kelasRom = kelasNum === "7" ? "VII" : kelasNum === "8" ? "VIII" : "IX";
  const totalMinggu = sd.mingguPerBulan.reduce((s, r) => s + r.jumlah, 0);
  const totalTidakEfektif = sd.tidakEfektif.reduce((s, r) => s + r.jumlah, 0);
  const mingguEfektif = Math.max(0, totalMinggu - totalTidakEfektif);
  const totalJP = mingguEfektif * sd.jpPerMinggu;
  const totalDistribusi = sd.distribusi.reduce((s, r) => s + r.jp, 0);
  const jpEfektif = totalJP - sd.jamCadangan;

  const mingguRows = sd.mingguPerBulan.map((r, i) =>
    `<tr><td class="center">${i + 1}</td><td>${r.bulan}</td><td class="center">${r.jumlah}</td></tr>`
  ).join("");

  const tidakEfektifRows = sd.tidakEfektif.filter(r => r.jumlah > 0).map(r =>
    `<tr><td>${r.bulan}</td><td>${r.kegiatan}</td><td class="center">${r.jumlah}</td></tr>`
  ).join("");

  const distribusiRows = sd.distribusi.map(r =>
    `<tr><td class="center">${r.no}</td><td>${r.materi}</td><td class="center">${r.jp} JP</td></tr>`
  ).join("");

  return `
    <div class="underline">
      <h1>Analisis Alokasi Waktu</h1>
    </div>
    <table class="identitas">
      <tr><td class="lbl">Mata Pelajaran</td><td class="sep">:</td><td>${identitas.mataPelajaran || "Matematika"}</td></tr>
      <tr><td class="lbl">Satuan Pendidikan</td><td class="sep">:</td><td>${identitas.satuanPendidikan || "SMP / MTs"}</td></tr>
      <tr><td class="lbl">Kelas/Semester</td><td class="sep">:</td><td>${kelasRom} / ${semLabel}</td></tr>
      <tr><td class="lbl">Tahun Pelajaran</td><td class="sep">:</td><td>${identitas.tahunPelajaran || "2025/2026"}</td></tr>
    </table>

    <h2>Perhitungan Minggu/Jam Efektif</h2>
    <h3>Perhitungan Jam Efektif</h3>

    <table class="dual"><tbody><tr>
      <td>
        <p class="inner-title">I.&nbsp; Jumlah Minggu :</p>
        <table class="inner">
          <thead><tr><th style="width:28pt;">No</th><th>Bulan</th><th style="width:60pt;">Jml. Minggu</th></tr></thead>
          <tbody>${mingguRows}</tbody>
          <tfoot><tr><td colspan="2" class="center">Jumlah</td><td class="center">${totalMinggu}</td></tr></tfoot>
        </table>
      </td>
      <td>
        <p class="inner-title">II.&nbsp; Jumlah Minggu Tidak Efektif :</p>
        <table class="inner">
          <thead><tr><th style="width:55pt;">Bulan</th><th>Kegiatan</th><th style="width:60pt;">Jml. Minggu</th></tr></thead>
          <tbody>${tidakEfektifRows || '<tr><td colspan="3" class="center">–</td></tr>'}</tbody>
          <tfoot><tr><td colspan="2" class="center">Jumlah</td><td class="center">${totalTidakEfektif}</td></tr></tfoot>
        </table>
      </td>
    </tr></tbody></table>

    <div class="summary">
      <p><strong>III.&nbsp; Banyaknya Minggu Efektif</strong> &nbsp;: ${totalMinggu} &ndash; ${totalTidakEfektif} = <strong>${mingguEfektif} Minggu</strong></p>
      <p><strong>IV.&nbsp; Banyaknya Jam Pelajaran</strong> &nbsp;: ${mingguEfektif} Minggu &times; ${sd.jpPerMinggu} Jam Pelajaran = <strong>${totalJP} Jam Pelajaran</strong></p>
    </div>

    <h2>Distribusi Alokasi Waktu</h2>
    <table class="distribusi">
      <thead><tr><th style="width:30pt;">No</th><th>Materi Pokok</th><th style="width:90pt;">Alokasi Waktu</th></tr></thead>
      <tbody>${distribusiRows}</tbody>
      <tfoot><tr><td colspan="2" style="text-align:right;padding-right:10pt;">Jumlah Jam</td><td class="center">${totalDistribusi} JP</td></tr></tfoot>
    </table>

    <div class="calc">
      <p>Banyaknya Jam Pelajaran &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : ${mingguEfektif} Minggu &times; ${sd.jpPerMinggu} Jam Pelajaran = ${totalJP} Jam Pelajaran</p>
      <p>Jumlah Jam Cadangan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : ${sd.jamCadangan} Jam Pelajaran</p>
      <p>Jumlah Jam Pelajaran Efektif &nbsp;: ${totalJP} Jam Pelajaran &ndash; ${sd.jamCadangan} Jam Pelajaran</p>
      <p style="padding-left:200pt;">: <strong>${jpEfektif} Jam Pelajaran</strong></p>
    </div>

    <table class="ttd">
      <tr>
        <td>
          Mengetahui,<br/>
          ${identitas.kepalaJabatan || "Kepala Sekolah"}<br/><br/><br/><br/>
          <strong>${identitas.kepalaName || "____________________________"}</strong><br/>
          NIP. ${identitas.kepalaSchoolNIP || "________________________"}
        </td>
        <td>
          ${identitas.kota ? identitas.kota + ", " : "_____________, "}${identitas.tanggal || "__________"}<br/>
          Guru Mata Pelajaran ${identitas.mataPelajaran || "Matematika"}<br/><br/><br/><br/>
          <strong>${identitas.guru || "____________________________"}</strong><br/>
          NIP. ${identitas.guruNIP || "________________________"}
        </td>
      </tr>
    </table>

    <div class="footer">
      <p>Dokumen ini dicetak dari Aplikasi NUMATIK — Numerasi Aktif dengan Teknologi Informasi dan Komunikasi</p>
    </div>
  `;
};

const DATA_KEY = "numatik_aaw_data";
const IDENTITAS_KEY = "numatik_aaw_identitas";

const AnalisisAlokasiWaktuPage = () => {
  const navigate = useNavigate();
  const [kelas, setKelas] = useState<KelasKey>("kelas7");
  const [sem, setSem] = useState<SemKey>("ganjil");
  const [savedOk, setSavedOk] = useState(false);

  const [allData, setAllData] = useState<AllData>(() => {
    try { const s = localStorage.getItem(DATA_KEY); return s ? JSON.parse(s) : makeDefault(); }
    catch { return makeDefault(); }
  });

  const [identitas, setIdentitas] = useState<IdentitasData>(() => {
    try { const s = localStorage.getItem(IDENTITAS_KEY); return s ? JSON.parse(s) : defaultIdentitas; }
    catch { return defaultIdentitas; }
  });

  const sd = allData[kelas][sem];
  const kelasNum = kelas.replace("kelas", "");
  const kelasRom = kelasNum === "7" ? "VII" : kelasNum === "8" ? "VIII" : "IX";
  const semLabel = sem === "ganjil" ? "Ganjil" : "Genap";

  const totalMinggu = sd.mingguPerBulan.reduce((s, r) => s + r.jumlah, 0);
  const totalTidakEfektif = sd.tidakEfektif.reduce((s, r) => s + r.jumlah, 0);
  const mingguEfektif = Math.max(0, totalMinggu - totalTidakEfektif);
  const totalJP = mingguEfektif * sd.jpPerMinggu;
  const totalDistribusi = sd.distribusi.reduce((s, r) => s + r.jp, 0);
  const jpEfektif = totalJP - sd.jamCadangan;

  const updateSD = (patch: Partial<SemData>) => {
    setAllData(prev => ({
      ...prev,
      [kelas]: { ...prev[kelas], [sem]: { ...prev[kelas][sem], ...patch } },
    }));
    setSavedOk(false);
  };

  const updateMinggu = (idx: number, field: keyof MingguRow, val: string | number) => {
    const rows = sd.mingguPerBulan.map((r, i) => i === idx ? { ...r, [field]: val } : r);
    updateSD({ mingguPerBulan: rows });
  };

  const updateTidak = (idx: number, field: keyof TidakEfektifRow, val: string | number) => {
    const rows = sd.tidakEfektif.map((r, i) => i === idx ? { ...r, [field]: val } : r);
    updateSD({ tidakEfektif: rows });
  };

  const addTidak = () => updateSD({ tidakEfektif: [...sd.tidakEfektif, { bulan: "", kegiatan: "", jumlah: 0 }] });
  const deleteTidak = (idx: number) => updateSD({ tidakEfektif: sd.tidakEfektif.filter((_, i) => i !== idx) });

  const updateDistribusi = (idx: number, field: keyof DistribusiRow, val: string | number) => {
    const rows = sd.distribusi.map((r, i) => i === idx ? { ...r, [field]: val } : r);
    updateSD({ distribusi: rows });
  };

  const addDistribusi = () => {
    const nextNo = String(sd.distribusi.filter(r => !isNaN(Number(r.no))).length + 1);
    updateSD({ distribusi: [...sd.distribusi, { no: nextNo, materi: "", jp: 0 }] });
  };
  const deleteDistribusi = (idx: number) => updateSD({ distribusi: sd.distribusi.filter((_, i) => i !== idx) });

  const updateIdentitas = (field: keyof IdentitasData, val: string) => {
    setIdentitas(prev => ({ ...prev, [field]: val }));
    setSavedOk(false);
  };

  const handleSave = () => {
    playPopSound();
    localStorage.setItem(DATA_KEY, JSON.stringify(allData));
    localStorage.setItem(IDENTITAS_KEY, JSON.stringify(identitas));
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 2500);
  };

  const buildDoc = () => {
    const body = buildPrintBody(sd, identitas, kelasNum, semLabel);
    return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Analisis Alokasi Waktu (NUMATIK)</title><style>${printStyle}</style></head><body>${body}</body></html>`;
  };

  const handleWord = () => {
    playPopSound();
    const blob = new Blob([buildDoc()], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Analisis_Alokasi_Waktu_Kelas${kelasNum}_${semLabel}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePDF = () => {
    playPopSound();
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(buildDoc());
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); win.close(); }, 500);
    }
  };

  const inp = "w-full bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none text-white/85 text-xs py-0.5 transition-colors resize-none";
  const inpId = "flex-1 bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none text-white/85 text-xs py-0.5 transition-colors";

  return (
    <div className="guru-editable relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-14">

        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <Clock className="w-4 h-4" />
            Perangkat Pembelajaran
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            ANALISIS ALOKASI WAKTU
          </h1>
          <p className="mt-3 text-sm text-white/60 font-body max-w-2xl mx-auto">
            Perhitungan minggu efektif dan distribusi alokasi waktu pembelajaran Matematika SMP berdasarkan kalender pendidikan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap animate-slide-up">
          <button onClick={handleSave}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg ${savedOk ? "bg-emerald-600 border-emerald-400/40" : "bg-emerald-700/80 hover:bg-emerald-600 border-emerald-400/40"}`}>
            <Save className="w-4 h-4" />
            {savedOk ? "Tersimpan!" : "Simpan"}
          </button>
          <button onClick={handleWord}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 border border-blue-400/40 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            <FileText className="w-4 h-4" />
            Cetak Word
          </button>
          <button onClick={handlePDF}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-500 border border-red-400/40 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            <FileDown className="w-4 h-4" />
            Cetak PDF
          </button>
        </div>

        {/* Kelas + Semester Selectors */}
        <div className="flex flex-wrap justify-center gap-2 mb-3 animate-slide-up">
          {(["kelas7", "kelas8", "kelas9"] as KelasKey[]).map(k => (
            <button key={k} onClick={() => { playPopSound(); setKelas(k); }}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${kelas === k ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"}`}>
              Kelas {k.replace("kelas", "")}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-2 mb-7 animate-slide-up">
          {(["ganjil", "genap"] as SemKey[]).map(s => (
            <button key={s} onClick={() => { playPopSound(); setSem(s); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${sem === s ? "bg-cyan-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"}`}>
              Semester {s === "ganjil" ? "Ganjil" : "Genap"}
            </button>
          ))}
        </div>

        {/* Edit hint */}
        <p className="text-xs text-cyan-300/60 mb-4 animate-slide-up text-center">
          ✏️ Semua bidang di bawah dapat diklik dan diedit. Klik <strong>Simpan</strong> setelah selesai.
        </p>

        {/* Identitas */}
        <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-4 mb-6 animate-slide-up">
          <p className="text-teal-300 text-xs font-bold mb-3 uppercase tracking-wider">📄 Identitas Dokumen</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs font-body">
            {([
              ["Mata Pelajaran", "mataPelajaran"],
              ["Satuan Pendidikan", "satuanPendidikan"],
              ["Tahun Pelajaran", "tahunPelajaran"],
              ["Guru Mata Pelajaran", "guru"],
              ["NIP Guru", "guruNIP"],
              ["Jabatan Kepala Sekolah", "kepalaJabatan"],
              ["Nama Kepala Sekolah", "kepalaName"],
              ["NIP Kepala Sekolah", "kepalaSchoolNIP"],
              ["Kota", "kota"],
              ["Tanggal TTD", "tanggal"],
            ] as [string, keyof IdentitasData][]).map(([label, field]) => (
              <div key={field} className="flex gap-2 items-center">
                <span className="text-white/50 w-44 shrink-0">{label}</span>
                <span className="text-white/20 shrink-0">:</span>
                <input className={inpId} value={identitas[field]} placeholder={label + "..."}
                  onChange={e => updateIdentitas(field, e.target.value)} />
              </div>
            ))}
            <div className="flex gap-2 items-center">
              <span className="text-white/50 w-44 shrink-0">Kelas / Semester</span>
              <span className="text-white/20 shrink-0">:</span>
              <span className="text-white/60">{kelasRom} / {semLabel}</span>
            </div>
          </div>
        </div>

        {/* JP per Minggu + Jam Cadangan */}
        <div className="grid grid-cols-2 gap-4 mb-6 animate-slide-up">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="text-[10px] text-white/50 uppercase font-bold mb-1">JP per Minggu</p>
            <input type="number" min={1} className={inp + " text-sm font-bold text-teal-300"}
              value={sd.jpPerMinggu}
              onChange={e => updateSD({ jpPerMinggu: parseInt(e.target.value) || 1 })} />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="text-[10px] text-white/50 uppercase font-bold mb-1">Jam Cadangan (JP)</p>
            <input type="number" min={0} className={inp + " text-sm font-bold text-amber-300"}
              value={sd.jamCadangan}
              onChange={e => updateSD({ jamCadangan: parseInt(e.target.value) || 0 })} />
          </div>
        </div>

        {/* Perhitungan Minggu */}
        <div className="mb-2 animate-slide-up">
          <h2 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-1 text-center">
            📅 Perhitungan Minggu / Jam Efektif
          </h2>
          <p className="text-xs text-teal-300/60 text-center mb-4">Perhitungan Jam Efektif</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 animate-slide-up">
          {/* Table I – Jumlah Minggu */}
          <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-xl overflow-hidden">
            <p className="px-3 py-2 text-cyan-300 text-xs font-bold bg-cyan-900/40">I. Jumlah Minggu</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-teal-900/60">
                    <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center w-8">No</th>
                    <th className="border border-white/10 px-3 py-2 text-teal-300 font-bold text-left">Bulan</th>
                    <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center w-20">Jml. Minggu</th>
                  </tr>
                </thead>
                <tbody>
                  {sd.mingguPerBulan.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white/3" : ""}>
                      <td className="border border-white/10 px-2 py-1.5 text-center text-white/50">{i + 1}</td>
                      <td className="border border-white/10 px-2 py-1.5">
                        <input className={inp} value={r.bulan} onChange={e => updateMinggu(i, "bulan", e.target.value)} />
                      </td>
                      <td className="border border-white/10 px-2 py-1.5 text-center">
                        <input type="number" min={0} className={inp + " text-center"} value={r.jumlah}
                          onChange={e => updateMinggu(i, "jumlah", parseInt(e.target.value) || 0)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-teal-900/60 font-bold">
                    <td className="border border-white/10 px-2 py-2 text-center" colSpan={2}>
                      <span className="text-teal-300">Jumlah</span>
                    </td>
                    <td className="border border-white/10 px-2 py-2 text-center text-teal-300">{totalMinggu}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Table II – Tidak Efektif */}
          <div className="bg-amber-900/15 border border-amber-500/20 rounded-xl overflow-hidden">
            <p className="px-3 py-2 text-amber-300 text-xs font-bold bg-amber-900/30">II. Jumlah Minggu Tidak Efektif</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-teal-900/60">
                    <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-left w-20">Bulan</th>
                    <th className="border border-white/10 px-3 py-2 text-teal-300 font-bold text-left">Kegiatan</th>
                    <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center w-20">Jml. Minggu</th>
                    <th className="border border-white/10 px-1 py-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {sd.tidakEfektif.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white/3" : ""}>
                      <td className="border border-white/10 px-2 py-1.5">
                        <input className={inp} value={r.bulan} placeholder="Bulan"
                          onChange={e => updateTidak(i, "bulan", e.target.value)} />
                      </td>
                      <td className="border border-white/10 px-2 py-1.5">
                        <textarea rows={2} className={inp} value={r.kegiatan} placeholder="Kegiatan..."
                          onChange={e => updateTidak(i, "kegiatan", e.target.value)} />
                      </td>
                      <td className="border border-white/10 px-2 py-1.5 text-center">
                        <input type="number" min={0} className={inp + " text-center"} value={r.jumlah}
                          onChange={e => updateTidak(i, "jumlah", parseInt(e.target.value) || 0)} />
                      </td>
                      <td className="border border-white/10 px-1 py-1.5 text-center">
                        <button onClick={() => deleteTidak(i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-amber-900/40 font-bold">
                    <td className="border border-white/10 px-2 py-2" colSpan={2}>
                      <button onClick={() => { playPopSound(); addTidak(); }}
                        className="inline-flex items-center gap-1 text-[10px] text-amber-300 hover:text-amber-200 transition-colors">
                        <Plus className="w-3 h-3" /> Tambah Baris
                      </button>
                      <span className="ml-4 text-amber-300">Jumlah</span>
                    </td>
                    <td className="border border-white/10 px-2 py-2 text-center text-amber-300">{totalTidakEfektif}</td>
                    <td className="border border-white/10"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Kalkulasi Efektif */}
        <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-4 mb-6 animate-slide-up text-sm font-body">
          <div className="space-y-1">
            <p className="text-white/80">
              <span className="text-teal-300 font-bold">III.</span>&nbsp; Banyaknya Minggu Efektif :&nbsp;
              {totalMinggu} &ndash; {totalTidakEfektif} = <span className="text-teal-300 font-bold">{mingguEfektif} Minggu</span>
            </p>
            <p className="text-white/80">
              <span className="text-teal-300 font-bold">IV.</span>&nbsp; Banyaknya Jam Pelajaran :&nbsp;
              {mingguEfektif} Minggu &times; {sd.jpPerMinggu} Jam Pelajaran = <span className="text-teal-300 font-bold">{totalJP} Jam Pelajaran</span>
            </p>
          </div>
        </div>

        {/* Distribusi Alokasi Waktu */}
        <div className="mb-6 animate-slide-up">
          <h2 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3 text-center">
            📊 Distribusi Alokasi Waktu
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-xs border-collapse min-w-[480px]">
              <thead>
                <tr className="bg-teal-900/60">
                  <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center w-8">No</th>
                  <th className="border border-white/10 px-3 py-2 text-teal-300 font-bold text-left">Materi Pokok</th>
                  <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center w-28">Alokasi Waktu</th>
                  <th className="border border-white/10 px-1 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {sd.distribusi.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white/3" : ""}>
                    <td className="border border-white/10 px-2 py-1.5 text-center">
                      <input className={inp + " text-center"} value={r.no}
                        onChange={e => updateDistribusi(i, "no", e.target.value)} />
                    </td>
                    <td className="border border-white/10 px-3 py-1.5">
                      <input className={inp} value={r.materi} placeholder="Nama materi..."
                        onChange={e => updateDistribusi(i, "materi", e.target.value)} />
                    </td>
                    <td className="border border-white/10 px-2 py-1.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input type="number" min={0} className={inp + " text-center w-14"} value={r.jp}
                          onChange={e => updateDistribusi(i, "jp", parseInt(e.target.value) || 0)} />
                        <span className="text-white/40">JP</span>
                      </div>
                    </td>
                    <td className="border border-white/10 px-1 py-1.5 text-center">
                      <button onClick={() => deleteDistribusi(i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-teal-900/60 font-bold">
                  <td className="border border-white/10 px-2 py-2" colSpan={2}>
                    <div className="flex items-center gap-4">
                      <button onClick={() => { playPopSound(); addDistribusi(); }}
                        className="inline-flex items-center gap-1 text-[10px] text-teal-300 hover:text-teal-200 transition-colors">
                        <Plus className="w-3 h-3" /> Tambah Materi
                      </button>
                      <span className="text-teal-300 ml-2">Jumlah Jam</span>
                    </div>
                  </td>
                  <td className="border border-white/10 px-2 py-2 text-center">
                    <span className={`font-bold ${totalDistribusi === totalJP ? "text-teal-300" : "text-amber-300"}`}>
                      {totalDistribusi} JP
                    </span>
                  </td>
                  <td className="border border-white/10"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          {totalDistribusi !== totalJP && totalJP > 0 && (
            <p className="text-amber-300 text-xs mt-2 text-center">
              ⚠️ Total distribusi ({totalDistribusi} JP) berbeda dari jam pelajaran efektif ({totalJP} JP)
            </p>
          )}
        </div>

        {/* Kalkulasi Akhir */}
        <div className="bg-white/3 border border-white/10 rounded-xl p-4 mb-8 animate-slide-up text-xs font-body space-y-1">
          <p className="text-white/70 font-bold text-[11px] uppercase mb-2">📌 Rekapitulasi</p>
          <p className="text-white/70">Banyaknya Jam Pelajaran &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {mingguEfektif} Minggu × {sd.jpPerMinggu} Jam Pelajaran = <span className="text-teal-300 font-bold">{totalJP} Jam Pelajaran</span></p>
          <p className="text-white/70">Jumlah Jam Cadangan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span className="text-amber-300">{sd.jamCadangan} Jam Pelajaran</span></p>
          <p className="text-white/70">Jumlah Jam Pelajaran Efektif : {totalJP} &ndash; {sd.jamCadangan} = <span className="text-cyan-300 font-bold">{jpEfektif} Jam Pelajaran</span></p>
        </div>

        <div className="text-center">
          <button onClick={() => { playPopSound(); navigate("/ruang-untuk-guru"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Ruang Untuk Guru
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalisisAlokasiWaktuPage;
