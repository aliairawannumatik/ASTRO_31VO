import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, BookOpen, Clock, Info } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

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

const makeGanjil = (tahun: string): Record<"kelas7" | "kelas8" | "kelas9", SemData> => {
  const bulan = [`Jul ${tahun}`, `Ags ${tahun}`, `Sep ${tahun}`, `Okt ${tahun}`, `Nov ${tahun}`, `Des ${tahun}`];
  const y = parseInt(tahun);
  const keyDates = [
    { label: "Masuk Sekolah & MPLS", waktu: `14 Juli ${tahun}`, warna: "text-teal-300" },
    { label: "HUT Kemerdekaan RI", waktu: `17 Agustus ${tahun}`, warna: "text-amber-300" },
    { label: "Maulid Nabi (1 hari)", waktu: tahun === "2025" ? "5 Sep 2025" : "25 Ags 2026", warna: "text-amber-300" },
    { label: "Penilaian Tengah Semester (PTS)", waktu: `Minggu ke-3 September ${tahun}`, warna: "text-rose-300" },
    { label: "ANBK (Asesmen Nasional)", waktu: `Oktober ${tahun}`, warna: "text-violet-300" },
    { label: "Penilaian Akhir Semester (PAS)", waktu: `1–12 Desember ${tahun}`, warna: "text-rose-300" },
    { label: "Pembagian Rapor Semester 1", waktu: `20 Desember ${tahun}`, warna: "text-teal-300" },
    { label: "Libur Akhir Semester 1", waktu: `22 Des ${tahun} – 2 Jan ${y + 1}`, warna: "text-slate-400" },
  ];
  return {
    kelas7: {
      bulan, keyDates, totalJP: 80, mingguEfektif: 16, mingguNonEfektif: 4,
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
    kelas8: {
      bulan, keyDates, totalJP: 80, mingguEfektif: 16, mingguNonEfektif: 4,
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
    kelas9: {
      bulan, keyDates, totalJP: 80, mingguEfektif: 16, mingguNonEfektif: 4,
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
  };
};

const makeGenap = (tahunAkhir: string): Record<"kelas7" | "kelas8" | "kelas9", SemData> => {
  const bulan = [`Jan ${tahunAkhir}`, `Feb ${tahunAkhir}`, `Mar ${tahunAkhir}`, `Apr ${tahunAkhir}`, `Mei ${tahunAkhir}`, `Jun ${tahunAkhir}`];
  const idul = tahunAkhir === "2026"
    ? { pts: "2–6 Mar 2026", fitri: "18–27 Mar 2026", us: "6–17 Apr 2026", pat: "1–12 Jun 2026", rapor: "20 Jun 2026" }
    : { pts: "22–26 Feb 2027", fitri: "6–14 Mar 2027", us: "5–16 Apr 2027", pat: "7–18 Jun 2027", rapor: "19 Jun 2027" };
  const keyDates = [
    { label: `Masuk Sekolah Semester 2`, waktu: `5 Januari ${tahunAkhir}`, warna: "text-teal-300" },
    tahunAkhir === "2026"
      ? { label: "Isra Miraj 1447H", waktu: "16 Feb 2026", warna: "text-amber-300" }
      : { label: "Isra Miraj 1448H", waktu: "26 Jan 2027", warna: "text-amber-300" },
    { label: "Penilaian Tengah Semester (PTS)", waktu: idul.pts, warna: "text-rose-300" },
    tahunAkhir === "2026"
      ? { label: "Awal Ramadan 1447H", waktu: "18 Feb 2026", warna: "text-amber-300" }
      : { label: "Awal Ramadan 1448H", waktu: "7 Feb 2027", warna: "text-amber-300" },
    { label: "Libur Idul Fitri", waktu: idul.fitri, warna: "text-amber-300" },
    { label: "Ujian Sekolah (Kelas 9)", waktu: idul.us, warna: "text-violet-300" },
    { label: "Penilaian Akhir Tahun (PAT)", waktu: idul.pat, warna: "text-rose-300" },
    { label: "Pembagian Rapor / Kenaikan Kelas", waktu: idul.rapor, warna: "text-teal-300" },
  ];
  return {
    kelas7: {
      bulan, keyDates, totalJP: 85, mingguEfektif: 17, mingguNonEfektif: 7,
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
    kelas8: {
      bulan, keyDates, totalJP: 85, mingguEfektif: 17, mingguNonEfektif: 7,
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
    kelas9: {
      bulan, keyDates, totalJP: 60, mingguEfektif: 12, mingguNonEfektif: 12,
      rows: [
        { no: "1", materi: "Kesebangunan & Kekongruenan", tp: "Memahami konsep kesebangunan dan kekongruenan bangun datar serta penerapannya dalam pemecahan masalah", jp: 15, alokasi: [15, null, null, null, null, null] },
        { no: "2", materi: "Bangun Ruang Sisi Lengkung", tp: "Memahami luas permukaan dan volume tabung, kerucut, bola, dan gabungannya", jp: 20, alokasi: [5, 15, null, null, null, null] },
        { no: "3", materi: "Statistika", tp: "Memahami penyajian data, ukuran pemusatan (mean, median, modus), dan ukuran penyebaran", jp: 15, alokasi: [null, 5, 5, 5, null, null] },
        { no: "–", materi: "Penilaian Tengah Semester (PTS)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pts" },
        { no: "–", materi: "Ujian Sekolah (Kelas 9)", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "ujian" },
        { no: "4", materi: "Peluang", tp: "Memahami ruang sampel, peluang empiris dan teoritis, frekuensi harapan, dan kejadian majemuk", jp: 10, alokasi: [null, null, null, null, 10, null] },
        { no: "–", materi: "Penilaian Akhir Tahun (PAT) / Kelulusan", tp: "", jp: 0, alokasi: [null, null, null, null, null, null], type: "pas" },
      ],
    },
  };
};

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

const ProsemTable = ({ data }: { data: SemData }) => {
  const colTotals = Array(6).fill(0);
  data.rows.forEach(r => {
    if (r.type && r.type !== "normal") return;
    r.alokasi.forEach((v, i) => { if (v) colTotals[i] += v; });
  });
  // also count cadangan
  data.rows.forEach(r => {
    if (r.type === "cadangan") {
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
              const label = row.materi;
              const ptsBulan = t === "pts"
                ? data.bulan[2] ?? data.bulan[1]
                : t === "ujian" ? data.bulan[3] : data.bulan[5];
              return (
                <tr key={ri} className={`border ${cls}`}>
                  <td className="border border-white/10 px-2 py-2 text-center opacity-60">{row.no}</td>
                  <td colSpan={2} className="border border-white/10 px-3 py-2 font-semibold">
                    {icon} {label}
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
                <td className="border border-white/10 px-2 py-2 text-center text-white/60">{row.no}</td>
                <td className="border border-white/10 px-3 py-2 font-semibold text-white">{row.materi}</td>
                <td className="border border-white/10 px-3 py-2 text-white/70 leading-relaxed">{row.tp}</td>
                <td className="border border-white/10 px-2 py-2 text-center font-bold text-teal-300">
                  {t === "cadangan" ? row.jp : row.jp}
                </td>
                {row.alokasi.map((v, ai) => (
                  <td key={ai} className="border border-white/10 px-2 py-2 text-center">
                    {v ? (
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-[11px] ${
                        t === "cadangan" ? "bg-slate-500/40 text-slate-200" : "bg-teal-500/30 text-teal-200"
                      }`}>{v}</span>
                    ) : (
                      <span className="text-white/15">–</span>
                    )}
                  </td>
                ))}
                <td className="border border-white/10 px-2 py-2 text-center text-[10px] text-white/40">
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

type KelasKey = "kelas7" | "kelas8" | "kelas9";

const ProsemTahunPage = () => {
  const { tahun } = useParams<{ tahun: string }>();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState<KelasKey>("kelas7");
  const [semester, setSemester] = useState<"ganjil" | "genap">("ganjil");

  const isValid = tahun === "2025-2026" || tahun === "2026-2027";
  if (!isValid) {
    navigate("/ruang-untuk-guru/prosem");
    return null;
  }

  const tahunAwal = tahun.split("-")[0];
  const tahunAkhir = tahun.split("-")[1];
  const label = `${tahunAwal} / ${tahunAkhir}`;

  const ganjilData = makeGanjil(tahunAwal);
  const genapData = makeGenap(tahunAkhir);

  const allData: Record<KelasKey, KelasData> = {
    kelas7: { ganjil: ganjilData.kelas7, genap: genapData.kelas7 },
    kelas8: { ganjil: ganjilData.kelas8, genap: genapData.kelas8 },
    kelas9: { ganjil: ganjilData.kelas9, genap: genapData.kelas9 },
  };

  const semData = allData[kelas][semester];
  const kelasNum = kelas.replace("kelas", "");

  const kelasLabels: { key: KelasKey; label: string }[] = [
    { key: "kelas7", label: "Kelas 7" },
    { key: "kelas8", label: "Kelas 8" },
    { key: "kelas9", label: "Kelas 9" },
  ];

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru/prosem" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-14">

        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <CalendarDays className="w-4 h-4" />
            Program Semester · Matematika SMP
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            PROSEM TAHUN PELAJARAN {label}
          </h1>
          <p className="mt-3 text-sm text-white/60 font-body max-w-2xl mx-auto">
            Distribusi materi pembelajaran Matematika SMP berdasarkan Kurikulum Merdeka (Fase D) sesuai kalender akademik yang berlaku.
          </p>
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

        {/* Semester Tabs */}
        <div className="flex justify-center gap-2 mb-7 animate-slide-up">
          {(["ganjil", "genap"] as const).map(s => (
            <button
              key={s}
              onClick={() => { playPopSound(); setSemester(s); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                semester === s
                  ? "bg-cyan-600 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
              }`}
            >
              Semester {s === "ganjil" ? "Ganjil" : "Genap"}
            </button>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-slide-up">
          {[
            { icon: BookOpen, label: "Mata Pelajaran", value: "Matematika" },
            { icon: CalendarDays, label: "Kelas / Semester", value: `VII${kelasNum === "7" ? "" : kelasNum === "8" ? "I" : "IX"} / ${semester === "ganjil" ? "Ganjil" : "Genap"}` },
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

        {/* Identitas Prosem */}
        <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-4 mb-5 animate-slide-up">
          <p className="text-teal-300 text-xs font-bold mb-3 uppercase tracking-wider">📄 Identitas Program Semester</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-xs font-body">
            {[
              ["Satuan Pendidikan", "SMP / MTs"],
              ["Mata Pelajaran", "Matematika"],
              ["Kelas / Semester", `${kelasNum} (${kelasNum === "7" ? "Tujuh" : kelasNum === "8" ? "Delapan" : "Sembilan"}) / ${semester === "ganjil" ? "Ganjil" : "Genap"}`],
              ["Tahun Pelajaran", label],
              ["Alokasi Waktu", "5 JP / Minggu (1 JP = 40 menit)"],
              ["Minggu Efektif", `${semData.mingguEfektif} Minggu`],
              ["Total JP Efektif", `${semData.totalJP} Jam Pelajaran`],
              ["Guru Mata Pelajaran", "___________________________"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-white/50 w-40 shrink-0">{k}</span>
                <span className="text-white/20 shrink-0">:</span>
                <span className="text-white/80">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kalender Akademik */}
        <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 mb-6 animate-slide-up">
          <p className="text-white/60 text-xs font-bold mb-3 uppercase tracking-wider">📅 Kalender Akademik {semester === "ganjil" ? `Semester 1 – ${tahunAwal}` : `Semester 2 – ${tahunAkhir}`}</p>
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

        {/* PROSEM Table */}
        <div className="animate-slide-up mb-8">
          <h2 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">
            📊 Tabel Program Semester — Kelas {kelasNum} | Semester {semester === "ganjil" ? "Ganjil" : "Genap"} {label}
          </h2>
          <ProsemTable data={semData} />
        </div>

        {/* Notes */}
        <div className="bg-white/3 border border-white/10 rounded-xl p-4 mb-8 text-xs text-white/50 font-body space-y-1.5 animate-slide-up">
          <p className="text-white/70 font-bold text-[11px] uppercase mb-2">📌 Catatan:</p>
          <p>• JP = Jam Pelajaran (1 JP = 40 menit). Matematika SMP dialokasikan 5 JP per minggu.</p>
          <p>• Minggu non-efektif meliputi: MPLS, PTS, PAS/PAT, Ujian Sekolah, libur nasional, dan libur semester.</p>
          <p>• Alokasi waktu bersifat fleksibel dan dapat disesuaikan dengan kondisi sekolah masing-masing.</p>
          <p>• Tanggal libur nasional dan hari efektif mengacu pada kalender pendidikan Kemendikbudristek {label}.</p>
          <p>• Kolom "Cadangan" digunakan untuk remedial, pengayaan, penilaian harian, dan kegiatan insidental.</p>
          {kelas === "kelas9" && semester === "genap" && (
            <p>• Kelas 9 Semester Genap: JP lebih sedikit karena Ujian Sekolah berlangsung April. Materi diprioritaskan selesai sebelum ujian.</p>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru/prosem"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Menu PROSEM
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProsemTahunPage;
