import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import { playPopSound } from "@/hooks/useAudio";
import { AlertTriangle, CheckCircle2, ClipboardCheck, Lock, RefreshCcw, ShieldCheck } from "lucide-react";

const questions = [
  {
    id: "q1",
    question: "Perbandingan 18 : 24 dalam bentuk paling sederhana adalah ...",
    options: ["2 : 3", "3 : 4", "4 : 3", "6 : 8"],
    answer: "3 : 4",
  },
  {
    id: "q2",
    question: "Dalam sebuah kelas terdapat 12 siswa laki-laki dan 18 siswa perempuan. Rasio laki-laki terhadap perempuan adalah ...",
    options: ["2 : 3", "3 : 2", "12 : 30", "5 : 3"],
    answer: "2 : 3",
  },
  {
    id: "q3",
    question: "Harga 5 buku adalah Rp25.000. Harga 1 buku adalah ...",
    options: ["Rp4.000", "Rp5.000", "Rp6.000", "Rp10.000"],
    answer: "Rp5.000",
  },
  {
    id: "q4",
    question: "Jarak 180 km ditempuh dalam 3 jam. Kecepatan rata-ratanya adalah ...",
    options: ["45 km/jam", "50 km/jam", "60 km/jam", "90 km/jam"],
    answer: "60 km/jam",
  },
  {
    id: "q5",
    question: "Rasio merah : biru = 4 : 5. Jika jumlah seluruh bagian 9 dan total benda 36, banyak benda merah adalah ...",
    options: ["12", "16", "20", "24"],
    answer: "16",
  },
];

const UlanganHarianPage = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [violations, setViolations] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const score = useMemo(() => questions.filter((item) => answers[item.id] === item.answer).length, [answers]);
  const value = Math.round((score / questions.length) * 100);

  const addViolation = (message: string) => {
    setViolations((current) => {
      if (current[current.length - 1] === message) return current;
      return [...current, message];
    });
  };

  const enterFullscreen = async () => {
    playPopSound();
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch {
      addViolation("Fullscreen tidak aktif. Guru perlu mengawasi perangkat siswa.");
    }
    setStarted(true);
  };

  const submitTest = () => {
    if (!allAnswered) return;
    playPopSound();
    setSubmitted(true);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    }
  };

  const restartTest = () => {
    playPopSound();
    setAnswers({});
    setSubmitted(false);
    setViolations([]);
    setStarted(false);
    setIsFullscreen(false);
  };

  useEffect(() => {
    if (!started || submitted) return;

    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active) addViolation("Siswa keluar dari mode fullscreen saat ulangan berlangsung.");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) addViolation("Siswa meninggalkan tab ulangan saat ulangan berlangsung.");
    };

    const handleBlur = () => {
      addViolation("Jendela ulangan tidak aktif saat ulangan berlangsung.");
    };

    const blockEvent = (event: Event) => {
      event.preventDefault();
      addViolation("Aksi salin/tempel/klik kanan diblokir selama ulangan.");
    };

    const blockKeys = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && ["c", "v", "x", "a", "t", "n", "l", "r"].includes(key)) {
        event.preventDefault();
        addViolation("Shortcut browser diblokir selama ulangan.");
      }
      if (key === "escape") {
        addViolation("Tombol Escape terdeteksi saat ulangan berlangsung.");
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("contextmenu", blockEvent);
    document.addEventListener("copy", blockEvent);
    document.addEventListener("cut", blockEvent);
    document.addEventListener("paste", blockEvent);
    document.addEventListener("keydown", blockKeys);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("contextmenu", blockEvent);
      document.removeEventListener("copy", blockEvent);
      document.removeEventListener("cut", blockEvent);
      document.removeEventListener("paste", blockEvent);
      document.removeEventListener("keydown", blockKeys);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [started, submitted]);

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-10">
        {!started && !submitted && (
          <div className="min-h-[85vh] flex items-center justify-center">
            <div className="max-w-2xl w-full rounded-3xl border border-cyan-200/30 bg-card/90 backdrop-blur p-6 md:p-8 text-center shadow-2xl">
              <ShieldCheck className="w-16 h-16 text-cyan-200 mx-auto mb-4" />
              <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan mb-3">ULANGAN HARIAN</h1>
              <p className="text-white/70 font-body mb-6">
                Mode ulangan akan berjalan dalam fullscreen. Siswa harus mengerjakan 5 soal sampai selesai, lalu skor muncul setelah dikumpulkan.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 text-left mb-6">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <Lock className="w-6 h-6 text-yellow-200 mb-2" />
                  <p className="text-sm text-white/75">Tidak ada tombol keluar selama ulangan.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <AlertTriangle className="w-6 h-6 text-rose-200 mb-2" />
                  <p className="text-sm text-white/75">Keluar fullscreen/tab akan dicatat sebagai peringatan.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <ClipboardCheck className="w-6 h-6 text-emerald-200 mb-2" />
                  <p className="text-sm text-white/75">Skor muncul setelah semua soal dijawab.</p>
                </div>
              </div>
              <button
                onClick={enterFullscreen}
                className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground hover:scale-105 transition-transform"
              >
                Mulai Ulangan Fullscreen
              </button>
            </div>
          </div>
        )}

        {started && !submitted && (
          <div className="space-y-5">
            <div className="sticky top-0 z-20 rounded-3xl border border-cyan-200/30 bg-background/90 backdrop-blur p-4 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan">Ulangan Harian - Perbandingan</h1>
                  <p className="text-sm text-white/65">Jawab semua soal. Skor akan muncul setelah dikumpulkan.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-cyan-500/15 px-3 py-2 text-cyan-100">Terjawab {answeredCount}/{questions.length}</span>
                  <span className={`rounded-full px-3 py-2 ${isFullscreen ? "bg-emerald-500/15 text-emerald-100" : "bg-rose-500/15 text-rose-100"}`}>
                    {isFullscreen ? "Fullscreen aktif" : "Fullscreen tidak aktif"}
                  </span>
                  <span className="rounded-full bg-yellow-500/15 px-3 py-2 text-yellow-100">Peringatan {violations.length}</span>
                </div>
              </div>
              {violations.length > 0 && (
                <div className="mt-3 rounded-2xl border border-yellow-200/25 bg-yellow-400/10 p-3 text-xs text-yellow-100">
                  <p className="font-bold mb-1">Catatan pengawasan:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {violations.slice(-3).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {questions.map((item, index) => (
              <section key={item.id} className="rounded-3xl border border-border bg-card/85 backdrop-blur p-5 md:p-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-display font-bold shrink-0">{index + 1}</div>
                  <div className="flex-1">
                    <p className="font-body text-base md:text-lg text-white/90 mb-4">{item.question}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {item.options.map((option) => {
                        const active = answers[item.id] === option;
                        return (
                          <button
                            key={option}
                            onClick={() => setAnswers((current) => ({ ...current, [item.id]: option }))}
                            className={`text-left rounded-2xl border px-4 py-3 transition-all ${active ? "border-primary bg-primary/20 text-white" : "border-white/10 bg-black/20 text-white/75 hover:border-primary/50"}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            ))}

            <div className="rounded-3xl border border-emerald-200/30 bg-emerald-500/10 backdrop-blur p-5 text-center">
              <button
                onClick={submitTest}
                disabled={!allAnswered}
                className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:scale-105"
              >
                Kumpulkan dan Lihat Skor
              </button>
              {!allAnswered && <p className="mt-3 text-sm text-white/65">Jawab semua soal terlebih dahulu agar bisa dikumpulkan.</p>}
            </div>
          </div>
        )}

        {submitted && (
          <div className="min-h-[85vh] flex items-center justify-center">
            <div className="max-w-2xl w-full rounded-3xl border border-emerald-200/30 bg-card/90 backdrop-blur p-6 md:p-8 text-center shadow-2xl">
              <CheckCircle2 className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
              <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan mb-3">Skor Ulangan</h1>
              <p className="text-6xl font-display font-bold text-white mb-2">{score}/{questions.length}</p>
              <p className="text-xl font-bold text-emerald-100 mb-5">Nilai: {value}</p>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-left mb-5">
                <p className="font-bold text-yellow-100 mb-2">Catatan keamanan ulangan</p>
                {violations.length === 0 ? (
                  <p className="text-sm text-white/70">Tidak ada peringatan keluar fullscreen/tab yang tercatat.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                    {violations.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                  </ul>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={restartTest}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/15 transition-colors"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Ulangi Ulangan
                </button>
                <button
                  onClick={() => { playPopSound(); navigate("/menu"); }}
                  className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:scale-105 transition-transform"
                >
                  Kembali ke Menu Utama
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UlanganHarianPage;
