import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarRange, FileText, FileDown, Save } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

/* ─── Types ─── */
type ProtaRow = {
  no: string;
  materi: string;
  kompetensiDasar: string;
  semester: 1 | 2;
  jp: number;
  bulan: string;
  type?: "pts" | "pas" | "pat" | "cadangan" | "ujian" | "normal";
};

type KelasProta = {
  rows: ProtaRow[];
  totalSem1: number;
  totalSem2: number;
};

type AllData = Record<"kelas7" | "kelas8" | "kelas9", KelasProta>;
type KelasKey = "kelas7" | "kelas8" | "kelas9";
type IdentitasData = { satuanPendidikan: string; mataPelajaran: string; alokasi: string; guru: string };

/* ─── Hardcoded tahun ─── */
const TAHUN       = "2026-2027";
const TAHUN_AWAL  = "2026";
const TAHUN_AKHIR = "2027";
const LABEL       = "2026 / 2027";

const STORAGE_KEY   = `numatik_prota_${TAHUN}`;
const IDENTITAS_KEY = `numatik_prota_identitas_${TAHUN}`;

/* ─── Data ─── */
const makeProtaData = (): AllData => ({
  kelas7: {
    totalSem1: 80,
    totalSem2: 85,
    rows: [
      { no: "1", materi: "Bilangan Bulat", kompetensiDasar: "Memahami dan melakukan operasi hitung bilangan bulat beserta sifat-sifatnya, serta menerapkannya dalam kehidupan sehari-hari", semester: 1, jp: 20, bulan: `Jul – Ags ${TAHUN_AWAL}` },
      { no: "2", materi: "Bilangan Rasional (Pecahan)", kompetensiDasar: "Memahami bilangan rasional (pecahan), melakukan operasi hitung, dan menyelesaikan masalah sehari-hari", semester: 1, jp: 15, bulan: `Ags – Sep ${TAHUN_AWAL}` },
      { no: "3", materi: "Bentuk Aljabar", kompetensiDasar: "Mengenal unsur-unsur bentuk aljabar, melakukan operasi hitung (penjumlahan, pengurangan, perkalian, pembagian) pada bentuk aljabar", semester: 1, jp: 15, bulan: `Sep – Okt ${TAHUN_AWAL}` },
      { no: "4", materi: "PLSV & PTLSV", kompetensiDasar: "Menyelesaikan persamaan dan pertidaksamaan linear satu variabel dalam kehidupan sehari-hari", semester: 1, jp: 20, bulan: `Okt – Nov ${TAHUN_AWAL}` },
      { no: "–", materi: "Penilaian Tengah Semester (PTS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Sep ${TAHUN_AWAL}`, type: "pts" },
      { no: "–", materi: "Cadangan / Pengayaan / Remedial", kompetensiDasar: "Remedial, pengayaan, dan penilaian harian", semester: 1, jp: 10, bulan: `Nov ${TAHUN_AWAL}`, type: "cadangan" },
      { no: "–", materi: "Penilaian Akhir Semester (PAS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Des ${TAHUN_AWAL}`, type: "pas" },
      { no: "5", materi: "Perbandingan", kompetensiDasar: "Memahami konsep perbandingan senilai, berbalik nilai, skala, dan menerapkannya dalam pemecahan masalah sehari-hari", semester: 2, jp: 15, bulan: `Jan ${TAHUN_AKHIR}` },
      { no: "6", materi: "Aritmetika Sosial", kompetensiDasar: "Menyelesaikan masalah jual-beli (untung/rugi), diskon, pajak, bruto-netto-tara, dan bunga tunggal", semester: 2, jp: 15, bulan: `Jan – Feb ${TAHUN_AKHIR}` },
      { no: "7", materi: "Garis dan Sudut", kompetensiDasar: "Memahami jenis-jenis sudut, hubungan antar-garis, dan sifat-sifat garis sejajar yang dipotong garis transversal", semester: 2, jp: 15, bulan: `Feb – Mar ${TAHUN_AKHIR}` },
      { no: "8", materi: "Segitiga dan Segiempat", kompetensiDasar: "Memahami sifat, jenis, keliling, dan luas segitiga serta berbagai jenis segiempat dan penerapannya", semester: 2, jp: 20, bulan: `Apr – Mei ${TAHUN_AKHIR}` },
      { no: "9", materi: "Himpunan", kompetensiDasar: "Memahami konsep himpunan, operasi himpunan (irisan, gabungan, selisih, komplemen), dan menerapkannya dalam masalah sehari-hari", semester: 2, jp: 15, bulan: `Mei ${TAHUN_AKHIR}` },
      { no: "–", materi: "Penilaian Tengah Semester (PTS) 2", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Mar ${TAHUN_AKHIR}`, type: "pts" },
      { no: "–", materi: "Cadangan / Pengayaan / Remedial", kompetensiDasar: "Remedial, pengayaan, dan penilaian harian", semester: 2, jp: 5, bulan: `Mei ${TAHUN_AKHIR}`, type: "cadangan" },
      { no: "–", materi: "Penilaian Akhir Tahun (PAT)", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Jun ${TAHUN_AKHIR}`, type: "pat" },
    ],
  },
  kelas8: {
    totalSem1: 80,
    totalSem2: 85,
    rows: [
      { no: "1", materi: "Pola Bilangan", kompetensiDasar: "Mengenal pola bilangan, barisan aritmetika dan geometri, serta menentukan suku ke-n suatu barisan bilangan", semester: 1, jp: 15, bulan: `Jul – Ags ${TAHUN_AWAL}` },
      { no: "2", materi: "Koordinat Kartesius", kompetensiDasar: "Memahami posisi titik dalam bidang koordinat Kartesius dan penerapannya dalam kehidupan sehari-hari", semester: 1, jp: 15, bulan: `Ags ${TAHUN_AWAL}` },
      { no: "3", materi: "Relasi dan Fungsi", kompetensiDasar: "Memahami relasi, fungsi, notasi fungsi, nilai fungsi, dan grafik fungsi pada bidang koordinat Kartesius", semester: 1, jp: 15, bulan: `Sep – Okt ${TAHUN_AWAL}` },
      { no: "4", materi: "Persamaan Garis Lurus", kompetensiDasar: "Memahami persamaan garis lurus, gradien, hubungan dua garis sejajar dan tegak lurus, serta penerapannya", semester: 1, jp: 20, bulan: `Okt – Nov ${TAHUN_AWAL}` },
      { no: "–", materi: "Penilaian Tengah Semester (PTS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Sep ${TAHUN_AWAL}`, type: "pts" },
      { no: "–", materi: "Cadangan / Pengayaan / Remedial", kompetensiDasar: "Remedial, pengayaan, dan penilaian harian", semester: 1, jp: 15, bulan: `Nov ${TAHUN_AWAL}`, type: "cadangan" },
      { no: "–", materi: "Penilaian Akhir Semester (PAS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Des ${TAHUN_AWAL}`, type: "pas" },
      { no: "5", materi: "SPLDV", kompetensiDasar: "Menyelesaikan sistem persamaan linear dua variabel dengan metode grafik, substitusi, eliminasi, dan gabungan", semester: 2, jp: 20, bulan: `Jan – Feb ${TAHUN_AKHIR}` },
      { no: "6", materi: "Teorema Pythagoras", kompetensiDasar: "Memahami dan menggunakan teorema Pythagoras, triple Pythagoras, dan penerapannya dalam pemecahan masalah", semester: 2, jp: 15, bulan: `Feb ${TAHUN_AKHIR}` },
      { no: "7", materi: "Lingkaran", kompetensiDasar: "Memahami unsur lingkaran, keliling, luas, busur, juring, tali busur, dan hubungan sudut pusat dengan sudut keliling", semester: 2, jp: 20, bulan: `Mar – Apr ${TAHUN_AKHIR}` },
      { no: "8", materi: "Bangun Ruang Sisi Datar", kompetensiDasar: "Memahami sifat, luas permukaan, dan volume kubus, balok, prisma, limas, dan gabungannya", semester: 2, jp: 15, bulan: `Apr – Mei ${TAHUN_AKHIR}` },
      { no: "–", materi: "Penilaian Tengah Semester (PTS) 2", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Mar ${TAHUN_AKHIR}`, type: "pts" },
      { no: "–", materi: "Cadangan / Pengayaan / Remedial", kompetensiDasar: "Remedial, pengayaan, dan penilaian harian", semester: 2, jp: 15, bulan: `Mei ${TAHUN_AKHIR}`, type: "cadangan" },
      { no: "–", materi: "Penilaian Akhir Tahun (PAT)", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Jun ${TAHUN_AKHIR}`, type: "pat" },
    ],
  },
  kelas9: {
    totalSem1: 80,
    totalSem2: 60,
    rows: [
      { no: "1", materi: "Bilangan Berpangkat & Bentuk Akar", kompetensiDasar: "Memahami bilangan berpangkat (bulat dan pecahan), sifat operasinya, bentuk akar, dan notasi ilmiah", semester: 1, jp: 20, bulan: `Jul – Ags ${TAHUN_AWAL}` },
      { no: "2", materi: "Persamaan Kuadrat", kompetensiDasar: "Menentukan akar persamaan kuadrat dengan pemfaktoran, melengkapi kuadrat sempurna, dan rumus kuadratik", semester: 1, jp: 20, bulan: `Ags – Sep ${TAHUN_AWAL}` },
      { no: "3", materi: "Fungsi Kuadrat", kompetensiDasar: "Memahami grafik fungsi kuadrat, sumbu simetri, titik puncak (maksimum/minimum), dan penerapannya", semester: 1, jp: 15, bulan: `Okt ${TAHUN_AWAL}` },
      { no: "4", materi: "Transformasi Geometri", kompetensiDasar: "Memahami translasi, refleksi, rotasi, dan dilatasi serta komposisi transformasi pada bidang koordinat", semester: 1, jp: 15, bulan: `Okt – Nov ${TAHUN_AWAL}` },
      { no: "–", materi: "Penilaian Tengah Semester (PTS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Sep ${TAHUN_AWAL}`, type: "pts" },
      { no: "–", materi: "Cadangan / Pengayaan / Remedial", kompetensiDasar: "Remedial, pengayaan, dan penilaian harian", semester: 1, jp: 10, bulan: `Nov ${TAHUN_AWAL}`, type: "cadangan" },
      { no: "–", materi: "Penilaian Akhir Semester (PAS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Des ${TAHUN_AWAL}`, type: "pas" },
      { no: "5", materi: "Kesebangunan & Kekongruenan", kompetensiDasar: "Memahami konsep kesebangunan dan kekongruenan bangun datar serta penerapannya dalam pemecahan masalah", semester: 2, jp: 15, bulan: `Jan ${TAHUN_AKHIR}` },
      { no: "6", materi: "Bangun Ruang Sisi Lengkung", kompetensiDasar: "Memahami luas permukaan dan volume tabung, kerucut, bola, dan gabungannya serta penerapannya", semester: 2, jp: 20, bulan: `Jan – Feb ${TAHUN_AKHIR}` },
      { no: "7", materi: "Statistika", kompetensiDasar: "Memahami penyajian data (tabel, diagram), ukuran pemusatan (mean, median, modus), dan ukuran penyebaran data", semester: 2, jp: 15, bulan: `Mar ${TAHUN_AKHIR}` },
      { no: "8", materi: "Peluang", kompetensiDasar: "Memahami ruang sampel, peluang empiris dan teoritis, frekuensi harapan, dan peluang kejadian majemuk", semester: 2, jp: 10, bulan: `Mei ${TAHUN_AKHIR}` },
      { no: "–", materi: "Penilaian Tengah Semester (PTS) 2", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Mar ${TAHUN_AKHIR}`, type: "pts" },
      { no: "–", materi: "Ujian Sekolah (Kelas 9)", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Apr ${TAHUN_AKHIR}`, type: "ujian" },
      { no: "–", materi: "PAT / Kelulusan Kelas 9", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Jun ${TAHUN_AKHIR}`, type: "pat" },
    ],
  },
});

const rowColor: Record<string, string> = {
  pts: "bg-amber-500/15 text-amber-200",
  pas: "bg-rose-500/15 text-rose-200",
  pat: "bg-rose-500/15 text-rose-200",
  cadangan: "bg-slate-500/10 text-slate-300",
  ujian: "bg-violet-500/15 text-violet-200",
  normal: "",
};

const specialIcon: Record<string, string> = {
  pts: "📝",
  pas: "📋",
  pat: "📋",
  cadangan: "🔄",
  ujian: "🎓",
};

/* ─── Word / PDF styles ─── */
const dokumenStyle = `
  @page { size: 21.5cm 33cm; margin: 3cm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; background: #fff; margin: 0; padding: 0; }
  h1 { text-align: center; font-size: 16pt; font-weight: bold; margin: 0 0 4pt 0; }
  h2 { text-align: center; font-size: 13pt; font-weight: bold; margin: 0 0 16pt 0; }
  .header { text-align: center; margin-bottom: 16pt; border-bottom: 2px solid #000; padding-bottom: 10pt; }
  .identitas { border: 1px solid #aaa; padding: 8pt 10pt; margin-bottom: 12pt; }
  .identitas table { width: 100%; border: none; border-collapse: collapse; }
  .identitas td { border: none; padding: 2pt 4pt; font-size: 10pt; }
  .identitas .lbl { width: 38%; font-weight: bold; }
  .identitas .sep { width: 4pt; }
  table.prota { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin-top: 8pt; }
  table.prota th { background: #1a5f7a; color: #fff; border: 1px solid #aaa; padding: 5pt 6pt; text-align: center; font-size: 10pt; }
  table.prota td { border: 1px solid #aaa; padding: 4pt 6pt; vertical-align: top; text-align: justify; }
  table.prota td.center { text-align: center; }
  .row-pts { background: #fff3cd; }
  .row-pas { background: #f8d7da; }
  .row-cadangan { background: #f0f0f0; }
  .row-ujian { background: #e8d5f5; }
  .row-total-ganjil { background: #d1ecf1; font-weight: bold; }
  .row-total-genap { background: #e8d5f5; font-weight: bold; }
  .row-total-all { background: #d4edda; font-weight: bold; }
  .footer { text-align: center; margin-top: 16pt; font-size: 9pt; color: #666; border-top: 1px solid #ccc; padding-top: 8pt; }
  .ttd { width: 100%; margin-top: 24pt; border-collapse: collapse; }
  .ttd td { border: none; text-align: center; width: 50%; padding: 4pt; font-size: 10pt; }
  .notes { font-size: 9pt; color: #444; margin-top: 10pt; line-height: 1.5; }
  .notes p { margin: 2pt 0; }
`;

const buildDokumenBody = (
  kelas: KelasKey,
  kelasNum: string,
  data: KelasProta,
  identitas: IdentitasData
) => {
  const kelasRom  = kelasNum === "7" ? "VII" : kelasNum === "8" ? "VIII" : "IX";
  const kelasNama = kelasNum === "7" ? "Tujuh" : kelasNum === "8" ? "Delapan" : "Sembilan";

  const rowsHtml = data.rows.map((r) => {
    const t = r.type ?? "normal";
    const isSpecial = t !== "normal" && t !== "cadangan";
    const semLabel  = r.semester === 1 ? `Ganjil (${TAHUN_AWAL})` : `Genap (${TAHUN_AKHIR})`;
    const rowClass  = t === "pts" ? "row-pts" : t === "pas" || t === "pat" ? "row-pas" : t === "cadangan" ? "row-cadangan" : t === "ujian" ? "row-ujian" : "";
    const icon      = isSpecial ? (specialIcon[t] ?? "") + " " : t === "cadangan" ? "🔄 " : "";
    if (isSpecial) {
      return `<tr class="${rowClass}">
        <td class="center">${r.no}</td>
        <td colspan="2" style="font-weight:bold;">${icon}${r.materi}</td>
        <td class="center">${semLabel}</td>
        <td class="center">–</td>
        <td class="center">${r.bulan}</td>
      </tr>`;
    }
    return `<tr class="${rowClass}">
      <td class="center">${r.no}</td>
      <td>${icon}${r.materi}</td>
      <td>${r.kompetensiDasar}</td>
      <td class="center">${semLabel}</td>
      <td class="center">${r.jp > 0 ? r.jp : "–"}</td>
      <td class="center">${r.bulan}</td>
    </tr>`;
  }).join("\n");

  return `
    <div class="header">
      <h1>PROGRAM TAHUNAN (PROTA)</h1>
      <h2>Matematika SMP Kelas ${kelasRom} &middot; Tahun Pelajaran ${LABEL}</h2>
    </div>
    <div class="identitas">
      <table>
        <tr><td class="lbl">Satuan Pendidikan</td><td class="sep">:</td><td>${identitas.satuanPendidikan || "SMP / MTs"}</td></tr>
        <tr><td class="lbl">Mata Pelajaran</td><td class="sep">:</td><td>${identitas.mataPelajaran || "Matematika"}</td></tr>
        <tr><td class="lbl">Kelas</td><td class="sep">:</td><td>${kelasRom} (${kelasNama})</td></tr>
        <tr><td class="lbl">Tahun Pelajaran</td><td class="sep">:</td><td>${LABEL}</td></tr>
        <tr><td class="lbl">Alokasi Waktu</td><td class="sep">:</td><td>${identitas.alokasi || "5 JP / Minggu (1 JP = 40 menit)"}</td></tr>
        <tr><td class="lbl">Total JP Semester Ganjil</td><td class="sep">:</td><td>${data.totalSem1} Jam Pelajaran</td></tr>
        <tr><td class="lbl">Total JP Semester Genap</td><td class="sep">:</td><td>${data.totalSem2} Jam Pelajaran</td></tr>
        <tr><td class="lbl">Guru Mata Pelajaran</td><td class="sep">:</td><td>${identitas.guru || "___________________________"}</td></tr>
      </table>
    </div>
    <table class="prota">
      <thead>
        <tr>
          <th style="width:30pt;">No</th>
          <th style="width:110pt;">Materi Pokok</th>
          <th>Kompetensi Dasar / Tujuan Pembelajaran</th>
          <th style="width:70pt;">Semester</th>
          <th style="width:28pt;">JP</th>
          <th style="width:80pt;">Alokasi Waktu</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
      <tfoot>
        <tr class="row-total-ganjil">
          <td colspan="4" style="text-align:right;">Total JP Semester Ganjil:</td>
          <td class="center">${data.totalSem1}</td>
          <td class="center">Juli – Des ${TAHUN_AWAL}</td>
        </tr>
        <tr class="row-total-genap">
          <td colspan="4" style="text-align:right;">Total JP Semester Genap:</td>
          <td class="center">${data.totalSem2}</td>
          <td class="center">Jan – Jun ${TAHUN_AKHIR}</td>
        </tr>
        <tr class="row-total-all">
          <td colspan="4" style="text-align:right;">Total JP Keseluruhan:</td>
          <td class="center">${data.totalSem1 + data.totalSem2}</td>
          <td class="center">1 Tahun Pelajaran</td>
        </tr>
      </tfoot>
    </table>
    <div class="notes">
      <p>Catatan:</p>
      <p>• JP = Jam Pelajaran (1 JP = 40 menit). Matematika SMP dialokasikan 5 JP per minggu.</p>
      <p>• Minggu non-efektif meliputi: MPLS, PTS, PAS/PAT, Ujian Sekolah, libur nasional, dan libur semester.</p>
      <p>• Alokasi waktu bersifat fleksibel dan dapat disesuaikan dengan kondisi sekolah masing-masing.</p>
      <p>• Tanggal kegiatan mengacu pada kalender pendidikan Kemendikbudristek tahun pelajaran ${LABEL}.</p>
    </div>
    <table class="ttd">
      <tr>
        <td>Mengetahui,<br/>Kepala Sekolah<br/><br/><br/><br/>____________________________<br/>NIP. ________________________</td>
        <td>_____________, __________ 20__<br/>Guru Mata Pelajaran Matematika<br/><br/><br/><br/>____________________________<br/>NIP. ________________________</td>
      </tr>
    </table>
    <div class="footer">
      <p>Dokumen ini dicetak dari Aplikasi NUMATIK — Numerasi Aktif dengan Teknologi Informasi dan Komunikasi</p>
    </div>
  `;
};

const defaultIdentitas: IdentitasData = {
  satuanPendidikan: "SMP / MTs",
  mataPelajaran: "Matematika",
  alokasi: "5 JP / Minggu (1 JP = 40 menit)",
  guru: "",
};

/* ─── Component ─── */
const ProtaPage = () => {
  const navigate = useNavigate();
  const [kelas, setKelas]         = useState<KelasKey>("kelas7");
  const [filterSem, setFilterSem] = useState<"semua" | "1" | "2">("semua");
  const [savedOk, setSavedOk]     = useState(false);

  const [allData, setAllData] = useState<AllData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : makeProtaData();
    } catch { return makeProtaData(); }
  });

  const [identitas, setIdentitas] = useState<IdentitasData>(() => {
    try {
      const raw = localStorage.getItem(IDENTITAS_KEY);
      return raw ? JSON.parse(raw) : defaultIdentitas;
    } catch { return defaultIdentitas; }
  });

  const updateIdentitas = (field: keyof IdentitasData, value: string) => {
    setIdentitas(prev => ({ ...prev, [field]: value }));
    setSavedOk(false);
  };

  const data     = allData[kelas];
  const kelasNum = kelas.replace("kelas", "");
  const kelasRom = kelasNum === "7" ? "VII" : kelasNum === "8" ? "VIII" : "IX";

  const filteredRows = data.rows.filter(r =>
    filterSem === "semua" ? true : r.semester === parseInt(filterSem)
  );

  const updateRow = (rowIdx: number, field: keyof ProtaRow, value: string | number) => {
    const actualIdx = data.rows.indexOf(filteredRows[rowIdx]);
    setAllData(prev => {
      const newRows = prev[kelas].rows.map((r, i) =>
        i === actualIdx ? { ...r, [field]: value } : r
      );
      return { ...prev, [kelas]: { ...prev[kelas], rows: newRows } };
    });
    setSavedOk(false);
  };

  const updateTotal = (field: "totalSem1" | "totalSem2", value: number) => {
    setAllData(prev => ({ ...prev, [kelas]: { ...prev[kelas], [field]: value } }));
    setSavedOk(false);
  };

  const handleSave = () => {
    playPopSound();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    localStorage.setItem(IDENTITAS_KEY, JSON.stringify(identitas));
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 2500);
  };

  const handlePrintWord = () => {
    playPopSound();
    const body = buildDokumenBody(kelas, kelasNum, data, identitas);
    const html = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>PROTA - numatik</title><style>${dokumenStyle}</style></head><body>${body}</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `PROTA - numatik.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    playPopSound();
    const body = buildDokumenBody(kelas, kelasNum, data, identitas);
    const html = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>PROTA - numatik</title><style>${dokumenStyle}</style></head><body>${body}</body></html>`;
    const win  = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); win.close(); }, 500);
    }
  };

  const sem1Rows       = data.rows.filter(r => r.semester === 1 && (!r.type || r.type === "cadangan"));
  const sem2Rows       = data.rows.filter(r => r.semester === 2 && (!r.type || r.type === "cadangan"));
  const totalSem1Calc  = sem1Rows.reduce((s, r) => s + r.jp, 0);
  const totalSem2Calc  = sem2Rows.reduce((s, r) => s + r.jp, 0);

  const inputCls = "w-full bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none text-white/85 text-xs py-0.5 resize-none transition-colors";

  return (
    <div className="guru-editable relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-14">

        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <CalendarRange className="w-4 h-4" />
            Program Tahunan · Matematika SMP
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            PROGRAM TAHUNAN (PROTA)
          </h1>
          <p className="mt-1 text-sm font-bold text-teal-400 tracking-widest">Tahun Pelajaran {LABEL}</p>
          <p className="mt-3 text-sm text-white/60 font-body max-w-2xl mx-auto">
            Distribusi materi pembelajaran Matematika SMP selama satu tahun berdasarkan Kurikulum Merdeka dengan Pendekatan Deep Learning (Fase D).
          </p>
        </div>

        {/* Kelas Tabs */}
        <div className="flex justify-center gap-2 mb-5 animate-slide-up">
          {([
            { key: "kelas7" as KelasKey, label: "Kelas 7" },
            { key: "kelas8" as KelasKey, label: "Kelas 8" },
            { key: "kelas9" as KelasKey, label: "Kelas 9" },
          ]).map(k => (
            <button
              key={k.key}
              onClick={() => { playPopSound(); setKelas(k.key); }}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                kelas === k.key
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        {/* Semester Filter */}
        <div className="flex justify-center gap-2 mb-6 animate-slide-up">
          {([
            { value: "semua", label: "Semua Semester" },
            { value: "1", label: "Semester Ganjil" },
            { value: "2", label: "Semester Genap" },
          ] as const).map(s => (
            <button
              key={s.value}
              onClick={() => { playPopSound(); setFilterSem(s.value); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filterSem === s.value
                  ? "bg-cyan-600 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 animate-slide-up">
          {[
            { label: "Mata Pelajaran", value: "Matematika" },
            { label: "Kelas", value: `Kelas ${kelasNum} (${kelasRom})` },
            { label: "JP Semester Ganjil", value: `${data.totalSem1} JP` },
            { label: "JP Semester Genap", value: `${data.totalSem2} JP` },
          ].map((c, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-[10px] text-white/50 uppercase font-bold mb-1">{c.label}</div>
              <div className="text-sm font-bold text-teal-300">{c.value}</div>
            </div>
          ))}
        </div>

        {/* Identitas */}
        <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-4 mb-5 animate-slide-up">
          <p className="text-teal-300 text-xs font-bold mb-3 uppercase tracking-wider">📄 Identitas Program Tahunan</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs font-body">
            {([
              ["satuanPendidikan", "Satuan Pendidikan"],
              ["mataPelajaran",    "Mata Pelajaran"],
            ] as [keyof IdentitasData, string][]).map(([field, lbl]) => (
              <div key={field} className="flex gap-2 items-center">
                <span className="text-white/50 w-44 shrink-0">{lbl}</span>
                <span className="text-white/20 shrink-0">:</span>
                <input
                  className="flex-1 bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none text-white/85 text-xs py-0.5 transition-colors"
                  value={identitas[field]}
                  onChange={e => updateIdentitas(field, e.target.value)}
                />
              </div>
            ))}
            <div className="flex gap-2 items-center">
              <span className="text-white/50 w-44 shrink-0">Kelas</span>
              <span className="text-white/20 shrink-0">:</span>
              <span className="text-white/60">{kelasNum} ({kelasNum === "7" ? "Tujuh" : kelasNum === "8" ? "Delapan" : "Sembilan"})</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-white/50 w-44 shrink-0">Tahun Pelajaran</span>
              <span className="text-white/20 shrink-0">:</span>
              <span className="text-white/60">{LABEL}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-white/50 w-44 shrink-0">Alokasi Waktu</span>
              <span className="text-white/20 shrink-0">:</span>
              <input
                className="flex-1 bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none text-white/85 text-xs py-0.5 transition-colors"
                value={identitas.alokasi}
                onChange={e => updateIdentitas("alokasi", e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-white/50 w-44 shrink-0">Total JP Sem. Ganjil</span>
              <span className="text-white/20 shrink-0">:</span>
              <span className="text-white/60">{data.totalSem1} Jam Pelajaran</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-white/50 w-44 shrink-0">Total JP Sem. Genap</span>
              <span className="text-white/20 shrink-0">:</span>
              <span className="text-white/60">{data.totalSem2} Jam Pelajaran</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-white/50 w-44 shrink-0">Guru Mata Pelajaran</span>
              <span className="text-white/20 shrink-0">:</span>
              <input
                className="flex-1 bg-transparent border-b border-white/20 focus:border-cyan-400 outline-none text-white/85 text-xs py-0.5 transition-colors"
                placeholder="Nama Guru..."
                value={identitas.guru}
                onChange={e => updateIdentitas("guru", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-slide-up">
          <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
            <p className="text-cyan-300 text-xs font-bold mb-2 uppercase tracking-wider">📚 Semester Ganjil ({TAHUN_AWAL})</p>
            <p className="text-white/60 text-xs font-body">Juli – Desember {TAHUN_AWAL}</p>
            <p className="text-white font-bold text-sm mt-1">
              {sem1Rows.filter(r => !r.type).length} Materi Pokok &nbsp;·&nbsp; {totalSem1Calc} JP Efektif
            </p>
          </div>
          <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
            <p className="text-violet-300 text-xs font-bold mb-2 uppercase tracking-wider">📚 Semester Genap ({TAHUN_AKHIR})</p>
            <p className="text-white/60 text-xs font-body">Januari – Juni {TAHUN_AKHIR}</p>
            <p className="text-white font-bold text-sm mt-1">
              {sem2Rows.filter(r => !r.type).length} Materi Pokok &nbsp;·&nbsp; {totalSem2Calc} JP Efektif
            </p>
          </div>
        </div>

        {/* Edit hint */}
        <p className="text-xs text-cyan-300/60 mb-3 animate-slide-up">
          ✏️ Semua kolom dalam tabel dapat diklik dan diedit langsung. Jangan lupa klik <strong>Simpan</strong> setelah selesai mengedit.
        </p>

        {/* Table */}
        <div className="animate-slide-up mb-8">
          <h2 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">
            📊 Tabel Program Tahunan — Kelas {kelasNum} | Tahun Pelajaran {LABEL}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-xs border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-teal-900/60">
                  <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center w-8">No</th>
                  <th className="border border-white/10 px-3 py-2 text-teal-300 font-bold text-left min-w-[160px]">Materi Pokok</th>
                  <th className="border border-white/10 px-3 py-2 text-teal-300 font-bold text-left min-w-[280px]">Kompetensi Dasar / Tujuan Pembelajaran</th>
                  <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center min-w-[80px]">Semester</th>
                  <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center w-10">JP</th>
                  <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center min-w-[110px]">Alokasi Waktu</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, ri) => {
                  const t = row.type ?? "normal";
                  const isSpecial = t !== "normal" && t !== "cadangan";
                  const semLabel = row.semester === 1
                    ? <span className="text-cyan-300 font-semibold">Ganjil</span>
                    : <span className="text-violet-300 font-semibold">Genap</span>;

                  if (isSpecial) {
                    const icon = specialIcon[t] ?? "📌";
                    return (
                      <tr key={ri} className={`border ${rowColor[t]}`}>
                        <td className="border border-white/10 px-2 py-2 text-center opacity-60">
                          <input className={inputCls} value={row.no} onChange={e => updateRow(ri, "no", e.target.value)} />
                        </td>
                        <td colSpan={2} className="border border-white/10 px-3 py-2 font-semibold">
                          {icon}{" "}
                          <input className={inputCls + " font-semibold"} value={row.materi} onChange={e => updateRow(ri, "materi", e.target.value)} />
                        </td>
                        <td className="border border-white/10 px-2 py-2 text-center">{semLabel}</td>
                        <td className="border border-white/10 px-2 py-2 text-center opacity-50">–</td>
                        <td className="border border-white/10 px-2 py-2 text-center text-[10px] opacity-70">
                          <input className={inputCls + " text-center"} value={row.bulan} onChange={e => updateRow(ri, "bulan", e.target.value)} />
                        </td>
                      </tr>
                    );
                  }

                  const cadStyle = t === "cadangan" ? "bg-slate-500/10" : ri % 2 === 0 ? "bg-white/3" : "bg-white/0";
                  return (
                    <tr key={ri} className={`border ${cadStyle} hover:bg-white/8 transition-colors`}>
                      <td className="border border-white/10 px-2 py-2 text-center text-white/60">
                        <input className={inputCls + " text-center"} value={row.no} onChange={e => updateRow(ri, "no", e.target.value)} />
                      </td>
                      <td className="border border-white/10 px-3 py-2 font-semibold text-white">
                        <textarea
                          className={inputCls + " font-semibold"}
                          value={row.materi}
                          rows={2}
                          onChange={e => updateRow(ri, "materi", e.target.value)}
                        />
                      </td>
                      <td className="border border-white/10 px-3 py-2 text-white/70 leading-relaxed">
                        <textarea
                          className={inputCls}
                          value={row.kompetensiDasar}
                          rows={3}
                          onChange={e => updateRow(ri, "kompetensiDasar", e.target.value)}
                        />
                      </td>
                      <td className="border border-white/10 px-2 py-2 text-center">{semLabel}</td>
                      <td className="border border-white/10 px-2 py-2 text-center font-bold">
                        <input
                          type="number"
                          className={inputCls + " text-center w-12"}
                          value={row.jp}
                          min={0}
                          onChange={e => updateRow(ri, "jp", parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="border border-white/10 px-2 py-2 text-center text-[10px] text-white/60">
                        <input className={inputCls + " text-center"} value={row.bulan} onChange={e => updateRow(ri, "bulan", e.target.value)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                {(filterSem === "semua" || filterSem === "1") && (
                  <tr className="bg-cyan-900/50 font-bold">
                    <td className="border border-white/10 px-2 py-2" colSpan={4}>
                      <span className="text-cyan-300">TOTAL JP SEMESTER GANJIL</span>
                    </td>
                    <td className="border border-white/10 px-2 py-2 text-center">
                      <input type="number" className={inputCls + " text-center text-cyan-300 font-bold w-12"} value={data.totalSem1} min={0} onChange={e => updateTotal("totalSem1", parseInt(e.target.value) || 0)} />
                    </td>
                    <td className="border border-white/10 px-2 py-2 text-center text-cyan-200 text-[10px]">Juli – Des {TAHUN_AWAL}</td>
                  </tr>
                )}
                {(filterSem === "semua" || filterSem === "2") && (
                  <tr className="bg-violet-900/50 font-bold">
                    <td className="border border-white/10 px-2 py-2" colSpan={4}>
                      <span className="text-violet-300">TOTAL JP SEMESTER GENAP</span>
                    </td>
                    <td className="border border-white/10 px-2 py-2 text-center">
                      <input type="number" className={inputCls + " text-center text-violet-300 font-bold w-12"} value={data.totalSem2} min={0} onChange={e => updateTotal("totalSem2", parseInt(e.target.value) || 0)} />
                    </td>
                    <td className="border border-white/10 px-2 py-2 text-center text-violet-200 text-[10px]">Jan – Jun {TAHUN_AKHIR}</td>
                  </tr>
                )}
                {filterSem === "semua" && (
                  <tr className="bg-teal-900/60 font-bold">
                    <td className="border border-white/10 px-2 py-2" colSpan={4}>
                      <span className="text-teal-300">TOTAL JP KESELURUHAN</span>
                    </td>
                    <td className="border border-white/10 px-2 py-2 text-center text-teal-300">{data.totalSem1 + data.totalSem2}</td>
                    <td className="border border-white/10 px-2 py-2 text-center text-teal-200 text-[10px]">1 Tahun Pelajaran</td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6 animate-slide-up">
          {[
            { color: "bg-amber-500/20 border-amber-500/30", label: "PTS – Penilaian Tengah Semester" },
            { color: "bg-rose-500/20 border-rose-500/30", label: "PAS/PAT – Penilaian Akhir" },
            { color: "bg-violet-500/20 border-violet-500/30", label: "Ujian Sekolah (Kelas 9)" },
            { color: "bg-slate-500/15 border-slate-500/20", label: "Cadangan / Remedial" },
          ].map((l, i) => (
            <div key={i} className={`flex items-center gap-2 text-[10px] text-white/60 px-3 py-1.5 rounded-lg border ${l.color}`}>
              <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="bg-white/3 border border-white/10 rounded-xl p-4 mb-8 text-xs text-white/50 font-body space-y-1.5 animate-slide-up">
          <p className="text-white/70 font-bold text-[11px] uppercase mb-2">📌 Catatan:</p>
          <p>• JP = Jam Pelajaran (1 JP = 40 menit). Matematika SMP dialokasikan 5 JP per minggu.</p>
          <p>• Minggu non-efektif meliputi: MPLS, PTS, PAS/PAT, Ujian Sekolah, libur nasional, dan libur semester.</p>
          <p>• Alokasi waktu bersifat fleksibel dan dapat disesuaikan dengan kondisi sekolah masing-masing.</p>
          <p>• Tanggal kegiatan mengacu pada kalender pendidikan Kemendikbudristek tahun pelajaran {LABEL}.</p>
          <p>• Kolom "Cadangan" digunakan untuk remedial, pengayaan, penilaian harian, dan kegiatan insidental.</p>
          {kelas === "kelas9" && (
            <p>• Kelas 9 Semester Genap: JP lebih sedikit karena Ujian Sekolah berlangsung di bulan April.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 animate-slide-up">
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500/90 border border-cyan-400/40 text-white text-sm font-semibold font-body transition-all"
          >
            <FileDown className="w-4 h-4" />
            Simpan sebagai PDF
          </button>
          <button
            onClick={handlePrintWord}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-500/90 border border-violet-400/40 text-white text-sm font-semibold font-body transition-all"
          >
            <FileText className="w-4 h-4" />
            Simpan sebagai Word
          </button>
          <button
            onClick={handleSave}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-white text-sm font-semibold font-body transition-all ${savedOk ? "bg-emerald-500 border-emerald-400/60" : "bg-emerald-600/80 hover:bg-emerald-500/90 border-emerald-400/40"}`}
          >
            <Save className="w-4 h-4" />
            {savedOk ? "Tersimpan!" : "Simpan"}
          </button>
        </div>

        <div className="text-center">
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

export default ProtaPage;
