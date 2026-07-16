import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import {
  ArrowLeft,
  BookOpenCheck,
  GraduationCap,
  Layers,
  ListChecks,
  School,
  Save,
  Plus,
  Trash2,
  FileDown,
  FileText,
} from "lucide-react";

const defaultAtpElements = [
  {
    no: "1",
    element: "Bilangan",
    cp: "Peserta didik dapat membaca, menulis, dan membandingkan bilangan bulat, bilangan rasional dan irasional, bilangan desimal, bilangan berpangkat bulat dan akar, bilangan dalam notasi ilmiah. Mereka dapat menerapkan operasi aritmetika pada bilangan real, dan memberikan estimasi/perkiraan dalam menyelesaikan masalah termasuk berkaitan dengan literasi finansial. Peserta didik dapat menggunakan faktorisasi prima dan pengertian rasio skala, proporsi, dan laju perubahan dalam penyelesaian masalah.",
    tp: [
      "Peserta didik dapat membaca, menulis dan membandingkan bilangan bulat.",
      "Peserta didik dapat membaca, menulis dan membandingkan bilangan rasional dan irasional.",
      "Peserta didik dapat membaca, menulis dan membandingkan bilangan desimal.",
      "Peserta didik dapat membaca, menulis dan membandingkan bilangan berpangkat bulat.",
      "Peserta didik dapat membaca, menulis dan membandingkan akar.",
      "Peserta didik dapat membaca, menulis dan membandingkan bilangan dalam notasi ilmiah.",
      "Peserta didik dapat menerapkan operasi aritmatika pada bilangan real.",
      "Peserta didik dapat memberikan estimasi atau perkiraan dalam menyelesaikan masalah termasuk berkaitan dengan literasi finansial.",
      "Peserta didik dapat menggunakan faktorisasi prima.",
      "Peserta didik dapat menggunakan rasio skala, proporsi dan laju perubahan dalam penyelesaian masalah.",
    ],
  },
  {
    no: "2",
    element: "Aljabar",
    cp: "Peserta didik dapat mengenali, memprediksi dan menggeneralisasi pola dalam bentuk susunan benda dan bilangan. Mereka dapat menyatakan suatu situasi ke dalam bentuk aljabar. Mereka dapat menggunakan sifat-sifat operasi komutatif, asosiatif, dan distributif untuk menghasilkan bentuk aljabar yang ekuivalen. Peserta didik dapat memahami relasi dan fungsi domain, kodomain, range serta menyajikannya dalam bentuk diagram panah, tabel, himpunan pasangan berurutan, dan grafik. Mereka dapat membedakan beberapa fungsi nonlinear dari fungsi linear secara grafik. Mereka dapat menyelesaikan persamaan dan pertidaksamaan linear satu variabel. Mereka dapat menyajikan, menganalisis, dan menyelesaikan masalah dengan menggunakan relasi, fungsi, dan persamaan linear. Mereka dapat menyelesaikan sistem persamaan linear dua variabel melalui beberapa cara untuk penyelesaian masalah.",
    tp: [
      "Peserta didik dapat mengenali pola dalam bentuk susunan benda dan bilangan.",
      "Peserta didik dapat memprediksi pola dalam bentuk susunan benda dan bilangan.",
      "Peserta didik dapat menggeneralisasi pola dalam bentuk susunan benda dan bilangan.",
      "Peserta didik dapat menyatakan suatu situasi ke dalam bentuk aljabar.",
      "Peserta didik dapat menggunakan sifat-sifat operasi komutatif, asosiatif, dan distributif untuk menghasilkan bentuk aljabar yang ekuivalen.",
      "Peserta didik dapat memahami relasi dan fungsi domain, kodomain, range.",
      "Peserta didik dapat menyajikan relasi dan fungsi dalam bentuk diagram panah, tabel, himpunan pasangan berurutan.",
      "Peserta didik dapat menyajikan relasi dan fungsi dalam bentuk grafik.",
      "Peserta didik dapat membedakan beberapa fungsi nonlinear dari fungsi linear secara grafik.",
      "Peserta didik dapat menyajikan persamaan linear.",
      "Peserta didik dapat menyelesaikan persamaan dan pertidaksamaan linear satu variabel.",
      "Peserta didik dapat menganalisis relasi, fungsi dan persamaan linear.",
      "Peserta didik dapat menyelesaikan masalah dengan menggunakan relasi, fungsi, dan persamaan linear.",
      "Peserta didik dapat menyelesaikan sistem persamaan linear dua variabel melalui beberapa cara untuk penyelesaian masalah.",
    ],
  },
  {
    no: "3",
    element: "Pengukuran",
    cp: "Peserta didik dapat menjelaskan cara untuk menentukan luas lingkaran dan menyelesaikan masalah yang terkait. Mereka dapat menjelaskan cara untuk menentukan luas permukaan dan volume bangun ruang prisma, tabung, bola, limas dan kerucut dan menyelesaikan masalah yang terkait. Peserta didik dapat menjelaskan pengaruh perubahan secara proporsional dari bangun datar dan bangun ruang terhadap ukuran panjang, besar sudut, luas, dan/atau volume.",
    tp: [
      "Peserta didik dapat menjelaskan cara untuk menentukan luas lingkaran.",
      "Peserta didik dapat menyelesaikan masalah yang berkaitan dengan luas lingkaran.",
      "Peserta didik dapat menjelaskan cara untuk menentukan luas permukaan bangun ruang sisi datar prisma dan limas.",
      "Peserta didik dapat menjelaskan cara untuk menentukan luas permukaan bangun ruang sisi lengkung tabung, bola dan kerucut.",
      "Peserta didik dapat menjelaskan cara untuk menentukan volume bangun ruang sisi datar prisma dan limas.",
      "Peserta didik dapat menjelaskan cara untuk menentukan volume bangun ruang sisi lengkung tabung, bola dan kerucut.",
      "Peserta didik dapat menyelesaikan masalah yang berkaitan dengan bangun ruang sisi datar prisma dan limas.",
      "Peserta didik dapat menyelesaikan masalah yang berkaitan dengan bangun ruang sisi lengkung tabung, bola dan kerucut.",
      "Peserta didik dapat menjelaskan pengaruh perubahan secara proporsional dari bangun datar dan bangun ruang terhadap ukuran panjang.",
      "Peserta didik dapat menjelaskan pengaruh perubahan secara proporsional dari bangun datar dan bangun ruang terhadap besar sudut.",
      "Peserta didik dapat menjelaskan pengaruh perubahan secara proporsional dari bangun datar dan bangun ruang terhadap luas.",
      "Peserta didik dapat menjelaskan pengaruh perubahan secara proporsional dari bangun datar dan bangun ruang terhadap volume.",
    ],
  },
  {
    no: "4",
    element: "Geometri",
    cp: "Peserta didik dapat membuat jaring-jaring bangun ruang prisma, tabung, limas dan kerucut dan membuat bangun ruang dari jaring-jaringnya. Peserta didik dapat menggunakan hubungan antar-sudut yang terbentuk oleh dua garis yang berpotongan, dan oleh dua garis sejajar yang dipotong sebuah garis transversal untuk menyelesaikan masalah termasuk menentukan jumlah besar sudut dalam sebuah segitiga dan menentukan besar sudut yang belum diketahui pada sebuah segitiga. Mereka dapat menjelaskan sifat-sifat kekongruenan dan kesebangunan pada segitiga dan segiempat, dan menggunakannya untuk menyelesaikan masalah. Mereka dapat menunjukkan kebenaran teorema Pythagoras dan menggunakannya dalam menyelesaikan masalah termasuk jarak antara dua titik pada bidang koordinat Kartesius. Peserta didik dapat melakukan transformasi tunggal refleksi, translasi, rotasi, dan dilatasi titik, garis, dan bangun datar pada bidang koordinat Kartesius dan menggunakannya untuk menyelesaikan masalah.",
    tp: [
      "Peserta didik dapat membuat jaring-jaring bangun ruang sisi datar kubus, balok, prisma dan limas.",
      "Peserta didik dapat membuat jaring-jaring bangun ruang sisi lengkung tabung, kerucut dan bola.",
      "Peserta didik dapat membuat bangun ruang sisi datar dari jaring-jaringnya.",
      "Peserta didik dapat membuat bangun ruang sisi lengkung dari jaring-jaringnya.",
      "Peserta didik dapat menggunakan hubungan antar-sudut yang terbentuk oleh dua garis yang berpotongan untuk menyelesaikan masalah.",
      "Peserta didik dapat menggunakan hubungan antar-sudut yang terbentuk oleh dua garis sejajar yang dipotong sebuah garis transversal untuk menyelesaikan masalah.",
      "Peserta didik dapat menentukan jumlah besar sudut dalam sebuah segitiga.",
      "Peserta didik dapat menentukan besar sudut yang belum diketahui pada sebuah segitiga.",
      "Peserta didik dapat menjelaskan sifat-sifat kekongruenan pada segitiga.",
      "Peserta didik dapat menjelaskan sifat-sifat kekongruenan pada segiempat.",
      "Peserta didik dapat menjelaskan sifat-sifat kesebangunan pada segitiga.",
      "Peserta didik dapat menjelaskan sifat-sifat kesebangunan pada segiempat.",
      "Peserta didik dapat menggunakan sifat-sifat kekongruenan dan kesebangunan untuk menyelesaikan masalah.",
      "Peserta didik dapat menunjukkan kebenaran teorema Pythagoras.",
      "Peserta didik dapat menggunakan teorema Pythagoras dalam menyelesaikan masalah termasuk jarak antara dua titik pada bidang koordinat Kartesius.",
      "Peserta didik dapat melakukan transformasi tunggal refleksi titik, garis, dan bangun datar pada bidang koordinat Kartesius.",
      "Peserta didik dapat melakukan transformasi tunggal translasi titik, garis, dan bangun datar pada bidang koordinat Kartesius.",
      "Peserta didik dapat melakukan transformasi tunggal rotasi titik, garis, dan bangun datar pada bidang koordinat Kartesius.",
      "Peserta didik dapat melakukan transformasi tunggal dilatasi titik, garis, dan bangun datar pada bidang koordinat Kartesius.",
    ],
  },
  {
    no: "5",
    element: "Analisis Data dan Peluang",
    cp: "Peserta didik dapat merumuskan pertanyaan, mengumpulkan, menyajikan, dan menganalisis data untuk menjawab pertanyaan. Mereka dapat menggunakan diagram batang dan diagram lingkaran untuk menyajikan dan menginterpretasi data. Mereka dapat mengambil sampel yang mewakili suatu populasi untuk mendapatkan data yang terkait dengan diri dan lingkungan mereka. Mereka dapat menentukan dan menafsirkan rerata mean, median, modus, dan jangkauan range dari data tersebut untuk menyelesaikan masalah termasuk membandingkan suatu data terhadap kelompoknya, membandingkan dua kelompok data, memprediksi, membuat keputusan. Mereka dapat menyelidiki kemungkinan adanya perubahan pengukuran pusat tersebut akibat perubahan data. Peserta didik dapat menjelaskan dan menggunakan pengertian peluang dan frekuensi relatif untuk menentukan frekuensi harapan satu kejadian pada suatu percobaan sederhana semua hasil percobaan dapat muncul secara merata.",
    tp: [
      "Peserta didik dapat merumuskan pertanyaan penelitian yang relevan berdasarkan topik yang dipilih.",
      "Peserta didik dapat mengumpulkan dan menyajikan data dengan cara yang sistematis dan terstruktur.",
      "Peserta didik dapat menyajikan data.",
      "Peserta didik dapat menganalisis data.",
      "Peserta didik dapat menggunakan diagram batang dan diagram lingkaran untuk menyajikan dan menginterpretasi data.",
      "Peserta didik dapat mengambil sampel yang mewakili suatu populasi untuk mendapatkan data yang terkait dengan diri dan lingkungan.",
      "Peserta didik dapat menentukan dan menafsirkan rerata mean dari data tersebut untuk menyelesaikan masalah.",
      "Peserta didik dapat menafsirkan median dari data tersebut untuk menyelesaikan masalah.",
      "Peserta didik dapat menafsirkan modus dari data tersebut untuk menyelesaikan masalah.",
      "Peserta didik dapat menafsirkan jangkauan range dari data tersebut untuk menyelesaikan masalah.",
      "Peserta didik dapat membandingkan suatu data terhadap kelompoknya.",
      "Peserta didik dapat membandingkan dua kelompok data.",
      "Peserta didik dapat memprediksi dan membuat keputusan dari suatu data.",
      "Peserta didik dapat menyelidiki kemungkinan adanya perubahan pengukuran pusat tersebut akibat perubahan data.",
      "Peserta didik dapat menjelaskan dan menggunakan pengertian peluang untuk menentukan frekuensi harapan satu kejadian pada suatu percobaan sederhana.",
      "Peserta didik dapat menjelaskan dan menggunakan pengertian frekuensi relatif untuk menentukan frekuensi harapan satu kejadian pada suatu percobaan sederhana.",
    ],
  },
];

const classFlow = [
  {
    grade: "Kelas 7",
    focus: "Fondasi bilangan, rasio, aljabar awal, persamaan linear satu variabel, dan sudut.",
    items: ["Bilangan bulat, rasional, desimal, dan operasi bilangan real", "Estimasi, faktorisasi prima, rasio, skala, proporsi, dan laju perubahan", "Bentuk aljabar, sifat operasi, persamaan dan pertidaksamaan linear satu variabel", "Hubungan antar-sudut dan sudut pada segitiga"],
  },
  {
    grade: "Kelas 8",
    focus: "Penguatan pola, fungsi, SPLDV, pengukuran, geometri bangun ruang, Pythagoras, dan data.",
    items: ["Pola bilangan dan generalisasi", "Relasi, fungsi, grafik, persamaan linear, dan SPLDV", "Luas lingkaran, bangun ruang sisi datar, perubahan proporsional panjang/sudut/luas", "Jaring-jaring bangun ruang sisi datar dan Teorema Pythagoras", "Merumuskan, mengumpulkan, menyajikan, dan menganalisis data"],
  },
  {
    grade: "Kelas 9",
    focus: "Pendalaman akar, notasi ilmiah, bangun ruang sisi lengkung, kesebangunan, transformasi, statistika, dan peluang.",
    items: ["Akar dan bilangan dalam notasi ilmiah", "Luas permukaan dan volume bangun ruang sisi lengkung", "Kesebangunan, kekongruenan, dan transformasi pada bidang koordinat", "Sampel, mean, median, modus, jangkauan, perbandingan data, keputusan berbasis data", "Peluang, frekuensi relatif, dan frekuensi harapan"],
  },
];

const STORAGE_KEY = "numatik_atp_data";

const dokumenStyle = `
  @page { size: 21.5cm 33cm; margin: 3cm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5; color: #000; background: #fff; margin: 0; padding: 0; }
  h1 { text-align: center; font-size: 16pt; font-weight: bold; margin: 0 0 6pt 0; font-family: Arial, sans-serif; }
  h2 { font-size: 13pt; font-weight: bold; margin: 14pt 0 6pt 0; font-family: Arial, sans-serif; }
  h3 { font-size: 12pt; font-weight: bold; margin: 10pt 0 4pt 0; font-family: Arial, sans-serif; }
  .header { text-align: center; margin-bottom: 18pt; border-bottom: 2px solid #000; padding-bottom: 10pt; }
  .subtitle { font-size: 11pt; margin: 3pt 0; text-align: center; }
  .identitas { border: 1px solid #aaa; padding: 10pt; margin-bottom: 14pt; }
  .identitas p { margin: 4pt 0; text-align: left; }
  .elemen { border: 1px solid #aaa; padding: 10pt 12pt; margin-bottom: 12pt; page-break-inside: avoid; }
  .elemen-no { font-size: 10pt; color: #555; margin: 0 0 3pt 0; }
  .elemen-judul { font-weight: bold; font-size: 13pt; margin: 0 0 8pt 0; }
  .cp-box { background: #f9f9f9; border: 1px solid #ddd; padding: 8pt; margin-bottom: 8pt; text-align: justify; }
  .cp-label { font-weight: bold; font-size: 10pt; margin: 0 0 4pt 0; }
  .tp-label { font-weight: bold; font-size: 10pt; margin: 0 0 4pt 0; }
  ol { margin: 0; padding-left: 18pt; }
  ol li { text-align: justify; margin-bottom: 3pt; }
  .footer { text-align: center; margin-top: 18pt; font-size: 9pt; color: #666; border-top: 1px solid #ccc; padding-top: 8pt; }
`;

type AtpElement = { no: string; element: string; cp: string; tp: string[] };

const ATPPage = () => {
  const navigate = useNavigate();
  const [atpData, setAtpData] = useState<AtpElement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultAtpElements;
    } catch {
      return defaultAtpElements;
    }
  });
  const [saved, setSaved] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const totalTp = atpData.reduce((acc, el) => acc + el.tp.length, 0);

  const handleTpChange = (elIdx: number, tpIdx: number, value: string) => {
    setAtpData((prev) => {
      const next = prev.map((el, i) =>
        i === elIdx ? { ...el, tp: el.tp.map((t, j) => (j === tpIdx ? value : t)) } : el
      );
      return next;
    });
    setSaved(false);
  };

  const handleAddTp = (elIdx: number) => {
    setAtpData((prev) =>
      prev.map((el, i) =>
        i === elIdx ? { ...el, tp: [...el.tp, ""] } : el
      )
    );
    setSaved(false);
  };

  const handleDeleteTp = (elIdx: number, tpIdx: number) => {
    setAtpData((prev) =>
      prev.map((el, i) =>
        i === elIdx ? { ...el, tp: el.tp.filter((_, j) => j !== tpIdx) } : el
      )
    );
    setSaved(false);
  };

  const handleSave = () => {
    playPopSound();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atpData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const buildDokumenBody = () => `
    <div class="header">
      <h1>ALUR TUJUAN PEMBELAJARAN MATEMATIKA</h1>
      <p class="subtitle">Fase D — Kurikulum Merdeka dengan Pendekatan Deep Learning</p>
      <p class="subtitle">SMP/MTs/Program Paket B</p>
    </div>
    <div class="identitas">
      <h2 style="margin-top:0;">Identitas Dokumen</h2>
      <p><strong>Mata Pelajaran:</strong> Matematika</p>
      <p><strong>Fase:</strong> D</p>
      <p><strong>Tahun Pelajaran:</strong> 2025 - 2026</p>
      <p><strong>Jumlah Elemen:</strong> ${atpData.length} elemen pembelajaran</p>
      <p><strong>Jumlah TP:</strong> ${totalTp} tujuan pembelajaran</p>
    </div>
    ${atpData.map((item) => `
      <div class="elemen">
        <p class="elemen-no">Elemen ${item.no}</p>
        <p class="elemen-judul">${item.element}</p>
        <div class="cp-box">
          <p class="cp-label">Capaian Pembelajaran:</p>
          <p style="margin:0;text-align:justify;">${item.cp}</p>
        </div>
        <p class="tp-label">Tujuan Pembelajaran (${item.tp.length} TP):</p>
        <ol>${item.tp.map((tp) => `<li>${tp}</li>`).join("")}</ol>
      </div>
    `).join("")}
    <div class="footer">
      <p>Dokumen ini dicetak dari Aplikasi NUMATIK — Numerasi Aktif dengan Teknologi Informasi dan Komunikasi</p>
    </div>
  `;

  const handlePrintPDF = async () => {
    playPopSound();
    setPdfLoading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const styleNoPage = dokumenStyle.replace(/@page\s*\{[^}]*\}/g, "");
      const container = document.createElement("div");
      container.style.cssText = "position:fixed;top:-9999px;left:0;width:794px;background:#fff;color:#000;";
      container.innerHTML = `<style>${styleNoPage}</style><div style="padding:60px 80px;font-family:Arial,sans-serif;font-size:12pt;line-height:1.5;">${buildDokumenBody()}</div>`;
      document.body.appendChild(container);
      try {
        const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: "#fff", windowWidth: 794 });
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pdfW = pdf.internal.pageSize.getWidth();
        const pdfH = pdf.internal.pageSize.getHeight();
        const imgData = canvas.toDataURL("image/png");
        const imgH = (canvas.height * pdfW) / canvas.width;
        let heightLeft = imgH;
        let yPos = 0;
        pdf.addImage(imgData, "PNG", 0, yPos, pdfW, imgH);
        heightLeft -= pdfH;
        while (heightLeft > 0) {
          yPos -= pdfH;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, yPos, pdfW, imgH);
          heightLeft -= pdfH;
        }
        pdf.save("Alur_Tujuan_Pembelajaran_Matematika.pdf");
      } finally {
        document.body.removeChild(container);
      }
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrintWord = () => {
    playPopSound();
    const html = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>ATP (NUMATIK)</title><style>${dokumenStyle}</style></head><body>${buildDokumenBody()}</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Alur_Tujuan_Pembelajaran_Matematika.doc";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <GraduationCap className="w-4 h-4" />
            ATP Matematika Fase D
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            Alur Tujuan Pembelajaran
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            Konten ATP ini disusun dari dokumen Analisis Capaian Pembelajaran ke Tujuan Pembelajaran Matematika SMPN 28 Bandung.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg ${saved ? "bg-emerald-400 border-emerald-300/60" : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500/60"}`}
            >
              <Save className="w-4 h-4" />
              {saved ? "Tersimpan!" : "Simpan"}
            </button>
            <button
              onClick={handlePrintPDF}
              disabled={pdfLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 border border-red-400/60 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-wait disabled:scale-100"
            >
              <FileDown className="w-4 h-4" />
              {pdfLoading ? "Membuat PDF..." : "Simpan sebagai PDF"}
            </button>
            <button
              onClick={handlePrintWord}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-400/60 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <FileText className="w-4 h-4" />
              Simpan sebagai Word
            </button>
          </div>
        </div>

        <section className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl border border-cyan-200/25 bg-card/80 backdrop-blur p-5 md:col-span-2">
            <School className="w-8 h-8 text-cyan-200 mb-3" />
            <h2 className="font-display text-xl font-bold text-cyan-100 mb-3">Identitas Dokumen</h2>
            <div className="space-y-2 text-sm text-white/75 font-body">
              <p><span className="text-white font-semibold">Mata Pelajaran:</span> Matematika</p>
              <p><span className="text-white font-semibold">Fase:</span> D</p>
              <p><span className="text-white font-semibold">Tahun Pelajaran:</span> 2025 - 2026</p>
            </div>
          </div>
          <div className="rounded-2xl border border-yellow-200/25 bg-yellow-400/10 backdrop-blur p-5">
            <Layers className="w-8 h-8 text-yellow-200 mb-3" />
            <p className="text-3xl font-display font-bold text-white">{atpData.length}</p>
            <p className="text-sm text-white/70">Elemen pembelajaran</p>
          </div>
          <div className="rounded-2xl border border-fuchsia-200/25 bg-fuchsia-400/10 backdrop-blur p-5">
            <ListChecks className="w-8 h-8 text-fuchsia-200 mb-3" />
            <p className="text-3xl font-display font-bold text-white">{totalTp}</p>
            <p className="text-sm text-white/70">Tujuan pembelajaran</p>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card/85 backdrop-blur p-5 md:p-7 mb-6">
          <div className="flex items-start gap-3 mb-5">
            <BookOpenCheck className="w-8 h-8 text-emerald-200 shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-emerald-100">Ringkasan Alur per Kelas</h2>
              <p className="text-sm text-white/65 mt-1">Ringkasan ini membantu membaca sebaran tujuan pembelajaran dari kelas 7 sampai kelas 9.</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {classFlow.map((flow) => (
              <div key={flow.grade} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="font-display text-xl font-bold text-primary mb-2">{flow.grade}</h3>
                <p className="text-sm text-white/70 mb-4">{flow.focus}</p>
                <ul className="space-y-2 text-sm text-white/75 list-disc pl-5">
                  {flow.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 mb-8">
          <div className="text-center mb-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-cyan-100">Analisis CP ke TP</h2>
            <p className="text-sm text-white/65 mt-2">Klik setiap elemen untuk membuka dan mengedit tujuan pembelajaran.</p>
          </div>
          {atpData.map((item, elIdx) => (
            <details key={item.element} className="group rounded-3xl border border-cyan-200/25 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10 backdrop-blur p-5 md:p-6">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-xl font-display font-bold text-primary shrink-0">
                    {item.no}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white">{item.element}</h3>
                    <p className="text-xs md:text-sm text-white/60">{item.tp.length} tujuan pembelajaran</p>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-cyan-100 group-open:bg-cyan-400/15">
                    Buka Detail
                  </span>
                </div>
              </summary>
              <div className="mt-5 grid lg:grid-cols-[1fr_1.2fr] gap-5">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <h4 className="font-display font-bold text-yellow-100 mb-3">Capaian Pembelajaran</h4>
                  <p className="text-sm leading-relaxed text-white/75 font-body">{item.cp}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <h4 className="font-display font-bold text-emerald-100 mb-3">Tujuan Pembelajaran</h4>
                  <ol className="space-y-2 list-decimal pl-5">
                    {item.tp.map((tp, tpIdx) => (
                      <li key={tpIdx} className="text-sm text-white/75 font-body">
                        <div className="flex items-start gap-2">
                          <textarea
                            value={tp}
                            onChange={(e) => handleTpChange(elIdx, tpIdx, e.target.value)}
                            rows={2}
                            className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white/90 font-body leading-relaxed resize-none focus:outline-none focus:border-cyan-400/60 focus:bg-white/10 transition-all"
                          />
                          <button
                            onClick={() => handleDeleteTp(elIdx, tpIdx)}
                            className="mt-1 p-1.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                            title="Hapus TP"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <button
                    onClick={() => handleAddTp(elIdx)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan-300/80 hover:text-cyan-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Tujuan Pembelajaran
                  </button>
                </div>
              </div>
            </details>
          ))}
        </section>

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

export default ATPPage;
