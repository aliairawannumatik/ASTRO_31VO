import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Heart, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";

const DonasiPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-2xl w-full px-4 text-center">
        <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-4">
          DONASI
        </h1>
        <p className="text-white/70 text-sm font-body mb-8">
          Ayo dukung agar aplikasinya lebih berkembang
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-8 space-y-6">
          <p className="text-white font-body text-sm">
            Dukungan Anda sangat berarti untuk pengembangan aplikasi NUMATIK agar semakin bermanfaat bagi siswa-siswi di seluruh Indonesia. 💙
          </p>

          {/* Bank Account Info */}
          <div className="bg-muted/50 border border-primary/30 rounded-xl p-6 box-glow-cyan">
            <CreditCard className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-primary font-display text-xs mb-2">REKENING DONASI</p>
            <p className="text-white font-display text-lg font-bold tracking-wider mb-1">BCA</p>
            <p className="text-accent font-display text-2xl font-black tracking-widest mb-2">2332637666</p>
            <p className="text-white/80 font-body text-sm">a.n. Irawan Sutiawan</p>
          </div>

          <p className="text-white/60 font-body text-xs">
            Terima kasih atas dukungannya! 🙏
          </p>
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/menu"); }}
          className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
        >
          ← Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default DonasiPage;
