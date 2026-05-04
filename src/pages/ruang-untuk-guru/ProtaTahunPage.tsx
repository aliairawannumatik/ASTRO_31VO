import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarRange, Printer, FileText } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

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

const makeProtaData = (tahunAwal: string, tahunAkhir: string): Record<"kelas7" | "kelas8" | "kelas9", KelasProta> => {
  return {
    kelas7: {
      totalSem1: 80,
      totalSem2: 85,
      rows: [
        { no: "1", materi: "Bilangan Bulat", kompetensiDasar: "Memahami dan melakukan operasi hitung bilangan bulat beserta sifat-sifatnya, serta menerapkannya dalam kehidupan sehari-hari", semester: 1, jp: 20, bulan: `Jul – Ags ${tahunAwal}` },
        { no: "2", materi: "Bilangan Rasional (Pecahan)", kompetensiDasar: "Memahami bilangan rasional (pecahan), melakukan operasi hitung, dan menyelesaikan masalah sehari-hari", semester: 1, jp: 15, bulan: `Ags – Sep ${tahunAwal}` },
        { no: "3", materi: "Bentuk Aljabar", kompetensiDasar: "Mengenal unsur-unsur bentuk aljabar, melakukan operasi hitung (penjumlahan, pengurangan, perkalian, pembagian) pada bentuk aljabar", semester: 1, jp: 15, bulan: `Sep – Okt ${tahunAwal}` },
        { no: "4", materi: "PLSV & PTLSV", kompetensiDasar: "Menyelesaikan persamaan dan pertidaksamaan linear satu variabel dalam kehidupan sehari-hari", semester: 1, jp: 20, bulan: `Okt – Nov ${tahunAwal}` },
        { no: "–", materi: "Penilaian Tengah Semester (PTS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Sep ${tahunAwal}`, type: "pts" },
        { no: "–", materi: "Cadangan / Pengayaan / Remedial", kompetensiDasar: "Remedial, pengayaan, dan penilaian harian", semester: 1, jp: 10, bulan: `Nov ${tahunAwal}`, type: "cadangan" },
        { no: "–", materi: "Penilaian Akhir Semester (PAS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Des ${tahunAwal}`, type: "pas" },
        { no: "5", materi: "Perbandingan", kompetensiDasar: "Memahami konsep perbandingan senilai, berbalik nilai, skala, dan menerapkannya dalam pemecahan masalah sehari-hari", semester: 2, jp: 15, bulan: `Jan ${tahunAkhir}` },
        { no: "6", materi: "Aritmetika Sosial", kompetensiDasar: "Menyelesaikan masalah jual-beli (untung/rugi), diskon, pajak, bruto-netto-tara, dan bunga tunggal", semester: 2, jp: 15, bulan: `Jan – Feb ${tahunAkhir}` },
        { no: "7", materi: "Garis dan Sudut", kompetensiDasar: "Memahami jenis-jenis sudut, hubungan antar-garis, dan sifat-sifat garis sejajar yang dipotong garis transversal", semester: 2, jp: 15, bulan: `Feb – Mar ${tahunAkhir}` },
        { no: "8", materi: "Segitiga dan Segiempat", kompetensiDasar: "Memahami sifat, jenis, keliling, dan luas segitiga serta berbagai jenis segiempat dan penerapannya", semester: 2, jp: 20, bulan: `Apr – Mei ${tahunAkhir}` },
        { no: "9", materi: "Himpunan", kompetensiDasar: "Memahami konsep himpunan, operasi himpunan (irisan, gabungan, selisih, komplemen), dan menerapkannya dalam masalah sehari-hari", semester: 2, jp: 15, bulan: `Mei ${tahunAkhir}` },
        { no: "–", materi: "Penilaian Tengah Semester (PTS) 2", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Mar ${tahunAkhir}`, type: "pts" },
        { no: "–", materi: "Cadangan / Pengayaan / Remedial", kompetensiDasar: "Remedial, pengayaan, dan penilaian harian", semester: 2, jp: 5, bulan: `Mei ${tahunAkhir}`, type: "cadangan" },
        { no: "–", materi: "Penilaian Akhir Tahun (PAT)", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Jun ${tahunAkhir}`, type: "pat" },
      ],
    },
    kelas8: {
      totalSem1: 80,
      totalSem2: 85,
      rows: [
        { no: "1", materi: "Pola Bilangan", kompetensiDasar: "Mengenal pola bilangan, barisan aritmetika dan geometri, serta menentukan suku ke-n suatu barisan bilangan", semester: 1, jp: 15, bulan: `Jul – Ags ${tahunAwal}` },
        { no: "2", materi: "Koordinat Kartesius", kompetensiDasar: "Memahami posisi titik dalam bidang koordinat Kartesius dan penerapannya dalam kehidupan sehari-hari", semester: 1, jp: 15, bulan: `Ags ${tahunAwal}` },
        { no: "3", materi: "Relasi dan Fungsi", kompetensiDasar: "Memahami relasi, fungsi, notasi fungsi, nilai fungsi, dan grafik fungsi pada bidang koordinat Kartesius", semester: 1, jp: 15, bulan: `Sep – Okt ${tahunAwal}` },
        { no: "4", materi: "Persamaan Garis Lurus", kompetensiDasar: "Memahami persamaan garis lurus, gradien, hubungan dua garis sejajar dan tegak lurus, serta penerapannya", semester: 1, jp: 20, bulan: `Okt – Nov ${tahunAwal}` },
        { no: "–", materi: "Penilaian Tengah Semester (PTS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Sep ${tahunAwal}`, type: "pts" },
        { no: "–", materi: "Cadangan / Pengayaan / Remedial", kompetensiDasar: "Remedial, pengayaan, dan penilaian harian", semester: 1, jp: 15, bulan: `Nov ${tahunAwal}`, type: "cadangan" },
        { no: "–", materi: "Penilaian Akhir Semester (PAS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Des ${tahunAwal}`, type: "pas" },
        { no: "5", materi: "SPLDV", kompetensiDasar: "Menyelesaikan sistem persamaan linear dua variabel dengan metode grafik, substitusi, eliminasi, dan gabungan", semester: 2, jp: 20, bulan: `Jan – Feb ${tahunAkhir}` },
        { no: "6", materi: "Teorema Pythagoras", kompetensiDasar: "Memahami dan menggunakan teorema Pythagoras, triple Pythagoras, dan penerapannya dalam pemecahan masalah", semester: 2, jp: 15, bulan: `Feb ${tahunAkhir}` },
        { no: "7", materi: "Lingkaran", kompetensiDasar: "Memahami unsur lingkaran, keliling, luas, busur, juring, tali busur, dan hubungan sudut pusat dengan sudut keliling", semester: 2, jp: 20, bulan: `Mar – Apr ${tahunAkhir}` },
        { no: "8", materi: "Bangun Ruang Sisi Datar", kompetensiDasar: "Memahami sifat, luas permukaan, dan volume kubus, balok, prisma, limas, dan gabungannya", semester: 2, jp: 15, bulan: `Apr – Mei ${tahunAkhir}` },
        { no: "–", materi: "Penilaian Tengah Semester (PTS) 2", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Mar ${tahunAkhir}`, type: "pts" },
        { no: "–", materi: "Cadangan / Pengayaan / Remedial", kompetensiDasar: "Remedial, pengayaan, dan penilaian harian", semester: 2, jp: 15, bulan: `Mei ${tahunAkhir}`, type: "cadangan" },
        { no: "–", materi: "Penilaian Akhir Tahun (PAT)", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Jun ${tahunAkhir}`, type: "pat" },
      ],
    },
    kelas9: {
      totalSem1: 80,
      totalSem2: 60,
      rows: [
        { no: "1", materi: "Bilangan Berpangkat & Bentuk Akar", kompetensiDasar: "Memahami bilangan berpangkat (bulat dan pecahan), sifat operasinya, bentuk akar, dan notasi ilmiah", semester: 1, jp: 20, bulan: `Jul – Ags ${tahunAwal}` },
        { no: "2", materi: "Persamaan Kuadrat", kompetensiDasar: "Menentukan akar persamaan kuadrat dengan pemfaktoran, melengkapi kuadrat sempurna, dan rumus kuadratik", semester: 1, jp: 20, bulan: `Ags – Sep ${tahunAwal}` },
        { no: "3", materi: "Fungsi Kuadrat", kompetensiDasar: "Memahami grafik fungsi kuadrat, sumbu simetri, titik puncak (maksimum/minimum), dan penerapannya", semester: 1, jp: 15, bulan: `Okt ${tahunAwal}` },
        { no: "4", materi: "Transformasi Geometri", kompetensiDasar: "Memahami translasi, refleksi, rotasi, dan dilatasi serta komposisi transformasi pada bidang koordinat", semester: 1, jp: 15, bulan: `Okt – Nov ${tahunAwal}` },
        { no: "–", materi: "Penilaian Tengah Semester (PTS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Sep ${tahunAwal}`, type: "pts" },
        { no: "–", materi: "Cadangan / Pengayaan / Remedial", kompetensiDasar: "Remedial, pengayaan, dan penilaian harian", semester: 1, jp: 10, bulan: `Nov ${tahunAwal}`, type: "cadangan" },
        { no: "–", materi: "Penilaian Akhir Semester (PAS) 1", kompetensiDasar: "", semester: 1, jp: 0, bulan: `Des ${tahunAwal}`, type: "pas" },
        { no: "5", materi: "Kesebangunan & Kekongruenan", kompetensiDasar: "Memahami konsep kesebangunan dan kekongruenan bangun datar serta penerapannya dalam pemecahan masalah", semester: 2, jp: 15, bulan: `Jan ${tahunAkhir}` },
        { no: "6", materi: "Bangun Ruang Sisi Lengkung", kompetensiDasar: "Memahami luas permukaan dan volume tabung, kerucut, bola, dan gabungannya serta penerapannya", semester: 2, jp: 20, bulan: `Jan – Feb ${tahunAkhir}` },
        { no: "7", materi: "Statistika", kompetensiDasar: "Memahami penyajian data (tabel, diagram), ukuran pemusatan (mean, median, modus), dan ukuran penyebaran data", semester: 2, jp: 15, bulan: `Mar ${tahunAkhir}` },
        { no: "8", materi: "Peluang", kompetensiDasar: "Memahami ruang sampel, peluang empiris dan teoritis, frekuensi harapan, dan peluang kejadian majemuk", semester: 2, jp: 10, bulan: `Mei ${tahunAkhir}` },
        { no: "–", materi: "Penilaian Tengah Semester (PTS) 2", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Mar ${tahunAkhir}`, type: "pts" },
        { no: "–", materi: "Ujian Sekolah (Kelas 9)", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Apr ${tahunAkhir}`, type: "ujian" },
        { no: "–", materi: "PAT / Kelulusan Kelas 9", kompetensiDasar: "", semester: 2, jp: 0, bulan: `Jun ${tahunAkhir}`, type: "pat" },
      ],
    },
  };
};

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

type KelasKey = "kelas7" | "kelas8" | "kelas9";

const buildWordContent = (
  tahunAwal: string,
  tahunAkhir: string,
  label: string,
  kelas: KelasKey,
  kelasNum: string,
  data: KelasProta
) => {
  const kelasRom = kelasNum === "7" ? "VII" : kelasNum === "8" ? "VIII" : "IX";
  const rows = data.rows
    .map((r, i) => {
      const sem = r.semester === 1
        ? `Ganjil (${tahunAwal})`
        : `Genap (${tahunAkhir})`;
      const isSpecial = r.type && r.type !== "cadangan";
      return `<tr style="background:${isSpecial ? "#fff3cd" : i % 2 === 0 ? "#f8f9fa" : "white"}">
        <td style="border:1px solid #dee2e6;padding:6px 8px;text-align:center;">${r.no}</td>
        <td style="border:1px solid #dee2e6;padding:6px 8px;font-weight:${isSpecial ? "bold" : "normal"};">${isSpecial ? (specialIcon[r.type!] ?? "") + " " : ""}${r.materi}</td>
        <td style="border:1px solid #dee2e6;padding:6px 8px;">${r.kompetensiDasar}</td>
        <td style="border:1px solid #dee2e6;padding:6px 8px;text-align:center;">${sem}</td>
        <td style="border:1px solid #dee2e6;padding:6px 8px;text-align:center;">${r.jp > 0 ? r.jp : "–"}</td>
        <td style="border:1px solid #dee2e6;padding:6px 8px;text-align:center;">${r.bulan}</td>
      </tr>`;
    })
    .join("\n");

  return `<html><head><meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 11pt; margin: 2cm; }
  h2 { text-align: center; font-size: 14pt; margin-bottom: 4px; }
  h3 { text-align: center; font-size: 12pt; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 10pt; }
  th { background: #1a7a6e; color: white; border: 1px solid #dee2e6; padding: 8px; }
  .info-table td { border: none; padding: 3px 8px; }
  .info-table .label { width: 180px; font-weight: bold; }
</style>
</head><body>
<h2>PROGRAM TAHUNAN (PROTA)</h2>
<h3>Matematika SMP Kelas ${kelasRom} · Tahun Pelajaran ${label}</h3>
<table class="info-table" style="margin-bottom:12px;">
  <tr><td class="label">Satuan Pendidikan</td><td>:</td><td>SMP / MTs</td></tr>
  <tr><td class="label">Mata Pelajaran</td><td>:</td><td>Matematika</td></tr>
  <tr><td class="label">Kelas</td><td>:</td><td>${kelasRom} (${kelasNum === "7" ? "Tujuh" : kelasNum === "8" ? "Delapan" : "Sembilan"})</td></tr>
  <tr><td class="label">Tahun Pelajaran</td><td>:</td><td>${label}</td></tr>
  <tr><td class="label">Alokasi Waktu</td><td>:</td><td>5 JP / Minggu (1 JP = 40 menit)</td></tr>
  <tr><td class="label">Total JP Sem. Ganjil</td><td>:</td><td>${data.totalSem1} Jam Pelajaran</td></tr>
  <tr><td class="label">Total JP Sem. Genap</td><td>:</td><td>${data.totalSem2} Jam Pelajaran</td></tr>
  <tr><td class="label">Guru Mata Pelajaran</td><td>:</td><td>___________________________</td></tr>
</table>
<table>
  <thead>
    <tr>
      <th style="width:40px;">No</th>
      <th>Materi Pokok</th>
      <th>Kompetensi Dasar / Tujuan Pembelajaran</th>
      <th style="width:100px;">Semester</th>
      <th style="width:50px;">JP</th>
      <th style="width:110px;">Alokasi Waktu</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
  <tfoot>
    <tr style="background:#d4edda;font-weight:bold;">
      <td colspan="4" style="border:1px solid #dee2e6;padding:6px 8px;text-align:right;">Total JP Semester Ganjil:</td>
      <td style="border:1px solid #dee2e6;padding:6px 8px;text-align:center;">${data.totalSem1}</td>
      <td style="border:1px solid #dee2e6;padding:6px 8px;"></td>
    </tr>
    <tr style="background:#d4edda;font-weight:bold;">
      <td colspan="4" style="border:1px solid #dee2e6;padding:6px 8px;text-align:right;">Total JP Semester Genap:</td>
      <td style="border:1px solid #dee2e6;padding:6px 8px;text-align:center;">${data.totalSem2}</td>
      <td style="border:1px solid #dee2e6;padding:6px 8px;"></td>
    </tr>
  </tfoot>
</table>
<br/>
<p style="font-size:10pt;color:#555;">Catatan: JP = Jam Pelajaran (1 JP = 40 menit). Alokasi waktu bersifat fleksibel dan dapat disesuaikan dengan kondisi sekolah. Kalender mengacu pada Kemendikbudristek ${label}.</p>
<br/><br/>
<table style="width:100%;margin-top:24px;border:none;">
  <tr>
    <td style="width:50%;text-align:center;border:none;">
      <p>Mengetahui,<br/>Kepala Sekolah</p><br/><br/><br/>
      <p>____________________________<br/>NIP. ________________________</p>
    </td>
    <td style="width:50%;text-align:center;border:none;">
      <p>_____________, __________ 20__<br/>Guru Mata Pelajaran Matematika</p><br/><br/><br/>
      <p>____________________________<br/>NIP. ________________________</p>
    </td>
  </tr>
</table>
</body></html>`;
};

const ProtaTahunPage = () => {
  const { tahun } = useParams<{ tahun: string }>();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState<KelasKey>("kelas7");
  const [filterSem, setFilterSem] = useState<"semua" | "1" | "2">("semua");

  const isValid = tahun === "2025-2026" || tahun === "2026-2027";
  if (!isValid) {
    navigate("/ruang-untuk-guru/prota");
    return null;
  }

  const tahunAwal = tahun.split("-")[0];
  const tahunAkhir = tahun.split("-")[1];
  const label = `${tahunAwal} / ${tahunAkhir}`;

  const allData = makeProtaData(tahunAwal, tahunAkhir);
  const data = allData[kelas];
  const kelasNum = kelas.replace("kelas", "");
  const kelasRom = kelasNum === "7" ? "VII" : kelasNum === "8" ? "VIII" : "IX";

  const kelasLabels: { key: KelasKey; label: string }[] = [
    { key: "kelas7", label: "Kelas 7" },
    { key: "kelas8", label: "Kelas 8" },
    { key: "kelas9", label: "Kelas 9" },
  ];

  const filteredRows = data.rows.filter(r =>
    filterSem === "semua" ? true : r.semester === parseInt(filterSem)
  );

  const handlePrintPDF = () => {
    playPopSound();
    const printContent = buildWordContent(tahunAwal, tahunAkhir, label, kelas, kelasNum, data);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 400);
    }
  };

  const handleDownloadWord = () => {
    playPopSound();
    const content = buildWordContent(tahunAwal, tahunAkhir, label, kelas, kelasNum, data);
    const blob = new Blob(["\ufeff", content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PROTA_Matematika_Kelas${kelasNum}_${tahun}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sem1Rows = data.rows.filter(r => r.semester === 1 && (!r.type || r.type === "cadangan"));
  const sem2Rows = data.rows.filter(r => r.semester === 2 && (!r.type || r.type === "cadangan"));
  const totalSem1 = sem1Rows.reduce((s, r) => s + r.jp, 0);
  const totalSem2 = sem2Rows.reduce((s, r) => s + r.jp, 0);

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru/prota" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-14">

        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <CalendarRange className="w-4 h-4" />
            Program Tahunan · Matematika SMP
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            PROTA TAHUN PELAJARAN {label}
          </h1>
          <p className="mt-3 text-sm text-white/60 font-body max-w-2xl mx-auto">
            Distribusi materi pembelajaran Matematika SMP selama satu tahun berdasarkan Kurikulum Merdeka (Fase D) sesuai kalender pendidikan Kemendikbudristek.
          </p>
        </div>

        {/* Print Buttons - top right */}
        <div className="flex justify-end gap-2 mb-5 animate-slide-up">
          <button
            onClick={handleDownloadWord}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-500 border border-blue-400/40 text-white text-xs font-bold transition-all duration-200 hover:scale-[1.03]"
          >
            <FileText className="w-4 h-4" />
            Cetak Word
          </button>
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 border border-rose-400/40 text-white text-xs font-bold transition-all duration-200 hover:scale-[1.03]"
          >
            <Printer className="w-4 h-4" />
            Cetak PDF
          </button>
        </div>

        {/* Kelas Tabs */}
        <div className="flex justify-center gap-2 mb-5 animate-slide-up">
          {kelasLabels.map(k => (
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
        <div className="flex justify-center gap-2 mb-7 animate-slide-up">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-slide-up">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-xs font-body">
            {[
              ["Satuan Pendidikan", "SMP / MTs"],
              ["Mata Pelajaran", "Matematika"],
              ["Kelas", `${kelasNum} (${kelasNum === "7" ? "Tujuh" : kelasNum === "8" ? "Delapan" : "Sembilan"})`],
              ["Tahun Pelajaran", label],
              ["Alokasi Waktu", "5 JP / Minggu (1 JP = 40 menit)"],
              ["Total JP Semester Ganjil", `${data.totalSem1} Jam Pelajaran`],
              ["Total JP Semester Genap", `${data.totalSem2} Jam Pelajaran`],
              ["Guru Mata Pelajaran", "___________________________"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-white/50 w-44 shrink-0">{k}</span>
                <span className="text-white/20 shrink-0">:</span>
                <span className="text-white/80">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-slide-up">
          <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
            <p className="text-cyan-300 text-xs font-bold mb-2 uppercase tracking-wider">📚 Semester Ganjil ({tahunAwal})</p>
            <p className="text-white/60 text-xs font-body">Juli – Desember {tahunAwal}</p>
            <p className="text-white font-bold text-sm mt-1">
              {sem1Rows.filter(r => !r.type).length} Materi Pokok &nbsp;·&nbsp; {totalSem1} JP Efektif
            </p>
          </div>
          <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
            <p className="text-violet-300 text-xs font-bold mb-2 uppercase tracking-wider">📚 Semester Genap ({tahunAkhir})</p>
            <p className="text-white/60 text-xs font-body">Januari – Juni {tahunAkhir}</p>
            <p className="text-white font-bold text-sm mt-1">
              {sem2Rows.filter(r => !r.type).length} Materi Pokok &nbsp;·&nbsp; {totalSem2} JP Efektif
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="animate-slide-up mb-8">
          <h2 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">
            📊 Tabel Program Tahunan — Kelas {kelasNum} | Tahun Pelajaran {label}
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
                        <td className="border border-white/10 px-2 py-2 text-center opacity-60">{row.no}</td>
                        <td colSpan={2} className="border border-white/10 px-3 py-2 font-semibold">
                          {icon} {row.materi}
                        </td>
                        <td className="border border-white/10 px-2 py-2 text-center">{semLabel}</td>
                        <td className="border border-white/10 px-2 py-2 text-center opacity-50">–</td>
                        <td className="border border-white/10 px-2 py-2 text-center text-[10px] opacity-70">{row.bulan}</td>
                      </tr>
                    );
                  }

                  const cadStyle = t === "cadangan" ? "bg-slate-500/10" : ri % 2 === 0 ? "bg-white/3" : "bg-white/0";
                  return (
                    <tr key={ri} className={`border ${cadStyle} hover:bg-white/8 transition-colors`}>
                      <td className="border border-white/10 px-2 py-2 text-center text-white/60">{row.no}</td>
                      <td className="border border-white/10 px-3 py-2 font-semibold text-white">
                        {t === "cadangan" ? <span className="text-slate-300">🔄 {row.materi}</span> : row.materi}
                      </td>
                      <td className="border border-white/10 px-3 py-2 text-white/70 leading-relaxed">{row.kompetensiDasar}</td>
                      <td className="border border-white/10 px-2 py-2 text-center">{semLabel}</td>
                      <td className="border border-white/10 px-2 py-2 text-center font-bold">
                        {row.jp > 0 ? (
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-[11px] ${
                            t === "cadangan" ? "bg-slate-500/40 text-slate-200" : "bg-teal-500/30 text-teal-200"
                          }`}>{row.jp}</span>
                        ) : (
                          <span className="text-white/20">–</span>
                        )}
                      </td>
                      <td className="border border-white/10 px-2 py-2 text-center text-[10px] text-white/60">{row.bulan}</td>
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
                    <td className="border border-white/10 px-2 py-2 text-center text-cyan-300">{data.totalSem1}</td>
                    <td className="border border-white/10 px-2 py-2 text-center text-cyan-200 text-[10px]">Juli – Des {tahunAwal}</td>
                  </tr>
                )}
                {(filterSem === "semua" || filterSem === "2") && (
                  <tr className="bg-violet-900/50 font-bold">
                    <td className="border border-white/10 px-2 py-2" colSpan={4}>
                      <span className="text-violet-300">TOTAL JP SEMESTER GENAP</span>
                    </td>
                    <td className="border border-white/10 px-2 py-2 text-center text-violet-300">{data.totalSem2}</td>
                    <td className="border border-white/10 px-2 py-2 text-center text-violet-200 text-[10px]">Jan – Jun {tahunAkhir}</td>
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
          <p>• Tanggal kegiatan mengacu pada kalender pendidikan Kemendikbudristek tahun pelajaran {label}.</p>
          <p>• Kolom "Cadangan" digunakan untuk remedial, pengayaan, penilaian harian, dan kegiatan insidental.</p>
          {kelas === "kelas9" && (
            <p>• Kelas 9 Semester Genap: JP lebih sedikit karena Ujian Sekolah berlangsung di bulan April. Materi diprioritaskan selesai sebelum ujian.</p>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru/prota"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Menu PROTA
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtaTahunPage;
