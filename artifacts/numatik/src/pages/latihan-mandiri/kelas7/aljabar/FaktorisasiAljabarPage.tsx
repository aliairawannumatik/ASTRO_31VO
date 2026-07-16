import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/* ── Reusable atoms ───────────────────────────────────── */
const SubLabel = ({ letter, color }: { letter: string; color: string }) => (
  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${color}`}>
    {letter}
  </span>
);

const Tag = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-body uppercase tracking-wider ${color}`}>
    {label}
  </span>
);

const AlgExpr = ({ math }: { math: string }) => (
  <span className="inline-block"><InlineMath math={math} /></span>
);

/* ── Soal 1 ── GCF Sederhana ──────────────────────────── */
const SoalSatu = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Faktorkan bentuk-bentuk aljabar berikut menggunakan faktor persekutuan terbesar (GCF)!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "1",  expr: "15b + 25" },
        { l: "2",  expr: "18mn + 24m" },
        { l: "3",  expr: "8p^3 - 28p" },
        { l: "4",  expr: "b^3 - b" },
        { l: "5",  expr: "18a^2 + 27a^3" },
        { l: "6",  expr: "6xy + 15x^2y^2" },
        { l: "7",  expr: "14p^2q - 21pq^2" },
        { l: "8",  expr: "22a^2b^2c + 33a^3bc^2" },
        { l: "9",  expr: "12x^3y^2 + 18x^2y^4" },
        { l: "10", expr: "2\\pi r^2 + 4\\pi rh" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-emerald-500/30 text-emerald-300 border border-emerald-400/40" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 2 ── Faktorisasi Pengelompokan ──────────────── */
const SoalDua = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Faktorkan bentuk-bentuk aljabar berikut menggunakan metode pengelompokan (grouping)!
    </p>
    <div className="space-y-2 pl-1">
      {[
        { l: "11", expr: "p(q - r) + s(q - r)" },
        { l: "12", expr: "3a(b + c) - c(b + c)" },
        { l: "13", expr: "4p(2p + 3) - q(2p + 3)" },
        { l: "14", expr: "2a(x - y) + b(y - x)" },
        { l: "15", expr: "5x(x - 3y) - 4(3y - x)" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-teal-500/5 border border-teal-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-teal-500/20 text-teal-300 border border-teal-400/30" />
          <span className="flex-1 overflow-x-auto"><AlgExpr math={expr} /></span>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 3 ── Selisih Dua Kuadrat ────────────────────── */
const SoalTiga = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Faktorkan bentuk selisih dua kuadrat berikut!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "1",  expr: "m^2 - n^2" },
        { l: "2",  expr: "p^2 - 9" },
        { l: "3",  expr: "(2x)^2 - 5^2" },
        { l: "4",  expr: "(5m)^2 - 4^2" },
        { l: "5",  expr: "x^2 - 49" },
        { l: "6",  expr: "y^2 - 36" },
        { l: "7",  expr: "4a^2 - 1" },
        { l: "8",  expr: "100 - p^2" },
        { l: "9",  expr: "16x^2 - 9y^2" },
        { l: "10", expr: "25m^2 - 4n^2" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 4 ── Trinomial a = 1 (1–10) ─────────────────── */
const SoalEmpat = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Faktorkan trinomial{" "}
      <AlgExpr math="ax^2 + bx + c" /> berikut, dengan{" "}
      <AlgExpr math="a = 1" />!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "1",  expr: "x^2 + 7x + 10" },
        { l: "2",  expr: "a^2 - 5a + 6" },
        { l: "3",  expr: "p^2 + 9p + 18" },
        { l: "4",  expr: "x^2 - 8x + 12" },
        { l: "5",  expr: "y^2 + 5y - 24" },
        { l: "6",  expr: "m^2 - 3m - 18" },
        { l: "7",  expr: "a^2 + 4a - 21" },
        { l: "8",  expr: "p^2 - 11p + 28" },
        { l: "9",  expr: "x^2 + 13x + 36" },
        { l: "10", expr: "y^2 - 10y - 24" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-violet-500/20 text-violet-300 border border-violet-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 5 ── Trinomial a = 1 (11–20) ────────────────── */
const SoalLima = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Lanjutkan faktorisasi trinomial{" "}
      <AlgExpr math="a = 1" />{" "}
      berikut, termasuk yang melibatkan dua variabel!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "11", expr: "p^2 + 2p - 63" },
        { l: "12", expr: "a^2 + a - 110" },
        { l: "13", expr: "25 + 10y + y^2" },
        { l: "14", expr: "49 - 14x + x^2" },
        { l: "15", expr: "x^2 - 6xy - 55y^2" },
        { l: "16", expr: "a^2 - 15ab + 50b^2" },
        { l: "17", expr: "x^2 + 8xy - 48y^2" },
        { l: "18", expr: "m^2 - 14mn + 40n^2" },
        { l: "19", expr: "p^2 + 16pq - 36q^2" },
        { l: "20", expr: "m^2 + 5mn - 84n^2" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30" />
          <span className="flex-1 overflow-x-auto"><AlgExpr math={expr} /></span>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 6 ── Trinomial a ≠ 1 (1–10) ─────────────────── */
const SoalEnam = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Faktorkan trinomial{" "}
      <AlgExpr math="ax^2 + bx + c" /> berikut, dengan{" "}
      <AlgExpr math="a \neq 1" />!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "1",  expr: "3x^2 + 8x + 5" },
        { l: "2",  expr: "4a^2 + 5a + 1" },
        { l: "3",  expr: "6p^2 + 17p + 5" },
        { l: "4",  expr: "5x^2 + 27x + 10" },
        { l: "5",  expr: "8y^2 + 22y + 9" },
        { l: "6",  expr: "4m^2 + 9m + 2" },
        { l: "7",  expr: "7a^2 + 15a + 2" },
        { l: "8",  expr: "9x^2 + 21x + 10" },
        { l: "9",  expr: "2a^2 - 7a + 3" },
        { l: "10", expr: "3p^2 - 10p + 8" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-amber-500/20 text-amber-300 border border-amber-400/30" />
          <AlgExpr math={expr} />
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 7 ── Trinomial a ≠ 1 (11–20) ────────────────── */
const SoalTujuh = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Lanjutkan faktorisasi trinomial dengan{" "}
      <AlgExpr math="a \neq 1" />{" "}
      berikut, termasuk yang berkoefisien negatif dan bervariabel dua!
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
      {[
        { l: "11", expr: "6x^2 + x - 12" },
        { l: "12", expr: "5a^2 + 3a - 14" },
        { l: "13", expr: "15y^2 - 26y + 8" },
        { l: "14", expr: "4 - 3m - 10m^2" },
        { l: "15", expr: "7 - 15n + 2n^2" },
        { l: "16", expr: "4a^2 + 14ab + 6b^2" },
        { l: "17", expr: "6p^2 - 17pq - 3q^2" },
        { l: "18", expr: "9m^2 - 12mn + 4n^2" },
        { l: "19", expr: "4x^2 + 20xy + 9y^2" },
        { l: "20", expr: "8a^2 + 14ab - 15b^2" },
      ].map(({ l, expr }) => (
        <div key={l} className="flex items-center gap-2.5 bg-orange-500/5 border border-orange-500/10 rounded-lg px-3 py-2">
          <SubLabel letter={l} color="bg-orange-500/20 text-orange-300 border border-orange-400/30" />
          <span className="flex-1 overflow-x-auto"><AlgExpr math={expr} /></span>
          <span className="ml-auto text-white/20 text-xs font-body shrink-0">= …</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Soal 8 ── Kontekstual ────────────────────────────── */
const SoalDelapan = () => (
  <div className="space-y-3">
    <p className="font-body text-sm text-white/90 leading-relaxed">
      Gunakan konsep faktorisasi untuk menyelesaikan soal-soal berikut!
    </p>
    <div className="space-y-3 pl-1">
      {/* 8a */}
      <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg px-4 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <SubLabel letter="a" color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Luas sebuah taman berbentuk persegi panjang dinyatakan oleh{" "}
            <AlgExpr math="L = x^2 + 9x + 20" />.
            Tentukan kemungkinan ekspresi panjang dan lebar taman tersebut!
          </p>
        </div>
      </div>
      {/* 8b */}
      <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg px-4 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <SubLabel letter="b" color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Sebuah kolam renang berbentuk persegi panjang memiliki luas{" "}
            <AlgExpr math="(2x^2 + 7x + 3)" /> m².
            Jika panjangnya <AlgExpr math="(2x + 1)" /> m,
            tentukan lebar kolam tersebut dalam bentuk aljabar!
          </p>
        </div>
      </div>
      {/* 8c */}
      <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg px-4 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <SubLabel letter="c" color="bg-rose-500/20 text-rose-300 border border-rose-400/30" />
          <p className="font-body text-sm text-white/85 leading-relaxed">
            Buktikan bahwa selisih kuadrat dua bilangan bulat berurutan selalu
            sama dengan jumlah kedua bilangan tersebut!
            (Petunjuk: gunakan <AlgExpr math="n" /> dan <AlgExpr math="n+1" />)
          </p>
        </div>
      </div>
    </div>
  </div>
);

/* ── Card config ──────────────────────────────────────── */
const cards = [
  {
    num: 1, tag: "GCF / Distributif", tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    gradient: "from-emerald-900/50 to-teal-900/30", border: "border-emerald-500/25",
    bar: "from-emerald-400 to-teal-500", numBg: "bg-emerald-500/30 text-emerald-200",
    custom: <SoalSatu />,
  },
  {
    num: 2, tag: "Pengelompokan", tagColor: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    gradient: "from-teal-900/40 to-cyan-900/25", border: "border-teal-500/25",
    bar: "from-teal-400 to-cyan-500", numBg: "bg-teal-500/30 text-teal-200",
    custom: <SoalDua />,
  },
  {
    num: 3, tag: "Selisih Dua Kuadrat", tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    gradient: "from-cyan-900/40 to-sky-900/25", border: "border-cyan-500/25",
    bar: "from-cyan-400 to-sky-500", numBg: "bg-cyan-500/30 text-cyan-200",
    custom: <SoalTiga />,
  },
  {
    num: 4, tag: "Trinomial  a = 1  (1–10)", tagColor: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    gradient: "from-violet-900/40 to-purple-900/25", border: "border-violet-500/25",
    bar: "from-violet-400 to-purple-500", numBg: "bg-violet-500/30 text-violet-200",
    custom: <SoalEmpat />,
  },
  {
    num: 5, tag: "Trinomial  a = 1  (11–20)", tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    gradient: "from-indigo-900/40 to-violet-900/25", border: "border-indigo-500/25",
    bar: "from-indigo-400 to-violet-500", numBg: "bg-indigo-500/30 text-indigo-200",
    custom: <SoalLima />,
  },
  {
    num: 6, tag: "Trinomial  a ≠ 1  (1–10)", tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    gradient: "from-amber-900/35 to-yellow-900/20", border: "border-amber-500/25",
    bar: "from-amber-400 to-yellow-500", numBg: "bg-amber-500/30 text-amber-200",
    custom: <SoalEnam />,
  },
  {
    num: 7, tag: "Trinomial  a ≠ 1  (11–20)", tagColor: "bg-orange-500/20 text-orange-300 border-orange-400/40",
    gradient: "from-orange-900/40 to-amber-900/25", border: "border-orange-500/25",
    bar: "from-orange-400 to-amber-500", numBg: "bg-orange-500/30 text-orange-200",
    custom: <SoalTujuh />,
  },
  {
    num: 8, tag: "Kontekstual", tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    gradient: "from-rose-900/40 to-pink-900/25", border: "border-rose-500/25",
    bar: "from-rose-400 to-pink-500", numBg: "bg-rose-500/30 text-rose-200",
    custom: <SoalDelapan />,
  },
];

/* ── Page ─────────────────────────────────────────────── */
const FaktorisasiAljabarPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-400/30 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">✂️</span>
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-white text-center mb-1 leading-tight"
            style={{ textShadow: '0 0 32px rgba(52,211,153,0.5)' }}
          >
            FAKTORISASI BENTUK ALJABAR
          </h1>
          <p className="text-white/40 text-xs text-center font-body mt-2">Kelas 7 · Aljabar · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-body">8 Soal Essay</span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 font-body">✦ Kelas 7</span>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <div
              key={c.num}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} backdrop-blur`} />
              <div className={`absolute inset-0 border ${c.border} rounded-2xl`} />
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${c.bar} rounded-l-2xl`} />

              <div className="relative px-5 py-4 pl-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-body shrink-0 ${c.numBg}`}>
                    {c.num}
                  </span>
                  <Tag label={c.tag} color={c.tagColor} />
                </div>
                <div className="pl-1">
                  {c.custom}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Back button ── */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/aljabar"); }}
            className="text-sm text-white/30 hover:text-emerald-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Aljabar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaktorisasiAljabarPage;
