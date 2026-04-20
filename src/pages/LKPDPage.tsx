import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import {
  ArrowLeft,
  Award,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Lightbulb,
  RefreshCcw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, "").replace(/,/g, ".");

const answerMatches = (value: string, accepted: string[]) => {
  const cleanValue = normalize(value);
  return accepted.some((answer) => normalize(answer) === cleanValue);
};

const hasAnswer = (value?: string) => Boolean(value?.trim());

const guidedItems = [
  {
    id: "a1",
    label: "Dari gambar 6 apel dan 4 jeruk, perbandingan apel terhadap jeruk ditulis",
    suffix: "",
    answers: ["6:4", "6/4"],
    discussion: ["Perbandingan apel terhadap jeruk berarti banyak apel ditulis lebih dulu.", "Banyak apel = 6 dan banyak jeruk = 4.", "Jadi, perbandingan apel terhadap jeruk adalah 6 : 4."],
  },
  {
    id: "a2",
    label: "Bilangan terbesar yang dapat membagi 6 dan 4 adalah",
    suffix: "",
    answers: ["2"],
    discussion: ["Untuk membuat rasio sederhana, gunakan pembagi terbesar yang sama.", "6 dan 4 sama-sama dapat dibagi 2.", "Jadi, pembagi terbesarnya adalah 2."],
  },
  {
    id: "a3",
    label: "Bentuk paling sederhana dari 6 : 4 adalah",
    suffix: "",
    answers: ["3:2", "3/2"],
    discussion: ["Bagi kedua bilangan dengan 2.", "6 ÷ 2 = 3 dan 4 ÷ 2 = 2.", "Jadi, 6 : 4 = 3 : 2."],
  },
  {
    id: "a4",
    label: "Sebelum membandingkan 45 menit dengan 1 jam, 1 jam harus diubah menjadi",
    suffix: "menit",
    answers: ["60"],
    discussion: ["Perbandingan dua besaran sejenis harus memakai satuan yang sama.", "1 jam = 60 menit.", "Maka 45 menit dibandingkan dengan 60 menit."],
  },
  {
    id: "a5",
    label: "Perbandingan 45 menit terhadap 60 menit adalah",
    suffix: "",
    answers: ["45:60", "45/60"],
    discussion: ["Setelah satuannya sama, tuliskan bilangan sesuai urutan yang ditanyakan.", "45 menit terhadap 60 menit ditulis 45 : 60.", "Rasio ini masih dapat disederhanakan."],
  },
  {
    id: "a6",
    label: "Bentuk sederhana dari 45 : 60 adalah",
    suffix: "",
    answers: ["3:4", "3/4"],
    discussion: ["FPB dari 45 dan 60 adalah 15.", "45 ÷ 15 = 3 dan 60 ÷ 15 = 4.", "Jadi, bentuk sederhananya adalah 3 : 4."],
  },
  {
    id: "a7",
    label: "Jika 12 buku dibagikan kepada 3 siswa, setiap 1 siswa mendapat",
    suffix: "buku",
    answers: ["4"],
    discussion: ["Nilai tiap 1 satuan diperoleh dengan pembagian.", "12 buku ÷ 3 siswa = 4 buku/siswa.", "Jadi, setiap siswa mendapat 4 buku."],
  },
  {
    id: "a8",
    label: "Jarak 150 km ditempuh dalam 3 jam. Satuan pembanding kecepatannya adalah",
    suffix: "km/jam",
    answers: ["50"],
    discussion: ["Kecepatan menyatakan jarak tiap 1 jam.", "150 km ÷ 3 jam = 50 km/jam.", "Jadi, satuan pembandingnya adalah 50 km/jam."],
  },
  {
    id: "a9",
    label: "Kesimpulan: Perbandingan digunakan untuk membandingkan dua besaran. Jika satuannya berbeda, satuan harus dibuat",
    suffix: "terlebih dahulu",
    answers: ["sama"],
    discussion: ["Contoh: 1 jam harus diubah menjadi 60 menit sebelum dibandingkan dengan 45 menit.", "Setelah satuan sama, barulah rasio dapat ditulis dan disederhanakan.", "Jadi, satuan harus dibuat sama terlebih dahulu."],
  },
  {
    id: "a10",
    label: "Rumus baku: Rasio a terhadap b ditulis",
    suffix: "",
    answers: ["a:b", "a/b"],
    discussion: ["Urutan dalam rasio harus mengikuti urutan yang ditanyakan.", "Jika yang ditanyakan a terhadap b, maka a ditulis lebih dulu.", "Jadi, rasio a terhadap b ditulis a : b."],
  },
  {
    id: "a11",
    label: "Rumus baku: Rasio paling sederhana diperoleh dengan membagi kedua bilangan oleh",
    suffix: "",
    answers: ["fpb", "FPB"],
    discussion: ["FPB adalah faktor persekutuan terbesar.", "Membagi kedua bilangan dengan FPB membuat rasio menjadi paling sederhana.", "Jadi, rasio paling sederhana diperoleh dengan membagi kedua bilangan oleh FPB."],
  },
  {
    id: "a12",
    label: "Rumus baku: Nilai tiap 1 satuan diperoleh dari jumlah besaran dibagi",
    suffix: "",
    answers: ["banyak satuan", "jumlah satuan", "banyaknya satuan"],
    discussion: ["Satuan pembanding menyatakan nilai untuk setiap 1 satuan.", "Contoh: 150 km dalam 3 jam berarti 150 ÷ 3 = 50 km/jam.", "Jadi, nilai tiap 1 satuan diperoleh dari jumlah besaran dibagi banyak satuan."],
  },
];

const practiceItems = [
  {
    id: "p1",
    question: "Tinggi Menara P adalah 135 meter dan tinggi Menara Q adalah 180 meter. Tentukan rasio tinggi Menara Q terhadap Menara P dalam bentuk paling sederhana!",
    answers: ["4:3", "4/3"],
    hint: "Tuliskan 180 : 135, lalu bagi keduanya dengan 45.",
    discussion: ["Yang ditanyakan adalah tinggi Menara Q terhadap Menara P, jadi urutannya 180 : 135.", "FPB dari 180 dan 135 adalah 45.", "180 ÷ 45 = 4 dan 135 ÷ 45 = 3.", "Jadi, rasionya adalah 4 : 3."],
  },
  {
    id: "p2",
    question: "Dalam sebuah kotak terdapat 30 kelereng merah dan 20 kelereng biru. Berapakah perbandingan kelereng merah terhadap seluruh kelereng dalam bentuk paling sederhana?",
    answers: ["3:5", "3/5"],
    hint: "Jumlah seluruh kelereng adalah 30 + 20 = 50.",
    discussion: ["Jumlah seluruh kelereng = 30 + 20 = 50.", "Perbandingan merah terhadap seluruh kelereng adalah 30 : 50.", "Bagi keduanya dengan 10 sehingga menjadi 3 : 5.", "Jadi, jawabannya adalah 3 : 5."],
  },
  {
    id: "p3",
    question: "Umur Ibu saat ini adalah 48 tahun, sedangkan umur Rani 18 tahun. Tentukan perbandingan umur Ibu dan Rani pada 6 tahun yang lalu!",
    answers: ["7:2", "7/2"],
    hint: "Kurangi masing-masing umur dengan 6 terlebih dahulu.",
    discussion: ["Umur Ibu 6 tahun lalu = 48 - 6 = 42 tahun.", "Umur Rani 6 tahun lalu = 18 - 6 = 12 tahun.", "Perbandingannya adalah 42 : 12.", "Bagi keduanya dengan 6 sehingga menjadi 7 : 2."],
  },
  {
    id: "p4",
    question: "Jarak rumah Rafi ke perpustakaan adalah 3 km, sedangkan jarak rumah Nia ke perpustakaan adalah 750 meter. Tentukan perbandingan jarak rumah Rafi dan Nia dalam bentuk paling sederhana!",
    answers: ["4:1", "4/1"],
    hint: "Ubah 3 km menjadi 3.000 meter.",
    discussion: ["Satuan harus dibuat sama terlebih dahulu.", "3 km = 3.000 meter.", "Perbandingan jarak Rafi dan Nia adalah 3.000 : 750.", "Bagi keduanya dengan 750 sehingga menjadi 4 : 1."],
  },
  {
    id: "p5",
    question: "Waktu yang digunakan Sari untuk membaca adalah 1,5 jam, sedangkan waktu untuk menonton video adalah 36 menit. Tentukan rasio waktu membaca terhadap waktu menonton video!",
    answers: ["5:2", "5/2"],
    hint: "Ubah 1,5 jam menjadi 90 menit.",
    discussion: ["1,5 jam = 90 menit.", "Rasio waktu membaca terhadap menonton video adalah 90 : 36.", "FPB dari 90 dan 36 adalah 18.", "90 ÷ 18 = 5 dan 36 ÷ 18 = 2, sehingga rasionya 5 : 2."],
  },
  {
    id: "p6",
    question: "Sebuah wadah air berisi 2 liter. Air tersebut dituangkan ke dalam gelas berkapasitas 250 ml. Berapa rasio volume air di wadah terhadap kapasitas gelas?",
    answers: ["8:1", "8/1"],
    hint: "Ubah 2 liter menjadi 2.000 ml.",
    discussion: ["Satuan harus sama, maka 2 liter = 2.000 ml.", "Rasio volume wadah terhadap gelas adalah 2.000 : 250.", "2.000 ÷ 250 = 8 dan 250 ÷ 250 = 1.", "Jadi, rasionya adalah 8 : 1."],
  },
  {
    id: "p7",
    question: "Sebuah peternakan memiliki lahan 1,6 hektar dan menampung 48.000 ekor ayam. Tentukan rasio kepadatan ayam terhadap luas lahan dalam satuan ekor/m². Catatan: 1 hektar = 10.000 m².",
    answers: ["3", "3ekor/m2", "3ekor/m²", "3 ekor/m2", "3 ekor/m²"],
    hint: "Ubah 1,6 hektar menjadi 16.000 m², lalu bagi 48.000 dengan 16.000.",
    discussion: ["1,6 hektar = 1,6 × 10.000 = 16.000 m².", "Kepadatan ayam = 48.000 ÷ 16.000.", "Hasilnya 3 ekor/m².", "Jadi, rasio kepadatannya adalah 3 ekor/m²."],
  },
  {
    id: "p8",
    question: "Perbandingan panjang dan lebar sebuah persegi panjang adalah 7 : 5. Jika kelilingnya 72 cm, tentukan luas persegi panjang tersebut!",
    answers: ["315", "315cm2", "315cm²", "315 cm2", "315 cm²"],
    hint: "Misalkan panjang 7x dan lebar 5x. Gunakan 2(p + l) = 72.",
    discussion: ["Misalkan panjang = 7x dan lebar = 5x.", "Keliling = 2(7x + 5x) = 24x.", "24x = 72, maka x = 3.", "Panjang = 21 cm dan lebar = 15 cm.", "Luas = 21 × 15 = 315 cm²."],
  },
  {
    id: "p9",
    question: "Perbandingan panjang, lebar, dan tinggi sebuah balok adalah 3 : 2 : 1. Jika volume balok 162 cm³, tentukan luas permukaan balok tersebut!",
    answers: ["198", "198cm2", "198cm²", "198 cm2", "198 cm²"],
    hint: "Misalkan ukuran balok 3x, 2x, dan x. Volume = 3x × 2x × x.",
    discussion: ["Misalkan panjang = 3x, lebar = 2x, dan tinggi = x.", "Volume = 3x × 2x × x = 6x³.", "6x³ = 162, maka x³ = 27 dan x = 3.", "Ukuran balok adalah 9 cm, 6 cm, dan 3 cm.", "Luas permukaan = 2(pl + pt + lt) = 2(54 + 27 + 18) = 198 cm²."],
  },
  {
    id: "p10",
    question: "Hasil panen rambutan, duku, dan salak memiliki perbandingan 3 : 5 : 8. Jika selisih berat salak dan rambutan adalah 250 kg, tentukan total seluruh hasil panen!",
    answers: ["800", "800kg", "800 kg"],
    hint: "Selisih salak dan rambutan adalah 8 bagian - 3 bagian = 5 bagian.",
    discussion: ["Perbandingan rambutan : duku : salak = 3 : 5 : 8.", "Selisih salak dan rambutan = 8 - 3 = 5 bagian.", "5 bagian = 250 kg, maka 1 bagian = 50 kg.", "Jumlah seluruh bagian = 3 + 5 + 8 = 16 bagian.", "Total panen = 16 × 50 = 800 kg."],
  },
];

const allQuestions = [...guidedItems, ...practiceItems];

const DiscussionBox = ({ steps }: { steps: string[] }) => (
  <details className="mt-3 rounded-2xl border border-yellow-200/25 bg-yellow-400/10 px-4 py-3 text-sm text-white/80">
    <summary className="cursor-pointer select-none font-semibold text-yellow-100 hover:text-yellow-200">
      Lihat Pembahasan
    </summary>
    <ol className="mt-3 space-y-2 list-decimal pl-5 font-body">
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  </details>
);

const LKPDPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const results = useMemo(() => {
    return allQuestions.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = answerMatches(answers[item.id] || "", item.answers);
      return acc;
    }, {});
  }, [answers]);

  const score = useMemo(() => Object.values(results).filter(Boolean).length, [results]);
  const total = allQuestions.length;
  const percentage = Math.round((score / total) * 100);

  const updateAnswer = (id: string, value: string) => {
    setAnswers((current) => ({ ...current, [id]: value }));
  };

  const checkAnswers = () => {
    playPopSound();
    setChecked(true);
    setTimeout(() => document.getElementById("lkpd-score")?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  const resetAnswers = () => {
    playPopSound();
    setAnswers({});
    setChecked(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getMessage = () => {
    if (percentage === 100) return "Luar biasa! Kamu sudah memahami perbandingan, satuan pembanding, rasio, dan penerapannya dengan sangat baik.";
    if (percentage >= 75) return "Bagus! Pemahamanmu sudah kuat. Periksa kembali bagian yang masih merah agar makin mantap.";
    if (percentage >= 50) return "Kamu sudah mulai paham. Baca lagi penemuan terbimbing dan rumus bakunya, lalu coba perbaiki jawaban yang belum tepat.";
    return "Tetap semangat. Ikuti langkah dari konsep, samakan satuan, sederhanakan rasio, lalu gunakan rumus bakunya perlahan.";
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/lkpd/kelas-7/perbandingan" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <ClipboardCheck className="w-4 h-4" />
            LKPD Interaktif Matematika Kelas 7
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            Perbandingan Umum, Satuan Pembanding, dan Rasio
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            Lembar kerja ini menuntun Sobat Numatik menemukan konsep melalui isian kosong, menyusun kesimpulan, memahami rumus baku, lalu menerapkannya pada soal kontekstual.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Compass, title: "Amati", text: "Baca situasi, urutan besaran, dan satuannya." },
            { icon: Lightbulb, title: "Temukan", text: "Isi bagian kosong untuk menemukan konsep dan rumus." },
            { icon: Target, title: "Terapkan", text: "Gunakan kesimpulan pada soal kontekstual." },
          ].map((item) => (
            <div key={item.title} className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 shadow-lg">
              <item.icon className="w-8 h-8 text-yellow-300 mb-3" />
              <h2 className="font-display font-bold text-lg text-white mb-1">{item.title}</h2>
              <p className="text-sm text-white/65 font-body">{item.text}</p>
            </div>
          ))}
        </div>

        <section className="bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-violet-500/15 border border-cyan-200/30 rounded-3xl p-5 md:p-7 mb-6 backdrop-blur">
          <div className="flex items-start gap-3 mb-5">
            <BookOpenCheck className="w-8 h-8 text-cyan-200 shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-cyan-100">A. Penemuan Terbimbing</h2>
              <p className="text-sm text-white/70 font-body mt-1">Lengkapi kotak kosong dari pemaparan konsep sampai kesimpulan dan rumus baku. Untuk rasio, gunakan bentuk seperti 3 : 2.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mb-6">
            <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
              <h3 className="font-display font-bold text-yellow-200 mb-3">Situasi 1: Membandingkan Banyak Benda</h3>
              <div className="flex items-center justify-center gap-4 rounded-xl bg-white/5 p-4 mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🍎🍎🍎</div>
                  <div className="text-4xl">🍎🍎🍎</div>
                  <p className="text-sm text-white/70 mt-2">6 apel</p>
                </div>
                <div className="text-3xl text-white/40">:</div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🍊🍊</div>
                  <div className="text-4xl">🍊🍊</div>
                  <p className="text-sm text-white/70 mt-2">4 jeruk</p>
                </div>
              </div>
              <p className="text-sm text-white/75 font-body">Perbandingan menyatakan hubungan dua besaran. Urutan rasio harus mengikuti urutan yang ditanyakan.</p>
            </div>

            <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
              <h3 className="font-display font-bold text-yellow-200 mb-3">Situasi 2: Menyamakan Satuan dan Nilai Tiap Satuan</h3>
              <div className="rounded-xl bg-white/5 p-4 mb-4 text-center space-y-2">
                <p className="text-lg font-bold text-white">45 menit dibandingkan dengan 1 jam</p>
                <p className="text-lg font-bold text-white">12 buku untuk 3 siswa</p>
                <p className="text-sm text-white/65">Apa yang harus dilakukan sebelum menulis rasio?</p>
              </div>
              <p className="text-sm text-white/75 font-body">Jika satuan berbeda, samakan satuannya terlebih dahulu. Jika mencari nilai tiap 1 satuan, gunakan pembagian.</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {guidedItems.map((item, index) => (
              <label key={item.id} className="block rounded-2xl bg-card/80 border border-white/10 p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="flex-1 text-sm md:text-base text-white/85 font-body">
                    <span className="font-bold text-cyan-200">{index + 1}.</span> {item.label} <span className="text-cyan-200">...</span> {item.suffix}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      value={answers[item.id] || ""}
                      onChange={(event) => updateAnswer(item.id, event.target.value)}
                      className="w-full md:w-52 rounded-xl border border-cyan-200/30 bg-black/30 px-4 py-2 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                      placeholder="isi jawaban"
                    />
                    {hasAnswer(answers[item.id]) && (
                      <span className={`inline-flex min-w-24 items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold ${results[item.id] ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
                        {results[item.id] ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {results[item.id] ? "Benar" : "Salah"}
                      </span>
                    )}
                  </div>
                </div>
                <DiscussionBox steps={item.discussion} />
              </label>
            ))}
          </div>

          <div className="rounded-3xl border border-fuchsia-200/25 bg-fuchsia-500/10 p-5">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-7 h-7 text-fuchsia-200 shrink-0" />
              <div>
                <h3 className="font-display text-xl font-bold text-fuchsia-100">Kesimpulan dan Rumus Baku</h3>
                <p className="text-sm text-white/70 font-body">Gunakan hasil isian di atas sebagai ringkasan sebelum mengerjakan soal.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-cyan-500/10 border border-cyan-200/20 p-4">
                <h4 className="font-bold text-cyan-100 mb-2">Perbandingan Umum</h4>
                <p className="text-sm text-white/70">Membandingkan dua besaran. Jika satuan berbeda, ubah dahulu agar satuannya sama.</p>
              </div>
              <div className="rounded-2xl bg-yellow-500/10 border border-yellow-200/20 p-4">
                <h4 className="font-bold text-yellow-100 mb-2">Rasio</h4>
                <p className="text-sm text-white/70">Rasio a terhadap b ditulis a : b. Bentuk sederhana diperoleh dengan membagi kedua bilangan oleh FPB.</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-200/20 p-4">
                <h4 className="font-bold text-emerald-100 mb-2">Satuan Pembanding</h4>
                <p className="text-sm text-white/70">Nilai tiap 1 satuan = jumlah besaran ÷ banyak satuan, misalnya km/jam, buku/siswa, atau ekor/m².</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-rose-500/15 border border-fuchsia-200/30 rounded-3xl p-5 md:p-7 mb-6 backdrop-blur">
          <div className="flex items-start gap-3 mb-5">
            <Target className="w-8 h-8 text-rose-200 shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-rose-100">B. Soal Latihan</h2>
              <p className="text-sm text-white/70 font-body mt-1">Kerjakan dengan langkah: tulis rasio sesuai urutan, samakan satuan jika perlu, lalu sederhanakan.</p>
            </div>
          </div>
          <div className="space-y-4">
            {practiceItems.map((item, index) => (
              <div key={item.id} className="rounded-2xl bg-card/80 border border-white/10 p-4">
                <p className="text-sm md:text-base text-white/85 font-body mb-3"><span className="font-bold text-rose-200">{index + 1}.</span> {item.question}</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input
                    value={answers[item.id] || ""}
                    onChange={(event) => updateAnswer(item.id, event.target.value)}
                    className="flex-1 rounded-xl border border-fuchsia-200/30 bg-black/30 px-4 py-2 text-white outline-none focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300/20"
                    placeholder="tulis jawabanmu"
                  />
                  {hasAnswer(answers[item.id]) && (
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${results[item.id] ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
                      {results[item.id] ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {results[item.id] ? "Benar" : "Salah"}
                    </div>
                  )}
                </div>
                {hasAnswer(answers[item.id]) && !results[item.id] && <p className="mt-2 text-xs text-yellow-200/90 font-body">Petunjuk: {item.hint}</p>}
                <DiscussionBox steps={item.discussion} />
              </div>
            ))}
          </div>
        </section>

        <section id="lkpd-score" className="rounded-3xl border border-emerald-200/30 bg-emerald-500/10 backdrop-blur p-5 md:p-7 text-center mb-8">
          <Award className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
          <h2 className="font-display text-2xl font-bold text-emerald-100 mb-2">Skor Akhir</h2>
          {checked ? (
            <>
              <p className="text-5xl font-display font-bold text-white mb-2">{score}/{total}</p>
              <p className="text-lg font-semibold text-emerald-100 mb-3">Nilai: {percentage}</p>
              <p className="text-sm text-white/75 max-w-2xl mx-auto">{getMessage()}</p>
            </>
          ) : (
            <p className="text-sm text-white/70">Benar/salah terlihat langsung di setiap isian. Tekan tombol di bawah untuk melihat skor akhir.</p>
          )}
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={checkAnswers}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:scale-105 transition-transform"
            >
              <ClipboardCheck className="w-5 h-5" />
              Lihat Skor Akhir
            </button>
            <button
              onClick={resetAnswers}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/15 transition-colors"
            >
              <RefreshCcw className="w-5 h-5" />
              Ulangi LKPD
            </button>
          </div>
        </section>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/lkpd/kelas-7/perbandingan"); }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke LKPD Perbandingan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LKPDPage;
