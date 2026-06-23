import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import WarungAritmetika from "@/components/WarungAritmetika";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator,
  Target, TrendingUp, TrendingDown, Minus, Star, AlertCircle,
  CheckCircle, XCircle, RefreshCw, ShoppingCart, Percent,
  Search, ArrowRight
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID").format(Math.round(n));

/* ── Visual bar: menunjukkan proporsi HB vs HJ ─────────────────── */
const UntungRugiBar = ({ hb, hj }: { hb: number; hj: number }) => {
  if (hb <= 0 || hj <= 0) return null;
  const max = Math.max(hb, hj);
  const pctHB = (hb / max) * 100;
  const pctHJ = (hj / max) * 100;
  const untung = hj > hb;
  const impas = hj === hb;
  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="font-body text-xs text-blue-300 w-20 shrink-0">Harga Beli</span>
          <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
            <div
              className="h-full bg-blue-500/70 rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${pctHB}%` }}
            >
              <span className="font-body text-[10px] text-white font-bold">Rp{fmt(hb)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-body text-xs w-20 shrink-0 ${untung ? "text-green-300" : impas ? "text-yellow-300" : "text-red-300"}`}>Harga Jual</span>
          <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
            <div
              className={`h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2 ${untung ? "bg-green-500/70" : impas ? "bg-yellow-500/70" : "bg-red-500/70"}`}
              style={{ width: `${pctHJ}%` }}
            >
              <span className="font-body text-[10px] text-white font-bold">Rp{fmt(hj)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`text-center text-xs font-bold font-body py-1 rounded-lg ${untung ? "text-green-400 bg-green-500/10" : impas ? "text-yellow-300 bg-yellow-500/10" : "text-red-400 bg-red-500/10"}`}>
        {impas ? "⚖️ IMPAS — Tidak untung, tidak rugi" : untung ? `📈 UNTUNG Rp${fmt(hj - hb)}` : `📉 RUGI Rp${fmt(hb - hj)}`}
      </div>
    </div>
  );
};

/* ── Kalkulator Jual Beli Interaktif ────────────────────────────── */
const KalkulatorJualBeli = () => {
  const [mode, setMode] = useState<"hitung" | "cari-hj" | "cari-hb" | "cari-persen">("hitung");

  /* mode: hitung */
  const [hb1, setHb1] = useState("");
  const [hj1, setHj1] = useState("");

  /* mode: cari-hj */
  const [hb2, setHb2] = useState("");
  const [pct2, setPct2] = useState("");
  const [tipe2, setTipe2] = useState<"untung" | "rugi">("untung");

  /* mode: cari-hb */
  const [hj3, setHj3] = useState("");
  const [pct3, setPct3] = useState("");
  const [tipe3, setTipe3] = useState<"untung" | "rugi">("untung");

  /* mode: cari-persen */
  const [hb4, setHb4] = useState("");
  const [hj4, setHj4] = useState("");

  const parse = (s: string) => parseFloat(s.replace(/\./g, "").replace(",", ".")) || 0;

  /* ── kalkulasi hitung ── */
  const HB1 = parse(hb1), HJ1 = parse(hj1);
  const selisih1 = HJ1 - HB1;
  const pctHitung = HB1 > 0 ? Math.abs(selisih1 / HB1) * 100 : 0;

  /* ── kalkulasi cari HJ ── */
  const HB2 = parse(hb2), PCT2 = parse(pct2);
  const HJ2 = tipe2 === "untung"
    ? HB2 * ((100 + PCT2) / 100)
    : HB2 * ((100 - PCT2) / 100);

  /* ── kalkulasi cari HB ── */
  const HJ3 = parse(hj3), PCT3 = parse(pct3);
  const HB3 = tipe3 === "untung"
    ? HJ3 * (100 / (100 + PCT3))
    : PCT3 < 100 ? HJ3 * (100 / (100 - PCT3)) : 0;

  /* ── kalkulasi cari persen ── */
  const HB4 = parse(hb4), HJ4 = parse(hj4);
  const selisih4 = HJ4 - HB4;
  const pct4 = HB4 > 0 ? Math.abs(selisih4 / HB4) * 100 : 0;

  const modes = [
    { id: "hitung", label: "Hitung Untung/Rugi", icon: <ShoppingCart className="w-3.5 h-3.5" /> },
    { id: "cari-hj", label: "Cari Harga Jual", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: "cari-hb", label: "Cari Harga Beli", icon: <Search className="w-3.5 h-3.5" /> },
    { id: "cari-persen", label: "Cari % Untung/Rugi", icon: <Percent className="w-3.5 h-3.5" /> },
  ] as const;

  const inputCls = "w-full bg-slate-900/70 border border-border rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-primary";
  const labelCls = "font-body text-xs text-white/60 mb-1 block";

  return (
    <div className="space-y-4">
      {/* Tab mode */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => { playPopSound(); setMode(m.id); }}
            className={`px-2 py-2 rounded-lg text-xs font-semibold font-body transition-all border flex items-center justify-center gap-1.5 ${
              mode === m.id
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "bg-slate-800/60 border-border text-white/60 hover:border-emerald-500/50"
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* ── MODE 1: Hitung Untung/Rugi ── */}
      {mode === "hitung" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Masukkan harga beli (modal) dan harga jual → kalkulator akan otomatis menentukan untung, rugi, atau impas beserta persentasenya.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Harga Beli / Modal (Rp)</label>
              <input type="number" value={hb1} onChange={e => setHb1(e.target.value)} placeholder="Contoh: 200000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Harga Jual (Rp)</label>
              <input type="number" value={hj1} onChange={e => setHj1(e.target.value)} placeholder="Contoh: 250000" className={inputCls} />
            </div>
          </div>
          {HB1 > 0 && HJ1 > 0 && (
            <div className="space-y-3 pt-1">
              <UntungRugiBar hb={HB1} hj={HJ1} />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-blue-400 mb-1">Harga Beli</p>
                  <p className="font-body text-sm font-bold text-blue-300">Rp{fmt(HB1)}</p>
                </div>
                <div className="bg-slate-900/60 rounded-lg p-3">
                  <p className="font-body text-xs text-white/50 mb-1">Harga Jual</p>
                  <p className="font-body text-sm font-bold text-white">Rp{fmt(HJ1)}</p>
                </div>
                <div className={`rounded-lg p-3 ${selisih1 > 0 ? "bg-green-500/10 border border-green-500/30" : selisih1 < 0 ? "bg-red-500/10 border border-red-500/30" : "bg-yellow-500/10 border border-yellow-500/30"}`}>
                  <p className={`font-body text-xs mb-1 ${selisih1 > 0 ? "text-green-400" : selisih1 < 0 ? "text-red-400" : "text-yellow-400"}`}>
                    {selisih1 > 0 ? "Untung" : selisih1 < 0 ? "Rugi" : "Impas"}
                  </p>
                  <p className={`font-body text-sm font-bold ${selisih1 > 0 ? "text-green-300" : selisih1 < 0 ? "text-red-300" : "text-yellow-300"}`}>
                    {selisih1 === 0 ? "—" : `Rp${fmt(Math.abs(selisih1))}`}
                  </p>
                </div>
              </div>
              {selisih1 !== 0 && (
                <div className={`rounded-lg p-3 border text-center space-y-1 ${selisih1 > 0 ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                  <p className="font-body text-xs text-white/50">Persentase {selisih1 > 0 ? "Untung" : "Rugi"}:</p>
                  <p className={`font-body text-base font-bold ${selisih1 > 0 ? "text-green-400" : "text-red-400"}`}>
                    {pctHitung.toFixed(2)}%
                  </p>
                  <p className="font-body text-xs text-white/40">
                    = Rp{fmt(Math.abs(selisih1))} ÷ Rp{fmt(HB1)} × 100%
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── MODE 2: Cari Harga Jual ── */}
      {mode === "cari-hj" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Masukkan modal (harga beli) dan target persentase untung atau rugi → hitung harga jual yang tepat.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Harga Beli / Modal (Rp)</label>
              <input type="number" value={hb2} onChange={e => setHb2(e.target.value)} placeholder="Contoh: 300000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Persentase (%)</label>
              <input type="number" value={pct2} onChange={e => setPct2(e.target.value)} placeholder="Contoh: 25" min={0} max={999} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["untung", "rugi"] as const).map(t => (
              <button
                key={t}
                onClick={() => { playPopSound(); setTipe2(t); }}
                className={`py-2 rounded-lg text-xs font-semibold font-body border transition-all ${
                  tipe2 === t
                    ? t === "untung" ? "bg-green-500/20 border-green-400 text-green-300" : "bg-red-500/20 border-red-400 text-red-300"
                    : "bg-slate-900/40 border-border text-white/40 hover:border-white/30"
                }`}
              >
                {t === "untung" ? "📈 Target Untung" : "📉 Batas Rugi"}
              </button>
            ))}
          </div>
          {HB2 > 0 && PCT2 > 0 && (
            <div className="space-y-3 pt-1">
              <UntungRugiBar hb={HB2} hj={HJ2} />
              <div className={`rounded-lg p-3 border ${tipe2 === "untung" ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                <p className="font-body text-xs text-white/50 mb-2">Cara menghitung:</p>
                <p className="font-body text-sm text-white/80">
                  HJ = {tipe2 === "untung" ? `(100 + ${PCT2})` : `(100 − ${PCT2})`}% × Rp{fmt(HB2)}
                </p>
                <p className="font-body text-sm text-white/80">
                  HJ = {tipe2 === "untung" ? (100 + PCT2) : (100 - PCT2)}% × Rp{fmt(HB2)} ={" "}
                  <strong className={tipe2 === "untung" ? "text-green-300" : "text-red-300"}>Rp{fmt(HJ2)}</strong>
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                  <p className="text-blue-400 mb-1">Modal (HB)</p>
                  <p className="font-bold text-blue-300">Rp{fmt(HB2)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 flex items-center justify-center">
                  <ArrowRight className={`w-4 h-4 ${tipe2 === "untung" ? "text-green-400" : "text-red-400"}`} />
                </div>
                <div className={`rounded-lg p-2 border ${tipe2 === "untung" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <p className={`mb-1 ${tipe2 === "untung" ? "text-green-400" : "text-red-400"}`}>Harga Jual</p>
                  <p className={`font-bold ${tipe2 === "untung" ? "text-green-300" : "text-red-300"}`}>Rp{fmt(HJ2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MODE 3: Cari Harga Beli ── */}
      {mode === "cari-hb" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Ketahui harga jual dan persentase untung/rugi → temukan modal awal (harga beli) yang semula dikeluarkan.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Harga Jual (Rp)</label>
              <input type="number" value={hj3} onChange={e => setHj3(e.target.value)} placeholder="Contoh: 375000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Persentase (%)</label>
              <input type="number" value={pct3} onChange={e => setPct3(e.target.value)} placeholder="Contoh: 25" min={0} max={99} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["untung", "rugi"] as const).map(t => (
              <button
                key={t}
                onClick={() => { playPopSound(); setTipe3(t); }}
                className={`py-2 rounded-lg text-xs font-semibold font-body border transition-all ${
                  tipe3 === t
                    ? t === "untung" ? "bg-green-500/20 border-green-400 text-green-300" : "bg-red-500/20 border-red-400 text-red-300"
                    : "bg-slate-900/40 border-border text-white/40 hover:border-white/30"
                }`}
              >
                {t === "untung" ? "📈 Ada Untung" : "📉 Ada Rugi"}
              </button>
            ))}
          </div>
          {HJ3 > 0 && PCT3 > 0 && HB3 > 0 && (
            <div className="space-y-3 pt-1">
              <UntungRugiBar hb={HB3} hj={HJ3} />
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="font-body text-xs text-white/50 mb-2">Langkah penyelesaian:</p>
                <p className="font-body text-sm text-white/80">
                  HJ = {tipe3 === "untung" ? `(100+${PCT3})` : `(100−${PCT3})`}% × HB
                </p>
                <p className="font-body text-sm text-white/80">
                  HB = Rp{fmt(HJ3)} ÷ {tipe3 === "untung" ? `${(100 + PCT3) / 100}` : `${(100 - PCT3) / 100}`} = <strong className="text-primary">Rp{fmt(HB3)}</strong>
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div className={`rounded-lg p-2 border ${tipe3 === "untung" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <p className={`mb-1 ${tipe3 === "untung" ? "text-green-400" : "text-red-400"}`}>Harga Jual</p>
                  <p className={`font-bold ${tipe3 === "untung" ? "text-green-300" : "text-red-300"}`}>Rp{fmt(HJ3)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                  <p className="text-blue-400 mb-1">Harga Beli</p>
                  <p className="font-bold text-blue-300">Rp{fmt(HB3)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MODE 4: Cari % Untung/Rugi ── */}
      {mode === "cari-persen" && (
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="font-body text-xs text-white/50">Masukkan harga beli dan harga jual → kalkulator menghitung persentase untung atau rugi terhadap modal.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Harga Beli / Modal (Rp)</label>
              <input type="number" value={hb4} onChange={e => setHb4(e.target.value)} placeholder="Contoh: 200000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Harga Jual (Rp)</label>
              <input type="number" value={hj4} onChange={e => setHj4(e.target.value)} placeholder="Contoh: 230000" className={inputCls} />
            </div>
          </div>
          {HB4 > 0 && HJ4 > 0 && (
            <div className="space-y-3 pt-1">
              <UntungRugiBar hb={HB4} hj={HJ4} />
              {selisih4 !== 0 && (
                <div className={`rounded-lg p-3 border ${selisih4 > 0 ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                  <p className="font-body text-xs text-white/50 mb-2">Cara menghitung:</p>
                  <p className="font-body text-sm text-white/80">
                    Selisih = Rp{fmt(HJ4)} − Rp{fmt(HB4)} = {selisih4 > 0 ? "" : "−"}Rp{fmt(Math.abs(selisih4))}
                  </p>
                  <p className="font-body text-sm text-white/80">
                    % {selisih4 > 0 ? "Untung" : "Rugi"} = Rp{fmt(Math.abs(selisih4))} ÷ Rp{fmt(HB4)} × 100%
                    {" = "}<strong className={selisih4 > 0 ? "text-green-300" : "text-red-300"}>{pct4.toFixed(2)}%</strong>
                  </p>
                </div>
              )}
              {selisih4 === 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                  <p className="font-body text-sm font-bold text-yellow-300">⚖️ IMPAS — Persentase = 0%</p>
                  <p className="font-body text-xs text-white/50 mt-1">Harga jual sama dengan modal. Tidak untung, tidak rugi.</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                  <p className="text-blue-400 mb-1">Modal (HB)</p>
                  <p className="font-bold text-blue-300">Rp{fmt(HB4)}</p>
                </div>
                <div className="bg-slate-900/60 rounded-lg p-2">
                  <p className="text-white/50 mb-1">Harga Jual</p>
                  <p className="font-bold text-white">Rp{fmt(HJ4)}</p>
                </div>
                <div className={`rounded-lg p-2 border ${selisih4 > 0 ? "bg-green-500/10 border-green-500/30" : selisih4 < 0 ? "bg-red-500/10 border-red-500/30" : "bg-yellow-500/10 border-yellow-500/30"}`}>
                  <p className={`mb-1 ${selisih4 > 0 ? "text-green-400" : selisih4 < 0 ? "text-red-400" : "text-yellow-400"}`}>
                    % {selisih4 > 0 ? "Untung" : selisih4 < 0 ? "Rugi" : "Impas"}
                  </p>
                  <p className={`font-bold ${selisih4 > 0 ? "text-green-300" : selisih4 < 0 ? "text-red-300" : "text-yellow-300"}`}>
                    {pct4.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Mini Kuis ──────────────────────────────────────────────────── */
const quizData = [
  {
    soal: "Seorang pedagang membeli buku seharga Rp80.000 lalu menjualnya Rp100.000. Berapa persen keuntungannya?",
    pilihan: ["20%", "25%", "30%", "35%"],
    benar: 1,
    penjelasan: "Untung = Rp100.000 − Rp80.000 = Rp20.000. % Untung = Rp20.000 ÷ Rp80.000 × 100% = 25%",
  },
  {
    soal: "Modal Rp500.000, ingin untung 30%. Berapa harga jualnya?",
    pilihan: ["Rp550.000", "Rp600.000", "Rp650.000", "Rp700.000"],
    benar: 2,
    penjelasan: "HJ = (100 + 30)% × Rp500.000 = 1,3 × Rp500.000 = Rp650.000",
  },
  {
    soal: "Sebuah tas dijual Rp340.000 dengan rugi 15%. Berapa harga belinya?",
    pilihan: ["Rp380.000", "Rp390.000", "Rp400.000", "Rp420.000"],
    benar: 2,
    penjelasan: "HB = Rp340.000 ÷ (100−15)% = Rp340.000 ÷ 0,85 = Rp400.000",
  },
  {
    soal: "HB Rp200.000, HJ Rp170.000. Apa yang terjadi dan berapa persentasenya?",
    pilihan: ["Untung 15%", "Rugi 15%", "Untung 17%", "Rugi 17%"],
    benar: 1,
    penjelasan: "HJ < HB → RUGI. Rugi = Rp200.000 − Rp170.000 = Rp30.000. % Rugi = Rp30.000 ÷ Rp200.000 × 100% = 15%",
  },
  {
    soal: "Pedagang menjual sepeda dengan untung 20% dan harga jualnya Rp480.000. Berapa harga belinya?",
    pilihan: ["Rp380.000", "Rp390.000", "Rp400.000", "Rp420.000"],
    benar: 2,
    penjelasan: "HB = 100/(100+20) × Rp480.000 = 100/120 × Rp480.000 = Rp400.000",
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
    const baru = [...jawaban]; baru[idx] = i; setJawaban(baru);
    if (i === q.benar) setSkor(s => s + 1);
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
    const pesan = pct >= 80 ? "Luar biasa! Kamu sangat memahami materi jual beli." : pct >= 60 ? "Bagus! Coba pelajari lagi bagian yang belum tepat." : "Tetap semangat! Baca kembali materinya dan coba lagi.";
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
        <button onClick={ulang} className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400 text-emerald-300 px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-emerald-500/30 transition-colors">
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
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-emerald-400" : jawaban[i] !== null ? (jawaban[i] === quizData[i].benar ? "w-3 bg-green-500" : "w-3 bg-red-500") : "w-3 bg-white/20"}`} />
          ))}
        </div>
        <span className="font-body text-xs text-white/40">Soal {idx + 1}/{quizData.length}</span>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-4">
        <p className="font-body text-sm text-white leading-relaxed">{q.soal}</p>
      </div>
      <div className="space-y-2">
        {q.pilihan.map((p, i) => {
          let cls = "bg-slate-800/60 border-border text-white/80 hover:border-emerald-500/50";
          if (dipilih !== null) {
            if (i === q.benar) cls = "bg-green-500/20 border-green-500 text-green-300";
            else if (i === dipilih && i !== q.benar) cls = "bg-red-500/20 border-red-500 text-red-300";
            else cls = "bg-slate-800/30 border-border text-white/30";
          }
          return (
            <button key={i} onClick={() => pilih(i)} className={`w-full text-left px-4 py-3 rounded-lg border font-body text-sm transition-all flex items-center gap-3 ${cls}`}>
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
        <button onClick={kembali} disabled={idx === 0} className="px-4 py-2 rounded-lg text-sm font-body font-semibold border border-border text-white/60 hover:border-emerald-500/50 disabled:opacity-30 transition-all">
          ← Sebelumnya
        </button>
        <button onClick={lanjut} disabled={dipilih === null} className="flex-1 px-4 py-2 rounded-lg text-sm font-body font-semibold bg-emerald-500/20 border border-emerald-400 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-30 transition-all">
          {idx < quizData.length - 1 ? "Lanjut →" : "Lihat Hasil"}
        </button>
      </div>
    </div>
  );
};

/* ── Section collapsible ────────────────────────────────────────── */
const Section = ({
  id, expanded, onToggle, icon, title, children,
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

/* ── Halaman Utama ──────────────────────────────────────────────── */
const JualBeliUntungRugiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "impas", "persen", "tips", "kalkulator", "kuis", "contoh"
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          JUAL BELI, UNTUNG DAN RUGI
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 — Aritmetika Sosial — Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ─────────────────────────────────────────── */}
          <Section id="intro" expanded={true} onToggle={toggleSection}
            icon={<Lightbulb className="w-5 h-5 text-yellow-400" />}
            title="Kenapa Harus Paham Untung & Rugi?">
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Bayangkan kamu membeli sepasang sepatu seharga Rp150.000, lalu menjualnya ke temanmu Rp180.000. Apakah kamu untung atau rugi? Dari warung kelontong, toko online, hingga perusahaan besar — semua transaksi jual beli selalu berpusat pada dua angka kunci:
              </p>
              <figure>
                <img src={"/images/image_1775640587265.png"} alt="Ilustrasi Jual Beli" className="w-full rounded-xl object-cover" />
                <figcaption className="font-body text-xs text-white/50 text-center mt-2">
                  <a href="https://www.bing.com/images/create" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">https://www.bing.com/images/create</a>
                </figcaption>
              </figure>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-xs font-bold text-blue-300 mb-1 uppercase tracking-wide">Harga Beli (HB) = Modal</p>
                  <p className="font-body text-xs text-white/60 leading-relaxed">Uang yang kamu <em>keluarkan</em> untuk mendapatkan atau membuat suatu barang. Disebut juga <strong className="text-white/80">modal</strong>. Ini adalah titik acuan dalam semua perhitungan.</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-xs font-bold text-orange-300 mb-1 uppercase tracking-wide">Harga Jual (HJ)</p>
                  <p className="font-body text-xs text-white/60 leading-relaxed">Uang yang kamu <em>terima</em> saat menjual barang kepada pembeli. Bisa lebih tinggi, sama, atau lebih rendah dari harga beli.</p>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-border rounded-lg p-4">
                <p className="font-body text-xs font-semibold text-white/70 mb-2">🔑 Kunci Utama:</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Selisih antara <strong className="text-orange-300">HJ</strong> dan <strong className="text-blue-300">HB</strong> itulah yang menentukan apakah transaksi menghasilkan <strong className="text-green-400">untung</strong>, <strong className="text-red-400">rugi</strong>, atau <strong className="text-yellow-300">impas</strong>.
                </p>
                <div className="mt-3 flex flex-col sm:flex-row gap-2 text-xs font-body">
                  <div className="flex items-center gap-2 text-green-400"><TrendingUp className="w-3 h-3" /> HJ &gt; HB → <strong>UNTUNG</strong></div>
                  <div className="flex items-center gap-2 text-red-400"><TrendingDown className="w-3 h-3" /> HJ &lt; HB → <strong>RUGI</strong></div>
                  <div className="flex items-center gap-2 text-yellow-300"><Minus className="w-3 h-3" /> HJ = HB → <strong>IMPAS</strong></div>
                </div>
              </div>
            </div>
          </Section>

          {/* ── RUMUS UNTUNG & RUGI ────────────────────────────────── */}
          <Section id="konsep" expanded={true} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-green-400" />}
            title="Rumus Untung & Rugi">
            <div className="space-y-5">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <p className="font-body text-sm font-bold text-green-300">Untung (Laba)</p>
                </div>
                <p className="font-body text-xs text-white/60 leading-relaxed">
                  Untung terjadi ketika harga jual <strong className="text-white/80">lebih tinggi</strong> dari harga beli.
                </p>
                <div className="bg-slate-900/60 rounded-lg p-3">
                  <BlockMath math="\boxed{\text{Untung} = HJ - HB}" />
                </div>
                <div className="bg-green-900/20 rounded p-3 text-xs font-body text-white/70 leading-relaxed space-y-1">
                  <p><strong className="text-green-300">HJ</strong> = Harga Jual (uang yang masuk)</p>
                  <p><strong className="text-green-300">HB</strong> = Harga Beli / Modal (uang yang keluar)</p>
                  <p className="text-white/50 italic">Rumus ini hanya berlaku ketika HJ &gt; HB. Hasilnya selalu positif.</p>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <p className="font-body text-sm font-bold text-red-300">Rugi</p>
                </div>
                <p className="font-body text-xs text-white/60 leading-relaxed">
                  Rugi terjadi ketika harga jual <strong className="text-white/80">lebih rendah</strong> dari harga beli.
                </p>
                <div className="bg-slate-900/60 rounded-lg p-3">
                  <BlockMath math="\boxed{\text{Rugi} = HB - HJ}" />
                </div>
                <div className="bg-red-900/20 rounded p-3 text-xs font-body text-white/70 leading-relaxed space-y-1">
                  <p><strong className="text-red-300">HB</strong> = Harga Beli / Modal (uang yang keluar)</p>
                  <p><strong className="text-red-300">HJ</strong> = Harga Jual (uang yang masuk)</p>
                  <p className="text-white/50 italic">Posisi HB dan HJ dibalik dibanding rumus untung! Hasilnya selalu positif karena HB &gt; HJ saat rugi.</p>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-bold text-blue-300">Mencari Harga Jual dari Persentase</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs text-green-300 font-semibold">Jika target untung U%:</p>
                    <BlockMath math="HJ = \frac{100 + U}{100} \times HB" />
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs text-red-300 font-semibold">Jika batas rugi R%:</p>
                    <BlockMath math="HJ = \frac{100 - R}{100} \times HB" />
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex gap-3">
                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="font-body text-xs text-yellow-200 leading-relaxed">
                  <strong>Perhatian:</strong> Persentase untung dan rugi <em>selalu</em> dihitung terhadap <strong>harga beli (modal)</strong>, bukan harga jual. Ini adalah kesalahan paling umum dalam soal aritmetika sosial!
                </p>
              </div>
            </div>
          </Section>

          {/* ── IMPAS ─────────────────────────────────────────────── */}
          <Section id="impas" expanded={true} onToggle={toggleSection}
            icon={<Minus className="w-5 h-5 text-yellow-300" />}
            title="Kondisi Impas (Break Even)">
            <div className="space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                <strong className="text-yellow-300">Impas</strong> (break even) adalah kondisi di mana harga jual sama persis dengan harga beli. Penjual tidak untung, tapi juga tidak rugi.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="bg-slate-900/60 rounded-lg p-3 mb-3">
                  <BlockMath math="\boxed{HJ = HB \implies \text{Impas (tidak untung, tidak rugi)}}" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <p className="text-white/50 mb-1">Untung</p>
                    <p className="text-green-400 font-bold">&gt; 0</p>
                    <p className="text-white/40">HJ &gt; HB</p>
                  </div>
                  <div className="bg-yellow-500/20 rounded p-2 text-center border border-yellow-500/40">
                    <p className="text-white/50 mb-1">Impas</p>
                    <p className="text-yellow-300 font-bold">= 0</p>
                    <p className="text-white/40">HJ = HB</p>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <p className="text-white/50 mb-1">Rugi</p>
                    <p className="text-red-400 font-bold">&lt; 0</p>
                    <p className="text-white/40">HJ &lt; HB</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="font-body text-xs text-white/60 leading-relaxed">
                  <strong className="text-white/80">Contoh situasi impas:</strong> Sebuah toko membeli buku seharga Rp25.000 per buah. Agar tidak rugi, harga jual minimum yang boleh dipatok adalah <strong className="text-yellow-300">Rp25.000</strong>. Di titik ini penjual impas — belum ada keuntungan, tapi modal sudah kembali.
                </p>
              </div>
            </div>
          </Section>

          {/* ── PERSENTASE & MENCARI HB ───────────────────────────── */}
          <Section id="persen" expanded={true} onToggle={toggleSection}
            icon={<Target className="w-5 h-5 text-purple-400" />}
            title="Persentase Untung/Rugi & Mencari Harga Beli">
            <div className="space-y-5">
              <p className="font-body text-sm text-white/70 leading-relaxed">
                Nilai untung/rugi dalam rupiah saja tidak selalu cukup. Persentase memberikan gambaran <em>seberapa besar</em> untung atau rugi relatif terhadap modal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-purple-300">Persentase Untung</p>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="\%U = \frac{\text{Untung}}{HB} \times 100\%" />
                  </div>
                  <p className="font-body text-xs text-white/55 leading-relaxed">
                    Contoh: untung Rp20.000 dari modal Rp100.000 → <InlineMath math="\%U = 20\%" />.
                  </p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-bold text-purple-300">Persentase Rugi</p>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <BlockMath math="\%R = \frac{\text{Rugi}}{HB} \times 100\%" />
                  </div>
                  <p className="font-body text-xs text-white/55 leading-relaxed">
                    Rugi dihitung dari <InlineMath math="HB - HJ" />, lalu dibagi modal × 100%. Hasilnya selalu positif.
                  </p>
                </div>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                <p className="font-body text-sm font-bold text-cyan-300">Mencari Harga Beli dari Harga Jual & Persentase</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs text-green-300 font-semibold">Jika diketahui untung U%:</p>
                    <BlockMath math="HB = \frac{100}{100 + U} \times HJ" />
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs text-red-300 font-semibold">Jika diketahui rugi R%:</p>
                    <BlockMath math="HB = \frac{100}{100 - R} \times HJ" />
                  </div>
                </div>
              </div>
              <WarungAritmetika />

              <div className="bg-slate-900/60 border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-slate-800/80">
                  <p className="font-body text-xs font-bold text-white/70 uppercase tracking-wide">Ringkasan Semua Rumus</p>
                </div>
                <div className="p-3 space-y-2 font-body text-xs text-white/70">
                  <div className="flex gap-2 items-start"><span className="text-green-400 shrink-0 font-bold w-28">Untung</span><span><InlineMath math="= HJ - HB" /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-red-400 shrink-0 font-bold w-28">Rugi</span><span><InlineMath math="= HB - HJ" /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-purple-300 shrink-0 font-bold w-28">% Untung</span><span><InlineMath math="= \frac{\text{Untung}}{HB} \times 100\%" /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-purple-300 shrink-0 font-bold w-28">% Rugi</span><span><InlineMath math="= \frac{\text{Rugi}}{HB} \times 100\%" /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-blue-300 shrink-0 font-bold w-28">HJ (untung U%)</span><span><InlineMath math="= \frac{100+U}{100} \times HB" /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-blue-300 shrink-0 font-bold w-28">HJ (rugi R%)</span><span><InlineMath math="= \frac{100-R}{100} \times HB" /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-cyan-300 shrink-0 font-bold w-28">HB (dari untung)</span><span><InlineMath math="= \frac{100}{100+U} \times HJ" /></span></div>
                  <div className="flex gap-2 items-start"><span className="text-cyan-300 shrink-0 font-bold w-28">HB (dari rugi)</span><span><InlineMath math="= \frac{100}{100-R} \times HJ" /></span></div>
                </div>
              </div>
            </div>
          </Section>

          {/* ── TIPS & STRATEGI ───────────────────────────────────── */}
          <Section id="tips" expanded={true} onToggle={toggleSection}
            icon={<Star className="w-5 h-5 text-yellow-400" />}
            title="Tips & Strategi Mengerjakan Soal">
            <div className="grid grid-cols-1 gap-3">
              {[
                { n: "01", judul: "Tentukan dulu: Untung atau Rugi?", isi: "Sebelum menghitung, bandingkan HJ dan HB. Jika HJ > HB → pakai rumus untung. Jika HJ < HB → pakai rumus rugi. Jangan sampai terbalik!" },
                { n: "02", judul: "Persen selalu terhadap modal (HB)", isi: "Ingat: %U dan %R dibagi oleh HB, bukan HJ. Kalau salah pembagi, hasil persennya akan salah." },
                { n: "03", judul: "Cara cepat mencari HJ dari persentase", isi: "Gunakan faktor pengali: untung 20% → kalikan modal dengan 1,2. Rugi 15% → kalikan modal dengan 0,85." },
                { n: "04", judul: "Cek ulang dengan logika sederhana", isi: "Setelah mendapat jawaban, tanyakan: 'Masuk akal tidak?' Jika modal Rp100.000 dan dijual untung 20%, HJ harus lebih dari Rp100.000." },
              ].map(t => (
                <div key={t.n} className="bg-slate-800/60 rounded-lg p-4 flex gap-3">
                  <span className="text-yellow-400 font-bold text-sm shrink-0">{t.n}</span>
                  <div>
                    <p className="font-body text-xs font-semibold text-white/90 mb-1">{t.judul}</p>
                    <p className="font-body text-xs text-white/55 leading-relaxed">{t.isi}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── KALKULATOR INTERAKTIF ─────────────────────────────── */}
          <Section id="kalkulator" expanded={true} onToggle={toggleSection}
            icon={<Calculator className="w-5 h-5 text-emerald-400" />}
            title="Kalkulator Jual Beli Interaktif">
            <div className="space-y-3">
              <p className="font-body text-xs text-white/50 leading-relaxed">
                Gunakan kalkulator ini untuk memverifikasi perhitunganmu. Pilih mode sesuai yang ingin dihitung, lalu masukkan nilai yang diketahui — hasilnya langsung muncul secara otomatis.
              </p>
              <KalkulatorJualBeli />
            </div>
          </Section>

          {/* ── MINI KUIS ─────────────────────────────────────────── */}
          <Section id="kuis" expanded={true} onToggle={toggleSection}
            icon={<Star className="w-5 h-5 text-emerald-400" />}
            title="Mini Kuis — Uji Pemahamanmu!">
            <MiniKuis />
          </Section>

          {/* ── CONTOH SOAL ───────────────────────────────────────── */}
          <Section id="contoh" expanded={true} onToggle={toggleSection}
            icon={<Calculator className="w-5 h-5 text-blue-400" />}
            title="Contoh Soal dan Pembahasan">
            <div className="space-y-6">

              {/* MUDAH */}
              <div className="border-l-4 border-green-500 pl-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                  <span className="font-body font-semibold text-white text-sm">Contoh 1 – Menghitung Untung & Persentasenya</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white leading-relaxed">
                    Seorang pedagang membeli 1 karung beras seharga <strong>Rp180.000</strong> lalu menjualnya seharga <strong>Rp225.000</strong>. Hitunglah besar untung dan persentase keuntungannya!
                  </p>
                </div>
                <figure>
                  <img src={"/images/image_1775640978525.png"} alt="Pedagang beras di pasar" className="w-full rounded-xl object-cover" />
                  <figcaption className="font-body text-xs text-white/50 text-center mt-2">
                    <a href="https://infoburuh.com/wp-content/uploads/2022/12/Harga_Beras_Indonesia_Disebut_Bank_Dunia_Paling_Mahal_di_Asia_Tenggara.jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">sumber gambar</a>
                  </figcaption>
                </figure>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="text-xs text-white/60 space-y-1">
                      <p>✦ Diketahui: <InlineMath math="HB = \text{Rp}180.000" />, <InlineMath math="HJ = \text{Rp}225.000" /></p>
                      <p>✦ Karena HJ &gt; HB, maka pedagang <strong className="text-green-400">UNTUNG</strong></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\text{Untung} = HJ - HB = 225.000 - 180.000 = \text{Rp}45.000" />
                      <BlockMath math="\%U = \frac{\text{Untung}}{HB} \times 100\% = \frac{45.000}{180.000} \times 100\% = 25\%" />
                    </div>
                    <p className="text-green-300 font-semibold text-xs">✅ Pedagang untung Rp45.000 atau 25% dari modal.</p>
                  </div>
                </div>
              </div>

              {/* SEDANG */}
              <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                  <span className="font-body font-semibold text-white text-sm">Contoh 2 – Menentukan Harga Jual dari Persentase Untung</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white leading-relaxed">
                    Seorang pedagang buah membeli durian seharga <strong>Rp240.000</strong> per buah. Ia ingin mendapatkan untung <strong>35%</strong> dari modal. Berapa harga jual yang harus ia patok?
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="text-xs text-white/60 space-y-1">
                      <p>✦ Diketahui: <InlineMath math="HB = \text{Rp}240.000" />, untung <InlineMath math="U = 35\%" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="HJ = \frac{100 + 35}{100} \times 240.000 = 1{,}35 \times 240.000 = \text{Rp}324.000" />
                    </div>
                    <p className="text-yellow-300 font-semibold text-xs">✅ Harga jual yang harus dipatok = Rp324.000</p>
                  </div>
                </div>
              </div>

              {/* SULIT */}
              <div className="border-l-4 border-red-500 pl-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                  <span className="font-body font-semibold text-white text-sm">Contoh 3 – Mencari Harga Beli dari Harga Jual & Persentase Rugi</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white leading-relaxed">
                    Sebuah sepeda dijual seharga <strong>Rp680.000</strong> dan penjual mengalami kerugian sebesar <strong>15%</strong>. Berapakah harga beli sepeda tersebut? Berapa pula rugi dalam rupiah?
                  </p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="text-xs text-white/60 space-y-1">
                      <p>✦ Diketahui: <InlineMath math="HJ = \text{Rp}680.000" />, rugi <InlineMath math="R = 15\%" /></p>
                    </div>
                    <p className="text-xs font-semibold text-white/80">Langkah 1 — Cari Harga Beli:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="HB = \frac{100}{100 - 15} \times 680.000 = \frac{100}{85} \times 680.000 = \text{Rp}800.000" />
                    </div>
                    <p className="text-xs font-semibold text-white/80">Langkah 2 — Cari Rugi dalam Rupiah:</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\text{Rugi} = HB - HJ = 800.000 - 680.000 = \text{Rp}120.000" />
                    </div>
                    <div className="text-xs text-white/60">
                      <p>✦ Verifikasi: <InlineMath math="\%R = \frac{120.000}{800.000} \times 100\% = 15\%" /> ✓ Sesuai!</p>
                    </div>
                    <p className="text-red-300 font-semibold text-xs">✅ Harga beli sepeda = Rp800.000. Kerugian = Rp120.000.</p>
                  </div>
                </div>
              </div>

              {/* BONUS */}
              <div className="border-l-4 border-yellow-400 pl-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-yellow-400/20 text-yellow-300 text-xs font-bold px-2 py-1 rounded">BONUS</span>
                  <span className="font-body font-semibold text-white text-sm">Contoh 4 – Kondisi Impas (Break Even)</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white leading-relaxed">
                    Seorang pedagang membeli 10 buah mangga seharga <strong>Rp50.000</strong>. Ia menjual 7 buah seharga <strong>Rp6.000</strong> per buah dan sisanya busuk. Apakah pedagang untung, rugi, atau impas?
                  </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="text-xs text-white/60 space-y-1">
                      <p>✦ HB (modal) = Rp50.000</p>
                      <p>✦ HJ (total hasil jual) = 7 × Rp6.000 = Rp42.000</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="HJ < HB \implies \text{RUGI}" />
                      <BlockMath math="\text{Rugi} = 50.000 - 42.000 = \text{Rp}8.000" />
                    </div>
                    <p className="text-xs text-white/60">Agar impas, pedagang perlu menjual total Rp50.000 → minimal <InlineMath math="\lceil 50.000 \div 6.000 \rceil = 9" /> buah mangga.</p>
                    <p className="text-yellow-300 font-semibold text-xs">✅ Pedagang rugi Rp8.000. Agar impas, ia harus jual minimal 9 buah.</p>
                  </div>
                </div>
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

export default JualBeliUntungRugiPage;
