import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";

const BiografiPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-2xl w-full px-4 text-center">
        <User className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-4">
          BIOGRAFI PEMBUAT
        </h1>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-8 space-y-4">
          {/* Photo */}
          <div className="flex justify-center mb-4">
            <img
              src="/biografi.png"
              alt="Irawan Sutiawan, M.Pd"
              className="w-32 h-40 sm:w-40 sm:h-48 object-cover rounded-xl border-2 border-primary/40 shadow-lg" />

          </div>

          <div className="space-y-3 text-left">
            <div>
              <p className="text-primary font-display text-xs mb-1">NAMA</p>
              <p className="text-white font-body text-sm">Irawan Sutiawan, M.Pd</p>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">INSTITUSI</p>
              <p className="text-white font-body text-sm">SMPN 28 Bandung</p>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">MATA PELAJARAN</p>
              <p className="text-white font-body text-sm">Matematika</p>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">Follow My Medsos :</p>
              <div className="space-y-2 mt-2">
                <p className="font-body text-sm text-white">
                  Instagram : @irawansutiawan.one
                </p>
                <p className="font-body text-sm text-white">
                  Youtube : @Pojok_Matematika
                </p>
                <p className="font-body text-sm text-white">
                  Tiktok : Pojok_Matematika
                </p>
              </div>
            </div>
            <div>
              <p className="text-primary font-display text-xs mb-1">KRITIK & SARAN</p>
              <p className="font-body text-sm text-accent">Email: numatik.app@gmail.com</p>
              <p className="text-white/60 font-body text-xs mt-1">Kirim kritik dan saran untuk pengembangan aplikasi ini ya.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {playPopSound();navigate("/menu");}}
          className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">

          ← Kembali ke Menu
        </button>
      </div>
    </div>);

};

export default BiografiPage;