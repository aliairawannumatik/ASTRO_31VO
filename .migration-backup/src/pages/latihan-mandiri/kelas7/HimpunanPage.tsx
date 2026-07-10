import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { Info, List, CircleDot, GitBranch, Combine, ChevronRight } from "lucide-react";

const subtopics = [
  { label: "PENGERTIAN DAN KEANGGOTAAAN SUATU HIMPUNAN", path: "/latihan-mandiri/kelas-7/himpunan/pengertian-keanggotaan", soal: 15, icon: Info, gradient: "from-blue-900/40 to-indigo-900/30", border: "border-blue-500/30", badge: "bg-blue-500/20 text-blue-300 border-blue-400/40", iconBg: "bg-blue-500/20", iconColor: "text-blue-400", leftBar: "from-blue-400 to-indigo-500", desc: "Definisi himpunan, anggota (∈), bukan anggota (∉), kardinalitas n(A)" },
  { label: "MENYATAKAN SUATU HIMPUNAN, HIMPUNAN KOSONG DAN HIMPUNAN SEMESTA", path: "/latihan-mandiri/kelas-7/himpunan/menyatakan-himpunan", soal: 15, icon: List, gradient: "from-violet-900/40 to-purple-900/30", border: "border-violet-500/30", badge: "bg-violet-500/20 text-violet-300 border-violet-400/40", iconBg: "bg-violet-500/20", iconColor: "text-violet-400", leftBar: "from-violet-400 to-purple-500", desc: "Notasi pembentuk himpunan, mendaftar anggota, himpunan kosong (∅), semesta (S)" },
  { label: "DIAGRAM VENN", path: "/latihan-mandiri/kelas-7/himpunan/diagram-venn", soal: 15, icon: CircleDot, gradient: "from-emerald-900/40 to-teal-900/30", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40", iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400", leftBar: "from-emerald-400 to-teal-500", desc: "Membaca dan membuat diagram Venn, menentukan anggota dari diagram Venn" },
  { label: "HIMPUNAN BAGIAN", path: "/latihan-mandiri/kelas-7/himpunan/himpunan-bagian", soal: 15, icon: GitBranch, gradient: "from-orange-900/40 to-amber-900/30", border: "border-orange-500/30", badge: "bg-orange-500/20 text-orange-300 border-orange-400/40", iconBg: "bg-orange-500/20", iconColor: "text-orange-400", leftBar: "from-orange-400 to-amber-500", desc: "Notasi ⊂ dan ⊄, menentukan himpunan bagian, banyak himpunan bagian = 2ⁿ" },
  { label: "OPERASI HIMPUNAN", path: "/latihan-mandiri/kelas-7/himpunan/operasi-himpunan", soal: 15, icon: Combine, gradient: "from-rose-900/40 to-pink-900/30", border: "border-rose-500/30", badge: "bg-rose-500/20 text-rose-300 border-rose-400/40", iconBg: "bg-rose-500/20", iconColor: "text-rose-400", leftBar: "from-rose-400 to-pink-500", desc: "Irisan (∩), gabungan (∪), selisih (−), komplemen (Aᶜ), soal cerita himpunan" },
];

const HimpunanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🔵</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-blue-300 text-center mb-1" style={{ textShadow: '0 0 24px rgba(96,165,250,0.7)' }}>HIMPUNAN</h1>
          <p className="text-white/50 text-xs text-center font-body mb-1">Kelas 7 · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2 mt-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white/70 text-xs font-body">75 {t('practice.suffixSoalTotal')} · UN / TKA / ANBK</span>
            <span className="text-yellow-400 text-sm">⭐</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {subtopics.map((s, i) => {
            const Icon = s.icon;
            return (
              <button key={s.label} onClick={() => { playPopSound(); navigate(s.path); }}
                className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.01] animate-slide-up"
                style={{ animationDelay: `${i * 0.07}s` }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} backdrop-blur`} />
                <div className={`absolute inset-0 border ${s.border} rounded-2xl group-hover:border-opacity-60 transition-colors`} />
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${s.leftBar} rounded-l-2xl`} />
                <div className="relative px-5 py-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${s.iconBg} border ${s.border} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${s.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-display text-sm font-bold text-white block mb-1">{s.label}</span>
                    <p className="text-white/40 text-xs font-body">{s.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${s.badge}`}>{s.soal} {t('practice.suffixSoal')}</span>
                    <ChevronRight className={`w-4 h-4 ${s.iconColor} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">{t('practice.enrichmentNote')}</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">Soal himpunan dari konsep keanggotaan, diagram Venn, hingga operasi himpunan dan soal cerita HOTS sesuai kisi-kisi UN, TKA, dan ANBK.</p>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7"); }} className="text-sm text-muted-foreground hover:text-blue-400 transition-colors cursor-pointer font-body">{t('practice.backToGrade7')}</button>
        </div>
      </div>
    </div>
  );
};
export default HimpunanPage;
