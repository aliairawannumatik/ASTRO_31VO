import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import {
  ArrowLeft,
  BookOpenCheck,
  GraduationCap,
  Hash,
  Sigma,
  Ruler,
  Shapes,
  BarChart3,
  School,
  Layers,
  FileText,
  FileDown,
} from "lucide-react";

const faseInfo = {
  fase: "Fase D",
  jenjang: "Umumnya untuk Kelas VII, VIII, dan IX SMP/MTs/Program Paket B",
  pengantar:
    "Pada akhir Fase D, murid memiliki kemampuan sebagai berikut pada setiap elemen pembelajaran matematika.",
};

const cpElements = [
  {
    no: "4.1",
    element: "Bilangan",
    icon: Hash,
    accent: "from-cyan-500/15 via-blue-500/10 to-indigo-500/15",
    border: "border-cyan-200/30",
    text: "text-cyan-100",
    cp: "Membaca, menulis, dan membandingkan bilangan bulat, bilangan rasional, bilangan desimal, bilangan berpangkat bulat dan akar, bilangan dalam notasi ilmiah; menerapkan operasi aritmatika pada bilangan real, dan memberikan estimasi/perkiraan dalam menyelesaikan masalah (termasuk berkaitan dengan literasi finansial). Murid dapat menggunakan rasio (skala, proporsi, dan laju perubahan) dalam penyelesaian masalah.",
  },
  {
    no: "4.2",
    element: "Aljabar",
    icon: Sigma,
    accent: "from-violet-500/15 via-purple-500/10 to-fuchsia-500/15",
    border: "border-violet-200/30",
    text: "text-violet-100",
    cp: "Mengenali, memprediksi dan menggeneralisasi pola dalam bentuk susunan benda dan bilangan; Menyatakan suatu situasi ke dalam bentuk aljabar; menggunakan sifat-sifat operasi (komutatif, asosiatif, dan distributif) untuk menghasilkan bentuk aljabar yang ekuivalen. Murid dapat memahami relasi dan fungsi (domain, kodomain, range) serta menyajikannya dalam bentuk diagram panah, tabel, himpunan pasangan berurutan, dan grafik; membedakan beberapa fungsi non linear dari fungsi linear secara grafik; menyelesaikan persamaan dan pertidaksamaan linear satu variabel; menyajikan, menganalisis, dan menyelesaikan masalah dengan menggunakan relasi, fungsi dan persamaan linear; serta menyelesaikan sistem persaman linear dua variabel melalui beberapa cara untuk penyelesaian masalah.",
  },
  {
    no: "4.3",
    element: "Pengukuran",
    icon: Ruler,
    accent: "from-emerald-500/15 via-teal-500/10 to-cyan-500/15",
    border: "border-emerald-200/30",
    text: "text-emerald-100",
    cp: "Menentukan keliling, luas, panjang busur, sudut dan luas juring lingkaran, serta menyelesaikan masalah yang terkait; menjelaskan cara untuk menentukan luas permukaan dan volume bangun ruang (prisma, tabung, bola, limas dan kerucut) dan menyelesaikan masalah yang terkait; dan menjelaskan pengaruh perubahan secara proporsional dari bangun datar dan bangun ruang terhadap ukuran panjang, besar sudut, luas, dan/atau volume.",
  },
  {
    no: "4.4",
    element: "Geometri",
    icon: Shapes,
    accent: "from-amber-500/15 via-orange-500/10 to-rose-500/15",
    border: "border-amber-200/30",
    text: "text-amber-100",
    cp: "Membuat jaring-jaring bangun ruang (prisma, tabung, limas dan kerucut) dan membuat bangun ruang dari jaring-jaringnya. Murid dapat menggunakan hubungan antar-sudut yang terbentuk oleh dua garis yang berpotongan, dan oleh dua garis sejajar yang dipotong sebuah garis transversal untuk menyelesaikan masalah (termasuk menentukan jumlah besar sudut dalam sebuah segitiga, menentukan besar sudut yang belum diketahui pada sebuah segitiga); menjelaskan sifat-sifat kekongruenan dan kesebangunan pada segitiga dan segiempat, dan menggunakannya untuk menyelesaikan masalah; menunjukkan kebenaran teorema Pythagoras dan menggunakannya dalam menyelesaikan masalah (termasuk pengenalan bilangan irasional dan jarak antara dua titik pada bidang koordinat Kartesius). Murid dapat melakukan transformasi tunggal (refleksi, translasi, rotasi, dan dilatasi) titik, garis, dan bangun datar pada bidang koordinat Kartesius dan menggunakannya untuk menyelesaikan masalah.",
  },
  {
    no: "4.5",
    element: "Analisis Data dan Peluang",
    icon: BarChart3,
    accent: "from-pink-500/15 via-rose-500/10 to-red-500/15",
    border: "border-pink-200/30",
    text: "text-pink-100",
    cp: "Merumuskan pertanyaan, mengumpulkan, menyajikan, dan menganalisis data untuk menjawab pertanyaan dari situasi atau masalah; menggunakan diagram batang dan diagram lingkaran untuk menyajikan dan menginterpretasi data; mengambil sampel yang mewakili suatu populasi untuk mendapatkan data yang terkait dengan diri dan lingkungan mereka; menentukan dan menafsirkan rerata (mean), median, modus, dan jangkauan (range) dari data tersebut untuk menyelesaikan masalah (termasuk membandingkan suatu data terhadap kelompoknya, membandingkan dua kelompok data, memprediksi, membuat keputusan); menyelidiki kemungkinan adanya perubahan pengukuran pusat tersebut akibat perubahan data. Murid dapat menjelaskan dan menggunakan pengertian peluang dan frekuensi relatif untuk menentukan frekuensi harapan satu kejadian pada suatu percobaan sederhana (semua hasil percobaan dapat muncul secara merata).",
  },
];

const CapaianPembelajaranPage = () => {
  const navigate = useNavigate();

  const dokumenStyle = `
    @page {
      size: 21.5cm 33cm;
      margin: 3cm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 0;
      text-align: justify;
    }
    h1 {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      margin: 0 0 6pt 0;
      font-family: Arial, sans-serif;
    }
    h2 {
      font-size: 13pt;
      font-weight: bold;
      margin: 14pt 0 6pt 0;
      font-family: Arial, sans-serif;
    }
    .header {
      text-align: center;
      margin-bottom: 18pt;
      border-bottom: 2px solid #000;
      padding-bottom: 10pt;
    }
    .subtitle {
      font-size: 11pt;
      margin: 3pt 0;
      text-align: center;
    }
    .identitas {
      border: 1px solid #aaa;
      padding: 10pt;
      margin-bottom: 14pt;
    }
    .identitas p { margin: 4pt 0; text-align: left; }
    .pengantar { margin-bottom: 14pt; text-align: justify; }
    .elemen {
      border: 1px solid #aaa;
      padding: 10pt 12pt;
      margin-bottom: 10pt;
    }
    .elemen-no { font-size: 10pt; color: #555; margin: 0 0 3pt 0; }
    .elemen-judul { font-weight: bold; font-size: 12pt; margin: 0 0 6pt 0; }
    .cp-text { text-align: justify; margin: 0; }
    .footer {
      text-align: center;
      margin-top: 18pt;
      font-size: 9pt;
      color: #666;
      border-top: 1px solid #ccc;
      padding-top: 8pt;
    }
  `;

  const dokumenBody = `
    <div class="header">
      <h1>CAPAIAN PEMBELAJARAN MATEMATIKA</h1>
      <p class="subtitle">Fase D — Kurikulum Merdeka</p>
      <p class="subtitle">SMP/MTs/Program Paket B</p>
    </div>
    <div class="identitas">
      <h2 style="margin-top:0;">Identitas Fase</h2>
      <p><strong>Mata Pelajaran:</strong> Matematika</p>
      <p><strong>Fase:</strong> ${faseInfo.fase}</p>
      <p><strong>Jenjang:</strong> ${faseInfo.jenjang}</p>
      <p><strong>Jumlah Elemen:</strong> ${cpElements.length} elemen capaian pembelajaran</p>
    </div>
    <p class="pengantar">${faseInfo.pengantar}</p>
    <h2>Rincian Capaian Pembelajaran</h2>
    ${cpElements.map((item) => `
      <div class="elemen">
        <p class="elemen-no">Elemen ${item.no}</p>
        <p class="elemen-judul">${item.element}</p>
        <p class="cp-text">${item.cp}</p>
      </div>
    `).join("")}
    <div class="footer">
      <p>Dokumen ini dicetak dari Aplikasi NUMATIK — Numerasi Aktif dengan Teknologi Informasi dan Komunikasi</p>
    </div>
  `;

  const handlePrintPDF = () => {
    playPopSound();
    const style = document.createElement("style");
    style.id = "__numatik_print_style__";
    style.innerHTML = `
      ${dokumenStyle}
      @media print {
        body > *:not(#__numatik_print_root__) { display: none !important; }
        #__numatik_print_root__ { display: block !important; }
      }
    `;
    const root = document.createElement("div");
    root.id = "__numatik_print_root__";
    root.style.display = "none";
    root.innerHTML = dokumenBody;
    document.head.appendChild(style);
    document.body.appendChild(root);
    window.print();
    document.head.removeChild(style);
    document.body.removeChild(root);
  };

  const handlePrintWord = () => {
    playPopSound();
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Capaian Pembelajaran Matematika Fase D</title>
  <style>
    ${dokumenStyle}
  </style>
</head>
<body>
  ${dokumenBody}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Capaian_Pembelajaran_Matematika_Fase_D.doc";
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
            Capaian Pembelajaran Matematika
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            CAPAIAN PEMBELAJARAN
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            {faseInfo.pengantar}
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handlePrintWord}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 border border-blue-400/40 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <FileText className="w-4 h-4" />
              Cetak Word
            </button>
            <button
              onClick={handlePrintPDF}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-500 border border-red-400/40 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <FileDown className="w-4 h-4" />
              Cetak PDF
            </button>
          </div>
        </div>

        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-cyan-200/25 bg-card/80 backdrop-blur p-5 md:col-span-2">
            <School className="w-8 h-8 text-cyan-200 mb-3" />
            <h2 className="font-display text-xl font-bold text-cyan-100 mb-3">Identitas Fase</h2>
            <div className="space-y-2 text-sm text-white/75 font-body">
              <p><span className="text-white font-semibold">Mata Pelajaran:</span> Matematika</p>
              <p><span className="text-white font-semibold">Fase:</span> {faseInfo.fase}</p>
              <p><span className="text-white font-semibold">Jenjang:</span> {faseInfo.jenjang}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-yellow-200/25 bg-yellow-400/10 backdrop-blur p-5 flex flex-col justify-center">
            <Layers className="w-8 h-8 text-yellow-200 mb-3" />
            <p className="text-3xl font-display font-bold text-white">{cpElements.length}</p>
            <p className="text-sm text-white/70">Elemen capaian pembelajaran</p>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card/85 backdrop-blur p-5 md:p-7 mb-6">
          <div className="flex items-start gap-3 mb-2">
            <BookOpenCheck className="w-8 h-8 text-emerald-200 shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-emerald-100">
                Rincian Capaian Pembelajaran
              </h2>
              <p className="text-sm text-white/65 mt-1">
                Setiap elemen menjelaskan kemampuan yang harus dimiliki murid pada akhir Fase D.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 mb-10">
          {cpElements.map((item, index) => (
            <article
              key={item.element}
              className={`rounded-3xl border ${item.border} bg-gradient-to-br ${item.accent} backdrop-blur p-5 md:p-6 animate-slide-up`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-lg font-display font-bold text-primary shrink-0">
                  {item.no}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <item.icon className={`w-6 h-6 ${item.text}`} />
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                      {item.element}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-white/60 mt-1">
                    Kemampuan akhir Fase D pada elemen {item.element}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-sm md:text-base leading-relaxed text-white/85 font-body text-justify">
                  {item.cp}
                </p>
              </div>
            </article>
          ))}
        </section>

        <div className="text-center">
          <button
            onClick={() => {
              playPopSound();
              navigate("/ruang-untuk-guru");
            }}
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

export default CapaianPembelajaranPage;
