import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronRight, BarChart2, TrendingUp, PenLine, GitBranch, Globe } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const subtopics = [
  {
    label: "GRAFIK PERSAMAAN GARIS LURUS",
    path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus/grafik",
    icon: BarChart2,
    color: "#f472b6",
    desc: "Titik potong sumbu, tabel nilai, sketsa grafik",
    soal: 15,
  },
  {
    label: "GRADIEN (KEMIRINGAN GARIS)",
    path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus/gradien",
    icon: TrendingUp,
    color: "#60a5fa",
    desc: "Gradien dari 2 titik, persamaan, dan grafik",
    soal: 23,
  },
  {
    label: "HUBUNGAN 2 GARIS",
    path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus/hubungan-2-garis",
    icon: GitBranch,
    color: "#fb923c",
    desc: "Sejajar, tegak lurus, dan berpotongan",
    soal: 7,
  },
  {
    label: "MENENTUKAN PERSAMAAN GARIS LURUS",
    path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus/menentukan-pgl",
    icon: PenLine,
    color: "#34d399",
    desc: "Bentuk y = mx + c, melalui titik dan gradien",
    soal: 15,
  },
  {
    label: "APLIKASI PERSAMAAN GARIS PADA SOAL KONTEKSTUAL",
    path: "/latihan-mandiri/kelas-8/persamaan-garis-lurus/aplikasi-kontekstual",
    icon: Globe,
    color: "#a78bfa",
    desc: "Biaya, kecepatan, grafik kehidupan nyata",
    soal: 15,
  },
];

const PersamaanGarisLurusPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERSAMAAN GARIS LURUS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · {t('practice.breadcrumb')} · 5 {t('practice.suffixSubTopik')} · 75 {t('practice.suffixSoalTotal')}</p>

        <div className="flex flex-col gap-3 animate-slide-up">
          {subtopics.map((sub, i) => {
            const Icon = sub.icon;
            return (
              <button
                key={sub.label}
                onClick={() => { playPopSound(); navigate(sub.path); }}
                className="group flex items-center gap-4 backdrop-blur border rounded-xl px-5 py-4
                  transition-all duration-300 cursor-pointer text-left animate-slide-up"
                style={{
                  background: `${sub.color}0a`,
                  borderColor: `${sub.color}33`,
                  boxShadow: `0 0 0 0 ${sub.color}00`,
                  animationDelay: `${i * 0.04}s`,
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 16px ${sub.color}22`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 0 ${sub.color}00`)}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${sub.color}18`, border: `1.5px solid ${sub.color}44` }}>
                  <Icon className="w-5 h-5" style={{ color: sub.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white font-semibold leading-tight">{sub.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: `${sub.color}bb` }}>{sub.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${sub.color}22`, color: sub.color, border: `1px solid ${sub.color}44` }}>
                    {sub.soal} {t('practice.suffixSoal')}
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: sub.color }} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backToGrade8')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersamaanGarisLurusPage;
