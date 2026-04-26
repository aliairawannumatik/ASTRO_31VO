import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lightbulb,
  ListOrdered,
  Sparkles,
  Target,
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

const renderWithLatex = (text: string): ReactNode => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const renderMultiline = (text: string): ReactNode => (
  <div className="space-y-1">
    {text.split("\n").map((line, i) => (
      <div key={i}>{line.trim() === "" ? <span className="block h-1" /> : renderWithLatex(line)}</div>
    ))}
  </div>
);

export interface Pembahasan {
  jawaban: string;
  konsepTrik: string;
  stepByStep: string;
  tips: string;
  kesimpulan: string;
}

interface Props {
  pembahasanKey: string;
  pembahasan: Pembahasan;
}

const PembahasanCard = ({ pembahasan }: Props) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    playPopSound();
    setOpen((v) => !v);
  };

  return (
    <div className="mt-3">
      <button
        onClick={toggle}
        className="flex items-center gap-2 text-xs font-display font-bold text-primary hover:text-cyan-300 transition-colors cursor-pointer px-3 py-2 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20"
      >
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {open ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
      </button>

      {open && (
        <div className="mt-3 animate-slide-up space-y-2.5">
          {/* JAWABAN — emerald */}
          <div
            className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                Jawaban
              </span>
            </div>
            <div className="font-body text-sm text-emerald-50 font-bold leading-relaxed">
              {renderWithLatex(pembahasan.jawaban)}
            </div>
          </div>

          {/* KONSEP & TRIK — violet */}
          <div
            className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.16) 0%, rgba(124,58,237,0.10) 100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb className="w-4 h-4 text-violet-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300">
                Konsep & Trik
              </span>
            </div>
            <div className="font-body text-xs text-violet-50/90 leading-relaxed">
              {renderMultiline(pembahasan.konsepTrik)}
            </div>
          </div>

          {/* STEP BY STEP — cyan/blue */}
          <div
            className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(59,130,246,0.10) 100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <ListOrdered className="w-4 h-4 text-cyan-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                Step by Step Penyelesaian
              </span>
            </div>
            <div className="font-body text-xs text-cyan-50/90 leading-relaxed">
              {renderMultiline(pembahasan.stepByStep)}
            </div>
          </div>

          {/* TIPS — amber */}
          <div
            className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(251,191,36,0.14) 0%, rgba(245,158,11,0.10) 100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Tips
              </span>
            </div>
            <div className="font-body text-xs text-amber-50/90 leading-relaxed">
              {renderMultiline(pembahasan.tips)}
            </div>
          </div>

          {/* KESIMPULAN — rose/pink */}
          <div
            className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(244,63,94,0.14) 0%, rgba(236,72,153,0.10) 100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Target className="w-4 h-4 text-rose-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-300">
                Kesimpulan
              </span>
            </div>
            <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
              {renderMultiline(pembahasan.kesimpulan)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PembahasanCard;
