import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { FunctionSquare } from "lucide-react";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Rumus Fungsi Linear – Evaluasi Dasar", {
    type: "mixed",
    content: "Suatu fungsi f didefinisikan oleh f: x → 5x − 3, dengan x anggota himpunan bilangan real.",
    parts: [
      { label: "a.", text: "Tuliskan rumus fungsi f dalam bentuk f(x)." },
      { label: "b.", math: "\\text{Hitung nilai fungsi } f \\text{ untuk } x = -4." },
    ],
  }),
  Qn(2, "Soal UN – Notasi dan Rumus Fungsi", {
    type: "mixed",
    content: "Fungsi f dinyatakan dengan f: x ↦ 3x − 7 dengan domain {−1, 0, 1, 2, 3}.",
    parts: [
      { label: "a.", text: "Tentukan range fungsi f." },
    ],
  }),
  Qn(3, "Substitusi ke Fungsi – ANBK Style", {
    type: "mixed",
    content: "Diketahui f(x) = 5x − 2 dan g(x) = x + 8.",
    parts: [
      { label: "a.", math: "f(3) + g(3) = \\ldots" },
      { label: "b.", math: "f(2) \\times g(1) = \\ldots" },
    ],
  }),
  Qn(4, "Menghitung Nilai Fungsi Kuadrat", {
    type: "mixed",
    mathContent: "g(x) = x^2 - 2x + 3",
    parts: [
      { label: "a.", math: "g(0) = \\ldots" },
      { label: "b.", math: "g(3) = \\ldots" },
      { label: "c.", math: "g(-2) = \\ldots" },
      { label: "d.", math: "g(1) = \\ldots" },
      { label: "e.", math: "g(a + 2) = \\ldots" },
    ],
  }),
  Qn(5, "Fungsi dengan Parameter", {
    type: "mixed",
    content: "Fungsi f(x) = kx − 4. Diketahui f(3) = 11.",
    parts: [
      { label: "a.", math: "\\text{Tentukan nilai } k" },
      { label: "b.", math: "\\text{Hitung } f(6)" },
    ],
  }),
  Qn(6, "Bayangan dan Nilai Balik Fungsi", {
    type: "mixed",
    content: "Fungsi f didefinisikan sebagai f(x) = 4x − 5.",
    parts: [
      { label: "a.", math: "\\text{Tentukan nilai } n \\text{ jika } f(n) = 7." },
      { label: "b.", math: "\\text{Tentukan nilai } m \\text{ jika } f(m) = -7." },
    ],
  }),
  Qn(7, "Mencari Domain dari Range yang Diketahui", {
    type: "mixed",
    content: "Diketahui f(x) = x − 2 dengan range = {1, 2, 3, 4, 5}.",
    parts: [
      { label: "a.", text: "Tentukan domain fungsi f." },
    ],
  }),
  Qn(8, "Fungsi f(x) = ax + b – Mencari a dan b", {
    type: "mixed",
    content: "Diketahui f: x → ax + b dengan f(2) = 7 dan f(5) = 13.",
    parts: [
      { label: "a.", text: "Buat sistem persamaan dari kondisi yang diberikan." },
      { label: "b.", text: "Selesaikan sistem persamaan untuk mendapatkan a dan b." },
      { label: "c.", math: "\\text{Tuliskan rumus lengkap fungsi } f(x) = \\ldots" },
    ],
  }),
  Qn(9, "Mencari Konstanta Fungsi dari Dua Kondisi", {
    type: "mixed",
    content: "Fungsi f didefinisikan f: x → ax + b, dengan a dan b bilangan bulat. Diketahui f(2) = 7 dan f(−3) = −8.",
    parts: [
      { label: "a.", text: "Tentukan nilai a dan b." },
      { label: "b.", text: "Tuliskan rumus fungsi f." },
      { label: "c.", math: "\\text{Hitung nilai fungsi } f \\text{ untuk } x = 5." },
    ],
  }),
  Qn(10, "Terapan Fungsi – Temperatur", {
    type: "mixed",
    content: "Konversi Celsius ke Fahrenheit:",
    mathContent: "F(C) = \\frac{9}{5}C + 32",
    parts: [
      { label: "a.", math: "F(0) = \\ldots ^\\circ F" },
      { label: "b.", math: "F(100) = \\ldots ^\\circ F" },
    ],
  }),
  Qn(11, "Fungsi dari Soal Cerita – TKA", {
    type: "mixed",
    content: "Upah seorang pekerja adalah f(h) = 25.000h + 50.000, di mana h adalah jam kerja per hari.",
    parts: [
      { label: "a.", math: "f(8) = \\ldots \\text{ (upah 8 jam)}" },
      { label: "b.", math: "\\text{Jika upah = Rp250.000,\\ berapa jam } h?" },
      { label: "c.", text: "Jelaskan arti 25.000 dan 50.000 dalam konteks soal." },
    ],
  }),
  Qn(12, "Terapan Fungsi – Soal Cerita", {
    type: "mixed",
    content: "Sebuah bus pariwisata mengangkut 12 penumpang dewasa dengan berat rata-rata x kg dan 1 bagasi tambahan seberat (5x + 300) kg. Fungsi total beban bus dinyatakan sebagai T(x) = 12x + (5x + 300).",
    parts: [
      { label: "a.", math: "\\text{Sederhanakan rumus } T(x)." },
      { label: "b.", math: "\\text{Hitung } T(65) \\text{ (dalam kg)}." },
      { label: "c.", text: "Jika kapasitas maksimum bus adalah 1.600 kg, apakah bus kelebihan beban? Jelaskan." },
    ],
  }),
  Qn(13, "Rumus Fungsi – Soal UN", {
    type: "mixed",
    content: "Fungsi f didefinisikan f(2x − 1) = 4x + 5.",
    parts: [
      { label: "a.", math: "\\text{Tentukan } f(x)." },
      { label: "b.", math: "f(2) = \\ldots" },
    ],
  }),
  Qn(14, "Rumus Fungsi dari Notasi Komposit", {
    type: "mixed",
    content: "Diketahui f(3x − 2) = 9x + 1.",
    parts: [
      { label: "a.", math: "\\text{Tentukan } f(x)." },
      { label: "b.", math: "f(1) + f(-2) = \\ldots" },
      { label: "c.", math: "\\text{Tentukan nilai } p \\text{ jika } f(p) = 34." },
    ],
  }),
];

const NotasiFungsiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <FunctionSquare className="w-7 h-7 text-sky-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            NOTASI DAN RUMUS FUNGSI
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Relasi dan Fungsi · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 14 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-2">📌 Notasi Fungsi</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sky-400 font-bold">Notasi: </span>
              <span className="text-white/60">f: A → B &nbsp;|&nbsp; f(x) = y &nbsp;|&nbsp; f: x ↦ ax + b</span>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sky-400 font-bold">Mencari nilai: </span>
              <span className="text-white/60">Substitusi nilai x ke rumus f(x)</span>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sky-400 font-bold">Mencari rumus: </span>
              <span className="text-white/60">Gunakan f(x) = ax + b dan dua kondisi yang diketahui</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.mathContent && (
                      <div className="mb-3 bg-sky-500/10 border border-sky-500/20 rounded-lg px-4 py-2 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotasiFungsiPage;
