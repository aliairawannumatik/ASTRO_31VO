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
    label: "Jika ada 6 apel dan 4 jeruk, banyak seluruh buah adalah",
    suffix: "buah",
    answers: ["10"],
    discussion: ["Jumlah seluruh buah diperoleh dengan menjumlahkan semua apel dan jeruk.", "6 apel + 4 jeruk = 10 buah.", "Jadi, banyak seluruh buah adalah 10 buah."],
  },
  {
    id: "a2",
    label: "Perbandingan apel terhadap jeruk adalah",
    suffix: "",
    answers: ["6:4", "6/4"],
    discussion: ["Perbandingan apel terhadap jeruk berarti jumlah apel ditulis lebih dulu, lalu jumlah jeruk.", "Jumlah apel = 6 dan jumlah jeruk = 4.", "Maka perbandingannya adalah 6 : 4."],
  },
  {
    id: "a3",
    label: "Perbandingan 6 : 4 disederhanakan dengan membagi kedua bilangan oleh",
    suffix: "",
    answers: ["2"],
    discussion: ["Untuk menyederhanakan rasio, cari bilangan terbesar yang dapat membagi 6 dan 4.", "6 dan 4 sama-sama dapat dibagi 2.", "Jadi, kedua bilangan dibagi oleh 2."],
  },
  {
    id: "a4",
    label: "Bentuk sederhana dari 6 : 4 adalah",
    suffix: "",
    answers: ["3:2", "3/2"],
    discussion: ["Rasio awal adalah 6 : 4.", "Bagi kedua bilangan dengan 2: 6 ÷ 2 = 3 dan 4 ÷ 2 = 2.", "Jadi, bentuk sederhana dari 6 : 4 adalah 3 : 2."],
  },
  {
    id: "b1",
    label: "12 buku untuk 3 siswa berarti setiap 1 siswa mendapat",
    suffix: "buku",
    answers: ["4"],
    discussion: ["Untuk mencari banyak buku tiap 1 siswa, jumlah buku dibagi jumlah siswa.", "12 ÷ 3 = 4.", "Jadi, setiap 1 siswa mendapat 4 buku."],
  },
  {
    id: "b2",
    label: "Satuan pembanding dari 12 buku : 3 siswa adalah",
    suffix: "",
    answers: ["4buku/siswa", "4 buku/siswa", "4buku per siswa", "4 buku per siswa"],
    discussion: ["Satuan pembanding menyatakan nilai untuk setiap 1 satuan.", "12 buku untuk 3 siswa berarti 12 ÷ 3 = 4 buku untuk setiap siswa.", "Jadi, satuan pembandingnya adalah 4 buku/siswa."],
  },
  {
    id: "b3",
    label: "Jarak 150 km ditempuh dalam 3 jam. Kecepatan tiap 1 jam adalah",
    suffix: "km/jam",
    answers: ["50"],
    discussion: ["Kecepatan tiap 1 jam diperoleh dari jarak dibagi waktu.", "150 km ÷ 3 jam = 50 km/jam.", "Jadi, kecepatannya adalah 50 km/jam."],
  },
  {
    id: "c1",
    label: "Rasio 8 laki-laki terhadap 12 perempuan adalah",
    suffix: "",
    answers: ["8:12", "8/12"],
    discussion: ["Rasio laki-laki terhadap perempuan berarti banyak laki-laki ditulis lebih dulu.", "Banyak laki-laki = 8 dan banyak perempuan = 12.", "Jadi, rasionya adalah 8 : 12."],
  },
  {
    id: "c2",
    label: "Bentuk paling sederhana dari 8 : 12 adalah",
    suffix: "",
    answers: ["2:3", "2/3"],
    discussion: ["Cari bilangan terbesar yang membagi 8 dan 12, yaitu 4.", "8 ÷ 4 = 2 dan 12 ÷ 4 = 3.", "Jadi, bentuk paling sederhana dari 8 : 12 adalah 2 : 3."],
  },
  {
    id: "c3",
    label: "Jika rasio merah : biru = 2 : 3 dan jumlah bagian 5, maka bagian merah adalah",
    suffix: "bagian",
    answers: ["2"],
    discussion: ["Pada rasio merah : biru = 2 : 3, angka 2 menunjukkan bagian merah dan angka 3 menunjukkan bagian biru.", "Jumlah bagian adalah 2 + 3 = 5.", "Karena bagian merah diwakili angka 2, maka bagian merah adalah 2 bagian."],
  },
];

const practiceItems = [
  {
    id: "p1",
    question: "Di kelas terdapat 18 siswa perempuan dan 12 siswa laki-laki. Rasio perempuan terhadap laki-laki dalam bentuk sederhana adalah ...",
    answers: ["3:2", "3/2"],
    hint: "Bagi 18 dan 12 dengan FPB-nya, yaitu 6.",
    discussion: ["Rasio perempuan terhadap laki-laki adalah 18 : 12.", "FPB dari 18 dan 12 adalah 6.", "Bagi kedua bilangan dengan 6: 18 ÷ 6 = 3 dan 12 ÷ 6 = 2.", "Jadi, rasio sederhananya adalah 3 : 2."],
  },
  {
    id: "p2",
    question: "Sebuah resep memakai 250 gram tepung untuk 5 kue. Satuan pembanding tepung tiap 1 kue adalah ... gram/kue.",
    answers: ["50"],
    hint: "250 dibagi 5.",
    discussion: ["Satuan pembanding gram/kue berarti banyak tepung untuk setiap 1 kue.", "Jumlah tepung 250 gram digunakan untuk 5 kue.", "250 ÷ 5 = 50.", "Jadi, tepung tiap 1 kue adalah 50 gram/kue."],
  },
  {
    id: "p3",
    question: "Harga 4 pensil adalah Rp12.000. Harga 1 pensil adalah Rp ...",
    answers: ["3000", "3.000", "rp3000", "rp3.000"],
    hint: "12.000 dibagi 4.",
    discussion: ["Harga 4 pensil adalah Rp12.000.", "Untuk mencari harga 1 pensil, bagi harga total dengan banyak pensil.", "12.000 ÷ 4 = 3.000.", "Jadi, harga 1 pensil adalah Rp3.000."],
  },
  {
    id: "p4",
    question: "Rasio umur Kakak : Adik = 5 : 3. Jika jumlah umur mereka 32 tahun, umur Kakak adalah ... tahun.",
    answers: ["20"],
    hint: "Jumlah bagian 8, satu bagian 4 tahun, kakak 5 bagian.",
    discussion: ["Rasio umur Kakak : Adik = 5 : 3.", "Jumlah bagian = 5 + 3 = 8 bagian.", "Jumlah umur mereka 32 tahun, maka 1 bagian = 32 ÷ 8 = 4 tahun.", "Umur Kakak = 5 bagian = 5 × 4 = 20 tahun."],
  },
  {
    id: "p5",
    question: "Jarak pada peta 6 cm mewakili jarak sebenarnya 24 km. Setiap 1 cm mewakili ... km.",
    answers: ["4"],
    hint: "24 dibagi 6.",
    discussion: ["6 cm pada peta mewakili 24 km sebenarnya.", "Untuk mencari nilai tiap 1 cm, bagi jarak sebenarnya dengan jarak pada peta.", "24 ÷ 6 = 4.", "Jadi, setiap 1 cm mewakili 4 km."],
  },
  {
    id: "p6",
    question: "Perbandingan 45 menit terhadap 1 jam dalam satuan menit adalah ...",
    answers: ["3:4", "3/4", "45:60"],
    hint: "Ubah 1 jam menjadi 60 menit, lalu sederhanakan 45 : 60.",
    discussion: ["Sebelum dibandingkan, satuan harus sama.", "1 jam = 60 menit, sehingga perbandingan menjadi 45 menit : 60 menit.", "Rasio 45 : 60 dapat dibagi 15.", "45 ÷ 15 = 3 dan 60 ÷ 15 = 4.", "Jadi, perbandingan sederhananya adalah 3 : 4."],
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
    if (percentage === 100) return "Luar biasa! Kamu sudah memahami perbandingan, satuan pembanding, dan rasio dengan sangat baik.";
    if (percentage >= 75) return "Bagus! Pemahamanmu sudah kuat. Periksa kembali bagian yang masih merah agar makin mantap.";
    if (percentage >= 50) return "Kamu sudah mulai paham. Baca lagi tuntunan penemuan, lalu coba perbaiki jawaban yang belum tepat.";
    return "Tetap semangat. Ikuti langkah contoh dari awal, samakan satuan, lalu sederhanakan rasio perlahan.";
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
            Lembar kerja ini menuntun Sobat Numatik menemukan sendiri makna perbandingan melalui contoh dekat kehidupan sehari-hari, lalu mengecek jawaban dan skor secara langsung.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Compass, title: "Amati", text: "Perhatikan data dan samakan satuannya." },
            { icon: Lightbulb, title: "Temukan", text: "Tuliskan rasio, sederhanakan, dan cari nilai tiap satuan." },
            { icon: Target, title: "Cek", text: "Benar/salah muncul langsung di samping isian." },
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
              <p className="text-sm text-white/70 font-body mt-1">Ikuti alur pertanyaan berikut untuk menemukan konsep. Gunakan tanda titik dua, misalnya 3 : 2.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mb-6">
            <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
              <h3 className="font-display font-bold text-yellow-200 mb-3">Situasi 1: Apel dan Jeruk</h3>
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
              <p className="text-sm text-white/75 font-body">Perbandingan menyatakan hubungan dua besaran. Jika kedua bilangan dapat dibagi oleh bilangan yang sama, rasionya dapat disederhanakan.</p>
            </div>

            <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
              <h3 className="font-display font-bold text-yellow-200 mb-3">Situasi 2: Nilai tiap 1 satuan</h3>
              <div className="rounded-xl bg-white/5 p-4 mb-4 text-center">
                <div className="text-4xl mb-3">📚 📚 📚 📚</div>
                <p className="text-lg font-bold text-white">12 buku untuk 3 siswa</p>
                <p className="text-sm text-white/65">Berapa buku untuk setiap 1 siswa?</p>
              </div>
              <p className="text-sm text-white/75 font-body">Satuan pembanding membantu kita membaca perbandingan sebagai nilai untuk setiap 1 satuan, misalnya buku/siswa atau km/jam.</p>
            </div>
          </div>

          <div className="space-y-3">
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
                      className="w-full md:w-44 rounded-xl border border-cyan-200/30 bg-black/30 px-4 py-2 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
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
        </section>

        <section className="bg-card/85 backdrop-blur border border-border rounded-3xl p-5 md:p-7 mb-6">
          <div className="flex items-start gap-3 mb-5">
            <Sparkles className="w-8 h-8 text-fuchsia-300 shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-fuchsia-100">B. Kesimpulan Konsep</h2>
              <p className="text-sm text-white/70 font-body mt-1">Lengkapi latihan setelah memahami ringkasan ini.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-cyan-500/10 border border-cyan-200/20 p-4">
              <h3 className="font-bold text-cyan-100 mb-2">Perbandingan Umum</h3>
              <p className="text-sm text-white/70">Membandingkan dua besaran sejenis. Satuan harus sama sebelum dibandingkan.</p>
            </div>
            <div className="rounded-2xl bg-yellow-500/10 border border-yellow-200/20 p-4">
              <h3 className="font-bold text-yellow-100 mb-2">Satuan Pembanding</h3>
              <p className="text-sm text-white/70">Menentukan nilai untuk setiap 1 satuan, misalnya 50 km/jam atau 4 buku/siswa.</p>
            </div>
            <div className="rounded-2xl bg-fuchsia-500/10 border border-fuchsia-200/20 p-4">
              <h3 className="font-bold text-fuchsia-100 mb-2">Rasio</h3>
              <p className="text-sm text-white/70">Bentuk perbandingan seperti a : b. Rasio paling sederhana diperoleh dengan membagi FPB.</p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-rose-500/15 border border-fuchsia-200/30 rounded-3xl p-5 md:p-7 mb-6 backdrop-blur">
          <div className="flex items-start gap-3 mb-5">
            <Target className="w-8 h-8 text-rose-200 shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-rose-100">C. Latihan Isian Titik-titik</h2>
              <p className="text-sm text-white/70 font-body mt-1">Isi jawaban singkat. Untuk rasio, gunakan bentuk seperti 3 : 2.</p>
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
