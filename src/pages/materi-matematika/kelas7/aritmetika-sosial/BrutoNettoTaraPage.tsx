import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, Package, AlertCircle, Star, CheckCircle, XCircle,
  Scale, ShoppingCart, Truck, RefreshCw, HelpCircle, Info
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

const fmt = (n: number, dec = 2) =>
  parseFloat(n.toFixed(dec)).toLocaleString("id-ID");

const DiagramBNT = ({ bruto, netto, tara }: { bruto: number; netto: number; tara: number }) => {
  if (bruto <= 0) return null;
  const nettoW = (netto / bruto) * 100;
  const taraW = (tara / bruto) * 100;
  return (
    <div className="space-y-2">
      <div className="flex h-10 rounded-xl overflow-hidden border border-border text-xs font-bold">
        <div
          className="bg-green-500/80 flex items-center justify-center text-white transition-all duration-500 shrink-0"
          style={{ width: `${nettoW}%` }}
        >
          {nettoW > 15 ? `Netto ${fmt(netto)}` : ""}
        </div>
        <div
          className="bg-blue-500/80 flex items-center justify-center text-white transition-all duration-500 shrink-0"
          style={{ width: `${taraW}%` }}
        >
          {taraW > 10 ? `Tara ${fmt(tara)}` : ""}
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-green-400">■ Netto (isi): {fmt(netto)}</span>
        <span className="text-white/40">← BRUTO = {fmt(bruto)} →</span>
        <span className="text-blue-400">■ Tara (kemasan): {fmt(tara)}</span>
      </div>
    </div>
  );
};

const KalkulatorBNT = () => {
  const [mode, setMode] = useState<"netto" | "tara" | "bruto" | "persen">("netto");
  const [bruto, setBruto] = useState("");
  const [netto, setNetto] = useState("");
  const [tara, setTara] = useState("");
  const [pTara, setPTara] = useState("");

  const b = parseFloat(bruto) || 0;
  const n = parseFloat(netto) || 0;
  const t = parseFloat(tara) || 0;
  const p = parseFloat(pTara) || 0;

  const taraVal = b * (p / 100);
  const nettoFromPersen = b - taraVal;
  const persenTara = b > 0 ? (t / b) * 100 : 0;

  const modes = [
    { id: "netto", label: "Cari Netto", icon: "🟢" },
    { id: "tara", label: "Cari Tara", icon: "🔵" },
    { id: "bruto", label: "Cari Bruto", icon: "🟠" },
    { id: "persen", label: "Cari % Tara", icon: "%" },
  ] as const;

  const inp = (label: string, val: string, set: (v: string) => void, ph: string) => (
    <div>
      <label className="font-body text-xs text-white/60 mb-1 block">{label}</label>
      <input
        type="number"
        value={val}
        onChange={(e) => set(e.target.value)}
        placeholder={ph}
        className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((m) => (
          <button key={m.id} onClick={() => { playPopSound(); setMode(m.id); }}
            className={`px-2 py-2 rounded-lg text-xs font-semibold font-body transition-all border ${mode === m.id ? "bg-primary/20 border-primary text-primary" : "bg-slate-800/60 border-border text-white/60 hover:border-primary/50"}`}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {mode === "netto" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Masukkan Bruto dan Tara untuk mencari Netto (berat bersih isi).</p>
          <div className="grid grid-cols-2 gap-3">
            {inp("Bruto (kg/g)", bruto, setBruto, "Contoh: 25")}
            {inp("Tara (kg/g)", tara, setTara, "Contoh: 2")}
          </div>
          {b > 0 && t > 0 && (
            <div className="space-y-3 pt-1">
              <DiagramBNT bruto={b} netto={b - t} tara={t} />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-orange-400 mb-1">Bruto</p>
                  <p className="font-body text-sm font-bold text-orange-300">{fmt(b)}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-blue-400 mb-1">Tara</p>
                  <p className="font-body text-sm font-bold text-blue-300">{fmt(t)}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-green-400 mb-1">Netto</p>
                  <p className="font-body text-sm font-bold text-green-300">{fmt(b - t)}</p>
                </div>
              </div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
                <p className="font-body text-sm text-primary font-semibold">
                  Netto = {fmt(b)} − {fmt(t)} = <strong>{fmt(b - t)}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "tara" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Masukkan Bruto dan Netto untuk mencari Tara (berat kemasan).</p>
          <div className="grid grid-cols-2 gap-3">
            {inp("Bruto (kg/g)", bruto, setBruto, "Contoh: 50")}
            {inp("Netto (kg/g)", netto, setNetto, "Contoh: 47")}
          </div>
          {b > 0 && n > 0 && b > n && (
            <div className="space-y-3 pt-1">
              <DiagramBNT bruto={b} netto={n} tara={b - n} />
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
                <p className="font-body text-sm text-primary font-semibold">
                  Tara = {fmt(b)} − {fmt(n)} = <strong>{fmt(b - n)}</strong>
                </p>
              </div>
            </div>
          )}
          {b > 0 && n > 0 && b <= n && (
            <p className="font-body text-xs text-red-400">Netto tidak boleh lebih besar atau sama dengan Bruto.</p>
          )}
        </div>
      )}

      {mode === "bruto" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Masukkan Netto dan Tara untuk mencari Bruto (berat kotor total).</p>
          <div className="grid grid-cols-2 gap-3">
            {inp("Netto (kg/g)", netto, setNetto, "Contoh: 38")}
            {inp("Tara (kg/g)", tara, setTara, "Contoh: 2")}
          </div>
          {n > 0 && t > 0 && (
            <div className="space-y-3 pt-1">
              <DiagramBNT bruto={n + t} netto={n} tara={t} />
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
                <p className="font-body text-sm text-primary font-semibold">
                  Bruto = {fmt(n)} + {fmt(t)} = <strong>{fmt(n + t)}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "persen" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">
            Dua opsi: (A) hitung % Tara dari Bruto+Tara yang diketahui, atau (B) cari Netto bila % Tara diketahui.
          </p>
          <div className="space-y-4">
            <div className="border border-cyan-500/30 rounded-xl p-3 space-y-3">
              <p className="font-body text-xs font-semibold text-cyan-300">A — Cari % Tara (Bruto & Tara diketahui)</p>
              <div className="grid grid-cols-2 gap-3">
                {inp("Bruto (kg/g)", bruto, setBruto, "Contoh: 25")}
                {inp("Tara (kg/g)", tara, setTara, "Contoh: 2")}
              </div>
              {b > 0 && t > 0 && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
                  <p className="font-body text-sm text-primary font-semibold">
                    %Tara = {fmt(t)} ÷ {fmt(b)} × 100% = <strong>{fmt(persenTara)}%</strong>
                  </p>
                </div>
              )}
            </div>
            <div className="border border-purple-500/30 rounded-xl p-3 space-y-3">
              <p className="font-body text-xs font-semibold text-purple-300">B — Cari Netto dari % Tara & Bruto</p>
              <div className="grid grid-cols-2 gap-3">
                {inp("Bruto (kg/g)", bruto, setBruto, "Contoh: 60")}
                {inp("% Tara (%)", pTara, setPTara, "Contoh: 5")}
              </div>
              {b > 0 && p > 0 && (
                <div className="space-y-2">
                  <DiagramBNT bruto={b} netto={nettoFromPersen} tara={taraVal} />
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center space-y-1">
                    <p className="font-body text-xs text-white/60">Tara = {p}% × {fmt(b)} = {fmt(taraVal)}</p>
                    <p className="font-body text-sm text-primary font-semibold">
                      Netto = {fmt(b)} − {fmt(taraVal)} = <strong>{fmt(nettoFromPersen)}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SimulasiMultiKemasan = () => {
  const [jumlah, setJumlah] = useState("5");
  const [brutoPerKemasan, setBrutoPerKemasan] = useState("20");
  const [pTara, setPTara] = useState("4");
  const [hargaPerKg, setHargaPerKg] = useState("80000");

  const j = parseFloat(jumlah) || 0;
  const b = parseFloat(brutoPerKemasan) || 0;
  const p = parseFloat(pTara) || 0;
  const h = parseFloat(hargaPerKg) || 0;

  const taraPerKemasan = b * (p / 100);
  const nettoPerKemasan = b - taraPerKemasan;
  const totalBruto = j * b;
  const totalTara = j * taraPerKemasan;
  const totalNetto = j * nettoPerKemasan;
  const totalHarga = totalNetto * h;

  return (
    <div className="space-y-4">
      <p className="font-body text-xs text-white/50">Simulasi pembelian banyak kemasan sekaligus — cukup isi data satu kemasan.</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Jumlah Kemasan", val: jumlah, set: setJumlah, ph: "Contoh: 5" },
          { label: "Bruto per Kemasan (kg)", val: brutoPerKemasan, set: setBrutoPerKemasan, ph: "Contoh: 20" },
          { label: "% Tara", val: pTara, set: setPTara, ph: "Contoh: 4" },
          { label: "Harga per kg Netto (Rp)", val: hargaPerKg, set: setHargaPerKg, ph: "Contoh: 80000" },
        ].map((f, i) => (
          <div key={i}>
            <label className="font-body text-xs text-white/60 mb-1 block">{f.label}</label>
            <input type="number" value={f.val} onChange={(e) => f.set(e.target.value)}
              placeholder={f.ph}
              className="w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary" />
          </div>
        ))}
      </div>
      {j > 0 && b > 0 && p > 0 && (
        <div className="space-y-3 pt-1">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-white/50 font-medium">Per Kemasan</th>
                  <th className="text-right py-2 px-3 text-orange-400">Bruto</th>
                  <th className="text-right py-2 px-3 text-blue-400">Tara</th>
                  <th className="text-right py-2 px-3 text-green-400">Netto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 text-white/70">1 kemasan</td>
                  <td className="text-right py-2 px-3 text-orange-300">{fmt(b)} kg</td>
                  <td className="text-right py-2 px-3 text-blue-300">{fmt(taraPerKemasan)} kg</td>
                  <td className="text-right py-2 px-3 text-green-300">{fmt(nettoPerKemasan)} kg</td>
                </tr>
                <tr className="bg-white/5">
                  <td className="py-2 px-3 text-white/70 font-semibold">× {j} kemasan (total)</td>
                  <td className="text-right py-2 px-3 text-orange-300 font-bold">{fmt(totalBruto)} kg</td>
                  <td className="text-right py-2 px-3 text-blue-300 font-bold">{fmt(totalTara)} kg</td>
                  <td className="text-right py-2 px-3 text-green-300 font-bold">{fmt(totalNetto)} kg</td>
                </tr>
              </tbody>
            </table>
          </div>
          {h > 0 && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center space-y-1">
              <p className="font-body text-xs text-white/50">Total harga ({fmt(totalNetto)} kg × Rp{h.toLocaleString("id-ID")}/kg)</p>
              <p className="font-body text-lg font-bold text-primary">
                Rp{Math.round(totalHarga).toLocaleString("id-ID")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const quizData = [
  {
    soal: "Sebuah kaleng susu memiliki bruto 850 gram dan tara 50 gram. Berapa netto susu di dalamnya?",
    pilihan: ["750 gram", "800 gram", "850 gram", "900 gram"],
    benar: 1,
    penjelasan: "Netto = Bruto − Tara = 850 − 50 = 800 gram.",
  },
  {
    soal: "Satu karung gula memiliki netto 49 kg dan tara 1 kg. Berapa bruto karung tersebut?",
    pilihan: ["48 kg", "49 kg", "50 kg", "51 kg"],
    benar: 2,
    penjelasan: "Bruto = Netto + Tara = 49 + 1 = 50 kg.",
  },
  {
    soal: "Sebuah peti buah memiliki bruto 30 kg dan tara 6%. Berapa kg netto buahnya?",
    pilihan: ["24 kg", "28,2 kg", "25,8 kg", "26 kg"],
    benar: 1,
    penjelasan: "Tara = 6% × 30 = 1,8 kg. Netto = 30 − 1,8 = 28,2 kg.",
  },
  {
    soal: "Berat kemasan (tara) 3 kg dari total bruto 40 kg. Berapa persen tara tersebut?",
    pilihan: ["6,5%", "7%", "7,5%", "8%"],
    benar: 2,
    penjelasan: "%Tara = (3 ÷ 40) × 100% = 7,5%.",
  },
  {
    soal: "Pedagang membeli 4 karung beras, masing-masing bruto 25 kg dengan tara 4%. Berapa total netto seluruh beras?",
    pilihan: ["92 kg", "96 kg", "100 kg", "98 kg"],
    benar: 1,
    penjelasan: "Tara per karung = 4% × 25 = 1 kg. Netto per karung = 25 − 1 = 24 kg. Total = 4 × 24 = 96 kg.",
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
    if (idx < quizData.length - 1) { setIdx(idx + 1); setDipilih(jawaban[idx + 1]); }
    else setSelesai(true);
  };

  const kembali = () => {
    playPopSound();
    if (idx > 0) { setIdx(idx - 1); setDipilih(jawaban[idx - 1]); }
  };

  const ulang = () => {
    playPopSound();
    setIdx(0); setDipilih(null); setSelesai(false); setSkor(0);
    setJawaban(Array(quizData.length).fill(null));
  };

  if (selesai) {
    const pct = Math.round((skor / quizData.length) * 100);
    const warna = pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400";
    return (
      <div className="text-center space-y-4 py-4">
        <Scale className="w-12 h-12 text-cyan-400 mx-auto" />
        <p className="font-body text-lg font-bold text-white">Hasil Kuis</p>
        <p className={`font-display text-4xl font-bold ${warna}`}>{skor}/{quizData.length}</p>
        <p className={`font-body text-sm ${warna}`}>{pct}% Benar</p>
        <p className="font-body text-sm text-white/60">
          {pct >= 80 ? "Kamu sudah sangat paham materi Bruto, Netto, dan Tara!" : pct >= 60 ? "Bagus! Baca ulang bagian yang belum tepat." : "Semangat! Pelajari lagi materinya."}
        </p>
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
            <button key={i} onClick={() => pilih(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border font-body text-sm transition-all flex items-center gap-3 ${cls}`}>
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
        <button onClick={kembali} disabled={idx === 0}
          className="px-4 py-2 rounded-lg text-sm font-body font-semibold border border-border text-white/60 hover:border-primary/50 disabled:opacity-30 transition-all">
          ← Sebelumnya
        </button>
        <button onClick={lanjut} disabled={dipilih === null}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-body font-semibold bg-primary/20 border border-primary text-primary hover:bg-primary/30 disabled:opacity-30 transition-all">
          {idx < quizData.length - 1 ? "Lanjut →" : "Lihat Hasil"}
        </button>
      </div>
    </div>
  );
};

const Section = ({ id, expanded, onToggle, icon, title, children }: {
  id: string; expanded: boolean; onToggle: (id: string) => void;
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) => (
  <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
    <button onClick={() => onToggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">{icon}<span className="font-body font-semibold text-white">{title}</span></div>
      {expanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
    {expanded && <div className="px-5 pb-5">{children}</div>}
  </div>
);

const BrutoNettoTaraPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "visual", "kalkulator", "persen", "konteks", "multikemasan", "contoh", "kesalahan", "kuis", "rangkuman"
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
        <Scale className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          BRUTO, NETTO, DAN TARA
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 · Aritmetika Sosial · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* 1. PENGANTAR */}
          <Section id="intro" expanded={expandedSections.includes("intro")} onToggle={toggleSection}
            icon={<Lightbulb className="w-5 h-5 text-yellow-400" />}
            title="Berat Kotor vs Berat Bersih — Apa Bedanya?"
          >
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Pernahkah kamu memperhatikan label di kemasan makanan? Di sana tertulis <strong className="text-green-300">"Berat Bersih: 500 g"</strong>.
                Itu artinya berat isinya saja — tanpa kemasan. Konsep inilah yang disebut <strong className="text-primary">netto</strong>.
                Bersama <strong className="text-orange-300">bruto</strong> (berat total) dan <strong className="text-blue-300">tara</strong> (berat kemasan),
                ketiganya membentuk sistem penimbangan yang adil dalam dunia perdagangan.
              </p>

              <figure className="rounded-xl overflow-hidden border border-border">
                <div className="bg-white flex items-center justify-center p-2">
                  <img
                    src="/image_bruto_netto_tara_transparent.png"
                    alt="Ilustrasi Bruto, Netto, dan Tara pada kemasan snack Chitato"
                    className="w-full object-contain max-h-56"
                  />
                </div>
                <figcaption className="bg-slate-900/70 px-4 py-2 text-center">
                  <span className="font-body text-xs text-white/40">
                    Ilustrasi: Bruto (kemasan + isi), Netto (isi), dan Tara (kemasan) pada produk nyata
                  </span>
                </figcaption>
              </figure>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <Package className="w-5 h-5 text-orange-400" />, judul: "BRUTO", sub: "Berat Kotor", desc: "Berat TOTAL: isi + kemasan. Yang pertama ditimbang sebelum kemasan dilepas.", warna: "orange" },
                  { icon: <Package className="w-5 h-5 text-green-400" />, judul: "NETTO", sub: "Berat Bersih", desc: 'Berat ISI saja. Yang sebenarnya kamu beli. Tertulis "Berat Bersih" pada kemasan.', warna: "green" },
                  { icon: <Package className="w-5 h-5 text-blue-400" />, judul: "TARA", sub: "Berat Kemasan", desc: "Berat KEMASAN saja: kardus, botol, karung, kaleng, plastik pembungkus.", warna: "blue" },
                ].map((c) => (
                  <div key={c.judul} className={`bg-${c.warna}-500/10 border border-${c.warna}-500/30 rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-1">{c.icon}<div><p className={`font-body text-sm font-bold text-${c.warna}-300`}>{c.judul}</p><p className={`font-body text-xs text-${c.warna}-400/70`}>{c.sub}</p></div></div>
                    <p className="font-body text-xs text-white/60 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-yellow-300 mb-2">🎯 Analogi Mudah — Sekarung Beras:</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    { label: "Bruto", nilai: "40 kg", sub: "karung + beras", warna: "orange" },
                    { label: "−  Tara", nilai: "2 kg", sub: "karung saja", warna: "blue" },
                    { label: "= Netto", nilai: "38 kg", sub: "beras saja", warna: "green" },
                  ].map((r, i) => (
                    <div key={i} className={`bg-${r.warna}-500/10 border border-${r.warna}-500/30 rounded-lg px-3 py-2 text-center`}>
                      <p className={`font-body text-xs text-${r.warna}-400`}>{r.label}</p>
                      <p className={`font-body text-sm font-bold text-${r.warna}-300`}>{r.nilai}</p>
                      <p className="font-body text-xs text-white/40">{r.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* 2. SEMUA RUMUS */}
          <Section id="konsep" expanded={expandedSections.includes("konsep")} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-green-400" />}
            title="Semua Rumus Bruto, Netto, dan Tara"
          >
            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-purple-300 mb-3">Hubungan Dasar (Rumus Induk):</p>
                <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                  <BlockMath math="\boxed{\text{Bruto} = \text{Netto} + \text{Tara}}" />
                </div>
                <p className="font-body text-xs text-white/50 mt-2 text-center">Semua rumus turunan berasal dari satu persamaan ini.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { warna: "green", judul: "Mencari Netto", rumus: String.raw`\text{Netto} = \text{Bruto} - \text{Tara}`, ket: "Dipakai saat Bruto & Tara diketahui → cari isi." },
                  { warna: "blue", judul: "Mencari Tara", rumus: String.raw`\text{Tara} = \text{Bruto} - \text{Netto}`, ket: "Dipakai saat Bruto & Netto diketahui → cari kemasan." },
                  { warna: "orange", judul: "Mencari Bruto", rumus: String.raw`\text{Bruto} = \text{Netto} + \text{Tara}`, ket: "Dipakai saat Netto & Tara diketahui → cari total." },
                  { warna: "cyan", judul: "Persen Tara dari Bruto", rumus: String.raw`\%\text{Tara} = \frac{\text{Tara}}{\text{Bruto}} \times 100\%`, ket: "Tara selalu dihitung dari Bruto, bukan Netto!" },
                ].map((r) => (
                  <div key={r.judul} className={`bg-${r.warna}-500/10 border border-${r.warna}-500/30 rounded-xl p-4`}>
                    <p className={`font-body text-xs font-semibold text-${r.warna}-300 mb-2`}>{r.judul}</p>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <BlockMath math={r.rumus} />
                    </div>
                    <p className="font-body text-xs text-white/50 mt-2 italic">{r.ket}</p>
                  </div>
                ))}
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                <p className="font-body text-xs font-semibold text-cyan-300">Jika % Tara diketahui → cari nilai Tara & Netto:</p>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <BlockMath math={String.raw`\text{Tara} = \%\text{Tara} \times \text{Bruto}`} />
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <BlockMath math={String.raw`\text{Netto} = \text{Bruto} \times \left(1 - \frac{\%\text{Tara}}{100}\right)`} />
                </div>
                <p className="font-body text-xs text-white/50">Contoh: Bruto 60 kg, %Tara 5% → Tara = 3 kg → Netto = 57 kg</p>
              </div>
            </div>
          </Section>

          {/* 3. VISUALISASI */}
          <Section id="visual" expanded={expandedSections.includes("visual")} onToggle={toggleSection}
            icon={<Scale className="w-5 h-5 text-purple-400" />}
            title="Visualisasi: Memahami Bruto = Netto + Tara"
          >
            <div className="space-y-5">
              <p className="font-body text-sm text-white/70">Bar hijau = Netto (isi), bar biru = Tara (kemasan). Totalnya selalu = Bruto (100%).</p>
              {[
                { label: "Sekarung beras 40 kg, tara 2 kg", b: 40, t: 2 },
                { label: "Peti jeruk 25 kg, tara 8% (2 kg)", b: 25, t: 2 },
                { label: "Kaleng susu 550 g, tara 50 g", b: 550, t: 50 },
                { label: "Kotak kopi 200 g, tara 10%", b: 200, t: 20 },
              ].map((ex, i) => (
                <div key={i} className="space-y-1">
                  <p className="font-body text-xs text-white/50">{ex.label}</p>
                  <DiagramBNT bruto={ex.b} netto={ex.b - ex.t} tara={ex.t} />
                </div>
              ))}
              <div className="bg-slate-800/60 rounded-xl p-4">
                <p className="font-body text-xs text-white/60 leading-relaxed">
                  <strong className="text-white">Perhatikan:</strong> Semakin besar tara (biru), semakin sedikit netto (hijau) yang kamu dapatkan.
                  Penting untuk memahami ini saat membandingkan harga antar produk dengan kemasan berbeda.
                </p>
              </div>
            </div>
          </Section>

          {/* 4. KALKULATOR */}
          <Section id="kalkulator" expanded={expandedSections.includes("kalkulator")} onToggle={toggleSection}
            icon={<Calculator className="w-5 h-5 text-primary" />}
            title="Kalkulator Bruto, Netto, Tara Interaktif"
          >
            <div>
              <p className="font-body text-xs text-white/50 mb-4">Pilih jenis perhitungan, masukkan angka, dan lihat hasilnya beserta visualisasinya langsung.</p>
              <KalkulatorBNT />
            </div>
          </Section>

          {/* 5. PERSEN TARA */}
          <Section id="persen" expanded={expandedSections.includes("persen")} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-cyan-400" />}
            title="Tara dalam Persentase — Mengapa Penting?"
          >
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Dalam perdagangan besar (grosir) dan ekspor-impor, tara sering dinyatakan dalam <strong className="text-cyan-300">bentuk persen dari Bruto</strong>.
                Ini memudahkan penghitungan untuk berbagai ukuran kemasan yang berbeda-beda.
              </p>
              <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-semibold text-white/60">CONTOH PENGGUNAAN PERSEN TARA:</p>
                <div className="space-y-3">
                  {[
                    { konteks: "Karung beras 50 kg, tara 2%", tara: "1 kg", netto: "49 kg", warna: "green" },
                    { konteks: "Peti jeruk 30 kg, tara 8%", tara: "2,4 kg", netto: "27,6 kg", warna: "yellow" },
                    { konteks: "Drum minyak 200 kg, tara 5%", tara: "10 kg", netto: "190 kg", warna: "orange" },
                  ].map((ex, i) => (
                    <div key={i} className={`bg-${ex.warna}-500/10 border border-${ex.warna}-500/20 rounded-lg p-3 flex items-center justify-between gap-3`}>
                      <p className="font-body text-xs text-white/70">{ex.konteks}</p>
                      <div className="text-right shrink-0">
                        <p className="font-body text-xs text-blue-300">Tara: {ex.tara}</p>
                        <p className="font-body text-xs text-green-300 font-semibold">Netto: {ex.netto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>Penting:</strong> % Tara <em>selalu</em> dihitung terhadap <strong>Bruto</strong>, bukan terhadap Netto!
                    Ini aturan baku dalam dunia perdagangan dan sering jadi sumber kesalahan siswa.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* 6. KONTEKS KEHIDUPAN NYATA */}
          <Section id="konteks" expanded={expandedSections.includes("konteks")} onToggle={toggleSection}
            icon={<ShoppingCart className="w-5 h-5 text-pink-400" />}
            title="Bruto, Netto, Tara di Kehidupan Nyata"
          >
            <div className="space-y-4">
              <p className="font-body text-sm text-white/70 leading-relaxed">
                Konsep ini digunakan setiap hari di berbagai bidang. Yuk kenali contoh-contohnya!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: <ShoppingCart className="w-5 h-5 text-green-400" />,
                    judul: "Supermarket & Minimarket",
                    isi: `Label "Berat Bersih 250 g" pada snack = netto. Berat bungkus plastiknya = tara. Berat total saat ditimbang = bruto.`,
                    warna: "green",
                  },
                  {
                    icon: <Scale className="w-5 h-5 text-yellow-400" />,
                    judul: "Pasar Tradisional",
                    isi: "Saat membeli buah, pedagang menimbang semuanya (bruto) lalu mengurangi berat plastik/wadah (tara) agar pembeli mendapat harga yang adil.",
                    warna: "yellow",
                  },
                  {
                    icon: <Truck className="w-5 h-5 text-blue-400" />,
                    judul: "Ekspedisi & Kargo",
                    isi: "Pengiriman barang dihitung berdasarkan bruto (termasuk kemasan). Perusahaan logistik mencatat netto isi barang dan tara kemasannya secara terpisah.",
                    warna: "blue",
                  },
                  {
                    icon: <Package className="w-5 h-5 text-orange-400" />,
                    judul: "Pertanian & Agribisnis",
                    isi: "Komoditas seperti gabah, kopi, dan kakao dijual per ton netto. Karung/peti (tara) diukur dan dikurangi dari total timbangan (bruto) saat transaksi.",
                    warna: "orange",
                  },
                ].map((k) => (
                  <div key={k.judul} className={`bg-${k.warna}-500/10 border border-${k.warna}-500/30 rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-2">{k.icon}<p className={`font-body text-sm font-semibold text-${k.warna}-300`}>{k.judul}</p></div>
                    <p className="font-body text-xs text-white/65 leading-relaxed">{k.isi}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-white/60 mb-2">💡 Fakta Menarik:</p>
                <p className="font-body text-xs text-white/70 leading-relaxed">
                  Di Indonesia, label "Berat Bersih" pada kemasan makanan diatur oleh Badan Standarisasi Nasional (BSN) dan BPOM.
                  Produsen wajib mencantumkan netto secara akurat agar tidak merugikan konsumen. Jika netto tertera lebih kecil dari isi sebenarnya, itu melanggar aturan!
                </p>
              </div>
            </div>
          </Section>

          {/* 7. MULTI-KEMASAN */}
          <Section id="multikemasan" expanded={expandedSections.includes("multikemasan")} onToggle={toggleSection}
            icon={<Truck className="w-5 h-5 text-indigo-400" />}
            title="Simulasi: Menghitung Banyak Kemasan Sekaligus"
          >
            <div>
              <SimulasiMultiKemasan />
            </div>
          </Section>

          {/* 8. CONTOH SOAL */}
          <Section id="contoh" expanded={expandedSections.includes("contoh")} onToggle={toggleSection}
            icon={<BookOpen className="w-5 h-5 text-blue-400" />}
            title="Contoh Soal dan Pembahasan Lengkap"
          >
            <div className="space-y-6">
              {[
                {
                  level: "MUDAH", warna: "green", no: 1,
                  judul: "Mencari Netto",
                  soal: "Sebuah toples kerupuk memiliki bruto 850 gram. Berat toples kosong (tara) adalah 120 gram. Berapa gram netto kerupuknya?",
                  langkah: [
                    { label: "Diketahui", isi: "Bruto = 850 g, Tara = 120 g" },
                    { label: "Ditanya", isi: "Netto = ?" },
                    { label: "Penyelesaian", rumus: String.raw`\text{Netto} = \text{Bruto} - \text{Tara} = 850 - 120 = 730 \text{ gram}` },
                  ],
                  jawaban: "Netto kerupuk = 730 gram"
                },
                {
                  level: "MUDAH", warna: "green", no: 2,
                  judul: "Mencari Bruto",
                  soal: "Satu kotak teh memiliki netto 200 gram dan tara 25 gram. Berapakah bruto kotak teh tersebut?",
                  langkah: [
                    { label: "Diketahui", isi: "Netto = 200 g, Tara = 25 g" },
                    { label: "Ditanya", isi: "Bruto = ?" },
                    { label: "Penyelesaian", rumus: String.raw`\text{Bruto} = \text{Netto} + \text{Tara} = 200 + 25 = 225 \text{ gram}` },
                  ],
                  jawaban: "Bruto kotak teh = 225 gram"
                },
                {
                  level: "SEDANG", warna: "yellow", no: 3,
                  judul: "Persen Tara → Netto",
                  soal: "Seorang pedagang membeli 1 peti mangga dengan bruto 30 kg. Peti tersebut memiliki tara 6%. Berapa kg netto mangga yang didapat?",
                  langkah: [
                    { label: "Diketahui", isi: "Bruto = 30 kg, %Tara = 6%" },
                    { label: "Ditanya", isi: "Tara (kg) dan Netto = ?" },
                    { label: "Langkah 1 – Nilai Tara", rumus: String.raw`\text{Tara} = 6\% \times 30 = \frac{6}{100} \times 30 = 1{,}8 \text{ kg}` },
                    { label: "Langkah 2 – Netto", rumus: String.raw`\text{Netto} = 30 - 1{,}8 = 28{,}2 \text{ kg}` },
                  ],
                  jawaban: "Netto mangga = 28,2 kg"
                },
                {
                  level: "SEDANG", warna: "yellow", no: 4,
                  judul: "Mencari Persen Tara",
                  soal: "Sebuah drum minyak memiliki bruto 55 kg. Berat drum kosong adalah 5 kg. Berapa persen tara drum tersebut?",
                  langkah: [
                    { label: "Diketahui", isi: "Bruto = 55 kg, Tara = 5 kg" },
                    { label: "Ditanya", isi: "%Tara = ?" },
                    { label: "Penyelesaian", rumus: String.raw`\%\text{Tara} = \frac{5}{55} \times 100\% \approx 9{,}09\%` },
                  ],
                  jawaban: "% Tara ≈ 9,09%"
                },
                {
                  level: "SULIT", warna: "red", no: 5,
                  judul: "Gabungan Multi-Kemasan + Jual Beli",
                  soal: "Pedagang membeli 6 karung kopi, masing-masing bruto 20 kg dan tara 4%. Harga beli Rp90.000/kg netto. Ia menjual seluruh kopi Rp100.000/kg netto. Berapa total keuntungannya?",
                  langkah: [
                    { label: "Diketahui", isi: "6 karung, bruto/karung = 20 kg, tara = 4%, beli Rp90.000/kg, jual Rp100.000/kg" },
                    { label: "Langkah 1 – Tara & Netto per karung", rumus: String.raw`\text{Tara} = 4\% \times 20 = 0{,}8 \text{ kg},\quad \text{Netto} = 20 - 0{,}8 = 19{,}2 \text{ kg}` },
                    { label: "Langkah 2 – Total Netto (6 karung)", rumus: String.raw`\text{Total Netto} = 6 \times 19{,}2 = 115{,}2 \text{ kg}` },
                    { label: "Langkah 3 – Modal & Pemasukan", rumus: String.raw`\text{Modal} = 115{,}2 \times 90.000 = \text{Rp}10.368.000` },
                    { label: "Langkah 4 – Keuntungan", rumus: String.raw`\text{Untung} = 115{,}2 \times (100.000 - 90.000) = 115{,}2 \times 10.000 = \text{Rp}1.152.000` },
                  ],
                  jawaban: "Total keuntungan = Rp1.152.000"
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
                  <div className={`bg-${c.warna}-500/5 border border-${c.warna}-500/20 rounded-xl p-4 space-y-3`}>
                    <p className={`font-body text-xs font-semibold text-${c.warna}-400`}>PEMBAHASAN:</p>
                    {c.langkah.map((l, li) => (
                      <div key={li}>
                        <p className="font-body text-xs text-white/50 mb-1">✦ {l.label}:</p>
                        {"rumus" in l ? (
                          <div className="bg-slate-900/50 rounded p-3"><BlockMath math={l.rumus} /></div>
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

          {/* 9. KESALAHAN UMUM */}
          <Section id="kesalahan" expanded={expandedSections.includes("kesalahan")} onToggle={toggleSection}
            icon={<AlertCircle className="w-5 h-5 text-red-400" />}
            title="Kesalahan Umum yang Sering Terjadi"
          >
            <div className="space-y-3">
              {[
                {
                  salah: "Menghitung % Tara dari Netto, bukan dari Bruto",
                  benar: "%Tara selalu dihitung dari BRUTO. Rumus: %Tara = (Tara ÷ Bruto) × 100%. Jangan dibagi Netto.",
                },
                {
                  salah: "Menjumlahkan semua Bruto lalu dikurangi satu Tara saja",
                  benar: "Untuk banyak kemasan: hitung Netto per kemasan terlebih dahulu, baru kalikan dengan jumlah kemasan. Setiap kemasan punya tara sendiri.",
                },
                {
                  salah: "Bingung membedakan ketiga istilah",
                  benar: "Ingat dengan urutan BESAR ke KECIL: Bruto > Netto (Bruto paling berat). Tara = Bruto − Netto. Netto yang kamu beli, Tara yang kamu buang.",
                },
                {
                  salah: "Mengira harga dihitung dari Bruto, padahal dari Netto",
                  benar: "Dalam perdagangan, harga biasanya dihitung per kg NETTO. Pastikan hitung Netto dulu sebelum menghitung nilai uang/untung rugi.",
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

          {/* 10. KUIS */}
          <Section id="kuis" expanded={expandedSections.includes("kuis")} onToggle={toggleSection}
            icon={<HelpCircle className="w-5 h-5 text-pink-400" />}
            title="Uji Pemahamanmu — Mini Kuis (5 Soal)"
          >
            <div>
              <p className="font-body text-xs text-white/50 mb-4">Jawab 5 soal berikut. Setelah memilih, jawaban dan pembahasan langsung muncul!</p>
              <MiniKuis />
            </div>
          </Section>

          {/* 11. RANGKUMAN */}
          <Section id="rangkuman" expanded={expandedSections.includes("rangkuman")} onToggle={toggleSection}
            icon={<Star className="w-5 h-5 text-yellow-400" />}
            title="Rangkuman Materi Bruto, Netto, dan Tara"
          >
            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-border rounded-xl p-4 space-y-3">
                {[
                  { no: "1", poin: "Bruto = berat kotor (isi + kemasan). Netto = berat bersih (isi saja). Tara = berat kemasan saja." },
                  { no: "2", poin: "Rumus induk: Bruto = Netto + Tara. Dua lainnya diturunkan dari sini." },
                  { no: "3", poin: "%Tara selalu dihitung dari Bruto: %Tara = (Tara ÷ Bruto) × 100%. BUKAN dari Netto." },
                  { no: "4", poin: "Jika %Tara diketahui: Tara = %Tara × Bruto, lalu Netto = Bruto − Tara." },
                  { no: "5", poin: "Untuk banyak kemasan: hitung Netto per kemasan dulu, baru kalikan jumlah kemasan." },
                  { no: "6", poin: "Dalam jual beli, harga biasanya per kg Netto. Hitung Netto terlebih dahulu sebelum menghitung untung/rugi." },
                  { no: "7", poin: "Label 'Berat Bersih' pada kemasan = Netto. Ini kewajiban hukum bagi produsen di Indonesia." },
                ].map((item) => (
                  <div key={item.no} className="flex items-start gap-3">
                    <span className="bg-primary/20 text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{item.no}</span>
                    <p className="font-body text-sm text-white/80">{item.poin}</p>
                  </div>
                ))}
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <p className="font-body text-xs font-semibold text-orange-300 mb-2">Koneksi ke Materi Lain:</p>
                <p className="font-body text-xs text-white/70 leading-relaxed">
                  <strong className="text-white">Untung-Rugi:</strong> Dalam soal gabungan, hitung Netto dulu baru masuk ke perhitungan harga beli/jual dan untung/rugi.<br />
                  <strong className="text-white">Persentase:</strong> %Tara adalah aplikasi nyata dari konsep persen dan proporsi.<br />
                  <strong className="text-white">Perdagangan Internasional:</strong> Bruto/Netto dicantumkan dalam dokumen bea cukai dan invoice ekspor-impor.
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

export default BrutoNettoTaraPage;
