import { useEffect, useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  Brain, ChevronRight, FileText, BookOpen, Target,
  ChevronDown, ChevronUp, Layers, Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const packages = [
  { id: 1, label: "Try Out dan Prediksi TKA Matematika 1", path: "/tka/paket-1", soal: 30 },
  { id: 2, label: "Try Out dan Prediksi TKA Matematika 2", path: "/tka/paket-2", soal: 30 },
  { id: 3, label: "Try Out dan Prediksi TKA Matematika 3", path: "/tka/paket-3", soal: 30 },
  { id: 4, label: "Try Out dan Prediksi TKA Matematika 4", path: "/tka/paket-4", soal: 30 },
  { id: 5, label: "Try Out dan Prediksi TKA Matematika 5", path: "/tka/paket-5", soal: 30 },
  { id: 6, label: "Try Out dan Prediksi TKA Matematika 6", path: "/tka/paket-6", soal: 30 },
  { id: 7, label: "Try Out dan Prediksi TKA Matematika 7", path: "/tka/paket-7", soal: 30 },
];

const routes: Record<string, string> = {
  "Bilangan Bulat": "/tka/modul-pemantapan/bilangan-bulat",
  "Bilangan Rasional": "/tka/modul-pemantapan/bilangan-rasional",
  "Bentuk Aljabar": "/tka/modul-pemantapan/aljabar",
  "PLSV dan PtLSV": "/tka/modul-pemantapan/plsv",
  "Perbandingan": "/tka/modul-pemantapan/perbandingan",
  "Aritmetika Sosial": "/tka/modul-pemantapan/aritmetika-sosial",
  "Himpunan": "/tka/modul-pemantapan/himpunan",
  "Garis dan Sudut": "/tka/modul-pemantapan/garis-sudut",
  "Segitiga & Segiempat": "/tka/modul-pemantapan/segitiga-segiempat",
  "Pola Bilangan": "/tka/modul-pemantapan/pola-bilangan",
  "Relasi dan Fungsi": "/tka/modul-pemantapan/relasi-fungsi",
  "Sistem Persamaan Linear Dua Variabel": "/tka/modul-pemantapan/spldv",
  "Teorema Pythagoras": "/tka/modul-pemantapan/teorema-pythagoras",
  "Lingkaran": "/tka/modul-pemantapan/lingkaran",
  "Bangun Ruang Sisi Datar": "/tka/modul-pemantapan/bangun-ruang-sisi-datar",
  "Bilangan Berpangkat dan Irasional": "/tka/modul-pemantapan/bilangan-berpangkat-irasional",
  "Kesebangunan & Kekongruenan": "/tka/modul-pemantapan/kesebangunan",
  "Transformasi Geometri": "/tka/modul-pemantapan/transformasi-geometri",
  "Bangun Ruang Sisi Lengkung": "/tka/modul-pemantapan/bangun-ruang-sisi-lengkung",
  "Persamaan Garis": "/tka/modul-pemantapan/persamaan-garis",
  "Koordinat Kartesius": "/tka/modul-pemantapan/koordinat-cartesius",
  "Statistika": "/tka/modul-pemantapan/statistika",
  "Peluang": "/tka/modul-pemantapan/peluang",
};

type Topic = { name: string; emoji: string };

const allTopics: Topic[] = [
  { name: "Bilangan Bulat", emoji: "🔵" },
  { name: "Bilangan Rasional", emoji: "⅔" },
  { name: "Perbandingan", emoji: "∶" },
  { name: "Bilangan Berpangkat dan Irasional", emoji: "√" },
  { name: "PLSV dan PtLSV", emoji: "=" },
  { name: "Sistem Persamaan Linear Dua Variabel", emoji: "xy" },
  { name: "Bentuk Aljabar", emoji: "𝑥" },
  { name: "Aritmetika Sosial", emoji: "💰" },
  { name: "Himpunan", emoji: "⊂" },
  { name: "Garis dan Sudut", emoji: "∠" },
  { name: "Segitiga & Segiempat", emoji: "◻" },
  { name: "Pola Bilangan", emoji: "…" },
  { name: "Koordinat Kartesius", emoji: "⊹" },
  { name: "Relasi dan Fungsi", emoji: "↦" },
  { name: "Persamaan Garis", emoji: "📈" },
  { name: "Teorema Pythagoras", emoji: "△" },
  { name: "Lingkaran", emoji: "○" },
  { name: "Bangun Ruang Sisi Datar", emoji: "⬡" },
  { name: "Kesebangunan & Kekongruenan", emoji: "≅" },
  { name: "Transformasi Geometri", emoji: "↻" },
  { name: "Bangun Ruang Sisi Lengkung", emoji: "⬤" },
  { name: "Statistika", emoji: "📉" },
  { name: "Peluang", emoji: "🎲" },
];


const TKAPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isWhite = theme === "white";
  const [showModul, setShowModul] = useState(() =>
    sessionStorage.getItem("tka_showModul") === "true"
  );
  const [showPaket, setShowPaket] = useState(false);

  const handleTopicClick = (name: string) => {
    const path = routes[name];
    if (path) {
      sessionStorage.setItem("tka_showModul", "true");
      playPopSound();
      navigate(path);
    }
  };

  const toggleModul = () => {
    const next = !showModul;
    setShowModul(next);
    sessionStorage.setItem("tka_showModul", String(next));
    playPopSound();
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/menu" />
      <div className="relative z-10 max-w-2xl w-full px-4 py-10">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/10">
            <Brain className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-1 text-center tracking-wide">
            TES KEMAMPUAN AKADEMIK
          </h1>
          <p className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center tracking-wider mb-2 animate-pulse">
            TAHUN AJARAN 2026 - 2027
          </p>
          <p className="text-white/50 text-xs text-center font-body max-w-xs">
            Pemantapan &amp; Persiapan TKA — Matematika Kelas IX
          </p>
          <div className="mt-4 flex gap-5 items-center">
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <FileText className="w-3.5 h-3.5" />
              <span>7 Try Out</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <Target className="w-3.5 h-3.5" />
              <span>210 Soal Total</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kelas IX</span>
            </div>
          </div>
        </div>

        {/* ── Modul Pemantapan (toggle) ── */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0s" }}>
          <button
            onClick={toggleModul}
            className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer mb-3
              ${showModul
                ? "bg-emerald-500/20 border-emerald-400/60 shadow-md shadow-emerald-500/10"
                : "bg-emerald-500/10 border-emerald-400/30 hover:bg-emerald-500/15 hover:border-emerald-400/50"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="font-display text-sm font-bold text-emerald-200 tracking-wide uppercase">Modul Pemantapan 2026 - 2027</span>
              <span className="text-[10px] font-body text-emerald-400/70 bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">28 Topik</span>
            </div>
            {showModul
              ? <ChevronUp className="w-4 h-4 text-emerald-300" />
              : <ChevronDown className="w-4 h-4 text-emerald-300/60" />}
          </button>

          {showModul && (
            <div className="rounded-2xl overflow-hidden"
              style={{
                border: isWhite ? "1px solid rgba(0,119,182,0.2)" : "1px solid rgba(34,211,238,0.2)",
                boxShadow: isWhite ? "0 4px 24px rgba(0,119,182,0.08)" : "0 4px 24px rgba(34,211,238,0.08)",
                background: isWhite ? "var(--bg-card)" : "rgba(10,10,30,0.7)",
              }}>
              <div className="px-2.5 py-2.5 flex flex-col gap-1">
                {allTopics.map((topic, ti) => {
                  const hasRoute = !!routes[topic.name];
                  return (
                    <button
                      key={topic.name}
                      onClick={() => handleTopicClick(topic.name)}
                      disabled={!hasRoute}
                      className={`group flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-all duration-200
                        ${hasRoute ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0" : "cursor-not-allowed opacity-35"}`}
                      style={hasRoute ? {
                        background: isWhite ? "var(--bg-secondary)" : "rgba(255,255,255,0.04)",
                        border: isWhite ? "1px solid rgba(0,119,182,0.12)" : "1px solid rgba(255,255,255,0.07)",
                      } : {
                        background: isWhite ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
                        border: isWhite ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.04)",
                      }}
                      onMouseEnter={e => {
                        if (hasRoute) {
                          (e.currentTarget as HTMLButtonElement).style.background = isWhite ? "rgba(0,119,182,0.08)" : "rgba(34,211,238,0.08)";
                          (e.currentTarget as HTMLButtonElement).style.border = isWhite ? "1px solid rgba(0,119,182,0.3)" : "1px solid rgba(34,211,238,0.3)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (hasRoute) {
                          (e.currentTarget as HTMLButtonElement).style.background = isWhite ? "var(--bg-secondary)" : "rgba(255,255,255,0.04)";
                          (e.currentTarget as HTMLButtonElement).style.border = isWhite ? "1px solid rgba(0,119,182,0.12)" : "1px solid rgba(255,255,255,0.07)";
                        }
                      }}
                    >
                      <span className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center font-display font-bold text-[9px]"
                        style={isWhite ? { background: "rgba(0,119,182,0.1)", color: "#1565c0", border: "1px solid rgba(0,119,182,0.2)" } : { background: "rgba(34,211,238,0.1)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.2)" }}>
                        {ti + 1}
                      </span>
                      <span className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: isWhite ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.3)", border: isWhite ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.06)" }}>
                        {topic.emoji}
                      </span>
                      <span className="flex-1 font-body text-sm font-medium leading-snug text-white/80 group-hover:text-white transition-colors">
                        {topic.name}
                      </span>
                      {hasRoute && (
                        <svg className="w-3.5 h-3.5 shrink-0 transition-all duration-200 group-hover:translate-x-1"
                          style={{ color: "#22d3ee", opacity: 0.5 }}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Paket Latihan (toggle) ── */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.10s" }}>
          <button
            onClick={() => { playPopSound(); setShowPaket(v => !v); }}
            className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer mb-3
              ${showPaket
                ? "bg-cyan-500/20 border-cyan-400/60 shadow-md shadow-cyan-500/10"
                : "bg-cyan-500/10 border-cyan-400/30 hover:bg-cyan-500/15 hover:border-cyan-400/50"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-cyan-300" />
              </div>
              <span className="font-display text-sm font-bold text-cyan-200 tracking-wide uppercase">Try Out dan Prediksi TKA Matematika 2026 - 2027</span>
              <span className="text-[10px] font-body text-cyan-400/70 bg-cyan-500/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">7 Paket</span>
            </div>
            {showPaket
              ? <ChevronUp className="w-4 h-4 text-cyan-300" />
              : <ChevronDown className="w-4 h-4 text-cyan-300/60" />}
          </button>

          {showPaket && (
            <div className="flex flex-col gap-2.5">
              {packages.map((pkg, i) => (
                <button
                  key={pkg.id}
                  onClick={() => { playPopSound(); navigate(pkg.path); }}
                  className="group flex items-center gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3.5
                    hover:bg-cyan-500/8 hover:border-cyan-400/40 hover:shadow-md hover:shadow-cyan-500/5
                    transition-all duration-250 cursor-pointer text-left animate-slide-up"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0
                    bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors">
                    <span className="font-display text-[10px] text-cyan-400/60 leading-none">No.</span>
                    <span className="font-display text-base font-bold text-cyan-300 leading-tight">{String(pkg.id).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-white/30 font-body uppercase tracking-wider">Try Out TKA</span>
                    <p className="font-body text-sm font-semibold text-white group-hover:text-cyan-100 transition-colors truncate">
                      {pkg.label}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="text-[10px] text-white/30 font-body">Jumlah Soal</span>
                    <span className="text-sm font-bold font-body text-cyan-300">{pkg.soal}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Soal TKA Asli 2025 ── */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.20s" }}>
          <button
            onClick={() => { playPopSound(); navigate("/tka/soal-asli-2025"); }}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl border cursor-pointer
              bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-orange-500/10
              border-amber-400/50 hover:border-amber-400/80
              hover:from-amber-500/30 hover:via-yellow-500/15 hover:to-orange-500/15
              shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20
              transition-all duration-200 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-400/50 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-left">
                <span className="font-display text-sm font-bold text-amber-100 tracking-wide block leading-tight">
                  SOAL DAN PEMBAHASAN TKA MATEMATIKA 2025 - 2026
                </span>
                <span className="text-[10px] font-body text-amber-400/70 leading-none">30 Soal · Soal Resmi · Tahun 2025 - 2026</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-flex text-[10px] font-body font-bold text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-full tracking-wider">
                ASLI
              </span>
              <ChevronRight className="w-4 h-4 text-amber-300" />
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKAPage;
