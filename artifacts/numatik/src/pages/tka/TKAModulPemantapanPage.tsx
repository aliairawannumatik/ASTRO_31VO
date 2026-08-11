import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const routes: Record<string, string> = {
  "Bilangan Bulat": "/tka/modul-pemantapan/bilangan-bulat",
  "Bilangan Rasional": "/tka/modul-pemantapan/bilangan-rasional",
  "Perbandingan": "/tka/modul-pemantapan/perbandingan",
  "Bilangan Berpangkat dan Irasional": "/tka/modul-pemantapan/bilangan-berpangkat-irasional",
  "Aritmetika Sosial": "/tka/modul-pemantapan/aritmetika-sosial",
  "PLSV dan PTLSV": "/tka/modul-pemantapan/plsv",
  "Sistem Persamaan Linear Dua Variabel": "/tka/modul-pemantapan/spldv",
  "Bentuk Aljabar": "/tka/modul-pemantapan/aljabar",
  "Himpunan": "/tka/modul-pemantapan/himpunan",
  "Relasi dan Fungsi": "/tka/modul-pemantapan/relasi-fungsi",
  "Pola Bilangan": "/tka/modul-pemantapan/pola-bilangan",
  "Garis dan Sudut": "/tka/modul-pemantapan/garis-sudut",
  "Teorema Pythagoras": "/tka/modul-pemantapan/teorema-pythagoras",
  "Segitiga dan Segiempat": "/tka/modul-pemantapan/segitiga-segiempat",
  "Lingkaran": "/tka/modul-pemantapan/lingkaran",
  "Kesebangunan dan Kekongruenan": "/tka/modul-pemantapan/kesebangunan",
  "Transformasi Geometri": "/tka/modul-pemantapan/transformasi-geometri",
  "Bangun Ruang Sisi Datar": "/tka/modul-pemantapan/bangun-ruang-sisi-datar",
  "Bangun Ruang Sisi Lengkung": "/tka/modul-pemantapan/bangun-ruang-sisi-lengkung",
  "Statistika": "/tka/modul-pemantapan/statistika",
  "Peluang": "/tka/modul-pemantapan/peluang",
};


type Topic = { name: string; emoji: string };

const allTopics: Topic[] = [
  { name: "Bilangan Bulat", emoji: "🔵" },
  { name: "Bilangan Rasional", emoji: "⅔" },
  { name: "Perbandingan", emoji: "∶" },
  { name: "Bilangan Berpangkat dan Irasional", emoji: "√" },
  { name: "Aritmetika Sosial", emoji: "💰" },
  { name: "PLSV dan PTLSV", emoji: "=" },
  { name: "Sistem Persamaan Linear Dua Variabel", emoji: "xy" },
  { name: "Bentuk Aljabar", emoji: "𝑥" },
  { name: "Himpunan", emoji: "⊂" },
  { name: "Relasi dan Fungsi", emoji: "↦" },
  { name: "Pola Bilangan", emoji: "…" },
  { name: "Garis dan Sudut", emoji: "∠" },
  { name: "Teorema Pythagoras", emoji: "△" },
  { name: "Segitiga dan Segiempat", emoji: "◻" },
  { name: "Lingkaran", emoji: "○" },
  { name: "Kesebangunan dan Kekongruenan", emoji: "≅" },
  { name: "Transformasi Geometri", emoji: "↻" },
  { name: "Bangun Ruang Sisi Datar", emoji: "⬡" },
  { name: "Bangun Ruang Sisi Lengkung", emoji: "⬤" },
  { name: "Statistika", emoji: "📉" },
  { name: "Peluang", emoji: "🎲" },
];

const TKAModulPemantapanPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isWhite = theme === "white";
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleClick = (name: string) => {
    const path = routes[name];
    if (path) { playPopSound(); navigate(path); }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/tka" />

      <div className="relative z-10 max-w-2xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_32px_rgba(34,211,238,0.2)]"
            style={isWhite ? { background: "var(--bg-secondary)", border: "1px solid var(--border)" } : { background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(99,102,241,0.1))", border: "1px solid rgba(34,211,238,0.3)" }}>
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white text-center mb-1"
            style={isWhite ? {} : { textShadow: "0 0 40px rgba(34,211,238,0.5)" }}>
            MODUL PEMANTAPAN TKA
          </h1>
          <p className="font-display text-sm font-semibold text-center mb-4"
            style={isWhite ? { color: "var(--text-secondary)" } : { color: "#22d3ee", textShadow: "0 0 20px rgba(34,211,238,0.4)" }}>
            Oleh: Irawan Sutiawan, M.Pd
          </p>
          <p className="text-white/45 text-xs text-center font-body mb-5 max-w-sm">
            Materi &amp; latihan soal per topik untuk persiapan TKA Matematika SMP
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { v: "21", l: "Topik", c: "rgba(34,211,238,0.12)", bc: "rgba(34,211,238,0.3)", tc: "#67e8f9" },
              { v: "3", l: "Jenjang Kelas", c: "rgba(167,139,250,0.12)", bc: "rgba(167,139,250,0.3)", tc: "#c4b5fd" },
              { v: "TKA", l: "Siap Ujian", c: "rgba(34,197,94,0.1)", bc: "rgba(34,197,94,0.3)", tc: "#86efac" },
            ].map(({ v, l, c, bc, tc }) => (
              <div key={l} className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full font-body"
                style={isWhite ? { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)" } : { background: c, border: `1px solid ${bc}`, color: tc }}>
                <span className="text-sm">{v}</span>
                <span className="opacity-70 font-normal">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── All Topics (flat list) ── */}
        <div className="rounded-2xl overflow-hidden"
          style={isWhite ? {
            border: "1px solid rgba(33,150,243,0.4)",
            boxShadow: "0 4px 32px rgba(33,150,243,0.1)",
            background: "rgba(255,255,255,0.05)",
          } : {
            border: "1px solid rgba(34,211,238,0.2)",
            boxShadow: "0 4px 32px rgba(34,211,238,0.08)",
            background: "rgba(10,10,30,0.7)",
          }}>
          <div className="px-3 py-3 flex flex-col gap-1.5">
            {allTopics.map((topic, ti) => {
              const hasRoute = !!routes[topic.name];
              return (
                <button
                  key={topic.name}
                  onClick={() => handleClick(topic.name)}
                  disabled={!hasRoute}
                  className={`group flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left transition-all duration-200
                    ${hasRoute
                      ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                      : "cursor-not-allowed opacity-35"}`}
                  style={hasRoute ? (isWhite ? {
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.22)",
                  } : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }) : (isWhite ? {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  } : {
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  })}
                  onMouseEnter={e => {
                    if (hasRoute) {
                      (e.currentTarget as HTMLButtonElement).style.background = isWhite ? "rgba(255,255,255,0.25)" : "rgba(34,211,238,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.border = isWhite ? "1px solid rgba(255,255,255,0.45)" : "1px solid rgba(34,211,238,0.3)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (hasRoute) {
                      (e.currentTarget as HTMLButtonElement).style.background = isWhite ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLButtonElement).style.border = isWhite ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.07)";
                    }
                  }}
                >
                  {/* Number */}
                  <span className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center font-display font-bold text-[10px]"
                    style={isWhite ? { background: "rgba(255,255,255,0.22)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.35)" } : { background: "rgba(34,211,238,0.1)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.2)" }}>
                    {ti + 1}
                  </span>

                  {/* Emoji icon */}
                  <span className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={isWhite ? { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" } : { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {topic.emoji}
                  </span>

                  {/* Name */}
                  <span className="flex-1 font-body text-sm font-medium leading-snug transition-colors"
                    style={{ color: isWhite ? "#ffffff" : undefined }}>
                    {topic.name}
                  </span>

                  {/* Arrow */}
                  {hasRoute && (
                    <svg className="w-4 h-4 shrink-0 transition-all duration-200 group-hover:translate-x-1"
                      style={isWhite ? { color: "rgba(255,255,255,0.7)" } : { color: "#22d3ee", opacity: 0.5 }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Footer note ── */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="w-full rounded-xl px-4 py-3 flex items-start gap-3"
            style={isWhite ? { background: "var(--bg-secondary)", border: "1px solid var(--border)" } : { background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}>
            <span className="text-base shrink-0">📘</span>
            <p className="font-body text-xs text-white/50 leading-relaxed">
              Setiap topik memuat <span className="text-cyan-300 font-semibold">ringkasan materi</span> dan{" "}
              <span className="text-cyan-300 font-semibold">latihan soal dasar</span> untuk memantapkan pemahaman sebelum menghadapi TKA.
            </p>
          </div>
          <button
            onClick={() => { playPopSound(); navigate("/tka"); }}
            className="text-sm text-white/30 hover:text-cyan-400 transition-colors cursor-pointer font-body mt-1"
          >
            ← Kembali ke TKA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TKAModulPemantapanPage;
