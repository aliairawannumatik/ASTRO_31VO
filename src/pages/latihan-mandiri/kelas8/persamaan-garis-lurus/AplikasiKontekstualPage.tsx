import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import CoordPlane from "../koordinat-cartesius/CoordPlane";
import { contextualIllustrations } from "./ContextualIllustrations";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Tarif Taksi Online", {
    type: "mixed",
    diagram: {
      size: 260, range: 6, lightBg: true,
      segs: [{ x1: 0, y1: 1, x2: 5, y2: 6, color: "#2563eb", label: "Tarif" }],
      pts: [
        { x: 0, y: 1, label: "(0,10rb)", color: "#2563eb", labelPos: "tr" },
        { x: 5, y: 6, label: "(5km,60rb)", color: "#2563eb", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 1, y: 5, text: "sumbu-x: jarak (km)", color: "rgba(0,0,0,0.45)", size: 8 },
        { x: -2, y: 3, text: "sumbu-y: tarif (×10rb)", color: "rgba(0,0,0,0.45)", size: 8 },
      ],
    },
    content: "Tarif taksi online: Rp10.000 biaya awal ditambah Rp10.000 per km.",
    parts: [
      { label: "a.", math: "\\text{Tuliskan persamaan tarif: } T = f(x)" },
      { label: "b.", math: "\\text{Berapa tarif untuk perjalanan 8 km?}" },
      { label: "c.", math: "\\text{Berapa km jika tarif Rp65.000?}" },
    ],
  }),

  Q(2, "Harga Paket Data", {
    type: "mixed",
    diagram: {
      size: 260, range: 6, lightBg: true,
      segs: [{ x1: 0, y1: 1, x2: 5, y2: 6, color: "#0ea5e9", label: "Harga" }],
      pts: [
        { x: 0, y: 1, label: "(0GB,3rb)", color: "#0ea5e9", labelPos: "tl" },
        { x: 5, y: 6, label: "(5GB,28rb)", color: "#0ea5e9", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 1, y: 5, text: "sumbu-x: jumlah GB", color: "rgba(0,0,0,0.45)", size: 8 },
        { x: -2, y: 3, text: "sumbu-y: harga (×5rb)", color: "rgba(0,0,0,0.45)", size: 8 },
      ],
    },
    content: "Harga paket data: Rp5.000 per GB ditambah biaya admin Rp3.000.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan harga } H \\text{ untuk } g \\text{ GB.}" },
      { label: "b.", math: "\\text{Berapa harga untuk 10 GB?}" },
      { label: "c.", math: "\\text{Berapa GB yang didapat dengan Rp28.000?}" },
      { label: "d.", text: "Gambarkan grafik hubungan jumlah GB dan harga." },
    ],
  }),

  Q(4, "UN 2019 — Biaya Produksi", {
    type: "mixed",
    diagram: {
      size: 260, range: 6, lightBg: true,
      segs: [{ x1: 0, y1: 1, x2: 5, y2: 5.5, color: "#64748b", label: "Biaya" }],
      pts: [
        { x: 0, y: 1, label: "(0,200rb)", color: "#64748b", labelPos: "tl" },
        { x: 5, y: 5.5, label: "(100,700rb)", color: "#64748b", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 1, y: 5, text: "sumbu-x: jumlah barang (×20)", color: "rgba(0,0,0,0.45)", size: 8 },
        { x: -2, y: 3, text: "sumbu-y: biaya (×100rb)", color: "rgba(0,0,0,0.45)", size: 8 },
      ],
    },
    content: "Biaya produksi x barang adalah B(x) = 5000x + 200.000 (dalam rupiah).",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan 5000x dalam konteks ini?" },
      { label: "b.", text: "Apa yang dimaksud dengan 200.000 dalam konteks ini?" },
      { label: "c.", math: "\\text{Berapa biaya produksi 100 barang?}" },
      { label: "d.", math: "\\text{Berapa barang yang bisa diproduksi dengan anggaran Rp950.000?}" },
    ],
  }),

  Q(5, "Tabungan Bertambah Rutin", {
    type: "mixed",
    diagram: {
      size: 260, range: 6, lightBg: true,
      segs: [{ x1: 0, y1: 1, x2: 5, y2: 6, color: "#ca8a04", label: "Tabungan" }],
      pts: [
        { x: 0, y: 1, label: "(0, 50rb)", color: "#ca8a04", labelPos: "tr" },
        { x: 4, y: 5, label: "(4bln, 250rb)", color: "#ca8a04", labelPos: "tr" },
      ],
    },
    content: "Riko menabung Rp50.000/bulan. Tabungan awal Rp50.000.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan tabungan } T \\text{ setelah } n \\text{ bulan.}" },
      { label: "b.", math: "\\text{Berapa tabungan setelah 1 tahun?}" },
      { label: "c.", math: "\\text{Kapan tabungan mencapai Rp500.000?}" },
    ],
  }),

  Q(6, "Penurunan Nilai Barang", {
    type: "mixed",
    diagram: {
      size: 260, range: 8, lightBg: true,
      segs: [{ x1: 0, y1: 8, x2: 6, y2: 2, color: "#dc2626", label: "Nilai" }],
      pts: [
        { x: 0, y: 8, label: "(0,8jt)", color: "#dc2626", labelPos: "tl" },
        { x: 6, y: 2, label: "(6th,2jt)", color: "#dc2626", labelPos: "br" },
      ],
      extraTexts: [
        { x: 2, y: -6, text: "sumbu-x: tahun", color: "rgba(0,0,0,0.45)", size: 8 },
        { x: -3, y: 4, text: "sumbu-y: nilai (×1jt)", color: "rgba(0,0,0,0.45)", size: 8 },
      ],
    },
    content: "Nilai sebuah laptop mula-mula Rp8.000.000. Nilainya turun Rp1.000.000 per tahun.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan nilai } V \\text{ setelah } t \\text{ tahun.}" },
      { label: "b.", math: "\\text{Berapa nilai laptop setelah 3 tahun?}" },
      { label: "c.", math: "\\text{Kapan nilai laptop menjadi Rp2.000.000?}" },
      { label: "d.", text: "Apakah nilai laptop bisa menjadi negatif? Jelaskan batasan modelnya!" },
    ],
  }),

  Q(7, "Isi Bahan Bakar", {
    type: "mixed",
    diagram: {
      size: 260, range: 6, lightBg: true,
      segs: [{ x1: 0, y1: 6, x2: 6, y2: 0, color: "#db2777", label: "BBM" }],
      pts: [
        { x: 0, y: 6, label: "(0, 60L)", color: "#db2777", labelPos: "tr" },
        { x: 6, y: 0, label: "(600km, 0)", color: "#db2777", labelPos: "top" },
      ],
    },
    content: "Tangki sepeda motor berisi 60 liter. Konsumsi BBM 10 km per liter.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan sisa BBM } S \\text{ setelah menempuh } d \\text{ km.}" },
      { label: "b.", math: "\\text{Berapa sisa BBM setelah 250 km?}" },
      { label: "c.", math: "\\text{Kapan tangki habis (S = 0)?}" },
    ],
  }),

  Q(8, "Grafik Populasi Linier", {
    type: "mixed",
    diagram: {
      size: 260, range: 8, lightBg: true,
      segs: [{ x1: 0, y1: 5, x2: 6, y2: 6.2, color: "#16a34a", label: "Populasi" }],
      pts: [
        { x: 0, y: 5, label: "(2020,5000)", color: "#16a34a", labelPos: "tl" },
        { x: 6, y: 6.2, label: "(2026,6200)", color: "#16a34a", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 2, y: -6, text: "sumbu-x: tahun sejak 2020", color: "rgba(0,0,0,0.45)", size: 8 },
        { x: -3, y: 3, text: "sumbu-y: populasi (×1000)", color: "rgba(0,0,0,0.45)", size: 8 },
      ],
    },
    content: "Populasi desa pada tahun 2020 adalah 5.000 jiwa. Bertambah 200 jiwa per tahun.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan populasi } P \\text{ pada tahun ke-} t \\text{ sejak 2020.}" },
      { label: "b.", math: "\\text{Berapa populasi pada tahun 2030?}" },
      { label: "c.", math: "\\text{Kapan populasi mencapai 8.000 jiwa?}" },
    ],
  }),

  Q(9, "Harga Tiket Masuk", {
    type: "mixed",
    diagram: {
      size: 260, range: 8, lightBg: true,
      segs: [{ x1: 0, y1: 2, x2: 5, y2: 7, color: "#d97706", label: "Biaya" }],
      pts: [
        { x: 0, y: 2, label: "(0,10rb)", color: "#d97706", labelPos: "tl" },
        { x: 5, y: 7, label: "(5org,35rb)", color: "#d97706", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 1, y: -6, text: "sumbu-x: jumlah orang", color: "rgba(0,0,0,0.45)", size: 8 },
        { x: -3, y: 4, text: "sumbu-y: biaya (×5rb)", color: "rgba(0,0,0,0.45)", size: 8 },
      ],
    },
    content: "Harga tiket masuk taman: Rp5.000 per orang + biaya parkir Rp10.000.",
    parts: [
      { label: "a.", math: "\\text{Tulis total biaya } C \\text{ untuk } n \\text{ orang.}" },
      { label: "b.", math: "\\text{Berapa total biaya untuk keluarga 5 orang?}" },
      { label: "c.", text: "Jika anggaran keluarga Rp60.000, berapa banyak orang yang bisa masuk?" },
    ],
  }),

  Q(10, "Debit Air — Volume dan Waktu", {
    type: "mixed",
    diagram: {
      size: 260, range: 12, lightBg: true,
      segs: [{ x1: 0, y1: 10, x2: 10, y2: 5, color: "#0284c7", label: "Volume" }],
      pts: [
        { x: 0, y: 10, label: "(0,500L)", color: "#0284c7", labelPos: "tl" },
        { x: 10, y: 5, label: "(10mnt,250L)", color: "#0284c7", labelPos: "br" },
      ],
      extraTexts: [
        { x: 3, y: -9, text: "sumbu-x: waktu (menit)", color: "rgba(0,0,0,0.45)", size: 8 },
        { x: -6, y: 6, text: "sumbu-y: volume (×50L)", color: "rgba(0,0,0,0.45)", size: 8 },
      ],
    },
    content: "Bak air berisi 500 liter. Air keluar dengan kecepatan konstan 25 liter/menit.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan volume } V \\text{ setelah } t \\text{ menit.}" },
      { label: "b.", math: "\\text{Berapa volume setelah 10 menit?}" },
      { label: "c.", math: "\\text{Kapan bak kosong?}" },
      { label: "d.", text: "Gambarkan grafik volume vs waktu. Apa jenis gradiennya?" },
    ],
  }),

  Q(11, "Grafik Dua Tarif — Titik Kesamaan", {
    type: "mixed",
    diagram: {
      size: 260, range: 6, lightBg: true,
      segs: [
        { x1: 0, y1: 2, x2: 5, y2: 7, color: "#db2777", label: "Tarif A" },
        { x1: 0, y1: 4, x2: 5, y2: 5.5, color: "#2563eb", label: "Tarif B" },
      ],
      pts: [{ x: 4, y: 6, label: "Titik sama", color: "#ca8a04", labelPos: "tl" }],
    },
    content: "Tarif A: Rp20.000 awal + Rp10.000/km. Tarif B: Rp40.000 awal + Rp5.000/km.",
    parts: [
      { label: "a.", text: "Tulis persamaan tarif A dan tarif B." },
      { label: "b.", text: "Pada jarak berapa km kedua tarif sama?" },
      { label: "c.", text: "Untuk jarak lebih dari titik kesamaan, tarif mana yang lebih murah?" },
    ],
  }),

  Q(12, "TKA — Gaji dan Bonus", {
    type: "mixed",
    diagram: {
      size: 260, range: 8, lightBg: true,
      segs: [{ x1: 0, y1: 4, x2: 6, y2: 7, color: "#059669", label: "Gaji" }],
      pts: [
        { x: 0, y: 4, label: "(0,2jt)", color: "#059669", labelPos: "tl" },
        { x: 6, y: 7, label: "(30unit,3.5jt)", color: "#059669", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 1, y: -6, text: "sumbu-x: unit terjual (×5)", color: "rgba(0,0,0,0.45)", size: 8 },
        { x: -3, y: 5, text: "sumbu-y: gaji (×500rb)", color: "rgba(0,0,0,0.45)", size: 8 },
      ],
    },
    content: "Gaji seorang karyawan: Rp2.000.000 per bulan + bonus Rp50.000 per unit terjual.",
    parts: [
      { label: "a.", math: "\\text{Tulis persamaan total penghasilan } G \\text{ untuk } u \\text{ unit.}" },
      { label: "b.", math: "\\text{Berapa penghasilan jika menjual 30 unit?}" },
      { label: "c.", math: "\\text{Berapa unit harus dijual agar penghasilan Rp4.500.000?}" },
    ],
  }),

  Q(13, "ANBK — Soal Kontekstual Pilih Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 12, lightBg: true,
      segs: [{ x1: 0, y1: 8, x2: 3, y2: 11, color: "#65a30d", label: "Luas Panen" }],
      pts: [
        { x: 0, y: 8, label: "(2019,400ha)", color: "#65a30d", labelPos: "tl" },
        { x: 3, y: 11, label: "(2022,550ha)", color: "#65a30d", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 1, y: -9, text: "sumbu-x: tahun sejak 2019", color: "rgba(0,0,0,0.45)", size: 8 },
        { x: -6, y: 3, text: "sumbu-y: luas panen (×50ha)", color: "rgba(0,0,0,0.45)", size: 8 },
      ],
    },
    content: "Dinas pertanian mencatat luas panen jagung (hektar) setiap tahun: 2019: 400, 2020: 450, 2021: 500, 2022: 550.",
    parts: [
      { label: "a.", text: "Apakah data ini membentuk pola linier? Jelaskan!" },
      { label: "b.", math: "\\text{Tuliskan persamaan garis (tahun sebagai } x, \\text{ luas sebagai } y\\text{).}" },
      { label: "c.", math: "\\text{Prediksi luas panen tahun 2025.}" },
    ],
  }),

  Q(14, "Tarif Telepon", {
    type: "mixed",
    diagram: {
      size: 260, range: 10, lightBg: true,
      segs: [
        { x1: 0, y1: 0, x2: 2, y2: 5, color: "#7c3aed", label: "0–10mnt" },
        { x1: 2, y1: 5, x2: 5, y2: 9.5, color: "#f97316", label: ">10mnt" },
      ],
      pts: [
        { x: 2, y: 5, label: "(10mnt,5rb)", color: "#7c3aed", labelPos: "tl" },
        { x: 5, y: 9.5, label: "(25mnt,9.5rb)", color: "#f97316", labelPos: "tr" },
      ],
      extraTexts: [
        { x: 1, y: -8, text: "sumbu-x: menit (×5)", color: "rgba(0,0,0,0.45)", size: 8 },
        { x: -5, y: 5, text: "sumbu-y: biaya (×1rb)", color: "rgba(0,0,0,0.45)", size: 8 },
      ],
    },
    content: "Tarif telepon: Rp500/menit untuk 10 menit pertama, kemudian Rp300/menit.",
    parts: [
      { label: "a.", text: "Berapa biaya untuk percakapan 10 menit?" },
      { label: "b.", math: "\\text{Tulis persamaan biaya } B \\text{ untuk } t > 10 \\text{ menit.}" },
      { label: "c.", math: "\\text{Berapa biaya untuk percakapan 25 menit?}" },
    ],
  }),

  Q(15, "Tantangan — Model Matematika Dunia Nyata", {
    type: "mixed",
    diagram: {
      size: 260, range: 6, lightBg: true,
      segs: [
        { x1: 0, y1: 2, x2: 4, y2: 6, color: "#059669", label: "Toko A" },
        { x1: 0, y1: 5, x2: 4, y2: 5, color: "#db2777", label: "Toko B" },
      ],
      pts: [
        { x: 3, y: 5, label: "Sama", color: "#ca8a04", labelPos: "tl" },
      ],
    },
    content: "Toko A menjual buah: Rp20.000/kg + Rp20.000 ongkos kirim. Toko B: Rp50.000 flat untuk berapapun kg.",
    parts: [
      { label: "a.", text: "Tulis persamaan biaya Toko A dan Toko B." },
      { label: "b.", text: "Pada berapa kg pembelian biaya kedua toko sama?" },
      { label: "c.", text: "Jika membeli 2 kg, mana yang lebih murah? Dan jika 4 kg?" },
      { label: "d.", text: "Gambarkan grafik kedua toko dan beri kesimpulan strategi pembelian." },
    ],
  }),
];

const AplikasiKontekstualPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-purple-400 text-xs font-body">15 Soal Latihan</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            APLIKASI PERSAMAAN GARIS PADA SOAL KONTEKSTUAL
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Persamaan Garis Lurus · UN / TKA / ANBK</p>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-slate-900/40 to-violet-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className="text-purple-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
                  {q.content && (
                    <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                  )}
                  {q.math && (
                    <div className="text-white/90 text-sm mt-1"><InlineMath math={q.math} /></div>
                  )}
                </div>
              </div>

              {contextualIllustrations[q.n] && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
                    {contextualIllustrations[q.n]({})}
                  </div>
                </div>
              )}

              {q.diagram && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-lg">
                    <CoordPlane {...q.diagram} />
                  </div>
                </div>
              )}

              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((p, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className="text-purple-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{p.label}</span>
                      <div className="text-white/75 text-sm font-body leading-relaxed">
                        {p.math ? <InlineMath math={p.math} /> : <span>{p.text}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Persamaan Garis Lurus
          </button>
        </div>
      </div>
    </div>
  );
};

export default AplikasiKontekstualPage;
