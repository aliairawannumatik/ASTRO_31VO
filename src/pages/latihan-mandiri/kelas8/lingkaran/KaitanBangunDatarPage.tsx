import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { Circle } from "lucide-react";

type SubPart = { label: string; img: string; alt: string };

const parts: SubPart[] = [
  { label: "a.", img: "/soal-kaitan-k.png", alt: "Persegi panjang 28×14 cm dengan dua setengah lingkaran terpotong di sisi kiri dan kanan" },
  { label: "b.", img: "/soal-kaitan-j.png", alt: "Seperempat lingkaran, jari-jari 10 cm" },
  { label: "c.", img: "/soal-kaitan-i.png", alt: "Persegi 14×14 cm dengan dua seperempat lingkaran di sudut" },
  { label: "d.", img: "/soal-kaitan-h.png", alt: "Persegi panjang 21×21 cm dengan setengah lingkaran di ujung kanan" },
  { label: "e.", img: "/soal-kaitan-g.png", alt: "Setengah lingkaran dan lingkaran penuh, jari-jari 10 cm" },
  { label: "f.", img: "/soal-kaitan-f.png", alt: "Persegi 14×14 cm dengan bintang empat sudut yang diarsir" },
  { label: "g.", img: "/soal-kaitan-e.png", alt: "Persegi panjang 28×14 cm dengan setengah lingkaran besar dan dua setengah lingkaran kecil" },
  { label: "h.", img: "/soal-kaitan-d.png", alt: "Persegi 7×7 cm dengan irisan dua lingkaran (daun) yang diarsir" },
  { label: "i.", img: "/soal-kaitan-c.png", alt: "Persegi 14×14 cm dengan empat daun yang diarsir" },
  { label: "j.", img: "/soal-kaitan-b.png", alt: "Dua setengah lingkaran, diameter 26 cm dan 14 cm" },
  { label: "k.", img: "/soal-kaitan-a.png", alt: "Lingkaran dengan jari-jari 10 cm dan tembereng yang diarsir" },
];

const KaitanBangunDatarPage = () => {
  const navigate = useNavigate();

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
            KAITAN LINGKARAN DENGAN BANGUN DATAR
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 1 Soal</span>
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
                  Daerah yang Diarsir
                </span>
                <p className="font-body text-sm text-white/90 leading-relaxed mb-4">
                  Tentukanlah keliling dan luas daerah yang diarsir pada gambar berikut.
                </p>
                <div className="flex flex-col gap-5">
                  {parts.map((p) => (
                    <div key={p.label} className="bg-white/5 rounded-xl p-3">
                      <span className="text-violet-300 text-xs font-bold mb-3 block">{p.label}</span>
                      <div className="flex justify-center bg-white/95 rounded-lg p-3 [@media(orientation:landscape)]:w-fit [@media(orientation:landscape)]:mx-auto">
                        <img
                          src={p.img}
                          alt={p.alt}
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
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default KaitanBangunDatarPage;
