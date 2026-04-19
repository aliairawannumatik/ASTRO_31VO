import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { ArrowLeft, CheckCircle2, MessageSquareHeart, Send, Sparkles } from "lucide-react";

type FormData = {
  nama: string;
  kelas: string;
  kesan: string;
  pesan: string;
  saran: string;
};

const initialForm: FormData = {
  nama: "",
  kelas: "",
  kesan: "",
  pesan: "",
  saran: "",
};

const PesanKesanPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateForm = (field: keyof FormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
  };

  const isComplete = form.nama.trim() && form.kelas.trim() && form.kesan.trim() && form.pesan.trim();

  const handleSubmit = () => {
    if (!isComplete) return;
    playPopSound();
    const saved = JSON.parse(localStorage.getItem("numatik-pesan-kesan") || "[]");
    saved.push({ ...form, waktu: new Date().toISOString() });
    localStorage.setItem("numatik-pesan-kesan", JSON.stringify(saved));
    setSubmitted(true);
  };

  const resetForm = () => {
    playPopSound();
    setForm(initialForm);
    setSubmitted(false);
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <MessageSquareHeart className="w-4 h-4" />
            Form Masukan Pengguna
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            Pesan dan Kesan Penggunaan Aplikasi
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-2xl mx-auto font-body">
            Tuliskan pengalamanmu setelah menggunakan aplikasi NUMATIK. Masukanmu membantu aplikasi ini menjadi lebih baik.
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-200/30 bg-card/90 backdrop-blur p-5 md:p-8 shadow-2xl mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <label className="block">
              <span className="text-sm font-semibold text-cyan-100">Nama</span>
              <input
                value={form.nama}
                onChange={(event) => updateForm("nama", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-cyan-200/25 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                placeholder="Tulis nama kamu"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-cyan-100">Kelas</span>
              <input
                value={form.kelas}
                onChange={(event) => updateForm("kelas", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-cyan-200/25 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                placeholder="Contoh: 7A"
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-yellow-100">Kesan setelah menggunakan aplikasi</span>
              <textarea
                value={form.kesan}
                onChange={(event) => updateForm("kesan", event.target.value)}
                className="mt-2 min-h-28 w-full rounded-2xl border border-yellow-200/25 bg-black/30 px-4 py-3 text-white outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/20"
                placeholder="Contoh: Saya merasa belajar matematika jadi lebih menyenangkan karena..."
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-fuchsia-100">Pesan untuk aplikasi NUMATIK</span>
              <textarea
                value={form.pesan}
                onChange={(event) => updateForm("pesan", event.target.value)}
                className="mt-2 min-h-28 w-full rounded-2xl border border-fuchsia-200/25 bg-black/30 px-4 py-3 text-white outline-none focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300/20"
                placeholder="Tuliskan pesanmu untuk aplikasi ini"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-emerald-100">Saran pengembangan</span>
              <textarea
                value={form.saran}
                onChange={(event) => updateForm("saran", event.target.value)}
                className="mt-2 min-h-24 w-full rounded-2xl border border-emerald-200/25 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                placeholder="Tuliskan saran fitur, materi, atau tampilan yang kamu inginkan"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:scale-105"
            >
              <Send className="w-5 h-5" />
              Kirim Pesan dan Kesan
            </button>
            <button
              onClick={resetForm}
              className="rounded-full border border-white/20 bg-white/10 px-7 py-3 font-bold text-white hover:bg-white/15 transition-colors"
            >
              Kosongkan Isian
            </button>
          </div>

          {!isComplete && (
            <p className="mt-3 text-center text-xs text-yellow-100/80">
              Nama, kelas, kesan, dan pesan wajib diisi sebelum dikirim.
            </p>
          )}
        </div>

        {submitted && (
          <div className="rounded-3xl border border-emerald-200/30 bg-emerald-500/10 backdrop-blur p-5 text-center mb-6 animate-slide-up">
            <CheckCircle2 className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
            <h2 className="font-display text-2xl font-bold text-emerald-100 mb-2">Terima kasih!</h2>
            <p className="text-sm text-white/75">Pesan dan kesan kamu sudah tersimpan di perangkat ini.</p>
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-black/20 backdrop-blur p-5 mb-8">
          <div className="flex items-start gap-3">
            <Sparkles className="w-7 h-7 text-yellow-200 shrink-0" />
            <div>
              <h2 className="font-display text-xl font-bold text-yellow-100 mb-2">Panduan mengisi</h2>
              <ul className="list-disc pl-5 text-sm text-white/70 space-y-1 font-body">
                <li>Tuliskan kesan belajar matematika menggunakan aplikasi ini.</li>
                <li>Berikan pesan yang sopan dan membangun.</li>
                <li>Tambahkan saran agar aplikasi semakin bermanfaat.</li>
              </ul>
            </div>
          </div>
        </div>

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

export default PesanKesanPage;
