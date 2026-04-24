import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { ArrowLeft, BookOpenCheck, GraduationCap, Layers, ListChecks, School } from "lucide-react";

const atpElements = [
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

const ATPPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/menu" />
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
            <p className="text-3xl font-display font-bold text-white">5</p>
            <p className="text-sm text-white/70">Elemen pembelajaran</p>
          </div>
          <div className="rounded-2xl border border-fuchsia-200/25 bg-fuchsia-400/10 backdrop-blur p-5">
            <ListChecks className="w-8 h-8 text-fuchsia-200 mb-3" />
            <p className="text-3xl font-display font-bold text-white">71</p>
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
            <p className="text-sm text-white/65 mt-2">Klik setiap elemen untuk membuka capaian pembelajaran dan daftar tujuan pembelajarannya.</p>
          </div>
          {atpElements.map((item) => (
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
                  <ol className="space-y-2 list-decimal pl-5 text-sm leading-relaxed text-white/75 font-body">
                    {item.tp.map((tp) => <li key={tp}>{tp}</li>)}
                  </ol>
                </div>
              </div>
            </details>
          ))}
        </section>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
};

export default ATPPage;
