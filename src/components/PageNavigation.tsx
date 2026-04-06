import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import ExitDialog from "./ExitDialog";
import { playPopSound } from "@/hooks/useAudio";

interface PageNavigationProps {
  prevPath?: string;
  nextPath?: string;
}

const PageNavigation = ({ prevPath, nextPath }: PageNavigationProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Bottom-left: Back / Next — respects device safe area */}
      <div
        className="fixed left-0 bottom-0 z-50 flex gap-2 p-4"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <button
          onClick={() => { playPopSound(); prevPath ? navigate(prevPath) : navigate(-1); }}
          className="w-11 h-11 rounded-full bg-card/80 backdrop-blur border border-border 
            flex items-center justify-center text-primary hover:border-primary/60 
            hover:box-glow-cyan transition-all duration-300 cursor-pointer"
          title="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {nextPath && (
          <button
            onClick={() => { playPopSound(); navigate(nextPath); }}
            className="w-11 h-11 rounded-full bg-card/80 backdrop-blur border border-border 
              flex items-center justify-center text-primary hover:border-primary/60 
              hover:box-glow-cyan transition-all duration-300 cursor-pointer"
            title="Halaman berikutnya"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Top-right: Exit on top, Home below — respects device safe area */}
      <div
        className="fixed right-0 top-0 z-50 flex flex-col gap-2 p-4"
        style={{
          paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
          paddingTop: "max(1rem, env(safe-area-inset-top, 0px))",
        }}
      >
        <ExitDialog />
        <button
          onClick={() => { playPopSound(); navigate("/menu"); }}
          className="w-11 h-11 rounded-full bg-card/80 backdrop-blur border border-border 
            flex items-center justify-center text-primary hover:border-primary/60 
            hover:box-glow-cyan transition-all duration-300 cursor-pointer"
          title="Menu Utama"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default PageNavigation;
