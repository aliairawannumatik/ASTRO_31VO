import { useEffect, useRef } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import kepalaSekolahImg from "@assets/image_1777175755334.png";

const TentangAplikasiPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animation: `shootingStar ${3 + Math.random() * 3}s linear infinite`,
              animationDelay: `${i * 2}s`,
              boxShadow: '0 0 10px 2px rgba(34, 211, 238, 0.6)'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(300px) translateY(300px); opacity: 0; }
        }
      `}</style>

      <PageNavigation />

      <div className="relative z-10 max-w-4xl w-full px-4 py-10">
        {/* Ucapan Terima Kasih kepada Kepala Sekolah */}
        <div className="mb-8 animate-slide-up">
          <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-[0_0_40px_rgba(251,191,36,0.25)]">
            <div className="rounded-2xl bg-[#0d0d2b]/95 backdrop-blur p-6 md:p-8">
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="text-2xl">🌹</span>
                <h2 className="font-display text-base md:text-lg font-black tracking-widest uppercase bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                  Ucapan Terima Kasih
                </h2>
                <span className="text-2xl">🌹</span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-30 blur-xl animate-pulse" />
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.4)]">
                    <img
                      src={kepalaSekolahImg}
                      alt="Dr. Hj. Yuli Nurhayati, S.Pd., M.Pd"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <p className="font-body text-xs md:text-sm text-amber-200/80 mb-1 italic">
                    Dengan penuh hormat dan apresiasi yang tulus kepada
                  </p>
                  <p className="font-display text-lg md:text-xl font-black text-amber-300 mb-1 leading-tight">
                    Dr. Hj. Yuli Nurhayati, S.Pd., M.Pd.
                  </p>
                  <p className="font-body text-xs md:text-sm text-amber-100/90 mb-4 italic">
                    Kepala SMP Negeri 28 Bandung
                  </p>
                  <p className="font-body text-sm md:text-base text-white/90 leading-relaxed text-justify">
                    Terima kasih yang tak terhingga atas <strong className="text-amber-300">motivasi</strong>, <strong className="text-amber-300">bimbingan</strong>, dan <strong className="text-amber-300">masukan-masukan berharga</strong> yang telah diberikan, sehingga kami terus terdorong untuk berkarya dan menghadirkan aplikasi <strong className="text-yellow-300">NUMATIK</strong> ini bagi dunia pendidikan. Semoga setiap langkah kebaikan dan dedikasi Ibu menjadi inspirasi serta menuai keberkahan yang melimpah.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-amber-400/20 text-center">
                <p className="font-body text-xs text-amber-200/70 italic">
                  "Pendidikan adalah senjata paling ampuh untuk mengubah dunia."
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8 animate-scale-in">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-20 blur-2xl animate-pulse" />
            <img
              src="/logo-numatik.png"
              alt="NUMATIK Logo"
              className="relative w-32 h-32 mx-auto object-contain opacity-90 hover:opacity-100 transition-opacity drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]"
            />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-primary text-glow-cyan mb-2">
            NUMATIK
          </h1>
          <p className="text-accent font-body text-sm">
            Numerasi Aktif dengan Teknologi Informasi dan Komunikasi
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 md:p-8 mb-6 animate-slide-up">
          <div className="space-y-4">
            <p className="text-white font-body text-sm md:text-base leading-relaxed text-justify">
              <strong className="text-primary">Numatik</strong> adalah aplikasi edukasi matematika yang dirancang khusus untuk menjembatani tantangan belajar di era digital. Lahir dari semangat untuk menghadirkan pembelajaran yang tidak hanya informatif, tetapi juga <strong className="text-accent">bermakna dan menyenangkan</strong>.
            </p>
            <p className="text-white/90 font-body text-sm md:text-base leading-relaxed text-justify">
              Diluncurkan pertama kali pada tahun <strong className="text-primary">2026</strong>, Numatik dikembangkan sepenuhnya selaras dengan <strong className="text-accent">Kurikulum Merdeka</strong>. Aplikasi ini mengintegrasikan pendekatan <strong className="text-secondary">Deep Learning</strong> untuk memastikan siswa tidak sekadar menghafal rumus, melainkan memahami konsep secara mendalam, kritis, dan kontekstual.
            </p>
            <p className="text-white/80 font-body text-sm md:text-base leading-relaxed text-justify">
              Numatik dipersiapkan untuk menjadi sahabat belajar bagi seluruh siswa SMP di pelosok Nusantara.
            </p>
          </div>
        </div>

        <div className="animate-slide-up mb-6" style={{ animationDelay: '0.35s' }}>
          <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_30px_rgba(0,200,255,0.2)]">
            <div className="rounded-2xl bg-[#0d0d2b] px-6 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="flex-1">
                <p className="font-display text-xs font-bold tracking-widest uppercase text-cyan-400 mb-0.5">Versi Aplikasi</p>
                <p className="font-display text-lg font-black text-white">
                  NUMATIK <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">v1.1</span>
                </p>
                <p className="text-white/50 font-body text-xs mt-0.5">Pembaruan konten, fitur, dan tampilan antarmuka</p>
              </div>
              <div className="shrink-0">
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-display tracking-wide">
                  TERBARU
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2 animate-slide-up" style={{ animationDelay: '0.40s' }}>
          <p className="text-white/40 font-body text-xs">
            Edisi Perdana · © 2026 NUMATIK. All rights reserved.
          </p>
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/menu"); }}
          className="mt-6 block mx-auto text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
        >
          ← Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default TentangAplikasiPage;
