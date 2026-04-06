import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import ExitDialog from "./ExitDialog";
import { playPopSound } from "@/hooks/useAudio";

const QuizNavigation = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default QuizNavigation;
