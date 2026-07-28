import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { Circle } from "lucide-react";

type SubPart = { label: string; img: string; alt: string };

const KaitanBangunDatarPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.lingkaran.kaitanBangunDatar';

  const parts: SubPart[] = [
    { label: "a.", img: "/soal-kaitan-k.png", alt: t(`${p}.a`) },
    { label: "b.", img: "/soal-kaitan-j.png", alt: t(`${p}.b`) },
    { label: "c.", img: "/soal-kaitan-i.png", alt: t(`${p}.c`) },
    { label: "d.", img: "/soal-kaitan-h.png", alt: t(`${p}.d`) },
    { label: "e.", img: "/soal-kaitan-g.png", alt: t(`${p}.e`) },
    { label: "f.", img: "/soal-kaitan-f.png", alt: t(`${p}.f`) },
    { label: "g.", img: "/soal-kaitan-e.png", alt: t(`${p}.g`) },
    { label: "h.", img: "/soal-kaitan-d.png", alt: t(`${p}.h`) },
    { label: "i.", img: "/soal-kaitan-c.png", alt: t(`${p}.i`) },
    { label: "j.", img: "/soal-kaitan-b.png", alt: t(`${p}.j`) },
    { label: "k.", img: "/soal-kaitan-a.png", alt: t(`${p}.k`) },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            {t(`${p}.h1`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 1 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
          <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl" />
          <div className="relative px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                <span className="text-violet-300 text-xs font-bold">1</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-3">
                  {t(`${p}.questionTitle`)}
                </span>
                <p className="font-body text-sm text-white/90 leading-relaxed mb-4">
                  {t(`${p}.content`)}
                </p>
                <div className="flex flex-col gap-5">
                  {parts.map((pt) => (
                    <div key={pt.label} className="bg-white/5 rounded-xl p-3">
                      <span className="text-violet-300 text-xs font-bold mb-3 block">{pt.label}</span>
                      <div className="flex justify-center bg-white/95 rounded-lg p-3 [@media(orientation:landscape)]:w-fit [@media(orientation:landscape)]:mx-auto">
                        <img
                          src={pt.img}
                          alt={pt.alt}
                          className="max-w-xs [@media(orientation:landscape)]:max-w-[180px] w-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} {t(`${p}.backTo`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KaitanBangunDatarPage;
