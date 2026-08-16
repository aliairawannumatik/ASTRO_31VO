import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, CheckCircle2, ClipboardCheck, History, RotateCcw, UserRound } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { useTheme } from "@/contexts/ThemeContext";
import { playPopSound } from "@/hooks/useAudio";

type Question = { question: string; options: string[]; answer: number };
type Package = { level: number; title: string; description: string; color: string; questions: Question[] };
type Result = { level: number; score: number; total: number; date: string };

const packages: Package[] = [
  { level: 1, title: "Fondasi Bilangan", description: "Bilangan bulat, operasi dasar, dan pola sederhana.", color: "#22d3ee", questions: [
    { question: "Hasil dari 18 − 25 adalah …", options: ["7", "−7", "43", "−43"], answer: 1 },
    { question: "Pecahan yang senilai dengan 1/2 adalah …", options: ["2/3", "3/6", "4/10", "5/12"], answer: 1 },
    { question: "Bilangan berikut yang paling besar adalah …", options: ["−3", "−1", "−5", "−8"], answer: 1 },
    { question: "Pola 4, 8, 12, 16, … suku berikutnya adalah …", options: ["18", "20", "22", "24"], answer: 1 },
    { question: "KPK dari 4 dan 6 adalah …", options: ["8", "10", "12", "24"], answer: 2 },
  ] },
  { level: 2, title: "Pemahaman Konsep", description: "Rasio, aljabar, himpunan, dan persamaan linear.", color: "#a78bfa", questions: [
    { question: "Jika 3x + 4 = 19, nilai x adalah …", options: ["4", "5", "6", "7"], answer: 1 },
    { question: "Perbandingan 12 : 18 dalam bentuk paling sederhana adalah …", options: ["2 : 3", "3 : 2", "4 : 5", "6 : 9"], answer: 0 },
    { question: "Jika A = {1, 2, 3} dan B = {2, 3, 4}, maka A ∩ B adalah …", options: ["{1,4}", "{1,2,3,4}", "{2,3}", "∅"], answer: 2 },
    { question: "Bentuk sederhana dari 4a + 3a − 2 adalah …", options: ["7a − 2", "7a + 2", "a − 2", "12a − 2"], answer: 0 },
    { question: "Gradien garis yang melalui (0, 2) dan (2, 6) adalah …", options: ["1", "2", "3", "4"], answer: 1 },
  ] },
  { level: 3, title: "Strategi Pemecahan", description: "Geometri, SPLDV, statistika, dan masalah kontekstual.", color: "#f59e0b", questions: [
    { question: "Penyelesaian x + y = 9 dan x − y = 3 adalah …", options: ["(3,6)", "(6,3)", "(4,5)", "(5,4)"], answer: 1 },
    { question: "Segitiga siku-siku dengan sisi siku-siku 6 cm dan 8 cm memiliki sisi miring …", options: ["9 cm", "10 cm", "12 cm", "14 cm"], answer: 1 },
    { question: "Rata-rata 6, 7, 8, dan 11 adalah …", options: ["7", "7,5", "8", "8,5"], answer: 2 },
    { question: "Sebuah baju seharga Rp200.000 mendapat diskon 15%. Harga setelah diskon adalah …", options: ["Rp170.000", "Rp175.000", "Rp185.000", "Rp230.000"], answer: 0 },
    { question: "Luas lingkaran berjari-jari 7 cm (π = 22/7) adalah …", options: ["44 cm²", "88 cm²", "154 cm²", "308 cm²"], answer: 2 },
  ] },
  { level: 4, title: "Penalaran Matematis", description: "Fungsi, peluang, kesebangunan, dan analisis data.", color: "#34d399", questions: [
    { question: "Peluang muncul bilangan prima saat sebuah dadu dilempar adalah …", options: ["1/6", "1/3", "1/2", "2/3"], answer: 2 },
    { question: "Dua segitiga sebangun memiliki skala sisi 2 : 3. Jika sisi kecil 8 cm, sisi bersesuaian besar …", options: ["10 cm", "12 cm", "14 cm", "16 cm"], answer: 1 },
    { question: "Jika f(x) = 2x − 5, maka f(7) = …", options: ["7", "9", "12", "14"], answer: 1 },
    { question: "Median data 4, 7, 2, 9, 8 adalah …", options: ["4", "6", "7", "8"], answer: 2 },
    { question: "Volume kubus dengan luas permukaan 150 cm² adalah …", options: ["25 cm³", "100 cm³", "125 cm³", "150 cm³"], answer: 2 },
  ] },
  { level: 5, title: "Tantangan TKA", description: "Soal multi-langkah yang menguji koneksi dan argumentasi.", color: "#fb7185", questions: [
    { question: "Jika x + 1/x = 5, maka x² + 1/x² = …", options: ["21", "23", "25", "27"], answer: 1 },
    { question: "Barisan aritmetika memiliki U3 = 10 dan U8 = 25. Nilai U15 adalah …", options: ["43", "46", "49", "52"], answer: 2 },
    { question: "Jarak titik (−2, 3) ke (4, −5) adalah …", options: ["8", "10", "√52", "√100"], answer: 3 },
    { question: "Akar-akar x² − 7x + 12 = 0 adalah …", options: ["1 dan 12", "2 dan 6", "3 dan 4", "−3 dan −4"], answer: 2 },
    { question: "Sebuah kotak berisi 3 bola merah dan 2 biru. Diambil 2 tanpa pengembalian. Peluang keduanya merah …", options: ["1/5", "3/10", "2/5", "1/2"], answer: 1 },
  ] },
];

const UjiMandiriPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = ["light", "white", "forest"].includes(theme);
  const [student, setStudent] = useState({ name: "", className: "" });
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<Result[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const activePackage = packages.find((item) => item.level === activeLevel);
  const score = useMemo(() => activePackage ? activePackage.questions.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0) : 0, [activePackage, answers]);

  const begin = (level: number) => { playPopSound(); setActiveLevel(level); setAnswers({}); setSubmitted(false); };
  const submit = () => { if (!activePackage || Object.keys(answers).length !== 5) return; playPopSound(); setSubmitted(true); setResults((current) => [{ level: activePackage.level, score, total: 5, date: new Date().toLocaleDateString("id-ID") }, ...current]); };

  return (
    <div className="relative min-h-screen overflow-hidden gradient-space">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
        <header className="rounded-3xl border p-6 md:p-8" style={{ background: isLight ? "var(--bg-card)" : "rgba(15,23,42,.72)", borderColor: "var(--border)" }}>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold" style={{ color: "#67e8f9", borderColor: "rgba(103,232,249,.3)" }}><ClipboardCheck className="size-4" /> UJI MANDIRI</div><h1 className="font-display text-3xl font-black tracking-tight md:text-5xl" style={{ color: "var(--text-primary)" }}>Cek level matematikamu</h1><p className="mt-2 max-w-2xl font-body text-sm leading-6" style={{ color: "var(--text-secondary)" }}>Pilih paket sesuai tantanganmu. Setiap paket berisi 5 soal pilihan ganda dan hasilnya tercatat di raport sesi ini.</p></div>
            <div className="flex items-center gap-3 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}><UserRound className="size-7" style={{ color: "#22d3ee" }} /><div><p className="text-xs" style={{ color: "var(--text-secondary)" }}>Peserta</p><p className="font-display font-bold" style={{ color: "var(--text-primary)" }}>{student.name || "Nama belum diisi"}</p><p className="text-xs" style={{ color: "var(--text-secondary)" }}>{student.className || "Kelas belum diisi"}</p></div></div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><label className="flex flex-col gap-2 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Nama siswa<input value={student.name} onChange={(event) => setStudent({ ...student, name: event.target.value })} placeholder="Contoh: Aisyah" className="rounded-xl border px-4 py-3 text-sm outline-none" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} /></label><label className="flex flex-col gap-2 text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Kelas<input value={student.className} onChange={(event) => setStudent({ ...student, className: event.target.value })} placeholder="Contoh: VIII A" className="rounded-xl border px-4 py-3 text-sm outline-none" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} /></label></div>
        </header>

        {!activePackage ? <>
          <section className="grid gap-4 md:grid-cols-5">{packages.map((item) => <button key={item.level} onClick={() => begin(item.level)} className="group rounded-2xl border p-5 text-left transition hover:-translate-y-1" style={{ background: isLight ? "var(--bg-card)" : "rgba(15,23,42,.7)", borderColor: item.color }}><div className="flex items-center justify-between"><span className="font-display text-3xl font-black" style={{ color: item.color }}>{item.level}</span><Award className="size-5" style={{ color: item.color }} /></div><h2 className="mt-5 font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>Level {item.level}</h2><p className="mt-2 text-xs leading-5" style={{ color: "var(--text-secondary)" }}>{item.title}. {item.description}</p><span className="mt-5 inline-flex rounded-full px-3 py-1 text-xs font-bold" style={{ background: `${item.color}22`, color: item.color }}>Mulai paket</span></button>)}</section>
          <section className="rounded-2xl border p-5" style={{ background: isLight ? "var(--bg-card)" : "rgba(15,23,42,.7)", borderColor: "var(--border)" }}><div className="mb-4 flex items-center gap-2"><History className="size-5" style={{ color: "#fbbf24" }} /><h2 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>Raport / Histori Sesi Ini</h2></div>{results.length ? <div className="grid gap-2 sm:grid-cols-3">{results.map((result, index) => <div key={`${result.date}-${index}`} className="rounded-xl border p-3" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}><p className="text-xs" style={{ color: "var(--text-secondary)" }}>{result.date} · Level {result.level}</p><p className="mt-1 font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>{result.score}/{result.total}</p></div>)}</div> : <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Belum ada paket yang dikerjakan. Hasil pengerjaan akan muncul di sini.</p>}</section>
        </> : <section className="rounded-3xl border p-5 md:p-8" style={{ background: isLight ? "var(--bg-card)" : "rgba(15,23,42,.8)", borderColor: activePackage.color }}><div className="mb-7 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest" style={{ color: activePackage.color }}>Paket Level {activePackage.level}</p><h2 className="mt-1 font-display text-2xl font-black" style={{ color: "var(--text-primary)" }}>{activePackage.title}</h2></div><button onClick={() => setActiveLevel(null)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}><ArrowLeft className="size-4" /> Kembali</button></div><div className="flex flex-col gap-5">{activePackage.questions.map((question, index) => <fieldset key={question.question} className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}><legend className="px-2 text-sm font-bold" style={{ color: "var(--text-primary)" }}>{index + 1}. {question.question}</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{question.options.map((option, optionIndex) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm" style={{ borderColor: answers[index] === optionIndex ? activePackage.color : "var(--border)", color: "var(--text-primary)" }}><input type="radio" name={`question-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers({ ...answers, [index]: optionIndex })} />{option}</label>)}</div>{submitted && <p className="mt-3 text-xs font-bold" style={{ color: answers[index] === question.answer ? "#34d399" : "#fb7185" }}>{answers[index] === question.answer ? "Benar" : `Jawaban benar: ${question.options[question.answer]}`}</p>}</fieldset>)}</div><div className="mt-7 flex flex-wrap items-center justify-between gap-3"><p className="text-sm" style={{ color: "var(--text-secondary)" }}>{submitted ? `Skor kamu ${score}/5` : `${Object.keys(answers).length}/5 soal terjawab`}</p>{submitted ? <button onClick={() => begin(activePackage.level)} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold" style={{ background: activePackage.color, color: "#082f49" }}><RotateCcw className="size-4" /> Ulangi paket</button> : <button disabled={Object.keys(answers).length !== 5} onClick={submit} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40" style={{ background: activePackage.color, color: "#082f49" }}><CheckCircle2 className="size-4" /> Kumpulkan jawaban</button>}</div></section>}
      </main>
    </div>
  );
};

export default UjiMandiriPage;
