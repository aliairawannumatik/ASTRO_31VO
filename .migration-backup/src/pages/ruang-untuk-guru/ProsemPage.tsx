import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, BookOpen, Clock, Info, Printer, FileDown, Save } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

// ── Types ─────────────────────────────────────────────────────────────────────

type Row = {
  no: string;
  materi: string;
  tp: string;
  jp: number;
  alokasi: (number | null)[];
  type?: "normal" | "pts" | "pas" | "cadangan" | "ujian";
};

type SemData = {
  bulan: string[];
  rows: Row[];
  totalJP: number;
  mingguEfektif: number;
  mingguNonEfektif: number;
  keyDates: { label: string; waktu: string; warna: string }[];
};

type KelasData = { ganjil: SemData; genap: SemData };
type KelasKey = "kelas7" | "kelas8" | "kelas9";

// ── Static defaults ───────────────────────────────────────────────────────────

const TAHUN_AWAL = "2026";
const TAHUN_AKHIR = "2027";
const LABEL = "2026 / 2027";

const ganjilBulan = ["Jul 2026", "Ags 2026", "Sep 2026", "Okt 2026", "Nov 2026", "Des 2026"];
const ganjilKeyDates = [
  { label: "Masuk Sekolah & MPLS", waktu: "14 Juli 2026", warna: "text-teal-300" },
  { label: "HUT Kemerdekaan RI", waktu: "17 Agustus 2026", warna: "text-amber-300" },
  { label: "Maulid Nabi (1 hari)", waktu: "25 Ags 2026", warna: "text-amber-300" },
  { label: "Penilaian Tengah Semester (PTS)", waktu: "Minggu ke-3 September 2026", warna: "text-rose-300" },
  { label: "ANBK (Asesmen Nasional)", waktu: "Oktober 2026", warna: "text-violet-300" },
  { label: "Penilaian Akhir Semester (PAS)", waktu: "1–12 Desember 2026", warna: "text-rose-300" },
  { label: "Pembagian Rapor Semester 1", waktu: "20 Desember 2026", warna: "text-teal-300" },
  { label: "Libur Akhir Semester 1", waktu: "22 Des 2026 – 2 Jan 2027", warna: "text-slate-400" },
];
const genapBulan = ["Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "Mei 2027", "Jun 2027"];
const genapKeyDates = [
  { label: "Masuk Sekolah Semester 2", waktu: "5 Januari 2027", warna: "text-teal-300" },
  { label: "Isra Miraj 1448H", waktu: "26 Jan 2027", warna: "text-amber-300" },
  { label: "Penilaian Tengah Semester (PTS)", waktu: "22–26 Feb 2027", warna: "text-rose-300" },
  { label: "Awal Ramadan 1448H", waktu: "7 Feb 2027", warna: "text-amber-300" },
  { label: "Libur Idul Fitri", waktu: "6–14 Mar 2027", warna: "text-amber-300" },
  { label: "Ujian Sekolah (Kelas 9)", waktu: "5–16 Apr 2027", warna: "text-violet-300" },
  { label: "Penilaian Akhir Tahun (PAT)", waktu: "7–18 Jun 2027", warna: "text-rose-300" },
  { label: "Pembagian Rapor / Kenaikan Kelas", waktu: "19 Jun 2027", warna: "text-teal-300" },
];

const defaultAllData: Record<KelasKey, KelasData> = {
  kelas7: {
    ganjil: {
      bulan: ganjilBulan, keyDates: ganjilKeyDates, totalJP: 80, mingguEfektif: 16, mingguNonEfektif: 4,
      rows: [
        { no: "1", materi: "Bilangan Bulat", tp: "Memahami dan melakukan operasi hitung bilangan bulat beserta sifat-sifatnya", jp: 20, alokasi: [10, 10, null, null, null, null] },
        { no: "2", materi: "Bilangan Rasional", tp: "Memahami bilangan rasional (pecahan) dan melakukan operasi hitung", jp: 15, alokasi: [null, 10, 5, null, null, null] },
        { no: "–", materi: "Penilaian Tengah Semester (PTS)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pts" },
        { no: "3", materi: "Bentuk Aljabar", tp: "Mengenal unsur-unsur bentuk aljabar dan melakukan operasi hitung pada bentuk aljabar", jp: 15, alokasi: [null, null, 5, 10, null, null] },
        { no: "4", materi: "PLSV & PTLSV", tp: "Menyelesaikan persamaan dan pertidaksamaan linear satu variabel dalam kehidupan sehari-hari", jp: 20, alokasi: [null, null, null, 10, 10, null] },
        { no: "–", materi: "Cadangan / Pengayaan / Remedial", tp: "", jp: 10, alokasi: [null, null, null, null, 10, null], type: "cadangan" },
        { no: "–", materi: "Penilaian Akhir Semester (PAS)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pas" },
      ],
    },
    genap: {
      bulan: genapBulan, keyDates: genapKeyDates, totalJP: 85, mingguEfektif: 17, mingguNonEfektif: 7,
      rows: [
        { no: "1", materi: "Perbandingan", tp: "Memahami konsep perbandingan senilai, berbalik nilai, skala, dan penerapannya", jp: 15, alokasi: [15, null, null, null, null, null] },
        { no: "2", materi: "Aritmetika Sosial", tp: "Menyelesaikan masalah jual-beli, diskon, pajak, bruto-netto-tara, dan bunga tunggal", jp: 15, alokasi: [5, 10, null, null, null, null] },
        { no: "3", materi: "Garis dan Sudut", tp: "Memahami jenis-jenis sudut, hubungan antar-garis, dan sifat garis sejajar", jp: 15, alokasi: [null, 10, 5, null, null, null] },
        { no: "–", materi: "Penilaian Tengah Semester (PTS)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pts" },
        { no: "4", materi: "Segitiga dan Segiempat", tp: "Memahami sifat, jenis, keliling, dan luas segitiga serta berbagai jenis segiempat", jp: 20, alokasi: [null, null, null, 10, 10, null] },
        { no: "5", materi: "Himpunan", tp: "Memahami konsep himpunan, operasi himpunan (irisan, gabungan, komplemen), dan penerapannya", jp: 15, alokasi: [null, null, null, 10, 5, null] },
        { no: "–", materi: "Cadangan / Pengayaan / Remedial", tp: "", jp: 5, alokasi: [null, null, null, null, 5, null], type: "cadangan" },
        { no: "–", materi: "Penilaian Akhir Tahun (PAT)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pas" },
      ],
    },
  },
  kelas8: {
    ganjil: {
      bulan: ganjilBulan, keyDates: ganjilKeyDates, totalJP: 80, mingguEfektif: 16, mingguNonEfektif: 4,
      rows: [
        { no: "1", materi: "Pola Bilangan", tp: "Mengenal pola bilangan, barisan aritmetika dan geometri, serta menentukan suku ke-n", jp: 15, alokasi: [10, 5, null, null, null, null] },
        { no: "2", materi: "Koordinat Kartesius", tp: "Memahami posisi titik dalam bidang koordinat Kartesius dan penerapannya", jp: 15, alokasi: [null, 15, null, null, null, null] },
        { no: "–", materi: "Penilaian Tengah Semester (PTS)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pts" },
        { no: "3", materi: "Relasi dan Fungsi", tp: "Memahami relasi, fungsi, notasi fungsi, nilai fungsi, dan grafik fungsi", jp: 15, alokasi: [null, null, 10, 5, null, null] },
        { no: "4", materi: "Persamaan Garis Lurus", tp: "Memahami persamaan garis lurus, gradien, dan hubungan dua garis sejajar/tegak lurus", jp: 20, alokasi: [null, null, null, 15, 5, null] },
        { no: "–", materi: "Cadangan / Pengayaan / Remedial", tp: "", jp: 15, alokasi: [null, null, null, null, 15, null], type: "cadangan" },
        { no: "–", materi: "Penilaian Akhir Semester (PAS)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pas" },
      ],
    },
    genap: {
      bulan: genapBulan, keyDates: genapKeyDates, totalJP: 85, mingguEfektif: 17, mingguNonEfektif: 7,
      rows: [
        { no: "1", materi: "SPLDV", tp: "Menyelesaikan sistem persamaan linear dua variabel dengan metode grafik, substitusi, eliminasi, dan gabungan", jp: 20, alokasi: [15, 5, null, null, null, null] },
        { no: "2", materi: "Teorema Pythagoras", tp: "Memahami dan menggunakan teorema Pythagoras, triple Pythagoras, dan penerapannya", jp: 15, alokasi: [5, 10, null, null, null, null] },
        { no: "3", materi: "Lingkaran", tp: "Memahami unsur lingkaran, keliling, luas, busur, juring, tali busur, dan sudut pusat/keliling", jp: 20, alokasi: [null, 5, 5, 10, null, null] },
        { no: "–", materi: "Penilaian Tengah Semester (PTS)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pts" },
        { no: "4", materi: "Bangun Ruang Sisi Datar", tp: "Memahami sifat, luas permukaan, dan volume kubus, balok, prisma, limas, dan gabungannya", jp: 15, alokasi: [null, null, null, 10, 5, null] },
        { no: "–", materi: "Cadangan / Pengayaan / Remedial", tp: "", jp: 15, alokasi: [null, null, null, null, 15, null], type: "cadangan" },
        { no: "–", materi: "Penilaian Akhir Tahun (PAT)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pas" },
      ],
    },
  },
  kelas9: {
    ganjil: {
      bulan: ganjilBulan, keyDates: ganjilKeyDates, totalJP: 80, mingguEfektif: 16, mingguNonEfektif: 4,
      rows: [
        { no: "1", materi: "Bilangan Berpangkat & Bentuk Akar", tp: "Memahami bilangan berpangkat, sifat operasi, bentuk akar, dan notasi ilmiah", jp: 20, alokasi: [10, 10, null, null, null, null] },
        { no: "2", materi: "Persamaan Kuadrat", tp: "Menyelesaikan persamaan kuadrat dengan pemfaktoran, melengkapi kuadrat, dan rumus kuadratik", jp: 20, alokasi: [null, 10, 10, null, null, null] },
        { no: "–", materi: "Penilaian Tengah Semester (PTS)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pts" },
        { no: "3", materi: "Fungsi Kuadrat", tp: "Memahami grafik fungsi kuadrat, sumbu simetri, titik puncak, dan penerapannya", jp: 15, alokasi: [null, null, null, 15, null, null] },
        { no: "4", materi: "Transformasi Geometri", tp: "Memahami translasi, refleksi, rotasi, dan dilatasi serta komposisinya pada bidang koordinat", jp: 15, alokasi: [null, null, null, 5, 10, null] },
        { no: "–", materi: "Cadangan / Pengayaan / Remedial", tp: "", jp: 10, alokasi: [null, null, null, null, 10, null], type: "cadangan" },
        { no: "–", materi: "Penilaian Akhir Semester (PAS)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pas" },
      ],
    },
    genap: {
      bulan: genapBulan, keyDates: genapKeyDates, totalJP: 60, mingguEfektif: 12, mingguNonEfektif: 12,
      rows: [
        { no: "1", materi: "Kesebangunan & Kekongruenan", tp: "Memahami konsep kesebangunan dan kekongruenan bangun datar serta penerapannya", jp: 15, alokasi: [15, null, null, null, null, null] },
        { no: "2", materi: "Bangun Ruang Sisi Lengkung", tp: "Memahami luas permukaan dan volume tabung, kerucut, bola, dan gabungannya", jp: 20, alokasi: [5, 15, null, null, null, null] },
        { no: "3", materi: "Statistika", tp: "Memahami penyajian data, ukuran pemusatan (mean, median, modus), dan ukuran penyebaran", jp: 15, alokasi: [null, 5, 5, 5, null, null] },
        { no: "–", materi: "Penilaian Tengah Semester (PTS)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pts" },
        { no: "–", materi: "Ujian Sekolah (Kelas 9)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "ujian" },
        { no: "4", materi: "Peluang", tp: "Memahami ruang sampel, peluang empiris dan teoritis, frekuensi harapan, dan kejadian majemuk", jp: 10, alokasi: [null, null, null, null, 10, null] },
        { no: "–", materi: "Penilaian Akhir Tahun (PAT) / Kelulusan", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pas" },
      ],
    },
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const rowStyle: Record<string, string> = {
  pts: "bg-amber-500/20 border-amber-500/40 text-amber-200",
  pas: "bg-rose-500/20 border-rose-500/40 text-rose-200",
  cadangan: "bg-slate-500/15 border-slate-500/30 text-slate-300",
  ujian: "bg-violet-500/20 border-violet-500/40 text-violet-200",
  normal: "bg-white/3 border-white/5 text-white",
};

const specialIcon: Record<string, string> = {
  pts: "📝",
  pas: "📋",
  cadangan: "🔄",
  ujian: "🎓",
};

const STORAGE_KEY = "numatik:prosem:v1";
const kelasLabels: { key: KelasKey; label: string }[] = [
  { key: "kelas7", label: "Kelas 7" },
  { key: "kelas8", label: "Kelas 8" },
  { key: "kelas9", label: "Kelas 9" },
];

// ── Editable ProsemTable ──────────────────────────────────────────────────────

type ProsemTableProps = {
  data: SemData;
  onRowChange: (rowIdx: number, field: keyof Row, value: string | number) => void;
  onAlokasiChange: (rowIdx: number, colIdx: number, value: number | null) => void;
};

const inpCell = "w-full bg-transparent border-b border-white/15 focus:border-teal-400/60 outline-none text-xs text-white/85 font-body py-0.5 transition-colors resize-none";
const inpNormal = "w-full bg-transparent outline-none text-xs text-white/85 font-body resize-none";

const ProsemTable = ({ data, onRowChange, onAlokasiChange }: ProsemTableProps) => {
  const colTotals = Array(6).fill(0);
  data.rows.forEach(r => {
    if (!r.type || r.type === "normal" || r.type === "cadangan") {
      r.alokasi.forEach((v, i) => { if (v) colTotals[i] += v; });
    }
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-xs border-collapse min-w-[720px]">
        <thead>
          <tr className="bg-teal-900/60">
            <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center w-8">No</th>
            <th className="border border-white/10 px-3 py-2 text-teal-300 font-bold text-left min-w-[140px]">Materi Pokok</th>
            <th className="border border-white/10 px-3 py-2 text-teal-300 font-bold text-left min-w-[200px]">Tujuan Pembelajaran</th>
            <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center w-10">JP</th>
            {data.bulan.map(b => (
              <th key={b} className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center w-14">{b}</th>
            ))}
            <th className="border border-white/10 px-2 py-2 text-teal-300 font-bold text-center min-w-[80px]">Ket</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => {
            const t = row.type ?? "normal";
            const cls = rowStyle[t] ?? rowStyle.normal;
            if (t !== "normal" && t !== "cadangan") {
              const icon = specialIcon[t] ?? "📌";
              const ptsBulan = t === "pts"
                ? data.bulan[2] ?? data.bulan[1]
                : t === "ujian" ? data.bulan[3] : data.bulan[5];
              return (
                <tr key={ri} className={`border ${cls}`}>
                  <td className="border border-white/10 px-2 py-2 text-center opacity-60">{row.no}</td>
                  <td colSpan={2} className="border border-white/10 px-3 py-2 font-semibold">
                    <div className="flex items-center gap-2">
                      <span>{icon}</span>
                      <input
                        value={row.materi}
                        onChange={e => onRowChange(ri, "materi", e.target.value)}
                        className={inpNormal + " font-semibold"}
                      />
                    </div>
                  </td>
                  <td className="border border-white/10 px-2 py-2 text-center opacity-50">–</td>
                  {data.bulan.map((b, bi) => (
                    <td key={bi} className="border border-white/10 px-2 py-2 text-center font-bold">
                      {b === ptsBulan ? <span className="opacity-80">✓</span> : <span className="opacity-20">–</span>}
                    </td>
                  ))}
                  <td className="border border-white/10 px-2 py-2 text-center text-[10px] opacity-70">{ptsBulan}</td>
                </tr>
              );
            }
            return (
              <tr key={ri} className={`border ${ri % 2 === 0 ? "bg-white/3" : "bg-white/0"} hover:bg-white/8 transition-colors`}>
                <td className="border border-white/10 px-2 py-1.5">
                  <input
                    value={row.no}
                    onChange={e => onRowChange(ri, "no", e.target.value)}
                    className={inpCell + " text-center text-white/60 w-8"}
                  />
                </td>
                <td className="border border-white/10 px-2 py-1.5">
                  <textarea
                    value={row.materi}
                    onChange={e => onRowChange(ri, "materi", e.target.value)}
                    rows={2}
                    className={inpCell + " font-semibold text-white"}
                  />
                </td>
                <td className="border border-white/10 px-2 py-1.5">
                  <textarea
                    value={row.tp}
                    onChange={e => onRowChange(ri, "tp", e.target.value)}
                    rows={2}
                    className={inpCell + " text-white/70 leading-relaxed"}
                  />
                </td>
                <td className="border border-white/10 px-2 py-1.5 text-center">
                  <input
                    type="number"
                    min={0}
                    value={row.jp}
                    onChange={e => onRowChange(ri, "jp", parseInt(e.target.value) || 0)}
                    className={inpCell + " text-center text-teal-300 font-bold w-10"}
                  />
                </td>
                {row.alokasi.map((v, ai) => (
                  <td key={ai} className="border border-white/10 px-2 py-1.5 text-center">
                    <input
                      type="number"
                      min={0}
                      value={v ?? ""}
                      onChange={e => {
                        const n = e.target.value === "" ? null : parseInt(e.target.value) || 0;
                        onAlokasiChange(ri, ai, n);
                      }}
                      className={inpCell + " text-center text-teal-200 font-bold w-10"}
                      placeholder="–"
                    />
                  </td>
                ))}
                <td className="border border-white/10 px-2 py-1.5 text-center text-[10px] text-white/40">
                  {t === "cadangan" ? "Fleksibel" : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-teal-900/50 font-bold">
            <td className="border border-white/10 px-2 py-2" colSpan={3}>
              <span className="text-teal-300">TOTAL ALOKASI WAKTU</span>
            </td>
            <td className="border border-white/10 px-2 py-2 text-center text-teal-300">{data.totalJP}</td>
            {colTotals.map((v, i) => (
              <td key={i} className="border border-white/10 px-2 py-2 text-center text-teal-200">
                {v > 0 ? v : <span className="text-white/20">–</span>}
              </td>
            ))}
            <td className="border border-white/10 px-2 py-2 text-center text-teal-200">{data.totalJP} JP</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────

const ProsemPage = () => {
  const navigate = useNavigate();
  const [kelas, setKelas] = useState<KelasKey>("kelas7");
  const [semester, setSemester] = useState<"ganjil" | "genap">("ganjil");
  const [saved, setSaved] = useState(false);
  const [guru, setGuru] = useState("");
  const [pageData, setPageData] = useState<Record<KelasKey, KelasData>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(defaultAllData));
    } catch { return JSON.parse(JSON.stringify(defaultAllData)); }
  });

  const semData = pageData[kelas][semester];
  const kelasNum = kelas.replace("kelas", "");
  const kelasRom = kelasNum === "7" ? "VII" : kelasNum === "8" ? "VIII" : "IX";

  const handleRowChange = (rowIdx: number, field: keyof Row, value: string | number) => {
    setPageData(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as Record<KelasKey, KelasData>;
      (next[kelas][semester].rows[rowIdx] as Record<string, unknown>)[field as string] = value;
      return next;
    });
  };

  const handleAlokasiChange = (rowIdx: number, colIdx: number, value: number | null) => {
    setPageData(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as Record<KelasKey, KelasData>;
      next[kelas][semester].rows[rowIdx].alokasi[colIdx] = value;
      return next;
    });
  };

  const handleSave = () => {
    playPopSound();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pageData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePDF = () => {
    playPopSound();
    const prevTitle = document.title;
    document.title = `PROSEM Kelas ${kelasNum} Semester ${semester === "ganjil" ? "Ganjil" : "Genap"} - numatik`;
    window.print();
    window.addEventListener("afterprint", () => { document.title = prevTitle; }, { once: true });
  };

  const handleWord = () => {
    playPopSound();
    const rows = semData.rows.map(r => {
      const t = r.type ?? "normal";
      if (t !== "normal" && t !== "cadangan") {
        return `<tr style="background:#fff3cd"><td style="border:1px solid #ccc;padding:4pt 6pt;text-align:center">${r.no}</td><td colspan="2" style="border:1px solid #ccc;padding:4pt 6pt;font-weight:bold">${specialIcon[t] ?? ""} ${r.materi}</td><td style="border:1px solid #ccc;padding:4pt 6pt;text-align:center">–</td>${r.alokasi.map(v => `<td style="border:1px solid #ccc;padding:4pt 6pt;text-align:center">–</td>`).join("")}<td style="border:1px solid #ccc;padding:4pt 6pt"></td></tr>`;
      }
      return `<tr><td style="border:1px solid #ccc;padding:4pt 6pt;text-align:center">${r.no}</td><td style="border:1px solid #ccc;padding:4pt 6pt;font-weight:bold">${r.materi}</td><td style="border:1px solid #ccc;padding:4pt 6pt">${r.tp}</td><td style="border:1px solid #ccc;padding:4pt 6pt;text-align:center;font-weight:bold;color:#0d7c66">${r.jp}</td>${r.alokasi.map(v => `<td style="border:1px solid #ccc;padding:4pt 6pt;text-align:center">${v ?? "–"}</td>`).join("")}<td style="border:1px solid #ccc;padding:4pt 6pt;text-align:center;font-size:9pt;color:#666">${t === "cadangan" ? "Fleksibel" : ""}</td></tr>`;
    }).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;font-size:10pt;margin:1.5cm}h1{text-align:center;font-size:13pt;font-weight:bold;margin:0 0 4pt}h2{text-align:center;font-size:11pt;margin:0 0 12pt}table{width:100%;border-collapse:collapse;margin-top:10pt}th{background:#0d7c66;color:#fff;font-weight:bold;border:1px solid #ccc;padding:5pt 6pt;text-align:center}</style></head><body><h1>PROGRAM SEMESTER (PROSEM) MATEMATIKA</h1><h2>Kelas ${kelasRom} | Semester ${semester === "ganjil" ? "Ganjil" : "Genap"} | Tahun Pelajaran ${LABEL}</h2><table><thead><tr><th style="width:4%">No</th><th style="width:16%">Materi Pokok</th><th>Tujuan Pembelajaran</th><th style="width:5%">JP</th>${semData.bulan.map(b => `<th style="width:8%">${b}</th>`).join("")}<th style="width:8%">Ket</th></tr></thead><tbody>${rows}</tbody></table><p style="margin-top:10pt;font-size:8pt;color:#888;text-align:center">Dicetak dari Aplikasi NUMATIK — Guru: ${guru || "___________________________"}</p></body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `PROSEM_Kelas${kelasNum}_${semester}_${TAHUN_AWAL}-${TAHUN_AKHIR}.doc`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-14">

        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <CalendarDays className="w-4 h-4" />
            Program Semester · Matematika SMP
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            PROGRAM SEMESTER (PROSEM)
          </h1>
          <p className="mt-3 text-sm text-white/60 font-body max-w-2xl mx-auto">
            Distribusi materi pembelajaran Matematika SMP berdasarkan Kurikulum Merdeka (Fase D) sesuai kalender akademik Tahun Pelajaran {LABEL}.
          </p>
          {/* Top buttons */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-white text-sm font-semibold font-body transition-all hover:scale-105 shadow-lg ${saved ? "bg-emerald-400 border-emerald-300/60" : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500/60"}`}
            >
              <Save className="w-4 h-4" />
              {saved ? "Tersimpan!" : "Simpan"}
            </button>
            <button
              onClick={handlePDF}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 border border-red-400/60 text-white text-sm font-semibold font-body transition-all hover:scale-105 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              Simpan sebagai PDF
            </button>
            <button
              onClick={handleWord}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-400/60 text-white text-sm font-semibold font-body transition-all hover:scale-105 shadow-lg"
            >
              <FileDown className="w-4 h-4" />
              Simpan sebagai Word
            </button>
          </div>
        </div>

        {/* Kelas Tabs */}
        <div className="flex justify-center gap-2 mb-5 animate-slide-up">
          {kelasLabels.map(k => (
            <button key={k.key} onClick={() => { playPopSound(); setKelas(k.key); }}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${kelas === k.key ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"}`}>
              {k.label}
            </button>
          ))}
        </div>

        {/* Semester Tabs */}
        <div className="flex justify-center gap-2 mb-7 animate-slide-up">
          {(["ganjil", "genap"] as const).map(s => (
            <button key={s} onClick={() => { playPopSound(); setSemester(s); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${semester === s ? "bg-cyan-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"}`}>
              Semester {s === "ganjil" ? "Ganjil" : "Genap"}
            </button>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-slide-up">
          {[
            { icon: BookOpen, label: "Mata Pelajaran", value: "Matematika" },
            { icon: CalendarDays, label: "Kelas / Semester", value: `${kelasRom} / ${semester === "ganjil" ? "Ganjil" : "Genap"}` },
            { icon: Clock, label: "JP Tersedia", value: `${semData.mingguEfektif} mgg × 5 JP` },
            { icon: Info, label: "Total JP Efektif", value: `${semData.totalJP} JP` },
          ].map((card, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3">
              <card.icon className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-white/50 uppercase font-bold mb-0.5">{card.label}</div>
                <div className="text-sm font-bold text-white">{card.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Identitas — editable */}
        <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-4 mb-5 animate-slide-up">
          <p className="text-teal-300 text-xs font-bold mb-3 uppercase tracking-wider">📄 Identitas Program Semester</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs font-body">
            {([
              ["Satuan Pendidikan", "SMP / MTs", false],
              ["Mata Pelajaran", "Matematika", false],
              ["Kelas / Semester", `${kelasNum} (${kelasRom === "VII" ? "Tujuh" : kelasRom === "VIII" ? "Delapan" : "Sembilan"}) / ${semester === "ganjil" ? "Ganjil" : "Genap"}`, false],
              ["Tahun Pelajaran", LABEL, false],
              ["Alokasi Waktu", "5 JP / Minggu (1 JP = 40 menit)", false],
              ["Minggu Efektif", `${semData.mingguEfektif} Minggu`, false],
            ] as [string, string, boolean][]).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-white/50 w-40 shrink-0">{k}</span>
                <span className="text-white/20 shrink-0">:</span>
                <span className="text-white/80">{v}</span>
              </div>
            ))}
            <div className="flex gap-2 items-center">
              <span className="text-white/50 w-40 shrink-0">Guru Mata Pelajaran</span>
              <span className="text-white/20 shrink-0">:</span>
              <input
                value={guru}
                onChange={e => setGuru(e.target.value)}
                placeholder="Tulis nama guru..."
                className="flex-1 bg-transparent border-b border-white/20 focus:border-teal-400/60 outline-none text-white/80 py-0.5 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Kalender Akademik */}
        <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 mb-6 animate-slide-up">
          <p className="text-white/60 text-xs font-bold mb-3 uppercase tracking-wider">
            📅 Kalender Akademik {semester === "ganjil" ? `Semester 1 – ${TAHUN_AWAL}` : `Semester 2 – ${TAHUN_AKHIR}`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {semData.keyDates.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-white/20 shrink-0 mt-0.5">▸</span>
                <span className="text-white/60 shrink-0">{d.label}:</span>
                <span className={`${d.warna} font-semibold`}>{d.waktu}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PROSEM Table — editable */}
        <div className="animate-slide-up mb-8">
          <h2 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">
            📊 Tabel Program Semester — Kelas {kelasNum} | Semester {semester === "ganjil" ? "Ganjil" : "Genap"} {LABEL}
          </h2>
          <p className="text-xs text-cyan-300/60 mb-3">✏️ Klik sel untuk mengedit langsung. Klik <strong>Simpan</strong> setelah selesai.</p>
          <ProsemTable data={semData} onRowChange={handleRowChange} onAlokasiChange={handleAlokasiChange} />
        </div>

        {/* Notes */}
        <div className="bg-white/3 border border-white/10 rounded-xl p-4 mb-8 text-xs text-white/50 font-body space-y-1.5 animate-slide-up">
          <p className="text-white/70 font-bold text-[11px] uppercase mb-2">📌 Catatan:</p>
          <p>• JP = Jam Pelajaran (1 JP = 40 menit). Matematika SMP dialokasikan 5 JP per minggu.</p>
          <p>• Minggu non-efektif meliputi: MPLS, PTS, PAS/PAT, Ujian Sekolah, libur nasional, dan libur semester.</p>
          <p>• Alokasi waktu bersifat fleksibel dan dapat disesuaikan dengan kondisi sekolah masing-masing.</p>
          <p>• Tanggal libur nasional dan hari efektif mengacu pada kalender pendidikan Kemendikbudristek {LABEL}.</p>
          <p>• Kolom "Cadangan" digunakan untuk remedial, pengayaan, penilaian harian, dan kegiatan insidental.</p>
          {kelas === "kelas9" && semester === "genap" && (
            <p>• Kelas 9 Semester Genap: JP lebih sedikit karena Ujian Sekolah berlangsung April. Materi diprioritaskan selesai sebelum ujian.</p>
          )}
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

export default ProsemPage;
