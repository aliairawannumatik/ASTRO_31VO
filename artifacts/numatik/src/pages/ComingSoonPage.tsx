import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useEffect, useState } from "react";

const ComingSoonPage = () => {
  const navigate = useNavigate();
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "." : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      {/* Animated orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full border border-yellow-500/10 animate-spin" style={{ animationDuration: "20s" }} />
        <div className="absolute w-[350px] h-[350px] rounded-full border border-cyan-500/10 animate-spin" style={{ animationDuration: "14s", animationDirection: "reverse" }} />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-purple-500/10 animate-spin" style={{ animationDuration: "8s" }} />
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${4 + (i % 3) * 3}px`,
            height: `${4 + (i % 3) * 3}px`,
            background: i % 3 === 0
              ? "rgba(234,179,8,0.6)"
              : i % 3 === 1
                ? "rgba(34,211,238,0.5)"
                : "rgba(168,85,247,0.5)",
            top: `${10 + i * 10}%`,
            left: `${5 + i * 12}%`,
            animation: `floatParticle ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.6}s`,
            boxShadow: i % 3 === 0
              ? "0 0 8px rgba(234,179,8,0.8)"
              : i % 3 === 1
                ? "0 0 8px rgba(34,211,238,0.8)"
                : "0 0 8px rgba(168,85,247,0.8)",
          }}
        />
      ))}

      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gearSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gearSpinReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #eab308, #fde68a, #eab308, #fbbf24, #eab308);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .gear-spin { animation: gearSpin 6s linear infinite; }
        .gear-spin-reverse { animation: gearSpinReverse 4s linear infinite; }
      `}</style>

      <div className="relative z-10 max-w-lg w-full px-6 text-center">

        {/* Logo */}
        <div className="relative flex justify-center mb-6">
          <div className="absolute w-36 h-36 rounded-full bg-yellow-500/10 blur-2xl animate-pulse" />
          <img
            src="/logo-numatik.png"
            alt="NUMATIK"
            className="relative w-28 h-28 object-contain drop-shadow-[0_0_24px_rgba(234,179,8,0.6)] animate-float-slow"
          />
        </div>

        {/* Gear icons as decoration */}
        <div className="flex justify-center items-center gap-3 mb-5">
          <svg className="w-8 h-8 text-yellow-500/60 gear-spin" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.73-.07-1.08l2.32-1.82c.21-.16.26-.44.13-.67l-2.2-3.82c-.13-.23-.41-.3-.64-.23l-2.73 1.1c-.57-.44-1.18-.8-1.86-1.08l-.41-2.9c-.04-.25-.26-.43-.52-.43H9.52c-.26 0-.47.18-.52.43l-.41 2.9c-.68.28-1.29.64-1.86 1.08L3.99 5.98c-.23-.07-.51 0-.64.23L1.15 10.03c-.13.23-.07.51.13.67l2.32 1.82c-.04.34-.07.68-.07 1.08s.03.73.07 1.08L1.28 16.5c-.21.16-.26.44-.13.67l2.2 3.82c.13.23.41.3.64.23l2.73-1.1c.57.44 1.18.8 1.86 1.08l.41 2.9c.05.25.26.43.52.43h4.4c.26 0 .47-.18.52-.43l.41-2.9c.68-.28 1.29-.64 1.86-1.08l2.73 1.1c.23.07.51 0 .64-.23l2.2-3.82c.13-.23.07-.51-.13-.67l-2.32-1.82z"/>
          </svg>
          <svg className="w-5 h-5 text-cyan-500/50 gear-spin-reverse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.73-.07-1.08l2.32-1.82c.21-.16.26-.44.13-.67l-2.2-3.82c-.13-.23-.41-.3-.64-.23l-2.73 1.1c-.57-.44-1.18-.8-1.86-1.08l-.41-2.9c-.04-.25-.26-.43-.52-.43H9.52c-.26 0-.47.18-.52.43l-.41 2.9c-.68.28-1.29.64-1.86 1.08L3.99 5.98c-.23-.07-.51 0-.64.23L1.15 10.03c-.13.23-.07.51.13.67l2.32 1.82c-.04.34-.07.68-.07 1.08s.03.73.07 1.08L1.28 16.5c-.21.16-.26.44-.13.67l2.2 3.82c.13.23.41.3.64.23l2.73-1.1c.57.44 1.18.8 1.86 1.08l.41 2.9c.05.25.26.43.52.43h4.4c.26 0 .47-.18.52-.43l.41-2.9c.68-.28 1.29-.64 1.86-1.08l2.73 1.1c.23.07.51 0 .64-.23l2.2-3.82c.13-.23.07-.51-.13-.67l-2.32-1.82z"/>
          </svg>
          <svg className="w-6 h-6 text-purple-500/50 gear-spin" style={{ animationDuration: "8s" }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.73-.07-1.08l2.32-1.82c.21-.16.26-.44.13-.67l-2.2-3.82c-.13-.23-.41-.3-.64-.23l-2.73 1.1c-.57-.44-1.18-.8-1.86-1.08l-.41-2.9c-.04-.25-.26-.43-.52-.43H9.52c-.26 0-.47.18-.52.43l-.41 2.9c-.68.28-1.29.64-1.86 1.08L3.99 5.98c-.23-.07-.51 0-.64.23L1.15 10.03c-.13.23-.07.51.13.67l2.32 1.82c-.04.34-.07.68-.07 1.08s.03.73.07 1.08L1.28 16.5c-.21.16-.26.44-.13.67l2.2 3.82c.13.23.41.3.64.23l2.73-1.1c.57.44 1.18.8 1.86 1.08l.41 2.9c.05.25.26.43.52.43h4.4c.26 0 .47-.18.52-.43l.41-2.9c.68-.28 1.29-.64 1.86-1.08l2.73 1.1c.23.07.51 0 .64-.23l2.2-3.82c.13-.23.07-.51-.13-.67l-2.32-1.82z"/>
          </svg>
        </div>

        {/* Main headline */}
        <h1 className="font-display text-2xl md:text-3xl font-black mb-3 shimmer-text leading-tight">
          "Sesuatu yang hebat sedang diracik!"
        </h1>

        {/* Divider line */}
        <div className="flex items-center gap-3 mb-5 px-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          <span className="text-yellow-500/70 text-xs">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
        </div>

        {/* Description card */}
        <div className="bg-card/60 backdrop-blur-md border border-yellow-500/20 rounded-2xl p-6 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.08)]">
          <p className="font-body text-white/85 text-sm md:text-base leading-relaxed">
            Kami sedang membangun fitur baru untuk membantumu belajar matematika dengan lebih seru.
          </p>
          <p className="font-body text-white/70 text-sm md:text-base leading-relaxed mt-2">
            Tunggu kehadirannya sahabat <strong className="text-yellow-400">NUMATIK</strong> &gt;_&lt;
          </p>
        </div>

        {/* Animated status bar */}
        <div className="bg-card/40 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-xs text-white/50">Status Pengembangan</span>
            <span className="font-mono text-xs text-yellow-400">IN PROGRESS{dots}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300"
              style={{
                width: "65%",
                boxShadow: "0 0 12px rgba(234,179,8,0.6)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-white/30 font-body">0%</span>
            <span className="text-xs text-yellow-400/70 font-body">65%</span>
            <span className="text-xs text-white/30 font-body">100%</span>
          </div>
        </div>

        {/* Fun badges */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {["🚀 Sedang Dibangun", "✨ Akan Segera Hadir", "🎯 Untuk Kamu!"].map((badge) => (
            <span
              key={badge}
              className="font-body text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => { playPopSound(); navigate(-1); }}
          className="font-display text-sm px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-600/80 to-amber-500/80
            hover:from-yellow-500 hover:to-amber-400 text-black font-bold transition-all duration-300
            border border-yellow-400/40 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]
            cursor-pointer"
        >
          ← Kembali
        </button>
      </div>
    </div>
  );
};

export default ComingSoonPage;
