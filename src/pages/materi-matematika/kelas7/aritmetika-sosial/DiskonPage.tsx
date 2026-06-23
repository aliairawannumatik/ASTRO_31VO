import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import WarungDiskon from "@/components/WarungDiskon";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, Tag, AlertCircle, Star, CheckCircle, XCircle,
  TrendingDown, Percent, ShoppingBag, HelpCircle, ArrowRight,
  RefreshCw
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID").format(Math.round(n));

const DiskonBar = ({ persen }: { persen: number }) => {
  const safe = Math.min(100, Math.max(0, persen));
  const bayar = 100 - safe;
  return (
    <div className="space-y-2">
      <div className="flex h-8 rounded-lg overflow-hidden border border-border text-xs font-bold">
        <div
          className="bg-red-500/80 flex items-center justify-center text-white transition-all duration-500"
          style={{ width: `${safe}%` }}
        >
          {safe > 8 ? `Diskon ${safe}%` : ""}
        </div>
        <div
          className="bg-cyan-500/80 flex items-center justify-center text-white transition-all duration-500"
          style={{ width: `${bayar}%` }}
        >
          {bayar > 8 ? `Bayar ${bayar}%` : ""}
        </div>
      </div>
      <div className="flex justify-between text-xs text-white/50">
        <span>0%</span>
        <span className="text-red-400">Potongan: {safe}%</span>
        <span className="text-cyan-400">Sisa bayar: {bayar}%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

const KalkulatorDiskon = () => {
  const [mode, setMode] = useState<"cari-harga" | "cari-asal" | "cari-persen" | "ganda">("cari-harga");
  const [hargaAwal, setHargaAwal] = useState("");
  const [persen, setPersen] = useState("");
  const [hargaBayar, setHargaBayar] = useState("");
  const [hargaAsal2, setHargaAsal2] = useState("");
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [hargaGanda, setHargaGanda] = useState("");

  const ha = parseFloat(hargaAwal.replace(/\./g, "").replace(",", ".")) || 0;
  const ps = parseFloat(persen.replace(",", ".")) || 0;
  const hb = parseFloat(hargaBayar.replace(/\./g, "").replace(",", ".")) || 0;
  const ha2 = parseFloat(hargaAsal2.replace(/\./g, "").replace(",", ".")) || 0;
  const pd1 = parseFloat(d1.replace(",", ".")) || 0;
  const pd2 = parseFloat(d2.replace(",", ".")) || 0;
  const hg = parseFloat(hargaGanda.replace(/\./g, "").replace(",", ".")) || 0;

  const besar = ha * (ps / 100);
  const bayar = ha - besar;
  const asal = hb / ((100 - ps) / 100);
  const persenDiskon = ha2 > 0 ? ((ha2 - hb) / ha2) * 100 : 0;
  const step1 = hg * ((100 - pd1) / 100);
  const step2 = step1 * ((100 - pd2) / 100);
  const efektif = 100 - (step2 / hg) * 100;

  const modes = [
    { id: "cari-harga", label: "Cari Harga Bayar", icon: "💰" },
    { id: "cari-asal", label: "Cari Harga Asli", icon: "🔍" },
    { id: "cari-persen", label: "Cari % Diskon", icon: "%" },
    { id: "ganda", label: "Diskon Ganda", icon: "🏷️" },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => { playPopSound(); setMode(m.id); }}
            className={`px-2 py-2 rounded-lg text-xs font-semibold font-body transition-all border ${
              mode === m.id
                ? "bg-primary/20 border-primary text-primary"
                : "bg-slate-800/60 border-border text-white/60 hover:border-primary/50"
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {mode === "cari-harga" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Masukkan harga awal dan persen diskon untuk menghitung harga yang harus dibayar.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs text-white/60 mb-1 block">Harga Awal (Rp)</label>
              <input
                type="number"
                value={hargaAwal}
                onChange={(e) => setHargaAwal(e.target.value)}
                placeholder="Contoh: 350000"
                className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="font-body text-xs text-white/60 mb-1 block">Diskon (%)</label>
              <input
                type="number"
                value={persen}
                onChange={(e) => setPersen(e.target.value)}
                placeholder="Contoh: 40"
                min={0} max={100}
                className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          {ha > 0 && ps > 0 && (
            <div className="space-y-3 pt-2">
              <DiskonBar persen={ps} />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900/60 rounded-lg p-3">
                  <p className="font-body text-xs text-white/50 mb-1">Harga Awal</p>
                  <p className="font-body text-sm font-bold text-white">Rp{fmt(ha)}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-red-400 mb-1">Potongan</p>
                  <p className="font-body text-sm font-bold text-red-300">−Rp{fmt(besar)}</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-cyan-400 mb-1">Harga Bayar</p>
                  <p className="font-body text-sm font-bold text-cyan-300">Rp{fmt(bayar)}</p>
                </div>
              </div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
                <p className="font-body text-xs text-white/50">Cara Cepat:</p>
                <p className="font-body text-sm text-primary font-semibold">
                  Rp{fmt(ha)} × {100 - ps}% = <strong>Rp{fmt(bayar)}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "cari-asal" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Ketahui harga bayar dan persen diskon → temukan harga aslinya.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs text-white/60 mb-1 block">Harga Bayar (Rp)</label>
              <input
                type="number"
                value={hargaBayar}
                onChange={(e) => setHargaBayar(e.target.value)}
                placeholder="Contoh: 280000"
                className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="font-body text-xs text-white/60 mb-1 block">Diskon (%)</label>
              <input
                type="number"
                value={persen}
                onChange={(e) => setPersen(e.target.value)}
                placeholder="Contoh: 30"
                min={0} max={99}
                className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          {hb > 0 && ps > 0 && ps < 100 && (
            <div className="space-y-3 pt-2">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="font-body text-xs text-white/50 mb-2">Langkah penyelesaian:</p>
                <p className="font-body text-sm text-white/80">
                  Harga bayar = {100 - ps}% dari harga asli
                </p>
                <p className="font-body text-sm text-white/80">
                  Harga asli = Rp{fmt(hb)} ÷ {(100 - ps) / 100} = <strong className="text-primary">Rp{fmt(asal)}</strong>
                </p>
              </div>
              <DiskonBar persen={ps} />
            </div>
          )}
        </div>
      )}

      {mode === "cari-persen" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Masukkan harga asal dan harga bayar untuk menghitung berapa persen diskonnya.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs text-white/60 mb-1 block">Harga Asal (Rp)</label>
              <input
                type="number"
                value={hargaAsal2}
                onChange={(e) => setHargaAsal2(e.target.value)}
                placeholder="Contoh: 500000"
                className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="font-body text-xs text-white/60 mb-1 block">Harga Bayar (Rp)</label>
              <input
                type="number"
                value={hargaBayar}
                onChange={(e) => setHargaBayar(e.target.value)}
                placeholder="Contoh: 375000"
                className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          {ha2 > 0 && hb > 0 && ha2 > hb && (
            <div className="space-y-3 pt-2">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <p className="font-body text-xs text-white/50 mb-2">Cara menghitung:</p>
                <p className="font-body text-sm text-white/80">
                  Selisih = Rp{fmt(ha2)} − Rp{fmt(hb)} = Rp{fmt(ha2 - hb)}
                </p>
                <p className="font-body text-sm text-white/80">
                  % Diskon = Rp{fmt(ha2 - hb)} ÷ Rp{fmt(ha2)} × 100% = <strong className="text-purple-300">{persenDiskon.toFixed(1)}%</strong>
                </p>
              </div>
              <DiskonBar persen={Math.round(persenDiskon)} />
            </div>
          )}
          {ha2 > 0 && hb > 0 && ha2 <= hb && (
            <p className="font-body text-xs text-red-400">Harga bayar tidak boleh lebih besar atau sama dengan harga asal.</p>
          )}
        </div>
      )}

      {mode === "ganda" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Hitung harga akhir setelah dua diskon berturutan (bukan dijumlahkan!).</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-body text-xs text-white/60 mb-1 block">Harga Awal (Rp)</label>
              <input
                type="number"
                value={hargaGanda}
                onChange={(e) => setHargaGanda(e.target.value)}
                placeholder="Contoh: 100000"
                className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="font-body text-xs text-white/60 mb-1 block">Diskon 1 (%)</label>
              <input
                type="number"
                value={d1}
                onChange={(e) => setD1(e.target.value)}
                placeholder="Contoh: 20"
                min={0} max={99}
                className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="font-body text-xs text-white/60 mb-1 block">Diskon 2 (%)</label>
              <input
                type="number"
                value={d2}
                onChange={(e) => setD2(e.target.value)}
                placeholder="Contoh: 10"
                min={0} max={99}
                className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          {hg > 0 && pd1 > 0 && pd2 > 0 && (
            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 flex items-center justify-between">
                  <span className="font-body text-xs text-white/60">Harga Awal</span>
                  <span className="font-body text-sm font-bold text-white">Rp{fmt(hg)}</span>
                </div>
                <div className="flex items-center gap-2 px-2">
                  <ArrowRight className="w-4 h-4 text-orange-400" />
                  <span className="font-body text-xs text-orange-300">Setelah diskon {pd1}%</span>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 flex items-center justify-between">
                  <span className="font-body text-xs text-white/60">Setelah Diskon 1</span>
                  <span className="font-body text-sm font-bold text-orange-300">Rp{fmt(step1)}</span>
                </div>
                <div className="flex items-center gap-2 px-2">
                  <ArrowRight className="w-4 h-4 text-yellow-400" />
                  <span className="font-body text-xs text-yellow-300">Setelah diskon {pd2}%</span>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 flex items-center justify-between">
                  <span className="font-body text-xs text-white/60">Harga Bayar Akhir</span>
                  <span className="font-body text-sm font-bold text-cyan-300">Rp{fmt(step2)}</span>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                <p className="font-body text-xs text-white/60 mb-1">
                  Diskon {pd1}% + {pd2}% ≠ diskon {pd1 + pd2}%
                </p>
                <p className="font-body text-sm text-red-300 font-semibold">
                  Diskon efektif sesungguhnya = <strong>{efektif.toFixed(2)}%</strong>
                </p>
                <p className="font-body text-xs text-white/40 mt-1">
                  (Bukan {pd1 + pd2}%, selisih {((pd1 + pd2) - efektif).toFixed(2)}%!)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const quizData = [
  {
    soal: "Sebuah sepatu seharga Rp450.000 mendapat diskon 20%. Berapa harga yang harus dibayar?",
    pilihan: ["Rp90.000", "Rp360.000", "Rp380.000", "Rp400.000"],
    benar: 1,
    penjelasan: "Harga Bayar = (100% − 20%) × Rp450.000 = 80% × Rp450.000 = Rp360.000",
  },
  {
    soal: "Sebuah tas dijual seharga Rp312.000 setelah diskon 35%. Berapakah harga asli tas tersebut?",
    pilihan: ["Rp420.000", "Rp460.000", "Rp480.000", "Rp500.000"],
    benar: 2,
    penjelasan: "Harga Asli = Rp312.000 ÷ (100% − 35%) = Rp312.000 ÷ 0,65 = Rp480.000",
  },
  {
    soal: 'Promo "Diskon 20% + 10%" dari harga Rp200.000. Berapa harga yang dibayar?',
    pilihan: ["Rp140.000", "Rp144.000", "Rp160.000", "Rp180.000"],
    benar: 1,
    penjelasan: "Diskon 20%: Rp200.000 × 80% = Rp160.000. Diskon 10%: Rp160.000 × 90% = Rp144.000. Bukan Rp140.000 (yang sama dengan diskon 30%).",
  },
  {
    soal: "Harga asal sebuah jaket Rp600.000, dijual dengan harga Rp420.000. Berapa persen diskonnya?",
    pilihan: ["25%", "28%", "30%", "35%"],
    benar: 2,
    penjelasan: "Selisih = Rp600.000 − Rp420.000 = Rp180.000. % Diskon = Rp180.000 ÷ Rp600.000 × 100% = 30%",
  },
  {
    soal: "Harga celana setelah diskon 25% adalah Rp225.000. Berapa harga aslinya?",
    pilihan: ["Rp280.000", "Rp300.000", "Rp320.000", "Rp350.000"],
    benar: 1,
    penjelasan: "Harga Asli = Rp225.000 ÷ (100% − 25%) = Rp225.000 ÷ 0,75 = Rp300.000",
  },
];

const MiniKuis = () => {
  const [idx, setIdx] = useState(0);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const [selesai, setSelesai] = useState(false);
  const [skor, setSkor] = useState(0);
  const [jawaban, setJawaban] = useState<(number | null)[]>(Array(quizData.length).fill(null));

  const q = quizData[idx];

  const pilih = (i: number) => {
    if (dipilih !== null) return;
    playPopSound();
    setDipilih(i);
    const baru = [...jawaban];
    baru[idx] = i;
    setJawaban(baru);
    if (i === q.benar) setSkor((s) => s + 1);
  };

  const lanjut = () => {
    playPopSound();
    if (idx < quizData.length - 1) {
      setIdx(idx + 1);
      setDipilih(jawaban[idx + 1]);
    } else {
      setSelesai(true);
    }
  };

  const kembali = () => {
    playPopSound();
    if (idx > 0) {
      setIdx(idx - 1);
      setDipilih(jawaban[idx - 1]);
    }
  };

  const ulang = () => {
    playPopSound();
    setIdx(0);
    setDipilih(null);
    setSelesai(false);
    setSkor(0);
    setJawaban(Array(quizData.length).fill(null));
  };

  if (selesai) {
    const pct = Math.round((skor / quizData.length) * 100);
    const warna = pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400";
    const pesan = pct >= 80 ? "Luar biasa! Kamu sangat memahami materi diskon." : pct >= 60 ? "Bagus! Coba pelajari lagi bagian yang belum tepat." : "Tetap semangat! Baca kembali materinya dan coba lagi.";
    return (
      <div className="text-center space-y-4 py-4">
        <Star className="w-12 h-12 text-yellow-400 mx-auto" />
        <p className="font-body text-lg font-bold text-white">Hasil Kuis</p>
        <p className={`font-display text-4xl font-bold ${warna}`}>{skor}/{quizData.length}</p>
        <p className={`font-body text-sm ${warna}`}>{pct}% Benar</p>
        <p className="font-body text-sm text-white/60">{pesan}</p>
        <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
          {quizData.map((q, i) => (
            <div key={i} className={`h-8 rounded-lg flex items-center justify-center ${jawaban[i] === q.benar ? "bg-green-500/30 border border-green-500" : "bg-red-500/30 border border-red-500"}`}>
              {jawaban[i] === q.benar ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            </div>
          ))}
        </div>
        <button onClick={ulang} className="inline-flex items-center gap-2 bg-primary/20 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-primary/30 transition-colors">
          <RefreshCw className="w-4 h-4" /> Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {quizData.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : jawaban[i] !== null ? (jawaban[i] === quizData[i].benar ? "w-3 bg-green-500" : "w-3 bg-red-500") : "w-3 bg-white/20"}`} />
          ))}
        </div>
        <span className="font-body text-xs text-white/40">Soal {idx + 1}/{quizData.length}</span>
      </div>

      <div className="bg-slate-900/60 rounded-xl p-4">
        <p className="font-body text-sm text-white leading-relaxed">{q.soal}</p>
      </div>

      <div className="space-y-2">
        {q.pilihan.map((p, i) => {
          let cls = "bg-slate-800/60 border-border text-white/80 hover:border-primary/50";
          if (dipilih !== null) {
            if (i === q.benar) cls = "bg-green-500/20 border-green-500 text-green-300";
            else if (i === dipilih && i !== q.benar) cls = "bg-red-500/20 border-red-500 text-red-300";
            else cls = "bg-slate-800/30 border-border text-white/30";
          }
          return (
            <button
              key={i}
              onClick={() => pilih(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border font-body text-sm transition-all flex items-center gap-3 ${cls}`}
            >
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              {p}
              {dipilih !== null && i === q.benar && <CheckCircle className="w-4 h-4 text-green-400 ml-auto shrink-0" />}
              {dipilih !== null && i === dipilih && i !== q.benar && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>

      {dipilih !== null && (
        <div className={`rounded-lg p-4 border ${dipilih === q.benar ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
          <p className={`font-body text-xs font-semibold mb-1 ${dipilih === q.benar ? "text-green-400" : "text-red-400"}`}>
            {dipilih === q.benar ? "✓ Benar!" : "✗ Belum tepat."}
          </p>
          <p className="font-body text-xs text-white/70">{q.penjelasan}</p>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <button
          onClick={kembali}
          disabled={idx === 0}
          className="px-4 py-2 rounded-lg text-sm font-body font-semibold border border-border text-white/60 hover:border-primary/50 disabled:opacity-30 transition-all"
        >
          ← Sebelumnya
        </button>
        <button
          onClick={lanjut}
          disabled={dipilih === null}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-body font-semibold bg-primary/20 border border-primary text-primary hover:bg-primary/30 disabled:opacity-30 transition-all"
        >
          {idx < quizData.length - 1 ? "Lanjut →" : "Lihat Hasil"}
        </button>
      </div>
    </div>
  );
};

const Section = ({
  id, expanded, onToggle, icon, title, children
}: {
  id: string; expanded: boolean; onToggle: (id: string) => void;
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) => (
  <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
    <button onClick={() => onToggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
    {expanded && <div className="px-5 pb-5">{children}</div>}
  </div>
);

const DiskonPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "rumus", "visual", "kalkulator", "ganda", "persenDiskon", "contoh", "kesalahan", "kuis", "rangkuman"
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          DISKON (POTONGAN HARGA)
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 · Aritmetika Sosial · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* 1. PENGANTAR */}
          <Section id="intro" expanded={true} onToggle={toggleSection}
            icon={<Lightbulb className="w-5 h-5 text-yellow-400" />}
            title="Apa itu Diskon?"
          >
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Saat belanja online atau ke mal, kita sering melihat harga yang dicoret dengan angka baru di bawahnya.
                Itulah <strong className="text-primary">diskon</strong> — potongan harga yang diberikan penjual,
                dinyatakan dalam <strong className="text-cyan-300">bentuk persen dari harga asli</strong>.
              </p>
              <figure className="rounded-xl overflow-hidden border border-border">
                <img
                  src="/image_diskon.png"
                  alt="Papan diskon 20% di toko pakaian"
                  className="w-full object-cover max-h-64"
                />
                <figcaption className="bg-slate-900/70 px-4 py-2 text-center">
                  <a
                    href="https://tirto.id/jenis-jenis-diskon-dan-cara-menghitungnya-dari-harga-jual-f9Ld"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs text-white/40 hover:text-primary transition-colors"
                  >
                    Sumber: tirto.id — Jenis-Jenis Diskon dan Cara Menghitungnya dari Harga Jual
                  </a>
                </figcaption>
              </figure>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <ShoppingBag className="w-5 h-5 text-cyan-400" />, judul: "Harga Awal", desc: "Harga sebelum ada potongan (biasanya dicoret)", warna: "cyan" },
                  { icon: <TrendingDown className="w-5 h-5 text-red-400" />, judul: "Besar Diskon", desc: "Jumlah rupiah yang dipotong dari harga awal", warna: "red" },
                  { icon: <Tag className="w-5 h-5 text-green-400" />, judul: "Harga Bayar", desc: "Harga yang benar-benar harus dibayar pembeli", warna: "green" },
                ].map((c, i) => (
                  <div key={i} className={`bg-${c.warna}-500/10 border border-${c.warna}-500/30 rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-2">{c.icon}<p className={`font-body text-sm font-semibold text-${c.warna}-300`}>{c.judul}</p></div>
                    <p className="font-body text-xs text-white/60">{c.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-xs font-semibold text-yellow-300 mb-1">🔑 Prinsip Paling Penting:</p>
                <p className="font-body text-sm text-white/80">
                  Diskon <strong className="text-yellow-300">selalu dihitung dari harga AWAL</strong>, bukan dari harga bayar.
                  Ini adalah aturan dasar yang tidak boleh tertukar!
                </p>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4">
                <p className="font-body text-xs font-semibold text-white/60 mb-2">Contoh di kehidupan nyata:</p>
                <div className="space-y-2 font-body text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 line-through text-xs">Rp200.000</span>
                    <ArrowRight className="w-3 h-3 text-white/40" />
                    <span className="text-green-400 font-bold">Rp150.000</span>
                    <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded">DISKON 25%</span>
                  </div>
                  <p className="text-xs text-white/50">Hemat Rp50.000 → bayar hanya Rp150.000</p>
                </div>
              </div>
            </div>
          </Section>

          {/* 2. RUMUS */}
          <Section id="rumus" expanded={true} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-green-400" />}
            title="Semua Rumus Diskon"
          >
            <div className="space-y-4">
              <p className="font-body text-xs text-white/50 mb-3">Ada 4 jenis rumus yang perlu dikuasai:</p>

              {[
                {
                  no: "1", warna: "green", judul: "Menghitung Besar Diskon (dalam Rupiah)",
                  rumus: String.raw`\text{Besar Diskon} = \frac{\%\text{Diskon}}{100} \times \text{Harga Awal}`,
                  contoh: "Diskon 25% dari Rp400.000 = 0,25 × Rp400.000 = Rp100.000"
                },
                {
                  no: "2", warna: "cyan", judul: "Menghitung Harga Bayar",
                  rumus: String.raw`\text{Harga Bayar} = \left(1 - \frac{\%\text{Diskon}}{100}\right) \times \text{Harga Awal}`,
                  contoh: "Diskon 25%: Harga Bayar = (1 − 0,25) × Rp400.000 = 0,75 × Rp400.000 = Rp300.000"
                },
                {
                  no: "3", warna: "purple", judul: "Mencari Harga Awal (bila harga bayar diketahui)",
                  rumus: String.raw`\text{Harga Awal} = \frac{\text{Harga Bayar}}{1 - \frac{\%\text{Diskon}}{100}}`,
                  contoh: "Harga bayar Rp300.000 setelah diskon 25%: Harga Awal = Rp300.000 ÷ 0,75 = Rp400.000"
                },
                {
                  no: "4", warna: "orange", judul: "Mencari Persen Diskon",
                  rumus: String.raw`\%\text{Diskon} = \frac{\text{Harga Awal} - \text{Harga Bayar}}{\text{Harga Awal}} \times 100\%`,
                  contoh: "Harga awal Rp400.000, harga bayar Rp300.000: % diskon = (100.000 ÷ 400.000) × 100% = 25%"
                },
              ].map((r) => (
                <div key={r.no} className={`bg-${r.warna}-500/10 border border-${r.warna}-500/30 rounded-xl p-4 space-y-2`}>
                  <div className="flex items-center gap-2">
                    <span className={`bg-${r.warna}-500/20 text-${r.warna}-300 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0`}>{r.no}</span>
                    <p className={`font-body text-sm font-semibold text-${r.warna}-300`}>{r.judul}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <BlockMath math={r.rumus} />
                  </div>
                  <p className="font-body text-xs text-white/50 italic">Contoh: {r.contoh}</p>
                </div>
              ))}

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-yellow-200">
                  <strong>Tips Cepat:</strong> Jika diskon <InlineMath math="d\%" />, maka kamu hanya membayar <InlineMath math="(100 - d)\%" /> dari harga asli.
                  Diskon 30% → bayar 70%. Diskon 15% → bayar 85%. Langsung kalikan saja!
                </p>
              </div>
            </div>
          </Section>

          {/* 3. VISUALISASI */}
          <Section id="visual" expanded={true} onToggle={toggleSection}
            icon={<Percent className="w-5 h-5 text-blue-400" />}
            title="Visualisasi: Memahami Diskon Secara Visual"
          >
            <div className="space-y-4">
              <p className="font-body text-sm text-white/70">Bayangkan harga asli sebagai 100%. Bagian merah dipotong (diskon), bagian biru yang kamu bayar.</p>
              <div className="space-y-5">
                {[10, 25, 40, 60, 75].map((p) => (
                  <div key={p} className="space-y-1">
                    <p className="font-body text-xs text-white/50">Diskon {p}% → Bayar {100 - p}%</p>
                    <DiskonBar persen={p} />
                  </div>
                ))}
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4">
                <p className="font-body text-xs text-white/60 leading-relaxed">
                  <strong className="text-white">Perhatikan:</strong> Semakin besar diskon (merah), semakin sedikit yang harus dibayar (biru). 
                  Totalnya selalu 100% — jumlah diskon dan yang dibayar tidak pernah melebihi atau kurang dari harga asal.
                </p>
              </div>
            </div>
          </Section>

          {/* ── ANIMASI WARUNG DISKON ─────────────────────────── */}
          <WarungDiskon />

          {/* 4. KALKULATOR INTERAKTIF */}
          <Section id="kalkulator" expanded={true} onToggle={toggleSection}
            icon={<Calculator className="w-5 h-5 text-primary" />}
            title="Kalkulator Diskon Interaktif"
          >
            <div className="space-y-2">
              <p className="font-body text-xs text-white/50 mb-3">Coba sendiri! Pilih jenis perhitungan, masukkan angka, dan lihat hasilnya langsung.</p>
              <KalkulatorDiskon />
            </div>
          </Section>

          {/* 5. DISKON GANDA */}
          <Section id="ganda" expanded={true} onToggle={toggleSection}
            icon={<Tag className="w-5 h-5 text-orange-400" />}
            title="Diskon Ganda (Double Discount)"
          >
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Promo <strong className="text-orange-300">"Diskon 20% + 10%"</strong> <strong className="text-red-400">TIDAK SAMA</strong> dengan diskon 30%!
                  Diskon kedua dihitung dari harga <em>setelah</em> diskon pertama, bukan dari harga aslinya.
                </p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-orange-300">Rumus Diskon Ganda (Cara Cepat):</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <BlockMath math={String.raw`\text{Harga Bayar} = \frac{100 - d_1}{100} \times \frac{100 - d_2}{100} \times \text{Harga Awal}`} />
                </div>
                <p className="font-body text-xs text-white/50">
                  <InlineMath math="d_1" /> = diskon pertama (%), <InlineMath math="d_2" /> = diskon kedua (%)
                </p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-semibold text-white/60">ILUSTRASI LENGKAP: Diskon 20% + 10% dari Rp500.000</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-slate-900/40 rounded-lg p-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-blue-400 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-body text-xs text-white/60">Harga Awal</p>
                      <p className="font-body text-sm font-bold text-white">Rp500.000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-900/40 rounded-lg p-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-orange-400 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-body text-xs text-white/60">Setelah diskon 20%: 80% × Rp500.000</p>
                      <p className="font-body text-sm font-bold text-orange-300">= Rp400.000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-900/40 rounded-lg p-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-yellow-400 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-body text-xs text-white/60">Setelah diskon 10%: 90% × Rp400.000</p>
                      <p className="font-body text-sm font-bold text-yellow-300">= Rp360.000</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                    <p className="font-body text-xs text-red-400 mb-1">Jika dijumlah (SALAH)</p>
                    <p className="font-body text-sm font-bold text-red-300">Diskon 30% → Rp350.000</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <p className="font-body text-xs text-green-400 mb-1">Diskon Ganda (BENAR)</p>
                    <p className="font-body text-sm font-bold text-green-300">Diskon 28% → Rp360.000</p>
                  </div>
                </div>
                <p className="font-body text-xs text-white/50 text-center">
                  Diskon efektif = 28%, bukan 30%! (Selisih Rp10.000)
                </p>
              </div>
            </div>
          </Section>

          {/* 6. MENCARI PERSEN DISKON */}
          <Section id="persenDiskon" expanded={true} onToggle={toggleSection}
            icon={<Percent className="w-5 h-5 text-purple-400" />}
            title="Mencari Persen Diskon dari Dua Harga"
          >
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Terkadang kita tahu harga awal dan harga jual, lalu perlu mencari berapa persen diskonnya. Ini sering muncul dalam soal cerita.
              </p>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-purple-300">Rumus mencari persen diskon:</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <BlockMath math={String.raw`\%\text{Diskon} = \frac{\text{Harga Awal} - \text{Harga Bayar}}{\text{Harga Awal}} \times 100\%`} />
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-semibold text-white/60">CONTOH SOAL:</p>
                <p className="font-body text-sm text-white">Sepatu seharga Rp750.000 dijual dengan harga Rp525.000. Berapa persen diskonnya?</p>
                <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                  <BlockMath math={String.raw`\text{Selisih} = 750.000 - 525.000 = \text{Rp}225.000`} />
                  <BlockMath math={String.raw`\%\text{Diskon} = \frac{225.000}{750.000} \times 100\% = 30\%`} />
                </div>
                <p className="font-body text-sm text-primary font-semibold">Diskon sebesar 30%.</p>
              </div>
            </div>
          </Section>

          {/* 7. CONTOH SOAL */}
          <Section id="contoh" expanded={true} onToggle={toggleSection}
            icon={<BookOpen className="w-5 h-5 text-blue-400" />}
            title="Contoh Soal dan Pembahasan Lengkap"
          >
            <div className="space-y-6">
              {[
                {
                  level: "MUDAH", warna: "green", no: 1,
                  judul: "Diskon Tunggal – Mencari Harga Bayar",
                  soal: "Sebuah kemeja seharga Rp280.000 mendapat diskon 25%. Berapa harga yang harus dibayar?",
                  langkah: [
                    { label: "Diketahui", isi: "Harga awal = Rp280.000, Diskon = 25%" },
                    { label: "Ditanya", isi: "Harga bayar = ?" },
                    { label: "Penyelesaian", rumus: String.raw`\text{Harga Bayar} = (100\% - 25\%) \times 280.000 = 75\% \times 280.000 = \frac{75}{100} \times 280.000 = \text{Rp}210.000` },
                  ],
                  jawaban: "Harga bayar = Rp210.000 (hemat Rp70.000)"
                },
                {
                  level: "MUDAH", warna: "green", no: 2,
                  judul: "Diskon Tunggal – Mencari Persen Diskon",
                  soal: "Harga jaket sebelum diskon Rp600.000, setelah diskon harganya menjadi Rp420.000. Berapa persen diskonnya?",
                  langkah: [
                    { label: "Diketahui", isi: "Harga awal = Rp600.000, Harga bayar = Rp420.000" },
                    { label: "Ditanya", isi: "% Diskon = ?" },
                    { label: "Penyelesaian", rumus: String.raw`\%\text{Diskon} = \frac{600.000 - 420.000}{600.000} \times 100\% = \frac{180.000}{600.000} \times 100\% = 30\%` },
                  ],
                  jawaban: "Diskon sebesar 30%"
                },
                {
                  level: "SEDANG", warna: "yellow", no: 3,
                  judul: "Mencari Harga Asli dari Harga Bayar",
                  soal: "Sebuah tas dijual dengan diskon 35% dan kamu membayar Rp312.000. Berapakah harga asli tas tersebut?",
                  langkah: [
                    { label: "Diketahui", isi: "Harga bayar = Rp312.000, Diskon = 35%" },
                    { label: "Ditanya", isi: "Harga awal = ?" },
                    { label: "Penyelesaian", rumus: String.raw`\text{Harga Awal} = \frac{312.000}{100\% - 35\%} = \frac{312.000}{65\%} = \frac{312.000}{0{,}65} = \text{Rp}480.000` },
                  ],
                  jawaban: "Harga asli tas = Rp480.000"
                },
                {
                  level: "SEDANG", warna: "yellow", no: 4,
                  judul: "Diskon Ganda",
                  soal: 'Sebuah toko memberikan promo "Diskon 15% + 10%" untuk sepatu seharga Rp500.000. Berapa harga yang dibayar? Berapa diskon efektifnya?',
                  langkah: [
                    { label: "Diketahui", isi: "Harga awal = Rp500.000, d₁ = 15%, d₂ = 10%" },
                    { label: "Ditanya", isi: "Harga bayar dan % diskon efektif" },
                    { label: "Langkah 1 – Setelah diskon 15%", rumus: String.raw`85\% \times 500.000 = \text{Rp}425.000` },
                    { label: "Langkah 2 – Setelah diskon 10%", rumus: String.raw`90\% \times 425.000 = \text{Rp}382.500` },
                    { label: "Diskon Efektif", rumus: String.raw`\%\text{efektif} = \frac{500.000 - 382.500}{500.000} \times 100\% = 23{,}5\%` },
                  ],
                  jawaban: "Harga bayar = Rp382.500 | Diskon efektif = 23,5% (bukan 25%!)"
                },
                {
                  level: "SULIT", warna: "red", no: 5,
                  judul: "Diskon Ganda + Untung Rugi",
                  soal: "Seorang pedagang membeli jaket seharga Rp400.000. Ia menjualnya dengan harga label Rp650.000, lalu memberikan diskon 20% + 10%. Apakah pedagang untung atau rugi? Berapa?",
                  langkah: [
                    { label: "Diketahui", isi: "Modal = Rp400.000, Harga label = Rp650.000, Diskon ganda 20% + 10%" },
                    { label: "Langkah 1 – Harga setelah diskon 20%", rumus: String.raw`80\% \times 650.000 = \text{Rp}520.000` },
                    { label: "Langkah 2 – Harga setelah diskon 10%", rumus: String.raw`90\% \times 520.000 = \text{Rp}468.000` },
                    { label: "Langkah 3 – Untung/Rugi", rumus: String.raw`\text{Untung} = 468.000 - 400.000 = \text{Rp}68.000` },
                  ],
                  jawaban: "Pedagang masih UNTUNG Rp68.000 meski memberikan diskon ganda."
                },
              ].map((c) => (
                <div key={c.no} className={`border-l-4 border-${c.warna}-500 pl-4 space-y-3`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`bg-${c.warna}-500/20 text-${c.warna}-400 text-xs font-bold px-2 py-1 rounded`}>{c.level}</span>
                    <span className="font-body font-semibold text-white text-sm">Contoh {c.no} – {c.judul}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{c.soal}</p>
                  </div>
                  <div className={`bg-${c.warna}-500/5 border border-${c.warna}-500/20 rounded-lg p-4 space-y-3`}>
                    <p className={`font-body text-xs font-semibold text-${c.warna}-400`}>PEMBAHASAN:</p>
                    {c.langkah.map((l, li) => (
                      <div key={li}>
                        <p className="font-body text-xs text-white/50 mb-1">✦ {l.label}:</p>
                        {"rumus" in l ? (
                          <div className="bg-slate-900/50 rounded p-3">
                            <BlockMath math={l.rumus} />
                          </div>
                        ) : (
                          <p className="font-body text-sm text-white/80 pl-3">{l.isi}</p>
                        )}
                      </div>
                    ))}
                    <div className={`bg-${c.warna}-500/10 rounded-lg p-3`}>
                      <p className={`font-body text-sm font-semibold text-${c.warna}-300`}>✓ {c.jawaban}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 8. KESALAHAN UMUM */}
          <Section id="kesalahan" expanded={true} onToggle={toggleSection}
            icon={<AlertCircle className="w-5 h-5 text-red-400" />}
            title="Kesalahan Umum yang Sering Terjadi"
          >
            <div className="space-y-3">
              {[
                {
                  salah: "Menganggap diskon 20% + 10% = diskon 30%",
                  benar: "Diskon ganda TIDAK dijumlahkan. Hitung bertahap: diskon kedua dari harga setelah diskon pertama. Diskon efektifnya = 28%, bukan 30%.",
                },
                {
                  salah: "Menghitung diskon dari harga bayar, bukan harga asli",
                  benar: "Diskon selalu dihitung berdasarkan harga AWAL (sebelum diskon). Harga bayar hanya hasil akhir, bukan acuan perhitungan.",
                },
                {
                  salah: "Lupa mengonversi % ke desimal (misal: 25% ditulis langsung 25, bukan 0,25)",
                  benar: "Selalu bagi dengan 100 saat menghitung: diskon 25% = 25 ÷ 100 = 0,25. Kalikan harga awal dengan 0,25, bukan dengan 25.",
                },
                {
                  salah: "Mencari harga asli dengan mengurangkan diskon dari harga bayar",
                  benar: 'Untuk mencari harga asli, gunakan rumus: Harga Asli = Harga Bayar ÷ (1 − %Diskon). Jangan gunakan penjumlahan atau pengurangan langsung.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="font-body text-xs text-red-300">{item.salah}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <p className="font-body text-xs text-green-300">{item.benar}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 9. MINI KUIS */}
          <Section id="kuis" expanded={true} onToggle={toggleSection}
            icon={<HelpCircle className="w-5 h-5 text-pink-400" />}
            title="Uji Pemahamanmu — Mini Kuis (5 Soal)"
          >
            <div>
              <p className="font-body text-xs text-white/50 mb-4">Selesaikan 5 soal ini untuk mengecek pemahaman kamu. Jawaban dan penjelasan langsung muncul setelah memilih!</p>
              <MiniKuis />
            </div>
          </Section>

          {/* 10. RANGKUMAN */}
          <Section id="rangkuman" expanded={true} onToggle={toggleSection}
            icon={<Star className="w-5 h-5 text-yellow-400" />}
            title="Rangkuman Materi Diskon"
          >
            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-border rounded-xl p-4 space-y-3">
                {[
                  { no: "1", poin: "Diskon = potongan harga dinyatakan dalam persen, selalu dihitung dari harga AWAL." },
                  { no: "2", poin: "Besar Diskon (Rp) = (%Diskon ÷ 100) × Harga Awal." },
                  { no: "3", poin: "Harga Bayar = (100% − %Diskon) × Harga Awal. Cara cepat: kalikan sisa persen langsung." },
                  { no: "4", poin: "Harga Awal = Harga Bayar ÷ (1 − %Diskon). Dipakai saat harga bayar diketahui." },
                  { no: "5", poin: "%Diskon = (Selisih Harga ÷ Harga Awal) × 100%. Dipakai saat dua harga diketahui." },
                  { no: "6", poin: "Diskon ganda (mis. 20%+10%) TIDAK sama dengan 30%. Hitung bertahap, diskon efektifnya = 28%." },
                  { no: "7", poin: "Diskon sering dikombinasikan dengan PPN (pajak) dan untung-rugi dalam soal cerita." },
                ].map((item) => (
                  <div key={item.no} className="flex items-start gap-3">
                    <span className="bg-primary/20 text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{item.no}</span>
                    <p className="font-body text-sm text-white/80">{item.poin}</p>
                  </div>
                ))}
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-cyan-300 mb-2">Koneksi ke Materi Lain:</p>
                <p className="font-body text-xs text-white/70 leading-relaxed">
                  <strong className="text-white">PPN:</strong> Diskon dihitung dulu, PPN dihitung dari harga SETELAH diskon.<br />
                  <strong className="text-white">Untung-Rugi:</strong> Pedagang memberikan diskon tapi harga bayar akhir harus lebih besar dari modal.<br />
                  <strong className="text-white">Persentase:</strong> Diskon adalah aplikasi nyata dari konsep persen dan proporsi.
                </p>
              </div>
            </div>
          </Section>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aritmetika-sosial"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Aritmetika Sosial
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiskonPage;
