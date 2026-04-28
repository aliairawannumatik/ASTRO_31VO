import { useNavigate, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Hash } from "lucide-react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { rppCatalog } from "@/data/rpp";

const RPPMateriDynamicPage = () => {
  const navigate = useNavigate();
  const { materiSlug } = useParams<{ materiSlug: string }>();
  const materi = materiSlug ? rppCatalog[materiSlug] : undefined;

  if (!materi) return <Navigate to="/ruang-untuk-guru/rpp" replace />;

  const Icon = materi.icon;
  const theme = materi.theme;

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru/rpp" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div
            className={`inline-flex items-center gap-2 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} px-4 py-2 text-xs font-semibold ${theme.badgeText} mb-4`}
          >
            <Hash className="w-4 h-4" />
            RPP - {materi.shortTitle}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan leading-tight">
            RPP - {materi.title.toUpperCase()}
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">
            {materi.intro}
          </p>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {materi.subMateri.map((sub, i) => {
            const SubIcon = sub.icon;
            return (
              <button
                key={sub.slug}
                onClick={() => {
                  playPopSound();
                  navigate(`/ruang-untuk-guru/rpp/${materi.slug}/${sub.slug}`);
                }}
                className={`group relative bg-gradient-to-br ${theme.cardColor} backdrop-blur border ${theme.cardBorder} rounded-2xl p-5 text-left animate-slide-up hover:border-primary/60 transition-all duration-300 cursor-pointer`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-10 h-10 rounded-xl ${theme.cardIconBg} flex items-center justify-center mb-3`}>
                  <SubIcon className={`w-5 h-5 ${theme.cardText}`} />
                </div>
                <h3 className={`font-display text-base md:text-lg font-bold ${theme.cardText} mb-1`}>
                  {sub.title}
                </h3>
                <p className="text-xs text-white/75 font-body leading-relaxed">{sub.desc}</p>
                <div className="absolute top-4 right-4 text-[10px] uppercase tracking-wider text-white/60 font-semibold">
                  {sub.model === "PBL" ? "PBL" : "Discovery"}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => {
              playPopSound();
              navigate("/ruang-untuk-guru/rpp");
            }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar RPP
          </button>
        </div>
      </div>
    </div>
  );
};

export default RPPMateriDynamicPage;
