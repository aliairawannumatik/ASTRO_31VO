import { useEffect, useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  Brain, ChevronRight, FileText, Lightbulb, BookOpen, Target,
  ChevronDown, ChevronUp, Info, Layers, Award, BarChart2, ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";

const packages = [
  { id: 1, label: "Paket 1", path: "/tka/paket-1", soal: 30 },
  { id: 2, label: "Paket 2", path: "/tka/paket-2", soal: 30 },
  { id: 3, label: "Paket 3", path: "/tka/paket-3", soal: 30 },
  { id: 4, label: "Paket 4", path: "/tka/paket-4", soal: 30 },
  { id: 5, label: "Paket 5", path: "/tka/paket-5", soal: 30 },
];

const InfoSection = ({
  id, open, onToggle, icon, title, accent, children,
}: {
  id: string; open: boolean; onToggle: (id: string) => void;
  icon: React.ReactNode; title: string; accent: string; children: React.ReactNode;
}) => (
  <div className={`rounded-xl overflow-hidden border transition-all duration-200 ${open ? `border-${accent}-400/40` : "border-white/10"} bg-white/5 backdrop-blur`}>
    <button
      onClick={() => { playPopSound(); onToggle(id); }}
      className="w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-body text-sm font-semibold text-white">{title}</span>
      </div>
      {open
        ? <ChevronUp className={`w-4 h-4 text-${accent}-400`} />
        : <ChevronDown className="w-4 h-4 text-white/30" />}
    </button>
    {open && <div className="px-4 pb-4">{children}</div>}
  </div>
);

const TKAPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>([]);

  const toggle = (id: string) =>
    setOpen(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-2xl w-full px-4 py-10">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/10">
            <Brain className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center tracking-wide">
            TES KEMAMPUAN AKADEMIK
          </h1>
          <p className="text-white/50 text-xs text-center font-body max-w-xs">
            Pemantapan &amp; Persiapan TKA — Matematika Kelas IX
          </p>
          <div className="mt-4 flex gap-5 items-center">
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <FileText className="w-3.5 h-3.5" />
              <span>5 Paket Soal</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <Target className="w-3.5 h-3.5" />
              <span>150 Soal Total</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kelas IX</span>
            </div>
          </div>
        </div>

        {/* ── INFO SECTIONS ── */}
        <div className="flex flex-col gap-2.5 mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-cyan-400/50 text-xs font-body font-semibold tracking-widest uppercase">Tentang TKA</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* 1. Definisi */}
          <InfoSection id="definisi" open={open.includes("definisi")} onToggle={toggle}
            icon={<Info className="w-4.5 h-4.5 text-cyan-400 shrink-0" />}
            title="Definisi Tes Kemampuan Akademik"
            accent="cyan">
            <p className="font-body text-sm text-white/80 leading-relaxed">
              Sebagaimana TKA Matematika SD/MI/sederajat, TKA Matematika SMP/MTs/sederajat juga mengukur kemampuan murid dalam memahami <strong className="text-cyan-300">fakta, konsep, prinsip, dan prosedur matematika</strong>, serta kemampuan mereka dalam menerapkan pengetahuan matematika untuk menyelesaikan masalah <strong className="text-cyan-300">(problem solving)</strong>.
            </p>
          </InfoSection>

          {/* 2. Muatan */}
          <InfoSection id="muatan" open={open.includes("muatan")} onToggle={toggle}
            icon={<Layers className="w-4.5 h-4.5 text-violet-400 shrink-0" />}
            title="Muatan Tes Kemampuan Akademik"
            accent="violet">
            <div className="space-y-3">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Muatan TKA Matematika SMP/MTs/sederajat merujuk pada elemen kurikulum atau materi matematika yang dipelajari murid yang ada pada <strong className="text-violet-300">Kurikulum 2013</strong> dan <strong className="text-violet-300">Kurikulum Merdeka</strong>. Elemen ini meliputi:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Bilangan", icon: "🔢", color: "blue" },
                  { label: "Aljabar", icon: "🔣", color: "purple" },
                  { label: "Geometri dan Pengukuran", icon: "📐", color: "green" },
                  { label: "Data dan Peluang", icon: "📊", color: "orange" },
                ].map(e => (
                  <div key={e.label} className={`bg-${e.color}-500/10 border border-${e.color}-500/20 rounded-lg px-3 py-2.5 flex items-center gap-2`}>
                    <span className="text-base">{e.icon}</span>
                    <span className="font-body text-xs text-white/80 font-semibold">{e.label}</span>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-white/55 leading-relaxed">
                Penggunaan logika matematika diintegrasikan langsung dengan elemen matematika yang tertera dalam kurikulum. Pengetahuan matematika diukur melalui permasalahan dalam konteks matematika dan permasalahan dalam konteks keseharian yang dapat meliputi kejadian atau situasi di lingkup personal, keluarga, atau lingkungan sekitar yang bersifat lokal.
              </p>
            </div>
          </InfoSection>

          {/* 3. Kompetensi */}
          <InfoSection id="kompetensi" open={open.includes("kompetensi")} onToggle={toggle}
            icon={<Award className="w-4.5 h-4.5 text-amber-400 shrink-0" />}
            title="Kompetensi"
            accent="amber">
            <div className="space-y-3">
              <p className="font-body text-xs text-white/50 leading-relaxed">
                TKA Matematika SMP/MTs mengukur tiga level kompetensi kognitif berikut:
              </p>
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full text-xs font-body">
                  <thead>
                    <tr className="bg-amber-500/15 border-b border-white/10">
                      <th className="text-left px-3 py-2.5 text-amber-300 font-bold">Level Kognitif</th>
                      <th className="text-left px-3 py-2.5 text-amber-300 font-bold">Deskripsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        level: "Memahami",
                        desc: "Menguasai fakta, konsep, prinsip, dan prosedur matematika; mengenali, mengidentifikasi, dan mengklasifikasikan situasi atau representasi matematika.",
                      },
                      {
                        level: "Mengaplikasikan",
                        desc: "Menerapkan pengetahuan matematika pada situasi atau konteks yang diberikan; memilih dan menggunakan cara penyelesaian yang sesuai.",
                      },
                      {
                        level: "Bernalar Tinggi",
                        desc: "Memecahkan masalah non-rutin; menganalisis, mengevaluasi, membuat generalisasi, menyusun argumen, dan menarik kesimpulan secara logis.",
                      },
                    ].map((r, i) => (
                      <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/3" : ""}`}>
                        <td className="px-3 py-2.5 font-bold text-amber-200 whitespace-nowrap align-top">{r.level}</td>
                        <td className="px-3 py-2.5 text-white/70 leading-relaxed">{r.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full text-xs font-body">
                  <thead>
                    <tr className="bg-amber-500/15 border-b border-white/10">
                      <th className="text-left px-3 py-2.5 text-amber-300 font-bold">Bentuk Soal</th>
                      <th className="text-left px-3 py-2.5 text-amber-300 font-bold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { bentuk: "Pilihan Ganda Sederhana (PGS)", ket: "Hanya memiliki satu jawaban benar." },
                      { bentuk: "Pilihan Ganda Kompleks MCMA", ket: "Bisa memiliki lebih dari satu jawaban benar." },
                      { bentuk: "Pilihan Ganda Kompleks Kategori", ket: "Berisi beberapa pernyataan yang semuanya harus diberi respons (benar/salah, sesuai/tidak sesuai)." },
                    ].map((r, i) => (
                      <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/3" : ""}`}>
                        <td className="px-3 py-2.5 font-semibold text-white/80 whitespace-nowrap align-top">{r.bentuk}</td>
                        <td className="px-3 py-2.5 text-white/60 leading-relaxed">{r.ket}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <a
                href="https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/smp"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400/70 hover:text-amber-300 transition-colors font-body"
              >
                <ExternalLink className="w-3 h-3" /> Lihat sumber resmi Pusmendik
              </a>
            </div>
          </InfoSection>

          {/* 4. Matriks Asesmen */}
          <InfoSection id="matriks" open={open.includes("matriks")} onToggle={toggle}
            icon={<BarChart2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />}
            title="Matriks Asesmen"
            accent="emerald">
            <div className="space-y-3">
              <p className="font-body text-xs text-white/50 leading-relaxed">
                Distribusi muatan materi TKA Matematika SMP/MTs berdasarkan elemen kurikulum dan sub-materinya:
              </p>
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full text-xs font-body">
                  <thead>
                    <tr className="bg-emerald-500/15 border-b border-white/10">
                      <th className="text-center px-2 py-2.5 text-emerald-300 font-bold w-8">No</th>
                      <th className="text-left px-3 py-2.5 text-emerald-300 font-bold">Elemen</th>
                      <th className="text-left px-3 py-2.5 text-emerald-300 font-bold">Sub Elemen / Sub Materi</th>
                      <th className="text-left px-3 py-2.5 text-emerald-300 font-bold">Kompetensi yang Diukur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        no: 1,
                        elemen: "Bilangan",
                        sub: "Bilangan Real",
                        kompetensi: "Memahami, mengaplikasikan, dan bernalar tinggi untuk: (a) perbandingan & sifat bilangan; (b) operasi aritmetika; (c) estimasi; (d) faktorisasi prima; (e) rasio — skala, proporsi, laju perubahan; (f) perbandingan senilai & berbalik nilai.",
                        color: "blue",
                      },
                      {
                        no: 2,
                        elemen: "Aljabar",
                        sub: "Persamaan & Pertidaksamaan Linear",
                        kompetensi: "Persamaan linear satu variabel; persamaan & pertidaksamaan linear; sistem persamaan linear dua variabel (SPLDV).",
                        color: "purple",
                      },
                      {
                        no: 3,
                        elemen: "Aljabar",
                        sub: "Fungsi & Relasi",
                        kompetensi: "Konsep fungsi, relasi, dan grafik fungsi linear.",
                        color: "purple",
                      },
                      {
                        no: 4,
                        elemen: "Aljabar",
                        sub: "Pola & Barisan",
                        kompetensi: "Pola bilangan, barisan aritmetika, dan barisan geometri.",
                        color: "purple",
                      },
                      {
                        no: 5,
                        elemen: "Geometri & Pengukuran",
                        sub: "Bangun Datar & Bangun Ruang",
                        kompetensi: "Luas, keliling, volume bangun datar dan ruang; teorema Pythagoras; kesebangunan dan kekongruenan.",
                        color: "green",
                      },
                      {
                        no: 6,
                        elemen: "Geometri & Pengukuran",
                        sub: "Transformasi Geometri",
                        kompetensi: "Translasi, refleksi, rotasi, dan dilatasi.",
                        color: "green",
                      },
                      {
                        no: 7,
                        elemen: "Data & Peluang",
                        sub: "Statistika Dasar",
                        kompetensi: "Mean, median, modus; penyajian data dalam tabel dan diagram.",
                        color: "orange",
                      },
                      {
                        no: 8,
                        elemen: "Data & Peluang",
                        sub: "Peluang",
                        kompetensi: "Peluang kejadian sederhana dan majemuk.",
                        color: "orange",
                      },
                    ].map((r, i) => (
                      <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/3" : ""}`}>
                        <td className="px-2 py-2.5 text-center text-white/40 align-top">{r.no}</td>
                        <td className={`px-3 py-2.5 font-bold text-${r.color}-300 whitespace-nowrap align-top`}>{r.elemen}</td>
                        <td className="px-3 py-2.5 text-white/80 font-semibold align-top whitespace-nowrap">{r.sub}</td>
                        <td className="px-3 py-2.5 text-white/60 leading-relaxed">{r.kompetensi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2.5">
                <p className="font-body text-xs text-white/60 leading-relaxed">
                  <strong className="text-emerald-300">Catatan:</strong> Tidak ada perbedaan antara soal TKA Kurikulum Merdeka dan Kurikulum 2013, karena penyusunan soal TKA sudah mempertimbangkan materi dari kedua kurikulum tersebut.
                </p>
              </div>
              <a
                href="https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/smp"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400/70 hover:text-emerald-300 transition-colors font-body"
              >
                <ExternalLink className="w-3 h-3" /> Lihat sumber resmi Pusmendik
              </a>
            </div>
          </InfoSection>
        </div>

        {/* ── Modul Pemantapan ── */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.30s" }}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-cyan-400/50 text-xs font-body font-semibold tracking-widest uppercase">Modul Pemantapan</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={() => { playPopSound(); navigate("/tka/modul-pemantapan"); }}
            className="group w-full flex items-center gap-4
              bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-cyan-400/5
              border border-cyan-400/35 rounded-xl px-5 py-4
              hover:from-cyan-500/25 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10
              transition-all duration-300 cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              bg-gradient-to-br from-cyan-400/25 to-blue-500/10 border border-cyan-400/40 group-hover:border-cyan-400/70 transition-colors">
              <BookOpen className="w-5 h-5 text-cyan-300" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-cyan-400/50 font-body uppercase tracking-wider">Materi &amp; Latihan Dasar</span>
              <p className="font-body text-sm font-bold text-cyan-200 group-hover:text-cyan-100 transition-colors">
                Modul Pemantapan TKA
              </p>
            </div>
            <span className="text-xs font-body text-cyan-300/70 border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 rounded-full shrink-0">
              28 Topik
            </span>
            <ChevronRight className="w-4 h-4 shrink-0 text-cyan-400/50 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* ── Paket Latihan Section ── */}
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/40 text-xs font-body font-semibold tracking-widest uppercase">Paket Latihan</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col gap-2.5">
            {packages.map((pkg, i) => (
              <button
                key={pkg.id}
                onClick={() => { playPopSound(); navigate(pkg.path); }}
                className="group flex items-center gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3.5
                  hover:bg-cyan-500/8 hover:border-cyan-400/40 hover:shadow-md hover:shadow-cyan-500/5
                  transition-all duration-250 cursor-pointer text-left animate-slide-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0
                  bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors">
                  <span className="font-display text-[10px] text-cyan-400/60 leading-none">No.</span>
                  <span className="font-display text-base font-bold text-cyan-300 leading-tight">{String(pkg.id).padStart(2, "0")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-white/30 font-body uppercase tracking-wider">Latihan TKA</span>
                  <p className="font-body text-sm font-semibold text-white group-hover:text-cyan-100 transition-colors truncate">
                    {pkg.label}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-[10px] text-white/30 font-body">Jumlah Soal</span>
                  <span className="text-sm font-bold font-body text-cyan-300">{pkg.soal}</span>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Tips & Panduan ── */}
        <div className="animate-slide-up" style={{ animationDelay: "0.60s" }}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400/50 text-xs font-body font-semibold tracking-widest uppercase">Tips &amp; Panduan</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={() => { playPopSound(); navigate("/tka/tips"); }}
            className="group w-full flex items-center gap-4
              bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-400/5
              border border-amber-400/35 rounded-xl px-5 py-4
              hover:from-amber-500/25 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10
              transition-all duration-300 cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              bg-gradient-to-br from-amber-400/25 to-yellow-500/10 border border-amber-400/40 group-hover:border-amber-400/70 transition-colors">
              <Lightbulb className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-amber-400/50 font-body uppercase tracking-wider">Panduan Ujian</span>
              <p className="font-body text-sm font-bold text-amber-200 group-hover:text-amber-100 transition-colors">
                Tips Menghadapi TKA
              </p>
            </div>
            <span className="text-xs font-body text-amber-300/70 border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 rounded-full shrink-0">
              10 Tips
            </span>
            <ChevronRight className="w-4 h-4 shrink-0 text-amber-400/50 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKAPage;
